# Real Estate Platform - Angular

A modern, full-featured real estate website built with Angular, Firebase, and Cloudinary. Includes an admin dashboard for property management.

## Features

- **Public Website**: Browse and search properties
- **Property Details**: View detailed information about each property with image gallery
- **Admin Dashboard**: Upload, edit, and delete property listings
- **Firebase Integration**: Real-time property database
- **Cloudinary Integration**: Cloud-based image storage and management
- **Authentication**: Secure admin login
- **Search & Filters**: Find properties by location, price range, and keywords
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Angular 19+
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Image Storage**: Cloudinary
- **Styling**: CSS3

## Prerequisites

- Node.js (v18+)
- npm or yarn
- Firebase project
- Cloudinary account

## Installation

1. Clone the repository:
```bash
cd /Users/pratish/Desktop/DS/realtor
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Configure environment variables:

Update `src/environments/environment.ts` with your Firebase and Cloudinary credentials:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_BUCKET.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
  cloudinary: {
    cloudName: 'YOUR_CLOUD_NAME',
    uploadPreset: 'YOUR_UPLOAD_PRESET',
  },
};
```

### Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to Project Settings → General
4. Copy the config values to `environment.ts`
5. Enable Firebase Auth (Email/Password)
6. Enable Firestore Database

### Getting Cloudinary Credentials

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy your Cloud Name
4. Create an unsigned upload preset in Settings → Upload
5. Use the preset name in `environment.ts`

## Running the Application

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`

### Build for Production

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/              # Navigation component
│   │   ├── home/                # Home page
│   │   ├── properties/          # Properties listing
│   │   ├── property-detail/     # Property detail view
│   │   ├── login/               # Admin login
│   │   └── admin-dashboard/     # Admin panel
│   ├── services/
│   │   ├── property.service.ts  # Property CRUD operations
│   │   ├── auth.service.ts      # Authentication service
│   │   └── cloudinary.service.ts # Image upload service
│   ├── models/
│   │   └── property.model.ts    # Property interface
│   ├── guards/
│   │   └── auth.guard.ts        # Route protection
│   ├── app.config.ts            # Application configuration
│   └── app.routes.ts            # Route definitions
├── environments/
│   └── environment.ts           # Configuration
└── styles.css                   # Global styles
```

## Usage

### Public Website

1. **Home Page**: Visit the landing page for overview
2. **Properties**: Browse all available properties
3. **Search**: Use the search bar to find properties by keywords
4. **Filters**: Apply price range filters
5. **Details**: Click on any property to see full details with images

### Admin Dashboard

1. **Login**: Go to `/login`
   - Demo email: `admin@realtor.com`
   - Demo password: `admin123`

2. **Add Property**:
   - Fill in property details
   - Upload images (supports multiple images)
   - Click "Create Property"

3. **Edit Property**:
   - Click "Edit" on any property in the table
   - Modify details
   - Upload additional images or remove existing ones
   - Click "Update Property"

4. **Delete Property**:
   - Click "Delete" on any property
   - Confirm deletion

## API Endpoints (Firestore)

### Properties Collection

- **Get all properties**: `GET /properties`
- **Get property by ID**: `GET /properties/{id}`
- **Create property**: `POST /properties`
- **Update property**: `PUT /properties/{id}`
- **Delete property**: `DELETE /properties/{id}`
- **Search properties**: Uses client-side filtering

### Authentication

- **Login**: Email/Password authentication via Firebase Auth

## Environment Variables

### Firebase Configuration

- `apiKey`: Firebase API key
- `authDomain`: Firebase auth domain
- `projectId`: Firebase project ID
- `storageBucket`: Firebase storage bucket
- `messagingSenderId`: Firebase messaging sender ID
- `appId`: Firebase app ID

### Cloudinary Configuration

- `cloudName`: Your Cloudinary cloud name
- `uploadPreset`: Your unsigned upload preset name

## Security Notes

- Never commit `environment.ts` with real credentials
- Use environment-specific configs for production
- Implement server-side validation in production
- Set up Firestore security rules
- Enable HTTPS for production
- Consider implementing role-based access control

## Firestore Security Rules (Example)

```typescript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to properties
    match /properties/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Cloudinary Setup

1. Create an unsigned upload preset in Cloudinary dashboard
2. Configure image transformations as needed
3. Set up automatic image optimization

## Common Issues

### Dependency Conflicts
If you encounter peer dependency warnings, use:
```bash
npm install --legacy-peer-deps
```

### Firebase Connection Issues
- Verify Firebase credentials in `environment.ts`
- Check Firestore database is enabled
- Confirm security rules allow your operations

### Image Upload Issues
- Verify Cloudinary credentials
- Check upload preset exists and is unsigned
- Ensure image files are valid

## Deployment

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Other Platforms
The application can be deployed to any static hosting platform (Vercel, Netlify, etc.)

## Performance Optimization

- Images are optimized by Cloudinary CDN
- Angular change detection with OnPush strategy
- Lazy loading for components
- HTTP client with proper caching

## Future Enhancements

- [ ] User reviews and ratings
- [ ] Property favorites/wishlist
- [ ] Advanced search filters
- [ ] Email notifications
- [ ] Virtual tours
- [ ] Payment integration
- [ ] User profiles
- [ ] Appointment scheduling

## License

MIT

## Support

For issues or questions, please open an issue in the repository.

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

---

**Version**: 1.0.0
**Last Updated**: February 2026
