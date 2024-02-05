import { test, expect, Page } from '@playwright/test';
import { mailHelper } from '../mail.helper';

type SignUpData = {
  name:string;
  email:string;
  phone:string;
  password:string;
  password_confirmation:string;
  
}
async function checkAndFillSignUpField(page:Page, data:SignUpData){
  const name_input = page.locator("[name=fullName]");
  await expect(name_input).toBeVisible();
  await name_input.fill(data.name);

  const email_input = page.locator("[name=email]");
  await expect(email_input).toBeVisible();
  await email_input.fill(data.email);
  
  const telpon_input = page.locator("[name=telp]");
  await expect(telpon_input).toBeVisible();
  await telpon_input.fill(data.phone);

  const password_input = page.locator("[name=password]");
  await expect(password_input).toBeVisible();
  await password_input.fill(data.password);

  const password_confirmation_input = page.locator("[name=confirmPassword]");
  await expect(password_confirmation_input).toBeVisible();
  await password_confirmation_input.fill(data.password_confirmation);
}

test('Semua field benar', async ({ page }) => {
  await page.goto('https://internal.citigov.id/register');
  const data:SignUpData = {
    name:"Jannah",
    email:"testerjannah@gmail.com",
    phone:"089622728372",
    password:"Jannah123_",
    password_confirmation:"Jannah123_",
  }

  await checkAndFillSignUpField(page,data)
  

  const button_daftar = page.getByRole("button", {name:"Daftar"} );
  await expect(button_daftar).toBeVisible();
  await button_daftar.click()
});

test('Salah satu field kosong', async ({ page }) => {
  await page.goto('https://internal.citigov.id/register');
  const data:SignUpData = {
    name:"Jannah",
    email:"testerjannah@gmail.com",
    phone:"",
    password:"Jannah123_",
    password_confirmation:"Jannah123_",
  }

  await checkAndFillSignUpField(page,data)
  
  const error_message_phone = page.getByText("Nomor Telepon / Handphone harus diisi");
  await expect(error_message_phone).toBeVisible();

});

test('Password kurang dari 8 karakter', async ({ page }) => {
  await page.goto('https://internal.citigov.id/register');
  const data:SignUpData = {
    name:"Jannah",
    email:"testerjannah@gmail.com",
    phone:"089622728372",
    password:"Jann",
    password_confirmation:"Jannah123_",
  }

  await checkAndFillSignUpField(page,data)
  
  const error_message_phone = page.getByText("Kata sandi harus minimal 8 karakter dan harus mengandung Angka,Simbol");
  await expect(error_message_phone).toBeVisible();

});

test('Password tidak menggunakan Simbol dan huruf besar', async ({ page }) => {
  await page.goto('https://internal.citigov.id/register');
  const data:SignUpData = {
    name:"Jannah",
    email:"testerjannah@gmail.com",
    phone:"089622728372",
    password:"jannah123",
    password_confirmation:"Jannah123_",
  }

  await checkAndFillSignUpField(page,data)
  
  const error_message_phone = page.getByText("Kata sandi harus mengandung Huruf Besar,Simbol");
  await expect(error_message_phone).toBeVisible();

});

test('Konfirmasi kata sandi tidak sesuai', async ({ page }) => {
  await page.goto('https://internal.citigov.id/register');
  const data:SignUpData = {
    name:"Jannah",
    email:"testerjannah@gmail.com",
    phone:"089622728372",
    password:"Jannah123_",
    password_confirmation:"Jan123457_",
  }

  await checkAndFillSignUpField(page,data)
  
  const error_message_phone = page.getByText("Konfirmasi Kata sandi tidak sama");
  await expect(error_message_phone).toBeVisible();

});

