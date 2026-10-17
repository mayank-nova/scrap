/* Top bar: dropdown menus, mobile menu, light/dark switch and global click handling. */

function ddItem(it){return '<button class="ddlink" data-go="'+it[1]+'">'+it[0]+'</button>';}
var navKey = null;
function buildNav(){
  var role=currentRole(); navKey=role;
  var cols=SERVICES[role];
  $("#mainNav").innerHTML=
    '<div class="dd mega"><button class="navlink ddbtn" data-dd="services" aria-expanded="false" aria-haspopup="true" aria-controls="dd-services">Services '+CARET+'</button>'+
      '<div class="ddpanel" id="dd-services"><div class="cols" style="--n:'+cols.length+'">'+cols.map(function(c){return '<div><h4>'+c.h+'</h4>'+c.items.map(ddItem).join("")+'</div>';}).join("")+'</div></div></div>'+
    TOPLINKS[role].map(function(t){ return '<button class="navlink" data-go="'+t[0]+'">'+t[1]+'</button>'; }).join("")+
    '<div class="dd small"><button class="navlink ddbtn" data-dd="company" aria-expanded="false" aria-haspopup="true" aria-controls="dd-company">Company '+CARET+'</button>'+
      '<div class="ddpanel" id="dd-company">'+COMPANY.map(ddItem).join("")+'</div></div>'+
    '<button class="navlink" data-go="info/careers">Careers</button>'+
    '<div class="mauth" id="authNavM"></div>';
}
function closeMenu(){
  var h=document.querySelector("header.site"); if(h) h.classList.remove("menu-open");
  var m=$("#menuBtn"); if(m){ m.setAttribute("aria-expanded","false"); m.setAttribute("aria-label","Open menu"); }
}
function closeDD(){
  document.querySelectorAll(".ddpanel.open").forEach(function(p){p.classList.remove("open");});
  document.querySelectorAll(".ddbtn").forEach(function(b){b.setAttribute("aria-expanded","false");});
}
function setTheme(t){
  document.documentElement.setAttribute("data-theme",t);
  var b=$("#themeBtn");
  if(b){ b.innerHTML = t==="dark" ? SUN : MOON; b.setAttribute("aria-label", t==="dark"?"Switch to light mode":"Switch to dark mode"); b.setAttribute("aria-pressed", t==="light"); }
  try{ localStorage.setItem("ss-theme",t); }catch(e){}
}
function initTheme(){
  var t="light"; try{ var v=localStorage.getItem("ss-theme"); if(v==="light"||v==="dark") t=v; }catch(e){}
  setTheme(t);
}
function doLogout(){
  session=null; Auth.logout();
  closeDD(); closeMenu();
  /* Go home and redraw straight away, from any page. replaceState does not fire
     "hashchange", so there is no loading screen and no waiting. */
  history.replaceState(null,"","#/home");
  render();
  window.scrollTo(0,0);
}

function renderNav(route){
  if(currentRole()!==navKey) buildNav();
  var html = session
    ? '<button class="btn small" data-go="dashboard">Dashboard</button><button class="btn ghost small logoutBtn">Log out</button>'
    : '<button class="btn ghost small" data-go="login">Log in</button><button class="btn small" data-go="signup">Sign up</button>';
  var el = $("#authNav"); if(el) el.innerHTML = html;
  var em = $("#authNavM"); if(em) em.innerHTML = html;
  document.querySelectorAll(".navlink").forEach(function(b){
    if(b.dataset.go===route) b.setAttribute("aria-current","page"); else b.removeAttribute("aria-current");
  });
  document.querySelectorAll(".logoutBtn").forEach(function(lo){ lo.onclick=doLogout; });
}

document.addEventListener("click", function(e){
  var d = e.target.closest("[data-dd]");
  if(d){
    var panel = document.getElementById("dd-"+d.dataset.dd), was = panel.classList.contains("open");
    closeDD();
    if(!was){ panel.classList.add("open"); d.setAttribute("aria-expanded","true"); }
    return;
  }
  if(e.target.closest("#menuBtn")){
    var hd=document.querySelector("header.site"), open=hd.classList.toggle("menu-open"), mb=$("#menuBtn");
    mb.setAttribute("aria-expanded",open); mb.setAttribute("aria-label",open?"Close menu":"Open menu"); return;
  }
  if(!e.target.closest("header.site")) closeMenu();
  if(e.target.closest("#themeBtn")){ setTheme(document.documentElement.getAttribute("data-theme")==="light"?"dark":"light"); return; }
  if(!e.target.closest(".ddpanel")) closeDD();
  var t = e.target.closest("[data-go]");
  if(t){ e.preventDefault(); closeDD(); closeMenu(); go(t.dataset.go); }
});
document.addEventListener("keydown", function(e){
  if(e.key==="Escape"){ closeMenu(); var open=document.querySelector(".ddpanel.open"); if(open){ var btn=open.parentNode.querySelector(".ddbtn"); closeDD(); if(btn) btn.focus(); } }
});
