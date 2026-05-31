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
async function saveCurrency(){
  if(!pendingCurrency)return;
  activeCurrency=pendingCurrency;
  if(currentUser)await DB.saveCurrency(currentUser.uid,activeCurrency);
  document.getElementById('header-currency-sym').textContent=activeCurrency.code;
  document.getElementById('setup-cur-tag').textContent=activeCurrency.symbol||activeCurrency.code;
  document.querySelectorAll('.cur-label').forEach(el=>el.textContent=activeCurrency.symbol||activeCurrency.code);
  closeCurrencyModal();
  refreshAll();
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

async function saveIncome(){
  const val=parseFloat(document.getElementById('setup-income-val').value);
  if(!val||val<=0){document.getElementById('setup-err').textContent='Please enter a valid income amount.';return;}
  
  try {
    const profile=getProfile();
    profile.income=val;
    profile.incomeSource=selectedSource||profile.incomeSource||'';
    await saveProfile(profile);
    document.getElementById('income-setup').classList.remove('open');
    refreshAll();
  } catch(e) {
    console.error('Error saving income:', e);
    document.getElementById('setup-err').textContent='Error saving income: ' + e.message;
  }
}

function skipIncome(){
  document.getElementById('income-setup').classList.remove('open');
  refreshAll();
}

// ══════════════════════════════════════════════
// FIREBASE INITIALIZATION
// ══════════════════════════════════════════════
let firebaseApp, firebaseAuth, firebaseDB;
let currentUser=null;
let txnFilter='all';
let userDataCache={txns:[],budgets:{},profile:{}};

// Initialize Firebase
function initFirebase(){
  try{
    firebaseApp=firebase.initializeApp(firebaseConfig);
    firebaseAuth=firebase.auth();
    firebaseDB=firebase.database();
    console.log('✅ Firebase initialized successfully');
    
    // Listen for auth state changes
    firebaseAuth.onAuthStateChanged(user=>{
      if(user){
        currentUser={email:user.email,name:user.displayName||user.email,uid:user.uid};
        document.getElementById('auth-screen').style.display='none';
        document.getElementById('app').style.display='flex';
        document.getElementById('user-display').textContent=currentUser.name.split(' ')[0];
        document.getElementById('user-avatar').textContent=currentUser.name.charAt(0).toUpperCase();
        document.getElementById('dash-greeting').textContent='Welcome back, '+currentUser.name.split(' ')[0]+'!';
        loadUserData();
      }else{
        currentUser=null;
        document.getElementById('app').style.display='none';
        document.getElementById('auth-screen').style.display='flex';
      }
    });
  }catch(e){
    console.error('❌ Firebase initialization failed:',e);
    alert('Firebase setup required. Please configure firebase-config.js with your project credentials.');
  }
}

// ══════════════════════════════════════════════
// DATABASE OPERATIONS (Firebase)
// ══════════════════════════════════════════════
const DB={
  // Transactions
  async txns(uid){
    if(!uid)return[];
    const snapshot=await firebaseDB.ref('users/'+uid+'/transactions').once('value');
    return snapshot.val()||[];
  },
  async saveTxns(uid,txns){
    if(!uid)return;
    await firebaseDB.ref('users/'+uid+'/transactions').set(txns);
    userDataCache.txns=txns;
  },
  
  // Budgets
  async budgets(uid){
    if(!uid)return{};
    const snapshot=await firebaseDB.ref('users/'+uid+'/budgets').once('value');
    return snapshot.val()||{};
  },
  async saveBudgets(uid,budgets){
    if(!uid)return;
    await firebaseDB.ref('users/'+uid+'/budgets').set(budgets);
    userDataCache.budgets=budgets;
  },
  
  // Profile
  async profile(uid){
    if(!uid)return{};
    const snapshot=await firebaseDB.ref('users/'+uid+'/profile').once('value');
    return snapshot.val()||{};
  },
  async saveProfile(uid,profile){
    if(!uid)return;
    await firebaseDB.ref('users/'+uid+'/profile').set(profile);
    userDataCache.profile=profile;
  },
  
  // Currency preference
  async getCurrency(uid){
    if(!uid)return null;
    const snapshot=await firebaseDB.ref('users/'+uid+'/currency').once('value');
    return snapshot.val();
  },
  async saveCurrency(uid,currency){
    if(!uid)return;
    await firebaseDB.ref('users/'+uid+'/currency').set(currency);
  }
};

// Load all user data from Firebase
async function loadUserData(){
  if(!currentUser)return;
  try{
    // Load data in parallel
    const[txns,budgets,profile,currency]=await Promise.all([
      DB.txns(currentUser.uid),
      DB.budgets(currentUser.uid),
      DB.profile(currentUser.uid),
      DB.getCurrency(currentUser.uid)
    ]);
    
    userDataCache={txns,budgets,profile};
    
    // Load currency
    if(currency){
      activeCurrency=currency;
      document.getElementById('header-currency-sym').textContent=activeCurrency.code;
      document.getElementById('setup-cur-tag').textContent=activeCurrency.symbol||activeCurrency.code;
      document.querySelectorAll('.cur-label').forEach(el=>el.textContent=activeCurrency.symbol||activeCurrency.code);
    }
    
    // Check if income setup needed
    if(!profile.income){
      openIncomeSetup(false);
    }else{
      refreshAll();
    }
  }catch(e){
    console.error('Error loading user data:',e);
  }
}

function getProfile(){return userDataCache.profile;}
async function saveProfile(p){
  if(!currentUser){
    throw new Error('You must be logged in to save your profile');
  }
  userDataCache.profile=p;
  await DB.saveProfile(currentUser.uid,p);
}

// ══════════════════════════════════════════════
// AUTH (Firebase Authentication)
// ══════════════════════════════════════════════
function switchTab(tab){
  document.querySelectorAll('.tab-btn').forEach((b,i)=>b.classList.toggle('active',(tab==='login'&&i===0)||(tab==='register'&&i===1)));
  document.getElementById('login-form').style.display=tab==='login'?'block':'none';
  document.getElementById('register-form').style.display=tab==='register'?'block':'none';
  document.getElementById('auth-msg').textContent='';
}

async function doLogin(){
  const email=document.getElementById('login-email').value.trim().toLowerCase();
  const pass=document.getElementById('login-pass').value;
  if(!email||!pass)return showMsg('Please fill all fields.');
  
  try{
    showMsg('Signing in...');
    await firebaseAuth.signInWithEmailAndPassword(email,pass);
    // onAuthStateChanged will handle the rest
  }catch(e){
    console.error('Login error:',e);
    if(e.code==='auth/user-not-found')showMsg('Account not found. Please register.');
    else if(e.code==='auth/wrong-password')showMsg('Incorrect password.');
    else if(e.code==='auth/invalid-email')showMsg('Invalid email address.');
    else showMsg('Login failed: '+e.message);
  }
}

async function doRegister(){
  const name=document.getElementById('reg-name').value.trim();
  const email=document.getElementById('reg-email').value.trim().toLowerCase();
  const pass=document.getElementById('reg-pass').value;
  
  if(!name||!email||!pass)return showMsg('Please fill all fields.');
  if(pass.length<6)return showMsg('Password must be at least 6 characters.');
  
  try{
    showMsg('Creating account...');
    const userCredential=await firebaseAuth.createUserWithEmailAndPassword(email,pass);
    
    // Update profile with display name
    await userCredential.user.updateProfile({displayName:name});
    
    // Save initial profile data
    await firebaseDB.ref('users/'+userCredential.user.uid+'/profile').set({
      name:name,
      email:email,
      created:Date.now()
    });
    
    showMsg('Account created! Redirecting...');
    // onAuthStateChanged will handle the rest
  }catch(e){
    console.error('Registration error:',e);
    if(e.code==='auth/email-already-in-use')showMsg('Account already exists. Please sign in.');
    else if(e.code==='auth/invalid-email')showMsg('Invalid email address.');
    else if(e.code==='auth/weak-password')showMsg('Password is too weak.');
    else showMsg('Registration failed: '+e.message);
  }
}

async function doLogout(){
  try{
    await firebaseAuth.signOut();
    userDataCache={txns:[],budgets:{},profile:{}};
    document.getElementById('login-email').value='';
    document.getElementById('login-pass').value='';
  }catch(e){
    console.error('Logout error:',e);
  }
}

function showMsg(m){document.getElementById('auth-msg').textContent=m;}

// Initialize on page load
window.onload=()=>{
  initFirebase();
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
async function addTransaction(){
  const desc=document.getElementById('txn-desc').value.trim();
  const amt=parseFloat(document.getElementById('txn-amount').value);
  const cat=document.getElementById('txn-cat').value;
  const type=document.getElementById('txn-type').value;
  if(!desc||isNaN(amt)||amt<=0){alert('Please enter a valid description and amount.');return;}
  
  const txns=userDataCache.txns||[];
  txns.unshift({id:Date.now(),desc,amt,cat,type,date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})});
  await DB.saveTxns(currentUser.uid,txns);
  
  document.getElementById('txn-desc').value='';
  document.getElementById('txn-amount').value='';
  renderTxnTable();renderDashboard();
}

