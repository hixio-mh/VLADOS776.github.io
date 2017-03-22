var fbInventory = (function (module) {
    'use strict';
    module = module || {};
    module.setInventory = function (uid, inventory, callback) {
        callback = callback || false;
        try {
            if (typeof inventory == 'undefined' || inventory == null || inventory.length == 0) return false;
            var inventoryRef = firebase.database().ref('inventories/' + uid);
            inventoryRef.child('inventory_count').set(inventory.length);
            inventoryRef.child('weapons').set(inventory);
            if (callback) callback({
                success: true
            });
        }
        catch (e) {
            if (callback) callback({
                success: false
                , error: e
            });
        }
    };
    module.getInventoryCount = function (uid, callback) {
        firebase.database().ref('inventories/' + uid + '/inventory_count').once('value', function (snapshot) {
            callback(snapshot.val());
        })
    }
    module.getWeaponById = function (id) {
        var wp = $.extend({}, Items.weapons[id]);
        if (wp.id != id) {
            for (var i = 0; i < Items.weapons.length; i++)
                if (Items.weapons[i].id === id) {
                    wp = Item.weapons[i];
                    break;
                }
        }
        return wp;
    };
    module.getWeaponId = function (type, name) {
        name = getSkinName(name).toLowerCase();
        for (var i = 0; i < weapons.length; i++) {
            if (weapons[i].type == type && weapons[i].skinName.toLowerCase() == name) {
                return weapons[i].id;
                break;
            }
        }
    };
    module.convertWeapon = function (weapon) {
        var testSouvenir = /^(souvenir |сувенир )/i;
        var convertedWeapon = {};
        convertedWeapon['stattrak'] = weapon.statTrak == true ? true : weapon.statTrak == 1 ? true : false;
        convertedWeapon['souvenir'] = convertedWeapon['stattrak'] == true ? false : testSouvenir.test(weapon.type) ? true : false;
        weapon.type = weapon.type.replace(testSouvenir, '');
        weapon.type = weapon.type.replace(/^(stattrak™ )/gi, '');
        convertedWeapon['item_id'] = module.getWeaponId(weapon.type, weapon.skinName);
        convertedWeapon['custom_name'] = null;
        convertedWeapon['stickers'] = null;
        convertedWeapon['quality'] = getQualityNum(weapon.quality);
        return convertedWeapon;
        
        if (typeof convertedWeapon.item_id == 'undefined') convertedWeapon.item_id = 0;
        if (typeof convertedWeapon.stattrak == 'undefined') convertedWeapon.stattrak = false;
        if (typeof convertedWeapon.quality == 'undefined') convertedWeapon.quality = 0;
    };
    module.checkForTradesWeapons = function() {
        var uid = firebase.auth().currentUser.uid;
        firebase.database().ref('tradeList/'+uid).once('value')
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                childSnapshot.forEach(function() {
                    
                })
            })
        })
    }
    return module;
}(fbInventory || {}))