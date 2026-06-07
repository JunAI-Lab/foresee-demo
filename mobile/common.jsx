/* ============================================================
   FORESEE mobile — shared components  (window.MX)
   ============================================================ */
(function(){
const h = React.createElement;
const { t, money, cents, signed, Sparkline, CAT_LABEL } = window.FX;

/* push-screen header (back + title + optional right) */
function PushHeader({title, onBack, right}){
  return h('div',{className:'mx-phead'},
    h('button',{className:'mx-back',onClick:onBack,'aria-label':'Back'},
      h('svg',{width:11,height:18,viewBox:'0 0 11 18',fill:'none'},
        h('path',{d:'M9.5 1.5L2 9l7.5 7.5',stroke:'currentColor',strokeWidth:2.4,strokeLinecap:'round',strokeLinejoin:'round'}))),
    h('div',{className:'mx-ptitle'},title),
    h('div',{style:{minWidth:36,display:'flex',justifyContent:'flex-end'}}, right||null));
}

/* category dot color from market.img */
function catDot(m){ return m.img; }

/* market card */
function MarketCard({m, lang, onOpen, idx=0}){
  const cl = CAT_LABEL[m.cat] ? CAT_LABEL[m.cat][lang] : m.cat;
  const chg = m.change;
  return h('div',{className:'mx-card',onClick:()=>onOpen(m,'yes')},
    h('div',{className:'mx-card-top'},
      h('div',{className:'imgph',style:{width:42,height:42,borderColor:'transparent',
        background:`color-mix(in srgb, ${m.img} 22%, var(--surface-2))`,color:m.img,fontSize:13,fontWeight:800}},
        cl.slice(0,1).toUpperCase()),
      h('div',{style:{flex:1,minWidth:0}},
        h('span',{className:'cat',style:{color:m.img,background:`color-mix(in srgb, ${m.img} 13%, transparent)`}},
          h('span',{className:'dot'}), cl),
        h('div',{className:'mx-q'}, m.q[lang]))),
    h('div',{className:'duo',style:{marginTop:12}},
      h('div',{className:'pill yes',onClick:(e)=>{e.stopPropagation();onOpen(m,'yes');}},
        h('div',{className:'pt'}, t('yes',lang)),
        h('div',{className:'pp tnum'}, cents(m.yes))),
      h('div',{className:'pill no',onClick:(e)=>{e.stopPropagation();onOpen(m,'no');}},
        h('div',{className:'pt'}, t('no',lang)),
        h('div',{className:'pp tnum'}, cents(100-m.yes)))),
    h('div',{className:'pbar',style:{marginTop:10}}, h('i',{style:{width:m.yes+'%'}})),
    h('div',{className:'mx-meta'},
      h('span',null, t('vol',lang)+' ', h('b',null, '$'+(m.vol/1e6).toFixed(1)+'M')),
      h('span',null, t('ends',lang)+' ', h('b',null, lang==='zh'?m.endZh.replace('2026年','').replace('月','/').replace('日',''):m.end.replace(', 2026',''))),
      h('span',{style:{marginLeft:'auto',display:'inline-flex',alignItems:'center',gap:4}},
        h('svg',{width:13,height:13,viewBox:'0 0 16 16',fill:'none'},
          h('path',{d:'M2 4.5A2.5 2.5 0 014.5 2h7A2.5 2.5 0 0114 4.5v4A2.5 2.5 0 0111.5 11H7l-3.5 3v-3H4.5A2.5 2.5 0 012 8.5v-4z',
            stroke:'currentColor',strokeWidth:1.4})),
        h('b',null, m.comments))));
}

/* labelled stat */
function Stat({label, value, sub, subClass}){
  return h('div',null,
    h('div',{className:'label'}, label),
    h('div',{style:{fontWeight:800,fontSize:20,letterSpacing:'-.02em',marginTop:3},className:'tnum'}, value),
    sub&&h('div',{className:(subClass||'')+' tnum',style:{fontSize:12.5,fontWeight:600,marginTop:1}}, sub));
}

/* segmented control */
function Segment({options, value, onChange}){
  return h('div',{className:'mx-seg'},
    options.map(o=>h('button',{key:o.k,className:'mx-seg-btn'+(value===o.k?' on':''),onClick:()=>onChange(o.k)}, o.label)));
}

/* compact list row */
function Row({left, title, sub, right, onClick, last}){
  return h('div',{className:'mx-row'+(last?' last':''),onClick},
    left&&h('div',{className:'mx-row-left'}, left),
    h('div',{style:{flex:1,minWidth:0}},
      h('div',{className:'mx-row-title'}, title),
      sub&&h('div',{className:'mx-row-sub'}, sub)),
    right&&h('div',{style:{textAlign:'right',flex:'none'}}, right));
}

window.MX = { PushHeader, MarketCard, Stat, Segment, Row, catDot };
})();
