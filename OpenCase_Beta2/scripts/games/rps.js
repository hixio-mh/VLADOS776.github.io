var anim = document.getElementById('js-left-hand');
anim.addEventListener("animationend", listener, false);
anim.addEventListener("webkitAnimationEnd", listener, false);


var yourScore = 0,
    enemyScore = 0,
    totalRounds = 3,
    round = 1,
    maxItems = 5;

var winItems = [];

var addItemsSound = new Audio();
addItemsSound.src = "../sound/interface/menuClick.wav";
addItemsSound.volume = 0.9;

var selectItemSound = new Audio();
selectItemSound.src = "../sound/interface/SelectItem.wav";
selectItemSound.volume = 0.9;

var newItemsSound = new Audio();
newItemsSound.src = "../sound/interface/jackpotAddItems.wav";
newItemsSound.volume = 0.9;

$(function() {
    $('.round-count').text(round + '/' + totalRounds);
});

$('#add-items').on('click', function() {
    newGame();
    
    $('.js-loading-inventory').remove();

    fillInventory({ action: 'game' });
});

$(".choseItems").on("click", function() {
    var itemsCount = $(".inventoryItemSelected").length;
    if (itemsCount == 0) {
        $(".closeInventory").click();
        return false;
    }
    //var playerWeapons = [];
    var ids = [];
    var itemsCost = 0;
    
    $('.winItems').show();
    
    $(".inventoryItemSelected").each(function() {
        ids.push(parseInt($(this).data('id')));
    })
    
    getWeapons(ids).then(function(playerWeapons) {
        winItems = playerWeapons
        var itemsCost = winItems.reduce(function(summ, current) {
            return summ + current.price;
        }, 0)
        
        $("#button_items").css("display", 'none');
        $(".closeInventory").click();

        var html = "<ul>";
        for (var i = 0; i < winItems.length; i++)
            html += '<li>' + winItems[i].type + ' | ' + winItems[i].getName() + ' (<span class="currency dollar">' + winItems[i].price + '</span>)<b class=' + winItems[i].rarity + '></b>';
        $('.your-bet .panel-body').empty().html(html+'</ul>');
        
        $('.status').html('<li id="js-loading-inventory" data-from="1"><div class="cssload-container"><div class="cssload-speeding-wheel"></div></div></li>');
        
        for (var i = 0; i < ids.length; i++) {
            deleteWeapon(ids[i]);
        }
        
        setTimeout(function() {
            botAddWeapon(itemsCost / winItems.length);
            $('.choice').css('display', 'block');
            $('.status').text('...');
        }, 200);
        
        LOG.log({
            game: 'RPS',
            action: 'Bet',
            weapons: winItems
        })
    })


})

function botAddWeapon(itemsCost) {
    var minPrice = 0,
        maxPrice = 0;
    if (itemsCost < 1) {
        minPrice = 0.1,
            maxPrice = 2.5;
    } else if (itemsCost >= 1 && itemsCost < 10) {
        minPrice = 1,
            maxPrice = 15;
    } else if (itemsCost >= 10 && itemsCost < 50) {
        minPrice = 10,
            maxPrice = 60;
    } else if (itemsCost >= 50 && itemsCost < 100) {
        minPrice = 50,
            maxPrice = 120;
    } else if (itemsCost >= 100 && itemsCost < 200) {
        minPrice = 100,
            maxPrice = 230;
    } else if (itemsCost >= 200 && itemsCost < 500) {
        minPrice = 190,
            maxPrice = 550;
    } else if (itemsCost >= 500 && itemsCost < 1000) {
        minPrice = 470,
            maxPrice = 1200;
    } else {
        minPrice = itemsCost - 500;
        maxPrice = itemsCost + 500;
    }

    var canContinue = false;
    var botWeapons = [];
    wpLength = winItems.length;
    var oldDate = new Date();
    while (!canContinue) {
        var weapon = null;
        
        while (typeof weapon == 'undefined' || weapon == null) {
            var rnd = Math.rand(0, Object.keys(Prices).length - 1);
            weapon = Prices[rnd];
        }
        
        var price = 0;
        for (var i = 0; i < 4; i++) {
            if (price != 0) break;
            
            if (weapon.prices.default[i])
                price = weapon.prices.default[i].market != -1 ? weapon.prices.default[i].market : weapon.prices.default[i].analyst != -1 ? weapon.prices.default[i].analyst : weapon.prices.default[i].opskins;
        }

        if (price >= minPrice && price <= maxPrice) {
            weapon = new Weapon(weapon.item_id, i);
            if (weapon.can.bot)
                botWeapons.push(weapon);
            if (wpLength == botWeapons.length) canContinue = true;
        }
        if (new Date() - oldDate > 4000) {
            botWeapons = [];
            for (var i = 0; i < winItems.length; i++) {
                botWeapons.push(new Item(winItems[i]));
                botWeapons[i].nameTag = null;
            }
            canContinue = true;
            break;
        }
    }
    winItems = winItems.concat(botWeapons);
    var html = "<ul>";
    for (var i = wpLength; i < winItems.length; i++)
        html += '<li>' + winItems[i].type + ' | ' + winItems[i].name + ' (<span class="currency dollar">' + winItems[i].price + '</span>)<b class=' + winItems[i].rarity + '></b>';
    $('.other-bet .panel-body').empty().html(html+'</ul>');
}

