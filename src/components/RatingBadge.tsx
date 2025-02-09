import type { RatingBreakdown } from "../lib/rating";

const GRADE_COLORS: Record<RatingBreakdown["grade"], string> = {
  A: "bg-green-100 text-green-800",
  B: "bg-lime-100 text-lime-800",
  C: "bg-amber-100 text-amber-800",
  D: "bg-orange-100 text-orange-800",
  F: "bg-red-100 text-red-800",
};

export default function RatingBadge({ rating }: { rating: RatingBreakdown }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${GRADE_COLORS[rating.grade]}`}
    >
      {rating.grade} · {rating.score}/100
    </span>
  );
}
