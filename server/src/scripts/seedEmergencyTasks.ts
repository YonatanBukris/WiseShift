import mongoose from "mongoose";
import { config } from "dotenv";
import EmergencyTask from "../models/EmergencyTask.js";

config();

const emergencyTasks = [
  // Family Department Tasks
  {
    title: "מיפוי צרכים טלפוני",
    description:
      "יצירת קשר טלפוני עם משפחות לזיהוי צרכים מיידיים וארוכי טווח במצב החירום",
    criticality: "high",
    department: "family",
    requiredSkills: ["תקשורת בינאישית", "הערכת מצב"],
    estimatedTime: 120,
    isActive: false,
  },
  {
    title: "ביקורי בית למשפחות",
    description:
      "ביקור פיזי במשפחות שזוהו כזקוקות לתמיכה מיוחדת והערכת מצבן בשטח",
    criticality: "critical",
    department: "family",
    requiredSkills: ["עבודה סוציאלית", "הערכת מצב"],
    estimatedTime: 180,
    isActive: false,
  },

  // Special Needs Department Tasks
  {
    title: "איתור צרכים בשיחת טלפון יזומה",
    description:
      "יצירת קשר יזום עם אנשים בעלי צרכים מיוחדים לבדיקת מצבם וצורכיהם",
    criticality: "high",
    department: "special needs",
    requiredSkills: ["תקשורת מותאמת", "הכרת צרכים מיוחדים"],
    estimatedTime: 90,
    isActive: false,
  },
  {
    title: "הפעלת מוקד לאוכלוסייה מיוחדת",
    description:
      "הפעלת מוקד ייעודי למתן מענה מותאם לאוכלוסייה עם צרכים מיוחדים",
    criticality: "critical",
    department: "special needs",
    requiredSkills: ["ניהול מוקד", "הכרת צרכים מיוחדים"],
    estimatedTime: 480,
    isActive: false,
  },
  {
    title: "וידוא חדרים נגישים באזורי פינוי",
    description:
      "הבטחת זמינות מקומות מתאימים ונגישים עבור אנשים עם מוגבלויות באזורי פינוי",
    criticality: "high",
    department: "special needs",
    requiredSkills: ["נגישות", "לוגיסטיקה"],
    estimatedTime: 240,
    isActive: false,
  },

  // Senior Citizens Department Tasks
  {
    title: "יצירת קשר עם אזרחים ותיקים",
    description: "בדיקה טלפונית של מצב ואיתור צרכים של אזרחים ותיקים",
    criticality: "high",
    department: "senior citizens",
    requiredSkills: ["תקשורת עם קשישים", "הערכת מצב"],
    estimatedTime: 120,
    isActive: false,
  },
  {
    title: "ביקורי בית לקשישים",
    description:
      "ביקור פיזי אצל אזרחים ותיקים לבדיקת מצבם ומתן סיוע במידת הצורך",
    criticality: "critical",
    department: "senior citizens",
    requiredSkills: ["טיפול בקשישים", "עזרה ראשונה"],
    estimatedTime: 180,
    isActive: false,
  },

  // Sturdiness Department Tasks
  {
    title: "ריכוז פניות למרכז חוסן",
    description: "ניהול ותיאום הפניות למרכז החוסן וחיבור לגורמי טיפול מתאימים",
    criticality: "high",
    department: "sturdiness",
    requiredSkills: ["ניהול פניות", "תיאום טיפול"],
    estimatedTime: 480,
    isActive: false,
  },

  // Community Department Tasks
  {
    title: "הפעלת מועדוניות",
    description: "ארגון והפעלת מסגרות פעילות קהילתיות בהתאם למצב ולהנחיות",
    criticality: "medium",
    department: "community",
    requiredSkills: ["הפעלת קבוצות", "ניהול פעילות"],
    estimatedTime: 300,
    isActive: false,
  },
  {
    title: "תפעול צח״י עירוני",
    description:
      "ניהול וריכוז פעילות צוות החירום היישובי ועדכון תמונת המצב השוטפת",
    criticality: "critical",
    department: "community",
    requiredSkills: ["ניהול חירום", "תיאום צוותים"],
    estimatedTime: 480,
    isActive: false,
  },
  {
    title: "הפעלת תכנית מרגישים בבית",
    description: "ארגון פעילויות קהילתיות תומכות ליצירת תחושת שייכות וביטחון",
    criticality: "medium",
    department: "community",
    requiredSkills: ["הנחיית קבוצות", "פיתוח קהילתי"],
    estimatedTime: 240,
    isActive: false,
  },
];

const seedEmergencyTasks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB");

    await EmergencyTask.deleteMany({});
    console.log("Cleared existing emergency tasks");

    await EmergencyTask.insertMany(emergencyTasks);
    console.log("Successfully seeded emergency tasks");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding emergency tasks:", error);
  }
};

seedEmergencyTasks();
