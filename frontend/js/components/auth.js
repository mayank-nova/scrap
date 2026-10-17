/* Login, signup and forgot-password pages. */

function loginForm(isError){
  return '<div class="wrap"><section class="auth">'+
    '<h2>'+(isError?'Try logging in again':'Log in')+'</h2>'+
    (isError?'<div class="alert" role="alert">We could not log you in. Check your details or reset your password.</div>':'')+
    '<form id="loginForm" novalidate>'+
      '<div class="field"><label for="u">'+(AUTH_REMOTE?'Username or email':'Username')+'</label><input id="u" name="u" autocomplete="username" '+(isError?'class="bad" aria-invalid="true" aria-describedby="e1"':'')+' required></div>'+
      '<div class="field"><label for="p">Password</label><input id="p" name="p" type="password" autocomplete="current-password" '+(isError?'class="bad" aria-invalid="true" aria-describedby="e1"':'')+' required></div>'+
      (isError?'<p class="err-text" id="e1" role="alert">Incorrect username or password</p>':'')+
      '<p class="err-text" id="lerr" role="alert" hidden></p>'+
      '<div class="row"><button class="btn" type="submit">Log in</button>'+
      (isError?'<button class="btn ghost" type="button" data-go="forgot">Forgot password?</button>':'')+
      '</div>'+
    '</form>'+
    (AUTH_REMOTE?'':'<p class="hint" style="margin-top:1.2rem">Demo logins (password <b>scrap123</b>): <b>demo</b> is a customer, <b>collector</b> is a scrap collector.</p>')+
    
    '<p class="hint">New here? <button class="btn link" data-go="signup">Create an account</button></p>'+
    
  '</section></div>';
}
pages.login = function(){ return loginForm(false); };
pages["login-error"] = function(){ return loginForm(true); };

pages.signup = function(){
  return '<div class="wrap"><section class="auth">'+
    '<h2>Create your account</h2>'+
    '<form id="signupForm" novalidate>'+
      '<div class="field"><label for="sn">Full name</label><input id="sn" autocomplete="name" required></div>'+
      '<div class="field"><label for="su">Username (letters, numbers, underscore)</label><input id="su" autocomplete="username" autocapitalize="none" required></div>'+
      '<div class="field"><label for="sm">Email'+' (optional)'+'</label><input id="sm" type="email" autocomplete="email" '+''+'></div>'+
      '<div class="field"><label for="sr">I am a</label><select id="sr"><option value="customer">Customer</option><option value="collector">Scrap collector</option></select></div>'+
      '<div class="field"><label for="sp">Password (6+ characters)</label><input id="sp" type="password" autocomplete="new-password" required></div>'+
      '<p class="err-text" id="se" role="alert" hidden></p>'+
      '<div class="row"><button class="btn" type="submit">Sign up</button><button class="btn ghost" type="button" data-go="login">I already have an account</button></div>'+
    '</form></section></div>';
};
pages.forgot = function(){
  return '<div class="wrap"><section class="auth"><h2>Reset your password</h2><div id="forgotBox"></div></section></div>';
};

wire.login = wire["login-error"] = function(){
  var f = $("#loginForm"); if(!f) return;
  var box = f.parentNode;
  function done(sn){ session = sn; go("dashboard"); }
  function newPasswordStage(err){
    box.innerHTML='<h2>Set a new password</h2><p>Your account was created by an administrator. Choose your own password to continue.</p>'+
      '<form id="npForm" novalidate><div class="field"><label for="np">New password (6+ characters)</label><input id="np" type="password" autocomplete="new-password" required></div>'+
      '<p class="err-text" id="nperr" role="alert" hidden></p><div class="row"><button class="btn" type="submit">Save and log in</button></div></form>';
    $("#npForm").addEventListener("submit",function(e){
      e.preventDefault(); var pw=$("#np").value, m=$("#nperr"), b=e.target.querySelector("button[type=submit]");
      if(pw.length<6){ m.textContent="Password must be at least 6 characters."; m.hidden=false; return; }
      b.disabled=true;
      Auth.newPassword(err.username,pw,err.challengeSession).then(done).catch(function(er){
        b.disabled=false; m.textContent = er.code==="InvalidPasswordException" ? (er.message||"That password is not allowed.") : "Could not set the password. Please try again."; m.hidden=false;
      });
    });
  }
  f.addEventListener("submit", function(e){
    e.preventDefault();
    var u = $("#u").value.trim(), p = $("#p").value, btn=f.querySelector("button[type=submit]"), le=$("#lerr");
    le.hidden = true; btn.disabled = true;
    Auth.login(u,p).then(done).catch(function(err){
      btn.disabled = false;
      var msg = "";
      if(err.code==="NotAuthorizedException"||err.code==="UserNotFoundException"){
        if(location.hash==="#/login-error"){ render(); var uu=$("#u"); if(uu) uu.focus(); } else go("login-error");
        return;
      }
      if(err.code==="NewPasswordRequired"){ newPasswordStage(err); return; }
      if(err.code==="UserNotConfirmedException") msg="Your account is not confirmed yet. Check your email for the confirmation link or code.";
      else if(err.code==="PasswordResetRequiredException") msg="You need to reset your password before logging in. Use Forgot your password.";
      else if(err.code==="TooManyRequestsException"||err.code==="LimitExceededException") msg="Too many attempts. Wait a minute and try again.";
      else msg="We could not reach the server to log you in. Check your connection and try again.";
      le.textContent=msg; le.hidden=false;
    });
  });
};

