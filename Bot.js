const { Client } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Nama sesi
const sessionName = 'session';

// Lokasi file sesi
const sessionPath = path.join(__dirname, `${sessionName}.json`);

// URL Chat AI elxyz.me
const chatAiUrl = 'https://elxyz.me/api/chat';

// Buat client WhatsApp
const client = new Client({
  session: sessionPath,
  qrTimeout: 0, // Tidak ada batas waktu untuk scan QR
});

// Fungsi untuk mengirim pesan
async function sendMessage(to, message) {
  try {
    await client.sendMessage(to, message);
    console.log(`Pesan terkirim ke ${to}: ${message}`);
  } catch (error) {
    console.error(`Gagal mengirim pesan ke ${to}: ${error}`);
  }
}

// Fungsi untuk mengolah pesan masuk
async function handleMessage(message) {
  const { from, body } = message;
  console.log(`Pesan masuk dari ${from}: ${body}`);

  // Kirim pesan ke Chat AI elxyz.me
  const response = await axios.post(chatAiUrl, {
    message: body,
  });

  // Dapatkan jawaban dari Chat AI elxyz.me
  const answer = response.data.answer;

  // Kirim jawaban ke pengguna
  await sendMessage(from, answer);
}

// Fungsi untuk mengolah kesalahan
async function handleError(error) {
  console.error(`Kesalahan: ${error}`);
}

// Mulai client WhatsApp
client.initialize();

// Event listener untuk pesan masuk
client.on('message', handleMessage);

// Event listener untuk kesalahan
client.on('error', handleError);

// Event listener untuk scan QR
client.on('qr', (qr) => {
  console.log(`Scan QR: ${qr}`);
});

// Event listener untuk sesi terbuka
client.on('ready', () => {
  console.log('Sesi terbuka!');
})
