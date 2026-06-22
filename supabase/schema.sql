-- ============================================================
--  NBR — Supabase schema (content + contact submissions)
--  Run this once in:  Supabase Dashboard → SQL Editor → New query → Run
--  Safe to re-run: uses IF NOT EXISTS / idempotent guards where possible.
-- ============================================================
create extension if not exists pgcrypto;

-- ---------- tables ----------
create table if not exists public.gallery (
  id          uuid primary key default gen_random_uuid(),
  sort        int  not null default 0,
  cat         text not null,
  title       text not null,
  caption     text not null default '',
  aspect      text not null default '1/1',
  image_path  text not null,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.woods (
  id        uuid primary key default gen_random_uuid(),
  sort      int  not null default 0,
  name      text not null,
  latin     text not null default '',
  best      text not null default '',
  note      text not null default '',
  grad      text not null default '',
  published boolean not null default true
);

create table if not exists public.works (
  id         uuid primary key default gen_random_uuid(),
  sort       int  not null default 0,
  image_path text not null,
  cat        text not null default '',
  title      text not null default '',
  published  boolean not null default true
);

create table if not exists public.content_text (
  key        text primary key,
  value      text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  email      text,
  type       text,
  message    text,
  created_at timestamptz not null default now()
);

-- ---------- row level security ----------
alter table public.gallery             enable row level security;
alter table public.woods               enable row level security;
alter table public.works               enable row level security;
alter table public.content_text        enable row level security;
alter table public.contact_submissions enable row level security;

-- public can READ published content
drop policy if exists "read published gallery" on public.gallery;
create policy "read published gallery" on public.gallery for select using (published);
drop policy if exists "read published woods" on public.woods;
create policy "read published woods" on public.woods for select using (published);
drop policy if exists "read published works" on public.works;
create policy "read published works" on public.works for select using (published);
drop policy if exists "read content_text" on public.content_text;
create policy "read content_text" on public.content_text for select using (true);

-- only the logged-in admin can WRITE content
drop policy if exists "admin write gallery" on public.gallery;
create policy "admin write gallery" on public.gallery for all to authenticated using (true) with check (true);
drop policy if exists "admin write woods" on public.woods;
create policy "admin write woods" on public.woods for all to authenticated using (true) with check (true);
drop policy if exists "admin write works" on public.works;
create policy "admin write works" on public.works for all to authenticated using (true) with check (true);
drop policy if exists "admin write content_text" on public.content_text;
create policy "admin write content_text" on public.content_text for all to authenticated using (true) with check (true);

-- contact: anyone may SUBMIT, only admin may READ
drop policy if exists "anyone submit contact" on public.contact_submissions;
create policy "anyone submit contact" on public.contact_submissions for insert to anon, authenticated with check (true);
drop policy if exists "admin read contact" on public.contact_submissions;
create policy "admin read contact" on public.contact_submissions for select to authenticated using (true);

-- ---------- grants for the Data API roles ----------
grant usage on schema public to anon, authenticated;
grant select on public.gallery, public.woods, public.works, public.content_text to anon, authenticated;
grant insert on public.contact_submissions to anon, authenticated;
grant select, insert, update, delete
  on public.gallery, public.woods, public.works, public.content_text, public.contact_submissions
  to authenticated;

-- ---------- seed: current site content ----------
-- gallery seed
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (0,'أثاث','طاولة طعام زجاجية','رحبة لثمانية أشخاص على قاعدة من الجوز','1/1','/images/g-dining.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (1,'مغاسل','مغسلة بحافة طبيعية','لوح خشبي واحد يحتضن حوضين حجريين','1200/1600','/images/g-bath-burl.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (2,'معماري','جدار شرائح مُضاء','شرائح جوز تبرز جمالها إضاءة خلفية مخفية','1200/1600','/images/g-slatwall.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (3,'أثاث','كونسول حجر وبرونز','سطح ترافرتين فاخر على قاعدة فولاذية متينة','1200/1600','/images/g-console-stone.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (4,'زخرفي','لوحة مناظر متدرّجة','فن التطعيم بمزيج من خشب الجوز والبلوط','1200/1600','/images/g-relief.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (5,'مغاسل','مغسلة رخامية','أرجل خشبية مخروطة ضمن إطار من البلوط','960/1280','/images/g-vanity-green.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (6,'تجاري','تجهيز «مقهى رتوة»','مقاعد، فواصل خشبية، ونجارة متكاملة','1600/1066','/images/g-cafe-ratwah.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (7,'معماري','درجات سلّمٍ معلّقة','خشب صلب متين يكسو هيكلاً فولاذياً مخفياً','900/1600','/images/g-stair.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (8,'زخرفي','مزهريات نحتية','طقم من أربع قطع، نُحتت من أخشاب متنوعة','904/1600','/images/g-vases.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (9,'أثاث','طاولة قهوة مقوّسة','أرجل بلوط تحمل سطحاً زجاجياً بشفافية تامة','900/1600','/images/g-coffee.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (10,'مغاسل','مغسلة كونسول','رف مفتوح عملي وسطح رخامي أنيق','960/1280','/images/g-vanity-yellow.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (11,'خزائن','وحدة تلفاز جدارية','مزيج البلوط والخيزران محاط بإطار داكن','1200/1600','/images/g-media-wall.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (12,'تجاري','كاونتر خدمة مقهى','واجهة خشبية مبطّنة ومُضاءة بعناية','1600/1066','/images/g-cafe-bar.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (13,'معماري','باب خشبي شرائحي','صنوبر معالج حرارياً بتصميم عمودي أنيق','900/1600','/images/g-door.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (14,'زخرفي','مخطوطة عربية محفورة','حروف من البلوط، شُكلت يدوياً بدقة','1200/1600','/images/g-calligraphy.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (15,'أثاث','طاولة ومقاعد (بنش)','من خشب البلوط الداكن والصلب','1/1','/images/g-refectory.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (16,'مغاسل','مغسلتا بلوط متجاورتان','تصميم ركني ذكي مع تجهيزات نحاسية عتيقة','1600/1336','/images/g-vanity-blue.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (17,'خزائن','وحدة غرفة ألعاب','قطعة مدمجة وعملية تضفي مرحاً على مساحة الأطفال','1200/1600','/images/g-playroom.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (18,'تجاري','محل حلويات','جدار دافئ من الشرائح الخشبية','1200/1600','/images/g-dessert-bar.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (19,'معماري','فاصل بارتفاع طابقين','واجهة مهيبة من شرائح خشب الأرز','720/1280','/images/g-facade.jpeg');
insert into public.gallery (sort,cat,title,caption,aspect,image_path) values (20,'زخرفي','جوائز تذكارية','كؤوس خشبية صُممت وحُفرت خصيصاً للمناسبة','1200/1600','/images/g-awards.jpeg');

-- woods seed
insert into public.woods (sort,name,latin,best,note,grad) values (0,'الجوز','Walnut','الأثاث الفاخر · النجارة المميزة','بلونه البني الداكن المائل للشوكولاتة وتوشيحاته الرمادية والبنفسجية — خشب غني، أنيق، وجريء لقطع تخطف الأنظار.','linear-gradient(155deg,#7A5331 0%,#5A3A20 50%,#3C2614 100%)');
insert into public.woods (sort,name,latin,best,note,grad) values (1,'البلوط','Oak','الطاولات · الأرضيات · الأبواب','قوي بعروقه الواضحة ولونه الذهبي الفاتح الذي يعتّق بمرور الزمن ليصبح بلون العسل الدافئ. خيارك الأمثل للقوة والأصالة.','linear-gradient(155deg,#DBB67E 0%,#C49A5C 45%,#A87C40 100%)');
insert into public.woods (sort,name,latin,best,note,grad) values (2,'التيك (الساج)','Teak','الأثاث الخارجي · الحمامات','غني بالزيوت الطبيعية بلون ذهبي مائل للبني، يتحدى الرطوبة وعوامل الطقس — رفيقك الدائم للمساحات الداخلية والخارجية.','linear-gradient(155deg,#B58451 0%,#9A6B3C 50%,#7B5028 100%)');
insert into public.woods (sort,name,latin,best,note,grad) values (3,'الماهوجني','Mahogany','الطاولات · القطع المميزة','أحمر بنّي فاخر بلمعان دافئ وعروق ناعمة منتظمة — خيار راقٍ يمنح القطعة حضوراً كلاسيكياً ثرياً.','linear-gradient(155deg,#9C4A2E 0%,#7E3520 50%,#5A2415 100%)');
insert into public.woods (sort,name,latin,best,note,grad) values (4,'الدردار','Ash','الأشكال المنحنية · الكراسي','خشب فاتح بمرونة استثنائية وعروق ساحرة؛ ينحني ولا ينكسر. مريح للعين وأصلب مما تتخيل.','linear-gradient(155deg,#E2D2B2 0%,#CDBA92 50%,#B19E76 100%)');
insert into public.woods (sort,name,latin,best,note,grad) values (5,'القيقب','Maple','الخزائن · الديكور العصري','فاتح وناعم بعروق دقيقة يمنح مظهراً عصرياً نظيفاً — مثالي للمساحات الحديثة والتفاصيل الراقية.','linear-gradient(155deg,#EAD9B8 0%,#DBC59B 50%,#C7AC78 100%)');
insert into public.woods (sort,name,latin,best,note,grad) values (6,'الزان','Beech','القطع المخروطة · أدوات المطبخ','ناعم، متجانس، ولونه كريمي هادئ. صديق الحرفيين؛ متين، ودود لليد، ومريح في الاستخدام اليومي.','linear-gradient(155deg,#ECD6AC 0%,#D8BC8B 50%,#BE9F69 100%)');
insert into public.woods (sort,name,latin,best,note,grad) values (7,'الأرز','Cedar','الخزائن · التكسيات · الأعمال الخارجية','عطري ومقاوم للحشرات بطبيعته، بلون دافئ محمرّ — مثالي للتكسيات والخزائن وكل ما يدوم.','linear-gradient(155deg,#C98A5A 0%,#A96B3E 50%,#834B27 100%)');

-- works seed (home rail)
insert into public.works (sort,image_path,cat,title) values (0,'/images/g-bath-burl.jpeg','مغاسل وحمامات','مغسلة بحافة طبيعية');
insert into public.works (sort,image_path,cat,title) values (1,'/images/g-slatwall.jpeg','أعمال معمارية','جدار شرائح مُضاء');
insert into public.works (sort,image_path,cat,title) values (2,'/images/g-dining.jpeg','أثاث','طاولة طعام زجاجية');
insert into public.works (sort,image_path,cat,title) values (3,'/images/g-relief.jpeg','قطع ديكور','لوحة مناظر متدرّجة');
insert into public.works (sort,image_path,cat,title) values (4,'/images/g-cafe-ratwah.jpeg','مساحات تجارية','تجهيز «مقهى رتوة»');
insert into public.works (sort,image_path,cat,title) values (5,'/images/g-stair.jpeg','أعمال معمارية','درجات سلّمٍ معلّقة');
