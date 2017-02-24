
$(function() {
	if ($(".inventory").length) {
		$('.inventory').html('<li class="js-loading-inventory" data-from="1"><div class="cssload-container"><div class="cssload-speeding-wheel"></div></div></li>');
	
		$('.inventoryList').on('scroll', function() {
            if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight-80 && $('.js-loading-inventory').length) {
                fillInventory(".inventory", "bet", {loadMore: true});
            }
        });
	}
})

function fillInventory(selector, action, opt) {
	inventory_loading = true;
    selector = selector || ".inventory";
    action = action || "";
    opt = opt || {};
	if ($('.js-loading-inventory').length == 0){
        if ($(selector+' .weapon').length != 0) {
            $(selector+" .weapon").remove();
            $(selector).append('<li class="js-loading-inventory" data-from="1"><div class="cssload-container"><div class="cssload-speeding-wheel"></div></div></li>');
        } else if ($('.inventoryItemSelected').length != 0) {
            inventory_loading = false;
            return false;
        }
	}
	
	var wp_from = parseInt($('.js-loading-inventory').data('from'));
	wp_from = wp_from || 1;
    $(".inventoryList").css("display", "block");
	getInventory(wp_from, wp_from+inventory_step-1, opt).then(function(result) {
        var inventory = result.weapons;
        
        $(".js-loading-inventory").remove();
        var need_save = false;

        for(var i = 0; i < inventory.length; i++) {
            var weapon = inventory[i];
            
            if (action != "" && typeof weapon.can[action] != 'undefined' && weapon.can[action] == false) continue

            var weaponInfo = "<img src='"+getImgUrl(weapon.img)+"'> \
            <div class='weaponInfo "+weapon.rarity+"'> \
                <span class='type'>"+weapon.specialText()+weapon.type+"<br>" + weapon.name + "</span> \
            </div><i class='currency dollar'>"+weapon.price+"</i>";
            
            $(selector).append("<li class='weapon "+ (weapon.statTrak ? "wp-statTrak" : "") +" "+((weapon['new'] == true) ? "new-weapon" : "")+"' data-id='"+weapon.id+"' data-weapon_obj='"+JSON.stringify(weapon.saveObject())+"' data-weapon_can='"+JSON.stringify(weapon.can)+"'>"+weaponInfo+"</li>");

            if (weapon['new'] == true) {
                inventory[i]['new'] = false;
                updateWeapon(inventory[i]);
            }
        }
        if (inventory.length == 0) {
            $(selector).html("<li>"+Localization.getString('other.empty_inventory')+"</li>");
        }

        if ((wp_from+inventory_step) < result.count) {
            $(selector).append('<li class="js-loading-inventory" data-from="'+(wp_from+inventory_step)+'"><div class="cssload-container"><div class="cssload-speeding-wheel"></div></div></li>');
        }
        inventory_loading = false;
        $('.inventoryList').trigger('scroll');
    });
}

$(document).on("click", ".weapon", function(){
	Sound("selectitem", "play");
	
	var parent = $(this).parent()[0];
	
	if ($(parent).hasClass('inv-no-select')) return false;
	
	if ($(".inventoryItemSelected").length < maxItems) {
		$(this).toggleClass("inventoryItemSelected");
		Sound("selectitems", "play");
	} else if ($(this).hasClass("inventoryItemSelected")) {
		$(this).toggleClass("inventoryItemSelected");
		Sound("selectitems", "play");
	}
	
	if ($(parent).hasClass('inv-price-counter')) {
		if ($("li").is(".inventoryItemSelected")) {
			var sumText = Localization.getString('other.sum_text', "Worth: ");
			if ($("div").is(".inventorySum")) {
				var sumPr = 0.0;
				$(".inventoryItemSelected").each(function () {
					sumPr += parseFloat($("i", this).text(), 10)
				});
				$(".inventorySum").html(sumText + sumPr.toFixed(2) + "$");
			} else {
				$(".inventoryList").append("<div class='inventorySum'>" + sumText + $("i", this).text());
			}
		} else {
			$(".inventorySum").remove();
		}
	}
});

$(document).on("click", '.closeInventory', function(){
	$(".inventoryList").css("display", "none");
	$("#inventorySum").remove();
	if (isAndroid()) $('.js-loading-inventory').remove();
});