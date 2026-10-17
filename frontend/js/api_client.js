/* Talks to the Scrap Setu backend: login/signup and the REST API (with a local demo fallback when apiUrl is empty). */

function fail(code,msg){ var e=new Error(msg||code); e.code=code; return e; }
function saveTokens(t){ tokens=t; try{ if(t) localStorage.setItem(TOKEN_KEY,JSON.stringify(t)); else localStorage.removeItem(TOKEN_KEY); }catch(e){} }
function loadTokens(){ if(!tokens){ try{ tokens=JSON.parse(localStorage.getItem(TOKEN_KEY)||"null"); }catch(e){ tokens=null; } } return tokens; }
function apiBase(){ return CFG.apiUrl.replace(/\/$/,""); }
/* Login and signup: the backend returns {token, user}. Wrong password etc. are mapped to the codes the login screens already understand. */
function authCall(path, body){
  return fetch(apiBase()+path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})
    .then(function(r){ return r.json().catch(function(){ return {}; }).then(function(j){
      if(!r.ok){ throw fail(r.status===401?"NotAuthorizedException":r.status===409?"UsernameExistsException":r.status===400?"InvalidParameterException":"Failed", j.error||"Request failed"); }
      saveTokens({token:j.token}); return j.user;
    }); });
}

var Auth = {
  login:function(username,password){
    if(!AUTH_REMOTE){
      var rec=users[String(username).toLowerCase()];
      return (rec&&rec.password===password) ? Promise.resolve({name:rec.name,username:username,role:rec.role||"customer"}) : Promise.reject(fail("NotAuthorizedException"));
    }
    return authCall("/auth/login",{username:username,password:password});
  },
  signup:function(f){
    if(!AUTH_REMOTE){
      if(users[f.username]) return Promise.reject(fail("UsernameExistsException"));
      users[f.username]={password:f.password,name:f.name,role:f.role};
      return Promise.resolve({name:f.name,username:f.username,role:f.role});
    }
    return authCall("/auth/signup",{name:f.name,username:f.username,email:f.email,role:f.role,password:f.password});
  },
  /* Google sign-in: the backend checks the Google token and returns {token, user}. role is used only when the account is new. */
  google:function(credential,role){ return authCall("/auth/google",{credential:credential,role:role}); },
  /* Password reset by email is not built yet. */
  forgot:function(){ return Promise.reject(fail("Unsupported")); },
  reset:function(){ return Promise.reject(fail("Unsupported")); },
  restore:function(){
    if(!AUTH_REMOTE || !loadTokens()) return Promise.resolve(null);
    return fetch(apiBase()+"/auth/me",{headers:{Authorization:"Bearer "+tokens.token}})
      .then(function(r){ if(!r.ok){ if(r.status===401) saveTokens(null); return null; } return r.json().then(function(j){ return j.user; }); })
      .catch(function(){ return null; });
  },
  logout:function(){ saveTokens(null); }
};

function apiFetch(path, opts){
  opts=opts||{};
  var h={"Content-Type":"application/json"};
  if(opts.auth){ if(!loadTokens()) return Promise.reject(Object.assign(new Error("Please log in."),{status:401})); h.Authorization="Bearer "+tokens.token; }
  return fetch(apiBase()+path,{method:opts.method||"GET",headers:h,body:opts.body?JSON.stringify(opts.body):undefined})
  .then(function(r){
    return r.json().catch(function(){ return {}; }).then(function(j){
      if(!r.ok){ var e=new Error(j.error||j.message||("Request failed ("+r.status+")")); e.status=r.status; throw e; }
      return j;
    });
  });
}
function estimate(items){
  var lo=0, hi=0;
  items.forEach(function(it){ var i=PRICE_IDS.indexOf(it.type); if(i<0) return; lo+=it.kg*PRICES[i].low; hi+=it.kg*PRICES[i].high; });
  return {low:Math.round(lo), high:Math.round(hi)};
}
function mergePrices(list){
  if(!list) return;
  list.forEach(function(p){ var i=PRICE_IDS.indexOf(p.id); if(i>=0){ PRICES[i].low=p.low; PRICES[i].high=p.high; PRICES[i].trendPct=p.trendPct||0; if(p.sellLow!=null){ PRICES[i].sellLow=p.sellLow; PRICES[i].sellHigh=p.sellHigh; } } });
}
function toB64(src,max){
  return new Promise(function(res,rej){
    var im=new Image();
    im.onload=function(){ var k=Math.min(1,max/Math.max(im.width,im.height)); var c=document.createElement("canvas"); c.width=Math.round(im.width*k); c.height=Math.round(im.height*k); c.getContext("2d").drawImage(im,0,0,c.width,c.height); res(c.toDataURL("image/jpeg",.8).split(",")[1]); };
    im.onerror=rej; im.src=src;
  });
}

