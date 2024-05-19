export interface Product {
  cat_id: number;
  id: number;
  name: string;
  price: Array<number>;
  gia_nhap: number;
  promo_price: number;
  quantity: Array<number>;
  stock: string;
  mo_ta: string;
  img_url: Array<string>;
  likes: number;
  sales: number;
  luot_xem: number;
  createdAt: string;
  colors: Array<string>;
  sizes: Array<string>;
  rating: number;
  publish_schedule: string;
  status: string;
}

