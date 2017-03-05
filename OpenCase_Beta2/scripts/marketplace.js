
var Sales = [],
    weaponsOnSale = 6,
    minPriceForSale = 15,
    discount = 15;

$(function() {
    $("#buy_count").change(function() {
        var count = $("#buy_count").val();
        count = count == "" ? "1" : count;
        if (!count.match(/(\d+)/g)) return false;
        count = parseInt(count.match(/(\d+)/g).toString().replace(/\,/g, ''));
        count = count <= 0 ? 1 : count > 100 ? 100 : count;
        $("#buy_count").val(count);
        var newPrice = $("#weaponPrice").text();
        newPrice = isNaN(parseInt(newPrice[0])) ? newPrice.substr(1, newPrice.length - 1) : newPrice;
        newPrice = parseFloat(newPrice) * 100 * count;
        $("#buy-double span").html(newPrice.toFixed(0));
    });
    
    $("#search_text").on('keydown', function (event) {
        if (event.keyCode == 13) {
            $("#search_button").click();
            event.preventDefault();
        }
    })
});

$(document).ready(function() {
    $('.navigationBar').append('<span id="playerBalance">' + Player.doubleBalance + ' <i class="double-icon"></i></span>');

    var autocompleteTags = [];
    for (var i = 0; i < Items.weapons.length; i++) {
        var tp = Items.weapons[i].type;
        var name = getSkinName(Items.weapons[i].skinName, Settings.language);
        if ($.inArray(tp + ' | ' + name, autocompleteTags) == -1) autocompleteTags.push(tp + ' | ' + name);
    }

    $("#search_text").autocomplete({
        source: autocompleteTags
    })

    var lastSalesUpdate = getStatistic('lastSalesUpdate', 0);
    var now = new Date();
    if (lastSalesUpdate == '0')
        lastSalesUpdate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    else
        lastSalesUpdate = new Date(lastSalesUpdate);

    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (parseInt(getStatistic("market-sales-count")) == 0 || lastSalesUpdate < today) {
        for (var i = 0; i < weaponsOnSale; i++) {
            var weapon = getRandomWeapon(1);
            weapon.price = parseFloat(weapon.price * (100 - discount) / 100).toFixed(2);
            if (weapon.price > minPriceForSale && weapon.can.buy)
                Sales.push(weapon);
            else
                i--;
        }
    } else {
        for (var i = 0; i < parseInt(getStatistic("market-sales-count")); i++) {
            var raw = JSON.parse(getStatistic("market-sales-weapon-" + i));
            Sales.push(new Weapon(raw));
            Sales[i].soldOut = raw.soldOut;
        }
    }

    if (Sales.length) {
        var SalesHTML = "";
        for (var i = 0; i < Sales.length; i++) {
            SalesHTML += "<div class='sales-weapon animated zoomIn " + (Sales[i].soldOut ? "sold-out" : "") + "' data-weapon-info-json='" + JSON.stringify(Sales[i].saveObject()) + "' data-sales-id='" + i + "' data-discount='" + discount + "'><span class='sales-discount'>" + discount + "%</span><img src=\"" + getImgUrl(Sales[i].img, 1) + "\"><span class='sales-weapon-name'>" + Sales[i].type + " | " + Sales[i].name + "</span><div class='prices'><span class='prices_old-price currency dollar'>" + Sales[i].price + "</span> <span class='prices_new-price currency dollar'>" + (Sales[i].price * (100 - discount) / 100).toFixed(2) + "</span></div></div>";
            //saveStatistic("market-sales-weapon-" + i, JSON.stringify(Sales[i].saveObject()));
        }
        saveStatistic("lastSalesUpdate", '' + today);
        saveStatistic("market-sales-count", '' + Sales.length);
        $(".sales").html(SalesHTML);
    }
});

