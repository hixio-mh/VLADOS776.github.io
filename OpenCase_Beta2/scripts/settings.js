// ===== PROGRAM SETTINGS =====
var DAILY_REWARD_POINTS = 5,
    OPEN_CASE_REWARD_POINTS = 1,
    GAME_WIN_REWARD_POINTS = 2,
    //FREE_CASE_INTERVAL_MS = 300000;
    FREE_CASE_INTERVAL_MS = 1.8e+6; //30 минут

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

//isNaN check
if (isNaN(Player.doubleBalance)) Player.doubleBalance = 10000;
if (isNaN(Player.points)) Player.points = 1;


Settings.language = getStatistic("settings_language", 'EN');
Settings.sounds = getStatistic("settings_sounds", 'true') === 'true';
Settings.drop = getStatistic("settings_drop", 'false') === 'true';

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
var Ranks = [{
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
        exp = exp || isNaN(Player.points) ? 5 : Player.points;
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
