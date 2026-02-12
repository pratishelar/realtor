# Developer Reference Guide

## Architecture Overview

### Component Hierarchy
```
App Component
├── Navbar (Always visible)
├── Router Outlet
│   ├── Home
│   ├── Properties List
│   ├── Property Details
│   ├── Login
│   └── Admin Dashboard
```

### Service Architecture
```
Services (Singleton)
├── AuthService (Authentication & User State)
├── PropertyService (Database CRUD)
└── CloudinaryService (Image Management)
```

## API Reference

### AuthService
```typescript
// Properties
user$: Observable<User | null>  // Current authenticated user

// Methods
login(email: string, password: string): Observable<any>
logout(): Observable<void>
getCurrentUser(): Observable<User | null>
isAuthenticated(): boolean
```

### PropertyService
```typescript
// Methods
getProperties(): Observable<Property[]>                    // Get all
getProperty(id: string): Observable<Property | null>       // Get one
searchProperties(query: string): Observable<Property[]>    // Search
filterByPrice(min: number, max: number): Observable<Property[]>
createProperty(property: Property): Observable<string>     // Returns ID
updateProperty(id: string, property: Partial<Property>): Observable<void>
deleteProperty(id: string): Observable<void>
```

### CloudinaryService
```typescript
// Methods
uploadImage(file: File): Observable<any>                   // Single upload
uploadMultipleImages(files: File[]): Observable<any[]>     // Multiple uploads

// Response Format
{
  secure_url: string,  // Image URL
  public_id: string,   // Cloudinary ID
  // ... other fields
}
```

## Component Events & Bindings

### Navbar
```
Events:
- logout() → Logs out and redirects to home

Bindings:
- user$ → Shows/hides login/logout based on auth state
- routerLink → Navigation
```

### Properties
```
Events:
- search() → Filters by text query
- filterByPrice() → Filters by price range
- onFileSelected() → Handles file uploads

Data:
- properties[] → List of properties
- searchQuery → Search term
- minPrice, maxPrice → Price filter bounds
```

### Admin Dashboard
```
Events:
- saveProperty() → Creates or updates property
- editProperty() → Loads property for editing
- deleteProperty() → Removes property
- onFileSelected() → Uploads images
- cancelEdit() → Resets form

Tabs:
- add → Add/edit properties
- list → View all properties
```

## Database Queries

### Get all properties
```typescript
propertyService.getProperties().subscribe(properties => {
  console.log(properties);
});
```

### Search properties
```typescript
propertyService.searchProperties('downtown').subscribe(results => {
  console.log(results);
});
```

### Add property
```typescript
const property: Property = {
  title: 'Beautiful House',
  description: 'Nice 3 bedroom house',
  // ... other fields
};

propertyService.createProperty(property).subscribe(id => {
  console.log('Created property:', id);
});
```

### Update property
```typescript
propertyService.updateProperty(id, {
  price: 500000,
  description: 'New description'
}).subscribe(() => {
  console.log('Property updated');
});
```

### Delete property
```typescript
propertyService.deleteProperty(id).subscribe(() => {
  console.log('Property deleted');
});
```

## Authentication Flow

```
1. User clicks "Admin Login"
2. Redirected to /login route
3. User enters credentials
4. AuthService.login() calls Firebase
5. Firebase returns user token
6. AuthService stores user in BehaviorSubject
7. AuthGuard checks isAuthenticated()
8. Redirects to /admin dashboard
```

## Image Upload Flow

```
1. Admin selects file(s) in form
2. onFileSelected() triggered
3. CloudinaryService.uploadImage(s)() called
4. FormData sent to Cloudinary API
5. Cloudinary returns secure_url
6. URLs stored in formData.images[]
7. Form submitted to Firebase
8. Firestore stores image URLs
```

## Forms & Validation

### Property Form
```typescript
// Form Fields
- title (required, string)
- description (required, string)
- price (required, number)
- location (required, string)
- bedrooms (required, number)
- bathrooms (required, number)
- area (required, number)
- owner (required, string)
- email (optional, email)
- phone (optional, phone)
- images (optional, array)
- features (optional, comma-separated string)
```

