import { test, expect } from '@playwright/test';
import { mailHelper } from '../mail.helper';

test.describe.serial('register', async () => {
  
  test('get the OTP from email', async ({page}) => {
    const emailHTML = await mailHelper.readEmail(page,
      "info@citigov.id",
      "testerjannah@gmail.com",
      "Your OTP Access"
    );

    const verificationCodeFromEmail = await mailHelper.extractVerificationCode(emailHTML);
    console.log(verificationCodeFromEmail);
  });
})