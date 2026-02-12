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

  // Get all properties
  getProperties(): Observable<Property[]> {
    return from(
      getDocs(this.propertiesCollection).then((snapshot) =>
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Property))
      )
    );
  }

  // Get property by ID
  getProperty(id: string): Observable<Property | null> {
    return from(
      getDoc(doc(this.propertiesCollection, id)).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          console.log('PropertyService - Raw Firestore data:', data);
          console.log('PropertyService - Data type:', typeof data);
          console.log('PropertyService - Data keys:', Object.keys(data || {}));
          console.log('PropertyService - Images field:', data?.['images']);
          
          const property = { id: snapshot.id, ...data } as Property;
          console.log('PropertyService - Final property object:', property);
          console.log('PropertyService - Final property images:', property.images);
          
          return property;
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
          .map((doc) => ({ id: doc.id, ...doc.data() } as Property))
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
          .map((doc) => ({ id: doc.id, ...doc.data() } as Property))
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
