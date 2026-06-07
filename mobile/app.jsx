/* ============================================================
   FORESEE mobile — root app (nav stack, store, theme/lang)
   ============================================================ */
(function(){
const h = React.createElement;
const { useState, useEffect, useRef } = React;
const FX = window.FX;
const { Home, MarketDetail } = window.SM;
const { Portfolio, Deposit, Withdraw, Profile, Activity } = window.SW;

const TABS = [
  { key:'markets',   comp:Home,      icon:(a)=>h('path',{d:'M3 13l9-9 9 9M5 11v8a1 1 0 001 1h12a1 1 0 001-1v-8',stroke:'currentColor',strokeWidth:2,fill:a?'currentColor':'none',fillOpacity:a?.12:0,strokeLinecap:'round',strokeLinejoin:'round'}) },
  { key:'portfolio', comp:Portfolio, icon:(a)=>h('path',{d:'M3 7h18v12a1 1 0 01-1 1H4a1 1 0 01-1-1V7zM3 7l2-3h14l2 3M9 12h6',stroke:'currentColor',strokeWidth:2,fill:a?'currentColor':'none',fillOpacity:a?.1:0,strokeLinecap:'round',strokeLinejoin:'round'}) },
  { key:'activity',  comp:Activity,  icon:(a)=>h('path',{d:'M3 12h4l2 6 4-14 2 8h6',stroke:'currentColor',strokeWidth:2,fill:'none',strokeLinecap:'round',strokeLinejoin:'round'}) },
  { key:'profile',   comp:Profile,   icon:(a)=>h('g',null,h('circle',{cx:12,cy:8,r:4,stroke:'currentColor',strokeWidth:2,fill:a?'currentColor':'none',fillOpacity:a?.12:0}),h('path',{d:'M4 21c0-4 3.5-7 8-7s8 3 8 7',stroke:'currentColor',strokeWidth:2,fill:'none',strokeLinecap:'round'})) },
];

function App(){
  const [theme,setTheme]=useState(()=>localStorage.getItem('fx-theme')||'dark');
  const [lang,setLang]=useState(()=>localStorage.getItem('fx-lang')||'en');
  const [tab,setTab]=useState('markets');
  const [stack,setStack]=useState([]);
  const [positions,setPositions]=useState(()=>FX.POSITIONS.map(p=>({...p})));
  const [balance,setBalance]=useState(FX.BALANCE.cash);
  const [verified,setVerified]=useState(false);
  const [toastMsg,setToastMsg]=useState(null);
  const toastTimer=useRef();

  useEffect(()=>{localStorage.setItem('fx-theme',theme);},[theme]);
  useEffect(()=>{localStorage.setItem('fx-lang',lang);},[lang]);

  const ui={
    toggleTheme:()=>setTheme(t=>t==='dark'?'light':'dark'),
    toggleLang:()=>setLang(l=>l==='en'?'zh':'en'),
    toast:(msg)=>{ setToastMsg(msg); clearTimeout(toastTimer.current); toastTimer.current=setTimeout(()=>setToastMsg(null),1900); },
  };
  const nav={
    push:(screen,params)=>setStack(s=>[...s,{screen,params:params||{}}]),
    pop:()=>setStack(s=>s.slice(0,-1)),
    toTab:(tk)=>{ setStack([]); setTab(tk); },
  };
  const store={
    positions, balance, verified,
    setVerified,
    addCash:(n)=>setBalance(b=>Math.max(0,b+n)),
    buy:(marketId,side,amt,price)=>{
      const shares=amt/(price/100);
      setBalance(b=>b-amt);
      setPositions(ps=>{
        const i=ps.findIndex(p=>p.marketId===marketId&&p.side===side);
        if(i>=0){ const p=ps[i]; const tot=p.shares+shares; const avg=(p.shares*p.avg+shares*price)/tot;
          const np=[...ps]; np[i]={...p,shares:Math.round(tot),avg:Math.round(avg)}; return np; }
        return [{id:'n'+Date.now(),marketId,side,shares:Math.round(shares),avg:price},...ps];
      });
    },
  };

  const TabComp = (TABS.find(t=>t.key===tab)||TABS[0]).comp;
  const screenProps={theme,lang,nav,ui,store};

  const renderPush=(entry,i)=>{
    const P={detail:MarketDetail,deposit:Deposit,withdraw:Withdraw,profile:Profile,kyc:Withdraw,activity:Activity}[entry.screen];
    // 'kyc' from profile/portfolio opens Withdraw's KYC flow directly
    const extra = entry.screen==='kyc' ? {forceKyc:true} : {};
    return h('div',{className:'mx-push',key:i,style:{zIndex:50+i}}, h(P,{...screenProps,...entry.params,...extra}));
  };

  return h('div',{className:'f-root',style:{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',padding:'20px'},'data-theme':'royal-'+theme},
    h(IOSDevice,{dark:theme==='dark'},
      h(TabComp,{...screenProps,key:tab}),
      stack.length===0 && h(TabBar,{tab,setTab:nav.toTab,lang}),
      stack.map(renderPush),
      h('div',{className:'toast'+(toastMsg?' on':'')}, toastMsg)));
}

function TabBar({tab,setTab,lang}){
  const labels={markets:FX.t('nav_markets',lang),portfolio:FX.t('nav_portfolio',lang),activity:FX.t('nav_activity',lang),profile:FX.t('nav_profile',lang)};
  return h('div',{className:'mx-tabs'},
    TABS.map(tb=>{const on=tab===tb.key; return h('button',{key:tb.key,className:'mx-tab'+(on?' on':''),onClick:()=>setTab(tb.key)},
      h('svg',{viewBox:'0 0 24 24',fill:'none'}, tb.icon(on)),
      h('span',null, labels[tb.key]));}));
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
})();
