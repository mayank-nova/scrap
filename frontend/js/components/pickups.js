/* Schedule a pickup form and the pickups list (customer and collector views). */

function needLogin(msg){
  return '<div class="wrap"><section class="auth"><h2>'+msg+'</h2><p>You need an account for this. It takes a minute.</p><div class="row"><button class="btn" data-go="login">Log in</button><button class="btn ghost" data-go="signup">Create account</button></div></section></div>';
}
function itemLabel(id){ var i=PRICE_IDS.indexOf(id); return i>=0?PRICES[i].name:id; }
function typeOptions(){ return PRICES.map(function(p,i){ return '<option value="'+PRICE_IDS[i]+'">'+esc(p.name)+'</option>'; }).join(""); }
function itemRow(){
  return '<div class="irow"><select class="it-type" aria-label="Scrap type">'+typeOptions()+'</select><input class="it-kg" type="number" inputmode="decimal" min="0.5" max="500" step="0.5" value="5" aria-label="Weight in kilograms"><span class="hint">kg</span><button type="button" class="btn ghost small it-del">Remove</button></div>';
}
pages.pickup = function(){
  if(!session) return needLogin("Log in to schedule a pickup");
  if(session.role==="collector") return '<div class="wrap"><section class="auth"><h2>Pickups are booked by customers</h2><p>As a collector, you can see and accept requests.</p><button class="btn" data-go="pickups">Pickup requests</button></section></div>';
  var today=new Date().toISOString().slice(0,10);
  return '<div class="wrap"><section class="page"><p class="kicker">Scrap pickup</p><h2>Schedule a pickup</h2>'+
    '<p class="lead">Tell us what you have and when. A collector near you will accept the request.</p>'+
    (REMOTE?'':'<p class="hint">Demo mode: requests are kept in this browser tab only.</p>')+
    '<form id="pickupForm" class="card pform" novalidate>'+
      '<div class="field"><label for="pa">Pickup address</label><textarea id="pa" rows="2" autocomplete="street-address" required></textarea></div>'+
      '<div class="two"><div class="field"><label for="pp">Pincode</label><input id="pp" inputmode="numeric" maxlength="6" autocomplete="postal-code" required></div>'+
      '<div class="field"><label for="ph">Phone (optional)</label><input id="ph" type="tel" autocomplete="tel"></div></div>'+
      '<div class="two"><div class="field"><label for="pd">Date</label><input id="pd" type="date" min="'+today+'" value="'+today+'" required></div>'+
      '<div class="field"><label for="ps">Time slot</label><select id="ps"><option>Morning (8 to 12)</option><option>Afternoon (12 to 4)</option><option>Evening (4 to 8)</option></select></div></div>'+
      '<fieldset class="field items"><legend>What are you selling?</legend><div id="items">'+itemRow()+'</div><button type="button" class="btn ghost small" id="addItem">Add another type</button></fieldset>'+
      '<p class="earn">Estimated value <output id="est" aria-live="polite"></output></p>'+
      '<div class="field"><label for="pn">Notes for the collector (optional)</label><input id="pn" maxlength="200"></div>'+
      '<p class="err-text" id="perr" role="alert" hidden></p>'+
      '<div class="row"><button class="btn" type="submit">Request pickup</button><button class="btn ghost" type="button" data-go="dashboard">Cancel</button></div>'+
    '</form><div id="pdone"></div></section></div>';
};

function statusTag(st){ return '<span class="tag st-'+esc(st)+'">'+esc(st)+'</span>'; }
function pickupCard(p, mode){
  var items=(p.items||[]).map(function(i){ return esc(i.name||itemLabel(i.type))+" "+esc(i.kg)+" kg"; }).join(" · ");
  var addr = p.address ? '<p><b>Address:</b> '+esc(p.address)+(p.pincode?', '+esc(p.pincode):'')+'</p>' : (p.pincode?'<p><b>Area pincode:</b> '+esc(p.pincode)+'</p>':'');
  var phone = p.phone ? '<p><b>Phone:</b> '+esc(p.phone)+'</p>' : '';
  var act='';
  if(mode==="open") act='<button class="btn small" data-act="accept" data-id="'+esc(p.id)+'">Accept this pickup</button>';
  if(mode==="mine" && p.status==="accepted") act='<button class="btn small" data-act="complete" data-id="'+esc(p.id)+'">Mark as collected</button>';
  return '<article class="card pk"><div class="rhead">'+statusTag(p.status)+'<span class="hint">'+esc(p.slot||"")+'</span></div>'+
    '<p class="pk-items">'+items+'</p>'+addr+phone+
    '<p class="hint">Estimated value ₹'+Number(p.estLow||0).toLocaleString("en-IN")+' – ₹'+Number(p.estHigh||0).toLocaleString("en-IN")+(p.ownerName?' · '+esc(p.ownerName):'')+'</p>'+act+'</article>';
}
pages.pickups = function(){
  if(!session) return needLogin("Log in to see your pickups");
  var col = session.role==="collector";
  return '<div class="wrap"><section class="page"><p class="kicker">'+(col?'Collector dashboard':'Your pickups')+'</p><h2>'+(col?'Pickup requests':'My pickups')+'</h2>'+
    (REMOTE?'':'<p class="hint">Demo mode: data lives in this browser tab only. Create a pickup as <b>demo</b>, then log in as <b>collector</b> to accept it.</p>')+
    (col ? '<div class="rtabs" role="tablist"><button class="rtab" data-pt="open" aria-selected="true">Open requests</button><button class="rtab" data-pt="mine" aria-selected="false">My jobs</button></div>'
         : '<div class="row"><button class="btn" data-go="pickup">Schedule a pickup</button></div>')+
    '<div class="plist" id="plist" aria-live="polite"><p class="hint">Loading…</p></div></section></div>';
};

