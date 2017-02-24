var win;
var winNumber = 35;
var sellCommis = 15;
var VERSION = 1;
var inventory = [],
    inventory_length = 0,
    inventory_step = 50,
    inventory_loading = false;
var INVENTORY = {
    weapons: [],
    opt: {},
    worth: 0
};

var DEBUG = false;

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

$(function () {
    //if (!isAndroid()) inventory = getInventory();
    try {
        firebase.auth().onAuthStateChanged(function (user) {
            if (firebase.auth().currentUser != null) {
                var inv = (isAndroid() ? client.getInventoryLength('') : inventory.length);
                ifStatInFbDifferent(inv, 'fbInventory_count', 'inventories/' + firebase.auth().currentUser.uid, 'inventory_count');
                
                ifStatInFbDifferent(Player.points, 'fbEXP', 'users/' + firebase.auth().currentUser.uid+'/public/points');
                firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/moder/doubleAbsolute').once('value').then(function(snap) {
                    if (snap.val() != null && snap.val != Player.doubleBalance) {
                        Player.doubleBalance = parseInt(snap.val());
                        saveStatistic('doubleBalance', Player.doubleBalance);
                    }
                })
                
                ifStatInFbDifferent(Player.doubleBalance, 'fbDouble', 'users/' + firebase.auth().currentUser.uid+'/private/double');
                
            }
        })
        if (isAndroid()) {
            var androidID = client.getAndroidID();
            firebase.database().ref('androidIDBans/'+androidID+'/fullBan').once('value').then(function(snapshot) {
                var banReason = snapshot.val()
                if(banReason != null) {
                    $('body').append("<div class='permanent-ban'><h1>BAN</h1><span>"+banReason+"</span><i>"+Localization.getString('other.ban.wrong_ban')+"</i></div>");
                }
            })
       }
        /*if (((Level.calcLvl() < 7 && Player.doubleBalance > 100000000) || Player.doubleBalance > 70000000000) && !$('.permanent-ban').length) {
            $(document.body).append("<div class='permanent-ban'><h1>BAN</h1><span>Hacker</span><i>Loading...</i></div>");
            if (isAndroid()) {
                var androidID = client.getAndroidID();
                
                try {
                    var uid = firebase.database().currentUser.uid;
                } catch(e) {
                    var uid = "none";
                }
                try {
                    firebase.database().ref('chat/autoban').push({
                        username: Player.nickname
                        , uid: uid
                        , text: androidID
                        , img: '../images/ava/' + Player.avatar
                        , timestamp: firebase.database.ServerValue.TIMESTAMP
                    });
                } catch (e) {}
            }
            
            $(document).on('localizationloaded', function() {
                $('.permanent-ban i').text(Localization.getString('other.ban.wrong_ban'));
            })
        }*/
        
        //Log
        LE.init('decb8cd5-b442-4d06-aedf-3548e15905ce');
    }
    catch (e) {}
    
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "192.168.1.205") {
        var reload_btn = document.createElement('button');
        reload_btn.className = "btn btn-xs btn-warning"
        reload_btn.style = "z-index:99999; position:fixed; top:10px; right:10px;";
        reload_btn.appendChild(document.createTextNode("Refresh"));
        reload_btn.onclick = function() {
            location.reload();
        }
       // document.body.appendChild(reload_btn);
    }
});
try {
    var config = {
        apiKey: "AIzaSyBnT4uYoOgs0Gl6F5_AtzY-q9hhM8z__E4"
        , authDomain: "admob-app-id-8282025074.firebaseapp.com"
        , databaseURL: "https://admob-app-id-8282025074.firebaseio.com"
        , storageBucket: "admob-app-id-8282025074.appspot.com"
        , messagingSenderId: "917984410977"
    };
    firebase.initializeApp(config);
}
catch (e) {}
window.onerror = function (msg, url, line, col, error) {
    if (url) {
        var a = url.split('/');
        var errorFile = a[a.length - 1];
    }
    else {
        errorFile = 'none.js';
    }
    var screen = "";
    try {
        screen = window.location.href;
        if (screen) {
            var temp = screen.split('/');
            screen = temp[temp.length - 1].replace('.html', '.h');
            screen = " in " + screen;
        }
    }
    catch (e) {}
    extra = ':' + line;
    extra += !col ? '' : ':' + col;
    var action = msg + ' | ' + errorFile + extra + screen;
    if (isAndroid()) {
        var stack = "";
        if (error && error.stack)
            stack = error.stack;
        client.sendToAnalytics('Error', 'Error', action, stack);
    }
    var bottom = 0;
    if ($('.error-log').length > 0) {
        $('.error-log').each(function(){
            bottom += $(this).height() + 10;
        })
    }
    //$(document.body).append('<div class="error-log" style="bottom:'+bottom+'px">' + action + '</div>');
    console.log(stack);
    if (!DEBUG)
        setTimeout(function(){
            $('.error-log').remove();
        }, 5000);
    try {
        LOG.err({
            action: action,
            stack: stack
        })
    } catch (e) {}
};

