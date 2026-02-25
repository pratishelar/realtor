import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  QueryConstraint,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Property } from '../models/property.model';

export interface PropertyQueryFilters {
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  category?: 'residential' | 'commercial';
  resale?: boolean;
  readyToMove?: boolean;
  underConstruction?: boolean;
}

export interface PropertyPageResult {
  items: Property[];
  hasMore: boolean;
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
}

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private propertiesCollection;
  private cachedProperties: Property[] = [];
  private cacheTimestamp = 0;
  private readonly cacheTtlMs = 120000;
  private inflightPropertiesRequest$: Observable<Property[]> | null = null;

  constructor(private firestore: Firestore) {
    this.propertiesCollection = collection(this.firestore, 'properties');
  }

  private normalizeProperty(id: string, data: any): Property {
    const safeData = data || {};
    const priceDetails = safeData.priceDetails || {};
    const status = safeData.status || {};
    const unitConfig = safeData.unitConfig || {};
    const size = safeData.size || {};
    const reraDetails = safeData.reraDetails || {};
    const amenitiesByCategory = safeData.amenitiesByCategory || {};
    const propertyType = safeData.propertyType || {};
    const normalizedAmenities = Array.isArray(safeData.amenities) ? safeData.amenities.filter(Boolean) : [];
    const normalizedImages = Array.isArray(safeData.images) ? safeData.images.filter(Boolean) : [];

    const normalizedName = (safeData.name || safeData.title || '').toString();
    const normalizedPrice = Number(safeData.price || priceDetails.totalPrice || priceDetails.basePrice || 0);
    const normalizedArea = Number(safeData.area || size.builtArea || size.totalArea || size.carpetArea || 0);
    const sportsAmenities = Array.isArray(amenitiesByCategory.sports) ? amenitiesByCategory.sports.filter(Boolean) : [];
    const convenienceAmenities = Array.isArray(amenitiesByCategory.convenience) ? amenitiesByCategory.convenience.filter(Boolean) : [];
    const leisureAmenities = Array.isArray(amenitiesByCategory.leisure) ? amenitiesByCategory.leisure.filter(Boolean) : [];
    const flattenedAmenities = [
      ...sportsAmenities,
      ...convenienceAmenities,
      ...leisureAmenities,
      ...normalizedAmenities,
    ].filter(Boolean);
    const uniqueAmenities = Array.from(new Set(flattenedAmenities));

    return {
      id,
      name: normalizedName,
      title: (safeData.title || normalizedName).toString(),
      description: (safeData.description || '').toString(),
      price: normalizedPrice,
      location: (safeData.location || '').toString(),
      city: (safeData.city || '').toString(),
      numberOfUnits: Number(safeData.numberOfUnits || 0),
      priceDetails: {
        basePrice: Number(priceDetails.basePrice || safeData.price || 0),
        governmentCharge: Number(priceDetails.governmentCharge || 0),
        totalPrice: Number(priceDetails.totalPrice || safeData.price || 0),
      },
      status: {
        underConstruction: !!status.underConstruction,
        readyToMove: !!status.readyToMove,
        resale: !!status.resale,
        preConstruction: !!status.preConstruction,
      },
      unitConfig: {
        '1bhk': !!unitConfig['1bhk'],
        '2bhk': !!unitConfig['2bhk'],
        '3bhk': !!unitConfig['3bhk'],
        '4bhk': !!unitConfig['4bhk'],
        '5bhk': !!unitConfig['5bhk'],
      },
      size: {
        carpetArea: Number(size.carpetArea || safeData.area || 0),
        builtArea: Number(size.builtArea || size.totalArea || safeData.area || 0),
        totalArea: Number(size.totalArea || size.builtArea || safeData.area || 0),
        label: (size.label || '').toString() || undefined,
      },
      priceList: Array.isArray(safeData.priceList)
        ? safeData.priceList
            .map((item: any) => ({
              configuration: (item?.configuration || '').toString(),
              area: Number(item?.area || 0),
              price: Number(item?.price || 0),
            }))
            .filter((item: { configuration: string }) => item.configuration.length > 0)
        : [],
      floorPlans: Array.isArray(safeData.floorPlans) ? safeData.floorPlans.filter(Boolean) : [],
      amenities: uniqueAmenities,
      amenitiesByCategory: {
        sports: sportsAmenities,
        convenience: convenienceAmenities,
        leisure: leisureAmenities,
      },
      reraDetails: {
        reraNumber: (reraDetails.reraNumber || '').toString(),
        reraStatus: (reraDetails.reraStatus || '').toString(),
        possession: (reraDetails.possession || '').toString(),
      },
      bedrooms: Number(safeData.bedrooms || 0),
      bathrooms: Number(safeData.bathrooms || 0),
      area: normalizedArea,
      images: normalizedImages,
      mainImage: (safeData.mainImage || normalizedImages[0] || '').toString() || undefined,
      category: (safeData.category || '').toString().toLowerCase() === 'commercial' ? 'commercial' : (safeData.category || '').toString().toLowerCase() === 'residential' ? 'residential' : '',
      propertyType: {
        apartment: !!propertyType.apartment,
        villa: !!propertyType.villa,
        house: !!propertyType.house,
        plot: !!propertyType.plot,
        office: !!propertyType.office,
        shop: !!propertyType.shop,
      },
      features: Array.isArray(safeData.features) ? safeData.features.filter(Boolean) : uniqueAmenities,
      owner: (safeData.owner || '').toString(),
      phone: safeData.phone ? safeData.phone.toString() : undefined,
      email: safeData.email ? safeData.email.toString() : undefined,
      createdAt: safeData.createdAt,
      updatedAt: safeData.updatedAt,
      possessionStatus: safeData.possessionStatus,
    };
  }

  private isCacheFresh(): boolean {
    return this.cacheTimestamp > 0 && Date.now() - this.cacheTimestamp < this.cacheTtlMs;
  }

  private setCache(properties: Property[]): void {
    this.cachedProperties = properties;
    this.cacheTimestamp = Date.now();
  }

  private mergeIntoCache(properties: Property[]): void {
    const mapById = new Map<string, Property>();

    for (const item of this.cachedProperties) {
      if (item.id) {
        mapById.set(item.id, item);
      }
    }

    for (const item of properties) {
      if (item.id) {
        mapById.set(item.id, item);
      }
    }

    this.cachedProperties = Array.from(mapById.values());
    this.cacheTimestamp = Date.now();
  }

  private invalidateCache(): void {
    this.cachedProperties = [];
    this.cacheTimestamp = 0;
    this.inflightPropertiesRequest$ = null;
  }

  private fetchAndCacheProperties(): Observable<Property[]> {
    if (this.inflightPropertiesRequest$) {
      return this.inflightPropertiesRequest$;
    }

    this.inflightPropertiesRequest$ = from(
      getDocs(this.propertiesCollection)
        .then((snapshot) => snapshot.docs.map((snap) => this.normalizeProperty(snap.id, snap.data())))
    ).pipe(
      tap((properties) => this.setCache(properties)),
      tap({
        next: () => {
          this.inflightPropertiesRequest$ = null;
        },
        error: () => {
          this.inflightPropertiesRequest$ = null;
        },
      })
    );

    return this.inflightPropertiesRequest$;
  }

  // Get all properties
  getProperties(forceRefresh = false): Observable<Property[]> {
    if (!forceRefresh && this.isCacheFresh() && this.cachedProperties.length > 0) {
      return of(this.cachedProperties);
    }

    return this.fetchAndCacheProperties();
  }

  getPropertiesPage(
    pageSize = 12,
    cursor: QueryDocumentSnapshot<DocumentData> | null = null,
    filters?: PropertyQueryFilters
  ): Observable<PropertyPageResult> {
    const queryConstraints: QueryConstraint[] = [];
    const minPrice = Number(filters?.minPrice ?? 0);
    const maxPrice = Number(filters?.maxPrice ?? 0);
    const hasPriceFilter = minPrice > 0 || maxPrice > 0;
    const hasNonPriceFilters = !!(
      (filters?.city && filters.city.trim().length > 0) ||
      filters?.category ||
      filters?.resale ||
      filters?.readyToMove ||
      filters?.underConstruction
    );

    if (filters?.city && filters.city.trim().length > 0) {
      queryConstraints.push(where('city', '==', filters.city.trim()));
    }

    if (filters?.category) {
      queryConstraints.push(where('category', '==', filters.category));
    }

    if (filters?.resale) {
      queryConstraints.push(where('status.resale', '==', true));
    }

    if (filters?.readyToMove) {
      queryConstraints.push(where('status.readyToMove', '==', true));
    }

    if (filters?.underConstruction) {
      queryConstraints.push(where('status.underConstruction', '==', true));
    }

    if (hasPriceFilter) {
      if (minPrice > 0) {
        queryConstraints.push(where('price', '>=', minPrice));
      }
      if (maxPrice > 0) {
        queryConstraints.push(where('price', '<=', maxPrice));
      }
      queryConstraints.push(orderBy('price', 'asc'));
    } else if (!hasNonPriceFilters) {
      queryConstraints.push(orderBy('updatedAt', 'desc'));
    }

    if (cursor) {
      queryConstraints.push(startAfter(cursor));
    }

    queryConstraints.push(limit(Math.max(1, pageSize) + 1));

    return from(
      getDocs(query(this.propertiesCollection, ...queryConstraints)).then((snapshot) => {
        const docs = snapshot.docs;
        const hasMore = docs.length > pageSize;
        const pageDocs = hasMore ? docs.slice(0, pageSize) : docs;
        const items = pageDocs.map((item) => this.normalizeProperty(item.id, item.data()));
        this.mergeIntoCache(items);

        return {
          items,
          hasMore,
          nextCursor: pageDocs.length > 0 ? pageDocs[pageDocs.length - 1] : null,
        };
      })
    );
  }

  // Get property by ID
  getProperty(id: string): Observable<Property | null> {
    const cachedProperty = this.cachedProperties.find((item) => item.id === id);
    if (this.isCacheFresh() && cachedProperty) {
      return of(cachedProperty);
    }

    return from(
      getDoc(doc(this.propertiesCollection, id)).then((snapshot) => {
        if (snapshot.exists()) {
          const normalized = this.normalizeProperty(snapshot.id, snapshot.data());
          const existingIndex = this.cachedProperties.findIndex((item) => item.id === id);
          if (existingIndex >= 0) {
            this.cachedProperties[existingIndex] = normalized;
          } else {
            this.cachedProperties = [...this.cachedProperties, normalized];
          }
          this.cacheTimestamp = Date.now();
          return normalized;
        }
        return null;
      })
    );
  }

  // Search properties
  searchProperties(searchQuery: string): Observable<Property[]> {
    const normalizedQuery = (searchQuery || '').toLowerCase();

    return this.getProperties().pipe(
      map((properties) =>
        properties.filter(
          (prop) =>
            prop.title.toLowerCase().includes(normalizedQuery) ||
            prop.name.toLowerCase().includes(normalizedQuery) ||
            prop.location.toLowerCase().includes(normalizedQuery) ||
            prop.city.toLowerCase().includes(normalizedQuery) ||
            prop.description.toLowerCase().includes(normalizedQuery)
        )
      )
    );
  }

  // Filter by price range
  filterByPrice(minPrice: number, maxPrice: number): Observable<Property[]> {
    const constraints: QueryConstraint[] = [
      where('price', '>=', Number(minPrice) || 0),
      where('price', '<=', Number(maxPrice) || 0),
      orderBy('price', 'asc'),
    ];

    return from(
      getDocs(query(this.propertiesCollection, ...constraints)).then((snapshot) => {
        const filtered = snapshot.docs.map((snap) => this.normalizeProperty(snap.id, snap.data()));
        this.mergeIntoCache(filtered);
        return filtered;
      })
    );
  }

  // Create property
  createProperty(property: Property): Observable<string> {
    return from(
      addDoc(this.propertiesCollection, {
        ...property,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).then((docRef) => {
        this.invalidateCache();
        return docRef.id;
      })
    );
  }

  // Update property
  updateProperty(id: string, property: Partial<Property>): Observable<void> {
    return from(
      updateDoc(doc(this.propertiesCollection, id), {
        ...property,
        updatedAt: new Date(),
      }).then(() => {
        this.invalidateCache();
      })
    );
  }

  // Delete property
  deleteProperty(id: string): Observable<void> {
    return from(
      deleteDoc(doc(this.propertiesCollection, id)).then(() => {
        this.invalidateCache();
      })
    );
  }
}
