import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const pages=['index.html','studio.html','guides/flooring-calculator.html'];
const read=p=>readFileSync(path.join(root,p),'utf8');

test('all pages contain essential semantics and metadata',()=>{
 for(const page of pages){
  const html=read(page);
  assert.match(html,/<html lang="en">/);
  assert.match(html,/<meta name="viewport"/);
  assert.match(html,/<meta name="description"/);
  assert.match(html,/<main\b/);
  assert.match(html,/<h1\b/);
 }
});
test('local navigation, stylesheets, modules and icons point to existing files',()=>{
 for(const page of pages){
  const html=read(page);
  const links=[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]);
  for(const link of links){
   if(/^(?:https?:|data:|#|mailto:)/.test(link))continue;
   const local=link.split('?')[0].split('#')[0];
   assert.ok(existsSync(path.resolve(root,path.dirname(page),local)),`${page}: missing ${local}`);
  }
 }
});
test('landing and studio expose functional entrypoints and user controls',()=>{
 const home=read('index.html'),studio=read('studio.html');
 assert.match(home,/id="quick-start"/);
 assert.match(home,/src="src\/pages\/home\.js"/);
 assert.match(studio,/src="src\/pages\/studio\.js"/);
 for(const control of ['width','length','waste','coverage','price','tax','pattern','room-svg','share-button','print-button','copy-button','reset-button'])
   assert.match(studio,new RegExp(`id="${control}"`),`missing ${control}`);
 assert.match(read('guides/flooring-calculator.html'),/ADVERTISEMENT/);
});
