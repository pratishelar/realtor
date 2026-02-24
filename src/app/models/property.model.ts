export interface PropertyPriceDetails {
  basePrice: number;
  governmentCharge: number;
  totalPrice: number;
}

export interface PropertyStatus {
  preConstruction: boolean;
  underConstruction: boolean;
  readyToMove: boolean;
}

export interface PropertyUnitConfig {
  '1bhk': boolean;
  '2bhk': boolean;
  '3bhk': boolean;
  '4bhk': boolean;
  '5bhk': boolean;
}

export interface PropertySize {
  carpetArea: number;
  totalArea: number;
  label: string;
}

export interface PropertyPriceListItem {
  configuration: string;
  area: number;
  price: number;
}

export interface PropertyReraDetails {
  reraNumber: string;
  reraStatus: string;
  possession: string;
}

export interface Property {
  id?: string;

  name: string;
  title: string;
  location: string;
  city: string;
  description: string;
  numberOfUnits: number;

  priceDetails: PropertyPriceDetails;
  status: PropertyStatus;
  unitConfig: PropertyUnitConfig;
  size: PropertySize;
  priceList: PropertyPriceListItem[];
  floorPlans: string[];
  amenities: string[];
  reraDetails: PropertyReraDetails;
  images: string[];

  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  possessionStatus?: string;
  features: string[];
  owner: string;
  phone?: string;
  email?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
