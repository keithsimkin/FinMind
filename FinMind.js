const CURRENCIES=[
  {code:'UGX',symbol:'UGX',name:'Ugandan Shilling',flag:'🇺🇬'},
  {code:'USD',symbol:'$',name:'US Dollar',flag:'🇺🇸'},
  {code:'EUR',symbol:'€',name:'Euro',flag:'🇪🇺'},
  {code:'GBP',symbol:'£',name:'British Pound',flag:'🇬🇧'},
  {code:'KES',symbol:'KSh',name:'Kenyan Shilling',flag:'🇰🇪'},
  {code:'TZS',symbol:'TSh',name:'Tanzanian Shilling',flag:'🇹🇿'},
  {code:'RWF',symbol:'RF',name:'Rwandan Franc',flag:'🇷🇼'},
  {code:'ETB',symbol:'Br',name:'Ethiopian Birr',flag:'🇪🇹'},
  {code:'GHS',symbol:'₵',name:'Ghanaian Cedi',flag:'🇬🇭'},
  {code:'NGN',symbol:'₦',name:'Nigerian Naira',flag:'🇳🇬'},
  {code:'ZAR',symbol:'R',name:'South African Rand',flag:'🇿🇦'},
  {code:'EGP',symbol:'E£',name:'Egyptian Pound',flag:'🇪🇬'},
  {code:'MAD',symbol:'MAD',name:'Moroccan Dirham',flag:'🇲🇦'},
  {code:'XOF',symbol:'CFA',name:'West African CFA Franc',flag:'🌍'},
  {code:'XAF',symbol:'FCFA',name:'Central African CFA Franc',flag:'🌍'},
  {code:'JPY',symbol:'¥',name:'Japanese Yen',flag:'🇯🇵'},
  {code:'CNY',symbol:'¥',name:'Chinese Yuan',flag:'🇨🇳'},
  {code:'INR',symbol:'₹',name:'Indian Rupee',flag:'🇮🇳'},
  {code:'CAD',symbol:'C$',name:'Canadian Dollar',flag:'🇨🇦'},
  {code:'AUD',symbol:'A$',name:'Australian Dollar',flag:'🇦🇺'},
  {code:'CHF',symbol:'CHF',name:'Swiss Franc',flag:'🇨🇭'},
  {code:'SEK',symbol:'kr',name:'Swedish Krona',flag:'🇸🇪'},
  {code:'NOK',symbol:'kr',name:'Norwegian Krone',flag:'🇳🇴'},
  {code:'BRL',symbol:'R$',name:'Brazilian Real',flag:'🇧🇷'},
  {code:'MXN',symbol:'MX$',name:'Mexican Peso',flag:'🇲🇽'},
  {code:'SAR',symbol:'﷼',name:'Saudi Riyal',flag:'🇸🇦'},
  {code:'AED',symbol:'د.إ',name:'UAE Dirham',flag:'🇦🇪'},
  {code:'PKR',symbol:'₨',name:'Pakistani Rupee',flag:'🇵🇰'},
  {code:'IDR',symbol:'Rp',name:'Indonesian Rupiah',flag:'🇮🇩'},
  {code:'PHP',symbol:'₱',name:'Philippine Peso',flag:'🇵🇭'},
  {code:'MYR',symbol:'RM',name:'Malaysian Ringgit',flag:'🇲🇾'},
  {code:'THB',symbol:'฿',name:'Thai Baht',flag:'🇹🇭'},
  {code:'SGD',symbol:'S$',name:'Singapore Dollar',flag:'🇸🇬'},
  {code:'ZMW',symbol:'ZK',name:'Zambian Kwacha',flag:'🇿🇲'},
  {code:'BWP',symbol:'P',name:'Botswana Pula',flag:'🇧🇼'},
  {code:'AOA',symbol:'Kz',name:'Angolan Kwanza',flag:'🇦🇴'},
  {code:'CDF',symbol:'FC',name:'Congolese Franc',flag:'🇨🇩'},
  {code:'DZD',symbol:'DA',name:'Algerian Dinar',flag:'🇩🇿'},
];
let activeCurrency={code:'UGX',symbol:'UGX',name:'Ugandan Shilling',flag:'🇺🇬'};
let pendingCurrency=null;
function fmt(n){return activeCurrency.symbol+' '+Math.round(n).toLocaleString();}

