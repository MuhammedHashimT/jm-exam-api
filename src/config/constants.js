const KERALA_DISTRICTS = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha",
  "Kottayam", "Idukki", "Ernakulam", "Thrissur",
  "Palakkad", "Malappuram", "Kozhikode", "Wayanad",
  "Kannur", "Kasaragod"
];

const SUBJECTS = {
  "المرحلة الإبتدائية": {
    subject1: [
      { code: "I-101", name: "الفقه", category: 1, examTime: "09:00 AM - 11:00 AM" },
      { code: "I-102", name: "التوحيد", category: 1, examTime: "09:00 AM - 11:00 AM" },
      { code: "I-103", name: "القرآن", category: 1, examTime: "09:00 AM - 11:00 AM" }
    ],
    subject2: [
      { code: "I-201", name: "الحديث", category: 2, examTime: "02:00 PM - 04:00 PM" },
      { code: "I-202", name: "العقيدة", category: 2, examTime: "02:00 PM - 04:00 PM" },
      { code: "I-203", name: "السيرة النبوية", category: 2, examTime: "02:00 PM - 04:00 PM" }
    ]
  },
  "المرحلة المتوسطة": {
    subject1: [
      { code: "M-101", name: "الفقه", category: 1, examTime: "09:00 AM - 11:00 AM" },
      { code: "M-102", name: "النحو", category: 1, examTime: "09:00 AM - 11:00 AM" },
      { code: "M-103", name: "الصرف", category: 1, examTime: "09:00 AM - 11:00 AM" }
    ],
    subject2: [
      { code: "M-201", name: "التفسير", category: 2, examTime: "02:00 PM - 04:00 PM" },
      { code: "M-202", name: "الحديث", category: 2, examTime: "02:00 PM - 04:00 PM" },
      { code: "M-203", name: "العقيدة", category: 2, examTime: "02:00 PM - 04:00 PM" }
    ]
  },
  "المرحلة العالية": {
    subject1: [
      { code: "H-101", name: "الحديث", category: 1, examTime: "09:00 AM - 11:00 AM" },
      { code: "H-102", name: "البلاغة", category: 1, examTime: "09:00 AM - 11:00 AM" },
      { code: "H-103", name: "التفسير", category: 1, examTime: "09:00 AM - 11:00 AM" }
    ],
    subject2: [
      { code: "H-201", name: "الفقه", category: 2, examTime: "02:00 PM - 04:00 PM" },
      { code: "H-202", name: "أصول الفقه", category: 2, examTime: "02:00 PM - 04:00 PM" },
      { code: "H-203", name: "العقيدة", category: 2, examTime: "02:00 PM - 04:00 PM" }
    ]
  }
};

const SECTIONS = ['المرحلة الإبتدائية', 'المرحلة المتوسطة', 'المرحلة العالية'];

// Registration number ranges for each section
const REGISTRATION_RANGES = {
  "المرحلة العالية": { prefix: "A", start: 250001, end: 259999 },
  "المرحلة المتوسطة": { prefix: "M", start: 250001, end: 259999 },
  "المرحلة الإبتدائية": { prefix: "I", start: 250001, end: 259999 }
};

// Helper function to generate registration number
const generateRegistrationNumber = (section, lastNumber = null) => {
  const range = REGISTRATION_RANGES[section];
  if (!range) {
    throw new Error('Invalid section');
  }
  
  let nextNumber;
  if (lastNumber) {
    // Extract number part from last registration number (e.g., A250001 -> 250001)
    const numPart = parseInt(lastNumber.substring(1));
    nextNumber = numPart + 1;
  } else {
    nextNumber = range.start;
  }
  
  if (nextNumber > range.end) {
    throw new Error(`Registration number limit exceeded for section ${section}`);
  }
  
  return `${range.prefix}${nextNumber}`;
};

module.exports = {
  KERALA_DISTRICTS,
  SUBJECTS,
  SECTIONS,
  REGISTRATION_RANGES,
  generateRegistrationNumber
};