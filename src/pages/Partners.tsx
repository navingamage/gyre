import { useState } from "react";

export default function Partners() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-deep dark:text-foam">Thanks for reaching out</h1>
        <p className="mt-2 text-kelp dark:text-foam/70">
          This is a demo form — nothing was sent anywhere, but in a real
          version we'd follow up within a few days.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-deep dark:text-foam mb-2">Sell on Gyre</h1>
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
        <input required type="text" placeholder="Brand name" className="w-full border border-deep/20 rounded px-3 py-2 dark:bg-slate-800 dark:text-foam dark:border-slate-600" />
        <input required type="email" placeholder="Contact email" className="w-full border border-deep/20 rounded px-3 py-2 dark:bg-slate-800 dark:text-foam dark:border-slate-600" />
        <textarea placeholder="Tell us about your products" className="w-full border border-deep/20 rounded px-3 py-2 dark:bg-slate-800 dark:text-foam dark:border-slate-600" rows={4} />
        <button type="submit" className="w-full bg-deep text-white px-5 py-2 rounded-md">
          Apply to sell
        </button>
      </form>
    </div>
  );
}
