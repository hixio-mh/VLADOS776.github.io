/*var itemsAccepted = 0;
var totalMoney = 0.00;
var timerId;
var botMinDec = 5000,
    botMaxDec = 10000;
var maxItems = 15;
var itemsLimit = 50;
var usedName = [];
var usedImages = [];
var PlayersInGame = [];
var ItemsInGame = [];
var ifCarusel = false;
var lastTicket = 0,
    winnerTicket = 0;
var PlayerInGame = false;
var priceRange = {
    min: parseFloat($('#diffuculty option:selected').data('min')),
    max: parseFloat($('#diffuculty option:selected').data('max'))
};*/
var maxItems = 0;
var ticketsRegExp = /(\d)(?=(\d\d\d)+([^\d]|$))/g;

var Jackpot = {
    roomID: -1,
    bar: null,
    winNumber: 35,
    roomsPreview: null,
    countdownTimer: null,
    newGameTimer: null,
    socket: io('https://kvmde40-10035.fornex.org/', {path: '/jackpot/socket.io'}),
    room: {
        players: {},
        gameStart: false,
        history: [],
        gameStartIn: 0,
        limits: {
            min: 0.1,
            max: 5,
            items: 50,
            perPlayer: 15
        },
        winner: {},
        playerBet: 0,
        totalItems: 0,
        totalPrice: 0
    },
    reconnectDelay: 5000,
    init: function() {
        $(function() {
            var param = parseURLParams(window.location.href);
            if(typeof param != "undefined") {
                if (param.room) {
                    Jackpot.socket.emit('enterRoom', parseInt(param.room[0]));
                }
            }
            
            $(window).on('popstate', function(e) {
                var state = e.originalEvent.state;
                if (state === null) {
                    Jackpot.showRooms();
                    Jackpot.socket.emit('leaveRoom', {room: 'all'})
                    Jackpot.roomID = -1;
                    clearInterval(Jackpot.countdownTimer);
                    Jackpot.countdownTimer = null;
                } else if (typeof state.room != 'undefined') {
                    Jackpot.socket.emit('enterRoom', parseInt(param.room[0]));
                }
            })
            
            Jackpot.socket.on('stats', function(stats) {
                Jackpot.roomsPreview = stats;
                Jackpot.roomID = -1;
                Jackpot.updateStats();
            })
            
            Jackpot.socket.on('connect', function(event) {
                console.log('Успешно подключились к серверу');
                $('.connection_status').hide();
            })
            
            Jackpot.socket.on('reconnect', function(event) {
                console.log('Переподключились к серверу');
                Jackpot.showRooms();
                Jackpot.roomID = -1;
                clearInterval(Jackpot.countdownTimer);
                Jackpot.countdownTimer = null;
                $('.connection_status').hide();
            })
            
            Jackpot.socket.on('reconnecting', function(number) {
                console.log('Соедениние потеряно, переподключаемся... Попытка #'+number);
                $('.connection_status').html('Trying to connect to the server... #'+number);
                $('.connection_status').show();
            })
            
            Jackpot.socket.on('roomInfo', function(info) {
                Jackpot.room.players = info.players;
                Jackpot.room.bets = info.bets;
                Jackpot.room.history = info.history;
                Jackpot.room.gameStart = info.gameStart;
                Jackpot.room.gameStartIn = info.gameStartIn;
                Jackpot.room.limits = info.limits;
                Jackpot.room.playerBet = info.playerBet || 0;
                if (info.winner)
                    Jackpot.room.winner = info.winner;
                
                
                maxItems = info.limits.perPlayer - info.playerBet;
                
                Jackpot.selectRoom(info.roomid);
                if (info.winner)
                    Jackpot.startGame();
            })
            
            Jackpot.socket.on('bet', function(bet) {
                if (bet.room == Jackpot.roomID)
                    Jackpot.newBet(bet);
            })
            
            Jackpot.socket.on('items back', function(items) {
                for (var i = 0; i < items.length; i++) {
                    items[i] = new Item(items[i]);
                }
                saveWeapons(items);
            })
            
            Jackpot.socket.on('chances', function(chances) {
                Jackpot.updateChances(chances);
            })
            
            Jackpot.socket.on('countdown_start', function(timer) {
                $('#countdown-timer').show();
                $('#caruselLine').hide();
                Jackpot.countdown(timer);
            })
            
            Jackpot.socket.on('winner', function(winner) {
                Jackpot.room.winner = winner;
                Jackpot.startGame();
            })
            
            Jackpot.socket.on('you_win', function(win) {
                var weapons = win.weapons;
                for (var i = 0; i < weapons.length; i++) {
                    weapons[i] = new Weapon(weapons[i]);
                    weapons[i].new = true;
                }
                saveWeapons(weapons);
                Level.addEXP(2);
            })
            
            Jackpot.socket.on('new_game', function(timer) {
                $('.items').empty();
                $('#players').empty();
                $(".casesCarusel").empty();
                $(".win").slideUp("slow");
                $("#addItems").prop("disabled", false);
                $('#backItems').hide();                
                
                Jackpot.room.gameStart = false;
                Jackpot.bar.animate(0);
                Jackpot.bar.setText("0/" + Jackpot.room.limits.items + "<hr><s class='currency dollar'>0</s>");
                Jackpot.room.totalItems = 0;
                Jackpot.room.totalPrice = 0;
                Jackpot.room.playerBet = 0;
                maxItems = Jackpot.room.limits.perPlayer;
                Jackpot.room.gameStartIn = 0;
            })
            
            Jackpot.socket.on('chat', function(chat) {
                console.log(chat);
                if (chat.room == Jackpot.roomID) {
                    onlineGames.chatMessage(chat, {
                        selector: '.chat__messages#current',
                        increaseCounter: true
                    });
                }
                onlineGames.chatMessage(chat, {
                    selector: '.chat__messages#all',
                    increaseCounter: false
                });
            })
            
            $('#change_room').on('click', function() {
                Jackpot.showRooms();
            });
            
            $(document).on('click', '#backItems', function() {
                Jackpot.socket.emit('items back', Jackpot.roomID);
            });
            
            $(document).on('send_chat_msg', function(event, message) {
                Jackpot.socket.emit('chat', {
                    from: Player.nickname,
                    message: message,
                    room: Jackpot.roomID
                })
            })
            
            $(document).on('click', '.jackpot-room', function() {
                Jackpot.roomID = parseInt($(this).data('roomid'));
                history.pushState({room: Jackpot.roomID}, 'Jackpot online. Room #'+Jackpot.roomID, '?room='+Jackpot.roomID);
                Jackpot.socket.emit('enterRoom', Jackpot.roomID);
            })
            
            $(".choseItems").on("click", function() {
                var itemsCount = $(".inventoryItemSelected").length;
                var itemsCost = 0;
                if (itemsCount > 0) {
                    var ids = [];
                    $(".inventoryItemSelected").each(function() {
                        ids.push(parseInt($(this).data('id')));
                    })
                    getWeapons(ids).then(function(playerWeapons) {
                        var itemsCost = playerWeapons.reduce(function(summ, current) {
                            return summ + current.price;
                        }, 0);
                        
                        var betWeapons = [];
                        
                        for (var i = 0; i < playerWeapons.length; i++) {
                            betWeapons.push(playerWeapons[i].tradeObject());
                        }
                        
                        Jackpot.room.playerBet += betWeapons.length;
                        maxItems -= betWeapons.length;
                        if (maxItems < 0) maxItems = 0;
                        
                        Jackpot.socket.emit('bet', {
                            room: Jackpot.roomID,
                            nick: Player.nickname,
                            avatar: Player.avatar,
                            weapons: betWeapons
                        })
                        
                        for (var i = 0; i < ids.length; i++) {
                            deleteWeapon(ids[i]);
                        }
                        
                        $(".closeInventory").click();
                    })
                }
            })
        })
    },
    message: function(msg) {
        switch(msg.type) {
            case 'bet':
                Jackpot.room.bets.push(msg);
                if (msg.id == Jackpot.id)
                    Jackpot.room.player.isBet = true;
                Jackpot.newBet(msg);
                break;
            case 'confirmBet':
                Jackpot.room.player.confirmed = msg.answer;
                break;
                
        }
    },
    showRooms: function() {
        var roomsHTML = "";
        var defaultNames = ['Easy peasy $0.1 - $5', 'Easy $5 - $30', 'Normal $30 - $80', 'Hard $80 - $200', 'Legendary $200 - $∞'];
        for (var key in this.roomsPreview) {
            var room = this.roomsPreview[key];
            roomsHTML += "<li class='jackpot-room' data-roomid='"+key+"'> \
                            <span class='diff' data-loc='" + (room.diff+1) + "'>"+Localization.getString('jackpot.difficulty.' + (room.diff+1), defaultNames[room.diff])+"</span>\
                            <span class='online'>"+room.players+"</span> \
                            </li>"
        }
        $('.room-select-modal__rooms').html(roomsHTML);
        $('.room-select-modal').show();
    },
    updateStats: function() {
        if ($('.jackpot-room').length <= 0) {
            this.showRooms();
            return;
        }
        for (var key in this.roomsPreview) {
            $('.jackpot-room[data-roomid="'+key+'"] .online').text(this.roomsPreview[key].players);
        }
    },
    selectRoom: function(room) {
        $(document).trigger({
            type: 'openRoom',
            roomID: room
        });
        this.roomID = room;
        $('.room-select-modal').hide();
        this.setupRoom();
    },
    setupRoom: function() {
        try {
            $('#circle').empty();
            this.bar = new ProgressBar.Circle(circle, {
                strokeWidth: 6,
                easing: 'easeInOut',
                duration: 1000,
                color: '#b50606',
                trailColor: '#fff',
                trailWidth: 2,
                svgStyle: null,
                text: {
                    value: '0/' + this.room.limits.items,
                    alignToBottom: false
                }
            });

            this.bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
            this.bar.text.style.fontSize = '2rem';
        } catch (err) {
            //ERR
            console.log('err');
        }
        
        $(".casesCarusel").stop();
        
        $(".win").slideUp("slow");
        if (this.room.gameStart)
            $('#addItems').prop('disabled', true);
        else
            $('#addItems').prop('disabled', false);
        
        $('.items').empty();
        $('.scrollerContainer .casesCarusel').empty();
        
        this.room.totalItems = 0;
        this.room.totalPrice = 0;
        
        for (var i = 0; i < this.room.bets.length; i++) {
            this.newBet(this.room.bets[i]);
        }
        this.room.totalPrice = parseFloat(this.room.totalPrice.toFixed(2));
        
        this.bar.setText(this.room.totalItems + '/' + this.room.limits.items + '<hr><s class="currency dollar">' + this.room.totalPrice.toFixed(2) + '</s>');
        var step = this.room.totalItems * 100 / this.room.limits.items / 100;
        step = step > 1 ? 1 : step;
        this.bar.animate(step);
        
        if (this.room.gameStartIn != 0) {
            this.countdown(this.room.gameStartIn);
        }
        
        if (this.room.gameStartIn <= 0) {
            $('#countdown-timer').hide();
            $('#caruselLine').show();
        } else {
            $('#countdown-timer').show();
            $('#caruselLine').hide();
        }
    },
    newBet: function(bet) {
        Jackpot.room.totalPrice += bet.itemsCost;
        Jackpot.room.totalItems += bet.weapons.length;
        Jackpot.bar.setText(Jackpot.room.totalItems + '/' + Jackpot.room.limits.items + '<hr><s class="currency dollar">' + Jackpot.room.totalPrice.toFixed(2) + '</s>');
        
        var step = Jackpot.room.totalItems * 100 / Jackpot.room.limits.items / 100;
        step = step > 1 ? 1 : step;
        Jackpot.bar.animate(step);
        
        itemsList(bet);
    },
    updateChances: function(chances) {
        $('#players').empty();
        for (var key in chances) {
            var ava = chances[key].avatar;
            $('#players').append('<span class="playerAva"><img src="' + XSSreplace(avatarUrl(ava)) + '"><p>'+chances[key].chance+'%</p></span>');
        }
        
        if (Object.keys(chances).length == 1 && typeof chances[Jackpot.socket.id] != 'undefined') {
            $('#backItems').show();
        } else {
            $('#backItems').hide();
        }
    },
    countdown: function(timer) {
        console.log('Countdown timer', timer);
        $('#countdown-timer').text(parseInt(timer/1000));

        function countdown() {
            var currentVal = parseInt($('#countdown-timer').text());
            if (currentVal > 0) {
                $('#countdown-timer').text(--currentVal);
            } else {
                clearInterval(Jackpot.countdownTimer);
                Jackpot.countdownTimer = null;
                $('#addItems').prop('disabled', true);
            }
        }

        this.countdownTimer = setInterval(countdown, 1000);
    },
    startGame: function(winner) {
        $('#countdown-timer').hide();
        $('#caruselLine').show();
        
        $("#addItems").prop("disabled", true);
        this.room.gameStart = true;
        
        var avatars = [];
        $('#players .playerAva img').each(function() {
            avatars.push($(this).attr('src'));
        })
        
        if (avatars.length == 0) {
            this.room.gameStart = false;
            return;
        }
        
        while (avatars.length < this.winNumber + 3) {
            avatars = avatars.concat(avatars);
        }
        
        avatars.shuffle();
        
        if (avatars.length > this.winNumber + 3)
            avatars.splice(this.winNumber + 3, avatars.length - (this.winNumber + 3))
            
        avatars[this.winNumber] = XSSreplace(avatarUrl(Jackpot.room.winner.avatar));
        
        var el = '';
        avatars.forEach(function(item, index) {
            el += '<span class="playerAva">' +
                '<img src="' + item + '" />' +
                '</span>'
        })
        
        $(".casesCarusel").html(el);
        $(".casesCarusel").css("margin-left", "0px");
        var a = 141 * this.winNumber - 141;
        var l = 141;
        var d = 0,
            s = 0;
        $(".casesCarusel").animate({
            marginLeft: -1 * Math.rand(a - 70, a + 15)
        }, {
            duration: Jackpot.room.gameStartIn < 0 ? Jackpot.room.gameStartIn < -7000 ? 0 : 7000 + Jackpot.room.gameStartIn : 7000,
            easing: 'easeInOutCubic',
            start: function() {
                $(".closeInventory").click();

                $(".win").html("<img src='" + avatarUrl(XSSreplace(Jackpot.room.winner.avatar)) + "'><span class='win__title'>" + Localization.getString('jackpot.winner') + "</span><span class='win__nick'>" + XSSreplace(Jackpot.room.winner.nickname) + "</span><span class='win__chance'>" + Jackpot.room.winner.chance + "%</span><span class='win__ticket'><i class='fa fa-ticket'></i> " + ('' + parseInt(Jackpot.room.winner.ticket)).replace(ticketsRegExp, '$1&#8198;') + "</span>");
            },
            progress: function(e, t) {
                /*progress_animate = Math.round(100 * t),
                s = parseInt(parseInt($(".casesCarusel").css("marginLeft").replace(/[^0-9.]/g, "") - l / 2) / l),
                s > d && (caseScrollAudio.pause(),caseScrollAudio.currentTime = 0,
                caseScrollAudio.play(),
                d++)*/
            },
            complete: function() {
                $(".win").show();
                $($('.casesCarusel').children('.playerAva')[winNumber]).addClass('winnerAnimation');
            },
        })
    }
}

