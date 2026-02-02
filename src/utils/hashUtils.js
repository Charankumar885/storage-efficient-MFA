import CryptoJS from 'crypto-js';

// Reads a file and returns its Base64 string
export const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Converts the Base64 string into a short Hash (Storage Efficient)
export const generateImageHash = (base64String) => {
  return CryptoJS.SHA256(base64String).toString();
};