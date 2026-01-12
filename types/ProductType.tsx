// types/ProductType.ts
export type ProductType = {
  id: string;
  name: string;
  description?: string;
  price: number;
  priceWithMargin?: number;
  coin: string;
  gender?: string;
  client_phone?: string;
  link_images: string[];
  custom_slug: string;
  categories?: Array<{
    id: string;
    slug: string;
  }>;
};