$(document).on('click', '.item, .sales-weapon', function() {
    $("#buy-double").prop('disabled', false);
    if ($(this).hasClass('sold-out')) return false;
    var saleId = -1;
    if (typeof $(this).data('weapon-info-json') != 'undefined') var weapon = new Weapon($(this).data("weapon-info-json"));
    if (typeof $(this).data('sales-id') != 'undefined') saleId = $(this).data("sales-id");
    if (typeof $(this).data('discount') != 'undefined') var discount = $(this).data("discount");

    if (discount)
        weapon.price = parseFloat(weapon.price * (100 - discount) / 100).toFixed(2);
    
    if ($(this).hasClass('sales-weapon')) {
        $('#buy-count-block').hide();
    } else {
        $('#buy-count-block').show();
    }
    
    if (weapon.price == '0') {
        $(this).addClass('animated flipOutX');

        setTimeout($.proxy(function() {
            $(this).remove();
        }, this), 800);

        return false;
    }


    $("#weaponInfoContainer").data('item_id', weapon.item_id);
    $("#weaponInfoContainer").data('quality', weapon.quality);
    $("#weaponInfoContainer").data('stattrak', weapon.stattrak);
    $("#weaponInfoContainer").data('souvenir', weapon.souvenir);
    /*if (discount)
        $("#weaponInfoContainer").data('discount', discount);*/
    if (saleId != -1)
        $("#weaponInfoContainer").data('sales-id', saleId);
    else
        $("#weaponInfoContainer").data('sales-id', "-1");

    $("#weaponInfoContainer").css("display", "block");
    $("#weaponImg").attr("src", getImgUrl(weapon.img, 1));
    $("#weaponName").html(weapon.specialText() + weapon.type + " | " + weapon.name);
    $("#weaponPrice").html(weapon.price);
    $("#weaponQuality").html(weapon.qualityText());

    $("#buy_count").val(1);
    $('#buy-double span').html((parseFloat(weapon.price) * 100).toFixed(0));
    
    if (weapon.can.buy) {
        $('#buy-double').show();
        $('#buy-count-block').show();
        $('.cant-buy').hide();
    } else {
        $('#buy-count-block').hide();
        $('#buy-double').hide();
        $('.cant-buy').show();
    }
});

//var rowID = client.saveWeapon(weapon.type, weapon.skinName, weapon.img, weapon.quality, weapon.statTrak, weapon.rarity, weapon.price, weapon.new);

$(document).on('click', "#plus, #minus", function() {
    var count = parseInt($("#buy_count").val());
    switch (this.id) {
        case 'plus':
            count++;
            break
        case 'minus':
            count--;
            break
    }
    count = count < 1 ? 1 : count > 100 ? 100 : count;
    $("#buy_count").val(count);
    $("#buy_count").trigger("change");
})

$(document).on('click', '#buy-double', function() {
    var wp = {
        item_id: $("#weaponInfoContainer").data('item_id'),
        quality: $("#weaponInfoContainer").data('quality'),
        stattrak: $("#weaponInfoContainer").data('stattrak'),
        souvenir: $("#weaponInfoContainer").data('souvenir')
    }
    var weapon = new Weapon(wp);
    if (!weapon.can.buy) return;
    weapon.new = true;
    
    var count = parseInt($("#buy_count").val());
    var price = weapon.price * count * 100;
    
    if (Player.doubleBalance < price) {
        $('#weaponPrice').addClass('animated flash');
        setTimeout(function() {
            $('#weaponPrice').removeClass('animated flash')
        }, 1000);
        return false;
    }
    
    var wpns = [];
    for(var i = 0; i < count; i++)
        wpns.push(weapon);
    saveWeapons(wpns);
    
    var saleId = parseInt($("#weaponInfoContainer").data('sales-id'));
    var soldOut = false;
    if (saleId != -1) {
        var wp = JSON.parse(getStatistic("market-sales-weapon-" + saleId));
        wp.soldOut = true;
        saveStatistic("market-sales-weapon-" + saleId, JSON.stringify(wp));
        soldOut = true;
    }
    Sound("buy", "play");
    Player.doubleBalance -= price;
    saveStatistic('doubleBalance', Player.doubleBalance);
    $("#playerBalance").html(Player.doubleBalance + ' <i class="double-icon"></i>');

    $("#buy-double").prop('disabled', true);
    $(".buy-animation").addClass("buy-animation-show", 500, hideBuyCheck);

    if (soldOut) {
        setTimeout(function() {
            $("#weaponInfoContainer").css('display', 'none');
            $("div[data-sales-id='" + saleId + "']").addClass("sold-out");
        }, 500);
    }
    
    LOG.log({
        action: 'Buy item in Marketplace',
        count: count,
        item: {
            item_id: weapon.item_id,
            type: weapon.type,
            name: weapon.nameOrig
        },
        price: price,
        balance: Player.doubleBalance
    })

    checkInventoryForNotification();
});

