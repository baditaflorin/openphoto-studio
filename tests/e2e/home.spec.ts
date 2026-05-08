import { expect, test } from '@playwright/test';

test('homepage exposes repo, support, and build metadata', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('OpenPhoto Studio', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /star/i })).toHaveAttribute(
    'href',
    'https://github.com/baditaflorin/openphoto-studio'
  );
  await expect(page.getByRole('link', { name: /support/i })).toHaveAttribute(
    'href',
    'https://www.paypal.com/paypalme/florinbadita'
  );
  await expect(page.getByText(/commit/i)).toBeVisible();
  await page.getByRole('button', { name: /demo/i }).click();
  await expect(page.getByLabel('Photo editing canvas')).toBeVisible();
});
