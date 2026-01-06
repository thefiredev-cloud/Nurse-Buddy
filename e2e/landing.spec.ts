import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load landing page with all sections', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/Nurse Buddy/);
    
    const heroHeading = page.getByRole('heading', { name: /Pass Your NCLEX/i });
    await expect(heroHeading).toBeVisible();
  });

  test('should display navigation links', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('link', { name: /Feature/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /How It Work/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Pricing/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /FAQ/i })).toBeVisible();
  });

  test('should navigate to sign in page', async ({ page }) => {
    await page.goto('/');
    
    const signInLink = page.getByRole('link', { name: /Sign In/i });
    await signInLink.click();
    
    await expect(page).toHaveURL(/sign-in/);
  });

  test('should navigate to sign up page', async ({ page }) => {
    await page.goto('/');
    
    const startLearningLink = page.getByRole('link', { name: /Start Learning/i });
    await startLearningLink.click();
    
    await expect(page).toHaveURL(/sign-up/);
  });

  test('should display pricing section', async ({ page }) => {
    await page.goto('/');
    
    const pricingHeading = page.getByRole('heading', { name: /Pricing/i });
    await expect(pricingHeading).toBeVisible();
    
    const priceText = page.getByText(/\$35\/month/i);
    await expect(priceText).toBeVisible();
  });

  test('should display FAQ section with expandable items', async ({ page }) => {
    await page.goto('/');
    
    const faqHeading = page.getByRole('heading', { name: /How similar are the questions/i });
    await expect(faqHeading).toBeVisible();
    
    await faqHeading.click();
    
    const faqContent = page.getByRole('region', { name: /How similar are the questions/i });
    await expect(faqContent).toBeVisible();
  });

  test('should display footer with legal links', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('link', { name: /Privacy Policy/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Terms of Service/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Contact Support/i })).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const heroHeading = page.getByRole('heading', { name: /Pass Your NCLEX/i });
    await expect(heroHeading).toBeVisible();
  });
});