wire.pickup = function(){
  var f=$("#pickupForm"); if(!f) return;
  var box=$("#items");
  function rows(){ return Array.prototype.slice.call(box.querySelectorAll(".irow")); }
  function read(){ return rows().map(function(r){ return {type:r.querySelector(".it-type").value, kg:parseFloat(r.querySelector(".it-kg").value)||0}; }); }
  function est(){ var e=estimate(read()); $("#est").textContent="₹"+e.low.toLocaleString("en-IN")+" – ₹"+e.high.toLocaleString("en-IN"); }
  box.addEventListener("input",est); box.addEventListener("change",est);
  box.addEventListener("click",function(e){ var d=e.target.closest(".it-del"); if(d&&rows().length>1){ d.closest(".irow").remove(); est(); } });
  $("#addItem").addEventListener("click",function(){ if(rows().length>=10) return; box.insertAdjacentHTML("beforeend",itemRow()); est(); });
  est();
  f.addEventListener("submit",function(e){
    e.preventDefault(); var err=$("#perr"); err.hidden=true;
    var items=read(), pin=$("#pp").value.trim(), addr=$("#pa").value.trim();
    var msg = addr.length<5 ? "Enter your full address." : !/^\d{6}$/.test(pin) ? "Pincode must be 6 digits."
      : items.some(function(i){ return !(i.kg>=0.5&&i.kg<=500); }) ? "Each weight must be between 0.5 and 500 kg." : "";
    if(msg){ err.textContent=msg; err.hidden=false; return; }
    var btn=f.querySelector("button[type=submit]"); btn.disabled=true;
    API.createPickup({address:addr,pincode:pin,phone:$("#ph").value.trim(),slot:$("#pd").value+" "+$("#ps").value,notes:$("#pn").value.trim(),items:items}).then(function(p){
      f.hidden=true;
      $("#pdone").innerHTML='<div class="ok" role="status"><b>Pickup requested.</b> Your reference is <b>'+esc(p.id)+'</b>.</div><div class="row"><button class="btn" data-go="pickups">View my pickups</button><button class="btn ghost" data-go="dashboard">Back</button></div>';
    }).catch(function(er){ btn.disabled=false; if(er.status===401){ handleAuthLost(); return; } err.textContent=er.message||"Could not save your request."; err.hidden=false; });
  });
};

wire.pickups = function(){
  var list=$("#plist"); if(!list) return;
  var col = session && session.role==="collector", kind = col ? "open" : "mine";
  function load(){
    list.innerHTML='<p class="hint">Loading…</p>';
    var pr = (col && kind==="open") ? API.openPickups() : API.myPickups();
    pr.then(function(items){
      list.innerHTML = items.length ? items.map(function(p){ return pickupCard(p, col?kind:"cust"); }).join("")
        : '<p class="hint">'+(col&&kind==="open"?"No open requests right now.":"Nothing here yet.")+'</p>';
    }).catch(function(er){
      if(er.status===401){ handleAuthLost(); return; }
      list.innerHTML='<p class="err-text" role="alert">'+esc(er.message||"Could not load pickups.")+'</p>';
    });
  }
  document.querySelectorAll("[data-pt]").forEach(function(b){ b.addEventListener("click",function(){
    kind=b.dataset.pt; document.querySelectorAll("[data-pt]").forEach(function(x){ x.setAttribute("aria-selected", x===b); }); load();
  }); });
  list.addEventListener("click",function(e){
    var b=e.target.closest("[data-act]"); if(!b) return; b.disabled=true;
    var id=b.dataset.id, call = b.dataset.act==="accept" ? API.accept(id) : askPayout(id).then(function(amt){ if(amt===false) return Promise.reject({cancelled:true}); return API.complete(id,amt); });
    call.then(function(){ load(); }).catch(function(er){
      if(er.cancelled){ b.disabled=false; return; }
      if(er.status===401){ handleAuthLost(); return; }
      b.disabled=false; list.insertAdjacentHTML("afterbegin",'<p class="err-text" role="alert">'+esc(er.message||"That did not work.")+'</p>');
    });
  });
  load();
};
