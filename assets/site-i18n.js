/* ============================================================
   MAHKOTA — trilingual content (中 / EN / BM) + interactions
   ============================================================ */
const TRI = {
  // nav
  nav_talents:{en:'Talents',zh:'签约艺人',ms:'Bakat'},
  nav_events:{en:'Events',zh:'活动门票',ms:'Acara'},
  nav_interact:{en:'Fan Zone',zh:'互动专区',ms:'Zon Peminat'},
  nav_about:{en:'About',zh:'关于我们',ms:'Tentang'},
  nav_news:{en:'News',zh:'最新动态',ms:'Berita'},
  cta_tickets:{en:'Buy Tickets',zh:'购票',ms:'Beli Tiket'},
  // hero
  hero_badge_role:{en:'Signed Driver',zh:'签约车手',ms:'Pemandu Kontrak'},
  hero_eyebrow:{en:'Talent · Motorsport · Entertainment',zh:'艺人经纪 · 赛车 · 娱乐活动',ms:'Bakat · Motorsport · Hiburan'},
  hero_h1:{en:'Where champions <em>become</em> icons.',zh:'让冠军<em>成为</em>传奇。',ms:'Di mana juara <em>menjadi</em> ikon.'},
  hero_sub:{en:'A Johor-born house representing drivers, athletes and stars — staging the events the region talks about.',
    zh:'源自柔佛的经纪公司,代理车手、运动员与明星,打造全城热议的活动现场。',
    ms:'Sebuah rumah dari Johor mewakili pemandu, atlet dan bintang — mementaskan acara yang diperkatakan rantau ini.'},
  hero_cta1:{en:'Meet our talents',zh:'认识我们的艺人',ms:'Kenali bakat kami'},
  hero_cta2:{en:'Upcoming events',zh:'近期活动',ms:'Acara akan datang'},
  hero_trust:{en:'Trusted by',zh:'合作伙伴',ms:'Dipercayai oleh'},
  // talents
  tal_eyebrow:{en:'Our Roster',zh:'我们的阵容',ms:'Senarai Kami'},
  tal_title:{en:'The <em>signed</em> talents.',zh:'签约<em>艺人</em>阵容。',ms:'Bakat <em>kontrak</em> kami.'},
  tal_desc:{en:'Racing drivers, performers and personalities we manage and represent across the region.',
    zh:'我们在区域内代理与经纪的赛车手、表演者与公众人物。',ms:'Pemandu lumba, penghibur dan personaliti yang kami uruskan di seluruh rantau.'},
  role_driver:{en:'Racing Driver',zh:'职业车手',ms:'Pemandu Lumba'},
  role_singer:{en:'Recording Artist',zh:'唱作歌手',ms:'Artis Rakaman'},
  role_host:{en:'Host & Presenter',zh:'主持人',ms:'Hos & Penyampai'},
  role_athlete:{en:'Pro Athlete',zh:'职业运动员',ms:'Atlet Profesional'},
  bio_1:{en:'Le Mans campaigner and GT3 podium regular flying the Johor flag on the world stage.',
    zh:'勒芒征战者、GT3 常客,在世界舞台为柔佛而战。',ms:'Pejuang Le Mans dan podium GT3 yang mengibarkan bendera Johor di pentas dunia.'},
  bio_2:{en:'Multi-platinum vocalist bridging Mandopop and Malay ballads to sold-out arenas.',
    zh:'多白金销量唱将,横跨华语流行与马来情歌,场场满座。',ms:'Vokalis multi-platinum merentas Mandopop dan balada Melayu ke arena penuh.'},
  bio_3:{en:'Pit-lane presenter and brand voice for marquee motorsport broadcasts.',
    zh:'维修区主持、顶级赛事转播的品牌之声。',ms:'Penyampai pit-lane dan suara jenama untuk siaran motorsport utama.'},
  bio_4:{en:'National karting graduate now contesting single-seater championships in Asia.',
    zh:'国家卡丁车出身,现征战亚洲方程式锦标赛。',ms:'Lepasan karting kebangsaan kini bertanding kejuaraan kereta lumba di Asia.'},
  // events
  ev_eyebrow:{en:'Events & Tickets',zh:'活动与门票',ms:'Acara & Tiket'},
  ev_title:{en:'Be in the <em>room</em> where it happens.',zh:'亲临<em>现场</em>。',ms:'Hadir di <em>tempat</em> kejadian.'},
  ev_desc:{en:'From charity matches to arena concerts — secure your seat before they sell out.',
    zh:'从慈善赛到大型演唱会 —— 趁早锁定你的座位。',ms:'Dari perlawanan amal ke konsert arena — dapatkan tempat anda sebelum habis.'},
  ev_feat_chip:{en:'Featured · Charity',zh:'重磅 · 慈善',ms:'Pilihan · Amal'},
  ev_feat_title:{en:'All Stars Sports Association Charity Match',zh:'香港明星足球队慈善赛',ms:'Perlawanan Amal All Stars Sports Association'},
  ev_l_date:{en:'Date',zh:'日期',ms:'Tarikh'},
  ev_l_time:{en:'Time',zh:'时间',ms:'Masa'},
  ev_l_venue:{en:'Venue',zh:'地点',ms:'Tempat'},
  ev_v_date:{en:'Sat, 10 Oct 2026',zh:'2026年10月10日 周六',ms:'Sabtu, 10 Okt 2026'},
  ev_v_time:{en:'5:00 PM – 8:00 PM',zh:'下午 5:00 – 8:00',ms:'5:00 PTG – 8:00 MLM'},
  ev_v_venue:{en:'MBPJ Stadium, Selangor',zh:'MBPJ 体育场,雪兰莪',ms:'Stadium MBPJ, Selangor'},
  tier_a:{en:'Grandstand',zh:'看台',ms:'Grandstan'},
  tier_b:{en:'VIP',zh:'贵宾',ms:'VIP'},
  tier_c:{en:'VVIP Royal',zh:'皇家 VVIP',ms:'Diraja VVIP'},
  ev_buy:{en:'Buy tickets',zh:'立即购票',ms:'Beli tiket'},
  ev_from:{en:'from',zh:'起',ms:'dari'},
  up_title:{en:'More upcoming',zh:'更多活动',ms:'Akan datang'},
  ev1_t:{en:'Johor Racing — Home Round',zh:'柔佛赛车 · 主场站',ms:'Johor Racing — Pusingan Kandang'},
  ev1_s:{en:'Sepang International Circuit',zh:'雪邦国际赛道',ms:'Litar Antarabangsa Sepang'},
  ev2_t:{en:'Mahkota Live — Year-End Concert',zh:'Mahkota Live 年终演唱会',ms:'Mahkota Live — Konsert Akhir Tahun'},
  ev2_s:{en:'Axiata Arena, Kuala Lumpur',zh:'吉隆坡 Axiata 体育馆',ms:'Axiata Arena, Kuala Lumpur'},
  ev3_t:{en:'Meet & Greet — Driver Day',zh:'见面会 · 车手日',ms:'Sesi Jumpa — Hari Pemandu'},
  ev3_s:{en:'Johor Premium Outlets',zh:'柔佛名牌折扣中心',ms:'Johor Premium Outlets'},
  ev_soon:{en:'Selling fast',zh:'即将售罄',ms:'Cepat habis'},
  ev_open:{en:'On sale',zh:'售票中',ms:'Dijual'},
  // interactive
  fan_eyebrow:{en:'Fan Zone',zh:'互动专区',ms:'Zon Peminat'},
  fan_title:{en:'Your vote. Your <em>champion</em>.',zh:'你的一票,你的<em>冠军</em>。',ms:'Undi anda. <em>Juara</em> anda.'},
  fan_desc:{en:'Back your favourite for the People’s Choice award, and predict the big result.',
    zh:'为你支持的他/她投票,赢得人气大奖,并预测赛事结果。',ms:'Sokong pilihan anda untuk anugerah Pilihan Rakyat, dan ramal keputusan besar.'},
  vote_title:{en:'People’s Choice — this round',zh:'本期人气榜',ms:'Pilihan Rakyat — pusingan ini'},
  vote_btn:{en:'Vote',zh:'投票',ms:'Undi'},
  vote_voted:{en:'Voted ✓',zh:'已投票 ✓',ms:'Diundi ✓'},
  vote_thanks:{en:'Thanks for voting! Results update live.',zh:'感谢投票!结果实时更新。',ms:'Terima kasih kerana mengundi! Keputusan dikemas kini langsung.'},
  pred_eyebrow:{en:'Predict & win',zh:'预测赢好礼',ms:'Ramal & menang'},
  pred_title:{en:'Who lifts the ASSA trophy?',zh:'谁将捧起 ASSA 奖杯?',ms:'Siapa angkat trofi ASSA?'},
  pred_desc:{en:'Call the charity match result for a chance at signed merch and VVIP seats.',
    zh:'预测慈善赛结果,有机会赢得签名周边与 VVIP 座位。',ms:'Ramal keputusan perlawanan amal untuk peluang memenangi barangan bertandatangan dan tempat VVIP.'},
  pred_a:{en:'All Stars',zh:'明星队',ms:'All Stars'},
  pred_b:{en:'Johor Select',zh:'柔佛联队',ms:'Johor Select'},
  pred_locked:{en:'Prediction locked in — good luck!',zh:'预测已锁定 —— 祝你好运!',ms:'Ramalan dikunci — semoga berjaya!'},
  // sponsors
  sp_eyebrow:{en:'Partners',zh:'合作伙伴',ms:'Rakan Kongsi'},
  sp_title:{en:'In <em>good</em> company.',zh:'与<em>顶级</em>品牌同行。',ms:'Bersama syarikat <em>terbaik</em>.'},
  sp_desc:{en:'The brands that ride with us, season after season.',zh:'赛季又赛季,与我们同行的品牌。',ms:'Jenama yang bersama kami, musim demi musim.'},
  // about
  ab_eyebrow:{en:'About Mahkota',zh:'关于 Mahkota',ms:'Tentang Mahkota'},
  ab_lede:{en:'We turn raw talent into household names — and moments into movements.',
    zh:'我们把璞玉般的天赋,打造成家喻户晓的名字,把瞬间变成风潮。',ms:'Kami mengubah bakat mentah menjadi nama terkenal — dan detik menjadi gerakan.'},
  ab_p1:{en:'Founded in Johor and rooted in motorsport, Mahkota manages a roster of drivers, artists and athletes, and produces the live events that connect them with fans across Malaysia and beyond.',
    zh:'Mahkota 源于柔佛、扎根赛车,经纪旗下车手、艺人与运动员,并制作连结粉丝的现场活动,影响遍及马来西亚乃至海外。',
    ms:'Diasaskan di Johor dan berakar dalam motorsport, Mahkota menguruskan pemandu, artis dan atlet, serta menghasilkan acara langsung yang menghubungkan mereka dengan peminat.'},
  ab_s1v:{en:'40+',zh:'40+',ms:'40+'}, ab_s1k:{en:'Talents represented',zh:'签约艺人',ms:'Bakat diwakili'},
  ab_s2v:{en:'120',zh:'120',ms:'120'}, ab_s2k:{en:'Events produced',zh:'制作活动',ms:'Acara dihasilkan'},
  ab_s3v:{en:'2.4M',zh:'240万',ms:'2.4J'}, ab_s3k:{en:'Tickets sold',zh:'售出门票',ms:'Tiket terjual'},
  ab_s4v:{en:'18',zh:'18',ms:'18'}, ab_s4k:{en:'Brand partners',zh:'品牌伙伴',ms:'Rakan jenama'},
  // news
  nw_eyebrow:{en:'Latest',zh:'最新',ms:'Terkini'},
  nw_title:{en:'From the <em>paddock</em>.',zh:'来自<em>赛场</em>。',ms:'Dari <em>padok</em>.'},
  nw1_cat:{en:'Motorsport',zh:'赛车',ms:'Motorsport'},
  nw1_t:{en:'Making noise at Le Mans — a debut to remember',zh:'勒芒首秀,一鸣惊人',ms:'Bergema di Le Mans — debut yang diingati'},
  nw2_cat:{en:'Signing',zh:'签约',ms:'Tandatangan'},
  nw2_t:{en:'Mahkota adds a chart-topping voice to the roster',zh:'Mahkota 再添一位榜首唱将',ms:'Mahkota tambah suara nombor satu ke senarai'},
  nw3_cat:{en:'Community',zh:'公益',ms:'Komuniti'},
  nw3_t:{en:'Charity match raises record sum for youth sport',zh:'慈善赛为青少年体育筹得创纪录善款',ms:'Perlawanan amal kumpul jumlah rekod untuk sukan belia'},
  nw_read:{en:'Read story',zh:'阅读全文',ms:'Baca lagi'},
  // footer
  ft_tag:{en:'Talent · Motorsport · Entertainment. Born in Johor.',zh:'艺人经纪 · 赛车 · 娱乐活动。源自柔佛。',ms:'Bakat · Motorsport · Hiburan. Lahir di Johor.'},
  ft_explore:{en:'Explore',zh:'探索',ms:'Terokai'},
  ft_company:{en:'Company',zh:'公司',ms:'Syarikat'},
  ft_connect:{en:'Connect',zh:'联系',ms:'Hubungi'},
  ft_careers:{en:'Careers',zh:'招聘',ms:'Kerjaya'},
  ft_partner:{en:'Become a partner',zh:'成为合作伙伴',ms:'Jadi rakan kongsi'},
  ft_contact:{en:'Contact us',zh:'联系我们',ms:'Hubungi kami'},
  ft_press:{en:'Press kit',zh:'媒体资料',ms:'Kit media'},
  ft_terms:{en:'Terms',zh:'条款',ms:'Terma'},
  ft_privacy:{en:'Privacy',zh:'隐私',ms:'Privasi'},
  ft_rights:{en:'© 2026 Mahkota Talent & Events. All rights reserved.',zh:'© 2026 Mahkota Talent & Events 版权所有。',ms:'© 2026 Mahkota Talent & Events. Hak cipta terpelihara.'},
};

