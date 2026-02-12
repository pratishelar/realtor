# Quick Start Guide

## Project Overview

A complete **Angular Real Estate Platform** with:
- ✅ Modern, responsive website
- ✅ Property listings with search and filters
- ✅ Admin dashboard for property management
- ✅ Firebase Firestore database
- ✅ Cloudinary image hosting
- ✅ Authentication system

## Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd /Users/pratish/Desktop/DS/realtor
npm install --legacy-peer-deps
```

### 2. Configure Services
1. Create Firebase project: https://console.firebase.google.com
2. Create Cloudinary account: https://cloudinary.com
3. Copy credentials to `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_BUCKET.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  },
  cloudinary: {
    cloudName: "YOUR_CLOUD_NAME",
    uploadPreset: "YOUR_UPLOAD_PRESET"
  }
};
```

### 3. Run Development Server
```bash
npm start
```

Open: `http://localhost:4200`

### 4. Test Admin Dashboard
- Go to: `http://localhost:4200/login`
- Use test credentials:
  - Email: `admin@realtor.com`
  - Password: `admin123`

## Project Structure

```
src/app/
├── components/
│   ├── navbar/           # Navigation
│   ├── home/            # Landing page
│   ├── properties/      # Property listing
│   ├── property-detail/ # Single property view
│   ├── login/           # Admin login
│   └── admin-dashboard/ # Property management
├── services/
│   ├── property.service.ts    # Database operations
│   ├── auth.service.ts        # Authentication
│   └── cloudinary.service.ts  # Image uploads
├── models/
│   └── property.model.ts      # Data types
└── guards/
    └── auth.guard.ts          # Route protection
```

## Key Features

### For Users
- 🔍 **Search Properties**: Find by location, keywords
- 💰 **Filter by Price**: Adjust price range dynamically
- 📸 **Image Gallery**: View multiple property photos
- 📱 **Responsive Design**: Works on all devices
- ℹ️ **Detailed Views**: Complete property information

### For Admin
- ➕ **Add Properties**: Create new listings
- ✏️ **Edit Properties**: Modify existing listings
- 🗑️ **Delete Properties**: Remove listings
- 📤 **Upload Images**: Multiple image support via Cloudinary
- 👥 **Manage Features**: Add property amenities

## Available Routes

| Route | Purpose |
|-------|---------|
| `/` | Home page |
| `/properties` | All properties listing |
| `/property/:id` | Single property details |
| `/login` | Admin login |
| `/admin` | Admin dashboard (protected) |

## Database Structure (Firestore)

### Properties Collection
```typescript
{
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  features: string[];
  owner: string;
  email?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Commands

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

## File Locations

- **Configuration**: `src/environments/environment.ts`
- **Global Styles**: `src/styles.css`
- **Main Template**: `src/app/app.component.html`
- **Routes**: `src/app/app.routes.ts`
- **Services**: `src/app/services/`
- **Components**: `src/app/components/`

## Important Notes

⚠️ **Before Going to Production:**
1. Update `environment.ts` with production credentials
2. Enable Firestore security rules
3. Switch to signed Cloudinary uploads
4. Enable HTTPS
5. Set up custom domain
6. Configure CORS properly
7. Implement rate limiting

## Customization

### Change Application Name
- Update `src/index.html` title
- Update navbar logo in `navbar.component.ts`
- Update theme colors in component styles

### Change Domain/Port
```bash
# Serve on different port
ng serve --port 3000

# Build with custom configuration
ng build --configuration production
```

### Add New Properties Programmatically
```typescript
// In admin dashboard component
const newProperty: Property = {
  title: "Property Name",
  description: "Description",
  price: 500000,
  location: "City, State",
  bedrooms: 3,
  bathrooms: 2,
  area: 2000,
  owner: "Owner Name",
  images: [],
  features: []
};

this.propertyService.createProperty(newProperty).subscribe(
  (id) => console.log('Created property:', id)
);
```

## Troubleshooting

### Can't connect to Firebase
- Verify `environment.ts` credentials
- Check Firestore is enabled
- Clear browser cache

### Images won't upload
- Verify Cloudinary cloud name
- Check upload preset is unsigned
- Test preset in Cloudinary dashboard

### Admin login doesn't work
- Verify test user in Firebase Auth
- Check email and password
- Ensure Auth is enabled

### Build fails
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm start
```

## Next Steps

1. ✅ Set up Firebase & Cloudinary (see SETUP_GUIDE.md)
2. ✅ Run development server
3. ✅ Test with a sample property
4. ✅ Customize styling and branding
5. ✅ Deploy to production

## Documentation

- **Full Setup Guide**: See `SETUP_GUIDE.md`
- **Complete README**: See `README_REALTOR.md`
- **Component Details**: Check component files for inline comments

## Support

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

**Happy Building! 🚀**
