#!/usr/bin/env node
/**
 * 내 직업은(직업 찾기) 정적 페이지 생성기
 * 사용법: node build.js  →  dist/{slug}/index.html × 37 + sitemap.xml + robots.txt + 앱 본체
 * 데이터: 같은 폴더의 index.html에서 `const JOBS = [...]` 자동 추출
 */
const fs = require("fs");
const path = require("path");

/* ── 설정 ── */
const SITE = "https://findjob.onlyonecorpceo.workers.dev";
const GA_ID = "G-3HBMETX75L";
const HUB = "https://main.onlyonecorpceo.workers.dev";
const EMAIL = "onlyonecorpceo@gmail.com";
const AMAZON_TAG = "onlyone0c-20";
const COUPANG_BASE = "https://link.coupang.com/a/eTTucSskAC";
const INDEX = path.join(__dirname, "index.html");

/* ── index.html에서 JOBS 추출 ── */
const src = fs.readFileSync(INDEX, "utf8");
const m = src.match(/const JOBS = (\[[\s\S]*?\n\]);/);
if (!m) { console.error("❌ index.html에서 JOBS 블록을 찾지 못했습니다."); process.exit(1); }
const bk = (ko, en, q) => ({ ko, en, q });
const JOBS = eval("(" + m[1] + ")");

/* ── 성향 라벨 ── */
const TRAITS = {
  visual:{ko:"시각 감각",en:"Visual sense"}, creative:{ko:"창의성",en:"Creativity"},
  tech:{ko:"기술 친화",en:"Tech affinity"}, detail:{ko:"꼼꼼함",en:"Attention to detail"},
  analytical:{ko:"분석력",en:"Analytical thinking"}, numbers:{ko:"숫자 감각",en:"Numeracy"},
  leadership:{ko:"리더십",en:"Leadership"}, business:{ko:"사업 감각",en:"Business sense"},
  social:{ko:"사교성",en:"People skills"}, words:{ko:"언어 감각",en:"Way with words"},
  helping:{ko:"돕는 마음",en:"Desire to help"}, calm:{ko:"차분함",en:"Calm focus"},
  risk:{ko:"도전 정신",en:"Risk appetite"}, freedom:{ko:"자유로움",en:"Independence"},
  handson:{ko:"손재주",en:"Hands-on skill"}, body:{ko:"체력·활동성",en:"Physicality"},
  nature:{ko:"자연 친화",en:"Love of nature"}, structure:{ko:"체계성",en:"Organization"},
};

