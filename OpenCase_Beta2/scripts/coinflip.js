var CoinFlip = {
    Games: [],
    PlayerBet: {},
    maxWeapons: 30,
    maxPlayerWeapons: 15,
    PlayerInGame: false,
    priceRange: {
        low: {
            min: 20,
            max: 60
        },
        normal: {
            min: 60,
            max: 120
        },
        hight: {
            min: 120,
            max: 350
        },
        legendary: {
            min: 400,
            max: 999999
        }
    },
    timerId: null,
    init: function() {
        $(function() {
            var anim = document.getElementById('coin');
            anim.addEventListener("animationend", CoinFlip.coinStoped, false);
            anim.addEventListener("webkitAnimationEnd", CoinFlip.coinStoped, false);
            
            var games_order = ['low', 'low', 'normal', 'normal', 'hight', 'hight', 'legendary', 'legendary', 'legendary', 'legendary'];
            var list = '';
            for (var i = 0; i < games_order.length; i++) {
                var game = CoinFlip.botAddGame(games_order[i]);
                CoinFlip.Games.push(game);
            }
            
            CoinFlip.Games = CoinFlip.Games.sort(function(a, b) {
                return parseFloat(a.bot.items_cost) - parseFloat(b.bot.items_cost);
            });

            for (var i = 0; i < CoinFlip.Games.length; i++) {
                list += "<tr><td class='table-name'><img src='" + avatarUrl(CoinFlip.Games[i].bot.img) + "'><span>" + CoinFlip.Games[i].bot.name + "</span></td><td>" + CoinFlip.Games[i].bot.weapons.length + "</td><td><span class='currency dollar'>" + CoinFlip.Games[i].bot.items_cost.toFixed(2) + "</span></td><td><span class='join " + CoinFlip.Games[i].color + " btn' data-game-id=" + i + ">" + Localization.getString('coinflip.table.join') + "</span></td></tr>";
            }
            $('.games').append(list);
            $('#js-table-loading-gif').remove();
            
            $('.navigationBar').append('<img src="../images/navigation/refresh.png" class="navigationBar_refresh">');
            
            $(document).on('click', '.navigationBar_refresh', function() {
                location.reload();
            });
            
            $(document).on('click', '.join', function() {
                if (typeof CoinFlip.PlayerBet.weapons != 'undefined') CoinFlip.PlayerInGame = $(this).data('game-id');
                Sound("click", "play");
                CoinFlip.showGame($(this).data('game-id'));
                $('#coin').removeClass();
            });
            
            $(document).on('click', '#addWeapons', function() {
                CoinFlip.PlayerInGame = $(this).data('game-id');
                Sound("click", "play");
                $('.js-loading-inventory').remove();
                fillInventory( { action: 'game' } );
            });
            
            $(document).on('click', ".closeInventory", function() {
                if (typeof CoinFlip.PlayerBet.items_cost == 'undefined') CoinFlip.PlayerInGame = false;
                Sound("click", "play");
            });
            
            $(document).on('click', '.close-game, .blur', function() {
                $('.game__bot__img').removeClass('winner-img');
                $('.game__player__img').removeClass('winner-img');
                $('.game').css('display', 'none');
                $('.blur').css('display', 'none');
                Sound("click", "play");
                CoinFlip.PlayerInGame = false;
            });
            
            $(document).on("click", ".choseItems", function() {
                var itemsCount = $(".inventoryItemSelected").length;
                var playerWeapons = [];
                var ids = [];
                Sound("click", "play");
                if (itemsCount != 0) {
                    if (typeof CoinFlip.PlayerBet.nick == 'undefined') {
                        CoinFlip.PlayerBet = {
                            "nick": Player.nickname,
                            "chance": 0,
                            "items_cost": 0
                        };
                        CoinFlip.PlayerBet.weapons = [];
                    }
                    $(".inventoryItemSelected").each(function() {
                        ids.push(parseInt($(this).data('id')));
                    })

                    getWeapons(ids).then(function(playerWeapons) {
                        CoinFlip.PlayerBet.weapons = CoinFlip.PlayerBet.weapons.concat(playerWeapons);
                        CoinFlip.PlayerBet.items_cost = CoinFlip.PlayerBet.weapons.reduce(function(summ, current) {
                            return summ + current.price;
                        }, 0)

                        for (var i = 0; i < ids.length; i++) {
                            deleteWeapon(ids[i]);
                        }
                        $(".inventoryList").css("display", "none");
                        $("#inventorySum").remove();
                        CoinFlip.showGame(CoinFlip.PlayerInGame);
                    });
                }
            });
            
            $(document).on('click', '.game__start span', function() {
                CoinFlip.startGame();
            });
        })
    },
    showGame: function(game_id) {
        $('#addWeapons').removeClass('hide');
        $('.game__bot__nick').text(CoinFlip.Games[game_id].bot.name);
        $('.game__bot__img').attr('src', avatarUrl(CoinFlip.Games[game_id].bot.img));
        $('.game__bot__price').text('$' + CoinFlip.Games[game_id].bot.items_cost.toFixed(2));
        $('.game__bot__chance').text('100%');

        $('.game__player__nick').text(Player.nickname);
        $('.game__player__img').attr('src', avatarUrl(Player.avatar));
        $('.game__player__price').text('$0');
        $('.game__player__chance').text('0%');

        $('.game__table__win').html("");

        var bot_inventory = CoinFlip.Games[game_id].bot.weapons;

        $('.player-inventory tr').remove();
        $(".bot-inventory tr").remove();
        for (var i = 0; i < bot_inventory.length; i++) {
            var weapon = bot_inventory[i];

            var weaponInfo = "<tr><td class='" + weapon.rarity + "-color inv_rarity'></td><td><span class='inv_type'>" + weapon.type + "</span><span class='inv_name'>" + weapon.name + "</span></td><td class='inv_price currency dollar'>" + weapon.price + "</td></tr>";
            $('.bot-inventory').append(weaponInfo);
        }
        if (CoinFlip.PlayerInGame === false && typeof CoinFlip.Games[game_id].winner == 'undefined') {
            $('.player-inventory').append('<tr><td colspan="3"><button id="addWeapons" class="btn btn-sm btn-success btn-block" type="button" data-game-id="' + game_id + '">' + Localization.getString('coinflip.add_items') + '</button></td></tr>');
            $('.game__start').css('display', 'none');

        } else if (typeof CoinFlip.Games[game_id].winner == 'undefined' && CoinFlip.PlayerBet.weapons.length != 0) {
            $('.game__player__price').text('$' + CoinFlip.PlayerBet.items_cost.toFixed(2));

            for (var i = 0; i < CoinFlip.PlayerBet.weapons.length; i++) {
                var weapon = CoinFlip.PlayerBet.weapons[i];
                var weaponInfo = "<tr><td class='inv_price currency dollar'>" + weapon.price + "</td><td><span class='inv_type'>" + weapon.type + "</span><span class='inv_name'>" + weapon.getName() + "</span></td><td class='" + weapon.rarity + "-color inv_rarity'></td></tr>";
                $('.player-inventory').append(weaponInfo);
            }
            $('.game__start').css('display', 'block');

            if (CoinFlip.PlayerBet.weapons.length < CoinFlip.maxPlayerWeapons) {
                maxItems = CoinFlip.maxPlayerWeapons - CoinFlip.PlayerBet.weapons.length;
                $('.player-inventory').append('<tr><td colspan="3"><button id="addWeapons" class="btn btn-sm btn-success btn-block" type="button" data-game-id="' + game_id + '">' + Localization.getString('coinflip.add_items') + '</button></td></tr>');
            }

            var sum = CoinFlip.Games[game_id].bot.items_cost + CoinFlip.PlayerBet.items_cost;
            var botChance = (CoinFlip.Games[game_id].bot.items_cost * 100) / sum;
            var playerChance = (CoinFlip.PlayerBet.items_cost * 100) / sum;
            CoinFlip.Games[game_id].bot.chance = botChance;
            CoinFlip.Games[game_id].player.chance = playerChance;
            $('.game__bot__chance').text(botChance.toFixed(1) + '%');
            $('.game__player__chance').text(playerChance.toFixed(1) + '%');

        } else if (typeof CoinFlip.Games[game_id].winner != 'undefined') {
            if (CoinFlip.Games[game_id].winner == 'CT')
                $('.game__bot__img').addClass('winner-img');
            else
                $('.game__player__img').addClass('winner-img');
            $('.game__player__chance').text(CoinFlip.Games[game_id].player.chance.toFixed(1) + '%');
            $('.game__player__price').text('$' + CoinFlip.Games[game_id].player.items_cost.toFixed(2));
            $('.game__bot__chance').text(CoinFlip.Games[game_id].bot.chance.toFixed(1) + '%');
            $('.game__start').css('display', 'none');

            $('.game__table__win').html(Localization.getString('coinflip.winner') + '<br><img src="../images/coinflip/' + CoinFlip.Games[game_id].winner.toLowerCase() + '.png">')

            for (var i = 0; i < CoinFlip.Games[game_id].player.weapons.length; i++) {
                var weapon = CoinFlip.Games[game_id].player.weapons[i];

                var weaponInfo = "<tr><td class='inv_price currency dollar'>" + weapon.price + "</td><td><span class='inv_type'>" + weapon.type + "</span><span class='inv_name'>" + weapon.getName() + "</span></td><td class='" + weapon.rarity + "-color inv_rarity'></td></tr>";
                $('.player-inventory').append(weaponInfo);
            }
        }
        $('.blur').css('display', 'block');
        $(".game").css("display", "block");
    },
    startGame: function() {
        $('#coin').removeClass();
        var win = getRandomItem(['CT', 'T'], [CoinFlip.Games[CoinFlip.PlayerInGame].bot.items_cost, CoinFlip.PlayerBet.items_cost]);
        animation = win;

        $('.game__start').css('display', 'none');
        $('#addWeapons').addClass('hide');

        $('.coin-blur').removeClass('hide');
        $('#coin-flip-cont').removeClass('hide');

        $("#coin").addClass(animation);
        var repeat = 9;
        if (win == "CT") repeat = 10;

        setTimeout(function() {
            Sound("coinflip", "play", 0, repeat);
        }, 250);
    },
    botAddGame: function(difficulty) {
        var bot = {};
        bot.name = getRandomBotName();
        bot.img = getRandomBotImg();
        bot.weapons = [];
        bot.items_cost = 0.0;
        var weaponCount = Math.rand(3, CoinFlip.maxWeapons);
        for (var q = 0; q < weaponCount; q++) {
            var weapon = null;

            while (typeof weapon == 'undefined' || weapon == null) {
                var rnd = Math.rand(0, Object.keys(Prices).length - 1);
                weapon = Prices[rnd];
            }

            var price = 0;
            for (var i = 4; i > 0; i--) {
                if (price != 0 && (price > CoinFlip.priceRange[difficulty].min && price < CoinFlip.priceRange[difficulty].max)) {
                    weapon.quality = i;
                    break;
                }

                if (weapon.prices.default[i])
                    price = weapon.prices.default[i].market != -1 ? weapon.prices.default[i].market : weapon.prices.default[i].analyst != -1 ? weapon.prices.default[i].analyst : weapon.prices.default[i].opskins;
            }

            if (price > CoinFlip.priceRange[difficulty].min && price < CoinFlip.priceRange[difficulty].max) {
                weapon = new Item(weapon);
                if (weapon.can.bot) {
                    bot.weapons.push(weapon);
                    bot.items_cost += price;
                } else {
                    weaponCount++;
                }
            } else {
                weaponCount++;
            }
        }
        var color = '';
        if (bot.items_cost < 100) color = 'consumer-color';
        if (bot.items_cost > 100 && bot.items_cost < 500) color = 'milspec-color';
        if (bot.items_cost > 500 && bot.items_cost < 1000) color = 'restricted-color';
        if (bot.items_cost > 1000 && bot.items_cost < 3000) color = 'classified-color';
        if (bot.items_cost > 3000 && bot.items_cost < 8000) color = 'covert-color';
        if (bot.items_cost > 8000) color = 'rare-color';
        var Temp = {};
        Temp.color = color;
        Temp.bot = bot;
        Temp.player = {};
        return Temp;
    },
    coinStoped: function() {
        if (!isAndroid()) Sound("coinflip", "pause");

        var winner = $('#coin').attr('class');
        if (winner == 'CT') {
            $('.game__bot__img').addClass('winner-img');
            statisticPlusOne('coinflip-loose');
            
            customEvent({ type: 'game', game: 'coinflip', event: 'lose' })
        } else {
            $('.game__player__img').addClass('winner-img');
            var allWP = CoinFlip.PlayerBet.weapons.concat(CoinFlip.Games[CoinFlip.PlayerInGame].bot.weapons);
            for (var i = 0; i < CoinFlip.PlayerBet.weapons.length; i++) {
                allWP[i].new = true;
            }

            saveWeapons(allWP);
            Level.addEXP(2);
            statisticPlusOne('coinflip-wins');

            var a = getStatistic('coinflip-max-win', 0);
            var winSum = CoinFlip.Games[CoinFlip.PlayerInGame].bot.items_cost + CoinFlip.PlayerBet.items_cost;
            if (a == 0)
                a = winSum;
            else
                a = winSum > parseFloat(a) ? winSum : parseFloat(a);
            saveStatistic('coinflip-max-win', a.toFixed(2));
            
            customEvent({ type: 'game', game: 'coinflip', event: 'win' })
        }
        CoinFlip.Games[CoinFlip.PlayerInGame].winner = winner;
        CoinFlip.Games[CoinFlip.PlayerInGame].player.weapons = [];
        CoinFlip.Games[CoinFlip.PlayerInGame].player.items_cost = CoinFlip.PlayerBet.items_cost;

        for (var i = 0; i < CoinFlip.PlayerBet.weapons.length; i++)
            CoinFlip.Games[CoinFlip.PlayerInGame].player.weapons.push(CoinFlip.PlayerBet.weapons[i]);

        CoinFlip.timerId = setTimeout(function() {
            CoinFlip.hideCoin();
        }, 2000);
    },
    hideCoin: function() {
        clearTimeout(CoinFlip.timerId);
        CoinFlip.timerId = null;
        var winner = $('#coin').attr('class');
        $('.coin-blur').addClass('hide');
        $('#coin-flip-cont').addClass('hide');
        CoinFlip.PlayerBet = {};
        $($('.join')[CoinFlip.PlayerInGame]).text(Localization.getString('coinflip.table.view'));
        CoinFlip.PlayerInGame = false;
        maxItems = CoinFlip.maxPlayerWeapons;
        $('.game__table__win').html(Localization.getString('coinflip.winner') + '<br><img src="../images/coinflip/' + winner.toLowerCase() + '.png">')
    }
}

var maxItems = CoinFlip.maxPlayerWeapons;

var getRandomItem = function(list, weight) {
    var total_weight = 0;
    for (var i = 0; i < weight.length; i++)
        total_weight += weight[i] * 100;

    var random_num = Math.rand(0, total_weight);
    var weight_sum = 0;

    for (var i = 0; i < list.length; i++) {
        weight_sum += weight[i] * 100;
        weight_sum = +weight_sum.toFixed(2);

        if (random_num <= weight_sum) {
            return list[i];
        }
    }
};