if (!isAndroid() || (isAndroid() && parseFloat(client.getCurrentAppVersionName()) < 1.3)) {
    var openSound = new Audio();
    openSound.src = "../sound/open.wav";
    openSound.volume = 1;
    var closeSound = new Audio();
    closeSound.src = "../sound/close.wav";
    closeSound.volume = 1;
    var scrollSound = new Audio();
    scrollSound.src = "../sound/scroll.wav";
    scrollSound.playbackRate = 1;
    scrollSound.volume = 1;
    var menuClickSound = new Audio();
    menuClickSound.src = "../sound/interface/menuClick.wav";
    menuClickSound.volume = 1;
    var addItemsSound = new Audio();
    addItemsSound.src = "../sound/interface/jackpotAddItems.wav";
    addItemsSound.volume = 1;
    var selectItemSound = new Audio();
    selectItemSound.src = "../sound/interface/SelectItem.wav";
    selectItemSound.volume = 1;
    var contractSound = new Audio();
    contractSound.src = "../sound/interface/contract.wav";
    contractSound.volume = 1;
    var buySound = new Audio();
    buySound.src = "../sound/buy.wav";
    buySound.playbackRate = 1;
    buySound.volume = 1;
    var coinFlipSound = new Audio();
    coinFlipSound.src = "../sound/coinFlip.wav";
    coinFlipSound.volume = 1;
    coinFlipSound.loop = true;
}

var LOG = {
    logMsg: function(msg) {
        try {
            LE.log(msg);
        } catch (e) {}
    },
    log: function(msg, type) {
        type = type || 'log';
        if (typeof msg == 'string')
            msg = {msg: msg};
        msg.user = msg.user || {};
        try {
            if (isAndroid())
                msg.user.androidID = client.getAndroidID();
            
            msg.user.nickname = Player.nickname;
            msg.user.uid = firebase.auth().currentUser.uid;
        } catch (e) {}
        
        if (!type.match(/(log|info|warn|error)/))
            type = 'log';
        
        try{
            LE[type](msg);
        } catch (e) {
            console.log('err', e);
        }
    },
    info: function(msg) {
        LOG.log(msg, 'info');
    },
    warn: function(msg) {
        LOG.log(msg, 'warn');
    },
    err: function(msg) {
        LOG.log(msg, 'error');
    }
}

function ifStatInFbDifferent(currStat, savedStat, fbPath, child) {
    child = child || "";
    if (firebase.auth().currentUser != null) {
        var saved = getStatistic(savedStat, 0);
        if (saved != currStat) {
            var pathRef = firebase.database().ref(fbPath);
            if (child != "")
                pathRef.child(child).set(currStat);
            else
                pathRef.set(currStat);
            saveStatistic(savedStat, currStat);
        }
    }
}

function Sound(soundGet, action, priority, repeat, speed) {
    if (!Settings.sounds) return false;
    action = action || "play";
    priority = priority || 0;
    repeat = repeat || 0;
    speed = speed || 1;
    var sound;
    if (soundGet == "click") soundGet = "menuclick";
    if (isAndroid() && parseFloat(client.getCurrentAppVersionName()) >= 1.3) {
        client.playSound(soundGet.toLowerCase(), priority, repeat, speed)
    }
    else {
        switch (soundGet.toLowerCase()) {
        case "open":
            sound = openSound;
            break;
        case "close":
            sound = closeSound;
            break;
        case "scroll":
            sound = scrollSound;
            break;
        case "menuclick":
            sound = menuClickSound;
            break;
        case "additems":
            sound = addItemsSound;
            break;
        case "selectitems":
            sound = selectItemSound;
            break;
        case "contract":
            sound = contractSound;
            break;
        case "buy":
            sound = buySound;
            break;
        case "coinflip":
            sound = coinFlipSound;
            break;
        }
        if (sound) {
            try {
                sound.pause();
                sound.currentTime = 0;
                if (action == "play") sound.play();
            } catch (e) {
                console.log('Sound error', e);
            }
            /*switch (action) {
            case "play":
            	sound.pause();
            	sound.currentTime = 0;
            	sound.play();
            	break;
            case "pause":
            	sound.pause();
            	sound.currentTime = 0;
            	break;
            }*/
        }
    }
}