/* talent + vote names (not translated — replaced with real names later) */
const TALENT_NAMES = ['Tunku A. Rahman','Maya Suria','Daniel Voon','Aiman Zaki','Liang Wei','Sofia Idris'];
const TALENT_HANDLES = ['@tunku_racing','@mayasuria','@danielvoon','@aimanzaki','@liangwei','@sofia.idris'];

function applyLang(lang){
  document.documentElement.setAttribute('data-lang',lang);
  document.body.classList.toggle('cn-active', lang==='zh');
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const v=TRI[el.getAttribute('data-i18n')]; if(v) el.textContent=v[lang]||v.en;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{
    const v=TRI[el.getAttribute('data-i18n-html')]; if(v) el.innerHTML=v[lang]||v.en;
  });
  document.querySelectorAll('.lang button').forEach(b=>b.classList.toggle('on',b.dataset.l===lang));
  localStorage.setItem('mhk-lang',lang);
}

function initVote(){
  const rows=[...document.querySelectorAll('.vote-row')];
  let voted=false;
  const recompute=()=>{
    const total=rows.reduce((s,r)=>s+Number(r.dataset.v),0)||1;
    rows.forEach(r=>{ const p=Math.round(Number(r.dataset.v)/total*100);
      r.querySelector('.vbar i').style.width=p+'%'; r.querySelector('.pct').textContent=p+'%'; });
  };
  rows.forEach(r=>{
    r.querySelector('.vote-btn').addEventListener('click',()=>{
      if(voted) return; voted=true;
      r.dataset.v=Number(r.dataset.v)+Math.round(rows.reduce((s,x)=>s+Number(x.dataset.v),0)*0.06+30);
      recompute();
      rows.forEach(x=>{ const b=x.querySelector('.vote-btn'); b.disabled=true;
        if(x===r){ b.classList.add('voted'); b.textContent=TRI.vote_voted[document.documentElement.getAttribute('data-lang')]||'Voted ✓'; }
        else b.style.opacity=.4; });
      const note=document.getElementById('voteNote'); if(note){note.style.display='block';}
    });
  });
  recompute();
}

function initPredict(){
  document.querySelectorAll('.pred-opt').forEach(o=>o.addEventListener('click',()=>{
    document.querySelectorAll('.pred-opt').forEach(x=>x.classList.remove('on'));
    o.classList.add('on');
    const n=document.getElementById('predNote'); if(n)n.style.display='block';
  }));
}
function initTiers(){
  document.querySelectorAll('.tier').forEach(t=>t.addEventListener('click',()=>{
    document.querySelectorAll('.tier').forEach(x=>x.classList.remove('on')); t.classList.add('on');
  }));
}
function initReveal(){
  const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}

function initSite(){
  document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>applyLang(b.dataset.l)));
  applyLang(localStorage.getItem('mhk-lang')||'en');
  initVote(); initPredict(); initTiers(); initReveal();
}
if(document.readyState!=='loading') initSite(); else document.addEventListener('DOMContentLoaded',initSite);
