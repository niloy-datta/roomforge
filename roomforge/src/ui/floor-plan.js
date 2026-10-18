import { MATERIALS } from '../core/materials.js';
import { toFeet, formatNumber } from '../core/calculations.js';
const escapeText = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));

export function renderFloorPlan(svg, config, zoom = 1) {
  const w = toFeet(config.width, config.unit);
  const h = toFeet(config.length, config.unit);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0 || w > 500 || h > 500) {
    svg.innerHTML = '<text x="360" y="260" fill="#76877a" font-family="Arial,sans-serif" text-anchor="middle" font-size="16">Enter valid room dimensions to preview.</text>';
    return;
  }
  const mat = MATERIALS[config.material] || MATERIALS.vinyl;
  const scale = Math.min(540 / w, 310 / h) * zoom;
  const rw = w * scale;
  const rh = h * scale;
  const x = (720 - rw) / 2;
  const y = (510 - rh) / 2;
  const c = mat.color;
  const light = mat.light;
  const dark = mat.dark;
  const isTile = mat.type === 'tile';
  const straight = config.pattern === 'straight';
  const unit = config.unit;
  const left = `${formatNumber(config.length, 2)} ${unit}`;
  const top = `${formatNumber(config.width, 2)} ${unit}`;
  const pieces = isTile ? 44 : 24;
  const pattern = isTile
    ? `<pattern id="rf-pattern" width="${pieces}" height="${pieces}" patternUnits="userSpaceOnUse"><rect width="${pieces}" height="${pieces}" fill="${light}"/><path d="M0 0H${pieces} M0 0V${pieces}" fill="none" stroke="${dark}" stroke-opacity=".46" stroke-width="1.8"/><path d="M2 2L${pieces-2} ${pieces-2}" stroke="#fff" stroke-opacity=".07" stroke-width="1"/></pattern>`
    : `<pattern id="rf-pattern" width="${straight ? 92 : 132}" height="${pieces}" patternUnits="userSpaceOnUse"><rect width="132" height="${pieces}" fill="${c}"/><rect width="132" height="8" fill="${light}" opacity=".24"/><path d="M0 0 H132 M${straight ? 0 : 66} 0V24" fill="none" stroke="${dark}" stroke-width="1.15" stroke-opacity=".7"/><path d="M3 12H128" stroke="${light}" stroke-opacity=".19"/></pattern>`;
  const staggeredPlanks = !isTile && !straight ? `<pattern id="rf-stagger" width="132" height="48" patternUnits="userSpaceOnUse"><rect width="132" height="48" fill="${c}"/><rect y="0" width="132" height="9" fill="${light}" opacity=".20"/><rect y="24" width="132" height="9" fill="${light}" opacity=".17"/><path d="M0 0H132 M0 24H132 M66 0V24 M0 24V48 M132 24V48" stroke="${dark}" stroke-width="1.3" stroke-opacity=".55" fill="none"/></pattern>` : '';
  const patternId = !isTile && !straight ? 'rf-stagger' : 'rf-pattern';
  const room = `<g filter="url(#rf-shadow)"><rect x="${x-8}" y="${y-8}" width="${rw+16}" height="${rh+16}" rx="1" fill="#8d968a" stroke="#cad1c5" stroke-width="2"/><rect x="${x}" y="${y}" width="${rw}" height="${rh}" fill="url(#${patternId})"/><rect x="${x}" y="${y}" width="${rw}" height="${rh}" fill="none" stroke="#718675" stroke-opacity=".50" stroke-width="1"/><path d="M${x+rw*.27} ${y-10}h${Math.min(75,rw*.35)}" stroke="#eaf7f8" stroke-width="13"/><path d="M${x+rw*.27} ${y-10}h${Math.min(75,rw*.35)}" stroke="#9eafa9" stroke-width="1.2"/></g>`;
  const measTop = y-39;
  const measLeft = x-41;
  const dim = `<g fill="none" stroke="#9aaa9e" stroke-width="1"><path d="M${x} ${measTop-8}v17 M${x+rw} ${measTop-8}v17 M${x} ${measTop}H${x+rw}"/><path d="M${measLeft-8} ${y}h17 M${measLeft-8} ${y+rh}h17 M${measLeft} ${y}V${y+rh}"/></g><g fill="#5d7563" font-size="13" font-family="Arial,sans-serif" font-weight="700"><text x="${x+rw/2}" y="${measTop-10}" text-anchor="middle">${escapeText(top)}</text><text x="${measLeft-10}" y="${y+rh/2}" text-anchor="middle" transform="rotate(-90 ${measLeft-10} ${y+rh/2})">${escapeText(left)}</text></g>`;
  svg.innerHTML = `<defs><filter id="rf-shadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="12" dy="15" stdDeviation="11" flood-color="#556354" flood-opacity=".20"/></filter>${pattern}${staggeredPlanks}</defs>${room}${dim}<text x="360" y="500" text-anchor="middle" font-size="10" font-family="Arial,sans-serif" fill="#8da08c" letter-spacing="1.5">SCALED TOP-DOWN VISUALIZATION</text>`;
}
