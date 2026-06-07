/* ============================================================
   FORESEE mobile — Markets + Market Detail (+ trade sheet)
   window.SM = { Home, MarketDetail }
   ============================================================ */
(function(){
const h = React.createElement;
const { useState, useRef, useEffect } = React;
const FX = window.FX, MX = window.MX;
const { t, money, cents, signed, Sparkline, CAT_LABEL, CATS, MARKETS } = FX;
const { MarketCard, PushHeader, Segment } = MX;

/* ---------------- HOME / MARKETS ---------------- */
function Home({theme, lang, nav, ui}){
  const [cat,setCat]=useState('all');
  const [q,setQ]=useState('');
  let list = MARKETS.filter(m=>cat==='all'||m.cat===cat);
  if(q.trim()){ const s=q.toLowerCase(); list=list.filter(m=>m.q[lang].toLowerCase().includes(s)||m.q.en.toLowerCase().includes(s)); }
  const featured = MARKETS.find(m=>m.id==='assa');

  return h('div',{className:'mx-app'},
    h('div',{className:'mx-head'},
      h('div',{className:'mx-head-row'},
        h(FX.Logo,{size:26}),
        h('div',{className:'mx-brand'}, 'Foresee'),
        h('button',{className:'mx-icon-btn',onClick:ui.toggleLang,title:'Language'},
          h('span',{style:{fontSize:12,fontWeight:800}}, lang==='en'?'EN':'中')),
        h('button',{className:'mx-icon-btn',onClick:ui.toggleTheme,title:'Theme'},
          theme==='dark'
            ? h('svg',{width:18,height:18,viewBox:'0 0 24 24',fill:'none'},h('circle',{cx:12,cy:12,r:5,fill:'currentColor'}),h('path',{d:'M12 1v3M12 20v3M4 12H1M23 12h-3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round'}))
            : h('svg',{width:18,height:18,viewBox:'0 0 24 24',fill:'none'},h('path',{d:'M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z',fill:'currentColor'})))),
      h('div',{className:'mx-search'},
        h('svg',{width:17,height:17,viewBox:'0 0 18 18',fill:'none'},h('circle',{cx:8,cy:8,r:6,stroke:'currentColor',strokeWidth:1.8}),h('path',{d:'M16 16l-3.5-3.5',stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round'})),
        h('input',{value:q,onChange:e=>setQ(e.target.value),placeholder:t('search',lang)})),
      h('div',{className:'mx-chips'},
        CATS.map(c=>h('button',{key:c.key,className:'chip'+(cat===c.key?' on':''),onClick:()=>setCat(c.key)}, c[lang])))),

    h('div',{className:'mx-body f-scroll'},
      cat==='all'&&!q && h('div',{style:{padding:'14px 18px 0'}}, h(FeaturedCard,{m:featured,lang,onOpen:(m,s)=>nav.push('detail',{id:m.id,side:s})})),
      h('div',{className:'mx-sec'},
        h('div',{className:'mx-sec-h'}, h('span',{className:'t'}, cat==='all'?(lang==='zh'?'全部市场':'All markets'):CATS.find(c=>c.key===cat)[lang]),
          h('span',{style:{fontSize:12.5,color:'var(--text-3)'}}, list.length+(lang==='zh'?' 个市场':' markets'))),
        list.map((m,i)=>h(MarketCard,{key:m.id,m,lang,idx:i,onOpen:(mm,s)=>nav.push('detail',{id:mm.id,side:s})})),
        list.length===0 && h('div',{style:{textAlign:'center',color:'var(--text-3)',padding:'40px 0',fontSize:14}}, lang==='zh'?'没有匹配的市场':'No markets found'))));
}

function FeaturedCard({m,lang,onOpen}){
  const cl = CAT_LABEL[m.cat][lang];
  return h('div',{className:'mx-card',style:{background:`linear-gradient(150deg, color-mix(in srgb, ${m.img} 16%, var(--surface)), var(--surface))`,borderColor:`color-mix(in srgb, ${m.img} 24%, var(--border))`,marginBottom:0},onClick:()=>onOpen(m,'yes')},
    h('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:10}},
      h('span',{className:'cat',style:{color:m.img,background:`color-mix(in srgb, ${m.img} 16%, transparent)`}},h('span',{className:'dot'}),cl),
      h('span',{style:{fontSize:11,fontWeight:700,color:'var(--text-3)',letterSpacing:'.05em',textTransform:'uppercase'}}, lang==='zh'?'🔥 焦点':'🔥 Featured')),
    h('div',{style:{fontSize:21,fontWeight:800,lineHeight:1.18,letterSpacing:'-.02em'}}, m.q[lang]),
    h('div',{style:{display:'flex',alignItems:'flex-end',gap:10,margin:'14px 0 12px'}},
      h('div',{style:{fontSize:40,fontWeight:800,letterSpacing:'-.03em',lineHeight:1}}, cents(m.yes)),
      h('div',{style:{fontSize:13,color:'var(--text-2)',fontWeight:600,paddingBottom:5}}, t('chance',lang)),
      h('div',{className:'mx-chg '+(m.change>=0?'up':'down'),style:{marginLeft:'auto'}}, (m.change>=0?'▲ ':'▼ ')+Math.abs(m.change)+'¢')),
    h('div',{className:'duo'},
      h('div',{className:'pill yes',onClick:e=>{e.stopPropagation();onOpen(m,'yes');}},h('div',{className:'pt'},t('yes',lang)),h('div',{className:'pp tnum'},cents(m.yes))),
      h('div',{className:'pill no',onClick:e=>{e.stopPropagation();onOpen(m,'no');}},h('div',{className:'pt'},t('no',lang)),h('div',{className:'pp tnum'},cents(100-m.yes)))));
}

/* ---------------- MARKET DETAIL ---------------- */
function MarketDetail({id, side:side0, theme, lang, nav, ui, store}){
  const m = FX.market(id);
  const [side,setSide]=useState(side0||'yes');
  const [range,setRange]=useState('1W');
  const [tab,setTab]=useState('rules');
  const [sheet,setSheet]=useState(false);
  const price = side==='yes'? m.yes : 100-m.yes;
  const cl = CAT_LABEL[m.cat][lang];

  return h('div',{className:'mx-app'},
    h(PushHeader,{title:cl,onBack:nav.pop,
      right:h('button',{className:'mx-icon-btn',style:{width:36,height:36},onClick:()=>ui.toast(lang==='zh'?'链接已复制':'Link copied')},
        h('svg',{width:16,height:16,viewBox:'0 0 24 24',fill:'none'},h('path',{d:'M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v13',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'})))}),

    h('div',{className:'mx-body f-scroll',style:{paddingBottom:8}},
      /* question */
      h('div',{style:{padding:'14px 18px 0'}},
        h('div',{style:{display:'flex',gap:13,alignItems:'flex-start'}},
          h('div',{className:'imgph',style:{width:50,height:50,background:`color-mix(in srgb, ${m.img} 22%, var(--surface-2))`,color:m.img,fontSize:16,fontWeight:800,borderColor:'transparent'}}, cl.slice(0,1)),
          h('div',{style:{flex:1}},
            h('span',{className:'cat',style:{color:m.img,background:`color-mix(in srgb, ${m.img} 13%, transparent)`}},h('span',{className:'dot'}),cl),
            h('div',{style:{fontSize:20,fontWeight:800,lineHeight:1.22,letterSpacing:'-.02em',marginTop:8,textWrap:'pretty'}}, m.q[lang])))),

      /* chance hero */
      h('div',{style:{padding:'18px 18px 6px'}},
        h('div',{className:'mx-chance'},
          h('div',null,
            h('div',{className:'big tnum',style:{color:'var(--yes)'}}, cents(m.yes)),
            h('div',{className:'lab'}, (lang==='zh'?'YES · ':'YES · ')+t('chance',lang))),
          h('div',{className:'mx-chg '+(m.change>=0?'up':'down')}, (m.change>=0?'▲ ':'▼ ')+Math.abs(m.change)+'¢ '+(lang==='zh'?'24小时':'24h'))),
        h('div',{style:{marginTop:14,width:'100%'}},
          h(Sparkline,{data:m.chart,color:'var(--yes)',w:366,h:150,sw:2.4})),
        h('div',{style:{display:'flex',justifyContent:'center',marginTop:10}},
          h(Segment,{value:range,onChange:setRange,options:[{k:'1D',label:'1D'},{k:'1W',label:'1W'},{k:'1M',label:'1M'},{k:'ALL',label:lang==='zh'?'全部':'ALL'}]}))),

      /* select side */
      h('div',{style:{padding:'8px 18px 4px'}},
        h('div',{className:'duo'},
          h('div',{className:'pill yes lg'+(side==='yes'?' on':''),onClick:()=>setSide('yes')},
            h('div',{className:'pt'}, t('buyYes',lang)),
            h('div',{className:'pp tnum'}, cents(m.yes)),
            h('div',{className:'ps'}, (lang==='zh'?'赢 $1.00':'Win $1.00')+' → +'+Math.round((100-m.yes)/m.yes*100)+'%')),
          h('div',{className:'pill no lg'+(side==='no'?' on':''),onClick:()=>setSide('no')},
            h('div',{className:'pt'}, t('buyNo',lang)),
            h('div',{className:'pp tnum'}, cents(100-m.yes)),
            h('div',{className:'ps'}, (lang==='zh'?'赢 $1.00':'Win $1.00')+' → +'+Math.round(m.yes/(100-m.yes)*100)+'%')))),

      /* tabs */
      h('div',{style:{padding:'14px 18px 0'}},
        h('div',{style:{display:'flex',gap:18,borderBottom:'1px solid var(--border)'}},
          [['rules',t('rules',lang)],['book',t('orderbook',lang)],['comments',t('comments',lang)]].map(([k,lab])=>
            h('button',{key:k,onClick:()=>setTab(k),style:{background:'none',border:'none',cursor:'pointer',
              fontFamily:'var(--font-ui)',fontSize:14,fontWeight:700,padding:'10px 0',color:tab===k?'var(--text)':'var(--text-3)',
              borderBottom:'2px solid '+(tab===k?'var(--brand)':'transparent'),marginBottom:-1}}, lab)))),

      h('div',{className:'mx-sec',style:{paddingTop:14}},
        tab==='rules'&&h(RulesTab,{m,lang}),
        tab==='book'&&h(OrderBook,{m,lang}),
        tab==='comments'&&h(Comments,{m,lang})),

      /* risk note */
      h('div',{style:{margin:'4px 18px 10px',fontSize:11.5,color:'var(--text-3)',lineHeight:1.5,display:'flex',gap:8}},
        h('span',null,'⚠'), h('span',null, t('riskNote',lang)))),

    /* sticky trade dock */
    h('div',{className:'mx-dock'},
      h('button',{className:'btn block '+(side==='yes'?'yes':'no'),style:{fontSize:16},onClick:()=>setSheet(true)},
        (side==='yes'?t('buyYes',lang):t('buyNo',lang))+' · '+cents(price))),

    /* trade sheet */
    h(TradeSheet,{open:sheet,onClose:()=>setSheet(false),m,side,setSide,lang,store,ui,nav}));
}

function RulesTab({m,lang}){
  return h('div',{className:'fade-in'},
    h('div',{className:'label'}, t('about',lang)),
    h('div',{style:{fontSize:14.5,lineHeight:1.55,color:'var(--text)',marginTop:8}}, m.desc[lang]),
    h('div',{className:'card',style:{padding:14,marginTop:14}},
      h('div',{className:'kv'}, h('span',{className:'k'}, t('resolves',lang)), h('span',{className:'v',style:{fontSize:13,textAlign:'right',maxWidth:'62%'}}, m.src[lang])),
      h('div',{className:'kv'}, h('span',{className:'k'}, t('vol',lang)), h('span',{className:'v tnum'}, money(m.vol,0))),
      h('div',{className:'kv'}, h('span',{className:'k'}, t('ends',lang)), h('span',{className:'v'}, lang==='zh'?m.endZh:m.end))));
}

function OrderBook({m,lang}){
  const yes=m.yes;
  const asks=[2,1,0].map(i=>({px:yes+1+i, sz:Math.round(400+Math.random()*1800)}));
  const bids=[0,1,2].map(i=>({px:yes-1-i, sz:Math.round(400+Math.random()*1800)}));
  const maxSz=Math.max(...[...asks,...bids].map(r=>r.sz));
  const row=(r,kind)=>h('div',{key:kind+r.px,className:'ob-row mono'},
    h('div',{className:'ob-bg',style:{width:(r.sz/maxSz*100)+'%',background:kind==='ask'?'var(--no-soft)':'var(--yes-soft)'}}),
    h('div',{className:'px',style:{color:kind==='ask'?'var(--no)':'var(--yes)',position:'relative'}}, cents(r.px)),
    h('div',{style:{textAlign:'right',color:'var(--text-2)',position:'relative'}}, r.sz.toLocaleString()),
    h('div',{style:{textAlign:'right',color:'var(--text-3)',position:'relative'}}, '$'+(r.sz*r.px/100).toFixed(0)));
  return h('div',{className:'fade-in'},
    h('div',{className:'ob-row',style:{color:'var(--text-3)',fontSize:11,fontWeight:700,letterSpacing:'.04em',textTransform:'uppercase'}},
      h('div',null,lang==='zh'?'价格':'Price'),h('div',{style:{textAlign:'right'}},lang==='zh'?'数量':'Shares'),h('div',{style:{textAlign:'right'}},lang==='zh'?'总额':'Total')),
    asks.map(r=>row(r,'ask')),
    h('div',{style:{display:'flex',alignItems:'center',gap:8,padding:'9px 0',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',margin:'2px 0'}},
      h('span',{className:'mono',style:{fontSize:18,fontWeight:700,color:'var(--yes)'}}, cents(yes)),
      h('span',{style:{fontSize:12,color:'var(--text-3)'}}, lang==='zh'?'最新成交':'Last traded')),
    bids.map(r=>row(r,'bid')));
}

function Comments({m,lang}){
  const data=[
    {u:'@maxedout', av:'#16C784', en:'Liquidity looks deep here, easy to size in.', zh:'流动性很好,方便加仓。', t:'1h'},
    {u:'@dca_daily', av:'#F5A623', en:'Resolution source is clear. No ambiguity this time.', zh:'结算来源很明确,这次没有歧义。', t:'3h'},
    {u:'@skeptic', av:'#FF3B47', en:'72¢ on NO still feels rich given the trend.', zh:'看趋势的话,NO 72¢ 还是偏贵。', t:'6h'},
  ];
  return h('div',{className:'fade-in'},
    data.map((c,i)=>h('div',{key:i,style:{display:'flex',gap:11,padding:'12px 0',borderBottom:i<2?'1px solid var(--border)':'none'}},
      h('div',{style:{width:34,height:34,borderRadius:11,background:`color-mix(in srgb, ${c.av} 22%, var(--surface-2))`,color:c.av,display:'grid',placeItems:'center',fontWeight:800,fontSize:13,flex:'none'}}, c.u[1].toUpperCase()),
      h('div',{style:{flex:1}},
        h('div',{style:{display:'flex',gap:8,alignItems:'baseline'}}, h('b',{style:{fontSize:13.5}},c.u), h('span',{style:{fontSize:12,color:'var(--text-3)'}},c.t)),
        h('div',{style:{fontSize:14,marginTop:3,lineHeight:1.45}}, c[lang])))),
    h('div',{style:{display:'flex',gap:9,marginTop:14}},
      h('input',{placeholder:lang==='zh'?'说点什么…':'Add a comment…',style:{flex:1,background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:11,padding:'11px 13px',fontFamily:'var(--font-ui)',fontSize:14,color:'var(--text)',outline:'none'}}),
      h('button',{className:'btn primary',style:{padding:'11px 16px'}}, lang==='zh'?'发送':'Post')));
}

/* ---------------- TRADE SHEET ---------------- */
function TradeSheet({open,onClose,m,side,setSide,lang,store,ui,nav}){
  const [amt,setAmt]=useState('');
  const [stage,setStage]=useState('input'); // input | placing | done
  useEffect(()=>{ if(open){setAmt('');setStage('input');} },[open]);
  const price = side==='yes'? m.yes : 100-m.yes;
  const a = parseFloat(amt)||0;
  const shares = a>0? a/(price/100) : 0;
  const payout = shares*1;
  const profit = payout - a;
  const enough = a>0 && a<=store.balance+0.001;

  const press=(k)=>{ setStage('input'); if(k==='del'){setAmt(s=>s.slice(0,-1));return;}
    if(k==='.'){ if(amt.includes('.'))return; setAmt(s=>(s||'0')+'.'); return; }
    setAmt(s=>{ const n=s+k; if(/\.\d\d\d/.test(n))return s; return n.replace(/^0(?=\d)/,''); }); };
  const quick=(v)=>{ setStage('input'); setAmt(String((parseFloat(amt)||0)+v)); };

  const place=()=>{ setStage('placing');
    setTimeout(()=>{ store.buy(m.id, side, a, price); setStage('done'); },900); };

  const finish=()=>{ onClose(); ui.toast(t('addedToPos',lang)); setTimeout(()=>nav.toTab('portfolio'),250); };

  return h(React.Fragment,null,
    h('div',{className:'sheet-mask'+(open?' on':''),onClick:onClose}),
    h('div',{className:'sheet'+(open?' on':''),style:{maxHeight:'92%',overflowY:'auto'}},
      h('div',{className:'grip'}),
      stage==='done'
        ? h(DonePanel,{m,side,a,shares,payout,lang,onDone:finish})
        : h('div',{style:{padding:'8px 18px 22px'}},
            h('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:14}},
              h('div',{className:'imgph',style:{width:38,height:38,background:`color-mix(in srgb, ${m.img} 22%, var(--surface-2))`,color:m.img,fontWeight:800,fontSize:13,borderColor:'transparent'}}, CAT_LABEL[m.cat][lang].slice(0,1)),
              h('div',{style:{flex:1,fontSize:14,fontWeight:700,lineHeight:1.25}}, m.q[lang])),

            h('div',{className:'duo',style:{marginBottom:14}},
              h('div',{className:'pill yes'+(side==='yes'?' on':''),onClick:()=>setSide('yes')},h('div',{className:'pt'},t('yes',lang)),h('div',{className:'pp tnum'},cents(m.yes))),
              h('div',{className:'pill no'+(side==='no'?' on':''),onClick:()=>setSide('no')},h('div',{className:'pt'},t('no',lang)),h('div',{className:'pp tnum'},cents(100-m.yes)))),

            h('div',{className:'label',style:{marginBottom:7}}, t('amount',lang)),
            h('div',{className:'amt focus'},
              h('span',{className:'cur'},'$'),
              h('div',{style:{flex:1,fontSize:30,fontWeight:800,letterSpacing:'-.02em',color:a?'var(--text)':'var(--text-3)'}}, amt||'0')),
            h('div',{style:{display:'flex',gap:8,marginTop:10}},
              [10,50,100].map(v=>h('button',{key:v,className:'chip',style:{flex:1,textAlign:'center',justifyContent:'center'},onClick:()=>quick(v)},'+$'+v)),
              h('button',{className:'chip',style:{flex:1,textAlign:'center'},onClick:()=>{setStage('input');setAmt(String(store.balance.toFixed(2)));}}, t('max',lang))),

            /* summary */
            h('div',{className:'card',style:{padding:'4px 14px',marginTop:14}},
              h('div',{className:'kv'}, h('span',{className:'k'}, t('avgPrice',lang)), h('span',{className:'v tnum'}, cents(price))),
              h('div',{className:'kv'}, h('span',{className:'k'}, t('youGet',lang)), h('span',{className:'v tnum'}, shares.toFixed(1)+' '+t('shares',lang))),
              h('div',{className:'kv'}, h('span',{className:'k'}, side==='yes'?t('estReturn',lang):t('estReturnNo',lang)),
                h('span',{className:'v tnum',style:{color:'var(--pos)'}}, money(payout)+'  (+'+(a?Math.round(profit/a*100):0)+'%)'))),
            h('div',{style:{fontSize:11.5,color:'var(--text-3)',margin:'8px 2px 0'}}, t('feeNote',lang)),

            /* keypad */
            h('div',{className:'keypad',style:{marginTop:14}},
              ['1','2','3','4','5','6','7','8','9','.','0','del'].map(k=>
                h('button',{key:k,onClick:()=>press(k)}, k==='del'
                  ? h('svg',{width:24,height:18,viewBox:'0 0 24 18',fill:'none'},h('path',{d:'M8 1h13a2 2 0 012 2v12a2 2 0 01-2 2H8l-7-8 7-8z',stroke:'currentColor',strokeWidth:1.6,strokeLinejoin:'round'}),h('path',{d:'M11 6l6 6M17 6l-6 6',stroke:'currentColor',strokeWidth:1.6,strokeLinecap:'round'}))
                  : k))),

            h('button',{className:'btn block '+(side==='yes'?'yes':'no'),style:{marginTop:14,fontSize:16,opacity:enough?1:.5},disabled:!enough||stage==='placing',onClick:place},
              stage==='placing'? t('processing',lang)
                : a>0 ? (side==='yes'?t('buyYes',lang):t('buyNo',lang))+' · '+money(a)
                : t('pickAmount',lang)),
            !enough&&a>0 && h('div',{style:{textAlign:'center',fontSize:12.5,color:'var(--neg)',marginTop:8}}, lang==='zh'?'余额不足,请先充值':'Insufficient balance — add funds'))));
}

function DonePanel({m,side,a,shares,payout,lang,onDone}){
  return h('div',{style:{padding:'18px 22px 26px',textAlign:'center'}},
    h('div',{style:{width:64,height:64,borderRadius:'50%',background:'var(--yes-soft)',display:'grid',placeItems:'center',margin:'6px auto 14px'}},
      h('svg',{width:30,height:30,viewBox:'0 0 24 24',fill:'none'},h('path',{d:'M5 13l4 4L19 7',stroke:'var(--yes)',strokeWidth:2.6,strokeLinecap:'round',strokeLinejoin:'round'}))),
    h('div',{style:{fontSize:22,fontWeight:800,letterSpacing:'-.02em'}}, t('orderPlaced',lang)),
    h('div',{style:{fontSize:14,color:'var(--text-2)',marginTop:6}}, shares.toFixed(1)+' '+(side==='yes'?'YES':'NO')+' '+t('shares',lang)+' · '+money(a)),
    h('div',{className:'card',style:{padding:'4px 16px',margin:'18px 0',textAlign:'left'}},
      h('div',{className:'kv'}, h('span',{className:'k'}, side==='yes'?t('estReturn',lang):t('estReturnNo',lang)), h('span',{className:'v tnum',style:{color:'var(--pos)'}}, money(payout)))),
    h('button',{className:'btn primary block',style:{fontSize:16},onClick:onDone}, t('done',lang)));
}

window.SM = { Home, MarketDetail };
})();
