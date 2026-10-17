/* Collector dashboard: jobs I have accepted, open requests I can take, rates to quote.
   The scanner and reuse ideas are for customers only, so nothing about them appears here. */

/* Routes that belong to customers. Never shown in the collector dashboard. */
var COLLECTOR_HIDDEN=["scan","pickup"];
function collectorOnly(items){ return items.filter(function(it){ return COLLECTOR_HIDDEN.indexOf(it[0])===-1; }); }

function collectorDash(){
  return '<div class="wrap dash"><aside>'+dashNav(collectorOnly([["dashboard","Overview"],["pickups","All requests"],["prices","Buy and sell rates"]]),"dashboard")+'</aside>'+
    '<section class="d-main" id="k-main">'+
      '<header class="d-head"><div><span class="d-label">'+dashDate()+'</span><h1>'+firstName()+'</h1></div>'+
        '<div class="d-filter"><label for="k-pin" class="d-label">Area pincode</label><input id="k-pin" inputmode="numeric" maxlength="6" placeholder="e.g. 1100" autocomplete="off"></div></header>'+
      '<div class="d-stats" id="k-stats">'+dStat("To collect","–")+dStat("Open requests","–")+dStat("Collected","–")+'</div>'+
      '<div class="d-cols wide">'+
        '<div class="d-sec"><h3>Your jobs</h3><div id="k-jobs" aria-live="polite"><p class="d-empty">Loading…</p></div></div>'+
        '<div class="d-sec"><h3>Open requests</h3><div id="k-open" aria-live="polite"><p class="d-empty">Loading…</p></div></div>'+
      '</div>'+
      '<div class="d-sec" style="margin-top:2.5rem"><h3>Your rates (per kg)</h3>'+ledger2(["newspaper","office-paper","cardboard","pet","iron","steel","aluminium","brass","copper","glass"])+
        '<p class="d-note">Weigh it in front of the customer and quote from this list. <button class="btn link" data-go="prices">Full list</button></p></div>'+
    '</section></div>';
}

function jobRow(p){
  return '<article class="d-job"><div class="d-top"><span class="d-ref">'+esc(p.id)+'</span><span class="d-when">'+esc(p.slot||"")+'</span></div>'+
    '<p class="d-what">'+itemsText(p)+'</p>'+
    '<p class="d-meta">'+esc(p.address||"")+(p.pincode?", "+esc(p.pincode):"")+'</p>'+
    '<p class="d-meta">'+(p.phone?esc(p.phone)+" · ":"")+(p.ownerName?esc(p.ownerName)+" · ":"")+'about '+rangeText(p)+'</p>'+
    '<button class="btn small" data-act="complete" data-id="'+esc(p.id)+'">Mark collected</button></article>';
}
function openRow(p){
  return '<article class="d-job"><div class="d-top"><span class="d-ref">'+esc(p.id)+'</span><span class="d-when">'+esc(p.slot||"")+'</span></div>'+
    '<p class="d-what">'+itemsText(p)+'</p>'+
    '<p class="d-meta">Pincode '+esc(p.pincode||"")+' · about '+rangeText(p)+'</p>'+
    '<button class="btn small" data-act="accept" data-id="'+esc(p.id)+'">Accept this pickup</button></article>';
}

function wireCollectorDash(){
  var jobsEl=$("#k-jobs"), openEl=$("#k-open"), stats=$("#k-stats"), pin=$("#k-pin"), main=$("#k-main");
  if(!jobsEl||!openEl||!stats||!pin) return;
  /* Safety net: remove any scanner or reuse-idea link that gets added to this page later. */
  document.querySelectorAll('.dash [data-go="scan"], .dash .ideas, .dash .rgrid').forEach(function(el){ el.remove(); });
  var mine=[], open=[];

  function bySlot(a,b){ return String(a.slot||"").localeCompare(String(b.slot||"")); }
  function paint(){
    var prefix=(pin.value||"").trim();
    var shown=open.filter(function(p){ return !prefix || String(p.pincode||"").indexOf(prefix)===0; });
    var todo=mine.filter(function(p){ return p.status==="accepted"; }).sort(bySlot);
    var done=mine.filter(function(p){ return p.status==="completed"; }), earned=0;
    done.forEach(function(p){ earned+=pickupValue(p); });
    stats.innerHTML = dStat("To collect",String(todo.length))
      + dStat("Open requests",String(shown.length)+(prefix?" in "+esc(prefix)+"…":""))
      + dStat("Collected",done.length+(done.length?" · ≈ "+money(earned):""));
    jobsEl.innerHTML = todo.length ? todo.map(jobRow).join("") : '<p class="d-empty">No jobs yet. Accept a request from the list.</p>';
    openEl.innerHTML = shown.length ? shown.map(openRow).join("")
      : '<p class="d-empty">'+(prefix?"No open requests for that pincode.":"No open requests right now. Check back soon.")+'</p>';
  }
  function load(){
    Promise.all([API.myPickups(),API.openPickups()]).then(function(r){ mine=r[0]; open=r[1]; paint(); }).catch(function(er){
      if(er.status===401){ handleAuthLost(); return; }
      jobsEl.innerHTML='<p class="err-text" role="alert">'+esc(er.message||"Could not load your jobs.")+'</p>'; openEl.innerHTML="";
    });
  }
  pin.addEventListener("input",paint);
  main.addEventListener("click",function(e){
    var b=e.target.closest("[data-act]"); if(!b) return; b.disabled=true;
    var id=b.dataset.id, call = b.dataset.act==="accept" ? API.accept(id) : askPayout(id).then(function(amt){ if(amt===false) return Promise.reject({cancelled:true}); return API.complete(id,amt); });
    call.then(load).catch(function(er){
      if(er.cancelled){ b.disabled=false; return; }
      if(er.status===401){ handleAuthLost(); return; }
      b.disabled=false; main.insertAdjacentHTML("afterbegin",'<p class="err-text" role="alert">'+esc(er.message||"That did not work.")+'</p>');
      load();
    });
  });
  load();
}