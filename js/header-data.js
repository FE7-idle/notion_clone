// sidebar-to-content.js
const API = 'https://kdt-api.fe.dev-cos.com';
const USERNAME = 'idle';

document.addEventListener('DOMContentLoaded', () => {
  // 문서 눌렀을 시 이벤트
  document
    .querySelector('.document_list')
    ?.addEventListener('click', async (e) => {
      const li = e.target.closest('li.list_box');
      if (!li) return;

      const titles = [];
      let currentLi = li;
      while (currentLi && currentLi.classList.contains('list_box')) {
        const titleDiv = currentLi.querySelector('.list_title');
        if (titleDiv) titles.unshift(titleDiv.textContent);
        currentLi = currentLi.parentElement.closest('li.list_box');
      }

      const id = li.dataset.id;
      const content = await getDocumentContent(id);

      const updatedAt = new Date(content.updatedAt);

      document.querySelector('.notion-title').innerText = content.title;
      const subTitle = titles.join(' / ');
      document.querySelector('.top-left').innerText = subTitle;
      document.querySelector('.top-right').innerText = `${
        updatedAt.getMonth() + 1
      }월 ${updatedAt.getDate()}일`;
      document.querySelector('.content_area').innerText = content.content;

      // // history.pushState({ content }, '', `/${id}`);
      updatePage(content);
    });
});
