import fs from 'node:fs';
import path from 'node:path';
import { buildLocationServicePaths } from '../src/utils/sitemap-paths.js';

const root = '.vercel/output/static';
const origin = 'https://www.buckstronggaragedoors.com';
const records = [JSON.parse(fs.readFileSync('src/content/locations/akron.json')), ...fs.readdirSync('src/content/locations/akron').filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(`src/content/locations/akron/${f}`)))];
const groups = [
  { overview: 'garage-door-repair', prefix: '', slugs: ['spring-replacement','opener-repair','cable-repair','track-alignment','panel-replacement','rollers-hinges','sensor-alignment','weatherstripping','maintenance','balance-adjustment'] },
  { overview: 'opener-repair', prefix: 'opener-', slugs: ['belt-drive-repair','chain-drive-repair','jackshaft-opener-repair','screw-drive-opener-repair'] },
  { overview: 'garage-door-installation', prefix: '', slugs: ['steel-garage-doors','wood-garage-doors','aluminum-garage-doors','carriage-house-garage-doors'] },
  { overview: 'commercial-jobs', prefix: 'commercial-', slugs: ['warehouse-distribution-door-service','dock-industrial-door-equipment-service','retail-municipal-garage-door-service'] },
];
const serviceSlugs = groups.flatMap(g => [g.overview, ...g.slugs.map(s => `garage-door-${g.prefix}${s}`)]);
const routes = [...records.map(r => `/locations/${r.slug}`), ...buildLocationServicePaths(records, serviceSlugs.map(slug => ({ slug })))];
const read = route => { const f=path.join(root, route.slice(1), 'index.html'); return fs.existsSync(f) ? fs.readFileSync(f,'utf8') : ''; };
const text = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/g,'').replace(/<[^>]*>/g,' ').replace(/&#(\d+);/g,(_,v)=>String.fromCharCode(Number(v))).replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replace(/\s+/g,' ').trim();
const failures=[];
const unique={title:new Map(), description:new Map(), h1:new Map(), canonical:new Map()};
const sitemap = fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const normalizedBodies = new Map();
let linkCount=0, schemaCount=0, assetCount=0;
for (const route of routes) {
  const html=read(route); if(!html) {failures.push(`${route}: missing generated page`);continue;}
  const main=html.includes('<main') ? html.slice(html.indexOf('<main'), html.indexOf('</main>')+7) : html.slice(html.indexOf('</nav>'), html.indexOf('<footer'));
  const fields={title:html.match(/<title>(.*?)<\/title>/s)?.[1],description:html.match(/<meta name="description" content="([^"]*)"/)?.[1],h1:html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]*>/g,''),canonical:html.match(/<link rel="canonical" href="([^"]*)"/)?.[1]};
  for(const [key,value] of Object.entries(fields)) {
    if(!value) failures.push(`${route}: missing ${key}`);
    else if(unique[key].has(value)) failures.push(`${route}: duplicate ${key} with ${unique[key].get(value)}`);
    else unique[key].set(value,route);
  }
  if(fields.canonical!==origin+route) failures.push(`${route}: incorrect canonical`);
  if((html.match(/<h1\b/g)||[]).length!==1) failures.push(`${route}: H1 count`);
  if(!fields.h1?.includes('OH')) failures.push(`${route}: state missing from H1`);
  if(/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html)) failures.push(`${route}: noindex`);
  if(!sitemap.includes(`<loc>${origin}${route}</loc>`)) failures.push(`${route}: missing sitemap entry`);
  if(!html.includes('action="/api/contact"') || !html.includes('data-contact-form')) failures.push(`${route}: form missing`);
  if(records[0].phone && !main.includes(`href="tel:${records[0].phone.replace(/[^0-9+]/g,'')}"`)) failures.push(`${route}: Akron call action missing from main content`);
  if((html.match(/<div[^>]*\bdata-floating-call(?:\s|=|>)/g)||[]).length!==1) failures.push(`${route}: duplicated or missing floating call control`);
  const head=html.slice(0,html.indexOf('<body'));
  if(!head.includes('66 South Miller Road') || head.includes('2337 Victory Parkway') || head.includes('24500 Center Ridge')) failures.push(`${route}: wrong address metadata`);
  if(text(main).split(' ').length<250) failures.push(`${route}: thin main content`);
  const h2=[...main.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].map(m=>text(m[1]));
  if(new Set(h2).size!==h2.length) failures.push(`${route}: repeated H2/section`);
  for(const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const data=JSON.parse(match[1]);schemaCount++;
      const visit=node=>{
        if(!node||typeof node!=='object')return;
        if(['City','Place','AdministrativeArea'].includes(node['@type']) && (node.addressRegion || node.addressCountry)) failures.push(`${route}: geographic postal fields must be nested in PostalAddress`);
        if(node.areaServed?.some?.(area=>area['@type']==='PostalCodeRangeSpecification')) failures.push(`${route}: invalid areaServed type`);
        if(node['@id']?.includes('/locations/akron#local-business')) {
          const telephone=node.telephone ?? node.contactPoint?.telephone;
          if(telephone !== records[0].phone) failures.push(`${route}: incorrect or missing Akron provider phone`);
          if(node.openingHoursSpecification) failures.push(`${route}: Akron operating hours published without confirmation`);
        }
        if(node.provider?.['@id']?.includes('/locations/akron#local-business') && node.provider.address?.streetAddress!=='66 South Miller Road, Suite LL3') failures.push(`${route}: wrong provider address`);
        Object.values(node).forEach(v=>Array.isArray(v)?v.forEach(visit):visit(v));
      };
      visit(data);
    }catch(e){failures.push(`${route}: malformed JSON-LD: ${e.message}`);}
  }
  if(html.includes('data-text-ratio-helper')) failures.push(`${route}: inherited Cincinnati hidden text`);
  if(!html.includes('BreadcrumbList')) failures.push(`${route}: breadcrumb schema missing`);
  for (const match of html.matchAll(/<(?:img|source|script)\b[^>]*\b(?:src|srcset)="([^"]+)"/g)) {
    if(match[1].startsWith('data:'))continue;
    for(const candidate of match[1].split(',')) {
      const resource=candidate.trim().split(/\s+/)[0];
      let asset;try{asset=new URL(resource,origin+route);}catch{continue;}
      if(asset.origin!==origin || asset.pathname.startsWith('/_image') || asset.pathname.startsWith('/_vercel/'))continue;
      assetCount++;
      if(!fs.existsSync(path.join(root,decodeURIComponent(asset.pathname)))) failures.push(`${route}: missing asset ${resource}`);
    }
  }
  for(const match of html.matchAll(/href="([^"]*)"/g)) {
    let url;try{url=new URL(match[1].replaceAll('&amp;','&'),origin+route);}catch{failures.push(`${route}: invalid link`);continue;}
    if(url.origin!==origin||!['http:','https:'].includes(url.protocol))continue;
    linkCount++;const target=url.pathname.replace(/\/$/,'')||'/';
    if(!fs.existsSync(path.join(root,target.slice(1)))&&!read(target)) failures.push(`${route}: broken link ${match[1]}`);
    if(url.hash && !url.hash.includes(':~:text=')) { const targetHtml=target===route?html:read(target);const id=decodeURIComponent(url.hash.slice(1));if(targetHtml&&!targetHtml.includes(`id="${id}"`)) failures.push(`${route}: missing fragment ${match[1]}`); }
  }
  normalizedBodies.set(route,text(main));
}
for(const record of records) {
  const city=record.slug.replace(/^akron-/,'');const location=read(`/locations/${record.slug}`);
  for(const group of groups) {
    const overview=`/${city}-oh/${group.overview}`;const overviewHtml=read(overview);
    if(!location.includes(`href="${overview}"`))failures.push(`${record.slug}: missing local ${group.overview}`);
    for(const slug of group.slugs) {
      const detail=`/${city}-oh/garage-door-${group.prefix}${slug}`;
      if(!overviewHtml.includes(`href="${detail}"`)) failures.push(`${overview}: missing local detail ${slug}`);
      const detailHtml=read(detail);if(!detailHtml.includes(`href="${overview}"`)) failures.push(`${detail}: wrong overview relationship`);
      const content=detailHtml.slice(detailHtml.indexOf('<main'),detailHtml.indexOf('</main>'));
      const backgrounds=[...content.matchAll(/<section[^>]*class="([^"]*)"/g)].map(m=>m[1].match(/\bbg-(white|muted)\b/)?.[1]);
      if(backgrounds.join(',')!=='muted,white,muted,white,muted,white,muted') failures.push(`${detail}: section backgrounds`);
      if(!text(content).includes(record.localIntro) && !text(content).includes(record.localAdvice) && !text(content).includes(record.localCommercialIntro)) failures.push(`${detail}: unique local context missing`);
    }
  }
}
const duplicateBodies = new Map();
for (const sharedRoute of ['/','/faq','/services','/contact','/services/garage-door-repair','/services/opener-repair','/services/garage-door-installation','/services/commercial-jobs']) {
  const sharedHtml=read(sharedRoute);
  if((sharedHtml.match(/<div[^>]*\bdata-floating-call(?:\s|=|>)/g)||[]).length!==1) failures.push(`${sharedRoute}: duplicated or missing shared floating call control`);
  for (const match of sharedHtml.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    const check=node=>{
      if(!node||typeof node!=='object')return;
      if(node['@type']==='ContactPoint' && node.telephone===records[0].phone) {
        if(node.areaServed?.address?.addressRegion!=='OH' || node.areaServed?.addressRegion) failures.push(`${sharedRoute}: Akron ContactPoint postal schema`);
        if(node.hoursAvailable) failures.push(`${sharedRoute}: unconfirmed Akron hours`);
      }
      Object.values(node).forEach(v=>Array.isArray(v)?v.forEach(check):check(v));
    };
    check(JSON.parse(match[1]));
  }
}
const localityNames = records.map(record => record.name).sort((a,b) => b.length-a.length);
for (const [route,body] of normalizedBodies) {
  const normalized = localityNames.reduce((copy,name) => copy.replaceAll(name,'LOCALITY'),body);
  if (duplicateBodies.has(normalized)) failures.push(`${route}: city-normalized duplicate main content with ${duplicateBodies.get(normalized)}`);
  duplicateBodies.set(normalized,route);
}
const summary={pages:routes.length,locations:records.length,internalLinksChecked:linkCount,assetsChecked:assetCount,jsonLdBlocks:schemaCount,cityNormalizedDuplicateBodies:normalizedBodies.size-duplicateBodies.size,issues:failures.length,failures};
fs.mkdirSync('reports',{recursive:true});fs.writeFileSync('reports/akron-audit.json',JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify({...summary,failures:failures.slice(0,30)},null,2));
if(failures.length)process.exitCode=1;
