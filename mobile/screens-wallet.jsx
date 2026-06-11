/* ============================================================
   FORESEE mobile — Portfolio, Deposit, Withdraw, Profile, Activity
   window.SW = { Portfolio, Deposit, Withdraw, Profile, Activity }
   ============================================================ */
(function(){
const h = React.createElement;
const { useState } = React;
const FX = window.FX, MX = window.MX;
const { t, money, cents, signed, CAT_LABEL, MARKETS, TXNS } = FX;
const { PushHeader, Segment, Row } = MX;

/* shared tab header */
function TabHead({title, lang, ui, theme}){
  return h('div',{className:'mx-head'},
    h('div',{className:'mx-head-row'},
      h('div',{className:'mx-h1',style:{flex:1}}, title),
      h('button',{className:'mx-icon-btn',onClick:ui.toggleLang},h('span',{style:{fontSize:12,fontWeight:800}}, lang==='en'?'EN':'中')),
      h('button',{className:'mx-icon-btn',onClick:ui.toggleTheme},
        theme==='dark'
          ? h('svg',{width:18,height:18,viewBox:'0 0 24 24',fill:'none'},h('circle',{cx:12,cy:12,r:5,fill:'currentColor'}),h('path',{d:'M12 1v3M12 20v3M4 12H1M23 12h-3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round'}))
          : h('svg',{width:18,height:18,viewBox:'0 0 24 24',fill:'none'},h('path',{d:'M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z',fill:'currentColor'})))));
}

function posValue(p){ const m=FX.market(p.marketId); const cur=p.side==='yes'?m.yes:100-m.yes;
  const value=p.shares*cur/100, cost=p.shares*p.avg/100; return {m,cur,value,cost,pnl:value-cost}; }

/* ---------------- PORTFOLIO ---------------- */
function Portfolio({theme, lang, nav, ui, store}){
  const [seg,setSeg]=useState('positions');
  const positions = store.positions;
  let posVal=0, cost=0;
  positions.forEach(p=>{ const r=posValue(p); posVal+=r.value; cost+=r.cost; });
  const total = store.balance + posVal;
  const dayPnl = posVal - cost;
  const dayPct = cost>0? dayPnl/cost*100 : 0;

  return h('div',{className:'mx-app'},
    h(TabHead,{title:t('nav_portfolio',lang),lang,ui,theme}),
    h('div',{className:'mx-body f-scroll'},
      h('div',{className:'mx-bal'},
        h('div',{className:'label'}, t('totalBal',lang)),
        h('div',{className:'v tnum'}, money(total)),
        h('div',{className:'pnl',style:{color:dayPnl>=0?'var(--pos)':'var(--neg)',background:dayPnl>=0?'var(--yes-soft)':'var(--no-soft)'}},
          (dayPnl>=0?'▲ ':'▼ ')+signed(dayPnl).replace(/^[+−]/,'')+' · '+(dayPnl>=0?'+':'−')+Math.abs(dayPct).toFixed(1)+'% '+t('todayPnl',lang)),
        h('div',{style:{display:'flex',gap:18,marginTop:16}},
          h('div',null,h('div',{className:'label'},t('available',lang)),h('div',{style:{fontWeight:800,fontSize:17,marginTop:3},className:'tnum'},money(store.balance))),
          h('div',null,h('div',{className:'label'},t('inPositions',lang)),h('div',{style:{fontWeight:800,fontSize:17,marginTop:3},className:'tnum'},money(posVal))))),

      h('div',{className:'mx-actions'},
        h('button',{className:'btn primary',onClick:()=>nav.push('deposit',{})},
          h('svg',{width:18,height:18,viewBox:'0 0 24 24',fill:'none'},h('path',{d:'M12 5v14M5 12h14',stroke:'currentColor',strokeWidth:2.4,strokeLinecap:'round'})), t('deposit',lang)),
        h('button',{className:'btn ghost',onClick:()=>nav.push('withdraw',{})},
          h('svg',{width:18,height:18,viewBox:'0 0 24 24',fill:'none'},h('path',{d:'M12 19V5M5 12l7 7 7-7',stroke:'currentColor',strokeWidth:2.4,strokeLinecap:'round',strokeLinejoin:'round'})), t('withdraw',lang))),

      !store.verified && h('div',{className:'mx-kyc'},
        h('div',{className:'dot'}),
        h('div',{className:'x'}, t('kycNeeded',lang), h('span',null,t('kycSub',lang))),
        h('a',{onClick:()=>nav.push('kyc',{}),style:{cursor:'pointer'}}, t('startKyc',lang))),

      h('div',{className:'mx-sec'},
        h('div',{style:{display:'flex',justifyContent:'center',marginBottom:14}},
          h(Segment,{value:seg,onChange:setSeg,options:[{k:'positions',label:t('positions',lang)},{k:'history',label:t('history',lang)}]})),
        seg==='positions'
          ? (positions.length? positions.map((p,i)=>h(PositionRow,{key:p.id,p,lang,nav,last:i===positions.length-1}))
              : h(EmptyPos,{lang,nav}))
          : TXNS.map((tx,i)=>h(TxnRow,{key:tx.id,tx,lang,last:i===TXNS.length-1})))));
}

function PositionRow({p,lang,nav,last}){
  const {m,cur,value,pnl}=posValue(p);
  const pct = (p.shares*p.avg/100)>0? pnl/(p.shares*p.avg/100)*100 : 0;
  return h('div',{className:'mx-row'+(last?' last':''),onClick:()=>nav.push('detail',{id:m.id,side:p.side})},
    h('div',{className:'imgph',style:{width:42,height:42,background:`color-mix(in srgb, ${m.img} 22%, var(--surface-2))`,color:m.img,fontWeight:800,fontSize:13,borderColor:'transparent'}}, CAT_LABEL[m.cat][lang].slice(0,1)),
    h('div',{style:{flex:1,minWidth:0}},
      h('div',{className:'mx-row-title',style:{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}, m.q[lang]),
      h('div',{style:{display:'flex',alignItems:'center',gap:7,marginTop:4}},
        h('span',{style:{fontSize:11,fontWeight:800,padding:'2px 7px',borderRadius:6,color:p.side==='yes'?'var(--yes)':'var(--no)',background:p.side==='yes'?'var(--yes-soft)':'var(--no-soft)'}}, (p.side==='yes'?'YES':'NO')),
        h('span',{className:'mx-row-sub',style:{margin:0}}, p.shares+' '+t('shares',lang)+' · '+cents(p.avg)))),
    h('div',{style:{textAlign:'right'}},
      h('div',{className:'tnum',style:{fontWeight:800,fontSize:15.5}}, money(value)),
      h('div',{className:'tnum',style:{fontSize:12.5,fontWeight:700,marginTop:2,color:pnl>=0?'var(--pos)':'var(--neg)'}}, (pnl>=0?'+':'−')+money(pnl)+' ('+(pnl>=0?'+':'−')+Math.abs(pct).toFixed(0)+'%)')));
}

function TxnRow({tx,lang,last}){
  const icons={ deposit:['#16C784','↓'], withdraw:['#FF9F0A','↑'], buy:['#3B6EE8','+'], sell:['#A855F7','−'], settle:['#9A9AA2','✓'] };
  const [col,gl]=icons[tx.type];
  const label = tx.mkt? FX.market(tx.mkt).q[lang] : (tx.type==='deposit'?t('deposit',lang):t('withdraw',lang));
  const kind={deposit:lang==='zh'?'充值':'Deposit',withdraw:lang==='zh'?'提现':'Withdraw',buy:lang==='zh'?'买入':'Buy',sell:lang==='zh'?'卖出':'Sell',settle:lang==='zh'?'结算':'Settled'}[tx.type];
  return h('div',{className:'mx-row'+(last?' last':'')},
    h('div',{style:{width:38,height:38,borderRadius:11,display:'grid',placeItems:'center',flex:'none',fontWeight:800,fontSize:16,color:col,background:`color-mix(in srgb, ${col} 16%, var(--surface-2))`}}, gl),
    h('div',{style:{flex:1,minWidth:0}},
      h('div',{className:'mx-row-title',style:{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}, label),
      h('div',{className:'mx-row-sub'}, kind+' · '+tx.sub[lang]+' · '+tx.time[lang])),
    tx.amt!==0 && h('div',{className:'tnum',style:{fontWeight:800,fontSize:15,color:tx.amt>0?'var(--pos)':'var(--text)'}}, (tx.amt>0?'+':'−')+money(tx.amt)));
}

function EmptyPos({lang,nav}){
  return h('div',{style:{textAlign:'center',padding:'46px 20px'}},
    h('div',{style:{fontSize:34,marginBottom:10,opacity:.5}},'🗂'),
    h('div',{style:{fontWeight:700,fontSize:16}}, t('noPositions',lang)),
    h('button',{className:'btn primary',style:{marginTop:16},onClick:()=>nav.toTab('markets')}, t('browse',lang)));
}

/* ---------------- DEPOSIT ---------------- */
function Deposit({lang, nav, ui, store}){
  const [method,setMethod]=useState('crypto');
  const addr='TZ4Up1Vg9k7xN3Sorak8mQpYrL2sWcDx';
  return h('div',{className:'mx-app'},
    h(PushHeader,{title:t('depositTitle',lang),onBack:nav.pop}),
    h('div',{className:'mx-body f-scroll',style:{padding:'16px 18px'}},
      h('div',{style:{display:'flex',flexDirection:'column',gap:10,marginBottom:18}},
        h(MethodCard,{on:method==='crypto',onClick:()=>setMethod('crypto'),icon:'₮',title:t('crypto',lang),sub:'TRC-20 · ERC-20',lang}),
        h(MethodCard,{on:method==='fiat',onClick:()=>setMethod('fiat'),icon:'💳',title:t('fiat',lang),sub:lang==='zh'?'Visa · Mastercard · 银行转账':'Visa · Mastercard · Bank',lang})),
      method==='crypto'? h(CryptoDeposit,{addr,lang,ui}) : h(FiatDeposit,{lang,ui,store,nav})));
}
function MethodCard({on,onClick,icon,title,sub,lang}){
  return h('div',{className:'method'+(on?' on':''),onClick},
    h('div',{className:'mi',style:{fontSize:20}}, icon),
    h('div',{style:{flex:1}}, h('div',{className:'mt'},title), h('div',{className:'ms'},sub)),
    h('div',{style:{width:20,height:20,borderRadius:'50%',border:'2px solid '+(on?'var(--brand)':'var(--border-2)'),display:'grid',placeItems:'center'}},
      on&&h('div',{style:{width:10,height:10,borderRadius:'50%',background:'var(--brand)'}})));
}
function CryptoDeposit({addr,lang,ui}){
  return h('div',{className:'fade-in'},
    h('div',{style:{display:'flex',justifyContent:'center',marginBottom:8}},
      h('div',{style:{padding:6,background:'var(--surface)',border:'1px solid var(--border)',borderRadius:20}}, h(QR,{}))),
    h('div',{style:{textAlign:'center',fontSize:12.5,color:'var(--text-3)',margin:'4px 0 16px',lineHeight:1.4}}, t('scanAddr',lang)),
    h('div',{className:'card',style:{padding:14}},
      h('div',{className:'kv'}, h('span',{className:'k'}, t('network',lang)), h('span',{className:'v'},'Tron (TRC-20)')),
      h('div',{className:'kv'}, h('span',{className:'k'}, t('minDeposit',lang)), h('span',{className:'v tnum'},'10 USDT'))),
    h('div',{style:{display:'flex',gap:8,alignItems:'center',background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:12,padding:'12px 14px',marginTop:12}},
      h('div',{className:'mono',style:{flex:1,fontSize:12.5,wordBreak:'break-all',color:'var(--text-2)'}}, addr),
      h('button',{className:'btn ghost',style:{padding:'9px 13px',fontSize:13},onClick:()=>ui.toast(t('copied',lang))}, t('copyAddr',lang))),
    h('div',{style:{fontSize:11.5,color:'var(--text-3)',marginTop:12,lineHeight:1.5,display:'flex',gap:7}},
      h('span',null,'⚠'), h('span',null, lang==='zh'?'请勿向此地址转入非 USDT 资产或使用其他网络,否则可能永久丢失。':'Do not send non-USDT assets or use another network — funds may be lost permanently.')));
}
function FiatDeposit({lang,ui,store,nav}){
  const [amt,setAmt]=useState('100');
  return h('div',{className:'fade-in'},
    h('div',{className:'label',style:{marginBottom:7}}, t('amount',lang)),
    h('div',{className:'amt focus'}, h('span',{className:'cur'},'$'), h('input',{value:amt,onChange:e=>setAmt(e.target.value.replace(/[^\d.]/g,'')),inputMode:'decimal'})),
    h('div',{style:{display:'flex',gap:8,marginTop:10}}, [50,100,500].map(v=>h('button',{key:v,className:'chip',style:{flex:1,justifyContent:'center'},onClick:()=>setAmt(String(v))},'$'+v))),
    h('div',{className:'card',style:{padding:14,marginTop:16}},
      h('div',{className:'label',style:{marginBottom:10}}, lang==='zh'?'银行卡信息':'Card details'),
      h(FakeField,{label:lang==='zh'?'卡号':'Card number',val:'4242  4242  4242  4242'}),
      h('div',{style:{display:'flex',gap:10,marginTop:10}},
        h('div',{style:{flex:1}},h(FakeField,{label:lang==='zh'?'有效期':'Expiry',val:'08 / 28'})),
        h('div',{style:{flex:1}},h(FakeField,{label:'CVC',val:'•••'})))),
    h('button',{className:'btn primary block',style:{marginTop:16,fontSize:16},onClick:()=>{store.addCash(parseFloat(amt)||0);ui.toast(lang==='zh'?'充值成功':'Funds added');nav.pop();}},
      t('deposit',lang)+' '+money(parseFloat(amt)||0)));
}
function FakeField({label,val}){
  return h('div',null, h('div',{style:{fontSize:11,color:'var(--text-3)',fontWeight:600,marginBottom:4}},label),
    h('div',{style:{background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:10,padding:'11px 13px',fontFamily:'var(--font-mono)',fontSize:14,color:'var(--text-2)'}}, val));
}
function QR(){
  const cells=[]; const seed=[1,0,1,1,0,1,0,1,1,1,0,0,1,0,1,1,0,1,1,0,1,0,0,1,1];
  for(let y=0;y<13;y++)for(let x=0;x<13;x++){ const on=((x*7+y*13+seed[(x+y)%25])%3===0)||((x<4&&y<4)||(x>8&&y<4)||(x<4&&y>8));
    if(on)cells.push(h('rect',{key:x+'-'+y,x:x*13,y:y*13,width:13,height:13,rx:2,fill:'#111'})); }
  const eye=(ex,ey)=>[h('rect',{key:'e'+ex+ey,x:ex,y:ey,width:39,height:39,rx:8,fill:'none',stroke:'#111',strokeWidth:6}),h('rect',{key:'p'+ex+ey,x:ex+13,y:ey+13,width:13,height:13,rx:3,fill:'#111'})];
  return h('svg',{width:160,height:160,viewBox:'0 0 169 169',style:{display:'block'}},
    h('rect',{width:169,height:169,rx:10,fill:'#fff'}), cells, eye(8,8),eye(122,8),eye(8,122));
}

/* ---------------- WITHDRAW ---------------- */
function Withdraw({lang, nav, ui, store}){
  const [stage,setStage]=useState(store.verified?'form':'gate'); // gate | kyc | form | twofa
  const [amt,setAmt]=useState('');
  const a=parseFloat(amt)||0; const fee=1; const receive=Math.max(0,a-fee);
  const ok=a>0 && a<=store.balance;

  if(stage==='gate') return h(KycGate,{lang,nav,onStart:()=>setStage('kyc')});
  if(stage==='kyc') return h(KycFlow,{lang,onDone:()=>{store.setVerified(true);setStage('form');ui.toast(lang==='zh'?'身份已验证':'Identity verified');},onBack:nav.pop});
  if(stage==='twofa') return h(TwoFA,{lang,onBack:()=>setStage('form'),onDone:()=>{store.addCash(-a);ui.toast(lang==='zh'?'提现已提交':'Withdrawal submitted');nav.pop();}});

  return h('div',{className:'mx-app'},
    h(PushHeader,{title:t('withdrawTitle',lang),onBack:nav.pop}),
    h('div',{className:'mx-body f-scroll',style:{padding:'16px 18px'}},
      h('div',{style:{display:'flex',alignItems:'center',gap:8,padding:'9px 13px',borderRadius:11,background:'var(--yes-soft)',border:'1px solid var(--yes-line)',marginBottom:16}},
        h('svg',{width:15,height:15,viewBox:'0 0 24 24',fill:'none'},h('path',{d:'M9 12l2 2 4-4',stroke:'var(--yes)',strokeWidth:2.4,strokeLinecap:'round',strokeLinejoin:'round'}),h('circle',{cx:12,cy:12,r:9,stroke:'var(--yes)',strokeWidth:1.8})),
        h('span',{style:{fontSize:13,fontWeight:600,color:'var(--yes)'}}, lang==='zh'?'身份已验证 · 可提现':'Identity verified · ready to withdraw')),
      h('div',{className:'label',style:{marginBottom:7}}, t('withdrawAmt',lang)),
      h('div',{className:'amt focus'}, h('span',{className:'cur'},'$'), h('input',{value:amt,onChange:e=>setAmt(e.target.value.replace(/[^\d.]/g,'')),placeholder:'0',inputMode:'decimal'})),
      h('div',{style:{display:'flex',justifyContent:'space-between',fontSize:12.5,color:'var(--text-3)',marginTop:8}},
        h('span',null, t('available',lang)+' '+money(store.balance)),
        h('button',{style:{background:'none',border:'none',color:'var(--brand)',fontWeight:700,fontSize:12.5,cursor:'pointer'},onClick:()=>setAmt(String(store.balance.toFixed(2)))}, t('max',lang))),
      h('div',{className:'label',style:{margin:'18px 0 7px'}}, t('withdrawTo',lang)),
      h('div',{style:{display:'flex',gap:8,alignItems:'center',background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:12,padding:'12px 14px'}},
        h('input',{placeholder:lang==='zh'?'粘贴 USDT 提币地址 (TRC-20)':'Paste USDT address (TRC-20)',style:{flex:1,background:'none',border:'none',outline:'none',fontFamily:'var(--font-mono)',fontSize:12.5,color:'var(--text)'},defaultValue:'TQ8n…4rPk'})),
      h('div',{className:'card',style:{padding:14,marginTop:16}},
        h('div',{className:'kv'}, h('span',{className:'k'}, t('fee',lang)), h('span',{className:'v tnum'}, money(fee))),
        h('div',{className:'kv'}, h('span',{className:'k'}, t('youReceive',lang)), h('span',{className:'v tnum',style:{fontSize:16}}, money(receive)+' USDT'))),
      h('div',{style:{fontSize:11.5,color:'var(--text-3)',marginTop:12,lineHeight:1.5}}, lang==='zh'?'提现需经 2FA 验证与风控审核,通常数分钟内到账。':'Withdrawals require 2FA + risk review, usually credited within minutes.'),
      h('button',{className:'btn primary block',style:{marginTop:16,fontSize:16,opacity:ok?1:.5},disabled:!ok,onClick:()=>setStage('twofa')}, t('continue',lang))));
}

function KycGate({lang,nav,onStart}){
  return h('div',{className:'mx-app'},
    h(PushHeader,{title:t('withdrawTitle',lang),onBack:nav.pop}),
    h('div',{className:'mx-body f-scroll',style:{padding:'30px 22px',textAlign:'center'}},
      h('div',{style:{width:70,height:70,borderRadius:20,background:'var(--warn-soft)',display:'grid',placeItems:'center',margin:'10px auto 18px'}},
        h('svg',{width:34,height:34,viewBox:'0 0 24 24',fill:'none'},h('path',{d:'M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z',stroke:'var(--warn)',strokeWidth:1.8,strokeLinejoin:'round'}),h('path',{d:'M9 12l2 2 4-4',stroke:'var(--warn)',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'}))),
      h('div',{style:{fontSize:21,fontWeight:800,letterSpacing:'-.02em'}}, t('kycNeeded',lang)),
      h('div',{style:{fontSize:14.5,color:'var(--text-2)',marginTop:8,lineHeight:1.5,maxWidth:300,margin:'8px auto 0'}}, lang==='zh'?'按监管要求,提现前需完成身份验证。整个过程约 2 分钟,只需做一次。':'Regulations require identity verification before withdrawal. Takes ~2 minutes, one time only.'),
      h('div',{style:{textAlign:'left',maxWidth:300,margin:'22px auto 0'}},
        [['🪪',lang==='zh'?'上传身份证件':'Upload your ID'],['🤳',lang==='zh'?'人脸识别':'Face verification'],['🏠',lang==='zh'?'地址证明':'Proof of address']].map(([e,x],i)=>
          h('div',{key:i,style:{display:'flex',alignItems:'center',gap:12,padding:'11px 0'}},
            h('span',{style:{fontSize:20}},e), h('span',{style:{fontSize:15,fontWeight:600}},x)))),
      h('button',{className:'btn primary block',style:{marginTop:18,fontSize:16},onClick:onStart}, t('startKyc',lang))));
}

function KycFlow({lang,onDone,onBack}){
  const [step,setStep]=useState(0);
  const steps=[
    {t:lang==='zh'?'上传身份证件':'Upload ID',s:lang==='zh'?'拍摄证件正面':'Photograph the front of your ID',e:'🪪'},
    {t:lang==='zh'?'人脸识别':'Face scan',s:lang==='zh'?'将面部置于框内':'Position your face in the frame',e:'🤳'},
    {t:lang==='zh'?'地址证明':'Proof of address',s:lang==='zh'?'上传水电账单或银行对账单':'Utility bill or bank statement',e:'🏠'},
  ];
  const cur=steps[step];
  return h('div',{className:'mx-app'},
    h(PushHeader,{title:'KYC · '+(step+1)+'/3',onBack}),
    h('div',{className:'mx-body f-scroll',style:{padding:'14px 18px',display:'flex',flexDirection:'column'}},
      h('div',{className:'steps',style:{marginBottom:24}}, steps.map((_,i)=>h('i',{key:i,className:i<=step?'on':''}))),
      h('div',{style:{textAlign:'center',flex:1,display:'flex',flexDirection:'column',justifyContent:'center'}},
        h('div',{style:{width:'100%',aspectRatio:'4/3',maxHeight:230,borderRadius:18,border:'2px dashed var(--border-2)',background:'var(--surface-2)',display:'grid',placeItems:'center',margin:'0 auto'}},
          h('div',{style:{textAlign:'center'}}, h('div',{style:{fontSize:46}},cur.e), h('div',{style:{fontSize:12.5,color:'var(--text-3)',marginTop:6}},lang==='zh'?'点击拍摄 / 上传':'Tap to capture / upload'))),
        h('div',{style:{fontSize:20,fontWeight:800,marginTop:22,letterSpacing:'-.02em'}}, cur.t),
        h('div',{style:{fontSize:14,color:'var(--text-2)',marginTop:6}}, cur.s)),
      h('button',{className:'btn primary block',style:{fontSize:16,marginTop:18},onClick:()=>step<2?setStep(step+1):onDone()},
        step<2? t('continue',lang) : t('confirm',lang))));
}

function TwoFA({lang,onBack,onDone}){
  const [code,setCode]=useState('');
  const press=(k)=>{ if(k==='del'){setCode(c=>c.slice(0,-1));return;} if(code.length<6)setCode(c=>c+k); };
  React.useEffect(()=>{ if(code.length===6){ const tm=setTimeout(onDone,400); return ()=>clearTimeout(tm);} },[code]);
  return h('div',{className:'mx-app'},
    h(PushHeader,{title:lang==='zh'?'两步验证':'Two-factor',onBack}),
    h('div',{className:'mx-body f-scroll',style:{padding:'24px 22px',textAlign:'center',display:'flex',flexDirection:'column'}},
      h('div',{style:{fontSize:19,fontWeight:800}}, lang==='zh'?'输入验证码':'Enter your code'),
      h('div',{style:{fontSize:14,color:'var(--text-2)',marginTop:6}}, lang==='zh'?'来自你的验证器 App 的 6 位数字':'6-digit code from your authenticator'),
      h('div',{style:{display:'flex',gap:9,justifyContent:'center',margin:'26px 0'}},
        [0,1,2,3,4,5].map(i=>h('div',{key:i,style:{width:42,height:52,borderRadius:12,border:'1.5px solid '+(i===code.length?'var(--brand)':'var(--border-2)'),background:'var(--surface-2)',display:'grid',placeItems:'center',fontSize:24,fontWeight:800}}, code[i]||''))),
      h('div',{className:'keypad',style:{marginTop:'auto',maxWidth:300,margin:'auto auto 0'}},
        ['1','2','3','4','5','6','7','8','9','','0','del'].map((k,i)=>k===''?h('div',{key:i}):
          h('button',{key:i,onClick:()=>press(k)}, k==='del'?'⌫':k)))));
}

/* ---------------- PROFILE ---------------- */
function Profile({theme, lang, nav, ui, store}){
  return h('div',{className:'mx-app'},
    h(TabHead,{title:t('profile',lang),lang,ui,theme}),
    h('div',{className:'mx-body f-scroll',style:{padding:'8px 18px'}},
      h('div',{style:{display:'flex',alignItems:'center',gap:14,padding:'12px 2px 18px'}},
        h('div',{className:'avatar'},'A'),
        h('div',{style:{flex:1}},
          h('div',{style:{fontSize:20,fontWeight:800,letterSpacing:'-.02em'}}, 'Alex Morgan'),
          h('div',{style:{fontSize:13.5,color:'var(--text-3)'}}, '@alexm · alex@email.com'))),

      h('div',{className:'card',style:{padding:'2px 16px',marginBottom:14}},
        h('div',{className:'kv'},
          h('span',{className:'k'}, 'KYC'),
          store.verified
            ? h('span',{style:{display:'inline-flex',alignItems:'center',gap:6,fontWeight:700,color:'var(--yes)'}}, h('span',{style:{width:7,height:7,borderRadius:'50%',background:'var(--yes)'}}), t('verified',lang))
            : h('span',{onClick:()=>nav.push('kyc',{}),style:{display:'inline-flex',alignItems:'center',gap:6,fontWeight:700,color:'var(--warn)',cursor:'pointer'}}, h('span',{style:{width:7,height:7,borderRadius:'50%',background:'var(--warn)'}}), t('unverified',lang)+' ›'))),

      h('div',{className:'card',style:{padding:16,marginBottom:14,background:'linear-gradient(140deg, color-mix(in srgb, var(--brand) 14%, var(--surface)), var(--surface))',borderColor:'color-mix(in srgb, var(--brand) 24%, var(--border))'}},
        h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}},
          h('div',null,
            h('div',{style:{fontSize:15,fontWeight:800}}, t('referral',lang)),
            h('div',{style:{fontSize:13,color:'var(--text-2)',marginTop:3}}, lang==='zh'?'好友交易手续费返你 20%':'Earn 20% of friends\u2019 trading fees')),
          h('div',{style:{textAlign:'right'}}, h('div',{className:'label'},lang==='zh'?'已赚':'Earned'), h('div',{className:'tnum',style:{fontWeight:800,fontSize:18,color:'var(--brand)'}},'$48.20'))),
        h('div',{style:{display:'flex',gap:8,alignItems:'center',marginTop:14}},
          h('div',{className:'mono',style:{flex:1,background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:10,padding:'10px 12px',fontSize:13,fontWeight:600}}, 'FORESEE-AX9'),
          h('button',{className:'btn primary',style:{padding:'10px 16px',fontSize:13.5},onClick:()=>ui.toast(t('copied',lang))}, lang==='zh'?'复制':'Copy'))),

      h('div',{className:'card',style:{padding:'2px 16px',marginBottom:14}},
        h(MenuRow,{icon:'🔐',label:t('security',lang),right:'2FA · ' + (lang==='zh'?'已开':'On')}),
        h(MenuRow,{icon:'🌐',label:t('language',lang),right:lang==='en'?'English':'中文',onClick:ui.toggleLang}),
        h(MenuRow,{icon:theme==='dark'?'🌙':'☀️',label:t('theme',lang),right:theme==='dark'?(lang==='zh'?'深色':'Dark'):(lang==='zh'?'浅色':'Light'),onClick:ui.toggleTheme}),
        h(MenuRow,{icon:'⚙️',label:t('settings',lang),right:'',last:true})),

      h('div',{style:{padding:'4px 4px 0',fontSize:12,color:'var(--text-3)',lineHeight:1.6}},
        h('div',{style:{display:'flex',gap:7,marginBottom:8}}, h('span',null,'🌍'), h('span',null, t('region',lang))),
        h('div',{style:{display:'flex',gap:14,flexWrap:'wrap',fontWeight:600}},
          [lang==='zh'?'用户协议':'Terms', lang==='zh'?'隐私政策':'Privacy', lang==='zh'?'风险披露':'Risk disclosure'].map((x,i)=>
            h('a',{key:i,style:{color:'var(--text-2)',textDecoration:'underline',cursor:'pointer'}}, x))),
        h('div',{style:{marginTop:14,fontSize:11,opacity:.7}}, t('riskNote',lang)))));
}
function MenuRow({icon,label,right,onClick,last}){
  return h('div',{className:'kv',style:{cursor:onClick?'pointer':'default',borderBottom:last?'none':undefined},onClick},
    h('span',{style:{display:'flex',alignItems:'center',gap:11}}, h('span',{style:{fontSize:17}},icon), h('span',{style:{fontWeight:600,color:'var(--text)'}},label)),
    h('span',{style:{display:'flex',alignItems:'center',gap:7,color:'var(--text-3)',fontWeight:600,fontSize:13.5}}, right,
      h('svg',{width:7,height:12,viewBox:'0 0 8 14'},h('path',{d:'M1 1l6 6-6 6',stroke:'var(--text-3)',strokeWidth:2,fill:'none',strokeLinecap:'round',strokeLinejoin:'round'}))));
}

/* ---------------- ACTIVITY ---------------- */
function Activity({theme, lang, nav, ui}){
  const notes=[
    {ic:'✓',col:'#16C784',mkt:'oscar',en:'Market resolved — you held NO',zh:'市场已结算 — 你持有 NO',t:'5h',sub:{en:'Won $120.00',zh:'赢得 $120.00'}},
    {ic:'▲',col:'#F5A623',mkt:'btc100k',en:'Price alert: BTC market hit 28¢',zh:'价格提醒:BTC 市场触及 28¢',t:'8h',sub:{en:'+4¢ in 24h',zh:'24小时 +4¢'}},
    {ic:'🔔',col:'#3B6EE8',mkt:'rates',en:'New comment on a market you hold',zh:'你持有的市场有新评论',t:'1d',sub:{en:'@dca_daily replied',zh:'@dca_daily 回复了'}},
    {ic:'⚙',col:'#9A9AA2',mkt:null,en:'2FA enabled on your account',zh:'账户已开启 2FA',t:'2d',sub:{en:'Security update',zh:'安全更新'}},
  ];
  return h('div',{className:'mx-app'},
    h(TabHead,{title:t('nav_activity',lang),lang,ui,theme}),
    h('div',{className:'mx-body f-scroll',style:{padding:'6px 18px'}},
      notes.map((n,i)=>h('div',{key:i,className:'mx-row'+(i===notes.length-1?' last':''),onClick:()=>n.mkt&&nav.push('detail',{id:n.mkt,side:'yes'}),style:{cursor:n.mkt?'pointer':'default'}},
        h('div',{style:{width:38,height:38,borderRadius:11,display:'grid',placeItems:'center',flex:'none',fontWeight:800,fontSize:15,color:n.col,background:`color-mix(in srgb, ${n.col} 16%, var(--surface-2))`}}, n.ic),
        h('div',{style:{flex:1,minWidth:0}},
          h('div',{className:'mx-row-title'}, n[lang]),
          h('div',{className:'mx-row-sub'}, n.sub[lang]+' · '+n.t))))));
}

window.SW = { Portfolio, Deposit, Withdraw, Profile, Activity };
})();
