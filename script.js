/* EDITING: content lives in SOURCES, PLACES, VIDEOS and PEOPLE.
 * The opening and star reveal are pinned; everything else is native page flow.
 * Background changes are restricted to the empty .breathing-room elements.
 */
'use strict';

const SOURCES = [
  { title: 'The Philippine proposal and the wider initiative', publisher: 'Philippine Information Agency · 23 April 2026', url: 'https://pia.gov.ph/news/bcda-eyes-ai-industrial-hub-in-new-clark-city-under-us-led-pax-silica-initiative/', note: 'Official account of the proposed industrial ecosystem and intended investment benefits.' },
  { title: 'BCDA proposal to the U.S. Department of State', publisher: 'BCDA, hosted by the Board of Investments · 16 April 2026 · PDF', url: 'https://boi.gov.ph/wp-content/uploads/2026/05/BCDA-Letter-to-US-Dept-of-State-re-Pax-Silica-Proposal_.pdf', note: 'Primary proposal identifying approximately 4,000 acres. A proposal is not proof of completed construction.' },
  { title: 'Investment hopes, farmers’ fears', publisher: 'CNA · 16 October 2026', url: 'https://www.channelnewsasia.com/asia/philippines-pax-silica-tech-hub-investment-farmers-fear-livelihoods-6465486', note: 'Interviews with farmers, officials, industry and researchers on livelihoods, resources and local benefits.' },
  { title: 'BCDA’s response to public concerns', publisher: 'Philippine Information Agency · 10 August 2026', url: 'https://pia.gov.ph/news/luzon/cl/bcda-clarifies-misconceptions-on-pax-silica-project-in-new-clark-city/', note: 'Agency position on manufacturing, ancestral domains, water and power. Assurances are attributed to BCDA.' },
  { title: 'Vatican City: geography', publisher: 'Governorate of Vatican City State', url: 'https://www.vaticanstate.va/en/state-and-government/general-informations/geography.html', note: 'Uses the Governorate’s stated area: 0.44 km², or 44 hectares.' },
  { title: 'Monaco in figures: territory', publisher: 'Monaco Statistics · 2023 key figures · PDF', url: 'https://www.monacostatistics.mc/content/download/519472/5942669/file/DEPLIANT_100x150_IMSEE_Monaco%20en%20chiffres_23-05-2023_GB.pdf', note: 'Comparison uses this edition’s published area of 2.08 km² (208 hectares), not a live boundary measurement.' },
  { title: 'Rizal Park Complex, Manila', publisher: 'Tourism Infrastructure and Enterprise Zone Authority', url: 'https://tieza.gov.ph/rizal-park-complex-manila-2/', note: 'Uses TIEZA’s 54-hectare tourism enterprise zone definition. Other definitions of the park may differ.' },
  { title: 'Intramuros fortifications', publisher: 'Centro Turismo de Intramuros', url: 'https://museum.intramuros.gov.ph/precolonial/intramuros-fortifications/', note: 'The area enclosed by the historic fortifications is described as 64 hectares.' },
  { title: 'Gardens by the Bay', publisher: 'Singapore Ministry of Manpower', url: 'https://www.mom.gov.sg/employment-practices/sgsecure/featured-stories/gardens-by-the-bay', note: '101 hectares across the three waterfront gardens.' },
  { title: 'Central Park: our story', publisher: 'Central Park Conservancy', url: 'https://www.centralparknyc.org/our-story', note: '843 acres, including the park’s water bodies.' },
  { title: 'Pax Silica: the plans explained', publisher: 'GMA News Feed · YouTube · 7 June 2026', url: 'https://www.youtube.com/watch?v=Raz9V9jTDEM', note: 'News explainer linked in the video section.' },
  { title: 'Water and energy concerns', publisher: 'ANC · YouTube', url: 'https://www.youtube.com/watch?v=Sxy4XCC5420', note: 'Coverage of environmental and science groups’ concerns; statements reflect the reporting date.' },
  { title: 'Senate inquiry into Pax Silica concerns', publisher: 'ANC · YouTube', url: 'https://www.youtube.com/watch?v=zu9OEMdWSMg', note: 'News coverage of legislative scrutiny.' },
  { title: 'Environmental and science groups explain their concerns', publisher: 'ABS-CBN News · 30 July 2026', url: 'https://www.abs-cbn.com/news/nation/2026/7/30/why-environmental-science-groups-oppose-proposed-pax-silica-hub-in-ph-2015', note: 'Reporting on water and power concerns, alongside the agency response.' }
  { title: 'Pax Silica is the new face of US imperialism in the Philippines', publisher: 'Al Jazeera· 18 November 2026', url: 'https://www.aljazeera.com/opinions/2026/11/18/pax-silica-is-the-new-face-of-us-imperialism-in-the-philippines', note: An angle on Pax Silica driving US Imperialism in the Philippines' }
];

// Shared palette also powers scroll-driven backgrounds and header contrast.
const THEME = Object.freeze({red:'e40038',paper:'faf3e9',ink:'201408'});
const HUB_M2 = 4000 * 4046.8564224;
// Schematic silhouettes, not boundary maps. Shoelace areas normalize every
// polygon so its actual FILLED AREA scales with the landmark's land area.
const PLACES = [
  {name:'Vatican City (City-State)', m2:440000, source:4, points:[[12,0],[62,0],[85,20],[100,60],[76,100],[24,94],[0,55]]},
  {name:'Rizal Park, Philippines', m2:540000, source:6, points:[[0,0],[100,0],[100,60],[0,60]]},
  {name:'Intramuros, Philippines', m2:640000, source:7, points:[[15,0],[77,0],[100,25],[88,80],[55,100],[8,79],[0,35]]},
  {name:'Gardens by the Bay, Singapore', m2:1010000, source:8, points:[[0,67],[20,40],[35,5],[52,0],[62,39],[100,65],[88,85],[50,69],[15,100]]},
  {name:'Monaco (Country)', m2:2080000, source:5, points:[[0,38],[35,9],[72,0],[100,20],[85,47],[51,48],[23,72],[8,65]]},
  {name:'Central Park, New York', m2:843*4046.8564224, source:9, points:[[0,0],[40,0],[40,100],[0,100]]},
  {name:'Pax Silica Land, Philippines', m2:HUB_M2, source:1, points:[[0,0],[100,0],[100,100],[0,100]]}
];
const VIDEOS = [
  {id:'Raz9V9jTDEM', outlet:'GMA NEWS FEED', title:'Pax Silica — Ano ang plano ng Amerika sa Pilipinas?', source:10},
  {id:'Sxy4XCC5420', outlet:'ANC · ENVIRONMENT', title:'Groups raise concern over massive water and energy requirements', source:11},
  {id:'zu9OEMdWSMg', outlet:'ANC · PUBLIC SCRUTINY', title:'Philippine Senate holds inquiry into Pax Silica concerns', source:12}
];

// This map is an editorial synthesis, not a census or a confirmed impact forecast.
const PEOPLE = [
  {name:'Aeta communities',category:'LAND · CULTURE · PARTICIPATION',text:'Indigenous residents interviewed by CNA seek clearer information about the proposed project. BCDA separately says its site is outside ancestral domains.',question:'How will community voices and land claims be documented and addressed?',source:2},
  {name:'Farmers & families',category:'HOME · FOOD · WATER',text:'Farmers interviewed by CNA fear losing access to land and irrigation. These are reported concerns about a proposal, not established displacement outcomes.',question:'What will protect livelihoods if access to land or water changes?',source:2},
  {name:'Workers & students',category:'SKILLS · OPPORTUNITY · ACCESS',text:'Officials hope the hub will attract higher-value manufacturing and research. Access to these opportunities is an open question for workers and students.',question:'What training would make the promised opportunities accessible locally?',source:0},
  {name:'Local businesses',category:'SUPPLIERS · CONNECTIONS · SHARED GAINS',text:'An economist interviewed by CNA questions whether economic zones connect sufficiently to domestic businesses. Local supplier benefits should be examined rather than assumed.',question:'How much of the value created would reach Philippine suppliers?',source:2},
  {name:'Public agencies',category:'PLANNING · RESOURCES · ACCOUNTABILITY',text:'BCDA and partner agencies describe an industrial ecosystem with dedicated infrastructure. They say the project will comply with Philippine environmental rules. The public can assess these assurances against the plans and evidence agencies release.',question:'Which commitments can the public monitor as the proposal develops?',source:3},
  {name:'Technology firms',category:'INVESTMENT · PRODUCTION · SUPPLY CHAINS',text:'The proposed hub is intended to connect technology companies, researchers and government agencies. Officials hope this will attract higher-value investment and strengthen the Philippines’ role in technology supply chains.',question:'What measurable commitments would turn investment into local benefits?',source:0}
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const clamp = (value,min=0,max=1) => Math.min(max,Math.max(min,value));
const lerp = (a,b,p) => a+(b-a)*p;
const smooth = (a,b,value) => { const p=clamp((value-a)/(b-a)); return p*p*(3-2*p); };
function keyframes(t,points) {
  if(t<=points[0][0]) return points[0][1];
  for(let i=1;i<points.length;i++) {
    if(t<=points[i][0]) return lerp(points[i-1][1],points[i][1],smooth(points[i-1][0],points[i][0],t));
  }
  return points.at(-1)[1];
}
function mixColor(a,b,p) {
  const rgb=hex=>hex.match(/[a-f0-9]{2}/gi).map(value=>parseInt(value,16));
  return `rgb(${rgb(a).map((value,i)=>Math.round(lerp(value,rgb(b)[i],p))).join(',')})`;
}
function polygonArea(points) {
  return Math.abs(points.reduce((sum,[x,y],i)=>{
    const [nx,ny]=points[(i+1)%points.length];
    return sum+x*ny-nx*y;
  },0))/2;
}
const svgElement=(tag)=>document.createElementNS('http://www.w3.org/2000/svg',tag);

SOURCES.forEach(source=>{
  const item=document.createElement('li');
  const link=document.createElement('a');
  const detail=document.createElement('small');
  link.textContent=source.title+' ↗';
  link.href=source.url;link.target='_blank';link.rel='noopener noreferrer';
  detail.textContent=source.publisher+' — '+source.note;
  item.append(link,detail);$('#source-list').append(item);
});
$$('[data-source]').forEach(link=>{
  link.href=SOURCES[Number(link.dataset.source)].url;
  link.target='_blank';link.rel='noopener noreferrer';
});

// Cumulative scale sequence: earlier landmarks stay in frame and shrink as the
// camera widens. No ratios, sources, explanatory cards or gray rectangle here.
let placeIndex=0;
const shapeNodes=PLACES.map(place=>{
  const polygon=svgElement('polygon');
  polygon.setAttribute('points',place.points.map(p=>p.join(',')).join(' '));
  polygon.setAttribute('class','scale-shape');
  const title=svgElement('title');title.textContent=place.name;polygon.append(title);
  $('#scale-world').append(polygon);
  const label=svgElement('text');label.textContent=place.name;
  label.setAttribute('class','scale-label');$('#scale-labels').append(label);
  const unit=Math.sqrt(place.m2/polygonArea(place.points));
  return {polygon,label,unit,width:Math.max(...place.points.map(p=>p[0])),height:Math.max(...place.points.map(p=>p[1]))};
});
function comparisonLayout(index) {
  const visible=shapeNodes.slice(0,index+1);
  const base=Math.min(
    Math.sqrt(55000/PLACES[index].m2),
    290/Math.max(...visible.map(shape=>shape.height*shape.unit))
  );
  const naturalWidth=visible.reduce((sum,shape)=>sum+shape.width*shape.unit*base,0)+32*index;
  const fit=Math.min(1,1000/naturalWidth);
  let x=(1100-naturalWidth*fit)/2;
  return shapeNodes.map((shape,i)=>{
    const scale=shape.unit*base*fit;
    const width=shape.width*scale;
    const layout={x:i<=index?x:1800+i*100,y:330-shape.height*scale,scale,width};
    if(i<=index) x+=width+32*fit;
    return layout;
  });
}
function showPlace(index) {
  placeIndex=clamp(index,0,PLACES.length-1);
  $('#place-title').textContent=PLACES[placeIndex].name.toUpperCase();
  $('#scale-announcement').textContent=PLACES[placeIndex].name;
  comparisonLayout(placeIndex).forEach((layout,i)=>{
    const {polygon,label}=shapeNodes[i];
    polygon.style.transform=`translate(${layout.x}px,${layout.y}px) scale(${layout.scale})`;
    polygon.setAttribute('aria-hidden',String(i>placeIndex));
    label.setAttribute('x',layout.x+layout.width/2);
    label.setAttribute('y',i%2?397:365);
    label.setAttribute('class','scale-label'+(i===placeIndex?' is-current':''));
    label.style.visibility=i<=placeIndex?'':'hidden';
  });
  $('#previous-place').disabled=placeIndex===0;
  $('#next-place').disabled=placeIndex===PLACES.length-1;
}
$('#previous-place').addEventListener('click',()=>showPlace(placeIndex-1));
$('#next-place').addEventListener('click',()=>showPlace(placeIndex+1));
$('.comparison').addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'||event.key==='ArrowRight') {
    event.preventDefault();showPlace(placeIndex+(event.key==='ArrowRight'?1:-1));
  }
});
let swipeStart=null;
$('#scale-diagram').addEventListener('touchstart',event=>{
  swipeStart={x:event.touches[0].clientX,y:event.touches[0].clientY};
},{passive:true});
$('#scale-diagram').addEventListener('touchend',event=>{
  if(!swipeStart) return;
  const dx=event.changedTouches[0].clientX-swipeStart.x;
  const dy=event.changedTouches[0].clientY-swipeStart.y;
  if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)) showPlace(placeIndex+(dx<0?1:-1));
  swipeStart=null;
},{passive:true});
showPlace(0);