function openCurrencyModal(){
  pendingCurrency=activeCurrency;
  document.getElementById('currency-search').value='';
  renderCurrencyList(CURRENCIES);
  document.getElementById('currency-modal').classList.add('open');
}
function closeCurrencyModal(){document.getElementById('currency-modal').classList.remove('open');}
function renderCurrencyList(list){
  document.getElementById('currency-list').innerHTML=list.map(c=>`
    <div class="currency-opt ${c.code===activeCurrency.code?'selected':''}" onclick="selectCurrency('${c.code}')">
      <div class="c-sym">${c.flag}</div>
      <div class="c-info"><div class="c-code">${c.code} &nbsp;<span style="color:var(--accent);font-weight:600">${c.symbol}</span></div><div class="c-name">${c.name}</div></div>
      <div class="c-check">✓</div>
    </div>`).join('');
}
function filterCurrencies(){
  const q=document.getElementById('currency-search').value.toLowerCase();
  renderCurrencyList(CURRENCIES.filter(c=>c.code.toLowerCase().includes(q)||c.name.toLowerCase().includes(q)||c.symbol.toLowerCase().includes(q)));
}
function selectCurrency(code){
  pendingCurrency=CURRENCIES.find(c=>c.code===code);
  document.querySelectorAll('.currency-opt').forEach(el=>{
    el.classList.toggle('selected',el.querySelector('.c-code').textContent.trim().startsWith(code));
  });
}
function saveCurrency(){
  if(!pendingCurrency)return;
  activeCurrency=pendingCurrency;
  if(currentUser)localStorage.setItem('fm_currency_'+currentUser.email,JSON.stringify(activeCurrency));
  document.getElementById('header-currency-sym').textContent=activeCurrency.code;
  document.getElementById('setup-cur-tag').textContent=activeCurrency.symbol||activeCurrency.code;
  document.querySelectorAll('.cur-label').forEach(el=>el.textContent=activeCurrency.symbol||activeCurrency.code);
  closeCurrencyModal();
  refreshAll();
}
function loadUserCurrency(){
  if(!currentUser)return;
  const saved=localStorage.getItem('fm_currency_'+currentUser.email);
  if(saved){
    activeCurrency=JSON.parse(saved);
    document.getElementById('header-currency-sym').textContent=activeCurrency.code;
    document.getElementById('setup-cur-tag').textContent=activeCurrency.symbol||activeCurrency.code;
    document.querySelectorAll('.cur-label').forEach(el=>el.textContent=activeCurrency.symbol||activeCurrency.code);
  }
}

// ══════════════════════════════════════════════
// INCOME SETUP
// ══════════════════════════════════════════════
let selectedSource='';

