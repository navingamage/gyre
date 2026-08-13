import type { Env } from "../lib/env";
import { listProducts } from "../lib/products";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const products = await listProducts(env.DB);
  return Response.json(products);
};
