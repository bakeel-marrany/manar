window.contentReady = (async () => {
  const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  window.validateContent = value => {
    if (!value || !Array.isArray(value.news) || !Array.isArray(value.events)) throw Error('ملف المحتوى غير صالح');
    const clean = (item, event) => {
      if (!item || typeof item.title !== 'string' || !item.title.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(item.date) || !Number.isFinite(Date.parse(item.date))) throw Error('تحقق من العنوان والتاريخ');
      const image = String(item.image || 'pics/building.jpg');
      if (!/^pics\/[\w.-]+\.(jpg|png|webp)$/i.test(image) && !/^data:image\/(jpeg|png|webp);base64,[a-z0-9+/=]+$/i.test(image)) throw Error('صيغة الصورة غير مدعومة');
      return {slug:String(item.slug||'item-'+crypto.randomUUID()).replace(/[^a-z0-9-]/gi,''),title:item.title.slice(0,180),date:item.date,image,category:String(item.category|| (event?'فعالية':'أخبار المدرسة')).slice(0,80),excerpt:String(item.excerpt||'').slice(0,500),content:(Array.isArray(item.content)?item.content:[]).map(t=>String(t).slice(0,10000)),location:String(item.location||'مقر المدرسة').slice(0,200)};
    };
    return {news:value.news.map(n=>clean(n,false)),events:value.events.map(n=>clean(n,true))};
  };
  let raw={news:[],events:[]};
  try {const response=await fetch((document.body.dataset.base||'./')+'content.json',{cache:'no-store',signal:AbortSignal.timeout(4000)});if(response.ok)raw=window.validateContent(await response.json());} catch {}
  if(new URLSearchParams(location.search).get('preview')==='1')try{raw=window.validateContent(JSON.parse(localStorage.getItem('manar-content')||'null'));}catch{}
  window.RAW_CONTENT=raw;
  window.EDITOR_CONTENT={news:raw.news.map(n=>({...n,title:escape(n.title),category:escape(n.category),excerpt:escape(n.excerpt),content:n.content.map(escape)})),events:raw.events};
})();
