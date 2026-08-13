export type Category =
  | "kitchen"
  | "personal-care"
  | "clothing"
  | "baby"
  | "home";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  materials: string[];
  synthetics: string[];
  packaging: "plastic-free" | "recycled-plastic" | "mixed";
  description: string;
}
