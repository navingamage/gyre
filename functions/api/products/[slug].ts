import type { Env } from "../../lib/env";
import { getProductBySlug } from "../../lib/products";

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const slug = String(params.slug);
  const product = await getProductBySlug(env.DB, slug);
  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }
  return Response.json(product);
};