function hideBuyCheck() {
    $(".buy-animation").addClass('animated zoomOut');
    setTimeout(function() {
        $(".buy-animation").removeClass("buy-animation-show");
        $(".buy-animation").removeClass("animated");
        $(".buy-animation").removeClass("zoomOut");
        $("#buy-double").prop('disabled', false);
    }, 800);
}

$(document).on('click', '#search_button', function() {
    if (!$("#search_text").val().length) return;
    LOG.log({
        action: 'Search in Marketplace',
        search: $("#search_text").val()
    })
    search($("#search_text").val());
})

function search(searchStr) {
    var info = [];
    if (searchStr.indexOf(' | ') != -1) {
        var wp = searchStr.split(' | ');
        if (wp[0] == "P2000" && wp[1] == "Лабиринт") wp[1] = "Pathfinder"
        info = getAllWeaponInfo(wp[0], wp[1], true, true);
    } else {
        if ($(".ui-menu-item").length != 0) {
            var count = $(".ui-menu-item").length;
            for (var i = 0; i < count; i++) {
                var item = $($(".ui-menu-item")[i]).text();
                var wp = item.split(' | ');
                info = info.concat(getAllWeaponInfo(wp[0], wp[1]));
            }
        }
    }
    $(".sales").css('display', 'none');
    var items = "";
    for (var i = 0; i < info.length; i++) {
        var extraStyle = "regular";
        extraStyle = info[i].stattrak == true ? 'statTrak' : extraStyle;
        extraStyle = info[i].type.indexOf('★') != -1 ? 'knive' : extraStyle;
        extraStyle = info[i].souvenir == true ? 'souvenir' : extraStyle;

        var data = "data-weapon-info-json='" + JSON.stringify(info[i].saveObject()) + "'";

        items += "<tr class='item' " + data + "><td><img src=\"" + getImgUrl(info[i].img) + "\" class='" + extraStyle + "_border'></td><td class='item__name-group " + extraStyle + "_color'><span class='item__type'>" + info[i].specialText() + info[i].type + "</span> | <span class='item__name'>" + info[i].name + "</span> (<span class='item__quality'>" + info[i].qualityText() + "</span>)</td><td class='item__price currency dollar'>" + info[i].price + "</td></tr>";
    }
    $('#search_result').addClass("animated fadeInDown");
    setTimeout(function() {
        $('#search_result').removeClass("animated fadeInDown");
    }, 1000);
    $('#search_result').html(items);
}

$(document).on("click", ".glassBlur, .fullWeaponInfo-close", function() {
    $("#weaponInfoContainer").css("display", "none");
})

function getAllWeaponInfo(type, name, stattrak, souvenir) {
    stattrak = stattrak || false;
    souvenir = souvenir || false;
    var info = [];
    var item_id = getWeaponId(type, name);
    var weapon = new Weapon(item_id);
    
    for (var i = 0; i < 5; i++) {
        info.push(new Weapon(item_id, i, false, false));
    }
    if (stattrak)
        for (var i = 0; i < 5; i++) {
            info.push(new Weapon(item_id, i, true, false));
        }
    if (souvenir)
        for (var i = 0; i < 5; i++) {
            info.push(new Weapon(item_id, i, false, true));
        }
    
    for (var i = 0; i < info.length; i++) {
        if (info[i].price === 0) {
            info.splice(i,1);
            i--;
        }
    }
    
    return info
}
