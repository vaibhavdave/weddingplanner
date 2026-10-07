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

pres.defineSlideMaster({title:'DARK',background:{path:'img/bg-dark.jpg'},objects:[],
  slideNumber:{x:9.1,y:5.2,w:.5,h:.3,fontSize:10,color:'B8AEDD'},
  placeholders:[{placeholder:{options:{name:'title',type:'title',x:.6,y:.4,w:8.8,h:.9,fontSize:34,bold:true,color:C.background1,valign:'top',margin:0},text:''}}]});
pres.defineSlideMaster({title:'LIGHT',background:{path:'img/bg-light.jpg'},objects:[],
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
const card=(s,x,y,w,h,nm,fill='FFFFFF')=>s.addShape(pres.ShapeType.roundRect,{x,y,w,h,rectRadius:.14,fill:{color:fill},line:{color:'E6DEFA',width:.75},shadow:sh(),objectName:nm});
const glass=(s,x,y,w,h,nm)=>s.addShape(pres.ShapeType.roundRect,{x,y,w,h,rectRadius:.14,fill:{color:'FFFFFF',transparency:90},line:{color:'E9C978',width:.75,transparency:45},objectName:nm});
const frame=(s,x,y,w,h,nm)=>s.addShape(pres.ShapeType.roundRect,{x:x-.06,y:y-.06,w:w+.12,h:h+.12,rectRadius:.2,fill:{type:'none'},line:{color:'E9C978',width:1.25},objectName:nm});
const pill=(s,t,x,y,w,nm,bg='E9C978',fg='1B1033')=>{s.addShape(pres.ShapeType.roundRect,{x,y,w,h:.36,rectRadius:.18,fill:{color:bg},line:{color:bg},objectName:nm});T(s,t,{x,y,w,h:.36,fontSize:12,bold:true,color:fg,align:'center',valign:'middle'})};

const H=(s,t,dark,o={})=>s.addText(t,Object.assign({placeholder:'title',x:.6,y:.4,w:8.8,h:.8,fontSize:32,bold:true,color:dark?'FFFFFF':'1B1033',fontFace:'Cambria',valign:'top',margin:0},o));

const NUM=(s,t,x,y,dark)=>T(s,t,{x,y,w:1,h:.3,fontSize:11,bold:true,color:dark?'E9C978':'B98A2E',charSpacing:3});
(async()=>{
let s;
// 1 HERO
pres.addSection({title:'Opening'});
s=pres.addSlide({masterName:'DARK',sectionTitle:'Opening'});
s.addImage({path:'img/r-entrance.jpg',x:0,y:0,w:10,h:5.625,objectName:'hero-3d',altText:'3D preview of a decorated wedding hall'});
s.addImage({path:'img/ov-left.png',x:0,y:0,w:10,h:5.625,objectName:'hero-fade'});
s.addShape(pres.ShapeType.ellipse,{x:.6,y:.55,w:.5,h:.5,fill:{color:'E9C978'},line:{color:'E9C978'},objectName:'logo-bg'});
T(s,'✦',{x:.6,y:.55,w:.5,h:.5,fontSize:18,bold:true,color:'1B1033',align:'center',valign:'middle'});
T(s,'WEDVERSE',{x:1.2,y:.55,w:2.5,h:.5,fontSize:13,bold:true,color:'FFFFFF',charSpacing:6,valign:'middle'});
T(s,'PLAN · VISUALIZE · CELEBRATE',{x:.6,y:1.7,w:5,h:.3,fontSize:12,bold:true,color:'E9C978',charSpacing:5});
H(s,'WedVerse AI',true,{x:.6,y:2.0,w:6,h:1.1,fontSize:64});
T(s,'See your wedding before\nyou spend on it.',{x:.6,y:3.15,w:5.2,h:1.0,fontSize:26,italic:true,color:'FFFFFF',fontFace:'Cambria',valign:'top'});
pill(s,'SEED ROUND  ·  ₹1.5 Cr for 5%',.6,4.55,3.1,'ask-pill');
s.addNotes('OPEN (15 sec): "Sharks, a typical Indian family will spend ₹25 lakh on a wedding. Today they sign that cheque before they have seen a single thing. We fix that." Pause, then move on.');

// 2 HOOK
s=pres.addSlide({masterName:'DARK',sectionTitle:'Opening'});
H(s,'A ₹25 lakh decision with no preview',true);
T(s,'₹25,00,000',{x:.6,y:1.4,w:5.6,h:1.4,fontSize:70,bold:true,color:'E9C978',fontFace:'Cambria'});
T(s,'average spend on one big-fat Indian wedding — committed months before anyone sees the décor, the layout or the final bill.',{x:.6,y:3.0,w:5.2,h:1.2,fontSize:18,color:'FFFFFF',valign:'top'});
const hk=[['01','Photos & Pinterest','Inspiration, not your venue'],['02','Verbal quotes','Hard to compare, easy to inflate'],['03','Day-of surprises','"This isn\'t what we imagined"']];
for(let i=0;i<3;i++){const y=1.45+i*1.2;glass(s,6.3,y,3.1,1.05,'pain-'+i);
  T(s,hk[i][0],{x:6.5,y:y+.12,w:.6,h:.3,fontSize:12,bold:true,color:'E9C978',charSpacing:3});
  T(s,hk[i][1],{x:6.5,y:y+.38,w:2.8,h:.35,fontSize:17,bold:true,color:'FFFFFF',fontFace:'Cambria'});
  T(s,hk[i][2],{x:6.5,y:y+.7,w:2.8,h:.3,fontSize:14,color:'FFFFFF'});}
s.addNotes('Make it personal: "Imagine buying a car you can only see after you have paid." Let the number land.');

// 3 PROBLEM
pres.addSection({title:'Problem & Solution'});
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'Problem & Solution'});
H(s,'Three problems every couple faces',false);
const pr=[['FaEyeSlash','Imagination gap','Couples cannot picture their own venue with a theme, layout and lighting.','E58AA3','01'],
 ['FaBalanceScale','Quote chaos','Every décor vendor quotes differently. No way to compare like-for-like.','5B52E0','02'],
 ['FaExclamationTriangle','Budget overruns','Changes after booking cost 20–30% more. Planners juggle it in spreadsheets.','B98A2E','03']];
for(let i=0;i<3;i++){const x=.6+i*3.0;card(s,x,1.4,2.8,3.4,'prob-'+i);
  T(s,pr[i][4],{x:x+1.5,y:1.5,w:1.15,h:.9,fontSize:54,bold:true,color:'EEE8FB',fontFace:'Cambria',align:'right'});
  await circ(s,pr[i][0],x+.25,1.7,.75,pr[i][3],'FFFFFF','prob-'+i);
  T(s,pr[i][1],{x:x+.25,y:2.75,w:2.3,h:.4,fontSize:20,bold:true,color:'1B1033',fontFace:'Cambria'});
  T(s,pr[i][2],{x:x+.25,y:3.25,w:2.3,h:1.4,fontSize:14,color:'4A3F73',valign:'top'});}
s.addNotes('Three pains: they cannot see it, they cannot compare it, they cannot control the cost. Planners feel all three, every week.');

// 4 SOLUTION
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'Problem & Solution'});
H(s,'Preview. Optimise. Book.',false);
const st=[['FaUpload','Upload your venue','Photos, floor plan or video become a 3D digital twin.','5B52E0'],
 ['FaCube','Design it in 3D','Swap themes, layouts and lighting in seconds. Walk it in VR.','B98A2E'],
 ['FaCalculator','Optimise the budget','Live quote, material list and AI savings ideas as you design.','3AA68A']];
