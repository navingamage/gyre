import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Nav() {
  const { lines } = useCart();
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <header className="border-b border-deep/10 bg-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold text-deep">
          Gyre
        </Link>
        <nav className="flex gap-6 text-sm text-kelp items-center">
          <Link to="/">Shop</Link>
          <Link to="/blog">Ratings</Link>
          <Link to="/cart">Cart ({itemCount})</Link>
        </nav>
      </div>
    </header>
  );
}
