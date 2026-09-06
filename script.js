(() => {
  'use strict';
  const spots = { head: '頭・目の奥', neck: '首・肩', back: '背中', belly: 'お腹', waist: '腰', legs: '脚・足先' };
  const courses = {
    full: { name: 'オーダーメイド 150分', price: 13500, couponId: 'CP00000013298157', conditions: '全員対象。着替えを含みます。予約時にクーポンを選択。', description: 'よもぎ蒸し・吸玉・腸揉み・ヘッドスパ・足ツボから、施術と時間の配分をご相談します。' },
    belly: { name: '腸活UPコース', price: 12500, standardPrice: 16500, couponId: 'CP00000012662790', conditions: '全員対象・特別価格。通常 ¥16,500。予約時にクーポンを選択。', description: 'お話をうかがってブレンドする漢方蒸し、本格吸玉（全身経絡マッサージ付）、腸揉みを組み合わせるコースです。' },
    head: { name: '自律神経調整コース', price: 12500, couponId: 'CP00000012872737', conditions: '全員対象。よもぎ蒸しは含みません。予約時にクーポンを選択。', description: '背面オイルマッサージ、腸揉み、ヘッドスパ（デコルテ付）の組み合わせ。頭とお腹をケアするメニューの候補です。' },
    custom: { name: 'オーダーメイド 90分', price: 8000, couponId: 'CP00000011835444', conditions: '全員対象。着替えを含みます。予約時にクーポンを選択。', description: '気になるところが複数あるときは、まず組み合わせのご相談から。よもぎ蒸し・吸玉・腸揉み・ヘッドスパ・足ツボから一緒に考えます。' },
    body: { name: '全身の気血水の巡りUPコース', price: 8000, couponId: 'CP00000012904659', conditions: '全員対象。予約時にクーポンを選択。', description: 'よもぎ蒸しと、腰や脚まで含めた全身の吸玉を組み合わせます。' },
    upper: { name: '首肩背中スッキリコース', price: 6000, couponId: 'CP00000012125323', conditions: '全員対象。予約時にクーポンを選択。', description: 'よもぎ蒸しと吸玉（上半身）の組み合わせ。首・肩・背中を中心にケアするコースです。' },
    foot: { name: 'よもぎ蒸し ＋ 足ツボ 20分', price: 6500, regular: 7500, couponId: 'CP00000011835381', conditions: '新規限定。通常 ¥7,500。入店時にクーポンを提示。', description: 'よもぎ蒸しをしながら、20分の足ツボを受けられます。' },
    headAdd: { name: 'よもぎ蒸し ＋ ヘッドスパ 20分', price: 6500, regular: 7500, couponId: 'CP00000011933201', conditions: '新規限定。通常 ¥7,500。予約時にクーポンを選択。', description: 'よもぎ蒸しをしながら、20分のヘッドスパを受けられます。' },
    steam: { name: '黄土よもぎ蒸し 40分', price: 3500, regular: 4500, couponId: 'CP00000011835351', conditions: '新規限定。通常 ¥4,500。予約時にクーポンを選択。', description: 'まずはゆっくり温まる時間から。初めての方に、やり方や注意点をご説明します。' }
  };
  function selectRecommendation(keys) {
    const selected = new Set([...keys].filter(key => Object.hasOwn(spots, key)));
    if (!selected.size) return null;
    // 部位の多さだけで高額・長時間コースへ誘導せず、組み合わせの相談を案内。
    if (selected.size >= 3) return courses.custom;
    if (selected.has('belly') && selected.has('head')) return courses.head;
    if (selected.has('belly') && selected.size >= 2) return courses.belly;
    if (selected.has('head') && selected.size >= 2) return courses.custom;
    if (selected.has('waist') || (selected.has('legs') && selected.size >= 2)) return courses.body;
    if (selected.has('neck') || selected.has('back')) return courses.upper;
    if (selected.has('legs')) return courses.foot;
    if (selected.has('head')) return courses.headAdd;
    return courses.steam;
  }
  function consultationText(keys) {
    const selected = [...new Set(keys)].filter(key => Object.hasOwn(spots, key));
    const course = selectRecommendation(selected);
    if (!course) return '';
    const price = `¥${course.price.toLocaleString('ja-JP')}${course.regular ? '・新規限定' : course.standardPrice ? '・特別価格' : ''}`;
    return `こんにちは。Franのホームページを見てご連絡しました。\n気になっているのは「${selected.map(key => spots[key]).join('、')}」です。\n「${course.name}（${price}）」が気になっています。\n利用条件：${course.conditions}\nメニューと利用できる料金を相談させてください。\n来店経験：初めて／2回目以降（該当する方を残してください）\n希望日時：\nよろしくお願いします。`;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { selectRecommendation, consultationText, spots, courses };
  if (typeof document === 'undefined') return;

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('mobile-nav');
  function closeNav(returnFocus = false) {
    nav.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'メニューを開く');
    if (returnFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    nav.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeNav()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !nav.hidden) closeNav(true);
  });
  document.addEventListener('click', event => {
    if (!nav.hidden && !nav.contains(event.target) && !toggle.contains(event.target)) closeNav();
  });
  matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) closeNav(); });

  const picked = new Set();
  const buttons = [...document.querySelectorAll('[data-spot]')];
  const empty = document.getElementById('finder-empty');
  const result = document.getElementById('finder-result');
  const reset = document.getElementById('reset-selection');
  const copyStatus = document.getElementById('copy-status');
  const fallback = document.getElementById('copy-fallback');
  const copyButton = document.getElementById('copy-message');
  let selectionRevision = 0;
  function render() {
    selectionRevision += 1;
    const course = selectRecommendation(picked);
    empty.hidden = Boolean(course);
    result.hidden = !course;
    reset.hidden = !course;
    copyStatus.textContent = '';
    fallback.hidden = true;
    buttons.forEach(button => {
      const pressed = picked.has(button.dataset.spot);
      button.setAttribute('aria-pressed', String(pressed));
      button.querySelector('[data-spot-symbol]').textContent = pressed ? '✓' : '＋';
    });
    document.getElementById('body-selection-status').textContent = picked.size ? `${picked.size}か所を選択中` : '気になる部位を選んでください';
    if (!course) return;
    document.getElementById('picked-label').textContent = [...picked].map(key => spots[key]).join(' / ');
    document.getElementById('recommended-name').textContent = course.name;
    document.getElementById('recommended-description').textContent = course.description;
    document.getElementById('recommended-price').textContent = `¥${course.price.toLocaleString('ja-JP')}（税込${course.regular ? '・初回' : ''}）`;
    document.getElementById('recommended-conditions').textContent = course.conditions;
    document.getElementById('recommended-coupon').href = `https://beauty.hotpepper.jp/kr/slnH000779567/coupon/#${course.couponId}`;
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.spot;
    if (picked.has(key)) picked.delete(key); else picked.add(key);
    render();
  }));
  reset.addEventListener('click', () => { picked.clear(); render(); buttons[0].focus(); });
  copyButton.addEventListener('click', async () => {
    const text = consultationText(picked);
    if (!text) return;
    const revision = selectionRevision;
    copyButton.disabled = true;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      if (revision === selectionRevision) copyStatus.textContent = 'コピーしました。LINEに貼り付け、希望日時を追記してお送りください。';
    } catch {
      if (revision === selectionRevision) {
        fallback.value = text;
        fallback.hidden = false;
        copyStatus.textContent = '自動コピーができませんでした。下の文章を選択してコピーしてください。';
        fallback.focus();
        fallback.select();
      }
    } finally { copyButton.disabled = false; }
  });
  render();
})();
