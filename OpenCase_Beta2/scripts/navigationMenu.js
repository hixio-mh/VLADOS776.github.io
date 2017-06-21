$(function () {
    $(".site-overlay").hide();
    var bar = $('.navigationBar');
    var barHTML = '<img src="../images/navigation/hamburger.png" class="navigationBar_hamburger menu-btn"><span data-loc="page_name"></span>';
    var defPageName = bar.text();
    bar.html(barHTML);
    
    if (defPageName != '')
        $('span[data-loc="page_name"]').text(defPageName);
    $(document.body).prepend('<div class="left-menu closed" data-loc-group="menu"></div>');
    var menu = $('.left-menu');
    var rank = getRank();
    var nextRank = getNextRank();
    var percent = ((Player.points - getRank().points) * 100) / (getNextRank().points - getRank().points);
    if (getNextRank().points - getRank().points == 0) percent = 100;
    var link = "chatNew.html";
    try {
        firebase.auth().onAuthStateChanged(function (user) {
            if (firebase.auth().currentUser != null) {
                link = "profile.html?uid=" + firebase.auth().currentUser.uid;
                $("a[data-profileLink='true']").each(function () {
                    $(this).attr('href', link)
                }); 
            }
        });
    }
    catch (e) {}
    var menuHTML = '<div class="menu_playerInfo"> \
        <div id="menu_playerInfo_info"> \
            <a href="' + link + '" data-profileLink="true"><img src="' + avatarUrl() + '" class="menu_ava"></a> \
            <div id="menu_playerInfo_info_text"> \
                <a href="' + link + '" data-profileLink="true"><span id="menu_playerInfo_name"></span></a> \
                <span id="menu_doubleBalance">' + Player.doubleBalance + '</span><i class="double-icon"></i>\
                ' + (isAndroid() ? '<button href="#" class="btn btn-xs btn-default more_coins" data-toggle="modal" data-target="#more_coins_modal" data-loc="more_coins">Get more coins</button>' : '') +'\
            </div>\
        </div> \
        <div class="menu_rank"> \
            <div class="menu_rank__top"> \
                <span class="menu_rank__exp">' + Level.myEXP() + ' EXP</span> \
            </div> \
            <div class="menu_rank__lvl"> \
                <span class="lvl lvl-current">' + Level.myLvl() + '</span> \
                <div class="progress menu-progress"><div class="progress-bar" id="player-rank-progress" style="width: ' + Level.progress() + '%"></div></div> \
                <span class="lvl lvl-next">'+Level.nextLvl()+'</span> \
            </div> \
            <div class="menu_rank__bottom"> \
                <span class="menu_rank__next-lvl-exp" data-loc="to_next_level" data-loc-var=\'' + JSON.stringify({1:(Level.nextLvlEXP() - Level.myEXP())}) + '\'></span> \
            </div> \
        </div> \
        <div id="menu-missions" class="menu-missions">\
            <ul id="missions-list" class="missions-list"></ul>\
        </div>\
    </div>';
    
    menuHTML += '<ul> \
        <li class="submenu closed"><a href="#"><i class="icon icon-key2"></i><span data-loc="open_case">Open Cases</span></a>\
        <ul data-loc-group="cases_menu">\
            <li class="pushy-link"><a href="cases.html"><span class="icon icon-key2"></span><span data-loc="official">Official cases</span></a></li>\
            <li class="pushy-link"><a href="customCases.html"><span class="icon icon-key2"></span><span data-loc="custom">Custom cases</span> <sup class="beta">beta</sup></a></li>\
        </ul></li>\
        <li class="submenu closed" data-podmenu="games"><a href="#"><span class="icon icon-pacman"></span><span data-loc="games">Games</span></a> \
        <ul data-loc-group="games_list"> \
            <li class="pushy-link"><a href="rulet.html"><span class="icon icon-spinner5"></span><span data-loc="jackpot">Jackpot</span></a></li>\
            <li class="pushy-link"><a href="RPS.html"><span class="icon icon-scissors"></span><span data-loc="rps">Rock-Paper-Scissors</span></a></li> \
            <li class="pushy-link"><a href="coinflip.html"><span class="icon icon-coin-dollar"></span><span data-loc="coinflip">CoinFlip</span></a></li> \
            <li class="pushy-link"><a href="double.html"><span class="icon icon-make-group"></span><span data-loc="double">Double</span></a></li> \
            <li class="pushy-link"><a href="Dice.html"><span class="icon icon-dice"></span><span data-loc="dice">Roll Dice</span></a></li> \
            <li class="pushy-link"><a href="minesweeper.html"><span class="icon fa fa-bomb"></span><span data-loc="minesweeper">Minesweeper</span></a></li> \
            <li class="pushy-link"><a href="upgrader.html"><span class="icon fa fa-angle-double-up"></span><span data-loc="upgrader">Upgrader</span></a></li> \
        </ul></li> \
        <li class="submenu closed"><a href="#"><i class="icon icon-pacman"></i><span data-loc="online_games">Online games</span></a> \
        <ul data-loc-group="games_list"> \
            <li class="pushy-link"><a href="jackpot-Online.html"><span class="icon icon-spinner5"></span><span data-loc="jackpot">Jackpot</span> <sup class="beta">beta</sup></a></li> \
            <li class="pushy-link"><a href="double-Online.html"><span class="icon icon-make-group"></span><span data-loc="double">Double</span></a></li> \
            <li class="pushy-link"><a href="crash-Online.html"><span class="icon icon-stats-dots"></span><span data-loc="crash">Crash</span></a></li> \
        </ul></li> \
        <li class="pushy-link"><a href="inventory.html"><span class="icon icon-list"></span><span data-loc="inventory">Inventory</span></a></li>\
        <li class="pushy-link"><a href="market.html"><span class="icon icon-cart"></span><span data-loc="market">Market</span></a></li> \
        <li class="pushy-link"><a href="chatNew.html"><span class="icon icon-bubbles2"></span><span data-loc="chat">Chat</span></a></li> \
        <li class="pushy-link"><a href="statistic.html"><span class="icon icon-stats-bars"></span><span data-loc="statistic">Statistic</span></a></li> \
        <li class="pushy-link"><a href="faq.html"><span class="icon icon-question"></span><span data-loc="faq">FAQ</span></a></li> \
        <li class="pushy-link"><a href="news.html"><span class="icon icon-bullhorn"></span><span data-loc="updates">Updates</span></a></li> \
        <li class="pushy-link"><a href="settings.html"><span class="icon icon-cog"></span><span data-loc="settings">Settings</span></a></li> \
        <li class="pushy-link"><a href="about.html"><span class="icon icon-info"></span><span data-loc="about">About</span></a></li> \
        <li class="pushy-link"><a href="apps.html"><span class="icon icon-star-full"></span><span data-loc="other_apps">Other Apps</span></a></li> \
        </ul>';
    
    if (!isAndroid()) {
        menuHTML += '<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>\
                    <!-- Open Case menu block -->\
                    <ins class="adsbygoogle" style="display:inline-block;width:300px;height:250px" data-ad-client="ca-pub-9624392621060703" data-ad-slot="6439402276"></ins>\
                    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>'
    }        
    
    $(menu).html(menuHTML);
    $(document.body).addClass("menuClose");
    $(document).on('click', '.leftMenu ul a', function () {
        Sound("click", "play");
    });
    $(document).on('click', '.submenu', function () {
        $(this).toggleClass("closed opened");
        Sound('interface.wind');
    })
    $(document).on('click', '.navigationBar_hamburger, .site-overlay', function () {
        Sound("menuclick", "play");
        $(".left-menu").toggleClass("closed opened");
        if ($(".site-overlay").is(":visible")) $(".site-overlay").hide();
        else {
            $(".site-overlay").show();
        }
    })
    customEvent({ type: 'loading', event: 'menu' })
    
    //More coins modal
    if (isAndroid()) {
        $(document.body).append('<div class="modal fade" id="more_coins_modal" role="dialog" data-loc-group="more_coins_modal">\
            <div class="modal-dialog">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <button class="close" data-dismiss="modal">&times;</button>\
                        <h4 class="modal-title" data-loc="title">Get more coins</h4>\
                    </div>\
                    <div class="modal-body">\
                        <p data-loc="body">\
                           If you have no coins, you can watch the ad and get 1000 <i class="double-icon"></i>\
                        </p>\
                    </div>\
                    <div class="modal-footer">\
                        <button class="btn btn-success" id="watch_ad_for_coins" data-dismiss="modal" data-loc="watch">Watch the ad</button>\
                        <button class="btn btn-default" data-dismiss="modal" data-loc="cancel">Cancel</button>\
                    </div>\
                </div>\
            </div>\
        </div>');

        $(document).on('click', '#watch_ad_for_coins', function() {
            client.showVideoAd('javascript:$(document).trigger("coins_for_ad-watched")');
            LOG.log({
                action: 'Watch ad for coins'
            })
        })

        $(document).on('coins_for_ad-watched', function() {
            $.notify({
                message: '+1000<i class="double-icon"></i>'
            }, {
                type: 'success',
                delay: 1000
            })
            Player.doubleBalance+=1000;
            saveStatistic("doubleBalance", Player.doubleBalance);
        })
    }
    
    $('#menu_playerInfo_name').text(Player.nickname);
    $(document).on('expchanged', function() {
        $('.menu_rank__exp').text(Level.myEXP() + ' EXP');
        $('.lvl-current').text(Level.myLvl());
        $('.lvl-next').text(Level.nextLvl());
        $('#player-rank-progress').css('width', Level.progress()+'%');
        $('.menu_rank__next-lvl-exp').text((Level.nextLvlEXP() - Level.myEXP()) + ' to next level');
    })
    
    $(document).on('doublechanged', function() {
        $('#menu_doubleBalance').text(getStatistic('doubleBalance'));
    })
    
    // Yandex Metrika
    var code = '<!-- Yandex.Metrika counter --> <script type="text/javascript"> (function (d, w, c) { (w[c] = w[c] || []).push(function() { try { w.yaCounter44978944 = new Ya.Metrika({ id:44978944, clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true, ut:"noindex" }); } catch(e) { } }); var n = d.getElementsByTagName("script")[0], s = d.createElement("script"), f = function () { n.parentNode.insertBefore(s, n); }; s.type = "text/javascript"; s.async = true; s.src = "https://mc.yandex.ru/metrika/watch.js"; if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); } })(document, window, "yandex_metrika_callbacks"); </script> <noscript><div><img src="https://mc.yandex.ru/watch/44978944?ut=noindex" style="position:absolute; left:-9999px;" alt="" /></div></noscript> <!-- /Yandex.Metrika counter -->';
    
    $(document.body).append(code);
})