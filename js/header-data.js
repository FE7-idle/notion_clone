// sidebar-to-content.js
const API = 'https://kdt-api.fe.dev-cos.com';
const USERNAME = 'idle';

document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelector('.document_list')
    ?.addEventListener('click', async (e) => {
      const path = window.location.pathname.slice(1);
      const li = e.target.closest('li.list_box');
      if (!li) return;

      // 삭제 버튼 클릭이면 삭제 처리
      if (e.target.closest('.list_hover_box .remove_logo')) {
        const parentLi = li.parentElement.closest('li.list_box');
        const parentId = parentLi ? Number(parentLi.dataset.id) : null;
        await deleteDocuments(li.dataset.id);
        const listData = await getDocuments();
        // 보고 있는 페이지가 삭제 됐을 때
        if (path === li.dataset.id) {
          if (parentId) {
            const parentContent = await getDocumentContent(parentId);
            const titles = getTitles(parentLi);
            renderContent(parentContent, titles);
            history.pushState(
              { content: parentContent, titles },
              '',
              `/${parentId}`
            );
          } else {
            history.pushState({}, '', '/');
            renderContent({ title: '새 문서를 선택하세요', content: '' }, []);
          }
        }
        setState(listData);
        return;
      }

      // 하위 문서 추가 버튼 처리
      if (e.target.closest('.list_hover_box .add_logo')) {
        const titles = getTitles(li);
        const doc = await postDocuments(li.dataset.id);
        const listData = await getDocuments();
        titles.push(doc.title);
        renderContent(doc, titles);
        history.pushState({ content: doc, titles }, '', `/${doc.id}`);
        setState(listData);
        return;
      }

      // 문서 눌렀을 시 이벤트
      const titles = getTitles(li);
      const id = li.dataset.id;
      const content = await getDocumentContent(id);

      renderContent(content, titles);
      history.pushState({ content, titles }, '', `/${id}`);
      renderDocuments();
      // updatePage(content);
    });
});

function getTitles(li) {
  const titles = [];
  let currentLi = li;

  while (currentLi && currentLi.classList.contains('list_box')) {
    const titleDiv = currentLi.querySelector('.list_title');
    if (titleDiv) titles.unshift(titleDiv.textContent);
    currentLi = currentLi.parentElement
      ? currentLi.parentElement.closest('li.list_box')
      : null;
  }

  return titles;
}

function renderContent(content, titles) {
  const updatedAt = new Date(content.updatedAt);
  document.querySelector('.notion-title').innerText = content.title;
  const subTitle = titles.join(' / ');
  document.querySelector('.top-left').innerText = subTitle;
  document.querySelector('.top-right').innerText = !!titles.length
    ? `${updatedAt.getMonth() + 1}월 ${updatedAt.getDate()}일`
    : '';
  document.querySelector('.content_area').value = content.content || '';
}
