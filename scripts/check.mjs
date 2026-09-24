import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
const browser=await chromium.launch({headless:true,channel:"msedge"});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.setDefaultTimeout(20000);
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const root='http://127.0.0.1:4173/';
await page.goto(root);await page.locator('.hero-slide.selected').waitFor();
await page.waitForTimeout(5300);assert.equal(await page.locator('[data-slide="1"]').getAttribute('aria-pressed'),'true');
await page.locator('[data-pause]').click({force:true});await page.locator('.stats').scrollIntoViewIfNeeded();await page.waitForTimeout(1800);
assert.deepEqual(await page.locator('[data-count]').allTextContents(),['8','300','30','99']);
await page.getByRole('button',{name:'البحث في الموقع',exact:true}).click();await page.locator('#site-search').fill('التسجيل');assert.ok(await page.locator('.search-results a').count());await page.getByRole('button',{name:'إغلاق البحث',exact:true}).click();
await page.waitForFunction(()=>!document.querySelector('.search-dialog').open);await page.evaluate(()=>scrollTo(0,0));
await page.goto(root+'gallery.html');await page.locator('.gallery-item').first().waitFor();assert.equal(await page.locator('.gallery-item').count(),49);await page.getByRole('button',{name:'الرحلات',exact:true}).click();assert.equal(await page.locator('.gallery-item').count(),3);await page.locator('.gallery-item').first().click();assert.equal(await page.locator('.lightbox').evaluate(e=>e.open),true);await page.keyboard.press('Escape');
console.log('Checking editor');await page.goto(root+'admin.html');await page.locator('#image option').first().waitFor({state:'attached'});await page.locator('#title').fill('خبر اختبار <script>');await page.locator('#date').fill('2026-09-24');await page.locator('#excerpt').fill('اختبار حفظ وإظهار المحتوى');await page.locator('#content').fill('تفاصيل الخبر');await page.getByRole('button',{name:'حفظ المسودة',exact:true}).click();assert.ok((await page.locator('#admin-list').textContent()).includes('خبر اختبار'));
await page.goto(root+'news.html?preview=1');await page.getByRole('link',{name:'خبر اختبار <script>',exact:true}).click();await page.locator('.article h2').waitFor();assert.equal(await page.locator('.article h2').textContent(),'خبر اختبار <script>');
await page.goto(root+'news.html');await page.locator('.news-card').first().waitFor();assert.equal(await page.locator('.news-card').count(),3);
assert.equal(existsSync('dist/admin.html'),false);
console.log('Checking editor');await page.goto(root+'admin.html');await page.locator('#image option').first().waitFor({state:'attached'});await page.locator('#admin-list button').first().click();await page.locator('#title').fill('خبر معدّل');await page.getByRole('button',{name:'حفظ المسودة',exact:true}).click();assert.ok((await page.locator('#admin-list').textContent()).includes('خبر معدّل'));
await page.locator('#type').selectOption('events');await page.locator('#title').fill('فعالية اختبار');await page.locator('#date').fill('2026-10-01');await page.locator('#excerpt').fill('وصف الفعالية');await page.getByRole('button',{name:'حفظ المسودة',exact:true}).click();const download=page.waitForEvent('download');await page.locator('#export').click();assert.equal((await download).suggestedFilename(),'content.json');
await page.goto(root+'activities.html?preview=1');await page.locator('#events').waitFor();assert.ok((await page.locator('#events').textContent()).includes('فعالية اختبار'));
await page.setViewportSize({width:390,height:844});await page.goto(root);await page.locator('.hero-slide').first().waitFor();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await page.getByRole('button',{name:'فتح القائمة',exact:true}).click();await page.getByRole('navigation',{name:'القائمة الرئيسية',exact:true}).getByRole('link',{name:'معرض الصور'}).click();await page.locator('.gallery-item').first().waitFor();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
for(const path of ['about','stages','programs','activities','contact','admissions']){await page.goto(root+path+'.html');await page.locator('h1').waitFor();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path+' overflow');}
assert.deepEqual(errors,[]);await browser.close();console.log('Passed: slider, counters, search, gallery, editor, safe preview, mobile pages, private build.');





