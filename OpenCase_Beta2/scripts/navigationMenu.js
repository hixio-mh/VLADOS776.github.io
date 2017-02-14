$(function () {
    $(".site-overlay").hide();
    var bar = $('.navigationBar');
    var barHTML = '<img src="../images/navigation/hamburger.png" class="navigationBar_hamburger menu-btn"><span data-loc="page_name"></span>';
    bar.html(barHTML);
    $(document.body).prepend('<div class="left-menu closed" data-loc-group="menu"></div>');
    var menu = $('.left-menu');
    var rank = getRank();
    var nextRank = getNextRank();
    var percent = ((Player.points - getRank().points) * 100) / (getNextRank().points - getRank().points);
    if (getNextRank().points - getRank().points == 0) percent = 100;
    var link = "chat.html";
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
            <a href="' + link + '" data-profileLink="true"><img src="../images/ava/' + Player.avatar + '" class="menu_ava"></a> \
            <div id="menu_playerInfo_info_text"> \
                <a href="' + link + '" data-profileLink="true"><span id="menu_playerInfo_name"></span></a> \
                <span id="menu_doubleBalance">' + Player.doubleBalance + '</span><i class="double-icon"></i> \
            </div> \
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
    </div>';
    
    menuHTML += '<ul> \
        <li class="pushy-link"><a href="cases.html"><span class="icon icon-key2"></span><span data-loc="open_case">Open Cases</span></a></li> \
        <li class="submenu closed" data-podmenu="games"><a href="#"><span class="icon icon-pacman"></span><span data-loc="games">Games</span></a> \
        <ul data-loc-group="games_list"> \
            <li class="pushy-link"><a href="rulet.html"><span class="icon icon-spinner5"></span><span data-loc="jackpot">Jackpot</span></a></li>\
            <li class="pushy-link"><a href="RPS.html"><span class="icon icon-scissors"></span><span data-loc="rps">Rock-Paper-Scissors</span></a></li> \
            <li class="pushy-link"><a href="coinflip.html"><span class="icon icon-coin-dollar"></span><span data-loc="coinflip">CoinFlip</span></a></li> \
            <li class="pushy-link"><a href="double.html"><span class="icon icon-make-group"></span><span data-loc="double">Double</span></a></li> \
            <li class="pushy-link"><a href="Dice.html"><span class="icon icon-dice"></span><span data-loc="dice">Roll Dice</span></a></li> \
        </ul></li> \
        <li class="submenu closed"><a href="#"><i class="icon icon-pacman"></i><span data-loc="online_games">Online games</span></a> \
        <ul data-loc-group="games_list"> \
            <li class="pushy-link"><a href="jackpot-Online.html"><span class="icon icon-spinner5"></span><span data-loc="jackpot">Jackpot</span> <sup class="beta">beta</sup></a></li> \
            <li class="pushy-link"><a href="double-Online.html"><span class="icon icon-make-group"></span><span data-loc="double">Double</span></a></li> \
            <li class="pushy-link"><a href="crash-Online.html"><span class="icon icon-stats-dots"></span><span data-loc="crash">Crash</span></a></li> \
        </ul></li> \
        <li class="pushy-link"><a href="inventory.html"><span class="icon icon-list"></span><span data-loc="inventory">Inventory</span></a></li>\
        <li class="pushy-link"><a href="market.html"><span class="icon icon-cart"></span><span data-loc="market">Market</span></a></li> \
        <li class="pushy-link"><a href="chat.html"><span class="icon icon-bubbles2"></span><span data-loc="chat">Chat</span></a></li> \
        <li class="pushy-link"><a href="statistic.html"><span class="icon icon-stats-bars"></span><span data-loc="statistic">Statistic</span></a></li> \
        <li class="pushy-link"><a href="faq.html"><span class="icon icon-question"></span><span data-loc="faq">FAQ</span></a></li> \
        <li class="pushy-link"><a href="news.html"><span class="icon icon-bullhorn"></span><span data-loc="updates">Updates</span></a></li> \
        <li class="pushy-link"><a href="settings.html"><span class="icon icon-cog"></span><span data-loc="settings">Settings</span></a></li> \
        <li class="pushy-link"><a href="about.html"><span class="icon icon-info"></span><span data-loc="about">About</span></a></li> \
        <li class="pushy-link"><a href="apps.html"><span class="icon icon-star-full"></span><span data-loc="other_apps">Other Apps</span></a></li> \
        </ul>';
    $(menu).html(menuHTML);
    $(document.body).addClass("menuClose");
    $(document).on('click', '.leftMenu ul a', function () {
        Sound("click", "play");
    });
    $(document).on('click', '.submenu', function () {
        $(this).toggleClass("closed opened"); //, 200, "easeOutSine");
    })
    $(document).on('click', '.navigationBar_hamburger, .site-overlay', function () {
        Sound("menuclick", "play");
        $(".left-menu").toggleClass("closed opened");
        if ($(".site-overlay").is(":visible")) $(".site-overlay").hide();
        else {
            $(".site-overlay").show();
        }
    })
    
    $(function() {
        $('#menu_playerInfo_name').text(Player.nickname)
    })
    
    $(document).on('expchanged', function() {
        $('.menu_rank__exp').text(Level.myEXP() + ' EXP');
        $('.lvl-current').text(Level.myLvl());
        $('.lvl-next').text(Level.nextLvl());
        $('#player-rank-progress').css('width', Level.progress()+'%');
        $('.menu_rank__next-lvl-exp').text((Level.nextLvlEXP() - Level.myEXP()) + ' to next level');
    })
})