const WHATSAPP_NUMBER = "972XXXXXXXXX";
const WHATSAPP_TEXT = "Здравствуйте. У нас доход около ₪25–40k, но деньги не остаются. Хотим понять, куда они уходят, что давит на бюджет и как выйти из нуля или минуса.";

const YOUTUBE_LINK = "https://youtube.com/ТВОЙ_КАНАЛ";
const FACEBOOK_LINK = "https://facebook.com/ТВОЯ_СТРАНИЦА";
const INSTAGRAM_LINK = "https://instagram.com/ТВОЙ_АККАУНТ";

document.addEventListener("DOMContentLoaded", function() {
  const waLink = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WHATSAPP_TEXT);

  document.querySelectorAll(".wa-link").forEach(function(el) {
    el.href = waLink;
  });

  document.querySelectorAll(".yt-link").forEach(function(el) {
    el.href = YOUTUBE_LINK;
  });

  document.querySelectorAll(".fb-link").forEach(function(el) {
    el.href = FACEBOOK_LINK;
  });

  document.querySelectorAll(".ig-link").forEach(function(el) {
    el.href = INSTAGRAM_LINK;
  });
});
