import {readFileSync,writeFileSync} from 'node:fs';
const time=(s:string)=>s.split(':').reduce((a,b)=>a*60+Number(b),0);
const blocks=readFileSync('evidence/talking-head/en.vtt','utf8').replace(/\r/g,'').split(/\n\n+/);
const translations=['我今天想说明的是：','我们不仅有办法缓解这些问题，','只要设置适当的防护，做正确的事，','我们就能减轻这些风险。','更重要的是，我们正处在一个转折点：','AI可能带来教育史上','最重要的正向变革。','实现这一目标的方法，','是为地球上的每一个学生，','提供一位出色的AI私人导师。','也为地球上的每一位教师，','提供一位出色的AI教学助手。'];
const cues=blocks.flatMap(b=>{const lines=b.split('\n');const at=lines.findIndex(l=>l.includes(' --> '));if(at<0)return[];const [a,end]=lines[at].split(' --> ');return[{start:time(a)-25.438,end:time(end)-25.438,en:lines.slice(at+1).join(' ')}];}).filter(c=>c.start>=-.001&&c.start<32);
if(cues.length!==12)throw new Error('Expected 12 source cues: '+cues.length);
writeFileSync('data/talking-head-captions.json',JSON.stringify(cues.map((c,i)=>({...c,zh:translations[i]})),null,2));
console.log('CAPTIONS_PASS 12 source-timed cues');
