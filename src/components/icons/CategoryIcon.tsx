import type { Category } from "../../types";

const PATHS: Record<Category, string> = {
  kitchen: "M6 3v6a3 3 0 0 0 3 3v9M11 3v9M3 3v9M18 3c-2 0-3 2-3 5s1 5 3 5v9",
  "personal-care": "M12 3c2 3 4 6 4 10a4 4 0 1 1-8 0c0-4 2-7 4-10Z",
  clothing: "M8 4 4 7l2 3 2-1.5V20h8V8.5L18 10l2-3-4-3-2 2h-4L8 4Z",
  baby: "M12 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM6 20c0-4 3-7 6-7s6 3 6 7",
  home: "m4 11 8-7 8 7M6 10v10h12V10",
};

export default function CategoryIcon({
  category,
  className = "h-5 w-5",
}: {
  category: Category;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d={PATHS[category]}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
