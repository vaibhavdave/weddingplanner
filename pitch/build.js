const pptxgen=require('pptxgenjs');
const React=require('react'),RDS=require('react-dom/server'),sharp=require('sharp');
const fa=require('react-icons/fa');
const SK=process.env.SKILL||require('fs').readdirSync('/root/.claude/skills/synced').map(d=>'/root/.claude/skills/synced/'+d+'/pptx').find(p=>require('fs').existsSync(p+'/scripts/apply_theme.js'));
const {applyTheme}=require(SK+'/scripts/apply_theme.js');

const THEME={name:'WedVerse Pitch',headFontFace:'Cambria',bodyFontFace:'Calibri',colors:{
 dk1:'1B1033',lt1:'FFFFFF',dk2:'3A2278',lt2:'F4EFFF',accent1:'B98A2E',accent2:'5B52E0',accent3:'E58AA3',accent4:'3AA68A',accent5:'E9C978',accent6:'8B5CF6',hlink:'5B52E0',folHlink:'8B5CF6'}};
const pres=new pptxgen();pres.layout='LAYOUT_16x9';pres.theme={headFontFace:'Cambria',bodyFontFace:'Calibri'};
pres.title='WedVerse AI — Investor Pitch';pres.author='WedVerse AI';
const C=pres.SchemeColor;

pres.defineSlideMaster({title:'DARK',background:{color:'1B1033'},objects:[],
  slideNumber:{x:9.1,y:5.2,w:.5,h:.3,fontSize:10,color:'B8AEDD'},
  placeholders:[{placeholder:{options:{name:'title',type:'title',x:.6,y:.4,w:8.8,h:.9,fontSize:34,bold:true,color:C.background1,valign:'top',margin:0},text:''}}]});
pres.defineSlideMaster({title:'LIGHT',background:{color:'FFFFFF'},objects:[],
  slideNumber:{x:9.1,y:5.2,w:.5,h:.3,fontSize:10,color:'8A7FB0'},
  placeholders:[{placeholder:{options:{name:'title',type:'title',x:.6,y:.4,w:8.8,h:.8,fontSize:32,bold:true,color:C.text1,valign:'top',margin:0},text:''}}]});

async function icon(name,color='FFFFFF'){
  const svg=RDS.renderToStaticMarkup(React.createElement(fa[name],{color:'#'+color,size:256}));
  const b=await sharp(Buffer.from(svg)).png().toBuffer();return 'image/png;base64,'+b.toString('base64');
}
const circ=async(s,ic,x,y,d,bg,fg='FFFFFF',nm)=>{
  s.addShape(pres.ShapeType.ellipse,{x,y,w:d,h:d,fill:{color:bg},line:{color:bg},objectName:'icon-bg-'+nm});
  s.addImage({data:await icon(ic,fg),x:x+d*.27,y:y+d*.27,w:d*.46,h:d*.46,objectName:'icon-'+nm,altText:nm});
};
const T=(s,t,o)=>s.addText(t,Object.assign({isTextBox:true,margin:0,fontFace:'Calibri'},o));
const sh=()=>({type:'outer',color:'1B1033',opacity:.12,blur:8,offset:2,angle:90});
const card=(s,x,y,w,h,nm,fill=C.background2)=>s.addShape(pres.ShapeType.roundRect,{x,y,w,h,rectRadius:.12,fill:{color:fill},line:{color:fill},shadow:sh(),objectName:nm});

