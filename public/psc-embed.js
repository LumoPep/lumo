/*!
 * PRISM Simple Checkout — embed wiring
 *
 * Vanilla JS, no dependencies. Wires the frozen `panel.html` markup (element ids/classes are
 * FROZEN — see panel.html's own header comment and CONTRACT.md) to the versioned `/embed/v1/`
 * service contract documented in CONTRACT.md.
 *
 * Scope: renders the cart into the order-table skeleton, applies the human-chosen light|dark
 * theme, and wires send-code / verify-code / pay — plus, since the 1.0.9.1 remake, touch-device
 * (device memory) — to the contract, porting the in-flight-latch + error/success banner UX
 * states from the plugin's
 * `assets/js/classic-checkout.js` (WooCommerce-specific code left behind; the state-class
 * mechanics are what's ported). `GET /embed/v1/status` and `cfg.onPaid(orderRef)` are part of
 * the frozen cfg/contract shape this file accepts, but are NOT invoked here — completing a
 * payment requires Stripe.js to confirm the PaymentIntent behind `stripe_client_secret`, which
 * is a separate integration step (per-site write-in / a later task), not "wiring." Calling
 * onPaid before a real confirmation would be dishonest, so this layer stops at validating and
 * handing back the complete browser-safe payment surface via the instance returned from init().
 *
 * State-class note: `psc-gate-complete` (added to `#psc-checkout` on verify-code success) is
 * embed-specific — it is NOT ported from the plugin, which has no such class. On a WooCommerce
 * checkout the plugin's `classic-checkout.js` instead toggles `psc-wallet-ready` /
 * `psc-gate-incomplete` on `form.checkout` (state machinery this vanilla embed has no `<form>` to
 * attach to). `psc-step-banner--done` (added to `#psc-step-banner`) IS ported unchanged — the
 * plugin's `classic-checkout.js` adds the same class to the same id — but it currently has no CSS
 * rule in either the plugin or this embed, so it carries no visual treatment yet; styling it is
 * host-integration scope, not a defect in this file.
 *
 * The shipped embed-v1 layout/copy/2FA flow/attestation are FROZEN: this file only adds/removes
 * state classes, toggles `disabled`/`hidden` attributes, and fills the designated cart-row/amount
 * slots. It never writes panel copy or restructures the DOM.
 *
 * Device memory (1.0.9.1 parity, additive): `/embed/v1/` now carries device grants, so the
 * panel's remember-device block is real. verify-code sends `remember_device` (the checkbox state
 * at click time) and, when present, `prior_device_grant`; a returned `device_grant` is stored in
 * localStorage under `psc:dg:<pcid>` (grant + expiry only — NEVER the email, mirroring the
 * plugin's no-PII-in-HTML ruling). On init, a stored grant is offered to
 * POST /embed/v1/touch-device: success adds the `psc-device-remembered` state class (CSS hides
 * the OTP chrome, shows #psc-remember-note), prefills the editable email, and unlocks pay via
 * `device_grant` instead of a fresh `verify_token`; ANY failure silently falls back to the
 * first-time OTP gate (port of classic-checkout.js `hydrateRememberedDevice`, 1.0.9.1 @ 5c76546).
 * The purchase ATTESTATION is completely untouched by all of this — it stays unchecked,
 * per-order, and required before pay on both the fresh and the remembered path.
 */
