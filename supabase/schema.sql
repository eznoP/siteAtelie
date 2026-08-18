-- Execute no SQL Editor de um projeto Supabase novo.
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  slug text not null unique check (char_length(slug) between 2 and 120),
  description text not null check (char_length(description) between 10 and 1200),
  images text[] not null default '{}',
  category text not null,
  price numeric(12, 2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  properties jsonb not null default '[]'::jsonb,
  position integer not null default 0 check (position >= 0),
  active boolean not null default true,
  show_when_out_of_stock boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products add column if not exists properties jsonb not null default '[]'::jsonb;

create index if not exists products_position_idx on public.products(position);
create index if not exists products_public_idx
  on public.products(active, position)
  where active = true;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.products enable row level security;

drop policy if exists "admin reads own role" on public.admin_users;
create policy "admin reads own role"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "public reads available products" on public.products;
create policy "public reads available products"
on public.products for select
to anon, authenticated
using (
  (active = true and (stock > 0 or show_when_out_of_stock = true))
  or public.is_admin()
);

drop policy if exists "admins create products" on public.products;
create policy "admins create products"
on public.products for insert
to authenticated
with check (public.is_admin());

drop policy if exists "admins update products" on public.products;
create policy "admins update products"
on public.products for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins delete products" on public.products;
create policy "admins delete products"
on public.products for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public reads product images" on storage.objects;
create policy "public reads product images"
on storage.objects for select
to public
using (bucket_id = 'product-images');

drop policy if exists "admins upload product images" on storage.objects;
create policy "admins upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admins update product images" on storage.objects;
create policy "admins update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admins delete product images" on storage.objects;
create policy "admins delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images' and public.is_admin());

-- Depois de criar o primeiro usuário em Authentication > Users, conceda acesso:
-- insert into public.admin_users (user_id) values ('UUID-DO-USUARIO');
