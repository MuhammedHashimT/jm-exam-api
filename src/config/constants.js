const KERALA_DISTRICTS = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

const SUBJECTS = {
  "المرحلة الإبتدائية": {
    subject1: [
      {
        code: "I-01",
        name: "تعليم المتعلم",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "I-02",
        name: "هداية الأذكياء",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "I-03",
        name: "المتفرد",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "I-04",
        name: "نور الأبصار",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "I-05",
        name: "الرياض البديعة",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "I-06",
        name: "بداية الهداية",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "I-07",
        name: "الأربعون للنووي",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "I-08",
        name: "شرح آمنت بالله",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "I-09",
        name: "العمدة - من الأوّل إلى كتاب الحج",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "I-10",
        name: "العمدة - من كتاب الحج إلى آخر الكتاب",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
    ],
    subject2: [
      {
        code: "I-11",
        name: "الميزان والأجناس الكبرى",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "I-12",
        name: "الزنجاني",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "I-13",
        name: "العوامل وتقويم اللسان من أوله إلى باب المبتدأ",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "I-14",
        name: "تقويم اللسان من باب المبتدإ إلى آخر الكتاب",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "I-15",
        name: "التحفة الوردية",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "I-16",
        name: "النحو الواضح (الأول من الابتدائية)",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
    ],
  },
  "المرحلة المتوسطة": {
    subject1: [
        {
        code: "M-30",
        name: "فتح المعين من الأول إلى باب الجماعة",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-01",
        name: "فتح المعين من باب الجماعة إلى البيع",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-02",
        name: "فتح المعين من البيع إلى الفرائض",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-03",
        name: "فتح المعين من الفرائض إلى الجنايات",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-04",
        name: "فتح المعين من الجنايات إلى آخر الكتاب",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-05",
        name: "شرح الورقات",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-06",
        name: "السنوسي",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-07",
        name: "رياض الصالحين من الأول إلى باب الإنفاق مما يحب",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-08",
        name: "رياض الصالحين من باب الإنفاق مما يحب إلى كتاب الأدب",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-09",
        name: "رياض الصالحين من كتاب الأدب إلى باب وجوب صوم رمضان",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-10",
        name: "رياض الصالحين من باب وجوب صوم رمضان إلى آخر الكتاب",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-11",
        name: "تفسير الجلالين من الأول إلى آخر سورة المائدة",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-12",
        name: "تفسير الجلالين من سورة الأنعام إلى آخر سورة الإسراء",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-13",
        name: "تفسير الجلالين من سورة الكهف إلى آخر سورة الزمر",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-14",
        name: "تفسير الجلالين من سورة غافر إلى سورة الفاتحة",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-15",
        name: "مقدمة المشكوة",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-16",
        name: "مشكوة المصابيح من الأول إلى باب المساجد",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-17",
        name: "مشكوة المصابيح من باب الوصايا إلى كتاب الآداب",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
    ],
    subject2: [
      {
        code: "M-18",
        name: "قطر الندى من الأول إلى المنصوبات",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-19",
        name: "قطر الندى من المنصوبات إلى آخر الكتاب",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-20",
        name: "الألفية من الأول إلى كان و أخواتها",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-21",
        name: "الألفية من كان و أخواتها إلى أبنية المصادر",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-22",
        name: "الألفية من أبنية المصادر إلى مالا ينصرف",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-23",
        name: "الألفية من مالا ينصرف إلى آخر الكتاب",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-24",
        name: "تحفة الإخوان",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-25",
        name: "تصريح المنطق",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-26",
        name: "النفائس من الأول إلى آخر علم المعاني",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-27",
        name: "النفائس (علم البيان وعلم البديع)",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-28",
        name: "البلاغة الواضحة (علم البيان)",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "M-29",
        name: "البلاغة الواضحة (علم المعاني)",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
    ],
  },
  "المرحلة العالية": {
    subject1: [
      {
        code: "A-01",
        name: "المحلي من الأول إلى كتاب الصلوة",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-02",
        name: "المحلي من كتاب الصلوة إلى كتاب الجماعة",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-03",
        name: "المحلي من كتاب الجماعة إلى آخر الجزء الأول",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-04",
        name: "المحلي من كتاب الزكوة إلى آخر الحج",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-05",
        name: "المحلي من كتاب البيع إلى كتاب السلم",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-06",
        name: "المحلي من كتاب الفرائض إلى كتاب النكاح",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-07",
        name: "المحلي من كتاب النكاح إلى كتاب القسم والنشوز",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-08",
        name: "المحلي من القسم والنشوز إلى آخر الجزء الثالث",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-09",
        name: "المحلي من الرجعة إلى كتاب الجراح",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-10",
        name: "المحلي من كتاب السير إلى كتاب الشهادات",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-11",
        name: "جمع الجوامع من الأول إلى آخر تعريف الإعادة",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-12",
        name: "جمع الجوامع من الكتاب الأول إلى مبحث الحروف",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-13",
        name: "جمع الجوامع (الكتاب الثاني والكتاب الثالث)",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-14",
        name: "جمع الجوامع (الكتاب الرابع)",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-15",
        name: "جمع الجوامع من الكتاب الخامس إلى آخر جمع الجوامع",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-16",
        name: "شرح العقائد من الأول إلى إثبات عذاب القبر",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-17",
        name: "شرح العقائد من إثبات عذاب القبر إلى آخر الكتاب",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-18",
        name: "النخبة من الأول إلى آخر مدرج المتن",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-19",
        name: "النخبة من المقلوب إلى آخر الكتاب",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-20",
        name: 'تفسير البيضاوي من الأول إلى قوله تعالى "وإذ قال ربك"',
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-21",
        name: "تفسير البيضاوي من قوله تعالى وإذ قال ربك إلى آخر السورة",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-22",
        name: "صحيح البخاري من الأول إلى كتاب الأذان",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-23",
        name: "صحيح البخاري من كتاب الأذان إلى كتاب الزكوة",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-24",
        name: "صحيح البخاري من كتاب الزكوة إلى كتاب البيوع",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-25",
        name: "صحيح البخاري من كتاب البيوع إلى كتاب الصلح",
        category: 1,
        examTime: "09:00 AM - 11:00 AM",
      },
    ],
    subject2: [
      {
        code: "A-26",
        name: "شرح التهذيب (من الأول إلى آخر التصورات)",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-27",
        name: "شرح التهذيب من التصديقات إلى آخر الكتاب",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-28",
        name: "مختصر المعاني من الأول إلى آخر أحوال المسند إليه",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-29",
        name: "مختصر المعاني من أحوال المسند إلى آخر علم المعاني",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-30",
        name: "مختصر المعاني (علم البيان)",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-31",
        name: "مختصر المعاني (علم البديع)",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-32",
        name: "الخلاصة من الأول إلى آخر الباب الخامس",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-33",
        name: "الخلاصة من الباب السادس إلى آخر الكتاب",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-34",
        name: "مبادئ الفلسفة",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-35",
        name: "الميبدي من الأول إلى آخر الفن الأول من الطبيعيات",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-36",
        name: "الميبدي (الإلهيات)",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-37",
        name: "أوقليدس من الأول إلى شكل كه",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-38",
        name: "تشريح الأفلاك من الأول ألى آخر الدوائر",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-39",
        name: "القطبي من الأول إلى آخر المقالة الأولى",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-40",
        name: "القطبي من المقالة الثانية إلى آخر المقالة الثانية",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-41",
        name: "الرشيدية",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
      {
        code: "A-42",
        name: "ملا حسن من الأول إلى شك مشهور",
        category: 2,
        examTime: "09:00 AM - 11:00 AM",
      },
    ],
  },
};

const SECTIONS = ["المرحلة الإبتدائية", "المرحلة المتوسطة", "المرحلة العالية"];

// Registration number configuration for each section
const REGISTRATION_CONFIG = {
  "المرحلة العالية": { prefix: "A", start: 250001 },
  "المرحلة المتوسطة": { prefix: "M", start: 250001 },
  "المرحلة الإبتدائية": { prefix: "I", start: 250001 },
};

// Helper function to generate registration number
const generateRegistrationNumber = (section, lastRegistrationNumber = null) => {
  const config = REGISTRATION_CONFIG[section];
  if (!config) {
    throw new Error(`Invalid section: ${section}`);
  }

  let nextNumber;
  
  if (lastRegistrationNumber) {
    // Extract the numeric part from the last registration number
    // Example: A250089 -> 250089, then add 1 to get 250090
    const numericPart = lastRegistrationNumber.replace(/^[A-Z]/, '');
    const lastNumber = parseInt(numericPart, 10);
    
    if (isNaN(lastNumber)) {
      throw new Error(`Invalid last registration number format: ${lastRegistrationNumber}`);
    }
    
    nextNumber = lastNumber + 1;
  } else {
    // First student in this section, start from the beginning
    nextNumber = config.start;
  }

  // Ensure the number is within valid range (250001-259999 for all sections)
  if (nextNumber > 259999) {
    throw new Error(
      `Registration number limit exceeded for section ${section}. Maximum 10,000 students allowed per section.`
    );
  }

  // Format: Prefix + 6-digit number (e.g., A250001, M250001, I250001)
  return `${config.prefix}${nextNumber.toString().padStart(6, '0')}`;
};

module.exports = {
  KERALA_DISTRICTS,
  SUBJECTS,
  SECTIONS,
  REGISTRATION_CONFIG,
  generateRegistrationNumber,
};
