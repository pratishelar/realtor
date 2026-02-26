import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';

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

function buildResidentialProperty({
  name,
  location,
  city,
  cityDivision,
  price,
  area,
  bedrooms,
  bathrooms,
  image,
}) {
  const bhkKey = `${Math.min(Math.max(bedrooms, 1), 5)}bhk`;

  return {
    name,
    title: name,
    location,
    city,
    cityDivision,
    description: `${name} is a premium residential project in ${location}, ${city}.`,
    category: 'residential',
    propertyType: { apartment: true, villa: false, house: false, plot: false, office: false, shop: false },
    numberOfUnits: 120,
    priceDetails: {
      basePrice: price,
      governmentCharge: Math.round(price * 0.05),
      totalPrice: Math.round(price * 1.05),
    },
    price: Math.round(price * 1.05),
    status: {
      underConstruction: true,
      readyToMove: false,
      resale: false,
    },
    unitConfig: {
      '1bhk': bhkKey === '1bhk',
      '2bhk': bhkKey === '2bhk',
      '3bhk': bhkKey === '3bhk',
      '4bhk': bhkKey === '4bhk',
      '5bhk': bhkKey === '5bhk',
    },
    size: {
      carpetArea: Math.round(area * 0.75),
      builtArea: area,
      totalArea: area,
    },
    area,
    bedrooms,
    bathrooms,
    priceList: [
      {
        configuration: `${bedrooms} BHK`,
        area,
        price: Math.round(price * 1.05),
      },
    ],
    floorPlans: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=800&fit=crop&q=80',
    ],
    amenitiesByCategory: {
      sports: ['Gymnasium', 'Swimming Pool'],
      convenience: ['Power Backup', 'Lift', 'Treated Water'],
      leisure: ['Clubhouse', 'Kids Play Area'],
    },
    amenities: ['Gymnasium', 'Swimming Pool', 'Power Backup', 'Lift', 'Treated Water', 'Clubhouse', 'Kids Play Area'],
    reraDetails: {
      reraNumber: `RERA-${city.slice(0, 2).toUpperCase()}-${name.replace(/\s+/g, '').slice(0, 6).toUpperCase()}-${Math.floor(
        1000 + Math.random() * 9000,
      )}`,
      reraStatus: 'Registered',
      possession: 'Under Construction',
    },
    possessionStatus: 'Under Construction',
    images: [
      image,
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=1200&h=800&fit=crop&q=80',
    ],
    mainImage: image,
    features: ['Gymnasium', 'Swimming Pool', 'Power Backup', 'Clubhouse'],
    owner: 'DS Associates',
    phone: '+91 9876543210',
    email: 'sales@dsassociates.in',
    createdAt: now,
    updatedAt: now,
  };
}

function buildCommercialProperty({
  name,
  location,
  city,
  cityDivision,
  price,
  area,
  image,
  type = 'office',
}) {
  return {
    name,
    title: name,
    location,
    city,
    cityDivision,
    description: `${name} is a premium commercial project in ${location}, ${city}.`,
    category: 'commercial',
    propertyType: {
      apartment: false,
      villa: false,
      house: false,
      plot: type === 'plot',
      office: type === 'office',
      shop: type === 'shop',
    },
    numberOfUnits: 80,
    priceDetails: {
      basePrice: price,
      governmentCharge: Math.round(price * 0.06),
      totalPrice: Math.round(price * 1.06),
    },
    price: Math.round(price * 1.06),
    status: {
      underConstruction: true,
      readyToMove: false,
      resale: false,
    },
    unitConfig: {
      '1bhk': false,
      '2bhk': false,
      '3bhk': false,
      '4bhk': false,
      '5bhk': false,
    },
    size: {
      carpetArea: Math.round(area * 0.78),
      builtArea: area,
      totalArea: area,
    },
    area,
    bedrooms: 0,
    bathrooms: 2,
    priceList: [
      {
        configuration: type === 'shop' ? 'Retail Space' : type === 'plot' ? 'Commercial Plot' : 'Office Space',
        area,
        price: Math.round(price * 1.06),
      },
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
      reraNumber: `RERA-${city.slice(0, 2).toUpperCase()}-${name.replace(/\s+/g, '').slice(0, 6).toUpperCase()}-${Math.floor(
        1000 + Math.random() * 9000,
      )}`,
      reraStatus: 'Registered',
      possession: 'Under Construction',
    },
    possessionStatus: 'Under Construction',
    images: [
      image,
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=800&fit=crop&q=80',
    ],
    mainImage: image,
    features: ['Power Backup', 'Lift', 'Café'],
    owner: 'DS Associates',
    phone: '+91 9876543210',
    email: 'commercial@dsassociates.in',
    createdAt: now,
    updatedAt: now,
  };
}

