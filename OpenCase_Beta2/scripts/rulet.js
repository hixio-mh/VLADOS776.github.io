
var itemsAccepted = 0;
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
var ticketsRegExp = /(\d)(?=(\d\d\d)+([^\d]|$))/g;
var PlayerInGame = false;
var priceRange = {
    min: parseFloat($('#diffuculty option:selected').data('min')),
    max: parseFloat($('#diffuculty option:selected').data('max'))
};

//DEBUG
var DEBUG = false;

try {
    var bar = new ProgressBar.Circle(circle, {
        strokeWidth: 6,
        easing: 'easeInOut',
        duration: 1000,
        color: '#b50606',
        trailColor: '#fff',
        trailWidth: 2,
        svgStyle: null,
        text: {
            value: '0/' + itemsLimit,
            alignToBottom: false
        }
    });

    bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    bar.text.style.fontSize = '2rem';
} catch (err) {
    //ERR
}

function newGame() {
    clearTimeout(timerId);
    ifCarusel = false;
    $(".win").slideUp("slow");
    bar.animate(0);
    bar.setText("0/" + itemsLimit + "<hr><s class='currency dollar'>0</s>");
    $("#addItems").prop("disabled", false);
    itemsAccepted = 0;
    totalMoney = 0;
    lastTicket = 0;
    PlayerInGame = false;

    $(".items li").remove();

    $("#players").html("");
    $(".casesCarusel").html("");

    $('#diffuculty').prop('disabled', false);

    PlayersInGame = [];
    ItemsInGame = [];

    {
        marginLeft: 0
    }

    timerId = setTimeout(function() {
        botAddItems()
    }, Math.rand(botMinDec, botMaxDec));
}

$("#addItems").on("click", function() {
    Sound("additems", "play");
    $('.js-loading-inventory').remove();
    fillInventory( { action: 'game' } );
});

$('#diffuculty').change(function() {
    var minPrice = parseFloat($('#diffuculty option:selected').data('min'));
    var maxPrice = parseFloat($('#diffuculty option:selected').data('max'));

    priceRange.min = minPrice;
    priceRange.max = maxPrice;
    newGame();
});

function addItems(fromName, fromImg, itemCount, itemsCost) {
    var okon = ["предмет", "предмета", "предмета", "предмета", "предметов"];
    itemsAccepted += itemCount;
    var step = itemsAccepted * 100 / itemsLimit / 100;
    var value = itemCount - 1;
    //step += bar.value();
    if (step > 1) {
        step = 1
    }
    totalMoney += +Math.round(parseFloat(itemsCost) * 100) / 100;
    totalMoney = +Math.round(parseFloat(totalMoney) * 100) / 100;
    bar.setText(itemsAccepted + '/' + itemsLimit + '<hr><s class="currency dollar">' + totalMoney + '</s>');
    bar.animate(step);

    if (itemCount > 5) value = 4;


    if (Settings.language == "RU")
        $("#status").html(fromName + " внес " + itemCount + " " + okon[value] + " (~" + parseFloat(itemsCost).toFixed(2) + "$)");
    else if (Settings.language == "EN")
        $("#status").html(fromName + " added " + itemCount + " " + ((itemCount == 1) ? "item" : "items") + " (~$" + parseFloat(itemsCost).toFixed(2) + ")");

    var players = '';
    for (var i = 0; i < PlayersInGame.length; i++) {
        var chance = 0.0;
        chance = parseFloat(Math.round((PlayersInGame[i].itemsCost * 100) / totalMoney * 100) / 100);
        players += "<span class='playerAva'  data-nick='" + PlayersInGame[i].nick + "'><img src='" + avatarUrl(PlayersInGame[i].avatar) + "'><p>" + chance + "%</p></span>";
        PlayersInGame[i].chance = chance;
    }
    $("#players").html(players);

    clearTimeout(timerId);
    if (itemsAccepted >= itemsLimit) {
        startGame()
    }

    if (ifCarusel == false) {
        timerId = setTimeout(function() {
            botAddItems()
        }, Math.rand(botMinDec, botMaxDec));
    }
}

