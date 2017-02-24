
var numbers = [1, 14, 2, 13, 3, 12, 4, 0, 11, 5, 10, 6, 9, 7, 8];
var colors = ['r', 'b', 'r', 'b', 'r', 'b', 'r', 'g', 'b', 'r', 'b', 'r', 'b', 'r', 'b'];
var betLimit = 10000000;
var intervalCountdown,
    //winNumber = 40,
    lastGameCount = 10,
    winNum,
    countdownTime = 25000,
    countdownTimer = countdownTime,
    gameStart = false,
    nextRollIn = 0,
    playerBet = [];
var maxItems = 30;
var waitForRolling = false,
    reconnectTimer = 0,
    reconnectDelay = 5000;

var PING_PONG_INTERVAL = 50000,
    socket = null;

$(function() {
    
    function connectToServer() {
        socket = null;
        //socket = new WebSocket("ws://localhost:8010/");
        
        socket = new WebSocket("wss://kvmde40-10035.fornex.org/double");

        var PING = {type:'ping'};

        socket.onmessage = function(event) {
            var message = JSON.parse(event.data);
            switch (message.type) {
                case "first-connect":
                    firstConnect(message);
                    setTimeout(function pingpong() {
                        if (!reconnectTimer) socket.send(JSON.stringify(PING));
                        setTimeout(pingpong, PING_PONG_INTERVAL);
                    }, PING_PONG_INTERVAL);
                    break;
                case "pong":
                    break;
                case 'win-number':
                    startGame(message.number);
                    break;
                case 'new-game':
                    if (waitForRolling) {
                        waitForRolling = false;
                        //fillCarusel(message.lastNumer);
                        newGame();
                    }
                    break;
                case 'bet':
                    addBet(message.color, message);
                    break;
                case 'online':
                    onlineGames.onlineCount(message.online);
                    break;
                case 'message':
                    onlineGames.chatMessage(message);
                    break;
            }
        }
        
        socket.onopen = function(event) {
            if(reconnectTimer) {
                clearInterval(reconnectTimer);
                reconnectTimer = 0;
            }
        }

        socket.onclose = function(event) {
            console.log("Connection lost...");
            if (!reconnectTimer) {
                reconnectTimer = setInterval(function(){checkConnection()}, reconnectDelay);
            }
            
            clearTimeout(intervalCountdown);
            $('.bet-to-color').prop('disabled', true);
            $('.big-progress span').html(Localization.getString('double.connection_lost'));
            $('.the-bet').fadeOut(300, function() {$(this).remove();});
            
            if (playerBet.length) {
                for (var i = 0; i < playerBet.length; i++)
                    Player.doubleBalance += playerBet[i].bet;

                Player.doubleBalance = parseInt(Player.doubleBalance.toFixed(0));

                $('#menu_doubleBalance').text(Player.doubleBalance);
                $('#balance').text(Player.doubleBalance);
                saveStatistic('doubleBalance', Player.doubleBalance, 'Number');

                playerBet = [];
                
                $('#balance').addClass('animated flash');
                setTimeout(function() {
                    $('#balance').removeClass('animated flash')
                }, 1000);
            }
        }
    }
    
    
    function checkConnection() {
        if(!socket || socket.readyState == 3) connectToServer();
    }

    $('#bet').val('0');
    $('#balance').text(Player.doubleBalance.toFixed(0));
    $('#menu_doubleBalance').text(Player.doubleBalance.toFixed(0));

    $("#bet").keydown(function(e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
    
    $(".chat__new-message__textbox").on('keydown paste', function (event) {
        if (event.keyCode == 13) {
            $("#chat-send-msg").click();
            event.preventDefault();
        }
        if (this.innerHTML.length >= this.getAttribute("max") && event.keyCode != 8) {
            event.preventDefault();
        }
    });
    
    $(document).on('click', '.bet-to-color', function() {
        var betStr = $('#bet').val();
        betStr = betStr == "" ? "0" : betStr;
        var bet = parseInt(betStr.match(/(\d+)/g).toString().replace(/\,/g, ''));
        if (gameStart) return false;
        if (bet <= 0) return false;
        if (Player.doubleBalance <= 0 || bet > Player.doubleBalance) {
            $('#balance').addClass('animated flash');
            setTimeout(function() {
                $('#balance').removeClass('animated flash')
            }, 1000);
            return false;
        }
        $(this).prop('disabled', true);
        color = ($(this).hasClass('bet-red')) ? 'red' : ($(this).hasClass('bet-black')) ? 'black' : 'green';
        pl = {
            type: 'bet',
            name: Player.nickname,
            img: Player.avatar,
            bet: bet,
            color: color
        };
        
        if (socket && socket.readyState == 1)
            socket.send(JSON.stringify(pl));
        
        playerBet.push({
            color: color,
            bet: bet
        });

        Player.doubleBalance -= bet;
        Player.doubleBalance = parseInt(Player.doubleBalance.toFixed(0));
        $('#balance').text(Player.doubleBalance);
        $('#menu_doubleBalance').text(Player.doubleBalance);
        saveStatistic('doubleBalance', Player.doubleBalance, 'Number');

        //addBet(color, pl);
    });
    
    
    
    connectToServer();
});

function firstConnect(message) {
    var lastGamesNumbers = message.lastGames;
    var lastGames = [];
    for (var i = 0; i < lastGamesNumbers.length; i++) {
        color = getNumberColor(lastGamesNumbers[i]);
        lastGames.push({
            number: lastGamesNumbers[i],
            color: color
        });
    }
    var lastGamesHTML = "";
    for (var i = 0; i < lastGames.length; i++)
        lastGamesHTML += "<div class='" + lastGames[i].color + "-ball inline ball'>" + lastGames[i].number + "</div>";
    $(".last-games").html(lastGamesHTML);

    gameStart = false;
    $('.bet-to-color').prop('disabled', false);

    playerBet = [];

    fillCarusel(parseInt($(".ball:first-child").text()));

    countdownTimer = message.rollTime; 
    nextRollIn = Date.now() + message.rollTime;
    $('.the-bet').fadeOut(300, function() {
        $(this).remove();
    });
    for (var i = 0; i < message.bets.length; i++) {
        addBet(message.bets[i].color, message.bets[i]);
    }
    if (message.rolling) {
        waitForRolling = true;
        $('.bet-to-color').prop('disabled', true);
        gameStart = true;
        $('.ball')[0].remove();
        fillCarusel(parseInt($(".ball:first-child").text()));
        $('.big-progress span').text(Localization.getString('double.rolling_in', 'Rolling in'));
        startGame(message.lastGames[i], message.rollTime-800);
    } else{
        countDown();
    }
}

function newGame() {
    gameStart = false;
    $('.bet-to-color').prop('disabled', false);

    playerBet = [];

    fillCarusel(parseInt($(".ball:first-child").text()));

    //botMaxBet = Player.doubleBalance + 1000 > betLimit ? betLimit : Player.doubleBalance + 1000;

    nextRollIn = Date.now() + countdownTime;
    $('.the-bet').fadeOut(300, function() {
        $(this).remove();
    });

    /*timerBots = setTimeout(function() {
        botAddBet()
    }, Math.rand(botMinDec, botMaxDec));*/
    countDown();
}

function countDown() {
    clearTimeout(intervalCountdown);
    countdownTimer = nextRollIn - Date.now();
    //countdownTimer -= 100;
    val = (countdownTimer * 100) / countdownTime;
    $('#progress-countdown').css('width', val + '%');
    if (Localization.isLoaded)
        $('.double-progress span').text(Localization.getString('double.rolling_in') + ' ' + (countdownTimer / 1000).toFixed(1) + '...');

    if (val > 0)
        intervalCountdown = setTimeout(countDown, 100);
}

function startGame(win, duration) {
    duration = duration || 9000;
    gameStart = true;
    //winNum = Math.rand(winNumber - 3, winNumber + 5);
    winNum = numToOffset(win);

    var a = 96 * winNum - 144;
    var l = 96;
    var d = 0,
        s = 0;
    $(".casesCarusel").animate({
            marginLeft: -1 * Math.rand(a - 40, a + 40)
        }, {
            duration: duration,
            easing: 'easeInOutCubic',
            start: function() {
                $('.bet-to-color').prop('disabled', true);
                clearTimeout(intervalCountdown);
                $('.double-progress span').text(Localization.getString('double.rolling', 'Rolling'));
            },
            complete: function() {
                if (playerBet.length) {
                    for (var i = 0; i < playerBet.length; i++)
                        if (playerBet[i].color == getNumberColor(win)) {
                            switch (playerBet[i].color) {
                                case 'red':
                                case 'black':
                                    Player.doubleBalance += playerBet[i].bet * 2;
                                    break
                                case 'green':
                                    Player.doubleBalance += playerBet[i].bet * 14;
                                    break
                            }
                            Player.doubleBalance = parseInt(Player.doubleBalance.toFixed(0));
                            $('#balance').text(Player.doubleBalance);
                            $('#menu_doubleBalance').text(Player.doubleBalance);
                            statisticPlusOne('double-wins');
                            Level.addEXP(2);
                        } else {
                            statisticPlusOne('double-loose');
                        }

                    saveStatistic('doubleBalance', Player.doubleBalance, 'Number');
                }
                $('.last-games').prepend("<div class='" + getNumberColor(win) + "-ball inline ball'>" + win + "</div>");
                if ($('.ball').length > lastGameCount)
                    $($('.ball')[$('.ball').length - 1]).remove();
            },
        })
        .animate({
            marginLeft: -1 * Math.rand(a, a)
        }, {
            duration: 800,
            easing: 'easeInOutCubic',
            complete: function() {
                newGame();
            },
        });

}

function getWinnerNumber(winNum) {
    return parseInt($($('.casesCarusel div')[winNum]).text());
}

function numToOffset(num) {
    var inArr = $.inArray(num, numbers);
    var lineOnNum = $.inArray(parseInt($($('.block')[2]).text()), numbers);
    var offset = numbers.length - lineOnNum + inArr+2;
        offset += numbers.length;
    return offset;
}

function getNumberColor(num) {
    i = $.inArray(num, numbers);
    return colors[i] == 'r' ? 'red' : colors[i] == 'b' ? 'black' : 'green';;
}

$(document).on('click', 'button[data-bet]', function() {
    var plus = $(this).data('bet');
    var val = parseInt($('#bet').val());
    if (isNaN(val)) val = 0;
    switch (plus) {
        case 'clear':
            $('#bet').val('0');
            break
        case 'max':
            $('#bet').val(betLimit);
            break
        case 'x2':
            val *= 2;
            val = val > betLimit ? betLimit : val;
            $('#bet').val(val);
            break
        case '1/2':
            val = val || 1;
            val /= 2;
            $('#bet').val(Math.round(val));
            break
        default:
            val += parseInt(plus);
            $('#bet').val(val);
    }
    if (parseInt($("#bet").val()) > betLimit) $('#bet').val(betLimit);
    if (parseInt($("#bet").val()) > Player.doubleBalance) $('#bet').val(Player.doubleBalance);
    if (Player.doubleBalance <= 0) {
        $('#balance').addClass('animated flash');
        setTimeout(function() {
            $('#balance').removeClass('animated flash')
        }, 1000);
    }
});

$(document).on('click', '#fillBalance', function() {
    fillInventory();
});

$(document).on("click", ".choseItems", function() {
    var itemsCount = $(".inventoryItemSelected").length;
    var ids = [];
    var itemsCost = 0;
    if (itemsCount != 0) {
        $(".inventoryItemSelected").each(function() {
            ids.push(parseInt($(this).data('id')));
        })
        
        getWeapons(ids).then(function(selectedWeapons) {
            itemsCost = selectedWeapons.reduce(function(summ, current) {
                return summ + current.price;
            }, 0)
            if (itemsCost > 0) {
                sellCommis = sellCommis || 0;
                Player.doubleBalance += parseInt((itemsCost * (100-sellCommis)).toFixed(0));
                Player.doubleBalance = parseInt(Player.doubleBalance.toFixed(0));
                $('#balance').text(Player.doubleBalance);
                $('#menu_doubleBalance').text(Player.doubleBalance);
                saveStatistic('doubleBalance', Player.doubleBalance, 'Number');
            }
            
            for (var i = 0; i < ids.length; i++) {
                deleteWeapon(ids[i]);
            }
        })


        //if (Settings.sounds) newItemsSound.play();
        $(".closeInventory").click();

    }
})

function addBet(tableColor, player) {
    tableColor = tableColor || 'red';
    if (player.bet >= 1000 && player.bet < 1000000)
        player.bet = rounded((player.bet / 1000))+'k';
    else if (player.bet >= 1000000 && player.bet < 1000000000)
        player.bet = rounded((player.bet / 1000000))+'kk';
    
    $('.bets-' + tableColor + '-table').append('<tr class="the-bet"><td class="the-bet__player"><img src="' + XSSreplace(avatarUrl(player.img)) + '">' + XSSreplace(player.name) + '</td><td class="the-bet__bet">' + XSSreplace(player.bet) + '</td></tr>');
    
}

function rounded(num) {
    var num = Number(num);
    
    if(isNaN(num))
        return 0;
    
    if(String(num).split('.').length == 2 && String(num).split('.')[1].length > 1)
        num = num.toFixed(1);
    
    return num;
}

function fillCarusel(lastNumber) {
    lastNumer = lastNumber || 1;
    var offset = $.inArray(lastNumber, numbers);
    switch (offset) {
        case 0:
            offset = numbers.length - 2;
            break
        case 1:
            offset = numbers.length - 1;
            break
        default:
            offset -= 2;
    }

    $('.casesCarusel').css('margin-left', '-48px');

    var caruselHTML = "";

    for (var i = 0; i < winNumber + 15; i++) {
        if (offset == numbers.length) offset = 0;
        color = colors[offset] == 'r' ? 'red' : colors[offset] == 'b' ? 'black' : 'green';
        caruselHTML += "<div class='" + color + "-block inline block'>" + numbers[offset] + "</div>";
        offset++;
    }
    $('.casesCarusel').html(caruselHTML);
}
