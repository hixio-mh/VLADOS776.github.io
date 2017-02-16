
$(function() {
    var category = $(document.body).data('localization');

    //$.ajaxSetup({cache: true});
    
    $.getScript("../scripts/localization/" + Settings.language + ".js", function(translation, status) {
        console.log('Script loading status:', status);
        Localization.isLoaded = true;
        $(document).trigger('localizationloaded');
        Localization.localizate(category);
    })
})
var Localization = (function (module) {
    'use strict';
    
    module = module || {};
    module.isLoaded = false;
    
    module.supportedLanguages = {
        names: {
            short: ['RU', 'EN', 'FR', 'PL'],
            full: ['Русский', 'English', 'Français', 'Polski']
        },
        skinNames: {
            arr: ['RU', 'EN'],
            regExp: /(ru|en)/i
        },
        quality: {
            arr: ['RU', 'EN'],
            regExp: /(ru|en)/i
        },
        updates: {
            arr: ['RU', 'EN'],
            regExp: /(ru|en)/i
        }
    }
    
    module.isSupport = function(cat) {
        var category = module.supportedLanguages[cat];
        if (!category) return false;
        
        if (category.regExp) {
            return category.regExp.test(Settings.language);
        }
        
    }
    
    module.changeLanguage = function(lang) {
        lang = lang || 'EN';
        var category = $(document.body).data('localization');
        $.getScript("../scripts/localization/" + lang + ".js", function(translation, status) {
            Localization.isLoaded = true;
            $(document).trigger('localizationloaded');
            Localization.localizate(category);
        })
    }
    
    module.localizate = function(page) {
        var alwaysLoc = ['menu'];
        console.log('Start localization');
        
        for(var i = 0; i < alwaysLoc.length; i++) {
            _localization_start(Translation.translation[alwaysLoc[i]]);
        }
        
        var loc = Translation.translation[page];

        if (!loc) {
            console.log('No localization');
        } else {
            _localization_start(loc);
        }

    }

    function _localization_start(sectionTr) {
        locBlock(sectionTr);    

        function locBlock(block, parent) {
            parent = parent || document;
            if (!block) return false;
            var keys = Object.keys(block);

            for(var i = 0; i < keys.length; i++) {
                if (block[keys[i]].text) {
                    var $element = $(parent).find('[data-loc="' + keys[i] + '"]');
                    if (!$element || $element.length === 0) continue;
                    for (var z = 0; z < $element.length; z++)
                        locElement($element[z], block[keys[i]].text);
                } else {
                    var $parent = $('[data-loc-group="' + keys[i] + '"]');
                    if ($parent && $parent.length)
                        for (var z = 0; z < $parent.length; z++)
                            locBlock(block[keys[i]], $($parent)[z]);
                }
            }
        }

        function locElement($element, tr) {
            var varTest = /\$\{\d+\}/gi;
            if (varTest.test(tr) && $($element).data('loc-var')) {
                var vars = $($element).data('loc-var');
                for (var i = 1; i < Object.keys(vars).length+1; i++) {
                    var rg = new RegExp('(\\$\\{' + i + '\\})', 'g');
                    tr = tr.replace(rg, vars[i]);
                }
            }
            $($element).html(tr);
        }
    }
    
    module.getString = function(path, defaultText, original) {
        defaultText = defaultText || null;
        original = original || false;
        try{
            var paths = path.split('.'),
                current = Translation.translation,
                i;
            for (i = 0; i < paths.length; ++i) {
                if (current[paths[i]] == undefined) {
                    return '';
                } else {
                    current = current[paths[i]];
                }
            }
            if (typeof current == 'object' && current.text)
                current = original ? current.en : current.text
            return current;
        } catch (e) {
            if (defaultText)
                return defaultText
        }
    }
    
    return module;
}(Localization || {}));


