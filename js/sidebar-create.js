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
      setState(listData);
      renderContent(doc, [doc.title]);
      history.pushState({ content: doc, titles: doc.title }, '', `/${doc.id}`);

      // appendSidebarItem(listRoot, doc);
    } catch (err) {
      console.error('문서 생성 실패:', err);
      alert('문서 생성 실패');
    }
  });
});

// function appendSidebarItem(listRoot, doc) {
//   const anchor = listRoot.querySelector(".insert_hover_box");
//   const li = document.createElement("li");
//   li.className = "list_box";
//   li.dataset.id = doc.id;

//   li.innerHTML = `
//     <div class="list_hover_box">
//       <div class="list_logo">
//         <img class="list_logo_img" src="./img/google-docs.png" alt="list_logo" />
//       </div>
//       <div class="list_title">${doc.title}</div>
//       <div class="add_logo">
//         <img class="remove_logo_img add_img" src="./img/plus.png" alt="add" />
//       </div>
//       <div class="remove_logo">
//         <img class="remove_logo_img" src="./img/delete.png" alt="remove" />
//       </div>
//     </div>
//   `;

//   if (anchor && anchor.parentNode) {
//     anchor.parentNode.insertBefore(li, anchor.nextSibling);
//   } else {
//     listRoot.appendChild(li);
//   }
// }
