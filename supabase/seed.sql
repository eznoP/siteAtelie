insert into public.products
  (id, name, slug, description, images, category, price, stock, sizes, colors, properties, position, active, show_when_out_of_stock)
values
  ('10f30416-254d-4f93-9bb6-7fd765af1001', 'Bolsa Aurora', 'bolsa-aurora', 'Bolsa estruturada em fio de algodão, tecida à mão com alças largas e forro interno.', array['/products/bolsa-aurora.svg'], 'Bolsas', 189.90, 2, array['Único'], array['Amora', 'Aveia', 'Musgo'], '[{"name":"Tamanho","values":["Único"]},{"name":"Cor","values":["Amora","Aveia","Musgo"]},{"name":"Material","values":["Fio de algodão"]}]'::jsonb, 0, true, true),
  ('10f30416-254d-4f93-9bb6-7fd765af1002', 'Coelho Bento', 'coelho-bento', 'Amigurumi macio, bordado à mão e preenchido com fibra antialérgica.', array['/products/coelho-bento.svg'], 'Amigurumis', 129.00, 4, array['28 cm'], array['Baunilha', 'Azul névoa'], '[{"name":"Tamanho","values":["28 cm"]},{"name":"Cor","values":["Baunilha","Azul névoa"]},{"name":"Enchimento","values":["Fibra antialérgica"]}]'::jsonb, 1, true, true),
  ('10f30416-254d-4f93-9bb6-7fd765af1003', 'Cesto Ninho', 'cesto-ninho', 'Cesto de fio reciclado para organizar pequenos rituais da casa.', array['/products/cesto-ninho.svg'], 'Casa', 98.00, 0, array['P', 'M', 'G'], array['Telha', 'Areia'], '[{"name":"Tamanho","values":["P","M","G"]},{"name":"Cor","values":["Telha","Areia"]}]'::jsonb, 2, true, true),
  ('10f30416-254d-4f93-9bb6-7fd765af1004', 'Manta Horizonte', 'manta-horizonte', 'Manta de pontos largos e franjas soltas, criada para tardes que pedem pausa.', array['/products/manta-horizonte.svg'], 'Casa', 279.00, 1, array['1,20 × 1,60 m'], array['Horizonte', 'Amora'], '[{"name":"Medida","values":["1,20 × 1,60 m"]},{"name":"Cor","values":["Horizonte","Amora"]}]'::jsonb, 3, true, true),
  ('10f30416-254d-4f93-9bb6-7fd765af1005', 'Colete Brisa', 'colete-brisa', 'Colete leve de trama aberta, feito sob medida para vestir em camadas.', array['/products/colete-brisa.svg'], 'Vestir', 219.00, 3, array['P', 'M', 'G'], array['Aveia', 'Rosa antigo', 'Cobalto'], '[{"name":"Tamanho","values":["P","M","G"]},{"name":"Cor","values":["Aveia","Rosa antigo","Cobalto"]},{"name":"Modelagem","values":["Sob medida"]}]'::jsonb, 4, true, false),
  ('10f30416-254d-4f93-9bb6-7fd765af1006', 'Almofada Ponto de Luz', 'almofada-ponto-de-luz', 'Capa de almofada com relevo solar e fechamento invisível no verso.', array['/products/almofada-luz.svg'], 'Casa', 139.00, 5, array['45 × 45 cm'], array['Mostarda', 'Vinho'], '[{"name":"Medida","values":["45 × 45 cm"]},{"name":"Cor","values":["Mostarda","Vinho"]}]'::jsonb, 5, true, true),
  ('10f30416-254d-4f93-9bb6-7fd765af1007', 'Chapéu Orla', 'chapeu-orla', 'Chapéu de aba maleável em algodão, dobrável e fácil de levar.', array['/products/chapeu-orla.svg'], 'Acessórios', 119.00, 2, array['P/M', 'G/GG'], array['Cobalto', 'Framboesa'], '[{"name":"Tamanho","values":["P/M","G/GG"]},{"name":"Cor","values":["Cobalto","Framboesa"]}]'::jsonb, 6, true, true)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  images = excluded.images,
  category = excluded.category,
  price = excluded.price,
  stock = excluded.stock,
  sizes = excluded.sizes,
  colors = excluded.colors,
  properties = excluded.properties,
  position = excluded.position,
  active = excluded.active,
  show_when_out_of_stock = excluded.show_when_out_of_stock;
