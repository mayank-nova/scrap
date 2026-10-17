/* Session state and settings: demo users, who is logged in, backend config, logo path. */

/* ---------- sample data ---------- */
var users = { demo: { password: "scrap123", name: "Demo Collector" } };
var session = null;

/* ---------- backend config (set by config.js) ---------- */
var CFG = window.SCRAP_CONFIG || {};
/* Login and data go through the Scrap Setu backend whenever apiUrl is set (it is, in config.js). Clear it to get the in-browser demo mode. */
var AUTH_REMOTE = !!CFG.apiUrl;
var REMOTE = !!CFG.apiUrl;
var TOKEN_KEY = "ss-auth";
var tokens = null;
var mock = {pickups:[]};
var PRICE_IDS = ["newspaper","office-paper","books","cardboard","pet","hard-plastic","plastic-bags","iron","steel","aluminium","brass","copper","glass","mobiles","cables","laptops","circuit-boards","batteries","tv-monitors"];
users.demo.role = "customer";
users.collector = { password: "scrap123", name: "Demo Collector", role: "collector" };

/* Logo used in the top bar and loading screen. */
var LOGO_SRC = "assets/logo.png";

/* "guest", "customer" or "collector". Drives menus, prices and which features are shown. */
function currentRole(){ return session ? session.role : "guest"; }
