document.addEventListener('DOMContentLoaded', () => {
  const plusBtn = document.querySelector('.insert_hover_box .insert_logo img');
  const listRoot = document.querySelector('.document_list');
  if (!plusBtn || !listRoot) return;

  plusBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API}/documents`, {
        method: 'POST',
        headers: {
          'x-username': USERNAME,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '새 문서',
          parent: null,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      const doc = await res.json();
      const listData = await getDocuments();
      renderContent(doc, [doc.title]);
      history.pushState({ content: doc, titles: doc.title }, '', `/${doc.id}`);
      setState(listData);
    } catch (err) {
      console.error('문서 생성 실패:', err);
      alert('문서 생성 실패');
    }
  });
});
