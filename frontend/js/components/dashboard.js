/* Dashboard shell shared by both roles: side navigation, small helpers, and the role switch.
   Customer view: customer_dashboard.js. Collector view: collector_dashboard.js. */

function dashDate(){ return new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"}); }
function firstName(){ return esc((session && session.name || "").split(" ")[0] || "there"); }
function money(n){ return "₹"+Math.round(Number(n)||0).toLocaleString("en-IN"); }
function rangeText(p){ return money(p.estLow)+" – "+money(p.estHigh); }
function pickupValue(p){ return p.finalAmount!=null ? Number(p.finalAmount) : (Number(p.estLow||0)+Number(p.estHigh||0))/2; }
function itemsText(p){ return (p.items||[]).map(function(i){ return esc(i.name||itemLabel(i.type))+" "+esc(i.kg)+" kg"; }).join(", "); }
function statusDot(st){ return '<span class="d-dot s-'+esc(st)+'"></span>'+esc(st); }
function dStat(label,value){ return '<div class="d-stat"><span class="d-label">'+label+'</span><b>'+value+'</b></div>'; }

function dashNav(items, active){
  return '<nav class="d-nav" aria-label="Dashboard">'+items.map(function(it){
    return '<button data-go="'+it[0]+'"'+(it[0]===active?' aria-current="page"':'')+'>'+it[1]+'</button>';
  }).join("")+'</nav>';
}

/* A short rate list with dotted leaders, like a shop board. ids are keys from PRICE_IDS. */
function ledger(ids){
  return '<ul class="d-ledger">'+ids.map(function(id){
    var p=PRICES[PRICE_IDS.indexOf(id)]; if(!p) return "";
    return '<li><span>'+esc(p.name)+'</span><i></i><b>₹'+p.low+' – '+p.high+(typeof trendMark==="function"?trendMark(p):"")+'</b></li>';
  }).join("")+'</ul>';
}

/* Collector rate board: what you pay, what the recycler pays. */
function ledger2(ids){
  return '<table class="d-rates"><thead><tr><th>Scrap</th><th>You pay</th><th>Recycler pays</th></tr></thead><tbody>'+ids.map(function(id){
    var p=PRICES[PRICE_IDS.indexOf(id)]; if(!p) return "";
    return '<tr><td>'+esc(p.name)+'</td><td>₹'+p.low+' – '+p.high+'</td><td>₹'+p.sellLow+' – '+p.sellHigh+'</td></tr>';
  }).join("")+'</tbody></table>';
}
function notForRole(title,text){
  return '<div class="wrap"><section class="auth"><h2>'+title+'</h2><p>'+text+'</p><button class="btn" data-go="dashboard">Back to your dashboard</button></section></div>';
}

pages.dashboard = function(){
  if(!session) return needLogin("Log in to open your dashboard");
  return session.role==="collector" ? collectorDash() : customerDash();
};
wire.dashboard = function(){
  if(!session) return;
  if(session.role==="collector") wireCollectorDash(); else wireCustomerDash();
};
