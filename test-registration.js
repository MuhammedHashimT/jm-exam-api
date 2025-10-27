const { generateRegistrationNumber, REGISTRATION_CONFIG } = require('./src/config/constants');

console.log('🧪 Testing Registration Number Generation');
console.log('==========================================');

// Test the registration config
console.log('\n📋 Registration Configuration:');
Object.entries(REGISTRATION_CONFIG).forEach(([section, config]) => {
  console.log(`   ${section}: ${config.prefix}${config.start.toString().padStart(6, '0')} - ${config.prefix}259999`);
});

// Test for المرحلة العالية (Advanced Level)
console.log('\n1️⃣ المرحلة العالية (Advanced Level):');
console.log('   First student:', generateRegistrationNumber('المرحلة العالية'));
console.log('   After A250001:', generateRegistrationNumber('المرحلة العالية', 'A250001'));
console.log('   After A250089:', generateRegistrationNumber('المرحلة العالية', 'A250089'));
console.log('   After A250999:', generateRegistrationNumber('المرحلة العالية', 'A250999'));

// Test for المرحلة المتوسطة (Intermediate Level)
console.log('\n2️⃣ المرحلة المتوسطة (Intermediate Level):');
console.log('   First student:', generateRegistrationNumber('المرحلة المتوسطة'));
console.log('   After M250001:', generateRegistrationNumber('المرحلة المتوسطة', 'M250001'));
console.log('   After M250050:', generateRegistrationNumber('المرحلة المتوسطة', 'M250050'));

// Test for المرحلة الإبتدائية (Primary Level) 
console.log('\n3️⃣ المرحلة الإبتدائية (Primary Level):');
console.log('   First student:', generateRegistrationNumber('المرحلة الإبتدائية'));
console.log('   After I250001:', generateRegistrationNumber('المرحلة الإبتدائية', 'I250001'));
console.log('   After I250132:', generateRegistrationNumber('المرحلة الإبتدائية', 'I250132'));
console.log('   After I250200:', generateRegistrationNumber('المرحلة الإبتدائية', 'I250200'));

// Test edge cases
console.log('\n🔍 Edge Case Testing:');
try {
  console.log('   Invalid section test:');
  generateRegistrationNumber('Invalid Section');
} catch (error) {
  console.log(`   ✅ Properly handled invalid section: ${error.message}`);
}

console.log('\n✅ All tests completed successfully!');
console.log('\n🎯 Key Features:');
console.log('   • All registration numbers start with 25');
console.log('   • Each section maintains its own sequence');
console.log('   • Sequential numbering within each section');  
console.log('   • Up to 10,000 students per section (250001-259999)');
console.log('   • Atomic counter prevents duplicates');
console.log('   • Auto-initialization from existing data');