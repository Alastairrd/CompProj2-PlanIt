// the tested inputs which are being put through the function in scripts
const { isValidUsername } = require('../scripts/scripts.js'); 

describe('Login', () => {
  test('Valid Username', () => {
    expect(isValidUsername('validUsername')).toBe(true);
  });
 
  test('Invalid Username',  () => {
     expect(isValidUsername('invalid@?$username')).toBe(false);
  });
});