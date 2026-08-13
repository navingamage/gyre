import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useDarkMode } from "../hooks/useDarkMode";
import GyreMark from "./icons/GyreMark";

const LINKS = [
  { to: "/shop", label: "Shop" },
  { to: "/blog", label: "Ratings" },
  { to: "/certifications", label: "Certifications" },
  { to: "/partners", label: "Sell on Gyre" },
];

export default function Nav() {
  const { lines } = useCart();
  const { dark, toggle } = useDarkMode();
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <header className="sticky top-0 z-20 border-b border-deep/10 bg-white/90 backdrop-blur dark:bg-slate-900/90 dark:border-slate-700">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-deep dark:text-foam">
          <GyreMark className="h-6 w-6" />
          <span className="font-display font-bold text-lg tracking-tight">Gyre</span>
        </Link>
        <nav className="flex flex-wrap gap-5 sm:gap-7 text-sm items-center">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-kelp dark:text-foam/80 hover:text-deep dark:hover:text-foam transition-colors ${
                  isActive ? "font-semibold text-deep dark:text-foam" : ""
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/cart"
            className="rounded-full bg-deep text-white dark:bg-foam dark:text-deep px-3 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Cart ({itemCount})
          </Link>
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            aria-pressed={dark}
            className="text-lg leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-kelp rounded"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </nav>
      </div>
    </header>
  );
}
