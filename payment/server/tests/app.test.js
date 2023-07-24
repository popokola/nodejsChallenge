const supertest = require('supertest');
const { app, port } = require('./testGlobalSetup');

describe('Your test suite', () => {
  const testApp = supertest(app);
  // Your test cases go here
  it('should return a 200 status code', async () => {
    const response = await testApp.get('/');
    expect(response.status).toBe(200);
  });

  it('should return the expected response', async () => {
    const response = await testApp.get('/');
    expect(response.text).toBe('Hello world');
  });

  // More test cases...
});