for(let i=0;i<3;i++){const y=1.4+i*1.2;
  await circ(s,st[i][0],.6,y,.8,st[i][3],'FFFFFF','step-'+i);
  T(s,st[i][1],{x:1.6,y:y+.02,w:3.4,h:.4,fontSize:20,bold:true,color:'1B1033',fontFace:'Cambria'});
  T(s,st[i][2],{x:1.6,y:y+.45,w:3.4,h:.7,fontSize:14,color:'4A3F73',valign:'top'});}
s.addImage({path:'img/rr-entrance.png',x:5.45,y:1.2,w:3.95,h:3.95,objectName:'solution-shot',altText:'3D venue preview'});
frame(s,5.45,1.2,3.95,3.95,'solution-frame');
s.addNotes('Walk the three steps in one breath. Then go to the live demo.');

// 5 PRODUCT
pres.addSection({title:'Product'});
s=pres.addSlide({masterName:'DARK',sectionTitle:'Product'});
H(s,'Live product — not a mock-up',true);
s.addImage({path:'img/rr-app-stage.png',x:.6,y:1.3,w:5.1,h:5.1*1000/1577,objectName:'app-stage',altText:'3D venue preview in the WedVerse studio'});
frame(s,.6,1.3,5.1,5.1*1000/1577,'app-stage-frame');
s.addImage({path:'img/rr-app-budget.png',x:6.1,y:1.3,w:3.2,h:3.2*720/669,objectName:'app-budget',altText:'Budget optimizer panel'});
frame(s,6.1,1.3,3.2,3.2*720/669,'app-budget-frame');
const cap=[['Live 3D preview','drag, zoom, walk the aisle'],['Live budget','updates with every change']];
T(s,'← '+cap[0][0]+' · '+cap[0][1],{x:.6,y:4.7,w:5.1,h:.35,fontSize:14,bold:true,color:'E9C978'});
T(s,cap[1][0]+' — '+cap[1][1],{x:5.95,y:4.9,w:3.45,h:.3,fontSize:13,bold:true,color:'E9C978'});
s.addNotes('DEMO (45 sec): open index.html. Switch theme live, drag guests to 700 to trigger the capacity warning, open Quote. Say: "Every number you see updates from what is in the 3D scene."');

