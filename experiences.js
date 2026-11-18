'use strict';

// Comparison data is independent of index.html. No choices or votes are saved here.
const copy = {
  en: {
    skip: 'Skip to comparison', back: '← Back to the itinerary', kicker: 'JAPAN · APRIL 2027 · FOR DISCUSSION',
    title: 'Experience comparison',
    intro: 'Explore the trade-offs together. These alternatives are unselected and do not change the current itinerary, bookings, budget or recommendations.',
    caution: 'Current plan means included in the guide, not booked. Origin labels record who proposed an option, not an endorsement or a ranking of authenticity. April 2027 availability is unconfirmed for every candidate.',
    current: 'Current plan (ChatGPT)', traveler: 'Suggested by travelers (wife/user)', researched: 'New ChatGPT-researched alternative',
    currentStatus: 'In the current guide · booking unconfirmed', alternativeStatus: 'For comparison only · unselected',
    different: 'Different type of experience', pros: 'Pros', cons: 'Cons / limitations', fit: 'Fit / what to verify',
    provider: 'Official provider / source ↗', listing: 'Klook listing / source ↗',
    checked: 'Sources checked November 17, 2026 (Los Angeles). Provider descriptions are starting points for discussion, not confirmed April 2027 offers. No authenticity scores are assigned.',
    sourceDate: 'Source checked: 2026-11-17 · 2027 availability unconfirmed',
    answerNav: 'How to reply', answerKicker: 'SEND A SHORT LIST', answerTitle: 'Share your choices by message',
    answerIntro: 'Send question numbers or category names with a letter, for example Q1 = B or Sushi class = B. Use ? if undecided. These are experience choices, separate from trip Option A/B.',
    answerHint: 'Reply template — replace each blank with a letter or ?:',
    replyWith: 'Reply with', undecided: '? = undecided',
    languageLabel: 'Comparison language', navLabel: 'Comparison categories'
  },
  zh: {
    skip: '跳至体验比较', back: '← 返回原行程', kicker: '日本 · 2027年4月 · 讨论参考',
    title: '体验比较',
    intro: '一起比较各个选择的取舍。以下备选项目均未选定，不会改变原行程、预订、预算或建议。',
    caution: '“当前计划”仅表示已列入原指南，并非已预订。来源标签说明由谁提出，并不代表背书，也不是“正宗程度”排名。所有项目的2027年4月名额均未确认。',
    current: '当前计划（ChatGPT）', traveler: '旅行者提出（妻子／用户）', researched: 'ChatGPT 新研究的备选',
    currentStatus: '已列入原指南 · 预订未确认', alternativeStatus: '仅供比较 · 尚未选定',
    different: '不同类型的体验', pros: '优点', cons: '缺点／限制', fit: '适合方向／待核实事项',
    provider: '官方主办方／资料 ↗', listing: 'Klook 活动页面／资料 ↗',
    checked: '资料核查日期：2026年11月17日（洛杉矶时间）。主办方介绍仅供讨论，不代表2027年4月的实际供应情况。本页不对“正宗程度”评分。',
    sourceDate: '资料核查：2026-11-17 · 2027年名额未确认',
    answerNav: '如何回复', answerKicker: '发送简短答案', answerTitle: '通过消息分享你的选择',
    answerIntro: '发送题号或类别名称加选项字母，例如 Q1 = B 或 寿司课 = B。尚未决定可填 ?。这里的字母代表体验选项，与旅行方案 A／B 无关。',
    answerHint: '回复模板——将空白替换为选项字母或 ?：',
    replyWith: '回复格式', undecided: '? = 尚未决定',
    languageLabel: '比较页面语言', navLabel: '体验比较类别'
  }
};

