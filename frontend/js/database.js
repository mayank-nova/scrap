/* Static data: prices, materials, Hindi text, nav menus, info pages, journey and role content. */

/* low/high = what a collector pays the customer (per kg). sellLow/sellHigh = what a recycler pays the collector in bulk. Sample numbers. */
var PRICES = [
  {name:"Newspaper (raddi)", cat:"Paper", low:12, high:15, sellLow:15, sellHigh:18},
  {name:"Office paper / A4", cat:"Paper", low:14, high:18, sellLow:17, sellHigh:21},
  {name:"Books and notebooks", cat:"Paper", low:10, high:13, sellLow:12, sellHigh:15},
  {name:"Cardboard / cartons", cat:"Paper", low:7, high:10, sellLow:9, sellHigh:12},
  {name:"PET plastic bottles", cat:"Plastic", low:14, high:20, sellLow:18, sellHigh:24},
  {name:"Hard plastic (buckets, containers)", cat:"Plastic", low:10, high:15, sellLow:13, sellHigh:18},
  {name:"Plastic bags / film", cat:"Plastic", low:4, high:8, sellLow:6, sellHigh:10},
  {name:"Iron scrap", cat:"Metal", low:28, high:34, sellLow:33, sellHigh:39},
  {name:"Steel utensils", cat:"Metal", low:35, high:45, sellLow:42, sellHigh:52},
  {name:"Aluminium (cans, vessels)", cat:"Metal", low:100, high:125, sellLow:118, sellHigh:140},
  {name:"Brass", cat:"Metal", low:320, high:380, sellLow:360, sellHigh:420},
  {name:"Copper wire", cat:"Metal", low:520, high:620, sellLow:580, sellHigh:680},
  {name:"Glass bottles", cat:"Glass", low:2, high:5, sellLow:4, sellHigh:7},
  {name:"Old mobiles and chargers", cat:"E-waste", low:40, high:150, sellLow:60, sellHigh:180},
  {name:"Old cables and wires", cat:"E-waste", low:20, high:60, sellLow:28, sellHigh:70},
  {name:"Old laptops and computers", cat:"E-waste", low:80, high:200, sellLow:100, sellHigh:240},
  {name:"Circuit boards (PCB)", cat:"E-waste", low:150, high:400, sellLow:200, sellHigh:480},
  {name:"Batteries (inverter / lead-acid)", cat:"Metal", low:60, high:80, sellLow:70, sellHigh:95},
  {name:"TVs and monitors", cat:"E-waste", low:10, high:25, sellLow:14, sellHigh:32}
];

