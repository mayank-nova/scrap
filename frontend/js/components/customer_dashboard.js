/* Customer dashboard: my pickups, what I have earned, today's rates. */

function customerDash(){
  return '<div class="wrap dash"><aside>'+dashNav([["dashboard","Overview"],["pickup","Book a pickup"],["pickups","My pickups"],["scan","Scan scrap"],["prices","Rates"]],"dashboard")+'</aside>'+
    '<section class="d-main">'+
      '<header class="d-head"><div><span class="d-label">'+dashDate()+'</span><h1>Namaste, '+firstName()+'</h1></div><button class="btn" data-go="pickup">Book a pickup</button></header>'+
      '<div class="d-stats" id="c-stats"></div>'+
      '<div class="d-cols">'+
        '<div class="d-sec"><h3>Your pickups</h3><div id="c-list" aria-live="polite"><p class="d-empty">Loading…</p></div></div>'+
        '<div class="d-sec"><h3>What you get (per kg)</h3>'+ledger(["newspaper","cardboard","pet","iron","aluminium","copper"])+
          '<p class="d-note">These are tentative. <button class="btn link" data-go="prices">See every rate</button></p>'+
          '<h3 style="margin-top:2rem">Not sure what it is?</h3>'+
          '<p class="d-note" style="margin-top:0">Take a photo of it. The scanner says what material it is, what you could make from it, and what it would fetch. <button class="btn link" data-go="scan">Open the scanner</button></p>'+
        '</div>'+
      '</div>'+
    '</section></div>';
}

function custRow(p){
  return '<div class="d-row"><span class="d-ref">'+esc(p.id)+'</span><span class="d-what">'+itemsText(p)+'</span><span class="d-state">'+statusDot(p.status)+'</span>'+
    '<span class="d-when">'+esc(p.slot||"")+'</span><span class="d-when d-val">'+rangeText(p)+'</span></div>';
}

function wireCustomerDash(){
  var list=$("#c-list"), stats=$("#c-stats"); if(!list||!stats) return;
  API.myPickups().then(function(items){
    
    list.innerHTML = items.length ? items.slice(0,8).map(custRow).join("")
      : '<p class="d-empty">Nothing booked yet. Put your newspapers, bottles and old metal in one place and book a slot.</p>';
  }).catch(function(er){
    if(er.status===401){ handleAuthLost(); return; }
    list.innerHTML='<p class="err-text" role="alert">'+esc(er.message||"Could not load your pickups.")+'</p>';
  });
}
