const state = {
  documents: [],
};

function setState(newState) {
  state.documents = newState;
  renderDocuments();
}

function renderDocuments() {
  const insertBox = document.querySelector('.insert_hover_box');
  const parent = insertBox.parentNode;

  parent.querySelectorAll('.list_box').forEach((li) => li.remove());

  state.documents.forEach((item) => {
    const li = createDocumentLi(item);
    insertBox.parentNode.insertBefore(li, insertBox.nextSibling);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const listData = await getDocuments();
  setState(listData);

  initTitleEditing();
});

function updatePage(state) {
  if (!state) return;
  console.log(state);
}

window.addEventListener('popstate', (e) => {
  renderContent(e.state.content, e.state.titles);
  renderDocuments();
});

async function getDocuments() {
  try {
    const res = await fetch('https://kdt-api.fe.dev-cos.com/documents', {
      method: 'GET',
      headers: {
        'x-username': 'idle',
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function postDocuments(id) {
  const res = await fetch('https://kdt-api.fe.dev-cos.com/documents', {
    method: 'POST',
    headers: {
      'x-username': 'idle',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: id ? '하위 문서' : '새 문서',
      parent: id || null,
    }),
  });
  const data = await res.json();
  return data;
}

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

async function deleteDocuments(id) {
  const res = await fetch(`https://kdt-api.fe.dev-cos.com/documents/${id}`, {
    method: 'DELETE',
    headers: {
      'x-username': 'idle',
    },
  });
  const data = await res.json();
}

// 콘텐츠 수정
async function putDocuments(id, title, content) {
  console.log('id:', id);
  console.log('title:', title);
  console.log('content:', content);

  const res = await fetch(`https://kdt-api.fe.dev-cos.com/documents/${id}`, {
    method: 'PUT',
    headers: {
      'x-username': 'idle',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      content,
    }),
  });
  const data = await res.json();
  console.log(data);
  return data;
}

function createDocumentLi(item, depth = 0) {
  const path = window.location.pathname.slice(1);
  const li = document.createElement('li');
  li.className = 'list_box';

  // padding-left 직접 적용 (클래스 대신 스타일 사용 가능)
  li.style.paddingLeft = `10px`;
  li.dataset.id = item.id;

  // hoverBox
  const hoverBox = document.createElement('div');
  hoverBox.className = 'list_hover_box';

  // 액티브 되어 있는 페이지 강조
  if (item.id === Number(path)) hoverBox.classList.add('active');

  const logoDiv = document.createElement('div');
  logoDiv.className = 'list_logo';
  const logoImg = document.createElement('img');
  logoImg.className = 'list_logo_img';
  logoImg.src = './img/google-docs.png';
  logoImg.alt = 'list_logo';
  logoImg.style.width = '17px';

  logoDiv.addEventListener('mouseenter', () => {
    logoImg.src = './img/right-arrow.png';
  });
  logoDiv.addEventListener('mouseleave', () => {
    logoImg.src = './img/google-docs.png';
  });

  logoDiv.appendChild(logoImg);

  const titleDiv = document.createElement('div');
  titleDiv.className = 'list_title';
  titleDiv.textContent = item.title;

  const addDiv = document.createElement('div');
  addDiv.className = 'add_logo';
  const addImg = document.createElement('img');
  addImg.className = 'add_img remove_logo_img';
  addImg.src = './img/plus.png';
  addImg.alt = 'add_logo';
  addDiv.appendChild(addImg);

  const removeDiv = document.createElement('div');
  removeDiv.className = 'remove_logo';
  const removeImg = document.createElement('img');
  removeImg.className = 'remove_logo_img';
  removeImg.src = './img/delete.png';
  removeImg.alt = 'remove_logo';
  removeDiv.appendChild(removeImg);

  hoverBox.append(logoDiv, titleDiv, addDiv, removeDiv);
  li.appendChild(hoverBox);

  if (item.documents && item.documents.length) {
    item.documents.forEach((subItem) => {
      const subLi = createDocumentLi(subItem, depth + 1);
      li.appendChild(subLi);
    });
  }

  return li;
}

function initTitleEditing() {
  const titleEl = document.querySelector('.notion-title');
  if (!titleEl) return;

  titleEl.addEventListener('dblclick', () => {
    titleEl.setAttribute('contenteditable', 'true');
    titleEl.focus();
    titleEl.style.outline = 'none';
    const id = history.state.content.id;

    titleEl.addEventListener(
      'blur',
      async () => {
        titleEl.removeAttribute('contenteditable');
        const newTitle = titleEl.textContent.trim();

        if (newTitle && id) {
          const updated = await putDocuments(
            id,
            newTitle,
            document.querySelector('.content_area').value
          );

          if (updated) {
            titleEl.textContent = updated.title;

            const listData = await getDocuments();
            setState(listData);

            const currentLi = document.querySelector(
              `.list_box[data-id="${id}"]`
            );
            if (currentLi) {
              const titles = getTitles(currentLi);
              document.querySelector('.top-left').innerText =
                titles.join(' / ');
            }
          }
        }
      },
      { once: true }
    );

    titleEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        titleEl.blur();
      }
    });
  });
}