function startGame() {
    $("#addItems").prop("disabled", true);
    $('#diffuculty').prop('disabled', true);

    winNumber = 35;

    ifCarusel = true;

    var arr = [];
    for (var i = 0; i < PlayersInGame.length; i++) {
        var count = parseInt(PlayersInGame[i].chance);
        for (var z = 0; z < count; z++) {
            arr.push(PlayersInGame[i]);
        }
    }
    arr = arr.shuffle().shuffle().shuffle();
    if (arr.length > winNumber + 3)
        arr.splice(winNumber + 3, arr.length - (winNumber + 3));
    var el = '';

    arr[winNumber] = getJackpotWiner();

    arr.forEach(function(item, index) {
        var img = avatarUrl(item.avatar);

        el += '<span class="playerAva">' +
            '<img src="' + img + '" />' +
            '</span>'
    })
    win = arr[winNumber];
    $(".casesCarusel").html(el);
    $(".casesCarusel").css("margin-left", "0px");

    var a = 141 * winNumber - 141;
    var l = 141;
    var d = 0,
        s = 0;
    $(".casesCarusel").animate({
        marginLeft: -1 * Math.rand(a - 70, a + 15)
    }, {
        duration: 7000,
        easing: 'easeInOutCubic',
        start: function() {
            //caseOpenAudio.play();
            //caseOpening = true;
            $(".closeInventory").click();

            $(".win").html("<img src='" + avatarUrl(win.avatar) + "'><span class='win__title'>" + Localization.getString('jackpot.winner', 'The winner') + "</span><span class='win__nick'>" + win.nick + "</span><span class='win__chance'>" + win.chance + "%</span><span class='win__ticket'><i class='fa fa-ticket'></i> " + ('' + parseInt(winnerTicket)).replace(ticketsRegExp, '$1&#8198;') + "</span>");

            if (win.nick == Player.nickname) {
                saveWeapons(ItemsInGame);

                //Statistic
                statisticPlusOne('rulet-wins');
                Level.addEXP(2);

                var a = getStatistic('rulet-max-win');

                var winSum = parseFloat($('.progressbar-text s').text().substr(1));
                if (typeof a == "undefined")
                    a = winSum;
                else
                    a = winSum > parseFloat(a) ? winSum : parseFloat(a.replace('$', ''));
                saveStatistic('rulet-max-win', a);
            } else {
                if (PlayerInGame) {
                    statisticPlusOne('rulet-loose');
                }
            }
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
            var timerId2 = 0;
            $($('.casesCarusel').children('.playerAva')[winNumber]).addClass('winnerAnimation');
            if (win.nick == Player.nickname) {
                customEvent({ type: 'game', game: 'jackpot', event: 'win' });
            } else if (PlayerInGame) {
                customEvent({ type: 'game', game: 'jackpot', event: 'lose' });
            }
            timerId2 = setTimeout(function() {
                newGame();
            }, 7000);
        },
    })
}

var getRandomItem = function(list, weight) {
    var total_weight = weight.reduce(function (prev, cur, i, arr) {
        return prev + cur;
    });
     
    var random_num = Math.rand(0, total_weight);
    var weight_sum = 0;
    //console.log(random_num)
     
    for (var i = 0; i < list.length; i++) {
        weight_sum += weight[i];
        weight_sum = +weight_sum.toFixed(2);
         
        if (random_num <= weight_sum) {
            return list[i];
        }
    }
    // end of function
};

function getJackpotWiner() {
    
    var weight = [];
    for (var i = 0; i < PlayersInGame.length; i++) {
        weight.push(PlayersInGame[i].itemsCost);
    }
    
    var w = getRandomItem(PlayersInGame, weight);
    if (typeof w == 'undefined')
        getRandomItem(PlayersInGame, weight);

    var random = Math.rand(w.tickets.from, w.tickets.to);
    winnerTicket = random;
    
    return w;
}

function botAddItems() {
    if (ifCarusel == false) {
        var botName = getRandomBotName();
        var botImg = getRandomBotImg();
        var botWeapons = [];
        var itemsCost = 0.00;
        var qual, st, price;
        var rand = Math.rand(1, maxItems);

        while (botWeapons.length < rand) {
            var weapon = getRandomWeapon(1);
            var price = weapon.price;
            if (price > priceRange.min && price < priceRange.max && price != 0 && weapon.can.bot)
                botWeapons.push(weapon);
        }
        for (var i = 0; i < botWeapons.length; i++) {
            itemsCost += +botWeapons[i].price;
        }
        Sound("additems", "play");
        PlayersInGame.push({
            "nick": botName,
            "avatar": botImg,
            "chance": "0",
            "itemsCost": itemsCost,
            "tickets": {
                "from": lastTicket + 1,
                "to": (itemsCost * 100) + lastTicket + 1
            }
        });
        itemsList(botName, botImg, PlayersInGame[PlayersInGame.length - 1].tickets, itemsCost, botWeapons);
        lastTicket += (itemsCost * 100);
        addItems(botName, botImg, botWeapons.length, itemsCost);
    }
};

