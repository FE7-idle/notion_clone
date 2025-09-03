document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.querySelector('#content .content_area');

  // 디바운스
  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  async function saveContent() {
    const id = history.state.content.id;
    const title = document.querySelector('.notion-title').textContent;
    const content = textarea.value;

    try {
      const result = await putDocuments(id, title, content);
      console.log('저장 완료:', result);
    } catch (err) {
      console.error('저장 실패:', err);
    }
  }

  const debouncedSave = debounce(saveContent, 500);

  textarea.addEventListener('keyup', debouncedSave);
});