function toggleSrc(el){
  document.querySelectorAll('.src-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  selectedSource=el.textContent.replace(/^.\s/,'').trim();
}

function openIncomeSetup(isEdit){
  const profile=getProfile();
  document.getElementById('setup-tag').textContent=isEdit?'UPDATE INCOME':'GETTING STARTED';
  document.getElementById('setup-title').textContent=isEdit?'Update your monthly income':'What\'s your monthly income?';
  document.getElementById('setup-sub').textContent=isEdit
    ?'Change your monthly income amount. All your stats and AI advice will update automatically.'
    :'This is the foundation of your budget. FinMind will use this to track how much you\'ve spent and how much you have left each month.';
  document.getElementById('setup-skip-btn').style.display=isEdit?'none':'block';
  document.getElementById('setup-income-val').value=profile.income||'';
  document.getElementById('setup-err').textContent='';
  document.getElementById('setup-cur-tag').textContent=activeCurrency.symbol||activeCurrency.code;
  if(profile.incomeSource){
    document.querySelectorAll('.src-chip').forEach(c=>{
      if(c.textContent.includes(profile.incomeSource))c.classList.add('active');
    });
    selectedSource=profile.incomeSource;
  }
  document.getElementById('income-setup').classList.add('open');
  setTimeout(()=>document.getElementById('setup-income-val').focus(),100);
}

function openEditIncome(){openIncomeSetup(true);}

function saveIncome(){
  const val=parseFloat(document.getElementById('setup-income-val').value);
  if(!val||val<=0){document.getElementById('setup-err').textContent='Please enter a valid income amount.';return;}
  const profile=getProfile();
  profile.income=val;
  profile.incomeSource=selectedSource||profile.incomeSource||'';
  saveProfile(profile);
  document.getElementById('income-setup').classList.remove('open');
  refreshAll();
}

function skipIncome(){
  document.getElementById('income-setup').classList.remove('open');
  refreshAll();
}

// ══════════════════════════════════════════════
// DATABASE
// ══════════════════════════════════════════════
const DB={
  users(){return JSON.parse(localStorage.getItem('fm_users')||'{}');},
  saveUsers(u){localStorage.setItem('fm_users',JSON.stringify(u));},
  txns(uid){return JSON.parse(localStorage.getItem('fm_txns_'+uid)||'[]');},
  saveTxns(uid,t){localStorage.setItem('fm_txns_'+uid,JSON.stringify(t));},
  budgets(uid){return JSON.parse(localStorage.getItem('fm_budgets_'+uid)||'{}');},
  saveBudgets(uid,b){localStorage.setItem('fm_budgets_'+uid,JSON.stringify(b));},
  profile(uid){return JSON.parse(localStorage.getItem('fm_profile_'+uid)||'{}');},
  saveProfile(uid,p){localStorage.setItem('fm_profile_'+uid,JSON.stringify(p));},
  session(){return JSON.parse(localStorage.getItem('fm_session')||'null');},
  saveSession(s){localStorage.setItem('fm_session',JSON.stringify(s));},
  clearSession(){localStorage.removeItem('fm_session');}
};

let currentUser=null;
let txnFilter='all';

function getProfile(){return DB.profile(currentUser.email);}
function saveProfile(p){DB.saveProfile(currentUser.email,p);}

// ══════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════
function switchTab(tab){
  document.querySelectorAll('.tab-btn').forEach((b,i)=>b.classList.toggle('active',(tab==='login'&&i===0)||(tab==='register'&&i===1)));
  document.getElementById('login-form').style.display=tab==='login'?'block':'none';
  document.getElementById('register-form').style.display=tab==='register'?'block':'none';
  document.getElementById('auth-msg').textContent='';
}
function doLogin(){
  const email=document.getElementById('login-email').value.trim().toLowerCase();
  const pass=document.getElementById('login-pass').value;
  const users=DB.users();
  if(!email||!pass)return showMsg('Please fill all fields.');
  if(!users[email])return showMsg('Account not found. Please register.');
  if(users[email].password!==btoa(pass))return showMsg('Incorrect password.');
  loginUser(email,users[email],false);
}
function doRegister(){
  const name=document.getElementById('reg-name').value.trim();
  const email=document.getElementById('reg-email').value.trim().toLowerCase();
  const pass=document.getElementById('reg-pass').value;
  if(!name||!email||!pass)return showMsg('Please fill all fields.');
  if(pass.length<6)return showMsg('Password must be at least 6 characters.');
  const users=DB.users();
  if(users[email])return showMsg('Account already exists. Please sign in.');
  users[email]={name,email,password:btoa(pass),created:Date.now()};
  DB.saveUsers(users);
  loginUser(email,users[email],true);
}
function loginUser(email,data,isNew){
  currentUser={email,name:data.name};
  DB.saveSession(currentUser);
  document.getElementById('auth-screen').style.display='none';
  document.getElementById('app').style.display='flex';
  document.getElementById('user-display').textContent=data.name.split(' ')[0];
  document.getElementById('user-avatar').textContent=data.name.charAt(0).toUpperCase();
  document.getElementById('dash-greeting').textContent='Welcome back, '+data.name.split(' ')[0]+'!';
  loadUserCurrency();
  const profile=getProfile();
  // Show income setup for new users OR returning users who never set income
  if(isNew||!profile.income){
    openIncomeSetup(false);
  } else {
    refreshAll();
  }
}
function doLogout(){
  DB.clearSession();currentUser=null;
  document.getElementById('app').style.display='none';
  document.getElementById('auth-screen').style.display='flex';
  document.getElementById('login-email').value='';
  document.getElementById('login-pass').value='';
}
function showMsg(m){document.getElementById('auth-msg').textContent=m;}
window.onload=()=>{
  const s=DB.session();
  if(s){const users=DB.users();if(users[s.email])loginUser(s.email,users[s.email],false);}
};

// ══════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════
function showPage(id,btn){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  if(id==='dashboard')renderDashboard();
  if(id==='transactions')renderTxnTable();
  if(id==='budget')renderBudget();
  if(id==='ai')renderAISummary();
}

// ══════════════════════════════════════════════
// TRANSACTIONS
// ══════════════════════════════════════════════
function addTransaction(){
  const desc=document.getElementById('txn-desc').value.trim();
  const amt=parseFloat(document.getElementById('txn-amount').value);
  const cat=document.getElementById('txn-cat').value;
  const type=document.getElementById('txn-type').value;
  if(!desc||isNaN(amt)||amt<=0){alert('Please enter a valid description and amount.');return;}
  const txns=DB.txns(currentUser.email);
  txns.unshift({id:Date.now(),desc,amt,cat,type,date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})});
  DB.saveTxns(currentUser.email,txns);
  document.getElementById('txn-desc').value='';
  document.getElementById('txn-amount').value='';
  renderTxnTable();renderDashboard();
}
function deleteTxn(id){
  DB.saveTxns(currentUser.email,DB.txns(currentUser.email).filter(t=>t.id!==id));
  renderTxnTable();renderDashboard();
}
function filterTxns(f,el){
  txnFilter=f;
  document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');renderTxnTable();
}
const catEmoji={Salary:'💰',Freelance:'💻',Investment:'📈',Food:'🍔',Transport:'🚗',Housing:'🏠',Health:'💊',Entertainment:'🎬',Shopping:'🛍',Education:'📚',Utilities:'⚡',Other:'📦'};
const catColor={Food:'#f97066',Transport:'#7eb8f7',Housing:'#fbbf24',Health:'#86efac',Entertainment:'#c084fc',Shopping:'#fb923c',Education:'#34d399',Utilities:'#60a5fa',Salary:'#b8f59a',Freelance:'#a78bfa',Investment:'#34d399',Other:'#9ca3af'};

