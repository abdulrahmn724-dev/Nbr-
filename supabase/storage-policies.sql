-- ============================================================
--  NBR — Storage policies for the `images` bucket
--  Run once in:  Supabase → SQL Editor → New query → Run
--  (Public READ already works because the bucket is public; these
--   let the logged-in admin upload / replace / delete images.)
-- ============================================================
drop policy if exists "admin upload images" on storage.objects;
create policy "admin upload images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'images');

drop policy if exists "admin update images" on storage.objects;
create policy "admin update images" on storage.objects
  for update to authenticated
  using (bucket_id = 'images')
  with check (bucket_id = 'images');

drop policy if exists "admin delete images" on storage.objects;
create policy "admin delete images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'images');