function statisticPlusOne(cookieName) {
    var stat = getStatistic(cookieName, 0);
    stat = parseInt((''+stat).replace('$', ''));
    if (isNaN(stat)) stat = 0;
    saveStatistic(cookieName, stat + 1);
}

function saveStatistic(key, value, type, crypt) {
    if (key == 'doubleBalance' && isNaN(value)) {
        $(document).trigger('saveNaNBalance');
        throw new Error
        
        return;
    }
    crypt = crypt || true;
    if (typeof type != 'undefined') {
        switch (type) {
        case 'Number':
            if (typeof value == 'string') value = value.replace(/\$/g, '');
            value = parseInt(value);
            break
        case 'Float':
            value = parseFloat(value);
            break
        }
    }
    if (crypt == true) {
        value = CryptoJS.AES.encrypt(value.toString(), key).toString();
    }
    if (isAndroid()) {
        client.saveStatistic(key, '' + value);
    }
    else {
        $.cookie(key, value, {
            expires: 200
        });
    }
}

function getStatistic(key, defaultVal, crypt) {
    defaultVal = defaultVal || 0;
    crypt = crypt || true;
    var value = null;
    if (isAndroid()) {
        value = client.getStatistic(key);
        value = value == '0' ? defaultVal : value;
    } else {
        value = $.cookie(key) || defaultVal;
    }
    
    if (crypt) {
        try {
            var newValue = CryptoJS.AES.decrypt(value, key).toString(CryptoJS.enc.Utf8);
            if (newValue != '')
                value = newValue;
            if (key.match(/(playerPoints|doubleBalance)/i)) {
                value = newValue == '' ? 0 : newValue;
            }
        } catch (e) {
            console.log('Get statistic Error', e);
            value = defaultVal || 0;
        }
    }
    
    return value;
}

function saveInventory() {
    if (typeof localStorage != 'undefined' && localStorage != null) {
        var i = 0;
        for (var key in localStorage) {
            if (/^firebase/.test(key)) {
                saveStatistic('firebase-key ' + i, '' + key);
                saveStatistic('firebase-value ' + i, '' + localStorage[key]);
                i++;
            }
        }
        localStorage.clear();
        var fbKey1 = getStatistic('firebase-key 0', "");
        var fbKey2 = getStatistic('firebase-key 1', "");
        var fbVal1 = getStatistic('firebase-value 0', "");
        var fbVal2 = getStatistic('firebase-value 1', "");
        localStorage[fbKey1] = fbVal1;
        localStorage[fbKey2] = fbVal2;
    }
    localStorage["inventory.count"] = inventory.length;
    for (var i = 0; i < inventory.length; i++) {
        localStorage["inventory.item." + i + ".type"] = inventory[i].type;
        localStorage["inventory.item." + i + ".skinName"] = inventory[i].skinName;
        localStorage["inventory.item." + i + ".rarity"] = inventory[i].rarity;
        localStorage["inventory.item." + i + ".img"] = inventory[i].img;
        localStorage["inventory.item." + i + ".quality"] = inventory[i].quality;
        localStorage["inventory.item." + i + ".statTrak"] = inventory[i].statTrak;
        localStorage["inventory.item." + i + ".price"] = inventory[i].price;
        localStorage["inventory.item." + i + ".new"] = inventory[i]['new'];
    }
}

function saveWeapon(weapon) {
    return new Promise(function(resolver, reject) {
        INVENTORY.changed = true;
        if (isAndroid()) {
            var rowID = client.saveWeapon(weapon.item_id, weapon.quality, weapon.stattrak, weapon.souvenir, weapon['new'], "{}");
            weapon.id = rowID;
            updateWeapon(weapon);
            resolver(rowID);
        } else {
            connectDB(function (db) {
                var tx = db.transaction('weapons', 'readwrite');
                var store = tx.objectStore('weapons');

                if (typeof weapon.item_id == 'undefined') {
                    var item_id = getWeaponId(weapon.type, weapon.skinName);
                    weapon = new Weapon(item_id, weapon.quality, weapon.statTrak, /(souvenir|сувенир)/.test(weapon.type));
                }
                var request = store.add(weapon.saveObject());
                request.onsuccess = function (e) {
                    weapon.id = e.target.result;
                    updateWeapon(weapon);
                    resolver(e.target.result);
                }
                request.onerror = function (e) {
                    reject(e);
                }
            })
        }
    })
}

