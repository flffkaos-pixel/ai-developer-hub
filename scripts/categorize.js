const fs = require('fs');
const path = require('path');

const dataFile = path.resolve(__dirname, '..', 'public', 'data', 'curriculum.js');
const s = fs.readFileSync(dataFile, 'utf8');
const data = JSON.parse(s.slice(22).slice(0, -1));

const categories = [
  {
    id: 'html-css',
    names: ['HTML & CSS', 'HTML & CSS', 'HTML & CSS'],
    subjects: [
      'responsive-web-design', 'responsive-web-design-22', 'responsive-web-design-v9',
      'basic-html', 'semantic-html', 'html-forms-and-tables',
      'html-and-accessibility', 'basic-css', 'css-colors', 'css-box-model',
      'css-flexbox', 'css-grid', 'css-typography', 'css-animations',
      'css-variables', 'css-positioning', 'css-and-accessibility',
      'pseudo-classes-and-elements', 'attribute-selectors', 'absolute-and-relative-units',
      'styling-forms', 'responsive-design', 'design-for-developers'
    ]
  },
  {
    id: 'javascript',
    names: ['JavaScript', 'JavaScript', 'JavaScript'],
    subjects: [
      'javascript-algorithms-and-data-structures', 'javascript-algorithms-and-data-structures-22',
      'javascript-v9', 'javascript-fundamentals-review',
      'introduction-to-variables-and-strings-in-javascript',
      'introduction-to-booleans-and-numbers-in-javascript',
      'introduction-functions-in-javascript',
      'introduction-to-arrays-in-javascript',
      'introduction-to-objects-in-javascript',
      'introduction-to-loops-in-javascript',
      'introduction-to-higher-order-functions-and-callbacks-in-javascript',
      'learn-dom-manipulation-and-events-with-javascript',
      'introduction-to-javascript-and-accessibility',
      'learn-javascript-debugging',
      'learn-basic-regex-with-javascript',
      'introduction-to-dates-in-javascript',
      'learn-audio-and-video-events-with-javascript',
      'introduction-to-maps-and-sets-in-javascript',
      'learn-localstorage-and-crud-operations-with-javascript',
      'introduction-to-javascript-classes',
      'learn-recursion-with-javascript',
      'introduction-to-functional-programming-with-javascript',
      'introduction-to-asynchronous-javascript'
    ]
  },
  {
    id: 'frontend',
    names: ['프론트엔드', 'Frontend', 'フロントエンド'],
    subjects: [
      'front-end-development-libraries', 'front-end-development-libraries-v9',
      'data-visualization', 'data-visualization-with-d3',
      'learn-data-visualization-with-d3',
      'dev-playground', 'full-stack-open', 'full-stack-developer-v9'
    ]
  },
  {
    id: 'backend',
    names: ['백엔드 & API', 'Backend & APIs', 'バックエンド＆API'],
    subjects: [
      'back-end-development-and-apis', 'back-end-development-and-apis-v9',
      'quality-assurance', 'information-security'
    ]
  },
  {
    id: 'python',
    names: ['Python', 'Python', 'Python'],
    subjects: [
      'scientific-computing-with-python', 'data-analysis-with-python',
      'python-for-everybody', 'python-v9',
      'learn-python-for-beginners', 'college-algebra-with-python',
      'learn-oop-with-python',
      'introduction-to-python-basics',
      'learn-python-loops-and-sequences',
      'learn-python-dictionaries-and-sets',
      'learn-error-handling-in-python',
      'learn-python-classes-and-objects',
      'introduction-to-oop-in-python',
      'introduction-to-linear-data-structures-in-python',
      'learn-algorithms-in-python',
      'learn-graphs-and-trees-in-python',
      'learn-dynamic-programming-in-python'
    ]
  },
  {
    id: 'ml-ai',
    names: ['머신러닝 & AI', 'ML & AI', '機械学習＆AI'],
    subjects: [
      'machine-learning-with-python',
      'learn-rag-mcp-fundamentals'
    ]
  },
  {
    id: 'database',
    names: ['데이터베이스 & SQL', 'Database & SQL', 'データベース＆SQL'],
    subjects: [
      'relational-databases', 'relational-databases-v9',
      'introduction-to-sql-and-postgresql',
      'learn-sql-and-bash',
      'introduction-to-nano'
    ]
  },
  {
    id: 'cs-interview',
    names: ['CS 기초 & 인터뷰', 'CS Fundamentals & Interview', 'CS基礎＆面接'],
    subjects: [
      'coding-interview-prep', 'the-odin-project', 'project-euler', 'rosetta-code',
      'introduction-to-algorithms-and-data-structures',
      'introduction-to-precalculus', 'computer-basics',
      'foundational-c-sharp-with-microsoft'
    ]
  },
  {
    id: 'dev-tools',
    names: ['개발 도구 & 기타', 'Dev Tools & Other', '開発ツール＆その他'],
    subjects: [
      'introduction-to-bash', 'learn-bash-scripting',
      'introduction-to-git-and-github',
      'a2-english-for-developers', 'b1-english-for-developers',
      'a1-professional-spanish', 'a2-professional-spanish',
      'a2-professional-chinese', 'a1-professional-chinese'
    ]
  }
];

const catNames = {};
categories.forEach(c => { catNames[c.id] = c.names; });

// Assign each subject to a category
const subjectCat = {};
categories.forEach(c => {
  c.subjects.forEach(s => { subjectCat[s] = c.id; });
});

// Create category groupings from actual subjects
const catGroups = {};
categories.forEach(c => { catGroups[c.id] = []; });

data.subjects.forEach(s => {
  const catId = subjectCat[s.n] || 'dev-tools'; // uncategorized go to dev-tools
  catGroups[catId].push(s);
});

data.categories = categories.map(c => ({
  id: c.id,
  names: c.names,
  count: catGroups[c.id].length
}));

data.subjectCategory = subjectCat;

const out = 'window.__curriculum = ' + JSON.stringify(data) + ';';
fs.writeFileSync(dataFile, out, 'utf8');

console.log('Categories created:');
categories.forEach(c => {
  const count = catGroups[c.id].length;
  console.log(`  ${c.names[0]} (${c.id}): ${count} subjects`);
});
