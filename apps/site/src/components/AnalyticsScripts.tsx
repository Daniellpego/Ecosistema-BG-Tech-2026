"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const CONSENT_KEY = "gradios-cookie-consent";

function hasAnalyticsConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

export function AnalyticsScripts({ gaId }: { gaId?: string }) {
  const [consentAccepted, setConsentAccepted] = useState(false);

  useEffect(() => {
    setConsentAccepted(hasAnalyticsConsent());

    const onStorage = () => setConsentAccepted(hasAnalyticsConsent());
    const onConsentChange = () => setConsentAccepted(hasAnalyticsConsent());
    window.addEventListener("storage", onStorage);
    window.addEventListener("gradios-cookie-consent-change", onConsentChange as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("gradios-cookie-consent-change", onConsentChange as EventListener);
    };
  }, []);

  if (!gaId || !consentAccepted) {
    return null;
  }

  return (
    <>
      <Script id="ga-loader" src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script
        id="ga-inline"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { anonymize_ip: true });
          `.trim(),
        }}
      />
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1826186485006703');
fbq('track', 'PageView');
          `.trim(),
        }}
      />
    </>
  );
}