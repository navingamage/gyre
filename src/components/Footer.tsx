import { Link } from "react-router-dom";
import GyreMark from "./icons/GyreMark";

const COLUMNS = [
  {
    heading: "Shop",
    links: [
      { to: "/shop", label: "Catalog" },
      { to: "/cart", label: "Cart" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { to: "/blog", label: "The Rating Desk" },
      { to: "/certifications", label: "Gyre Certified" },
    ],
  },
  {
    heading: "Business",
    links: [{ to: "/partners", label: "Sell on Gyre" }],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-deep/10 dark:border-slate-700 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 text-deep dark:text-foam">
            <GyreMark className="h-5 w-5" />
            <span className="font-display font-bold">Gyre</span>
          </div>
          <p className="text-sm text-kelp dark:text-foam/70 mt-2 max-w-xs">
            Pulling microplastic-free products out of obscurity.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="text-sm font-semibold text-deep dark:text-foam">{col.heading}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-kelp dark:text-foam/70 hover:text-deep dark:hover:text-foam transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-deep/10 dark:border-slate-700 py-5 text-center text-xs text-kelp dark:text-foam/50">
        A side project by Navin Gamage.
      </div>
    </footer>
  );
}
