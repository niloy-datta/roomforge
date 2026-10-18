import { calculateFlooring, convertLength, formatMoney, formatNumber } from '../core/calculations.js';
import { MATERIALS, DEFAULT_SETTINGS } from '../core/materials.js';
import { loadSettings, saveSettings, clearSettings, buildShareUrl } from '../core/state.js';
import { renderFloorPlan } from '../ui/floor-plan.js';

const $ = id => document.getElementById(id);
let settings = loadSettings();
let zoom = 1;
let currentResult;
let toastTimer;
const entryKeys=['width','length','waste','coverage','price','tax','pattern'];
const numericKeys=['width','length','waste','coverage','price','tax'];
const radioUnits=Array.from(document.querySelectorAll('[data-unit]'));
const materialButtons=Array.from(document.querySelectorAll('[data-material]'));

function notify(message) {
  const el=$('toast'); el.textContent=message; el.hidden=false;
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.hidden=true,3200);
}
function setControls() {
  for (const key of entryKeys) $(key).value = settings[key];
  document.querySelectorAll('.display-unit').forEach(el=>{
    if(el.closest('.studio-sideleft')) el.textContent=settings.unit;
  });
  $('width-unit').textContent=settings.unit === 'ft' ? 'feet' : 'meters';
  $('length-unit').textContent=settings.unit === 'ft' ? 'feet' : 'meters';
  radioUnits.forEach(button=>{const active=button.dataset.unit===settings.unit;button.classList.toggle('selected',active);button.setAttribute('aria-pressed',String(active));});
  materialButtons.forEach(button=>{const active=button.dataset.material===settings.material;button.classList.toggle('active',active);button.setAttribute('aria-checked',String(active));});
  $('waste-label').textContent = settings.waste+'%';
}
function reflectChanges() {
  currentResult=calculateFlooring(settings);
  const valid=currentResult.valid;
  for(const key of numericKeys){
    const err=$(`error-${key}`);
    if(err) err.textContent=currentResult.errors?.[key] || '';
    $(key)?.closest('.number-entry')?.classList.toggle('invalid',!!currentResult.errors?.[key]);
  }
  $('estimate-error').hidden=valid;
  const $text=(id,txt)=>$(id).textContent=txt;
  const mat=MATERIALS[settings.material];
  $('canvas-material').textContent=mat.name;
  $('swatch-inline').style.background=mat.color;
  if(valid){
    $text('area-number',formatNumber(settings.unit==='ft' ? currentResult.areaSqFt:currentResult.areaSqM,2));
    $text('area-unit',settings.unit==='ft'?'ft²':'m²');
    $text('area-converted',`≈ ${formatNumber(settings.unit==='ft'?currentResult.areaSqM:currentResult.areaSqFt,2)} ${settings.unit==='ft'?'m²':'ft²'}`);
    $text('needed-amount',`${formatNumber(settings.unit==='ft'?currentResult.neededSqFt:currentResult.neededSqM,2)} ${settings.unit==='ft'?'ft²':'m²'}`);
    $text('box-count',`${formatNumber(currentResult.boxes,0)} ${currentResult.boxes===1?'box':'boxes'}`);
    $text('purchased-amount',`${formatNumber(settings.unit==='ft'?currentResult.purchasedSqFt:currentResult.purchasedSqFt/10.763910416709722,2)} ${settings.unit==='ft'?'ft²':'m²'}`);
    $text('material-cost',formatMoney(currentResult.materialCost));
    $text('tax-amount',formatMoney(currentResult.taxAmount));
    $text('total-cost',formatMoney(currentResult.totalCost));
    renderFloorPlan($('room-svg'),settings,zoom);
    const saved = saveSettings(settings);
    $text('save-status', saved ? 'Saved locally' : 'Storage unavailable');
  } else {
    for(const id of ['area-number','area-converted','needed-amount','box-count','purchased-amount','material-cost','tax-amount','total-cost']) $text(id,'—');
    renderFloorPlan($('room-svg'),settings,zoom);
    $text('save-status','Unsaved changes');
  }
  $('zoom-percent').textContent=`${Math.round(zoom*100)}%`;
  $('zoom-in').disabled=zoom>=1.6;
  $('zoom-out').disabled=zoom<=0.6;
}
function refresh(){ setControls(); reflectChanges(); }
function updateSetting(key,value) {
  if (numericKeys.includes(key)) settings[key] = value === '' ? Number.NaN : Number(value);
  else settings[key]=value;
  if(key==='waste') $('waste-label').textContent=value+'%';
  reflectChanges();
}
for(const key of entryKeys){
  $(key).addEventListener(key==='pattern'?'change':'input',e=>updateSetting(key,e.target.value));
}
radioUnits.forEach(button=>button.addEventListener('click',()=>{
  const newUnit=button.dataset.unit;
  if(newUnit===settings.unit)return;
  const oldUnit=settings.unit;
  settings.width=Number.isFinite(settings.width)?Number(convertLength(settings.width,oldUnit,newUnit).toPrecision(12)):settings.width;
  settings.length=Number.isFinite(settings.length)?Number(convertLength(settings.length,oldUnit,newUnit).toPrecision(12)):settings.length;
  settings.unit=newUnit;
  refresh();
}));
materialButtons.forEach(button=>button.addEventListener('click',()=>{
  const material=button.dataset.material;
  if(material===settings.material)return;
  settings.material=material;
  settings.coverage=MATERIALS[material].coverage;
  settings.price=MATERIALS[material].price;
  refresh();
  notify('Material changed. Sample coverage and price updated—edit for your product.');
}));
function setZoom(n){zoom=Math.min(1.6,Math.max(.6,Number(n.toFixed(2))));reflectChanges();}
$('zoom-in').addEventListener('click',()=>setZoom(zoom+.2));
$('zoom-out').addEventListener('click',()=>setZoom(zoom-.2));
$('zoom-fit').addEventListener('click',()=>setZoom(1));
$('reset-button').addEventListener('click',()=>{
  if(!confirm('Reset your room and material settings to the example project?'))return;
  clearSettings();
  settings={...DEFAULT_SETTINGS};zoom=1;
  history.replaceState(null,'',location.pathname);
  refresh();notify('Project reset to the sample room.');
});
function getSummary() {
  const r=currentResult;
  const roomUnit=settings.unit;
  return `ROOMFORGE · Flooring Shopping List\n${formatNumber(settings.width,2)} × ${formatNumber(settings.length,2)} ${roomUnit} room\n${MATERIALS[settings.material].name} (${settings.pattern} pattern)\nFloor area: ${formatNumber(r.areaSqFt,2)} ft² / ${formatNumber(r.areaSqM,2)} m²\nWaste allowance: ${settings.waste}%\nCoverage required: ${formatNumber(r.neededSqFt,2)} ft²\nCoverage per box: ${formatNumber(settings.coverage,2)} ft²\nBoxes to purchase: ${r.boxes}\nPrice per box: ${formatMoney(settings.price)}\nMaterial cost: ${formatMoney(r.materialCost)}\nSales tax: ${formatMoney(r.taxAmount)}\nEstimated total: ${formatMoney(r.totalCost)}\n\nMaterials estimate only: labor, trim, underlayment, preparation and delivery excluded. Waste is an allowance, not a cut optimization.`;
}
async function copyText(value,okMessage){
  try { await navigator.clipboard.writeText(value);notify(okMessage); }
  catch {window.prompt('Copy this text:',value);}
}
$('copy-button').addEventListener('click',()=>{if(!currentResult.valid){notify('Enter valid values before copying.');return;}copyText(getSummary(),'Estimate copied to clipboard.');});
$('share-button').addEventListener('click',()=>{if(!currentResult.valid){notify('Fix the inputs before sharing.');return;}copyText(buildShareUrl(settings),'Shareable project link copied.');});
function preparePrint(){
  if(!currentResult.valid){notify('Fix the highlighted values before printing.');return;}
  const r=currentResult;
  const records=[
    ['Room dimensions',`${formatNumber(settings.width,2)} × ${formatNumber(settings.length,2)} ${settings.unit}`],
    ['Floor area',`${formatNumber(r.areaSqFt,2)} ft² (${formatNumber(r.areaSqM,2)} m²)`],
    ['Flooring material',MATERIALS[settings.material].name],
    ['Laying pattern',settings.pattern],
    ['Waste allowance',`${settings.waste}%`],
    ['Coverage required',`${formatNumber(r.neededSqFt,2)} ft²`],
    ['Coverage per box',`${formatNumber(settings.coverage,2)} ft²`],
    ['Boxes to purchase',String(r.boxes)],
    ['Price per box',formatMoney(settings.price)],
    ['Material cost',formatMoney(r.materialCost)],
    ['Sales tax',formatMoney(r.taxAmount)],
    ['Estimated total',formatMoney(r.totalCost)],
  ];
  const table=$('print-table');table.replaceChildren();
  for(const [label,value] of records){const tr=document.createElement('tr');for(const data of [label,value]){const td=document.createElement('td');td.textContent=data;tr.appendChild(td);}table.appendChild(tr);}
  window.print();
}
$('print-button').addEventListener('click',preparePrint);
$('print-button-side').addEventListener('click',preparePrint);
// Switch sections on narrow screens; wide layouts ignore the selection.
const tabs=[...document.querySelectorAll('.mobile-tab')];
function selectPanel(panel){
  document.querySelector('.studio-layout').dataset.panel=panel;
  tabs.forEach(t=>{const selected=t.dataset.panel===panel;t.classList.toggle('active',selected);t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;});
}
tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>selectPanel(tab.dataset.panel));
  tab.addEventListener('keydown',e=>{
    let offset=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;
    if(!offset)return;
    e.preventDefault();const next=tabs[(i+offset+tabs.length)%tabs.length];selectPanel(next.dataset.panel);next.focus();
  });
});
selectPanel('plan');
refresh();
