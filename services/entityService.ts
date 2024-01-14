import { createClient } from "@/utils/supabase/client";

async function removeEntity(
  collection: string,
  id: string,
  deleteAttribute: string
) {
  const supabase = createClient();

  const { error } = await supabase
    .from(collection)
    .delete()
    .eq(deleteAttribute, id);

  return { error };
}

async function getEntity(collection: string, id: string, join?: string) {
  const supabase = createClient();

  const query = supabase
    .from(collection)
    .select(`*${join ? `, ${join}(*)` : ""}`)
    .eq("id", id)
    .single();

  const { data, error } = await query;

  return { data, error };
}

async function getEntities(
  collection: string,
  join?: string,
  joinColumn?: string,
  joinValue?: string,
  eqColumn?: string,
  eqValue?: string,
  orderColumn?: string,
  order?: string
) {
  const supabase = createClient();

  const query: any = supabase.from(collection).select("*");

  if (join) {
    query.select(`*${join ? `, ${join}(*)` : ""}`);
  } else {
    query.select("*");
  }

  if (joinColumn && joinValue) {
    query.eq(joinColumn, joinValue);
  }

  if (eqColumn && eqValue) {
    query.eq(eqColumn, eqValue);
  }

  if (orderColumn && order) {
    query.order(orderColumn, { ascending: order === "asc" });
  }

  const { data, error } = await query;

  return { data, error };
}

async function addEntity(collection: string, data: any) {
  const supabase = createClient();

  const { data: newEntity, error } = await supabase
    .from(collection)
    .insert([data])
    .select();

  return { newEntity, error };
}

async function updateEntity(collection: string, id: string, data: any) {
  const supabase = createClient();

  const { data: updatedEntity, error } = await supabase
    .from(collection)
    .update(data)
    .eq("id", id)
    .select();

  return { updatedEntity, error };
}

export { addEntity, getEntities, getEntity, removeEntity, updateEntity };