// 6 LOOKS
s=pres.addSlide({masterName:'DARK',sectionTitle:'Product'});
H(s,'Same venue. Four looks. Zero rework',true);
const lk=[['pastel','Royal Pastel'],['emerald','Emerald Heritage'],['crimson','Crimson Maharaja'],['midnight','Midnight Gala']];
for(let i=0;i<4;i++){const x=.6+(i%2)*3.15,y=1.4+Math.floor(i/2)*2.0;
  s.addImage({path:`img/rr-${lk[i][0]}.png`,x,y,w:3.0,h:3.0*560/900*1,objectName:'look-'+i,altText:lk[i][1]+' theme'});
  s.addShape(pres.ShapeType.roundRect,{x:x+.12,y:y+1.45,w:1.95,h:.32,rectRadius:.16,fill:{color:'1B1033',transparency:15},line:{color:'E9C978',width:.75},objectName:'chip-bg-'+i});
  T(s,lk[i][1],{x:x+.12,y:y+1.45,w:1.95,h:.32,fontSize:12,bold:true,color:'FFFFFF',align:'center',valign:'middle'});}
const lt=[['4','themes'],['3','layouts'],['<1s','to switch']];
for(let i=0;i<3;i++){T(s,lt[i][0],{x:7.2,y:1.4+i*1.15,w:2.2,h:.65,fontSize:38,bold:true,color:'E9C978',fontFace:'Cambria'});
  T(s,lt[i][1],{x:7.2,y:2.02+i*1.15,w:2.2,h:.3,fontSize:14,color:'FFFFFF'});}
s.addNotes('Click through the four themes live. This is the "wow": the couple argues about colours in minutes, not weeks.');

