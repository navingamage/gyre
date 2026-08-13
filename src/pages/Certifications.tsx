export default function Certifications() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-deep dark:text-foam">
        Gyre Certified
      </h1>
      <p className="mt-4 text-deep/90 dark:text-foam/90 leading-relaxed">
        Brands reworking their product lines to cut microplastics can apply for
        Gyre Certified status. It's the same rating engine that scores every
        product on the site — grade B or above, audited against your bill of
        materials, with the badge kept current as formulations change.
      </p>
      <ol className="mt-6 space-y-3 text-sm text-kelp dark:text-foam/70 list-decimal list-inside">
        <li>Submit your product's materials and packaging for scoring.</li>
        <li>We review and, where useful, suggest swaps to reach grade B+.</li>
        <li>Certified products get the badge and a listing on Gyre.</li>
      </ol>
    </div>
  );
}
