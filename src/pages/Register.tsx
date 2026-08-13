import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const fieldClass =
  "w-full border border-deep/20 dark:border-slate-600 rounded-lg px-3 py-2.5 bg-white dark:bg-slate-800 dark:text-foam focus:outline-none focus:ring-2 focus:ring-kelp";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await register(email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    navigate(searchParams.get("redirect") || "/shop");
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-bold text-deep dark:text-foam mb-6">
        Create an account
      </h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
        />
        <input
          required
          type="password"
          placeholder="Password (min. 8 characters)"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={fieldClass}
        />
        {error && <p className="text-sm text-coral">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-deep text-white dark:bg-foam dark:text-deep px-5 py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="text-sm text-kelp dark:text-foam/70 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="underline">
          Sign in
        </Link>
        .
      </p>
    </div>
  );
}