const H=(s,t,dark,o={})=>s.addText(t,Object.assign({placeholder:'title',x:.6,y:.4,w:8.8,h:.8,fontSize:32,bold:true,color:dark?'FFFFFF':'1B1033',fontFace:'Cambria',valign:'top',margin:0},o));
(async()=>{
// 1 TITLE
pres.addSection({title:'Opening'});
let s=pres.addSlide({masterName:'DARK',sectionTitle:'Opening'});
s.addImage({path:'img/c-entrance.png',x:5.2,y:0,w:4.8,h:5.625,sizing:{type:'cover',w:4.8,h:5.625},objectName:'hero-3d',altText:'3D preview of a pastel wedding hall'});
s.addShape(pres.ShapeType.rect,{x:5.2,y:0,w:4.8,h:5.625,fill:{color:'1B1033',transparency:55},line:{color:'1B1033',transparency:100},objectName:'hero-tint'});
T(s,'PLAN · VISUALIZE · CELEBRATE',{x:.6,y:1.2,w:4.4,h:.3,fontSize:12,bold:true,color:C.accent5,charSpacing:4});
H(s,'WedVerse AI',true,{x:.6,y:1.6,w:4.5,h:.9,fontSize:46});
T(s,'See your wedding before you spend on it.',{x:.6,y:2.6,w:4.3,h:.9,fontSize:22,italic:true,color:C.background1,fontFace:'Cambria'});
T(s,'Seed pitch  ·  Ask: ₹1.5 Cr for 5%',{x:.6,y:4.5,w:4.3,h:.35,fontSize:14,color:C.accent5,bold:true});
s.addNotes('OPEN (15 sec): "Sharks, a typical Indian family will spend ₹25 lakh on a wedding. Today they sign that cheque before they have seen a single thing. We fix that." Pause, then move on.');

// 2 HOOK
s=pres.addSlide({masterName:'DARK',sectionTitle:'Opening'});
H(s,'A ₹25 lakh decision with no preview',true);
T(s,'₹25,00,000',{x:.6,y:1.6,w:5.2,h:1.3,fontSize:72,bold:true,color:C.accent5,fontFace:'Cambria'});
T(s,'average spend on a single big-fat Indian wedding — committed months before anyone sees the décor, the layout or the final bill.',{x:.6,y:3.0,w:5.0,h:1.2,fontSize:18,color:C.background1});
const hk=[['Photos & Pinterest','Inspiration, not your venue'],['Verbal quotes','Hard to compare, easy to inflate'],['Day-of surprises','"This isn\'t what we imagined"']];
for(let i=0;i<3;i++){const y=1.6+i*1.1;card(s,6.2,y,3.2,.95,'pain-'+i,'2A1B54');
  T(s,hk[i][0],{x:6.4,y:y+.14,w:2.9,h:.35,fontSize:16,bold:true,color:C.accent5});
  T(s,hk[i][1],{x:6.4,y:y+.5,w:2.9,h:.35,fontSize:13,color:C.background1});}
s.addNotes('Make it personal: "Imagine buying a car you can only see after you have paid." Let the number land.');

// 3 PROBLEM
pres.addSection({title:'Problem & Solution'});
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'Problem & Solution'});
H(s,'Three problems every couple faces',false);
const pr=[['FaEyeSlash','Imagination gap','Couples cannot picture their own venue with a theme, layout and lighting.','E58AA3'],
 ['FaBalanceScale','Quote chaos','Every décor vendor quotes differently. No way to compare like-for-like.','5B52E0'],
 ['FaExclamationTriangle','Budget overruns','Changes after booking cost 20–30% more. Planners juggle it in spreadsheets.','B98A2E']];
for(let i=0;i<3;i++){const x=.6+i*2.97;card(s,x,1.5,2.75,3.2,'prob-'+i);
  await circ(s,pr[i][0],x+.25,1.75,.7,pr[i][3],'FFFFFF','prob-'+i);
  T(s,pr[i][1],{x:x+.25,y:2.7,w:2.3,h:.4,fontSize:20,bold:true,color:C.text1,fontFace:'Cambria'});
  T(s,pr[i][2],{x:x+.25,y:3.2,w:2.3,h:1.3,fontSize:14,color:C.text2,valign:'top'});}
s.addNotes('Three pains: they cannot see it, they cannot compare it, they cannot control the cost. Planners feel all three, every week.');

// 4 SOLUTION
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'Problem & Solution'});
H(s,'WedVerse AI: preview, optimise, book',false);
const st=[['FaUpload','1  Upload venue','Photos, floor plan or video become a 3D digital twin.','5B52E0'],
 ['FaCube','2  Design in 3D','Swap themes, layouts and lighting in seconds. Walk it in VR.','B98A2E'],
 ['FaCalculator','3  Optimise budget','Live quote, material list and AI savings ideas as you design.','3AA68A']];
