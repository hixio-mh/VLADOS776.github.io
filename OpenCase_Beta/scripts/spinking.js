var SpinKing = (function (module) {
    module = module || {};
    var rolling = false;
    var betLimit = 100000;
    var bet = {
        coins: 0,
        weapons: []
    };

    module.init = function () {
        for (var i = 0; i < Spins.length; i++)
            Spins[i].id = i;

        $('#bet').val('0');
        $('#balance').text(Player.doubleBalance.toFixed(0));
        $("#bet").keydown(function (e) {
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

        fillCarusel();
        fillItems();

        $(document).on('click', 'button[data-bet]', function () {
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
                setTimeout(function () {
                    $('#balance').removeClass('animated flash')
                }, 1000);
            }
        });
    }

    module.newGame = function () {
        $("#spin").prop("disabled", false);
        fillCarusel();
    }

    module.spin = function () {
        var win = getResult();
        console.log(win.name.RU);
        $($(".casesCarusel").children(".spinking-item")[winNumber]).replaceWith(resultToHTML(win));
        var a = 127 * winNumber;
        var l = 131;
        var d = 0,
            s = 0;
        var progress_animate = 0;
        jQuery.fx.interval = 10;
        $(".casesCarusel").animate({
            marginLeft: -1 * Math.rand(a - 48, a + 75)
        }, {
            duration: 10000,
            easing: 'easeOutSine',
            start: function () {
                $("#spin").prop("disabled", true);
                $("#bet").prop("disabled", true);
            },
            progress: function (e, t) {
                if (Settings.sounds) {
                    progress_animate = Math.round(100 * t),
                        s = parseInt(parseInt($(".casesCarusel").css("marginLeft").replace(/[^0-9.]/g, "") - l / 2) / l),
                        s > d && (Sound("scroll", "play"),
                            d++)
                }

            },
            complete: function () {
                //$(".win").slideDown("fast");
                rolling = false;
                if (win.code != "")
                    eval(win.code);
                $("#spin").attr("onclick", "SpinKing.buttonSpin(true);");
                $("#spin").prop("disabled", false);
                $("#bet").prop("disabled", false);
                //$(".openCase").attr("disabled", null);
                //$(".weapons").scrollTop(185);

                //Statistic
                //changePoints(1);

            },
            always: function () {
                // $(".openCase").attr("disabled", null);
                rolling = false;
            }
        })
    }

    module.buttonSpin = function (respin) {
        respin = respin || false;
        bet.coins = parseInt($("#bet").val());
        if (bet.coins == 0) return false;

        if (bet.coins > Player.doubleBalance) bet.coins = Player.doubleBalance;
        $("#bet").val(bet.coins);
        Player.doubleBalance -= bet.coins;
        $("#balance").text(Player.doubleBalance);
        saveStatistic('doubleBalance', Player.doubleBalance, 'Number');
        floating_text('#balance', '-' + bet.coins, {color: 'red'});
        if (!respin)
            module.spin();
        else
            results.retry();
    }

    module.getBet = function () {
        return bet.coins;
    }

    function fillCarusel() {
        $(".casesCarusel").empty();
        var arr = [];
        for (var key in Spins) {
            arr[key] = Spins[key];
        }
        while (arr.length < winNumber + 3) {
            arr = arr.concat(arr.shuffle());
        }
        if (arr.length > winNumber + 3)
            arr.splice(winNumber + 3, arr.length - (winNumber + 3));

        var carusel = "";
        arr.forEach(function (item, i) {
            carusel += $('#spinkingItem-template').tmpl(arr[i]).wrap('<p/>').parent().html();
        })

        $(".casesCarusel").html(carusel);
        $(".casesCarusel").css("margin-left", "0px");
        setTimeout(function () {
            $(".casesCarusel .spinking-item").removeClass("animated fadeInDown");
        }, 1000);
    }

    function fillItems() {
        var allItems = "";
        for (var i = 0; i < Spins.length; i++) {            
            allItems += $('#spinkingItem-template').tmpl(Spins[i]).wrap('<p/>').parent().html();
        }
        $(".winList").html(allItems);
    };

    function resultToHTML(result) {
        var style = typeof result.imgStyles != "undefined" ? "style='" + result.imgStyles + "'" : "";
        var html = $('#spinkingItem-template').tmpl(result).wrap('<p/>').parent().html();
        return html;
    }

    function getResult() {
        console.log('getResult');
        var sumChances = 0;
        for (var i = 0; i < Spins.length; i++)
            sumChances += Spins[i].chance;

        for (var i = 0; i < Spins.length; i++) {
            var weight = Spins[i].chance / sumChances;
            Spins[i].weight = weight;
        }
        var sumWeights = 0;
        for (var i = 0; i < Spins.length; i++)
            sumWeights += Spins[i].weight;

        var cursor = 0;
        var random = Math.random();
        for (var i = 0; i < Spins.length; i++) {
            cursor += Spins[i].weight / sumWeights;
            if (cursor >= random) {
                if (typeof Spins[i].minBet != 'undefined' && Spins[i].minBet > bet.coins) {
                    return getResult();
                } else {
                    return Spins[i];
                }
            }
        }
    }

    var Spins = [{
        "name": {
            "RU": "Только не это",
            "EN": "Not this pls"
        },
        "description": {
            "RU": "Опустошает инвентарь",
            "EN": "Empties your inventory"
        },
        "img": "emptyInventory.png",
        "imgStyles": "height: 103%;margin:-1px;",
        "rarity": "covert",
        "chance": 0
    }, {
        "name": {
            "RU": "N0thing",
            "EN": "N0thing"
        },
        "description": {
            "RU": "Бывает, попробуй еще",
            "EN": "Try again"
        },
        "img": "nothing.png",
        "rarity": "industrial",
        "chance": 100
    }, {
        "name": {
            "RU": "Повтор",
            "EN": "Re-spin"
        },
        "description": {
            "RU": "Давай еще раз",
            "EN": "One more time"
        },
        "img": "respin.png",
        "rarity": "industrial",
        "code": "results.retry();",
        "chance": 100
    }, {
        "name": {
            "RU": "Копейка",
            "EN": "Better than nothing"
        },
        "description": {
            "RU": "+1$",
            "EN": "+1$"
        },
        "img": "1Coin.png",
        "imgStyles": "height: 92%;margin-top:3px;",
        "rarity": "rare",
        "code": "results.addCoins(100);results.returnBet(1)",
        "chance": 80
    }, {
        "name": {
            "RU": "Хоть что-то",
            "EN": "Better than nothing"
        },
        "description": {
            "RU": "1/2 вашей ставки",
            "EN": "Return half of your bet"
        },
        "img": "half.png",
        "imgStyles": "height: 90%;margin-top:5px;",
        "rarity": "rare",
        "code": "results.returnBet(0.5);",
        "chance": 75
    }, {
        "name": {
            "RU": "Comeback",
            "EN": "Comeback"
        },
        "description": {
            "RU": "Возвращение ставки",
            "EN": "Return your bet"
        },
        "img": "betMultiply.png",
        "imgStyles": "height: 80%;margin-top:5px;",
        "rarity": "rare",
        "code": "results.returnBet(1);",
        "chance": 80
    }, {
        "name": {
            "RU": "Double kill",
            "EN": "Double kill"
        },
        "description": {
            "RU": "Ваша ставка x2",
            "EN": "Return your bet x2"
        },
        "img": "betMultiply.png",
        "imgStyles": "height: 80%;margin-top:5px;",
        "xCounter": 2,
        "rarity": "rare",
        "code": "results.returnBet(2);",
        "chance": 50,
        "betType": 'coins'
    }, {
        "name": {
            "RU": "Впечатляет",
            "EN": "Impressive"
        },
        "description": {
            "RU": "Ваша ставка x10",
            "EN": "Return your bet x10"
        },
        "img": "betMultiply.png",
        "imgStyles": "height: 80%;margin-top:5px;",
        "xCounter": 10,
        "rarity": "rare",
        "code": "results.returnBet(10);",
        "chance": 40,
        "betType": 'coins'
    }, {
        "name": {
            "RU": "Ничего себе",
            "EN": "WOW"
        },
        "description": {
            "RU": "Ваша ставка x50",
            "EN": "Return your bet x50"
        },
        "img": "betMultiply.png",
        "imgStyles": "height: 80%;margin-top:5px;",
        "xCounter": 50,
        "rarity": "rare",
        "code": "results.returnBet(50);",
        "chance": 10,
        "betType": 'coins'
    }, {
        "name": {
            "RU": "Я БОГАТ!",
            "EN": "I AM RICH!"
        },
        "description": {
            "RU": "Ваша ставка x100",
            "EN": "Return your bet x100"
        },
        "img": "rich.png",
        "imgStyles": "height: 80%;margin-top:5px;",
        "rarity": "rare",
        "code": "results.returnBet(100);",
        "chance": 1,
        "betType": 'coins'
    }, {
        "name": {
            "RU": "Эко раунд",
            "EN": "Eco round"
        },
        "description": {
            "RU": "1 случайная вещь",
            "EN": "1 random weapon"
        },
        "img": "gun.png",
        "imgStyles": "height: 103%;margin:-1px;",
        "rarity": "restricted",
        "code": "results.randomItem(1, 'milspec');results.returnBet(1);",
        "minBet": 1000,
        "chance": 50
    }, {
        "name": {
            "RU": "Форс бай",
            "EN": "Force buy"
        },
        "description": {
            "RU": "5 случайных вещей",
            "EN": "5 random weapons"
        },
        "img": "gun.png",
        "imgStyles": "height: 103%;margin:-1px;",
        "xCounter": 5,
        "rarity": "restricted",
        "code": "results.randomItem(5);results.returnBet(1);",
        "minBet": 5000,
        "chance": 40
    }, {
        "name": {
            "RU": "Фулл бай",
            "EN": "Full buy"
        },
        "description": {
            "RU": "10 случайных вещей",
            "EN": "10 random weapons"
        },
        "img": "gun.png",
        "imgStyles": "height: 103%;margin:-1px;",
        "xCounter": 10,
        "rarity": "restricted",
        "code": "results.randomItem(10);results.returnBet(1);",
        "minBet": 10000,
        "chance": 30
    }, {
        "name": {
            "RU": "НОЖ!!!",
            "EN": "KNIFE!!!"
        },
        "description": {
            "RU": "Случайный нож!",
            "EN": "Random knife!"
        },
        "img": "knife.png",
        "imgStyles": "height:70%;margin-top: 15px;",
        "rarity": "restricted",
        "code": "results.giveRandomKnive();",
        "minBet": 10000,
        "chance": 20
    }, {
        "name": {
            "RU": "Дракон",
            "EN": "Dragon"
        },
        "description": {
            "RU": "История о драконе",
            "EN": "AWP Dragon Lore"
        },
        "img": "dragon.png",
        "imgStyles": "height: 90%;margin-top: 8px;",
        "rarity": "covert",
        "code": "results.weapon(695)",
        "minBet": 50000,
        "chance": 1
    }, ];

    return module;
})(SpinKing || {});

var results = {
    giveRandomKnive: function () {
        var weapon = getRandomWeapon();

        saveWeapon(weapon);
        Lobibox.alert("success", {
            title: "Random Knife",
            iconSource: 'fontAwesome',
            msg: weapon.titleText() + '(' + weapon.qualityText() + ')'
        });
    },
    randomItem: function (count, rarity) {
        rarity = rarity || "all";
        count = count || 1;
        var msg = "";
        var weaponsArr = []
        for (var i = 0; i < count; i++) {
            var wp = getRandomWeapon();
            wp['new'] = true;
            msg += wp.titleText() + ' (' + wp.qualityText() + ')<br>';
            weaponsArr.push(wp);
        }
        saveWeapons(weaponsArr);
        Lobibox.alert("success", {
            title: "Random Weapon",
            iconSource: 'fontAwesome',
            msg: msg
        });
    },
    returnBet: function (multy) {
        multy = multy || 1;
        Player.doubleBalance += parseInt(SpinKing.getBet() * multy);
        $('#balance').text(Player.doubleBalance);
        saveStatistic('doubleBalance', Player.doubleBalance, 'Number');
        floating_text('#balance', '+' + SpinKing.getBet() * multy, {color: 'green'});
    },
    addCoins: function (coins) {
        Player.doubleBalance += parseInt(coins);
        $('#balance').text(Player.doubleBalance);
        saveStatistic('doubleBalance', Player.doubleBalance, 'Number');
        floating_text('#balance', '+' + parseInt(coins), {color: 'green'});
    },
    weapon: function (opt) {
        var weapon = new Weapon(opt);
        
        saveWeapon(weapon);
        Lobibox.alert("success", {
            title: "Random Weapon",
            iconSource: 'fontAwesome',
            msg: weapon.titleText() + '(' + weapon.qualityText() + ')'
        });
    },
    retry: function () {
        $(".casesCarusel").children(".spinking-item").addClass("animated fadeOutDown");
        $("#spin").prop("disabled", true);
        sleep(1000).then(() => {
            $(".casesCarusel").empty();
            SpinKing.newGame();
            SpinKing.spin();
        })
    },
};

function floating_text(parent, text, opt) {
    parent = parent || document.body;
    text = text || 'Hello world!';
    opt = opt || {};
    opt.duration = opt.duration || 1000;
    opt.easing = opt.easing || 'linear';
    opt.bold = opt.bold != null ? opt.bold : true;
    
    $('<p style="\
            position:absolute;\
            top:-1px;\
            ' + (opt.color ? ' color: ' + opt.color + ';' : '' ) + '\
            ' + (opt.bold ? ' font-weight: bold;' : '') + '\
        ">'+text+'</p>').appendTo(parent).animate({
        top: -50,
        opacity: 0
    }, opt.duration, opt.easing, function() {
        $(this).remove();
    })
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
