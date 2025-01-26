import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <header className="border-b border-deep/10 bg-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold text-deep">
          Gyre
        </Link>
        <nav className="flex gap-6 text-sm text-kelp">
          <Link to="/">Shop</Link>
        </nav>
      </div>
    </header>
  );
}