function saveItem(item) {
    return new Promise(function(resolver, reject) {
        INVENTORY.changed = true;
        if (isAndroid()) {
            if (item.itemType == 'weapon')
                var rowID = client.saveWeapon(item.item_id, item.quality, item.stattrak, item.souvenir, item['new'], "{}");
            else if (item.itemType == 'sticker')
                var rowID = client.saveWeapon(item.item_id, 5, null, null, item['new'], '{}');
            item.id = rowID;
            updateItem(item);
            resolver(rowID);
        } else {
            connectDB(function (db) {
                var tx = db.transaction('weapons', 'readwrite');
                var store = tx.objectStore('weapons');

                if (typeof item.item_id == 'undefined') {
                    var item_id = getWeaponId(weapon.type, weapon.skinName);
                    weapon = new Weapon(item_id, weapon.quality, weapon.statTrak, /(souvenir|сувенир)/.test(weapon.type));
                }
                var request = store.add(item.saveObject());
                request.onsuccess = function (e) {
                    item.id = e.target.result;
                    updateItem(item);
                    resolver(e.target.result);
                }
                request.onerror = function (e) {
                    reject(e);
                }
            })
        }
    })
}

function saveWeapons(weapons) {
    return new Promise(function(resolver, reject) {
        INVENTORY.changed = true;
        if (isAndroid()) {
            var rows = [];
            for (var i = 0; i < weapons.length; i++) {
                var weapon = weapons[i];
                var rowID = client.saveWeapon(weapon.item_id, weapon.quality, weapon.stattrak, weapon.souvenir, weapon['new'], "{}");
                rows.push(rowID);
                weapon.id = rowID;
                updateWeapon(weapon);
            }
            resolver(rows);
        } else {
            return new Promise(function(resolver, reject) {
                var results = [];
                connectDB(function (db) {
                    var tx = db.transaction('weapons', 'readwrite');
                    var store = tx.objectStore('weapons');

                    for (var i = 0; i < weapons.length; i++) {
                        var weapon = weapons[i];
                        if (typeof weapon.item_id == 'undefined') {
                            var item_id = getWeaponId(weapon.type, weapon.skinName);
                            weapon = new Weapon(item_id, weapon.quality, weapon.statTrak, /(souvenir|сувенир)/.test(weapon.type));
                        }
                        var saveObj = weapon.saveObject()
                        var request = store.add(saveObj);
                        request.onsuccess = function (e) {
                            results.push(e.target.result);
                        }
                        request.onerror = function (e) {
                            reject(e);
                        }
                    }
                    resolver(results);
                })
            }).then(function(results) {
                new setHash(results);
                resolver(results);
            })
        }
    })
}

function setHash(ids) {
    if (typeof ids == 'number')
        ids = [ids];
    this.ids = ids;
    this.counter = 0;
    
    var that = this;
    
    this.replace = function() {
        //var that = this;
        connectDB(function(db) {
            var tx = db.transaction('weapons', 'readwrite');
            var store = tx.objectStore('weapons');
            
            var id = that.ids[that.counter];
            var request = store.get(id);
            request.onsuccess = function(event) {
                var weapon = new Weapon(request.result.item_id, request.result.quality, request.result.stattrak, request.result.souvenir);
                weapon.id = id;
                weapon.new = request.result.new || false;
                var saveObj = weapon.saveObject();
                saveObj.id = id;
                saveObj.hash = weapon.hash();
                store.put(saveObj);
                if (that.counter < that.ids.length - 1) {
                    ++that.counter;
                    that.replace();
                }
            }
        })
    }
    
    this.replace();
}

function updateWeapon(weapon) {
    return new Promise(function(resolver, reject) {
        INVENTORY.changed = true;
        if (isAndroid()) {
            var rowID = client.updateWeapon(
                weapon.id, 
                weapon.item_id, 
                weapon.quality, 
                weapon.stattrak, 
                weapon.souvenir, 
                weapon['new'], 
                '{"hash": "' + weapon.hash() + '"}'
            );
            resolver(rowID);
        } else {
            connectDB(function(db) {
                var tx = db.transaction('weapons', 'readwrite');
                var store = tx.objectStore('weapons');

                if (typeof weapon.item_id != 'undefined' && typeof weapon.id != 'undefined') {
                    var saveObj = weapon.saveObject();
                    saveObj.id = weapon.id;
                    saveObj.hash = weapon.hash();
                    store.put(saveObj);
                    resolver(true);
                }
            })
        }
    })
}