// 7 MARKET
pres.addSection({title:'Market & Model'});
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'Market & Model'});
H(s,'A huge, emotional, under-digitised market',false);
const mk=[['~10M','weddings a year in India','5B52E0'],['~₹10L Cr','estimated annual wedding spend (₹10 lakh crore)','B98A2E'],['10–15%','of budget goes to décor — our wedge','3AA68A']];
for(let i=0;i<3;i++){const x=.6+i*3.0;card(s,x,1.4,2.8,2.4,'stat-'+i);
  T(s,mk[i][0],{x:x+.25,y:1.65,w:2.5,h:.95,fontSize:36,bold:true,color:mk[i][2],fontFace:'Cambria'});
  T(s,mk[i][1],{x:x+.25,y:2.75,w:2.3,h:.8,fontSize:15,color:'1B1033',valign:'top'});}
s.addShape(pres.ShapeType.roundRect,{x:.6,y:4.1,w:8.8,h:.85,rectRadius:.14,fill:{color:'1B1033'},line:{color:'1B1033'},objectName:'beachhead'});
T(s,'Beachhead: metro planners & décor-led weddings (₹15L–₹1 Cr budgets). Then vendors, venues and NRI weddings.',{x:.85,y:4.1,w:8.3,h:.85,fontSize:15,color:'FFFFFF',valign:'middle'});
s.addNotes('Market sizes are widely cited industry estimates — verify and cite your own source before pitching. The wedge is décor: visual, high-ticket, high-regret.');

// 8 BUSINESS MODEL
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'Market & Model'});
H(s,'Three ways we make money',false);
const bm=[['FaUsers','Planner SaaS','₹2,999–₹9,999 / month','Unlimited client previews, branded quotes, share links.','5B52E0'],
 ['FaStore','Vendor lead fees','₹1,500–₹4,000 per qualified quote','Vendors pay for design-ready, budget-matched leads.','B98A2E'],
 ['FaHandshake','Booking commission','2–4% on bookings','Closed-loop booking through the platform.','3AA68A']];
for(let i=0;i<3;i++){const y=1.35+i*1.2;card(s,.6,y,8.8,1.05,'model-'+i);
  await circ(s,bm[i][0],.85,y+.17,.7,bm[i][4],'FFFFFF','model-'+i);
  T(s,bm[i][1],{x:1.8,y:y+.14,w:2.8,h:.4,fontSize:19,bold:true,color:'1B1033',fontFace:'Cambria'});
  T(s,bm[i][2],{x:1.8,y:y+.58,w:3.1,h:.35,fontSize:14,bold:true,color:bm[i][4]});
  T(s,bm[i][3],{x:5.1,y:y+.1,w:4.1,h:.85,fontSize:14,color:'4A3F73',valign:'middle'});}
s.addNotes('Prices are proposed placeholders — replace with your validated pricing. Lead with SaaS (predictable), vendors (scale), commission (upside).');