function renderTxnTable(){
  let txns=DB.txns(currentUser.email);
  if(txnFilter!=='all')txns=txns.filter(t=>t.type===txnFilter);
  const tbody=document.getElementById('txn-tbody');
  if(!txns.length){tbody.innerHTML='<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:32px">No transactions found</td></tr>';return;}
  tbody.innerHTML=txns.map(t=>`
    <tr>
      <td>${t.desc}</td>
      <td><span style="background:${catColor[t.cat]||'#555'}22;color:${catColor[t.cat]||'#aaa'};padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500">${catEmoji[t.cat]||'📦'} ${t.cat}</span></td>
      <td><span class="badge ${t.type}">${t.type}</span></td>
      <td style="color:${t.type==='income'?'var(--accent2)':'var(--danger)'};">${t.type==='income'?'+':'-'}${fmt(t.amt)}</td>
      <td style="color:var(--text3)">${t.date}</td>
      <td><button class="del-btn" onclick="deleteTxn(${t.id})">×</button></td>
    </tr>`).join('');
}

// ══════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════
function refreshAll(){renderDashboard();renderTxnTable();renderBudget();renderAISummary();}

function getStats(){
  const txns=DB.txns(currentUser.email);
  const profile=getProfile();
  const monthlyIncome=profile.income||0;
  const extraIncome=txns.filter(t=>t.type==='income').reduce((s,t)=>s+t.amt,0);
  const totalIncome=monthlyIncome+extraIncome;
  const expense=txns.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amt,0);
  const balance=totalIncome-expense;
  const remaining=monthlyIncome-expense;
  const savingsRate=totalIncome>0?Math.round(((totalIncome-expense)/totalIncome)*100):0;
  const byCat={};
  txns.filter(t=>t.type==='expense').forEach(t=>{byCat[t.cat]=(byCat[t.cat]||0)+t.amt;});
  return{txns,monthlyIncome,extraIncome,totalIncome,expense,balance,remaining,savingsRate,byCat,profile};
}

