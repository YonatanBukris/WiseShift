import mongoose from "mongoose";
import { config } from "dotenv";
import EmergencyTask from "../models/EmergencyTask.js";

config();

const emergencyTasks = [
  {
    title: "סיוע לקשישים ואנשים עם מוגבלות",
    description: "פינוי, אספקת תרופות ותמיכה רגשית לקשישים ואנשים עם מוגבלות",
    criticality: "high",
    location: "שדרות",
    requiredSkills: ["טיפול בקשישים", "עזרה ראשונה"],
    estimatedTime: 120,
    isActive: false,
  },
  {
    title: "הגנה וטיפול בילדים ונוער בסיכון",
    description: "איתור וסיוע לילדים ונוער במצבי סיכון בזמן החירום",
    criticality: "critical",
    location: "שדרות",
    requiredSkills: ["עבודה עם נוער", "טיפול במצבי חירום"],
    estimatedTime: 180,
    isActive: false,
  },
  {
    title: "סיוע למשפחות מעוטות יכולת ולדרי רחוב",
    description: "איתור וסיוע למשפחות נזקקות ודרי רחוב, כולל אספקת צרכים בסיסיים",
    criticality: "high",
    location: "שדרות",
    requiredSkills: ["עבודה סוציאלית", "סיוע הומניטרי"],
    estimatedTime: 150,
    isActive: false,
  },
  {
    title: "הקמת מקלטים ומרכזי קליטה זמניים",
    description: "ארגון והקמת מרכזי קליטה זמניים לעקורים מבתיהם",
    criticality: "critical",
    location: "שדרות",
    requiredSkills: ["לוגיסטיקה", "ניהול מתקנים"],
    estimatedTime: 240,
    isActive: false,
  },
  {
    title: "אספקת מזון, מים ותרופות",
    description: "חלוקת מזון, מים, שמיכות, בגדים ותרופות לנזקקים",
    criticality: "high",
    location: "שדרות",
    requiredSkills: ["לוגיסטיקה", "ניהול מלאי"],
    estimatedTime: 180,
    isActive: false,
  },
  {
    title: "תמיכה רגשית ופסיכו-סוציאלית",
    description: "מתן תמיכה רגשית ופסיכולוגית לנפגעים וסובלים מחרדה",
    criticality: "medium",
    location: "שדרות",
    requiredSkills: ["פסיכולוגיה", "עבודה סוציאלית"],
    estimatedTime: 120,
    isActive: false,
  },
];

const seedEmergencyTasks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB");

    // Clear existing emergency tasks
    await EmergencyTask.deleteMany({});
    console.log("Cleared existing emergency tasks");

    // Insert new emergency tasks
    await EmergencyTask.insertMany(emergencyTasks);
    console.log("Successfully seeded emergency tasks");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding emergency tasks:", error);
  }
};

seedEmergencyTasks(); 