// 9 COMPETITION
pres.addSection({title:'Edge & Growth'});
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'Edge & Growth'});
H(s,'Why we win',false);
const ck='✓',no='–';
const hd=(o,gold)=>({text:o,options:{bold:true,color:gold?'1B1033':'FFFFFF',fill:{color:gold?'E9C978':'1B1033'},align:'center',fontSize:12}});
const rows=[[{text:'',options:{fill:{color:'1B1033'}}},hd('Mood boards'),hd('Vendor marketplaces'),hd('Planner spreadsheets'),hd('WedVerse AI',true)]];
const data=[['Sees YOUR venue in 3D',no,no,no,ck],['Instant theme & layout changes',no,no,no,ck],['Live cost as you design',no,no,ck,ck],['Compare vendors like-for-like',no,ck,no,ck],['Quote + material list from design',no,no,no,ck]];
for(const r of data)rows.push(r.map((c,j)=>j===0?{text:c,options:{align:'left',fontSize:14,bold:true,color:'1B1033',fill:{color:'FFFFFF'}}}:{text:c,options:{align:'center',fontSize:16,bold:c===ck,color:j===4?'3AA68A':'8A7FB0',fill:{color:j===4?'E8F7F2':'FFFFFF'}}}));
s.addTable(rows,{x:.6,y:1.4,w:8.8,colW:[3.2,1.3,1.5,1.5,1.3],rowH:.5,border:{type:'solid',pt:.5,color:'DDD6F3'},valign:'middle',fontFace:'Calibri',objectName:'competition-table'});
T(s,'Moat: proprietary venue library + planner workflow data + vendor price intelligence.',{x:.6,y:4.6,w:8.8,h:.4,fontSize:15,italic:true,color:'4A3F73'});
s.addNotes('Be ready: "Can we not just hire a designer for renders?" — Yes, for ₹30–50k per render, days later. We do unlimited, instant, and attach the quote.');

// 10 GTM
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'Edge & Growth'});
H(s,'Go-to-market: planners first',false);
const gt=[['0–6 MONTHS','Pilot','Onboard 50 metro wedding planners free. Collect 200 real venues.','5B52E0'],['6–12 MONTHS','Monetise','Launch SaaS tiers + vendor lead marketplace in 3 cities.','B98A2E'],['12–24 MONTHS','Scale','Booking commissions, venue partnerships, NRI & destination weddings.','3AA68A']];
s.addShape(pres.ShapeType.line,{x:1.1,y:2.0,w:7.9,h:0,line:{color:'C9BFEA',width:2,dashType:'dash'},objectName:'timeline'});
for(let i=0;i<3;i++){const x=.6+i*3.0;
  T(s,gt[i][0],{x,y:1.3,w:2.5,h:.3,fontSize:12,bold:true,color:gt[i][3],charSpacing:3});
  s.addShape(pres.ShapeType.ellipse,{x:x+.05,y:1.75,w:.5,h:.5,fill:{color:gt[i][3]},line:{color:'FFFFFF',width:3},objectName:'node-'+i});
  card(s,x,2.6,2.8,2.15,'gtm-'+i);
  T(s,gt[i][1],{x:x+.25,y:2.78,w:2.3,h:.4,fontSize:21,bold:true,color:'1B1033',fontFace:'Cambria'});
  T(s,gt[i][2],{x:x+.25,y:3.28,w:2.3,h:1.35,fontSize:14,color:'4A3F73',valign:'top'});}
s.addNotes('Planners are the distribution: each planner runs 10–40 weddings a year and brings couples + vendors with them.');

// 11 FINANCIALS
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'Edge & Growth'});
H(s,'Projected revenue: ₹0.6 Cr to ₹14.5 Cr in 3 years',false,{fontSize:28});
card(s,.6,1.3,5.5,3.65,'chart-card');
s.addChart(pres.charts.BAR,[{name:'Revenue (₹ Cr)',labels:['Year 1','Year 2','Year 3'],values:[0.6,4.2,14.5]}],{x:.75,y:1.4,w:5.2,h:3.45,barDir:'col',chartColors:['5B52E0'],showTitle:true,title:'Revenue (₹ Cr) — illustrative',titleFontSize:13,titleColor:'1B1033',showValue:true,dataLabelFormatCode:'0.0',dataLabelPosition:'outEnd',dataLabelColor:'1B1033',dataLabelFontSize:13,dataLabelFontFace:'+mn-lt',catAxisLabelColor:'3A2278',catAxisLabelFontSize:12,catAxisLabelFontFace:'+mn-lt',valAxisHidden:true,valGridLine:{style:'none'},showLegend:false,barGapWidthPct:60});
const kp=[['75%','target gross margin'],['<4 mo','CAC payback target'],['3×','LTV : CAC target']];
for(let i=0;i<3;i++){const y=1.3+i*1.25;card(s,6.35,y,3.05,1.1,'kpi-'+i);
  T(s,kp[i][0],{x:6.55,y:y+.1,w:1.4,h:.9,fontSize:28,bold:true,color:'5B52E0',fontFace:'Cambria',valign:'middle'});
  T(s,kp[i][1],{x:8.0,y:y+.1,w:1.3,h:.9,fontSize:14,color:'1B1033',valign:'middle'});}
