"use client";

import { useState } from "react";
import ResearchDisclaimerBox from "@/components/ResearchDisclaimerBox";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    subject: "general",
    message: "",
    confirmResearch: false,
    confirmAge: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.confirmResearch || !formData.confirmAge) {
      alert("Please confirm both research use statements to proceed.");
      return;
    }

    // In production, this would send to an API endpoint
    console.log("Form submitted:", formData);
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        institution: "",
        subject: "general",
        message: "",
        confirmResearch: false,
        confirmAge: false,
      });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (submitted) {
    return (
      <div className="py-16 px-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg width="60" height="60" viewBox="0 0 60 60" className="mx-auto mb-6">
            <circle cx="30" cy="30" r="29" stroke="#B8624A" strokeWidth="2" fill="none" />
            <circle cx="30" cy="30" r="8" fill="#B8624A" />
          </svg>
          <h2 className="font-display text-3xl text-ink mb-4" style={{ fontWeight: 300 }}>
            Message Sent
          </h2>
          <p className="font-editorial text-ink opacity-60">
            Thank you for contacting Lumo. We'll respond within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-3">
            06.1 — CONTACT US
          </div>
          <h1 className="font-display text-5xl text-ink mb-4" style={{ fontWeight: 300 }}>
            Get in Touch
          </h1>
          <p className="font-editorial text-ink opacity-60">
            Reach our technical support team
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Email */}
            <div className="bg-cream hairline-border p-6">
              <div className="flex items-start space-x-4">
                <svg width="40" height="40" viewBox="0 0 40 40" className="flex-shrink-0">
                  <circle cx="20" cy="20" r="19" stroke="#B8624A" strokeWidth="2" fill="none" />
                  <circle cx="20" cy="20" r="6" fill="#B8624A" />
                </svg>
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-mono text-ink font-medium mb-2">
                    EMAIL
                  </h3>
                  <a
                    href="mailto:support@lumopep.com"
                    className="font-editorial text-sm text-clay hover:underline"
                  >
                    support@lumopep.com
                  </a>
                  <p className="font-mono text-xs text-ink opacity-55 mt-2">
                    Response within 24 hours
                  </p>
                </div>
              </div>
            </div>

            {/* Support Hours */}
            <div className="bg-cream hairline-border p-6">
              <div className="flex items-start space-x-4">
                <svg width="40" height="40" viewBox="0 0 40 40" className="flex-shrink-0">
                  <circle cx="20" cy="20" r="19" stroke="#B8624A" strokeWidth="2" fill="none" />
                  <line x1="10" y1="20" x2="30" y2="20" stroke="#B8624A" strokeWidth="2" />
                  <line x1="20" y1="10" x2="20" y2="30" stroke="#B8624A" strokeWidth="2" />
                </svg>
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-mono text-ink font-medium mb-2">
                    SUPPORT HOURS
                  </h3>
                  <p className="font-editorial text-sm text-ink opacity-80">
                    Monday - Friday
                    <br />
                    9:00 AM - 6:00 PM EST
                  </p>
                </div>
              </div>
            </div>

            {/* Institutional Inquiries */}
            <div className="bg-cream hairline-border p-6">
              <div className="flex items-start space-x-4">
                <svg width="40" height="40" viewBox="0 0 40 40" className="flex-shrink-0">
                  <circle cx="20" cy="20" r="19" stroke="#B8624A" strokeWidth="2" fill="none" />
                  <circle cx="20" cy="20" r="12" stroke="#B8624A" strokeWidth="2" fill="none" />
                  <circle cx="20" cy="20" r="6" fill="#B8624A" />
                </svg>
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-mono text-ink font-medium mb-2">
                    INSTITUTIONAL ACCOUNTS
                  </h3>
                  <p className="font-editorial text-sm text-ink opacity-80">
                    Bulk orders and custom synthesis inquiries welcome
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="pt-6">
              <ResearchDisclaimerBox />
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-cream hairline-border p-8"
            >
              <h2 className="font-display text-2xl text-ink mb-6" style={{ fontWeight: 300 }}>
                Send Us a Message
              </h2>

              {/* Name */}
              <div className="mb-6">
                <label className="block font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-2">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-bone hairline-border text-ink placeholder-ink placeholder-opacity-40 focus:outline-none focus:border-clay font-functional text-sm"
                  placeholder="Dr. Jane Smith"
                />
              </div>

              {/* Email */}
              <div className="mb-6">
                <label className="block font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-2">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-bone hairline-border text-ink placeholder-ink placeholder-opacity-40 focus:outline-none focus:border-clay font-functional text-sm"
                  placeholder="jane.smith@university.edu"
                />
              </div>

              {/* Institution */}
              <div className="mb-6">
                <label className="block font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-2">
                  INSTITUTION / ORGANIZATION *
                </label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-bone hairline-border text-ink placeholder-ink placeholder-opacity-40 focus:outline-none focus:border-clay font-functional text-sm"
                  placeholder="University Research Laboratory"
                />
              </div>

              {/* Subject */}
              <div className="mb-6">
                <label className="block font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-2">
                  SUBJECT *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-bone hairline-border text-ink focus:outline-none focus:border-clay font-mono text-xs uppercase tracking-mono"
                >
                  <option value="general">GENERAL INQUIRY</option>
                  <option value="product">PRODUCT INFORMATION</option>
                  <option value="technical">TECHNICAL SUPPORT</option>
                  <option value="order">ORDER STATUS</option>
                  <option value="bulk">BULK / INSTITUTIONAL PRICING</option>
                  <option value="custom">CUSTOM SYNTHESIS</option>
                  <option value="coa">CERTIFICATE OF ANALYSIS REQUEST</option>
                </select>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-2">
                  MESSAGE *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-bone hairline-border text-ink placeholder-ink placeholder-opacity-40 focus:outline-none focus:border-clay resize-none font-functional text-sm"
                  placeholder="Please provide details about your inquiry..."
                />
              </div>

              {/* RUO Confirmations */}
              <div className="mb-6 bg-bone hairline-border p-6 space-y-4">
                <p className="font-mono text-xs uppercase tracking-mono text-ink font-medium mb-3">
                  REQUIRED CONFIRMATIONS:
                </p>

                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="confirmResearch"
                    checked={formData.confirmResearch}
                    onChange={handleChange}
                    required
                    className="mt-1 w-5 h-5 border hairline-border bg-cream text-clay focus:ring-clay focus:ring-offset-0"
                  />
                  <span className="font-editorial text-sm text-ink opacity-80 leading-relaxed group-hover:opacity-100 transition-opacity">
                    I confirm that any products purchased will be used
                    exclusively for in vitro research and laboratory purposes,
                    and NOT for human consumption, clinical use, or veterinary
                    applications.
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="confirmAge"
                    checked={formData.confirmAge}
                    onChange={handleChange}
                    required
                    className="mt-1 w-5 h-5 border hairline-border bg-cream text-clay focus:ring-clay focus:ring-offset-0"
                  />
                  <span className="font-editorial text-sm text-ink opacity-80 leading-relaxed group-hover:opacity-100 transition-opacity">
                    I confirm that I am at least 21 years of age and affiliated
                    with a qualified research institution or laboratory.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-ink text-bone font-mono text-xs uppercase tracking-mono hover:bg-clay transition-colors"
              >
                SEND MESSAGE
              </button>

              <p className="font-mono text-xs text-ink opacity-55 text-center mt-4">
                By submitting this form, you agree to our research use policy and terms of service.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Corner Marks */}
      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">
        L-007
      </div>
    </div>
  );
}
