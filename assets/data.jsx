/* ============================================================
   FORESEE — data, i18n, shared atoms  (window.FX)
   ============================================================ */
(function(){
const R = React;
const h = React.createElement;

/* ---------- categories ---------- */
const CATS = [
  { key:'all',      en:'Trending',      zh:'热门' },
  { key:'talent',   en:'Talent',        zh:'星势力' },
  { key:'politics', en:'Politics',      zh:'政治' },
  { key:'crypto',   en:'Crypto',        zh:'加密' },
  { key:'sports',   en:'Sports',        zh:'体育' },
  { key:'ai',       en:'AI',            zh:'人工智能' },
  { key:'culture',  en:'Entertainment', zh:'娱乐' },
];
const CAT_LABEL = {
  talent:{en:'Talent',zh:'星势力'},
  politics:{en:'Politics',zh:'政治'}, crypto:{en:'Crypto',zh:'加密'},
  sports:{en:'Sports',zh:'体育'}, ai:{en:'AI',zh:'AI'}, culture:{en:'Entertainment',zh:'娱乐'},
};

/* small helper to fabricate a believable price path ending at `end` */
function path(end, vol, seed){
  let a=[], v=end-vol*0.6, s=seed||7;
  for(let i=0;i<28;i++){ s=(s*9301+49297)%233280; const r=s/233280-0.5;
    v+=r*vol*0.5 + (end-v)*0.05; v=Math.max(3,Math.min(97,v)); a.push(Math.round(v)); }
  a.push(end); return a;
}

/* ---------- markets ---------- */
const M = [
  /* ----- TALENT / entertainment markets (the fusion) ----- */
  { id:'assa', cat:'talent', yes:57, vol:1320000, end:'Oct 10, 2026', endZh:'2026年10月10日',
    comments:488, change:-3, img:'#B3122B', talent:'liang', event:'assa',
    q:{en:'Will the All Stars beat Johor Select in the ASSA charity match?', zh:'All Stars 会在 ASSA 慈善赛中击败柔佛精英队吗?'},
    desc:{en:'Resolves YES if the All Stars XI win the All Stars Sports Association charity match on Oct 10, 2026.',
          zh:'若 All Stars 队在 2026年10月10日 ASSA 慈善赛中获胜,结算为 YES。'},
    src:{en:'Official match result', zh:'官方赛果'} },

  { id:'podium', cat:'talent', yes:44, vol:680000, end:'Jun 28, 2026', endZh:'2026年6月28日',
    comments:214, change:+6, img:'#C9A84C', talent:'tunku', event:'sepang',
    q:{en:'Will Tunku A. Rahman finish on the podium at the Sepang home round?', zh:'东姑·拉曼会在雪邦主场站登上领奖台吗?'},
    desc:{en:'Resolves YES if the driver classifies in the top 3 of the main race at the Sepang home round.',
          zh:'若该车手在雪邦主场站正赛中位列前三,结算为 YES。'},
    src:{en:'FIA official classification', zh:'FIA 官方成绩'} },

  { id:'sellout', cat:'talent', yes:73, vol:540000, end:'Dec 12, 2026', endZh:'2026年12月12日',
    comments:301, change:+9, img:'#C9A84C', talent:'maya', event:'concert',
    q:{en:'Will the Year-End Concert sell out within 24 hours?', zh:'年终演唱会会在24小时内售罄吗?'},
    desc:{en:'Resolves YES if every ticket tier for the Year-End Concert sells out within 24h of going on sale.',
          zh:'若年终演唱会所有票档在开售24小时内全部售罄,结算为 YES。'},
    src:{en:'Official box-office data', zh:'官方票务数据'} },

  { id:'peoplechoice', cat:'talent', yes:41, vol:410000, end:'Aug 30, 2026', endZh:'2026年8月30日',
    comments:356, change:+4, img:'#E7D499', talent:'maya', event:'driverday',
    q:{en:"Will Maya Suria win this season's People's Choice award?", zh:'玛雅·苏丽雅会赢得本季"人气之选"大奖吗?'},
    desc:{en:"Resolves YES if Maya Suria receives the most fan votes for the season's People's Choice award.",
          zh:'若玛雅·苏丽雅获得本季"人气之选"最高票数,结算为 YES。'},
    src:{en:'Verified fan-vote tally', zh:'官方计票'} },

  { id:'debut', cat:'talent', yes:31, vol:220000, end:'Jul 19, 2026', endZh:'2026年7月19日',
    comments:142, change:+2, img:'#28396E', talent:'aiman', event:'sepang',
    q:{en:'Will Aiman Zaki score points on his F4 debut weekend?', zh:'艾曼·扎基会在 F4 处子赛周拿到积分吗?'},
    desc:{en:'Resolves YES if the driver finishes in a points-paying position in either race of his F4 debut weekend.',
          zh:'若该车手在 F4 处子赛周任一场比赛中进入积分区,结算为 YES。'},
    src:{en:'F4 official results', zh:'F4 官方成绩'} },

  { id:'numberone', cat:'talent', yes:49, vol:360000, end:'Sep 30, 2026', endZh:'2026年9月30日',
    comments:198, change:-1, img:'#B3122B', talent:'sofia', event:'concert',
    q:{en:"Will Sofia Idris's new single hit #1 on the regional chart?", zh:'苏菲亚·伊德里斯的新单曲会登上地区榜冠军吗?'},
    desc:{en:'Resolves YES if the single reaches #1 on the official regional streaming chart before October 2026.',
          zh:'若该单曲在 2026年10月前登上官方地区流媒体榜首位,结算为 YES。'},
    src:{en:'Official regional chart', zh:'官方地区榜'} },

  { id:'btc100k', cat:'crypto', yes:28, vol:2410000, end:'Dec 31, 2026', endZh:'2026年12月31日',
    comments:312, change:+4, img:'#F7931A',
    q:{en:'Will Bitcoin close above $100,000 on Dec 31?', zh:'比特币会在12月31日收于10万美元以上吗?'},
    desc:{en:'Resolves YES if the Coinbase BTC-USD daily close on Dec 31, 2026 (UTC) is ≥ $100,000.',
          zh:'若 2026年12月31日(UTC)Coinbase BTC-USD 日收盘价 ≥ 10万美元,结算为 YES。'},
    src:{en:'Coinbase BTC-USD daily close', zh:'Coinbase BTC-USD 日收盘价'} },

  { id:'uspres', cat:'politics', yes:54, vol:8900000, end:'Nov 3, 2026', endZh:'2026年11月3日',
    comments:1840, change:-2, img:'#3B6EE8',
    q:{en:'Will the incumbent party win the 2026 midterms?', zh:'执政党会赢得2026年中期选举吗?'},
    desc:{en:'Resolves to the party controlling the House after all races are officially called by AP.',
          zh:'以 AP 官方宣布所有选区结果后控制众议院的政党为准结算。'},
    src:{en:'Associated Press race call', zh:'美联社(AP)官方计票'} },

  { id:'gpt6', cat:'ai', yes:41, vol:1230000, end:'Jun 30, 2026', endZh:'2026年6月30日',
    comments:506, change:+7, img:'#10A37F',
    q:{en:'Will a frontier lab release a GPT-6-class model before July?', zh:'前沿实验室会在7月前发布 GPT-6 级模型吗?'},
    desc:{en:'Resolves YES if any major lab publicly releases a model marketed as a generational leap before Jul 1, 2026.',
          zh:'若任一主要实验室在2026年7月1日前公开发布被宣传为代际飞跃的模型,结算为 YES。'},
    src:{en:'Official lab announcement', zh:'实验室官方公告'} },

  { id:'wc', cat:'sports', yes:19, vol:5600000, end:'Jul 19, 2026', endZh:'2026年7月19日',
    comments:921, change:+1, img:'#16A34A',
    q:{en:'Will Brazil win the 2026 World Cup?', zh:'巴西会赢得2026年世界杯吗?'},
    desc:{en:'Resolves YES if Brazil wins the FIFA World Cup 2026 final.', zh:'若巴西赢得2026年国际足联世界杯决赛,结算为 YES。'},
    src:{en:'FIFA official result', zh:'FIFA 官方赛果'} },

  { id:'eth5k', cat:'crypto', yes:63, vol:1880000, end:'Sep 30, 2026', endZh:'2026年9月30日',
    comments:288, change:+3, img:'#627EEA',
    q:{en:'Will Ethereum trade above $5,000 before October?', zh:'以太坊会在10月前突破5000美元吗?'},
    desc:{en:'Resolves YES if ETH-USD prints ≥ $5,000 on Coinbase at any point before Oct 1, 2026.',
          zh:'若 2026年10月1日前 ETH-USD 在 Coinbase 任意时刻 ≥ 5000 美元,结算为 YES。'},
    src:{en:'Coinbase ETH-USD', zh:'Coinbase ETH-USD'} },

  { id:'oscar', cat:'culture', yes:37, vol:740000, end:'Mar 15, 2026', endZh:'2026年3月15日',
    comments:413, change:-4, img:'#D4AF37',
    q:{en:'Will an A24 film win Best Picture at the 2026 Oscars?', zh:'A24 出品的影片会拿下2026奥斯卡最佳影片吗?'},
    desc:{en:'Resolves YES if a film distributed by A24 wins the Academy Award for Best Picture.',
          zh:'若 A24 发行的影片获得奥斯卡最佳影片奖,结算为 YES。'},
    src:{en:'Academy official ceremony', zh:'奥斯卡官方颁奖'} },

  { id:'rates', cat:'politics', yes:72, vol:3300000, end:'Jul 31, 2026', endZh:'2026年7月31日',
    comments:655, change:+5, img:'#6366F1',
    q:{en:'Will the Fed cut rates at the July meeting?', zh:'美联储会在7月会议上降息吗?'},
    desc:{en:'Resolves YES if the FOMC lowers the target range at its July 2026 meeting.',
          zh:'若 FOMC 在2026年7月会议上下调目标利率区间,结算为 YES。'},
    src:{en:'Federal Reserve statement', zh:'美联储官方声明'} },

  { id:'agi', cat:'ai', yes:12, vol:2050000, end:'Dec 31, 2026', endZh:'2026年12月31日',
    comments:1120, change:-1, img:'#A855F7',
    q:{en:'Will a major lab claim AGI in 2026?', zh:'2026年会有主要实验室宣称实现 AGI 吗?'},
    desc:{en:'Resolves YES if a top-5 lab publicly claims to have achieved AGI during 2026.',
          zh:'若五大实验室之一在2026年内公开宣称已实现 AGI,结算为 YES。'},
    src:{en:'Official lab statement + panel review', zh:'实验室官方声明 + 专家组复核'} },
];
M.forEach(m=>{ m.chart = path(m.yes, 14, m.id.length*13); });

/* ---------- portfolio ---------- */
const POSITIONS = [
  { id:'p0', marketId:'assa',    side:'yes', shares:140, avg:52 },
  { id:'p1', marketId:'btc100k', side:'yes', shares:178, avg:24 },
  { id:'p2', marketId:'rates',   side:'yes', shares:90,  avg:66 },
  { id:'p3', marketId:'wc',      side:'no',  shares:120, avg:78 },
];
const BALANCE = { cash: 462.10 };

const TXNS = [
  { id:'t1', type:'buy',     mkt:'btc100k', amt:-42.72, time:{en:'2h ago',zh:'2小时前'}, sub:{en:'178 YES @ 24¢',zh:'178 股 YES @ 24¢'} },
  { id:'t2', type:'deposit', mkt:null,      amt:+500.00, time:{en:'Yesterday',zh:'昨天'}, sub:{en:'USDT · TRC-20',zh:'USDT · TRC-20'} },
  { id:'t3', type:'sell',    mkt:'eth5k',   amt:+88.40,  time:{en:'2d ago',zh:'2天前'}, sub:{en:'140 YES @ 63¢',zh:'140 股 YES @ 63¢'} },
  { id:'t4', type:'settle',  mkt:'oscar',   amt:+0.00,   time:{en:'5d ago',zh:'5天前'}, sub:{en:'Market resolved NO',zh:'市场结算为 NO'} },
];

/* ---------- i18n ---------- */
const STR = {
  appName:{en:'Foresee',zh:'Foresee'},
  nav_markets:{en:'Markets',zh:'市场'}, nav_portfolio:{en:'Portfolio',zh:'资产'},
  nav_activity:{en:'Activity',zh:'动态'}, nav_profile:{en:'Profile',zh:'我的'},
  search:{en:'Search markets…',zh:'搜索市场…'},
  vol:{en:'Vol',zh:'成交'}, ends:{en:'Ends',zh:'截止'}, yes:{en:'Yes',zh:'YES'}, no:{en:'No',zh:'NO'},
  buy:{en:'Buy',zh:'买入'}, buyYes:{en:'Buy Yes',zh:'买 YES'}, buyNo:{en:'Buy No',zh:'买 NO'},
  trade:{en:'Trade',zh:'交易'}, chance:{en:'chance',zh:'概率'},
  orderbook:{en:'Order book',zh:'订单簿'}, rules:{en:'Rules',zh:'规则'}, comments:{en:'Comments',zh:'讨论'},
  about:{en:'About this market',zh:'关于此市场'}, resolves:{en:'Resolution source',zh:'结算来源'},
  amount:{en:'Amount',zh:'金额'}, youPay:{en:'You pay',zh:'支付'}, youGet:{en:'Est. shares',zh:'预计份额'},
  potential:{en:'Potential return',zh:'潜在回报'}, avgPrice:{en:'Avg price',zh:'均价'},
  placeOrder:{en:'Place order',zh:'确认下单'}, max:{en:'Max',zh:'全部'},
  totalBal:{en:'Total balance',zh:'总余额'}, available:{en:'Available cash',zh:'可用余额'},
  inPositions:{en:'In positions',zh:'持仓中'}, todayPnl:{en:'today',zh:'今日'},
  positions:{en:'Positions',zh:'持仓'}, history:{en:'History',zh:'历史'},
  deposit:{en:'Deposit',zh:'充值'}, withdraw:{en:'Withdraw',zh:'提现'},
  toWin:{en:'To win',zh:'可赢'}, value:{en:'Value',zh:'市值'}, shares:{en:'shares',zh:'份额'},
  depositTitle:{en:'Add funds',zh:'充值'}, withdrawTitle:{en:'Withdraw',zh:'提现'},
  crypto:{en:'Crypto · USDT',zh:'加密货币 · USDT'}, fiat:{en:'Card / Bank',zh:'银行卡 / 法币'},
  scanAddr:{en:'Send only USDT (TRC-20) to this address',zh:'仅向此地址转入 USDT(TRC-20)'},
  copyAddr:{en:'Copy address',zh:'复制地址'}, copied:{en:'Copied',zh:'已复制'},
  network:{en:'Network',zh:'网络'}, minDeposit:{en:'Min deposit',zh:'最低充值'},
  withdrawTo:{en:'Withdraw to address',zh:'提现到地址'}, withdrawAmt:{en:'Amount to withdraw',zh:'提现金额'},
  fee:{en:'Network fee',zh:'网络手续费'}, youReceive:{en:'You receive',zh:'到账'},
  continue:{en:'Continue',zh:'继续'}, confirm:{en:'Confirm',zh:'确认'}, done:{en:'Done',zh:'完成'},
  kycNeeded:{en:'Verify identity to withdraw',zh:'提现前需完成身份验证'},
  kycSub:{en:'Deposit & trading need no KYC',zh:'充值与下单无需 KYC'},
  startKyc:{en:'Verify',zh:'去验证'}, profile:{en:'Profile',zh:'个人中心'},
  verified:{en:'Verified',zh:'已认证'}, unverified:{en:'Unverified',zh:'未认证'},
  security:{en:'Security & 2FA',zh:'安全与两步验证'}, referral:{en:'Refer & earn',zh:'推荐返佣'},
  language:{en:'Language',zh:'语言'}, theme:{en:'Appearance',zh:'外观'}, settings:{en:'Settings',zh:'设置'},
  riskNote:{en:'Prediction markets carry risk. Prices reflect probability, not advice. You can lose your entire stake.',
            zh:'预测市场存在风险。价格反映概率,不构成建议。你可能损失全部本金。'},
  orderPlaced:{en:'Order placed',zh:'下单成功'}, addedToPos:{en:'Added to your portfolio',zh:'已加入持仓'},
  estReturn:{en:'If this resolves YES, you win',zh:'若结算为 YES,你将获得'},
  estReturnNo:{en:'If this resolves NO, you win',zh:'若结算为 NO,你将获得'},
  noPositions:{en:'No open positions yet',zh:'暂无持仓'}, browse:{en:'Browse markets',zh:'去看看市场'},
  region:{en:'Some markets are unavailable in your region.',zh:'部分市场在你所在地区不可用。'},
  feeNote:{en:'Includes 1.5% trading fee',zh:'含 1.5% 交易手续费'},
  pickAmount:{en:'Pick an amount',zh:'选择金额'}, processing:{en:'Processing…',zh:'处理中…'},
};
function t(k, lang){ const o=STR[k]; return o?(o[lang]||o.en):k; }

/* ---------- formatting ---------- */
const money = (n,d=2)=>'$'+Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const signed = (n)=> (n>=0?'+':'−')+money(n);
const cents = (c)=> c+'¢';

/* ---------- Logo (Probability Fork) ---------- */
function Logo({size=30, mono=false}){
  const s = size;
  const brand = mono?'currentColor':'var(--brand)';
  return h('svg',{width:s,height:s,viewBox:'0 0 32 32',fill:'none','aria-label':'Foresee'},
    h('path',{d:'M5 16 H12.5',stroke:brand,strokeWidth:2.7,strokeLinecap:'round'}),
    h('path',{d:'M12.5 16 C16 16, 17.5 14, 22 9',stroke:brand,strokeWidth:2.7,strokeLinecap:'round'}),
    h('path',{d:'M12.5 16 C16 16, 17.5 18, 22 23',stroke:brand,strokeWidth:2.7,strokeLinecap:'round'}),
    h('circle',{cx:23,cy:8,r:3.2,fill:mono?'currentColor':'var(--yes)'}),
    h('circle',{cx:23,cy:24,r:3.2,fill:mono?'currentColor':'var(--no)'}),
    h('circle',{cx:5,cy:16,r:2.2,fill:brand}),
  );
}
function Wordmark({size=20}){
  return h('div',{style:{display:'flex',alignItems:'center',gap:9}},
    h(Logo,{size:size*1.5}),
    h('span',{style:{fontWeight:800,fontSize:size,letterSpacing:'-.025em'}},'Foresee'));
}

/* ---------- Sparkline ---------- */
function Sparkline({data, color, w=120, h:hh=40, fill=true, sw=2}){
  const max=Math.max(...data), min=Math.min(...data), rng=(max-min)||1;
  const pts=data.map((v,i)=>[ i/(data.length-1)*w, hh-((v-min)/rng)*(hh-sw*2)-sw ]);
  const d=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area=d+` L${w} ${hh} L0 ${hh} Z`;
  const id='g'+Math.random().toString(36).slice(2,7);
  return h('svg',{width:w,height:hh,viewBox:`0 0 ${w} ${hh}`,preserveAspectRatio:'none',style:{display:'block'}},
    fill&&h('defs',null,h('linearGradient',{id,x1:0,y1:0,x2:0,y2:1},
      h('stop',{offset:'0%',stopColor:color,stopOpacity:.22}),
      h('stop',{offset:'100%',stopColor:color,stopOpacity:0}))),
    fill&&h('path',{d:area,fill:`url(#${id})`}),
    h('path',{d,fill:'none',stroke:color,strokeWidth:sw,strokeLinecap:'round',strokeLinejoin:'round'}));
}

/* ---------- talent roster (the signed faces you trade on) ---------- */
const ROSTER = [
  { id:'tunku',  name:'Tunku A. Rahman', role:{en:'Racing Driver',zh:'赛车手'},     tag:{en:'Signed Driver',zh:'签约车手'}, handle:'@tunku_racing', accent:'#C9A84C', marketId:'podium',       img:'tal-1', bio:{en:'Le Mans campaigner & home-round headliner.',zh:'勒芒征战者,主场站头牌。'} },
  { id:'maya',   name:'Maya Suria',      role:{en:'Recording Artist',zh:'唱作歌手'}, tag:{en:'Multi-platinum',zh:'多白金'},  handle:'@mayasuria',    accent:'#B3122B', marketId:'peoplechoice', img:'tal-2', bio:{en:'Multi-platinum vocalist, arena headliner.',zh:'多白金唱将,体育馆主秀。'} },
  { id:'daniel', name:'Daniel Voon',     role:{en:'Host & Presenter',zh:'主持人'},   tag:{en:'Pit-lane',zh:'围场主持'},    handle:'@danielvoon',   accent:'#28396E', marketId:null,          img:'tal-3', bio:{en:'Pit-lane presenter & live host.',zh:'围场记者,现场主持。'} },
  { id:'aiman',  name:'Aiman Zaki',      role:{en:'Racing Driver',zh:'赛车手'},     tag:{en:'Rookie',zh:'新秀'},          handle:'@aimanzaki',    accent:'#C9A84C', marketId:'debut',       img:'tal-4', bio:{en:'National karting graduate, F4 rookie.',zh:'全国卡丁冠军,F4 新秀。'} },
  { id:'liang',  name:'Liang Wei',       role:{en:'Pro Athlete',zh:'职业运动员'},  tag:{en:'Captain',zh:'队长'},         handle:'@liangwei',     accent:'#0E8F5E', marketId:'assa',        img:'tal-5', bio:{en:'All Stars captain, charity-match talisman.',zh:'All Stars 队长,慈善赛核心。'} },
  { id:'sofia',  name:'Sofia Idris',     role:{en:'Recording Artist',zh:'唱作歌手'}, tag:{en:'Rising',zh:'新生代'},      handle:'@sofia.idris',  accent:'#B3122B', marketId:'numberone',   img:'tal-6', bio:{en:'Chart-rising singer-songwriter.',zh:'冲榜中的唱作新声。'} },
];

/* ---------- events / tickets (each pairs with a live market) ---------- */
const EVENTS = [
  { id:'assa',      featured:true, day:'10', mon:{en:'Oct',zh:'十月'}, title:{en:'ASSA Charity Match',zh:'ASSA 慈善赛'}, sub:{en:'All Stars vs Johor Select',zh:'All Stars vs 柔佛精英'}, venue:{en:'MBPJ Stadium, Selangor',zh:'MBPJ 体育场·雪兰莞'}, when:{en:'Sat, 10 Oct · 5:00 PM',zh:'10月10日(六)· 17:00'}, status:{en:'Featured',zh:'焦点'}, marketId:'assa', from:88, tiers:[{n:{en:'Grandstand',zh:'看台'},p:88},{n:{en:'VIP',zh:'VIP'},p:288},{n:{en:'VVIP Royal',zh:'VVIP 贵宾'},p:688}] },
  { id:'sepang',    day:'28', mon:{en:'Jun',zh:'六月'}, title:{en:'Sepang Home Round',zh:'雪邦主场站'}, sub:{en:'Foresee Racing · round 4',zh:'Foresee 车队 · 第4站'}, venue:{en:'Sepang International Circuit',zh:'雪邦国际赛道'}, when:{en:'Sun, 28 Jun · 3:00 PM',zh:'6月28日(日)· 15:00'}, status:{en:'Selling fast',zh:'热销中'}, marketId:'podium', from:120 },
  { id:'concert',   day:'12', mon:{en:'Dec',zh:'十二月'}, title:{en:'Year-End Concert',zh:'年终演唱会'}, sub:{en:'Maya Suria · live in arena',zh:'玛雅·苏丽雅 · 体育馆现场'}, venue:{en:'Axiata Arena, Kuala Lumpur',zh:'Axiata 体育馆·吉隆坡'}, when:{en:'Sat, 12 Dec · 8:00 PM',zh:'12月12日(六)· 20:00'}, status:{en:'On sale',zh:'发售中'}, marketId:'sellout', from:128 },
  { id:'driverday', day:'04', mon:{en:'Jul',zh:'七月'}, title:{en:'Driver Day Meet & Greet',zh:'车手见面会'}, sub:{en:'Meet the signed drivers',zh:'与签约车手见面'}, venue:{en:'Johor Premium Outlets',zh:'柔佛名牌折扣中心'}, when:{en:'Sat, 04 Jul · 2:00 PM',zh:'7月4日(六)· 14:00'}, status:{en:'Free entry',zh:'免费入场'}, marketId:'peoplechoice', from:0 },
];

/* ---------- expose ---------- */
window.FX = {
  CATS, CAT_LABEL, MARKETS:M, POSITIONS, BALANCE, TXNS, ROSTER, EVENTS,
  t, money, signed, cents, Logo, Wordmark, Sparkline,
  market:(id)=>M.find(m=>m.id===id),
  roster:(id)=>ROSTER.find(r=>r.id===id),
  event:(id)=>EVENTS.find(e=>e.id===id),
};
})();
