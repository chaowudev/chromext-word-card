const cardTemplate = document.createElement('template');
cardTemplate.innerHTML = `
  <div class='card'>
    <button class='button button-delete'>X</button>
    <p class='word'></p>
    <p class='definition'></p>
  </div>
`;

// ============================================================================

// @todo word card
// done 1. 監聽 dom content loaded event
// done 2. 從 storage 中取得 words object
// 2. callback 先拿到單字卡的長度顯示在畫面上
// 3. 使用 `.entries` 拿到 pair key value
// 4. 在 element cards 中塞入一張張 cardTemplate
window.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['words'],
    result => {
      const words = Object.keys(result.words || {});
      let wordCount = words.length;
      document.getElementById('words-count').textContent = wordCount;
      
      Object.entries(result.words || {}).forEach(pair => {
        const cardDOM = document.importNode(cardTemplate.content, true);
        cardDOM.querySelector('.word').textContent = pair[0];
        cardDOM.querySelector('.definition').textContent = pair[1];

        // @todo delete card
        // done 1. 找出 delete btn 並監聽刪除按鈕事件
        // done 2. 因為還在迴圈中，所以可以直接刪除 key
        // done 3. 將 words 重新設定
        // done 4. 移除 cardTemplate items
        // done 5. 卡片張數數字 -1
        // 6. 重新給卡片張數數字
        const cardDiv = cardDOM.querySelector('.card');

        cardDOM.querySelector('.button-delete').addEventListener('click', () => {
          delete result.words[pair[0]];
          chrome.storage.local.set({ words: result.words });
          cardDiv.remove();
          wordCount -= 1;
          document.getElementById('words-count').textContent = wordCount;
        });

        // cardDOM 要最後在 appendChild, 當 appenChild 後，就已經不是 flaggment，因此無法再對 cardDOM 操作
        document.getElementById('cards').appendChild(cardDOM);
      });

      // 1. 將 words object 清空
      // 2. 將 word count = 0
      document.getElementById('clear').addEventListener('click', () => {
        chrome.storage.local.set({ words: {} });
        wordCount = 0;
        document.getElementById('words-count').textContent = wordCount;
        document.getElementById('cards').innerHTML = '';
      });
    }
  );
})
