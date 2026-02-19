export interface Property {
  id?: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  amenities?: string[];
  possessionStatus?: string;
  features: string[];
  owner: string;
  createdAt?: Date;
  updatedAt?: Date;
  phone?: string;
  email?: string;
}