//DEBUG
var DEBUG = false;

$("#addItems").on("click", function() {
    Sound("additems", "play");
    $('.inventory').empty();
    fillInventory(".inventory", "", {
        limits: {
            min: Jackpot.room.limits.min,
            max: Jackpot.room.limits.max
        }
    });
});


function itemsList(newBet/*fromName, fromImg, tickets, itemsCost, weaponsList*/) {
    if (typeof newBet.weapons == 'undefined' || newBet.weapons.length == 0) return false;
    var bet = "<li class='game-bet animated zoomIn'><div class='game-bet__info'><div class='game-bet__player'><img src='" + XSSreplace(avatarUrl(newBet.avatar)) + "'>" + XSSreplace(newBet.nick) + "</div><div class='game-bet__tickets'><span class='game-bet__tickets__price'>$" + newBet.itemsCost.toFixed(2) + "</span><i class='fa fa-ticket'></i> " + ('' + parseInt(newBet.tickets.from)).replace(ticketsRegExp, '$1&#8198;') + " - " + ('' + parseInt(newBet.tickets.to)).replace(ticketsRegExp, '$1&#8198;') + "</div></div></div>" +
        "<div class='bet-items " + (newBet.weapons.length > 4 ? "hide-items" : "") + "'><div colspan=2>";
    for (var i = 0; i < newBet.weapons.length; i++) {
        var weapon = new Weapon(newBet.weapons[i]);
        var img = getImgUrl(weapon.img);

        var newItem = "<div class='bet-items__item'><img src='" + img + "'><div class='bet-items__item__rarity " + weapon.rarity + "'></div><span class='bet-items__item__price'>$" + weapon.price + "</span></div>";
        bet += newItem;
    }
    bet += "</div></div>";
    $(bet).hide().prependTo(".items").slideToggle();
    //$(".items").prepend(bet);
}

$(document).on('click', '.hide-items, .show-items', function() {
    $(this).toggleClass('hide-items show-items');
})
