// 페이지 로드 시
document.addEventListener('DOMContentLoaded', async () => {
  loadContentFromURL();

  const listData = await getDocuments();
  // const documentsUl = document.querySelector('.document_list');
  const insertBox = document.querySelector('.insert_hover_box');
  listData.map((item) => {
    const li = document.createElement('li');
    li.className = 'list_box';
    li.setAttribute('data-id', item.id);
    li.innerHTML = `<div class="list_hover_box">
                      <div class="list_logo">
                        <img class="list_logo_img" src="./img/google-docs.png" alt="list_logo" />
                      </div>
                      <div class="list_title">${item.title}</div>
                      <div class="add_logo">
                      <img
                        class="remove_logo_img add_img"
                        src="./img/plus.png"
                        alt="remove_logo"
                      />
                      </div>
                      <div class="remove_logo">
                        <img class="remove_logo_img" src="./img/delete.png" alt="remove_logo"/>
                      </div>
                    </div>
                    `;
    // 나중에 동적(문서가 추가될 때)으로 어떻게 할지 생각
    li.addEventListener('click', async function (e) {
      const id = e.currentTarget.getAttribute('data-id');
      const content = await getDocumentContent(id);

      // 페이지 이동
      // history.pushState({ content }, '', `/${id}`);

      updatePage(content);
    });

    insertBox.parentNode.insertBefore(li, insertBox.nextSibling);

    const removeBtn = document.querySelector('.remove_logo');
    removeBtn.addEventListener('click', async function (e) {
      e.stopPropagation();
      const removeId =
        e.target.parentNode.parentNode.parentNode.getAttribute('data-id');
      await deleteDocuments(removeId);
    });
  });
});

// 페이지 새로고침 시
function loadContentFromURL() {
  const path = window.location.pathname.replace('/', '') || 'home';
  // const pageData = pages[path] || { content: '404', title: 'Not Found' };
  // document.getElementById('content').textContent = pageData.content;
  // document.title = pageData.title;
  console.log(path);
}

// 페이지 이동 시
function updatePage(state) {
  if (!state) return;
  console.log(state.title);
}

// 페이지 뒤로/앞으로 가기 할 시
window.addEventListener('popstate', (e) => {
  console.log('asd');
});

// 전체 리스트 호출
async function getDocuments() {
  try {
    const res = await fetch('https://kdt-api.fe.dev-cos.com/documents', {
      method: 'GET',
      headers: {
        'x-username': 'idle',
      },
    });

    // if (res.ok !== 200) {
    //   throw new Error('에러');
    // }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// 해당 콘텐츠 가져오기
async function getDocumentContent(id) {
  const res = await fetch(`https://kdt-api.fe.dev-cos.com/documents/${id}`, {
    method: 'GET',
    headers: {
      'x-username': 'idle',
    },
  });
  const data = await res.json();
  return data;
}

// 콘텐츠 삭제
async function deleteDocuments(id) {
  const res = await fetch(`https://kdt-api.fe.dev-cos.com/documents/${id}`, {
    method: 'DELETE',
    headers: {
      'x-username': 'idle',
    },
  });
  const data = await res.json();
  console.log(data);
}
