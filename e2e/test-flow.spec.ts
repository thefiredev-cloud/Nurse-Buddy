import { test, expect } from '@playwright/test';

test.describe('Test Flow', () => {
  test('should navigate to new test page', async ({ page }) => {
    await page.goto('/dashboard/test/new');
    
    await expect(page).toHaveURL(/sign-in/);
  });

  test('should have test interface routes', async ({ page }) => {
    const testId = 'test-123';
    await page.goto(`/dashboard/test/${testId}`);
    
    await expect(page).toHaveURL(/sign-in/);
  });

  test('should have test results route', async ({ page }) => {
    const testId = 'test-123';
    await page.goto(`/dashboard/test/${testId}/results`);
    
    await expect(page).toHaveURL(/sign-in/);
  });
});