$('.choice__hand').on('click', function() {

    $(this).addClass('selected');
    $('.status').text('...');

    $('.choice__hand').prop('disabled', true);

    $('#js-player-img').attr('src', '../images/rps/rock.png');
    $('#js-comp-img').attr('src', '../images/rps/rock.png');

    $('.battle-field .left').addClass('animation-shake-left');
    $('.battle-field .right').addClass('animation-shake-right');
});

function listener(e) {
    var playerChoice = $('.selected').data('choice');
    var whoWin = startGame(playerChoice);

    if (whoWin == 'player') {
        yourScore++;
        round++;
        $('.your-score strong').text(yourScore);
        $('.status').text(Localization.getString('rps.status.round_win'));
    } else if (whoWin == 'comp') {
        enemyScore++;
        round++;
        $('.comp-score strong').text(enemyScore);
        $('.status').text(Localization.getString('rps.status.round_lost'));
    } else {
        $('.status').text(Localization.getString('rps.status.round_tie'));
    }


    $('.battle-field .left').removeClass('animation-shake-left');
    $('.battle-field .right').removeClass('animation-shake-right');
    $('.choice__hand').removeClass('selected');
    $('.choice__hand').prop('disabled', false);

    if (round == totalRounds + 1 || (yourScore == 2 && enemyScore == 0) || (yourScore == 0 && enemyScore == 2))
        endGame((yourScore > enemyScore) ? true : false);
    else
        $('.round-count').text(round + '/' + totalRounds);
}

function newGame() {
    round = 1;
    yourScore = 0;
    enemyScore = 0;
    
    $('.battle-field').removeClass('panel-success panel-danger');
    $('.battle-field').addClass('panel-primary');

    $('.your-score strong').text(yourScore);
    $('.comp-score strong').text(enemyScore);
    $('.round-count').text(round + '/' + totalRounds);

    $('#js-player-img').attr('src', '../images/rps/rock.png');
    $('#js-comp-img').attr('src', '../images/rps/rock.png');
}

function endGame(playerWin) {
    $('.battle-field').removeClass('panel-primary');
    if (playerWin) {
        $('.status').text(Localization.getString('rps.status.win'));
        for (var i = 0; i < winItems.length; i++) {
            winItems[i]['new'] = true;
        }
        
        $('.battle-field').addClass('panel-success');
        saveWeapons(winItems);
        Level.addEXP(2);
        statisticPlusOne('rps-wins');
    } else {
        $('.battle-field').addClass('panel-danger');
        $('.status').text(Localization.getString('rps.status.lost'));
        statisticPlusOne('rps-loose');
    }

    winItems = [];

    round = 1;
    yourScore = 0;
    enemyScore = 0;

    $(".choice").css("display", 'none');
    $("#button_items").css("display", 'block');
    checkInventoryForNotification();
}

function startGame(userChoice) {
    var computerChoice = Math.random();
    if (computerChoice < 0.34) {
        computerChoice = "rock";
    } else if (computerChoice <= 0.67) {
        computerChoice = "paper";
    } else {
        computerChoice = "scissors";
    }

    $('#js-player-img').attr('src', '../images/rps/' + userChoice + '.png');
    $('#js-comp-img').attr('src', '../images/rps/' + computerChoice + '.png');

    return compare(userChoice, computerChoice);
}

function compare(choice1, choice2) {
    if (choice1 === choice2) {
        return "tie";
    }
    if (choice1 === "rock") {
        if (choice2 === "scissors") {
            return "player";
        } else {
            return "comp";
        }
    }
    if (choice1 === "paper") {
        if (choice2 === "rock") {
            return "player";
        } else {
            return "comp";
        }
    }
    if (choice1 === "scissors") {
        if (choice2 === "rock") {
            return "comp";
        } else {
            return "player";
        }
    }
};
