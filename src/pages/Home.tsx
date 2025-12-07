import { useMemo, useState } from "react";
import { products } from "../lib/products";
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

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const matchesQuery =
        query.trim() === "" ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-deep dark:text-foam mb-6">Shop microplastic-free</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          aria-label="Search products or brands"
          placeholder="Search products or brands"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border border-deep/20 rounded px-3 py-2 dark:bg-slate-800 dark:text-foam dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-kelp"
        />
        <select
          aria-label="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | "all")}
          className="border border-deep/20 rounded px-3 py-2 dark:bg-slate-800 dark:text-foam dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-kelp"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All categories" : c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-kelp">No products match your search.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