const propertiesToSeed = [
  // Pune subdivisions
  buildResidentialProperty({
    name: 'East Crest Residency',
    location: 'Kharadi, Pune',
    city: 'Pune',
    cityDivision: 'Pune east',
    price: 9800000,
    area: 980,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'West Horizon Towers',
    location: 'Baner, Pune',
    city: 'Pune',
    cityDivision: 'Pune west',
    price: 12500000,
    area: 1120,
    bedrooms: 3,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'North Valley Heights',
    location: 'Shivajinagar, Pune',
    city: 'Pune',
    cityDivision: 'Pune north',
    price: 11800000,
    area: 1050,
    bedrooms: 3,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'South Grove Enclave',
    location: 'Kondhwa, Pune',
    city: 'Pune',
    cityDivision: 'Pune south',
    price: 9200000,
    area: 930,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'PCMC Urban Habitat',
    location: 'Pimpri, Pune',
    city: 'Pune',
    cityDivision: 'PCMC',
    price: 8600000,
    area: 890,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&h=800&fit=crop&q=80',
  }),

  // Mumbai subdivisions
  buildResidentialProperty({
    name: 'Western Skyline Residency',
    location: 'Andheri West, Mumbai',
    city: 'Mumbai',
    cityDivision: 'Mumbai western',
    price: 28500000,
    area: 1180,
    bedrooms: 3,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1472224371017-08207f84aaae?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'Thane Lakefront Towers',
    location: 'Majiwada, Thane',
    city: 'Mumbai',
    cityDivision: 'Thane',
    price: 16800000,
    area: 1020,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'Central Metro Habitat',
    location: 'Ghatkopar, Mumbai',
    city: 'Mumbai',
    cityDivision: 'Mumbai central',
    price: 24500000,
    area: 1090,
    bedrooms: 3,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'Vashi Bay Residences',
    location: 'Vashi, Navi Mumbai',
    city: 'Mumbai',
    cityDivision: 'Vashi',
    price: 18900000,
    area: 980,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'Mira Signature Towers',
    location: 'Mira Road, Mumbai',
    city: 'Mumbai',
    cityDivision: 'Mira Bhayandar',
    price: 15400000,
    area: 940,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'Panvel Green Heights',
    location: 'Panvel, Navi Mumbai',
    city: 'Mumbai',
    cityDivision: 'Panvel',
    price: 11200000,
    area: 900,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1519643381401-22c77e60520e?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'Bhewandi Industrial Greens',
    location: 'Bhewandi, Mumbai',
    city: 'Mumbai',
    cityDivision: 'Bhewandi',
    price: 13200000,
    area: 990,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'Dombivli Prime Habitat',
    location: 'Dombivli East, Mumbai',
    city: 'Mumbai',
    cityDivision: 'Dombivli',
    price: 10800000,
    area: 880,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=1200&h=800&fit=crop&q=80',
  }),

  // Pune subdivisions (second set)
  buildResidentialProperty({
    name: 'East Aurora Heights',
    location: 'Wagholi, Pune',
    city: 'Pune',
    cityDivision: 'Pune east',
    price: 8950000,
    area: 910,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'Westwood Elite Homes',
    location: 'Hinjewadi, Pune',
    city: 'Pune',
    cityDivision: 'Pune west',
    price: 13400000,
    area: 1160,
    bedrooms: 3,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'North Crown Residency',
    location: 'Kothrud, Pune',
    city: 'Pune',
    cityDivision: 'Pune north',
    price: 12100000,
    area: 1030,
    bedrooms: 3,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'South Park Avenue',
    location: 'Undri, Pune',
    city: 'Pune',
    cityDivision: 'Pune south',
    price: 9450000,
    area: 940,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'PCMC Metro Greens',
    location: 'Chinchwad, Pune',
    city: 'Pune',
    cityDivision: 'PCMC',
    price: 9050000,
    area: 920,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=1200&h=800&fit=crop&q=80',
  }),

  // Mumbai subdivisions (second set)
  buildResidentialProperty({
    name: 'Western Crest Icon',
    location: 'Bandra West, Mumbai',
    city: 'Mumbai',
    cityDivision: 'Mumbai western',
    price: 31200000,
    area: 1210,
    bedrooms: 3,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1600607687644-c7f34b5b4fef?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'Thane Riverside Homes',
    location: 'Ghodbunder Road, Thane',
    city: 'Mumbai',
    cityDivision: 'Thane',
    price: 17600000,
    area: 1010,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'Central Axis Residences',
    location: 'Kurla, Mumbai',
    city: 'Mumbai',
    cityDivision: 'Mumbai central',
    price: 22800000,
    area: 1060,
    bedrooms: 3,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'Vashi Palm Heights',
    location: 'Sector 17, Vashi',
    city: 'Mumbai',
    cityDivision: 'Vashi',
    price: 19100000,
    area: 970,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'Mira Bay View',
    location: 'Bhayandar West, Mumbai',
    city: 'Mumbai',
    cityDivision: 'Mira Bhayandar',
    price: 14900000,
    area: 930,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'Panvel Crown City',
    location: 'New Panvel, Navi Mumbai',
    city: 'Mumbai',
    cityDivision: 'Panvel',
    price: 11500000,
    area: 910,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'Bhewandi Gateway Homes',
    location: 'Bhewandi, Mumbai',
    city: 'Mumbai',
    cityDivision: 'Bhewandi',
    price: 13600000,
    area: 960,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=1200&h=800&fit=crop&q=80',
  }),
  buildResidentialProperty({
    name: 'Dombivli Sky Gardens',
    location: 'Dombivli West, Mumbai',
    city: 'Mumbai',
    cityDivision: 'Dombivli',
    price: 11100000,
    area: 890,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop&q=80',
  }),

  // Mumbai subdivisions (commercial set)
  buildCommercialProperty({
    name: 'Western Corporate Square',
    location: 'Andheri West, Mumbai',
    city: 'Mumbai',
    cityDivision: 'Mumbai western',
    price: 42600000,
    area: 2400,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop&q=80',
    type: 'office',
  }),
  buildCommercialProperty({
    name: 'Thane Business Hub',
    location: 'Wagle Estate, Thane',
    city: 'Mumbai',
    cityDivision: 'Thane',
    price: 31800000,
    area: 2100,
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop&q=80',
    type: 'office',
  }),
  buildCommercialProperty({
    name: 'Central Trade Avenue',
    location: 'Kurla, Mumbai',
    city: 'Mumbai',
    cityDivision: 'Mumbai central',
    price: 35200000,
    area: 1980,
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=800&fit=crop&q=80',
    type: 'shop',
  }),
  buildCommercialProperty({
    name: 'Vashi Commerce Point',
    location: 'Vashi, Navi Mumbai',
    city: 'Mumbai',
    cityDivision: 'Vashi',
    price: 28900000,
    area: 1860,
    image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1200&h=800&fit=crop&q=80',
    type: 'office',
  }),
  buildCommercialProperty({
    name: 'Mira Retail Plaza',
    location: 'Mira Road, Mumbai',
    city: 'Mumbai',
    cityDivision: 'Mira Bhayandar',
    price: 26400000,
    area: 1720,
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1200&h=800&fit=crop&q=80',
    type: 'shop',
  }),
  buildCommercialProperty({
    name: 'Panvel Logistics Park',
    location: 'Panvel, Navi Mumbai',
    city: 'Mumbai',
    cityDivision: 'Panvel',
    price: 33800000,
    area: 5600,
    image: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=1200&h=800&fit=crop&q=80',
    type: 'plot',
  }),
  buildCommercialProperty({
    name: 'Bhewandi Warehouse District',
    location: 'Bhewandi, Mumbai',
    city: 'Mumbai',
    cityDivision: 'Bhewandi',
    price: 29500000,
    area: 4800,
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&h=800&fit=crop&q=80',
    type: 'plot',
  }),
  buildCommercialProperty({
    name: 'Dombivli Trade Center',
    location: 'Dombivli, Mumbai',
    city: 'Mumbai',
    cityDivision: 'Dombivli',
    price: 24800000,
    area: 1680,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop&q=80',
    type: 'office',
  }),
];

async function seedCityDivisionProperties() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@realtor.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';

  console.log(`Signing in as ${adminEmail}...`);
  await signInWithEmailAndPassword(auth, adminEmail, adminPassword);

  const propertiesRef = collection(db, 'properties');
  const existingSnapshot = await getDocs(propertiesRef);
  const existingNames = new Set(
    existingSnapshot.docs
      .map((item) => String(item.data()?.name || '').trim().toLowerCase())
      .filter(Boolean),
  );

  let inserted = 0;
  let skipped = 0;

  for (const property of propertiesToSeed) {
    const key = property.name.trim().toLowerCase();
    if (existingNames.has(key)) {
      skipped += 1;
      console.log(`Skipped existing: ${property.name}`);
      continue;
    }

    const docRef = await addDoc(propertiesRef, property);
    inserted += 1;
    existingNames.add(key);
    console.log(`Inserted: ${property.name} -> ${docRef.id}`);
  }

  console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}`);
}

seedCityDivisionProperties().catch((error) => {
  console.error('Failed to seed city-division properties:', error);
  process.exitCode = 1;
});
