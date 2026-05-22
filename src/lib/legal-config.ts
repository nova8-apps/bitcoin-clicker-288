// @nova8/auto-legal v1 — auto-generated legal config screen.
// This file is owned by Nova8 and gets re-rendered whenever the user
// saves the Privacy Info form in the dashboard. Edit the marker line
// above to "user-owned" to opt out of auto-sync.
// Generated at: 2026-05-22
// Source of truth: src/lib/legal-config.ts

// canonical source for in-app legal screens. Re-generated on every
// Privacy Info save so the in-app text always matches the hosted policy
// at https://nova8.dev/privacy/288.

export const LEGAL_CONFIG = {
  displayName: "Bitcoin Clicker",
  legalName: "e.g zzzz",
  contactEmail: "bentleypainter@icloud.com",
  website: "https://app.nova8.dev/privacy/288",
  country: "e.g united states",
  hostedPolicyUrl: "https://nova8.dev/privacy/288",
  // Apple's Standard EULA URL - explicitly endorsed by Apple as the
  // default Terms of Use for apps that don't ship their own EULA.
  // https://www.apple.com/legal/internet-services/itunes/dev/stdeula/
  appleStandardEulaUrl: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/",
} as const;

export type LegalConfig = typeof LEGAL_CONFIG;