(function (window, document) {
  'use strict';

  function assert(condition, message) {
    if (!condition) throw new Error('PscEmbed: ' + message);
  }

  /** The checkout-terms document version the buyer attests to on `pay` (CONTRACT.md's
   * `attestation.terms_version`). Matches `panel.html`'s embedded terms copy
   * (`document_version:` / `CHECKOUT_TERMS_VERSION` frontmatter in `#psc-attestation`) and the
   * plugin's `PSC_TERMS_VERSION` constant (`prism-simple-checkout.php`) — unchanged through
   * 1.0.9.1 (grok/psc-1.0.9 @ 5c76546), verified: the terms document is still `2026.08.03-1`.
   * panel.html carries no `data-psc-terms-version` attribute to read this from at runtime, so it
   * is a literal constant here — bump only in lockstep with a new checkout-terms document version
   * shipped in panel.html. */
  var TERMS_VERSION = '2026.08.03-1';

  /* ---------- Device memory: localStorage grant custody (1.0.9.1 parity) ----------
   * Key `psc:dg:<pcid>`, value JSON {"v":1,"grant":"dg_…","expires_at":"<iso>"}. The grant is a
   * bearer credential for skipping one email OTP on this origin — see CONTRACT.md's threat-model
   * paragraph. NO email is ever stored (the server echoes it back from touch-device; mirrors the
   * plugin's no-PII-in-HTML ruling). Every storage access is try/catch-wrapped: localStorage can
   * throw in private modes / blocked-storage contexts, and a storage failure must degrade to the
   * plain first-time OTP gate, never to a script error. */

  function grantKey(pcid) {
    return 'psc:dg:' + pcid;
  }

  /** Returns { grant, expiresAt } or null. Expiry is checked on read; any parse/shape failure is
   * treated as absent AND cleared so a corrupt record cannot wedge future visits. */
  function readGrant(pcid) {
    var raw = null;
    try {
      raw = window.localStorage.getItem(grantKey(pcid));
    } catch (e) {
      return null;
    }
    if (!raw) return null;
    var parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      parsed = null;
    }
    var valid = !!parsed &&
      parsed.v === 1 &&
      typeof parsed.grant === 'string' && parsed.grant.indexOf('dg_') === 0 &&
      typeof parsed.expires_at === 'string';
    if (valid) {
      var expiresMs = Date.parse(parsed.expires_at);
      if (!isFinite(expiresMs) || expiresMs <= Date.now()) valid = false;
    }
    if (!valid) {
      clearGrant(pcid);
      return null;
    }
    return { grant: parsed.grant, expiresAt: parsed.expires_at };
  }

  function writeGrant(pcid, grant, expiresAt) {
    try {
      window.localStorage.setItem(grantKey(pcid), JSON.stringify({ v: 1, grant: grant, expires_at: expiresAt }));
    } catch (e) {
      // Storage unavailable (private mode / quota): the device simply isn't remembered.
    }
  }

  function clearGrant(pcid) {
    try {
      window.localStorage.removeItem(grantKey(pcid));
    } catch (e) {
      // Nothing to do — an unreadable store also reads as "no grant".
    }
  }

  /** cfg.theme has NO auto mode — light|dark only, everything else throws. */
  function applyTheme(root, theme) {
    assert(theme === 'light' || theme === 'dark', 'cfg.theme must be "light" or "dark" (got ' + JSON.stringify(theme) + ').');
    root.classList.remove('psc-checkout--theme-light', 'psc-checkout--theme-dark');
    root.classList.add('psc-checkout--theme-' + theme);
  }

  function formatAmount(cents, currency) {
    var value = (Number(cents) || 0) / 100;
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: String(currency || 'usd').toUpperCase() }).format(value);
    } catch (e) {
      return '$' + value.toFixed(2);
    }
  }

  /** Fills the frozen order-table skeleton (`[data-psc-cart-rows]` + amount slots) from cfg.cart.
   * `amount_cents` is treated as the line's already-extended total (matches the "Subtotal" column
   * header in panel.html), not a per-unit price — qty is display-only. */
  function renderCart(root, cart) {
    var tbody = root.querySelector('[data-psc-cart-rows]');
    var subtotalEl = root.querySelector('[data-psc-subtotal]');
    var totalEl = root.querySelector('[data-psc-total]');
    var items = Array.isArray(cart.items) ? cart.items : [];
    var currency = cart.currency || 'usd';
    if (tbody) {
      while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
      items.forEach(function (item) {
        var lineCents = Number(item.amount_cents) || 0;
        var tr = document.createElement('tr');
        tr.className = 'cart_item';
        var nameCell = document.createElement('td');
        nameCell.className = 'product-name';
        nameCell.appendChild(document.createTextNode(String(item.name || '')));
        var qtyEl = document.createElement('strong');
        qtyEl.className = 'product-quantity';
        qtyEl.textContent = ' × ' + (Number(item.qty) || 1);
        nameCell.appendChild(qtyEl);
        var totalCell = document.createElement('td');
        totalCell.className = 'product-total';
        var amountSpan = document.createElement('span');
        amountSpan.className = 'woocommerce-Price-amount amount';
        amountSpan.textContent = formatAmount(lineCents, currency);
        totalCell.appendChild(amountSpan);
        tr.appendChild(nameCell);
        tr.appendChild(totalCell);
        tbody.appendChild(tr);
      });
    }
    if (subtotalEl) {
      var subtotalCents = items.reduce(function (sum, item) { return sum + (Number(item.amount_cents) || 0); }, 0);
      subtotalEl.textContent = formatAmount(subtotalCents, currency);
    }
    if (totalEl) totalEl.textContent = formatAmount(cart.total_cents, currency);
  }

  /** Ported from classic-checkout.js `setOtpStatus` — the OTP-lifecycle status line next to
   * "Send code" (success/error/info banner classes + aria-live text + hidden toggling). */
  function setOtpStatus(text, kind) {
    var el = document.getElementById('psc-otp-status');
    if (!el) return;
    el.classList.remove('psc-otp-status--success', 'psc-otp-status--error', 'psc-otp-status--info');
    if (!text) {
      el.textContent = '';
      el.hidden = true;
      return;
    }
    el.classList.add('psc-otp-status--' + (kind || 'info'));
    el.textContent = text;
    el.hidden = false;
  }

  /** Ported from classic-checkout.js `message()` — the two `role="alert"` banners
   * (#psc-payment-message / #psc-payment-message-footer), success class + hidden toggling. */
  function setMessage(text, kind) {
    ['psc-payment-message', 'psc-payment-message-footer'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('psc-payment-message--success');
      if (kind === 'success') el.classList.add('psc-payment-message--success');
      el.textContent = text || '';
      el.hidden = !text;
    });
  }

  /** POST {serviceBase}{path}; parses `{error:{code,message}}` on non-2xx per CONTRACT.md. */
  function postJson(cfg, path, body) {
    var base = String(cfg.serviceBase || '').replace(/\/+$/, '');
    return window.fetch(base + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.text().then(function (text) {
        var data = {};
        if (text) {
          try { data = JSON.parse(text); } catch (e) { data = {}; }
        }
        if (!res.ok) {
          var err = (data && data.error) || {};
          var thrown = new Error(err.message || ('Request failed (' + res.status + ').'));
          thrown.code = err.code;
          throw thrown;
        }
        return data;
      });
    });
  }

  /** Validate the complete browser-safe surface returned by POST /pay before retaining any
   * part of it. The cross-field client-secret/order-ref check prevents a mixed response from
   * mounting Stripe.js against one PaymentIntent while polling another. */
  function paymentSurfaceFromResponse(data) {
    var clientSecret = data && data.stripe_client_secret;
    var publishableKey = data && data.publishable_key;
    var stripeAccount = data && data.stripe_account;
    var orderRef = data && data.order_ref;
    var cleanString = function (value) {
      return typeof value === 'string' && value.length > 0 && value === value.trim();
    };
    var valid = cleanString(clientSecret) &&
      cleanString(publishableKey) &&
      cleanString(stripeAccount) &&
      cleanString(orderRef) &&
      orderRef.indexOf('pi_') === 0 &&
      clientSecret.indexOf(orderRef + '_secret_') === 0 &&
      (publishableKey.indexOf('pk_test_') === 0 || publishableKey.indexOf('pk_live_') === 0) &&
      stripeAccount.indexOf('acct_') === 0;
    if (!valid) throw new Error('Could not start payment.');
    return {
      clientSecret: clientSecret,
      publishableKey: publishableKey,
      stripeAccount: stripeAccount,
      orderRef: orderRef
    };
  }

  /** Public callers receive a fresh object so they cannot mutate the retained money surface. */
  function copyPaymentSurface(surface) {
    if (!surface) return null;
    return {
      clientSecret: surface.clientSecret,
      publishableKey: surface.publishableKey,
      stripeAccount: surface.stripeAccount,
      orderRef: surface.orderRef
    };
  }

  /** Pay stays disabled until BOTH an email credential exists — a fresh `verify_token` OR a
   * hydrated `device_grant` (1.0.9.1 device memory) — AND the attestation is checked. The
   * attestation half is untouched: no grant ever substitutes for it. */
  function updatePayGate(state) {
    var payBtn = document.getElementById('psc-card-toggle');
    if (payBtn) payBtn.disabled = !((state.verifyToken || state.deviceGrant) && state.attested);
  }

  function bindSendCode(cfg, state) {
    var btn = document.getElementById('psc-send-code');
    var emailInput = document.getElementById('psc-gate-email');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (btn.disabled) return; // in-flight latch
      var email = String((emailInput && emailInput.value) || '').trim();
      if (!email) {
        setOtpStatus('Enter your research email first.', 'error');
        return;
      }
      state.email = email;
      btn.disabled = true;
      setOtpStatus('Sending verification code…', 'info');
      var release = function () { btn.disabled = false; };
      postJson(cfg, '/embed/v1/send-code', { pcid: cfg.pcid, email: email })
        .then(function () {
          setMessage('Email sent successfully — check your inbox for the 6-digit code.', 'success');
          setOtpStatus('Email sent successfully. Enter the code below.', 'success');
        })
        .catch(function (err) {
          // A 422 `otp_send_rejected` (hard-rejected address, 1.0.9.1) arrives here like any
          // other contract error: postJson has already lifted the server's Buyer_Copy message
          // into err.message, so it is surfaced VERBATIM in #psc-otp-status — never swallowed,
          // never replaced by the generic fallback (which fires only when no message parsed).
          setMessage(err.message || 'Could not send code.', 'error');
          setOtpStatus(err.message || 'Could not send code.', 'error');
        })
        .then(release, release);
    });
  }

  function bindVerifyCode(cfg, state, root) {
    var btn = document.getElementById('psc-verify-code');
    var codeInput = document.getElementById('psc-code');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (btn.disabled) return; // in-flight latch
      var code = String((codeInput && codeInput.value) || '').trim();
      if (!code) {
        setOtpStatus('Enter the 6-digit code from your email.', 'error');
        return;
      }
      btn.disabled = true;
      var release = function () { btn.disabled = false; };
      // Device memory (1.0.9.1 parity): the remember checkbox is read at CLICK time — same as
      // the plugin's `$('#psc-remember-device').is(':checked')` in classic-checkout.js — and a
      // still-stored prior grant rides along so the service can roll it instead of minting a
      // parallel one (re-verify revokes/replaces; see CONTRACT.md).
      var rememberBox = document.getElementById('psc-remember-device');
      var verifyBody = {
        pcid: cfg.pcid,
        email: state.email,
        code: code,
        remember_device: !!(rememberBox && rememberBox.checked)
      };
      var priorGrant = readGrant(cfg.pcid);
      if (priorGrant) verifyBody.prior_device_grant = priorGrant.grant;
      postJson(cfg, '/embed/v1/verify-code', verifyBody)
        .then(function (data) {
          state.verifyToken = data && data.verify_token;
          assert(state.verifyToken, 'verify-code returned 200 without a verify_token.');
          if (data && typeof data.device_grant === 'string' && data.device_grant &&
              typeof data.device_grant_expires_at === 'string' && data.device_grant_expires_at) {
            writeGrant(cfg.pcid, data.device_grant, data.device_grant_expires_at);
          }
          root.classList.add('psc-gate-complete');
          var banner = document.getElementById('psc-step-banner');
          if (banner) banner.classList.add('psc-step-banner--done');
          if (codeInput) codeInput.value = '';
          // Reveal the attestation-still-required note on verify success — port of the plugin's
          // `$('#psc-remember-note').prop('hidden', false)` (classic-checkout.js:966).
          var note = document.getElementById('psc-remember-note');
          if (note) note.hidden = false;
          setMessage('Billing email verified. Accept research terms, then pay.', 'success');
          setOtpStatus('Email verified. Accept the research terms below, then you can pay.', 'success');
          updatePayGate(state);
        })
        .catch(function (err) {
          setMessage(err.message || 'Verification failed.', 'error');
          setOtpStatus(err.message || 'Verification failed.', 'error');
        })
        .then(release, release);
    });
  }

  function bindAttestation(state) {
    var box = document.getElementById('psc-attest-checkbox');
    if (!box) return;
    box.addEventListener('change', function () {
      state.attested = !!box.checked;
      updatePayGate(state);
    });
  }

  /** The only literal "pay" affordance in the frozen panel is #psc-card-toggle ("Pay with
   * card") — Stripe.js itself (out of scope here) paints the Express Checkout / Payment Element
   * buttons at runtime. Clicking it while enabled reveals the card stage and calls
   * POST /embed/v1/pay exactly once per completed gate (re-toggling open/closed afterward must
   * not re-fire the request and risk a duplicate payment intent server-side). A 200 response is
   * usable only when all four payment-surface fields validate together. */
  function bindPay(cfg, state, root) {
    var btn = document.getElementById('psc-card-toggle');
    var stage = document.getElementById('psc-card-stage');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (btn.disabled) return;
      if (!((state.verifyToken || state.deviceGrant) && state.attested)) {
        setMessage('Verify your email and accept the research terms before paying.', 'error');
        return;
      }
      var opening = !!(stage && stage.hidden);
      if (stage) stage.hidden = !stage.hidden;
      if (!opening || state.paymentSurface || state.payInFlight) return;
      state.payInFlight = true;
      btn.disabled = true;
      var payBody = {
        pcid: cfg.pcid,
        cart: cfg.cart,
        contact: { email: state.email },
        // state.attested is true here — bindPay's guard above already blocked the click
        // otherwise — but read from state rather than hardcoded so this stays honest if that
        // guard is ever loosened.
        attestation: { attested: state.attested, terms_version: TERMS_VERSION, attested_at: new Date().toISOString() }
      };
      // Exactly one email credential per CONTRACT.md: a fresh verify_token from THIS page-load
      // always wins; the device_grant path is only used when no fresh token exists (the
      // hydrated remembered-device flow). Never both.
      if (state.verifyToken) {
        payBody.verify_token = state.verifyToken;
      } else {
        payBody.device_grant = state.deviceGrant;
      }
      postJson(cfg, '/embed/v1/pay', payBody)
        .then(function (data) {
          state.paymentSurface = paymentSurfaceFromResponse(data);
        })
        .catch(function (err) {
          if (err && err.code === 'device_grant_invalid') {
            // The stored grant was revoked/expired server-side: forget it, drop the remembered
            // state (CSS restores the full OTP chrome), and tell the buyer honestly what to do.
            clearGrant(cfg.pcid);
            state.deviceGrant = null;
            if (root) root.classList.remove('psc-device-remembered');
            updatePayGate(state);
            setMessage(err.message || 'This device is no longer remembered here. Verify your email to continue.', 'error');
            setOtpStatus(err.message || 'This device is no longer remembered here. Verify your email to continue.', 'error');
          } else {
            setMessage(err.message || 'Could not start payment.', 'error');
          }
          if (stage) stage.hidden = true; // fold back up so the user can retry the toggle
        })
        .then(function () {
          state.payInFlight = false;
          updatePayGate(state); // re-derive disabled from gate completeness, not the latch
        }, function () {
          state.payInFlight = false;
          updatePayGate(state);
        });
    });
  }

  /** Port of classic-checkout.js `hydrateRememberedDevice()` (1.0.9.1 @ 5c76546): offer the
   * stored device grant to the rail once per page-load. Success skips the OTP chrome (the
   * `psc-device-remembered` state class — CSS does the hiding), prefills the email input only
   * when it is empty (and NEVER readonly — WP parity: the buyer may edit it, which un-remembers
   * this page-load via bindRememberedEmailEdit), refreshes the stored expiry from the response's
   * rolling TTL, and unlocks pay through `state.deviceGrant`. ANY error — 401
   * `device_grant_invalid`, network, anything — clears the grant and changes NO UI: silent
   * fallback to the first-time gate, mirroring the plugin's empty `.catch`. */
  function hydrateRememberedDevice(cfg, state, root) {
    var stored = readGrant(cfg.pcid);
    if (!stored) return;
    postJson(cfg, '/embed/v1/touch-device', { pcid: cfg.pcid, device_grant: stored.grant })
      .then(function (data) {
        if (!data || !data.remembered || typeof data.email !== 'string' || !data.email) {
          // Defensive: a 200 without a usable remembered surface is treated as "not
          // remembered" with no UI change (same shape-guard as the plugin's hydrate).
          return;
        }
        state.deviceGrant = stored.grant;
        state.rememberedEmail = data.email;
        state.email = data.email;
        var emailInput = document.getElementById('psc-gate-email');
        if (emailInput && !String(emailInput.value || '').trim()) emailInput.value = data.email;
        root.classList.add('psc-device-remembered');
        if (typeof data.device_grant_expires_at === 'string' && data.device_grant_expires_at) {
          writeGrant(cfg.pcid, stored.grant, data.device_grant_expires_at);
        }
        updatePayGate(state);
      })
      .catch(function () {
        clearGrant(cfg.pcid);
      });
  }

  /** Port of the plugin's `#psc-gate-email` `input.pscHydrate` handler: while remembered, an
   * email edit that stops matching the remembered email drops the remembered state for THIS
   * page-load — class removed (CSS restores the OTP chrome), `state.deviceGrant` nulled, pay
   * gate re-derived. The localStorage grant is deliberately KEPT: it is still valid for the next
   * visit; only the current page-load's shortcut is surrendered. One-way per page-load, like the
   * plugin's handler. */
  function bindRememberedEmailEdit(state, root) {
    var emailInput = document.getElementById('psc-gate-email');
    if (!emailInput) return;
    emailInput.addEventListener('input', function () {
      if (!state.deviceGrant) return;
      if (String(emailInput.value || '').trim() === state.rememberedEmail) return;
      root.classList.remove('psc-device-remembered');
      state.deviceGrant = null;
      updatePayGate(state);
    });
  }

  function init(cfg) {
    cfg = cfg || {};
    assert(typeof cfg.pcid === 'string' && cfg.pcid, 'cfg.pcid is required.');
    assert(typeof cfg.serviceBase === 'string' && cfg.serviceBase, 'cfg.serviceBase is required.');
    assert(cfg.cart && Array.isArray(cfg.cart.items), 'cfg.cart.items must be an array.');
    assert(Number.isInteger(cfg.cart && cfg.cart.total_cents), 'cfg.cart.total_cents must be an integer (minor units).');
    assert(typeof (cfg.cart && cfg.cart.currency) === 'string' && cfg.cart.currency, 'cfg.cart.currency must be a non-empty string.');
    var root = document.getElementById('psc-checkout');
    assert(root, '#psc-checkout not found in the page.');

    applyTheme(root, cfg.theme);
    renderCart(root, cfg.cart);

    var state = { verifyToken: null, attested: false, email: '', paymentSurface: null, payInFlight: false, deviceGrant: null, rememberedEmail: '' };
    updatePayGate(state);

    bindSendCode(cfg, state);
    bindVerifyCode(cfg, state, root);
    bindAttestation(state);
    bindPay(cfg, state, root);
    bindRememberedEmailEdit(state, root);
    hydrateRememberedDevice(cfg, state, root);

    return {
      isGateComplete: function () { return !!((state.verifyToken || state.deviceGrant) && state.attested); },
      getClientSecret: function () {
        return state.paymentSurface ? state.paymentSurface.clientSecret : null;
      },
      getPaymentSurface: function () { return copyPaymentSurface(state.paymentSurface); }
    };
  }

  /**
   * 1.0.9.2 wallet-sheet helper — embed analog of plugin markWalletHandoff.
   *
   * Stripe ECE (docs.stripe.com/elements/express-checkout-element/accept-a-payment
   * ?payment-ui=elements): Elements `amount` IS the Apple Pay / Google Pay sheet
   * total. shippingRates are options; Stripe does not add the selected rate.
   * shippingratechange must update that amount then resolve. cancel resets it.
   * Mid-sheet address is privacy-redacted; full address arrives on confirm.
   *
   * Host glue must: latch first on shipping events; never remint /embed/v1/pay
   * or mutate cfg.cart while isActive(); persist wallet address into the HOST
   * cart on confirm before confirmPayment; always handleCancel.
   */
  function createWalletHandoff(opts) {
    opts = opts || {};
    var active = false;
    var updateSheet = typeof opts.updateSheetAmount === 'function' ? opts.updateSheetAmount : function () {};

    var api = {};

    function markActive() {
      active = true;
    }

    function isActive() {
      return !!active;
    }

    function allowHostCartWrite() {
      return !active;
    }

    function handleShippingAddressChange(event, payload) {
      payload = payload || {};
      api.markActive();
      var full = Number(payload.fullAmount);
      if (full > 0) {
        try { updateSheet(full); } catch (e) { /* mid-unmount */ }
      }
      if (event && event.resolve) {
        event.resolve({ shippingRates: payload.shippingRates || [] });
      }
    }

    function handleShippingRateChange(event, payload) {
      payload = payload || {};
      api.markActive();
      var full = Number(payload.fullAmount);
      var base = payload.baseAmount;
      var rate = payload.rateAmount;
      if (base != null && rate != null && full !== Number(base) + Number(rate)) {
        if (event && event.reject) event.reject();
        return;
      }
      if (!(full > 0)) {
        if (event && event.reject) event.reject();
        return;
      }
      try { updateSheet(full); } catch (e2) { /* mid-unmount */ }
      if (event && event.resolve) event.resolve(payload.resolvePayload || {});
    }

    function handleCancel(payload) {
      payload = payload || {};
      var restore = payload.restoreAmount;
      if (restore != null && Number(restore) > 0) {
        try { updateSheet(Number(restore)); } catch (e3) { /* ignore — latch still drops */ }
      }
      active = false;
    }

    api.markActive = markActive;
    api.isActive = isActive;
    api.allowHostCartWrite = allowHostCartWrite;
    api.handleShippingAddressChange = handleShippingAddressChange;
    api.handleShippingRateChange = handleShippingRateChange;
    api.handleCancel = handleCancel;
    return api;
  }

  function assertNoPaymentMethodTypes(options) {
    options = options || {};
    if (Object.prototype.hasOwnProperty.call(options, 'payment_method_types') ||
        Object.prototype.hasOwnProperty.call(options, 'paymentMethodTypes')) {
      throw new Error('PscEmbed: never set payment_method_types / paymentMethodTypes — Stripe decides eligibility.');
    }
  }

  window.PscEmbed = {
    init: init,
    createWalletHandoff: createWalletHandoff,
    assertNoPaymentMethodTypes: assertNoPaymentMethodTypes
  };
})(window, document);
