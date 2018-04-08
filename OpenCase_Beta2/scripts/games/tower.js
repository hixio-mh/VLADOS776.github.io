Game = Game || {};

Game.Tower = (function(module) {
    
    var $field = $('#game_field');
    
    var config = {
        easy: {
            row: 10,
            column: 3,
            bombs: 1,
            multiply: 1.45
        },
        medium: {
            row: 10,
            column: 2,
            bombs: 1,
            multiply: 1.95
        },
        hard: {
            row: 10,
            column: 3,
            bombs: 2,
            multiply: 2.95
        },
        hiddenDiff: [
            {
                bet: 2000,
                diff: 'hard',
                row: 8,
                column: 3,
                bombs: 2,
                multiply: 2.95
            },
            {
                bet: 17000,
                diff: 'hard',
                row: 6,
                column: 3,
                bombs: 2,
                multiply: 2.95
            },
            {
                bet: 151000,
                diff: 'hard',
                row: 3,
                column: 3,
                bombs: 2,
                multiply: 2.95
            },
        ],
        minBet: 100,
        maxBet: 500000,
        good: 'Cool',
        bad: 'Lose'
    }
    var currGame = {};
    var field = {};
    
    module.init = function() {
        currGame = {
            difficulty: 'easy',
            bet: 100,
            line: 0,
            started: false
        }
        module.drawField();
        
        $('#start_game').on('click', function() {
            if (currGame.started) {
                cashout();
            } else {
                startGame();
            }
        });
        $(document).on('click', '.tower-button', btnClick);
        $('.bet-change').on('click', changeBet);
        $('#bet').on('change', betFieldChange);
        $('.diff').on('click', changeDiff);
    }
    
    module.drawField = function(conf) {
        conf = conf || config[currGame.difficulty];
        
        var bet = conf.bet || currGame.bet;
        
        var fieldHTML = '';
        
        config.hiddenDiff.forEach(function(diff) {
            if (diff.bet && bet >= diff.bet) {
                if (diff.diff && currGame.difficulty == diff.diff) {
                    conf = diff;
                }
            }
        })
        
        for (var y = conf.row; y > 0; y--) {
            fieldHTML += '<div class="tower-line active" data-line="' + y + '">';
            for (var x = 1; x < conf.column + 1; x++) {
                var reward = parseInt((conf.multiply * y * bet).toFixed(0));
                fieldHTML += '<button class="tower-button" data-pos="'+y+','+x+'">' + getCellPoints(y) + '</button>';
            }
            fieldHTML += '</div>';
        }
        $field.html(fieldHTML);
    }
    module.changeDiff = function(diff) {
        if (currGame.started) return false;
        
        if (currGame.difficulty !== diff) {
            currGame.difficulty = diff;
            module.drawField();
        }
    }
    
    function changeDiff() {
        if (currGame.started) return false;
        
        var newDiff = $(this).data('diff');
        if (config[newDiff]) {
            module.changeDiff(newDiff);
            
            $('.diff.active').removeClass('active');
            $(this).addClass('active');
        }
    }
    function changeBet() {
        if (currGame.started) return;
        
        var newBet = $('#bet').val();
        switch($(this).attr('id')) {
            case 'bet-min':
                newBet = config.minBet;
                break;
            case 'bet-minus':
                newBet = parseInt(newBet / 2);
                if (newBet < config.minBet) newBet = config.minBet;
                break;
            case 'bet-plus':
                newBet *= 2;
                if (newBet > config.maxBet) newBet = config.maxBet;
                break;
            case 'bet-max':
                newBet = config.maxBet;
                break;
        }
        $('#bet').val(newBet);
        $('#bet').trigger('change');
    }
    function betFieldChange() {
        var newBet = $(this).val();
        
        var bet = parseInt($('#bet').val());
        
        if (isNaN(bet) || bet < config.minBet || bet > config.maxBet) {
            $.notify({
                message: _t('tower.wrong_bet', 'Bet must be in a range ${minBet} - ${maxBet}').replace('${minBet}', config.minBet).replace('${maxBet}', config.maxBet)
            }, {
                type: 'danger'
            })
            return;
        }
        
        currGame.bet = bet;
        
        module.drawField();
    }
    
    function startGame() {
        var bet = parseInt($('#bet').val());
        
        if (isNaN(bet) || bet < config.minBet || bet > config.maxBet) {
            $.notify({
                message: _t('tower.wrong_bet', 'Bet must be in a range ${minBet} - ${maxBet}').replace('${minBet}', config.minBet).replace('${maxBet}', config.maxBet)
            }, {
                type: 'danger'
            })
            return;
        }
        
        if (bet > Player.doubleBalance) {
            $.notify({
                message: _t('tower.not_enought_money', 'Not enough money')
            }, {
                type: 'danger'
            })
            return;
        }
        
        currGame.bet = bet;
        currGame.started = true;
        currGame.line = 1;
        currGame.profit = bet;
        
        Player.doubleBalance -= bet;
        saveStatistic('doubleBalance', Player.doubleBalance);
        
        module.drawField();
        fullField();
        
        $('#start_game').text(_t('tower.take', 'Take ${coins} coins').replace('${coins}', currGame.bet))
        
        $('.tower-line.active').removeClass('active');
        $('.tower-line[data-line="1"]').addClass('active');
    }
    function fullField() {
        var conf = config[currGame.difficulty];
        
        field = {};
        
        for (var x = 1; x < conf.row + 1; x++) {
            var bombs = conf.bombs;
            var set = 0;
            
            if (conf.column - bombs == 2) {
                var bombPos = Math.rand(1, conf.column);
                
                field[x+','+bombPos] = 1;
                set = 0;
            } else if (conf.column - bombs == 1) {
                var emptyPos = Math.rand(1, conf.column);
                
                field[x+','+emptyPos] = 0;
                set = 1;
            }
            
            for (var y = 1; y < conf.column + 1; y++) {
                if (field[x+','+y] == null) {
                    field[x+','+y] = set;
                }
            }
        }
    }
    function btnClick() {
        if (!currGame.started) return;
        var clickPos = $(this).data('pos'),
            fieldPos = field[clickPos];
        if (parseInt(clickPos.split(',')[0]) != currGame.line) return false;
        
        if (fieldPos == 1) {
            $(this).html(config.bad);
            
            lose();
        } else if (fieldPos == 0) {
            $(this).html(config.good);
            
            currGame.profit = getCellPoints(currGame.line);
            
            $('#start_game').text(_t('tower.take', 'Take ${coins} coins').replace('${coins}', currGame.profit))
            nextLine();
        }
    }
    function cashout() {
        Player.doubleBalance += currGame.profit;
        
        saveStatistic('doubleBalance', Player.doubleBalance);
        
        openField();
        currGame.started = false;
        $('#start_game').text(_t('tower.play', 'Start game'));
    }
    function lose() {
            
        $('#start_game').text(_t('tower.play', 'Start game'));
        $('.tower-line').addClass('active');
        
        openField();
        currGame.started = false;
    }
    
    function nextLine() {
        currGame.line++;
        $('.tower-line[data-line="'+currGame.line+'"]').addClass('active');
    }
    
    function openField() {
        for (var pos in field) {
            if (field[pos] == 0) {
                $('.tower-button[data-pos="'+pos+'"]').html(config.good);
            }
        }
    }
    
    function getCellPoints(y) {
        var amount = currGame.bet * config[currGame.difficulty].multiply;
        if (y !== 1) {
            for (var i = 1; i < y; i++) {
                amount *= config[currGame.difficulty].multiply;
            }
        }
        
        return parseInt(amount);
    }
    
    module.getField = function() {
        return field;
    }
    
    return module;
})(Game.Tower || {})