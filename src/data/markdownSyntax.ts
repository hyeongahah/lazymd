import { SyntaxItem } from '@/types/syntax';

export const markdownSyntax: SyntaxItem[] = [
  // 1. Basic Syntax - Headers
  {
    id: 'header1',
    nameKo: '제목 1',
    nameEn: 'Header Level 1',
    description: '가장 큰 제목을 표시할 때 사용합니다.',
    syntax: '# 제목',
    example: '# 큰 제목',
    result: '<h1>큰 제목</h1>',
    category: 'headers',
  },
  {
    id: 'header2',
    nameKo: '제목 2',
    nameEn: 'Header Level 2',
    description: '두 번째로 큰 제목을 표시할 때 사용합니다.',
    syntax: '## 제목',
    example: '## 중간 제목',
    result: '<h2>중간 제목</h2>',
    category: 'headers',
  },
  {
    id: 'header3',
    nameKo: '제목 3',
    nameEn: 'Header Level 3',
    description: '세 번째로 큰 제목을 표시할 때 사용합니다.',
    syntax: '### 제목',
    example: '### 작은 제목',
    result: '<h3>작은 제목</h3>',
    category: 'headers',
  },
  {
    id: 'header4',
    nameKo: '제목 4',
    nameEn: 'Header Level 4',
    description: '네 번째로 큰 제목을 표시할 때 사용합니다.',
    syntax: '#### 제목',
    example: '#### 더 작은 제목',
    result: '<h4>더 작은 제목</h4>',
    category: 'headers',
  },
  {
    id: 'header5',
    nameKo: '제목 5',
    nameEn: 'Header Level 5',
    description: '다섯 번째로 큰 제목을 표시할 때 사용합니다.',
    syntax: '##### 제목',
    example: '##### 아주 작은 제목',
    result: '<h5>아주 작은 제목</h5>',
    category: 'headers',
  },
  {
    id: 'header6',
    nameKo: '제목 6',
    nameEn: 'Header Level 6',
    description: '가장 작은 제목을 표시할 때 사용합니다.',
    syntax: '###### 제목',
    example: '###### 가장 작은 제목',
    result: '<h6>가장 작은 제목</h6>',
    category: 'headers',
  },

  // Lists
  {
    id: 'unorderedList',
    nameKo: '순서 없는 목록',
    nameEn: 'Unordered List',
    description: '글머리 기호로 목록을 만듭니다.',
    syntax: '- 항목\n* 항목\n+ 항목',
    example: '- 첫 번째\n- 두 번째\n- 세 번째',
    result: '<ul><li>첫 번째</li><li>두 번째</li><li>세 번째</li></ul>',
    category: 'lists',
  },
  {
    id: 'orderedList',
    nameKo: '순서 있는 목록',
    nameEn: 'Ordered List',
    description: '숫자로 순서가 있는 목록을 만듭니다.',
    syntax: '1. 항목\n2. 항목\n3. 항목',
    example: '1. 첫 번째\n2. 두 번째\n3. 세 번째',
    result: '<ol><li>첫 번째</li><li>두 번째</li><li>세 번째</li></ol>',
    category: 'lists',
  },
  {
    id: 'taskList',
    nameKo: '할 일 목록',
    nameEn: 'Task List',
    description: '체크박스가 있는 할 일 목록을 만듭니다.',
    syntax: '- [ ] 미완료\n- [x] 완료',
    example: '- [ ] 할 일 1\n- [x] 완료된 일',
    result: '<ul class="task-list"><li>☐ 할 일 1</li><li>☑ 완료된 일</li></ul>',
    category: 'lists',
  },

  // Text Styling
  {
    id: 'bold',
    nameKo: '굵은 글씨',
    nameEn: 'Bold Text',
    description: '텍스트를 굵게 표시합니다.',
    syntax: '**텍스트** 또는 __텍스트__',
    example: '이것은 **굵은** 글씨입니다.',
    result: '이것은 <strong>굵은</strong> 글씨입니다.',
    category: 'emphasis',
  },
  {
    id: 'italic',
    nameKo: '기울임꼴',
    nameEn: 'Italic Text',
    description: '텍스트를 기울여 표시합니다.',
    syntax: '*텍스트* 또는 _텍스트_',
    example: '이것은 *기울어진* 글씨입니다.',
    result: '이것은 <em>기울어진</em> 글씨입니다.',
    category: 'emphasis',
  },
  {
    id: 'strikethrough',
    nameKo: '취소선',
    nameEn: 'Strikethrough',
    description: '텍스트에 취소선을 표시합니다.',
    syntax: '~~텍스트~~',
    example: '이것은 ~~취소된~~ 글씨입니다.',
    result: '이것은 <del>취소된</del> 글씨입니다.',
    category: 'emphasis',
  },
  {
    id: 'inlineCode',
    nameKo: '인라인 코드',
    nameEn: 'Inline Code',
    description: '문장 안에 코드를 표시합니다.',
    syntax: '`코드`',
    example: '이것은 `인라인 코드` 입니다.',
    result: '이것은 <code>인라인 코드</code> 입니다.',
    category: 'code',
  },

  // Links and Images
  {
    id: 'inlineLink',
    nameKo: '인라인 링크',
    nameEn: 'Inline Link',
    description: '텍스트에 링크를 추가합니다.',
    syntax: '[텍스트](URL)',
    example: '[구글로 가기](https://google.com)',
    result: '<a href="https://google.com">구글로 가기</a>',
    category: 'links',
  },
  {
    id: 'urlLink',
    nameKo: 'URL 링크',
    nameEn: 'URL Link',
    description: 'URL을 직접 링크로 표시합니다.',
    syntax: '<URL>',
    example: '<https://google.com>',
    result: '<a href="https://google.com">https://google.com</a>',
    category: 'links',
  },
  {
    id: 'image',
    nameKo: '이미지',
    nameEn: 'Inline Image',
    description: '이미지를 삽입합니다.',
    syntax: '![대체 텍스트](이미지 URL)',
    example: '![로고](logo.png)',
    result: '<img src="logo.png" alt="로고">',
    category: 'images',
  },

  // Block Elements
  {
    id: 'blockquote',
    nameKo: '인용문',
    nameEn: 'Blockquote',
    description: '다른 텍스트를 인용할 때 사용합니다.',
    syntax: '> 인용문',
    example: '> 이것은 인용문입니다.',
    result: '<blockquote>이것은 인용문입니다.</blockquote>',
    category: 'blocks',
  },

  // Code Blocks
  {
    id: 'codeBlock',
    nameKo: '코드 블록',
    nameEn: 'Fenced Code Block',
    description: '여러 줄의 코드를 표시합니다.',
    syntax: '```\n코드\n```',
    example: '```\nconst x = 10;\nconsole.log(x);\n```',
    result: '<pre><code>const x = 10;\nconsole.log(x);</code></pre>',
    category: 'code',
  },
  {
    id: 'languageCodeBlock',
    nameKo: '언어별 코드 블록',
    nameEn: 'Language-Specific Code Block',
    description: '특정 프로그래밍 언어의 문법 강조를 적용합니다.',
    syntax: '```언어\n코드\n```',
    example: '```javascript\nconst x = 10;\nconsole.log(x);\n```',
    result:
      '<pre><code class="language-javascript">const x = 10;\nconsole.log(x);</code></pre>',
    category: 'code',
  },

  // Tables
  {
    id: 'table',
    nameKo: '테이블',
    nameEn: 'Basic Table',
    description: '표를 만듭니다.',
    syntax: '| 제목1 | 제목2 |\n|--------|--------|\n| 내용1 | 내용2 |',
    example: '| 이름 | 나이 |\n|------|------|\n| 홍길동 | 20 |',
    result:
      '<table><thead><tr><th>이름</th><th>나이</th></tr></thead><tbody><tr><td>홍길동</td><td>20</td></tr></tbody></table>',
    category: 'tables',
  },

  // Miscellaneous Features
  {
    id: 'highlight',
    nameKo: '형광펜(하이라이트)',
    nameEn: 'Highlight Text',
    description: '텍스트에 형광펜 효과를 줍니다.',
    syntax: '==텍스트==',
    example: '이것은 ==중요한== 내용입니다.',
    result: '이것은 <mark>중요한</mark> 내용입니다.',
    category: 'emphasis',
  },
  {
    id: 'checkbox',
    nameKo: '체크박스',
    nameEn: 'Checkbox',
    description: '체크박스를 만듭니다.',
    syntax: '[x] 또는 [ ]',
    example: '[x] 완료\n[ ] 미완료',
    result: '☑ 완료<br>☐ 미완료',
    category: 'interactive',
  },
  {
    id: 'escape',
    nameKo: '특수문자 표시',
    nameEn: 'Escape Characters',
    description: '마크다운 문법에 사용되는 특수문자를 그대로 표시합니다.',
    syntax: '\\특수문자',
    example: '\\* \\# \\[',
    result: '* # [',
    category: 'misc',
  },

  // Advanced Features
  {
    id: 'footnote',
    nameKo: '각주',
    nameEn: 'Footnotes',
    description: '텍스트에 각주를 추가합니다.',
    syntax: '텍스트[^1]\n\n[^1]: 각주 내용',
    example: '각주가 있는 텍스트[^1]\n\n[^1]: 이것은 각주입니다.',
    result:
      '각주가 있는 텍스트<sup>1</sup><br><br><small>[1]: 이것은 각주입니다.</small>',
    category: 'advanced',
  },
  {
    id: 'definition',
    nameKo: '정의 목록',
    nameEn: 'Definition List',
    description: '용어와 그 정의를 나열합니다.',
    syntax: '용어\n: 정의',
    example: '마크다운\n: 텍스트 서식 문법',
    result: '<dl><dt>마크다운</dt><dd>텍스트 서식 문법</dd></dl>',
    category: 'advanced',
  },
  {
    id: 'mermaid',
    nameKo: '머메이드 다이어그램',
    nameEn: 'Mermaid.js Diagram',
    description: '다이어그램을 그립니다.',
    syntax: '```mermaid\ngraph TD;\nA-->B;\n```',
    example: '```mermaid\ngraph TD;\nA-->B;\n```',
    result: '[다이어그램 렌더링]',
    category: 'diagrams',
  },
  {
    id: 'customStyle',
    nameKo: '사용자 정의 스타일',
    nameEn: 'Custom Styling',
    description: 'HTML과 CSS를 사용하여 스타일을 적용합니다.',
    syntax: '<span style="속성:값;">텍스트</span>',
    example: '<span style="color:red;">빨간 텍스트</span>',
    result: '<span style="color:red;">빨간 텍스트</span>',
    category: 'styling',
  },

  // Optional Enhancements
  {
    id: 'inlineMath',
    nameKo: '인라인 수식',
    nameEn: 'Inline Math',
    description: '문장 안에 수학 수식을 표시합니다.',
    syntax: '$수식$',
    example: '질량-에너지 등가식: $E=mc^2$',
    result: '질량-에너지 등가식: [수식 렌더링]',
    category: 'math',
  },
  {
    id: 'blockMath',
    nameKo: '수식 블록',
    nameEn: 'Block Math',
    description: '별도의 블록으로 수학 수식을 표시합니다.',
    syntax: '$$\n수식\n$$',
    example: '$$\nE=mc^2\n$$',
    result: '[수식 블록 렌더링]',
    category: 'math',
  },
  {
    id: 'graphviz',
    nameKo: '그래프비즈 차트',
    nameEn: 'Graphviz Chart',
    description: '그래프비즈를 사용하여 다이어그램을 그립니다.',
    syntax: '```dot\ndigraph {\nA -> B;\n}\n```',
    example: '```dot\ndigraph {\nA -> B;\n}\n```',
    result: '[그래프 렌더링]',
    category: 'diagrams',
  },
];

// 검색 함수
export const searchSyntax = (query: string): SyntaxItem[] => {
  const lowerQuery = query.toLowerCase().trim();

  return markdownSyntax.filter(
    (item) =>
      item.nameKo.includes(query) || // 한글 이름 검색
      item.nameEn.toLowerCase().includes(lowerQuery) || // 영문 이름 검색 (대소문자 구분 없음)
      item.description.includes(query) // 설명 검색
  );
};