function localizate_old(category) {
    var lng = Settings.language;
    if (category != 'none') {
        var currCat = Localization[category];
        for (var i = 0; i < currCat.length; i++) {
            var currItem = currCat[i];
            for (var key in currItem) {
                if(/^localization/i.test(key) && typeof currItem[key][lng] != 'undefined') {
                    $(currItem.selector).html(currItem.localization[lng]);
                } else if(/^attr\(.*?\)/i.test(key) && typeof currItem[key][lng] != 'undefined') {
                    var attr = key.match(/attr\((.*?)\)/)[1];
                    $(currItem.selector).attr(attr, (currItem[key][lng]));
                }
            }
        }
    }
    for (var i = 0; i < Localization['menu'].length; i++) {
        if (typeof Localization['menu'][i].localization[Settings.language] != 'undefined')
            $(Localization['menu'][i].selector).html(Localization['menu'][i].localization[Settings.language]);
    }
    try {
        checkInventoryForNotification()
    } catch (e) {
        //ERROR
    }
    if ($('.js-var').length)
        $('.js-var').each(function() {
            vr = $(this).data('var');
            $(this).html(eval(vr));
        });
}
/*var Localization = [];
    Localization.souvenir = {
        "RU": "Сувенир",
        "EN": "Souvenir"
    },
    Localization.cases = [{
        "selector": "#Default h1",
        "localization": {
            "RU": "Кейсы",
            "EN": "Cases"
        }
    }, {
        "selector": "#Collection h1",
        "localization": {
            "RU": "Коллекции",
            "EN": "Collections"
        }
    }, {
        "selector": "#Souvenir h1",
        "localization": {
            "RU": "Сувенирные коллекции",
            "EN": "Souvenir collections"
        }
    }, {
        "selector": "#Workshop h1",
        "localization": {
            "RU": "Мастерская",
            "EN": "Workshop"
        }
    }, {
        "selector": "#Special h1",
        "localization": {
            "RU": "Особые",
            "EN": "Special"
        }
    }, {
        "selector": "#js-local-special-text",
        "localization": {
            "RU": "Чтобы открыть специальный кейс, откройте ещё",
            "EN": "To open a special case, open"
        }
    }, {
        "selector": "#js-local-special-text2",
        "localization": {
            "RU": "кейсов.",
            "EN": "more cases."
        }
    }, {
        "selector": "#js-local-special-text3",
        "localization": {
            "RU": "Или посмотрите рекламу.",
            "EN": "Or watch the ads."
        }
    }, {
        "selector": "#showVideoAd",
        "localization": {
            "RU": "Посмотреть рекламу",
            "EN": "Watch the ads"
        }
    }, {
        "selector": "#js-local-rank-text",
        "localization": {
            "EN": "Only players with rank"
        }
    }, {
        "selector": "#js-local-rank-text2",
        "localization": {
            "EN": " and higher can open this case."
        }
    }, {
        "selector": "#js-local-rank-text3",
        "localization": {
            "EN": "How to rank up?"
        }
    }, ],
    Localization.cases2 = {
        "new_version": {
            "RU": "Доступна новая версия приложения.",
            "EN": "New version of the app is available."
        },
        "new_version_button_update": {
            "RU": "Обновить",
            "EN": "Update"
        },
        "new_version_button_later": {
            "RU": "Позже",
            "EN": "Later"
        },
        "daily_reward_title": {
            "RU": "Награда!",
            "EN": "Reward!"
        },
        "daily_reward_msg": {
            "RU": 'Вы получили ежедневную награду!<br>+' + DAILY_REWARD_POINTS + ' очков ранга | +' + getRank(Player.points).doubleBonus + ' очков дабла.',
            "EN": 'You get daily reward!<br>+' + DAILY_REWARD_POINTS + ' rank points | +' + getRank(Player.points).doubleBonus + ' double points.'
        }
    },
    Localization.openCase = [{
        "selector": "#win_youWon",
        "localization": {
            "RU": "Вы выиграли",
            "EN": "You won"
        },
    }, {
        "selector": ".openCase",
        "localization": {
            "RU": "Открыть кейс",
            "EN": "Open case"
        }
    }, {
        "selector": "#win_sell_text span",
        "localization": {
            "EN": "Sell"
        }
    }, {
        "selector": "#what-i-can-win-Button",
        "localization": {
            "EN": "What i can win?"
        }
    }, {
        "selector": "#local-youCanWin",
        "localization": {
            "RU": "Вы можете выиграть один из данных предметов из коллекции",
            "EN": "You can win one of those items from collection"
        }
    }, {
        "selector": "#opened-text",
        "localization": {
            "RU": "Открыто: ",
            "EN": "Opened: "
        }
    }],
    Localization.openCase2 = {
        "openCase": {
            "RU": "Открыть кейс",
            "EN": "Open case"
        },
        "opening": {
            "RU": "Открываем кейс...",
            "EN": "Opening..."
        },
        "tryAgain": {
            "RU": "Попробовать ещё раз",
            "EN": "Try again"
        }
    }
Localization.jackpot = [{
        "selector": "#addItems",
        "localization": {
            "RU": "Внести предметы",
            "EN": "Add items"
        }
    }, {
        "selector": ".choseItems",
        "localization": {
            "RU": "Внести",
            "EN": "Add selected items"
        }
    }, {
        "selector": "#local-dif-easy-peasy",
        "localization": {
            "EN": "Easy peasy $0.1 - $5"
        }
    }, {
        "selector": "#local-dif-easy",
        "localization": {
            "EN": "Easy $5 - $30"
        }
    }, {
        "selector": "#local-dif-normal",
        "localization": {
            "EN": "Normal $30 - $80"
        }
    }, {
        "selector": "#local-dif-hard",
        "localization": {
            "EN": "Hard $80 - $200"
        }
    }, {
        "selector": "#local-dif-legendary",
        "localization": {
            "EN": "Legendary $200 - $∞"
        }
    }, ],
    Localization.jackpot2 = {
        "sumText": {
            "RU": "Сумма: ",
            "EN": "Cost: "
        },
        "playerInventory": {
            "RU": "Инвентарь пользователя <b>" + Player.nickname + "</b>",
            "EN": "<b>" + Player.nickname + "</b> inventory"
        },
        "winner": {
            "RU": "Победитель",
            "EN": "The winner"
        },
        "emptyInventory": {
            "RU": "Инвентарь пуст. Чтобы пополнить его, <a href='cases.html?from=jackpot'>откройте пару кейсов.</a>",
            "EN": "Inventory is empty. <a href='cases.html?from=jackpot'>Open some cases to fill it.</a>"
        }
    },
    Localization.rps = [{
        'selector': ".status",
        'localization': {
            "EN": "Add weapon to start a game."
        }
    }, {
        'selector': ".your-score",
        'localization': {
            "EN": "You <span>0</span>"
        }
    }, {
        'selector': ".comp-score",
        'localization': {
            "EN": "Opponent <span>0</span>"
        }
    }, {
        'selector': ".choice span",
        'localization': {
            "EN": "Choose Rock, Paper or Scissors."
        }
    }, {
        'selector': ".add-item",
        'localization': {
            "EN": "Add weapon"
        }
    }, {
        'selector': ".choseItems",
        'localization': {
            "EN": "Add selected weapon"
        }
    }, ],
    Localization.rps2 = {
        'youAdd': {
            "EN": "You added: ",
            "RU": "Вы добавили: "
        },
        'opponentAdd': {
            "EN": "Opponent added: ",
            "RU": "Противник добавил: "
        },
        'youWinRound': {
            "EN": "You win this round!",
            "RU": "Вы победили в этом раунде!"
        },
        'youLostRound': {
            "EN": "You lost this round.",
            "RU": "Вы проиграли в этом раунде."
        },
        'tie': {
            "EN": "Tie!",
            "RU": "Ничья!"
        },
        'winGame': {
            "EN": "You win!",
            "RU": "Вы победили!"
        },
        'lostGame': {
            "EN": "You lost.",
            "RU": "Вы проиграли."
        }
    },
    Localization.coinflip = [{
        'selector': "#local-table-players",
        'localization': {
            "EN": "Players"
        }
    }, {
        'selector': "#local-table-items",
        'localization': {
            "EN": "Items"
        }
    }, {
        'selector': "#local-table-total",
        'localization': {
            "EN": "Total"
        }
    }, {
        'selector': ".choseItems",
        'localization': {
            "EN": "Add selected weapons"
        }
    }, {
        'selector': ".game__start__button",
        'localization': {
            "EN": "Start"
        }
    }, ],
    Localization.coinflip2 = {
        'join': {
            "EN": "Join",
            "RU": "Войти"
        },
        'view': {
            "EN": "View",
            "RU": "Просмотр"
        },
        'add_weapons': {
            "EN": "Add weapons",
            "RU": "Внести оружие"
        },
        'winner': {
            "EN": "Winner",
            "RU": "Победитель"
        },
    },
    Localization['double'] = [{
        "selector": "#last_games_text",
        "localization": {
            "RU": "Предыдущие числа:",
            "EN": "Previous numbers:"
        }
    }, {
        "selector": "#fillBalance",
        "localization": {
            "RU": "Пополнить баланс",
            "EN": "Fill up balance"
        }
    }, {
        "selector": ".choseItems",
        "localization": {
            "RU": "Продать",
            "EN": "Sell"
        }
    }, {
        "selector": "#balance-text",
        "localization": {
            "RU": "Баланс:",
            "EN": "Balance:"
        }
    }, ],
    Localization.double2 = {
        'rollingIn': {
            "EN": "Rolling in",
            "RU": "Розыгрыш через:"
        },
        'rolling': {
            "EN": "ROLLING",
            "RU": "Идет розыгрыш"
        },
        connectionLost: {
            RU: "<div class='loading-dots' style='text-align: left;margin-left: 10px;'>Соединение потеряно</div>",
            EN: "<div class='loading-dots' style='text-align: left;margin-left: 10px;'>Connection lost</div>"
        }
    },
    Localization.crash = [{
        "selector": "#balance-text",
        "localization": {
            "RU": "Баланс:",
        }
    }, {
        "selector": ".crash__next-round-timer",
        "localization": {
            "RU": "Следующий раунд через <span></span> сек",
        }
    }, {
        "selector": "#place-bet",
        "localization": {
            "RU": "Сделать ставку",
        }
    }, {
        "selector": "#local-bets",
        "localization": {
            "RU": "Ставки",
        }
    }, {
        "selector": "#local-history",
        "localization": {
            "RU": "История",
        }
    }, {
        "selector": "#local-top",
        "localization": {
            "RU": "Топ",
        }
    }, {
        "selector": ".bet-list tr:nth-child(1) th:nth-child(1), .top tr:nth-child(1) th:nth-child(2)",
        "localization": {
            "RU": "Ник",
        }
    }, {
        "selector": ".bet-list tr:nth-child(1) th:nth-child(3), .top tr:nth-child(1) th:nth-child(4)",
        "localization": {
            "RU": "Ставка",
        }
    }, {
        "selector": ".bet-list tr:nth-child(1) th:nth-child(4), .top tr:nth-child(1) th:nth-child(5)",
        "localization": {
            "RU": "Выгода",
        }
    }],
    Localization.crash2 = {
        place_bet: {
            "EN": "Place bet",
            "RU": "Сделать ставку"
        },
        cash_out: {
            "EN": "Cash Out<br>@ $s <i class=\"double-icon\"></i>",
            "RU": "Забрать<br>@ $s <i class=\"double-icon\"></i>"
        },
        betting: {
            "EN": "Betting...",
            "RU": "Ставим..."
        },
    },
    Localization.spinking = [{
        "selector": "#ssst",
        "localization": {
            "RU": "Баланс:",
            "EN": "Balance:"
        }
    }, ],
    Localization.inventory = [{
        "selector": "#weaponInfoTable tr:nth-child(1) td:nth-child(1)",
        "localization": {
            "RU": "Цена",
            "EN": "Price"
        }
    }, {
        "selector": "#weaponInfoTable tr:nth-child(2) td:nth-child(1)",
        "localization": {
            "RU": "Качество",
            "EN": "Quality"
        }
    }, {
        "selector": "#startContract",
        "localization": {
            "RU": "Контракт обмена",
            "EN": "Trade up contract"
        }
    }, {
        "selector": "#sellWeapon",
        "localization": {
            "RU": "Продать",
            "EN": "Sell weapon"
        }
    }, {
        "selector": ".button_resetContract",
        "localization": {
            "RU": "Закрыть контракт",
            "EN": "Close contract"
        }
    }, {
        "selector": ".button_contract",
        "localization": {
            "RU": "Обмен...",
            "EN": "Proceed..."
        }
    }, {
        "selector": "#stat-sum-text",
        "localization": {
            "RU": "Сумма:",
            "EN": "Worth:"
        }
    }, {
        "selector": "#stat-count-text",
        "localization": {
            "RU": "Предметов:",
            "EN": "Count:"
        }
    }, ],
    Localization.inventory2 = {
        'contract_error': {
            "EN": "Try another weapon.",
            "RU": "Попробуйте другое оружие"
        },
        'contract_error_title': {
            "EN": "Error",
            "RU": "Ошибка"
        },
        'sell_error': {
            "EN": "Something wrong with weapon price",
            "RU": "Что-то не так с ценой"
        },
    },
    Localization.marketplace = [{
        "selector": "#weaponInfoTable tr:nth-child(1) td:nth-child(1)",
        "localization": {
            "EN": "Price"
        }
    }, {
        "selector": "#weaponInfoTable tr:nth-child(2) td:nth-child(1)",
        "localization": {
            "EN": "Quality"
        }
    }, {
        "selector": "#buy-text",
        "localization": {
            "EN": "Buy:"
        }
    }],
    Localization.statistic = [{
        "selector": "#caseOpened-text",
        "localization": {
            "EN": "Total cases opened:"
        }
    }, {
        "selector": "#white-text",
        "localization": {
            "EN": "White:"
        }
    }, {
        "selector": "#industrial-text",
        "localization": {
            "EN": "Light-blue:"
        }
    }, {
        "selector": "#blue-text",
        "localization": {
            "EN": "Blue:"
        }
    }, {
        "selector": "#restricted-text",
        "localization": {
            "EN": "Purple:"
        }
    }, {
        "selector": "#classified-text",
        "localization": {
            "EN": "Pink:"
        }
    }, {
        "selector": "#covert-text",
        "localization": {
            "EN": "Red:"
        }
    }, {
        "selector": "#knife-text",
        "localization": {
            "EN": "Knives:"
        }
    }, {
        "selector": "#contract-text",
        "localization": {
            "EN": "Trade up contracts:"
        }
    }, {
        "selector": "#rulet-text",
        "localization": {
            "EN": "Jackpots win/lose:"
        }
    }, {
        "selector": "#rulet-max-win-text",
        "localization": {
            "EN": "Jackpot max money won:"
        }
    }, {
        "selector": "#rps-text",
        "localization": {
            "EN": "Rock-Paper-Scissors win/lose:"
        }
    }, {
        "selector": "#coinflip-text",
        "localization": {
            "EN": "Coinflip win/lose:"
        }
    }, {
        "selector": "#coinflip-max-win-text",
        "localization": {
            "EN": "Coinflip max money won:"
        }
    }, {
        "selector": "#double-text",
        "localization": {
            "EN": "Double win/lose:"
        }
    }, {
        "selector": ".button",
        "localization": {
            "EN": "Ranks"
        }
    }],
    Localization.chat = [{
        "selector": "#registerButton",
        "localization": {
            "EN": "Register",
            "RU": "Регистрация"
        }
    }, {
        "selector": "#loginButton",
        "localization": {
            "EN": "Sign in",
            "RU": "Войти"
        }
    }, {
        "selector": "#forgot-pass",
        "localization": {
            "EN": "Forgot password?",
            "RU": "Забыли пароль?"
        }
    }, {
        "selector": "#chat__send-new-message",
        "localization":{},
        "attr(value)": {
            "EN": "Send",
            "RU": "Отправить"
        }
    }],
    Localization.chat2 = {
        'delete_msg_title': {
            "RU": "Удалить сообщение",
            "EN": "Delete message"
        },
        'delete_msg' : {
            "RU": "Вы действительно хотите удалить сообщение?",
            "EN": "Are you sure that you want to delete this message?"
        }
    
    },
    Localization.profile = [{
        "selector": ".stats__rank__text",
        "localization": {
            "RU": "Уровень"
        }
    }, {
        "selector": ".stats__inventory__text",
        "localization": {
            "RU": "Инвентарь"
        }
    }, {
        "selector": ".stats__rate__text",
        "localization": {
            "RU": "Репутация"
        }
    }, {
        "selector": "#send-new-post",
        "localization": {
            "RU": "Отправить"
        },
        "attr(value)": {
            "RU": "Отправить"
        }
    }, {
        "selector": ".new-post__text",
        "localization":{},
        "attr(placeholder)": {
            "EN": "Have something to share?",
            "RU": "Есть чем поделиться?"
        }
    }, {
        "selector": ".trade__header__title",
        "localization":{
            "RU": "Обмен"
        }
    }, {
        "selector": ".you-offer-text",
        "localization":{
            "RU": "Ваши предметы"
        }
    }, {
        "selector": ".you-offer-info",
        "localization":{
            "RU": "Эти предметы вы утратите после обмена"
        }
    }, {
        "selector": "#locale-ready-to-trade",
        "localization":{
            "RU": "Отметьте, когда будете готовы к обмену."
        }
    }, {
        "selector": ".other-offer-text",
        "localization":{
            "RU": "Предметы другого игрока"
        }
    }, {
        "selector": ".other-offer-info",
        "localization":{
            "RU": "Эти предметы вы получите после обмена"
        }
    }, {
        "selector": "#change-weapons-trade",
        "localization":{
            "RU": "Добавить своих предметов"
        }
    }, {
        "selector": "#cancel-trade",
        "localization":{
            "RU": "Отменить обмен"
        }
    }, {
        "selector": "#make-trade",
        "localization":{
            "RU": "Совершить обмен"
        }
    }, {
        "selector": "#locale-back",
        "localization":{
            "RU": "Назад"
        }
    }, {
        "selector": "#add-weapons",
        "localization":{
            "RU": "Добавить предметы"
        }
    }, {
        "selector": "#trade-menu-your-items",
        "localization":{
            "RU": "Ваш инвентарь"
        }
    }, {
        "selector": "#trade-menu-player-items",
        "localization":{
            "RU": "Его инвентарь"
        }
    }, {
        "selector": "#trade-menu-summ",
        "localization":{
            "RU": "Итого"
        }
    }, {
        "selector": ".locale-other-inventory-WIP",
        "localization":{
            "RU": "Просмотр чужого инвентаря в разработке. Отправьте предложение обмена и подождите, пока другой игрок добавит свои предметы."
        }
    }, {
        "selector": "#locale-gift",
        "localization":{
            "RU": "Это подарок"
        }
    }, {
        "selector": ".not-ready",
        "localization":{
            "RU": "Не готов"
        }
    }, {
        "selector": "#back-step",
        "localization":{
            "RU": "Назад"
        }
    }, {
        "selector": "#next-step",
        "localization":{
            "RU": "Вперед"
        }
    }, {
        "selector": "#send-trade",
        "localization":{
            "RU": "Отправить обмен"
        }
    }, {
        "selector": "#local-trades-off",
        "localization":{
            "EN": "Trades are currently disabled for technical reason.<br>Will be enabled in few hours."
        }
    }],
    Localization.profile2 = {
        'trade_send': {
            "EN": "Trade offer successful sended",
            "RU": "Предложение обмена отправлено"
        },
        'trade_send_title': {
            "EN": "Exchange",
            "RU": "Обмен"
        },
        'exchange_offers': {
            "EN": "Exchange offers: ",
            "RU": "Предложения обмена: "
        }
    },
    Localization.trades2 = {
        'otherReady': {
            "RU": "Готов",
            "EN": "Ready"
        },
        'otherNotReady' : {
            "RU": "Не готов",
            "EN": "Not ready"
        },
        'toManyItemsTitle': {
            "RU": "Ограничение",
            "EN": "Limitation"
        },
        'toManyItems' : {
            "RU": "Максимальное число предметов: 50.",
            "EN": "The maximum number of items: 50"
        }
    },
    Localization.faq = [{
        "selector": "#js-local-question-1",
        "localization": {
            "EN": "How to play jackpot?"
        }
    }, {
        "selector": "#js-local-answer-1",
        "localization": {
            "EN": "The max number of weapons that you can add: 15.<br>Maximum price is unlimited.<br>The game will begin after 50 weapons are collected.<br>If you add weapons and close the jackpot, weapons will disappear."
        }
    }, {
        "selector": "#js-local-question-2",
        "localization": {
            "EN": "Why weapons price is $0?"
        }
    }, {
        "selector": "#js-local-answer-2",
        "localization": {
            "EN": "Weapons prices are taken from the database. If there are no prices for current weapon, then price is taken from the Steam Market. If there is no price as well, it counts as $0. <br> When the weapon appears in market, open the weapon info in inventory, wait until the price is loaded, reopen inventory."
        }
    }, {
        "selector": "#js-local-question-trade",
        "localization": {
            "EN": "How to exchange?"
        }
    }, {
        "selector": "#js-local-answer-trade",
        "localization": {
            "EN": "First of all enable \"Exchange\" in settings.<br><b>How to send the trade offer</b><br><ol><li>Open another player's profile</li><li>Press on the exchange icon (<i class=\"fa fa-exchange\" aria-hidden=\"true\"></i>)</li><li>Select the weapons that you want to send and press on the \"Next\" button</li><li><s>Select the weapons that you want to get from player</s> (WIP)</li><li>If you want to send weapons as a gift then check \"It's a gift\" checkbox</li><li>Press on the \"Send trade\" button</li></ol><b>How to get weapons</b><ol><li>Open your profile</li><li>Press on the exchange icon (<i class=\"fa fa-exchange\" aria-hidden=\"true\"></i>)</li><li>Select the player that send the offer to you</li><li>Select the offer</li><li>Change your offer if you want</li><li>Check the \"Check this box when ready to trade.\" checkbox</li><li>Wait until another player check this checkbox too and press on the \"Make trade\" button. Or another player can press it</li></ol>If another player pressed the \"Make trade\" button when you was offline then open this trade to get your weapons."
        }
    }, {
        "selector": "#js-local-question-rank",
        "localization": {
            "EN": "How to rank up?"
        }
    }, {
        "selector": "#js-local-answer-rank",
        "localization": {
            "EN": "For increase your rank you need points. Points are given for the following steps: <ul><li>Open the app - <i class='js-var' data-var='DAILY_REWARD_POINTS'></i> points (award is given once a day)</li><li>Open the case - <i class='js-var' data-var='OPEN_CASE_REWARD_POINTS'></i> point</li><li>Won in the mini-game - <i class='js-var' data-var='GAME_WIN_REWARD_POINTS'></i> points</ul>"
        }
    }, {
        "selector": "#js-local-question-doublePoints",
        "localization": {
            "EN": "Where I can spend double credits?"
        }
    }, {
        "selector": "#js-local-answer-doublePoints",
        "localization": {
            "EN": "For now - nowhere. Marketplace is in development."
        }
    }, {
        "selector": "#js-local-question-3",
        "localization": {
            "EN": "I found a bug what should I do?"
        }
    }, {
        "selector": "#js-local-answer-3",
        "localization": {
            "EN": "You can contact me via email: <b>kurtukovvlad@gmail.com</ b>"
        }
    }],
    Localization.ranks = [{
        "selector": "#locl-your-points",
        "localization": {
            "RU": "Ваши очки",
            "EN": "Your points"
        }
    }, ],
    Localization.ranks2 = {
        "pointsNeed": {
            "EN": "Points needed:",
            "RU": "Очков необходимо"
        },
        "doubleAward": {
            "EN": "Daily double credits award:",
            "RU": "Ежедневная награда дабл кредитами:"
        }
    },

    Localization.settings = [{
        "selector": "#local-profile",
        "localization": {
            "EN": "Profile"
        }
    }, {
        "selector": "#local-name",
        "localization": {
            "EN": "Your name"
        }
    }, {
        "selector": "#local-avatar",
        "localization": {
            "EN": "Avatar"
        }
    }, {
        "selector": "#local-beta",
        "localization": {
            "EN": "Beta"
        }
    }, {
        "selector": "#local-beta_trade",
        "localization": {
            "EN": "Exchange"
        }
    }, {
        "selector": "#local-local",
        "localization": {
            "EN": "Interface"
        }
    }, {
        "selector": "#local-language",
        "localization": {
            "EN": "Language"
        }
    }, {
        "selector": "#local-sounds",
        "localization": {
            "EN": "Sound"
        }
    }, {
        "selector": "#local-drop",
        "localization": {
            "EN": "Fast drop (x2)"
        }
    }, {
        "selector": "#reset",
        "localization": {
            "EN": "Full reset"
        }
    }, {
        "selector": "#reset-text",
        "localization": {
            "EN": "All weapons will be deleted. Statistics will be reset. Are you sure?"
        }
    }, {
        "selector": "#resetConfirm",
        "localization": {
            "EN": "Yes"
        }
    }, {
        "selector": "#submit",
        "localization": {
            "EN": "Save"
        }
    }, ],
    Localization.settings2 = {
        "notificationTitle": {
            "RU": "Статус",
            "EN": "Status"
        },
        "saved": {
            "RU": "Сохранено",
            "EN": "Saved"
        },
        "resetDone": {
            "RU": "Очищено",
            "EN": "Done"
        },
        "resetQuestionTitle": {
            "RU": "Полный сброс",
            "EN": "Full Reset"
        },
        "resetQuestion": {
            "RU": "Вы уверены, что хотите очистить инвентарь и сбросить статистику?",
            "EN": "All weapons will be deleted. Statistics will be reset. Are you sure?"
        },
        "notValidNicknameTitle": {
            "RU": "Ошибка",
            "EN": "Error"
        },
        "notValidNickname": {
            "RU": "В имени могут быть только буквы и цифры.",
            "EN": "Wrong name. Only letters and numbers are available."
        }
    }
Localization.about = [{
        "selector": "#developer",
        "localization": {
            "EN": "Main developer"
        }
    }, {
        "selector": "#local-1",
        "localization": {
            "EN": "If you found some bugs or you have a suggestion you can write me an email."
        }
    }, {
        "selector": "#local-2",
        "localization": {
            "EN": "If you want to thank the developer you can send something in Steam :)"
        }
    }, {
        "selector": "#local-3",
        "localization": {
            "EN": "Do not forget to rate the app in the Play Market ^_^"
        }
    }, {
        "selector": "#special-thanks",
        "localization": {
            "EN": "Special Thanks"
        }
    }, {
        "selector": "#other-links-container",
        "localization": {
            "EN": ""
        }
    }, {
        "selector": "#copyright",
        "localization": {
            "EN": "Copyright"
        }
    }, {
        "selector": "#local-4",
        "localization": {
            "EN": "All information is taken from public sources. If anything in the application infringes your copyright, please contact me."
        }
    }, ],
    Localization.apps = []
Localization.ban = {
    wrong_ban: {
        RU: "Если вы считаете, что получили бан по ошибке, напишите на почту kurtukovvlad@gmail.com",
        EN: "If you were banned by a mistake, write to email kurtukovvlad@gmail.com"
    }
}*/