var API = {
  prices:function(){ return REMOTE ? apiFetch("/prices").then(function(j){ return j.prices; }) : Promise.resolve(null); },
  scan:function(b64){ return apiFetch("/scan",{method:"POST",body:{image:b64}}); },
  createPickup:function(p){
    if(REMOTE) return apiFetch("/pickups",{method:"POST",auth:true,body:p}).then(function(j){ return j.pickup; });
    var e=estimate(p.items);
    var rec=Object.assign({id:"demo-"+Date.now().toString(36),status:"open",createdAt:new Date().toISOString(),ownerName:session.name,estLow:e.low,estHigh:e.high},p);
    rec.items=p.items.map(function(i){ return {type:i.type,kg:i.kg,name:itemLabel(i.type)}; });
    mock.pickups.unshift(rec); return Promise.resolve(rec);
  },
  myPickups:function(){
    if(REMOTE) return apiFetch("/pickups",{auth:true}).then(function(j){ return j.pickups; });
    return Promise.resolve(mock.pickups.filter(function(p){ return session.role==="collector" ? p.collectorName===session.name : p.ownerName===session.name; }));
  },
  openPickups:function(){
    if(REMOTE) return apiFetch("/pickups/open",{auth:true}).then(function(j){ return j.pickups; });
    return Promise.resolve(mock.pickups.filter(function(p){ return p.status==="open"; }).map(function(p){ var c=Object.assign({},p); delete c.address; delete c.phone; delete c.notes; delete c.ownerName; return c; }));
  },
  accept:function(id){
    if(REMOTE) return apiFetch("/pickups/"+encodeURIComponent(id)+"/accept",{method:"POST",auth:true}).then(function(j){ return j.pickup; });
    var p=mock.pickups.find(function(x){ return x.id===id; });
    if(!p||p.status!=="open") return Promise.reject(Object.assign(new Error("This request is no longer open."),{status:409}));
    p.status="accepted"; p.collectorName=session.name; return Promise.resolve(p);
  },
  complete:function(id,amount){
    if(REMOTE) return apiFetch("/pickups/"+encodeURIComponent(id)+"/complete",{method:"POST",auth:true,body:amount!=null?{finalAmount:amount}:{}}).then(function(j){ return j.pickup; });
    var p=mock.pickups.find(function(x){ return x.id===id; });
    if(!p||p.status!=="accepted") return Promise.reject(Object.assign(new Error("You can only complete a pickup you accepted."),{status:409}));
    p.status="completed"; if(amount!=null) p.finalAmount=amount; return Promise.resolve(p);
  },
  /* ---- used by js/extras.js ---- */
  config:function(){ return apiFetch("/config"); },
  content:function(){ return apiFetch("/content"); },
  contact:function(b){ return apiFetch("/contact",{method:"POST",body:b}); },
  cancel:function(id){ return apiFetch("/pickups/"+encodeURIComponent(id)+"/cancel",{method:"POST",auth:true,body:{}}).then(function(j){ return j.pickup; }); },
  rate:function(id,rating,review){ return apiFetch("/pickups/"+encodeURIComponent(id)+"/rate",{method:"POST",auth:true,body:{rating:rating,review:review||""}}).then(function(j){ return j.pickup; }); },
  setLocation:function(lat,lng){ return apiFetch("/me/location",{method:"POST",auth:true,body:{lat:lat,lng:lng}}); },
  stats:function(){ return apiFetch("/stats",{auth:true}); },
  notifications:function(){ return apiFetch("/notifications",{auth:true}); },
  readNotifications:function(){ return apiFetch("/notifications/read",{method:"POST",auth:true,body:{}}); },
  videos:function(q){ return apiFetch("/videos?q="+encodeURIComponent(q)); },
  adminOverview:function(){ return apiFetch("/admin/overview",{auth:true}); },
  pricesRaw:function(){ return apiFetch("/admin/prices",{auth:true}); },
  adminSetPrice:function(id,body){ return apiFetch("/admin/prices/"+encodeURIComponent(id),{method:"PUT",auth:true,body:body}); },
  adminSetContent:function(key,value){ return apiFetch("/admin/content/"+encodeURIComponent(key),{method:"PUT",auth:true,body:{value:value}}); },
  adminMessages:function(){ return apiFetch("/admin/messages",{auth:true}); }
};
function handleAuthLost(){ session=null; Auth.logout(); go("login"); }

/* Ask the collector what they actually paid, so earnings use the real amount. Resolves to a number, null (skipped) or false (cancelled). */
function askPayout(id){
  return new Promise(function(res){
    if(typeof openModal!=="function"){ var v=window.prompt("Amount you paid the customer in rupees (leave empty to skip):",""); res(v===null?false:(v.trim()===""?null:(Number(v)>=0?Number(v):null))); return; }
    var m=openModal('<h3 style="margin-top:0">Mark '+esc(id)+' as collected</h3><div class="field"><label for="pay">Amount you paid the customer (₹, optional)</label><input id="pay" type="number" min="0" inputmode="decimal"></div><p class="hint">This keeps the earnings on both dashboards accurate. Leave it empty to use the estimate.</p><div class="row"><button class="btn" id="paySave" type="button">Mark collected</button><button class="btn ghost" type="button" data-close>Cancel</button></div>');
    var done=false;
    m.querySelector("#paySave").addEventListener("click",function(){ var v=m.querySelector("#pay").value.trim(); done=true; closeModal(); res(v===""?null:Math.max(0,Number(v)||0)); });
    new MutationObserver(function(_,o){ if(!document.getElementById("ssModal")){ o.disconnect(); if(!done) res(false); } }).observe(document.body,{childList:true});
  });
}
