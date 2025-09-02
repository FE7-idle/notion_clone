// sidebar-to-content.js
const API = "https://kdt-api.fe.dev-cos.com";
const USERNAME = "idle";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".document_list")?.addEventListener("click", (e) => {
    const li = e.target.closest("li.list_box");
    if (!li) return;

    const title =
      li.querySelector(".list_title")?.textContent.trim() || "(제목 없음)";
    document.querySelector(".top-left").textContent = title;
  });
});
