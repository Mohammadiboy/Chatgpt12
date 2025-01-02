const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express');

// تنظیمات API
const OPENAI_API_KEY = "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";
const TELEGRAM_TOKEN = "7829017035:AAFPDgieySGSEBJ2VyCotPHPc47hMilSRMY";

// ایجاد بات تلگرام
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// دکمه‌های کیبورد
const keyboard = {
  reply_markup: {
    keyboard: [
      ["پرسش و پاسخ 🧠", "راهنما 📖"],
      ["کانال 📢", "پشتیبانی 👤"]
    ],
    resize_keyboard: true
  }
};

// مدیریت دستور /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "سلام! به بات محمدی خوش آمدید. لطفاً یکی از گزینه‌ها را انتخاب کنید:", keyboard);
});

// مدیریت پیام‌های کاربر
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  if (userMessage === "کانال 📢") {
    bot.sendMessage(chatId, "📢 کانال ما: @MohammadiBots");
  } else if (userMessage === "پشتیبانی 👤") {
    bot.sendMessage(chatId, "👤 پشتیبانی: @AqaiMohammadi");
  } else if (userMessage === "راهنما 📖") {
    bot.sendMessage(chatId, "📖 شما می‌توانید سوالات خود را از بات بپرسید یا از دکمه‌ها استفاده کنید.");
  } else {
    // ارسال پیام به OpenAI API
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userMessage }]
        },
        {
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      const botResponse = response.data.choices[0].message.content;
      bot.sendMessage(chatId, botResponse);
    } catch (error) {
      console.error("Error communicating with OpenAI:", error);
      bot.sendMessage(chatId, "متأسفانه مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.");
    }
  }
});

// ایجاد سرور Express برای گوش دادن به پورت
const app = express();

// پورت را از متغیر محیطی PORT بگیرید یا به 3000 تنظیم کنید
const PORT = process.env.PORT || 3000;

// سرور Express را راه‌اندازی کنید
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// مسیر اصلی برای تست سرور
app.get('/', (req, res) => {
  res.send('بات تلگرام در حال اجرا است!');
});
