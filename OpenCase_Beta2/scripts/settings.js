// ===== PROGRAM SETTINGS =====
var DAILY_REWARD_POINTS = 5,
    OPEN_CASE_REWARD_POINTS = 1,
    GAME_WIN_REWARD_POINTS = 2,
    //FREE_CASE_INTERVAL_MS = 300000;
    FREE_CASE_INTERVAL_MS = 1.8e+6, //30 минут
    SHOW_LAST_NEWS = 3;

// ===== PLAYER SETTINGS =====
var Player = {
    "nickname": "Player",
    "avatar": "0.jpg",
    "points": 0,
    'doubleBalance': 0
}
var Settings = {
        "language": "EN",
        "sounds": true,
        "drop": false
    }

Player.nickname = getStatistic("playerNickname", 'Player');
Player.avatar = getStatistic("playerAvatar", '../images/ava/0.jpg');
Player.points = parseInt(getStatistic('playerPoints', 0));
Player.doubleBalance = parseInt(getStatistic('doubleBalance', 0));

if (Player.nickname.length == 0) {
    Player.nickname = 'Player';
}

//isNaN check
if (isNaN(Player.doubleBalance)) Player.doubleBalance = 10000;
if (isNaN(Player.points)) Player.points = 1;


Settings.language = getStatistic("settings_language", 'EN');
Settings.sounds = getStatistic("settings_sounds", 'true') === 'true';
Settings.drop = getStatistic("settings_drop", 'false') === 'true';
Settings.scroll_names = getStatistic("settings_scroll", 'false') === 'true';

function avatarUrl(avatar) {
    avatar = avatar || Player.avatar;
    
    if (/^\d+\.(jpg|png|gif)$/i.test(avatar)) {
        return '../images/ava/'+avatar;
    } else if (/^\.\..*?\.\w{3}$/.test(avatar)) {
        return avatar;
    } else if (/^(http|www).*?\.(png|gif|jpg|jpeg)$/i.test(avatar)) {
        return avatar;
    }
}

// ===== RANKS =====
var Ranks = [
    {
    name: 'Silver I',
    points: 0,
    doubleBonus: 50
}, {
    name: 'Silver II',
    points: 15,
    doubleBonus: 100
}, {
    name: 'Silver III',
    points: 25,
    doubleBonus: 150
}, {
    name: 'Silver IV',
    points: 50,
    doubleBonus: 200
}, {
    name: 'Silver Elite',
    points: 80,
    doubleBonus: 250
}, {
    name: 'Silver Elite Master',
    points: 110,
    doubleBonus: 300
}, {
    name: 'Gold Nova I',
    points: 140,
    doubleBonus: 350
}, {
    name: 'Gold Nova II',
    points: 190,
    doubleBonus: 400
}, {
    name: 'Gold Nova III',
    points: 240,
    doubleBonus: 450
}, {
    name: 'Gold Nova Master',
    points: 290,
    doubleBonus: 500
}, {
    name: 'Master Guardian I',
    points: 380,
    doubleBonus: 550
}, {
    name: 'Master Guardian II',
    points: 480,
    doubleBonus: 600
}, {
    name: 'Master Guardian Elite',
    points: 600,
    doubleBonus: 650
}, {
    name: 'Distinguished Master Guardian',
    points: 720,
    doubleBonus: 700
}, {
    name: 'Legendary Eagle',
    points: 840,
    doubleBonus: 750
}, {
    name: 'Legendary Eagle Master',
    points: 980,
    doubleBonus: 800
}, {
    name: 'Supreme Master First Class',
    points: 1100,
    doubleBonus: 850
}, {
    name: 'The Global Elite',
    points: 1300,
    doubleBonus: 900
}, ];

for (var i = 0; i < Ranks.length; i++) {
    Ranks[i].id = i;
    var img = Ranks[i].name.toLowerCase().replace(/ /g, '');
    Ranks[i].img = '../images/ranks/' + img + '.png';
}

function getRank(points) {
    points = points || Player.points;
    for (var i = 0; i < Ranks.length; i++) {
        if (points < Ranks[i].points) {
            return Ranks[i - 1];
            break
        }
        if (i == Ranks.length - 1) {
            return Ranks[i];
            break
        }
    }
}

