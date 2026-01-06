import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test('should have checkout API endpoint', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/checkout');
    
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(500);
  });

  test('should have test generation endpoint', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/test/generate');
    
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(500);
  });

  test('should have user subscription endpoint', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/user/subscription');
    
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(500);
  });

  test('should handle webhook endpoints', async ({ request }) => {
    const clerkResponse = await request.post('http://localhost:3000/api/webhooks/clerk', {
      data: { type: 'user.created' },
    });
    
    expect(clerkResponse.status()).toBeGreaterThanOrEqual(200);
    expect(clerkResponse.status()).toBeLessThan(500);
  });
});







