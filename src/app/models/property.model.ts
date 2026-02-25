export interface PropertyPriceDetails {
  basePrice: number;
  governmentCharge: number;
  totalPrice: number;
}

export interface PropertyStatus {
  underConstruction: boolean;
  readyToMove: boolean;
  resale: boolean;
  preConstruction?: boolean;
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
  builtArea: number;
  totalArea: number;
  label?: string;
}

export interface PropertyAmenitiesByCategory {
  sports: string[];
  convenience: string[];
  leisure: string[];
}

export interface PropertyType {
  apartment: boolean;
  villa: boolean;
  house: boolean;
  plot: boolean;
  office: boolean;
  shop: boolean;
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
  amenitiesByCategory: PropertyAmenitiesByCategory;
  reraDetails: PropertyReraDetails;
  images: string[];
  mainImage?: string;
  category: 'residential' | 'commercial' | '';
  propertyType: PropertyType;

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
