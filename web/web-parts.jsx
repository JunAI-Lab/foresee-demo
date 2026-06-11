/* ============================================================
   FORESEE web — components  (window.FW)
   Luxury royal homepage that fuses the talent house with the
   prediction exchange. Reuses window.FX data + foresee.css atoms.
   ============================================================ */
(function(){
const h = React.createElement;
const { useState, useEffect, useRef } = React;
const FX = window.FX;
const { t, money, cents, signed, Sparkline, Logo, CAT_LABEL } = FX;

/* photo drop slot (user fills via image-slot; `src` is a branded default until then) */
function Portrait({id, accent='#C9A84C', placeholder, shape='rounded', radius=18, src, style}){
  const props = { id, shape, radius:String(radius), fit:'cover', placeholder,
    style:Object.assign({width:'100%',height:'100%','--is-bg':`color-mix(in srgb, ${accent} 22%, var(--surface-2))`,'--is-fg':accent}, style||{}) };
  if(src) props.src = src;
  return h('image-slot', props);
}

/* ---------------- NAV ---------------- */
function Nav({lang, balance, onPositions, onDeposit, toggleLang, onNav}){
  const tx=(en,zh)=>lang==='zh'?zh:en;
  const links=[['markets',tx('Markets','市场')],['talents',tx('Talents','艺人')],['events',tx('Events','活动')],['fans',tx('Fan Zone','粉丝')]];
  return h('nav',{className:'w-nav'},
    h('div',{className:'w-nav-in'},
      h('div',{className:'w-brand',style:{cursor:'pointer'},onClick:()=>onNav('top')},
        h(Logo,{size:34}),
        h('div',null, h('div',{className:'nm'},'Sorak'), h('div',{className:'sb'},tx('Predict · Talent · Live','预测 · 星势力 · 现场')))),
      h('div',{className:'w-links'}, links.map(([k,lab])=>h('a',{key:k,onClick:()=>onNav(k)}, lab))),
      h('div',{className:'w-nav-right'},
        h('div',{className:'w-balpill',onClick:onPositions},
          h('div',null,
            h('div',{className:'bl'}, t('available',lang)),
            h('div',{className:'bv tnum'}, money(balance))),
          h('div',{className:'av'},'A')),
        h('button',{className:'btn gold',style:{padding:'11px 20px'},onClick:onDeposit}, t('deposit',lang)))));
}

/* ---------------- TICKER ---------------- */
function Ticker({lang}){
  const items=FX.MARKETS.slice(0,8);
  const one=(m,i)=>h('span',{key:i,className:'it'},
    h('span',{className:'q'}, m.q[lang].length>46? m.q[lang].slice(0,44)+'…':m.q[lang]),
    h('span',{className:'c'}, cents(m.yes)),
    h('span',{style:{fontWeight:700,color:m.change>=0?'#0a5':'#B3122B'}}, (m.change>=0?'▲':'▼')+Math.abs(m.change)));
  return h('div',{className:'w-ticker'}, h('div',{className:'trk'}, items.map(one), items.map((m,i)=>one(m,i+100))));
}

/* ---------------- YES/NO mini pills ---------------- */
function Duo({m, lang, onTrade, size}){
  return h('div',{className:'duo'},
    h('div',{className:'pill yes'+(size==='lg'?' lg':''),onClick:(e)=>{e.stopPropagation();onTrade(m,'yes');}},
      h('div',{className:'pt'}, t('yes',lang)), h('div',{className:'pp tnum'}, cents(m.yes))),
    h('div',{className:'pill no'+(size==='lg'?' lg':''),onClick:(e)=>{e.stopPropagation();onTrade(m,'no');}},
      h('div',{className:'pt'}, t('no',lang)), h('div',{className:'pp tnum'}, cents(100-m.yes))));
}

/* ---------------- MARKET CARD ---------------- */
function MarketCard({m, lang, onTrade}){
  const cl = CAT_LABEL[m.cat][lang];
  return h('div',{className:'w-mcard w-rev',onClick:()=>onTrade(m,'yes')},
    h('div',{className:'w-mcard-top'},
      h('div',{className:'w-mthumb',style:{background:`color-mix(in srgb, ${m.img} 20%, var(--surface-2))`,color:m.img}}, cl.slice(0,1)),
      h('div',{style:{flex:1,minWidth:0}},
        h('span',{className:'cat',style:{color:m.img,background:`color-mix(in srgb, ${m.img} 13%, transparent)`}},h('span',{className:'dot'}),cl),
        h('div',{className:'w-mq'}, m.q[lang]))),
    h('div',{className:'w-mchance'},
      h('span',{className:'big tnum'}, cents(m.yes)),
      h('span',{className:'lab'}, t('chance',lang)),
      h('span',{className:'chg '+(m.change>=0?'up':'down')}, (m.change>=0?'▲ ':'▼ ')+Math.abs(m.change)+'¢')),
    h('div',{className:'pbar',style:{marginBottom:14}}, h('i',{style:{width:m.yes+'%'}})),
    h('div',{className:'w-mfoot'},
      h(Duo,{m,lang,onTrade}),
      h('div',{className:'w-mmeta'},
        h('span',null, t('vol',lang)+' ', h('b',null,'$'+(m.vol/1e6).toFixed(1)+'M')),
        h('span',null, t('ends',lang)+' ', h('b',null, lang==='zh'? m.endZh.replace('2026年','') : m.end.replace(', 2026',''))),
        h('span',{className:'right'},
          h('svg',{width:14,height:14,viewBox:'0 0 16 16',fill:'none'},h('path',{d:'M2 4.5A2.5 2.5 0 014.5 2h7A2.5 2.5 0 0114 4.5v4A2.5 2.5 0 0111.5 11H7l-3.5 3v-3H4.5A2.5 2.5 0 012 8.5z',stroke:'currentColor',strokeWidth:1.4})),
          h('b',null, m.comments)))));
}

/* ---------------- FEATURED MARKET ---------------- */
function FeaturedMarket({m, lang, onTrade}){
  const cl=CAT_LABEL[m.cat][lang]; const ev=m.event?FX.event(m.event):null;
  return h('div',{className:'w-feat w-rev'},
    h('div',{className:'poster'}, h(Portrait,{id:'feat-'+m.id,accent:m.img,radius:18,src:'assets/ph/ev-poster.png',placeholder:lang==='zh'?'活动主视觉':'Event hero image'}),
      h('div',{style:{position:'absolute',top:14,left:14,zIndex:2}},
        h('span',{className:'cat',style:{color:'#fff',background:'rgba(13,24,56,.7)',backdropFilter:'blur(6px)'}},h('span',{className:'dot',style:{background:m.img}}),cl))),
    h('div',null,
      h('div',{className:'w-eyebrow',style:{color:'var(--gold-soft)'}}, lang==='zh'?'🔥 焦点市场':'🔥 Featured market'),
      h('div',{className:'q'}, m.q[lang]),
      h('div',{className:'chance'},
        h('span',{className:'big'}, cents(m.yes)),
        h('div',null, h('div',{style:{fontSize:13,color:'rgba(244,241,232,.7)',fontWeight:600}}, 'YES · '+t('chance',lang)),
          h('div',{style:{fontSize:13,fontWeight:700,color:m.change>=0?'var(--yes)':'var(--no)',marginTop:2}}, (m.change>=0?'▲ ':'▼ ')+Math.abs(m.change)+'¢ 24h'))),
      h('div',{style:{maxWidth:380,marginBottom:18}}, h(Duo,{m,lang,onTrade,size:'lg'})),
      h('div',{style:{display:'flex',gap:18,fontSize:13,color:'rgba(244,241,232,.7)'}},
        h('span',null, t('vol',lang)+' ', h('b',{style:{color:'var(--gold-soft)'}},money(m.vol,0))),
        ev&&h('span',null, '🎟 ', h('b',{style:{color:'var(--gold-soft)'}}, ev.when[lang])))));
}

/* ---------------- TALENT CARD (with live market) ---------------- */
function TalentCard({r, lang, onTrade, onTickets}){
  const m = r.marketId? FX.market(r.marketId):null;
  return h('div',{className:'w-tcard w-rev'},
    h('div',{className:'ph'},
      h('span',{className:'tag'}, r.tag[lang]),
      h(Portrait,{id:'talent-'+r.id,accent:r.accent,radius:0,shape:'rect',src:'assets/ph/'+r.img+'.png',placeholder:r.name})),
    h('div',{className:'info'},
      h('div',{className:'nm'}, r.name),
      h('div',{className:'role'}, r.role[lang]),
      m? h('div',{className:'w-tmkt'},
          h('div',{className:'ql'}, m.q[lang]),
          h(Duo,{m,lang,onTrade}))
        : h('div',{className:'w-tmkt'},
            h('div',{className:'ql'}, lang==='zh'?'围场现场主持 · 暂无公开盘口':'Live host · no open market yet'),
            h('button',{className:'btn ghost',style:{width:'100%',fontSize:13.5,padding:'11px'},onClick:()=>onTickets&&onTickets()}, lang==='zh'?'查看活动':'See events'))));
}

/* ---------------- EVENT ROW (tickets + outcome market) ---------------- */
function EventRow({e, lang, onTrade, onTickets}){
  const m = e.marketId? FX.market(e.marketId):null;
  return h('div',{className:'w-erow w-rev'},
    h('div',{className:'w-edate'}, h('div',{className:'d'}, e.day), h('div',{className:'m'}, e.mon[lang])),
    h('div',{className:'w-einfo'},
      h('div',{className:'t'}, e.title[lang]),
      h('div',{className:'s'}, e.sub[lang]+' · '+e.venue[lang])),
    m && h('div',{className:'w-emkt',onClick:()=>onTrade(m,'yes')},
      h('div',null, h('div',{className:'pl'}, lang==='zh'?'盘口 YES':'Market YES'), h('div',{style:{fontSize:9.5,color:'var(--text-3)',fontWeight:600,marginTop:1}}, lang==='zh'?'点击交易':'Trade outcome')),
      h('div',{className:'pc tnum'}, cents(m.yes))),
    h('button',{className:'btn'+(e.from>0?' navy':' ghost'),style:{padding:'11px 18px',fontSize:13.5,background:e.from>0?'var(--navy)':undefined,color:e.from>0?'var(--cream)':undefined},onClick:()=>onTickets(e)},
      e.from>0? (lang==='zh'?'购票 · RM'+e.from+'起':'Tickets · RM'+e.from+'+') : (lang==='zh'?'免费登记':'Free RSVP')));
}

/* ---------------- PAIRED SPREAD (direction C) ---------------- */
function Pair({r, lang, flip, onTrade}){
  const m = FX.market(r.marketId);
  return h('div',{className:'w-pair w-rev'+(flip?' flip':'')},
    h('div',{className:'w-pair-media'},
      h('span',{className:'tag'}, r.tag[lang]),
      h(Portrait,{id:'pair-'+r.id,accent:r.accent,radius:0,shape:'rect',src:'assets/ph/'+r.img+'.png',placeholder:r.name})),
    h('div',{className:'w-pair-body'},
      h('span',{className:'cat',style:{color:r.accent,background:`color-mix(in srgb, ${r.accent} 13%, transparent)`}},h('span',{className:'dot'}),r.role[lang]),
      h('div',{className:'nm',style:{marginTop:10}}, r.name),
      h('div',{className:'w-pair-q'}, m.q[lang]),
      h('div',{style:{display:'flex',alignItems:'flex-end',gap:12,marginBottom:14}},
        h('span',{className:'tnum',style:{fontSize:46,fontWeight:800,letterSpacing:'-.03em',lineHeight:.9,color:'var(--yes)'}}, cents(m.yes)),
        h('span',{style:{fontSize:13,color:'var(--text-3)',fontWeight:600,paddingBottom:5}}, 'YES · '+t('chance',lang)),
        h('span',{style:{marginLeft:'auto',fontSize:12.5,color:'var(--text-3)'}}, t('vol',lang)+' '+money(m.vol,0))),
      h('div',{style:{maxWidth:420}}, h(Duo,{m,lang,onTrade,size:'lg'})),
      h('div',{style:{fontSize:12.5,color:'var(--text-3)',marginTop:13,lineHeight:1.5}}, m.desc[lang])));
}

/* ---------------- LEADERBOARD ---------------- */
function Leaderboard({lang, onTrade}){
  const tx=(en,zh)=>lang==='zh'?zh:en;
  const rows=[
    {nm:'@nightmarket', sub:tx('+312% this season','本季 +312%'), amt:'$4,820', av:'#C9A84C'},
    {nm:'@pole_position', sub:tx('14-day streak','连胜 14 天'), amt:'$3,140', av:'#B3122B'},
    {nm:'@suria_stan', sub:tx('Top fan predictor','头号粉丝预言家'), amt:'$2,690', av:'#28396E'},
    {nm:'@apexhunter', sub:tx('Motorsport specialist','赛车专家'), amt:'$1,905', av:'#0E8F5E'},
    {nm:'@frontrow', sub:tx('Concert caller','演唱会神预测'), amt:'$1,420', av:'#A8842B'},
  ];
  const m=FX.market('peoplechoice');
  return h('div',{className:'w-lead'},
    h('div',{className:'w-leadcard w-rev'},
      h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}},
        h('div',{className:'w-serif',style:{fontSize:24}}, tx('Top fan predictors','粉丝预言榜')),
        h('span',{className:'cat'},h('span',{className:'dot'}),tx('This week','本周'))),
      rows.map((r,i)=>h('div',{key:i,className:'w-leadrow'},
        h('div',{className:'rk'}, i+1),
        h('div',{className:'av',style:{background:`color-mix(in srgb, ${r.av} 24%, var(--surface-2))`,display:'grid',placeItems:'center',color:r.av,fontWeight:800}}, r.nm[1].toUpperCase()),
        h('div',{style:{flex:1,minWidth:0}}, h('div',{className:'nm'}, r.nm), h('div',{className:'sub'}, r.sub)),
        h('div',{className:'amt pos'}, r.amt)))),
    h('div',{className:'w-leadcard w-rev',style:{background:'linear-gradient(160deg,#1B2C5E,#0D1838)',color:'var(--cream)',borderColor:'rgba(201,168,76,.3)'}},
      h('div',{className:'w-eyebrow',style:{color:'var(--gold-soft)'}}, tx('People\u2019s choice','人气之选')),
      h('div',{className:'w-serif',style:{fontSize:25,margin:'10px 0 6px',color:'var(--cream)'}}, tx('Who wins this season?','本季花落谁家?')),
      h('div',{style:{fontSize:14,color:'rgba(244,241,232,.72)',lineHeight:1.55,marginBottom:18}}, m.q[lang]),
      h('div',{style:{maxWidth:'100%'}}, h(Duo,{m,lang,onTrade,size:'lg'})),
      h('div',{style:{fontSize:12,color:'rgba(244,241,232,.55)',marginTop:14}}, tx('Settles to the verified fan-vote tally · real USDT payouts','以官方计票结算 · 真实 USDT 结算'))));
}

