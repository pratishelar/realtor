import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC9cmFlEVr7SdSN9e7Pdq5wFl1FIbe1Aoc',
  authDomain: 'realtor-c3a25.firebaseapp.com',
  projectId: 'realtor-c3a25',
  storageBucket: 'realtor-c3a25.firebasestorage.app',
  messagingSenderId: '795981954740',
  appId: '1:795981954740:web:4b73a209c58e6865b6e1e1',
  measurementId: 'G-W344PKH6NW',
};

const now = new Date();

const commercialProperties = [
  {
    name: 'Skyline Business Hub',
    title: 'Skyline Business Hub',
    location: 'BKC Main Road',
    city: 'Mumbai',
    description: 'Grade-A commercial office tower with high-speed elevators and premium lobby access.',
    category: 'commercial',
    propertyType: { apartment: false, villa: false, house: false, plot: false, office: true, shop: false },
    numberOfUnits: 84,
    priceDetails: { basePrice: 85000000, governmentCharge: 4500000, totalPrice: 89500000 },
    price: 89500000,
    status: { underConstruction: false, readyToMove: true, resale: false },
    unitConfig: { '1bhk': false, '2bhk': false, '3bhk': false, '4bhk': false, '5bhk': false },
    size: { carpetArea: 4200, builtArea: 5600, totalArea: 5600 },
    area: 5600,
    bedrooms: 0,
    bathrooms: 4,
    priceList: [
      { configuration: 'Office Floor', area: 5600, price: 89500000 },
      { configuration: 'Half Floor Office', area: 2800, price: 45200000 },
    ],
    floorPlans: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop&q=80',
    ],
    amenitiesByCategory: {
      sports: [],
      convenience: ['Power Backup', 'Lift', 'Treated Water'],
      leisure: ['Café'],
    },
    amenities: ['Power Backup', 'Lift', 'Treated Water', 'Café'],
    reraDetails: {
      reraNumber: 'RERA-MH-OFC-1101',
      reraStatus: 'Registered',
      possession: 'Ready to Move',
    },
    possessionStatus: 'Ready to Move',
    images: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=800&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=800&fit=crop&q=80',
    features: ['Power Backup', 'Lift', 'Café'],
    owner: 'Prime Estates Pvt Ltd',
    phone: '+91 9876543210',
    email: 'commercial@primeestates.com',
    createdAt: now,
    updatedAt: now,
  },
  {
    name: 'Metro Retail Plaza',
    title: 'Metro Retail Plaza',
    location: 'Andheri West Link Road',
    city: 'Mumbai',
    description: 'High-footfall shopping plaza with double-height storefronts and dedicated parking.',
    category: 'commercial',
    propertyType: { apartment: false, villa: false, house: false, plot: false, office: false, shop: true },
    numberOfUnits: 52,
    priceDetails: { basePrice: 42000000, governmentCharge: 2400000, totalPrice: 44400000 },
    price: 44400000,
    status: { underConstruction: true, readyToMove: false, resale: false },
    unitConfig: { '1bhk': false, '2bhk': false, '3bhk': false, '4bhk': false, '5bhk': false },
    size: { carpetArea: 1500, builtArea: 2200, totalArea: 2200 },
    area: 2200,
    bedrooms: 0,
    bathrooms: 2,
    priceList: [
      { configuration: 'Retail Shop', area: 2200, price: 44400000 },
      { configuration: 'Corner Shop', area: 1300, price: 26200000 },
    ],
    floorPlans: [
      'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=1200&h=800&fit=crop&q=80',
    ],
    amenitiesByCategory: {
      sports: [],
      convenience: ['Power Backup', 'Lift'],
      leisure: ['Café', 'Indoor Games'],
    },
    amenities: ['Power Backup', 'Lift', 'Café', 'Indoor Games'],
    reraDetails: {
      reraNumber: 'RERA-MH-SHP-2033',
      reraStatus: 'Registered',
      possession: 'Under Construction',
    },
    possessionStatus: 'Under Construction',
    images: [
      'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1200&h=800&fit=crop&q=80',
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=800&fit=crop&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1200&h=800&fit=crop&q=80',
    features: ['Power Backup', 'Lift', 'Café'],
    owner: 'Retail Core Developers',
    phone: '+91 9811112233',
    email: 'sales@retailcore.in',
    createdAt: now,
    updatedAt: now,
  },
  {
    name: 'Logistics Plot Sector 18',
    title: 'Logistics Plot Sector 18',
    location: 'Industrial Belt Sector 18',
    city: 'Pune',
    description: 'Large industrial/commercial plot ideal for warehouse and logistics operations.',
    category: 'commercial',
    propertyType: { apartment: false, villa: false, house: false, plot: true, office: false, shop: false },
    numberOfUnits: 1,
    priceDetails: { basePrice: 98000000, governmentCharge: 5200000, totalPrice: 103200000 },
    price: 103200000,
    status: { underConstruction: false, readyToMove: false, resale: true },
    unitConfig: { '1bhk': false, '2bhk': false, '3bhk': false, '4bhk': false, '5bhk': false },
    size: { carpetArea: 22000, builtArea: 25000, totalArea: 25000 },
    area: 25000,
    bedrooms: 0,
    bathrooms: 0,
    priceList: [{ configuration: 'Commercial Plot', area: 25000, price: 103200000 }],
    floorPlans: [
      'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=1200&h=800&fit=crop&q=80',
    ],
    amenitiesByCategory: {
      sports: [],
      convenience: ['Power Backup'],
      leisure: [],
    },
    amenities: ['Power Backup'],
    reraDetails: {
      reraNumber: 'RERA-MH-PLT-7851',
      reraStatus: 'Registered',
      possession: 'Resale',
    },
    possessionStatus: 'Resale',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&h=800&fit=crop&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop&q=80',
    features: ['Commercial Plot', 'Power Backup'],
    owner: 'Westland Infra',
    phone: '+91 9922334455',
    email: 'plots@westlandinfra.com',
    createdAt: now,
    updatedAt: now,
  },
  {
    name: 'Orbit Trade Center',
    title: 'Orbit Trade Center',
    location: 'MG Road Business District',
    city: 'Bengaluru',
    description: 'Modern commercial complex with flexible office spaces and conference facilities.',
    category: 'commercial',
    propertyType: { apartment: false, villa: false, house: false, plot: false, office: true, shop: false },
    numberOfUnits: 96,
    priceDetails: { basePrice: 67000000, governmentCharge: 3500000, totalPrice: 70500000 },
    price: 70500000,
    status: { underConstruction: false, readyToMove: true, resale: false },
    unitConfig: { '1bhk': false, '2bhk': false, '3bhk': false, '4bhk': false, '5bhk': false },
    size: { carpetArea: 3200, builtArea: 4100, totalArea: 4100 },
    area: 4100,
    bedrooms: 0,
    bathrooms: 3,
    priceList: [
      { configuration: 'Office Suite', area: 4100, price: 70500000 },
      { configuration: 'Executive Office', area: 2200, price: 38200000 },
    ],
    floorPlans: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=800&fit=crop&q=80',
    ],
    amenitiesByCategory: {
      sports: [],
      convenience: ['Power Backup', 'Lift', 'Treated Water'],
      leisure: ['Café'],
    },
    amenities: ['Power Backup', 'Lift', 'Treated Water', 'Café'],
    reraDetails: {
      reraNumber: 'RERA-KA-OFC-4509',
      reraStatus: 'Registered',
      possession: 'Ready to Move',
    },
    possessionStatus: 'Ready to Move',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=800&fit=crop&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop&q=80',
    features: ['Power Backup', 'Lift', 'Treated Water'],
    owner: 'Orbit Commercial LLP',
    phone: '+91 9988776655',
    email: 'hello@orbittradecenter.com',
    createdAt: now,
    updatedAt: now,
  },
  {
    name: 'Central Bazaar Shops',
    title: 'Central Bazaar Shops',
    location: 'City Center Market Lane',
    city: 'Nashik',
    description: 'Retail-ready commercial shops in a high-demand market zone with all utilities.',
    category: 'commercial',
    propertyType: { apartment: false, villa: false, house: false, plot: false, office: false, shop: true },
    numberOfUnits: 34,
    priceDetails: { basePrice: 29000000, governmentCharge: 1600000, totalPrice: 30600000 },
    price: 30600000,
    status: { underConstruction: false, readyToMove: false, resale: true },
    unitConfig: { '1bhk': false, '2bhk': false, '3bhk': false, '4bhk': false, '5bhk': false },
    size: { carpetArea: 980, builtArea: 1400, totalArea: 1400 },
    area: 1400,
    bedrooms: 0,
    bathrooms: 1,
    priceList: [
      { configuration: 'Retail Shop', area: 1400, price: 30600000 },
      { configuration: 'Kiosk', area: 650, price: 14200000 },
    ],
    floorPlans: [
      'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=1200&h=800&fit=crop&q=80',
    ],
    amenitiesByCategory: {
      sports: [],
      convenience: ['Power Backup', 'Lift'],
      leisure: ['Indoor Games'],
    },
    amenities: ['Power Backup', 'Lift', 'Indoor Games'],
    reraDetails: {
      reraNumber: 'RERA-MH-SHP-9920',
      reraStatus: 'Registered',
      possession: 'Resale',
    },
    possessionStatus: 'Resale',
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519566335946-e6f65f0f4fdf?w=1200&h=800&fit=crop&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop&q=80',
    features: ['Power Backup', 'Lift', 'Indoor Games'],
    owner: 'Central Bazaar Ventures',
    phone: '+91 9765432109',
    email: 'leasing@centralbazaar.in',
    createdAt: now,
    updatedAt: now,
  },
];

async function seedCommercialProperties() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const colRef = collection(db, 'properties');

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@realtor.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';

  console.log(`Signing in as ${adminEmail}...`);
  await signInWithEmailAndPassword(auth, adminEmail, adminPassword);

  console.log(`Seeding ${commercialProperties.length} commercial properties...`);

  const insertedIds = [];
  for (const property of commercialProperties) {
    const docRef = await addDoc(colRef, property);
    insertedIds.push(docRef.id);
    console.log(`Inserted: ${property.name} -> ${docRef.id}`);
  }

  console.log('\nSeed complete. Inserted document IDs:');
  insertedIds.forEach((id) => console.log(`- ${id}`));
}

seedCommercialProperties().catch((error) => {
  console.error('Failed to seed commercial properties:', error);
  process.exitCode = 1;
});
