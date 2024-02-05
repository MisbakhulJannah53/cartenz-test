import { test, expect } from '@playwright/test';



test('login by password', async ({ page }) => {
  await page.goto('https://internal.citigov.id/signin');

  // Expect a page "to contain "input with several name"
  const email_login_input = page.locator("[name=email]");
  await expect(email_login_input).toBeVisible();
  await email_login_input.fill('misbakhuljannah53@gmail.com');

  const button_katasandi = page.getByRole("button", {name:"Kata sandi"} );
  await expect(button_katasandi).toBeVisible();
  await button_katasandi.click()

  await page.waitForSelector('input[type="password"]');

  const password_login_input = page.locator("[name=password]");
  await expect(password_login_input).toBeVisible();
  await password_login_input.fill('Jannah123_');

  const button_masuk = page.getByRole("button", {name:"Masuk"} );
  await expect(button_masuk).toBeVisible();
  await button_masuk.click()

  //await page.waitForURL('input[type="password"]');
});

test('login by otp', async ({ page }) => {
  await page.goto('https://internal.citigov.id/signin');

  // Expect a page "to contain "input with several name"
  const email_login_input = page.locator("[name=email]");
  await expect(email_login_input).toBeVisible();
  await email_login_input.fill('misbakhuljannah53@gmail.com');

  const button_OTP = page.getByRole("button", {name:"OTP via Email"} );
  await expect(button_OTP).toBeVisible();
  await button_OTP.click()

  await page.waitForSelector('button.btn[data-dismiss="modal"]');

  const button_oke = page.getByRole("button", {name:"OKe"} );
  await expect(button_oke).toBeVisible();
  await button_oke.click()

  //await page.waitForURL('input[type="password"]');
});