var JSTOPS = [
  {short:"Your home", icon:'<path d="M3 11l9-8 9 8v10H3z"/>', title:"It starts at your home", text:"Set aside newspapers, bottles, metal and old electronics. Scan an item first if you want ideas to reuse it.", tag:"You decide: reuse or sell"},
  {short:"Local collector", icon:'<circle cx="12" cy="7" r="4"/><path d="M4 21c0-5 4-8 8-8s8 3 8 8"/>', title:"A local collector picks it up", text:"A scrap collector from your area comes to your door, weighs it and pays you at the listed rate.", tag:"Work for local collectors"},
  {short:"Sorting hub", icon:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>', title:"Scrap Setu sorts and pools it", text:"Scrap from many collectors is graded and pooled, so it can be sold in bulk instead of in small lots.", tag:"Bulk means better rates"},
  {short:"Recycler", icon:'<path d="M3 21V9l6 4V9l6 4V5h6v16z"/>', title:"Sold to big recycling companies", text:"Large recyclers buy the sorted scrap directly, giving collectors dependable demand.", tag:"Steady buyers"},
  {short:"New products", icon:'<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19l8-8"/>', title:"It becomes something new", text:"Paper, plastic, metal and glass go back into the supply chain instead of landfills.", tag:"Less waste"}
];
var ROLES = [
  {tab:"I have scrap", perks:[
    {t:"Clear rates", d:"See the price per kg for every type of raddi before you sell.", i:'<path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'},
    {t:"Scan before you sell", d:"Photograph an item to get reuse ideas, or sell it if that suits you better.", i:'<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><circle cx="12" cy="12" r="3"/>'},
    {t:"Pickup from your door", d:"A nearby collector comes to you. No need to haggle on the street.", i:'<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'}]},
  {tab:"I collect scrap", perks:[
    {t:"Pickup requests nearby", d:"Get customer requests in your area so your day is planned, not left to chance.", i:'<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'},
    {t:"Steady demand", d:"What you collect is sold on to big recyclers, which gives you dependable work.", i:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>'},
    {t:"Fair, visible rates", d:"Rates are listed up front, so you and the customer agree without argument.", i:'<path d="M5 13l4 4L19 7"/>'}]},
  {tab:"I recycle", perks:[
    {t:"Sorted, graded scrap", d:"Receive scrap that is already separated by type, ready to process.", i:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>'},
    {t:"Reliable supply", d:"A network of local collectors keeps volumes consistent.", i:'<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M21 3v5h-5M3 21v-5h5"/>'},
    {t:"Know the source", d:"Scrap comes through one platform, so you know where it came from.", i:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'}]}
];

var SERVICES={
  guest:[
    {h:"For households", items:[["Schedule a pickup","pickup"],["Scan and reuse ideas","scan"],["Sell your scrap","signup"]]},
    {h:"For collectors", items:[["Join as a collector","signup"],["Pickup requests","pickups"],["Fair weighing and payment","info/payments"]]},
    {h:"For recyclers and businesses", items:[["Bulk scrap supply","info/bulk"],["Sorted and graded scrap","info/graded"],["Business enquiries","contact"]]},
    {h:"Scrap prices", items:[["All scrap rates", "prices"], ["Paper", "prices/Paper"], ["Plastic", "prices/Plastic"], ["Metal", "prices/Metal"], ["Glass", "prices/Glass"], ["E-waste", "prices/E-waste"]]}
  ],
  customer:[
    {h:"Your scrap", items:[["Schedule a pickup","pickup"],["My pickups","pickups"],["Scan and reuse ideas","scan"]]},
    {h:"Your account", items:[["Dashboard","dashboard"],["Contact us","contact"]]},
    {h:"What you get per kg", items:[["All scrap rates", "prices"], ["Paper", "prices/Paper"], ["Plastic", "prices/Plastic"], ["Metal", "prices/Metal"], ["Glass", "prices/Glass"], ["E-waste", "prices/E-waste"]]}
  ],
  collector:[
    {h:"Your work", items:[["Open requests and jobs","pickups"],["Dashboard","dashboard"],["Fair weighing and payment","info/payments"]]},
    {h:"Buy and sell rates", items:[["Buy and sell rates", "prices"], ["Paper", "prices/Paper"], ["Plastic", "prices/Plastic"], ["Metal", "prices/Metal"], ["Glass", "prices/Glass"], ["E-waste", "prices/E-waste"]]},
    {h:"Recyclers", items:[["Bulk scrap supply","info/bulk"],["Sorted and graded scrap","info/graded"],["Business enquiries","contact"]]}
  ]
};
/* Links shown directly in the top bar, by role. */
var TOPLINKS={ guest:[["scan","Scan scrap"]], customer:[["scan","Scan scrap"]], collector:[["pickups","Requests"]] };
var COMPANY=[["About us","about"],["Our journey","journey"],["Partner with us","info/partner"],["Contact","contact"]];
var INFO={
  pickup:{kicker:"For households",title:"Scrap pickup from your door",text:"Book a time and a collector from your area comes to weigh and collect your scrap.",points:[["List your scrap","Choose the types and an approximate weight."],["Pick a slot","Select a day and time that suits you."],["Get paid at the listed rate","The collector weighs it with you and pays on the spot."]],soon:true,cta:["Check rates","prices"]},
  requests:{kicker:"For collectors",title:"Pickup requests near you",text:"Collectors see requests from households nearby and plan the day around them.",points:[["Nearby requests","Requests are shown by area and scrap type."],["Plan your route","Group pickups so you spend less time travelling."],["Accept what suits you","Take the jobs that fit your day."]],soon:true,cta:["Join as a collector","signup"]},
  payments:{kicker:"For collectors",title:"Fair weighing and payment",text:"Clear rates and a visible record help collectors and customers trust each other.",points:[["Listed rates","Both sides see the same price per kg."],["Digital record","Each pickup is logged with weight and amount."],["Reliable payouts","Collectors are paid for what they hand over."]],soon:true,cta:["See rates","prices"]},
  bulk:{kicker:"For recyclers and businesses",title:"Bulk scrap supply",text:"Scrap Setu pools material from many local collectors so recyclers can buy in volume.",points:[["Pooled volumes","Many small lots become one dependable supply."],["Regular schedules","Plan intake with predictable deliveries."],["One point of contact","Deal with one platform instead of many sellers."]],soon:true,cta:["Contact us","contact"]},
  graded:{kicker:"For recyclers and businesses",title:"Sorted and graded scrap",text:"Material is separated by type before it reaches you, which saves processing time.",points:[["Paper and cardboard","Separated and baled."],["Plastic","PET and hard plastic kept apart."],["Metal, glass and e-waste","Sorted by type so each stream goes to the right place."]],soon:true,cta:["Contact us","contact"]},
  partner:{kicker:"Company",title:"Partner with us",text:"We want to work with collectors, recycling companies, housing societies and local groups.",points:[["Collectors","Join the network and get steady work."],["Recyclers","Source sorted scrap in bulk."],["Communities","Bring pickups to your society or neighbourhood."]],cta:["Get in touch","contact"]},
  careers:{kicker:"Careers",title:"Careers",text:"Scrap Setu is a hackathon project and there are no open roles yet. If you want to help build it, tell us who you are.",points:[["Engineering","Web, mobile and computer vision."],["Operations","Collector onboarding and logistics."],["Outreach","Working with collectors and communities."]],cta:["Contact us","contact"]}
};
var MAT_META={paper:{cat:"Paper",icon:0},plastic:{cat:"Plastic",icon:4},metal:{cat:"Metal",icon:9},glass:{cat:"Glass",icon:12},ewaste:{cat:"E-waste",icon:13}};
var HI={
  paper:{label:"कागज़ / गत्ता",ideas:["कागज़ को गलाकर हाथ से बना कागज़ या सीड पेपर बनाइए।","गत्ते के डिब्बों से दराज़ और डेस्क के ऑर्गनाइज़र बनाइए।","पुराने अख़बार से कागज़ के थैले और गिफ़्ट रैप बनाइए।","कागज़ के टुकड़े करके खाद में सूखी सामग्री की तरह डालिए।"]},
  plastic:{label:"प्लास्टिक बोतल / डिब्बा",ideas:["बोतल काटकर लटकने वाला गमला या जड़ी-बूटी का पौधा लगाइए।","बोतल से चिड़ियों का दाना या पानी का बर्तन बनाइए।","बोतलों से पौधों के लिए ड्रिप सिंचाई बनाइए।","कटे हुए तले से पेन स्टैंड या गुल्लक बनाइए।"]},
  metal:{label:"धातु का डिब्बा / टिन",ideas:["डिब्बे को रंगकर पेन होल्डर या गमला बनाइए।","डिब्बे में डिज़ाइन के छेद करके अंदर मोमबत्ती रखकर लालटेन बनाइए।","साफ़ टिन में कील, पेंच और मसाले रखिए।","एल्युमिनियम बेच दीजिए, आम कबाड़ में इसका भाव सबसे ज़्यादा मिलता है।"]},
  glass:{label:"काँच की बोतल / जार",ideas:["धोकर जार में अनाज, अचार और मसाले रखिए।","लाइटों की लड़ी डालकर सजावटी लैंप बनाइए।","बोतलों को फूलदान बनाइए या बगीचे की क्यारी की किनारी में लगाइए।","बोतल कटर किट से काटकर और घिसकर गिलास बनाइए।"]},
  ewaste:{label:"इलेक्ट्रॉनिक कबाड़",ideas:["प्रमाणित ई-वेस्ट रिसाइकलर को दीजिए ताकि ज़हरीले हिस्से सुरक्षित तरीके से निपटें।","चालू बैटरी, स्क्रीन और तार मरम्मत के लिए निकाल लीजिए।","पुराने चार्जर और केबल जाँचकर दोबारा इस्तेमाल कीजिए।","बैटरी को कभी जलाइए या तोड़िए नहीं, उसे अलग रखिए।"]}
};
var T={
  en:{tagAws:"Detected by AI",tagColour:"Rough guess",tagManual:"Your choice",noteAws:"Detected from your photo. Not right? Tap the correct type on the left.",looks:"Looks like",reuse:"Ways to reuse it",sell:"Or sell it",weight:"How much do you have?",earn:"You could earn about",per:"per kg",rates:"See all {c} rates",again:"Scan another",read:"Read aloud",stop:"Stop reading",note:"Rough guess from the photo colours only. It is often wrong, so please tap the correct type on the left."},
  hi:{tagAws:"AI से पहचाना",tagColour:"मोटा अनुमान",tagManual:"आपकी पसंद",noteAws:"आपकी फ़ोटो से पहचाना गया। सही नहीं? बाईं ओर सही प्रकार चुनिए।",looks:"लगता है यह है",reuse:"दोबारा इस्तेमाल के तरीके",sell:"या बेच दीजिए",weight:"आपके पास कितना है?",earn:"आप लगभग कमा सकते हैं",per:"प्रति किलो",rates:"सभी भाव देखें",again:"दूसरा स्कैन करें",read:"ज़ोर से सुनें",stop:"सुनना बंद करें",note:"यह सिर्फ़ फ़ोटो के रंगों से मोटा अनुमान है और अक्सर ग़लत होता है। कृपया बाईं ओर सही प्रकार चुनिए।"}
};

var MATERIALS = {
  paper:{label:"Paper / cardboard", priceIdx:[0,3], ideas:[
    "Soak and blend into pulp to make handmade paper or seed paper.",
    "Fold cardboard boxes into drawer organisers and desk storage.",
    "Make paper bags and gift wrap from old newspaper.",
    "Shred and add to a compost pile as dry brown material."]},
  plastic:{label:"Plastic bottle / container", priceIdx:[4,5], ideas:[
    "Cut the bottle and turn it into a hanging planter or herb pot.",
    "Make a bird feeder or water dispenser for birds.",
    "Use bottles as a drip irrigation system for plants.",
    "Make a pen stand or coin bank from the cut base."]},
  metal:{label:"Metal can / tin", priceIdx:[9,7], ideas:[
    "Paint the can and use it as a pen holder or planter.",
    "Punch a pattern and place a candle inside for a lantern.",
    "Use clean tins to organise nails, screws and spices.",
    "Sell the aluminium: it fetches the highest price per kg of common scrap."]},
  glass:{label:"Glass bottle / jar", priceIdx:[12], ideas:[
    "Wash and reuse jars for storing grains, pickles and spices.",
    "Add a string of lights to make a decorative lamp.",
    "Use bottles as vases or as edging for a garden bed.",
    "Cut and sand into drinking glasses with a bottle cutter kit."]},
  ewaste:{label:"Electronics / e-waste", priceIdx:[13,14], ideas:[
    "Hand it to a certified e-waste recycler so toxic parts are handled safely.",
    "Salvage working batteries, screens and cables for repairs.",
    "Reuse old chargers and cables after testing them.",
    "Never burn or break batteries; keep them separate."]}
};
