import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center">
      <h1 className="font-display text-3xl font-bold text-deep dark:text-foam">
        Page not found
      </h1>
      <p className="mt-2 text-kelp dark:text-foam/70">
        That page drifted off somewhere. Let's get you back to the shop.
      </p>
      <Link to="/shop" className="mt-6 inline-block text-kelp dark:text-foam/70 underline">
        Back to shop
      </Link>
    </div>
  );
}
