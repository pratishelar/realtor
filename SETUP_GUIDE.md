# Setup Guide - Real Estate Platform

## Step 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `realtor-app`
4. Disable Google Analytics (optional)
5. Click "Create project"
6. Wait for project creation to complete

### 1.2 Get Firebase Credentials

1. In Firebase console, click the gear icon → Project Settings
2. Scroll down to "Your apps" section
3. Click "Web" icon to add a web app
4. Enter app name: `Realtor Web App`
5. Check "Also set up Firebase Hosting"
6. Click "Register app"
7. Copy the Firebase config object
8. Click "Continue to console"

### 1.3 Update Environment Configuration

1. Open `src/environments/environment.ts`
2. Replace the firebase object with your credentials:

```typescript
firebase: {
  apiKey: "xxxxx.apps.googleusercontent.com",
  authDomain: "realtor-app.firebaseapp.com",
  projectId: "realtor-app",
  storageBucket: "realtor-app.appspot.com",
  messagingSenderId: "12345678901",
  appId: "1:12345678901:web:xxxxxxxxxxxxx"
}
```

### 1.4 Enable Firestore Database

1. In Firebase console, go to "Firestore Database"
2. Click "Create database"
3. Select location (closest to your users)
4. Start in **test mode** (for development)
5. Click "Enable"

### 1.5 Enable Authentication

1. In Firebase console, go to "Authentication"
2. Click "Get started"
3. Click "Email/Password" provider
4. Toggle "Enable"
5. Click "Save"

### 1.6 Create Test User

1. In Authentication section, click "Users" tab
2. Click "Add user"
3. Email: `admin@realtor.com`
4. Password: `admin123`
5. Click "Add user"

### 1.7 Set Up Firestore Security Rules (Optional - for production)

1. Go to Firestore Database
2. Click "Rules" tab
3. Replace default rules with:

```typescript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access to properties
    match /properties/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

4. Click "Publish"

---

## Step 2: Cloudinary Setup

### 2.1 Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Click "Sign up"
3. Create account (free tier is sufficient)
4. Verify email

### 2.2 Get Cloud Name

1. Log in to Cloudinary Dashboard
2. Your "Cloud Name" is displayed at the top
3. Copy and save it

### 2.3 Create Upload Preset

1. In Cloudinary Dashboard, go to Settings (gear icon)
2. Click "Upload" tab
3. Scroll to "Upload presets" section
4. Click "Add upload preset"
5. Configure:
   - **Name**: `realtor_upload` (or your preference)
   - **Unsigned**: Toggle ON (allows uploads without backend)
   - **Folder**: `realtor/properties` (optional, for organization)
   - **Resource type**: Image
6. Click "Save"

### 2.4 Update Environment Configuration

1. Open `src/environments/environment.ts`
2. Update cloudinary object:

```typescript
cloudinary: {
  cloudName: 'your_cloud_name',
  uploadPreset: 'realtor_upload',
}
```

### 2.5 (Optional) Configure Image Transformations

1. In Cloudinary Settings → Delivery
2. Set up automatic optimization:
   - Enable automatic quality adjustment
   - Enable automatic format selection (WebP, AVIF)
3. Click "Save"

---

## Step 3: Application Configuration

### 3.1 Install Dependencies

```bash
cd /Users/pratish/Desktop/DS/realtor
npm install --legacy-peer-deps
```

### 3.2 Verify Configuration

1. Open `src/environments/environment.ts`
2. Verify all fields are filled:
   - [ ] Firebase apiKey
   - [ ] Firebase authDomain
   - [ ] Firebase projectId
   - [ ] Firebase storageBucket
   - [ ] Firebase messagingSenderId
   - [ ] Firebase appId
   - [ ] Cloudinary cloudName
   - [ ] Cloudinary uploadPreset

### 3.3 Run Development Server

```bash
npm start
```

Visit: `http://localhost:4200/`

---

## Step 4: Test the Application

### 4.1 Test Public Features

1. Visit `http://localhost:4200/`
2. Test home page loads
3. Click "Browse Properties" or go to `/properties`
4. Verify properties list (should be empty initially)

### 4.2 Test Admin Features

1. Go to `/login`
2. Login with:
   - Email: `admin@realtor.com`
   - Password: `admin123`
3. You should be redirected to `/admin` dashboard

### 4.3 Add Test Property

1. In admin dashboard, fill in form:
   - **Title**: `Luxury Downtown Apartment`
   - **Description**: `Beautiful 2-bedroom apartment in downtown area`
   - **Price**: `500000`
   - **Location**: `New York, NY`
   - **Bedrooms**: `2`
   - **Bathrooms**: `2`
   - **Area**: `1500`
   - **Owner**: `John Doe`
   - **Email**: `john@example.com`
   - **Phone**: `555-1234`
   - **Features**: `Gym, Pool, Parking`

2. Select property images (if available)
3. Click "Create Property"
4. Verify property appears in table below

### 4.4 Verify Public Listing

1. Log out from admin
2. Go to `/properties`
3. Verify newly created property appears
4. Click property to view details
5. Verify all information displays correctly

### 4.5 Test Features

- [ ] Search functionality
- [ ] Price filters
- [ ] Edit property
- [ ] Delete property
- [ ] Image upload and display
- [ ] Responsive design on mobile

---

## Troubleshooting

### Firebase Connection Error
- **Issue**: Properties don't load or upload fails
- **Solution**:
  1. Verify `environment.ts` has correct credentials
  2. Check Firestore is enabled in Firebase console
  3. Check browser console for error messages
  4. Verify security rules allow read/write

### Cloudinary Upload Fails
- **Issue**: Images don't upload
- **Solution**:
  1. Verify cloud name is correct
  2. Verify upload preset exists and is unsigned
  3. Check upload preset is set to "Image" type
  4. Check browser console for CORS errors
  5. Verify image file is valid

### Authentication Issues
- **Issue**: Can't login to admin dashboard
- **Solution**:
  1. Verify test user exists in Firebase Authentication
  2. Check email and password are correct
  3. Verify Auth is enabled in Firebase
  4. Clear browser cache and cookies

### Build Errors
- **Issue**: npm install fails
- **Solution**:
  ```bash
  rm -rf node_modules package-lock.json
  npm install --legacy-peer-deps
  ```

### Port Already in Use
- **Issue**: `ng serve` fails - port 4200 in use
- **Solution**:
  ```bash
  ng serve --port 4201
  ```

---

## Next Steps

1. Add more properties to test the system
2. Customize styling and branding
3. Set up production Firebase project
4. Deploy to Firebase Hosting or other platform
5. Configure domain and SSL certificate
6. Set up analytics and monitoring
7. Implement advanced features (reviews, favorites, etc.)

---

## Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Angular Fire Documentation](https://github.com/angular/angularfire)

---

**Last Updated**: February 2026
