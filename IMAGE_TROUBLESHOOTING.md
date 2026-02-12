# Image Upload Troubleshooting Guide

## Issue: Images Coming Blank

If properties are showing "No Image" or images are not displaying, follow this checklist:

## 1. Check Cloudinary Configuration

**File**: `src/environments/environment.ts`

```typescript
cloudinary: {
  cloudName: 'REPLACE_WITH_CLOUDINARY_CLOUD_NAME',
  uploadPreset: 'REPLACE_WITH_UNSIGNED_UPLOAD_PRESET',
}
```

- [ ] Cloud name is not "REPLACE_WITH_..."
- [ ] Upload preset is not "REPLACE_WITH_..."
- [ ] Upload preset exists in Cloudinary dashboard
- [ ] Upload preset is set to "Unsigned"

## 2. Debug Image Upload in Admin Dashboard

### Step 1: Open Browser DevTools
1. Go to `http://localhost:4200/admin` (login first)
2. Press `F12` to open DevTools
3. Go to **Console** tab

### Step 2: Check Upload Progress
1. Try uploading a property with images
2. Watch the console for:
   - `Uploading images...` messages
   - Any error messages about Cloudinary
   - `Image URL:` messages with successful uploads

### Step 3: Check Network Requests
1. Go to **Network** tab in DevTools
2. Filter by "cloudinary.com" or "api.cloudinary.com"
3. Try uploading images again
4. Look for requests to Cloudinary
5. Check response status - should be 200 OK

**Common Issues**:
- 401 Unauthorized → Check cloud name and upload preset
- 403 Forbidden → Upload preset might not be unsigned
- CORS error → Check Cloudinary CORS settings

## 3. Verify Firebase Document Structure

### Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Firestore Database**
4. Click on **Collections** → **properties**

### Step 2: Check Property Documents
1. Click on any property document
2. Look for the `images` field
3. Should be an array: `["url1", "url2", ...]`

**If `images` field is missing or empty**:
- Properties are being created without images
- Check admin dashboard form is uploading correctly

**If `images` field has URLs**:
- Problem is in image display, not upload
- Check browser console for CORS errors

## 4. Test Image Upload Directly

### In Admin Dashboard Console (F12 → Console):

```javascript
// Test if Cloudinary is accessible
fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/search')
  .then(r => r.json())
  .then(d => console.log('Cloudinary accessible:', d))
  .catch(e => console.error('Cloudinary error:', e))
```

Replace `YOUR_CLOUD_NAME` with your actual cloud name.

## 5. Common Solutions

### Solution A: Images Not Uploading
1. **The Problem**: Images field is empty when creating property
2. **The Fix**: 
   - Select image files in the form
   - Wait for upload to complete (progress bar should show 100%)
   - Then click "Create Property"

### Solution B: Images Uploaded but Not Stored
1. **The Problem**: Cloudinary gets images but they're not in Firestore
2. **The Fix**:
   - Make sure images are uploaded BEFORE clicking Create
   - Check that `formData.images` is populated
   - Look at admin dashboard console during upload

### Solution C: Images in Firestore but Not Displaying
1. **The Problem**: Firestore has image URLs but they don't show on property page
2. **The Fix**:
   - Check image URLs in Firestore are valid
   - Try opening URL in browser directly
   - Check browser console for CORS errors
   - Verify Cloudinary CORS settings

## 6. Complete Testing Workflow

1. **Login to admin dashboard**
   ```
   URL: http://localhost:4200/admin
   Email: admin@realtor.com
   Password: admin123
   ```

2. **Create a test property**:
   - Title: "Test Property"
   - Description: "Test description"
   - Price: 500000
   - Location: "Test City"
   - Bedrooms: 2
   - Bathrooms: 1
   - Area: 1500
   - Owner: "Test Owner"

3. **Upload test image**:
   - Click "Choose Files"
   - Select an image from your computer
   - Wait for upload progress to show 100%
   - See image thumbnails in the preview section

4. **Submit the form**:
   - Click "Create Property"
   - Wait for success message

5. **Verify in Firebase**:
   - Open Firebase Console → Firestore
   - Find the new property
   - Check if `images` array contains URLs

6. **Verify on website**:
   - Go to `http://localhost:4200/properties`
   - Should see property card with image
   - Click to view proper details page
   - Image should display in gallery

## 7. Check Logs

### In Admin Dashboard:
1. Open browser DevTools Console (F12)
2. Create a property
3. Look for these logs:
   - ✅ `Image URL: https://res.cloudinary.com/...`
   - ✅ `Property created successfully!`

### In Property Detail Page:
1. Click on a property
2. Open DevTools Console
3. Should see:
   - ✅ `Property loaded: {...}`
   - ✅ `Property images: ["url1", "url2", ...]`
   - ✅ `First image set: https://res.cloudinary.com/...`

### If You See These Warnings:
- ⚠️ `No images found for property` → Images array is empty
- ⚠️ `Property images: []` → Firestore document has empty images array
- ⚠️ `Property images: undefined` → Images field missing from database

## 8. Reset and Try Again

If nothing works, start fresh:

1. **Clear all data**:
   ```bash
   # In Firebase Console:
   # Delete all documents from properties collection
   ```

2. **Clear browser cache**:
   - Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
   - Clear cookies and cache

3. **Restart dev server**:
   ```bash
   npm start
   ```

4. **Follow complete testing workflow** (section 6)

## Still Not Working?

Return to setup guide and verify:

1. ✅ Firebase credentials in `environment.ts` are correct
2. ✅ Cloudinary cloud name in `environment.ts` is correct
3. ✅ Cloudinary upload preset in `environment.ts` exists and is unsigned
4. ✅ Firebase authentication is enabled
5. ✅ Firestore database exists and is initialized
6. ✅ Test user exists in Firebase Authentication

---

**Debug Checklist**:
- [ ] Cloudinary is configured correctly
- [ ] Upload preset is unsigned
- [ ] Firebase credentials are correct
- [ ] DevTools shows successful uploads
- [ ] Firebase shows images in documents
- [ ] Images display on property page

If you complete all steps and still have issues, check the browser console for specific error messages and share them for debugging.