async function deleteTxn(id){
  const txns=userDataCache.txns.filter(t=>t.id!==id);
  await DB.saveTxns(currentUser.uid,txns);
  renderTxnTable();renderDashboard();
}
function filterTxns(f,el){
  txnFilter=f;
  document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  renderTxnTable();
}
const catEmoji={Salary:'💰',Freelance:'💻',Investment:'📈',Food:'🍔',Transport:'🚗',Housing:'🏠',Health:'💊',Entertainment:'🎬',Shopping:'🛍',Education:'📚',Utilities:'⚡',Other:'📦'};
const catColor={Food:'#f97066',Transport:'#7eb8f7',Housing:'#fbbf24',Health:'#86efac',Entertainment:'#c084fc',Shopping:'#fb923c',Education:'#34d399',Utilities:'#60a5fa',Salary:'#b8f59a',Freelance:'#a78bfa',Investment:'#34d399',Other:'#9ca3af'};

function renderTxnTable(){
  let txns=userDataCache.txns||[];
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
  const txns=userDataCache.txns||[];
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
async function setBudget(){
  const cat=document.getElementById('budget-cat').value;
  const limit=parseFloat(document.getElementById('budget-limit').value);
  if(!limit||limit<=0){alert('Enter a valid limit.');return;}
  
  const budgets=userDataCache.budgets||{};
  budgets[cat]=limit;
  await DB.saveBudgets(currentUser.uid,budgets);
  
  document.getElementById('budget-limit').value='';
  renderBudget();
}

function renderBudget(){
  const budgets=userDataCache.budgets||{};
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
  const budgets=userDataCache.budgets||{};
  const txns=userDataCache.txns||[];
  
  // Top expenses with details
  const topExpenses=Object.entries(byCat).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([c,a])=>`${c}: ${fmt(a)}${monthlyIncome>0?' ('+Math.round(a/monthlyIncome*100)+'% of income)':''}`).join(', ');
  
  // Budget status with over/under budget alerts
  const budgetStatus=Object.entries(budgets).map(([cat,limit])=>{
    const spent=byCat[cat]||0;
    const pct=Math.round(spent/limit*100);
    const status=pct>=100?'OVER BUDGET':pct>=90?'NEAR LIMIT':pct>=70?'WARNING':'OK';
    return`${cat}: ${fmt(spent)}/${fmt(limit)} (${pct}% used - ${status})`;
  }).join('; ');
  
  // Recent transactions (last 5)
  const recentTxns=txns.slice(0,5).map(t=>`${t.date}: ${t.desc} - ${t.type==='income'?'+':'-'}${fmt(t.amt)} (${t.cat})`).join('; ');
  
  // Income breakdown
  const extraIncome=txns.filter(t=>t.type==='income').reduce((s,t)=>s+t.amt,0);
  const incomeBreakdown=`Monthly: ${fmt(monthlyIncome)}${extraIncome>0?`, Extra: ${fmt(extraIncome)}, Total: ${fmt(totalIncome)}`:''}`;
  
  // Expense breakdown by category
  const allCategories=Object.entries(byCat).map(([cat,amt])=>{
    const pct=monthlyIncome>0?Math.round(amt/monthlyIncome*100):0;
    return`${cat}: ${fmt(amt)} (${pct}% of income)`;
  }).join(', ');
  
  // Financial health indicators
  const healthStatus=[];
  if(savingsRate<10)healthStatus.push('Low savings rate (below 10%)');
  if(savingsRate>=20)healthStatus.push('Good savings rate (20%+)');
  if(remaining<0)healthStatus.push('OVERSPENDING - expenses exceed income');
  if(remaining>monthlyIncome*0.5)healthStatus.push('Strong financial position');
  
  // Budget compliance
  const budgetIssues=Object.entries(budgets).filter(([cat,limit])=>(byCat[cat]||0)>=limit*0.9).map(([cat])=>cat);
  if(budgetIssues.length>0)healthStatus.push(`Budget concerns in: ${budgetIssues.join(', ')}`);
  
  return`USER PROFILE:
Name: ${currentUser.name}
Currency: ${activeCurrency.code} (${activeCurrency.name})

INCOME:
${incomeBreakdown}
Source: ${profile.incomeSource||'Not specified'}

EXPENSES:
Total Expenses: ${fmt(expense)}
Money Remaining: ${monthlyIncome>0?fmt(remaining):'Unknown (income not set)'}
Balance (Income - Expenses): ${fmt(balance)}
Savings Rate: ${savingsRate}%

SPENDING BY CATEGORY:
${allCategories||'No expenses yet'}

TOP 5 SPENDING CATEGORIES:
${topExpenses||'None yet'}

BUDGET GOALS & STATUS:
${budgetStatus||'No budgets set'}

RECENT TRANSACTIONS (Last 5):
${recentTxns||'No transactions yet'}

FINANCIAL HEALTH INDICATORS:
${healthStatus.join('; ')||'Not enough data'}

TRANSACTION SUMMARY:
Total Transactions: ${txns.length}
Income Transactions: ${txns.filter(t=>t.type==='income').length}
Expense Transactions: ${txns.filter(t=>t.type==='expense').length}`;
}

