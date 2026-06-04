/**
 * DPRES Centralized Branding Configuration
 * Single source of truth for all brand assets and colors.
 * Import from here — never hardcode paths or brand colors elsewhere.
 */

export const BRAND = {
  name: 'DPRES',
  tagline: 'Campus Safety',
  fullName: 'DPRES — Disaster Preparedness System',
  description: 'Disaster Preparedness & Response Education System for campuses.',

  logo: {
    png: '/logo.png',
    favicon: '/favicon.svg',
    alt: 'DPRES logo — red hexagon with white medical cross',
  },

  colors: {
    // Extracted from the hexagon logo
    primary:       '#EF1B31',   // bright red (hex top-left)
    primaryDark:   '#B0003A',   // deep crimson (hex bottom-right)
    primaryMid:    '#D4002E',   // midpoint gradient

    // Supporting palette
    surface:       '#FFFFFF',
    background:    '#F8FAFC',
    textPrimary:   '#0F172A',
    textSecondary: '#64748B',
    border:        '#E2E8F0',

    // Semantic
    success:  '#10B981',
    warning:  '#F59E0B',
    info:     '#2563EB',
    danger:   '#EF4444',
  },

  gradient: {
    brand:   'linear-gradient(135deg, #EF1B31 0%, #B0003A 100%)',
    button:  'linear-gradient(135deg, #EF1B31, #C8002F)',
    subtle:  'linear-gradient(135deg, rgba(239,27,49,0.08), rgba(176,0,58,0.05))',
  },

  shadow: {
    brand: '0 4px 14px rgba(239,27,49,0.35)',
    card:  '0 4px 24px rgba(0,0,0,0.06)',
  },
};

export default BRAND;