function updateItem(item) {
    return new Promise(function(resolver, reject) {
        INVENTORY.changed = true;
        if (isAndroid()) {
            if (item.itemType == 'weapon')
                var rowID = client.updateWeapon(
                    item.id, 
                    item.item_id, 
                    item.quality, 
                    item.stattrak, 
                    item.souvenir, 
                    item['new'], 
                    '{"hash": "' + item.hash() + '"}'
                );
            else if (item.itemType == 'sticker')
                var rowID = client.updateWeapon(
                    item.id, 
                    item.item_id, 
                    5, 
                    null, 
                    null, 
                    item['new'], 
                    '{"hash": "' + item.hash() + '"}'
                );
            resolver(rowID);
        } else {
            connectDB(function(db) {
                var tx = db.transaction('weapons', 'readwrite');
                var store = tx.objectStore('weapons');

                if (typeof item.item_id != 'undefined' && typeof item.id != 'undefined') {
                    var saveObj = item.saveObject();
                    saveObj.id = item.id;
                    saveObj.hash = item.hash();
                    store.put(saveObj);
                    resolver(true);
                }
            })
        }
    })
}

function getWeapon(id) {
    return new Promise(function(resolver, reject) {
        if (isAndroid()) {
            var wp = client.getWeaponById(id);
            wp = $.parseJSON(wp);
            wp = new Weapon(wp);
            wp.id = id;
            resolver(wp);
        } else {
             connectDB(function(db) {
                var tx = db.transaction('weapons', 'readonly');
                var store = tx.objectStore('weapons');

                var request = store.get(id);
                request.onsuccess = function(event) {
                    var weapon = new Weapon(request.result.item_id, request.result.quality, request.result.stattrak, request.result.souvenir);
                    weapon.id = id;
                    if (getStatistic('hash', 0) == 1 && typeof request.result.hash != 'undefined') {
                        if (weapon.hashCompare(request.result.hash)) {
                            resolver(weapon);
                        }
                    } else if (getStatistic('hash', 0) == 0) {
                        resolver(weapon);
                    } else {
                        resolver({});
                    }
                }
            })
        }
    })
}
function getItem(id) {
    return new Promise(function(resolver, reject) {
        if (isAndroid()) {
            var wp = client.getWeaponById(id);
            wp = $.parseJSON(wp);
            wp = new Item(wp);
            wp.id = id;
            resolver(wp);
        } else {
             connectDB(function(db) {
                var tx = db.transaction('weapons', 'readonly');
                var store = tx.objectStore('weapons');

                var request = store.get(id);
                request.onsuccess = function(event) {
                    var item = new Item({
                        item_id: request.result.item_id, 
                        quality: request.result.quality,
                        stattrak: request.result.stattrak,
                        souvenir: request.result.souvenir
                    });
                    item.id = id;
                    resolver(item);
                }
            })
        }
    })
}

function getWeapons(ids) {
    return new Promise(function(resolver, reject) {
        var wpns = [];
        recurs(0);
        
        function recurs(count) {
            if (count == ids.length) {
                resolver(wpns);
            } else {
                getWeapon(ids[count]).then(function(weapon) {
                    wpns.push(weapon);
                    recurs(count+1);
                })
            }
        }
    })
        
        /*if (isAndroid()) {
            var wpns = [];
            for (var i = 0; i < ids.length; i++) {
                var wp = $.parseJSON(client.getWeaponById(ids[i]))[0];
                wpns.push(new Weapon(wp));
            }
            resolver(wpns);
        } else {
             connectDB(function(db) {
                var tx = db.transaction('weapons', 'readonly');
                var store = tx.objectStore('weapons');
                
                var wpns = [];
                
                for (var i = 0; i < ids.length; i++) {
                    var id = ids[i];
                    
                    var request = store.get(id);
                    request.onsuccess = function(event) {
                        var weapon = new Weapon(request.result.item_id, request.result.quality, request.result.stattrak, request.result.souvenir);
                        weapon.id = id;
                        wpns.push(weapon);
                        
                    }
                }
                resolver(wpns);
            })
        }
    })*/
}

function deleteWeapon(id) {
    return new Promise(function(resolver, reject) {
        INVENTORY.changed = true;
        
        try {
            for (var i = 0; i < INVENTORY.weapons.length; i++) {
                if (INVENTORY.weapons[i].id === id) {
                    INVENTORY.weapons.splice(i, 1);
                    break;
                }
            }
        }catch(e) {
            console.log(e);
        }
        
        if (isAndroid()) {
            client.deleteWeapon(id);
            resolver(true);
        } else {
            connectDB(function(db) {
                var tx = db.transaction('weapons', 'readwrite');
                var store = tx.objectStore('weapons');

                store.delete(id);
                resolver(true);
            })
        }
    })
}

