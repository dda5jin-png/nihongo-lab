const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Configuration from Environment Variables (set in GitHub Secrets)
const firebaseConfig = process.env.FIREBASE_SERVICE_ACCOUNT;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!firebaseConfig || !geminiApiKey) {
  console.error("Missing environment variables: FIREBASE_SERVICE_ACCOUNT or GEMINI_API_KEY");
  process.exit(1);
}

const serviceAccount = JSON.parse(firebaseConfig);
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const genAI = new GoogleGenerativeAI(geminiApiKey);

async function collectData() {
  console.log("Starting daily Japanese expression collection...");
  
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `
    Generate 5 new Japanese expressions for seniors learning Japanese.
    Format as a JSON array of objects. Each object should have:
    - japanese: The expression in Kanji/Kana
    - reading: Romaji reading
    - meaning: Korean translation
    - level: "1" (for beginners)
    
    Example:
    [
      {"japanese": "お元気ですか", "reading": "Ogenki desu ka", "meaning": "잘 지내시나요?", "level": "1"}
    ]
    Avoid repeating common basics like 'Konnichiwa' if possible. Focus on warm, daily polite expressions.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Basic cleanup to find the JSON array
  const jsonMatch = text.match(/\[.*\]/s);
  if (!jsonMatch) {
    throw new Error("Failed to parse AI response as JSON");
  }
  
  const cards = JSON.parse(jsonMatch[0]);
  console.log(`AI generated ${cards.length} new expressions.`);

  const batch = db.batch();
  cards.forEach((card) => {
    const docRef = db.collection('cards').doc();
    batch.set(docRef, card);
  });

  await batch.commit();
  console.log("Successfully saved new expressions to Firestore!");
}

collectData().catch(err => {
  console.error("Collection failed:", err);
  process.exit(1);
});