## Styling

### Global Styles
Located in `src/styles.css`

### Component Styles
Each component has inline styles using CSS-in-JS

### Theme Colors
- Primary: #667eea (Electric Blue)
- Secondary: #764ba2 (Purple)
- Success: #4CAF50 (Green)
- Danger: #f44336 (Red)
- Gray: #333, #666, #999

## Routes

```typescript
const routes = [
  { path: '', component: HomeComponent },
  { path: 'properties', component: PropertiesComponent },
  { path: 'property/:id', component: PropertyDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
```

## RxJS Patterns Used

### Observable Subscription
```typescript
this.propertyService.getProperties().subscribe({
  next: (data) => { /* Handle data */ },
  error: (error) => { /* Handle error */ },
  complete: () => { /* Called when done */ }
});
```

### Async Pipe
```typescript
<div *ngIf="(user$ | async) as user">
  Welcome {{ user.email }}
</div>
```

### Promise to Observable
```typescript
from(Promise).subscribe(...)
```

## Error Handling

### Firebase Auth Errors
```typescript
login(email: string, password: string) {
  this.authService.login(email, password).subscribe({
    error: (error) => {
      // error.code: 'auth/wrong-password', 'auth/user-not-found', etc.
      this.error = error.message;
    }
  });
}
```

### Firestore Errors
```typescript
getProperty(id: string) {
  this.propertyService.getProperty(id).subscribe({
    error: (error) => {
      // error.code: 'permission-denied', 'not-found', etc.
      console.error('Error:', error);
    }
  });
}
```

## Performance Optimization

### Change Detection
- Using OnPush strategy where applicable
- Async pipe for observables (automatic unsubscribe)

### Image Optimization
- Using Cloudinary's CDN for image delivery
- Responsive image sizes
- Lazy loading support possible

### Lazy Loading
- Routes can be lazy loaded in future updates
- Current implementation loads all upfront

## Testing

### Unit Test Example
```typescript
describe('PropertyService', () => {
  it('should fetch properties', (done) => {
    service.getProperties().subscribe(properties => {
      expect(properties.length).toBeGreaterThan(0);
      done();
    });
  });
});
```

## Deployment Checklist

- [ ] Update environment.ts with production values
- [ ] Run `npm run build`
- [ ] Test build output in dist/
- [ ] Set Firebase to production mode
- [ ] Update Firestore rules
- [ ] Test authentication
- [ ] Verify image uploads
- [ ] Check all routes
- [ ] Deploy to hosting service

## Common Patterns

### Load data on component init
```typescript
ngOnInit() {
  this.propertyService.getProperties().subscribe(data => {
    this.properties = data;
  });
}
```

### Handle loading state
```typescript
loading = true;

ngOnInit() {
  this.service.get().subscribe({
    next: (data) => { this.data = data; },
    complete: () => { this.loading = false; }
  });
}
```

### Form submission
```typescript
saveProperty() {
  this.saving = true;
  this.service.create(this.data).subscribe({
    next: () => { this.saving = false; this.resetForm(); },
    error: (error) => { this.saving = false; }
  });
}
```

## Debugging Tips

### Enable console logging
```typescript
constructor() {
  this.propertyService.getProperties().subscribe(data => {
    console.log('Properties:', data);
  });
}
```

### Check Firebase connection
Open browser DevTools → Application → Cookies → Check Firebase tokens

### Network monitoring
DevTools → Network tab → Filter by XHR to see API calls

### Firestore entries
Firebase Console → Firestore → Collections → properties

## Future Enhancement Ideas

1. **User Profiles**: Custom user data in Firestore
2. **Favorites**: Save properties to wishlists
3. **Reviews**: User ratings and comments
4. **Search Filters**: Advanced filtering options
5. **Maps Integration**: Google Maps for locations
6. **Email Notifications**: Send alerts on new properties
7. **Image Cropping**: Built-in image editor
8. **Payment**: Integration for premium listings
9. **Analytics**: Track property views
10. **Caching**: Service Worker for offline support

## Resources

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Firebase Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
