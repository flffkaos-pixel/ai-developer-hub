var LANG = (function(){
var _lang = localStorage.getItem('fcc_lang') || 'ko';

var _dict = {
  nav_home: ['홈', 'Home', 'ホーム'],
  nav_learn: ['학습', 'Learn', '学習'],
  nav_editor: ['편집기', 'Editor', 'エディタ'],
  nav_chat: ['채팅', 'Chat', 'チャット'],
  nav_tools: ['도구', 'Tools', 'ツール'],
  nav_signin: ['로그인', 'Sign In', 'サインイン'],
  nav_profile: ['프로필', 'Profile', 'プロフィール'],
  nav_lang: ['언어', 'Language', '言語'],

  home_title: ['AI 개발자 허브', 'AI Developer Hub', 'AI開発者ハブ'],
  home_subtitle: ['무료로 프로그래밍을 배우고, 도구를 활용하고, AI와 함께 성장하세요.', 'Learn programming free, use tools, grow with AI.', '無料でプログラミングを学び、ツールを活用し、AIと共に成長しよう。'],
  home_start: ['지금 시작하기', 'Get Started', '始めよう'],
  home_explore: ['커리큘럼 탐색', 'Explore Curriculum', 'カリキュラムを探索'],
  home_feat1: ['인터랙티브 코스', 'Interactive Courses', 'インタラクティブコース'],
  home_feat1_desc: ['무료 커리큘럼, 실습 및 실시간 테스트', 'Free curriculum with hands-on exercises and real-time testing', '無料カリキュラム、実践演習とリアルタイムテスト'],
  home_feat2: ['코드 에디터', 'Code Editor', 'コードエディタ'],
  home_feat2_desc: ['테스트 내장 에디터 — 코드 작성 후 즉시 피드백', 'Built-in editor with tests — write code and get instant feedback', 'テスト内蔵エディタ — コードを書いて即座にフィードバック'],
  home_feat3: ['AI 어시스턴트', 'AI Assistant', 'AIアシスタント'],
  home_feat3_desc: ['코드 설명, 디버깅 도움, 모범 사례', 'Get code explanations, debugging help, and best practices', 'コード説明、デバッグ支援、ベストプラクティス'],
  home_feat4: ['진행률 추적', 'Progress Tracking', '進捗トラッキング'],
  home_feat4_desc: ['XP, 레벨, 업적으로 학습 여정 추적', 'Track your learning journey with XP, levels, and achievements', 'XP、レベル、実績で学習の旅を追跡'],
  home_feat5: ['개발 도구', 'Dev Tools', '開発ツール'],
  home_feat5_desc: ['프롬프트 라이브러리, 코드 생성기, 생산성 도구', 'Prompt library, code generators, and productivity tools', 'プロンプトライブラリ、コード生成ツール、生産性向上ツール'],
  home_feat6: ['다국어', 'Multi-language', '多言語'],
  home_feat6_desc: ['한국어, 영어, 일본어로 학습 — 글로벌 개발자 대상', 'Learn in Korean, English, Japanese — designed for global devs', '韓国語、英語、日本語で学習 — グローバル開発者向け'],

  learn_title: ['커리큘럼', 'Curriculum', 'カリキュラム'],
  learn_desc: ['freeCodeCamp 기반 · 80+ 과목 · 20,000+ 챌린지', 'Based on freeCodeCamp · 80+ Subjects · 20,000+ Challenges', 'freeCodeCampベース · 80+科目 · 20,000+チャレンジ'],
  learn_search: ['과목 검색...', 'Search subjects...', '科目を検索...'],
  learn_all: ['전체 과목', 'All Subjects', '全科目'],
  learn_blocks: ['블록', 'Blocks', 'ブロック'],
  learn_challenges: ['챌린지', 'Challenges', 'チャレンジ'],
  learn_completed: ['완료', 'Completed', '完了'],
  learn_complete_pct: ['완료', 'complete', '完了'],
  learn_loading: ['로딩 중...', 'Loading...', '読み込み中...'],
  learn_no_subjects: ['검색 결과가 없습니다.', 'No results found.', '検索結果がありません。'],
  learn_no_challenges: ['챌린지 목록을 불러올 수 없습니다.', 'Could not load challenges.', 'チャレンジを読み込めませんでした。'],
  learn_back_all: ['모든 과목', 'All Subjects', '全科目'],
  learn_progress: ['개 완료', ' completed', ' 完了'],
  learn_subjects: ['과목', ' subjects', '科目'],
  learn_blocks: ['블록', ' blocks', 'ブロック'],

  editor_title: ['코드 에디터', 'Code Editor', 'コードエディタ'],
  editor_choose: ['아래 데모 챌린지를 선택하거나 Learn에서 과목을 선택하세요.', 'Choose a demo challenge or pick a subject from Learn.', 'デモチャレンジを選ぶか、Learnから科目を選んでください。'],
  editor_demos: ['데모 챌린지', 'Demo Challenges', 'デモチャレンジ'],
  editor_seed: ['시드 코드', 'Seed Code', 'シードコード'],
  editor_tests: ['테스트', 'Tests', 'テスト'],
  editor_back: ['뒤로', 'Back', '戻る'],
  editor_list: ['목록', 'List', '一覧'],
  editor_reset: ['초기화', 'Reset', 'リセット'],
  editor_run: ['▶ 테스트 실행', '▶ Run Tests', '▶ テスト実行'],
  editor_submit: ['제출', 'Submit', '提出'],
  editor_completed: ['완료!', 'Completed!', '完了！'],
  editor_preview: ['미리보기 & 테스트', 'Preview & Tests', 'プレビュー＆テスト'],
  editor_loading: ['로딩 중...', 'Loading...', '読み込み中...'],
  editor_need_connect: ['연결 필요', 'Connection Required', '接続が必要'],
  editor_connect_desc: ['서버에서 데이터를 불러올 수 없습니다. 아래 데모 챌린지를 이용하거나 로컬 서버를 실행하세요.', 'Could not fetch from server. Use demo challenges below or run a local server.', 'サーバーからデータを取得できません。以下のデモチャレンジを使用するか、ローカルサーバーを実行してください。'],
  editor_run_hint: ['테스트를 실행하려면 ▶ Run Tests를 클릭하세요.', 'Click ▶ Run Tests to check your solution.', '▶ Run Testsをクリックして解答を確認してください。'],
  editor_reset_hint: ['코드가 초기화되었습니다.', 'Code reset.', 'コードがリセットされました。'],
  editor_test_running: ['테스트 실행 중...', 'Running tests...', 'テスト実行中...'],
  editor_all_pass: ['모든 테스트 통과!', 'All tests passed!', '全テスト合格！'],
  editor_no_tests: ['이 챌린지에 테스트가 없습니다.', 'No tests for this challenge.', 'このチャレンジにテストはありません。'],
  editor_content_note: ['한국어 번역: AI 자동 번역', 'English (original)', '日本語翻訳: AI自動翻訳'],

  footer_right: ['© 2026 AI Developer Hub', '© 2026 AI Developer Hub', '© 2026 AI Developer Hub']
};

function t(key) {
  var langs = _dict[key];
  if (!langs) return key;
  var idx = _lang === 'ko' ? 0 : _lang === 'en' ? 1 : 2;
  return langs[idx] || langs[0] || key;
}

function setLang(lang) {
  _lang = lang;
  localStorage.setItem('fcc_lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var val = t(el.getAttribute('data-i18n'));
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = val;
    } else if (el.children.length === 0) {
      el.textContent = val;
    } else {
      var tn = Array.from(el.childNodes).find(function(n){ return n.nodeType === 3; });
      if (tn) tn.textContent = val;
    }
  });
  document.querySelectorAll('[data-i18n-title]').forEach(function(el){
    el.title = t(el.getAttribute('data-i18n-title'));
  });
  var sel = document.getElementById('langSelect');
  if (sel) sel.value = lang;
}

function initLang() {
  var saved = localStorage.getItem('fcc_lang') || 'ko';
  _lang = saved;
  setLang(saved);
}

window.__ = t;
window.setLang = setLang;
window.initLang = initLang;
return { t: t, setLang: setLang, initLang: initLang, getLang: function(){return _lang} };
})();
