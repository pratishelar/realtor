// Environment configuration for development
// Replace the placeholder strings with your real Firebase and Cloudinary values.

export const environment = {
    production: false,
    firebase: {
        apiKey: "AIzaSyC9cmFlEVr7SdSN9e7Pdq5wFl1FIbe1Aoc",
        authDomain: "realtor-c3a25.firebaseapp.com",
        projectId: "realtor-c3a25",
        storageBucket: "realtor-c3a25.firebasestorage.app",
        messagingSenderId: "795981954740",
        appId: "1:795981954740:web:4b73a209c58e6865b6e1e1",
        measurementId: "G-W344PKH6NW",
    },
    cloudinary: {
        // Cloudinary cloud name and unsigned upload preset used by the frontend
        cloudName: 'dexatoupi',
        uploadPreset: 'realtor_upload',
    },
};
