var openCase = {
    caseId: 0,
    caseType: 'weapons',
    souvenir: false,
    caseOpening: false,
    win: {},
    status: 'init',
    casesCarusel: null,
    scrollSoundOpt: null,
    items: [],
    caseInfo: {},
    special: false,
    linesCount: 1,
    isFree: function () {
        var freeCase = parseInt(getStatistic('free-case-opening', -1));
        
        return this.caseId === freeCase;
    },
    casePrice: function() {
        if (openCase.caseType == 'weapons') {
            var casePrice = cases[this.caseId].price || parseFloat(getCasePrice(openCase.caseId, openCase.souvenir))*100;
        } else if (openCase.caseType == 'graffiti') {
            var casePrice = GRAFFITI_BOX[this.caseId].price || parseFloat(getGraffitiBoxPrice(openCase.caseId))*100;
        } else if (openCase.caseType == 'capsules') {
            var casePrice = CAPSULES[this.caseId].price || parseFloat(getCapsulePrice(openCase.caseId))*100;
        }
        casePrice *= this.linesCount;
        return casePrice;
    },
    rareItemsRegExp: new RegExp('(rare|extraordinary)' ,'i'),
    init: function() {
        $(function() {
            $('.openCase').prop('disabled', true);
            
            openCase.casesCarusel = document.getElementById('casesCarusel');
            
            var param = parseURLParams(window.location.href);
            if(typeof param != "undefined") {
                if (param.caseId) {
                    openCase.caseId = parseInt(param.caseId[0]);
                    openCase.caseInfo = cases[openCase.caseId];
                } else if (param.capsuleId) {
                    openCase.caseId = parseInt(param.capsuleId[0]);
                    openCase.caseType = 'capsules';
                    openCase.caseInfo = CAPSULES[openCase.caseId];
                } else if (param.graffitiId) {
                    openCase.caseId = parseInt(param.graffitiId[0]);
                    openCase.caseType = 'graffiti';
                    openCase.caseInfo = GRAFFITI_BOX[openCase.caseId];
                }
                try {
                    openCase.special = openCase.caseInfo.type == "Special";
                    openCase.souvenir = param.souvenir ? param.souvenir[0] == 'true' : false;
                    
                    if (getURLParameter('fromAd') == '1' || openCase.isFree()) {
                        $('#linesCount').prop('disabled', true);
                    }
                } catch(e) {}
                $("#youCanWin").data('loc-var', {1: openCase.caseInfo.name})
 
                var opened = getStatistic("case-"+openCase.caseInfo.name, 0);
                $("#opened").text(opened);

                document.title = "Открытие кейса — " + openCase.caseInfo.name;

                $(document).on('localizationloaded', function() {
                    $('.openCase').prop('disabled', false);
                    
                    if (!openCase.isFree() && Player.doubleBalance < openCase.casePrice()) {
                        $(".openCase").prop("disabled", true);
                    }
                    
                    var itemArray = [];
                    if (openCase.caseInfo.weapons)
                        itemArray = getWeaponsById(openCase.caseInfo.weapons);
                    if (openCase.caseInfo.knives)
                        itemArray = itemArray.concat(getItemsByID(openCase.caseInfo.knives));
                    if (openCase.caseInfo.stickers)
                        itemArray = itemArray.concat(getItemsByID(openCase.caseInfo.stickers, 'sticker'));
                    if (openCase.caseInfo.graffiti)
                        itemArray = itemArray.concat(getItemsByID(openCase.caseInfo.graffiti, 'graffiti'));

                    if (itemArray.length == 0) {
                        if (openCase.caseInfo.regExp) {
                            var rg = openCase.caseInfo.regExp;
                            for (var i = 0; i < Items[openCase.caseType].length; i++) {
                                var item = getItemByID(Items[openCase.caseType][i].id, openCase.caseType);
                                if (RegExp(rg.reg).test(item[rg.param])) {
                                    if (!openCase.special || (openCase.special && (!item.can || item.can.specialCase)))
                                        itemArray.push(item);
                                }
                            }
                        }
                    }
                    
                    openCase.items = itemArray;
                    openCase.fillCarusel();
                    
                });
                $(document).on('localizationfinished', function() {
                    if (!openCase.isFree())
                        $('.openCase').append(' $' + (openCase.casePrice()/100));
                })
            }
            
            $('#what-i-can-win-Button').on('click', function(){openCase.whatInCase()});
            
            $(document).on("click", ".double_sell", function() {
                var id = $(this).data('id');
                deleteWeapon(id);

                var doublePoints = parseInt($(this).text());
                Player.doubleBalance += doublePoints;
                saveStatistic('doubleBalance', Player.doubleBalance);
                $(this).prop("disabled", true);
                $(this).parent().parent().addClass("sold-out big");
                Sound("buy");
                if (isAndroid()) {
                    client.sendToAnalytics("Open case", "Selling weapon", "Player has sold weapon for double points", doublePoints + " double points");
                }
                
                if (Player.doubleBalance > openCase.casePrice() && !openCase.special) {
                    $(".openCase").prop("disabled", false);
                }
                
                LOG.log({
                    action: 'Sell opened item',
                    case: {
                        name: cases[openCase.caseId].name,
                        id: openCase.caseId
                    },
                    item: {
                        item_id: openCase.win.item_id,
                        type: !openCase.caseType || openCase.caseType == 'weapons' ? openCase.win.type : '',
                        name: openCase.win.nameOrig
                    },
                    profit: doublePoints,
                    balance: Player.doubleBalance
                })
            });
            
            $('#linesCount').change(function() {
                if ($('.win').is(':visible')) {
                    openCase.backToZero(false);
                }
                openCase.setLines(parseInt($(this).val()));
            })
            
            $(document).on("click", ".openCase", function() {
                openCase.openCase();
            });
            
            $(document).on("click", ".closeCase", function() {
                window.location.replace("cases.html");
                caseOpening = false;
            });
            
            $(document).on('click', '.weaponsList .weapon', function() {
                var img = $(this).find('img');
                if (img && /rare\.png/.test(img.attr('src'))) {
                    $('.weaponsList').empty();
                    openCase.whatInCase(false, false);
                }
            });
        })
    },
    goToCase: function(caseId, souvenir) {
        if (typeof cases[caseId].minLvl != 'undefined' && Level.myLvl() < cases[caseId].minLvl) {
            $("#modal-rank").modal('show');
            $(".modal-body i").html(cases[caseId].minLvl);
            return false;
        }
        if (cases[caseId].type == "Special") {

            if (parseInt(getStatistic('specialCases', 0)) >= cases[caseId].casesToOpen) {
                window.location.replace("open.html?caseId=" + caseId + ((souvenir) ? "&souvenir=" + souvenir : ''));
            } else {
                $('#modal-special').modal();
                
                var needToOpen = cases[caseId].casesToOpen - parseInt(getStatistic('specialCases', 0));
                $('.modal-body i').text(needToOpen);
                $('#showVideoAd').data();
                $('.js-secretField').text(caseId);
            }
        } else {
            window.location.replace("open.html?caseId=" + caseId + ((souvenir) ? "&souvenir=" + souvenir : ''));
        }
    },
    goToGraffiti: function(caseId, souvenir) {
        if (typeof GRAFFITI_BOX[caseId].minLvl != 'undefined' && Level.myLvl() < GRAFFITI_BOX[caseId].minLvl) {
            $("#modal-rank").modal('show');
            $(".modal-body i").html(GRAFFITI_BOX[caseId].minLvl);
            return false;
        }
        if (GRAFFITI_BOX[caseId].type == "Special") {

            if (parseInt(getStatistic('specialCases', 0)) >= GRAFFITI_BOX[caseId].casesToOpen) {
                window.location.replace("open.html?caseId=" + caseId + ((souvenir) ? "&souvenir=" + souvenir : ''));
            } else {
                $('#modal-special').modal();
                
                var needToOpen = GRAFFITI_BOX[caseId].casesToOpen - parseInt(getStatistic('specialCases', 0));
                $('.modal-body i').text(needToOpen);
                $('#showVideoAd').data();
                $('.js-secretField').text(caseId);
            }
        } else {
            window.location.replace("open.html?graffitiId=" + caseId);
        }
    },
    goToCapsule: function(caseId, souvenir) {
        $("#rank-popup").css('display', 'none');
        $('#special-popup').css('display', 'none');
        if (typeof CAPSULES[caseId].minLvl != 'undefined' && Level.myLvl() < CAPSULES[caseId].minLvl) {
            $("#rank-popup").css('display', 'block');
            $("[data-loc='low_level'] i").html(CAPSULES[caseId].minLvl);
            return false;
        }
        if (CAPSULES[caseId].type == "Special") {

            if (parseInt(getStatistic('specialCases', 0)) >= CAPSULES[caseId].casesToOpen) {
                window.location.replace("open.html?capsuleId=" + caseId);
            } else {
                $('#special-popup').css('display', 'block');
                var needToOpen = CAPSULES[caseId].casesToOpen - parseInt(getStatistic('specialCases', 0));
                $('[data-loc="need_more_cases"] i').text(needToOpen);
                $('#showVideoAd').data();
                $('.js-secretField').text(caseId);
            }
        } else {
            window.location.replace("open.html?capsuleId=" + caseId);
        }
    },
    fillCarusel: function(caseId, selector) {
        caseId = caseId || openCase.caseId;
        selector = selector || "#casesCarusel";
        var itemArray = openCase.items;
        
        var caseItems = {
            win: {},
            weight: {
                rare:       2,      // exotic для стикеров
                covert:     10,     
                classified: 15,     // remarkable для стикеров
                restricted: 25,
                milspec:    50,     // high для стикеров
                industrial: 60,
                consumer:   70
            }
        };
        caseItems.consumer = itemArray.filter(function(weapon) {
            return weapon.rarity == 'consumer'
        }).mul(7).shuffle();
        caseItems.industrial = itemArray.filter(function(weapon) {
            return weapon.rarity == 'industrial'
        }).mul(7).shuffle();
        caseItems.milspec = itemArray.filter(function(weapon) {
            return weapon.rarity.match(/(milspec|high)/);
        }).mul(5).shuffle();
        caseItems.restricted = itemArray.filter(function(weapon) {
            return weapon.rarity == 'restricted'
        }).mul(5).shuffle();
        caseItems.classified = itemArray.filter(function(weapon) {
            return weapon.rarity.match(/(classified|remarkable)/)
        }).mul(4).shuffle();
        caseItems.covert = itemArray.filter(function(weapon) {
            return weapon.rarity == 'covert'
        }).mul(1).shuffle();
        
        caseItems.rare = itemArray.filter(function(weapon) {
            return (weapon.rarity.match(/(rare|extraordinary|exotic)/))
        }).mul(1).shuffle();
        
        if (caseItems.consumer.length + caseItems.industrial.length + caseItems.milspec.length + caseItems.restricted.length + caseItems.classified.length + caseItems.covert.length == 0 && caseItems.rare.length > 0) {
            caseItems.all = caseItems.rare;
        } else {
            caseItems.all = caseItems.consumer.concat(caseItems.industrial, caseItems.milspec, caseItems.restricted, caseItems.classified, caseItems.covert);
        }
        
        /* === Select the rarity of the win item === */
        
        var total_weights = (function(weight){
            var a = 0;
            for (key in weight) {
                a += Number(weight[key]);
            }
            return a;
        })(caseItems.weight);
        
        while (typeof caseItems.win == 'undefined' || $.isEmptyObject(caseItems.win)) {
            var rnd = Math.rand(0, total_weights);
            var weight_sum = 0;

            for (var i = 0; i < Object.keys(caseItems.weight).length; i++) {
                weight_sum += caseItems.weight[Object.keys(caseItems.weight)[i]];
                weight_sum = +weight_sum.toFixed(2);

                if (rnd <= weight_sum) {
                    caseItems.win = caseItems[Object.keys(caseItems.weight)[i]];
                    caseItems.win = caseItems.win[Math.floor(Math.random()*caseItems.win.length)];
                    break;
                }
            }
        }
        
        caseItems.all = caseItems.all.shuffle().shuffle();
    
        while (caseItems.all.length <= (winNumber + 3)) {
            caseItems.all = caseItems.all.concat(caseItems.all).shuffle().shuffle();
        }

        if (caseItems.all.length > winNumber + 3)
            caseItems.all.splice(winNumber + 3, caseItems.all.length - (winNumber + 3));
        
        
        caseItems.all[winNumber] = caseItems.win;
        
        for(var i = 0; i < caseItems.all.length; i++) {
            var id = caseItems.all[i].id || caseItems.all[i].item_id || 0;
            caseItems.all[i] = new Item(id, openCase.caseType);
            if (caseItems.all[i].itemType == 'weapon')
                if (!openCase.souvenir) {
                    caseItems.all[i].stattrakRandom();
                } else {
                    caseItems.all[i].stattrak = false;
                    caseItems.all[i].souvenir = true;
                }
        }
        
        var el = '';
        if (caseItems.all[winNumber].itemType === 'weapon') {
            caseItems.all[winNumber].qualityRandom();
            caseItems.all[winNumber].patternRandom();
        }
        caseItems.all.forEach(function(item, index) {
            
            var $item = $(item.toLi({ticker: false, limit: false}));

            if (openCase.rareItemsRegExp.test(item.rarity)) {
                $item.find('.type span').text('★ Rare Special Item ★');
                $item.find('.name span').html('&nbsp;');
                $item.find('img').attr('src', '../images/Weapons/rare.png');
            }
            el += $item.wrap('<p/>').parent().html();;
        })
        
        openCase.win[selector] = caseItems.all[winNumber];
        $(selector).html(el);
        $(selector).css("margin-left", "0px");
    },
    openCase: function() {
        if (openCase.caseOpening || $(".openCase").text() == Localization.getString('open_case.opening', 'Opening...')) {
            return false
        };
                
        $(".win").removeClass("sold-out");
        
        $(".win").slideUp("slow");
        if ($(".openCase").text().match(Localization.getString('open_case.try_again', 'Open again'))) {
            openCase.backToZero();
            $(".openCase").text(Localization.getString('open_case.open_case', 'Open case'));
            return false;
        }
        
        if (Player.doubleBalance < openCase.casePrice() && !openCase.isFree()) {
            $.notify({
                message: Localization.getString('open_case.not-enough-money', 'Not enough money')
            }, {
                type: 'danger'
            })
            return false;
        }
        
        $(".openCase").text(Localization.getString('open_case.opening', 'Opening...'));
        $(".openCase").attr("disabled", "disabled");
        
        $("#linesCount").prop("disabled", true);
        
        if (!openCase.isFree()) {
            Player.doubleBalance -= openCase.casePrice();
        } 
        
        Player.doubleBalance = Player.doubleBalance > 0 ? Player.doubleBalance : 0;
        
        saveStatistic('doubleBalance', Player.doubleBalance);
        
        openCase.startScroll();
    },
    startScroll: function() {
        this.scrollToElement("#aCanvas");
        var a = 127 * winNumber;
        var l = 131;
        var d = 0,
            s = 0;
        var duration = (Settings.drop) ? 5 : 10,
            marginLeft = -1 * Math.rand(a - 50, a + 60);

        $('.casesCarusel').css({
            'transition': 'all ' + duration + 's cubic-bezier(0.07, 0.49, 0.39, 1)',
            'margin-left': marginLeft + 'px'
            })
        Sound("open", "play", 5);
        
        openCase.status = 'scrolling';
        openCase.scrollSound(marginLeft, (duration*1000));
        
        (function() {
            this.count = 0;
            
            this.next = function() {
                var currItem = openCase.win[Object.keys(openCase.win)[this.count]];
                
                currItem.new = true;
                saveItem(currItem).then(function(result) {
                    var quality = currItem.itemType == 'weapon' ? currItem.qualityText() : '';
                    $('#win_template').tmpl({
                        you_won: Localization.getString('open_case.you_won', "You won"),
                        sell: Localization.getString('open_case.sell', "Sell"),
                        name: currItem.titleText(),
                        quality: quality,
                        img: currItem.getImgUrl(true),
                        price: currItem.price,
                        price_coins: Math.round(currItem.price * 100),
                        inventory_id: result,
                        itemType: currItem.itemType
                    }).appendTo('.win');
                    
                    statisticPlusOne('weapon-' + currItem.rarity);
                    if (currItem.stattrak)
                        statisticPlusOne('statTrak');
                    
                    Level.addEXP(1);
                    statisticPlusOne('case-' + openCase.caseInfo.name);
                    
                    this.count++;
                    if (this.count < openCase.linesCount) 
                        this.next();
                    else
                        return;
                });
                
            }
            this.next();
        })()
        
        if (openCase.isFree()) {
            saveStatistic('free-case-opening', '-1');
            
            saveStatistic('free-case-timeout', Date.now() + FREE_CASE_INTERVAL_MS);
        }

        var anim = document.getElementById('casesCarusel');
        anim.addEventListener("transitionend", openCase.endScroll, false);
        anim.addEventListener("webkitTransitionEnd", openCase.endScroll, false);
    },
    endScroll: function() {
        if (openCase.status == 'scrollBack')
            return false;
        $("#opened").text((parseInt($("#opened").text()) + openCase.linesCount));                        

        $("#double_sell_button").prop("disabled", false);
        Sound("close", "play", 5);
        
        $(".openCase").text(Localization.getString('open_case.try_again', 'Open again'));
        $(".openCase").append(' $' + (openCase.casePrice() / 100).toFixed(2));
        //$(".win").slideDown("fast");
        $('.win').show();
        openCase.caseOpening = false;
        $(".openCase").prop("disabled", false);
        if (openCase.caseInfo.type != 'Special')
            $("#linesCount").prop("disabled", false);
        
        openCase.scrollToElement(".win");
        
        openCase.status = 'endScroll';
        
        if (Player.doubleBalance < openCase.casePrice()) {
            $(".openCase").prop("disabled", true);
        }
        
        var winItems = Object.keys(openCase.win).map(function(key) {
            var itm = openCase.win[key];
            var obj = itm.saveObject();
            delete obj.new;
            obj.name = itm.titleText();
            obj.price = itm.price;
            return obj;
        })
        
        LOG.log({
            action: 'Open Case',
            case: {
                name: openCase.caseType === 'capsules' ? CAPSULES[openCase.caseId].name : cases[openCase.caseId].name,
                id: openCase.caseId,
                free: openCase.isFree()
            },
            items: winItems
        })
        
        for (var key in openCase.win) {
            customEvent({ type: 'case', event: 'open', caseId: openCase.caseId, item_id: openCase.win[key].item_id })
        }

        //Statistic
        
        var param = parseURLParams(window.location.href);
        if (typeof param != "undefined") {
            var fromAd = 0;
            try {
                fromAd = parseInt(param.fromAd[0]);
            } catch (e) {}

            if (openCase.special) {
                if (!fromAd) {
                    var need = parseInt(getStatistic('specialCases', 0)) - cases[openCase.caseId].casesToOpen;
                    need = (need < 0) ? 0 : need;
                    saveStatistic('specialCases', need);
                }
                if (getStatistic('specialCases', 0) < cases[openCase.caseId].casesToOpen)
                    $('.openCase').attr("disabled", "disabled");
            } else {
                var need = parseInt(getStatistic('specialCases', 0));
                saveStatistic('specialCases', (need + openCase.linesCount));
            }
        } else {
            statisticPlusOne('specialCases');
        }
    },
    backToZero: function(open) {
        open = typeof open == 'undefined' ? true : open;
        openCase.status = 'scrollBack';
        $(".casesCarusel").children(".weapon").addClass("animated fadeOutDown");
        $('.casesCarusel').css({
            'transition': 'all 0.9s cubic-bezier(0.07, 0.49, 0.39, 1)',
            'margin-left': '0px'
        });
        $(".win").slideUp("slow");
        $('.openCase').prop("disabled", true);
        $('#linesCount').prop("disabled", true);
        openCase.sleep(1000).then(function(){
            $(".casesCarusel").empty();
            $('.win').empty();
            openCase.fillCarusel();
            for (var i = 1; i < openCase.linesCount; i++) {
                openCase.fillCarusel(false, '#casesCarusel-'+i);
            }
            $('.openCase').prop("disabled", false);
            $('#linesCount').prop("disabled", false);
            if (open) openCase.openCase();
        })
    },
    scrollSound: function (offset, speed) {
        openCase.scrollSoundOpt = {
            start: openCase.casesCarusel.getBoundingClientRect().left,
            count: 0
        };
        
        try{
            if (openCase.status == 'scrolling') {
                window.requestAnimationFrame(playScrollSound);
            }
        } catch(e){}

        function playScrollSound() {
            var left = openCase.casesCarusel.getBoundingClientRect().left;
            left -= openCase.scrollSoundOpt.start;
            left += 131 * 1.5;
            
            if (-1*left - 131 * openCase.scrollSoundOpt.count > 0) {
                ++openCase.scrollSoundOpt.count;
                Sound('scroll');
            }
            
            if (openCase.status == 'scrolling')
                window.requestAnimationFrame(playScrollSound);
        }
        
    },
    setLines: function(count) {
        count = count || 1;
        if (count > 5) count = 5;
        
        var $parent = $('#casesCarusel');
        $('.casesCarusel').not(':first').remove();
        
        this.win = {};
        
        this.fillCarusel();
        
        for (var i = 1; i < count; i++) {
            var $newLine = $parent.clone();
            $newLine.attr('id', 'casesCarusel-'+i);
            $newLine.addClass("animated fadeIn");
            
            $('#aCanvas').append($newLine);
            this.fillCarusel(false, '#casesCarusel-'+i);
        }
        $('#caruselOver').css('height', 137*count + 3 * count);
        this.linesCount = count;
        
        $(".openCase").text(Localization.getString('open_case.open_case', 'Open Case'));
        $(".openCase").append(' $' + (openCase.casePrice() / 100).toFixed(2));
    },
    whatInCase: function(caseId, hideRare) {
        caseId = caseId || openCase.caseId;
        hideRare = hideRare == null ? true : hideRare;
        var rare = false;
        var itemsArray = openCase.items;
        
        for (var i = 0; i < itemsArray.length; i++) {
            var item = new Item(itemsArray[i], openCase.caseType);
            if (openCase.rareItemsRegExp.test(item.rarity) && rare == true)
                continue;
            var img = item.getImgUrl();
            
            var $weaponInfo = $(item.toLi({ limit: false })).addClass('animated flipInX');

            if (openCase.rareItemsRegExp.test(item.rarity) && hideRare) {
                rare = true;
                $weaponInfo.find('.type span').text('★ Rare Special Item ★');
                $weaponInfo.find('.name span').html('&nbsp;');
                $weaponInfo.find('img').attr('src', '../images/Weapons/rare.png');
            }
            
            $(".weaponsList").append($weaponInfo);
        }
        $(".weaponsList").css("display", "block");
        $("#youCanWin").css("display", "block");
        $('#what-i-can-win-Button').css('display', 'none');
    },
    sleep: function(time) {
        return new Promise(function(resolve) {
            setTimeout(resolve, time)
        });
    },
    scrollToElement: function(selector) {
        var offset = $(selector).get(0).offsetTop;
        if (offset == 0) return;

        $('.weapons').animate({
            scrollTop: offset
        }, 200);
    }
}