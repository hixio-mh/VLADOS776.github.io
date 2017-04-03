var Minesweeper = (function() {
    
    var limits = {
        minBet: 100,
        maxBet: 10000,
        minMines: 1,
        maxMines: 24
    }
    
    var status = 'wait';
    
    var field = {};
    var fieldConfig = {
        row: 5,
        column: 5
    }
    
    var config = {
        bet: 100,
        mines: 1,
        steps: 0,
        total_reward: 0
    }
    
    var animElement = '<div class="animElement animated flipOutX"></div>';
    
    this.init = function() {
        $(document).on('click', '.square', function() {
            if (status !== 'game') return;
            if ($(this).hasClass('blank')) {
                config.steps++;
                $(this).removeClass('blank');
                
                var pos = $(this).attr('id').split(',');
                if (field[pos[0]][pos[1]] == 0) {
                    $(this).addClass('square-win');
                    $(this).html(animElement);
                    $(this).append('+'+calcReward(config.bet, config.mines, config.steps-1));
                    config.total_reward += calcReward(config.bet, config.mines, config.steps-1);
                    Sound('minesweeper.click');
                    field[pos[0]][pos[1]] = 2;
                } else {
                    $(this).addClass('square-lose');
                    
                    Sound('minesweeper.lose');
                    status = 'game over';
                    gameOver();
                    
                    LOG.log({
                        game: 'Minesweeper',
                        action: 'Lose',
                        balance: Player.doubleBalance
                    })
                }
                $('#next_reward').text(calcReward(config.bet, config.mines, config.steps));
                $('#total_reward').text(config.total_reward);
            }
        })
        
        $('#start_game').on('click', function() {
            Sound('interface.click');
            if (status !== 'wait') return;
            
            config.bet = parseInt($('#bet').val());
            config.mines = parseInt($('#mines').val());
            config.steps = 0;
            
            config.bet = isNaN(config.bet) ? 0 : config.bet;
            config.mines = isNaN(config.mines) ? 0 : config.mines;
            
            var max = Player.doubleBalance > limits.maxBet ? limits.maxBet : Player.doubleBalance;
            
            if (config.bet > max || config.bet < limits.minBet) {
                $.notify({
                    title: '<strong>Wrong Bet</strong>',
                    message: 'Bet must be in range ' + limits.minBet + ' - ' + limits.maxBet
                }, {
                    type: 'danger'
                })
                return;
            }
            
            if (config.mines < limits.minMines || config.mines > limits.maxMines) {
                $.notify({
                    title: '<strong>Wrong mines amout</strong>',
                    message: 'Mines must be in range ' + limits.minMines + ' - ' + limits.maxMines
                }, {
                    type: 'danger'
                })
                return;
            }
            
            Player.doubleBalance -= config.bet;
            saveStatistic('doubleBalance', Player.doubleBalance);
            
            newGame();
            
            status = 'game';
            $('.status').show();
            $('.config').hide();
            
            $('#cashout').show();
            $('#new_game').hide();
        })
        
        $('#cashout').on('click', function() {
            if (status !== 'game') return;
            
            Sound('minesweeper.coins');
            
            Player.doubleBalance += config.total_reward;
            saveStatistic('doubleBalance', Player.doubleBalance);
            
            if (config.total_reward > config.bet*1.5)
                Level.addEXP(2);
            
            status = 'game over';
            gameOver();
            
            LOG.log({
                game: 'Minesweeper',
                action: 'Cashout',
                reward: config.total_reward,
                balance: Player.doubleBalance
            })
        })
        
        $('#new_game').on('click', function() {
            status = 'wait';
            
            Sound('interface.click');
            
            $('.status').hide();
            $('.config').show();
        })
        
        newGame(config.mines);
    }
    
    function newGame(mines) {
        var fieldHTML = '';
        for (var row = 0; row < fieldConfig.row; row++) {
            for (var col = 0; col < fieldConfig.column; col++) {
                field[row] = field[row] || {};
                field[row][col] = 0;
                
                fieldHTML += "<div class='square blank' id='" + row + "," + col + "'></div>";
            }
        }
        $('.game_field').html(fieldHTML);
        
        for (var i = 0; i < config.mines; i++) {
            var rndRow = Math.rand(0, fieldConfig.row - 1);
            var rndCol = Math.rand(0, fieldConfig.column - 1);
            
            if (field[rndRow][rndCol] == 0)
                field[rndRow][rndCol] = 1;
            else
                --i;
        }
        
        config.total_reward = config.bet;
        
        $('#next_reward').text(calcReward(config.bet, config.mines, 0));
        $('#total_reward').text(config.total_reward);
        
        LOG.log({
            game: 'Minesweeper',
            action: 'New game',
            bet: config.bet,
            mines: mines,
            balance: Player.doubleBalance
        })
    }
    
    function gameOver() {
        var historyBlock = '<div class="history-game">';
        for (var row = 0; row < fieldConfig.row; row++) {
            for (var col = 0; col < fieldConfig.column; col++) {
                if (field[row][col] == 1) {
                    var $elem = $('#' + row + '\\,' + col);
                    $($elem).html(animElement);
                    $($elem).removeClass('blank');
                    if (!$elem.hasClass('square-lose'))
                        $($elem).addClass('bomb-hidden');
                    $($elem).append('<i class="fa fa-bomb"></i>');
                    historyBlock += '<div class="history-square history-bomb"></div>';
                } else if (field[row][col] == 2) {
                    historyBlock += '<div class="history-square history-opened"></div>';
                } else {
                    historyBlock += '<div class="history-square history-normal"></div>';
                }
            }
        }
        historyBlock += '</div>';
        
        $('#history').prepend(historyBlock);
        
        $('#cashout').hide();
        $('#new_game').show();
    }
    
    function calcReward(bet, mines, step) {
        var all = fieldConfig.row * fieldConfig.column + 1;
        var del = mines == 1 ? 6 : mines < 3 ? 4 : mines < 6 ? 3 : mines < 10 ? 2 : 1;
        return Math.round((bet * (all/(all - mines - step)) - bet)/del)
    }
    return this;
})();