import { expect, test } from '@playwright/test';

test('homepage exposes repo, support, and build metadata', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /local-first photo editing/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /star on github/i })).toHaveAttribute(
    'href',
    'https://github.com/baditaflorin/openphoto-studio'
  );
  await expect(page.getByRole('link', { name: /support/i })).toHaveAttribute(
    'href',
    'https://www.paypal.com/paypalme/florinbadita'
  );
  await expect(page.getByText(/commit/i)).toBeVisible();
});
