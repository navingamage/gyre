import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useDarkMode } from "../hooks/useDarkMode";

export default function Nav() {
  const { lines } = useCart();
  const { dark, toggle } = useDarkMode();
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <header className="border-b border-deep/10 bg-white dark:bg-slate-900 dark:border-slate-700">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link to="/" className="text-xl font-bold text-deep dark:text-foam">
          Gyre
        </Link>
        <nav className="flex flex-wrap gap-4 sm:gap-6 text-sm text-kelp dark:text-foam/80 items-center">
          <Link to="/">Shop</Link>
          <Link to="/blog">Ratings</Link>
          <Link to="/certifications">Certifications</Link>
          <Link to="/partners">Sell on Gyre</Link>
          <Link to="/cart">Cart ({itemCount})</Link>
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            aria-pressed={dark}
            className="text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-kelp rounded"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </nav>
      </div>
    </header>
  );
}
