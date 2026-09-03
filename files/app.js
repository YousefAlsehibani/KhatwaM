/* ════════ الزمن: اليوم يبدأ ٣ فجرًا بتوقيت الرياض ════════ */
const TZ=3,DAY_START=3;
const riyadh=()=>new Date(Date.now()+TZ*3600000);
const todayISO=()=>{const d=riyadh();d.setUTCHours(d.getUTCHours()-DAY_START);return d.toISOString().slice(0,10)};
const dayISO=n=>{const d=riyadh();d.setUTCHours(d.getUTCHours()-DAY_START);d.setUTCDate(d.getUTCDate()-n);
 return d.toISOString().slice(0,10)};
const addD=(iso,n)=>{const d=new Date(iso+'T00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
const dow=iso=>new Date(iso+'T00:00Z').getUTCDay();
const weekStart=iso=>addD(iso,-dow(iso));            /* الأسبوع يبدأ الأحد */
const eachDay=(a,b)=>{const o=[];if(!a||!b||b<a)return o;let d=a;while(d<=b){o.push(d);d=addD(d,1)}return o};
const DAYS=['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const DSH=['أحد','اثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'];
const dayName=iso=>DAYS[dow(iso)];
function untilClose(){const n=riyadh(),h=n.getUTCHours(),m=n.getUTCMinutes();
 return{h:(DAY_START-h-1+24)%24,m:59-m}}
const closeText=()=>{const t=untilClose();return t.h?`${t.h} ساعة و${t.m} دقيقة`:`${t.m} دقيقة`};

/* ════════ بيانات ════════ */
const GRADES=[
 {id:'g1',name:'أول متوسط',c:'var(--g1)'},
 {id:'g2',name:'ثاني متوسط',c:'var(--g2)'},
 {id:'g3',name:'ثالث متوسط',c:'var(--g3)'}];
const gradeById=i=>GRADES.find(g=>g.id===i);

/* مقرر الأسبوع لكل صف: قرائي و/أو سماعي */
let PLAN={};   /* gradeId|weekStart → {read:{...}|null, listen:{...}|null} */
function seedPlan(ws){
 PLAN['g1|'+ws]={read:{title:'قصة اختراع',by:'د. أحمد الشريف',target:70,
   note:'كتاب مصوّر يحكي كيف وُلدت الاختراعات من مشكلة واجهت صاحبها. أسلوبه سهل ومشوّق، ويفتح ذهنك لتلاحظ المشكلات حولك.'},
  listen:null};
 PLAN['g2|'+ws]={read:{title:'رحلة ابن بطوطة (مختصرة)',by:'إعداد: مكتبة الأسرة',target:90,
   note:'رحلة أشهر رحّالة عربي عبر ثلاث قارات. تقرأ فيها عن بلدان وعادات غريبة، وتتعلم كيف يصف الكاتب ما يراه.'},
  listen:{title:'سلسلة: كيف تُنظّم وقتك',by:'أ. سعد المطيري',target:60,
   link:'https://www.youtube.com/results?search_query='+encodeURIComponent('كيف تنظم وقتك للطلاب'),
   note:'ست حلقات قصيرة عن ترتيب اليوم بين الدراسة واللعب، مع تمرين عملي بعد كل حلقة.'}};
 PLAN['g3|'+ws]={read:{title:'صناع التاريخ',by:'محمد الحمادي',target:110,
   note:'سِيَر مختصرة لشخصيات غيّرت مجرى التاريخ، وما الذي اشتركوا فيه جميعًا رغم اختلاف زمانهم.'},
  listen:{title:'بودكاست: لغتنا الجميلة',by:'أ. فيصل العنزي',target:90,
   link:'https://www.youtube.com/results?search_query='+encodeURIComponent('بودكاست اللغة العربية للناشئة'),
   note:'حلقات عن أسرار الكلمات العربية وأصولها، بأسلوب خفيف يجعلك تحب لغتك.'}};
}
const planOf=(g,ws)=>PLAN[g+'|'+ws]||{read:null,listen:null};

let SUPERVISORS=[
 {code:'2201',name:'أ. عبدالله الصقر',grade:'g1'},
 {code:'2202',name:'أ. ماجد الرشيد',grade:'g2'},
 {code:'2203',name:'أ. سلمان العتيبي',grade:'g3'}];
const ADMIN={code:'9000',name:'أبو يعقوب السحيباني'};

let STUDENTS=[];
(function(){
 const n1=['سلمان الحربي','ريان القحطاني','تركي الدوسري','نواف العتيبي','بدر الشمري','معاذ الزهراني','أنس الغامدي','لؤي المالكي'];
 const n2=['عبدالرحمن السبيعي','فهد المطيري','خالد الرشيدي','سعود العنزي','يزيد الحارثي','مشاري البقمي','طلال الشهري'];
 const n3=['عمر الجهني','صالح القرني','إبراهيم الأحمدي','حمزة السلمي','راكان الثبيتي','زياد العمري','وليد الخالدي'];
 let i=0;
 [['g1','2201',n1],['g2','2202',n2],['g3','2203',n3]].forEach(([g,sv,ns])=>
  ns.forEach(nm=>STUDENTS.push({code:String(3101+i++),name:nm,grade:g,supervisor:sv})));
})();
const studentByCode=c=>STUDENTS.find(s=>s.code===c);
const supByCode=c=>SUPERVISORS.find(s=>s.code===c);

let ENTRIES=[],EID=0,PICKS=[];
const BEN_R=['تعلمت أن كل اختراع بدأ من مشكلة أزعجت صاحبه فبحث لها عن حل.',
 'أعجبني أن الكاتب يصف المكان حتى تكاد تراه، وهذا يعلّمني كيف أكتب وصفًا حيًّا.',
 'فهمت أن الفشل في التجربة الأولى ليس نهاية، بل خطوة نحو الصواب.',
 'استفدت أن ترتيب الوقت أهم من كثرته، فساعة منظمة خير من يوم مبعثر.',
 'لفتني أن العلماء الذين غيّروا التاريخ بدأوا صغارًا بأسئلة بسيطة.',
 'عرفت أن القراءة تزيد حصيلة كلماتي، فصرت أعبّر عن نفسي بوضوح.',
 'أدركت أن الصبر على الشيء الصعب هو ما يفرّق بين من ينجح ومن يترك.'];
const BEN_L=['فهمت من الحلقة أن تقسيم المهمة الكبيرة لأجزاء صغيرة يجعلها ممكنة.',
 'تعلمت أن أبدأ بالأصعب أول النهار لأن ذهني يكون أنشط.',
 'أعجبني أن للكلمة العربية أصلًا وقصة، وهذا زاد حبي للغتي.',
 'استفدت أن أضع لكل يوم هدفًا واحدًا واضحًا بدل أهداف كثيرة مشتتة.',
 'عرفت أن الاستماع الجيد مهارة تُتعلَّم مثل الكلام تمامًا.',
 'تعلمت أن أراجع ما سمعته بكلماتي حتى يثبت في ذهني.'];
const newEid=()=>'e'+(++EID);

/* ════════ فهارس: تُبنى مرة وتُحدَّث عند التغيير ════════ */
const EMPTY={r:0,l:0,list:[]};
let DAY={},BYCODE={},WK={},MEMO={},BEN=[],BENC={},BENG={};
function reindex(){DAY={};BYCODE={};WK={};MEMO={};BEN=[];BENC={};BENG={};
 const ws=weekStart(todayISO()),we=addD(ws,6);
 for(const e of ENTRIES){
  const k=e.code+'|'+e.date,d=DAY[k]||(DAY[k]={r:0,l:0,list:[]});
  if(e.kind==='read')d.r+=e.v;else d.l+=e.v;
  d.list.push(e);
  (BYCODE[e.code]||(BYCODE[e.code]=[])).push(e);
  if(e.date>=ws&&e.date<=we){const w=WK[e.code]||(WK[e.code]={r:0,l:0});
   if(e.kind==='read')w.r+=e.v;else w.l+=e.v}
  if(e.note)BEN.push(e)}
 BEN.sort((a,b)=>b.date.localeCompare(a.date)||b.id.slice(1)-a.id.slice(1));
 for(const e of BEN){                       /* فهرسة الفوائد بالطالب وبالصف */
  (BENC[e.code]||(BENC[e.code]=[])).push(e);
  const st=studentByCode(e.code);if(st)(BENG[st.grade]||(BENG[st.grade]=[])).push(e)}
 const ids=new Set(ENTRIES.map(e=>e.id));PICKS=PICKS.filter(id=>ids.has(id))}
const benOf=code=>BENC[code]||[];
const benGrade=g=>BENG[g]||[];
const pickedEntries=()=>PICKS.map(id=>ENTRIES.find(e=>e.id===id)).filter(Boolean);
const isPicked=id=>PICKS.indexOf(id)>-1;
const dayOf=(c,d)=>DAY[c+'|'+d]||EMPTY;
const weekOf=c=>WK[c]||{r:0,l:0};
const entriesOf=(c,d)=>d?dayOf(c,d).list:(BYCODE[c]||[]);
function memo(k,fn){return k in MEMO?MEMO[k]:(MEMO[k]=fn())}

/* ════════ حسابات الأسبوع ════════ */
const WS=()=>weekStart(todayISO());
function targetOf(s){const p=planOf(s.grade,WS());
 return{r:p.read?p.read.target:0,l:p.listen?p.listen.target:0}}
function doneOf(code){const w=weekOf(code);return{r:w.r,l:w.l}}
const pct=(a,b)=>b>0?Math.min(100,Math.round(a/b*100)):(a>0?100:0);
function weekPct(s){const t=targetOf(s),d=doneOf(s.code);
 const tot=t.r+t.l;if(!tot)return 0;
 return Math.min(100,Math.round(((Math.min(d.r,t.r)+Math.min(d.l,t.l))/tot)*100))}
function dayIndex(){return eachDay(WS(),todayISO()).length}      /* اليوم كم في الأسبوع (1..7) */
function daysLeft(){return 7-dayIndex()+1}
function suggest(s){const t=targetOf(s),d=doneOf(s.code),dl=daysLeft();
 return{r:Math.max(0,Math.ceil((t.r-d.r)/dl)),l:Math.max(0,Math.ceil((t.l-d.l)/dl)),dl}}
function paceState(s){const p=weekPct(s),exp=Math.round(dayIndex()/7*100);
 if(p>=100)return{k:'done',t:'أتممت مقرر الأسبوع'};
 if(p>=exp)return{k:'ok',t:'في المسار'};
 if(p>=exp-20)return{k:'mid',t:'قريب من المسار'};
 return{k:'off',t:'متأخر عن المسار'}}
const codeOfGrade=g=>STUDENTS.filter(s=>s.grade===g);
function myStudents(){if(S.role==='admin')return STUDENTS;
 const sv=supByCode(S.me.code);return sv?codeOfGrade(sv.grade):STUDENTS}
function lastActive(code){for(let k=0;k<14;k++)if(dayOf(code,dayISO(k)).list.length)return k;return 99}

/* ════════ بيانات تجريبية ════════ */
(function seed(){
 const ws=WS();seedPlan(ws);seedPlan(addD(ws,-7));
 const r=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
 const days=eachDay(addD(ws,-7),todayISO());
 STUDENTS.forEach((s,i)=>{
  const commit=[.9,.82,.7,.6,.5,.86,.75,.4,.9,.65,.55,.8,.35,.72,.6,.88,.5,.78,.45,.68,.83,.58][i%22];
  days.forEach(d=>{
   const p=planOf(s.grade,weekStart(d));
   if(Math.random()>commit)return;
   if(p.read)ENTRIES.push({id:newEid(),code:s.code,date:d,kind:'read',
     v:r(6,Math.max(8,Math.round(p.read.target/5))),note:BEN_R[r(0,BEN_R.length-1)],course:p.read.title});
   if(p.listen&&Math.random()<.75)ENTRIES.push({id:newEid(),code:s.code,date:d,kind:'listen',
     v:r(8,Math.max(10,Math.round(p.listen.target/5))),note:BEN_L[r(0,BEN_L.length-1)],course:p.listen.title});
  })});
 reindex();
 PICKS=BEN.slice(0,3).map(e=>e.id);
})();

/* ════════ حالة ════════ */
let S={role:null,me:null,view:'week',student:null,modal:null,buf:''};
const $=i=>document.getElementById(i);
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shell=()=>$('shell');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function toast(m){const r=$('troot');r.innerHTML=`<div class="toast">${esc(m)}</div>`;
 clearTimeout(toast._t);toast._t=setTimeout(()=>r.innerHTML='',2400)}

/* ════════ الدخول ════════ */
function loginHTML(){const b=S.buf;
 return `<div class="login"><div class="lcard" id="lc">
  <div class="brand-mark">خ</div>
  <h1 class="wordmark">خطوة</h1>
  <p class="brandsub">المتوسط · الإنجاز الأسبوعي</p>
  <p class="sub">مقرر الأسبوع بين يديك — سجّل إنجازك واكتب فائدتك.</p>
  <div class="codes" id="cw">${[0,1,2,3].map(i=>
    `<div class="dg ${b[i]?'f':''} ${b.length===i?'a':''}">${b[i]?`<span>${b[i]}</span>`:''}</div>`).join('')}</div>
  <div class="err"></div>
  <div class="pad">${[1,2,3,4,5,6,7,8,9].map(n=>`<button onclick="tap(event,'${n}')">${n}</button>`).join('')}
   <button onclick="tap(event,'back')" aria-label="حذف">⌫</button>
   <button onclick="tap(event,'0')">0</button>
   <button onclick="tap(event,'clear')" aria-label="مسح">C</button></div>
  <button class="btn" onclick="login()">دخول</button>
  <p class="hint">للتجربة: طالب <code onclick="fill('3101')">3101</code> ·
   مشرف <code onclick="fill('2201')">2201</code> · تنفيذي <code onclick="fill('9000')">9000</code></p>
 </div></div>`}
function paintDigits(){const w=$('cw');if(!w)return;
 [...w.children].forEach((d,i)=>{const v=S.buf[i]||'';
  d.className='dg'+(v?' f':'')+(S.buf.length===i?' a':'');
  if(v!==(d.dataset.v||'')){d.innerHTML=v?'<span>'+v+'</span>':'';d.dataset.v=v}})}
function loginErr(m){const w=$('cw'),e=document.querySelector('.err');
 if(e)e.textContent=m;S.buf='';if(w){w.classList.add('bad');
  setTimeout(()=>{w.classList.remove('bad');paintDigits()},480)}
 clearTimeout(loginErr._t);loginErr._t=setTimeout(()=>{if(e)e.textContent=''},3200)}
function fill(c){S.buf=c;paintDigits();setTimeout(login,240)}
function tap(e,k){
 if(e){const b=e.currentTarget,r=b.getBoundingClientRect(),d=document.createElement('span');
  d.className='ripple';d.style.background='rgba(47,75,216,.22)';
  d.style.left=(e.clientX-r.left)+'px';d.style.top=(e.clientY-r.top)+'px';
  d.style.width=d.style.height='20px';b.appendChild(d);setTimeout(()=>d.remove(),560)}
 if(k==='back')S.buf=S.buf.slice(0,-1);else if(k==='clear')S.buf='';
 else if(S.buf.length<4)S.buf+=k;
 paintDigits();if(S.buf.length===4)setTimeout(login,220)}
function drawLogin(){shell().innerHTML=loginHTML()}
function login(){const v=S.buf,st=studentByCode(v),sv=supByCode(v);
 let role,me,view;
 if(st){role='student';me=st;view='week'}
 else if(sv){role='supervisor';me=sv;view='class'}
 else if(v===ADMIN.code){role='admin';me=ADMIN;view='plan'}
 else return loginErr('الرمز غير مسجّل. تأكد منه أو اسأل مشرفك.');
 const c=$('lc');if(c&&!reduced)c.classList.add('leaving');
 setTimeout(()=>{S={...S,role,me,view,buf:'',student:null};lastKey='';renderShell()},reduced?0:340)}
function logout(){S={role:null,me:null,view:'week',student:null,modal:null,buf:''};lastKey='';drawLogin()}

/* ════════ هيكل ════════ */
function topbar(){const rn={student:'طالب',supervisor:'مشرف',admin:'مشرف تنفيذي'}[S.role];
 const g=S.role==='student'?gradeById(S.me.grade).name:S.role==='supervisor'?gradeById(supByCode(S.me.code).grade).name:'';
 return `<header class="top"><div class="wrap">
  <div class="brand"><span class="brand-mark sm">خ</span>
   <span class="bwrap">خطوة<em>المتوسط</em></span></div>
  <div class="spacer"></div>
  <div class="who"><b>${esc(S.me.name)}</b>${rn}${g?' · '+g:''}</div>
  <button class="ghost" onclick="logout()">خروج</button></div></header>`}
function tabs(l){return `<div class="tabs" id="tabs">${l.map(t=>
 `<button role="tab" aria-selected="${S.view===t.id}" onclick="go('${t.id}')">${t.label}</button>`).join('')}
 <span class="tind" id="tind"></span></div>`}
function go(v){S.view=v;S.student=null;PAGE=STEP;BPAGE=STEP;MROWS=30;renderShell()}
function viewStudent(c){S.student=c;renderShell()}

/* ════════ عناصر مشتركة ════════ */
function statStrip(items){return `<div class="stats">${items.map((x,i)=>
 `<div class="stat rv" style="--i:${i};--sc:${x.c||'var(--brand)'}">
   <div class="lab">${x.lab}</div>
   <div class="val"><span class="num" data-to="${x.val}" ${x.sfx?`data-suffix="${x.sfx}"`:''}>0</span>${x.sub?` <small>${x.sub}</small>`:''}</div>
  </div>`).join('')}</div>`}
function cover(kind,color,p){const H=104,fh=Math.max(3,H*p/100);
 return kind==='read'
 ? `<svg viewBox="0 0 88 118" aria-hidden="true">
     <rect x="9" y="6" width="70" height="${H}" rx="7" fill="${color}" opacity=".15"></rect>
     <rect class="fb" x="9" y="${6+H-fh}" width="70" height="${fh}" rx="7" fill="${color}"></rect>
     <rect x="9" y="6" width="70" height="${H}" rx="7" fill="none" stroke="${color}" stroke-opacity=".45"></rect>
     <rect x="15" y="6" width="2.5" height="${H}" fill="#fff" opacity=".5"></rect>
     ${[28,40,52].map((y,k)=>`<rect x="25" y="${y}" width="${k===2?26:44}" height="3" rx="1.5" fill="#fff" opacity=".7"></rect>`).join('')}
    </svg>`
 : `<svg viewBox="0 0 88 118" aria-hidden="true">
     <rect x="9" y="6" width="70" height="${H}" rx="16" fill="${color}" opacity=".15"></rect>
     <rect class="fb" x="9" y="${6+H-fh}" width="70" height="${fh}" rx="16" fill="${color}"></rect>
     <rect x="9" y="6" width="70" height="${H}" rx="16" fill="none" stroke="${color}" stroke-opacity=".45"></rect>
     <g transform="translate(44,48)"><path d="M-15 6v-3a15 15 0 0130 0v3M-15 6h6v11h-6zM9 6h6v11H9z"
       fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".92"/></g>
     <g transform="translate(44,86)">${[-18,-11,-4,3,10,17].map((x,k)=>{const h=[7,15,22,11,18,8][k];
       return `<rect x="${x}" y="${-h/2}" width="4" height="${h}" rx="2" fill="#fff" opacity=".75"></rect>`}).join('')}</g>
    </svg>`}

/* ════════ الطالب ════════ */
function weekTrack(s,dark){
 const ws=WS(),t=targetOf(s),per=(t.r+t.l)/7||1;
 return `<div class="track">${eachDay(ws,addD(ws,6)).map(d=>{
  const x=dayOf(s.code,d),tot=x.r+x.l,fut=d>todayISO();
  return `<div class="day ${d===todayISO()?'today':''} ${!tot&&!fut?'miss':''}"
    role="button" tabindex="0" data-inf="${dayName(d)} ${d} — ${x.r} صفحة · ${x.l} دقيقة"
    onclick="cellInfo(this,'winfo')" onkeydown="if(event.key==='Enter')cellInfo(this,'winfo')">
   <div class="dn">${DSH[dow(d)]}</div>
   <div class="dv">${fut?'—':tot||'٠'}</div>
   <div class="fill"><i data-w="${fut?0:Math.min(100,Math.round(tot/per*100))}"></i></div></div>`}).join('')}</div>`}
function weekView(){
 const me=S.me,g=gradeById(me.grade),p=planOf(me.grade,WS());
 const t=targetOf(me),d=doneOf(me.code),wp=weekPct(me),sg=suggest(me),ps=paceState(me);
 const R=64,C=2*Math.PI*R,today=dayOf(me.code,todayISO());
 return `${'' }
 <div class="hero rv"><div class="htop">
   <div><p class="hlab">${dayName(todayISO())} · اليوم <span class="num">${dayIndex()}</span> من الأسبوع</p>
    <h2>مقرر أسبوعك يا ${esc(me.name.split(' ')[0])}</h2></div>
   <div class="hst">
    <div><div class="hk">أنجزت من الأسبوع</div><div class="hv am"><span class="num" data-to="${wp}" data-suffix="%">0%</span></div></div>
    <div><div class="hk">باقي من الأيام</div><div class="hv"><span class="num" data-to="${sg.dl}">0</span> <small>يوم</small></div></div>
    <div><div class="hk">اليوم</div><div class="hv gr"><span class="num" data-to="${today.r}">0</span><small>ص</small>
      <span class="num" data-to="${today.l}" style="margin-right:8px">0</span><small>د</small></div></div>
   </div></div>
  ${weekTrack(me)}
  <div class="cellinfo" id="winfo" style="background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.14);color:#9CB2A9">
   اضغط أي يوم لتفاصيله.</div></div>

 <div class="sug rv ${ps.k==='done'?'done':ps.k==='off'?'late':''}" style="--i:1">
  <span class="si">${ps.k==='done'?'✅':ps.k==='off'?'⏳':'🎯'}</span>
  <div style="flex:1">
   <b>${ps.k==='done'?'أتممت مقرر الأسبوع — أحسنت!'
     :`اقتراح اليوم: ${[sg.r?`<span class="num">${sg.r}</span> صفحة`:'',sg.l?`<span class="num">${sg.l}</span> دقيقة`:''].filter(Boolean).join(' و')}`}</b>
   <p>${ps.k==='done'?'أي زيادة بعد هذا ربح لك. تقدر تراجع أو تكمل قراءتك.'
     :`${ps.t} · لو مشيت على هذا المقدار تنهي مقررك قبل نهاية الأسبوع بإذن الله. يقفل يومك ٣:٠٠ فجرًا (باقي ${closeText()}).`}</p></div>
  ${ps.k==='done'?'':`<button class="btn sm" onclick="openLog()">سجّل الآن</button>`}</div>

 <div class="sec rv" style="--i:2"><h2>مقرر هذا الأسبوع</h2>
  <span class="chip">${g.name} · <span class="num">${WS()}</span></span></div>
 <div class="grid ${p.read&&p.listen?'g2':''}">
  ${p.read?courseCard(p.read,'read',d.r,t.r,g.c,3):''}
  ${p.listen?courseCard(p.listen,'listen',d.l,t.l,g.c,4):''}
  ${!p.read&&!p.listen?'<div class="card empty rv">ما تحدد مقرر لهذا الأسبوع بعد — راجع مشرفك.</div>':''}
 </div>

 <div class="card rv" style="--i:5;margin-top:14px">
  <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
   <div><p class="eyebrow">${dayName(todayISO())}</p><h2>إنجاز اليوم</h2></div>
   <div class="ringbox" style="width:96px;height:96px">
    ${wp>=100?'<span class="pulse"></span>':''}
    <svg class="ring" viewBox="0 0 150 150" style="width:96px;height:96px">
     <circle class="tr" cx="75" cy="75" r="${R}" stroke-width="12"></circle>
     <circle class="arc" cx="75" cy="75" r="${R}" stroke="${g.c}" stroke-width="12"
      stroke-dasharray="${C}" stroke-dashoffset="${C}" data-off="${C*(1-wp/100)}"></circle></svg>
    <div class="rmid"><b class="num" data-to="${wp}" data-suffix="%">0%</b><span>الأسبوع</span></div></div>
  </div>
  <button class="btn" style="margin-top:16px" onclick="openLog()">سجّل إنجاز اليوم</button>
  ${today.list.length?`<div class="tlog"><div class="tlh">تسجيلات اليوم
    <span>تقدر تصحّحها أو تحذفها حتى ٣:٠٠ فجرًا</span></div>
   ${today.list.map(e=>`<div class="tent">
     <span class="dot" style="background:${e.kind==='read'?g.c:'var(--amber)'}"></span>
     <span class="nm">${e.kind==='read'?'قراءة':'سماع'} — ${esc((e.kind==='read'?p.read:p.listen)?.title||'')}</span>
     <span class="vv num">${e.v} ${e.kind==='read'?'ص':'د'}</span>
     <button class="qbtn" onclick="openEdit('${e.id}')" title="تصحيح">✎</button>
     <button class="qbtn del" onclick="delEntry('${e.id}')" title="حذف">✕</button></div>`).join('')}
   </div>`:''}
 </div>`}
function safeLink(u){return /^https?:\/\//i.test(String(u||''))?u:''}
function courseCard(c,kind,done,target,color,i){
 const p=pct(done,target),unit=kind==='read'?'صفحة':'دقيقة',lk=kind==='listen'?safeLink(c.link):'';
 return `<article class="wc rv" style="--c:${color};--i:${i}">
  <div class="cov">${cover(kind,color,p)}</div>
  <div class="wcb">
   <span class="kick"><span class="dot" style="background:${color}"></span>${kind==='read'?'مقرر قرائي':'مقرر سماعي'}</span>
   <h3>${esc(c.title)}</h3><p class="by">${esc(c.by)}</p>
   ${c.note?`<p class="note" onclick="this.classList.toggle('open')">${esc(c.note)}</p>`:''}
   ${kind==='listen'?(lk?`<a class="golink" href="${esc(lk)}" target="_blank" rel="noopener noreferrer">
     <span class="pl"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span>
     انتقل للمقطع <span class="arw">↗</span></a>`
    :'<p class="nolink">لم يُضف رابط المقطع بعد — راجع مشرفك.</p>'):''}
   <div class="prog">
    <div class="prow"><span><b>${done}</b> من ${target} ${unit}</span>
     <span class="num" style="font-weight:600;color:${color}">${p}%</span></div>
    <div class="bar"><i data-w="${p}" style="background:${color}"></i></div>
    <p style="font-size:11.5px;color:var(--muted);margin:8px 0 0">
     ${done>=target?'أتممته — بارك الله فيك.':`باقي <span class="num">${target-done}</span> ${unit} على إتمام مقرر الأسبوع.`}</p>
   </div></div></article>`}
function myLogView(){
 const me=S.me,rows=entriesOf(me.code).slice().sort((a,b)=>b.date.localeCompare(a.date));
 if(!rows.length)return '<div class="card empty rv">ما سجّلت شيئًا بعد. ابدأ من صفحة الأسبوع.</div>';
 const by={};rows.forEach(r=>(by[r.date]=by[r.date]||[]).push(r));
 const tot=rows.reduce((t,r)=>({r:t.r+(r.kind==='read'?r.v:0),l:t.l+(r.kind==='listen'?r.v:0)}),{r:0,l:0});
 const days=Object.keys(by).length;
 return `${statStrip([
  {lab:'مجموع الصفحات',val:tot.r,sub:'صفحة'},
  {lab:'مجموع الدقائق',val:tot.l,sub:'دقيقة',c:'var(--amber)'},
  {lab:'أيام سجّلت فيها',val:days,sub:'يوم',c:'var(--green)'}])}
 <div class="sec rv" style="--i:3"><h2>سجلي يومًا بيوم</h2><span class="chip">${days} يوم</span></div>
 ${Object.entries(by).map(([d,l],i)=>{const dr=l.filter(x=>x.kind==='read').reduce((t,x)=>t+x.v,0);
   const dl=l.filter(x=>x.kind==='listen').reduce((t,x)=>t+x.v,0);
   return `<div class="card rv" style="--i:${4+i};margin-bottom:11px;padding:15px 18px">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
     <b>${dayName(d)} <span class="num" style="color:var(--muted);font-size:12px">${d}</span></b>
     <span class="chip">${dr?`<span class="num">${dr}</span> صفحة`:''}${dr&&dl?' · ':''}${dl?`<span class="num">${dl}</span> دقيقة`:''}</span>
    </div>
    ${l.filter(x=>x.note).map(x=>`<p class="logben">
      <span class="dot" style="background:${x.kind==='read'?'var(--brand)':'var(--amber)'}"></span>
      ${esc(x.note)}</p>`).join('')}</div>`}).join('')}`}

/* ════════ الفوائد ════════ */
function benCard(e,i,opts){
 const s=studentByCode(e.code);if(!s)return '';
 const g=gradeById(s.grade),o=opts||{},pk=isPicked(e.id);
 return `<article class="ben rv ${pk?'picked':''}" style="--i:${i};--gc:${g.c}">
  ${pk?'<span class="ribbon">★ منتخبة</span>':''}
  <span class="quote">”</span>
  <p class="btxt">${esc(e.note)}</p>
  <div class="bfoot">
   <div class="bmeta">
    ${o.who?`<span class="avatar" style="--gc:${g.c};width:30px;height:30px;border-radius:10px;font-size:14px">${esc(s.name.trim()[0])}</span>
     <span class="bn"><b>${esc(s.name)}</b><span>${g.name}</span></span>`
     :`<span class="bn"><b>${esc(e.course||'')}</b><span>${e.kind==='read'?'قراءة':'سماع'} · <span class="num">${e.date}</span></span></span>`}
   </div>
   <div class="bact">
    ${o.who?`<span class="chip">${esc(e.course||'')}</span>`:''}
    ${o.pick?`<button class="star ${pk?'on':''}" onclick="togglePick('${e.id}')"
      title="${pk?'إزالة من المنتخبات':'ترشيح للمنتخبات'}">${pk?'★':'☆'}</button>`:''}
   </div></div></article>`}
function myBenView(){
 const list=benOf(S.me.code);
 if(!list.length)return '<div class="card empty rv">ما كتبت فائدة بعد — تُحفظ هنا تلقائيًا مع كل تسجيل.</div>';
 const mine=list.filter(e=>isPicked(e.id)).length;
 return `${statStrip([
   {lab:'فوائدك',val:list.length,sub:'فائدة'},
   {lab:'من مقررات',val:new Set(list.map(e=>e.course)).size,sub:'مقرر',c:'var(--amber)'},
   {lab:'اختيرت للمنتخبات',val:mine,sub:'فائدة',c:'var(--green)'}])}
 <div class="sec rv" style="--i:3"><h2>فوائدي</h2><span class="chip">من الأحدث</span></div>
 <div class="bens">${list.slice(0,BPAGE).map((e,i)=>benCard(e,4+i,{})).join('')}</div>
 ${list.length>BPAGE?moreBtn('b',list.length-BPAGE):''}`}
let BENF='all';
function setBenf(f){BENF=f;BPAGE=STEP;lastKey='';renderShell()}
function benView(){
 const isAdmin=S.role==='admin';
 const src=isAdmin?BEN:benGrade(supByCode(S.me.code).grade);
 let list=src, today=0;
 for(let i=0;i<src.length;i++){if(src[i].date===todayISO())today++;else break}
 if(BENF==='today')list=src.slice(0,today);
 else if(BENF==='picked')list=pickedEntries();
 const total=src.length;
 return `${statStrip([
   {lab:'فوائد اليوم',val:today,sub:'فائدة'},
   {lab:'إجمالي الفوائد',val:total,sub:'فائدة',c:'var(--amber)'},
   {lab:'المنتخبات',val:PICKS.length,sub:'من ٣',c:'var(--green)'}])}
 ${isAdmin?`<div class="pickbar rv" style="--i:3">
   <span class="si">★</span>
   <div style="flex:1"><b>ترشيح المنتخبات (${PICKS.length} من ٣)</b>
    <p>اضغط النجمة على أي فائدة لترشيحها — تظهر لكل الطلاب في تبويب «المنتخبات».</p></div></div>`:''}
 <div class="filters rv" style="--i:4">
  <button class="filter" aria-pressed="${BENF==='all'}" onclick="setBenf('all')">الكل</button>
  <button class="filter" aria-pressed="${BENF==='today'}" onclick="setBenf('today')">اليوم <span class="num">${today}</span></button>
  <button class="filter" aria-pressed="${BENF==='picked'}" onclick="setBenf('picked')">المنتخبة <span class="num">${PICKS.length}</span></button>
 </div>
 ${list.length?`<div class="bens">${list.slice(0,BPAGE).map((e,i)=>benCard(e,5+i,{who:1,pick:isAdmin})).join('')}</div>
   ${list.length>BPAGE?moreBtn('b',list.length-BPAGE):''}`
  :'<div class="card empty rv">ما فيه فوائد في هذا العرض.</div>'}`}
function picksView(){
 const ps=pickedEntries();
 return `<div class="hero rv"><div class="htop">
   <div><p class="hlab">اختيار المشرف التنفيذي من كل الصفوف</p><h2>منتخبات الأسبوع</h2></div>
   <div class="hst"><div><div class="hk">فوائد مختارة</div>
    <div class="hv am"><span class="num" data-to="${ps.length}">0</span> <small>من ٣</small></div></div></div></div></div>
 ${ps.length?`<div class="bens" style="margin-top:16px">${ps.map((e,i)=>{
   const s=studentByCode(e.code),g=gradeById(s.grade);
   return `<article class="ben big rv" style="--i:${i};--gc:${g.c}">
    <span class="ribbon">★ منتخبة</span><span class="quote">”</span>
    <p class="btxt">${esc(e.note)}</p>
    <div class="bfoot"><div class="bmeta">
      <span class="avatar" style="--gc:${g.c};width:34px;height:34px;border-radius:11px;font-size:15px">${esc(s.name.trim()[0])}</span>
      <span class="bn"><b>${esc(s.name)}</b><span>${g.name} · ${esc(e.course||'')}</span></span></div>
     <span class="chip">${e.kind==='read'?'قراءة':'سماع'}</span></div></article>`}).join('')}</div>`
  :'<div class="card empty rv" style="margin-top:16px">ما اختير شيء بعد — تظهر هنا فوائد مختارة من كل الصفوف.</div>'}`}
function togglePick(id){
 if(isPicked(id)){PICKS=PICKS.filter(x=>x!==id);lastKey='';renderShell();return toast('أُزيلت من المنتخبات.')}
 if(PICKS.length>=3)return toast('المنتخبات ٣ فقط — أزل واحدة أولًا.');
 PICKS.push(id);lastKey='';renderShell();
 const e=ENTRIES.find(x=>x.id===id),s=studentByCode(e.code);
 toast('رُشّحت فائدة '+s.name+' — ظهرت للجميع.')}

/* ════════ المتصدرون ════════ */
let BOARD='mine';
function setBoard(b){BOARD=b;lastKey='';renderShell()}
function boardView(){
 const meCode=S.role==='student'?S.me.code:null;
 const scope=BOARD==='all'?STUDENTS
  :S.role==='student'?codeOfGrade(S.me.grade)
  :S.role==='supervisor'?codeOfGrade(supByCode(S.me.code).grade):STUDENTS;
 const rows=scope.map(s=>{const d=doneOf(s.code),t=targetOf(s);
  return{s,p:weekPct(s),r:d.r,l:d.l,done:d.r>=t.r&&d.l>=t.l}})
  .sort((a,b)=>b.p-a.p||(b.r+b.l)-(a.r+a.l));
 const rank=c=>{const v=rows.find(x=>x.s.code===c);return 1+rows.filter(x=>x.p>v.p).length};
 return `<div class="filters rv">
   <button class="filter" aria-pressed="${BOARD==='mine'}" onclick="setBoard('mine')">
     ${S.role==='student'?'صفّي':'صفّي'} <span class="num">${(BOARD==='mine'?rows:scope).length}</span></button>
   <button class="filter" aria-pressed="${BOARD==='all'}" onclick="setBoard('all')">كل الصفوف <span class="num">${STUDENTS.length}</span></button>
  </div>
 <div class="card rv board" style="--i:1">
  <p class="eyebrow">الترتيب بنسبة إنجاز مقرر الأسبوع</p><h2>المتصدرون</h2>
  <div style="overflow-x:auto"><table style="margin-top:14px;min-width:480px">
   <thead><tr><th></th><th>الطالب</th><th>الصف</th><th>صفحات</th><th>دقائق</th><th>الإنجاز</th></tr></thead><tbody>
   ${rows.map((x,i)=>{const g=gradeById(x.s.grade);
    return `<tr class="${x.s.code===meCode?'me-row':''}">
     <td class="rank ${rank(x.s.code)<=3?'top':''}" data-l="الترتيب">${rank(x.s.code)}</td>
     <td data-l="الطالب" class="tdname">${esc(x.s.name)}${x.done?' <span class="pill ok">✓</span>':''}</td>
     <td data-l="الصف"><span class="dot" style="background:${g.c};margin-left:6px"></span>${g.name.replace(' متوسط','')}</td>
     <td class="num" data-l="صفحات">${x.r}</td><td class="num" data-l="دقائق">${x.l}</td>
     <td data-l="الإنجاز"><div style="display:flex;align-items:center;gap:8px">
      <div class="bar" style="width:70px"><i data-w="${x.p}" style="background:${g.c}"></i></div>
      <span class="num" style="font-size:12px;color:var(--muted)">${x.p}%</span></div></td></tr>`}).join('')}
  </tbody></table></div></div>`}

/* ════════ المشرف ════════ */
function heatColor(p){return p>=100?'#164F42':p>=66?'#3D7F6E':p>=33?'#7CAA9C':p>0?'#C2D8CF':'#EAEAE2'}
function matrixCard(list,i){
 const ws=WS(),ds=eachDay(ws,addD(ws,6));
 return `<div class="card rv" style="--i:${i}">
  <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
   <div><p class="eyebrow">كل مربع = يوم من الأسبوع · اضغطه للتفاصيل</p><h2>مصفوفة المتابعة</h2></div>
   <span class="chip">أسبوع <span class="num">${ws}</span></span></div>
  <div class="mwrap"><div class="matrix" style="margin-top:14px">
   <div></div>${ds.map(d=>`<div class="mh ${d===todayISO()?'now':''}">${DSH[dow(d)]}</div>`).join('')}
   ${list.slice(0,MROWS).map((s,r)=>{const g=gradeById(s.grade),t=targetOf(s),per=(t.r+t.l)/7||1;
    return `<div style="display:contents"><div class="mn" style="--gc:${g.c}">
      <span class="av">${esc(s.name.trim()[0])}</span><span>${esc(s.name)}</span></div>
     ${ds.map((d,k)=>{const x=dayOf(s.code,d),tot=x.r+x.l,rt=Math.round(tot/per*100);
       const inf=`${esc(s.name)} — ${dayName(d)} ${d}: ${x.r} صفحة · ${x.l} دقيقة`;
       return `<div class="mc ${d===todayISO()?'today':''}" style="--r:${r};--k:${k};background:${d>todayISO()?'#F1F4F9':heatColor(rt)}"
        role="button" tabindex="0" title="${inf}" data-inf="${inf}"
        onclick="cellInfo(this,'minfo')" onkeydown="if(event.key==='Enter')cellInfo(this,'minfo')"></div>`}).join('')}
    </div>`}).join('')}
  </div></div>
  ${list.length>MROWS?moreBtn('m',list.length-MROWS):''}
  <div class="cellinfo" id="minfo">اضغط أي مربع لعرض تفاصيل يومه.</div></div>`}
function miniBars(s){const ws=WS(),ds=eachDay(ws,addD(ws,6)),W=240,H=44,bw=W/7-6;
 const t=targetOf(s),per=(t.r+t.l)/7||1;
 return `<svg class="mini" viewBox="0 0 ${W} ${H}" aria-hidden="true">${ds.map((d,k)=>{
  const x=dayOf(s.code,d),tot=x.r+x.l,rt=Math.min(1,tot/per);
  const h=Math.max(5,H*.16+H*.72*rt),px=W-(k+1)*(bw+6)+3;
  return `<rect style="--j:${k}" x="${px}" y="${H-h}" width="${bw}" height="${h}" rx="3.5"
   fill="${d>todayISO()?'#F1F4F9':tot?heatColor(Math.round(tot/per*100)):'#E7EBF2'}"></rect>`}).join('')}</svg>`}
function scard(s,i){
 const g=gradeById(s.grade),wp=weekPct(s),ps=paceState(s),d=doneOf(s.code),t=targetOf(s);
 const C=2*Math.PI*20,la=lastActive(s.code);
 return `<button class="scard rv" style="--i:${i};--gc:${g.c}" onclick="viewStudent('${s.code}')">
  <div class="shead"><span class="avatar">${esc(s.name.trim()[0])}</span>
   <span class="nmx"><b>${esc(s.name)}</b><span>${g.name} · <span class="num">${s.code}</span></span></span>
   <span class="rw"><svg class="rlet" viewBox="0 0 46 46">
    <circle class="t" cx="23" cy="23" r="20"></circle>
    <circle class="a" cx="23" cy="23" r="20" stroke="${g.c}" stroke-dasharray="${C}"
     stroke-dashoffset="${C}" data-off="${C*(1-wp/100)}"></circle></svg><b>${wp}%</b></span></div>
  ${miniBars(s)}
  <div class="sfoot"><span class="pill ${ps.k==='done'?'ok':ps.k==='off'?'off':'mid'}">${ps.t}</span>
   <span class="num">${d.r}/${t.r}ص · ${d.l}/${t.l}د</span></div>
  <div class="sfoot" style="border:0;padding-top:6px;margin-top:0">
   <span>${la===0?'سجّل اليوم':la===1?'آخر تسجيل أمس':la>=14?'ما سجّل بعد':'آخر تسجيل قبل '+la+' أيام'}</span></div>
 </button>`}
let FILTER='all',PAGE=24,MROWS=30,BPAGE=24;
const STEP=24;
function setFilter(f){FILTER=f;PAGE=STEP;lastKey='';renderShell()}
function more(what){if(what==='s')PAGE+=STEP;else if(what==='b')BPAGE+=STEP;else MROWS=1e9;
 lastKey='';renderShell()}
function moreBtn(what,rest){return `<div style="text-align:center;margin-top:14px">
 <button class="btn outline sm" onclick="more('${what}')">عرض ${rest>STEP?STEP:rest} أكثر · باقٍ ${rest}</button></div>`}
function classView(){
 const all=myStudents(),ws=WS();
 const done=all.filter(s=>weekPct(s)>=100),late=all.filter(s=>paceState(s).k==='off');
 const idle=all.filter(s=>lastActive(s.code)>=2);
 const avg=all.length?Math.round(all.reduce((t,s)=>t+weekPct(s),0)/all.length):0;
 const sets={all,done,late,idle};
 const list=(sets[FILTER]||all).slice().sort((a,b)=>weekPct(b)-weekPct(a));
 const gname=S.role==='admin'?'كل الصفوف':gradeById(supByCode(S.me.code).grade).name;
 return `<div class="hero rv"><div class="htop">
   <div><p class="hlab">${dayName(todayISO())} · اليوم <span class="num">${dayIndex()}</span> من الأسبوع</p>
    <h2>${gname}</h2></div>
   <div class="hst">
    <div><div class="hk">متوسط الإنجاز</div><div class="hv am"><span class="num" data-to="${avg}" data-suffix="%">0%</span></div></div>
    <div><div class="hk">أتمّوا المقرر</div><div class="hv gr"><span class="num" data-to="${done.length}">0</span> <small>من ${all.length}</small></div></div>
    <div><div class="hk">متأخرون</div><div class="hv"><span class="num" data-to="${late.length}">0</span> <small>طالب</small></div></div>
    <div><div class="hk">باقي من الأسبوع</div><div class="hv"><span class="num" data-to="${daysLeft()}">0</span> <small>يوم</small></div></div>
   </div></div></div>
 ${idle.length?`<div class="alert rv" style="--i:1">
   <svg viewBox="0 0 24 24"><path d="M12 8v5M12 17h.01M10.3 3.9L2.4 18a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/></svg>
   <span><b>${idle.length}</b> ${idle.length===1?'طالب ما سجّل':'طلاب ما سجّلوا'} من يومين أو أكثر.</span>
   <span class="spacer"></span><button class="btn sm outline" onclick="setFilter('idle')">اعرضهم</button></div>`:''}
 ${matrixCard(all,2)}
 <div class="sec rv" style="--i:3"><h2>الطلاب</h2></div>
 <div class="filters rv" style="--i:4">
  ${[['all','الكل',all.length],['done','أتمّوا',done.length],['late','متأخرون',late.length],['idle','منقطعون',idle.length]]
   .map(([k,l,n])=>`<button class="filter" aria-pressed="${FILTER===k}" onclick="setFilter('${k}')">${l} <span class="num">${n}</span></button>`).join('')}</div>
 ${list.length?`<div class="scards">${list.slice(0,PAGE).map((s,i)=>scard(s,5+i)).join('')}</div>
   ${list.length>PAGE?moreBtn('s',list.length-PAGE):''}`
  :'<div class="card empty rv">ما فيه طلاب في هذي القائمة.</div>'}`}
function detailView(){
 const s=studentByCode(S.student),g=gradeById(s.grade),p=planOf(s.grade,WS());
 const d=doneOf(s.code),t=targetOf(s),wp=weekPct(s),ps=paceState(s);
 const rows=entriesOf(s.code).slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,14);
 return `<button class="back" onclick="S.student=null;renderShell()">→ رجوع</button>
 <div class="hero rv"><div class="htop">
  <div style="display:flex;align-items:center;gap:13px">
   <span class="avatar" style="--gc:${g.c};width:54px;height:54px;border-radius:17px;font-size:24px">${esc(s.name.trim()[0])}</span>
   <div><p class="hlab">${g.name} · الرمز <span class="num">${s.code}</span></p><h2>${esc(s.name)}</h2></div></div>
  <div class="hst">
   <div><div class="hk">إنجاز الأسبوع</div><div class="hv am"><span class="num" data-to="${wp}" data-suffix="%">0%</span></div></div>
   <div><div class="hk">قراءة</div><div class="hv gr"><span class="num" data-to="${d.r}">0</span> <small>من ${t.r}</small></div></div>
   <div><div class="hk">سماع</div><div class="hv"><span class="num" data-to="${d.l}">0</span> <small>من ${t.l}</small></div></div>
  </div></div>
  ${weekTrack(s)}
  <div class="cellinfo" id="winfo" style="background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.14);color:#9CB2A9">
   اضغط أي يوم لتفاصيله.</div></div>
 <div class="card rv" style="--i:1;margin-top:14px">
  <p class="eyebrow">حالته</p><h2>${ps.t}</h2>
  <div class="grid g2" style="margin-top:14px">
   ${p.read?`<div><div style="display:flex;justify-content:space-between;font-size:13px">
     <span>${esc(p.read.title)}</span><span class="num">${d.r}/${t.r} ص</span></div>
     <div class="bar" style="margin-top:6px"><i data-w="${pct(d.r,t.r)}" style="background:${g.c}"></i></div></div>`:''}
   ${p.listen?`<div><div style="display:flex;justify-content:space-between;font-size:13px">
     <span>${esc(p.listen.title)}</span><span class="num">${d.l}/${t.l} د</span></div>
     <div class="bar" style="margin-top:6px"><i data-w="${pct(d.l,t.l)}" style="background:var(--amber)"></i></div></div>`:''}
  </div></div>
 <div class="card rv" style="--i:2;margin-top:14px"><p class="eyebrow">ما استفاده هذا الأسبوع</p><h2>فوائده</h2>
  <div class="bens" style="margin-top:12px">${benOf(s.code).slice(0,6).map((e,i)=>benCard(e,i,{})).join('')
   ||'<div class="empty">ما كتب فائدة بعد.</div>'}</div></div>
 <div class="card rv" style="--i:3;margin-top:14px"><p class="eyebrow">آخر التسجيلات</p><h2>سجله</h2>
  ${rows.length?rows.map(r=>`<div class="tent" style="padding:11px 2px">
    <span class="dot" style="background:${r.kind==='read'?g.c:'var(--amber)'}"></span>
    <span class="nm">${r.kind==='read'?'قراءة':'سماع'} · <span class="num">${r.date}</span></span>
    <span class="chip">${r.v} ${r.kind==='read'?'صفحة':'دقيقة'}</span></div>`).join('')
   :'<div class="empty">لا يوجد تسجيلات.</div>'}</div>`}

/* ════════ المشرف التنفيذي: خطة الأسبوع ════════ */
function planView(){
 const ws=WS();
 return `<div class="hero rv"><div class="htop">
   <div><p class="hlab">أسبوع <span class="num">${ws}</span> إلى <span class="num">${addD(ws,6)}</span></p>
    <h2>مقررات الأسبوع</h2></div>
   <div class="hst">
    <div><div class="hk">صفوف</div><div class="hv"><span class="num" data-to="${GRADES.length}">0</span></div></div>
    <div><div class="hk">طلاب</div><div class="hv gr"><span class="num" data-to="${STUDENTS.length}">0</span></div></div>
    <div><div class="hk">اليوم من الأسبوع</div><div class="hv am"><span class="num" data-to="${dayIndex()}">0</span> <small>من ٧</small></div></div>
   </div></div></div>
 <div class="gcards">${GRADES.map((g,i)=>{const p=planOf(g.id,ws),st=codeOfGrade(g.id);
   const done=st.filter(s=>weekPct(s)>=100).length;
   const avg=st.length?Math.round(st.reduce((t,s)=>t+weekPct(s),0)/st.length):0;
   return `<div class="card rv" style="--i:${1+i};border-right:4px solid ${g.c}">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
     <div><p class="eyebrow"><span class="num">${st.length}</span> طالب · متوسط الإنجاز <span class="num">${avg}%</span></p>
      <h2 style="color:${g.c}">${g.name}</h2></div>
     <button class="btn sm" onclick="openPlan('${g.id}')">${p.read||p.listen?'تعديل المقرر':'+ حدد المقرر'}</button></div>
    ${p.read||p.listen?`<div style="margin-top:14px">
      ${p.read?`<div class="tent" style="padding:11px 2px"><span class="dot" style="background:${g.c}"></span>
        <span class="nm"><b>${esc(p.read.title)}</b> — ${esc(p.read.by)}</span>
        <span class="chip"><span class="num">${p.read.target}</span> صفحة</span></div>`:''}
      ${p.listen?`<div class="tent" style="padding:11px 2px"><span class="dot" style="background:var(--amber)"></span>
        <span class="nm"><b>${esc(p.listen.title)}</b> — ${esc(p.listen.by)}</span>
        ${safeLink(p.listen.link)?`<a class="qbtn" href="${esc(safeLink(p.listen.link))}" target="_blank"
          rel="noopener noreferrer" title="فتح المقطع" style="text-decoration:none;display:grid;place-items:center">↗</a>`
         :'<span class="pill off">بلا رابط</span>'}
        <span class="chip"><span class="num">${p.listen.target}</span> دقيقة</span></div>`:''}
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-top:11px">
       <span>أتمّوا: <span class="num" style="color:var(--green)">${done}</span> من ${st.length}</span>
       <span>اقتراح اليوم: <span class="num">${Math.ceil(((p.read?p.read.target:0)+(p.listen?p.listen.target:0))/7)}</span> وحدة</span></div>
      <div class="bar" style="margin-top:8px"><i data-w="${avg}" style="background:${g.c}"></i></div>
     </div>`:'<div class="empty">ما حُدد مقرر لهذا الصف — الطلاب ينتظرون.</div>'}
   </div>`}).join('')}</div>`}
function peopleView(){
 return `<div class="sec rv"><h2>الصفوف والمشرفون</h2>
   <button class="btn sm" onclick="openAdd()">+ إضافة طالب</button></div>
 <div class="gcards">${GRADES.map((g,i)=>{const st=codeOfGrade(g.id),sv=SUPERVISORS.find(x=>x.grade===g.id);
  return `<div class="card rv" style="--i:${i};border-right:4px solid ${g.c}">
   <div><p class="eyebrow">${sv?esc(sv.name)+' · '+sv.code:'بلا مشرف'}</p>
    <h2 style="color:${g.c}">${g.name}</h2></div>
   <div style="margin-top:12px">${st.map(s=>`<div class="tent" style="padding:9px 2px">
     <span class="avatar" style="--gc:${g.c};width:28px;height:28px;border-radius:9px;font-size:13px">${esc(s.name.trim()[0])}</span>
     <span class="nm">${esc(s.name)}</span><span class="chip num">${s.code}</span>
     <button class="qbtn" onclick="viewStudent('${s.code}')">↩</button></div>`).join('')||'<div class="empty">لا طلاب.</div>'}</div>
  </div>`}).join('')}</div>`}

/* ════════ النوافذ ════════ */
function openLog(){const p=planOf(S.me.grade,WS());
 S.modal={t:'log',kind:p.read?'read':'listen'};renderModal()}
function openEdit(id){S.modal={t:'edit',id};renderModal()}
function openPlan(g){const p=planOf(g,WS());
 S.modal={t:'plan',g,hasR:!!p.read,hasL:!!p.listen};renderModal()}
function openAdd(){S.modal={t:'add',g:GRADES[0].id};renderModal()}
function closeModal(){S.modal=null;renderModal()}
function modalHTML(){const m=S.modal;if(!m)return '';let b='';
 if(m.t==='log'){const p=planOf(S.me.grade,WS()),sg=suggest(S.me);
  const c=m.kind==='read'?p.read:p.listen;
  b=`<h3>سجّل إنجاز اليوم</h3><p class="sub">${dayName(todayISO())} · <span class="num">${todayISO()}</span></p>
   ${p.read&&p.listen?`<label>نوع الإنجاز</label><div class="segv">
     <button aria-pressed="${m.kind==='read'}" onclick="S.modal.kind='read';renderModal()">
      <b>قراءة</b><span>${esc(p.read.title)}</span></button>
     <button aria-pressed="${m.kind==='listen'}" onclick="S.modal.kind='listen';renderModal()">
      <b>سماع</b><span>${esc(p.listen.title)}</span></button></div>`:''}
   <label for="v">${m.kind==='read'?'كم صفحة قرأت اليوم؟':'كم دقيقة سمعت اليوم؟'}</label>
   <div style="display:flex;align-items:center;gap:10px">
    <input id="v" type="number" min="1" inputmode="numeric" placeholder="${m.kind==='read'?(sg.r||10):(sg.l||15)}">
    <span class="chip" style="white-space:nowrap">${m.kind==='read'?'صفحة':'دقيقة'}</span></div>
   <p style="font-size:12.5px;color:var(--muted);margin:9px 0 0">
    اقتراح اليوم <span class="num">${m.kind==='read'?sg.r:sg.l}</span> ${m.kind==='read'?'صفحة':'دقيقة'}.</p>
   ${m.kind==='listen'&&c&&safeLink(c.link)?`<a class="golink sm" href="${esc(safeLink(c.link))}" target="_blank" rel="noopener noreferrer">
     <span class="pl"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span>
     افتح المقطع <span class="arw">↗</span></a>`:''}
   <label for="nt">فائدة استفدتها اليوم <span style="color:var(--rose)">*</span></label>
   <textarea id="nt" rows="3" maxlength="400" oninput="benCount()"
     placeholder="اكتب فائدة واحدة بأسلوبك: ماذا تعلّمت من «${esc(c?c.title:'')}» اليوم؟"></textarea>
   <div class="bhint"><span id="bc">٠ حرف</span><span>الفائدة شرط لحفظ الإنجاز · تُحفظ في «فوائدي»</span></div>
   <div class="row"><button class="btn outline" onclick="closeModal()">إلغاء</button>
   <button class="btn" onclick="saveLog()">حفظ الإنجاز والفائدة</button></div>`}
 if(m.t==='edit'){const e=ENTRIES.find(x=>x.id===m.id);
  if(!e)b='<h3>غير موجود</h3><div class="row"><button class="btn" onclick="closeModal()">إغلاق</button></div>';
  else b=`<h3>تصحيح تسجيل اليوم</h3><p class="sub">${e.kind==='read'?'قراءة':'سماع'} · ${dayName(e.date)}</p>
   <label for="ev">${e.kind==='read'?'عدد الصفحات':'عدد الدقائق'}</label>
   <input id="ev" type="number" min="1" value="${e.v}">
   <label for="en">فائدتك</label>
   <textarea id="en" rows="3" maxlength="400">${esc(e.note||'')}</textarea>
   <p style="font-size:12px;color:var(--muted);margin:9px 0 0">
    التصحيح لتسجيلات اليوم فقط. بعد ٣:٠٠ فجرًا يُقفل اليوم.</p>
   <div class="row"><button class="btn outline" onclick="delEntry('${e.id}')">حذف</button>
   <button class="btn" onclick="saveEdit()">حفظ التصحيح</button></div>`}
 if(m.t==='plan'){const g=gradeById(m.g),p=planOf(m.g,WS());
  b=`<h3>مقرر الأسبوع — ${g.name}</h3>
   <p class="sub">يظهر لكل طلاب الصف فورًا، ويُحسب عليه اقتراح اليوم.</p>
   <div class="segv" style="margin-top:14px">
    <button aria-pressed="${m.hasR}" onclick="keepPlan();S.modal.hasR=!S.modal.hasR;renderModal()">
     <b>${m.hasR?'✓ ':''}مقرر قرائي</b><span>كتاب يُقرأ بعدد صفحات</span></button>
    <button aria-pressed="${m.hasL}" onclick="keepPlan();S.modal.hasL=!S.modal.hasL;renderModal()">
     <b>${m.hasL?'✓ ':''}مقرر سماعي</b><span>سلسلة تُسمع بعدد دقائق</span></button></div>
   ${m.hasR?`<label for="rt">اسم الكتاب</label>
    <input id="rt" type="text" value="${esc(m.rt_!==undefined?m.rt_:(p.read?p.read.title:''))}" placeholder="مثال: قصة اختراع">
    <label for="rb">المؤلف</label>
    <input id="rb" type="text" value="${esc(m.rb_!==undefined?m.rb_:(p.read?p.read.by:''))}">
    <label for="rn">نبذة للطالب</label>
    <textarea id="rn" rows="2" placeholder="لماذا هذا الكتاب؟">${esc(m.rn_!==undefined?m.rn_:(p.read?p.read.note:''))}</textarea>
    <label for="rv2">مقدار الأسبوع</label>
    <div style="display:flex;align-items:center;gap:10px">
     <input id="rv2" type="number" min="1" value="${m.rv_!==undefined?m.rv_:(p.read?p.read.target:70)}">
     <span class="chip">صفحة</span></div>`:''}
   ${m.hasL?`<label for="lt">اسم المقرر السماعي</label>
    <input id="lt" type="text" value="${esc(m.lt_!==undefined?m.lt_:(p.listen?p.listen.title:''))}">
    <label for="lb">الملقي</label>
    <input id="lb" type="text" value="${esc(m.lb_!==undefined?m.lb_:(p.listen?p.listen.by:''))}">
    <label for="ln">نبذة للطالب</label>
    <textarea id="ln" rows="2">${esc(m.ln_!==undefined?m.ln_:(p.listen?p.listen.note:''))}</textarea>
    <label for="ll">رابط المقطع <span style="color:var(--rose)">*</span></label>
    <input id="ll" type="text" dir="ltr" placeholder="https://..."
      value="${esc(m.ll_!==undefined?m.ll_:(p.listen?(p.listen.link||''):''))}">
    <p style="font-size:11.5px;color:var(--muted);margin:6px 0 0">
     يظهر للطالب كزر «انتقل للمقطع» في بطاقة المقرر وعند التسجيل.</p>
    <label for="lv">مقدار الأسبوع</label>
    <div style="display:flex;align-items:center;gap:10px">
     <input id="lv" type="number" min="1" value="${m.lv_!==undefined?m.lv_:(p.listen?p.listen.target:60)}">
     <span class="chip">دقيقة</span></div>`:''}
   ${!m.hasR&&!m.hasL?'<p style="color:var(--rose);font-size:13px;margin-top:14px">اختر مقررًا واحدًا على الأقل.</p>':''}
   <div class="row"><button class="btn outline" onclick="closeModal()">إلغاء</button>
   <button class="btn" onclick="savePlan()">حفظ المقرر</button></div>`}
 if(m.t==='add'){
  b=`<h3>إضافة طالب</h3><p class="sub">الرمز الرباعي يُولَّد تلقائيًا ويُسلَّم له.</p>
   <label for="nn">الاسم</label><input id="nn" type="text" placeholder="الاسم الثلاثي">
   <label for="ng">الصف</label><select id="ng">${GRADES.map(g=>`<option value="${g.id}">${g.name}</option>`).join('')}</select>
   <div class="row"><button class="btn outline" onclick="closeModal()">إلغاء</button>
   <button class="btn" onclick="savePerson()">إضافة</button></div>`}
 return `<div class="ov" onclick="if(event.target===this)closeModal()"><div class="modal" role="dialog" aria-modal="true">${b}</div></div>`}
function renderModal(){$('mroot').innerHTML=modalHTML();
 const f=document.querySelector('.modal input,.modal select');f&&f.focus()}
function benCount(){const n=($('nt').value||'').trim().length,el=$('bc');
 if(el)el.textContent=n+' حرف'+(n<15?' — أكمل قليلًا':' ✓')}
function saveLog(){const v=parseInt($('v').value,10);if(!v||v<1){$('v').focus();return}
 const note=($('nt').value||'').trim();
 if(note.length<15){$('nt').focus();return toast('اكتب فائدتك أولًا — سطر واحد يكفي.')}
 const p=planOf(S.me.grade,WS()),c=S.modal.kind==='read'?p.read:p.listen;
 ENTRIES.push({id:newEid(),code:S.me.code,date:todayISO(),kind:S.modal.kind,v,
  note,course:c?c.title:''});
 reindex();S.modal=null;renderModal();lastKey='';renderShell();
 toast(weekPct(S.me)>=100?'ما شاء الله — أتممت مقرر الأسبوع!':'انحفظ إنجازك.')}
function saveEdit(){const e=ENTRIES.find(x=>x.id===S.modal.id);if(!e)return closeModal();
 const v=parseInt($('ev').value,10);if(!v||v<1){$('ev').focus();return}
 const nt=($('en')&&$('en').value||'').trim();
 if(nt.length<15){$('en')&&$('en').focus();return toast('الفائدة لا تقل عن سطر.')}
 e.v=v;e.note=nt;reindex();S.modal=null;renderModal();lastKey='';renderShell();toast('صُحّح التسجيل.')}
function delEntry(id){ENTRIES=ENTRIES.filter(x=>x.id!==id);reindex();
 S.modal=null;renderModal();lastKey='';renderShell();toast('حُذف التسجيل.')}
function keepPlan(){const g=i=>$(i);
 ['rt','rb','rn','rv2','lt','lb','ln','lv','ll'].forEach(i=>{if(g(i)){
  const key={rt:'rt_',rb:'rb_',rn:'rn_',rv2:'rv_',lt:'lt_',lb:'lb_',ln:'ln_',lv:'lv_',ll:'ll_'}[i];
  S.modal[key]=g(i).value}})}
function savePlan(){const m=S.modal;if(!m.hasR&&!m.hasL)return toast('اختر مقررًا واحدًا على الأقل.');
 const read=m.hasR?{title:($('rt').value||'').trim(),by:($('rb').value||'').trim()||'—',
  note:($('rn').value||'').trim(),target:Math.max(1,+$('rv2').value||70)}:null;
 const listen=m.hasL?{title:($('lt').value||'').trim(),by:($('lb').value||'').trim()||'—',
  note:($('ln').value||'').trim(),target:Math.max(1,+$('lv').value||60),
  link:($('ll').value||'').trim()}:null;
 if(read&&!read.title){$('rt').focus();return toast('اكتب اسم الكتاب.')}
 if(listen&&!listen.title){$('lt').focus();return toast('اكتب اسم المقرر السماعي.')}
 if(listen&&!listen.link){$('ll').focus();return toast('رابط المقطع مطلوب للمقرر السماعي.')}
 if(listen&&!/^https?:\/\//i.test(listen.link)){$('ll').focus();
  return toast('الرابط يبدأ بـ https:// — تأكد منه.')}
 PLAN[m.g+'|'+WS()]={read,listen};
 reindex();S.modal=null;renderModal();lastKey='';renderShell();
 toast('حُدّد مقرر '+gradeById(m.g).name+' — ظهر للطلاب الآن.')}
function newCode(){let c;do{c=String(Math.floor(3000+Math.random()*6000))}
 while(studentByCode(c)||supByCode(c)||c===ADMIN.code);return c}
function savePerson(){const n=($('nn').value||'').trim();if(!n){$('nn').focus();return}
 const g=$('ng').value,sv=SUPERVISORS.find(x=>x.grade===g);
 const code=newCode();STUDENTS.push({code,name:n,grade:g,supervisor:sv?sv.code:''});
 reindex();S.modal=null;renderModal();lastKey='';renderShell();toast('أُضيف '+n+' — رمزه '+code)}

/* ════════ الرسم والحركة ════════ */
function cellInfo(el,box){const b=$(box);if(!b)return;
 b.textContent=el.dataset.inf;b.classList.remove('lit');void b.offsetWidth;b.classList.add('lit')}
function paintWithin(root,anim){
 root.querySelectorAll('[data-w]').forEach((el,i)=>{const w=el.dataset.w+'%';
  anim?setTimeout(()=>el.style.width=w,60+i*30):el.style.width=w});
 root.querySelectorAll('[data-off]').forEach(el=>{const o=el.dataset.off;
  anim?setTimeout(()=>el.style.strokeDashoffset=o,110):el.style.strokeDashoffset=o});
 root.querySelectorAll('[data-to]').forEach(el=>anim&&!reduced?countEl(el)
  :el.textContent=el.dataset.to+(el.dataset.suffix||''))}
function countEl(el){if(el._c)return;el._c=1;
 const to=+el.dataset.to,sfx=el.dataset.suffix||'',dur=to>200?1000:780,t0=performance.now();
 const step=t=>{const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);
  el.textContent=Math.round(to*e)+sfx;if(k<1)requestAnimationFrame(step)};
 setTimeout(()=>requestAnimationFrame(step),110)}
let IO=null;
function observeReveals(anim){
 if(IO){IO.disconnect();IO=null}
 const nodes=[...document.querySelectorAll('main .rv')];
 if(!anim||reduced){nodes.forEach(n=>n.classList.add('in'));paintWithin(document,false);return}
 IO=new IntersectionObserver(es=>{es.forEach(x=>{if(!x.isIntersecting)return;
  x.target.classList.add('in');paintWithin(x.target,true);IO.unobserve(x.target)})},
  {rootMargin:'40px 0px -6% 0px',threshold:.04});
 nodes.forEach(n=>IO.observe(n));
 setTimeout(()=>paintWithin(document,false),2200)}
function moveTab(){const t=$('tabs');if(!t)return;
 const a=t.querySelector('[aria-selected="true"]'),ind=$('tind');if(!a||!ind)return;
 ind.style.width=a.offsetWidth+'px';ind.style.right=(t.scrollWidth-a.offsetLeft-a.offsetWidth)+'px'}
let lastKey='';
function renderShell(){
 if(!S.role)return addEventListener('pagehide',()=>{if(IO){IO.disconnect();IO=null}},{passive:true});
drawLogin();
 const key=[S.role,S.view,S.student].join('|'),anim=key!==lastKey;lastKey=key;
 let main='';
 if(S.role==='student')main=tabs([{id:'week',label:'أسبوعي'},{id:'ben',label:'فوائدي'},
   {id:'picks',label:'المنتخبات'},{id:'log',label:'سجلي'},{id:'board',label:'المتصدرون'}])
  +(S.view==='log'?myLogView():S.view==='ben'?myBenView():S.view==='picks'?picksView()
   :S.view==='board'?boardView():weekView());
 if(S.role==='supervisor')main=tabs([{id:'class',label:'صفّي'},{id:'ben',label:'فوائد طلابي'},
   {id:'picks',label:'المنتخبات'},{id:'board',label:'المتصدرون'}])
  +(S.student?detailView():S.view==='ben'?benView():S.view==='picks'?picksView()
   :S.view==='board'?boardView():classView());
 if(S.role==='admin')main=tabs([{id:'plan',label:'مقرر الأسبوع'},{id:'class',label:'المتابعة'},
   {id:'ben',label:'الفوائد'},{id:'picks',label:'المنتخبات'},{id:'people',label:'الطلاب'},{id:'board',label:'المتصدرون'}])
  +(S.student?detailView():S.view==='class'?classView():S.view==='ben'?benView()
   :S.view==='picks'?picksView():S.view==='people'?peopleView()
   :S.view==='board'?boardView():planView());
 shell().innerHTML=topbar()+`<main class="wrap ${anim?'anim':''}" style="padding-bottom:70px">${main}</main>`;
 requestAnimationFrame(()=>{moveTab();observeReveals(anim)})}
document.addEventListener('pointerdown',e=>{
 const b=e.target.closest('.btn,.filter,.qbtn');if(!b||reduced)return;
 const r=b.getBoundingClientRect(),d=document.createElement('span');
 d.className='ripple';d.style.left=(e.clientX-r.left)+'px';d.style.top=(e.clientY-r.top)+'px';
 d.style.width=d.style.height='18px';
 if(!b.classList.contains('btn')||b.classList.contains('outline'))d.style.background='rgba(47,75,216,.18)';
 b.appendChild(d);setTimeout(()=>d.remove(),560)},{passive:true});
let _rz;addEventListener('resize',()=>{clearTimeout(_rz);_rz=setTimeout(moveTab,120)},{passive:true});
document.addEventListener('keydown',e=>{
 if(!S.role){if(/^[0-9]$/.test(e.key))tap(null,e.key);
  else if(e.key==='Backspace')tap(null,'back');else if(e.key==='Enter')login();return}
 if(e.key==='Escape')closeModal()});
drawLogin();