s.addNotes('All figures are illustrative targets, not actuals. Replace with your model before pitching. Expect: "What are your sales today?" — answer honestly (pre-revenue prototype) and pivot to the pilot plan.');

// 12 ASK
pres.addSection({title:'The Ask'});
s=pres.addSlide({masterName:'DARK',sectionTitle:'The Ask'});
H(s,'The ask',true);
T(s,'₹1.5 Cr',{x:.6,y:1.25,w:4.6,h:1.3,fontSize:76,bold:true,color:'E9C978',fontFace:'Cambria'});
T(s,'for 5% equity',{x:.6,y:2.6,w:4.4,h:.5,fontSize:26,color:'FFFFFF',fontFace:'Cambria'});
glass(s,.6,3.35,4.4,.55,'val-card');T(s,'₹30 Cr post-money  ·  18-month runway',{x:.6,y:3.35,w:4.4,h:.55,fontSize:14,bold:true,color:'E9C978',align:'center',valign:'middle'});
T(s,'Beyond cash: wedding-industry distribution, vendor introductions and brand credibility.',{x:.6,y:4.15,w:4.4,h:.8,fontSize:15,italic:true,color:'FFFFFF',valign:'top'});
s.addChart(pres.charts.DOUGHNUT,[{name:'Use of funds',labels:['Product & AI','Sales & partnerships','Vendor network','Ops & legal'],values:[40,30,15,15]}],{x:5.3,y:1.15,w:4.2,h:3.9,holeSize:58,chartColors:['E9C978','8B5CF6','E58AA3','3AA68A'],showPercent:true,showValue:false,dataLabelColor:'1B1033',dataLabelFontSize:12,dataLabelFontFace:'+mn-lt',showLegend:true,legendPos:'b',legendColor:'FFFFFF',legendFontSize:12,legendFontFace:'+mn-lt',showTitle:true,title:'Use of funds',titleColor:'FFFFFF',titleFontSize:14,dataBorder:{pt:2,color:'1B1033'}});
s.addNotes('Say the ask clearly, once: "₹1.5 crore for 5 percent." Then stop talking. Valuation and split are placeholders — adjust to your numbers.');

// 13 CLOSE
s=pres.addSlide({masterName:'DARK',sectionTitle:'The Ask'});
s.addImage({path:'img/r-mandap.jpg',x:0,y:0,w:10,h:5.625,objectName:'close-3d',altText:'3D mandap'});
s.addImage({path:'img/ov-tint.png',x:0,y:0,w:10,h:5.625,objectName:'close-tint'});
H(s,"Let's make every wedding a masterpiece",true,{x:.8,y:1.5,w:8.4,h:1.6,fontSize:46,align:'center',valign:'middle'});
T(s,'WedVerse AI — See your wedding before you spend on it.',{x:.8,y:3.25,w:8.4,h:.5,fontSize:20,italic:true,align:'center',color:'E9C978',fontFace:'Cambria'});
pill(s,"WHO'S IN?",4.0,4.2,2.0,'close-pill');
s.addNotes('Close with eye contact. Then Q&A. Prep: CAC, pricing proof, why now (3D in browser + AI), defensibility, founder-market fit.');

await pres.writeFile({fileName:'WedVerse_AI_Shark_Tank_Pitch.pptx'});
await applyTheme('WedVerse_AI_Shark_Tank_Pitch.pptx',THEME);
console.log('done');
})();
