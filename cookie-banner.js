(function () {
  const KEY = 'hippovia_cookie_consent';
  if (localStorage.getItem(KEY)) return;

  function init() {
    const style = document.createElement('style');
    style.textContent = [
      '#ck-banner{position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid rgba(0,0,0,0.08);box-shadow:0 -4px 24px rgba(0,0,0,0.07);z-index:9999;padding:16px 2rem;transition:opacity .3s,transform .3s}',
      '#ck-inner{max-width:1080px;margin:0 auto;display:flex;align-items:center;gap:20px;flex-wrap:wrap}',
      '#ck-text{flex:1;font-family:"DM Sans",sans-serif;font-size:13px;color:#6B6B6B;line-height:1.6;min-width:200px}',
      '#ck-text strong{color:#1A1A1A;font-weight:500}',
      '#ck-text a{color:#2D9B6F;text-decoration:underline}',
      '#ck-actions{display:flex;gap:10px;flex-shrink:0}',
      '#ck-refuse{padding:9px 20px;border-radius:8px;border:1.5px solid rgba(0,0,0,0.12);background:#fff;color:#6B6B6B;font-family:"DM Sans",sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:border-color .15s,color .15s}',
      '#ck-refuse:hover{border-color:#1A1A1A;color:#1A1A1A}',
      '#ck-accept{padding:9px 20px;border-radius:8px;border:none;background:#2D9B6F;color:#fff;font-family:"DM Sans",sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:background .2s}',
      '#ck-accept:hover{background:#1a6b4a}',
      '@media(max-width:540px){#ck-actions{width:100%}#ck-refuse,#ck-accept{flex:1;text-align:center}}',
    ].join('');
    document.head.appendChild(style);

    const banner = document.createElement('div');
    banner.id = 'ck-banner';
    banner.innerHTML =
      '<div id="ck-inner">' +
        '<div id="ck-text"><strong>Ce site utilise des cookies.</strong> Nous utilisons des cookies fonctionnels pour mémoriser vos préférences. En continuant, vous acceptez leur utilisation. <a href="cookies.html">Politique cookies</a></div>' +
        '<div id="ck-actions"><button id="ck-refuse">Refuser</button><button id="ck-accept">Accepter</button></div>' +
      '</div>';
    document.body.appendChild(banner);

    function dismiss(choice) {
      localStorage.setItem(KEY, choice);
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(8px)';
      setTimeout(function () { banner.remove(); }, 300);
    }

    document.getElementById('ck-accept').addEventListener('click', function () { dismiss('accepted'); });
    document.getElementById('ck-refuse').addEventListener('click', function () { dismiss('refused'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
