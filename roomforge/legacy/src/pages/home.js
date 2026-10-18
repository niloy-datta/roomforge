import { calculateFlooring } from '../core/calculations.js';
const form = document.getElementById('quick-start');
const width = document.getElementById('home-width');
const length = document.getElementById('home-length');
const error = document.getElementById('home-error');
form?.addEventListener('submit', event => {
  event.preventDefault();
  const result = calculateFlooring({ width: width.value, length: length.value, unit:'ft', waste:10, coverage:24, price:45, tax:0 });
  if (!result.valid) {
    error.textContent = result.errors.width || result.errors.length || 'Enter valid room dimensions.';
    error.hidden = false;
    (result.errors.width ? width : length).focus();
    return;
  }
  error.hidden = true;
  const url = new URL('studio.html', location.href);
  url.searchParams.set('w', String(width.value));
  url.searchParams.set('l', String(length.value));
  location.href = url.toString();
});
[width,length].forEach(input=>input.addEventListener('input',()=>{error.hidden=true;}));
