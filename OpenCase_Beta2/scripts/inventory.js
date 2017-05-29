
$(function() {
	if ($(".inventory").length) {
		$('.inventory').html('<li class="js-loading-inventory" data-from="1"><div class="cssload-container"><div class="cssload-speeding-wheel"></div></div></li>');
	
		$('.inventoryList').on('scroll', function() {
            if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight-80 && $('.js-loading-inventory').length) {
                fillInventory({ loadMore: true, action: 'game' });
            }
        });
	}
})

function fillInventory(opt) {
    opt = opt || {};
	inventory_loading = true;
    selector = opt.selector || ".inventory";
    action = opt.action || "";
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
        
        if (typeof opt.price == 'undefined') opt.price = true;
        if (typeof opt.nameTag == 'undefined') opt.nameTag = true;

        for(var i = 0; i < inventory.length; i++) {
            var weapon = inventory[i];
            
            if (action != "" && typeof weapon.can[action] != 'undefined' && weapon.can[action] == false) continue
            
            var $weaponInfo = $(weapon.toLi(opt));
            
            $weaponInfo.data('id', weapon.id);
            $weaponInfo.data('weapon_obj', JSON.stringify(weapon.saveObject()));
            
            $(selector).append($weaponInfo);

            if (weapon['new'] == true) {
                inventory[i]['new'] = false;
                updateItem(inventory[i]);
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