/* ============================================================
   FORESEE web — app shell, 3 directions, trade loop  (mounts #root)
   A 看台 entertainment-led · B 交易大厅 exchange-led · C 对开 paired
   ============================================================ */
(function(){
const h = React.createElement;
const { useState, useEffect, useRef } = React;
const FX = window.FX, FW = window.FW;
const { t, money, cents, signed, CAT_LABEL, CATS } = FX;
const { Nav, Ticker, Duo, MarketCard, FeaturedMarket, TalentCard, EventRow, Pair, Leaderboard, Footer, Portrait } = FW;
const tx=(lang,en,zh)=>lang==='zh'?zh:en;

/* ====================== HERO ====================== */
function Hero({direction, lang, onTrade, onNav}){
  const podium=FX.market('podium'), assa=FX.market('assa');
  const stats = direction==='B'
    ? [[FX.MARKETS.length+'',tx(lang,'Live markets','在线市场')],['$6.4M',tx(lang,'24h volume','24h 成交')],['$2.4M',tx(lang,'USDT settled','USDT 结算')]]
    : [['40+',tx(lang,'Talents','签约艺人')],['120',tx(lang,'Events','举办活动')],['$2.4M',tx(lang,'USDT settled','USDT 结算')]];

  const copy = {
    A:{eb:tx(lang,'Talent · Motorsport · Live','艺人 · 赛车 · 现场'),
       h:[tx(lang,'Where champions become ','把冠军变成可'),tx(lang,'tradable','交易的'),tx(lang,' icons.','偶像。')],
       sub:tx(lang,'A talent house you can take a position on. Follow the drivers and stars — then trade the outcomes in real USDT.','一个你能下注的星势力之家。追随车手与明星,再用真实 USDT 交易他们的结果。'),
       c1:tx(lang,'Meet our talents','认识艺人'),c2:tx(lang,'Open a position','开仓交易'),n1:'talents',n2:'markets'},
    B:{eb:tx(lang,'Prediction Exchange · Real USDT','预测交易所 · 真实 USDT'),
       h:[tx(lang,'Trade the outcomes you ','交易你真正'),tx(lang,'actually','在追'),tx(lang,' follow.','的结果。')],
       sub:tx(lang,'Races, charts, charity matches, elections. Buy YES or NO from a few cents — settle in USDT when the result is called.','赛事、榜单、慈善赛、大选。几分钱起买入 YES 或 NO,结果揭晓后用 USDT 结算。'),
       c1:tx(lang,'Browse markets','浏览市场'),c2:tx(lang,'How it works','玩法说明'),n1:'markets',n2:'fans'},
    C:{eb:tx(lang,'Faces × Odds','面孔 × 赔率'),
       h:[tx(lang,'Every name. ','每个名字。'),tx(lang,'A live market.','一个实时盘口。')],
       sub:tx(lang,'For every signed face there is a price. Read the portrait, then read the odds — and take your side.','每一张签约面孔背后都有一个价格。看脸,也看赔率,然后选边站。'),
       c1:tx(lang,'See the card','看对开'),c2:tx(lang,'Open a position','开仓交易'),n1:'talents',n2:'markets'},
  }[direction];

  const right = direction==='B'
    ? h('div',{className:'w-hero-mkt'},
        h('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:12}},
          h('span',{className:'cat',style:{color:assa.img,background:`color-mix(in srgb, ${assa.img} 16%, transparent)`}},h('span',{className:'dot'}),CAT_LABEL[assa.cat][lang]),
          h('span',{style:{marginLeft:'auto',fontSize:11,fontWeight:700,color:'var(--gold-soft)',letterSpacing:'.05em',textTransform:'uppercase'}}, '🔥 '+tx(lang,'Hot','热门'))),
        h('div',{style:{fontSize:20,fontWeight:800,lineHeight:1.25,color:'var(--cream)'}}, assa.q[lang]),
        h('div',{style:{display:'flex',alignItems:'flex-end',gap:10,margin:'16px 0 14px'}},
          h('span',{className:'tnum',style:{fontSize:50,fontWeight:800,letterSpacing:'-.03em',lineHeight:1,color:'var(--gold-soft)'}}, cents(assa.yes)),
          h('span',{style:{fontSize:13,color:'rgba(244,241,232,.7)',fontWeight:600,paddingBottom:6}}, t('chance',lang))),
        h(Duo,{m:assa,lang,onTrade,size:'lg'}),
        h('div',{style:{display:'flex',justifyContent:'space-between',fontSize:12,color:'rgba(244,241,232,.6)',marginTop:14}},
          h('span',null, t('vol',lang)+' '+money(assa.vol,0)),
          h('span',null, '🎟 '+FX.event('assa').when[lang])))
    : h('div',{className:'w-hero-portrait'},
        h(Portrait,{id:'hero-portrait',accent:'#C9A84C',radius:22,src:'assets/ph/hero-portrait.png',placeholder:tx(lang,'Hero portrait — driver / artist','主视觉 — 车手 / 艺人')}),
        h('div',{className:'badge'},
          h('div',{className:'r'}, tx(lang,'Signed Driver · live market','签约车手 · 实时盘口')),
          h('div',{className:'n'}, 'Tunku A. Rahman'),
          h(Duo,{m:podium,lang,onTrade})));

  return h('header',{className:'w-hero',id:'top'},
    h('div',{className:'w-hero-in'},
      h('div',null,
        h('div',{className:'w-eyebrow',style:{color:'var(--gold-soft)'}}, copy.eb),
        h('h1',null, copy.h[0], h('em',null,copy.h[1]), copy.h[2]),
        h('p',{className:'sub'}, copy.sub),
        h('div',{className:'w-hero-cta'},
          h('button',{className:'btn gold',style:{padding:'15px 26px',fontSize:15},onClick:()=>onNav(copy.n1)}, copy.c1),
          h('button',{className:'btn',style:{padding:'15px 26px',fontSize:15,background:'transparent',border:'1.5px solid rgba(231,212,153,.5)',color:'var(--cream)'},onClick:()=>onNav(copy.n2)}, copy.c2)),
        h('div',{className:'w-hero-stats'}, stats.map((s,i)=>h('div',{key:i},
          h('div',{className:'v'}, s[0]), h('div',{className:'k'}, s[1]))))),
      right));
}

/* ====================== MARKETS BOARD ====================== */
function MarketsSection({lang, onTrade, featured, compact, id, navy}){
  const [cat,setCat]=useState('all');
  let list=FX.MARKETS.filter(m=>cat==='all'||m.cat===cat);
  if(featured) list=list.filter(m=>m.id!==featured.id);
  if(compact) list=list.slice(0,6);
  return h('section',{className:'w-sec'+(navy?' navy':''),id},
    h('div',{className:'w-wrap'},
      h('div',{className:'w-sechead'},
        h('div',{className:'l'},
          h('div',{className:'w-eyebrow'}, tx(lang,'Live markets · real USDT','在线市场 · 真实 USDT')),
          h('div',{className:'w-sectitle'}, tx(lang,'Open ','开放'),h('em',null,tx(lang,'markets','盘口')),'.'),
          h('div',{className:'w-secdesc'}, tx(lang,'Every market settles in USDT against an official, named source. Buy YES or NO from a few cents.','每个市场以官方指定来源、用 USDT 结算。几分钱起买入 YES 或 NO。'))),
        h('div',{className:'chips',style:{maxWidth:'48%',justifyContent:'flex-end'}},
          CATS.map(c=>h('button',{key:c.key,className:'chip'+(cat===c.key?' on':''),onClick:()=>setCat(c.key)}, c[lang])))),
      featured && cat==='all' && h('div',{style:{marginBottom:18}}, h(FeaturedMarket,{m:featured,lang,onTrade})),
      h('div',{className:'w-board'}, list.map(m=>h(MarketCard,{key:m.id,m,lang,onTrade}))),
      list.length===0 && h('div',{style:{textAlign:'center',color:'var(--text-3)',padding:'40px 0'}}, tx(lang,'No markets in this category','该分类暂无市场'))));
}

/* ====================== SIMPLE SECTION WRAPPERS ====================== */
function TalentsSection({lang, onTrade, onNav, id, compact}){
  const list = compact? FX.ROSTER.filter(r=>r.marketId) : FX.ROSTER;
  return h('section',{className:'w-sec cream2',id},
    h('div',{className:'w-wrap'},
      h('div',{className:'w-sechead'},
        h('div',{className:'l'},
          h('div',{className:'w-eyebrow'}, tx(lang,'The roster','签约阵容')),
          h('div',{className:'w-sectitle'}, tx(lang,'The signed ','签约'),h('em',null,tx(lang,'talents','艺人')),'.'),
          h('div',{className:'w-secdesc'}, compact? tx(lang,'The names behind the markets — back them, or fade them.','盘口背后的名字 —— 押他们,或反着来。') : tx(lang,'Drivers, performers and personalities we represent — each with a live market you can trade.','我们代理的车手、表演者与公众人物 —— 每位都配一个可交易的实时盘口。'))),
        h('button',{className:'btn outline',style:{border:'1.5px solid var(--navy)',color:'var(--text)'},onClick:()=>onNav('markets')}, tx(lang,'All markets','全部市场'))),
      h('div',{className:'w-talent-grid'}, list.map(r=>h(TalentCard,{key:r.id,r,lang,onTrade,onTickets:()=>onNav('events')})))));
}

function EventsSection({lang, onTrade, onTickets, id}){
  return h('section',{className:'w-sec navy',id},
    h('div',{className:'w-wrap'},
      h('div',{className:'w-sechead'},
        h('div',{className:'l'},
          h('div',{className:'w-eyebrow',style:{color:'var(--gold-soft)'}}, tx(lang,'Events & tickets','活动与门票')),
          h('div',{className:'w-sectitle'}, tx(lang,'Be in the ','到'),h('em',null,tx(lang,'room','现场')),'.'),
          h('div',{className:'w-secdesc'}, tx(lang,'Buy the ticket, then trade the outcome. Every event carries its own live market.','买下门票,再交易结果。每场活动都自带实时盘口。')))),
      h('div',{className:'w-events'}, FX.EVENTS.map(e=>h(EventRow,{key:e.id,e,lang,onTrade,onTickets})))));
}

function PairsSection({lang, onTrade, id}){
  const pairs=FX.ROSTER.filter(r=>r.marketId);
  return h('section',{className:'w-sec',id},
    h('div',{className:'w-wrap'},
      h('div',{className:'w-sechead'},
        h('div',{className:'l'},
          h('div',{className:'w-eyebrow'}, tx(lang,'Faces × Odds','面孔 × 赔率')),
          h('div',{className:'w-sectitle'}, tx(lang,'The ','对'),h('em',null,tx(lang,'card','开')),'.'),
          h('div',{className:'w-secdesc'}, tx(lang,'One face, one price. Read the portrait, then take your side of the market.','一张脸,一个价格。看脸,再选边。')))),
      h('div',{className:'w-pairs'}, pairs.map((r,i)=>h(Pair,{key:r.id,r,lang,onTrade,flip:i%2===1})))));
}

function FansSection({lang, onTrade, id}){
  return h('section',{className:'w-sec cream2',id},
    h('div',{className:'w-wrap'},
      h('div',{className:'w-sechead'},
        h('div',{className:'l'},
          h('div',{className:'w-eyebrow'}, tx(lang,'Fan Zone','粉丝专区')),
          h('div',{className:'w-sectitle'}, tx(lang,'Your call. Your ','你来定。你的'),h('em',null,tx(lang,'edge','胜算')),'.'),
          h('div',{className:'w-secdesc'}, tx(lang,'Climb the predictor leaderboard and back your champion in the People\u2019s Choice market.','冲上预言榜,并在"人气之选"市场押注你的冠军。')))),
      h(Leaderboard,{lang,onTrade})));
}

/* ====================== TRADE MODAL ====================== */
function TradeModal({state, lang, store, onClose, onToast, onDeposit}){
  const {open,m,side:side0}=state;
  const [side,setSide]=useState('yes');
  const [amt,setAmt]=useState('');
  const [stage,setStage]=useState('input');
  useEffect(()=>{ if(open){ setSide(side0||'yes'); setAmt(''); setStage('input'); } },[open]);
  if(!m) return h('div',{className:'w-mask'});
  const price=side==='yes'?m.yes:100-m.yes;
  const a=parseFloat(amt)||0;
  const shares=a>0?a/(price/100):0;
  const payout=shares*1, profit=payout-a;
  const enough=a>0 && a<=store.balance+0.001;
  const set=(v)=>{ setStage('input'); setAmt(v); };
  const place=()=>{ setStage('placing'); setTimeout(()=>{ store.buy(m.id,side,a,price); setStage('done'); },850); };
  const finish=()=>{ onClose(); onToast(t('addedToPos',lang)); };

  return h('div',{className:'w-mask'+(open?' on':''),onClick:onClose},
    h('div',{className:'w-modal',onClick:e=>e.stopPropagation()},
      stage==='done'
      ? h('div',{style:{padding:'30px 26px 28px',textAlign:'center'}},
          h('div',{style:{width:64,height:64,borderRadius:'50%',background:'var(--yes-soft)',display:'grid',placeItems:'center',margin:'0 auto 16px'}},
            h('svg',{width:30,height:30,viewBox:'0 0 24 24',fill:'none'},h('path',{d:'M5 13l4 4L19 7',stroke:'var(--yes)',strokeWidth:2.6,strokeLinecap:'round',strokeLinejoin:'round'}))),
          h('div',{className:'w-serif',style:{fontSize:28}}, t('orderPlaced',lang)),
          h('div',{style:{fontSize:14.5,color:'var(--text-2)',marginTop:6}}, shares.toFixed(1)+' '+(side==='yes'?'YES':'NO')+' '+t('shares',lang)+' · '+money(a)),
          h('div',{className:'w-sum',style:{textAlign:'left',margin:'20px 0'}},
            h('div',{className:'kv'}, h('span',{className:'k'}, side==='yes'?t('estReturn',lang):t('estReturnNo',lang)), h('span',{className:'v tnum pos'}, money(payout)))),
          h('div',{style:{display:'flex',gap:10}},
            h('button',{className:'btn ghost',style:{flex:1},onClick:finish}, t('done',lang)),
            h('button',{className:'btn primary',style:{flex:1,background:'var(--gold)',color:'var(--navy-deep)'},onClick:()=>{onClose();onToast(t('addedToPos',lang));store.openPositions&&store.openPositions();}}, t('positions',lang))))
      : h(React.Fragment,null,
          h('div',{className:'w-modal-h'},
            h('div',{className:'w-mthumb',style:{background:`color-mix(in srgb, ${m.img} 20%, var(--surface-2))`,color:m.img}}, CAT_LABEL[m.cat][lang].slice(0,1)),
            h('div',{style:{flex:1}},
              h('span',{className:'cat',style:{color:m.img,background:`color-mix(in srgb, ${m.img} 13%, transparent)`}},h('span',{className:'dot'}),CAT_LABEL[m.cat][lang]),
              h('div',{style:{fontSize:17,fontWeight:700,lineHeight:1.28,marginTop:8,textWrap:'pretty'}}, m.q[lang])),
            h('button',{className:'w-x',onClick:onClose}, h('svg',{width:14,height:14,viewBox:'0 0 14 14'},h('path',{d:'M1 1l12 12M13 1L1 13',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round'})))),
          h('div',{className:'w-modal-body'},
            h('div',{className:'duo',style:{marginBottom:16}},
              h('div',{className:'pill yes lg'+(side==='yes'?' on':''),onClick:()=>setSide('yes')},
                h('div',{className:'pt'}, t('buyYes',lang)), h('div',{className:'pp tnum'}, cents(m.yes)),
                h('div',{className:'ps'}, (lang==='zh'?'赢 $1':'Win $1')+' → +'+Math.round((100-m.yes)/m.yes*100)+'%')),
              h('div',{className:'pill no lg'+(side==='no'?' on':''),onClick:()=>setSide('no')},
                h('div',{className:'pt'}, t('buyNo',lang)), h('div',{className:'pp tnum'}, cents(100-m.yes)),
                h('div',{className:'ps'}, (lang==='zh'?'赢 $1':'Win $1')+' → +'+Math.round(m.yes/(100-m.yes)*100)+'%'))),
            h('div',{className:'label',style:{marginBottom:8}}, t('amount',lang)),
            h('div',{className:'amt focus'},
              h('span',{className:'cur'},'$'),
              h('input',{value:amt,onChange:e=>set(e.target.value.replace(/[^\d.]/g,'')),placeholder:'0',inputMode:'decimal',autoFocus:false})),
            h('div',{className:'w-quick'},
              [10,50,100].map(v=>h('button',{key:v,onClick:()=>set(String((parseFloat(amt)||0)+v))}, '+$'+v)),
              h('button',{onClick:()=>set(String(store.balance.toFixed(2)))}, t('max',lang))),
            h('div',{className:'w-sum'},
              h('div',{className:'kv'}, h('span',{className:'k'}, t('avgPrice',lang)), h('span',{className:'v tnum'}, cents(price))),
              h('div',{className:'kv'}, h('span',{className:'k'}, t('youGet',lang)), h('span',{className:'v tnum'}, shares.toFixed(1)+' '+t('shares',lang))),
              h('div',{className:'kv'}, h('span',{className:'k'}, side==='yes'?t('estReturn',lang):t('estReturnNo',lang)),
                h('span',{className:'v tnum pos'}, money(payout)+'  (+'+(a?Math.round(profit/a*100):0)+'%)'))),
            h('div',{className:'w-usdt'},
              h('span',{className:'b'}, '₮ '+tx(lang,'Paying from','支付自')+' '+money(store.balance)),
              h('span',null, '· '+t('feeNote',lang))),
            h('button',{className:'btn block '+(side==='yes'?'yes':'no'),style:{marginTop:16,fontSize:16,opacity:enough?1:.5},disabled:!enough||stage==='placing',onClick:place},
              stage==='placing'? t('processing',lang)
                : a>0? (side==='yes'?t('buyYes',lang):t('buyNo',lang))+' · '+money(a)
                : t('pickAmount',lang)),
            !enough && a>0 && h('div',{style:{textAlign:'center',marginTop:10,fontSize:13}},
              h('span',{style:{color:'var(--neg)'}}, tx(lang,'Insufficient balance — ','余额不足 —— ')),
              h('span',{style:{color:'var(--gold-on)',fontWeight:700,cursor:'pointer'},onClick:onDeposit}, tx(lang,'add USDT','充值 USDT'))),
            h('div',{style:{fontSize:11.5,color:'var(--text-3)',marginTop:14,lineHeight:1.5,display:'flex',gap:7}},
              h('span',null,'⚠'), h('span',null, t('riskNote',lang)))))));
}

/* ====================== DEPOSIT MODAL ====================== */
function DepositModal({open, lang, store, onClose, onToast}){
  const [amt,setAmt]=useState('100');
  const addr='TZ4Up1Vg9k7xN3Sorak8mQpYrL2sWcDx';
  return h('div',{className:'w-mask'+(open?' on':''),onClick:onClose},
    h('div',{className:'w-modal',onClick:e=>e.stopPropagation()},
      h('div',{className:'w-modal-h'},
        h('div',{style:{flex:1}},
          h('span',{className:'cat'},h('span',{className:'dot'}),'USDT · TRC-20'),
          h('div',{style:{fontSize:20,fontWeight:800,marginTop:8}}, t('depositTitle',lang))),
        h('button',{className:'w-x',onClick:onClose}, h('svg',{width:14,height:14,viewBox:'0 0 14 14'},h('path',{d:'M1 1l12 12M13 1L1 13',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round'})))),
      h('div',{className:'w-modal-body'},
        h('div',{className:'label',style:{marginBottom:8}}, t('amount',lang)),
        h('div',{className:'amt focus'}, h('span',{className:'cur'},'$'), h('input',{value:amt,onChange:e=>setAmt(e.target.value.replace(/[^\d.]/g,'')),inputMode:'decimal'})),
        h('div',{className:'w-quick'}, [50,100,500].map(v=>h('button',{key:v,onClick:()=>setAmt(String(v))}, '$'+v))),
        h('div',{style:{display:'flex',gap:10,alignItems:'center',background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:12,padding:'12px 14px',marginTop:16}},
          h('div',{className:'mono',style:{flex:1,fontSize:12,wordBreak:'break-all',color:'var(--text-2)'}}, addr),
          h('button',{className:'btn ghost',style:{padding:'9px 13px',fontSize:13},onClick:()=>onToast(t('copied',lang))}, t('copyAddr',lang))),
        h('div',{style:{fontSize:11.5,color:'var(--text-3)',marginTop:10,lineHeight:1.5,display:'flex',gap:7}},
          h('span',null,'⚠'), h('span',null, tx(lang,'Send only USDT (TRC-20). Min 10 USDT. KYC needed only to withdraw.','仅转入 USDT(TRC-20)。最低 10 USDT。仅提现需 KYC。'))),
        h('button',{className:'btn block',style:{marginTop:16,fontSize:16,background:'var(--gold)',color:'var(--navy-deep)'},onClick:()=>{store.addCash(parseFloat(amt)||0);onToast(tx(lang,'Funds added','充值成功'));onClose();}},
          t('deposit',lang)+' '+money(parseFloat(amt)||0)))));
}

/* ====================== POSITIONS DRAWER ====================== */
function posValue(p){ const m=FX.market(p.marketId); const cur=p.side==='yes'?m.yes:100-m.yes;
  return {m,cur,value:p.shares*cur/100,cost:p.shares*p.avg/100,pnl:p.shares*(cur-p.avg)/100}; }

function Drawer({open, lang, store, onClose, onTrade, onDeposit}){
  let posVal=0,cost=0; store.positions.forEach(p=>{const r=posValue(p);posVal+=r.value;cost+=r.cost;});
  const total=store.balance+posVal, pnl=posVal-cost, pct=cost>0?pnl/cost*100:0;
  return h(React.Fragment,null,
    h('div',{className:'w-draw-mask'+(open?' on':''),onClick:onClose}),
    h('div',{className:'w-draw'+(open?' on':'')},
      h('div',{className:'w-draw-h'},
        h('div',{style:{fontSize:19,fontWeight:800,flex:1}}, t('nav_portfolio',lang)),
        h('button',{className:'w-x',onClick:onClose}, h('svg',{width:14,height:14,viewBox:'0 0 14 14'},h('path',{d:'M1 1l12 12M13 1L1 13',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round'})))),
      h('div',{className:'w-draw-body'},
        h('div',{className:'w-balcard'},
          h('div',{className:'label'}, t('totalBal',lang)),
          h('div',{className:'v tnum'}, money(total)),
          h('div',{style:{display:'inline-flex',gap:6,fontSize:13,fontWeight:700,marginTop:8,padding:'4px 10px',borderRadius:8,color:pnl>=0?'var(--pos)':'var(--neg)',background:pnl>=0?'var(--yes-soft)':'var(--no-soft)'}},
            (pnl>=0?'▲ ':'▼ ')+money(pnl)+' · '+(pnl>=0?'+':'−')+Math.abs(pct).toFixed(1)+'%'),
          h('div',{style:{display:'flex',gap:18,marginTop:16}},
            h('div',null, h('div',{className:'label'}, t('available',lang)), h('div',{className:'tnum',style:{fontWeight:800,fontSize:17,marginTop:3}}, money(store.balance))),
            h('div',null, h('div',{className:'label'}, t('inPositions',lang)), h('div',{className:'tnum',style:{fontWeight:800,fontSize:17,marginTop:3}}, money(posVal))))),
        h('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,margin:'16px 0'}},
          h('button',{className:'btn',style:{background:'var(--gold)',color:'var(--navy-deep)'},onClick:onDeposit}, t('deposit',lang)),
          h('button',{className:'btn ghost',onClick:()=>store.toastWithdraw()}, t('withdraw',lang))),
        h('div',{className:'label',style:{margin:'8px 0 4px'}}, t('positions',lang)),
        store.positions.length? store.positions.map((p,i)=>{
          const {m,value,pnl}=posValue(p); const pc=(p.shares*p.avg/100)>0?pnl/(p.shares*p.avg/100)*100:0;
          return h('div',{key:p.id,className:'w-posrow',onClick:()=>onTrade(m,p.side)},
            h('div',{className:'w-mthumb',style:{width:42,height:42,fontSize:14,background:`color-mix(in srgb, ${m.img} 20%, var(--surface-2))`,color:m.img}}, CAT_LABEL[m.cat][lang].slice(0,1)),
            h('div',{style:{flex:1,minWidth:0}},
              h('div',{style:{fontSize:14,fontWeight:600,lineHeight:1.3,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}, m.q[lang]),
              h('div',{style:{display:'flex',gap:7,alignItems:'center',marginTop:4}},
                h('span',{style:{fontSize:10.5,fontWeight:800,padding:'2px 7px',borderRadius:6,color:p.side==='yes'?'var(--yes)':'var(--no)',background:p.side==='yes'?'var(--yes-soft)':'var(--no-soft)'}}, p.side==='yes'?'YES':'NO'),
                h('span',{style:{fontSize:12,color:'var(--text-3)'}}, p.shares+' · '+cents(p.avg)))),
            h('div',{style:{textAlign:'right'}},
              h('div',{className:'tnum',style:{fontWeight:800,fontSize:15}}, money(value)),
              h('div',{className:'tnum',style:{fontSize:12,fontWeight:700,color:pnl>=0?'var(--pos)':'var(--neg)'}}, (pnl>=0?'+':'−')+money(pnl))));
        }) : h('div',{style:{textAlign:'center',color:'var(--text-3)',padding:'30px 0'}}, t('noPositions',lang)))));
}

/* ====================== APP ====================== */
function App(){
  const [lang,setLang]=useState(()=>localStorage.getItem('fw-lang')||'zh');
  const [dir,setDir]=useState(()=>localStorage.getItem('fw-dir')||'A');
  const [theme,setTheme]=useState(()=>localStorage.getItem('fw-theme')||'royal-light');
  const [positions,setPositions]=useState(()=>FX.POSITIONS.map(p=>({...p})));
  const [balance,setBalance]=useState(FX.BALANCE.cash+700);
  const [trade,setTrade]=useState({open:false,m:null,side:'yes'});
  const [drawer,setDrawer]=useState(false);
  const [deposit,setDeposit]=useState(false);
  const [phone,setPhone]=useState(false);
  const [toast,setToast]=useState(null);
  const toastT=useRef();

  useEffect(()=>localStorage.setItem('fw-lang',lang),[lang]);
  useEffect(()=>localStorage.setItem('fw-dir',dir),[dir]);
  useEffect(()=>localStorage.setItem('fw-theme',theme),[theme]);
  useEffect(()=>{document.documentElement.setAttribute('data-theme',theme);},[theme]);

  const showToast=(msg)=>{ setToast(msg); clearTimeout(toastT.current); toastT.current=setTimeout(()=>setToast(null),1900); };
  const store={ positions, balance,
    buy:(marketId,side,amt,price)=>{ const shares=amt/(price/100); setBalance(b=>b-amt);
      setPositions(ps=>{ const i=ps.findIndex(p=>p.marketId===marketId&&p.side===side);
        if(i>=0){ const p=ps[i],tot=p.shares+shares,avg=(p.shares*p.avg+shares*price)/tot; const np=[...ps]; np[i]={...p,shares:Math.round(tot),avg:Math.round(avg)}; return np; }
        return [{id:'n'+Date.now(),marketId,side,shares:Math.round(shares),avg:price},...ps]; }); },
    addCash:(n)=>setBalance(b=>Math.max(0,b+n)),
    openPositions:()=>setDrawer(true),
    toastWithdraw:()=>showToast(tx(lang,'Withdraw needs KYC — see mobile app','提现需 KYC —— 见移动端')),
  };
  const openTrade=(m,side)=>setTrade({open:true,m,side});
  const closeTrade=()=>setTrade(s=>({...s,open:false}));
  const onNav=(key)=>{ const el=document.getElementById(key); if(el) window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-60,behavior:'smooth'}); };

  /* reveal on scroll */
  useEffect(()=>{ const els=[...document.querySelectorAll('.w-rev:not(.in)')];
    const io=new IntersectionObserver((ents)=>ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }),{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    els.forEach(el=>io.observe(el)); return ()=>io.disconnect();
  },[dir,lang]);

  const markets=(props)=>h(MarketsSection,Object.assign({lang,onTrade:openTrade,onNav},props));
  const sections = {
    A:[ h(TalentsSection,{key:'tal',lang,onTrade:openTrade,onNav,id:'talents'}),
        h(EventsSection,{key:'ev',lang,onTrade:openTrade,onTickets:()=>showToast(tx(lang,'Tickets — checkout demo','购票 —— 结账演示')),id:'events'}),
        markets({key:'mk',id:'markets'}),
        h(FansSection,{key:'fan',lang,onTrade:openTrade,id:'fans'}) ],
    B:[ markets({key:'mk',id:'markets',featured:FX.market('assa')}),
        h(TalentsSection,{key:'tal',lang,onTrade:openTrade,onNav,id:'talents',compact:true}),
        h(EventsSection,{key:'ev',lang,onTrade:openTrade,onTickets:()=>showToast(tx(lang,'Tickets — checkout demo','购票 —— 结账演示')),id:'events'}),
        h(FansSection,{key:'fan',lang,onTrade:openTrade,id:'fans'}) ],
    C:[ h(PairsSection,{key:'pr',lang,onTrade:openTrade,id:'talents'}),
        h(EventsSection,{key:'ev',lang,onTrade:openTrade,onTickets:()=>showToast(tx(lang,'Tickets — checkout demo','购票 —— 结账演示')),id:'events'}),
        markets({key:'mk',id:'markets',compact:true}),
        h(FansSection,{key:'fan',lang,onTrade:openTrade,id:'fans'}) ],
  }[dir];

  return h('div',{className:'w-root'},
    h(Nav,{lang,balance,onPositions:()=>setDrawer(true),onDeposit:()=>setDeposit(true),toggleLang:()=>setLang(l=>l==='en'?'zh':'en'),onNav}),
    h(Hero,{direction:dir,lang,onTrade:openTrade,onNav}),
    h(Ticker,{lang}),
    sections,
    h(Footer,{lang,onNav}),

    h(TradeModal,{state:trade,lang,store,onClose:closeTrade,onToast:showToast,onDeposit:()=>{closeTrade();setDeposit(true);}}),
    h(DepositModal,{open:deposit,lang,store,onClose:()=>setDeposit(false),onToast:showToast}),
    h(Drawer,{open:drawer,lang,store,onClose:()=>setDrawer(false),onTrade:(m,s)=>{setDrawer(false);openTrade(m,s);},onDeposit:()=>{setDrawer(false);setDeposit(true);}}),

    /* mobile overlay */
    h('div',{className:'w-phone-mask'+(phone?' on':''),onClick:()=>setPhone(false)},
      h('div',{style:{color:'var(--gold-soft)',fontWeight:700,fontSize:13,letterSpacing:'.1em',textTransform:'uppercase'}}, tx(lang,'Sorak · one-thumb betting','Sorak · 单手下注')),
      h('div',{className:'w-phone-frame',onClick:e=>e.stopPropagation()}, h('iframe',{src:'mobile.html',title:'Sorak mobile'})),
      h('button',{className:'btn',style:{background:'rgba(255,255,255,.1)',color:'var(--cream)'},onClick:()=>setPhone(false)}, tx(lang,'Close','关闭'))),

    /* studio control */
    h('div',{className:'w-studio'},
      h('span',{className:'lbl'}, tx(lang,'Direction','方向')),
      h('div',{className:'w-seg'},
        [['A',tx(lang,'A 看台','A 看台')],['B',tx(lang,'B 交易','B 交易')],['C',tx(lang,'C 对开','C 对开')]].map(([k,l])=>
          h('button',{key:k,className:dir===k?'on':'',onClick:()=>setDir(k)}, l))),
      h('div',{className:'div'}),
      h('button',{className:'w-mini',title:'Theme',onClick:()=>setTheme(t=>t==='royal-light'?'royal-dark':'royal-light')}, theme==='royal-light'?'🌙':'☀'),
      h('button',{className:'w-mini',title:'Language',onClick:()=>setLang(l=>l==='en'?'zh':'en')}, lang==='en'?'EN':'中'),
      h('button',{className:'w-mini',title:'Mobile',style:{width:'auto',padding:'0 13px',gap:5},onClick:()=>setPhone(true)}, '📱'),
      h('button',{className:'w-mini',title:'Live 带盘直播',style:{width:'auto',padding:'0 13px',gap:5,color:'#FF5364'},onClick:()=>{window.location.href='index.html';}}, '🔴 LIVE')),

    h('div',{className:'w-toast'+(toast?' on':'')}, toast));
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
})();
