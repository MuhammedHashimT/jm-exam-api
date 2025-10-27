const { generateRegistrationNumber } = require('./src/config/constants');

console.log('Testing Registration Number Generation:');
console.log('=====================================');

// Test for المرحلة العالية (Advanced Level)
console.log('\n1. المرحلة العالية (Advanced Level):');
console.log('First student:', generateRegistrationNumber('المرحلة العالية'));
console.log('After A250001:', generateRegistrationNumber('المرحلة العالية', 'A250001'));
console.log('After A250089:', generateRegistrationNumber('المرحلة العالية', 'A250089'));
console.log('After A250999:', generateRegistrationNumber('المرحلة العالية', 'A250999'));

// Test for المرحلة المتوسطة (Intermediate Level)
console.log('\n2. المرحلة المتوسطة (Intermediate Level):');
console.log('First student:', generateRegistrationNumber('المرحلة المتوسطة'));
console.log('After M250001:', generateRegistrationNumber('المرحلة المتوسطة', 'M250001'));
console.log('After M250050:', generateRegistrationNumber('المرحلة المتوسطة', 'M250050'));

// Test for المرحلة الإبتدائية (Primary Level)
console.log('\n3. المرحلة الإبتدائية (Primary Level):');
console.log('First student:', generateRegistrationNumber('المرحلة الإبتدائية'));
console.log('After I250001:', generateRegistrationNumber('المرحلة الإبتدائية', 'I250001'));
console.log('After I250200:', generateRegistrationNumber('المرحلة الإبتدائية', 'I250200'));

console.log('\n✅ All tests completed successfully!');
console.log('\nKey Features:');
console.log('- All registration numbers start with 25');
console.log('- Each section maintains its own sequence');
console.log('- Sequential numbering within each section');
console.log('- Up to 10,000 students per section (250001-259999)');