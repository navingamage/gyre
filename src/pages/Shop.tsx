import { useMemo, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import type { Category } from "../types";

const CATEGORIES: (Category | "all")[] = [
  "all",
  "kitchen",
  "personal-care",
  "clothing",
  "baby",
  "home",
];

export default function Shop() {
  const { products, loading, error } = useProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const matchesQuery =
        query.trim() === "" ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [products, query, category]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-deep dark:text-foam">
          Shop microplastic-free
        </h1>
        <p className="text-kelp dark:text-foam/70 mt-1">
          Every product is scored by the same rating engine — nothing rated below
          a C makes the catalog.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="search"
          aria-label="Search products or brands"
          placeholder="Search products or brands"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border border-deep/15 dark:border-slate-600 rounded-lg px-4 py-2.5 bg-white dark:bg-slate-800 dark:text-foam focus:outline-none focus:ring-2 focus:ring-kelp"
        />
        <select
          aria-label="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | "all")}
          className="border border-deep/15 dark:border-slate-600 rounded-lg px-4 py-2.5 bg-white dark:bg-slate-800 dark:text-foam focus:outline-none focus:ring-2 focus:ring-kelp"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All categories" : c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-kelp dark:text-foam/70">Loading catalog…</p>
      ) : error ? (
        <p className="text-coral">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-kelp dark:text-foam/70">No products match your search.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
