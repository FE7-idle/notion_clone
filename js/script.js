// 전역 state 객체
const state = {
  documents: [],
};

// 상태 변경 함수
function setState(newState) {
  state.documents = newState;
  renderDocuments();
}

// 렌더링 함수
function renderDocuments() {
  const insertBox = document.querySelector('.insert_hover_box');
  const parent = insertBox.parentNode;

  // 기존 리스트 전부 제거
  parent.querySelectorAll('.list_box').forEach((li) => li.remove());

  // 새 리스트 렌더링
  state.documents.forEach((item) => {
    const li = createDocumentLi(item);
    insertBox.parentNode.insertBefore(li, insertBox.nextSibling);
  });
}

// 페이지 로드 시
document.addEventListener('DOMContentLoaded', async () => {
  // loadContentFromURL();

  const listData = await getDocuments();
  setState(listData);
});

// 페이지 새로고침 시
// function loadContentFromURL() {
//   const path = window.location.pathname.replace('/', '') || 'home';
//   // const pageData = pages[path] || { content: '404', title: 'Not Found' };
//   // document.getElementById('content').textContent = pageData.content;
//   // document.title = pageData.title;
//   console.log(path);
// }

// 페이지 이동 시
function updatePage(state) {
  if (!state) return;
  console.log(state);
}

// 페이지 뒤로/앞으로 가기 할 시
window.addEventListener('popstate', (e) => {
  renderContent(e.state.content, e.state.titles);
  console.log(e.state.titles);
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

// 문서 추가 API
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
}

// document li 생성
function createDocumentLi(item, depth = 0) {
  const li = document.createElement('li');
  li.className = 'list_box';

  // padding-left 직접 적용 (클래스 대신 스타일 사용 가능)
  li.style.paddingLeft = `10px`;

  li.dataset.id = item.id;

  // hoverBox
  const hoverBox = document.createElement('div');
  hoverBox.className = 'list_hover_box';

  // logo
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

  // title
  const titleDiv = document.createElement('div');
  titleDiv.className = 'list_title';
  titleDiv.textContent = item.title;

  // add 버튼
  const addDiv = document.createElement('div');
  addDiv.className = 'add_logo';
  const addImg = document.createElement('img');
  addImg.className = 'add_img remove_logo_img';
  addImg.src = './img/plus.png';
  addImg.alt = 'add_logo';
  addDiv.appendChild(addImg);

  // remove 버튼
  const removeDiv = document.createElement('div');
  removeDiv.className = 'remove_logo';
  const removeImg = document.createElement('img');
  removeImg.className = 'remove_logo_img';
  removeImg.src = './img/delete.png';
  removeImg.alt = 'remove_logo';
  removeDiv.appendChild(removeImg);

  hoverBox.append(logoDiv, titleDiv, addDiv, removeDiv);
  li.appendChild(hoverBox);

  // 하위문서 처리
  if (item.documents && item.documents.length) {
    item.documents.forEach((subItem) => {
      const subLi = createDocumentLi(subItem, depth + 1);
      li.appendChild(subLi);
    });
  }

  return li;
}
