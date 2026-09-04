/** 21 canonical Buyer_Copy strings, copied verbatim from class-buyer-copy.php. */

export const OTP_SEND_FAILED = "We couldn’t send the code. Check your connection and tap Send code again.";
export const OTP_SEND_AMBIGUOUS = "We couldn’t confirm the email was sent. Wait a moment and tap Resend.";
export const OTP_SEND_REJECTED = "We couldn’t send to that address. Check the email and try again.";
export const OTP_RESEND_COOLDOWN = "Wait a minute before requesting another code.";
export const OTP_SEND_RATE_LIMITED = "Too many codes sent to this email this hour. Try again later.";
export const OTP_CODE_MISMATCH = "That code doesn’t match. Check the 6 digits and try again.";
export const OTP_ATTEMPTS_EXHAUSTED = "Too many incorrect tries. Wait for a new code, or tap Resend after it expires.";
export const OTP_CODE_EXPIRED = "That code expired. Tap Resend for a new one.";
export const OTP_VERIFY_RACE = "The code is right but confirmation is still catching up — wait 10 seconds and try again.";
export const CART_STALE_JS = "Your cart total changed. Review your order and try payment again.";
export const CART_STALE_PAY = "Your cart changed before payment. Review the total and try again.";
export const CHECKOUT_CLAIM_BUSY = "Another payment is already starting. Wait a few seconds and try again.";
export const CREATE_ATTEMPT_FAILED = "We couldn’t start payment. Wait a moment and try again.";
export const WALLET_CANCEL = "Payment cancelled. Nothing was charged.";
export const PE_INCOMPLETE = "Payment details are incomplete. Check the card and try again.";
export const CARD_DECLINED = "The card was declined. Try another card or pay a different way.";
export const CONFIRM_PENDING = "Payment is still confirming. Don’t submit again — wait or refresh.";
export const POLL_UNAVAILABLE = "We can’t confirm payment status yet. Refresh this page. Don’t pay twice.";
export const INVALID_NONCE = "This checkout page expired. Refresh and try again.";
export const TERMS_UNAVAILABLE = "Checkout terms are unavailable. This order cannot be placed.";
export const THREEDS_PENDING = "Your bank needs a quick extra check. Finish that prompt — don’t close the tab.";

export const BuyerCopy = {
  OTP_SEND_FAILED,
  OTP_SEND_AMBIGUOUS,
  OTP_SEND_REJECTED,
  OTP_RESEND_COOLDOWN,
  OTP_SEND_RATE_LIMITED,
  OTP_CODE_MISMATCH,
  OTP_ATTEMPTS_EXHAUSTED,
  OTP_CODE_EXPIRED,
  OTP_VERIFY_RACE,
  CART_STALE_JS,
  CART_STALE_PAY,
  CHECKOUT_CLAIM_BUSY,
  CREATE_ATTEMPT_FAILED,
  WALLET_CANCEL,
  PE_INCOMPLETE,
  CARD_DECLINED,
  CONFIRM_PENDING,
  POLL_UNAVAILABLE,
  INVALID_NONCE,
  TERMS_UNAVAILABLE,
  THREEDS_PENDING,
} as const;

