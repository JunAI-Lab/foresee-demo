/* ============================================================
   SORAK · World Cup 2026 data + i18n (window.WC)
   Shared by the 3 public demos + the flash engine.
   Demo data is mock/static; market mechanics mirror the
   flash-market catalog (parimutuel flash / CPMM full-match /
   free-points), trilingual zh / en / ms.
   ============================================================ */
(function () {
  // ---------- i18n ----------
  const STR = {
    brand_tag:      { zh: '带盘直播 · 世界杯', en: 'Live Exchange · World Cup', ms: 'Bursa Langsung · Piala Dunia' },
    nav_live:       { zh: '直播', en: 'Live', ms: 'Langsung' },
    nav_markets:    { zh: '盘口', en: 'Markets', ms: 'Pasaran' },
    nav_news:       { zh: '新闻', en: 'News', ms: 'Berita' },
    nav_wallet:     { zh: '钱包', en: 'Wallet', ms: 'Dompet' },
    live_now:       { zh: '直播中', en: 'LIVE', ms: 'LANGSUNG' },
    watching:       { zh: '人在看', en: 'watching', ms: 'menonton' },
    real_money:     { zh: '真钱', en: 'Real money', ms: 'Wang sebenar' },
    free_points:    { zh: '免费积分', en: 'Free points', ms: 'Mata percuma' },
    free_badge:     { zh: '免费积分场', en: 'Free-points room', ms: 'Bilik mata percuma' },
    prize_note:     { zh: '奖品=体验/周边', en: 'Prizes = experiences/merch', ms: 'Hadiah = pengalaman/barangan' },
    // sections
    sec_flash:      { zh: '闪电盘 · 直播中', en: 'Flash markets · Live', ms: 'Pasaran Kilat · Langsung' },
    sec_fullmatch:  { zh: '全场盘', en: 'Full-match', ms: 'Perlawanan penuh' },
    sec_champion:   { zh: '冠军盘', en: 'Winner', ms: 'Juara' },
    sec_groups:     { zh: '小组出线', en: 'Group stage', ms: 'Peringkat kumpulan' },
    sec_knockout:   { zh: '淘汰赛晋级', en: 'Knockout', ms: 'Kalah mati' },
    sec_news:       { zh: '世界杯新闻', en: 'World Cup news', ms: 'Berita Piala Dunia' },
    more_news:      { zh: '更多新闻', en: 'More news', ms: 'Lagi berita' },
    related:        { zh: '相关', en: 'Related', ms: 'Berkaitan' },
    // flash terms
    pari:           { zh: '彩池制', en: 'Parimutuel', ms: 'Parimutuel' },
    blind_pool:     { zh: '盲池:封盘前只显示预计派彩,不显示双方池', en: 'Blind pool: only projected payout shown before lock', ms: 'Kolam buta: hanya bayaran anggaran sebelum kunci' },
    proj_payout:    { zh: '预计派彩', en: 'Est. payout', ms: 'Bayaran anggaran' },
    will_change:    { zh: '封盘前会变', en: 'changes before lock', ms: 'berubah sebelum kunci' },
    heat:           { zh: '热度', en: 'Heat', ms: 'Hangat' },
    heat_hi:        { zh: '高', en: 'High', ms: 'Tinggi' },
    heat_mid:       { zh: '中', en: 'Mid', ms: 'Sederhana' },
    heat_lo:        { zh: '低', en: 'Low', ms: 'Rendah' },
    lock_in:        { zh: '距封盘', en: 'Locks in', ms: 'Kunci dalam' },
    bet:            { zh: '下注', en: 'Place', ms: 'Letak' },
    points:         { zh: '积分', en: 'pts', ms: 'mata' },
    pick_side:      { zh: '选边后显示预计派彩', en: 'Pick a side to see payout', ms: 'Pilih untuk lihat bayaran' },
    you_stake:      { zh: '你押', en: 'You stake', ms: 'Anda pertaruh' },
    if_win:         { zh: '若赢 ≈', en: 'If win ≈', ms: 'Jika menang ≈' },
    locked:         { zh: '已锁定', en: 'Locked', ms: 'Dikunci' },
    settled_win:    { zh: '赢了', en: 'You won', ms: 'Anda menang' },
    settled_lose:   { zh: '没中,下局翻盘', en: 'Missed — next one', ms: 'Tersasar — seterusnya' },
    streak:         { zh: '连胜', en: 'Streak', ms: 'Berturut' },
    fsm_open:       { zh: '投注中', en: 'Open', ms: 'Buka' },
    fsm_lock:       { zh: '已锁', en: 'Locked', ms: 'Kunci' },
    fsm_prov:       { zh: '临时', en: 'Provisional', ms: 'Sementara' },
    fsm_official:   { zh: '官方', en: 'Official', ms: 'Rasmi' },
    host_call:      { zh: '盘口来了!{q} — 3,2,1 抢!', en: 'New pool! {q} — 3,2,1 go!', ms: 'Kolam baru! {q} — 3,2,1!' },
    // CPMM / trade
    chance:         { zh: '概率', en: 'chance', ms: 'peluang' },
    buy:            { zh: '买入', en: 'Buy', ms: 'Beli' },
    amount:         { zh: '金额', en: 'Amount', ms: 'Jumlah' },
    est_payout_yes: { zh: '若结算为 YES,你将获得', en: 'If YES, you get', ms: 'Jika YA, anda dapat' },
    confirm:        { zh: '确认下单', en: 'Confirm', ms: 'Sahkan' },
    vol:            { zh: '成交', en: 'Vol', ms: 'Jumlah' },
    ends:           { zh: '截止', en: 'Ends', ms: 'Tamat' },
    // integrity / RG
    integrity:      { zh: '诚信与结算', en: 'Integrity & settlement', ms: 'Integriti & penyelesaian' },
    imdo:           { zh: '结算依据独立现场数据官(IMDO),与盘口运营隔离', en: 'Settled by independent on-site data official (IMDO), isolated from market ops', ms: 'Diselesai oleh pegawai data bebas (IMDO), terasing daripada operasi pasaran' },
    delay_note:     { zh: '直播延迟约 8 秒;盘口以现场数据时间戳为准', en: '~8s stream delay; markets settle on venue data timestamps', ms: 'Lengah ~8s; pasaran ikut cap masa data padang' },
    rules_hash:     { zh: '规则上架即哈希冻结,结算两态可追溯', en: 'Rules hash-frozen at listing; two-state settlement auditable', ms: 'Peraturan dikunci-hash; penyelesaian dua-keadaan boleh diaudit' },
    rg_title:       { zh: '负责任游戏', en: 'Responsible play', ms: 'Main bertanggungjawab' },
    rg_cool:        { zh: '连续 6 盘后自动冷却', en: 'auto cooldown after 6 pools', ms: 'rehat auto selepas 6 kolam' },
    cooldown_t:     { zh: '歇一歇,喝杯 teh tarik', en: 'Take a break', ms: 'Rehat dulu, teh tarik' },
    region_note:    { zh: '真钱仅限持牌且 in-play 合法地区;其他地区为免费积分场', en: 'Real-money in-play only where licensed & legal; elsewhere free-points', ms: 'Wang sebenar hanya di kawasan berlesen; selainnya mata percuma' },
    mamak:          { zh: 'Mamak Mode · 陪你熬夜看球', en: 'Mamak Mode · stay up with us', ms: 'Mamak Mode · berjaga bersama' },
    yes:            { zh: 'YES', en: 'YES', ms: 'YA' },
    no:             { zh: 'NO', en: 'NO', ms: 'TIDAK' },
  };
  function t(key, lang) { const o = STR[key]; return o ? (o[lang] || o.en || key) : key; }
  function L(o, lang) { return o ? (o[lang] || o.en || o.zh) : ''; }

  // ---------- teams (subset, with flags) ----------
  const TEAM = {
    BRA: { flag: '🇧🇷', zh: '巴西', en: 'Brazil', ms: 'Brazil' },
    ARG: { flag: '🇦🇷', zh: '阿根廷', en: 'Argentina', ms: 'Argentina' },
    FRA: { flag: '🇫🇷', zh: '法国', en: 'France', ms: 'Perancis' },
    ENG: { flag: '🏴', zh: '英格兰', en: 'England', ms: 'England' },
    ESP: { flag: '🇪🇸', zh: '西班牙', en: 'Spain', ms: 'Sepanyol' },
    GER: { flag: '🇩🇪', zh: '德国', en: 'Germany', ms: 'Jerman' },
    POR: { flag: '🇵🇹', zh: '葡萄牙', en: 'Portugal', ms: 'Portugal' },
    NED: { flag: '🇳🇱', zh: '荷兰', en: 'Netherlands', ms: 'Belanda' },
    USA: { flag: '🇺🇸', zh: '美国', en: 'USA', ms: 'AS' },
    MEX: { flag: '🇲🇽', zh: '墨西哥', en: 'Mexico', ms: 'Mexico' },
    JPN: { flag: '🇯🇵', zh: '日本', en: 'Japan', ms: 'Jepun' },
    KOR: { flag: '🇰🇷', zh: '韩国', en: 'S. Korea', ms: 'Korea S.' },
    CRO: { flag: '🇭🇷', zh: '克罗地亚', en: 'Croatia', ms: 'Croatia' },
    BEL: { flag: '🇧🇪', zh: '比利时', en: 'Belgium', ms: 'Belgium' },
    MAR: { flag: '🇲🇦', zh: '摩洛哥', en: 'Morocco', ms: 'Maghribi' },
    SEN: { flag: '🇸🇳', zh: '塞内加尔', en: 'Senegal', ms: 'Senegal' },
  };

  // ---------- champion market (cents = implied %) ----------
  const CHAMPION = [
    { team: 'BRA', yes: 18, chg: +1 }, { team: 'ARG', yes: 16, chg: -1 }, { team: 'FRA', yes: 15, chg: 0 },
    { team: 'ESP', yes: 13, chg: +2 }, { team: 'ENG', yes: 11, chg: -1 }, { team: 'GER', yes: 8, chg: 0 },
    { team: 'POR', yes: 7, chg: +1 }, { team: 'NED', yes: 5, chg: 0 }, { team: 'USA', yes: 3, chg: 0 },
    { team: 'CRO', yes: 3, chg: -1 }, { team: 'BEL', yes: 3, chg: 0 }, { team: 'MAR', yes: 2, chg: +1 },
  ];

  // ---------- groups (qualify markets) ----------
  const GROUPS = [
    { g: 'A', teams: [{ team: 'MEX', yes: 72 }, { team: 'KOR', yes: 54 }, { team: 'CRO', yes: 41 }, { team: 'SEN', yes: 33 }] },
    { g: 'B', teams: [{ team: 'ESP', yes: 84 }, { team: 'GER', yes: 61 }, { team: 'JPN', yes: 38 }, { team: 'MAR', yes: 17 }] },
    { g: 'C', teams: [{ team: 'BRA', yes: 88 }, { team: 'POR', yes: 58 }, { team: 'BEL', yes: 35 }, { team: 'USA', yes: 19 }] },
  ];

  // ---------- knockout reach-stage (sample) ----------
  const KNOCKOUT = [
    { team: 'ARG', stage: { zh: '进决赛', en: 'Reach Final', ms: 'Ke Final' }, yes: 28 },
    { team: 'FRA', stage: { zh: '进决赛', en: 'Reach Final', ms: 'Ke Final' }, yes: 26 },
    { team: 'BRA', stage: { zh: '进四强', en: 'Reach Semis', ms: 'Ke Separuh' }, yes: 47 },
    { team: 'ENG', stage: { zh: '进四强', en: 'Reach Semis', ms: 'Ke Separuh' }, yes: 39 },
    { team: 'ESP', stage: { zh: '进八强', en: 'Reach QF', ms: 'Ke Suku' }, yes: 66 },
    { team: 'NED', stage: { zh: '进八强', en: 'Reach QF', ms: 'Ke Suku' }, yes: 52 },
  ];

  // ---------- the featured LIVE match (for flash + full-match demo) ----------
  const MATCH = {
    home: 'BRA', away: 'ARG',
    stage: { zh: '小组赛 C 组', en: 'Group C', ms: 'Kumpulan C' },
    venue: { zh: 'MetLife 体育场', en: 'MetLife Stadium', ms: 'Stadium MetLife' },
    kickoff_my: '03:00 MYT',
  };

  // ---------- full-match CPMM markets for the live match ----------
  const FULLMATCH = [
    { id: 'wdw', cat: 'fullmatch', yes: 44, chg: 0, vol: 2860000,
      q: { zh: '巴西会赢下本场吗?', en: 'Will Brazil win this match?', ms: 'Adakah Brazil menang?' } },
    { id: 'o25', cat: 'fullmatch', yes: 57, chg: +2, vol: 1640000,
      q: { zh: '本场总进球 2.5 球以上?', en: 'Over 2.5 total goals?', ms: 'Lebih 2.5 gol?' } },
    { id: 'btts', cat: 'fullmatch', yes: 63, chg: +1, vol: 1220000,
      q: { zh: '双方都进球?', en: 'Both teams to score?', ms: 'Kedua-dua jaring?' } },
  ];

  // ---------- flash market catalog (parimutuel / free) ----------
  // engine: 'pari' (real-money where legal) | 'free' (free-only)
  const FLASH = [
    { id: 'nextgoal', ev: 'goal', lean: 0.40, win: 5, lock: 60, eng: 'pari',
      q: { zh: '未来 5 分钟内会有进球吗?', en: 'A goal in the next 5 minutes?', ms: 'Gol dalam 5 minit akan datang?' },
      src: { zh: '官方 in-play 数据(进球时间戳)', en: 'Official in-play feed (goal timestamp)', ms: 'Suapan in-play rasmi' } },
    { id: 'nextteam', ev: 'goal', lean: 0.52, win: 5, lock: 60, eng: 'pari',
      q: { zh: '下一个进球是巴西吗?', en: 'Will Brazil score next?', ms: 'Adakah Brazil jaring seterusnya?' },
      src: { zh: '官方进球归属', en: 'Official goal attribution', ms: 'Penjaringan rasmi' } },
    { id: 'nextcorner', ev: 'corner', lean: 0.62, win: 5, lock: 60, eng: 'pari',
      q: { zh: '未来 5 分钟内会有角球吗?', en: 'A corner in the next 5 minutes?', ms: 'Sepak penjuru dalam 5 minit?' },
      src: { zh: '官方角球计数', en: 'Official corner count', ms: 'Kiraan penjuru rasmi' } },
    { id: 'card', ev: 'card', lean: 0.36, win: 10, lock: 60, eng: 'pari',
      q: { zh: '未来 10 分钟内会出黄/红牌吗?', en: 'A card in the next 10 minutes?', ms: 'Kad dalam 10 minit?' },
      src: { zh: '官方裁判记录', en: 'Official referee record', ms: 'Rekod pengadil rasmi' } },
    { id: 'var', ev: 'var', lean: 0.22, win: 10, lock: 90, eng: 'pari',
      q: { zh: '未来 10 分钟内会有 VAR 介入吗?', en: 'A VAR review in the next 10 minutes?', ms: 'Semakan VAR dalam 10 minit?' },
      src: { zh: '官方 VAR 事件', en: 'Official VAR event', ms: 'Acara VAR rasmi' } },
    { id: 'pen', ev: 'pen', lean: 0.16, win: 10, lock: 90, eng: 'pari',
      q: { zh: '未来 10 分钟内会判点球吗?', en: 'A penalty awarded in the next 10 minutes?', ms: 'Penalti dianugerah dalam 10 minit?' },
      src: { zh: '官方判罚', en: 'Official decision', ms: 'Keputusan rasmi' } },
    { id: 'shot', ev: 'shot', lean: 0.66, win: 5, lock: 45, eng: 'pari',
      q: { zh: '未来 5 分钟内会有射正吗?', en: 'A shot on target in the next 5 minutes?', ms: 'Tendangan tepat dalam 5 minit?' },
      src: { zh: '官方射门数据', en: 'Official shot data', ms: 'Data tendangan rasmi' } },
    { id: 'gksave', ev: 'shot', lean: 0.5, win: 10, lock: 45, eng: 'pari',
      q: { zh: '门将本节会有扑救吗?', en: 'Will the keeper make a save this spell?', ms: 'Penjaga gol akan selamat?' },
      src: { zh: '官方扑救统计', en: 'Official saves stat', ms: 'Statistik penyelamatan rasmi' } },
    { id: 'player', ev: 'goal', lean: 0.28, win: 15, lock: 60, eng: 'pari',
      q: { zh: 'Vinícius 本节会进球或助攻吗?', en: 'Vinícius to score or assist this spell?', ms: 'Vinícius jaring/assist?' },
      src: { zh: '官方球员数据', en: 'Official player data', ms: 'Data pemain rasmi' } },
    { id: 'tempo', ev: 'goal', lean: 0.45, win: 15, lock: 60, eng: 'pari',
      q: { zh: '本节(15分钟)节奏:进球数过 1.5?', en: 'Over 1.5 goals this 15-min spell?', ms: 'Lebih 1.5 gol dalam 15 minit?' },
      src: { zh: '官方进球计数', en: 'Official goal count', ms: 'Kiraan gol rasmi' } },
    { id: 'stoppage', ev: 'none', lean: 0.5, win: 5, lock: 120, eng: 'free',
      q: { zh: '伤停补时会超过 4 分钟吗?', en: 'Stoppage time over 4 minutes?', ms: 'Masa kecederaan lebih 4 minit?' },
      src: { zh: '第四官员公示', en: 'Fourth official board', ms: 'Papan pegawai keempat' } },
    { id: 'mamak', ev: 'none', lean: 0.5, win: 5, lock: 30, eng: 'free',
      q: { zh: 'Mamak Mode:看台 A 区 vs B 区谁更吵?', en: 'Mamak Mode: which stand is louder?', ms: 'Mamak Mode: gerai mana lebih bising?' },
      src: { zh: '现场分贝 + 投票', en: 'Crowd vote', ms: 'Undi penonton' } },
  ];

  // ---------- mock World Cup news ----------
  const NEWS = [
    { src: 'FIFA.com', mins: 7, grad: 'linear-gradient(135deg,#1B7A3D,#0E5A2C)', teams: ['BRA', 'ARG'],
      title: { zh: '巴西 vs 阿根廷今夜上演 C 组榜首之争', en: 'Brazil vs Argentina headline Group C tonight', ms: 'Brazil lwn Argentina puncak Kumpulan C malam ini' } },
    { src: 'ESPN', mins: 22, grad: 'linear-gradient(135deg,#28396E,#16285C)', teams: ['ESP'],
      title: { zh: '西班牙连胜领跑 B 组,提前一轮出线', en: 'Spain top Group B, qualify with a round to spare', ms: 'Sepanyol pimpin Kumpulan B, layak awal' } },
    { src: 'The Athletic', mins: 41, grad: 'linear-gradient(135deg,#7a2230,#B3122B)', teams: ['FRA'],
      title: { zh: '法国核心边锋伤情更新:能否首发存疑', en: 'France winger injury update: start in doubt', ms: 'Kemaskini kecederaan pemain sayap Perancis' } },
    { src: 'Sky Sports', mins: 68, grad: 'linear-gradient(135deg,#0E5A6B,#0a3a47)', teams: ['MAR', 'GER'],
      title: { zh: '摩洛哥爆冷逼平德国,小组形势骤变', en: 'Morocco stun Germany with late draw', ms: 'Maghribi sentak Jerman dengan seri lewat' } },
    { src: 'Goal', mins: 95, grad: 'linear-gradient(135deg,#3a2f5e,#221a3d)', teams: ['ENG'],
      title: { zh: '英格兰主帅轮换:淘汰赛前保留主力', en: 'England rotate squad ahead of knockouts', ms: 'England putar skuad sebelum kalah mati' } },
    { src: 'RTM Sukan', mins: 130, grad: 'linear-gradient(135deg,#A8842B,#6e560f)', teams: ['JPN', 'KOR'],
      title: { zh: '亚洲双雄日韩同晋级,凌晨场点燃 Mamak', en: 'Japan & Korea both advance — dawn games light up mamak', ms: 'Jepun & Korea layak — mamak meriah subuh' } },
  ];

  // ---------- helpers ----------
  const RAKE = 0.05;
  function payoutMult(yesPool, noPool, side) {
    const tot = yesPool + noPool, s = side === 'yes' ? yesPool : noPool;
    return s > 0 ? (tot * (1 - RAKE)) / s : 1;
  }
  const cents = c => c + '¢';
  const fmtInt = n => Math.round(n).toLocaleString('en-US');

  window.WC = {
    STR, t, L, TEAM, CHAMPION, GROUPS, KNOCKOUT, MATCH, FULLMATCH, FLASH, NEWS,
    RAKE, payoutMult, cents, fmtInt,
    team: id => WC.TEAM[id],
  };
})();
