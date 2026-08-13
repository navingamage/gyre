interface ProductRow {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price_cents: number;
  materials: string;
  synthetics: string;
  packaging: string;
  description: string;
}

export interface ProductDTO {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  materials: string[];
  synthetics: string[];
  packaging: string;
  description: string;
}

function toDTO(row: ProductRow): ProductDTO {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: row.category,
    price: row.price_cents / 100,
    materials: JSON.parse(row.materials),
    synthetics: JSON.parse(row.synthetics),
    packaging: row.packaging,
    description: row.description,
  };
}

export async function listProducts(db: D1Database): Promise<ProductDTO[]> {
  const { results } = await db.prepare("SELECT * FROM products ORDER BY name").all<ProductRow>();
  return results.map(toDTO);
}

export async function getProductBySlug(db: D1Database, slug: string): Promise<ProductDTO | null> {
  const row = await db.prepare("SELECT * FROM products WHERE slug = ?").bind(slug).first<ProductRow>();
  return row ? toDTO(row) : null;
}

export async function getProductsByIds(db: D1Database, ids: string[]): Promise<ProductDTO[]> {
  if (ids.length === 0) return [];
  const placeholders = ids.map(() => "?").join(",");
  const { results } = await db
    .prepare(`SELECT * FROM products WHERE id IN (${placeholders})`)
    .bind(...ids)
    .all<ProductRow>();
  return results.map(toDTO);
}