for(let i=0;i<3;i++){const x=.6+i*3.05;
  await circ(s,st[i][0],x,1.6,.9,st[i][3],'FFFFFF','step-'+i);
  T(s,st[i][1],{x,y:2.7,w:2.7,h:.4,fontSize:20,bold:true,color:C.text1,fontFace:'Cambria'});
  T(s,st[i][2],{x,y:3.2,w:2.7,h:1,fontSize:14,color:C.text2,valign:'top'});
  if(i<2)s.addImage({data:await icon('FaChevronRight','B98A2E'),x:x+2.55,y:1.9,w:.3,h:.3,objectName:'arrow-'+i});}
card(s,.6,4.3,8.8,.6,'tagline',C.text1);
T(s,'Couples preview, customise and optimise their wedding in 3D — before booking a single vendor.',{x:.8,y:4.3,w:8.4,h:.6,fontSize:14,color:C.background1,valign:'middle',italic:true});
s.addNotes('Walk the three steps in one breath. Then go to the live demo.');

// 5 PRODUCT
pres.addSection({title:'Product'});
s=pres.addSlide({masterName:'DARK',sectionTitle:'Product'});
H(s,'Live product — not a mock-up',true);
const im=[['img/c-entrance.png','Royal Pastel · banquet'],['img/c-mandap.png','Mandap close-up'],['img/c-midnight.png','Midnight Gala theme']];
for(let i=0;i<3;i++){const x=.6+i*3.0;
  s.addImage({path:im[i][0],x,y:1.45,w:2.8,h:1.75,sizing:{type:'cover',w:2.8,h:1.75},objectName:'shot-'+i,altText:im[i][1]});
  T(s,im[i][1],{x,y:3.25,w:2.8,h:.3,fontSize:12,color:C.accent5,bold:true});}
const ft=['Real-time WebGL 3D preview','4 themes · 3 layouts · lighting moods','Capacity check for guest count','Walkthrough + split-screen VR','Auto quote & material estimate','Couple + planner modes with share links'];
for(let i=0;i<6;i++)T(s,'✦  '+ft[i],{x:.6+(i%3)*3.0,y:3.75+Math.floor(i/3)*.55,w:2.9,h:.45,fontSize:13,color:C.background1});
s.addNotes('DEMO (45 sec): open index.html. Switch theme live, drag guests to 700 to trigger the capacity warning, open Quote. Say: "Every number you see updates from what is in the 3D scene."');

// 6 MARKET
pres.addSection({title:'Market & Model'});
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'Market & Model'});
H(s,'A huge, emotional, under-digitised market',false);
const mk=[['~10M','weddings a year in India','5B52E0'],['~$130B','estimated annual wedding spend','B98A2E'],['10–15%','of budget goes to décor — our wedge','3AA68A']];
for(let i=0;i<3;i++){const x=.6+i*3.0;card(s,x,1.5,2.8,2.3,'stat-'+i);
  T(s,mk[i][0],{x:x+.2,y:1.75,w:2.4,h:.9,fontSize:44,bold:true,color:mk[i][2],fontFace:'Cambria'});
  T(s,mk[i][1],{x:x+.2,y:2.8,w:2.4,h:.8,fontSize:15,color:C.text1,valign:'top'});}
T(s,'Beachhead: metro planners & décor-led weddings (₹15L–₹1 Cr budgets). Expand to vendors, venues and NRI weddings.',{x:.6,y:4.1,w:8.8,h:.8,fontSize:16,color:C.text2});
s.addNotes('Market sizes are widely cited industry estimates — verify and cite your own source before pitching. The wedge is décor: visual, high-ticket, high-regret.');

// 7 BUSINESS MODEL
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'Market & Model'});
H(s,'Three ways we make money',false);
const bm=[['FaUsers','Planner SaaS','₹2,999–₹9,999 / month','Unlimited client previews, branded quotes, share links.','5B52E0'],
 ['FaStore','Vendor lead fees','₹1,500–₹4,000 per qualified quote','Vendors pay for design-ready, budget-matched leads.','B98A2E'],
 ['FaHandshake','Booking commission','2–4% on bookings','Closed-loop booking through the platform.','3AA68A']];
for(let i=0;i<3;i++){const y=1.45+i*1.15;card(s,.6,y,8.8,1.0,'model-'+i);
  await circ(s,bm[i][0],.8,y+.15,.7,bm[i][4],'FFFFFF','model-'+i);
  T(s,bm[i][1],{x:1.7,y:y+.12,w:2.6,h:.4,fontSize:18,bold:true,color:C.text1,fontFace:'Cambria'});
  T(s,bm[i][2],{x:1.7,y:y+.55,w:2.9,h:.35,fontSize:13,bold:true,color:bm[i][4]});
  T(s,bm[i][3],{x:4.9,y:y+.1,w:4.3,h:.8,fontSize:14,color:C.text2,valign:'middle'});}
