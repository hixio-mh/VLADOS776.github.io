var GraffitiList = [];
$(function () {
    var MESSAGE_LIMIT = parseInt($("#chat__new-message").attr("max"));
    
    $(document).on('localizationloaded', function() {
        $('#chat__send-new-message').attr('value', Localization.getString('chat.send_message'))
    });
    
    $('[contenteditable]').on('focus', function(event) {
        var $this = $(this);
        $this.data('before', $this.html());
        return $this;
    }).on('blur keyup paste', function(event) {
        var $this = $(this);
        if ($this.data('before') !== $this.html()) {
            $this.data('before', $this.html());
        }
        $this.trigger('change', [event]);
        return $this;
    });
    
    var goToChat = false;
    
    //User location
    $.get("https://freegeoip.net/json/", function(response) {
        Player.country = response.country_code.toLowerCase();
    }, "jsonp");
    
    if (/chat-\w{2}$/.test(history.state)) {
        var goToChat = history.state.match(/chat-(\w{2})/)[1];
    } else {
        history.replaceState("chat-rooms", null, null);
    }
     
    $(document).on('click', '.message__info', function() {
        var nickname = $($(this).find('.message__from')[0]).text();
        var currentText = $('#chat__new-message').text();
        if (currentText.indexOf('@'+nickname) == -1 && currentText.length + nickname.length < MESSAGE_LIMIT)
            $('#chat__new-message').append('@'+nickname+', ');
    })
    
    $(document).on('click', '.message__moderator li a', function() {
        var msgKey = $(this).closest('.chat__message').data('msgkey');
        var msgAuthor = $(this).closest('.message__info').find('.message__from').text();
        var msgAuthorUid = $(this).closest('.message__info').prev().find('img[data-userid]').data('userid')
        var msgText = $(this).closest('.message__info').children('.message__text').text();
        
        var action = $(this).data('action');
        switch (action) {
            case 'chat-ban':
                Chat.chatBanModal(msgAuthorUid);
                break;
            case 'delete-message':
                Chat.deleteMsg(msgKey, msgText, msgAuthor);
                break;
            case 'fake-vip':
                Chat.extraClasses(msgKey, 'vip');
                break;
            case 'blur':
                Chat.extraClasses(msgKey, 'vip-blur');
                break;
        }
        if (isAndroid()) {
            client.sendToAnalytics('Chat', 'Extra Classes', action, 'From ' + Player.nickname + ' to ' + msgAuthor);
        }
        LOG.log({
            action: 'Extra Classes',
            msg: {
                type: action,
                to: msgAuthor,
                from: Player.nickname 
            }
        })
        
        function deleteMessage(msgKey, msgText, msgAuthor) {
            Lobibox.confirm({
                iconSource : 'fontAwesome',
                title : Localization.getString('chat.moderator.delete_msg.title'),
                msg : Localization.getString('chat.moderator.delete_msg.message'),
                callback : function ($this, type, ev) {
                    if (type == 'yes') {
                        Chat.deleteMsg(msgKey);
                        if (isAndroid()) {
                            client.sendToAnalytics('Chat', 'Модератор', "Модератор удалил сообщение.", msgText+' | '+Player.nickname);
                        }
                        LOG.log({
                            action: 'Moderator delete message',
                            msg: {
                                author: msgAuthor,
                                text: msgText
                            }
                        })
                    }
                }
            }); 
        }
    })
    
    $(document).on('click', '#login button', function () {
        $(".chat__messages").append('<li id="js-loading-inventory" data-from="1"><div class="cssload-container"><div class="cssload-speeding-wheel"></div></div></li>');
        setTimeout(function () {
            //fbChat.initChat('.chat__messages');
        }, 2000);
    });
    
    $(document).on('click', '#forgot-pass',function() {
        fbProfile.forgotPassword($("#email").val());
        if (isAndroid())
            client.sendToAnalytics('Profile', 'Forgot pass', "Pressed on 'Forgot password' button", "none");
    })
});

window.addEventListener('popstate', function(e) {
    var prev = e.state;
    if (prev == 'chat-rooms') {
        Chat.showRooms();
    } else if (prev && prev.room) {
        var room = prev.room;
        $("#login").hide();
        $("#chat").show();
        $(".chat__rooms-container").hide();
    }
}, false);