// Click-to-load embeds play in the page. Native overflow + scroll snap makes
// the gallery usable by touch, trackpad, keyboard and ordinary mouse wheel.
const gallery=$('#video-gallery');
const videoSlides=[];
function pauseVideo(slide) {
  const frame=slide.querySelector('iframe');
  if(frame) frame.contentWindow?.postMessage(JSON.stringify({event:'command',func:'pauseVideo',args:[]}), 'https://www.youtube.com');
}
VIDEOS.forEach(video=>{
  const slide=document.createElement('figure');slide.className='video-slide';
  const windowElement=document.createElement('div');windowElement.className='video-window';
  const play=document.createElement('button');play.className='video-load';play.setAttribute('aria-label','Play '+video.title+' on this page');
  const icon=document.createElement('span');icon.className='play-icon';icon.textContent='▶';
  const prompt=document.createElement('span');prompt.textContent='PLAY REPORT';
  play.append(icon,prompt);
  play.addEventListener('click',()=>{
    videoSlides.forEach(pauseVideo);
    const frame=document.createElement('iframe');
    const url=new URL('https://www.youtube.com/embed/'+video.id);
    url.search=new URLSearchParams({autoplay:'1',playsinline:'1',rel:'0',enablejsapi:'1'});
    if(location.protocol==='https:'||location.protocol==='http:') url.searchParams.set('origin',location.origin);
    frame.src=url.href;frame.title=video.title;frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
    windowElement.replaceChildren(frame);frame.focus();
  });
  windowElement.append(play);
  const caption=document.createElement('figcaption');
  const outlet=document.createElement('span');outlet.className='video-outlet';outlet.textContent=video.outlet;
  const title=document.createElement('h3');title.textContent=video.title;
  const fallback=document.createElement('a');fallback.className='video-fallback';fallback.textContent='Original report ↗';
  fallback.href=SOURCES[video.source].url;fallback.target='_blank';fallback.rel='noopener noreferrer';
  caption.append(outlet,title,fallback);slide.append(windowElement,caption);gallery.append(slide);videoSlides.push(slide);
});
let galleryIndex=0;
function updateGallery() {
  const distance=videoSlides.map(slide=>Math.abs(slide.offsetLeft-videoSlides[0].offsetLeft-gallery.scrollLeft));
  galleryIndex=distance.indexOf(Math.min(...distance));
  $('#previous-video').disabled=galleryIndex===0;
  $('#next-video').disabled=galleryIndex===videoSlides.length-1;
  $('#video-announcement').textContent=VIDEOS[galleryIndex].title;
}
function showVideo(index) {
  const target=videoSlides[clamp(index,0,videoSlides.length-1)];
  videoSlides.forEach(pauseVideo);
  gallery.scrollTo({left:target.offsetLeft-videoSlides[0].offsetLeft,behavior:reducedMotion?'instant':'smooth'});
}
$('#previous-video').addEventListener('click',()=>showVideo(galleryIndex-1));
$('#next-video').addEventListener('click',()=>showVideo(galleryIndex+1));
gallery.addEventListener('scroll',updateGallery,{passive:true});
gallery.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'||event.key==='ArrowRight') {
    event.preventDefault();showVideo(galleryIndex+(event.key==='ArrowRight'?1:-1));
  }
});
let wheelLockUntil=0;
gallery.addEventListener('wheel',event=>{
  if(Math.abs(event.deltaX)>=Math.abs(event.deltaY)||event.ctrlKey) return;
  const direction=event.deltaY>0?1:-1;
  const canMove=direction>0?galleryIndex<videoSlides.length-1:galleryIndex>0;
  if(canMove) {
    event.preventDefault();
    if(Date.now()<wheelLockUntil) return;
    wheelLockUntil=Date.now()+800;
    showVideo(galleryIndex+direction);
  }
},{passive:false});
if('IntersectionObserver' in window) {
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.intersectionRatio<.45) pauseVideo(entry.target);});
  },{threshold:[0,.45]});
  videoSlides.forEach(slide=>observer.observe(slide));
}
document.addEventListener('visibilitychange',()=>{if(document.hidden) videoSlides.forEach(pauseVideo);});

