// Plain constants, deliberately NOT in a 'use client' module: a server component
// importing a value from a client module receives a client reference, not the value.

export const TIER_ORDER = [
  'Directly measurable', 'Proxy only', 'Verification contested', 'Counterfactual required',
];
export const MATURITY_ORDER = ['Working now', '2-5 years', 'Speculative'];
export const MATURITY_COLOR = {
  'Working now': 'var(--ord-1)',
  '2-5 years': 'var(--ord-2)',
  Speculative: 'var(--ord-3)',
};
// Four ordered steps of one hue, validated for light-end contrast against the cream
// and navy surfaces. The heat-* tokens stay reserved for the cross-tab, where the
// lightest step means "near zero" and is allowed to recede into the surface.
export const TIER_COLOR = {
  'Directly measurable': 'var(--tier-1)',
  'Proxy only': 'var(--tier-2)',
  'Verification contested': 'var(--tier-3)',
  'Counterfactual required': 'var(--tier-4)',
};