/* ── 직업별 설명 (37개, JOBS 순서와 무관하게 slug 키) ── */
const DESC = {
  "ux-ui-designer":{ko:"사람이 화면을 만나는 모든 순간을 설계하는 일. 예쁜 것을 넘어 '쓰기 편한 것'을 만드는 사람입니다.",en:"Designing every moment a person meets a screen — beyond pretty, toward effortless."},
  "software-engineer":{ko:"코드로 문제를 푸는 사람. 세상의 거의 모든 산업이 이들의 손을 거쳐 돌아갑니다.",en:"Solving problems with code — nearly every industry now runs through their hands."},
  "data-scientist":{ko:"데이터 속에서 패턴과 답을 찾아내는 탐정. 숫자로 미래를 예측하는 일에 가장 가깝습니다.",en:"A detective who finds patterns in data — the closest job to predicting the future with numbers."},
  "product-manager":{ko:"무엇을 만들지 결정하고 팀을 한 방향으로 모으는 사람. 기술·디자인·비즈니스의 교차점에 서 있습니다.",en:"Deciding what to build and aligning the team — standing where tech, design, and business meet."},
  "graphic-designer":{ko:"메시지에 형태를 입히는 사람. 포스터 한 장, 로고 하나로 브랜드의 인상을 결정합니다.",en:"Giving shape to a message — one poster or logo can define how a brand feels."},
  "copywriter":{ko:"한 줄로 마음을 움직이는 직업. 짧을수록 어렵고, 어려울수록 빛납니다.",en:"Moving hearts in a single line — the shorter it gets, the harder and brighter it shines."},
  "writer":{ko:"없던 세계를 문장으로 짓는 사람. 오래 앉아 있는 힘이 재능만큼 중요합니다.",en:"Building worlds that didn't exist, sentence by sentence. The power to stay seated matters as much as talent."},
  "journalist":{ko:"질문하는 것이 직업인 사람. 현장에서 사실을 확인하고 세상에 알립니다.",en:"Someone whose job is to ask questions — verifying facts on the ground and telling the world."},
  "teacher":{ko:"한 사람의 인생 방향을 바꿀 수 있는 몇 안 되는 직업. 지식보다 사람을 다루는 일에 가깝습니다.",en:"One of the few jobs that can change a life's direction — less about knowledge, more about people."},
  "nurse":{ko:"환자 곁에 가장 오래 머무는 의료인. 체력과 세심함, 침착함이 모두 필요한 일입니다.",en:"The medical professional who stays closest to patients — stamina, care, and calm, all at once."},
  "doctor":{ko:"사람의 몸과 생명을 다루는 일. 방대한 공부와 정확한 판단이 평생 이어집니다.",en:"Working with the human body and life itself — a lifetime of study and precise judgment."},
  "counselor-therapist":{ko:"말하지 못한 마음을 들어주는 사람. 듣는 기술이 곧 전문성입니다.",en:"Listening to what people couldn't say out loud — here, listening itself is the expertise."},
  "marketer":{ko:"제품과 사람 사이에 다리를 놓는 일. 데이터와 감각을 동시에 쓰는 몇 안 되는 직업입니다.",en:"Building the bridge between products and people — one of the few jobs using data and instinct at once."},
  "entrepreneur":{ko:"문제를 발견하면 회사를 만들어버리는 사람. 불확실성을 견디는 힘이 곧 자격입니다.",en:"Sees a problem, starts a company. The ability to endure uncertainty is the qualification."},
  "sales-professional":{ko:"신뢰를 파는 사람. 거절을 두려워하지 않는 마음이 가장 큰 자산입니다.",en:"Selling trust — fearlessness in the face of 'no' is the greatest asset."},
  "accountant":{ko:"숫자로 회사의 진실을 말하는 사람. 꼼꼼함이 곧 실력이자 신뢰입니다.",en:"Telling a company's truth in numbers — meticulousness is both skill and trust."},
  "financial-analyst":{ko:"시장을 읽고 가치를 계산하는 일. 숫자 뒤의 이야기를 볼 줄 알아야 합니다.",en:"Reading markets and calculating value — you must see the story behind the numbers."},
  "lawyer":{ko:"말과 논리로 싸우는 직업. 방대한 텍스트를 읽고 허점을 찾는 집요함이 핵심입니다.",en:"Fighting with words and logic — relentless reading and finding the gap is the core."},
  "architect":{ko:"사람이 살아갈 공간을 그리는 일. 예술과 공학이 한 도면 위에서 만납니다.",en:"Drawing the spaces people will live in — art and engineering meet on one blueprint."},
  "engineer":{ko:"이론을 현실로 옮기는 사람. 만들고, 부수고, 다시 만드는 과정을 즐겨야 합니다.",en:"Turning theory into reality — you have to enjoy building, breaking, and rebuilding."},
  "chef":{ko:"맛으로 기억을 만드는 직업. 창의력만큼 반복을 견디는 체력이 필요합니다.",en:"Creating memories through taste — needs stamina for repetition as much as creativity."},
  "photographer":{ko:"시간을 멈추는 사람. 같은 장면에서 남들이 못 보는 프레임을 찾아냅니다.",en:"Stopping time — finding the frame others miss in the very same scene."},
  "video-creator":{ko:"기획·촬영·편집·소통을 혼자 해내는 1인 방송국. 꾸준함이 알고리즘을 이깁니다.",en:"A one-person broadcast station — planning, shooting, editing, engaging. Consistency beats the algorithm."},
  "musician":{ko:"소리로 감정을 짓는 사람. 무대 위 3분을 위해 무대 밖에서 3년을 연습합니다.",en:"Building emotion out of sound — three years of practice for three minutes on stage."},
  "performer":{ko:"다른 사람의 인생을 대신 살아보는 직업. 무대 공포보다 무대 갈증이 큰 사람에게 어울립니다.",en:"Living other people's lives for a living — for those who crave the stage more than they fear it."},
  "athlete-trainer":{ko:"몸이 곧 도구이자 작품인 직업. 재능 위에 쌓는 성실함이 커리어를 결정합니다.",en:"The body is both tool and work of art — discipline stacked on talent decides the career."},
  "veterinarian":{ko:"말 못 하는 환자를 진료하는 의사. 동물과 보호자 모두를 상대하는 소통 능력이 필요합니다.",en:"A doctor whose patients can't speak — communicating with both animals and their humans."},
  "environmental-scientist":{ko:"지구의 상태를 진단하는 사람. 현장 조사와 데이터 분석을 오가는 일입니다.",en:"Diagnosing the planet's health — moving between fieldwork and data analysis."},
  "farmer-gardener":{ko:"계절과 함께 일하는 직업. 기다림을 견디는 사람에게 땅은 정직하게 보답합니다.",en:"Working with the seasons — the land repays honestly those who can wait."},
  "pilot":{ko:"수백 명의 안전을 책임지는 조종석. 침착함과 절차 준수가 생명입니다.",en:"A cockpit responsible for hundreds of lives — calm and procedure are everything."},
  "project-manager":{ko:"일정·사람·예산을 한 줄로 꿰는 사람. 혼돈을 질서로 바꾸는 게 일입니다.",en:"Threading schedule, people, and budget into one line — turning chaos into order."},
  "hr-specialist":{ko:"회사에서 사람 문제를 다루는 전문가. 채용부터 성장까지, 조직의 온도를 관리합니다.",en:"The company's people expert — from hiring to growth, managing the organization's temperature."},
  "scientist-researcher":{ko:"세상에 없던 답을 찾는 사람. 99번의 실패를 견디면 1번의 발견이 옵니다.",en:"Finding answers that don't exist yet — endure 99 failures and the discovery comes."},
  "game-developer":{ko:"재미를 설계하는 엔지니어. 기술과 예술이 가장 가깝게 만나는 분야입니다.",en:"An engineer of fun — where technology and art meet closest."},
  "illustrator":{ko:"글이 못 전하는 것을 그림 한 장으로 전하는 사람. 자기만의 스타일이 곧 명함입니다.",en:"Saying in one drawing what words can't — your style is your business card."},
  "translator-interpreter":{ko:"언어와 언어 사이의 다리. 두 문화를 모두 깊게 이해해야 가능한 일입니다.",en:"A bridge between languages — possible only with deep understanding of both cultures."},
  "social-worker":{ko:"제도와 사람 사이의 틈을 메우는 직업. 현장에서 가장 필요한 것은 지치지 않는 마음입니다.",en:"Filling the gap between systems and people — what the field needs most is a heart that doesn't burn out."},
};