function deleteAllInventory() {
    INVENTORY.changed = true;
    if (isAndroid()) {
        client.deleteAllInventory();
    } else {
        indexedDB.deleteDatabase('Inventory');
    }
}

function getInventory(count_from, count_to, opt) {
    count_from = count_from || 1;
    count_to = count_to || 10000;
    opt = opt || {};
    
    opt.limits = opt.limits || {
        min: 0,
        max: 99999999
    };
    
    if (INVENTORY.weapons.length >= count_to && opt.loadMore) {
        var ret = [];
        for (var i = (count_from - 1); i < count_to; i++) {
            ret.push(INVENTORY.weapons[i]);
        }
        
        return new Promise(function(resolver,reject) {
            resolver({
                weapons: ret,
                worth: INVENTORY.worth,
                count: INVENTORY.weapons.length
            });
        })
    } else if (INVENTORY.weapons.length > count_from - 1 && INVENTORY.weapons.length < count_to && opt.loadMore) {
        var ret = [];
        for(var i = (count_from - 1); i < INVENTORY.weapons.length; i++) {
            ret.push(INVENTORY.weapons[i]);
        }
        return new Promise(function(resolver,reject) {
            resolver({
                weapons: ret,
                worth: INVENTORY.worth,
                count: INVENTORY.weapons.length
            });
        })
    } else {
        return window[(isAndroid() ? "_getInventoryAndroid" : "_getInventoryIndexedDB")](opt).then(function(inv) {
            if (inv.length == 0) {
                return {
                    worth:0,
                    count:0,
                    weapons:[]
                }
            }
            
            var invTemp = inv;
            inv = [];
            for (var i = 0; i < invTemp.length; i++) {
                if (invTemp[i].price > opt.limits.min && invTemp[i].price < opt.limits.max)
                    inv.push(invTemp[i]);
            }
            
            INVENTORY.weapons = inv.sort(function(a,b) {
                return b.price - a.price;
            });
            INVENTORY.worth = INVENTORY.weapons.reduce(function(sum, curr) {
                return sum + curr.price;
            }, 0)
            
            var ret = [];
            for (var i = 0; i < count_to; i++) {
                if (typeof INVENTORY.weapons[i] == 'undefined') break;
                ret.push(INVENTORY.weapons[i])
            }
            return {
                worth: INVENTORY.worth,
                count: INVENTORY.weapons.length,
                weapons:ret
            };
        })
    }
}

function _getInventoryAndroid(opt) {
    return new Promise(function(resolver,reject) {
        var inventoryJSON;
        inventoryJSON = client.SQLiteQuery("SELECT * FROM inventory");
        try {
            inventoryJSON = $.parseJSON(inventoryJSON);
        }
        catch (e) {
            client.deleteAllInventory();
            reject({err: 'Error', errCode: 1, text: 'Something went wrong. All inventory deleted'});
        }
        if (inventoryJSON.length == 0) resolver([]);
        //inventory_length = client.getInventoryLength(special);
        if (typeof inventoryJSON[0].error != 'undefined') resolver([]);
        
        var weaponsArr = [];
        var hashStat = getStatistic('hash', 0);
        for (var i = 0; i < inventoryJSON.length; i++) {
            if (inventoryJSON[i].item_id == "" && inventoryJSON[i].quality == "" && inventoryJSON[i].extra != "{}") {
                var extra = JSON.parse(inventoryJSON[i].extra);
                var id = getWeaponId(extra.type.replace(/(Souvenir |Сувенир )/, ""), extra.skinName);
                inventoryJSON[i].item_id = id;
                inventoryJSON[i].stattrak = extra.statTrak == 'true';
                inventoryJSON[i].souvenir = extra.type.match(/(Souvenir |Сувенир )/) != null;
                inventoryJSON[i].new = extra.isNew == 'true';
                inventoryJSON[i].quality = getQualityNum(extra.quality);
            } else {
                inventoryJSON[i].item_id = parseInt(inventoryJSON[i].item_id);
                inventoryJSON[i].quality = parseInt(inventoryJSON[i].quality);
                inventoryJSON[i].stattrak = inventoryJSON[i].stattrak == 'true';
                inventoryJSON[i].souvenir = inventoryJSON[i].souvenir == 'true';
                inventoryJSON[i].new = inventoryJSON[i].new == 'true';
                inventoryJSON[i].extra = $.parseJSON(inventoryJSON[i].extra);
            }
            var item = new Item(inventoryJSON[i]);
            item.id = parseInt(inventoryJSON[i].id);
            if (hashStat == 1 && typeof inventoryJSON[i].extra.hash != 'undefined') {
                if (item.hashCompare(inventoryJSON[i].extra.hash)) {
                    weaponsArr.push(item);
                }
            } else if (hashStat == 0) {
                weaponsArr.push(item);
            }
        }
        resolver(weaponsArr);
    })
}