test('Input nomor telepon kurang dari 5 angka', async ({ page }) => {
  await page.goto('https://internal.citigov.id/register');
  const data:SignUpData = {
    name:"Jannah",
    email:"testerjannah@gmail.com",
    phone:"0896",
    password:"Jannah123_",
    password_confirmation:"Jannah123_",
  }

  await checkAndFillSignUpField(page,data)
  
  const error_message_phone = page.getByText("Nomor Telepon / Handphone minimal 5 angka");
  await expect(error_message_phone).toBeVisible();

});

test('Email tidak sesuai format', async ({ page }) => {
  await page.goto('https://internal.citigov.id/register');
  const data:SignUpData = {
    name:"Jannah",
    email:"testerjannah",
    phone:"089699018475",
    password:"Jannah123_",
    password_confirmation:"Jannah123_",
  }

  await checkAndFillSignUpField(page,data)
  
  const error_message_phone = page.getByText("Format email harus benar");
  await expect(error_message_phone).toBeVisible();

});

test('Daftar dengan email yang sudah terdaftar', async ({ page }) => {
  await page.goto('https://internal.citigov.id/register');
  const data:SignUpData = {
    name:"Jannah",
    email:"misbakhuljannah53@gmail.com",
    phone:"089693939376",
    password:"Jannah123_",
    password_confirmation:"Jannah123_",
  }

  await checkAndFillSignUpField(page,data)
  

  const button_daftar = page.getByRole("button", {name:"Daftar"} );
  await expect(button_daftar).toBeVisible();
  await button_daftar.click()
});

test('Verifikasi OTP benar', async ({ page }) => {
  await page.goto('https://internal.citigov.id/register');
  const data:SignUpData = {
    name:"Jannah",
    email:"testerjannah@gmail.com",
    phone:"089622728372",
    password:"Jannah123_",
    password_confirmation:"Jannah123_",
  }
  await checkAndFillSignUpField(page,data)

  const button_daftar = page.getByRole("button", {name:"Daftar"} );
  await expect(button_daftar).toBeVisible();
  await button_daftar.click()

  await page.waitForSelector('button.btn[data-dismiss="modal"]');

  const next_button = page.getByRole('button', { name: 'Selanjutnya' })
  await expect(next_button).toBeVisible();
  await next_button.click();

  const emailHTML = await mailHelper.readEmail(page,
    "info@citigov.id",
    "testerjannah@gmail.com",
    "Your OTP Access"
  );

  const verificationCodeFromEmail = (await mailHelper.extractVerificationCode(emailHTML)).toString()

  expect(verificationCodeFromEmail.length).toBe(4)

  for (let i = 0; i<verificationCodeFromEmail.length;i++){
    const otp_field = page.locator(`[name=otp${i+1}]`)
    await expect(otp_field).toBeVisible();
    await otp_field.fill(verificationCodeFromEmail[i]);
  }
  
  await page.waitForURL("https://internal.citigov.id/citizen/pelayanan")
});

test('Verifikasi OTP tidak benar', async ({ page }) => {
  await page.goto('https://internal.citigov.id/register');
  const data:SignUpData = {
    name:"Jannah",
    email:"testerjannah@gmail.com",
    phone:"089622728372",
    password:"Jannah123_",
    password_confirmation:"Jannah123_",
  }
  await checkAndFillSignUpField(page,data)

  const button_daftar = page.getByRole("button", {name:"Daftar"} );
  await expect(button_daftar).toBeVisible();
  await button_daftar.click()

  await page.waitForSelector('button.btn[data-dismiss="modal"]');

  const next_button = page.getByRole('button', { name: 'Selanjutnya' })
  await expect(next_button).toBeVisible();
  await next_button.click();

  const verificationCodeFromEmail = "9088"

  expect(verificationCodeFromEmail.length).toBe(4)

  for (let i = 0; i<verificationCodeFromEmail.length;i++){
    const otp_field = page.locator(`[name=otp${i+1}]`)
    await expect(otp_field).toBeVisible();
    await otp_field.fill(verificationCodeFromEmail[i]);
  }
  
  const popup_title = page.locator("div.col-md-12.title-popup")
  await expect(popup_title).toContainText("Gagal"); 
});