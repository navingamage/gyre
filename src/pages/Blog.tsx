import { Link } from "react-router-dom";
import { articles } from "../data/articles";

export default function Blog() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-deep dark:text-foam mb-2">
        The Rating Desk
      </h1>
      <p className="text-kelp dark:text-foam/70 mb-8">
        We rate popular consumer products for microplastic content and point to
        cleaner alternatives.
      </p>
      <ul className="space-y-5">
        {articles.map((a) => (
          <li
            key={a.slug}
            className="rounded-xl bg-white dark:bg-slate-800 ring-1 ring-deep/5 dark:ring-white/5 p-5 hover:shadow-md transition-shadow"
          >
            <Link
              to={`/blog/${a.slug}`}
              className="font-display text-lg font-semibold text-deep dark:text-foam hover:underline"
            >
              {a.title}
            </Link>
            <p className="text-kelp dark:text-foam/70 text-sm mt-1">{a.dek}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