function renderDashboard(){
  const{txns,monthlyIncome,totalIncome,expense,balance,remaining,savingsRate,byCat,profile}=getStats();

  // Income banner
  if(monthlyIncome>0){
    document.getElementById('income-banner-set').style.display='flex';
    document.getElementById('income-banner-missing').style.display='none';
    document.getElementById('banner-income-val').textContent=fmt(monthlyIncome);
    document.getElementById('banner-income-src').textContent=profile.incomeSource||'Monthly';
    const remEl=document.getElementById('banner-remaining');
    remEl.textContent=fmt(remaining);
    remEl.className='income-remaining-val '+(remaining>monthlyIncome*0.3?'ok':remaining>0?'warn':'danger');
  } else {
    document.getElementById('income-banner-set').style.display='none';
    document.getElementById('income-banner-missing').style.display='flex';
  }

  // Stats
  document.getElementById('stat-balance').textContent=fmt(balance);
  document.getElementById('stat-balance').className='stat-value '+(balance>=0?'green':'red');
  document.getElementById('stat-expense').textContent=fmt(expense);
  document.getElementById('stat-savings').textContent=savingsRate+'%';
  document.getElementById('stat-txn-count').textContent=txns.length;
  document.getElementById('stat-expense-count').textContent=txns.filter(t=>t.type==='expense').length+' transactions';

  // Category bars
  const barsEl=document.getElementById('category-bars');
  if(!Object.keys(byCat).length){barsEl.innerHTML='<div class="empty-state">No expense data yet</div>';}
  else{
    const max=Math.max(...Object.values(byCat));
    // If income set, show % of income on bars
    barsEl.innerHTML=Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([cat,amt])=>{
      const pctOfIncome=monthlyIncome>0?` (${Math.round(amt/monthlyIncome*100)}% of income)`:'';
      return`<div class="bar-row">
        <div class="label">${catEmoji[cat]||''} ${cat}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${(amt/max*100).toFixed(1)}%;background:${catColor[cat]||'#7eb8f7'}"></div></div>
        <div class="amt">${fmt(amt)}<span style="color:var(--text3);font-size:10px">${pctOfIncome}</span></div>
      </div>`;
    }).join('');
  }

  // Recent
  const recentEl=document.getElementById('recent-list');
  const recent=txns.slice(0,5);
  if(!recent.length){recentEl.innerHTML='<div class="empty-state">No transactions yet</div>';}
  else{
    recentEl.innerHTML=recent.map(t=>`
      <div class="txn-item">
        <div class="txn-icon" style="background:${catColor[t.cat]||'#555'}22">${catEmoji[t.cat]||'📦'}</div>
        <div class="txn-info"><div class="txn-name">${t.desc}</div><div class="txn-date">${t.date}</div></div>
        <div class="txn-amount ${t.type==='income'?'inc':'exp'}">${t.type==='income'?'+':'-'}${fmt(t.amt)}</div>
      </div>`).join('');
  }
}

// ══════════════════════════════════════════════
// BUDGET
// ══════════════════════════════════════════════
function setBudget(){
  const cat=document.getElementById('budget-cat').value;
  const limit=parseFloat(document.getElementById('budget-limit').value);
  if(!limit||limit<=0){alert('Enter a valid limit.');return;}
  const budgets=DB.budgets(currentUser.email);
  budgets[cat]=limit;
  DB.saveBudgets(currentUser.email,budgets);
  document.getElementById('budget-limit').value='';
  renderBudget();
}
function renderBudget(){
  const budgets=DB.budgets(currentUser.email);
  const{byCat,monthlyIncome}=getStats();
  const grid=document.getElementById('budget-grid');
  if(!Object.keys(budgets).length){grid.innerHTML='<div style="color:var(--text3);font-size:13px;grid-column:1/-1">No budgets set yet. Add one above.</div>';return;}
  grid.innerHTML=Object.entries(budgets).map(([cat,limit])=>{
    const spent=byCat[cat]||0;
    const pct=Math.min(100,(spent/limit*100)).toFixed(0);
    const color=pct>=90?'var(--danger)':pct>=70?'var(--warn)':'var(--accent2)';
    const pctOfInc=monthlyIncome>0?`<span style="color:var(--text3);font-size:10px"> · ${Math.round(limit/monthlyIncome*100)}% of income</span>`:'';
    return`<div class="budget-card">
      <div class="budget-cat">${catEmoji[cat]||''} ${cat}</div>
      <div class="budget-nums">${fmt(spent)} / ${fmt(limit)}${pctOfInc}</div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%;background:${color}"></div></div>
      <div class="progress-pct" style="color:${color}">${pct}% used</div>
    </div>`;
  }).join('');
}

