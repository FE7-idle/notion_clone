// sidebar-to-content.js
const API = 'https://kdt-api.fe.dev-cos.com';
const USERNAME = 'idle';

document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelector('.document_list')
    ?.addEventListener('click', async (e) => {
      const li = e.target.closest('li.list_box');
      if (!li) return;

      // 삭제 버튼 클릭이면 삭제 처리
      if (e.target.closest('.list_hover_box .remove_logo')) {
        await deleteDocuments(li.dataset.id);
        const listData = await getDocuments();
        setState(listData);
        return;
      }

      // 하위 문서 추가 버튼 처리
      if (e.target.closest('.list_hover_box .add_logo')) {
        const titles = getTitles(li);
        const doc = await postDocuments(li.dataset.id);
        const listData = await getDocuments();
        setState(listData);
        titles.push(doc.title);
        renderContent(doc, titles);
        history.pushState({ content: doc, titles }, '', `/${doc.id}`);

        return;
      }

      // 문서 눌렀을 시 이벤트
      // const titles = [];
      // let currentLi = li;
      // while (currentLi && currentLi.classList.contains('list_box')) {
      //   const titleDiv = currentLi.querySelector('.list_title');
      //   if (titleDiv) titles.unshift(titleDiv.textContent);
      //   currentLi = currentLi.parentElement.closest('li.list_box');
      // }

      const titles = getTitles(li);

      const id = li.dataset.id;
      const content = await getDocumentContent(id);

      renderContent(content, titles);

      history.pushState({ content, titles }, '', `/${id}`);
      const path = window.location.pathname.slice(1);
      // console.log(path);
      updatePage(content);
    });
});

function getTitles(li) {
  const titles = [];
  let currentLi = li;

  while (currentLi && currentLi.classList.contains('list_box')) {
    const titleDiv = currentLi.querySelector('.list_title');
    if (titleDiv) titles.unshift(titleDiv.textContent);
    currentLi = currentLi.parentElement.closest('li.list_box');
  }

  return titles;
}

function renderContent(content, titles) {
  const updatedAt = new Date(content.updatedAt);
  document.querySelector('.notion-title').innerText = content.title;
  const subTitle = titles.join(' / ');
  document.querySelector('.top-left').innerText = subTitle;
  document.querySelector('.top-right').innerText = `${
    updatedAt.getMonth() + 1
  }월 ${updatedAt.getDate()}일`;
  document.querySelector('.content_area').innerText = content.content || '';
}
