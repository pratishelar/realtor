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
    return {
      id,
      title: (safeData.title || '').toString(),
      description: (safeData.description || '').toString(),
      price: Number(safeData.price || 0),
      location: (safeData.location || '').toString(),
      bedrooms: Number(safeData.bedrooms || 0),
      bathrooms: Number(safeData.bathrooms || 0),
      area: Number(safeData.area || 0),
      images: Array.isArray(safeData.images) ? safeData.images.filter(Boolean) : [],
      amenities: Array.isArray(safeData.amenities) ? safeData.amenities.filter(Boolean) : [],
      features: Array.isArray(safeData.features) ? safeData.features.filter(Boolean) : [],
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
