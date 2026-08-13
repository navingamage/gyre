import { Link } from "react-router-dom";
import { products } from "../lib/products";
import { rateProduct } from "../lib/rating";
import { articles } from "../data/articles";
import ProductCard from "../components/ProductCard";
import GyreMark from "../components/icons/GyreMark";

const VALUE_PROPS = [
  {
    title: "Rated, not guessed",
    body: "Every product gets a transparent 0-100 score from an auditable rating engine, not a marketing claim.",
    icon: (
      <path
        d="M9 11.5 11 13.5 15.5 9M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    title: "Cleaner alternatives",
    body: "Every product page points to a same-category option with a strictly better score, if one exists.",
    icon: (
      <path
        d="M4 7h11l-3-3M20 17H9l3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    title: "Certified brands",
    body: "Brands reworking their line to cut microplastics can earn the Gyre Certified badge.",
    icon: (
      <path
        d="M12 3l2.5 2.5H18v3.5L20.5 12 18 14.5V18h-3.5L12 20.5 9.5 18H6v-3.5L3.5 12 6 9.5V6h3.5L12 3ZM9.5 12l1.8 1.8L14.5 10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
];

export default function Home() {
  const featured = products
    .map((p) => ({ product: p, rating: rateProduct(p) }))
    .filter(({ rating }) => rating.grade === "A")
    .slice(0, 3)
    .map(({ product }) => product);

  const latestArticle = articles[0];

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-foam via-foam to-transparent dark:from-slate-900 dark:via-slate-900"
        />
        <svg
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-[420px] w-[420px] text-kelp/10 dark:text-foam/5"
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="10" />
          <circle cx="100" cy="100" r="65" stroke="currentColor" strokeWidth="10" />
          <circle cx="100" cy="100" r="35" stroke="currentColor" strokeWidth="10" />
        </svg>

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 text-kelp dark:text-foam/70 mb-6">
            <GyreMark className="h-5 w-5" />
            <span className="text-sm font-medium tracking-wide uppercase">
              The microplastic-free marketplace
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-deep dark:text-foam max-w-3xl mx-auto leading-tight">
            Ocean gyres collect the world's plastic. This one filters it back out.
          </h1>
          <p className="mt-5 text-lg text-kelp dark:text-foam/70 max-w-xl mx-auto">
            Browse a catalog where every product is transparently rated for
            microplastic content, and every rating comes with a cleaner
            alternative.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="rounded-full bg-deep text-white dark:bg-foam dark:text-deep px-6 py-3 font-medium hover:opacity-90 transition-opacity"
            >
              Shop the catalog
            </Link>
            <Link
              to="/blog"
              className="rounded-full border border-deep/20 dark:border-foam/30 text-deep dark:text-foam px-6 py-3 font-medium hover:bg-deep/5 dark:hover:bg-foam/10 transition-colors"
            >
              Read the Rating Desk
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-3 gap-8">
          {VALUE_PROPS.map((v) => (
            <div key={v.title} className="text-center sm:text-left">
              <svg viewBox="0 0 24 24" className="h-9 w-9 mx-auto sm:mx-0 text-kelp dark:text-foam">
                {v.icon}
              </svg>
              <p className="font-display font-semibold text-deep dark:text-foam mt-3">
                {v.title}
              </p>
              <p className="text-sm text-kelp dark:text-foam/70 mt-1">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-deep/10 dark:border-slate-700">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-deep dark:text-foam">
            Top-rated this week
          </h2>
          <Link to="/shop" className="text-sm text-kelp dark:text-foam/70 hover:underline">
            Shop all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {latestArticle && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-deep/5 dark:ring-white/5 p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-kelp dark:text-foam/70 uppercase tracking-wide font-medium">
                From the Rating Desk
              </p>
              <p className="font-display text-xl font-semibold text-deep dark:text-foam mt-1">
                {latestArticle.title}
              </p>
              <p className="text-sm text-kelp dark:text-foam/70 mt-1">{latestArticle.dek}</p>
            </div>
            <Link
              to={`/blog/${latestArticle.slug}`}
              className="shrink-0 rounded-full border border-deep/20 dark:border-foam/30 text-deep dark:text-foam px-5 py-2.5 font-medium hover:bg-deep/5 dark:hover:bg-foam/10 transition-colors"
            >
              Read article
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
