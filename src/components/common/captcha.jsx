"use client";

import { Turnstile } from "@marsidev/react-turnstile";

export function Captcha({ onVerify }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    if (onVerify) onVerify("dev-bypass");
    return null;
  }

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onVerify}
      options={{ theme: "auto" }}
    />
  );
}
