"use client";

import { Turnstile } from "@marsidev/react-turnstile";

export function Captcha({ onVerify, showError }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    if (onVerify) onVerify("dev-bypass");
    return null;
  }

  return (
    <div className="space-y-1.5">
      <div className="flex justify-center">
        <Turnstile
          siteKey={siteKey}
          onSuccess={onVerify}
          options={{ theme: "auto" }}
        />
      </div>
      {showError && (
        <p className="text-xs text-destructive text-center">
          Please complete the CAPTCHA before continuing.
        </p>
      )}
    </div>
  );
}
