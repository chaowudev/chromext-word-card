let detectingTranslationBubble;
const detectTranslationBubble = (timesToTry, resolve) => {
  if (timesToTry <= 0) return;
  detectingTranslationBubble = setTimeout(() => {
    const bubble = document.querySelector('.jfk-bubble');
    if (bubble) {
      resolve(bubble);
    } else {
      // 遞迴式 retry
      detectTranslationBubble(timesToTry - 1, resolve);
    }
  }, 500);
};

// do 10 times and resolve
const waitForTranslationBubble = () => new Promise(resolve => {
  clearTimeout(detectingTranslationBubble);
  detectTranslationBubble(10, resolve);
})

const addWord = (word, definition) => {
  chrome.storage.local.get(['words'], result => {
    chrome.storage.local.set({ words: {
      // separate operator '...'
      ...result.words,
      [word]: definition,
    }})
  });
}

const formTemplate = document.createElement('template');
formTemplate.innerHTML = `
  <style>
    hr {
      margin-top: 1.25rem;
    }
    input {
      margin: 0.25rem 0;
    }
    input[type=text] {
      width: 96%;
    }
    input[type=submit] {
      width: 100%;
    }
  </style>
  <form>
    <br>
    <hr>
    <label>詞語:</label>
    <input type='text' name='word' placeholder='詞語'>
    <br>
    <label>定義:</label>
    <input type='text' name='definition' placeholder='請選取/輸入定義'>
    <br>
    <input type='submit' value='新增字卡'>
  </form>
`;

// ============================================================================

// done 1. 確認 js 可以正確運作
// done 2. 取得文字
// done 3. 取得 bubble content
// done 4. 新增 workd translation div 容器
// done 5. 這個容器須為 attachShadow dom
// done 6. 複製 template
// done 7. 將 template 放到 shadow
// done 8. 將 div 放到 bubble 最後面
// done 9. 預填文字
let formContainer;
document.addEventListener('click', async () => {
  const selected = window.getSelection().toString();
  if (!selected) return;

  // 1. 避免 formContainer 在點擊後多次產生，所以要加一些判斷
  // 2. 正確預填
  if (formContainer && formContainer.parentNode.isConnected) {
    formContainer.shadowRoot.querySelector('input[name=definition]').value = selected;
  } else {
    const bubble = await waitForTranslationBubble();
  
    formContainer = document.createElement('div');
    // mode open to execute javascript
    const shadow = formContainer.attachShadow({ mode: 'open' });
    shadow.appendChild(document.importNode(formTemplate.content, true));
    bubble.appendChild(formContainer);
  
    const form = shadow.querySelector('form');
    form.querySelector('input[name=word]').value = selected;
  
    // done 1. 監聽事件，先宣告常數，拿到 word & definition
    // done 2. chrome 要獲得 storage 權限
    // done 3. 儲存單字到 storage
    // done 4. 點選新增單字
    //     - submit 按鈕不能再點擊 `btn.disabled = true`
    //     - 按鈕文字改顯示為 '新增成功'
    form.addEventListener('submit', event => {
      event.preventDefault();
      const word = form.querySelector('[name=word]').value;
      const definition = form.querySelector('[name=definition]').value;
  
      addWord(word, definition);
  
      const submitBtn = form.querySelector('[type=submit]');
      submitBtn.disabled = true;
      submitBtn.value = '新增成功!';
    })
  }
});
