import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, getFirestore, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC9cmFlEVr7SdSN9e7Pdq5wFl1FIbe1Aoc',
  authDomain: 'realtor-c3a25.firebaseapp.com',
  projectId: 'realtor-c3a25',
  storageBucket: 'realtor-c3a25.firebasestorage.app',
  messagingSenderId: '795981954740',
  appId: '1:795981954740:web:4b73a209c58e6865b6e1e1',
  measurementId: 'G-W344PKH6NW',
};

const puneDivisions = ['Pune east', 'Pune west', 'Pune north', 'Pune south', 'PCMC'];
const mumbaiDivisions = ['Mumbai western', 'Thane', 'Mumbai central', 'Vashi', 'Mira Bhayandar', 'Panvel', 'Bhewandi', 'Dombivli'];

function inferCity(rawCity = '', rawLocation = '') {
  const cityText = String(rawCity || '').toLowerCase();
  const locationText = String(rawLocation || '').toLowerCase();
  const fullText = `${cityText} ${locationText}`;

  const mumbaiSignals = ['mumbai', 'thane', 'vashi', 'panvel', 'bhiwandi', 'bhewandi', 'dombivli', 'mira', 'bhayandar'];
  if (mumbaiSignals.some((signal) => fullText.includes(signal))) {
    return 'Mumbai';
  }

  return 'Pune';
}

function inferDivision(city, rawLocation = '') {
  const location = String(rawLocation || '').toLowerCase();

  if (city === 'Mumbai') {
    if (location.includes('thane') || location.includes('kalwa')) return 'Thane';
    if (location.includes('mira') || location.includes('bhayandar')) return 'Mira Bhayandar';
    if (location.includes('vashi')) return 'Vashi';
    if (location.includes('panvel')) return 'Panvel';
    if (location.includes('bhiwandi') || location.includes('bhewandi')) return 'Bhewandi';
    if (location.includes('dombivli')) return 'Dombivli';
    if (location.includes('kurla') || location.includes('ghatkopar') || location.includes('powai') || location.includes('mulund')) return 'Mumbai central';
    return 'Mumbai western';
  }

  if (location.includes('pcmc') || location.includes('pimpri') || location.includes('chinchwad') || location.includes('wakad')) return 'PCMC';
  if (location.includes('kharadi') || location.includes('viman') || location.includes('hadapsar') || location.includes('wagholi')) return 'Pune east';
  if (location.includes('baner') || location.includes('balewadi') || location.includes('hinjewadi') || location.includes('mahalunge')) return 'Pune west';
  if (location.includes('kothrud') || location.includes('shivajinagar') || location.includes('camp') || location.includes('deccan')) return 'Pune north';
  if (location.includes('katraj') || location.includes('kondhwa') || location.includes('undri') || location.includes('bibwewadi')) return 'Pune south';
  return 'Pune west';
}

function normalizeDivision(city, division, location) {
  const safeDivision = String(division || '').trim();
  const allowed = city === 'Mumbai' ? mumbaiDivisions : puneDivisions;
  if (allowed.includes(safeDivision)) {
    return safeDivision;
  }
  return inferDivision(city, location);
}

async function updateCityAndDivision() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@realtor.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';

  console.log(`Signing in as ${adminEmail}...`);
  await signInWithEmailAndPassword(auth, adminEmail, adminPassword);

  const colRef = collection(db, 'properties');
  const snapshot = await getDocs(colRef);

  if (snapshot.empty) {
    console.log('No property documents found.');
    return;
  }

  console.log(`Found ${snapshot.size} properties. Updating city/cityDivision...`);

  let updated = 0;
  let skipped = 0;

  for (const item of snapshot.docs) {
    const data = item.data() || {};
    const city = inferCity(data.city, data.location);
    const cityDivision = normalizeDivision(city, data.cityDivision, data.location);

    const shouldUpdate = data.city !== city || data.cityDivision !== cityDivision;
    if (!shouldUpdate) {
      skipped += 1;
      continue;
    }

    await updateDoc(doc(db, 'properties', item.id), {
      city,
      cityDivision,
      updatedAt: new Date(),
    });

    updated += 1;
    console.log(`Updated ${item.id}: city=${city}, cityDivision=${cityDivision}`);
  }

  console.log(`Done. Updated: ${updated}, Skipped: ${skipped}`);
}

updateCityAndDivision().catch((error) => {
  console.error('Failed to update city/cityDivision for existing data:', error);
  process.exitCode = 1;
});