function _getInventoryIndexedDB() {
    return new Promise(function(resolver, reject) {
        connectDB(function(db) {
        var rows = [],
            store = db.transaction(['weapons'], 'readonly').objectStore('weapons');
        
        if('getAll' in store)
            store.getAll().onsuccess = function(e) {
                var inv = e.target.result;
                var invWeapons = [];
                var hashStat = getStatistic('hash', 0);
                for (var i = 0; i < inv.length; i++) {
                    var item = new Item(inv[i]);
                    item.id = inv[i].id;
                    
                    if (hashStat == 1 && typeof inv[i].hash != 'undefined') {
                        if (item.hashCompare(inv[i].hash)) {
                            invWeapons.push(item);
                        }
                    } else if (hashStat == 0) {
                        invWeapons.push(item);
                    }
                }
                resolver(invWeapons);
            }
        else
            store.openCursor().onsucces = function(e) {
                var cursor = e.target.result;
                if (cursor) {
                    rows.push(cursor.value);
                    cursor.continue();
                } else {
                    resolver(rows);
                }
            };
        });
    })
}

function getInventoryCost(special) {
    special = special || '';
    return 0;
    //if (isAndroid()) return client.getInventoryCost(special);
    //else return 0;
}

function checkInventoryForNotification() {
    var new_weapon_count = 0;
    if (isAndroid()) {
        new_weapon_count = client.getInventoryLength("WHERE new = 'true'");
    }
    else {
        if (typeof localStorage == 'undefined') return false;
        var count = parseInt(localStorage["inventory.count"], 10);
        for (var i = 0; i < count; i++) {
            var item_new = localStorage["inventory.item." + i + ".new"];
            if ((item_new == "true") || (item_new == "1")) new_weapon_count++;
        }
    }
    if (new_weapon_count) {
        menuNotification('inventory', '' + new_weapon_count)
    }
}

function menuNotification(items, message) {
    switch (items) {
    case 'inventory':
        if ($('#local-menu-inventory .menu-notification').length) {
            $('#local-menu-inventory .menu-notification').text(message);
        }
        else {
            $('#local-menu-inventory').append('<span class="menu-notification">' + message + '</span>');
        }
        break
    default:
        break
    }
}

function deleteMenuNotification(items) {
    switch (items) {
    case 'inventory':
        $('#local-menu-inventory .menu-notification').remove();
        break
    default:
        break
    }
}

function getCollection(type, name) {
    if (name == "Man-o") name = "Man-o'-war";
    if (name == "Chantico") name = "Chantico's fire";
    try {
        var param = parseURLParams(window.location.href);
        if (typeof param != "undefined") {
            var caseId = param.caseId[0];
            return cases[parseInt(caseId)]
        }
    }
    catch (e) {
        //Error
    }
    var collection = "";
    type = $.trim(type.replace(/(Souvenir|Сувенир)/g, ''));
    
    for (var i = 0; i < cases.length; i++) {
        for (var z = 0; z < cases[i].weapons.length; z++)
            if ((cases[i].weapons[z].type == type) && (getSkinName(cases[i].weapons[z].skinName, "EN") == getSkinName(name))) {
                collection = cases[i];
                break;
            }
        if (typeof collection != 'undefined' && collection != '') break;
    }
    return collection;
}

function getCasePrice(caseId, souvenir) {
    var prSumm = 0;

    if (typeof cases[caseId].weapons === 'undefined') return '0.00';
    cases[caseId].weapons.forEach(function(item) {
        prSumm += middlePrice(item, souvenir);
    })
    return (prSumm / cases[caseId].weapons.length).toFixed(2)
}

function middlePrice(item_id, souvenir) {
    souvenir = souvenir || false;
    var middlePrice = 0;
    for (var i = 0; i < 4; i++) {
        middlePrice += getPrice(item_id, {
            quality: i,
            stattrak: false,
            souvenir: souvenir
        })
    }
    middlePrice /= 5;
    return parseFloat(middlePrice.toFixed(2));
}