function itemsList(fromName, fromImg, tickets, itemsCost, weaponsList) {
    if (typeof weaponsList == 'undefined' || weaponsList.length == 0) return false;
    var bet = "<li class='game-bet animated zoomIn'><div class='game-bet__info'><div class='game-bet__player'><img src='" + avatarUrl(fromImg) + "'>" + fromName + "</div><div class='game-bet__tickets'><span class='game-bet__tickets__price'>$" + itemsCost.toFixed(2) + "</span><i class='fa fa-ticket'></i> " + ('' + parseInt(tickets.from)).replace(ticketsRegExp, '$1&#8198;') + " - " + ('' + parseInt(tickets.to)).replace(ticketsRegExp, '$1&#8198;') + "</div></div></div>" +
        "<div class='bet-items " + (weaponsList.length > 4 ? "hide-items" : "") + "'><div colspan=2>";
    for (var i = 0; i < weaponsList.length; i++) {
        var weapon = weaponsList[i];
        var img = getImgUrl(weapon.img);
        
        var stickers = '';
        if (weapon.stickers) {
            weapon.stickers.forEach(function(sticker) {
                stickers += '<img class="bet-items__item__sticker sticker_xs" src="' + sticker.getImgUrl() + '">';
            })
        }

        var newItem = "<div class='bet-items__item'>\
            " + (weapon.nameTag != null ? '<div class="weapon_nameTagIcon"></div>' : '') + "\
            <img class='bet-items__item__img' src='" + img + "'>\
            " + (stickers ? "<div class='bet-items__stickers'>"+stickers+"</div>" : "")+"\
            <div class='bet-items__item__rarity " + weapon.rarity + "'></div>\
            <span class='bet-items__item__price'>$" + weapon.price + "</span>\
        </div>";
        bet += newItem;

        var item = weapon;
        item.new = true;
        ItemsInGame.push(item);
    }
    bet += "</div></div>";
    $(bet).hide().prependTo(".items").slideToggle();
    //$(".items").prepend(bet);
}

$(document).on('click', '.hide-items, .show-items', function() {
    $(this).toggleClass('hide-items show-items');
})

$(".choseItems").on("click", function() {
    var itemsCount = $(".inventoryItemSelected").length;
    var playerWeapons = [];
    var itemsCost = 0;
    if (itemsCount > 0) {
        var ids = [];
        $(".inventoryItemSelected").each(function() {
            ids.push(parseInt($(this).data('id')));
        })
        getWeapons(ids).then(function(playerWeapons) {
            var itemsCost = playerWeapons.reduce(function(summ, current) {
                return summ + current.price;
            }, 0)
            PlayersInGame.push({
                "nick": Player.nickname,
                "avatar": Player.avatar,
                "chance": "0",
                "itemsCost": itemsCost,
                "tickets": {
                    "from": lastTicket + 1,
                    "to": (itemsCost * 100) + lastTicket + 1
                }
            });
            lastTicket += (itemsCost * 100);
            for (var i = 0; i < ids.length; i++) {
                deleteWeapon(ids[i]);
            }
            
            itemsList(Player.nickname, Player.avatar, PlayersInGame[PlayersInGame.length - 1].tickets, itemsCost, playerWeapons);
            Sound("additems", "play");
            addItems(Player.nickname, Player.avatar, itemsCount, itemsCost);
            $("#addItems").prop("disabled", true);
            $('#diffuculty').prop('disabled', true);
            $(".closeInventory").click();
            PlayerInGame = true;
        })
    }
})

function FillMyInventoryWithRandomWeapon(count) {
    while (count--) {
        var weapon = getRandomWeapon(1);
        weapon.statеrakRandom();
        weapon['new'] = true;

        var z = 0;
        while (weapon.price == 0) {
            weapon.quality = Quality[z].name[1];
            weapon.price = getPrice(weapon.type, weapon.skinName, weapon.quality, weapon.statTrak);
            if (z == 4) break;
            z++
        }
        saveWeapon(weapon);
    }
}