/* ── 유틸 ── */
const slugify = en => en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

/* ── 페이지 템플릿 ── */
function pageHtml(job, slug, siblings) {
  const d = DESC[slug] || { ko: "", en: "" };
  const traits = Object.entries(job.t).sort((a, b) => b[1] - a[1]);
  const topKo = traits.slice(0, 2).map(([k]) => TRAITS[k].ko).join("과 ");
  const topEn = traits.slice(0, 2).map(([k]) => TRAITS[k].en.toLowerCase()).join(" and ");
  const titleKo = `${job.ko} 적성·어울리는 성격 총정리`;
  const desc = `${job.ko}에게 필요한 핵심 성향은 ${topKo}. 나와 맞는지 30초 테스트로 확인해보세요.`;

  const chips = traits.map(([k, w]) =>
    `<div class="chip"><span data-ko>${TRAITS[k].ko}</span><span data-en class="hidden">${TRAITS[k].en}</span><b>${"★".repeat(w)}</b></div>`).join("");
  const sibLinks = siblings.map(s =>
    `<a href="/${s.slug}/"><span data-ko>${s.ko}</span><span data-en class="hidden">${s.en}</span></a>`).join("");
  const amz = `https://www.amazon.com/s?k=${encodeURIComponent(job.book.en)}&tag=${AMAZON_TAG}`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titleKo} | OnlyOne 직업 찾기</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${SITE}/${slug}/">