const chatHistory=[];
async function sendChat(){
  const input=document.getElementById('chat-input');
  const msg=input.value.trim();if(!msg)return;
  input.value='';appendMsg('user',msg);
  const btn=document.getElementById('send-btn');btn.disabled=true;
  const typingId=appendTyping();
  try{
    const sysPrompt=`You are FinMind, a personal finance advisor. You ONLY answer questions about finance, budgeting, saving, investing, expenses, and money management. 

STRICT RULES:
- Keep ALL responses under 3 sentences maximum
- ONLY discuss finance-related topics (budgeting, saving, investing, expenses, income, debt, financial planning)
- If asked about non-finance topics, respond: "I only provide financial advice. Please ask me about budgeting, saving, or managing your money."
- Be direct and actionable
- Use the user's actual financial data below to give personalized advice
- Reference specific numbers, categories, and transactions from their data
- Identify problems (overspending, budget issues) and suggest concrete solutions
- Format all amounts in ${activeCurrency.code} (${activeCurrency.name})

ANALYSIS GUIDELINES:
- If they're overspending in a category, mention the specific amount and percentage
- If they're near or over budget, alert them immediately
- If savings rate is low (<10%), suggest specific categories to cut
- If they have strong finances, acknowledge it but suggest optimization
- Always reference their actual transaction data when giving advice

USER'S COMPLETE FINANCIAL DATA:
${buildFinancialContext()}`;
    
    // Build messages array with system prompt, conversation history, and current message
    const messages=[
      {role:'system',content:sysPrompt},
      ...chatHistory.slice(-10), // Include last 10 messages for context (5 exchanges)
      {role:'user',content:msg}
    ];
    
    // TODO: Replace with your own OpenRouter API key
    // Get your API key from https://openrouter.ai/keys
    const apiKey = CONFIG.OPENROUTER_API_KEY; // Loaded from config.js
    
    const res=await fetch('https://openrouter.ai/api/v1/chat/completions',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${apiKey}`,
        'HTTP-Referer':'https://finmind.app',
        'X-Title':'FinMind AI Advisor'
      },
      body:JSON.stringify({
        model:'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
        messages:messages
      })
    });
    
    if(!res.ok){
      const errorData=await res.json();
      console.error('API Error:',errorData);
      removeTyping(typingId);
      appendMsg('ai','⚠️ API Error: '+(errorData.error?.message||'Could not connect to AI'));
      btn.disabled=false;
      return;
    }
    
    const data=await res.json();
    removeTyping(typingId);
    const reply=data.choices?.[0]?.message?.content||'Sorry, could not get a response.';
    chatHistory.push({role:'user',content:msg},{role:'assistant',content:reply});
    appendMsg('ai',reply);
  }catch(e){
    console.error('Chat error:',e);
    removeTyping(typingId);
    appendMsg('ai','⚠️ Error: '+e.message);
  }
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