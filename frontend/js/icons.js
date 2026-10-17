/* Small SVG icons used by the prices table, nav arrows and the theme button. */

function ico(inner){return '<svg class="pic" width="48" height="48" viewBox="0 0 48 48" role="img" aria-hidden="true"><rect width="48" height="48" rx="6" fill="#1b1912"/>'+inner+'</svg>';}
var ICONS = [
  ico('<rect x="10" y="8" width="28" height="32" fill="#d9d6c8"/><rect x="14" y="12" width="20" height="6" fill="#333"/><rect x="14" y="21" width="9" height="2" fill="#666"/><rect x="25" y="21" width="9" height="2" fill="#666"/><rect x="14" y="26" width="20" height="2" fill="#666"/><rect x="14" y="31" width="20" height="2" fill="#666"/>'),
  ico('<path d="M12 8h18l8 8v24H12z" fill="#f2f2ec"/><path d="M30 8v8h8z" fill="#c9c9c0"/><rect x="16" y="22" width="18" height="2" fill="#9aa"/><rect x="16" y="28" width="18" height="2" fill="#9aa"/><rect x="16" y="34" width="12" height="2" fill="#9aa"/>'),
  ico('<rect x="8" y="30" width="32" height="8" fill="#3d7ea6"/><rect x="11" y="21" width="28" height="9" fill="#c0504d"/><rect x="9" y="12" width="30" height="9" fill="#5cc46a"/><rect x="8" y="14" width="3" height="6" fill="#e9f3e9"/>'),
  ico('<rect x="8" y="14" width="32" height="26" fill="#b98b4f"/><rect x="21" y="14" width="6" height="26" fill="#d9b574"/><path d="M8 14l6-6h20l6 6z" fill="#a47a41"/>'),
  ico('<rect x="19" y="6" width="10" height="5" rx="1" fill="#e9f3e9"/><path d="M20 11h8l3 8v21a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3V19z" fill="#4aa3d8" opacity=".9"/><rect x="17" y="26" width="14" height="6" fill="#e9f3e9" opacity=".6"/>'),
  ico('<path d="M10 14h28l-4 26H14z" fill="#e0833a"/><rect x="8" y="11" width="32" height="5" rx="2" fill="#f0a05a"/><path d="M14 9q10-8 20 0" fill="none" stroke="#93a893" stroke-width="2"/>'),
  ico('<path d="M13 16h22l3 24H10z" fill="#e9f3e9" opacity=".75"/><path d="M17 16q0-9 4-9M31 16q0-9-4-9" fill="none" stroke="#e9f3e9" stroke-width="3"/>'),
  ico('<rect x="6" y="19" width="36" height="10" rx="2" fill="#8c6a52"/><circle cx="12" cy="24" r="2.5" fill="#3a2c22"/><circle cx="36" cy="24" r="2.5" fill="#3a2c22"/><rect x="6" y="15" width="36" height="3" fill="#a9795a"/>'),
  ico('<ellipse cx="22" cy="26" rx="14" ry="10" fill="#c8cfc8"/><ellipse cx="22" cy="22" rx="14" ry="7" fill="#e6ebe6"/><rect x="34" y="20" width="10" height="4" rx="2" fill="#c8cfc8"/>'),
  ico('<rect x="15" y="10" width="18" height="30" rx="3" fill="#cfd5cf"/><ellipse cx="24" cy="10" rx="9" ry="3" fill="#eef2ee"/><rect x="15" y="20" width="18" height="8" fill="#4aa3d8"/>'),
  ico('<rect x="6" y="19" width="36" height="10" rx="2" fill="#d4a63a"/><rect x="12" y="15" width="5" height="18" fill="#e8c35c"/><rect x="31" y="15" width="5" height="18" fill="#e8c35c"/>'),
  ico('<circle cx="24" cy="24" r="16" fill="none" stroke="#c9733a" stroke-width="4"/><circle cx="24" cy="24" r="9" fill="none" stroke="#e0905a" stroke-width="4"/><circle cx="24" cy="24" r="2.5" fill="#c9733a"/>'),
  ico('<rect x="20" y="6" width="8" height="8" rx="1" fill="#2f8f4e"/><path d="M20 14h8l4 8v18a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3V22z" fill="#2f8f4e" opacity=".9"/><rect x="18" y="28" width="12" height="6" fill="#e9f3e9" opacity=".55"/>'),
  ico('<rect x="15" y="6" width="18" height="36" rx="3" fill="#2a2f2a" stroke="#93a893" stroke-width="2"/><rect x="18" y="11" width="12" height="22" fill="#12301a"/><circle cx="24" cy="38" r="2" fill="#93a893"/>'),
  ico('<path d="M8 36q4-20 16-12t16-16" fill="none" stroke="#e9f3e9" stroke-width="3"/><rect x="5" y="34" width="8" height="6" rx="1" fill="#93a893"/><rect x="35" y="8" width="8" height="6" rx="1" fill="#93a893"/>'),
  ico('<rect x="9" y="12" width="30" height="20" rx="2" fill="#2a2f2a" stroke="#93a893" stroke-width="2"/><rect x="12" y="15" width="24" height="14" fill="#12301a"/><path d="M5 36h38l-3 4H8z" fill="#93a893"/>'),
  ico('<rect x="7" y="9" width="34" height="30" rx="2" fill="#2f8f4e"/><path d="M12 16h10v8h12M12 32h8M26 32h10M24 16v-3" stroke="#e9f3e9" stroke-width="2" fill="none"/><circle cx="12" cy="16" r="2.5" fill="#f0c040"/><circle cx="34" cy="24" r="2.5" fill="#f0c040"/><rect x="26" y="26" width="8" height="5" fill="#2a2f2a"/>'),
  ico('<rect x="8" y="16" width="32" height="22" rx="2" fill="#4a5560"/><rect x="12" y="11" width="7" height="5" fill="#93a893"/><rect x="29" y="11" width="7" height="5" fill="#93a893"/><path d="M26 20l-5 8h5l-3 7" stroke="#f0c040" stroke-width="2.5" fill="none" stroke-linejoin="round"/>'),
  ico('<rect x="6" y="10" width="36" height="24" rx="2" fill="#2a2f2a" stroke="#93a893" stroke-width="2"/><rect x="9" y="13" width="30" height="18" fill="#1d4a6b"/><rect x="18" y="36" width="12" height="3" fill="#93a893"/><rect x="14" y="39" width="20" height="2" fill="#93a893"/>')
];

var CARET='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
var SUN='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><span class="tlabel"> Light</span>';
var MOON='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><span class="tlabel"> Dark</span>';
