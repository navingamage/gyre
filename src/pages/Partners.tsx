import { useState } from "react";

export default function Partners() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-deep dark:text-foam">
          Thanks for reaching out
        </h1>
        <p className="mt-2 text-kelp dark:text-foam/70">
          This is a demo form — nothing was sent anywhere, but in a real
          version we'd follow up within a few days.
        </p>
      </div>
    );
  }

  const fieldClass =
    "w-full border border-deep/20 dark:border-slate-600 rounded-lg px-3 py-2.5 bg-white dark:bg-slate-800 dark:text-foam focus:outline-none focus:ring-2 focus:ring-kelp";

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-deep dark:text-foam mb-2">
        Sell on Gyre
      </h1>
      <p className="text-kelp dark:text-foam/70 mb-6">
        List your microplastic-free products. Fulfill orders yourself, or let
        Gyre dropship on your behalf.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="space-y-3"
      >
        <input required type="text" placeholder="Brand name" className={fieldClass} />
        <input required type="email" placeholder="Contact email" className={fieldClass} />
        <textarea placeholder="Tell us about your products" className={fieldClass} rows={4} />
        <button
          type="submit"
          className="w-full rounded-full bg-deep text-white dark:bg-foam dark:text-deep px-5 py-3 font-medium hover:opacity-90 transition-opacity"
        >
          Apply to sell
        </button>
      </form>
    </div>
  );
}