// Each candidate has bilingual name, pros, cons and a cautious fit assessment.
const categories = [
  {
    id: 'tea', question: 'Q1', title: ['Tea ceremony', '茶道'],
    intro: ['Compare a short Kyoto introduction with Uji-based alternatives. A traditional setting does not by itself establish teaching depth or host credentials.', '比较京都的简短入门茶道与宇治的备选体验。传统环境本身不能证明讲解深度或主持者资历。'],
    candidates: [
      { id: 'camellia', option: 'A', origin: 'current', name: ['Camellia Flower', 'Camellia Flower 茶屋'], url: 'https://tea-kyoto.com/flower-general-information',
        pros: ['English-friendly introduction in a convenient Kyoto location.', '英语友好，位于京都，交通方便，适合初次接触茶道。'],
        cons: ['Around 45 minutes; an introductory visitor format rather than extended study. Upstairs tea rooms may require access arrangements.', '约45分钟，属于面向游客的入门体验，并非深入学习。楼上茶室可能需要提前安排无障碍通行。'],
        fit: ['Retain as the current reference for a simple introduction; verify April dates and access needs.', '作为原计划中简便入门体验的比较基准；核实4月日期及通行需求。'] },
      { id: 'tokaan', option: 'B', origin: 'traveler', name: ['Tōka-an', 'Tōka-an 桃花庵'], url: 'https://tokaan.net/',
        pros: ['Reservation-based small-group Uji cultural experience; advertised premium tea and private-session atmosphere may suit an anniversary.', '宇治的小团预约制文化体验；宣传中的优质茶品与私享氛围可能适合周年纪念。'],
        cons: ['Potentially higher cost. Tea-school credentials, exact private program, language and April 2027 availability need verification.', '费用可能较高。茶道流派资历、具体私享项目、语言服务及2027年4月名额均待核实。'],
        fit: ['A traveler-suggested option to investigate for depth and occasion; confirm the host and inclusions directly.', '旅行者提出、可进一步了解深度与纪念氛围的选项；向主办方核实主持者与所含内容。'] },
      { id: 'taihoan', option: 'C', origin: 'traveler', name: ['Taihoan', 'Taihoan 对凤庵'], url: 'https://kyoto-uji-kankou.or.jp/taihoan-en.html',
        pros: ['Municipal Uji tea house with traditional tea service and a comparatively modest entry option.', '宇治市营茶室，提供传统茶礼，并有相对实惠的入门选择。'],
        cons: ['Spoken English support and explanatory depth are uncertain; the experience varies by tea-service option.', '英语口头服务与讲解深度尚不确定；体验内容取决于所选茶礼项目。'],
        fit: ['Consider for a traditional municipal setting and value, after checking language and reservation requirements.', '若重视市营传统茶室环境与性价比，可在核实语言及预约要求后考虑。'] }
    ]
  },
  {
    id: 'matcha', question: 'Q2', title: ['Matcha & tea production', '抹茶与制茶'],
    intro: ['Stone-milling prepared tea leaves is not a complete fresh-leaf-to-matcha production process. The CHA Park source describes sencha production, a different tea process.', '将已加工茶叶石磨成粉，不等于完整的鲜叶到抹茶生产过程。CHA 游学公园的资料介绍的是煎茶制作，属于另一种制茶工艺。'],
    candidates: [
      { id: 'komurasaki', option: 'A', origin: 'current', name: ['Komurasaki An', 'Komurasaki An 小紫庵'], url: 'https://tea-komurasaki.com/',
        pros: ['Private, English-guided stone-milling and tea preparation in Arashiyama, as described in the current guide.', '原指南描述为岚山的私享英语指导石磨与泡茶体验。'],
        cons: ['Focuses on grinding and preparation, with limited coverage of the full production chain.', '重点在研磨与冲泡，完整生产链的覆盖有限。'],
        fit: ['The current reference for a focused matcha workshop; reconfirm the private format and English session.', '作为原计划中专注抹茶的工作坊基准；再次确认私享形式与英语场次。'] },
      { id: 'fukujuen-uji', option: 'B', origin: 'traveler', name: ['Fukujuen Uji Kobo', '福寿园宇治工房'], url: 'https://experience.fukujuen.com/en/modelcourse/ujikoubou-stone-mill/',
        pros: ['Established tea specialist; stone-milling plus museum displays can add context about processing.', '专业茶商提供石磨体验，结合馆内展示，可了解更多加工背景。'],
        cons: ['Introductory milling does not cover full fresh-leaf-to-powder production. Verify English instruction and dates.', '入门研磨并不涵盖完整的鲜叶到茶粉制作。需核实英语指导与日期。'],
        fit: ['A traveler-suggested Uji comparison for milling and tea knowledge; check the workshop separately from museum access.', '旅行者提出的宇治研磨与茶知识备选；需分别核实工作坊及参观安排。'] },
      { id: 'fukujuen-cha', option: 'C', origin: 'researched', name: ['Fukujuen CHA Experience Park', '福寿园 CHA 游学公园'], url: 'https://experience.fukujuen.com/en/modelcourse/cha-machine-made-tea/',
        pros: ['The official mechanical tea-making course covers several sencha-processing stages and offers broader production education.', '官方机械制茶课程涵盖多个煎茶加工阶段，可提供更广泛的生产知识。'],
        cons: ['Located in Kizugawa, with additional transport and a longer session. Steaming is explained, not performed; this is not full matcha production.', '位于木津川市，需要额外交通与较长时间。蒸青仅讲解，不实际操作；并非完整抹茶生产。'],
        fit: ['Investigate only if production education is a priority. Confirm seasonality, English support, transport and April availability before any itinerary discussion.', '仅在重视生产知识时进一步了解；在讨论调整行程前，核实季节、英语支持、交通及4月名额。'] }
    ]
  },
  {
    id: 'sushi', question: 'Q3', title: ['Sushi class', '寿司课'],
    intro: ['Compare the actual skills taught. A professional instructor does not guarantee fish slicing or hands-on knife work.', '比较实际教授的技能。由专业厨师指导，并不保证包含鱼片切制或亲自用刀。'],
    candidates: [
      { id: 'atelier', option: 'A', origin: 'current', name: ['Atelier SUSHI', 'Atelier SUSHI 寿司工坊'], url: 'https://www.atelierthe99sushi.com/',
        pros: ['Small English-led workshops in an intimate Kyoto setting, with attention to ingredients and sourcing.', '京都的小团英语工作坊，环境亲切，注重食材与来源。'],
        cons: ['Fish is typically prepared in advance in the comparison brief; confirm this directly. Extensive knife work is not established.', '比较资料描述鱼片通常提前处理；应直接核实。尚未确认包含深入用刀练习。'],
        fit: ['Keep as the current hands-on reference; ask about fish preparation and the exact class inclusions.', '作为原计划动手体验的比较基准；询问鱼类处理方式与课程所含内容。'] },
      { id: 'musubu', option: 'B', origin: 'researched', name: ['musubu · professional chef lesson', '结 musubu · 专业厨师课程'], url: 'https://www.klook.com/activity/150639-sushi-making-experience-with-a-professional-chef/', listing: true,
        pros: ['The Klook listing describes direct guidance from a professional sushi chef.', 'Klook 活动页面介绍由专业寿司厨师直接指导。'],
        cons: ['Exact operator, hands-on knife work, fish handling, instruction language and April availability still need confirmation.', '具体运营方、亲自用刀、鱼类处理、教学语言及4月名额仍需确认。'],
        fit: ['A research lead for chef interaction, not a confirmed skills upgrade. Obtain the detailed lesson plan first.', '可进一步了解厨师互动，但尚不能确认技能学习更深入；先获取详细教学内容。'] },
      { id: 'moon-back', option: 'C', origin: 'researched', name: ['MOON and BACK', 'MOON and BACK 寿司体验'], url: 'https://www.moonandbackkyoto.com/sushi-experience',
        pros: ['Advertises fish slicing, sushi-rice preparation and nigiri skills.', '宣传内容包含鱼片切制、寿司饭制作与握寿司技巧。'],
        cons: ['Around 60 minutes; a short introductory class with limited time for practice.', '约60分钟，属于简短入门课程，练习时间有限。'],
        fit: ['Worth comparing if fish slicing matters; verify who handles knives, English support and April dates.', '若重视切鱼片，可进一步比较；核实由谁用刀、英语支持及4月日期。'] }
    ]
  },
  {
    id: 'wagyu', question: 'Q4', title: ['Wagyu', '和牛'],
    intro: ['Choose what kind of experience to discuss: an anniversary dinner, watching a chef at a counter, or cooking yourselves. These serve different goals.', '先讨论想要的体验类型：周年晚餐、在吧台观看厨师，或自己动手烹饪。这些体验满足不同目标。'],
    candidates: [
      { id: 'kosa', option: 'A', origin: 'current', name: ['Kōsa', 'Kōsa 京都餐厅'], url: 'https://www.kosakyoto.com/',
        pros: ['Comfortable modern anniversary-dinner setting, with wagyu options on the published menu.', '现代舒适的周年晚餐环境，公开菜单列有和牛选择。'],
        cons: ['Less focused on a specialist chef counter; a dining experience rather than cooking instruction.', '较少聚焦专业厨师吧台体验；属于用餐，并非烹饪教学。'],
        fit: ['The current dinner reference remains unchanged; reconfirm the exact beef course and reservation details.', '原计划晚餐保持不变，作为比较基准；再次确认具体牛肉套餐与预约细节。'] },
      { id: 'mouriya', option: 'B', origin: 'researched', name: ['Mouriya Gion', 'Mouriya Gion 祇园莫利亚'], url: 'https://www.mouriya.co.jp/en/gion',
        pros: ['Kobe-beef specialist with counter seating and chef-led teppanyaki.', '专门经营神户牛肉，设有吧台座位，可观看厨师铁板烧。'],
        cons: ['Premium cost; guests watch and dine rather than cook hands-on.', '费用较高；客人观看与用餐，并非亲自烹饪。'],
        fit: ['Compare for chef-counter dining, not a cooking class. Confirm the chosen menu and April price.', '适合比较厨师吧台用餐，并非料理课；核实所选菜单与4月价格。'] },
      { id: 'misono', option: 'C', origin: 'researched', name: ['Steak Misono Kyoto', 'Steak Misono 京都御园'], url: 'https://misono.org/en/shop/kyoto/menu/',
        pros: ['Established teppanyaki tradition and an opportunity for chef interaction over a steak dinner.', '具有悠久铁板烧传统，可在牛排晚餐中与厨师互动。'],
        cons: ['A classical steak dinner rather than hands-on instruction.', '属于经典牛排晚餐，并非动手教学。'],
        fit: ['An alternative dining style to investigate; verify the exact course, counter seating and availability.', '可进一步了解的用餐风格备选；核实具体套餐、吧台座位与名额。'] },
      { id: 'green-cuisine', option: 'D', origin: 'researched', different: true, name: ['Kyoto Green Cuisine', 'Kyoto Green Cuisine 京都料理课'], url: 'https://www.kyotogreencuisine.jp/traditional-cooking-class-kyoto/',
        pros: ['Private hands-on cooking; the advertised menus include wagyu sushi.', '私享动手料理课；宣传菜单包含和牛寿司。'],
        cons: ['A different experience: not a premium wagyu steak dinner or a teppanyaki class. Menu details and dietary wording need clarification.', '属于不同体验：并非高级和牛牛排晚餐或铁板烧课。菜单细节与饮食说明需澄清。'],
        fit: ['Discuss only if cooking is the goal; confirm the wagyu menu, dietary requirements and language directly.', '仅在希望亲自烹饪时讨论；向主办方核实和牛菜单、饮食要求及教学语言。'] }
    ]
  }
];

