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