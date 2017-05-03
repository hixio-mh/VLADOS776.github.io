var maxItems = 50;

$(document).on('localizationloaded', function() {
    $('.new-post__text').attr('placeholder', Localization.getString('profile.text_field'));
})

$(function () {
    var uid = getURLParameter('uid');
    if (uid == null ) return false;
    
    var showTradeID = getURLParameter('trade');
    
    $(".posts__new-post").hide();
    moment.locale(Settings.language);
    
    $('#moder-ban-other_checkbox').change(function() {
        if ($('#moder-ban-other_checkbox').is(':checked') == true) {
            $('#moder-ban-other_input').prop('disabled', false);
        } else {
            $('#moder-ban-other_input').prop('disabled', true);
            $('#moder-ban-other_input').val('');
        }
    })
    
    $(document).on('click', '#load_user_cases', function() {
        $(this).addClass('m-progress');
        
        $.getScript("../scripts/socket.io.js", function(data, status) {
            console.log('socket.io loading status', status);

            var socket = io('https://kvmde40-10035.fornex.org/', {path: '/customcases/socket.io'});
            
            socket.emit('userCases', uid);
            
            socket.on('userCases', function(cases) {
                if (cases.length > 0) {
                    var usrCases = '';
                    cases.forEach(function(cas) {
                        usrCases += "<a href='customCases.html?caseid=" + cas._id + "'><div class='case' data-case-id=" + cas._id + ">\
                            <img class='case-card' src='../images/Cases/casecard2.png'>\
                            <img class='case-img' src='../images/Cases/customCases/" + XSSreplace(cas.img) + "'>\
                            <span class='case-price currency dollar'>" + cas.price + "</span>\
                            <span class='case-name'>" + XSSreplace(cas.name) + "</span>\
                        </div></a>";
                    });
                    $('.user_cases .well').html('<div class="casesBlock-scroll">' + usrCases + '</div>')
                } else {
                    $('.user_cases .well').html("This user doesn't created any case.")
                }
            })
        })
    })
    
    $(document).on('click', '#follow', function() {
        var currentUID = firebase.auth().currentUser.uid;
        //if (!currentUID || uid === currentUID) return;
        
        var setVar = true;
        
        if (isAndroid() && client.getCurrentAppVersionCode() >= 12) {
            setVar = client.getFirebaseID();
        }
        
        if ($(this).data('action') === 'follow') {
            firebase.database().ref('/followers/' + uid + '/' + currentUID).set(setVar);
            firebase.database().ref('/users/' + currentUID + '/follow/' + uid).set(setVar);
            
            $(this).text(Localization.getString('profile.follow.unfollow', 'Unfollow'));
            $(this).data('action', 'unfollow');
            $('.stats__followers__count').text(parseInt($('.stats__followers__count').text()) + 1);
            
            LOG.log({
                action: 'Follow user',
                followed: {
                    uid: uid,
                    nickname: $('.profile__name').text()
                }
            })
        } else {
            firebase.database().ref('/followers/' + uid + '/' + currentUID).remove();
            firebase.database().ref('/users/' + currentUID + '/follow/' + uid).remove();
            
            $(this).text(Localization.getString('profile.follow.follow', 'Follow'));
            $(this).data('action', 'follow');
            $('.stats__followers__count').text(parseInt($('.stats__followers__count').text()) - 1);
            
            LOG.log({
                action: 'Unfollow user',
                followed: {
                    uid: uid,
                    nickname: $('.profile__name').text()
                }
            })
        }
    })
    
    $(document).on('click', '.stats__followers', function() {
        if ($('.stats__followers__count').text() == '0') return;
        
        $('#followers-modal').modal();
        $('#followers-list').empty();
        
        $('#followers-modal').find('.modal-title').text('Followers');
        firebase.database().ref('followers/' + uid).once('value').then(function(snapshot) {
            var followersUIDs = snapshot.val();
            var $parent = $('#followers-list');
            
            for (var key in followersUIDs) {
                $('#followers-template').tmpl({uid: key, avatar: '../images/ava/0.jpg'}).addClass('follower-temp').appendTo($parent);
                
                fbProfile.profilePublic(key, function(profile) {
                    profile.avatar = avatarUrl(profile.avatar);
                    profile.nickname = XSSreplace(profile.nickname);
                    $('.follower-temp[data-uid="'+profile.uid+'"]').replaceWith($('#followers-template').tmpl(profile));
                })
            }
        })
    })
    
    $(document).on('click', '.iFollow', function() {
        $('#followers-modal').modal();
        $('#followers-list').empty();
        
        $('#followers-modal').find('.modal-title').text('You follow');
        
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/follow').once('value').then(function(snapshot) {
            var followersUIDs = snapshot.val();
            var $parent = $('#followers-list');
            
            for (var key in followersUIDs) {
                $('#followers-template').tmpl({uid: key, avatar: '../images/ava/0.jpg'}).addClass('follower-temp').appendTo($parent);
                
                fbProfile.profilePublic(key, function(profile) {
                    profile.avatar = avatarUrl(profile.avatar);
                    profile.nickname = XSSreplace(profile.nickname);
                    $('.follower-temp[data-uid="'+profile.uid+'"]').replaceWith($('#followers-template').tmpl(profile));
                })
            }
        })
    })
    
    $(document).on('click', '.follower', function() {
        if ($(this).hasClass('follower-temp')) return;
        
        document.location = 'profile.html?uid=' + $(this).data('uid');
    })
    
    fbProfile.showProfile(uid, function (userInfo) {
        if (userInfo == null) {
            userNotFound();
            return false;
        }
        $(".profile__img").attr('src', userInfo.public.avatar);
        $(".other-user-profile-img").attr('src', userInfo.public.avatar);
        $(".post__header__img").attr('src', userInfo.public.avatar);
        $(".profile__name").text(userInfo.public.nickname);
        $(".stats__rank__rank").text(Level.calcLvl(userInfo.public.points));
        $('.user_uid').text(uid);
        
        if (uid != firebase.auth().currentUser.uid) {
            $(".posts__new-post").hide();
            $('.rep').show();
        } else {
            $('.follow_block').hide();
            $(".posts__new-post").show();
            $('.rep').hide();
            $(".left-side, .right-side, .top_panel").show();
            
            getInventory().then(function(result) {
                var inventoryRef = firebase.database().ref('inventories/' + firebase.auth().currentUser.uid);
                inventoryRef.child('inventory_count').set(result.count);
                
            })
            
            if (showTradeID != null) {
                $(document).on('trade_allowed', function() {
                    showTrade(showTradeID);
                })
            }
        }
        if (userInfo.public.bigBG && fbProfile.ifValidImg(userInfo.public.bigBG)) {
            $('.top__bg').css('background-image', 'url(' + userInfo.public.bigBG + ')');
        }
        else if (userInfo.public.colorBG) {
            $('.top__bg').attr('style', 'background:' + userInfo.public.colorBG);
        }
        
        // Меняем профиль в зависимости от группы пользователя
        if (userInfo.moder != null && userInfo.moder.group != null)
            $('#container').addClass(userInfo.moder.group);
        
        if (typeof userInfo.public.betaTrade != "undefined" && userInfo.public.betaTrade == true) {
            firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/public/betaTrade').once('value', function (snapshot) {
                try {
                    if (snapshot.val() == true) $(".top__trade").removeClass("disabled");
                    $(document).trigger('trade_allowed');
                }
                catch (e) {
                    $(document).trigger('trade_disallowed');
                }
            })
        }
        
        if (userInfo.auto !== null) {
            if (userInfo.auto.awards !== null) {
                var awards = '';
                for (var key in userInfo.auto.awards) {
                    awards += '<li data-toggle="tooltip" title="' + userInfo.auto.awards[key].case_name + '" class="award award_' + userInfo.auto.awards[key].award + '">';
                }
                $('.awards').show();
                $('.awards').html(awards);
                $('[data-toggle="tooltip"]').tooltip(); 
            }
            if (userInfo.auto.followers_count !== null) {
                var followers_count = parseInt(userInfo.auto.followers_count);
                if (isNaN(followers_count)) followers_count = 0;
                $('.stats__followers__count').text(followers_count);
            } else {
                $('.stats__followers__count').text(0);
            }
        }
        
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/moder').once('value').then(function (snapshot) {
            var groups = snapshot.val() != null ? snapshot.val().group : null;
            if (!groups) return
            
            if (groups.match(/(moder|admin)/)) {
                $(".moder-menu").show();
                firebase.database().ref('users/' + uid + '/moder').once('value').then(function (snapshot) {
                    var data = snapshot.val();
                    if (data == null) return;
                    if (typeof data.tradeban != 'undefined') {
                        $('#block-trade-reason').html(data.tradeban.reason + (data.tradeban.from ? '<br>' + banLength(data.tradeban.from, data.tradeban.to) : ''));
                    }
                    if (typeof data.chatban != 'undefined') {
                        $('#block-chat-reason').html(data.chatban.reason + (data.chatban.from ?'<br>' + banLength(data.chatban.from, data.chatban.to) : '' ));
                    }
                }).then(function() {
                    firebase.database().ref('users/' + uid + '/private').once('value').then(function(snapshot) {
                        window.user_androidID = snapshot.val().androidID ? snapshot.val().androidID : false;
                    })
                })
            }
            
            if (groups.match(/(beta|admin)/)) {
                //$('.beta_only').show();
            }
        });
        
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/follow/' + uid).once('value').then(function(snapshot) {
            if (snapshot.val() !== null) {
                $('#follow').text(Localization.getString('profile.follow.unfollow', 'Unfollow'));
                $('#follow').data('action', 'unfollow');
            } else {
                $('#follow').data('action', 'follow');
                $('#follow').text(Localization.getString('profile.follow.follow', 'Follow'));
            }
            $('#follow').show();
        })
    });
    fbProfile.repVal(uid, function (rep, userRep) {
        $(".stats__rate__count").text((rep > 99999 ? '∞' : rep));
        if (userRep == '-') {
            $('.rep-minus').addClass('active');
        }
        else if (userRep == '+') {
            $('.rep-plus').addClass('active');
        }
        if (parseInt(rep) < 0) $(".stats__rate__count").addClass('bad-rep');
    });
    fbInventory.getInventoryCount(uid, function (count) {
        if (typeof count != 'number') return false;
        $('.stats__inventory__count').text(count);
    })

    function userNotFound() {
        $(".profile__img").attr('src', '../images/ava/no-user-avatar.png');
        $(".profile__name").text('User not found');
        //var rank = getRank(userInfo.point);
        $(".stats__rank__rank").text('0');
    }
    
    // === Moder menu ===
    $('#moder-ban-modal').on('show.bs.modal', function(e) {
        $(this).find('.btn-danger').data('block', $(e.relatedTarget).data('block'));
        
        var banReasons = $(e.relatedTarget).next('.block-reason').html().split('<br>')[0];
        
        $('#moder-ban-modal .modal-content input').each(function(){
            var current = $(this).parent('label').text().trim();
            
            if (banReasons.match(current)) {
                $(this).prop('checked', true);
                banReasons = banReasons.replace(current, '');
            } else {
                $(this).prop('checked', false);
            }
        })
        if (!banReasons.trim().match(Localization.getString('profile.moderator.no_ban', 'Doesn\'t banned')) && banReasons.trim() !== 'Doesn\'t banned' && banReasons.trim() != '') {
            $('#moder-ban-other_input').val(banReasons.trim()); 
            $('#moder-ban-other_input').prop('disabled', false); 
            $('#moder-ban-other_checkbox').prop('checked', true);
        } else {
            $('#moder-ban-other_input').val(''); 
            $('#moder-ban-other_input').prop('disabled', true); 
            $('#moder-ban-other_checkbox').prop('checked', false);
            
        }
    })
    
    $('#moder-ban_time').on('change', function() {
        var time = parseInt($(this).val());
        if (isNaN(time) || time <= 0) {
            time = 1;
            $('#moder-ban_time').val(time);
        } else if (time > 60) {
            time = 60;
            $('#moder-ban_time').val(time);
        }
        var multiply = parseInt($('#moder-ban_time-type option:selected').attr('mult'));
        if (isNaN(multiply))
            multiply = 60000;
    })
    
    $(document).on('click', '#ban_user', function() {
        var banReason = (function(){
            var reason = '';
            $('#moder-ban-modal .modal-content input:checked').each(function(){
                var current = $(this).parent('label').text().trim();
                
                if ($(this).attr('id') == 'moder-ban-other_checkbox') {
                    current = $('#moder-ban-other_input').val().trim();
                } 
                
                reason += current + ' ';
            })
            return reason.trim();
        })();
        
        var ban = 'chatban';
        if ($(this).data('block') === 'trade') ban = 'tradeban';
        
        var banTime = (function() {
            var time = parseInt($('#moder-ban_time').val());
            if (isNaN(time) || time <= 0) {
                time = 1;
                $('#moder-ban_time').val(time);
            } else if (time > 60) {
                time = 60;
                $('#moder-ban_time').val(time);
            }
            var multiply = parseInt($('#moder-ban_time-type option:selected').attr('mult'));
            if (isNaN(multiply))
                multiply = 60000;
            
            return time * multiply;
        })()
        
        if (banReason !== '') {
            var banObj = {
                reason: banReason,
                to: banTime,
                from: firebase.database.ServerValue.TIMESTAMP
            }
            firebase.database().ref('users/' + uid + '/moder/' + ban).set(banObj);
            firebase.database().ref('bans/' + uid + '/' + ban).set(banReason);
            if (user_androidID) {
                firebase.database().ref('androidIDBans/' + user_androidID + '/' + ban).set(banObj);
            }
            $('#block-' + $(this).data('block') + '-reason').html(banReason + '<br>' + banLength(Date.now(), banTime));
            
            if (isAndroid()) client.sendToAnalytics('Profile', 'Модератор', "Модератор заблокировал " + $(this).data('block'), Player.nickname + ' заблокировал ' + $(".profile__name").text());
            LOG.warn({
                action: 'Moderator blocked ' + $(this).data('block'),
                ban: {
                    reason: banReason,
                    user: {
                        uid: uid,
                        name: $(".profile__name").text()
                    },
                    time: banTime
                }
            })
        } else if (banReason === '') {
            firebase.database().ref('users/' + uid + '/moder/'+ban).remove();
            firebase.database().ref('bans/' + uid + '/'+ban).remove();
            if (user_androidID) {
                firebase.database().ref('androidIDBans/' + user_androidID + '/'+ban).remove();
            }
            $('#block-' + $(this).data('block') + '-reason').text("Doesn't banned");
            
            if (isAndroid()) client.sendToAnalytics('Profile', 'Модератор', "Модератор разблокировал " + $(this).data('block'), Player.nickname + ' разблокировал ' + $(".profile__name").text());
            LOG.warn({
                action: 'Moderator unblocked ' + $(this).data('block'),
                ban: {
                    user: {
                        uid: uid,
                        name: $(".profile__name").text()
                    }
                }
            })
        }
        $('#moder-ban-modal').modal('hide');
    })
    // == End Moder menu ===
    $(document).on('click', '.top__trade', function () {
        if ($('.trade-window').is(":visible") || $(this).hasClass('disabled')) return;
        $('#send-trade').hide();
        $('.user-profile-img').attr('src', firebase.auth().currentUser.photoURL);
        $('#back-step').hide();
        $('.trade-window').show();
        $('ul .inventory').children('li').remove();
        if (uid == firebase.auth().currentUser.uid) {
            $('.my-trades').show();
            $('.send-trade-window').hide();
            $('.my-trades-list').show();
            $('.my-trades__trades-with-user').hide();
            $(".my-trades .trade__weapons__summ").hide();
            $('.trade-back').hide();
            showMyTrades();
            LOG.log({
                action: 'Check my trades',
            })
        }
        else {
            $('.my-trades').hide();
            $('.send-trade-window').show();
            fillInventory('.inventory', 'trade', {price: true, nameTag: true});
        }
        $($('.trade__menu__item')[0]).click();
    })
    $(document).on('click', '.trade__menu__item', function () {
        $('.trade__menu__item.active').removeClass('active');
        $(this).addClass('active');
        if (this.id == 'trade-menu-your-items') {
            $(".trade__weapons__player1").show();
            $(".trade__weapons__player2").hide();
            $(".trade__weapons__summ").hide();
            $('#send-trade').hide();
            $('#back-step').hide();
            $('#next-step').show();
        }
        else if (this.id == 'trade-menu-player-items') {
            $(".trade__weapons__player1").hide();
            $(".trade__weapons__player2").show();
            $(".trade__weapons__summ").hide();
            $('#next-step').show();
            $('#back-step').show();
            $('#send-trade').hide();
        }
        else if (this.id == 'trade-menu-summ') {
            $(".trade__weapons__player1").hide();
            $(".trade__weapons__player2").hide();
            $(".trade__weapons__summ").show();
            $('#next-step').hide();
            $('#send-trade').show();
            $('#back-step').show();
            $('#summ-your-offer li').remove();
            $('#trade-its-gift').prop('checked', false);
            if ($('.inventoryItemSelected').length != 0) {
                $('#send-trade').prop('disabled', false);
                $('.checkbox-trade-ready').removeClass('disabled');
                $('.inventoryItemSelected').each(function () {
                    $(this).clone().removeClass('inventoryItemSelected').appendTo('#summ-your-offer').find('i').remove();
                })
            }
            else {
                $('#send-trade').prop('disabled', true);
                $('.checkbox-trade-ready').addClass('disabled');
                $('#you-ready-to-trade').prop('checked', false);
            }
        }
    })
    $(document).on('click', '#send-trade', function () {
        var ids = [];
        $('#summ-your-offer li').each(function () {
            var inventoryID = parseInt($(this).data('id'));
            ids.push(inventoryID);
        })
        getWeapons(ids).then(function (tradeWeapons) {
            var accepted = $('#trade-its-gift').is(':checked');
            var convertedWeapons = tradeWeapons.map(function (item) {
                return item.tradeObject();
            });
            fbProfile.newTrade(uid, convertedWeapons, accepted, function (tradeInfo) {
                console.log('Trade sended');
                for (var i = 0; i < ids.length; i++) deleteWeapon(ids[i]);
                $('#close-trade-window').click();
                Lobibox.notify('success', {
                    pauseDelayOnHover: false
                    , continueDelayOnInactiveTab: false
                    , width: $(window).width()
                    , position: 'top center'
                    , icon: false
                    , title: Localization.getString('profile.exchange.notification.title')
                    , size: 'mini'
                    , showClass: 'fadeInDown'
                    , hideClass: 'fadeOutUp'
                    , msg: Localization.getString('profile.exchange.notification.trade_send')
                });
                if (isAndroid()) client.sendToAnalytics('Profile', 'Trades', 'Send trade', "To: " + uid + " Weapons: " + convertedWeapons.length);
                LOG.log({
                    action: 'Send trade',
                    trade: {
                        tradeID: tradeInfo.tradeID,
                        weapons: convertedWeapons.length
                    }
                })
            })
        })
    })
    $(document).on('click', '.trade__button', function () {
        if (this.id == 'next-step') {
            $($('.trade__menu__item.active').next('.trade__menu__item')[0]).click();
        }
        if (this.id == 'back-step') {
            $($('.trade__menu__item.active').prev('.trade__menu__item')[0]).click();
        }
    })
    $(document).on('click', '#close-trade-window', function () {
        $('.trade-window').hide();
    })

    function showMyTrades() {
        $('.my-trades-list li').remove();
        fbProfile.getMyTrades(function (trades) {
            //var liTemplate = "";
            for (var i = 0; i < trades.length; i++) {
                var tradesList = JSON.stringify(trades[i].trades).replace(/'/g, "\\'");
                $('.my-trades-list').prepend("<li class='my-trades-list__tradeWith' data-uid='" + trades[i].tradeWith.uid + "' data-trades='" + tradesList + "'><div class='tradeWith__img-container'><img src='../images/ava/0.jpg'></div>" + "<div class='tradeWith__text-container'><span class='tradeWith__nickname'>Loading...</span><span class='tradeWith__tradeCount'>" + Localization.getString('profile.exchange.exchange_offers') + trades[i].trades.length + "</span></div><div class='tradeWith__controls'><i aria-hidden='true' class='fa fa-times delete-trade'></i></div></li>");
                fbProfile.profilePublic(trades[i].tradeWith.uid, function (plInfo) {
                    var $parent = $('.my-trades-list__tradeWith[data-uid="' + plInfo.uid + '"]');
                    $($parent.find('img')[0]).attr('src', plInfo.avatar);
                    $($parent.find('.tradeWith__nickname')[0]).text(plInfo.nickname);
                })
            }
        })
    };
    
    $(document).on('click', '.delete-trade', function(e) {
        e.stopPropagation();
        var userID = $(this).parents('.my-trades-list__tradeWith').data('uid');
        console.log('delete trade', userID);
        $('#deleteTrades').data('userID', userID);
        $('#delete-trade-modal').modal();
        
        $(document).one('click', '#deleteTrades', function() {
            var userID = $('#deleteTrades').data('userID');
            fbProfile.deleteTradesWithUser(userID, function() {
                console.log('success');
                $('#delete-trade-modal').modal('hide');
                
                var el = $('.my-trades-list li[data-uid="'+userID+'"]');
                $(el).addClass('animated fadeOutLeft');
                setTimeout(function(){
                    $(el).remove();
                }, 1000)
            })
        })
    })
    
    $(document).on('click', '.my-trades-list__tradeWith .tradeWith__img-container', function () {
        var uid = $(this).parent().data('uid');
        window.location = 'profile.html?uid=' + uid;
        return false;
    })
    $(document).on('click', '.my-trades-list__tradeWith', function () {
        var trades = $(this).data('trades');
        var myAva = firebase.auth().currentUser.photoURL;
        var otherAva = $($(this).find('.tradeWith__img-container img')[0]).attr('src');
        console.log(trades);
        $('.my-trades-list').hide();
        $('.my-trades__trades-with-user').show();
        $('.my-trades__trades-with-user li').remove();
        $('.trade-back').show();
        for (var i = 0; i < trades.length; i++) {
            var tr = "<li class='trades-with-user__trade " + (trades[i].watched ? "" : "unwatched") + "' data-tradeid='" + trades[i].tradeID + "'><div class='trade__li trade__other'><img class='tradeWith__img' src='" + otherAva + "'><span class='tradeWith__val give-to-you'>0</span></div><div class='trade__li trade__between'><i class=\"fa fa-exchange\" aria-hidden=\"true\"></i></div><div class='trade__li trade__you'><img class='tradeWith__img' src='" + myAva + "'><span class='tradeWith__val you-give'>0</span></div>";
            tr += "<div class='trade__info__hidden'><ul class='trade__info__weapons inv-no-select summ-inventory to-you'></ul><ul class='trade__info__weapons inv-no-select summ-inventory your '></ul></div></li>";
            $('.my-trades__trades-with-user').prepend(tr);
            if (!trades[i].watched) {
                firebase.database().ref('tradeList/' + firebase.auth().currentUser.uid + '/' + $(this).data('uid') + '/' + trades[i].key + '/watched').set(true);
            }
            fbProfile.tradeInfoShort(trades[i].tradeID, function (tradeInfo) {
                var $parent = $('.trades-with-user__trade[data-tradeid="' + tradeInfo.tradeID + '"]');
                $($parent).find('.give-to-you').text(tradeInfo.otherPlayer.weapons);
                if (tradeInfo.status == 'canceled') {
                    $($parent).addClass('canceled');
                }
                else if (tradeInfo.status == 'done') {
                    $($parent).addClass('done');
                }
                else if (tradeInfo.otherPlayer.changeOffer > tradeInfo.player.accepted) {
                    $($parent).addClass('changed');
                }
                if ((tradeInfo.status == 'canceled' || tradeInfo.status == 'done') && typeof tradeInfo.player.getWeapons == 'undefined') {
                    fbProfile.getTradeWeapons(tradeInfo.tradeID, tradeInfo.status == 'done' ? tradeInfo.otherPlayer.id : tradeInfo.player.id)
                }
                var accepted = tradeInfo.otherPlayer.changeOffer > tradeInfo.player.accepted ? false : tradeInfo.otherPlayer.accepted;
                $($parent).data('youAccepted', tradeInfo.player.accepted);
                $($parent).data('otherAccepted', accepted);
                $($parent).data('otherUid', tradeInfo.otherPlayer.id);
                $($parent).find('.you-give').text(tradeInfo.player.weapons);
            })
        }
    })
    $(document).on('click', '.trades-with-user__trade', function () {
        $(".my-trades .trade__weapons__summ").show();
        $('.my-trades__trades-with-user').hide();
        
        var otherAva = $(this).find('.trade__other img').attr('src');
        $('.other-user-profile-img').attr('src', otherAva);
        $('.user-profile-img').attr('src', avatarUrl(Player.avatar));
        
        fbProfile.currentTrade = {
            id: $(this).data('tradeid')
            , otherUid: $(this).data('otherUid')
            , youAccepted: $(this).data('youAccepted')
            , otherAccepted: $(this).data('otherAccepted')
        };
        $('#my-trades__your-offer').empty();
        $('#my-trades__other-offer').empty();
        $("#make-trade").prop('disabled', true);
        $("#cancel-trade").data('tradeid', $(this).data('tradeid'));
        $("#make-trade").data('tradeid', $(this).data('tradeid'));
        $("#you-ready-to-trade").data('tradeid', $(this).data('tradeid'));
        if ($(this).data('youAccepted')) $("#you-ready-to-trade").prop('checked', true);
        else $("#you-ready-to-trade").prop('checked', false);
        if ($(this).data('otherAccepted')) {
            $(".other-player-ready").text(Localization.getString('profile.exchange.status.ready'));
            $(".other-player-ready").addClass('ready');
        }
        else {
            $(".other-player-ready").text(Localization.getString('profile.exchange.status.not_ready'));
            $(".other-player-ready").removeClass('ready');
        }
        if ($(this).data('youAccepted') && $(this).data('otherAccepted')) {
            $('#make-trade').prop('disabled', false);
        }
        if ($(this).hasClass('canceled') || $(this).hasClass('done')) {
            $("#cancel-trade").hide();
            $("#make-trade").hide();
            $("#change-weapons-trade").hide();
        }
        else {
            $("#cancel-trade").show();
            $("#make-trade").show();
            $("#change-weapons-trade").show();
        }
        if ($(this).hasClass('unwatched')) {
            firebase.database().ref('trades/' + fbProfile.currentTrade.id + '/tradeInfo/' + firebase.auth().currentUser.uid + '/accepted').set(false);
            $(this).removeClass('unwatched');
        }
        $($(this).find('.your')[0]).clone().appendTo('#my-trades__your-offer');
        $($(this).find('.to-you')[0]).clone().appendTo('#my-trades__other-offer');
        //Если что-то изменилось
        /*var tradeRef = firebase.database().ref('trades/'+fbProfile.currentTrade.id+'/'+fbProfile.currentTrade.otherUid);*/
        var tradeInfoRef = firebase.database().ref('trades/' + fbProfile.currentTrade.id + '/tradeInfo/' + fbProfile.currentTrade.otherUid);
        //tradeRef.on('child_changed', changed);
        //tradeRef.on('child_added', changed);
        firebase.database().ref('trades/' + fbProfile.currentTrade.id + '/' + firebase.auth().currentUser.uid).once('value').then(function (myWeaponsSnapshot) {
            var myWeapons = myWeaponsSnapshot.val();
            if (myWeapons != null) {
                for (var i = 0; i < myWeapons.length; i++) {
                    var weapon = myWeapons[i];
                    if (typeof weapon == 'undefined') continue;
                    if (typeof weapon == 'string') weapon = JSON.parse(weapon);
                    weapon = new Weapon(weapon);
                    var weaponJSON = JSON.stringify(weapon.tradeObject()).replace(/'/g, "\\'");
                    $('#my-trades__your-offer').find(".trade__info__weapons.your").append($(weapon.toLi({price: true, nameTag: true, nameTagIcon: true})).data('weapon_obj', weaponJSON));
                }
            }
        })
        tradeInfoRef.on('child_changed', changed);
        tradeInfoRef.on('child_added', changed);

        function changed(data) {
            console.log('changed');
            if (data.key == 'accepted') {
                console.log('Other player Ready!');
                //Если другой пользователь нажал на галочку "Готов трейдиться"
                fbProfile.currentTrade.otherAccepted = data.val();
                if (fbProfile.currentTrade.otherAccepted) {
                    $(".other-player-ready").text(Localization.getString('profile.exchange.status.ready'));
                    $(".other-player-ready").addClass('ready');
                }
                else {
                    $(".other-player-ready").text(Localization.getString('profile.exchange.status.not_ready'));
                    $(".other-player-ready").removeClass('ready');
                }
                if (fbProfile.currentTrade.youAccepted && fbProfile.currentTrade.otherAccepted) {
                    $('#make-trade').prop('disabled', false);
                }
                else {
                    $('#make-trade').prop('disabled', true);
                }
            }
            else if (data.key == 'weapons') {
                //Если другой пользователь именил своё предложение
                firebase.database().ref('trades/' + fbProfile.currentTrade.id + '/' + fbProfile.currentTrade.otherUid).once('value').then(function (data) {
                    var Trade_weapons = data.val();
                    if (Trade_weapons == null) Trade_weapons = [];
                    $('#my-trades__other-offer').find(".trade__info__weapons.to-you").empty();
                    for (var i = 0; i < Trade_weapons.length; i++) {
                        var weapon = Trade_weapons[i];
                        if (typeof weapon == 'undefined') continue;
                        weapon = new Weapon(weapon);
                        $('#my-trades__other-offer').find(".trade__info__weapons.to-you").append(weapon.toLi({price: true, nameTag: true, nameTagIcon: true}));
                    }
                    $('#my-trades__other-offer').effect('highlight');
                    $('li[data-tradeid="' + fbProfile.currentTrade.id + '"] .trade__other .give-to-you').text(Trade_weapons.length);
                });
            }
            else if (data.key == 'getWeapons') {
                fbProfile.tradeInfoShort(fbProfile.currentTrade.id, function (tradeInfo) {
                    if (typeof tradeInfo.player.getWeapons != 'undefined') return;
                    fbProfile.getTradeWeapons(tradeInfo.tradeID, tradeInfo.status == 'done' ? tradeInfo.otherPlayer.id : tradeInfo.player.id)
                    $('.trade-back').click();
                    $('li[data-tradeid="' + tradeInfo.tradeID + '"]').addClass(tradeInfo.status);
                })
            }
        };
    })
    
    $(document).on('click', '#you-ready-to-trade', function () {
        var tradeID = $(this).data('tradeid');
        var status = $('#you-ready-to-trade').is(':checked');
        if (status == true) status = firebase.database.ServerValue.TIMESTAMP;
        firebase.database().ref('trades/' + tradeID + '/tradeInfo/' + firebase.auth().currentUser.uid + '/accepted').set(status);
        fbProfile.currentTrade.youAccepted = $('#you-ready-to-trade').is(':checked');
        $('[data-tradeid="' + tradeID + '"]').data('youAccepted', status);
        $('[data-tradeid="' + tradeID + '"]').removeClass('changed');
        if ($('#you-ready-to-trade').is(':checked') && $(".other-player-ready").hasClass('ready')) {
            $('#make-trade').prop('disabled', false);
        }
        else {
            $('#make-trade').prop('disabled', true);
        }
        
        LOG.log({
            action: 'Ready to trade',
            tradeID: tradeID
        })
        try {
            Trades.currentTrade.you.ready = $('#you-ready-to-trade').is(':checked');
        } catch (e) {}
    })
    $(document).on('click', '.trade-back', function () {
        if ($('.my-trades__trades-with-user').is(':visible')) {
            $('.my-trades-list').show();
            $('.my-trades__trades-with-user').hide();
            $(".my-trades .trade__weapons__summ").hide();
            $('.trade__weapons__chang-your-weapons').hide();
            $('.trade-back').hide();
        }
        else if ($('.trade__weapons__chang-your-weapons').is(':visible')) {
            $('.my-trades-list').hide();
            $('.my-trades__trades-with-user').hide();
            $(".my-trades .trade__weapons__summ").show();
            $('.trade__weapons__chang-your-weapons').hide();
        }
        else if ($(".my-trades .trade__weapons__summ").is(':visible')) {
            $('.my-trades-list').hide();
            $('.my-trades__trades-with-user').show();
            $(".my-trades .trade__weapons__summ").hide();
            $('.trade__weapons__chang-your-weapons').hide();
        }
    })
    $(document).on('click', '#change-weapons-trade', function () {
        var oldWp = [];
        $('#my-trades__your-offer .trade__info__weapons.your li').each(function () {
            oldWp.push(JSON.parse($(this).data('weapon_obj')));
        });
        if (oldWp.length >= maxItems) {
            Lobibox.notify('error', {
                pauseDelayOnHover: false
                , continueDelayOnInactiveTab: false
                , width: $(window).width()
                , position: 'top center'
                , icon: false
                , title: Localization.getString('profile.exchange.send_trade.notification.title')
                , size: 'mini'
                , showClass: 'fadeInDown'
                , hideClass: 'fadeOutUp'
                , msg: Localization.getString('profile.exchange.send_trade.notification.to_many_weapons').replace('${1}', maxItems)
            });
            return;
        }
        $(".my-trades .trade__weapons__summ").hide();
        $('.trade__weapons__chang-your-weapons').show();
        fillInventory('.inventory', 'trade', {price: true, nameTag: true});
    })
    $(document).on('click', '#add-weapons', function () {
        var tradeWeapons = [];
        var ids = [];
        var oldWp = [];
        $('#my-trades__your-offer .trade__info__weapons.your li').each(function () {
            oldWp.push(JSON.parse($(this).data('weapon_obj')));
        });
        if (oldWp.length >= maxItems) {
            Lobibox.notify('error', {
                pauseDelayOnHover: false
                , continueDelayOnInactiveTab: false
                , width: $(window).width()
                , position: 'top center'
                , icon: false
                , title: Localization.getString('profile.exchange.send_trade.notification.title')
                , size: 'mini'
                , showClass: 'fadeInDown'
                , hideClass: 'fadeOutUp'
                , msg: Localization.getString('profile.exchange.send_trade.notification.to_many_weapons').replace('${1}', maxItems)
            });
            return;
        }
        $('.inventoryItemSelected').each(function () {
            ids.push(parseInt($(this).data('id')));
            var wp = JSON.parse($(this).data('weapon_obj'));
            tradeWeapons.push(wp);
            $(this).clone().removeClass('inventoryItemSelected').appendTo('#my-trades__your-offer .trade__info__weapons.your').data('weapon_obj', wp).find('i').remove();
        });
        var convertedWeapons = oldWp.concat(tradeWeapons);
        fbProfile.updateTradeOffer($('#you-ready-to-trade').data('tradeid'), convertedWeapons, function () {
            for (var i = 0; i < ids.length; i++) deleteWeapon(ids[i]);
            var $parent = $('li[data-tradeid="' + $('#you-ready-to-trade').data('tradeid') + '"] .trade__info__hidden .trade__info__weapons.your');
            $($parent).empty();
            for (var i = 0; i < convertedWeapons.length; i++) {
                var weapon = new Weapon(convertedWeapons[i]);
                var weaponJSON = JSON.stringify(weapon.tradeObject()).replace(/'/g, "\\'");
                var $li = $(weapon.toLi({price: true, nameTag: true, nameTagIcon: true}));
                $li.data('weapon_obj', weaponJSON);
                $($parent).append($li);
            }
            fbProfile.setChangeOfferTime($('#you-ready-to-trade').data('tradeid'));
            if (isAndroid()) client.sendToAnalytics('Profile', 'Trades', 'Trade changed', "Player changed trade. tradeID: " + $('#you-ready-to-trade').data('tradeid'));
        })
        $('[data-tradeid="' + $('#you-ready-to-trade').data('tradeid') + '"]').data('otherAccepted', false);
        $('.trade-back').click();
    })
    $(document).on('click', '#cancel-trade', function () {
        var tradeID = $(this).data('tradeid');
        fbProfile.tradeStatus(tradeID, function (status) {
            if (status != 'done' && status != 'canceled') {
                fbProfile.setTradeStatus(tradeID, 'canceled');
                fbProfile.tradeInfo(tradeID, function (tradeInfo) {
                    var Trade_weapons = tradeInfo.player.weapons;
                    var convertedWeapons = [];
                    for (var i = 0; i < Trade_weapons.length; i++) {
                        //var wp = fbInventory.reverseConvert(weapons[i]);
                        wp = new Weapon(Trade_weapons[i]);
                        wp.new = true;
                        convertedWeapons.push(wp);
                    }
                    for (var i = 0; i < convertedWeapons.length; i++) {
                        saveWeapon(convertedWeapons[i]);
                    }
                    if (!isAndroid()) saveInventory();
                    fbProfile.setTradeGetWeaponsStatus(tradeID, true);
                    checkInventoryForNotification();
                    $('.trades-with-user__trade[data-tradeid="' + tradeInfo.tradeID + '"]').addClass('canceled');
                    $('.trade-back').click();
                    if (isAndroid()) client.sendToAnalytics('Profile', 'Trades', 'Trade complete', "Trade canceled! tradeID: " + tradeID);
                    LOG.log({
                        action: 'Cancel trade',
                        tradeID: tradeID
                    })
                });
            }
        })
    })
    $(document).on('click', '#make-trade', function () {
        var tradeID = $(this).data('tradeid');
        $('#make-trade').prop('disabled', true);
        fbProfile.tradeInfo(tradeID, function (tradeInfo) {
            if (tradeInfo.otherPlayer.accepted && tradeInfo.player.accepted && !tradeInfo.player.getWeapons && tradeInfo.status != 'done' && tradeInfo.status != 'canceled') {
                fbProfile.setTradeStatus(tradeID, 'done');
                var Trade_weapons = tradeInfo.otherPlayer.weapons;
                var convertedWeapons = [];
                for (var i = 0; i < Trade_weapons.length; i++) {
                    //var wp = fbInventory.reverseConvert(weapons[i]);
                    wp = new Weapon(Trade_weapons[i]);
                    wp.new = true;
                    convertedWeapons.push(wp);
                }
                for (var i = 0; i < convertedWeapons.length; i++) {
                    saveWeapon(convertedWeapons[i]);
                }
                fbProfile.setTradeGetWeaponsStatus(tradeID, true);
                checkInventoryForNotification();
                $('.trades-with-user__trade[data-tradeid="' + tradeInfo.tradeID + '"]').addClass('done');
                $('.trade-back').click();
                if (isAndroid()) client.sendToAnalytics('Profile', 'Trades', 'Trade complete', "Trade done! tradeID: " + tradeID);
                LOG.log({
                    action: 'Make trade',
                    tradeID: tradeID
                })
            }
            else if (tradeInfo.player.getWeapons && tradeInfo.otherPlayer.getWeapons && tradeInfo.status != 'done') {
                fbProfile.setTradeStatus(tradeID, 'done');
            }
        })
    })
    $(document).on('click', '.sign-out', function () {
        fbProfile.logout();
        
        window.location = 'chat.html';
    })
    $(document).on('click', '.edit-profile', function () {
        var editing = $('.save-profile').is(':visible');
        $('.profile__name').attr('contenteditable', editing ? false : true);
        if (editing) $('.save-profile').hide();
        else $('.save-profile').show();
    })
    $(document).on('click', '.save-profile', function () {
        var newNickname = $('.profile__name').text();
        var img = $('.profile__img').attr('src');
        if (fbProfile.ifValidNickname(newNickname)) {
            firebase.auth().currentUser.updateProfile({
                displayName: newNickname
                , photoURL: img
            })
            firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/public').update({
                avatar: img
                , nickname: newNickname
            })
            saveStatistic("playerNickname", newNickname);
            if (/^\.\.\/images\/ava\/\d+\.\w{3}$/.test(img)) img = img.split('/')[img.split('/').length - 1]
            saveStatistic("playerAvatar", img);
            $('.edit-profile').click();
            Lobibox.notify('success', {
                pauseDelayOnHover: false
                , continueDelayOnInactiveTab: false
                , width: $(window).width()
                , position: 'top center'
                , icon: false
                , title: Localization.getString('settings.notification.title')
                , size: 'mini'
                , showClass: 'fadeInDown'
                , hideClass: 'fadeOutUp'
                , msg: Localization.getString('settings.notification.saved')
            });
        }
        else {
            Lobibox.notify('error', {
                pauseDelayOnHover: false
                , continueDelayOnInactiveTab: false
                , width: $(window).width()
                , position: 'top center'
                , icon: false
                , title: Localization.getString('settings.notification.invalid_nick_title')
                , size: 'mini'
                , showClass: 'fadeInDown'
                , hideClass: 'fadeOutUp'
                , msg: Localization.getString('settings.notification.invalid_nick')
            });
        }
    })
    $(document).on('click', '.post__control__delete', function () {
        var key = $($(this).closest('li')[0]).data('key');
        LOG.log({
            action: 'Delete post from wall',
            post: {
                text: $(this).parents('li').find('.post__text').text()
            }
        })
        fbProfile.deletePost(uid, key);
    })
    $(document).on('click', '.rep', function () {
        var currRepRef = firebase.database().ref('users/' + uid + '/outside/rep');
        var val = 0;
        if ($(this).hasClass('rep-plus')) {
            val = 1;
        }
        else if ($(this).hasClass('rep-minus')) {
            val = -1
        }
        if ($('.rep.active').length != 0) {
            $('.rep.active').removeClass('active');
            currRepRef.child(firebase.auth().currentUser.uid).remove();
        }
        else {
            $(this).addClass('active');
            fbProfile.setRep(uid, firebase.auth().currentUser.uid, (val > 0 ? '+' : '-'));
        }
        fbProfile.repVal(uid, function (rep, userRep) {
            var $active = $('.active');
            $(".stats__rate__count").text(rep);
            if (parseInt(rep) < 0) $(".stats__rate__count").addClass('bad-rep');
        });
    })
    firebase.database().ref('users/' + uid + '/posts').on('child_added', function (data) {
        if ($("li[data-key='" + data.key + "']").length == 0) {
            addPostToWall(data.val(), data.key);
        }
    });
    firebase.database().ref('users/' + uid + '/posts').on('child_removed', function (data) {
        if ($("li[data-key='" + data.key + "']").length != 0) {
            $("li[data-key='" + data.key + "']").remove();
        }
    });
    $(document).on('click', '#send-new-post', function () {
        var text = $(".new-post__text").html();
        if (text == "") return false;
        var date = new Date();
        $(".new-post__text").empty();
        var uid = firebase.auth().currentUser.uid;
        sendPost(uid, uid, "" + date, text);
    })

    function addPostToWall(post, key) {
        if (post == '' || post == null || typeof post == 'undefined') return false;
        var date = new Date(post.date);
        post.text = fbProfile.XSSreplace(post.text);
        var currUid = ""
        if (fbProfile.ifAuth()) currUid = firebase.auth().currentUser.uid;
        var control = "<div class='post__control'><span class='post__control__delete'><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></span></div>";
        var HTMLpost = "<li class='user-posts__post animated flipInX' data-key=\"" + key + "\" id='" + key + "'>" + "<div class='post__header'>" + "<img src=\"" + avatarUrl(post.authorAvatar) + "\" class='post__header__img' data-uid='" + post.uidFrom + "'>" + "<div class='post__header__meta'>" + "<span class='post__meta__author' data-uid='" + post.uidFrom + "'>" + XSSreplace(post.author) + "</span>" + "<span class='post__meta__date'>" + moment(date).fromNow() + "</span>" + "</div>" + (currUid == post.uidFrom ? control : '') + "</div>" + "<div class='post__text'>" + post.text + "</div></li>";
        $(".posts__user-posts").prepend(HTMLpost);
    }

    function sendPost(uidFrom, uidTo, date, text) {
        var userPostsRef = firebase.database().ref('users/' + uidTo + '/posts');
        var author = Player.nickname;
        var authorAvatar = Player.avatar;
        //if (uidFrom != firebase.auth().currentUser.uid) {}
        userPostsRef.push({
            uidFrom: uidFrom
            , author: author
            , authorAvatar: authorAvatar
            , date: date
            , text: text
        });
        
        LOG.log({
            action: 'Send post to wall',
            post: {
                uidFrom: uidFrom,
                author: author,
                date: date,
                text: text
            }
        })
    }
    
    function showTrade(tradeID) {
        if (!$('.trade-window').is(':visible')) 
            $('.trade-window').show();
        
        $('.my-trades-list').hide();
        $(".my-trades .trade__weapons__summ").show();
        $('.my-trades__trades-with-user').hide();
        
        Trades.getTrade(tradeID, function(trade) {
            $('.other-user-profile-img').attr('src', avatarUrl(trade.other.public.avatar));
            $('.user-profile-img').attr('src', avatarUrl(Player.avatar));

            $('#my-trades__your-offer').empty();
            $('#my-trades__other-offer').empty();
            
            $("#make-trade").prop('disabled', true);
            $("#cancel-trade").data('tradeid', trade.tradeID);
            $("#make-trade").data('tradeid', trade.tradeID);
            $("#you-ready-to-trade").data('tradeid', trade.tradeID);
            
            if (trade.you.ready) $("#you-ready-to-trade").prop('checked', true);
            else $("#you-ready-to-trade").prop('checked', false);
            
            if (trade.other.ready) {
                $(".other-player-ready").text(Localization.getString('profile.exchange.status.ready'));
                $(".other-player-ready").addClass('ready');
            }
            else {
                $(".other-player-ready").text(Localization.getString('profile.exchange.status.not_ready'));
                $(".other-player-ready").removeClass('ready');
            }
            if (trade.you.ready && trade.other.ready) {
                $('#make-trade').prop('disabled', false);
            }
            if (trade.isCanceled || trade.isDone) {
                $("#cancel-trade").hide();
                $("#make-trade").hide();
                $("#change-weapons-trade").hide();
            }
            else {
                $("#cancel-trade").show();
                $("#make-trade").show();
                $("#change-weapons-trade").show();
            }
            if (!trade.you.watched) {
                firebase.database().ref('trades/' + trade.tradeID + '/tradeInfo/' + firebase.auth().currentUser.uid + '/accepted').set(false);
            }
            $('<ul class="trade__info__weapons inv-no-select summ-inventory your"></ul>').appendTo('#my-trades__your-offer');
            $('<ul class="trade__info__weapons inv-no-select summ-inventory to-you"></ul>').appendTo('#my-trades__other-offer');

            var tradeInfoRef = firebase.database().ref('trades/' + trade.tradeID + '/tradeInfo/' + trade.other.uid);

            if (trade.you.itemsCount > 0) {
                for (var i = 0; i < trade.you.itemsCount; i++) {
                    var weapon = trade.you.items[i];
                    if (typeof weapon == 'undefined') continue;
                    if (typeof weapon == 'string') weapon = JSON.parse(weapon);
                    weapon = new Weapon(weapon);
                    var weaponJSON = JSON.stringify(weapon.tradeObject()).replace(/'/g, "\\'");
                    $('#my-trades__your-offer').find(".trade__info__weapons.your").append($(weapon.toLi({price: true, nameTag: true, nameTagIcon: true})).data('weapon_obj', weaponJSON));
                }
            }
            tradeInfoRef.on('child_changed', changed);
            tradeInfoRef.on('child_added', changed);

            function changed(data) {
                console.log('changed');
                if (data.key == 'accepted') {
                    console.log('Other player Ready!');
                    //Если другой пользователь нажал на галочку "Готов трейдиться"
                    Trades.currentTrade.other.ready = data.val();
                    if (Trades.currentTrade.other.ready) {
                        $(".other-player-ready").text(Localization.getString('profile.exchange.status.ready'));
                        $(".other-player-ready").addClass('ready');
                    }
                    else {
                        $(".other-player-ready").text(Localization.getString('profile.exchange.status.not_ready'));
                        $(".other-player-ready").removeClass('ready');
                    }
                    if (Trades.currentTrade.you.ready && Trades.currentTrade.other.ready) {
                        $('#make-trade').prop('disabled', false);
                    }
                    else {
                        $('#make-trade').prop('disabled', true);
                    }
                }
                else if (data.key == 'weapons') {
                    //Если другой пользователь именил своё предложение
                    // TODO: переделать это. Возможно не надо получать еще раз
                    
                    firebase.database().ref('trades/' + Trades.currentTrade.tradeID + '/' + Trades.currentTrade.other.uid).once('value').then(function (data) {
                        var Trade_weapons = data.val();
                        if (Trade_weapons == null) Trade_weapons = [];
                        $('#my-trades__other-offer').find(".trade__info__weapons.to-you").empty();
                        for (var i = 0; i < Trade_weapons.length; i++) {
                            var weapon = Trade_weapons[i];
                            if (typeof weapon == 'undefined') continue;
                            weapon = new Weapon(weapon);
                            $('#my-trades__other-offer').find(".trade__info__weapons.to-you").append( weapon.toLi({price: true, nameTag: true, nameTagIcon: true}));
                        }
                        $('#my-trades__other-offer').effect('highlight');
                        $('li[data-tradeid="' + fbProfile.currentTrade.id + '"] .trade__other .give-to-you').text(Trade_weapons.length);
                    });
                }
                else if (data.key == 'getWeapons') {
                    fbProfile.tradeInfoShort(Trades.currentTrade.tradeID, function (tradeInfo) {
                        if (typeof tradeInfo.player.getWeapons != 'undefined') return;
                        fbProfile.getTradeWeapons(tradeInfo.tradeID, tradeInfo.status == 'done' ? tradeInfo.otherPlayer.id : tradeInfo.player.id)
                        $('.trade-back').click();
                        $('li[data-tradeid="' + tradeInfo.tradeID + '"]').addClass(tradeInfo.status);
                    })
                }
            };
        })
    }
    
    function banLength(from, to) {
        var total = parseInt(from) + parseInt(to);
        return new Date(total).toLocaleString()
    }
})