(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id) { return document.getElementById(id); }
  var page = document.body.dataset.page || 'home';

  /* Shared header and footer */
  var NAV = [['products', 'Products'], ['solutions', 'Solutions'], ['app', 'Gate Tech App'], ['service', 'Service'], ['company', 'Company']];
  var hdr = $('site-header');
  if (hdr) hdr.outerHTML =
    '<div class="util"><div class="wrap"><span>NXT Gate is a <b>Tunwal</b> company</span><nav aria-label="Utility"><a href="service.html">Service &amp; support</a><a href="company.html">About Tunwal</a><a href="contact.html">Contact</a></nav></div></div>' +
    '<header class="mast"><div class="wrap"><a class="brand" href="index.html" aria-label="NXT Gate by Tunwal, home"><img src="logo.png" alt="NXT Gate" width="640" height="238"><span>by<b>Tunwal</b></span></a>' +
    '<ul class="menu" id="menu">' + NAV.map(function (n) { return '<li><a href="' + n[0] + '.html"' + (page === n[0] ? ' aria-current="page"' : '') + '>' + n[1] + '</a></li>'; }).join('') + '</ul>' +
    '<a class="btn btn-red" href="contact.html">Request a quote</a>' +
    '<button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button></div></header>';
  var ftr = $('site-footer');
  if (ftr) ftr.outerHTML =
    '<footer><div class="wrap"><div class="foot">' +
    '<div class="foot-brand"><a class="brand" href="index.html"><img src="logo.png" alt="NXT Gate" width="640" height="238"><span>by<b>Tunwal</b></span></a><p>Boom barriers, ANPR cameras and the Gate Tech app, designed, installed and serviced by one team.</p></div>' +
    '<div><h4>Products</h4><ul><li><a href="products.html#explorer">Advertising boom</a></li><li><a href="products.html#explorer">Telescopic barrier</a></li><li><a href="products.html#explorer">Fence barriers</a></li><li><a href="products.html#explorer">ANPR camera</a></li><li><a href="products.html#compare">Compare models</a></li></ul></div>' +
    '<div><h4>Solutions</h4><ul><li><a href="solutions.html#residential">Residential</a></li><li><a href="solutions.html#corporate">Corporate</a></li><li><a href="solutions.html#industrial">Industrial</a></li><li><a href="solutions.html#parking">Parking</a></li></ul></div>' +
    '<div><h4>Gate Tech App</h4><ul><li><a href="app.html">Features</a></li><li><a href="app.html#roles">Residents, guards, admins</a></li><li><a href="service.html">Support</a></li></ul></div>' +
    '<div><h4>Company</h4><ul><li><a href="company.html">About NXT Gate</a></li><li><a href="company.html#tunwal">Tunwal E-Motors</a></li><li><a href="contact.html">Contact sales</a></li></ul></div>' +
    '</div><div class="legal"><span>© 2026 NXT Gate by Tunwal. All rights reserved.</span><span>Every entry. Every exit. Under control.</span></div></div></footer>';

  var burger = $('burger'), menu = $('menu');
  if (burger) {
    burger.addEventListener('click', function () { burger.setAttribute('aria-expanded', menu.classList.toggle('open')); });
  }

  /* Product explorer */
  var svg = $('pxSvg');
  if (svg) {
    var M = [
      { id: 'ad', code: 'BS-AD02A', name: 'Advertising Boom Barrier', short: 'Branded boom · 3–4 m', sizes: [3, 3.5, 4], type: 'ad',
        desc: 'A wide boom with a printable panel that carries your society or company name across the gate. Type in the panel text to preview it.',
        spec: [['Boom lengths', '3 m · 3.5 m · 4 m'], ['Boom marking', '5R5L reflective + custom panel'], ['Best for', 'Society and campus main gates'], ['Spares', 'Replacement kits stocked']] },
      { id: 'tele', code: 'BS-DZ112 · 6S 6M', name: 'Telescopic Auto Barrier', short: 'Telescopic · 6 m', sizes: [6], type: 'tele',
        desc: 'A three-stage telescopic boom that covers a 6 m lane in a 6 second cycle, driven by a 24V DC brushless motor.',
        spec: [['Boom', '6 m telescopic'], ['Open cycle', '6 seconds'], ['Drive', '24V DC brushless'], ['Included', 'Control unit + 2 T23 remotes'], ['Accessory', 'Movable boom support']] },
      { id: 'fence', code: 'BS-5DZM', name: 'Fence Boom Barrier', short: 'Fence arm · 5–6 m', sizes: [5, 6], type: 'fence',
        desc: 'A grille arm whose bars stay upright as the boom lifts, stopping two-wheelers and pedestrians from slipping underneath.',
        spec: [['Boom lengths', '5 m · 6 m'], ['Arm', 'Articulated fence boom'], ['Best for', 'Mixed vehicle and foot traffic']] },
      { id: 'heavy', code: 'BS-6DZM', name: 'Heavy-Duty Fence Barrier', short: 'Industrial · 6 m', sizes: [6], type: 'heavy',
        desc: 'A stronger cabinet with a double-rail fence arm for truck gates, plants and logistics yards.',
        spec: [['Boom length', '6 m'], ['Arm', 'Double-rail fence boom'], ['Best for', 'Factories, warehouses, docks']] },
      { id: 'cam', code: 'BS-TVL35', name: 'ANPR Camera Unit', short: 'Plate recognition', sizes: [], type: 'cam',
        desc: 'A number-plate camera with recognition software built in, plus an English display and flash light on one pole.',
        spec: [['Recognition rate', '≥ 99.7%'], ['Sensor', '1/2.8" CMOS'], ['Low light', '0.01 lux'], ['Protection', 'IP66'], ['Power', '≤ 7.5 W']] },
      { id: 'loop', code: 'PD-132-24V', name: 'Loop Detector', short: 'Vehicle sensing', sizes: [], type: 'loop',
        desc: 'An induction loop cut into the road senses a vehicle above it and keeps the boom raised until the lane is clear.',
        spec: [['Supply', '24V'], ['Outputs', '2 relays, 24V'], ['Channels', 'Single'], ['Sensitivity', '4 selectable levels']] }
    ];
    var cur = M[0], len = 3, ang = 0, on = false, anim = null;
    var sizesEl = $('pxSizes'), textIn = $('pxText'), toggle = $('pxToggle');
    var PX = 105, PVX = 100, PVY = 180;
    var esc = function (t) { return t.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var stripes = function (x0, y, w, h, L, step) { var s = ''; for (var x = x0 + 22; x < x0 + L - 10; x += step) s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#F2F3F5"/>'; return s; };
    var cabinet = function (heavy) {
      var x = heavy ? 62 : 70, w = heavy ? 76 : 60, c = heavy ? '#1F2A44' : '#2A2E3A';
      return '<ellipse cx="100" cy="292" rx="70" ry="6" fill="#0B0C10" opacity=".12"/><rect x="' + x + '" y="140" width="' + w + '" height="150" fill="' + c + '"/><rect x="' + x + '" y="140" width="' + w + '" height="6" fill="#C8102E"/><rect x="' + (x + 6) + '" y="140" width="6" height="150" fill="#fff" opacity=".06"/>' +
        '<circle cx="100" cy="158" r="5" fill="' + (ang > 5 ? '#15A34A' : '#C8102E') + '"/><text x="100" y="270" text-anchor="middle" font-family="Archivo,sans-serif" font-size="9" font-weight="800" fill="#8A90A0" letter-spacing="1.5">NXT</text>';
    };
    var dim = function () {
      var L = len * PX, x2 = PVX + L;
      return '<g stroke="#5A6070"><line x1="' + PVX + '" y1="318" x2="' + x2 + '" y2="318"/><line x1="' + PVX + '" y1="310" x2="' + PVX + '" y2="326"/><line x1="' + x2 + '" y1="310" x2="' + x2 + '" y2="326"/></g>' +
        '<rect x="' + (PVX + L / 2 - 34) + '" y="308" width="68" height="20" fill="#F2F3F5"/><text x="' + (PVX + L / 2) + '" y="322" text-anchor="middle" font-family="Archivo,sans-serif" font-size="13" font-weight="700" fill="#0B0C10">' + len.toFixed(1) + ' m</text>';
    };
    var draw = function () {
      var L = len * PX, g = '', t = cur.type, th = ang * Math.PI / 180;
      var base = '<line x1="-1200" y1="290" x2="2000" y2="290" stroke="#C5CAD3"/>';
      if (t === 'cam') {
        g = base + '<rect x="300" y="108" width="10" height="182" fill="#2A2E3A"/><rect x="262" y="82" width="86" height="34" fill="#2A2E3A"/><rect x="262" y="82" width="86" height="4" fill="#C8102E"/><circle cx="280" cy="100" r="11" fill="#0B0C10" stroke="#8A90A0" stroke-width="2"/><circle cx="280" cy="100" r="4" fill="#C8102E"/>' +
          '<rect x="276" y="140" width="58" height="46" fill="#0B0C10"/><text x="305" y="168" text-anchor="middle" font-family="Archivo,sans-serif" font-size="' + (on ? 8.5 : 10) + '" font-weight="700" fill="#4ADE80">' + (on ? 'MH12 NX 2026' : 'WELCOME') + '</text>' +
          '<rect x="282" y="204" width="46" height="16" fill="' + (on ? '#FFE9A8' : '#C9A24A') + '"/>' + (on ? '<polygon points="270,100 560,214 560,268" fill="#C8102E" opacity=".12"/>' : '') +
          '<rect x="560" y="220" width="170" height="44" fill="#F7F5EC" stroke="#0B0C10" stroke-width="2"/><text x="645" y="250" text-anchor="middle" font-family="Archivo,sans-serif" font-size="20" font-weight="800" fill="#0B0C10">MH12 NX 2026</text>' +
          (on ? '<rect x="550" y="210" width="190" height="64" fill="none" stroke="#15A34A" stroke-width="3"/><rect x="550" y="186" width="130" height="22" fill="#15A34A"/><text x="560" y="201" font-family="Archivo,sans-serif" font-size="12" font-weight="700" fill="#fff">MATCH · 99.7%</text>' : '');
      } else if (t === 'loop') {
        g = '<rect x="-1200" y="250" width="3200" height="50" fill="#2A2E3A"/><rect x="300" y="262" width="330" height="26" fill="none" stroke="' + (on ? '#15A34A' : '#C8102E') + '" stroke-width="2" stroke-dasharray="8 6"/><path d="M300 275 C 220 275, 220 200, 170 170" stroke="#5A6070" stroke-width="2" fill="none"/>' +
          '<rect x="80" y="110" width="96" height="100" fill="#121726"/><rect x="92" y="124" width="72" height="22" fill="#0B0C10"/><text x="128" y="139" text-anchor="middle" font-family="Archivo,sans-serif" font-size="10" font-weight="700" fill="#4ADE80">' + (on ? 'DETECT' : 'IDLE') + '</text>' +
          '<circle cx="106" cy="168" r="6" fill="' + (on ? '#15A34A' : '#3A3F4E') + '"/><circle cx="128" cy="168" r="6" fill="' + (on ? '#15A34A' : '#3A3F4E') + '"/><circle cx="150" cy="168" r="6" fill="#C8102E"/><text x="128" y="196" text-anchor="middle" font-family="Archivo,sans-serif" font-size="9" font-weight="700" fill="#8A90A0">PD-132-24V</text>' +
          (on ? '<g transform="translate(360 196)"><path d="M0,58 L0,40 Q2,30 14,28 L46,24 L68,6 Q76,0 86,0 L130,0 Q140,0 148,8 L162,24 L172,28 Q178,32 178,40 L178,58 Z" fill="#8FA3BF"/><circle cx="40" cy="60" r="13" fill="#0B0C10"/><circle cx="140" cy="60" r="13" fill="#0B0C10"/></g><text x="465" y="186" text-anchor="middle" font-family="Archivo,sans-serif" font-size="12" font-weight="700" fill="#15A34A">Vehicle detected · boom held open</text>' : '<text x="465" y="240" text-anchor="middle" font-family="Archivo,sans-serif" font-size="12" font-weight="600" fill="#5A6070">Induction loop cut into the lane</text>');
      } else {
        var heavy = t === 'heavy', inner = '<rect x="76" y="171" width="24" height="18" fill="#3A3F4E"/>';
        if (t === 'ad') {
          inner += '<rect x="100" y="162" width="' + L + '" height="36" fill="#FFFFFF" stroke="#C5CAD3"/><rect x="100" y="162" width="' + L + '" height="5" fill="#C8102E"/><rect x="100" y="193" width="' + L + '" height="5" fill="#C8102E"/>' +
            '<text x="' + (100 + L / 2) + '" y="186" text-anchor="middle" font-family="Archivo,sans-serif" font-size="' + Math.min(18, L / 13) + '" font-weight="800" fill="#0B0C10" letter-spacing="1">' + esc(textIn.value.toUpperCase() || 'YOUR NAME') + '</text>';
        } else if (t === 'tele') {
          var a = L * .42, b = L * .33, c = L - a - b;
          inner += '<rect x="100" y="173" width="' + a + '" height="14" fill="#C8102E"/>' + stripes(100, 173, 18, 14, a, 46) + '<rect x="' + (100 + a) + '" y="175" width="' + b + '" height="10" fill="#F2F3F5" stroke="#C5CAD3"/><rect x="' + (100 + a + b) + '" y="176.5" width="' + c + '" height="7" fill="#C8102E"/>';
        } else {
          inner += '<rect x="100" y="174" width="' + L + '" height="' + (heavy ? 10 : 8) + '" fill="#C8102E"/>' + stripes(100, 174, 18, heavy ? 10 : 8, L, 52);
        }
        g = base + cabinet(heavy) + '<g transform="rotate(' + (-ang) + ' ' + PVX + ' ' + PVY + ')">' + inner + '</g>';
        if (t === 'fence' || heavy) {
          var bars = '', step = heavy ? 24 : 30, hh = heavy ? 50 : 44;
          for (var d = 24; d <= L - 6; d += step) {
            var x = PVX + d * Math.cos(th), y = PVY - d * Math.sin(th) + 6;
            bars += '<line x1="' + x.toFixed(1) + '" y1="' + y.toFixed(1) + '" x2="' + x.toFixed(1) + '" y2="' + (y + hh).toFixed(1) + '"/>';
          }
          g += '<g stroke="#5A6070" stroke-width="' + (heavy ? 3 : 2.2) + '">' + bars + '</g>';
        }
        g += '<circle cx="100" cy="180" r="9" fill="#0B0C10" stroke="#C8102E" stroke-width="2.5"/>' + dim();
      }
      var top = (t === 'cam' || t === 'loop') ? 0 : Math.min(0, PVY - L * Math.sin(th) - 30);
      var h = 340 - top, w = 800 * h / 340;
      svg.setAttribute('viewBox', (-(w - 800) / 2).toFixed(1) + ' ' + top.toFixed(1) + ' ' + w.toFixed(1) + ' ' + h.toFixed(1));
      svg.innerHTML = g;
    };
    var animTo = function (target) {
      if (anim) cancelAnimationFrame(anim);
      var from = ang, t0 = performance.now(), dur = reduce ? 1 : 900;
      var step = function (t) {
        var k = Math.min(1, (t - t0) / dur); k = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        ang = from + (target - from) * k; draw();
        if (k < 1) anim = requestAnimationFrame(step);
      };
      anim = requestAnimationFrame(step);
    };
    var labelToggle = function () {
      var t = cur.type;
      toggle.textContent = t === 'cam' ? (on ? 'Reset camera' : 'Scan a plate') : t === 'loop' ? (on ? 'Clear the lane' : 'Drive over loop') : (on ? 'Lower boom' : 'Raise boom');
    };
    var select = function (m) {
      cur = m; on = false; ang = 0; len = m.sizes[m.sizes.length - 1] || 0;
      document.querySelectorAll('.px-item').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.id === m.id); });
      $('pxCode').textContent = m.code; $('pxName').textContent = m.name; $('pxDesc').textContent = m.desc;
      $('pxSpec').innerHTML = m.spec.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; }).join('');
      $('pxSizesWrap').hidden = !m.sizes.length; $('pxTextWrap').hidden = m.type !== 'ad';
      sizesEl.innerHTML = m.sizes.map(function (s) { return '<button type="button" data-l="' + s + '" aria-pressed="' + (s === len) + '">' + s + ' m</button>'; }).join('');
      $('pxTag').textContent = m.code + ' · interactive view';
      labelToggle(); draw();
    };
    $('pxList').innerHTML = M.map(function (m) { return '<button class="px-item" role="tab" aria-selected="false" data-id="' + m.id + '"><b>' + m.name + '</b><small>' + m.code + ' · ' + m.short + '</small></button>'; }).join('');
    $('pxList').addEventListener('click', function (e) { var b = e.target.closest('.px-item'); if (b) select(M.filter(function (m) { return m.id === b.dataset.id; })[0]); });
    sizesEl.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      len = +b.dataset.l; sizesEl.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); draw();
    });
    textIn.addEventListener('input', draw);
    toggle.addEventListener('click', function () {
      on = !on; labelToggle();
      if (cur.type === 'cam' || cur.type === 'loop') draw(); else animTo(on ? 85 : 0);
    });
    document.querySelectorAll('[data-pick]').forEach(function (a) {
      a.addEventListener('click', function () { select(M.filter(function (m) { return m.id === a.dataset.pick; })[0]); });
    });
    select(M[0]);
  }

  /* App preview */
  var featBtns = document.querySelectorAll('.feat-btn'), scrBody = $('scrBody');
  if (scrBody) {
    var SCR = [
      { sub: 'Tower B · Flat 1204', title: 'Visitor at gate', html:
        '<div class="c"><span class="k">Main gate · now</span><div class="r"><b>Rahul · Swiggy</b><span class="pill a" id="vPill">WAITING</span></div><span style="color:var(--muted);font-size:13px">Delivery · arrived 10:42</span><div class="two-btn"><button class="y" type="button" data-v="1">Approve</button><button class="n2" type="button" data-v="0">Deny</button></div></div>' +
        '<div class="c"><span class="k">Expected today</span><div class="r"><span>Amazon parcel</span><span class="pill g">PRE-APPROVED</span></div><div class="r"><span>Dr. Mehta · guest</span><span class="pill g">PASS SENT</span></div></div>' },
      { sub: 'Invite a guest', title: 'Guest pass', html:
        '<div class="c" style="justify-items:center;text-align:center"><span class="k">Valid Sat 1 Nov · 6–11 pm</span><svg viewBox="0 0 21 21" width="140" height="140" shape-rendering="crispEdges"><path fill="#0B0C10" d="M0 0h7v7H0zM14 0h7v7h-7zM0 14h7v7H0z"/><path fill="#fff" d="M1 1h5v5H1zM15 1h5v5h-5zM1 15h5v5H1z"/><path fill="#0B0C10" d="M2 2h3v3H2zM16 2h3v3h-3zM2 16h3v3H2zM8 1h1v2H8zM10 0h2v1h-2zM9 4h3v1H9zM8 8h2v2H8zM12 8h1v3h-1zM14 9h2v1h-2zM17 8h3v1h-3zM9 12h2v1H9zM8 14h1v3H8zM10 15h3v1h-3zM14 13h1v2h-1zM16 14h3v1h-3zM15 17h2v3h-2zM18 18h2v2h-2zM10 18h2v2h-2zM0 9h2v1H0zM3 10h2v1H3z"/></svg><b>OTP 482 913</b><span style="color:var(--muted);font-size:13px">Shared with Dr. Mehta on WhatsApp</span></div>' },
      { sub: 'Today · Tower B', title: 'Daily help', html:
        '<div class="c"><div class="r"><b>Sunita · Maid</b><span class="pill g">IN 07:58</span></div><div class="r"><b>Ramesh · Driver</b><span class="pill g">IN 08:30</span></div><div class="r"><b>Anil · Cook</b><span class="pill a">EXPECTED 18:00</span></div></div>' +
        '<div class="c"><span class="k">Deliveries</span><div class="r"><span>Blinkit</span><span class="pill g">LEFT AT GATE</span></div><div class="r"><span>BlueDart</span><span class="pill g">COLLECTED</span></div></div>' },
      { sub: 'Main gate · today', title: 'Entry records', html:
        '<div class="c"><div class="r"><b>MH12 NX 2026</b><span class="pill g">IN 10:31</span></div><div class="r"><b>MH14 KT 5521</b><span class="pill g">IN 10:43</span></div><div class="r"><b>DL3C AF 0917</b><span class="pill r">DENIED 10:47</span></div><div class="r"><b>MH12 AB 7781</b><span class="pill a">OUT 09:12</span></div></div>' +
        '<div class="c"><div class="r"><span class="k">Entries today</span><b>248</b></div><div class="r"><span class="k">Visitors</span><b>61</b></div></div>' },
      { sub: 'Admin · 3 gates', title: 'Gate control', html:
        '<div class="c"><div class="r"><b>Main gate · Lane 1</b><span class="pill g" id="gPill">CLOSED</span></div><div class="two-btn"><button class="y" type="button" data-g="1">Open boom</button><button class="n2" type="button" data-g="0">Close</button></div></div>' +
        '<div class="c"><div class="r"><b>Service gate</b><span class="pill g">ONLINE</span></div><div class="r"><b>Exit gate</b><span class="pill g">ONLINE</span></div></div>' +
        '<div class="c" style="background:var(--red);color:#fff;border-color:var(--red);text-align:center;font-weight:700">Hold to raise SOS</div>' }
    ];
    var showScr = function (i) {
      featBtns.forEach(function (b) { b.setAttribute('aria-selected', b.dataset.f == i); });
      $('scrSub').textContent = SCR[i].sub; $('scrTitle').textContent = SCR[i].title; scrBody.innerHTML = SCR[i].html;
    };
    featBtns.forEach(function (b) { b.addEventListener('click', function () { showScr(+b.dataset.f); }); });
    scrBody.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.v) { var p = $('vPill'); p.textContent = b.dataset.v === '1' ? 'APPROVED' : 'DENIED'; p.className = 'pill ' + (b.dataset.v === '1' ? 'g' : 'r'); }
      if (b.dataset.g) { var g = $('gPill'); g.textContent = b.dataset.g === '1' ? 'OPEN' : 'CLOSED'; g.className = 'pill ' + (b.dataset.g === '1' ? 'a' : 'g'); }
    });
    showScr(0);
  }

  /* Quote form */
  var form = $('qForm');
  if (form) {
    var note = $('qNote');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var miss = ['q-name', 'q-phone', 'q-org'].filter(function (id) { return !$(id).value.trim(); });
      note.hidden = false;
      if (miss.length) { note.className = 'fnote err'; note.textContent = 'Please fill in your name, mobile and property or company.'; $(miss[0]).focus(); return; }
      note.className = 'fnote ok'; note.textContent = 'Request received. An engineer will call you within one working day.';
      form.reset();
    });
  }
})();