s.addNotes('Prices are proposed placeholders — replace with your validated pricing. Lead with SaaS (predictable), vendors (scale), commission (upside).');

// 8 COMPETITION
pres.addSection({title:'Edge'});
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'Edge'});
H(s,'Why we win',false);
const ck='✓',no='–';
const hd=o=>({text:o,options:{bold:true,color:'FFFFFF',fill:{color:'1B1033'},align:'center',fontSize:12}});
const rows=[[{text:'',options:{fill:{color:'1B1033'}}},hd('Mood boards'),hd('Vendor marketplaces'),hd('Planner spreadsheets'),hd('WedVerse AI')]];
const data=[['Sees YOUR venue in 3D',no,no,no,ck],['Instant theme & layout changes',no,no,no,ck],['Live cost as you design',no,no,ck,ck],['Compare vendors like-for-like',no,ck,no,ck],['Quote + material list from design',no,no,no,ck]];
for(const r of data)rows.push(r.map((c,j)=>j===0?{text:c,options:{align:'left',fontSize:13,bold:true,color:'1B1033'}}:{text:c,options:{align:'center',fontSize:16,bold:c===ck,color:j===4?'3AA68A':'8A7FB0',fill:j===4?{color:'E8F7F2'}:undefined}}));
s.addTable(rows,{x:.6,y:1.4,w:8.8,colW:[3.2,1.3,1.5,1.5,1.3],rowH:.5,border:{type:'solid',pt:.5,color:'DDD6F3'},valign:'middle',fontFace:'Calibri',objectName:'competition-table'});
T(s,'Moat: proprietary venue library + planner workflow data + vendor price intelligence.',{x:.6,y:4.5,w:8.8,h:.5,fontSize:15,italic:true,color:C.text2});
s.addNotes('Be ready: "Can we not just hire a designer for renders?" — Yes, for ₹30–50k per render, days later. We do unlimited, instant, and attach the quote.');

// 9 GTM
pres.addSection({title:'Growth'});
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'Growth'});
H(s,'Go-to-market: planners first',false);
const gt=[['0–6 mo','Pilot','Onboard 50 metro wedding planners free. Collect 200 real venues.','5B52E0'],['6–12 mo','Monetise','Launch SaaS tiers + vendor lead marketplace in 3 cities.','B98A2E'],['12–24 mo','Scale','Booking commissions, venue partnerships, NRI & destination weddings.','3AA68A']];
s.addShape(pres.ShapeType.line,{x:1.2,y:2.05,w:7.6,h:0,line:{color:'C9BFEA',width:2,dashType:'dash'},objectName:'timeline'});
for(let i=0;i<3;i++){const x=.6+i*3.0;
  s.addShape(pres.ShapeType.ellipse,{x:x+.6,y:1.8,w:.5,h:.5,fill:{color:gt[i][3]},line:{color:'FFFFFF',width:3},objectName:'node-'+i});
  T(s,gt[i][0],{x,y:1.3,w:1.7,h:.35,fontSize:13,bold:true,color:gt[i][3]});
  card(s,x,2.6,2.8,2.1,'gtm-'+i);
  T(s,gt[i][1],{x:x+.2,y:2.75,w:2.4,h:.4,fontSize:20,bold:true,color:C.text1,fontFace:'Cambria'});
  T(s,gt[i][2],{x:x+.2,y:3.25,w:2.4,h:1.3,fontSize:14,color:C.text2,valign:'top'});}
s.addNotes('Planners are the distribution: each planner runs 10–40 weddings a year and brings couples + vendors with them.');

