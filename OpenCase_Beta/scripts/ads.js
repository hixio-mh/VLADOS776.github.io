var canRunAds = true;

var AdModule = (function(module) {
    var config = {
        ad_client: 'ca-pub-9624392621060703',
        ad_slot: '9937278679', //'9891197478',
        bottom_class: 'ad_bottom',
        top_class: 'ad_top',
        style: 'display:inline-block;width:728px;height:90px'
    };
    var styles = '.ad_bottom, .ad_top {\
        position: fixed;\
        left: 0;\
        right: 0;\
        margin: 0 auto;\
        display: inline;\
        width: 728px;\
        z-index: 19;\
    }\
    .ad_bottom {\
        bottom: 0;\
    }\
    .ad_top {\
        top: 0;\
    }\
    body.ad_on_bottom {\
        padding-bottom: 110px;\
    }';
    
    window.google_ad_client = config.ad_client;
    window.google_ad_slot = config.ad_slot;
    window.google_ad_width = 728;
    window.google_ad_height = 90;
        
    module.insertAd = function(opt) {
        opt = opt || {};
        
        var container = document.createElement('div');
        container.classList.add('adsbygoogle', opt.top ? config.top_class : config.bottom_class);
        container.id = 'ad_container';
        document.body.appendChild(container);
        
        var container = document.getElementById('ad_container');
        
        var w = document.write;
        document.write = function (content) {
            container.innerHTML = content;
            document.write = w;
        };
        
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'http://pagead2.googlesyndication.com/pagead/show_ads.js';
        document.body.appendChild(script);
        
        var css = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML = styles;
        document.body.appendChild(css);
        
        document.body.classList.add(opt.top ? 'ad_on_top' : 'ad_on_bottom');
    }
    
    return module;
})({})