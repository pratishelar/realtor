# Real Estate Website with Angular, Firebase, and Cloudinary

A full-featured real estate property listing website built with Angular, Firebase for data storage, Cloudinary for image management, and an admin panel for property management.

## Features

- **Public Website**
  - Browse all properties
  - View detailed property information with image gallery
  - Search properties by title, location, or description
  - Filter properties by price range
  - Responsive design

- **Admin Panel**
  - Secure admin login with Firebase Authentication
  - Add new properties
  - Edit existing properties
  - Delete properties
  - Upload multiple images via Cloudinary
  - Manage property details

## Tech Stack

- **Frontend**: Angular 19
- **Backend**: Firebase (Firestore + Authentication)
- **Image Storage**: Cloudinary
- **Styling**: CSS3

## Prerequisites

Before you begin, make sure you have:
- Node.js 18+ installed
- Firebase project created
- Cloudinary account created
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   cd realtor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Configuration

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Firestore Database and Authentication (Email/Password)
4. Create an admin user in Authentication section
5. Copy your Firebase configuration

### Update Environment Configuration

Edit `src/environments/environment.ts` and add your Firebase credentials:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
  cloudinary: {
    cloudName: 'YOUR_CLOUD_NAME',
    uploadPreset: 'YOUR_UPLOAD_PRESET',
  },
};
```

### Cloudinary Setup

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy your Cloud Name
3. Create an Upload Preset (Settings > Upload):
   - Set "Unsigned" to allow uploads from the frontend
4. Add the Upload Preset to your environment configuration

### Firebase Firestore Rules

Set the following security rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read properties
    match /properties/{document=**} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

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

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/           # Navigation component
│   │   ├── home/             # Home page
│   │   ├── properties/       # Property listing
│   │   ├── property-detail/  # Property details page
│   │   ├── login/            # Admin login
│   │   └── admin-dashboard/  # Admin panel
│   ├── services/
│   │   ├── property.service.ts    # Property CRUD operations
│   │   ├── auth.service.ts        # Authentication
│   │   └── cloudinary.service.ts  # Image uploads
│   ├── models/
│   │   └── property.model.ts      # Property interface
│   ├── guards/
│   │   └── auth.guard.ts          # Route protection
│   ├── app.routes.ts              # Route configuration
│   └── app.config.ts              # App configuration
├── environments/
│   └── environment.ts             # Configuration
└── styles.css                      # Global styles
```

## Usage Guide

### Accessing the Admin Panel

1. Navigate to `http://localhost:4200/admin`
2. You'll be redirected to the login page
3. Enter your Firebase admin credentials
4. You can now add, edit, or delete properties

### Adding a Property

1. Go to the Admin Dashboard
2. Click "Add Property" tab
3. Fill in all property details:
   - Title, description, price
   - Location, bedrooms, bathrooms, area
   - Owner information (name, email, phone)
   - Features (comma-separated)
4. Upload images from your computer
5. Click "Add Property"

### Editing a Property

1. Go to "My Properties" tab in Admin Dashboard
2. Click "Edit" on the property you want to modify
3. Update the details
4. Click "Update Property"

### Deleting a Property

1. Go to "My Properties" tab
2. Click "Delete" on the property
3. Confirm the deletion

## File Upload Details

- Images are uploaded to Cloudinary via their Upload API
- The URLs are stored in Firestore
- Multiple images per property are supported
- Supported formats: JPG, PNG, GIF, WebP

## Firestore Database Schema

### Properties Collection

```javascript
{
  id: string (auto-generated)
  title: string
  description: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  images: array[string] // Cloudinary URLs
  features: array[string]
  owner: string
  email: string
  phone: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Security Considerations

- Admin login is required to modify properties
- Firebase authentication ensures only authorized users can upload
- Firestore security rules restrict write access
- Environment variables are used for sensitive data
- Input validation is performed on all forms

## Troubleshooting

### Images not uploading
- Verify your Cloudinary credentials in environment.ts
- Check that the upload preset is set to "Unsigned"
- Ensure the file size is within Cloudinary limits

### Cannot login to admin panel
- Verify your Firebase credentials
- Check that you have created an admin user in Firebase Authentication
- Ensure email/password authentication is enabled in Firebase

### Properties not loading
- Check browser console for errors
- Verify Firebase Firestore is initialized
- Ensure Firestore rules allow read access

## Performance Tips

- Images are cached by Cloudinary's CDN
- Firestore queries are optimized with proper indexing
- Angular's change detection is optimized with OnPush strategy where possible

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- User reviews and ratings
- Advanced search filters
- Property listings by agent
- Favorites/wishlist feature
- Email notifications
- Payment integration for premium listings

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please check the Firebase and Cloudinary documentation:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Angular Documentation](https://angular.io/docs)

## Getting Help

If you encounter any issues:

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure all npm dependencies are installed
4. Review the Firebase and Cloudinary configurations
5. Check Firestore security rules

Happy coding! 🚀
