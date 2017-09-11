var Upgrader = (function(module) {
    var bet = {},
        multiply = 1.5,
        newItem = null;
    
    var config = {
        error: 1, // Погрешность в стоимости.
        errorHight: 10, // Погрешность, если цена больше 100
        errorVeryHight: 200, // Погрешность, если цена больше 1000
        timer: 3000,
        historyItems: 10
    }
    
    var multiplies = {
        '1.5': 55,
        '2': 40,
        '5': 18,
        '10': 9
    }
    
    module.init = function() {
        $('#upgrade').prop('disabled', true);
        
        for (var mult in multiplies) {
            $('#multiplies').append('<button class="btn btn-primary '+ (mult != '1.5' ? 'btn-empty' : '')+' multiply" data-chance="' + multiplies[mult] + '">' + mult + 'x</button>')
        }
        
        $(document).on('click', '#selectItem2', function() {
            $('.js-loading-inventory').remove();
            fillInventory( { action: 'game', maxItems: 1 } );
        })
        
        $(document).on('click', '.choseItems', function() {
            var itemsCount = $(".inventoryItemSelected").length;
            var playerWeapons = [];
            var ids = [];
            Sound("click", "play");
            if (itemsCount != 0) {
                bet = { id: parseInt($(".inventoryItemSelected").data('id')) };

                getItem(bet.id).then(function(item) {
                    bet.item = item;
                    $(".inventoryList").css("display", "none");
                    $("#inventorySum").remove();
                    addItem(item);
                    findNewItem();
                    
                    $(".inventoryItemSelected").removeClass('inventoryItemSelected')
                    
                    $('.upgrader_animation').addClass('wait').removeClass('upgrade_win upgrade_lose');
                    
                    $('.upgrader_item').removeClass('empty');
                });
            }
        })
        
        $(document).on('click', '#upgrade', startUpgrade);
        $(document).on('click', '.multiply', function() {
            var newMultiply = parseFloat($(this).text());
            if (!multiplies[newMultiply]) return false;
            
            multiply = parseFloat(newMultiply);
            $('.multiply').addClass('btn-empty');
            $(this).removeClass('btn-empty');
            
            $('#chance-percent').text($(this).data('chance') + '%');
            
            if (bet.item) findNewItem();
        })
    }
    
    function addItem(item, n) {
        var selector = n ? '#newItem' : '#selectItem';
        
        var stickers = '';
        if (item.stickers) {
            item.stickers.forEach(function(sticker) {
                stickers += '<img src="' + sticker.getImgUrl() + '" class="sticker_sm">';
            })
        }
        
        $(selector).html('<span class="text-bold text-white">' + item.name +'</span> <span class="currency dollar text-bold text-white">' + item.price +'</span><br>' + item.qualityText() + '<br><img src="' + item.getImgUrl() + '">' + (stickers ? '<div>' + stickers + '</div>' : ''));
    }
    function findNewItem() {
        if (!bet.item || !multiply) return;
        newItem = null;
        
        var possiblePrice = bet.item.price * multiply,
            br = false,
            error = bet.item.price > 1000 ? config.errorVeryHight : bet.item.price > 100 ? config.errorHight : config.error;
        
        for (var id in Prices) {
            var item = Prices[id];
            if (!item.prices) continue;
            
            ['default', 'stattrak', 'souvenir'].forEach(function(type) {
                if (item.prices[type]) {
                    for (var quality in item.prices[type]) {
                        var price = (function() {
                            if (item.prices[type][quality].market > 0) return item.prices[type][quality].market;
                            if (item.prices[type][quality].analyst > 0) return item.prices[type][quality].analyst;
                            if (item.prices[type][quality].opskins > 0) return item.prices[type][quality].opskins;
                            return 0;
                        })()
                        
                        if (price >= possiblePrice && price <= possiblePrice + error && !br) {
                            newItem = new Item({ item_id: item.item_id, quality: parseInt(quality), stattrak: type === 'stattrak', souvenir: type === 'souvenir' });
                            if (bet.item.stickers && newItem.can.stickers) {
                                newItem.stickers = bet.item.stickers;
                            }
                            br = true;
                            break;
                        }
                    }
                }
            })
            if (br) break;
        }
        
        if (newItem) {
            newItem.new = true;
            addItem(newItem, true);
            $('#upgrade').prop('disabled', false);
        } else {
            $('#newItem').html(_t('upgrader.not_found', 'Can\' find simular skin. Please try another item or change multiply.'))
        }
    }
    function startUpgrade() {
        if (!bet.item || !multiply || !newItem || !multiplies[multiply]) return false;
        $('#upgrade').prop('disabled', true);
        $('#multiplies button').prop('disabled', true);
        $('#selectItem2').prop('disabled', true);
        
        deleteWeapon(bet.id);
        var isWin = Math.rand(0, 100) < multiplies[multiply];
        $('.upgrader_animation').removeClass('wait').addClass('process');
        
        for (var i = 0; i < 4; i++) {
            setTimeout(function() {
                Sound('minesweeper.click');
            }, i * 600)
        }
        
        setTimeout(function() {
            $('.upgrader_animation').removeClass('process');
            
            if (isWin) {
                $('.upgrader_animation').addClass('upgrade_win');
                newItem.history = { type: 'game', game: 'Upgrader' };
                saveItem(newItem);
                Sound('upgrader.success');
                
                customEvent({ type: 'game', game: 'upgrader', event: 'win', oldItem_id: bet.item.item_id, oldItem_price: bet.item.price, newItem_id: newItem.item_id, newItem_price: newItem.price, multiply: multiply })
                Level.addEXP(1);
                
                LOG.log({
                    action: 'Upgrade skin',
                    game: 'Upgrader',
                    multiply: multiply,
                    old: {
                        item_id: bet.item.item_id,
                        name: bet.item.titleText(),
                        price: bet.item.price
                    },
                    new: {
                        item_id: newItem.item_id,
                        name: newItem.titleText(),
                        price: newItem.price
                    }
                })
            } else {
                $('.upgrader_animation').addClass('upgrade_lose');
                Sound('minesweeper.lose');
                
                customEvent({ type: 'game', game: 'upgrader', event: 'lose', oldItem_id: bet.item.item_id, oldItem_price: bet.item.price, newItem_id: newItem.item_id, newItem_price: newItem.price, multiply: multiply })
                
                LOG.log({
                    action: 'Upgrade skin fail',
                    game: 'Upgrader',
                    multiply: multiply,
                    old: {
                        item_id: bet.item.item_id,
                        name: bet.item.titleText(),
                        price: bet.item.price
                    },
                    new: {
                        item_id: newItem.item_id,
                        name: newItem.titleText(),
                        price: newItem.price
                    }
                })
            }
            var historyObj = {
                item: {
                    price: bet.item.price,
                    img: bet.item.getImgUrl()
                },
                item2: {
                    price: newItem.price,
                    img: newItem.getImgUrl()
                },
                status: isWin ? 'success' : 'fail'
            }
            bet = {};
            
            $('#tmpl-history').tmpl(historyObj).prependTo('#history');
            
            $('#multiplies button').prop('disabled', false);
            $('#selectItem2').prop('disabled', false);
        }, config.timer)
    }
    
    return module;
})(Upgrader || {})