function getNextRank(points) {
    points = points || Player.points;
    var getRank = {};
    for (var i = 0; i < Ranks.length; i++) {
        if (points < Ranks[i].points || i == Ranks.length - 1) {
            return Ranks[i];
            break
        }
    }
}

function getRankByName(name) {
    for (var i = 0; i < Ranks.length; i++)
        if (Ranks[i].name == name) {
            return Ranks[i];
        }
}

function changePoints(val) {
    if (typeof val == "number" && val != 0) {
        var currRankName = getRank().name;
        Player.points += val;
        Player.points = (Player.points < 0) ? 0 : Player.points;
        saveStatistic('playerPoints', Player.points);
        var percent = ((Player.points - getRank().points) * 100) / (getNextRank().points - getRank().points);
        if (getNextRank().points - getRank().points == 0) percent = 100;
        $("#player-rank-progress").css('width', percent + '%');


        if (currRankName != getRank().name) {
            $("#left-rank").attr('src', getRank().img);
            $("#right-rank").attr('src', getNextRank().img);
            try {
                if (isAndroid()) {
                    if (getRankByName(currRankName).points < getRank().points)
                        client.sendToAnalytics("Rank", "Rank", "Player ranked up", getRank().name);
                    else
                        client.sendToAnalytics("Rank", "Rank", "Player ranked down", getRank().name);
                }
            } catch (e) {
                //ERROR
            }
        }
    }
}



var Level = (function(module) {
    module = module || {};
    
    module.lvlEXP = function(lvl) {
        if (lvl <= 1) 
            return 0;
        else 
            return module.lvlEXP(lvl-1) + lvl*2;
    }
    
    module.calcLvl = function(exp) {
        exp = exp || Player.points;
        exp = isNaN(exp) ? 5 : exp;
        var i = 1;
        while (true) {
            if (exp < module.lvlEXP(i))
                return i-1;
            i++;
          }
    }
    
    module.myLvl = function () {
        return module.calcLvl();
    }
    
    module.nextLvl = function(exp) {
        return module.calcLvl(exp) + 1;
    }
    
    module.myEXP = function() {
        return Player.points;
    }
    module.nextLvlEXP = function(exp) {
        return module.lvlEXP(module.myLvl() + 1);
    }
    
    module.progress = function() {
        var all = module.nextLvlEXP() - module.lvlEXP(module.myLvl());
        var my  = module.myEXP() - module.lvlEXP(module.myLvl());
        return Math.floor(my * 100 / all);
    }
    
    module.doubleBonus = function(lvl) {
        lvl = lvl || module.myLvl();
        if (lvl === 1 || lvl === 2)
            return 10000;
        else
            return lvl * 100 > 10000 ? 10000 : lvl * 100;
    }
    
    module.levelUP = function() {
        if (Lobibox) {
            Lobibox.notify('info', {
                pauseDelayOnHover: false,
                width: $(window).width(),
                position: 'top center',
                icon: false,
                title: 'Levels',
                size: 'mini',
                delay: 3000,
                msg: 'Level up!'
            })
        }
        
        if (isAndroid())
            client.sendToAnalytics("Rank", "Rank", "Player ranked up", getRank().name);
    }
    
    module.levelDown = function() {
        if (isAndroid())
            client.sendToAnalytics("Rank", "Rank", "Player ranked down", getRank().name);
    }
    
    module.addEXP = function(exp) {
        if (typeof exp != 'number') return;
        var currentLvl = module.myLvl();
        Player.points += exp;
        Player.points = (Player.points < 0) ? 0 : Player.points;
        saveStatistic('playerPoints', Player.points);
        
        var newLvl = module.myLvl();
        if (newLvl > currentLvl)
            module.levelUP();
        else if (newLvl < currentLvl)
            module.levelDown();
        
        $(document).trigger('expchanged')
    }
    return module;
})(Level || {})