let language = new URLSearchParams(window.location.search).get('lang') === 'zh' ? 'zh' : 'en';
const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};

function render() {
  const t = copy[language];
  const n = language === 'zh' ? 1 : 0;
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.title = t.title + ' · Japan 2027';
  document.querySelectorAll('[data-copy]').forEach(node => { node.textContent = t[node.dataset.copy]; });
  document.getElementById('language-control').setAttribute('aria-label', t.languageLabel);
  for (const code of ['en', 'zh']) document.getElementById('lang-' + code).setAttribute('aria-pressed', String(language === code));
  const nav = document.getElementById('category-nav');
  nav.setAttribute('aria-label', t.navLabel);
  nav.replaceChildren();
  const container = document.getElementById('comparisons');
  container.replaceChildren();
  for (const category of categories) {
    const jump = element('a', category.question + ' · ' + category.title[n]);
    jump.href = '#' + category.id;
    nav.append(jump);
    const section = element('section', undefined, 'category');
    section.id = category.id;
    section.setAttribute('aria-labelledby', category.id + '-title');
    const heading = element('h2', category.question + ' · ' + category.title[n]);
    heading.id = category.id + '-title';
    section.append(heading, element('p', category.intro[n], 'category-intro'));
    section.append(element('p', t.replyWith + ': ' + category.question + ' = ' + category.candidates.map(candidate => candidate.option).join(' / ') + ' / ' + t.undecided, 'reply-hint'));
    const cards = element('div', undefined, 'cards');
    for (const candidate of category.candidates) {
      const card = element('article', undefined, 'card ' + candidate.origin);
      card.dataset.candidate = candidate.id;
      card.dataset.option = candidate.option;
      card.append(element('p', category.question + ' = ' + candidate.option, 'option-code'));
      const chips = element('div', undefined, 'chips');
      chips.append(element('span', t[candidate.origin], 'chip ' + candidate.origin));
      if (candidate.different) chips.append(element('span', t.different, 'chip type'));
      card.append(chips, element('p', candidate.origin === 'current' ? t.currentStatus : t.alternativeStatus, 'status'), element('h3', candidate.option + ' · ' + candidate.name[n]));
      const details = element('dl');
      for (const key of ['pros', 'cons', 'fit']) details.append(element('dt', t[key]), element('dd', candidate[key][n]));
      const source = element('div', undefined, 'source');
      const link = element('a', candidate.listing ? t.listing : t.provider, 'resource');
      link.href = candidate.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', candidate.name[n] + ': ' + link.textContent);
      source.append(link, element('p', t.sourceDate, 'checked'));
      card.append(details, source);
      cards.append(card);
    }
    section.append(cards);
    container.append(section);
  }
  const answerJump = element('a', t.answerNav);
  answerJump.href = '#answers';
  nav.append(answerJump);
  document.getElementById('answer-template').textContent = categories.map(category => category.question + ' (' + category.title[n] + ') = ___').join('\n');
}

for (const code of ['en', 'zh']) {
  document.getElementById('lang-' + code).addEventListener('click', () => { language = code; render(); });
}
render();