// 10 FINANCIALS
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'Growth'});
H(s,'Projected revenue: ₹0.6 Cr to ₹14.5 Cr in 3 years',false,{fontSize:28});
s.addChart(pres.charts.BAR,[{name:'Revenue (₹ Cr)',labels:['Year 1','Year 2','Year 3'],values:[0.6,4.2,14.5]}],{x:.6,y:1.4,w:5.4,h:3.5,barDir:'col',chartColors:['5B52E0'],showTitle:true,title:'Revenue (₹ Cr) — illustrative',titleFontSize:13,titleColor:'1B1033',showValue:true,dataLabelFormatCode:'0.0',dataLabelPosition:'outEnd',dataLabelColor:'1B1033',dataLabelFontSize:13,dataLabelFontFace:'+mn-lt',catAxisLabelColor:'3A2278',catAxisLabelFontSize:12,catAxisLabelFontFace:'+mn-lt',valAxisHidden:true,valGridLine:{style:'none'},showLegend:false,barGapWidthPct:60});
const kp=[['75%','target gross margin'],['<4 mo','CAC payback target'],['3×','LTV : CAC target']];
for(let i=0;i<3;i++){const y=1.5+i*1.15;card(s,6.3,y,3.1,1.0,'kpi-'+i);
  T(s,kp[i][0],{x:6.5,y:y+.1,w:1.4,h:.8,fontSize:26,bold:true,color:'5B52E0',fontFace:'Cambria',valign:'middle'});
  T(s,kp[i][1],{x:7.9,y:y+.1,w:1.4,h:.8,fontSize:13,color:C.text1,valign:'middle'});}
s.addNotes('All figures are illustrative targets, not actuals. Replace with your model before pitching. Expect: "What are your sales today?" — answer honestly (pre-revenue prototype) and pivot to the pilot plan.');

// 11 ASK
pres.addSection({title:'The Ask'});
s=pres.addSlide({masterName:'DARK',sectionTitle:'The Ask'});
H(s,'The ask',true);
T(s,'₹1.5 Cr',{x:.6,y:1.4,w:4.4,h:1.1,fontSize:64,bold:true,color:C.accent5,fontFace:'Cambria'});
T(s,'for 5% equity',{x:.6,y:2.5,w:4.4,h:.5,fontSize:24,color:C.background1,fontFace:'Cambria'});
T(s,'₹30 Cr post-money valuation  ·  18-month runway',{x:.6,y:3.2,w:4.4,h:.6,fontSize:14,color:'B8AEDD'});
T(s,'What we want beyond cash: wedding-industry distribution, vendor network introductions, and brand credibility.',{x:.6,y:4.0,w:4.4,h:.9,fontSize:14,color:C.background1,italic:true});
s.addChart(pres.charts.DOUGHNUT,[{name:'Use of funds',labels:['Product & AI','Sales & partnerships','Vendor network','Ops & legal'],values:[40,30,15,15]}],{x:5.2,y:1.2,w:4.4,h:3.8,holeSize:58,chartColors:['E9C978','8B5CF6','E58AA3','3AA68A'],showPercent:true,showValue:false,dataLabelColor:'1B1033',dataLabelFontSize:12,dataLabelFontFace:'+mn-lt',showLegend:true,legendPos:'b',legendColor:'FFFFFF',legendFontSize:12,legendFontFace:'+mn-lt',showTitle:true,title:'Use of funds',titleColor:'FFFFFF',titleFontSize:14,dataBorder:{pt:2,color:'1B1033'}});
s.addNotes('Say the ask clearly, once: "₹1.5 crore for 5 percent." Then stop talking. Valuation and split are placeholders — adjust to your numbers.');

// 12 CLOSE
s=pres.addSlide({masterName:'DARK',sectionTitle:'The Ask'});
H(s,'Let\'s make every wedding a masterpiece',true,{x:.6,y:1.5,w:8.8,h:1.5,fontSize:44,align:'center',valign:'middle'});
T(s,'WedVerse AI — See your wedding before you spend on it.',{x:.6,y:3.2,w:8.8,h:.5,fontSize:20,italic:true,align:'center',color:C.accent5,fontFace:'Cambria'});
T(s,'Who\'s in?',{x:.6,y:4.1,w:8.8,h:.5,fontSize:24,bold:true,align:'center',color:C.background1,fontFace:'Cambria'});
s.addNotes('Close with eye contact. Then Q&A. Prep: CAC, pricing proof, why now (3D in browser + AI), defensibility, founder-market fit.');

await pres.writeFile({fileName:'WedVerse_AI_Shark_Tank_Pitch.pptx'});
await applyTheme('WedVerse_AI_Shark_Tank_Pitch.pptx',THEME);
console.log('done');
})();
