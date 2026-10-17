/* Static pages: about, menu (after login), info pages, our journey, contact, not found. */

function points(list){
  return '<div class="three" style="margin:2rem 0">'+list.map(function(p){
    return '<div><h3>'+p[0]+'</h3><p style="color:var(--muted)">'+p[1]+'</p></div>';
  }).join("")+'</div>';
}

pages.about = function(){
  return '<div class="wrap"><section class="page">'+
    '<p class="kicker">About Scrap Setu</p>'+
    '<h2>We connect small scrap collectors to big recyclers.</h2>'+
    '<p class="lead">Setu (सेतु) means bridge. Many small collectors sell through a chain of middlemen and take whatever price they are offered. We want to shorten that chain.</p>'+
    '<figure class="wide-photo" style="margin-inline:0">'+photo("assets/photos/about.jpg","Photo: collectors at work","Scrap collectors at work")+'</figure>'+
    points([["For households","Book a pickup, get a listed rate, and photograph any scrap to see how it could be reused before you sell."],["For collectors","See pickup requests nearby and sell through us to large recyclers with steady demand."],["For the planet","More scrap reaches proper recycling instead of landfills and open burning."]])+
    '<div class="row"><button class="btn" data-go="signup">Join Scrap Setu</button><button class="btn ghost" data-go="home">Back to home</button></div>'+
  '</section></div>';
};

pages.menu = function(){ return pages.dashboard(); };
wire.menu = function(){ wire.dashboard(); };

pages.info = function(slug){
  var d=INFO[slug]; if(!d) return pages.notfound();
  return '<div class="wrap"><section class="page"><p class="kicker">'+d.kicker+'</p><h2>'+d.title+'</h2><p class="lead">'+d.text+'</p>'+
    points(d.points)+
    (d.soon?'<p><span class="tag">Coming soon</span></p>':'')+
    '<div class="row"><button class="btn" data-go="'+d.cta[1]+'">'+d.cta[0]+'</button><button class="btn ghost" data-go="home">Back to home</button></div></section></div>';
};

pages.journey = function(){
  var steps=[["The idea","Small scrap collectors lose out to long chains of middlemen. We wanted a bridge between them and large recyclers."],["The prototype","This website: rates, a scrap scanner and reuse ideas, built for a hackathon."],["Pilot with collectors","Test pickups and weighing with a small group of local collectors."],["Connect to recyclers","Start selling pooled, sorted scrap to large recycling companies."]];
  return '<div class="wrap"><section class="page"><p class="kicker">Our journey</p><h2>From an idea to a bridge</h2><p class="lead">Where we are and where we are going. The later steps are plans, not finished work.</p>'+
    '<ol class="walk">'+steps.map(function(x,i){return '<li><span class="n">'+(i+1)+'</span><div><h3>'+x[0]+(i>1?' <span class="tag">Planned</span>':'')+'</h3><p>'+x[1]+'</p></div></li>';}).join("")+'</ol>'+
    '<div class="row"><button class="btn" data-go="signup">Join us</button><button class="btn ghost" data-go="about">About us</button></div></section></div>';
};

pages.contact = function(){
  return '<div class="wrap"><section class="auth"><h2>Contact us</h2><p>Collectors, recyclers or just curious? Write to us.</p>'+
    '<form id="contactForm" novalidate>'+
      '<div class="field"><label for="cn">Your name</label><input id="cn" autocomplete="name" required></div>'+
      '<div class="field"><label for="ce">Email or phone</label><input id="ce" required></div>'+
      '<div class="field"><label for="cm">Message</label><textarea id="cm" rows="4" required></textarea></div>'+
      '<div id="cmsg"></div>'+
      '<div class="row"><button class="btn" type="submit">Send message</button><button class="btn ghost" type="button" data-go="home">Back to home</button></div>'+
    '</form><p class="hint" style="margin-top:1rem">Demo form: messages are not sent anywhere yet.</p></section></div>';
};

pages.notfound = function(){ return '<div class="wrap"><section class="auth"><h2>Page not found</h2><p>That page does not exist.</p><button class="btn" data-go="home">Go home</button></section></div>'; };

wire.contact = function(){
  $("#contactForm").addEventListener("submit", function(e){
    e.preventDefault();
    var ok=$("#cn").value.trim()&&$("#ce").value.trim()&&$("#cm").value.trim();
    $("#cmsg").innerHTML = ok ? '<div class="ok" role="status">Thanks, we have noted your message.</div>' : '<p class="err-text" role="alert">Fill in all three fields.</p>';
  });
};