function showPerson(index) {
  const person=PEOPLE[index];
  $('#person-category').textContent=person.category;$('#person-title').textContent=person.name;
  $('#person-text').textContent=person.text;$('#person-question').textContent=person.question;
  $('#person-source').href=SOURCES[person.source].url;$('#person-source').target='_blank';$('#person-source').rel='noopener noreferrer';
  $$('.person-node').forEach((node,i)=>node.setAttribute('aria-pressed',String(i===index)));
}
$$('.person-node').forEach(node=>node.addEventListener('click',()=>showPerson(Number(node.dataset.person))));
showPerson(0);
['.back-crowd','.front-crowd'].forEach((selector,layer)=>{
  for(let i=0;i<10;i++) {
    const svg=svgElement('svg');svg.setAttribute('viewBox','0 0 100 260');
    const use=svgElement('use');use.setAttribute('href','#person');svg.append(use);
    svg.style.left=(i*11-6+(layer?5:0))+'%';svg.style.scale=String(.85+(i%3)*.12);$(selector).append(svg);
  }
});

let reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
try { const saved=localStorage.getItem('pax-motion');if(saved!==null) reducedMotion=saved==='reduced'; } catch {}
function updateMotionButton() {
  document.body.classList.toggle('reduced-motion',reducedMotion);
  $('#motion-toggle').setAttribute('aria-pressed',String(reducedMotion));
  $('#motion-toggle').textContent=reducedMotion?'Motion reduced':'Reduce motion';
}
$('#motion-toggle').addEventListener('click',()=>{
  reducedMotion=!reducedMotion;
  try { localStorage.setItem('pax-motion',reducedMotion?'reduced':'full'); } catch {}
  updateMotionButton();requestRender();
});
updateMotionButton();

