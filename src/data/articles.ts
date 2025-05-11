export interface Article {
  slug: string;
  title: string;
  dek: string;
  body: string;
}

export const articles: Article[] = [
  {
    slug: "is-your-water-bottle-shedding-plastic",
    title: "Is your water bottle shedding plastic?",
    dek: "Most reusable bottles marketed as eco-friendly still have a plastic lid seal or straw.",
    body: "Plastic-lined lids and silicone straws are common even on 'stainless steel' bottles. Look for bottles that are fully metal at every point that touches your mouth or the water, including the cap threading.",
  },
  {
    slug: "the-hidden-plastic-in-your-t-shirt-drawer",
    title: "The hidden plastic in your t-shirt drawer",
    dek: "Polyester and elastane blends shed microfibers every time they're washed.",
    body: "A single load of laundry with synthetic fabrics can release hundreds of thousands of microfibers into wastewater. Natural fibers like organic cotton, linen, and wool don't have this problem.",
  },
  {
    slug: "why-dryer-sheets-are-a-microplastic-source",
    title: "Why dryer sheets are a microplastic source you didn't expect",
    dek: "Most dryer sheets are coated in synthetic fabric softener that flakes off as lint.",
    body: "Wool dryer balls are a drop-in replacement with no chemical coating and no synthetic fiber shedding, and they last for years instead of one load.",
  },
];