function getWeaponRarity(type, name) {
    name = getSkinName(name);
    type = $.trim(type.replace(/(Souvenir|Сувенир)/g, ''));
    var coll = getCollection(type, name);
    if (typeof coll.weapons == 'undefined' && isAndroid()) {
        client.sendToAnalytics("Error", "Error", "Cant find collection for " + type + " | " + name, "main.js");
        return "milspic";
    }
    for (var i = 0; i < coll.weapons.length; i++) {
        if (coll.weapons[i].type == type && getSkinName(coll.weapons[i].skinName) == name) return coll.weapons[i].rarity;
    }
}

function getImgUrl(img, big) {
    var prefix = "https://steamcommunity-a.akamaihd.net/economy/image/"
    prefix = window.location.protocol == "http:" ? prefix.replace("https", "http") : prefix;
    var postfix = "/124fx124f";
    var postfixBig = "/383fx383f";
    if (typeof img == 'undefined') return "../images/none.png";
    if (img.indexOf("images/") != -1)
        if (typeof big != "undefined") {
            return img.replace(postfix, postfixBig);
        }
        else {
            return img;
        }
    else if (img.indexOf(".png") != -1) return "../images/Weapons/" + img;
    else if (img.indexOf("steamcommunity") == -1) {
        if (typeof big != "undefined") return prefix + img + postfixBig;
        else return prefix + img + postfix;
    }
    else
    if (typeof big != "undefined") {
        return img.replace(postfix, postfixBig);
    }
    else {
        return img;
    }
}

function XSSreplace (text) {
        var allowedTags = ["<br>", "<i>", "<b>", "<s>"];
        if (typeof text !== 'string') return text;
        //allowed html tags
        text = text.replace(/&lt;/g, '<');
        text = text.replace(/&gt;/g, '>');
        text = text.replace(/&amp;/g, '&');
        for (var i = 0; i < allowedTags.length; i++) {
            text = rpls(text, allowedTags[i]);
        }
        //XSS replace
        text = text.replace(/&/g, '&amp;');
        text = text.replace(/</g, '&lt;');
        text = text.replace(/>/g, '&gt;');
        text = text.replace(/"/g, '&quot;');
        text = text.replace(/'/g, '&#x27;');
        //text = text.replace(/\//g, '&#x2F;');
        //allowed html tags
        for (var i = 0; i < allowedTags.length; i++) {
            text = rpls(text, allowedTags[i], true);
        }
        return text;

        function rpls(text, tag, revert) {
            revert = revert || false;
            var inTag = tag.replace(/(<|>)/g, '');
            if (!revert) {
                var reg = new RegExp('<([/])?' + inTag + '>', 'gi');
                text = text.replace(reg, '!!$1' + inTag + '!!');
            }
            else {
                var reg = new RegExp('!!([/])?' + inTag + '!!', 'gi');
                text = text.replace(reg, '<$1' + inTag + '>');
            }
            return text;
        }
    }

function connectDB(f) {
    if (!window.indexedDB) {
        alert('Your browser does\'t support indexedDB');
        return 0;
    }
    
    var request = indexedDB.open("Inventory", 1);
    request.onerror = function(event) {
        alert("Something went wrong with dabase.");
    };
    request.onsuccess = function() {
        f(request.result);
    };
    request.onupgradeneeded = function(event) { 
        var db = event.target.result;

        // Создаем хранилище объектов для этой базы данных
        if (!db.objectStoreNames.contains('weapons')) {
            var objectStore = db.createObjectStore("weapons", { keyPath: "id", autoIncrement: true});

            objectStore.createIndex('item_id', 'item_id', {unique: false})
            objectStore.createIndex('quality', 'quality', {unique: false})

            //connectDB(f);
        }
    };
}

function convertLocalStorageToIndexedDB() {
    if (typeof inventory != 'undefined' && inventory.length != 0) {
        connectDB(function(db) {
            for (var i = 0; i < inventory.length; i++) {
                saveWeapon(inventory[i]);
            }
        })
    }
}

function changeLocation(url) {
    window.location = url;
}

function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1
        , queryEnd = url.indexOf("#") + 1 || url.length + 1
        , query = url.slice(queryStart, queryEnd - 1)
        , pairs = query.replace(/\+/g, " ").split("&")
        , parms = {}
        , i, n, v, nv;
    if (query === url || query === "") {
        return;
    }
    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=");
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);
        if (!parms.hasOwnProperty(n)) {
            parms[n] = [];
        }
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

function isAndroid() {
    try {
        var a = client.isAndroid();
        return true;
    }
    catch (e) {
        return false;
    }
}
Array.prototype.shuffle = function () {
    var o = this;
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}
Array.prototype.mul = function (k) {
    var res = []
    for (var i = 0; i < k; ++i) res = res.concat(this.slice(0))
    return res
}
Math.rand = function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

    /*Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
    };*/