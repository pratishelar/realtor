import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, where, QueryConstraint } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Property } from '../models/property.model';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private propertiesCollection;

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
    const normalizedAmenities = Array.isArray(safeData.amenities) ? safeData.amenities.filter(Boolean) : [];

    const normalizedName = (safeData.name || safeData.title || '').toString();
    const normalizedPrice = Number(safeData.price || priceDetails.totalPrice || priceDetails.basePrice || 0);
    const normalizedArea = Number(safeData.area || size.totalArea || size.carpetArea || 0);

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
        preConstruction: !!status.preConstruction,
        underConstruction: !!status.underConstruction,
        readyToMove: !!status.readyToMove,
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
        totalArea: Number(size.totalArea || safeData.area || 0),
        label: (size.label || '').toString(),
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
      amenities: normalizedAmenities,
      reraDetails: {
        reraNumber: (reraDetails.reraNumber || '').toString(),
        reraStatus: (reraDetails.reraStatus || '').toString(),
        possession: (reraDetails.possession || '').toString(),
      },
      bedrooms: Number(safeData.bedrooms || 0),
      bathrooms: Number(safeData.bathrooms || 0),
      area: normalizedArea,
      images: Array.isArray(safeData.images) ? safeData.images.filter(Boolean) : [],
      features: Array.isArray(safeData.features) ? safeData.features.filter(Boolean) : normalizedAmenities,
      owner: (safeData.owner || '').toString(),
      phone: safeData.phone ? safeData.phone.toString() : undefined,
      email: safeData.email ? safeData.email.toString() : undefined,
      createdAt: safeData.createdAt,
      updatedAt: safeData.updatedAt,
      possessionStatus: safeData.possessionStatus,
    };
  }

  // Get all properties
  getProperties(): Observable<Property[]> {
    return from(
      getDocs(this.propertiesCollection)
        .then((snapshot) => snapshot.docs.map((snap) => this.normalizeProperty(snap.id, snap.data())))
    );
  }

  // Get property by ID
  getProperty(id: string): Observable<Property | null> {
    return from(
      getDoc(doc(this.propertiesCollection, id)).then((snapshot) => {
        if (snapshot.exists()) {
          return this.normalizeProperty(snapshot.id, snapshot.data());
        }
        return null;
      })
    );
  }

  // Search properties
  searchProperties(searchQuery: string): Observable<Property[]> {
    return from(
      getDocs(this.propertiesCollection).then((snapshot) =>
        snapshot.docs
          .map((snap) => this.normalizeProperty(snap.id, snap.data()))
          .filter(
            (prop) =>
              prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
              prop.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    );
  }

  // Filter by price range
  filterByPrice(minPrice: number, maxPrice: number): Observable<Property[]> {
    return from(
      getDocs(this.propertiesCollection).then((snapshot) =>
        snapshot.docs
          .map((snap) => this.normalizeProperty(snap.id, snap.data()))
          .filter((prop) => prop.price >= minPrice && prop.price <= maxPrice)
      )
    );
  }

  // Create property
  createProperty(property: Property): Observable<string> {
    return from(
      addDoc(this.propertiesCollection, {
        ...property,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).then((docRef) => docRef.id)
    );
  }

  // Update property
  updateProperty(id: string, property: Partial<Property>): Observable<void> {
    return from(
      updateDoc(doc(this.propertiesCollection, id), {
        ...property,
        updatedAt: new Date(),
      })
    );
  }

  // Delete property
  deleteProperty(id: string): Observable<void> {
    return from(deleteDoc(doc(this.propertiesCollection, id)));
  }
}
