import { useParams, Link } from "react-router-dom";
import { articles } from "../data/articles";

export default function BlogPost() {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return <div className="max-w-2xl mx-auto px-6 py-10">Article not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link to="/blog" className="text-sm text-kelp underline">
        ← The Rating Desk
      </Link>
      <h1 className="text-2xl font-bold text-deep mt-3">{article.title}</h1>
      <p className="text-kelp mt-1">{article.dek}</p>
      <p className="mt-6 leading-relaxed">{article.body}</p>
    </div>
  );
}
