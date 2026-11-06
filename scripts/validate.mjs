import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
const ajv = new Ajv({allErrors:true}); addFormats(ajv);
const schema = JSON.parse(fs.readFileSync(new URL('../contract/publication.schema.json',import.meta.url)));
const check = ajv.compile(schema);
export function validate(text, slug) {
 const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
 if(!match) throw Error('Missing frontmatter');
 const data=YAML.parse(match[1]); const a=data.atlas, body=match[2];
 if(!data.title || !data.description || !check(a)) throw Error('Invalid publication metadata: '+ajv.errorsText(check.errors));
 if(a.article_id!==slug) throw Error('Filename must match article_id');
 if(new Set(a.sources.map(s=>s.id)).size!==a.sources.length || new Set(a.claims.map(c=>c.id)).size!==a.claims.length) throw Error('Duplicate IDs');
 if(a.status==='source-reviewed' && a.sources.some(s=>s.kind!=='official-docs')) throw Error('Forum content requires community-reported');
 if(a.reviewed_at>new Date().toISOString().slice(0,10)) throw Error('Future review');
 if(/<\/?[a-z!]|```|javascript:|data:/i.test(body)) throw Error('Unsafe or unsupported article markup');
 for(const c of a.claims){
   if(!body.includes(c.summary)) throw Error('Claim missing from prose');
   for(const id of c.sources){
    const s=a.sources.find(s=>s.id===id);
    if(!s || !body.includes(`${c.summary} ${c.sources.map(ref=>{const source=a.sources.find(x=>x.id===ref);return source?`[${ref}](${source.url})`:''}).join(' ')}`)) throw Error('Missing adjacent citation');
   }
 }
 return a;
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
 const dir='src/content/docs/guides'; const seen=new Set();
 for(const f of fs.readdirSync(dir)) {
  if(!f.endsWith('.md')) throw Error('Only Markdown articles accepted');
  const a=validate(fs.readFileSync(path.join(dir,f),'utf8'),f.slice(0,-3));
  if(seen.has(a.article_id)) throw Error('Duplicate article'); seen.add(a.article_id);
 }
 console.log(`Validated ${seen.size} articles against publication contract v1`);
}
