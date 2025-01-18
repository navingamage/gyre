import { products } from "./lib/products";

export default function App() {
  return (
    <main className="min-h-screen bg-foam">
      <header className="py-10 text-center">
        <h1 className="text-4xl font-bold text-deep">Gyre</h1>
        <p className="mt-2 text-kelp">A marketplace for microplastic-free products.</p>
      </header>
      <ul className="max-w-3xl mx-auto grid grid-cols-2 gap-4 px-6 pb-16">
        {products.map((p) => (
          <li key={p.id} className="bg-white rounded-lg p-4 shadow-sm">
            <p className="font-medium text-deep">{p.name}</p>
            <p className="text-sm text-kelp">{p.brand} · ${p.price}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
