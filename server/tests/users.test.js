// Import necessary dependencies
const axios = require('axios');

// Set up any configurations or environment variables if needed

// Write the test case
test('should fetch all users', async () => {
    // Make an API request to fetch all users
    const response = await axios.get('https://localhost:8443/api/users');

    // Assert that the response status is successful (e.g., 200)
    expect(response.status).toBe(200);

    // Assert that the response contains an array of users
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
});