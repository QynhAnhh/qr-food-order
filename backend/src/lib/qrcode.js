const QRCode = require('qrcode');

const generateQRCodeBase64 = async (url) => {
  try {
    return await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (error) {
    throw new Error('Lỗi! Máy in QR đang bị kẹt giấy!');
  }
};

module.exports = { generateQRCodeBase64 };
