const { generateURL } = require('../scripts/scripts.js'); // RUN -> npx jest generateURL.test.js

// TEST IF PASSWORD IS ALWAYS 10 CHARACTERS
describe('generateURL', () => {
  test('Generates a string of length 10', () => {
    const url = generateURL();
    expect(url).toHaveLength(10);
  });

  // ONLY CONTAINS CHARACTERS FROM FUNCTION
  test('Generated URL password contains only valid characters', () => {
    const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const url = generateURL();
    for (let char of url) {
      expect(validChars.includes(char)).toBe(true);
    }
  });

  // COMPLETELY RANDOM EACH TIME
  test('Generates a unique URL password on each call', () => {
    const url1 = generateURL();
    const url2 = generateURL();
    expect(url1).not.toEqual(url2);
  });
});