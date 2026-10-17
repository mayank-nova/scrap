/* Prices page. Customers (and guests) see what a collector pays them.
   Collectors see what they pay the customer, what recyclers pay them, and their margin. */

pages.prices = function(){ return currentRole()==="collector" ? collectorPrices() : customerPrices(); };
wire.prices  = function(){ if(currentRole()==="collector") wireCollectorPrices(); else wireCustomerPrices(); };

function priceCats(){ return ["All"].concat(PRICES.map(function(p){return p.cat;}).filter(function(c,i,a){return a.indexOf(c)===i;})); }
function catChips(){
  return '<div class="toolbar" role="group" aria-label="Filter by type">'+priceCats().map(function(c){return '<button class="chip" data-cat="'+c+'" aria-pressed="'+(c===priceCat)+'">'+c+'</button>';}).join("")+'</div>';
}
function typeSelect(){ return '<select id="cs">'+PRICES.map(function(p,i){return '<option value="'+i+'">'+esc(p.name)+'</option>';}).join("")+'</select>'; }
function rowIcon(p){ return '<span class="item">'+ICONS[PRICES.indexOf(p)]+'<span>'+esc(p.name)+'</span></span>'; }
function bindChips(draw){
  document.querySelectorAll(".chip").forEach(function(c){
    c.addEventListener("click", function(){
      priceCat=c.dataset.cat;
      document.querySelectorAll(".chip").forEach(function(x){x.setAttribute("aria-pressed", x===c);});
      draw();
    });
  });
}
function perKgMargin(p){ return (p.sellLow+p.sellHigh)/2 - (p.low+p.high)/2; }
/* Up/down arrow when the admin has set a market trend on an item (trendMark lives in extras.js). */
function trend(p){ return typeof trendMark==="function" ? trendMark(p) : ""; }
function oneDecimal(n){ return String(Math.round(n*10)/10); }

/* ---------- customer / guest ---------- */
function customerPrices(){
  return '<div class="wrap"><section class="page">'+
    '<p class="kicker">Tentative rates</p>'+
    '<h2>What your raddi is worth</h2>'+
    '<p class="lead">This is what a collector pays you, in rupees per kg. These are sample prices and will change with the market.</p>'+
    catChips()+
    '<div class="scroll"><table class="t-cat"><thead><tr><th>Scrap type</th><th>Category</th><th>You get per kg</th></tr></thead><tbody id="ptable"></tbody></table></div>'+
    '<div class="calc card">'+
      '<div class="field"><label for="cw">Weight (kg)</label><input id="cw" type="number" min="0" value="10"></div>'+
      '<div class="field"><label for="cs">Scrap type</label>'+typeSelect()+'</div>'+
      '<div><div class="hint">Estimated payout</div><output id="cout" aria-live="polite"></output></div>'+
    '</div>'+
  '</section></div>';
}
function wireCustomerPrices(){
  function draw(){
    $("#ptable").innerHTML = PRICES.filter(function(p){return priceCat==="All"||p.cat===priceCat;}).map(function(p){
      return '<tr><td>'+rowIcon(p)+'</td><td>'+p.cat+'</td><td class="price">₹'+p.low+" – ₹"+p.high+trend(p)+'</td></tr>';
    }).join("");
  }
  function calc(){
    var w = parseFloat($("#cw").value)||0, p = PRICES[+$("#cs").value];
    $("#cout").textContent = "₹"+Math.round(w*p.low)+" – ₹"+Math.round(w*p.high);
  }
  bindChips(draw);
  $("#cw").addEventListener("input",calc); $("#cs").addEventListener("change",calc);
  draw(); calc();
}

/* ---------- collector ---------- */
function collectorPrices(){
  return '<div class="wrap"><section class="page">'+
    '<p class="kicker">Collector rates</p>'+
    '<h2>Buy from customers, sell to recyclers</h2>'+
    '<p class="lead">Rupees per kg. "You pay" is what you give the customer. "Recycler pays" is the bulk rate you sell at. Sample numbers for now.</p>'+
    catChips()+
    '<div class="scroll"><table><thead><tr><th>Scrap type</th><th>You pay</th><th>Recycler pays</th><th>Margin per kg</th></tr></thead><tbody id="ptable"></tbody></table></div>'+
    '<div class="calc card">'+
      '<div class="field"><label for="cw">Weight (kg)</label><input id="cw" type="number" min="0" value="50"></div>'+
      '<div class="field"><label for="cs">Scrap type</label>'+typeSelect()+'</div>'+
      '<dl class="quote-out" aria-live="polite">'+
        '<div><dt>Pay the customer</dt><dd id="q-pay"></dd></div>'+
        '<div><dt>Recycler pays you</dt><dd id="q-sell"></dd></div>'+
        '<div><dt>Your margin</dt><dd id="q-margin"></dd></div>'+
      '</dl>'+
    '</div>'+
  '</section></div>';
}
function wireCollectorPrices(){
  function draw(){
    $("#ptable").innerHTML = PRICES.filter(function(p){return priceCat==="All"||p.cat===priceCat;}).map(function(p){
      return '<tr><td>'+rowIcon(p)+'</td><td class="price">₹'+p.low+" – ₹"+p.high+trend(p)+'</td><td class="price">₹'+p.sellLow+" – ₹"+p.sellHigh+'</td><td class="price">₹'+oneDecimal(perKgMargin(p))+'</td></tr>';
    }).join("");
  }
  function calc(){
    var w = parseFloat($("#cw").value)||0, p = PRICES[+$("#cs").value];
    $("#q-pay").textContent = "₹"+Math.round(w*p.low)+" – ₹"+Math.round(w*p.high);
    $("#q-sell").textContent = "₹"+Math.round(w*p.sellLow)+" – ₹"+Math.round(w*p.sellHigh);
    $("#q-margin").textContent = "about ₹"+Math.round(w*perKgMargin(p));
  }
  bindChips(draw);
  $("#cw").addEventListener("input",calc); $("#cs").addEventListener("change",calc);
  draw(); calc();
}
