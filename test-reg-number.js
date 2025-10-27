const { generateRegistrationNumber } = require('./src/config/constants');

// Test registration number generation for all sections
const sections = ['المرحلة الإبتدائية', 'المرحلة المتوسطة', 'المرحلة العالية'];

console.log('Testing registration number generation...\n');

sections.forEach(section => {
  console.log(`Section: ${section}`);
  
  // Test first registration number
  const firstReg = generateRegistrationNumber(section);
  console.log(`First registration: ${firstReg}`);
  
  // Test subsequent registration numbers
  const secondReg = generateRegistrationNumber(section, firstReg);
  console.log(`Second registration: ${secondReg}`);
  
  const thirdReg = generateRegistrationNumber(section, secondReg);
  console.log(`Third registration: ${thirdReg}`);
  
  // Test with large number to simulate having many students
  const largeReg = generateRegistrationNumber(section, section === 'المرحلة الإبتدائية' ? 'I395000' : section === 'المرحلة المتوسطة' ? 'M345000' : 'A295000');
  console.log(`Large number test: ${largeReg}`);
  
  console.log('---');
});

console.log('\nTesting completed successfully!');