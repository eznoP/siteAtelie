-- Migração v0.2: propriedades dinâmicas para peças de crochê.
-- Pode ser executada em um projeto que já usa a tabela public.products.

alter table public.products
  add column if not exists properties jsonb not null default '[]'::jsonb;

-- Preserva os tamanhos e cores já cadastrados, convertendo-os para o novo
-- formato de propriedades somente quando o produto ainda não possui grupos.
update public.products
set properties =
  (case
    when cardinality(sizes) > 0
      then jsonb_build_array(jsonb_build_object('name', 'Tamanho', 'values', to_jsonb(sizes)))
    else '[]'::jsonb
  end)
  ||
  (case
    when cardinality(colors) > 0
      then jsonb_build_array(jsonb_build_object('name', 'Cor', 'values', to_jsonb(colors)))
    else '[]'::jsonb
  end)
where properties = '[]'::jsonb;