wire.signup = function(){
  $("#signupForm").addEventListener("submit", function(e){
    e.preventDefault();
    var f={name:$("#sn").value.trim(),username:$("#su").value.trim().toLowerCase(),email:$("#sm").value.trim(),role:$("#sr").value,password:$("#sp").value}, m=$("#se"), btn=e.target.querySelector("button[type=submit]");
    var msg = !f.name ? "Enter your name."
      : !/^[a-z0-9_]{3,20}$/.test(f.username) ? "Username must be 3 to 20 letters, numbers or underscores."
      : (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) ? "Enter a valid email address."
      : f.password.length<6 ? "Password must be at least 6 characters." : "";
    if(msg){ m.textContent=msg; m.hidden=false; return; }
    btn.disabled=true; m.hidden=true;
    Auth.signup(f).then(function(sn){ session=sn; go("dashboard"); }).catch(function(err){
      btn.disabled=false;
      m.textContent = err.code==="UsernameExistsException" ? "That username is taken. Try another."
        : (err.code==="InvalidPasswordException"||err.code==="InvalidParameterException") ? (err.message||"Check your details and try again.")
        : "We could not create your account. Please try again.";
      m.hidden=false;
    });
  });
};

wire.forgot = function(){
  var box=$("#forgotBox");
  function step1(){
    box.innerHTML='<p>Enter your username and we will email you a reset code.</p><form id="f1" novalidate><div class="field"><label for="fu">Username</label><input id="fu" autocapitalize="none" required></div><div id="fmsg"></div><div class="row"><button class="btn" type="submit">Send reset code</button><button class="btn ghost" type="button" data-go="login">Back to log in</button></div></form>';
    $("#f1").addEventListener("submit",function(e){
      e.preventDefault(); var u=$("#fu").value.trim().toLowerCase(), msg=$("#fmsg");
      if(!u){ msg.innerHTML='<p class="err-text" role="alert">Enter your username.</p>'; return; }
      msg.innerHTML='<div class="ok" role="status">Password reset by email is not available yet. Create a new account, or contact us and we will help.</div>'; return;
      Auth.forgot(u).then(function(){ step2(u); }).catch(function(){ step2(u); });
    });
  }
  function step2(u){
    box.innerHTML='<div class="ok" role="status">If this account exists, a code has been sent to its email.</div><form id="f2" novalidate><div class="field"><label for="fc">Reset code</label><input id="fc" inputmode="numeric" autocomplete="one-time-code" required></div><div class="field"><label for="fp">New password (6+ characters)</label><input id="fp" type="password" autocomplete="new-password" required></div><p class="err-text" id="f2e" role="alert" hidden></p><div class="row"><button class="btn" type="submit">Set new password</button><button class="btn ghost" type="button" data-go="login">Back to log in</button></div></form>';
    $("#f2").addEventListener("submit",function(e){
      e.preventDefault(); var code=$("#fc").value.trim(), pw=$("#fp").value, err=$("#f2e");
      if(!code||pw.length<6){ err.textContent="Enter the code and a password of at least 6 characters."; err.hidden=false; return; }
      Auth.reset(u,code,pw).then(function(){
        box.innerHTML='<div class="ok" role="status">Password updated. You can log in now.</div><button class="btn" data-go="login">Log in</button>';
      }).catch(function(er){ err.textContent = er.code==="CodeMismatchException" ? "That code is not right." : er.code==="ExpiredCodeException" ? "That code has expired. Request a new one." : "Could not reset the password. Try again."; err.hidden=false; });
    });
  }
  step1();
};
