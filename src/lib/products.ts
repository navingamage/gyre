import type { Product } from "../types";

let cache: Product[] | null = null;
let inflight: Promise<Product[]> | null = null;

export async function fetchProducts(): Promise<Product[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
        return res.json() as Promise<Product[]>;
      })
      .then((data) => {
        cache = data;
        return data;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`/api/products/${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load product (${res.status})`);
  return res.json();
}