var Chat = (function(module) {
    var socket = io('http://192.168.1.205:8050/'),
    //var socket = io('https://kvmde40-10035.fornex.org/', {path: '/chatserver/socket.io'}),
        reconnected = false;
    
    var isModerator = false,
        isVip = false,
        GRAFFITI_KD = 15000,
        lastTypingEmit = null,
        typingTimeout = 5000,
        typingList = {};
    
    module.init = function() {
        socket.on('connect', function() {
            console.log('Connected to the server');
        })
        setTimeout(function() {
            socket.emit('getRooms');
        }, 500);
        socket.on('reconnect', function(event) {
            console.log('Переподключились к серверу');
            reconnected = true;
            module.showRooms();
            $('.connection_status').hide();
            setTimeout(function() {
                socket.emit('getRooms');
                sendToken();
            }, 500);
        })

        socket.on('reconnecting', function(number) {
            if (!reconnected) {
                console.log('Соедениние потеряно, переподключаемся... Попытка #'+number);
                $('.connection_status').html('Connection lost. Trying to reconnect #'+number);
                $('.connection_status').show();
                if (number == 1) {
                    module.showRooms();
                    $('.chat__rooms').empty();
                }
            } else {
                location.reload();
            }
        })
        socket.on('disconnect', function() {
            console.log('disconnect');
        })
        
        socket.on('online', function(count) {
            $('#online').text(count);
        })
        
        socket.on('Need token', function() { sendToken() });
        socket.on('ban', function(ban) {
            var tmp = _t('other.chatban', 'You cant\'t write. You have ban.<br><b>Reason</b>: ${1}.<br><b>End of ban</b>: ${2}');
            var endDate = new Date(ban.from + ban.to).toLocaleString((Settings.language == 'RU') ? 'ru' : 'en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            });;
            var text = tmp.replace('${1}', ban.reason).replace('${2}', endDate);
            var message = {
                uid: '#',
                img: Player.avatar,
                username: 'System',
                timestamp: ban.from,
                text: text,
                attachments: '',
                type: 'msg',
                group: 'system',
                flag: '',
                extraClasses: '',
                key: '0',
                isModer: false,
                isVip: false
            }
            
            newMsg('0', message);
        })
        
        socket.on('roomsList', function(rooms) {
            var roomsHTML = '';
            for (var i = 0; i < rooms.length; i++) {
                roomsHTML += "<div class='chat__rooms__room" + (Settings.language == rooms[i].code ? ' playerLang' : '') + "' data-room=\"" + rooms[i].code + "\">";
                roomsHTML += "<img src=\"../images/flags/" + rooms[i].flag + "\"><span>" + rooms[i].name + "</span></div>";
            }
            $('.chat__rooms').html(roomsHTML);
            if (getURLParameter('room') !== null) {
                $('.chat__rooms__room[data-room="'+getURLParameter('room')+'"]').click();
            }
        })
        socket.on('roomHistory', function(history) {
            $('.chat__messages').empty();
            history.forEach(function(msg, i) {
                if (msg.type === 'msg')
                    newMsg(msg.id, msg);
                else if (msg.type === 'graffiti')
                    newGraffiti(msg.id, msg);
            })
            
            $("#container").animate({
                scrollTop: $('#chat').height()
            }, 500);
        })
        
        socket.on('typing', function(nick) {
            typingList[nick] = Date.now();
        })
        socket.on('message', function(message) {
            if (message.type === 'msg')
                newMsg(message.id, message);
            else if (message.type === 'graffiti')
                newGraffiti(message.id, message);
            
            if ($('#container').scrollTop() + $('#container').height() > $('#chat').height() - 250)
                $("#container").animate({
                    scrollTop: $('#chat').height()
                }, 200);
            
            if (typingList[message.username]) delete typingList[message.username];
        })
        socket.on('deleteMessage', function(key) {
            try {
                $("li[data-msgkey='" + key + "']").removeClass('bounceIn');
                $("li[data-msgkey='" + key + "']").addClass('zoomOut');
                setTimeout(function () {
                    $('.zoomOut').remove();
                }, 1000);
            }
            catch (e) {}
        })
        socket.on('extraClass', function(extra) {
            if (extra.key != null) {
                $("li[data-msgkey='" + extra.key + "']").toggleClass(extra.class)
            }
        })
        
        firebase.auth().onAuthStateChanged(function (user) {
            // Once authenticated, instantiate Firechat with the logged in user
            if (user != null) {
                $("#login").hide();
                $("#chat").hide();
                $(".chat__rooms-container").show();
                fbProfile.isModerator(null, function(moder) {
                    isModerator = moder;
                })
                fbProfile.isVip(null, function(vip) {
                    isVip = vip;
                    $(document).trigger('player_vip');
                })
                
                sendToken(true);
            } else {
                $("#chat").hide();
                $(".chat__rooms-container").hide();
                $("#login").show();
            }
        })
        
        $(document).on('click', '.chat__rooms__room', function () {
            Chat.joinRoom($(this).data('room'))
            $("#login").hide();
            $("#chat").show();
            $(".chat__rooms-container").hide();
            
            LOG.log({
                page: 'Chat',
                action: 'Join room',
                room: $(this).data('room')
            })
            history.pushState({room: $(this).data('room')}, "Chat Room", 'chatNew.html?room='+$(this).data('room'));
        })
        $(document).on('click', '#chat__send-new-message', module.sendMsg);
        
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
                    from: firebase.database.ServerValue.TIMESTAMP,
                    uid: $('#moder-ban-modal').data('uid')
                }
                
                Chat.chatBan(banObj);

                LOG.warn({
                    action: 'Moderator blocked chat from chat',
                    ban: {
                        reason: banObj.reason,
                        user: {
                            uid: banObj.uid,
                        },
                        time: banObj.to
                    }
                })
            }
            $('#moder-ban-modal').modal('hide');
        })
        $('#moder-ban-other_checkbox').change(function() {
            if ($('#moder-ban-other_checkbox').is(':checked') == true) {
                $('#moder-ban-other_input').prop('disabled', false);
            } else {
                $('#moder-ban-other_input').prop('disabled', true);
                $('#moder-ban-other_input').val('');
            }
        })
        
        $("#chat__new-message").on('change', function (event, myEvent) {
            event = myEvent ? myEvent : event;
            if (event.shiftKey && event.keyCode == 13) {
                $('#chat__new-message').append('\n');
            } else if (event.keyCode == 13) {
                $("#chat__send-new-message").click();
                event.preventDefault();
            }
            
            if ($(this).text().length > 0 && lastTypingEmit + typingTimeout < Date.now()) {
                lastTypingEmit = Date.now();
                socket.emit('typing', Player.nickname);
            }
        });
        
        var graffitiPopover = $('.graffiti-attach[data-toggle="popover"]').popover({
            placement: 'top',
            html: 'true',
            title: 'Graffiti',
            content: '<div id="graffitiList"><div class="m-progress" style="padding:20px"></div></div>'
        })
        .on('show.bs.popover', function() {
            var lastUse = parseInt(getStatistic('chat-graffiti-use-time', '0'))
            if (lastUse + GRAFFITI_KD > Date.now()) {
                graffitiPopover.attr('data-content', '<div id="graffiti-kd"></div>');
                countDownGraffiti();
                GraffitiList = [];
            } else {
                if (GraffitiList.length === 0) {
                    //$('#graffitiList').html();
                    getInventory().then(function(inv) {
                        GraffitiList = inv.weapons.filter(function(item) { return item.itemType === 'graffiti' });
                        if (GraffitiList.length == 0) {
                            $('#graffitiList').html('<i class="fa fa-times" style="font-size:20px; padding:10px"></i>');
                            return false;
                        }
                        var content = '';
                        GraffitiList.forEach(function(item) {
                            content += item.toLi();
                        })

                        graffitiPopover.attr('data-content', content);
                        graffitiPopover.popover('hide');
                        setTimeout(function() { graffitiPopover.popover('show') }, 200);
                    })
                }
            }
        });
        function countDownGraffiti() {
            var time = parseInt(parseInt(getStatistic('chat-graffiti-use-time', '0'))) + GRAFFITI_KD;
            var t = time - Date.now()
            if (t > 0) {
                var s = (t/1000).toFixed(0);
                $('#graffiti-kd').text(s);
                graffitiPopover.attr('data-content', '<div id="graffiti-kd">'+s+'</div>');
            }

            if (t > 1000) {
                setTimeout(function() { countDownGraffiti() }, 1000);
            } else {
                setTimeout(function() {
                    graffitiPopover.popover('hide');
                    setTimeout(function() { graffitiPopover.popover('show') }, 200);
                }, 1000);
            }
        }
        $(document).on('click', '.weapon.graffiti', function() {
            var lastUse = parseInt(getStatistic('chat-graffiti-use-time', '0'))
            if (lastUse + GRAFFITI_KD > Date.now()) {
                return false;
            }
            var graffitiID = $(this).data('id');
            var that = this;
            getItem(graffitiID).then(function(graffiti) {
                socket.emit('graffiti', {
                    item_id: graffiti.item_id,
                    colorNum: graffiti.colorNum,
                    img: Player.avatar,
                    username: Player.nickname,
                    country: Player.country
                })

                saveStatistic('chat-graffiti-use-time', Date.now());

                var content = '';
                GraffitiList.forEach(function(item) {
                    if (item.id === graffitiID) {
                        item.limit--;
                    }
                    content += item.toLi();
                })
                graffitiPopover.attr('data-content', content);

                if (graffiti.spray() == 0) {
                    GraffitiList = [];
                }
                
                customEvent({ type: 'chat', event: 'graffiti' })
            })
            graffitiPopover.popover('hide');
        })
        
        setInterval(function() {updateTyping()}, 1000);
        
        function sendToken(refresh) {
            refresh = refresh || false;
            var user = firebase.auth().currentUser;
            
            if (!user) return false;
            
            user.getToken(refresh).then(function(idToken) {
                socket.emit('firebaseToken', idToken);
            })
        }
        function updateTyping() {
            var typing = [];
            for (var nick in typingList) {
                if (typingList[nick] + typingTimeout < Date.now()) {
                    delete typingList[nick];
                } else {
                    typing.push(nick);
                }
            }
            
            if (typing.length > 0) {
                $('#typing').show();
                $('#typing').text(typing.join(', ') + ' typing...');
            } else {
                $('#typing').hide();
            }
        }
    }
    module.showRooms = function() {
        $("#login").hide();
        $("#chat").hide();
        $(".chat__rooms-container").show();
        socket.emit('leaveRoom');
    }
    module.joinRoom = function(roomID) {
        socket.emit('joinRoom', roomID);
    };
    
    module.sendMsg = function() {
        var msg = $('#chat__new-message').html();
        if (msg.length == 0 && $('#preview_img').attr('src') === '#') return false;
        
        var message = {
            uid: firebase.auth().currentUser.uid,
            img: Player.avatar,
            username: Player.nickname,
            text: msg,
            country: Player.country
        }
        
        // Attachments
        if ($('#preview_img').attr('src') !== '#') {
            if ($('.attach-preview-wrap').hasClass('m-progress')) {
                return false;
            }
            message.attach = {};

            message.attach.url = $('#preview_img').data('url');
            message.attach.thumb = $('#preview_img').data('thumb');

            $('#attach-remove').click();

        }
        socket.emit('message', message);
        $('#chat__new-message').empty();
        
        customEvent({ type: 'chat', event: 'message' })
    }
    module.deleteMsg = function(key, msgText, msgAuthor) {
        if (isModerator || isVip) {
            socket.emit('deleteMessage', key);
            LOG.log({
                action: 'Moderator delete message',
                msg: {
                    author: msgAuthor,
                    text: msgText
                }
            })
            
        }
    }
    module.extraClasses = function(key, clas) {
        if (key == null || clas == null) return false;
        socket.emit('extraClass', {
            key: key,
            class: clas
        })
    }
    module.chatBanModal = function(uid) {
        $('#moder-ban-modal').modal();
        $('#moder-ban-modal').data('uid', uid);
    }
    module.chatBan = function(banObj) {
        socket.emit('chatBan', banObj);
    }
    
    function newMsg(key, message, edit) {
        var uid = message.uid,
            img = avatarUrl(message.img),
            username = message.username,
            time = message.timestamp,
            text = message.text || "",
            group = message.group || "",
            country = message.country || "",
            extraClasses = message.extra || [],
            attach = message.attach || {},
            vip = message.vip || {},
            type = message.type || 'msg';
        edit = edit || false;

        if (!/^\.\.\/images\/ava\/.{1,5}\.\w{3}$/i.test(img) && !/(admin|vip|donor)/i.test(group)) {
            img = '../images/ava/0.jpg';
        }

        var imgRegExp = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/igm,
            youtubeRegExp = /(?:https?\:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.?be)\/(?:watch\?v=|embed\/)?([a-zA-Z0-9?=-]+)/igm;
        //vkRegExp = /(https?:\/\/vk\.com\/(.*))?/ig;

        var flag = "";
        if (country)
            flag = country.toLowerCase();
        var time = new Date(time);
        time = time.toLocaleString((Settings.language == 'RU') ? 'ru' : 'en-US', {
            hour: 'numeric',
            minute: 'numeric'
        });

        var myMessage = false;
        if (uid == firebase.auth().currentUser.uid) {
            myMessage = true;
        }

        text = text.replace(imgRegExp, '<img src="$1" class="message-img">');

        if (/vip/.test(group)) {
            text = text.replace(youtubeRegExp, '<iframe width="100%" height="auto" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>');
            extraClasses.push('vip');
        }

        username = XSSreplace(username);
        var toMe = text.indexOf('@' + Player.nickname) != -1 ? true : false;
        text = text.replace(/@(.*?)[, ]/gi, '<b class="player-nickname">@$1</b>, ');
        
        if (toMe) extraClasses.push('msgToMe');
        if (myMessage) extraClasses.push('my_message');

        var attachments = '';
        if (attach.url) {
            attachments = attach.url;
        }
        
        if (message.type === 'graffiti') {
            if (!edit) {
                Sound('spray.shake');
                setTimeout(function () {
                    Sound('spray.spray');
                }, 1000);
            }
            
            extraClasses.push('message__graffiti');
        }
        var msg = $('#msgTemplate').tmpl({
            uid: uid,
            img: img,
            username: username,
            time: time,
            text: text,
            attachments: attachments,
            myMessage: myMessage,
            type: type,
            group: group,
            flag: flag,
            extraClasses: extraClasses.join(' '),
            key: key,
            isModer: isModerator,
            isVip: isVip
        })

        if (edit) {
            $("li[data-msgkey='" + key + "']").replaceWith($(msg));
        } else {
            $(".chat__messages").append(msg);
        }

        if (group.match(/vip|donor/) || extraClasses.indexOf('vip') !== -1) {
            if (vip.nicknameColor) {
                $("li[data-msgkey='" + key + "'] .message__from").gradientText({
                    colors: vip.nicknameColor.split(',')
                });
            } else {
                $("li[data-msgkey='" + key + "'] .message__from").gradientText({
                    colors: ['#df56ff', '#ff5656']
                });
            }
        }

        var now = new Date();
        if (now.getDate() == 1 && now.getMonth() == 3) {
            if (uid === firebase.auth().currentUser.uid && (!group.match(/vip/) || extraClasses.indexOf('vip') == -1)) {
                $("li[data-msgkey='" + key + "']").addClass('vip');

                var colorsLength = Math.rand(1, 4);
                var colors = [];

                for (var i = 0; i < colorsLength; i++) {
                    colors.push(getRandomColor());
                }

                $("li[data-msgkey='" + key + "'] .message__from").gradientText({
                    colors: colors
                });
            }
        }

        function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        }
    function newGraffiti(key, graffiti) {
        graffiti.type = 'graffiti';
        graffiti.attach = {};
        graffiti.attach.url = new Graffiti(graffiti.item_id, graffiti.colorNum).getImgUrl();
        newMsg(key, graffiti);
    }
    return module;
})(Chat || {});