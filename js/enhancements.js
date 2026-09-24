(async()=>{
await window.appReady;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const base=document.body.dataset.base||'./', reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const searchButton=document.createElement('button');searchButton.className='search-toggle';searchButton.setAttribute('aria-label','البحث في الموقع');searchButton.innerHTML='<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg>';
$('.menu-toggle').before(searchButton);
const dialog=document.createElement('dialog');dialog.className='search-dialog';dialog.setAttribute('aria-label','البحث في الموقع');dialog.innerHTML='<div class="dialog-bar"><h2>عمّ تبحث؟</h2><button class="close-dialog" aria-label="إغلاق البحث">×</button></div><label for="site-search">ابحث في الصفحات والأخبار والفعاليات</label><input id="site-search" type="search" placeholder="مثال: التسجيل، الأنشطة، الصفوف…"><div class="search-results" aria-live="polite"></div>';document.body.append(dialog);
searchButton.onclick=()=>{dialog.showModal();$('#site-search').focus();};dialog.querySelector('button').onclick=()=>dialog.close();
const entries=[...$$('#navigation a')].map(a=>({title:a.textContent,excerpt:'اكتشف '+a.textContent,href:a.href})).concat(SCHOOL.news.map(n=>({title:n.title,excerpt:n.excerpt,href:base+'news-detail.html?slug='+encodeURIComponent(n.slug)})),(window.RAW_CONTENT?.events||[]).map(n=>({...n,href:base+'activities.html#events'})));
const normalize=s=>s.normalize('NFKC').replace(/[أإآ]/g,'ا').replace(/[\u064B-\u065F]/g,'').toLowerCase();
$('#site-search').oninput=e=>{const q=normalize(e.target.value.trim());const found=q?entries.filter(n=>normalize(n.title+' '+n.excerpt).includes(q)):[];$('.search-results').innerHTML=q?(found.length?found.map(n=>`<a href="${escape(n.href)}"><strong>${escape(n.title)}</strong><small>${escape(n.excerpt)}</small></a>`).join(''):'<p>لا توجد نتائج. جرّب كلمات أخرى.</p>'):'<p>اكتب كلمة لبدء البحث.</p>';};
if($('.hero-visual')){
 const slides=SCHOOL.slides;let index=0,paused=reduce;
 const visual=$('.hero-visual');visual.innerHTML=`<div class="hero-slides" role="region" aria-label="لمحات من المدرسة">${slides.map((s,i)=>`<img class="hero-slide ${i===0?'selected':''}" src="${base+s.image}" alt="${escape(s.title)}" ${i?'loading="lazy"':'fetchpriority="high"'} aria-hidden="${i!==0}">`).join('')}</div><div class="slide-caption"><span>منار العلم · لحظات تصنع المستقبل</span><strong></strong><p></p></div><div class="slider-controls"><button data-prev aria-label="الشريحة السابقة">→</button><div class="slide-dots">${slides.map((_,i)=>`<button data-slide="${i}" aria-label="الشريحة ${i+1}"></button>`).join('')}</div><button data-next aria-label="الشريحة التالية">←</button><button data-pause aria-label="إيقاف التبديل التلقائي">Ⅱ</button></div>`;
 const show=i=>{index=(i+slides.length)%slides.length;$$('.hero-slide').forEach((el,j)=>{el.classList.toggle('selected',j===index);el.setAttribute('aria-hidden',j!==index);});$$('[data-slide]').forEach((el,j)=>el.setAttribute('aria-pressed',j===index));$('.slide-caption strong').textContent=slides[index].title;$('.slide-caption p').textContent=slides[index].text;};
 let timer;const schedule=()=>{clearInterval(timer);timer=setInterval(()=>{if(!paused&&!document.hidden&&!visual.matches(':hover')&&!visual.contains(document.activeElement))show(index+1);},5000);};
 $$('[data-slide]').forEach(b=>b.onclick=()=>{show(+b.dataset.slide);schedule();});$('[data-prev]').onclick=()=>{show(index-1);schedule();};$('[data-next]').onclick=()=>{show(index+1);schedule();};const pause=$('[data-pause]');const sync=()=>{pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'تشغيل التبديل التلقائي':'إيقاف التبديل التلقائي');};pause.onclick=()=>{paused=!paused;sync();schedule();};sync();show(0);schedule();
}
const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(!isIntersecting)return;observer.unobserve(target);const total=+target.dataset.count;const begin=performance.now();const tick=now=>{const p=reduce?1:Math.min((now-begin)/1600,1);target.textContent=Math.round(total*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);}),{threshold:.5});$$('[data-count]').forEach(el=>observer.observe(el));
const events=window.RAW_CONTENT?.events||[];
if(events.length&&['home','activities'].includes(document.body.dataset.page)){
 const block=document.createElement('section');block.className='section tinted';block.id='events';block.innerHTML=`<div class="container"><div class="section-head"><div><div class="eyebrow">نلتقي على الإبداع</div><h2>جديد فعاليات المدرسة</h2></div></div><div class="grid grid-3">${events.map(e=>`<article class="card"><img class="card-image" src="${e.image.startsWith('data:')?e.image:base+e.image}" alt="${escape(e.title)}" loading="lazy"><div class="card-pad"><span class="tag">${escape(e.date)}</span><h3>${escape(e.title)}</h3><p>${escape(e.excerpt)}</p><p>${escape(e.location)}</p>${e.content.map(t=>`<p>${escape(t)}</p>`).join('')}</div></article>`).join('')}</div></div>`;$('#main').append(block);
 $$('.event').filter(el=>el.textContent.includes('لا توجد')).forEach(el=>el.remove());
}
if(new URLSearchParams(location.search).get('preview')==='1'){
 const banner=document.createElement('div');banner.className='notice';banner.textContent='معاينة محلية للمسودة — لم تُنشر هذه التعديلات للزوار.';$('#main').prepend(banner);
 document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const u=new URL(a.href,location.href);if(u.origin===location.origin&&/\.html$/.test(u.pathname)){u.searchParams.set('preview','1');a.href=u.href;}});
}
})();
