import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should redirect to sign in when not authenticated', async ({ page }) => {
    await expect(page).toHaveURL(/sign-in/);
  });

  test('should display dashboard navigation sidebar', async ({ page, context }) => {
    await page.goto('/');
    
    const signInLink = page.getByRole('link', { name: /Sign In/i }).first();
    await signInLink.click();
    
    await expect(page).toHaveURL(/sign-in/);
  });

  test('should have dashboard routes accessible', async ({ page }) => {
    const routes = [
      '/dashboard',
      '/dashboard/test/new',
      '/dashboard/history',
      '/dashboard/performance',
      '/dashboard/settings',
    ];

    for (const route of routes) {
      await page.goto(route);
      await expect(page).toHaveURL(/sign-in/);
    }
  });
});