// Layout positions are measured from the document, never from chapter numbers.
const documentTop=element=>element.getBoundingClientRect().top+window.scrollY;
let metrics, rafPending=false;
function measure() {
  metrics={
    vh:$('#stage').clientHeight,
    openingEnd:documentTop($('#opening'))+$('#opening').offsetHeight,
    scaleTop:documentTop($('#scale-journey')),
    scaleEnd:documentTop($('#scale-journey'))+$('#scale-journey').offsetHeight,
    debateTop:documentTop($('#debate-run')),
    debateEnd:documentTop($('#debate-run'))+$('#debate-run').offsetHeight,
    gaps:$$('.breathing-room').map(element=>({
      top:documentTop(element),height:element.offsetHeight,from:element.dataset.from,to:element.dataset.to
    }))
  };
  updateGallery();requestRender();
}
const GO_TARGETS={
  '0':()=>0,
  '1.35':()=>1.35*metrics.vh,
  '2.8':()=>2.8*metrics.vh,
  '4.15':()=>metrics.scaleTop,
  '5.55':()=>metrics.scaleTop+1.2*metrics.vh,
  '7':()=>metrics.debateTop,
  '8.45':()=>documentTop($('.news')),
  '9.95':()=>documentTop($('.people')),
  '11.4':()=>documentTop($('.conclusion')),
  '12.85':()=>documentTop($('.sources'))
};
function closeMenu() { $('#chapter-menu').hidden=true;$('#menu-toggle').setAttribute('aria-expanded','false'); }
$$('[data-go]').forEach(button=>button.addEventListener('click',event=>{
  event.preventDefault();closeMenu();
  window.scrollTo({top:GO_TARGETS[button.dataset.go](),behavior:reducedMotion?'instant':'smooth'});
  if(button.closest('#chapter-menu')) $('#menu-toggle').focus({preventScroll:true});
}));
function openMenu() {
  $('#chapter-menu').hidden=false;$('#menu-toggle').setAttribute('aria-expanded','true');
  $('#chapter-menu a').focus({preventScroll:true});
}
$('.skip-link').addEventListener('click',event=>{event.preventDefault();openMenu();});
$('#menu-toggle').addEventListener('click',()=>$('#chapter-menu').hidden?openMenu():closeMenu());
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!$('#chapter-menu').hidden) { closeMenu();$('#menu-toggle').focus({preventScroll:true}); }
});
document.addEventListener('click',event=>{
  if(!event.target.closest('#chapter-menu,#menu-toggle,.skip-link')) closeMenu();
});

