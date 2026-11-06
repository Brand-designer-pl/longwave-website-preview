const panel=document.querySelector('.board-trips');
const track=panel.querySelector('.trip-track');
const notice=panel.querySelector('.trip-notice');
const prev=panel.querySelector('[data-prev]'),next=panel.querySelector('[data-next]');
const catalogURL='https://app.longwaveboards.com/';
const money=new Intl.NumberFormat('pl-PL',{style:'currency',currency:'PLN',maximumFractionDigits:0});
const dates=new Intl.DateTimeFormat('pl-PL',{day:'numeric',month:'short',year:'numeric',timeZone:'Europe/Warsaw'});
function element(tag,cls,value){
 const node=document.createElement(tag);node.className=cls;if(value!=null)node.textContent=value;return node;
}
function displayPrice(o){
 const variants=typeof o.price_variants==='string'?JSON.parse(o.price_variants):o.price_variants;
 if(variants?.length)return 'od '+money.format(Math.min(...variants.map(v=>v.price))/100);
 const price=o.promo_price??o.price;
 return price==null?'':money.format(price/100);
}
function card({o,t}){
 const link=element('a','trip-card');link.href=catalogURL;
 if(o.image&&/^[\w-]+$/.test(o.image)){
  const photo=element('img','trip-photo');photo.src=new URL('assets/'+o.image+'.webp',catalogURL);photo.alt='';photo.loading='lazy';photo.onerror=()=>photo.remove();link.append(photo);
 }
 const body=element('div','trip-body');
 const title=o.title;
 body.append(element('span','trip-category',o.category),element('h3','trip-title',title),
 element('p','trip-date',dates.formatRange(new Date(t.start_date+'T12:00:00Z'),new Date(t.end_date+'T12:00:00Z'))),
 element('p','trip-meta',[o.place,o.age_unrestricted?'Każdy wiek':o.age_min!=null&&o.age_max!=null?o.age_min+'–'+o.age_max+' lat':''].filter(Boolean).join(' · ')));
 const foot=element('div','trip-foot');
 foot.append(element('strong','trip-price',displayPrice(o)),element('span','trip-status',t.available?'Dostępne':'Brak miejsc'));
 body.append(foot);link.append(body);return link;
}
function controls(){
 prev.disabled=track.scrollLeft<=2;
 next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2;
}
for(const [button,dir] of [[prev,-1],[next,1]])button.onclick=()=>{
 const step=(track.firstElementChild?.offsetWidth||0)+12;
 track.scrollBy({left:dir*step,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
};
track.addEventListener('scroll',controls,{passive:true});new ResizeObserver(controls).observe(track);
// Mouse dragging complements native touch scrolling and the arrow controls.
let drag=null,suppressDragClick=false;
track.addEventListener('pointerdown',e=>{
 if(e.pointerType!=='mouse'||e.button!==0)return;
 suppressDragClick=false;
 drag={id:e.pointerId,x:e.clientX,left:track.scrollLeft,active:false};
});
window.addEventListener('pointermove',e=>{
 if(!drag||e.pointerId!==drag.id)return;
 const dx=e.clientX-drag.x;
 if(!drag.active&&Math.abs(dx)<6)return;
 if(!drag.active){drag.active=true;track.classList.add('is-dragging');track.setPointerCapture(e.pointerId);}
 e.preventDefault();track.scrollLeft=drag.left-dx;
},{passive:false});
function finishDrag(e){
 if(!drag||e.pointerId!==drag.id)return;
 const active=drag.active,id=drag.id;drag=null;
 suppressDragClick=active;
 track.classList.remove('is-dragging');
 if(track.hasPointerCapture(id))track.releasePointerCapture(id);
 controls();
 // The compatibility click follows pointerup in the same task.
 setTimeout(()=>{suppressDragClick=false},0);
}
window.addEventListener('pointerup',finishDrag);
window.addEventListener('pointercancel',finishDrag);
track.addEventListener('lostpointercapture',finishDrag);
track.addEventListener('dragstart',e=>e.preventDefault());
track.addEventListener('click',e=>{if(suppressDragClick){e.preventDefault();e.stopImmediatePropagation();}},true);

let pending=false,lastData='';
async function refresh(){
 if(pending||document.hidden||drag)return;
 pending=true;
 try{
  const response=await fetch('./offers.json',{cache:'no-store'});
  if(!response.ok)throw Error();
  const offers=await response.json();
  const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Warsaw'}).format(new Date());
  const trips=offers.filter(o=>(o.categories||[o.category]).some(c=>['Camp','Wyjazd rodzinny'].includes(c)))
   .flatMap(o=>(o.terms?.length?o.terms:[o]).map(t=>({o,t})))
   .filter(({t})=>t.start_date>=today).sort((a,b)=>a.t.start_date.localeCompare(b.t.start_date)||a.o.id-b.o.id).slice(0,4);
  const key=JSON.stringify(trips);
  if(key!==lastData){track.replaceChildren(...trips.map(card));lastData=key;}
  notice.textContent=trips.length?'Podgląd ofert z 6.11.2026. Aktualne ceny i dostępność sprawdzisz w aplikacji.':'W tej chwili nie ma zaplanowanych terminów.';
 }catch{lastData='';track.replaceChildren();notice.textContent='Nie udało się pobrać terminów. Otwórz katalog aplikacji.';}
 finally{pending=false;controls();}
}
refresh();setInterval(refresh,60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