// ══════════════════════════════════════════════
// AI ADVISOR
// ══════════════════════════════════════════════
function renderAISummary(){
  const{monthlyIncome,totalIncome,expense,balance,remaining,savingsRate,byCat,profile}=getStats();
  const topCat=Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById('ai-summary').innerHTML=`
    <div style="margin-bottom:5px">💰 <b>Monthly income:</b> ${monthlyIncome>0?fmt(monthlyIncome):'Not set'}</div>
    <div style="margin-bottom:5px">📉 <b>Expenses:</b> ${fmt(expense)}</div>
    <div style="margin-bottom:5px">🏦 <b>Remaining:</b> ${monthlyIncome>0?fmt(remaining):'—'}</div>
    <div style="margin-bottom:5px">📊 <b>Savings rate:</b> ${savingsRate}%</div>
    ${topCat?`<div>🔥 <b>Top spend:</b> ${topCat[0]} (${fmt(topCat[1])})</div>`:'<div style="color:var(--text3)">No expenses yet</div>'}
  `;
}

function buildFinancialContext(){
  const{monthlyIncome,totalIncome,expense,balance,remaining,savingsRate,byCat,profile}=getStats();
  const budgets=DB.budgets(currentUser.email);
  const topExpenses=Object.entries(byCat).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([c,a])=>`${c}: ${fmt(a)}${monthlyIncome>0?' ('+Math.round(a/monthlyIncome*100)+'% of income)':''}`).join(', ');
  const budgetStatus=Object.entries(budgets).map(([cat,limit])=>{
    const spent=byCat[cat]||0;
    return`${cat}: ${fmt(spent)}/${fmt(limit)} (${Math.round(spent/limit*100)}% used)`;
  }).join('; ');
  return`User: ${currentUser.name}
Currency: ${activeCurrency.code} (${activeCurrency.name})
Monthly Income (set by user): ${monthlyIncome>0?fmt(monthlyIncome):'Not set'}
Income Source: ${profile.incomeSource||'Not specified'}
Total Expenses This Month: ${fmt(expense)}
Money Remaining: ${monthlyIncome>0?fmt(remaining):'Unknown (income not set)'}
Savings Rate: ${savingsRate}%
Top Spending Categories: ${topExpenses||'None yet'}
Budget Goals: ${budgetStatus||'None set'}
Total Transactions: ${DB.txns(currentUser.email).length}`;
}

const chatHistory=[];
async function sendChat(){
  const input=document.getElementById('chat-input');
  const msg=input.value.trim();if(!msg)return;
  input.value='';appendMsg('user',msg);
  chatHistory.push({role:'user',content:msg});
  const btn=document.getElementById('send-btn');btn.disabled=true;
  const typingId=appendTyping();
  try{
    const sysPrompt=`You are FinMind, a friendly and sharp personal finance advisor. The user has set their monthly income and you use that as the baseline for all advice. Give specific, actionable advice based on their actual data. Be concise. Format amounts in ${activeCurrency.code} (${activeCurrency.name}).

USER'S FINANCIAL DATA:
${buildFinancialContext()}`;
    const res=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,system:sysPrompt,messages:chatHistory.map(m=>({role:m.role,content:m.content}))})
    });
    const data=await res.json();
    removeTyping(typingId);
    const reply=data.content?.[0]?.text||'Sorry, could not get a response.';
    chatHistory.push({role:'assistant',content:reply});
    appendMsg('ai',reply);
  }catch(e){removeTyping(typingId);appendMsg('ai','⚠️ Could not connect to AI. Please try again.');}
  btn.disabled=false;
}
function askQuick(btn){document.getElementById('chat-input').value=btn.textContent;sendChat();}
function appendMsg(role,text){
  const el=document.createElement('div');el.className='msg '+role;
  const now=new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});
  el.innerHTML=`<div class="msg-bubble">${text.replace(/\n/g,'<br>')}</div><div class="msg-time">${now}</div>`;
  document.getElementById('chat-messages').appendChild(el);
  el.scrollIntoView({behavior:'smooth',block:'end'});
}
let typingCounter=0;
function appendTyping(){
  const id=++typingCounter,el=document.createElement('div');
  el.className='msg ai';el.id='typing-'+id;
  el.innerHTML=`<div class="msg-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;
  document.getElementById('chat-messages').appendChild(el);
  el.scrollIntoView({behavior:'smooth',block:'end'});return id;
}
function removeTyping(id){const el=document.getElementById('typing-'+id);if(el)el.remove();}