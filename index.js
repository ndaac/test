// Import library Telegraf dan modul `exec` dari child_process
const { Telegraf } = require('telegraf');
const { exec } = require('child_process');

// Konfigurasi bot
const BOT_TOKEN = '7572801899:AAHYgy9bz8oaAMBqaGUm4zi5YlLvUCie_uk'; // Ganti dengan token bot Anda
const ALLOWED_USER_ID = 7121635373 // Ganti dengan ID pengguna Telegram Anda

// Inisialisasi bot
const bot = new Telegraf(BOT_TOKEN);

// Middleware untuk membatasi akses hanya untuk pengguna yang diizinkan
bot.use((ctx, next) => {
  if (ctx.from.id === ALLOWED_USER_ID) {
    return next(); // Lanjutkan jika ID pengguna cocok
  }
  // Jika tidak, kirim pesan penolakan dan jangan proses lebih lanjut
  return ctx.reply('Maaf, Anda tidak diizinkan menggunakan bot ini.  unauthorized');
});

// Perintah /start
bot.start((ctx) => {
  ctx.reply('Selamat datang! Kirimkan saya perintah shell untuk dieksekusi.');
});

// Menangani semua pesan teks yang masuk
bot.on('text', (ctx) => {
  const command = ctx.message.text;
  
  // Menampilkan pesan bahwa perintah sedang dijalankan
  ctx.reply(`Menjalankan: \`${command}\` ...`, { parse_mode: 'Markdown' });

  // Eksekusi perintah shell
  exec(command, (error, stdout, stderr) => {
    if (error) {
      // Jika terjadi error saat eksekusi
      console.error(`Error executing command: ${error.message}`);
      ctx.reply(`❌ *Error:*\n\`\`\`\n${error.message}\n\`\`\``, { parse_mode: 'Markdown' });
      return;
    }

    if (stderr) {
      // Jika ada output error dari perintah
      console.error(`Stderr: ${stderr}`);
      ctx.reply(`⚠️ *Stderr:*\n\`\`\`\n${stderr}\n\`\`\``, { parse_mode: 'Markdown' });
      return;
    }
    
    // Jika berhasil, kirim output standar (stdout)
    // Cek jika output kosong
    const output = stdout.trim() ? stdout : '(Tidak ada output)';
    ctx.reply(`✅ *Output:*\n\`\`\`\n${output}\n\`\`\``, { parse_mode: 'Markdown' });
  });
});

// Luncurkan bot
bot.launch(() => {
  console.log('Bot shell sedang berjalan...');
});

// Menangani proses penghentian bot dengan anggun
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
