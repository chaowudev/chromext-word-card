window.addEventListener('DOMContentLoaded', () => {
  // @todo 製作 popup contents
  // done 1. 新增 popup html & popup js
  // done 2. 取得 words object, result 是 callback
  // done 3. 將 object keys 放入 `<p></p>`
  chrome.storage.local.get(['words'],
    result => {
      // 如果 result 是空的，則回吐 {} 防呆機制
      const words = Object.keys(result.words || {});
      document.getElementById('words-count').textContent = words.length;
      document.getElementById('words').textContent = words.join(', ');

      // @todo 製作 review page
      // 1. 設定 options page
      // 2. 監聽點擊事件，取得複習頁面的 url，並使用 window.open 打開複習頁按鈕
      document.getElementById('review').addEventListener('click', () => {
        window.open(chrome.runtime.getURL('review.html'));
      });

      document.getElementById('copy').addEventListener('click', () => {
        navigator.clipboard.writeText(
          Object.entries(result.words || {})
            .map(pair => `${pair[0]}\t${pair[1]}\n`).join('\n')
        );
        document.getElementById('copy').textContent = '已複製到剪貼簿';
        document.getElementById('copy').disabled = true;
      });
    }
  );
});
