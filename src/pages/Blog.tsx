import { Link } from "react-router-dom";
import { articles } from "../data/articles";

export default function Blog() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-deep mb-2">The Rating Desk</h1>
      <p className="text-kelp mb-8">
        We rate popular consumer products for microplastic content and point to
        cleaner alternatives.
      </p>
      <ul className="space-y-6">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link to={`/blog/${a.slug}`} className="text-lg font-medium text-deep hover:underline">
              {a.title}
            </Link>
            <p className="text-kelp text-sm mt-1">{a.dek}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
