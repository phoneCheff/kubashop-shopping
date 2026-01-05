// types/product.ts
export type ProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
  coin: string;
  priceWithMargin: number;
  gender: string | null;
  client_phone: string;
  custom_slug: string;
  link_images: { links: string[] };
};
