import { useParams, Link } from "react-router-dom";
import { articles } from "../data/articles";

export default function BlogPost() {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return <div className="max-w-2xl mx-auto px-6 py-10">Article not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link to="/blog" className="text-sm text-kelp dark:text-foam/70 hover:underline">
        ← The Rating Desk
      </Link>
      <h1 className="font-display text-3xl font-bold text-deep dark:text-foam mt-3">
        {article.title}
      </h1>
      <p className="text-kelp dark:text-foam/70 mt-1">{article.dek}</p>
      <p className="mt-6 text-deep/90 dark:text-foam/90 leading-relaxed">{article.body}</p>
    </div>
  );
}
