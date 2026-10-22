import {readFileSync,writeFileSync} from 'node:fs';
const [input,output]=process.argv.slice(2);
if(!input||!output)throw Error('Usage: node scripts/restore-backup.mjs PRIVATE-BACKUP.json RESTORE.sql');
const b=JSON.parse(readFileSync(input,'utf8'));
if(b.format!=='najneen-nest-v1'||!b.data||!['products','orders','requests','promotions','expenses'].every(k=>Array.isArray(b.data[k]))||!b.data.settings)throw Error('Invalid backup format.');
// Restore closed, preventing accidental sales before verification.
b.data.settings.live=false;
const payload=JSON.stringify(b.data).replaceAll("'","''");
writeFileSync(output,`INSERT INTO store_state (id,version,payload) VALUES ('main',0,'${payload}') ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,version=store_state.version+1;\n`,{flag:'wx'});
console.log('Private restore SQL created. Apply only to a new migrated database and verify before switching. Checkout is closed in restored data.');
