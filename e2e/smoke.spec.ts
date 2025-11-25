import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/Nurse Buddy/);
    
    const heroSection = page.getByRole('heading', { name: /Pass Your NCLEX/i });
    await expect(heroSection).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    const links = [
      { name: /Feature/i, url: /#features/ },
      { name: /How It Work/i, url: /#how-it-works/ },
      { name: /Pricing/i, url: /#pricing/ },
      { name: /FAQ/i, url: /#faq/ },
    ];

    for (const link of links) {
      const linkElement = page.getByRole('link', { name: link.name });
      await expect(linkElement).toBeVisible();
    }
  });

  test('should display all landing page sections', async ({ page }) => {
    await page.goto('/');
    
    const sections = [
      /Pass Your NCLEX/i,
      /Pricing/i,
      /FAQ/i,
    ];

    for (const section of sections) {
      const heading = page.getByRole('heading', { name: section });
      await expect(heading).toBeVisible();
    }
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    
    const title = await page.title();
    expect(title).toContain('Nurse Buddy');
    
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveCount(1);
  });

  test('should handle 404 page', async ({ page }) => {
    const response = await page.goto('/non-existent-page');
    expect(response?.status()).toBe(404);
  });
});


