// formセクション専用: ?event= クエリを読んで「選択中のイベント」ボックスを表示する
// 例: /form/event/?event=2026/08/01(土) - 【12:00開始】夏休み特別オープンキャンパス
(() => {
  const box = document.querySelector("[data-event-selected]");
  if (!box) return;

  const eventName = new URLSearchParams(location.search).get("event");
  if (!eventName) return;

  // XSS対策: 挿入は必ず textContent（innerHTML禁止）
  const nameEl = box.querySelector("[data-event-selected-name]");
  if (!nameEl) return;
  nameEl.textContent = eventName;
  box.hidden = false;

  // フォーム内の参加イベントselectに完全一致の選択肢があれば選択状態にする
  const select = document.querySelector('select[name="event-name"]');
  if (select) {
    for (const opt of select.options) {
      if (opt.value === eventName) {
        select.value = eventName;
        break;
      }
    }
  }
})();