<meta property="og:title" content="${titleKo} | OnlyOne 직업 찾기">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${SITE}/${slug}/">
<meta property="og:type" content="article">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});</script>
<style>
:root{--ink:#1d1d1f;--muted:#6e6e73;--line:rgba(0,0,0,.10);--surface:#fff;--bg:#f5f5f7}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Pretendard,-apple-system,sans-serif;background:var(--bg);color:var(--ink);line-height:1.7;-webkit-font-smoothing:antialiased}
.wrap{max-width:640px;margin:0 auto;padding:24px 20px 60px}
header{display:flex;justify-content:space-between;align-items:center;padding:8px 0 32px}
.logo{display:flex;align-items:center;gap:8px;text-decoration:none;color:var(--ink);font-weight:700;font-size:15px}
.lang-btn{border:1px solid var(--line);background:var(--surface);border-radius:99px;padding:6px 14px;font-size:13px;cursor:pointer;color:var(--ink);font-family:inherit}
h1{font-size:27px;font-weight:800;letter-spacing:-.02em;line-height:1.3;margin-bottom:12px}
.lede{font-size:16px;color:var(--muted);margin-bottom:28px}
h2{font-size:19px;font-weight:700;margin:32px 0 12px;letter-spacing:-.01em}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{background:var(--surface);border:1px solid var(--line);border-radius:99px;padding:8px 16px;font-size:14px;display:flex;gap:8px;align-items:center}
.chip b{color:#c9a227;font-size:12px;letter-spacing:1px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:20px;margin-top:12px}
.card .bt{font-weight:700;font-size:15px;margin-bottom:4px}
.card .bs{font-size:13px;color:var(--muted);margin-bottom:14px}
.shop{display:inline-block;border:1px solid var(--line);border-radius:99px;padding:8px 18px;font-size:13px;text-decoration:none;color:var(--ink);font-weight:600}
p{font-size:15px;margin-bottom:14px}
.cta{display:block;text-align:center;background:var(--ink);color:#fff;text-decoration:none;border-radius:14px;padding:16px;font-weight:700;font-size:16px;margin:32px 0 10px;transition:opacity .15s}
.cta:hover{opacity:.85}
.cta-sub{text-align:center;font-size:13px;color:var(--muted)}
.sibs{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.sibs a{border:1px solid var(--line);background:var(--surface);border-radius:99px;padding:7px 14px;font-size:13px;text-decoration:none;color:var(--ink)}
footer{margin-top:48px;padding-top:24px;border-top:1px solid var(--line);font-size:12px;color:#a1a1a6;text-align:center;line-height:2}
footer a{color:#a1a1a6}
.disc{font-size:11px;color:#b6b6bb;margin-top:8px}
.hidden{display:none}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <a class="logo" href="${HUB}" aria-label="OnlyOne">
      <svg width="20" height="26" viewBox="0 0 20 26" fill="none"><circle cx="10" cy="8" r="6.5" stroke="#1d1d1f" stroke-width="3"/><rect x="8.5" y="14" width="3" height="10" rx="1.5" fill="#1d1d1f"/></svg>
      OnlyOne
    </a>
    <button class="lang-btn" onclick="toggleLang()"><span data-ko>EN</span><span data-en class="hidden">한국어</span></button>
  </header>

  <article>
    <h1><span data-ko>${job.ko}, 나랑 맞을까?</span><span data-en class="hidden">${esc(job.en)} — is it you?</span></h1>
    <p class="lede"><span data-ko>${d.ko}</span><span data-en class="hidden">${d.en}</span></p>

    <h2><span data-ko>이 직업과 잘 맞는 성향</span><span data-en class="hidden">Traits that fit this job</span></h2>
    <div class="chips">${chips}</div>
    <p style="margin-top:14px"><span data-ko>특히 ${topKo}이 강한 사람이 이 일에서 빠르게 성장하는 편입니다. 물론 성향은 출발점일 뿐 — 부족한 별은 일하면서 채워집니다.</span><span data-en class="hidden">People strong in ${topEn} tend to grow fastest here. Traits are a starting point, though — missing stars get filled on the job.</span></p>

    <h2><span data-ko>입문 추천 도서</span><span data-en class="hidden">A book to start with</span></h2>
    <div class="card">
      <div class="bt"><span data-ko>${job.book.ko}</span><span data-en class="hidden">${esc(job.book.en)}</span></div>
      <div class="bs"><span data-ko>${job.ko}의 세계를 먼저 책으로 만나보세요.</span><span data-en class="hidden">Meet the world of this job on paper first.</span></div>
      <a class="shop" data-ko href="${COUPANG_BASE}" target="_blank" rel="noopener sponsored">쿠팡에서 찾아보기</a>
      <a class="shop hidden" data-en href="${amz}" target="_blank" rel="noopener sponsored">Find on Amazon</a>
    </div>

    <a class="cta" href="${SITE}/?utm_source=seo&utm_medium=static&utm_campaign=${slug}">
      <span data-ko>🔍 30초 테스트로 내 직업 찾기</span><span data-en class="hidden">🔍 Find your job in a 30-second test</span>
    </a>
    <p class="cta-sub"><span data-ko>끌리는 것만 고르면 어울리는 직업이 나와요 · 결과 공유 가능</span><span data-en class="hidden">Just pick what pulls you in · shareable result</span></p>

    <h2><span data-ko>다른 직업도 살펴보기</span><span data-en class="hidden">Explore other jobs</span></h2>
    <div class="sibs">${sibLinks}</div>
  </article>

  <footer>
    <a href="${HUB}">OnlyOne — For a Happy Day</a><br>
    Contact: <a href="mailto:${EMAIL}">${EMAIL}</a>
    <div class="disc"><span data-ko>이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</span><span data-en class="hidden">As an Amazon Associate, OnlyOne earns from qualifying purchases.</span></div>
  </footer>
</div>

<div id="consent" style="display:none;position:fixed;bottom:16px;left:16px;right:16px;max-width:480px;margin:0 auto;background:#fff;border:1px solid var(--line);border-radius:16px;padding:18px 20px;box-shadow:0 8px 30px rgba(0,0,0,.08);font-size:13px;z-index:99">
  <p style="margin-bottom:12px;font-size:13px"><span data-ko>방문 통계를 위해 Google Analytics 쿠키를 사용해도 될까요? 거부해도 그대로 이용할 수 있어요.</span><span data-en class="hidden">May we use Google Analytics cookies for visit stats? You can decline and still use everything.</span></p>
  <div style="display:flex;gap:8px;justify-content:flex-end">
    <button onclick="consent(false)" style="border:1px solid var(--line);background:#fff;border-radius:99px;padding:8px 16px;cursor:pointer;font-family:inherit;font-size:13px;color:var(--ink)"><span data-ko>거부</span><span data-en class="hidden">Decline</span></button>
    <button onclick="consent(true)" style="border:none;background:var(--ink);color:#fff;border-radius:99px;padding:8px 18px;cursor:pointer;font-family:inherit;font-size:13px;font-weight:600"><span data-ko>동의</span><span data-en class="hidden">Accept</span></button>
  </div>
</div>

<script>
function applyLang(l){
  document.querySelectorAll('[data-ko]').forEach(e=>e.classList.toggle('hidden',l==='en'));
  document.querySelectorAll('[data-en]').forEach(e=>e.classList.toggle('hidden',l!=='en'));
  document.documentElement.lang=l==='en'?'en':'ko';
}
function toggleLang(){
  const l=(localStorage.getItem('oo_lang')==='en')?'ko':'en';
  localStorage.setItem('oo_lang',l);applyLang(l);
}
applyLang(localStorage.getItem('oo_lang')||(navigator.language.startsWith('en')?'en':'ko'));

const EEA=['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'];
function grant(){gtag('consent','update',{analytics_storage:'granted'})}
function consent(ok){
  localStorage.setItem('oo_consent',ok?'granted':'denied');
  if(ok)grant();
  document.getElementById('consent').style.display='none';
}
(function(){
  const saved=localStorage.getItem('oo_consent');
  if(saved==='granted'){grant();return}
  if(saved==='denied')return;
  const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';
  const isEU=/Europe\\//.test(tz)||EEA.includes((navigator.language.split('-')[1]||'').toUpperCase());
  if(isEU){document.getElementById('consent').style.display='block'}
  else{localStorage.setItem('oo_consent','granted');grant()}
})();
</script>
</body>
</html>`;
}

/* ── 빌드 ── */
const DIST = path.join(__dirname, "dist");
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

const jobs = JOBS.map(j => ({ ...j, slug: slugify(j.en) }));
const urls = [];
let missing = [];
jobs.forEach((job, i) => {
  if (!DESC[job.slug]) missing.push(job.slug);
  // 내부링크: 리스트에서 다음 8개 (순환) — 37페이지 전체가 서로 연결됨
  const siblings = Array.from({ length: 8 }, (_, k) => jobs[(i + k + 1) % jobs.length]);
  const dir = path.join(DIST, job.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), pageHtml(job, job.slug, siblings));
  urls.push(`${SITE}/${job.slug}/`);
});

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(DIST, "sitemap.xml"),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[SITE + "/", ...urls].map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>`);
fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
fs.copyFileSync(INDEX, path.join(DIST, "index.html"));

console.log(`✅ ${jobs.length}개 페이지 + sitemap.xml + robots.txt + 앱 본체 → dist/`);
if (missing.length) console.warn(`⚠️ 설명 누락: ${missing.join(", ")}`);