function backgroundAt(y) {
  let color='#faf3e9';
  metrics.gaps.forEach(gap=>{
    if(y>=gap.top) {
      // Start only when the previous section has fully LEFT the viewport.
      // Finish before the next section can ENTER the bottom of the viewport.
      const p=smooth(gap.top,gap.top+gap.height-metrics.vh,y);
      color=mixColor(gap.from,gap.to,reducedMotion?Number(p>=.5):p);
    }
  });
  // The star completely covers the yellow pin before the purple section exits.
  if(y>=metrics.scaleTop+metrics.vh&&y<metrics.scaleEnd) color='#e40038';
  return color;
}
function starPolygon(progress,width,height) {
  const cx=width*.5,cy=height*.77;
  const radius=lerp(0,Math.hypot(width,height)*2.7,progress);
  return 'polygon('+Array.from({length:10},(_,i)=>{
    const angle=-Math.PI/2+i*Math.PI/5,r=radius*(i%2?.43:1);
    return `${cx+Math.cos(angle)*r}px ${cy+Math.sin(angle)*r}px`;
  }).join(',')+')';
}
function render() {
  rafPending=false;if(!metrics) return;
  const y=window.scrollY,vh=metrics.vh;
  document.body.style.backgroundColor=backgroundAt(y);
  const t=clamp(y/vh,0,3.2);
  const openingIndex=t<.75?0:t<2.15?1:2;
  const visualT=reducedMotion?[0,1.4,2.8][openingIndex]:t;
  $('#stage').style.backgroundColor=visualT<1.85
    ?mixColor(THEME.red,THEME.ink,smooth(.35,1.1,visualT))
    :mixColor(THEME.ink,THEME.paper,smooth(1.85,2.65,visualT));
  $$('#stage > .scene').forEach((scene,i)=>{
    const enter=i===0?1:smooth([0,.49,1.89][i],[0,1.01,2.41][i],t);
    const leave=i===2?1:1-smooth([.49,1.89][i],[1.01,2.41][i],t);
    const alpha=reducedMotion?Number(i===openingIndex):enter*leave;
    scene.style.opacity=alpha;scene.classList.toggle('is-active',alpha>.001);
    scene.inert=i!==openingIndex||y>=metrics.openingEnd;
    scene.setAttribute('aria-hidden',String(scene.inert));
  });
  $('.landscape').style.opacity=1-smooth(.25,1.05,visualT);
  $('.back').style.transform=`translateY(${visualT*12}vh)`;
  $('.middle').style.transform=`translateY(${visualT*25}vh)`;
  $('.front').style.transform=`translateY(${visualT*43}vh)`;
  $('.left-cloud').style.transform=`translateX(${-visualT*12}vw)`;
  $('.right-cloud').style.transform=`translateX(${visualT*12}vw)`;
  $('.scroll-invitation').style.opacity=1-smooth(0,.4,visualT);
  const cloudScale=keyframes(visualT,[[0,.38],[.2,.38],[1.2,1],[1.8,1],[2.75,.61]]);
  const cloudTop=keyframes(visualT,[[0,33],[.2,33],[1.2,48],[1.8,48],[2.75,19]]);
  $('#main-cloud').style.transform=`translate(-50%,-50%) scale(${cloudScale})`;
  $('#main-cloud').style.top=cloudTop+'%';
  $('.intro-copy').style.opacity=smooth(.85,1.45,visualT);
  $('.cloud-seal').style.opacity=1-smooth(.45,.9,visualT);
  const local=(y-metrics.scaleTop)/vh;
  const reveal=reducedMotion?Number(local>=.7):smooth(.38,1.02,local);
  $('.comparison').style.clipPath=starPolygon(reveal,$('#scale-pin').clientWidth,vh);
  $('.comparison').inert=reveal<.95;
  $('.comparison').setAttribute('aria-hidden',String(reveal<.95));
  $('.question').inert=reveal>.95;
  $('.question').setAttribute('aria-hidden',String(reveal>.95));
  // Small independent crowd movement; signposts themselves remain in one
  // uninterrupted document coordinate system from controversy through news.
  const crowdP=reducedMotion?0:clamp((y-metrics.debateTop)/vh,-1,1);
  $('.back-crowd').style.transform=`translateY(${crowdP*2}vh)`;
  $('.front-crowd').style.transform=`translateY(${crowdP*4}vh)`;
  // Keep the fixed navigation legible across paper, red and ink surfaces.
  let surface=backgroundAt(y);
  if(y<metrics.openingEnd) surface=$('#stage').style.backgroundColor;
  else if(y>=metrics.scaleTop&&y<metrics.scaleEnd) surface='#'+(reveal>.8?THEME.red:THEME.paper);
  const values=surface.startsWith('#')?surface.slice(1).match(/../g).map(v=>parseInt(v,16)):surface.match(/[\d.]+/g).map(Number);
  const lightness=(values[0]*.2126+values[1]*.7152+values[2]*.0722)/255;
  $('.masthead').style.color='#'+(lightness>.65?THEME.ink:THEME.paper);

}
function requestRender() {
  if(!rafPending) { rafPending=true;requestAnimationFrame(render); }
}
window.addEventListener('scroll',requestRender,{passive:true});
window.addEventListener('resize',measure);
window.addEventListener('pageshow',measure);
window.addEventListener('load',measure);
if(document.fonts) document.fonts.ready.then(measure);
measure();