/* ---------------- FOOTER ---------------- */
function Footer({lang, onNav}){
  const tx=(en,zh)=>lang==='zh'?zh:en;
  return h('footer',{className:'w-foot'},
    h('div',{className:'w-foot-top'},
      h('div',null,
        h('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:4}}, h(Logo,{size:30,mono:true}), h('span',{className:'nm'},'Sorak')),
        h('p',null, tx('A prediction exchange for the talent, motorsport and live events you follow. Trade outcomes in real USDT.','一个面向艺人、赛车与现场活动的预测交易所。用真实 USDT 交易结果。')),
        h('div',{className:'w-risk'}, t('riskNote',lang))),
      h('div',null, h('h4',null,tx('Trade','交易')),
        [['markets',tx('Markets','市场')],['talents',tx('Talents','艺人')],['events',tx('Events','活动赛事')],['fans',tx('Leaderboard','排行榜')]].map(([k,l])=>h('a',{key:k,onClick:()=>onNav(k)},l))),
      h('div',null, h('h4',null,tx('Company','公司')),
        [tx('About','关于'),tx('Careers','招聘'),tx('Press','媒体'),tx('Become a partner','成为合作伙伴')].map((l,i)=>h('a',{key:i},l))),
      h('div',null, h('h4',null,tx('Trust & Safety','合规与安全')),
        [tx('KYC & AML','KYC 与反洗钱'),tx('Risk disclosure','风险披露'),tx('Responsible trading','理性交易'),tx('Terms','用户协议')].map((l,i)=>h('a',{key:i},l)))),
    h('div',{className:'w-foot-bot'},
      h('span',null,'© 2026 Sorak Exchange. '+tx('All rights reserved.','保留所有权利。')),
      h('span',{style:{display:'flex',gap:18}}, h('a',{style:{display:'inline',margin:0}},tx('Privacy','隐私')), h('a',{style:{display:'inline',margin:0}},tx('Terms','条款')))));
}

window.FW = { Portrait, Nav, Ticker, Duo, MarketCard, FeaturedMarket, TalentCard, EventRow, Pair, Leaderboard, Footer };
})();
