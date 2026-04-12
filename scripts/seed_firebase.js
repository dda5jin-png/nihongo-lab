const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Since we are running locally and have a service account key (or using default auth)
// We'll use the environment variables or a simple script approach.
// However, since I don't have the service account JSON yet, I'll use the firebase-admin with the project ID
// and it should pick up the credentials from the logged-in CLI session.

process.env.GOOGLE_CLOUD_PROJECT = 'jplab-senior-77175';

const app = initializeApp({
  projectId: 'jplab-senior-77175'
});

const db = getFirestore();

const cards = [
  { japanese: "こんにちは", reading: "Konnichiwa", meaning: "안녕하세요", level: "1", order: 1 },
  { japanese: "ありがとう", reading: "Arigatou", meaning: "고맙습니다", level: "1", order: 2 },
  { japanese: "すみません", reading: "Sumimasen", meaning: "미안합니다 / 실례합니다", level: "1", order: 3 },
  { japanese: "さようなら", reading: "Sayounara", meaning: "작별 인사 (안녕히 가세요)", level: "1", order: 4 },
  { japanese: "はい", reading: "Hai", meaning: "네", level: "1", order: 5 },
];

async function seed() {
  console.log('Seeding initial cards to Firestore...');
  const batch = db.batch();
  
  cards.forEach((card) => {
    const docRef = db.collection('cards').doc();
    batch.set(docRef, card);
  });

  await batch.commit();
  console.log('Successfully seeded 5 cards!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