var Rewards = (function() {
    var module = {};
    
    var rewardList = {
        1: {
            points: 1000,
            exp: 1
        },
        2: {
            points: 2000,
            exp: 3
        },
        3: {
            points: 3000,
            exp: 5
        },
        4: {
            points: 5000,
            exp: 8
        },
        5: {
            points: 10000,
            exp: 12
        },
        6: {
            points: 15000,
            exp: 16
        },
        7: {
            points: 20000,
            exp: 20
        },
        8: {
            points: 25000,
            exp: 24
        }
    }
    
    module.getDay = function() {
        var day = parseInt(getStatistic('rewards-day', '1'));
        var lastReward = parseInt(getStatistic('rewards-last', '0'));
        if (lastReward === 0) return 1;
        
        
    }
    
    //module.get
    
    return module;
})()
var Missions = (function() {
    var module = {};
    var config = {
        missionsPerDay: 5,
        allCompleteReward: {
            money: 10000,
            exp: 10
        },
        notify: true,
        newMissionsAfterComplete: true,
        updateKD: 1000 * 60 * 30 // 30 минут
    }
    var missionsActive = getStatistic('missionsActive', 'true') === 'true';
    
    if (!missionsActive) {
        module.trigger = function() {}
        return module;
    }
    var missions = [
        {
            id: 0,
            type: 'case',
            event: 'open',
            description: {
                RU: 'Открыть кейс 50 раз подряд',
                EN: 'Open case 50 times in a row'
            },
            check: {
                caseId: 24
            },
            times: 50,
            reward: {
                exp: 10,
                money: 10000
            }
        }, {
            id: 1,
            type: 'case',
            event: 'open',
            description: {
                RU: 'Открыть специальный кейс',
                EN: 'Open special case'
            },
            check: {
                caseId: { inArray: [48, 49, 50, 51, 52, 53] }
            },
            times: 1,
            reward: {
                exp: 5,
                money: 500
            }
        }, {
            id: 2,
            type: 'items',
            event: 'contract',
            description: {
                RU: 'Скрафтить Dragon Lore',
                EN: 'Craft Dragon Lore'
            },
            check: {
                item_id: 695,
            },
            reward: {
                exp: 20,
                money: 100000
            }
        }, {
            id: 3,
            type: 'game',
            game: 'rps',
            event: 'win',
            times: 5,
            description: {
                RU: 'Выиграть в КНБ 5 раз',
                EN: 'Win in RPS 5 times'
            },
            reward: {
                exp: 15,
                money: 10000
            }
        }, {
            id: 4,
            type: 'game',
            game: 'rps',
            event: 'win',
            times: 10,
            description: {
                RU: 'Выиграть в КНБ 10 раз',
                EN: 'Win in RPS 10 times'
            },
            reward: {
                exp: 25,
                money: 20000
            }
        }, {
            id: 5,
            type: 'game',
            game: 'rps',
            event: 'win',
            times: 3,
            inARow: true,
            description: {
                RU: 'Выиграть в КНБ 3 раза подряд',
                EN: 'Win in RPS 3 times in a row'
            },
            reward: {
                exp: 25,
                money: 20000
            }
        }, {
            id: 6,
            type: 'game',
            game: 'jackpot',
            event: 'win',
            times: 1,
            description: {
                RU: 'Выиграть в Джекпот',
                EN: 'Win in Jackpot'
            },
            reward: {
                exp: 3,
                money: 2000
            }
        }, {
            id: 7,
            type: 'game',
            game: 'double',
            event: 'win',
            times: 10,
            description: {
                RU: 'Выиграть 10 раз в Дабл',
                EN: 'Win in Double 10 times'
            },
            reward: {
                exp: 5,
                money: 5000
            }
        }, {
            id: 8,
            type: 'game',
            game: 'double',
            event: 'win',
            times: 3,
            inARow: true,
            description: {
                RU: 'Выиграть в Дабл 3 раза подряд',
                EN: 'Win in Double 3 times in a row'
            },
            reward: {
                exp: 8,
                money: 8000
            }
        }, {
            id: 9,
            type: 'items',
            event: 'sell',
            times: 10,
            description: {
                RU: 'Продать 10 предметов',
                EN: 'Sell 10 items'
            },
            reward: {
                exp: 3,
                money: 2000
            }
        }, {
            id: 10,
            type: 'items',
            event: 'buy',
            times: 10,
            description: {
                RU: 'Купить 10 предметов',
                EN: 'Buy 10 items'
            },
            reward: {
                exp: 3,
                money: 2000
            }
        }, {
            id: 11,
            type: 'items',
            event: 'rename',
            times: 3,
            description: {
                RU: 'Переименовать 3 предмета',
                EN: 'Rename 3 items'
            },
            reward: {
                exp: 2,
                money: 3000
            }
        }, {
            id: 12,
            type: 'game',
            game: 'crash',
            event: 'cashout',
            times: 1,
            description: {
                RU: 'Забрать в Краше на 10x',
                EN: 'Cashout in Crash on 10x'
            },
            check: {
                multiply: { moreThen: 10 }
            },
            reward: {
                exp: 10,
                money: 50000
            }
        }, {
            id: 13,
            type: 'case',
            event: 'open',
            times: 1,
            check: {
                item_id: { inArray: [766,767,768,769,770,771,772,773,786,787,788,789,790,791,792,793,794,795,796] }
            },
            description: {
                RU: 'Выбить перчатки из кейса',
                EN: 'Get gloves from case'
            },
            reward: {
                exp: 5,
                money: 8000
            }
        }, {
            id: 14,
            type: 'customCase',
            event: 'open',
            times: 10,
            description: {
                RU: 'Открыть 10 кейсов игроков',
                EN: 'Open 10 custom cases'
            },
            reward: {
                exp: 3,
                money: 3000
            }
        }, {
            id: 15,
            type: 'game',
            game: 'coinflip',
            event: 'win',
            times: 5,
            description: {
                RU: 'Выиграть 5 раз в Монетке',
                EN: 'Win in Coinflip 5 times'
            },
            reward: {
                exp: 3,
                money: 10000
            }
        }, {
            id: 16,
            type: 'game',
            game: 'coinflip',
            event: 'win',
            times: 2,
            inARow: true,
            description: {
                RU: 'Выиграть в Монетке 2 раза подряд',
                EN: 'Win in Coinflip 2 times in a row'
            },
            reward: {
                exp: 5,
                money: 15000
            }
        }, {
            id: 17,
            type: 'game',
            game: 'minesweeper',
            event: 'win',
            times: 3,
            description: {
                RU: 'Выиграть в Сапер 3 раза',
                EN: 'Win in Minesweeper 3 times'
            },
            condition: {
                RU: [
                    'Количество ходов должно быть больше 5',
                    'Количество мин должно быть больше 2'
                ],
                EN: [
                    'Amount of opened tiles must be more than 5',
                    'Amount of mines must be more than 2'
                ]  
            },
            check: {
                steps: { moreThen: 5 },
                mines: { moreThen: 2 }
            },
            reward: {
                exp: 5,
                money: 10000
            }
        }, {
            id: 18,
            type: 'game',
            game: 'dice',
            event: 'win',
            times: 5,
            description: {
                RU: 'Выиграть в Кости 5 раз',
                EN: 'Win in Dice 5 times'
            },
            check: {
                chance: { lessThen: 60 }
            },
            condition: {
                RU: [
                    'Шансы должены быть меньше 60%'
                ],
                EN: [
                    'Chances must be less then 60%'
                ]  
            },
            reward: {
                exp: 5,
                money: 10000
            }
        }, {
            id: 19,
            type: 'game',
            game: 'crash',
            event: 'cashout',
            times: 1,
            check: {
                multiply: { moreThen: 2 }
            },
            description: {
                RU: 'Забрать в Краше на 2x',
                EN: 'Cashout in Crash on 2x'
            },
            reward: {
                exp: 2,
                money: 1000
            }
        }, {
            id: 20,
            type: 'case',
            event: 'open',
            times: 10,
            check: {
                caseId: { inArray: [54,55,56,57] }
            },
            description: {
                RU: 'Открыть 10 кейсов из Мастерской',
                EN: 'Open 10 Workshop cases'
            },
            reward: {
                exp: 3,
                money: 2000
            }
        }, {
            id: 21,
            type: 'customCase',
            event: 'create',
            times: 1,
            description: {
                RU: 'Создать свой кейс',
                EN: 'Create custom case'
            },
            reward: {
                exp: 5,
                money: 5000
            }
        }, {
            id: 22,
            type: 'game',
            game: 'double',
            event: 'win',
            times: 1,
            description: {
                RU: 'Выиграть на зеленом в Дабл',
                EN: 'Win on green in Double'
            },
            check: {
                color: 'green'
            },
            reward: {
                exp: 5,
                money: 8000
            }
        }, {
            id: 23,
            type: 'chat',
            event: 'message',
            times: 10,
            description: {
                RU: 'Написать в чат 10 сообщений',
                EN: 'Write 10 messages in chat'
            },
            reward: {
                exp: 3,
                money: 2000
            }
        }, {
            id: 24,
            type: 'chat',
            event: 'graffiti',
            times: 3,
            description: {
                RU: 'Отправить в чате 3 граффити',
                EN: 'Send 3 graffiti in chat'
            },
            reward: {
                exp: 3,
                money: 2000
            }
        }, {
            id: 25,
            type: 'game',
            game: 'jackpotOnline',
            event: 'win',
            times: 1,
            check: {
                room: 4
            },
            description: {
                RU: 'Выиграть в онлайн Джекпоте на легендарной сложности',
                EN: 'Cashout in Crash on 20x'
            },
            reward: {
                exp: 10,
                money: 100000
            }
        }, {
            id: 26,
            type: 'game',
            game: 'crash',
            event: 'cashout',
            times: 1,
            check: {
                multiply: { moreThen: 20 }
            },
            description: {
                RU: 'Забрать в Краше на 20x',
                EN: 'Cashout in Crash on 20x'
            },
            reward: {
                exp: 15,
                money: 1000000
            }
        }, {
            id: 27,
            type: 'game',
            game: 'crash',
            event: 'cashout',
            times: 1,
            check: {
                multiply: { moreThen: 50 }
            },
            description: {
                RU: 'Забрать в Краше на 50x',
                EN: 'Cashout in Crash on 50x'
            },
            reward: {
                exp: 20,
                money: 5000000
            }
        }, {
            id: 28,
            type: 'game',
            game: 'crash',
            event: 'cashout',
            times: 1,
            check: {
                multiply: { moreThen: 100 }
            },
            description: {
                RU: 'Забрать в Краше на 100x',
                EN: 'Cashout in Crash on 100x'
            },
            reward: {
                exp: 30,
                money: 100000000
            }
        }
    ]
    var current = [],
        lastUpdate = null,
        updateTime = null;
    
    try { 
        var storage = JSON.parse(getStatistic('missions', '{}'));
        
        if (storage.current) current = storage.current.map(function(miss) {
            return new Mission({
                steps: miss.steps,
                currStep: miss.currStep,
                raw: missions[miss.id]
            })
        });
        if (storage.lastUpdate) lastUpdate = storage.lastUpdate;
        if (storage.updateTime) updateTime = storage.updateTime;

    } catch(e) {}
    
    if (current.length === 0 || new Date(lastUpdate).getDate() !== new Date().getDate() || (updateTime && updateTime < Date.now())) {
        newMissions();
    }
    
    $(document).on('loading.menu', function() {
        updateInMenu();
    })
    
    $(document).on('click', 'li.mission', function() {
        remove();
        if ($(this).find(".mission-info").length !== 0){
            return false;
        }
        
        var missID = $(this).data('missionid');
        var miss = Missions.currentMissions().filter(function(itm) {
            return itm.raw.id === missID
        });
        if (!miss) return false;
        miss = miss[0];
        
        var missionInfoTemplate = '<div class="animated flipInX mission-info" style="display:none;">\
            <h6>' + _t('missions.info.progress', 'Progress') + '</h6> <div class="progress"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow=${progress} aria-valuemin=0 aria-valuemax=100 style="width:${progress}%">${progress}%</div></div>\
            {{if raw.condition}}\
                <h6>' + _t('missions.info.condition', 'Conditions') + '</h6> <ul class="mission-conditions_list">{{each condition}}\
                    <li class="mission-condition">${$value}</li>\
                {{/each}}</ul>\
            {{/if}}\
            <h6>' + _t('missions.info.award', 'Award') + '</h6> <div class="text-center">${raw.reward.money}<i class="double-icon"></i> | ${raw.reward.exp} EXP</div>\
        </div>';
        
        $.template('missionInfoTemplate', missionInfoTemplate);
        
        var progress = parseInt(miss.currStep / miss.steps * 100);
        miss.progress = progress;
        $.tmpl('missionInfoTemplate', miss).appendTo(this).slideDown('fast')
        
        function remove() {
            if ($('.mission-info')) {
                $('.mission-info').addClass('flipOutX');
                $('.mission-info').slideUp('fast');
                
                var $that = $('.mission-info.flipOutX');
                setTimeout(function() {
                    $that.remove();
                }, 500)
            }
        }
    })
    
    module.getMissions = function() {
        return missions;
    }
    module.getMission = function(id) {
        id = id || 0;
        
        return new Mission(missions[id]);
    }
    module.current = function(id) {
        return current[id];
    }
    module.currentMissions = function() {
        return current;
    }
    module.trigger = function(act) {
        for (var i = 0; i < current.length; i++) {
            var mission = current[i];
            if (!mission.isComplete() && mission.raw.type === act.type) {
                if (act.type === 'game' && mission.raw.game !== act.game) continue;
                
                if (act.event === mission.raw.event) {
                    var nextMiss = false;
                    if (mission.raw.check) {
                        for (var key in mission.raw.check) {
                            if (!act[key]) {
                                mission.fail(act);
                                nextMiss = true;
                                break;
                            }

                            if (typeof mission.raw.check[key] === 'object') {
                                var checkObj = mission.raw.check[key];

                                if (checkObj.moreThen && act[key] <= checkObj.moreThen) {
                                    mission.fail(act);
                                    nextMiss = true;
                                    break;
                                }
                                if (checkObj.lessThen && act[key] >= checkObj.lessThen) {
                                    mission.fail(act);
                                    nextMiss = true;
                                    break;
                                }
                                if (checkObj.inArray && checkObj.inArray.indexOf(act[key]) === -1) {
                                    mission.fail(act);
                                    nextMiss = true;
                                    break;
                                }
                            } else {
                                if (act[key] !== mission.raw.check[key]) {
                                    mission.fail(act);
                                    nextMiss = true;
                                    break;
                                }
                            }
                        }
                        if (nextMiss) continue;
                        mission.step();
                    } else {
                        mission.step();
                    }
                } else {
                    mission.fail(act);
                }
            }
        }
    }
    module.isAllComplete = function() {
        for (var i = 0; i < current.length; i++) {
            var miss = current[i];
            if (!miss.isComplete()) return false;
        }
        return true;
    }
    module._changeConfig = function(newConfig) {
        $.extend(config, newConfig);
    }
    module._setCurrent = function(ids) {
        if (typeof ids === 'number') ids = [ids];
        
        current = [];
        ids.forEach(function(id) {
            current.push(module.getMission(id))
        })
        
        saveToStore();
        
        return current;
    }
    
    function newMissions() {
        current = [];
        for (var i = 0; i < config.missionsPerDay; i++) {
            var rnd = Math.rand(0, missions.length - 1);
            var mis = new Mission(missions[rnd])
            if (uniqMission(mis)) {
                current.push(mis);
            } else {
                i--;
            }
        }
        lastUpdate = Date.now();
        updateTime = null;
        saveToStore();
        $(document).trigger('missions.new_missions');
        
        function uniqMission(mission) {
            for (var i = 0; i < current.length; i++) {
                var miss = current[i];
                if (miss.raw.id === mission.raw.id) return false;
            }
            
            return true;
        }
    }
    function saveToStore() {
        var store = {};
        store.current = current.map(function(miss) {
            return {
                steps: miss.steps,
                currStep: miss.currStep,
                id: miss.raw.id
            }
        });
        store.lastUpdate = lastUpdate;
        store.updateTime = updateTime;
        
        saveStatistic('missions', store);
    }
    function updateInMenu() {
        var $container = $('#menu-missions #missions-list');
        $container.empty();
        
        var markup = "<li class='mission{{if currStep >= steps}} completed{{/if}}{{if raw.condition}} condition{{/if}}' data-missionid='${raw.id}'><span class='mission-description'>${description}</span><span class='mission-progress'>${parseInt(currStep * 100 / steps)}%</span></li>";
        
        $.template('missionsTemplate', markup);
        var $miss = $.tmpl('missionsTemplate', current);
        $container.append($miss);
        
        if (Missions.isAllComplete() && config.notify && !updateTime) {
            $.notify({
                message: _t('missions.all_complete', 'All missions completed'),
            }, {
                status: 'success'
            })
            
            if (config.newMissionsAfterComplete) {
                updateTime = Date.now() + config.updateKD;
                
                $container.append('<li class="mission timer" id="mission-update_timer" data-time='+(updateTime)+'></li>');
                saveToStore();
                
                LOG.log({
                    action: 'All missions complete',
                })
            }
            
            if (config.allCompleteReward) {
                if (config.allCompleteReward.money) {
                    Player.doubleBalance += config.allCompleteReward.money;
                    saveStatistic('doubleBalance', Player.doubleBalance);
                }
                if (config.allCompleteReward.exp) {
                    Level.addEXP(config.allCompleteReward.exp)
                }
            }
        } else if (updateTime) {
            $container.append('<li class="mission timer" id="mission-update_timer" data-time='+(updateTime)+'></li>');
            updateTimer();
        }
    }
    function updateTimer() {
        var $el = $('#mission-update_timer');
        
        if (parseInt($el.data('time')) > Date.now()) {
            var ramaining = getTimeRemaining(parseInt($el.data('time')));
            
            $el.text(ramaining.minutes + ':' + ramaining.seconds);
            
            setTimeout(function() { updateTimer() }, 1000);
        } else {
            newMissions();
            updateInMenu();
        }
    }
    function getTimeRemaining(endtime) {
        if (typeof endtime === 'number') {
            var t = new Date(endtime) - Date.now();
        }
        else {
            var t = Date.parse(endtime) - Date.parse(new Date());
        }
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
            'total': t
            , 'days': days
            , 'hours': hours
            , 'minutes': minutes
            , 'seconds': seconds
        };
    }
        
    // Mission Class
    function Mission(mission) {
        mission = mission || {};
        
        if (mission.raw) {
            this.raw = mission.raw;
        } else {
            this.raw = mission;
        }
        
        this.description = this.raw.description ? this.raw.description[Settings.language] || this.raw.description.EN : '';
        this.condition = this.raw.condition ? this.raw.condition[Settings.language] || this.raw.condition.EN : '';
        
        this.steps = mission.steps || mission.times || 1;
        this.currStep = mission.currStep || 0;
    }
    Mission.prototype.step = function(step) {
        step = step || 1;
        
        this.currStep += step;
        if (this.currStep > this.steps) this.currStep = this.steps;
        $(document).trigger('missions.step', this.raw);
        if (this.currStep === this.steps) this._complete();
        saveToStore();
        updateInMenu();
    }
    Mission.prototype.reset = function() {
        this.currStep = 0;
        $(document).trigger('missions.reset', this.raw);
    }
    Mission.prototype.getProgress = function() {
        return this.currStep * 100 / this.steps;
    }
    Mission.prototype.isComplete = function() {
        return this.currStep >= this.steps;
    }
    Mission.prototype.reset = function() {
        this.currStep = 0;
        saveToStore();
        updateInMenu();
        LOG.log({
            action: 'Mission reset',
            mission: {
                id: this.raw.id,
                description: this.description
            }
        })
        return;
    }
    Mission.prototype.fail = function(act) {
        if (this.raw.inARow && /lose|win/i.test(this.raw.event) && /lose|win/i.test(act.event) ) {
            this.reset();
        }
    }
    Mission.prototype._complete = function() {
        if (this.raw && this.raw.reward) {
            var reward = this.raw.reward;
            if (reward.exp) {
                Level.addEXP(reward.exp);
            }
            if (reward.money) {
                Player.doubleBalance += reward.money;
                saveStatistic('doubleBalance', Player.doubleBalance);
            }
            $(document).trigger('missions.complete', this.raw);
            
            try {
                if (config.notify) {
                    $.notify({
                        title: _t('other.mission_complete', 'Mission complete'),
                        message: this.description
                    }, {
                        type: 'success'
                    })
                }
                
                var completeCount = JSON.parse(getStatistic('missions-completed', '{}'));
                if (completeCount[this.raw.id] != null) 
                    completeCount[this.raw.id]++;
                else
                    completeCount[this.raw.id] = 1;
                saveStatistic('missions-completed', completeCount);
                
                LOG.log({
                    action: 'Mission complete',
                    mission: {
                        id: this.raw.id,
                        description: this.description
                    }
                })
            } catch (e) {}
        }
    }
    
    module.Mission = Mission;
    return module;
})();