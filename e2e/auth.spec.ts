import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display sign in page', async ({ page }) => {
    await page.goto('/sign-in');
    
    await expect(page).toHaveURL(/sign-in/);
    
    const signInButton = page.getByRole('button', { name: /Sign In/i });
    await expect(signInButton).toBeVisible();
  });

  test('should display sign up page', async ({ page }) => {
    await page.goto('/sign-up');
    
    await expect(page).toHaveURL(/sign-up/);
    
    const signUpButton = page.getByRole('button', { name: /Sign Up/i });
    await expect(signUpButton).toBeVisible();
  });

  test('should redirect to sign in from landing page', async ({ page }) => {
    await page.goto('/');
    
    const signInLink = page.getByRole('link', { name: /Sign In/i }).first();
    await signInLink.click();
    
    await expect(page).toHaveURL(/sign-in/);
  });

  test('should redirect to sign up from landing page CTA', async ({ page }) => {
    await page.goto('/');
    
    const startLearningLink = page.getByRole('link', { name: /Start Learning/i }).first();
    await startLearningLink.click();
    
    await expect(page).toHaveURL(/sign-up/);
  });
});




