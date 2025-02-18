import CryptoJS from 'crypto-js';

export const encryptData = (data: any): string => {
  console.log('Encrypting data...');
  console.log('Data:', data);
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    import.meta.env.VITE_SECRET_KEY || ''
  ).toString();
  console.log('Ciphertext:', ciphertext);
  return ciphertext;
}; 