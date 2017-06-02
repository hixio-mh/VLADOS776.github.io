var item_proto = {
    getImgUrl: function (big) {
        var prefix = "https://steamcommunity-a.akamaihd.net/economy/image/";
        prefix = window.location.protocol == "http:" ? prefix.replace("https", "http") : prefix;
        var postfix = "/124fx124f";
        var postfixBig = "/383fx383f";

        if (this.img.indexOf('http') != -1) return this.img;

        if (typeof this.img == 'undefined') return "../images/none.png";
        if (this.img.indexOf("images/") != -1)
            if (big) {
                return this.img.replace(postfix, postfixBig);
            }
        else {
            return this.img;
        } else if (this.img.indexOf(".png") != -1 || this.img.indexOf(".webp") != -1) return "../images/Weapons/" + this.img;
        else if (this.img.indexOf("steamcommunity") == -1) {
            if (typeof big != "undefined") return prefix + this.img + postfixBig;
            else return prefix + this.img + postfix;
        } else
        if (big) {
            return this.img.replace(postfix, postfixBig);
        } else {
            return this.img;
        }
    },
    hashCompare: function (hash) {
        hash = hash || this.hash || -1;
        if (hash === -1) return false

        return this.hash() === hash
    }
}

function Item(config, type) {
    if (!type && typeof config === 'object' && (config.quality == 5 || config.itemType == 'sticker'))
        return new Sticker(config);
    if (!type && typeof config === 'object' && (config.quality == 6 || config.itemType == 'graffiti'))
        return new Graffiti(config);
    type = type || config.itemType || 'Weapon';
    if (type.match(/weapons?/i))
        type = 'Weapon';
    else if (type.match(/(sticker|capsule)s?/i))
        type = 'Sticker';
    else if (type.match(/graffiti/i))
        type = 'Graffiti';
    if (!window[type])
        return null;
    return new window[type](config);
}

function Weapon(item_id, quality, stattrak, souvenir, isNew) {
    if (typeof item_id == 'object') {
        var quality = item_id.quality || 0;
        var stattrak = item_id.stattrak || item_id.statTrak || false;
        var souvenir = item_id.souvenir || false;
        var isNew = item_id.new || false;
        var nameTag = item_id.nameTag ? item_id.nameTag : item_id.extra ? item_id.extra.nameTag : null;
        var pattern = item_id.pattern != null ? item_id.pattern : item_id.extra != null ?
            item_id.extra.pattern : null;
        var locked = item_id.locked ? item_id.locked : item_id.extra && item_id.extra.locked ? item_id.extra.locked : false;
        item_id = typeof item_id.item_id == 'undefined' ? item_id.id || 0 : item_id.item_id;
    }
    if (item_id > Items.weapons.length)
        item_id = 0;

    if (nameTag && nameTag.length > 20)
        nameTag = nameTag.match(/.{1,20}/g)[0].trim();

    // Const
    this.itemType = 'weapon';

    var qualityNotSet = false;
    if (typeof quality == 'undefined')
        qualityNotSet = true;
    this.item_id = item_id || 0;
    this.quality = quality || 0;
    this.stattrak = stattrak || false;
    this.souvenir = souvenir || false;
    this.new = isNew || false;
    this.old = getWeaponById(this.item_id);
    if (this.old == null)
        console.log('Can\'t find weapon by ID: ' + this.item_id);
    this.type = this.old.type;
    this.nameOrig = this.old.skinName;
    this.name = getSkinName(this.nameOrig, Settings.language);
    this.nameTag = XSSreplace(nameTag);
    this.img = this.old.img;
    this.price = this.getPrice();

    this.allPrices = Prices[this.item_id] && Prices[this.item_id].prices ? Prices[this.item_id].prices : {};

    this.allPrices.default = this.allPrices.default || {};
    this.allPrices.stattrak = this.allPrices.stattrak || {};
    this.allPrices.souvenir = this.allPrices.souvenir || {};

    this.item_id = parseInt(this.item_id);
    this.quality = parseInt(this.quality);

    if (isNaN(this.item_id)) this.item_id = 0;
    if (isNaN(this.quality)) this.quality = 0;

    this.priceType = this.stattrak ? 'stattrak' : this.souvenir ? 'souvenir' : 'default';

    if ((this.price == 0 || this.price == -1) && qualityNotSet)
        this.qualityRandom();

    if (pattern != null) {
        try {
            this.pattern = pattern;
            this.img = this.old.patterns[this.pattern].img
        } catch (e) {
            console.log('Cant find pattern for', this.type, ' | ', this.name, ' - ', this.pattern);
        }
    }

    //this.can.inCase - 
    //Для оружия, которое удалили из коллекции. Например Howl в Huntsman.
    
    var canDefault = {
        sell: true,
        buy: true,
        trade: true,
        contract: true,
        bot: true,
        game: true,
        inCase: true,
        stattrak: true,
        souvenir: false,
        specialCase: true,
        stickers: true,
        rename: true
    }
    
    this.can = $.extend(true, canDefault, this.old.can || {});;
    this.rarity = this.old.rarity;

    if (this.rarity == 'rare' || this.rarity == 'extraordinary')
        this.can.stickers = false;
    if (this.souvenir || this.rarity == 'rare' || this.rarity == 'covert' || this.rarity == 'extraordinary')
        this.can.contract = false;

    try {
        if (Prices[this.item_id].prices.souvenir) {
            if (Object.keys(Prices[this.item_id].prices.souvenir).length > 0) {
                this.can.souvenir = true;
                this.can.stattrak = false;
            } else if (Object.keys(Prices[this.item_id].prices.souvenir).length == 0 && Object.keys(Prices[this.item_id].prices.stattrak).length == 0) {
                this.can.souvenir = false;
                this.can.stattrak = false;
            }
        }
    } catch (e) {
        throw new Error('Prices is undefined. Weapon ' + this.item_id);
    }

    // Lock weapon
    this.locked = locked || false;
    if (this.locked) {
        this.can.sell = false;
        this.can.trade = false;
        this.can.game = false;
        this.can.contract = false;
    }
}

// === Prototypes ===

Weapon.prototype = Object.create(item_proto);

Weapon.prototype.collection = function () {
    if (this.type.indexOf('★') == -1) {
        for (var i = 0; i < cases.length; i++) {
            if (cases[i].type != 'Special' && $.inArray(this.item_id, cases[i].weapons) != -1) return cases[i]
        }
    } else {
        for (var i = 0; i < cases.length; i++) {
            if (cases[i].type != 'Special' && $.inArray(this.item_id, cases[i].knives) != -1) return cases[i]
        }
    }
    return -1;
}
Weapon.prototype.saveObject = function (opt) {
    opt = opt || {};
    var saveObj = {
        item_id: this.item_id,
        quality: this.quality,
        stattrak: this.stattrak,
        souvenir: this.souvenir,
        new: this.new
    };
    if (opt.id && this.id) saveObj.id = this.id;
    if (opt.hash) saveObj.hash = this.hash();
    if (this.nameTag) saveObj.nameTag = this.nameTag;
    if (this.pattern != null) saveObj.pattern = this.pattern;
    if (this.locked) saveObj.locked = this.locked;
    return saveObj;
}
Weapon.prototype.tradeObject = function () {
    var trObj = {
        item_id: this.item_id,
        quality: this.quality
    };
    if (this.stattrak) trObj.stattrak = this.stattrak;
    if (this.souvenir) trObj.souvenir = this.souvenir;
    if (this.nameTag) trObj.nameTag = this.nameTag;
    if (this.pattern != null) trObj.pattern = this.pattern;
    return trObj;
}
Weapon.prototype.toOldObject = function (isNew) {
    isNew = isNew || false;
    var tp = this.souvenir ? Localization.getString('other.souvenir') + ' ' + this.type : this.type;
    var oldObj = {
        type: tp,
        skinName: this.name,
        rarity: this.rarity,
        quality: getQualityName(this.quality),
        statTrak: this.stattrak,
        price: this.getPrice(),
        img: this.img,
        new: isNew,
    };
    return oldObj;
}
Weapon.prototype.getPrice = function () {
    return getPrice(this.item_id, {
        quality: this.quality,
        stattrak: this.stattrak,
        souvenir: this.souvenir
    })
}
Weapon.prototype.stattrakRandom = function () {
    if (this.type.souvenir || this.can.stattrak == false || Object.keys(this.allPrices.stattrak).length == 0) {
        this.stattrak = false;
        return false;
    }
    col = this.collection();
    if (col != "" && col.type == 'Collection') {
        this.stattrak = false;
        return false;
    }
    if (typeof col.canBeStatTrak != 'undefined' && col.canBeStatTrak == false) {
        this.stattrak = false;
        return false;
    }
    this.stattrak = Math.random() > 0.8 ? true : false;
    this.price = this.getPrice();
    if (this.price == 0 || this.price == -1)
        this.stattrak = false;
    return this.stattrak;
}
Weapon.prototype.qualityRandom = function (count) {
    count = count || 0;
    if (this.allPrices != null) {
        var prices = this.stattrak ? this.allPrices.stattrak : this.souvenir ? this.allPrices.souvenir : this.allPrices.default;

        var sorted = Object.keys(prices).sort(function (a, b) {
            var A = typeof prices[a] == 'number' ? prices[a] : prices[a].market > 0 ? prices[a].market : prices[a].analyst > 0 ? prices[a].analyst : prices[a].opskins;
            var B = typeof prices[b] == 'number' ? prices[b] : prices[b].market > 0 ? prices[b].market : prices[b].analyst > 0 ? prices[b].analyst : prices[b].opskins;
            return B - A
        });

        var sumChances = (function () {
            var sum = 0;
            for (var i = 0; i < sorted.length; i++) {
                sum += (i + 1) * 10;
            }
            return sum;
        })();

        var random = Math.rand(0, sumChances);
        var cursor = 0;

        for (var i = 0; i < sorted.length; i++) {
            cursor += (i + 1) * 10;
            if (cursor >= random) {
                this.quality = parseInt(sorted[i]);
                this.price = this.getPrice();
                if ((this.price == 0 || this.price == -1) && count < 5)
                    this.qualityRandom(++count);
                else
                if (this.old.chances && this.old.chances[this.priceType] && this.old.chances[this.priceType][this.quality]) {
                    var rnd = Math.rand(0, 100);
                    if (rnd > this.old.chances[this.priceType][this.quality]) {
                        return this.qualityRandom(++count);
                    }
                }
                return this.quality;
            }
        }
    } else {
        var sumChanses = 0;
        var sumWeights = 0;
        var random = Math.random();
        for (var i = 0; i < Quality.length; i++) {
            sumChanses += Quality[i].chance;
        }
        for (var i = 0; i < Quality.length; i++) {
            var weight = Quality[i].chance / sumChanses;
            Quality[i].weight = weight;
        }
        for (var i = 0; i < Quality.length; i++) {
            sumWeights += Quality[i].weight;
        }
        var cursor = 0;
        for (var i = 0; i < Quality.length; i++) {
            cursor += Quality[i].weight / sumWeights;
            if (cursor >= random) {
                this.quality = i;
                this.price = this.getPrice();
                if ((this.price == 0 || this.price == -1) && count < 5)
                    this.qualityRandom(++count);
                else
                    return i;
            }
        }
    }
}
Weapon.prototype.qualityText = function () {
    var lang = Localization.supportedLanguages.quality.regExp.test(Settings.language) ? Settings.language : 'EN';
    return Quality[this.quality].names[lang];
}
Weapon.prototype.specialText = function () {
    if (this.stattrak)
        return 'StatTrak™ '
    else if (this.souvenir)
        return Localization.getString('other.souvenir') + ' ';
    else
        return ''
}
Weapon.prototype.titleText = function () {
    return this.specialText() + this.type + " | " + (this.nameTag ? '"' + this.nameTag + '"' : this.name)
}
Weapon.prototype.getName = function () {
    return this.nameTag ? '"' + this.nameTag + '"' : this.name;
}
Weapon.prototype.hash = function (id) {
    id = id || this.id || -1;
    if (id === -1) return ''

    var hash_obj = {
        id: id,
        item_id: this.item_id,
        quality: this.quality,
        stattrak: this.stattrak,
        souvenir: this.souvenir
    }

    return hex_md5(JSON.stringify(hash_obj))
}
Weapon.prototype.getExtra = function (isString) {
    var extra = {};
    extra.hash = this.hash();
    if (this.nameTag != null) extra.nameTag = this.nameTag;
    if (this.pattern != null) extra.pattern = this.pattern;
    if (this.locked) extra.locked = this.locked;
    return isString ? JSON.stringify(extra) : extra;
}
Weapon.prototype.toLi = function (config) {
    config = config || {};
    config.new = typeof config.new === 'undefined' ? true : config.new;
    config.nameTagIcon = typeof config.nameTagIcon === 'undefined' ? true : config.nameTagIcon;
    config.locked = typeof config.locked === 'undefined' ? false : config.locked;

    config.ticker = typeof config.ticker === 'undefined' ? true : config.ticker;
    var ticker_limit = config.ticker_limit || window.innerWidth <= 433 ? 16 : 20;
    
    var classes = ['weapon'];
    if (config.new && this.new) classes.push('new-weapon');
    if (config.locked && this.locked) classes.push('wp-locked');
    if (config.nameTag && this.nameTag) classes.push('wp-renamed');

    var li = '<li class="' + classes.join(' ') + '" data-item_id=' + this.item_id + ' ' + (this.id ? 'data-id=' + this.id : '') + '>';
    if (config.nameTagIcon && this.nameTag) {
        li += '<div class="weapon_nameTagIcon"></div>';
    }
    if (config.locked && this.locked) {
        li += '<div class="lock lock-li"><span class="fa fa-lock" aria-hidden="true"></span></div>';
    }
    if (config.price) {
        li += '<i class="currency dollar">' + this.price + '</i>';
    }
    if (config.lazy_load) {
        li += '<img data-src="' + this.getImgUrl() + '" />';
    } else {
        li += '<img src="' + this.getImgUrl() + '" />';
    }

    var type = this.specialText() + this.type;
    var name = config.nameTag == true && this.nameTag ? '"' + this.nameTag + '"' : this.name

    li += '<div class="weaponInfo ' + this.rarity + '">\
            <div class="type' + (Settings.scroll_names && config.ticker && type.length >= ticker_limit ? ' text-ticker' : '') + '">\
                <span>' + type + '</span>\
            </div><div class="name' + (Settings.scroll_names && config.ticker && name.length >= ticker_limit ? ' text-ticker' : '') + '">\
                <span>' + name + '</span>\
            </div>\
           </div>';
    li += '</li>'

    return li;
}
Weapon.prototype.patternRandom = function () {
    if (this.old.patternChance) {
        var rnd = Math.rand(0, 100);
        if (rnd < this.old.patternChance) {
            return this.changePattern();
        }
    }
    return null;
}
Weapon.prototype.changePattern = function (id) {
    if (typeof id == 'undefined') {
        var sumChances = this.old.patterns.reduce(function (sum, curr) {
            return sum + curr.chance;
        }, 0);
        var rnd = Math.rand(0, sumChances);

        var cursor = 0;
        for (var i = 0; i < this.old.patterns.length; i++) {
            cursor += this.old.patterns[i].chance;
            if (cursor >= rnd) {
                this.pattern = i;
                this.img = this.old.patterns[i].img;
                return i;
            }
        }
    } else {
        this.pattern = id;
        this.img = this.old.patterns[id].img;
        return id;
    }
}

// === Functions ===

function getRandomWeapon(opt) {
    opt = opt || {};
    item_id = Math.rand(0, Items.weapons.length - 1);
    quality = opt.quality || Math.rand(0, 4);
    stattrak = opt.stattrak || false;
    souvenir = opt.souvenir || false;

    opt = {
        item_id: item_id,
        quality: quality,
        stattrak: stattrak,
        souvenir: souvenir
    };

    var weapon = new Item(opt);
    if (weapon.price === 0) {
        var newPrice = getPriceWithNewQuality(item_id, opt);
        if (newPrice.price != 0) {
            weapon.price = newPrice.price;
            weapon.quality = newPrice.quality;
        }
    }

    return weapon;
}
function getWeaponById(id) {
    try {
        if (id > Items.weapons.length) return null;
        var wp = Items.weapons[id];
        if (typeof wp == 'undefined') return null;
        if (wp.id != id) {
            for (var i = 0; i < Items.weapons.length; i++)
                if (Items.weapons[i].id === id) {
                    wp = Items.weapons[i];
                    break;
                }
        }
        return wp;
    } catch (e) {
        return null;
    }
}
function getWeaponsById(weaponsIDs) {
    var weapons = [];
    for (var i = 0; i < weaponsIDs.length; i++) {
        weapons.push(getWeaponById(weaponsIDs[i]));
    }
    return weapons;
}
function getWeaponId(type, name) {
    var nameEN = getSkinName(name).toLowerCase();
    for (var i = 0; i < Items.weapons.length; i++) {
        if (Items.weapons[i].type == type && (Items.weapons[i].skinName.toLowerCase() == nameEN || Items.weapons[i].skinName == name)) {
            return Items.weapons[i].id;
            break;
        }
    }
};
function getQualityNum(quality) {
    var Quality = [{
        "name": ["Battle-Scarred", "Закалённое в боях"],
    }, {
        "name": ["Well-Worn", "Поношенное"],
    }, {
        "name": ["Field-Tested", "После полевых испытаний"],
    }, {
        "name": ["Minimal Wear", "Немного поношенное"],
    }, {
        "name": ["Factory New", "Прямо с завода"],
    }];

    for (var i = 0; i < Quality.length; i++) {
        if (quality == Quality[i].name[0] || quality == Quality[i].name[1])
            return i;
    }
    return 0;
}


// ==== Sticker ====
function Sticker(config) {
    this.itemType = 'sticker';

    if (typeof config == 'number')
        config = {
            item_id: config
        };
    this.item_id = config.item_id || 0;
    this.type = config.type || 'Sticker';
    this.new = config.new || false;
    this.price = this.getPrice();
    this.raw = getStickerById(this.item_id);
    if (this.raw == null) {
        return
    }
    this.img = this.raw.img;
    this.name = this.raw.name;
    this.quality = this.raw.quality || '';
    this.rarity = this.raw.rarity || 'high';
    this.tournament = this.raw.tournament || null;
    
    var canDefault = {
        trade: true,
        buy: true,
        contract: false,
        sell: true,
        bot: true,
        game: true,
        inCase: true,
        specialCase: false,
        rename: false
    }
    
    this.can = $.extend(true, canDefault, this.raw.can || {});
}

Sticker.prototype = Object.create(item_proto);
Sticker.prototype.saveObject = function (opt) {
    opt = opt || {};
    var saveObj = {
        item_id: this.item_id,
        quality: 5,
        new: this.new,
        itemType: 'sticker'
    };
    if (opt.id && this.id) saveObj.id = this.id;
    if (opt.hash) saveObj.hash = this.hash();
    if (this.locked) saveObj.locked = this.locked;
    return saveObj;
}
Sticker.prototype.hash = function (id) {
    id = id || this.id || -1;
    if (id === -1) return ''

    var hash_obj = {
        id: id,
        item_id: this.item_id
    }

    return hex_md5(JSON.stringify(hash_obj))
}
Sticker.prototype.specialText = function () {
    return '';
}
Sticker.prototype.toLi = function (config) {
    config = config || {};
    config.new = typeof config.new === 'undefined' ? true : config.new;
    config.locked = typeof config.locked === 'undefined' ? false : config.locked;
    config.ticker = typeof config.ticker === 'undefined' ? true : config.ticker;
    var ticker_limit = config.ticker_limit || window.innerWidth <= 433 ? 16 : 20;

    var li = '<li class="weapon' + (config.new && this.new ? ' new-weapon' : '') + '" data-item_id=' + this.item_id + ' ' + (this.id ? 'data-id=' + this.id : '') + ' data-itemType="sticker">';
    if (config.locked && this.locked) {
        li += '<div class="lock lock-li"><span class="fa fa-lock" aria-hidden="true"></span></div>';
    }
    if (config.price) {
        li += '<i class="currency dollar">' + this.price + '</i>';
    }
    if (config.lazy_load) {
        li += '<img data-src="' + this.getImgUrl() + '" />';
    } else {
        li += '<img src="' + this.getImgUrl() + '" />';
    }

    li += '<div class="weaponInfo ' + this.rarity + '">\
            <div class="type">\
                <span>Sticker</span>\
            </div><div class="name' + (Settings.scroll_names && config.ticker && this.name.length >= ticker_limit ? ' text-ticker' : '') + '">\
                <span>' + this.name + '</span>\
            </div>\
           </div>';
    li += '</li>'

    return li;
}
Sticker.prototype.getPrice = function() {
    return ItemPrices.stickers[this.item_id] || 0;
}
Sticker.prototype.titleText = function() {
    return _t('other.sticker', 'Sticker') + ' | ' + this.name;
}
Sticker.prototype.getName = function() { return this.name };

function getItemsByID(IDs, type) {
    var result = [];
    var func = "getWeaponById";
    if (type && type.match(/stickers?/i)) {
        func = "getStickerById";
    } else if (type && type.match(/graffiti/i)) {
        func = 'getGraffitiById';
    }
    for (var i = 0; i < IDs.length; i++) {
        result.push(window[func](IDs[i]));
    }
    return result;
}
function getItemByID(id, type) {
    type = type || 'weapons';

    if (!Items[type] || id > Items[type].length)
        return null

    var func = "getWeaponById";
    if (type && type.match(/stickers?/i)) {
        func = "getStickerById";
    }

    return window[func](id);
}
function getStickerById(id) {
    if (typeof id != 'number') return null;
    if (id > Items.stickers.length) return null;
    try {
        if (Items.stickers[id].item_id == id) {
            return Items.stickers[id]
        } else {
            for (var i = 0; i < Items.stickers.length; i++)
                if (Items.stickers[i].item_id === id) {
                    return Items.stickers[i];
                    break;
                }
            return null;
        }
    } catch (e) {
        return null;
    }
}

// ==== Graffiti ====

function Graffiti(config) {
    this.itemType = 'graffiti';
    this.type = 'Graffiti';
    
    if (typeof config === 'number')
        config = { item_id: config };
    
    this.item_id = config.item_id || 0;
    this.raw = getGraffitiById(this.item_id);
    if (this.raw == null) return null;
    
    this.limit = config.limit != null ? config.limit : config.extra && config.extra.limit != null ? config.extra.limit : 20;    
    this.colorNum = config.colorNum || 0;
    this.name = this.raw.name;
    this.rarity = this.raw.rarity;
    this.color = this.raw.colors && this.raw.colors.length > this.colorNum ? this.raw.colors[this.colorNum] : null;
    this.img = this.color ? this.color.img : this.raw.img;
    this.price = this.getPrice();
    this.new = config.new || false;
    
    var canDefault = {
        trade: false,
        buy: true,
        contract: false,
        sell: true,
        bot: false,
        game: false,
        inCase: true,
        specialCase: false,
        rename: false
    }
    
    this.can = $.extend(true, canDefault, this.raw.can || {});
}
Graffiti.prototype = Object.create(item_proto);
Graffiti.prototype.saveObject = function (opt) {
    opt = opt || {};
    var saveObj = {
        item_id: this.item_id,
        quality: 6,
        new: this.new,
        itemType: 'graffiti',
        colorNum: this.colorNum,
        limit: this.limit
    };
    if (opt.id && this.id) saveObj.id = this.id;
    if (opt.hash) saveObj.hash = this.hash();
    if (this.locked) saveObj.locked = this.locked;
    return saveObj;
}
Graffiti.prototype.hash = function (id) {
    id = id || this.id || -1;
    if (id === -1) return ''

    var hash_obj = {
        id: id,
        item_id: this.item_id,
        limit: this.limit
    }

    return hex_md5(JSON.stringify(hash_obj))
}
Graffiti.prototype.specialText = function() {
    return '';
}
Graffiti.prototype.toLi = function(config) {
    config = config || {};
    config.new = typeof config.new === 'undefined' ? true : config.new;
    config.locked = typeof config.locked === 'undefined' ? false : config.locked;
    config.limit = typeof config.limit === 'undefined' ? true : config.limit;

    config.ticker = typeof config.ticker === 'undefined' ? true : config.ticker;
    var ticker_limit = config.ticker_limit || window.innerWidth <= 433 ? 16 : 20;

    var li = '<li class="weapon graffiti' + (config.new && this.new ? ' new-weapon' : '') + '" data-item_id=' + this.item_id + ' ' + (this.id ? 'data-id=' + this.id : '') + ' data-colorNum=' + (this.colorNum || 0) + ' data-itemType="graffiti">';
    if (config.locked && this.locked) {
        li += '<div class="lock lock-li"><span class="fa fa-lock" aria-hidden="true"></span></div>';
    }
    if (config.price) {
        li += '<i class="currency dollar">' + this.price + '</i>';
    }
    if (config.lazy_load) {
        li += '<img data-src="' + this.getImgUrl() + '" />';
    } else {
        li += '<img src="' + this.getImgUrl() + '" />';
    }
    if (config.limit) {
        li += '<i class="graffiti-limit">' + this.limit + '</i>';
    }

    li += '<div class="weaponInfo ' + this.rarity + '">\
            <div class="type">\
                <span>Graffiti</span>\
            </div><div class="name' + (Settings.scroll_names && config.ticker && this.name.length >= ticker_limit ? ' text-ticker' : '') + '">\
                <span>' + this.name + '</span>\
            </div>\
           </div>';
    li += '</li>'

    return li;
}
Graffiti.prototype.getPrice = function() {
    var price = 0;
    if (typeof ItemPrices.graffiti[this.item_id] === 'number') {
        price = ItemPrices.graffiti[this.item_id];
    } else if (typeof ItemPrices.graffiti[this.item_id] === 'object') {
        price = ItemPrices.graffiti[this.item_id].price;
        if (ItemPrices.graffiti[this.item_id].colors && ItemPrices.graffiti[this.item_id].colors[this.color.name]) {
            price = ItemPrices.graffiti[this.item_id].colors[this.color.name];
        }
    }
    return price;
}
Graffiti.prototype.titleText = function() {
    return _t('other.graffity', 'Graffiti') + ' | ' + this.name;
}
Graffiti.prototype.getName = function() { return this.name };
Graffiti.prototype.spray = function() {
    if (this.limit > 0) {
        this.limit--;
        if (this.limit === 0) {
            deleteWeapon(this.id);
            $('.weapon.graffiti[data-id="'+this.id+'"]').remove();
        } else {
            updateItem(this);
            if ($('.weapon.graffiti[data-id="'+this.id+'"]')) {
                $('.weapon.graffiti[data-id="'+this.id+'"] .graffiti-limit').text(this.limit);
            }
        }
        
        
        return this.limit;
    } else {
        deleteWeapon(this.id);
        return 0;
    }
}
Graffiti.prototype.getExtra = function (isString) {
    var extra = {};
    extra.hash = this.hash();
    extra.limit = this.limit;
    if (this.locked) extra.locked = this.locked;
    return isString ? JSON.stringify(extra) : extra;
}
function getGraffitiById(id) {
    if (typeof id != 'number') return null;
    if (id > Items.graffiti.length) return null;
    try {
        if (Items.graffiti[id].item_id == id) {
            return Items.graffiti[id]
        } else {
            for (var i = 0; i < Items.graffiti.length; i++)
                if (Items.graffiti[i].item_id === id) {
                    return Items.graffiti[i];
                    break;
                }
            return null;
        }
    } catch (e) {
        return null;
    }
}

// === Skins carusel ===

function SkinsCarusel(opt) {
    opt = opt || {};
    this.opt = {
        width: opt.width || 250,
        height: opt.height || 200,
        style: opt.style || null
    };
    this.count = 0;
    this.items = [];

    if (opt.items) {
        this.items = opt.items;
    }
    if (opt.ids) {
        var items = [];
        opt.ids.forEach(function (id) {
            items.push(new Item(id));
        })
        this.items = items;
    }
    if (opt.idFrom) {
        var limit = opt.idTo ? opt.idTo - opt.idFrom + 1 : 10;

        for (var i = 0; i < limit; i++) {
            this.items.push(new Item(i + opt.idFrom));
        }
    }
    this.count = this.items.length;
}
SkinsCarusel.prototype.add = function (item) {
    this.items.push(item);
    this.count++;
}
SkinsCarusel.prototype.carusel = function (opt) {
    var style = '';
    this.opt.style ? style = this.opt.style : '';

    var ret = $('<div/>', {
        class: 'skinsCarusel',
        style: style
    });
    var wrap = $('<div/>', {
        class: 'skinsCarusel-wrap',
        style: 'width: ' + this.items.length * this.opt.width + 'px'
    });

    this.items.forEach(function (item, i) {
        var itemHTML = '<div class="skinsCarusel-item"><img src="' + item.getImgUrl(true) + '" class="skinsCarusel-img"><span class="skinsCarusel-title">' + item.type + ' | <span class=' + item.rarity + '-text>' + item.name + '</span></span></div>';
        wrap.append(itemHTML);
    })

    wrap.children().first().addClass('skinsCarusel-selected');

    var controls = $('<div/>', {
        class: "skinsCarusel-controls"
    });
    controls.append('<div class="skinsCarusel-prev"><</div>');
    controls.append('<div class="skinsCarusel-next">></div>');

    ret.append(wrap);

    if (this.items.length > 1) ret.append(controls);

    return ret;
}

$(document).on('click', '.skinsCarusel-prev, .skinsCarusel-next', function () {
    var $wrap = $(this).parent().prev();
    var width = parseInt($wrap.parent().width());
    var offset = 0;
    var selected = $wrap.children('.skinsCarusel-item').index($wrap.find('.skinsCarusel-selected'));

    if ($(this).hasClass('skinsCarusel-next'))
        selected++;
    else
        selected--;

    if (selected > ($wrap.children().length - 1) || selected < 0) return false;
    offset = selected * width * -1;

    $wrap.children('.skinsCarusel-item').removeClass('skinsCarusel-selected');
    $wrap.children('.skinsCarusel-item').eq(selected).addClass('skinsCarusel-selected');

    $wrap.css('margin-left', offset);
})

/*
Item object
 {
    id: 0 - Item id
    type: "AWP" - Item type
    skinName: "BOOM" - Item name
    rarity: "consumer" - Item raryty
    img: "asdf.png" - Item image
    "can": {
        "buy": false, - Can you buy item in market
        "sell": true, - Can you sell item
        "trade": true, - Can you trade item
        "contract": true, - Can you use item in trade up contract
        "bot": true, - Can bots use item
        "stattrak": true, - Can item be StatTrak
        "souvenir": false, - Can item be Souvenir
        "inCase": true, - Can item be in case
        "specialCase": true - Can item be in special case
      }
    chances: { - Slef chances for item
        default: { - If item is default
            4: 20 - Chance for Factory New item
        },
        stattrak: { - If item is StatTrak
            4: 10 - Chance for Factory New item
        }
    }
    patternChance: 35 - Chance for change default pattern
    patterns: [ - Different patterns for item
        {
            img: 'sff.png' - Pattern img
            chance: 20 - Pattern chance
        }
    ]
 }

*/

// === Items ===
var Items = {
    weapons: [
        {
            id: 0,
            type: "M249",
            skinName: "Jungle DDPAT",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-jxcjhoyszMdS1D-OO8gY6Mm_LLManQgGRu5Mx2gv2P8dWm0AXm-UBqZ233ddDGdAFvYQzZ81Xtle25g8Dt7ZnLyCNmvSEj4WGdwUIqtfR_xQ"
    }, {
            id: 1,
            type: "Tec-9",
            skinName: "Tornado",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhz3Mzcfi9M7di5q4KZluH7DLfYkWNFpscoiOrA8NSljlXl8hJsMmuiJYKSdg46ZVrX_VK9wOnt1pS9tJSam3t9-n510ZX2qrw"
    }, {
            id: 2,
            type: "MP9",
            skinName: "Dry Season",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FBRw7OfJYTh96NOih7-JhfbiPITdn2xZ_It03L-Tod6k2lfh-0VuYmzxLYPDJANsN1mC_gK3k7rogJS_6M_KmCBmpGB8slvDS5gi"
    }, {
            id: 3,
            type: "Five-SeveN",
            skinName: "Anodized Gunmetal",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTjxM09ujmo2Og_b4DLnDl31e18l4jeHVu9r0iVLk-EVsYDj0cdCSdg5oZFvZ_wDow7_ohp7qtJTAn3ZhuSUg5y3D30vgIk2HfTE"
    }, {
            id: 4,
            type: "XM1014",
            skinName: "Jungle",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07ODHTjdX4tu6kb-JhfbiPITdn2xZ_IshiLmYrNT22Vfm_0Q6NTr7I4bHIFJsMlyD_1K4yOi80Z7ttZrNn3FjpGB8soGqpBfa"
    }, {
            id: 5,
            type: "MP7",
            skinName: "Groundwater",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFBRv7PzEeCtH096klZaEqPv9NLPF2G1VvJxwj7nCpN3ziQDgrRFqYmjzcoLAIQ9qYlzW_1Dqxbvp05-9tJjXiSw0MtBfwCk"
    }, {
            id: 6,
            type: "Glock-18",
            skinName: "Sand Dune",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxfwPz3YjxM6OO0hoGdmMj4OrzZgiVTvZUk27iU99Xw31XnrkVoa2n1LYHDcgQ4YwzX_AK3xO_n1pC56ZjJ1zI97Z-o7L5L"
    }, {
            id: 7,
            type: "SSG 08",
            skinName: "Mayan Dreams",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f2-r3fDxb7dKJkJKOlvrnDLnDl31e18l4jeHVu9qh31Xs_hY6NWn0cYCQdANraA3S8lW3x-a7jMW9vczInCFnuHRz43fD30vgXl6H59Q"
    }, {
            id: 8,
            type: "Negev",
            skinName: "Palm",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouL-iLhFfwOP3YTxO4eO0hoGdmMj4OrzZgiUCupIgi7HE8Yr33Aaw-kVvNWj7dY-QdVRtYF7SrgXowe-5h5_ov52Y1zI97QWVHCTw"
    }, {
            id: 9,
            type: "Sawed-Off",
            skinName: "Mosaico",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbuyLgNv1fX3eSR97dC_q5SCm_LLManQgGRu5Mx2gv2PrNusigHj_hBsZjv6JNfHe1draVvWrAe8ye3mg5G_u57LynpisnUjt2GdwUKBUvVtoA"
    }, {
            id: 10,
            type: "P250",
            skinName: "Facets",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhoyszLYyhP_NCzq4SKhfzLManQgGRu5Mx2gv2PpNmsjVHnrkA5Zjr2JIHBegA3MlHQ8li3xua-jcPotJ_BwHU16XZz4WGdwUK2FlY9Zg"
    }, {
            id: 11,
            type: "MAG-7",
            skinName: "Hazard",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7uifDhzw8zAcCdD_tiJlpKKgfjLP7LWnn8fvZR30r2SpY3wiQDiqks6amqmIYaRJFQ3NAnZ_1Htlenoh5-_vMnPnWwj5HeouX7iBw"
    }, {
            id: 12,
            type: "PP-Bizon",
            skinName: "Rust Coat",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlf0uL3YilH6dCJlpKKgfjLP7LWnn8f6cZ037uY8ImjjASxrhU5amj2LdPEJAY6YQrT_FXvlebqhsXv6pXAymwj5HcaiWp-nA"
    }, {
            id: 13,
            type: "AUG",
            skinName: "Anodized Navy",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFAZu7P3JZyR97s63go-0m_7zO6-fzjsEv5Yp0uuQ8dui3wTt_RBsYG-lJdSXJg5sMFGDr1C7wO7sg5G06IOJlyVTQYQwXg"
    }, {
            id: 14,
            type: "FAMAS",
            skinName: "Spitfire",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRfwOP3Yi1L-Nq_hoW0kfb5MqjulHlQ_spOhuDG_Zi7iVfg_kY-Y273LYGWcVQ-MwyDr1G_yL3v0Jbvu5nLznI3vCgrsC3Umgv3308XRo8TmA"
    }, {
            id: 15,
            type: "SCAR-20",
            skinName: "Emerald",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbmkOVUw7PLGTjhP6c63mIS0leX1JbTummJW4NE_2-_F8Y322gKw_UFkZ232dtLGew47Zw3Q_gO7lOe8g5_quZ_PyHBj6D5iuyhXhSRN_w"
    }, {
            id: 16,
            type: "SG 553",
            skinName: "Tornado",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflFfwPz3ZTJQ4t2ym7-DkvbiKvWEwT9X7ZAp2riRo46i2lHj8xFrNjynctXBJAY_YQqG81W6le68h8Duot2XnjGENDPp"
    }, {
            id: 17,
            type: "UMP-45",
            skinName: "Caramel",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1JfwPz3cjxQ7dGzmL-DkvbiKvXTkjJV7JMp2uzCrIn0jlHhrUBvMjvxIYHAe1U3NQ2E8wftlebv18O7ot2XnuNTwZ3r"
    }, {
            id: 18,
            type: "Five-SeveN",
            skinName: "Candy Apple",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTi5N086zkL-HnvD8J_WDz2pUv8cj2L-V94iniQft-xY_NWzydYOUcA89NVqD-FO-w7i70Me1ot2XnkOsbUS5"
    }, {
            id: 19,
            type: "AUG",
            skinName: "Hot Rod",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFAZu7OHNdQJO5du-gM7SlvP2a-KFkDsD6cN33b6Z84rz0QXs8xJuZzymdYfDclU2M17W_Fm7366x0jzU3_8y"
    }, {
            id: 20,
            type: "Negev",
            skinName: "Anodized Navy",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouL-iLhFf0v33fzxU9eO6nYeDg7mhN7rXlTgDuMQi3-vCpdjw2Ae2qRZsMG2mINSUIAQ3YlvZ8gW_k7q-m9bi60E-BDow"
    }, {
            id: 21,
            type: "Glock-18",
            skinName: "Fade",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0vL3dzxG6eO6nYeDg7miYr7VlWgHscN32LyT8dmm31XgrxdtZzvzJYDGIFM2Y16D-FfvlOu9m9bi66Oq9HyE"
    }, {
            id: 22,
            type: "MP9",
            skinName: "Bulldozer",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FBRv7OrNfTFN--O-kYGdjrmnNb7Qkm4G7cZ3i7nH8I-n3gXl-0duZDqiJdfDelVqZVzW_1Xowe_om9bi66Howf2G"
    }, {
            id: 23,
            type: "Nova",
            skinName: "Forest Leaves",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouLWzKjhzw8zEdDxU6c-JmImMn-O6MeyElWkB65Rz0rvCoY-kiQHh8hVsMWincYWUcwVtN1HW_VG8yO_og4j84sqw9HSVkg"
    }, {
            id: 24,
            type: "Five-SeveN",
            skinName: "Jungle",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTi5N09ajmoeHksj4OrzZgiVVsZ102LyUp9SmiQy3rRdsajiid9SXdwI-ZAnS_AS7ye66hsK9vpSf1zI97brss9rb"
    }, {
            id: 25,
            type: "SSG 08",
            skinName: "Lichen Dashed",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19fwOP3YjVN_siJgIGbksj4OrzZgiVXusMk3r6Xo4qi2lfs80I-MGnxJNSccAJsNF2Br1G8x7q805a6ucmY1zI97WgcbLEr"
    }, {
            id: 26,
            type: "AK-47",
            skinName: "Jungle Spray",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhzw8zbYS9D9eO8gY6Mm_LLP7LWnn8f6cMk2L3E9NqkilHm8hI-a2inctSWcAc8Zl-C81nvw-_uhpW06MjKzmwj5Hd9a9y0Zw"
    }, {
            id: 27,
            type: "M4A4",
            skinName: "Jungle Tiger",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhoyszeTilL69mkq4yCkP_gfbjVkDhXsMAl2b3E9N-j0ADmrRJpYWmgddTAIQ4_Yw2BqAC9l-y51JOi_MOeuFGxnXQ"
    }, {
            id: 28,
            type: "Tec-9",
            skinName: "Ossified",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhh3szHYi5L6sWJmImMn-O6YeLTx24FuMByiLyWrd3wjQKy_0Q-Z2_zcIWWdQRsZAvW_FG_lenpjYj84srtx4T2zA"
    }, {
            id: 29,
            type: "MP9",
            skinName: "Green Plaid",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FA957OPEcDRGvuO-kYGdjrmkMOrVxDhTupdw3b6T8dzz2AbjqUNuNzr3I4SWcgI3aVvU-Qe2wr-6m9bi6ztN_cUk"
    }, {
            id: 30,
            type: "CZ75-Auto",
            skinName: "Green Plaid",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotaDyfgZf2-r3YTFD5djkq4iOluHtfeqAx29X7MN33u_H8I_wjgHhr0M-N2v6d4OWdgA3NF-FqFi5kOu5gsKi_MOeUYTvLOo"
    }, {
            id: 31,
            type: "G3SG1",
            skinName: "Contractor",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposem2LFZfwPz3YTBB09C_k4if2aKiYL-IwjgAvcQki7_HoNul2w23qBc6Zjv1I4THJAA7NV7Q8gK2wOfxxcjrGqjj_1M"
    }, {
            id: 32,
            type: "MP7",
            skinName: "Olive Plaid",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFA957OPEcDRGveO7kYSCgvq6auLVzmlX6pcmj7GU9I_w0QywqUNsMG3wIYCWegA-ZVGE_VS_x7y6h4j84soz3jvt3w"
    }, {
            id: 33,
            type: "SSG 08",
            skinName: "Sand Dune",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19fwPz3YjxM6OO6nYeDg7mjYrjTwzxTsZx0j7CU9NWn2wXkqUc6ZmynI4GVe1RtZA7VqQK8xOu6m9bi6zNHnIHx"
    }, {
            id: 34,
            type: "MAC-10",
            skinName: "Commuter",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldf0Ob3fShF692xkb-GlvSlY4TZk2pH8Yty37GTrYj2iwaw-kVlMTj3dtCRJFc9MluB-FG2kuq9h5S7vJTNzHYypGB8srnlEt5q"
    }, {
            id: 35,
            type: "P2000",
            skinName: "Coach Class",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zLZAJO-duxlYeOqOemY-uBqWdY781lxL_F84_wiQPnqhVkMmqgcoKXcgI8NwrX_wPrx-fsgZPv6pjMy3dgvic8pSGKGYo2X-E"
    }, {
            id: 36,
            type: "P90",
            skinName: "Leather",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FAR17PHafipM09CzlZSDkuXLI-KBqWNU6dNoxOqSpI_z3wbt-xBqYjjxd9CTdVBrNAvV-FbrwLi8hce56JvPyHZguSM8pSGKiqmG55o"
    }, {
            id: 37,
            type: "SG 553",
            skinName: "Traveler",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflFf0Ob3fShF692xkb-YkKKhYITck29Y_cg_37iSotjw2gDl_0JvZWqlJdSSdgA7YljQqVfvl73mg5O-usvIzXFj7D5iuygYr35g1g"
    }, {
            id: 38,
            type: "USP-S",
            skinName: "Business Class",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq4yekPD1NL7ug3hBpdZOhuDG_Zi721WwqBJvMGH2coPEJwRsYVDT_lm3kO_vgJ_pvZ_MzXZivXZ04nyOlwv330_YPZS7Gw"
    }, {
            id: 39,
            type: "Sawed-Off",
            skinName: "First Class",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbuyLgNv1fX3cih9686zkY60m_L1J7PUhFRC6dJ0jubH87P4jVC9vh5yNWyhdYLEIFc6aFiGrwC2yLi6gsK-6M7KyHIwuyJwsXbVnhW0hxpFaPsv26Ju1DZk9g"
    }, {
            id: 40,
            type: "XM1014",
            skinName: "Red Leather",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07PDdTjFH7ci-kZK0j_qlY-qFqWdY781lxL3Dp4qjjgOwrUQ4Y2qlJNTDIAQ5YAzRrlG4kufrjcTutM6dmiBj6SA8pSGKXAbUj-c"
    }, {
            id: 41,
            type: "Desert Eagle",
            skinName: "Pilot",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLZTi1L4NOiq4SOlvD4NoTck29Y_cg_3bzHptWg2AK1qEs4NmqhcYeWelc6ZFiD-1G6wejmh8K9u5nIz3Zhvj5iuyh1BFVufw"
    }, {
            id: 42,
            type: "MP7",
            skinName: "Forest DDPAT",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFA957PfMYTxW09C_k4if2aemY-zXlD5X7ZVw2-yTpI_xjFXm8xZsY2ylI4-TclA8NQvU_VO2k-fxxcjrEfavWb4"
    }, {
            id: 43,
            type: "Tec-9",
            skinName: "Urban DDPAT",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhoyszMdS1D-OOjhoK0mvLwOq7c2D4B6pwijLiXpt6s3lDkrkJvZG-hLI7Ee1M7YVmC8gO-kunrjZK1tJXXiSw0uDynv1g"
    }, {
            id: 44,
            type: "Sawed-Off",
            skinName: "Forest DDPAT",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbuyLgNv1fX3eSR96NimlZS0m_7zO6-fkzhXvJIniL6Xrdqs21Xk_0Vlam2iLYbAcFdtMFjU_wW9w-e6g5-5u4OJlyXfj1l0Bw"
    }, {
            id: 45,
            type: "SG 553",
            skinName: "Army Sheen",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflFf0v73cC9P9eOlnImFksj4OrzZgiVQuJJw077FoIr3iQPnqhY5MD-gIdXGewU4ZQ3QrlW9lerojZ--v5rK1zI97cHouWKJ"
    }, {
            id: 46,
            type: "Negev",
            skinName: "Army Sheen",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouL-iLhFf0v73cC9P9eOlnImFksj5Nr_Yg2YfvcQnjLGVrNn0jgGxqhJqYTunctWRdQE8YlCE-lS4lbzsjZTovp3AmGwj5HdxpNpfKQ"
    }, {
            id: 47,
            type: "Glock-18",
            skinName: "Death Rattle",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf2-r3fzhQ49i_lb-HnvD8J_WEwjsBvpJ33bmS94qiigTm-xdkNTynctXGdAU8Y13S-QDsxerm0ZC0ot2Xnjdfx6Ff"
    }, {
            id: 48,
            type: "MAC-10",
            skinName: "Silver",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldf0v33YjRO-tmkq4yCkP_gfbqEkmpQvpYg2u2Ro9yl3gS1_xE_ZmqnJteTdgc7YgmEq1m7lLq61pWi_MOeTf6eBqg"
    }, {
            id: 49,
            type: "Nova",
            skinName: "Caged Steel",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouLWzKjhh3szHZzxO09SzjL-HnvD8J_WGwD0AuZ0o07nDptun3gLl_BY4ZWvzJ9Ocd1dsMl_R_lC5lby7hZO7ot2XnnibtMPm"
    }, {
            id: 50,
            type: "G3SG1",
            skinName: "Green Apple",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposem2LFZfwPz3di9H6dKJmImMn-O6YePSwm4GupIk3evEo9ii3wG3-kJtYjigJNOScwI8MFnU_QLvkrzm1oj84srJ8w6n6Q"
    }, {
            id: 51,
            type: "UMP-45",
            skinName: "Carbon Fiber",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf0v73cjxQ7tO4q4aClfLmDLfYkWNFpscj37nDrdqlilax_RVrMm_7LYKRelVtZV-C_ADtw-vrh5Hpv8nBzXp9-n517oYZno4"
    }, {
            id: 52,
            type: "Desert Eagle",
            skinName: "Meteorite",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLFTj5Q9c-ilYyHnu3xN4TVl3la18l4jeHVu97x31Dj_kA9a2DwcdWWJAZvZV_Qqwe3x-fv1Me6uMmanCE3vSEm4ynD30vgrmdJqGM"
    }, {
            id: 53,
            type: "Galil AR",
            skinName: "Tuxedo",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbupIgthwczbfgJN_t-3q4yCkP_gfe7VlDwJv5Up3r-V8Nym2Vfi80U9NmumI4WVJw83Zg3Q-1S8x7_o0Mei_MOe7tXEvoo"
    }, {
            id: 54,
            type: "CZ75-Auto",
            skinName: "Tuxedo",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotaDyfgZfwPz3fi9B7eO6nYeDg7msZ-KBzj0E7cdw2b_CpdX2i1Dj_hJlMWilLYWRdgNoN1qF8we8k-a5m9bi6-1tbAt1"
    }, {
            id: 55,
            type: "P250",
            skinName: "Franklin",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhjxszFfjNH9eO7kYSCgvq6Z-mHwjIFu8Yl3-3Hotr03QC28ktkYmGnIoXAdARoZVzZ_VW7yeu7jIj84sqiLuLNUw"
    }, {
            id: 56,
            type: "AUG",
            skinName: "Radiation Hazard",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFBRw7P3dejhR-M6_hIW0mOX1PbzUqWpE7_p9g-7J4cKh2wTt-kBkMT32do_Adwc2Z1rYrlS_xr_tgpO7uJqcmnswuCIi4ivegVXp1vNtKNLo"
    }, {
            id: 57,
            type: "Five-SeveN",
            skinName: "Hot Shot",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTi5N09ukkZm0meL3P77QhFRe-sR_jez-84XjjWunrgU5PQavfdHNNhg_N1HZq1W3k7_uhJG4vczKz3Frv3V05Xbem0G_gR5KaOdr0fHKS1mZGeUXSy0Rtb_k"
    }, {
            id: 58,
            type: "SG 553",
            skinName: "Fallout Warning",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflFfwOP3fyhJ6c-ihombksj5MqnemWVu-8Ik37r--YXygED68kZlam-icdTBJgBqZVvQ8gW7xum5gZ696Z2aznFhvyB25yzVnUawhQYMMLKoKiteww"
    }, {
            id: 59,
            type: "Negev",
            skinName: "Nuclear Waste",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouL-iLhFfwOP3fyhB4Nm3hr-bluPgNqnfxVRf7cJ0nNbN_Iv9nBrmr0c_N2D1co_EewI9Z1-E_gK8w-fmhJS5vMibwHFmuiQh4ivVzUCxn1gSOZtaCfWE"
    }, {
            id: 60,
            type: "P250",
            skinName: "Contamination",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhoyszGZD5O6d2kq5OAgvv4IO_uhjkEuPp9g-7J4cKt21bjqEE5Nj-lJNKTJFI-NF6E_Vm-k7vvjZe5vZzInXNqs3Em4yvbgVXp1h42q_cG"
    }, {
            id: 61,
            type: "PP-Bizon",
            skinName: "Chemical Green",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlfwPz3di9H9eO4gYOHkvbmDLzDk25f18d4kObPyoD8j1yg5UNrYTzxIdSUJFc9ZQ7V-gXvwubqhZW9vJnLzSBr6Ckk7HfezEOxiRxSLrs41lh6pmw"
    }, {
            id: 62,
            type: "XM1014",
            skinName: "Bone Machine",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07PLFTjNX79CzlZK0hPzhP7fCx1RJ5ZQh273--YXygED6_EJqNmHxLYDGcgFqYg3WrlTtyLjq05S8up3Mmntluihwty3al0bmgAYMMLKwoJ4rnA"
    }, {
            id: 63,
            type: "Tec-9",
            skinName: "Toxic",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhoyszGZD5O6d2kq5OAgvv4IO7ugm5Ssfp9g-7J4cLx0Aew_Bc5ZzryJNLHIQNoMA3Z-FTvxb29gJW978zOmHo373V05ivcgVXp1mJNZYNi"
    }, {
            id: 64,
            type: "Glock-18",
            skinName: "Reactor",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0v73fyhB4Nm3hr-bluPgNqnfx1RW5MpygdbJ8I3jkRrm_xA4a2v6d4LGc1M2YQqFrgO5lea5hJW4uM7LyHtl6CchtHzVyRWxn1gSOQY07qpC"
    }, {
            id: 65,
            type: "MAC-10",
            skinName: "Nuclear Garden",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldf0v73fyhB4Nm3hr-YnOL4P6iCqWZQ65QhteTE8YXghRrn_xBvZj-gdYaXIAM9ZA2Bq1G9krq7hpa4uZ7Bn3ExvyEnsH7alhXhn1gSOXsb08Wt"
    }, {
            id: 66,
            type: "MP9",
            skinName: "Setting Sun",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FA957P3dcjFH7c6JhIGfg_LmPenum3sI18h0juDU-MKljAbi-UM4MDrycNTAdFRoNQzZ-1a9yOy60JK96pnIwHZnuiNw5X_bgVXp1qKBy7Rx"
    }, {
            id: 67,
            type: "FAMAS",
            skinName: "Styx",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRf0v73fyhB4Nm3hr-YnOL4P6iDqW1Q5cRiteHE9JrsxgWx-ERkZ2r0cdDHd1M_MF_R-FS6l7-81MK0vZzLyyRi7HMjsyrUyxCpwUYbBN7dJDM"
    }, {
            id: 68,
            type: "Galil AR",
            skinName: "Cerberus",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbupIgthwczLZAJB6c60hpWYqPD1P7LdqWNU6dNoxLGWoI2liwG18hZsZW2hcY6cIFNvMAvS_Ffrye-6h8e4uJqbwHpnsyA8pSGK_cSp9dA"
    }, {
            id: 69,
            type: "M249",
            skinName: "Impact Drill",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-jxcjhz3MzDdCRB49C5hpO0n_L1JaKfwDpTsJF1ib3C99ymiwyw_UtvYjqiJNPHJFU4Zw2BrlC9w-fvjZLt6YOJlyVhnYj89A"
    }, {
            id: 70,
            type: "SCAR-20",
            skinName: "Army Sheen",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbmkOVUw7PLFTjxQ4cWJh4iCmfLLPr7Vn35cppV02LuXrYmgilG3-kJsZzvycdLDdQFraVyE8wO2l-_p0Z-56sjBzid9-n51ZugYOhk"
    }, {
            id: 71,
            type: "MAG-7",
            skinName: "Seabird",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7uifDhz3MzJYChD09SzlZaS2aL3ZL3TwjIHsJImjuiYo4mg3lC3rkY5Z2DycYfGdVM3aFjXrlS-wuvxxcjrKyci_ww"
    }, {
            id: 72,
            type: "CZ75-Auto",
            skinName: "Army Sheen",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotaDyfgZf0v73cC9P9eOlnImFksj5Nr_Yg2Yfv5dwiLjHpdyjjgS18kZlNW2gcdCSIQQ8ZF7SqQLtl7vp18C97ZvNwGwj5He_r99Vaw"
    }, {
            id: 73,
            type: "USP-S",
            skinName: "Para Green",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ08-5q4uDlvz9DLzDk25f1810i__Yu42g2lLm8kA4N26md9fBcgE2ZlvZ8gW9wey-jZC16pudz3Jjsicg5CrD30vgwzvxu2M"
    }, {
            id: 74,
            type: "Desert Eagle",
            skinName: "Night",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7ODHTjNL69Siq4iOluHtfeqIk29XvMcn2LmTrN-sjVW280E-Ym3yIo-WI1I-ZwqC_lK5l728hZei_MOe7MNzwV8"
    }, {
            id: 75,
            type: "Galil AR",
            skinName: "Urban Rubble",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbupIgthwczAaAJU7c6_l4GGmMjhIbnQmFRZ7cRnk6eVpd2k3Qyx_UNpY2ymI4aQcVVoY1iDrAO2kOjshJPtus_NzCNq6HUl-z-DyJA6J-Hc"
    }, {
            id: 76,
            type: "Five-SeveN",
            skinName: "Nitro",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTi5N09OklY6Mksj1MLjUmH9C1810i__Yu9um2w22qkJkZ2-hctCWJ1I2NQ2E81G8x7q505G9vczAznRjuSQn4C3D30vgF3v-5zk"
    }, {
            id: 77,
            type: "MAC-10",
            skinName: "Fade",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldf0vL3dzxG6eO6nYeDg7miZbqDxj8B7Z0n2-3E94mjjQTirRI9MTjyIIWQeg84Y1DS_lm3wOfom9bi6-g13CfU"
    }, {
            id: 78,
            type: "MP7",
            skinName: "Full Stop",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFA957OXJYzRB7dG5q5KOk8j8NrrHjyVXupIg2biQptSt3gPlrUZlNmmhcNWSIFI5M1rT_ATtybjmhce06pqb1zI97QxO8B3s"
    }, {
            id: 79,
            type: "P250",
            skinName: "Whiteout",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhz3MzfeTRW6dOjgL-DkvbiKvWElTII6ZIhj--Sp433jgXj-UduMGr2JIbBJ1dsaQ6DrwC8xL_n0Jbuot2XnjwhZrR8"
    }, {
            id: 80,
            type: "CZ75-Auto",
            skinName: "Emerald",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotaDyfgZf0v33dDBH_t26kL-HnvD8J_WElT8Gu5Eg27iVotv00Azg80ZtMDimIo-ceg45YAuCrFbtyenv1sW6ot2Xntd6B4y4"
    }, {
            id: 81,
            type: "Dual Berettas",
            skinName: "Duelist",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJf1OD3fDJW5Nmkq4-NqOfxMqndqW5d4dF0teTE8YXghRq1-UM5Nj_yIYKQewFrY1rR_1i-x-u61MXouMmdzHc37yEmsH7ayRO3n1gSOdhIizzL"
    }, {
            id: 82,
            type: "SG 553",
            skinName: "Bulldozer",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflFfwPz3aDhO4NOhq4iOluHtfbqClG0JvMQp2rmVod_z3w3n8hE5YGmncoSddgE9aV6ErFS3kufvgMCi_MOeujbJjuM"
    }, {
            id: 83,
            type: "Glock-18",
            skinName: "Twilight Galaxy",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0v73cCxX7eOwmIWInOTLP7LWnn8f7ZJ13rjC8NjxilLkqBduaj_ycdSWJldvZAuF-gPsxuvs1MTovZTJymwj5Hd3abH-_Q"
    }, {
            id: 84,
            type: "UMP-45",
            skinName: "Indigo",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1JfwPz3eDNG5du5q4GFk8jzIb7IqWZU7Mxkh6eW842tjQawqkU6Mm2ldtecdlA7NwrZ-gftw-fvhsK46JSdzXRkvHQh-z-DyNBCEWOJ"
    }, {
            id: 85,
            type: "Dual Berettas",
            skinName: "Briar",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJf2-r3ZzRM6c-JmYWPnuL5feOIxD5Qv5Al2L3FpY3wiw21qBA-N2qhIIXEdVI5M1vU8wXtxL-7gJCi_MOe_3Qy_VQ"
    }, {
            id: 86,
            type: "MAC-10",
            skinName: "Indigo",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldfwPz3eDNG5du5q4GFk8jzIb7IqWZU7Mxkh6eZrdz32FK1rUppNzr6cISUdFU_aV_T-AW6ye7uhcC-tcjOzXFl7nV0-z-DyL4k_fgB"
    }, {
            id: 87,
            type: "SCAR-20",
            skinName: "Storm",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbmkOVUw7ODHTi5W4867kpKEmePLPr7Vn35cpsdwi-_Hoo-g2wOx-0NoYW31LITAdAU9YA3Z-lnvkO_vjcLptcybwXV9-n51LW6fRVs"
    }, {
            id: 88,
            type: "P90",
            skinName: "Storm",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FBRv7ODcfi9P6s65mpS0mvLwOq7c2GoB650g2eiR94qs2Q3m_0M5YmqgcY6Scgc7ZQuCrli5kLq71sfv7snXiSw0T9wLGPo"
    }, {
            id: 89,
            type: "USP-S",
            skinName: "Royal Blue",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09Svq4mFk_7zPITEhXtu4MBwnPCPpdX2jQyx_0prY2HxctKcI1A3NAzZ_Fa8wezv0cW1uZSYnCRj7HFx4GGdwULF8u3CAA"
    }, {
            id: 90,
            type: "Sawed-Off",
            skinName: "Rust Coat",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbuyLgNv1fX3cCx9_8izkYy0mvLwOq7c2DwI65Ep2L2Q9N6l3QLjqRdrNWymLNWSJg44YV7Z-FnoxLi60JG76J_XiSw0L_5zRr8"
    }, {
            id: 91,
            type: "MAG-7",
            skinName: "Silver",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7uifDhh3czbeDFU6c6JmImMn-O6Nb3Txz9TsZZ107qR84qs3Q3m-0prZzyncIGdIVA4M1vRqFW2l7vrhoj84soh4IEyPw"
    }, {
            id: 92,
            type: "Nova",
            skinName: "Green Apple",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouLWzKjhz3MzPYzhH4uO6nYeDg7nyZbmDxzgAvsYp2rnD992s2Abm_UJuNm2hLYCQJAFqYlnSr1nrxbjqm9bi6-wzwI-Q"
    }, {
            id: 93,
            type: "P2000",
            skinName: "Chainmail",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zJfAJB5N2_mo2KnvvLP7LWnn8fupN00u2U8NykigK1rUs4MGH2dtOWdlVoYF7Y-VHrl-jtjZa9upufnWwj5HdqMVWH_w"
    }, {
            id: 94,
            type: "MP9",
            skinName: "Dark Age",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FAZt7P7NZTxO09W4mIGSqPv9NLPF2GoFsZMp2-_Dpo2m0Vaw-ERkY2zycNKXcFBoaA7Z8lnolebshMK4vcvXiSw0RlUWR70"
    }, {
            id: 95,
            type: "Desert Eagle",
            skinName: "Hand Cannon",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLZTjVD4ti1lY6FmPnLPr7Vn35cpsR33bmW9I2niQLj_kA9MG2mcNLGdlU7ZQ2F_FG8levohJa96J_Kz3J9-n51SNwWmb4"
    }, {
            id: 96,
            type: "CZ75-Auto",
            skinName: "Chalice",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotaDyfgZf0v73YzJb7dCJmImMn-O6NeLXwWlVsMAk2buQ842l3QPmqhc_YTv0I4aQcgA-aQ3V_1a-krq-04j84sqdvOTuGQ"
    }, {
            id: 97,
            type: "M4A1-S",
            skinName: "Knight",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO3mb-GkuP1P6jummJW4NE_2-zHpN2g3Vfj-kFvZ2ChJtfEJ1M2YF_Sq1LqkOm515fpup-cyHFluD5iuyj8q1fJzg"
    }, {
            id: 98,
            type: "AK-47",
            skinName: "Predator",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhzw8zSdD9Q7d-3mb-HnvD8J_WEkDoE65x03rjDrI322QfhqUtrMD2icNSRcgFtaFDX-AS9wL3u05S1ot2Xnn9ZGujG"
    }, {
            id: 99,
            type: "M4A4",
            skinName: "Desert Storm",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhoyszMdC5H_siJmImMn-O6YOvVx24C7MZy2rrD9I_00FDgqkA6YWvxdoXHegM_MAzR-AK5xunmjIj84sqcbwbCfw"
    }, {
            id: 100,
            type: "SCAR-20",
            skinName: "Palm",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbmkOVUw7ODYTi1D4NGJmImMn-O6Nr-IxT5VsZYj3biQrNqk3gThqEA-Y2qhLI-TdwA-N1yFqAfryebphIj84spWYPOlFA"
    }, {
            id: 101,
            type: "AUG",
            skinName: "Copperhead",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFA957PDHYS1H_tSzlYS0m_7zO6-fxz0H7sEk37zDpdyi3VKxqUVla277J4-ce1I3YV6D_lS8yLrt0ZC_vYOJlyXik3twsg"
    }, {
            id: 102,
            type: "Sawed-Off",
            skinName: "Copper",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbuyLgNv1fX3cCx979OmhIWZqPrxN7LEmyUJ6ZBz07CUoYjz2lCx-kFpazr6JoaTe1U8Yl_V_gLtyOntgJe975qa1zI97eqxrstO"
    }, {
            id: 103,
            type: "Desert Eagle",
            skinName: "Blaze",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLJTjtO7dGzh7-HnvD8J_XVkjoFuMYiiLqUrI-k3le3r0s5amj7d9eTI1I-M1rW-Fm_xO-50Jfvot2XnhS4_w8U"
    }, {
            id: 104,
            type: "Glock-18",
            skinName: "Brass",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0uL3cy9D_8-JnIWKge66YOLTlT8IvJcgibjEoYn331Cx-kI4N2CgJdKXIQJvYV2Eq1S3k-281oj84sq0SysHHg"
    }, {
            id: 105,
            type: "P2000",
            skinName: "Scorpion",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zJfAJR79OkhImEmcjkYeuBxlRd4cJ5nqeZo9-m21Xh8kY-MG-gIoeWe1c6NFDU_VK6lOi6156078nKyiZg7yEm-z-DyIv3UiOT"
    }, {
            id: 106,
            type: "G3SG1",
            skinName: "Desert Storm",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposem2LFZf2-r3dThR6c6iq4yCkP_gfe_Uwz4HuZ0p3u-Q9oiijgyw_UpqZjv6d4GcewdoaVGB_VG8k-nt15Ki_MOekXjyVoE"
    }, {
            id: 107,
            type: "MP9",
            skinName: "Sand Dashed",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FBRw7OfJYTh9_9S5hpS0hPb6N4Tdn2xZ_Isp07rFpY70i1Lk-ERpY233LNXAJAJsNFmG_FW3xOfu15-6vp_AyXU2pGB8suBC9uz5"
    }, {
            id: 108,
            type: "Nova",
            skinName: "Predator",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouLWzKjhzw8zSdD9Q7d-3mb-DkvbiKvXSwDMEsJci0u_Fooii31Ky8kE-ZzzwJoCTcQA4NV_Zq1bolOzogsDpot2Xno1tLOyh"
    }, {
            id: 109,
            type: "P250",
            skinName: "Sand Dune",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhz3MzbcDNG09C_k4if2fSjZLmGwDkBsZZz3r6Zo4mliwTj-0BtZDz1dYSUcAdtYw3XqFXtyejxxcjrr8fSJ40"
    }, {
            id: 110,
            type: "P90",
            skinName: "Sand Spray",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FBRw7ODYYzxb08-3moS0mvLwOq7c2GlUuZR0ibiRpNqs2VXi-kI5Mm2hd4GdIQM9NwrW-Va5xObmjJK-uczXiSw0I3Bdoc4"
    }, {
            id: 111,
            type: "SCAR-20",
            skinName: "Sand Mesh",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbmkOVUw7ODYTjBH_9SJh4GFk8j5Nr_Yg2Yf6ZEl3O3D99mm2gTkrUBsYzj0LIWWcwRtYgvU-1K7w-7tg5fv75TPnWwj5HeMNR9tGQ"
    }, {
            id: 112,
            type: "AK-47",
            skinName: "Safari Mesh",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhzw8zFdC5K08i3mr-HnvD8J_WBxTwD6ZB12b7Hodumig23rUY5YTymJ4TBcFA7NVvW-FW5l-zr1JXtot2XnkNBBWuK"
    }, {
            id: 113,
            type: "Five-SeveN",
            skinName: "Orange Peel",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTi5S08i3hIW0mOX1PbzUqWdY781lxO2WrdjwiwS38kFtYG-mLdCWJAU9MgnQ81W6xbi5gcDpuszIn3dguiA8pSGKjf2ztEE"
    }, {
            id: 114,
            type: "MAC-10",
            skinName: "Palm",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldfwOP3YTxO4eO6nYeDg7n2YeOGlWpTvpwj2-zEpNjx0A3krkFlNm2nJoWVdQM8ZwnW-FK2wOzmm9bi64Jdj8z-"
    }, {
            id: 115,
            type: "Tec-9",
            skinName: "VariCamo",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhoyszecC9L7927m7-HnvD8J_WJlzMHu5Yo2urFpYr22gDnqEBqam6gJ9KQdwc_YlGE-VS7wri70Ja_ot2Xnk_reDFK"
    }, {
            id: 116,
            type: "Sawed-Off",
            skinName: "Snake Camo",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbuyLgNv1fX3Yi19_9K3n4W0m_7zO6-fw24HvcQi37nHptz0iQHt-Rc5YWr3coCWc1I7NVqDrli2ye3n08S46YOJlyXnI7k0UA"
    }, {
            id: 117,
            type: "PP-Bizon",
            skinName: "Brass",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlf0uL3cy9D_8-JnIWKge66YrrQwGpTsZ0m27rF8NqjjVCwqUA4NziiIYHBJAQ_ZwyC_VDtw7-6h4j84sq1nvST4w"
    }, {
            id: 118,
            type: "SG 553",
            skinName: "Damascus Steel",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflFf0uL3dTxP7c-1gZO0hPChZujummJW4NE_372Sptmg3gzjrUNvam-icIeVJ1I8N1rX-lTskuzrh8XpucudnyAwvz5iuygR9uL9aQ"
    }, {
            id: 119,
            type: "P2000",
            skinName: "Amber Fade",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zJcAJE7dizq42Og_b4P7LSqWZU7Mxkh6fErN_22VbkqRBrZmn3cIOTewdqZAqE8lm_xO7ngsW_vM6YzndjuSEm-z-DyNwC_Q0C"
    }, {
            id: 120,
            type: "R8 Revolver",
            skinName: "Amber Fade",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopL-zJAt21uH3cDx96t2ykb-GkuP1P7fYlVRD7dN-hv_E57P5gVO8vywwMiukcZjBdwBraVmG_1nsk-nug8fvus6YyHFj6HQm5HfdnUfliRFKbLE7habIVxzAUNH92sAX"
    }, {
            id: 121,
            type: "AUG",
            skinName: "Daedalus",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFBRw7P_JcyRQ5dKinNO0mvLwOq7c2DJTv51zjrnE8NygiQzh_kc-a2iiLNSSdlc3aQnUrwDolb-80MLv7pnXiSw0HmqdeSU"
    }, {
            id: 122,
            type: "Dual Berettas",
            skinName: "Moon in Libra",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJf2-r3azJG5d21xb-GkvP9JrafkjkA7cYn2--TrY7z0QTk-hE-MD-lJITHegI9ZV3Vq1Xvx7jvgJG5tIOJlyWrNM96nA"
    }, {
            id: 123,
            type: "Nova",
            skinName: "Moon in Libra",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouLWzKjhoyszSfjlL7d_nq4iOluHtfbiEwDlQ65Up0rCQptXxjle1-hZlMWvzLIecewZqM1vV_AW-ye651sKi_MOegT0cVm4"
    }, {
            id: 124,
            type: "MP7",
            skinName: "Asterion",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFBRw7P_JcyRQ5dKinL-GkvP9JraflD8JsJ0p076Y99Sl0A3j-RA-azv2cYaScQ89Y1iE-QTskri-hpHq7oOJlyWB9kL-pA"
    }, {
            id: 125,
            type: "AWP",
            skinName: "Sun in Leo",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957OnHdTRD746JnIWKge66ZezUkjNX7Jwp2rnCpo2t2Qfk8xJpMTqld47DdlI_ZgqCqQLsxbvmgIj84sqMMdFayA"
    }, {
            id: 126,
            type: "Tec-9",
            skinName: "Hades",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhoyszAcDlH_-O-kYGdjrmnY7rSkD9VvcFwib7A8Nrx2w3srkA-NW3wLdCRdVU9Mg7X-FS4l-7mm9bi68L8E_3E"
    }, {
            id: 127,
            type: "M249",
            skinName: "Shipping Forecast",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-jxcjhoyszSfjlL7d_lq4iOluHtfevTxm8J6Z0m3uyUp96li1K1-BFrazz7IteRdFQ4aFnWqQTrwrrnhJ-i_MOedcIbTZY"
    }, {
            id: 128,
            type: "P2000",
            skinName: "Pathfinder",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zbYQJO7d6vhomFg_-mDLbUkmJE5Ysn37GQ9Nuh3QHm8hBvZmmiJNDBewM3M1vXrAC_xOm90MLt7svLwSNqpGB8sm38TgsC"
    }, {
            id: 129,
            type: "UMP-45",
            skinName: "Minotaur's Labyrinth",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf0Ob3fTxA9c6_mpSDqPrxN7LEmyVU7p0o3-iU8Y-k3QS2qEU9ZT_6d9Sdew46MgqE_QO7lLrog8C47ZuY1zI97d-e9afQ"
    }, {
            id: 130,
            type: "MP9",
            skinName: "Pandora's Box",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FAZh7OPJfzlN_t2JmYWPnuL5fevTlz0F7pIgieqUrYitiQWy-hdrNWumddfAcVU_NF3Zr1jvxbvu1sWi_MOepgbcjQQ"
    }, {
            id: 131,
            type: "G3SG1",
            skinName: "Chronos",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposem2LFZf0Ob3cjVQ49K5h7-MxOTzYoTck29Y_cg_3-3A8Nqj2VLl_Bc4YT32IIWRcQJsaV_Y-1Lskr2-15G4up6bm3Ayuz5iuyjiZUxvZw"
    }, {
            id: 132,
            type: "M4A4",
            skinName: "Poseidon",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszYfi5H5di5mr-GkvP9JrafwDtV7cAl2uiYpoqt3Q3n-kNkZWCmINTHe1I_YgrV-wS8xb-91p_vuoOJlyUlgXdlZw"
    }, {
            id: 133,
            type: "MAG-7",
            skinName: "Sand Dune",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7uifDhz3MzbcDNG09GzkImemrmtMe2CzmhQ6sR0j7zC89ig3VCyrktqNmqiJYOXdAQ8YQzWr1Ptlejmm9bi60MVxb_X"
    }, {
            id: 134,
            type: "Nova",
            skinName: "Walnut",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouLWzKjhjxszfcDFM-ciJmo-dlsj5Nr_Yg2YfuJIn2O2Wo92m2gXh-Bdramr1ItKUJlM3YFiC-Ae2kOi7hpbu7cydn2wj5HdE8usZbQ"
    }, {
            id: 135,
            type: "M4A4",
            skinName: "Tornado",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz3Mzcfi9M7di5q42Ok_7hPvXTlG5X6cYh3-3E89Sk0AfnrkBkY2mhJIfEcwM4M1CDqVfsyem5gsW4ot2Xnj287ZlO"
    }, {
            id: 136,
            type: "P250",
            skinName: "Gunsmoke",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhoyszPdDFS6dKJmYWPnuL5fb6AxG5XvcZ1i72UotWg3Ae1rUBoMm6gcYbDJ1dtZwvW_lC7xbrsh5Ki_MOeZVXbyKM"
    }, {
            id: 137,
            type: "Dual Berettas",
            skinName: "Anodized Navy",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJf0v33fzxU9eO6nYeDg7msZOKIz2hS7ZEki7mS89Tw0Ae3-Us4MWD7LIGRegc-MF2D81i-ku_vm9bi644LgQp9"
    }, {
            id: 138,
            type: "Tec-9",
            skinName: "Brass",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhhwszKYzxR_-O7kYSCgvq6ZLnXlThXu8QhiLuR89-hiwex_EA-MG_wcIfGdlQ3ZwrWqwK3kOy914j84spCpFtqYA"
    }, {
            id: 139,
            type: "AUG",
            skinName: "Contractor",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFBRv7OPFcgJO5du-gM6OxfakZbnQw28H65Eg2L2RrYin3ADjrkJqYWz0Jo6UdVNrYV3SqAW9366x0l1OAhlP"
    }, {
            id: 140,
            type: "FAMAS",
            skinName: "Colony",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRfwPz3Yi1D79mJmYGZnvnxDLfYkWNFpsdy2uiQpNyt2FftqUA-ZmmgJYXBJlRrZQmGq1Lox7jmg5W9vcucmnZ9-n51AJPKCtE"
    }, {
            id: 141,
            type: "Tec-9",
            skinName: "Groundwater",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhz3MzHfTRU6eO-kYGdjrmjau-EzzkGvcEnibjDotqiilKyrUY-MGDwJYOVIwNoYg7V-le8yLztm9bi63kWu9PZ"
    }, {
            id: 142,
            type: "PP-Bizon",
            skinName: "Sand Dashed",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlfwOP3ZTxS6eOlnI-Zg8jnMrXVqWdY781lxO3C89Wk21Xnqkc6MD33JoeVcwQ6aVqF8gK_krzqgMK8ucnAwXBr7Ck8pSGKKT36elM"
    }, {
            id: 143,
            type: "Nova",
            skinName: "Sand Dune",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouLWzKjhz3MzbcDNG09C_k4if2aSna-6FwzsJu5Ypj-uVrdyk2wzkqEQ4ZD3wJo7DcAQ2ZAmE-QC5xejxxcjrmUdg9dQ"
    }, {
            id: 144,
            type: "M4A1-S",
            skinName: "Boreal Forest",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO-jb-NmOXxIK_ulGRD7cR9teHE9JrsxlGy_EdvMGGmI9LAewNvaFrY-VG5wLy9jcXov8nOmHMx6ygl4XePlxGpwUYbs3f5UC8"
    }, {
            id: 145,
            type: "Dual Berettas",
            skinName: "Stained",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJf0uL3dzJQ79myq4yCkP_gfbiHwz8DvZMn27rEpdSs21bl_RE5YW6iI4CXc1NtZV7Zq1e9kOfmgJOi_MOekFRFcA0"
    }, {
            id: 146,
            type: "XM1014",
            skinName: "CaliCamo",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07PvRTitD_tW1lY2EqPPxIL7DglRd4cJ5nqeZrN-ki1ayrUE9MmrxLY-Xeg85ZlzS-gW-xOjug8S_vJucm3IysyF0-z-DyLOku5tY"
    }, {
            id: 147,
            type: "UMP-45",
            skinName: "Gunsmoke",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf2-r3djhO_Nm4q42Ok_7hPvWHwDkJu8Ao3uzA9I-kigbk-0Q5ZWGidYGddg84ZVDT_Vfrk-no0Je7ot2XnjSEoaSR"
    }, {
            id: 148,
            type: "P2000",
            skinName: "Granite Marbleized",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zAaAJF_t24nZSOqP_xMq3I2DtTucNz3rmQpt2sjAew-kpqNTj6cI6UI1dsMwmF-gS_x-q8hZTvtJTXiSw0GvFmxcU"
    }, {
            id: 149,
            type: "Nova",
            skinName: "Candy Apple",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouLWzKjhz3MzadDl94dmynZWG2aega-7TkjtQuMMgj7iR9NugiQft-RJtNm-ndoCRIwVvM1jSrwK9kO_xxcjr6R38t40"
    }, {
            id: 150,
            type: "Sawed-Off",
            skinName: "Full Stop",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbuyLgNv1fX3eSR9-t2knYOKmvjLIb7VqWdY781lxLHF99il0Ffg-EJrNmj6dtDBJA5vNQvWqVK_ye3sh5G0upvNy3FnviU8pSGKve7IyHk"
    }, {
            id: 151,
            type: "MP7",
            skinName: "Anodized Navy",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFAZu7P3JZyR94NWxnJTFwPWjY-6CxT1Su8B03r6T8Y6s2wft-EJpam6lJNfHcw8_Y1nXqFLqkvCv28FJ8mUtyA"
    }, {
            id: 152,
            type: "Glock-18",
            skinName: "Candy Apple",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxfwPz3YzhG09C_k4if2aajMeqJlzgF6ZF10r2RrNyg3Qzjrkptazj7IYaVdwE4NFHRqFHtk-fxxcjr1j3fJ1k"
    }, {
            id: 153,
            type: "AWP",
            skinName: "Pit Viper",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957ODGcDZH_9e_mr-DkvbiKvWFxDhTvMMi3ryWrNyj0Qbi8kQ4Nz3xI9CWJgQ8Nw3Vr1i_wem5hJ-9ot2XnjzZQCBr"
    }, {
            id: 154,
            type: "G3SG1",
            skinName: "Jungle Dashed",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposem2LFZfwOP3ZTxS6eOlnI-Zg8j-JrXWmm5u5Mx2gv2Ppd7zjATirxFkNWD2JIGde1Q4MlyCrAe8x-u705a6uJ7Aynph6SUq4GGdwUKYnSlmwg"
    }, {
            id: 155,
            type: "SG 553",
            skinName: "Waves Perforated",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflFfwOP3ZTxS6eOym5SYqOD1Jb7CqWdY781lxL-Tp9n331Wx-0NvMDylddfHdVJrMgnXrwC7wOnqgpC1tZzJzHcx6HQ8pSGKCgprHXY"
    }, {
            id: 156,
            type: "Galil AR",
            skinName: "Sage Spray",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbupIgthwczbYQJR_M63jb-PkuTxIa_uhWpW7fp9g-7J4cKm3FLl-UVkMGugcoeXJwE5aFzV-Vnsxu_rhZK5usnKznNl7igj5HvfgVXp1li1IAsv"
    }, {
            id: 157,
            type: "AUG",
            skinName: "Storm",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFBRv7ODcfi9P6s65mpS0m_7zO6-fzj9V7cAl2eyVpIrz2FKx8kZtZGqhIoWQJwU4aArU8le2xea50J--6oOJlyWzfFi66w"
    }, {
            id: 158,
            type: "XM1014",
            skinName: "Blue Spruce",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07ODHTjBN_8-JmImMn-O6ZuiBzjwIvsNw3OzHp4nxiVXg_hJqMG-mI4XGdw86ZFqGqVO4xOnnhIj84sodiQTp-w"
    }, {
            id: 159,
            type: "P250",
            skinName: "Boreal Forest",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhoyszOfi9H_8iJlo-Zkvb4DLfYkWNFpsEp2rzDpo-g3lLj_0duYzyiJoPAcwJqM1DWr1btl-bujZfotZXIynZ9-n51cU1OKdk"
    }, {
            id: 160,
            type: "XM1014",
            skinName: "Blue Steel",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07PLZTj9O-dmyq4yCkP_gfeiDxDMEuMBz2r_F89mm3Qay-ENuMW-nINLDJFQ_NVrU_VPqkL3qjJCi_MOe-fT9b8U"
    }, {
            id: 161,
            type: "FAMAS",
            skinName: "Cyanospatter",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRf2-r3YzhH6uO6nYeDg7nwYOqCzm0FvJwgiLyVpN-n3AW2rUVoMmHxcYaQdgNqNQvUqVjrye67m9bi68H1zE-y"
    }, {
            id: 162,
            type: "PP-Bizon",
            skinName: "Night Ops",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlf2-r3ZzxQ5d-3mY-0mf7zO6_ummJW4NE_jLmUrN_22gCw-kdvYGqmIo7GdVNsYQ3Z-1e9yevtgpbouZvIyyBnvD5iuyhUzb9WHg"
    }, {
            id: 163,
            type: "AWP",
            skinName: "Safari Mesh",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FBRw7P7NYjV9-N24q4yCkP_gfeiHxjNS6sBz0-vDpNqmilKw-RE5MDv3cdTGIVM8ZF_WqFjtkOnn0Z-i_MOe5x-cbmw"
    }, {
            id: 164,
            type: "Desert Eagle",
            skinName: "Mudder",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PvRTjBN-Mi6kYS0hPb6N4Tdn2xZ_Isn27zD8Nyt3FDgqRBlNzv7d4-ddgM_N1nT-VS_kr-6hMDtvMiaz3swpGB8spRzyX72"
    }, {
            id: 165,
            type: "SG 553",
            skinName: "Anodized Navy",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflFf0v33fzxU9eO6nYeDg7mhMO-ElTpSu5Yg2rmXrNjziwTl-xJvajuiLYTAcVdoMArRrlbtxLvom9bi65LEnjT7"
    }, {
            id: 166,
            type: "P90",
            skinName: "Teardown",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FBRw7P7NYjV95NOiq4GFk8j3PLfVqWdY781lxOuQ8Nug0VG3_EVkYmz7LIXHJAVrY1HT-FC7lO3ngJ7p7czJznRg6CE8pSGK_1A-hqA"
    }, {
            id: 167,
            type: "USP-S",
            skinName: "Night Ops",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09Svq5aKhf73MrbeqWVY781lteXI8oThxlCy-hA9MGqlJoHAIw4_Y1vXqwLskue7gJC9v5qfzCdg7nR05XjfyxCpwUYbxcylpaA"
    }, {
            id: 168,
            type: "Dual Berettas",
            skinName: "Cobalt Quartz",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJf0v73ci9b_8i3mIyCjfLwDLndg25u5Mx2gv2PoNug3lDk-RVlamn7cYfGdlI5YQ3WrFDqyLq-0JO_7p7OynM16SB0sWGdwULhW51YQw"
    }, {
            id: 169,
            type: "XM1014",
            skinName: "Grassland",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07ODHTjpQ7c-lmIGFk8j4OrzZgiUFuZd02rHHoIqk0QSwqUJpNm_yJY7Acw9tZw2B-la7w7y91MPovZXJ1zI97b6G3gQJ"
    }, {
            id: 170,
            type: "MAC-10",
            skinName: "Tornado",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldfwPz3ZTJQ4t2ym7-HnvD8J_XXzzIJuJwi2LjArNT03Vfi8hdqa2z6ddeUcwdsYVjY-1m4l-bthZG4ot2Xnqk4tkhH"
    }, {
            id: 171,
            type: "PP-Bizon",
            skinName: "Forest Leaves",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlfwOP3fThD-tmlq4yCkP_gfbjUxGoGv5Z13b3CpdmliwXsrUplNziidYWcJgJsZ1_Q8la2kLy7jJ-i_MOeb20uXFE"
    }, {
            id: 172,
            type: "P2000",
            skinName: "Grassland Leaves",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zbYQJO6d2gkZO0kOX1IKjdl2VV18l4jeHVu42i0AzhrkdoajzzLYGUelQ7YliB_we2lOq9gp_tv53AynM1uyAmti3D30vgX-J8LAE"
    }, {
            id: 173,
            type: "Nova",
            skinName: "Blaze Orange",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouLWzKjhoyszAZDNW6c6JloyKjfLLPKnQmGxU18l4jeHVu9_0iQzl-UNvZmHwI4WcI1M9Z1nX8lbox-zqjJG66MiczyBk6yF053rD30vgAuPsDfg"
    }, {
            id: 174,
            type: "P250",
            skinName: "Modern Hunter",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhoyszAZDNW6c6JmY-PkuX6DLfYkWNFppUgj7-WoNnx0Vbg-RdtZmD3LIWSJAA-MwmE_Vjrwbjph5-56MvBnSB9-n51v2AAFR4"
    }, {
            id: 175,
            type: "XM1014",
            skinName: "Blaze Orange",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07PvRTjVX4sizhr-Jm_buNoTehGpf78BOhuDG_Zi7jFGy-EJrYmmmJYLHdwE9aVrZq1O_wua508W7756cmCYxuXYm7CrYzAv3308_zX4FKA"
    }, {
            id: 176,
            type: "PP-Bizon",
            skinName: "Modern Hunter",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlf2-r3eShM-Nmkq42Ek_LmPYTdn2xZ_Ish3rGYpN2i3lay-0FkZzuiINCdcgY8MlqD-VO6xeu818LpuZ2YwSFlpGB8sl1JW1qL"
    }, {
            id: 177,
            type: "Nova",
            skinName: "Modern Hunter",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouLWzKjhoyszAZDNW6c6JmY-PkuX6DLfYkWNFppEmiLCQ8I2i3FHs-RVqNmn3JdTGJARqYVuD-1C5k7vph8fpvpjAyXt9-n51ZoikmFc"
    }, {
            id: 178,
            type: "M4A4",
            skinName: "Modern Hunter",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhoyszAZDNW6c6JmY-PkuX6DLfYkWNFppwm37rD8I72jAaxr0c-MTj7dYKWcAQ2Yg7T_wK7le_mgp-9vsmbwCZ9-n51LLZAfPE"
    }, {
            id: 179,
            type: "SCAR-20",
            skinName: "Splash Jam",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbmkOVUw7PvRTjVX4sizhr-Jm_buNoTBn2Va18l4jeHVu46iiVLhrhY4ZTumJNWSJg87NAvQ-wS8lLrmhJC0uJydmHJjv3NxsyzD30vgw6xVMJ0"
    }, {
            id: 180,
            type: "AUG",
            skinName: "Colony",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFBRv7ODYcD5H09G3homFksj5Nr_Yg2Yfu8Yk3eySodyj2wHn-RVoaz3zdo7BelA_MFrT-lLokOjn18W4uJuYymwj5HdT1XK3KQ"
    }, {
            id: 181,
            type: "G3SG1",
            skinName: "Safari Mesh",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposem2LFZfwOP3fDhR5OOilY60m_7zO6-fxzJQ68Z02OiQpdyl2FXmqENvNWGlLI_BIQU3Nw7Rqwe9lOa81Je1uYOJlyWUbIPIHw"
    }, {
            id: 182,
            type: "Galil AR",
            skinName: "Hunting Blind",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbupIgthwczbYQJP6c--q5OHluT8Nqjunm5Q_tw_ieyVod322w3l_hdvNjugctOUegU7NAmBqwToku3ogcXu6ciam3UwuT5iuyio602etQ"
    }, {
            id: 183,
            type: "Five-SeveN",
            skinName: "Contractor",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTi5N08y7l7-HnvD8J_XUlD1QuJ113rGW89-h2gew8kZqa2D7dtfAdVQ2ZVzT-QO_l-rp0ZS5ot2Xngcmh8ed"
    }, {
            id: 184,
            type: "P90",
            skinName: "Scorched",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FBRw7PfJYS1O6eO-kYGdjrnwa-7QxDlT68F33rjEpNuijgayr0VpamjyJ47AIwdqZ13Qrlm6wey9m9bi6yqeJsBm"
    }, {
            id: 185,
            type: "P250",
            skinName: "Bone Mask",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhzw8zccC1H09C_k4if2a_xML6Dxj8GupIoibmUod-n3Vbkr0FqYGv2IY_BJwc6ZAuFrFS8xb_xxcjr7uv4usk"
    }, {
            id: 186,
            type: "SG 553",
            skinName: "Gator Mesh",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflFfwOP3fDhR5OOmjZSDmPnLP7LWnn8f7cAmi7uSoN_z3A3trRBuYWGlLI7EI1c3aAqE_QDtxbrm08fvvZ_Mzmwj5HcvKiIfXQ"
    }, {
            id: 187,
            type: "MP7",
            skinName: "Orange Peel",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFBRw7OfJYTh94863moeOqPv9NLPF2D4Jv5V12e2TpNj23VbgqBdlYWqnIo7Gdlc-YF6C_VO7yOjnhZ7o7pzXiSw0U0YXXNA"
    }, {
            id: 188,
            type: "Glock-18",
            skinName: "Groundwater",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxfwPz3fjFL-tmJmImMn-O6YrrXxWoJvJMp2euQ892n21DkqRBtZGryLdKUdg85aAqG_QC_w-_ugIj84sq2hgy4GQ"
    }, {
            id: 189,
            type: "Negev",
            skinName: "CaliCamo",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouL-iLhFf2-r3ZzxQ5d-3mY-0k_LnNqnFqWdY781lxLiXrI7x31e38ktqNTz7doWRcwdtYw7YrgK6yeq71MK46cjAnyQ1vSE8pSGKUNGnClk"
    }, {
            id: 190,
            type: "SSG 08",
            skinName: "Tropical Storm",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19fwOP3YTxO4eOlnIGPmODLP7LWnn8f7scj3uuU8IiniQTnqkBpMmjxcoPAJwE_Z16CqVW7yb-9gcfpu5qczmwj5Hf46J1P4Q"
    }, {
            id: 191,
            type: "MP9",
            skinName: "Hot Rod",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FAZu7OHNdQJO5du-gM7bwqb2MeuClTsCv8Ek2LiZ9t2giwa28hVlZGD0doSUIANqYV_U_gC2366x0j0WoURS"
    }, {
            id: 192,
            type: "MAC-10",
            skinName: "Amber Fade",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldf0vL3dzxG6eO7kZSKm_v9MITdn2xZ_It13rzC9Nqj21DsqEs6ZWyiLI7AcVdsMl3W_1W7kr3vhJHotZzLnXFgpGB8sjEeQG_x"
    }, {
            id: 193,
            type: "UMP-45",
            skinName: "Blaze",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf0vL3dzFD4dmlq4yCkP_gfeuCxTMG7pFw2uiV9I-jjlHi-0dvZDygLY-dJw89NQ3QqFK3lOe9jcSi_MOeUg1XNk4"
    }, {
            id: 194,
            type: "MAG-7",
            skinName: "Bulldozer",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7uifDhz3MzRdDFO48uJnIWKge66ZeuHzjMEu8Yk3LyUo4mijgDn_RVrZzumddPGcVJoZAzQr1jsw-65hoj84sp82E9QXw"
    }, {
            id: 195,
            type: "MAG-7",
            skinName: "Irradiated Alert",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7uifDhzw8zGZDZH_8iknZCOqPXmPKzfqWZU7Mxkh6fDo932iVHm_xBsZm6gIoHEIQI7ZFHW_FHqx-jn15Hq75TKziZnuSMr-z-DyCCeIKrx"
    }, {
            id: 196,
            type: "PP-Bizon",
            skinName: "Irradiated Alert",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlfwOP3fyhJ6c-ihombksj2IbTGmFRc7cF4n-SP8dys3FfgqRI4ZD_6d9eQIQNvMAnS_lm7w-y70ZG_vJqbzyFhvCR35mGdwUKuhR019A"
    }, {
            id: 197,
            type: "Sawed-Off",
            skinName: "Irradiated Alert",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbuyLgNv1fX3Yi194sm9kZOfhf7kNoTThGRG5vp8j-3I4IG7ig2y_0ZsMGn2do6QJA4_NQ7Z-VO8xry5hMTvuM7Lm3Iw6XEgsHaMzAv33088hDSHPw"
    }, {
            id: 198,
            type: "P90",
            skinName: "Fallout Warning",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FBRw7P3dejhR-M6_hIW0mvbmPLTfqWZU7Mxkh6fHo4rz0Ve2-0U_azvyIIadJAA8aQyC_Vm4w-bn1pXouJnPnSM26XYq-z-DyFErgtK5"
    }, {
            id: 199,
            type: "UMP-45",
            skinName: "Fallout Warning",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1JfwOP3fyhJ6c-ihombksj5MqnemWVu5Mx2gv2PrN6s3gPhrUdoNWnwJIXDdQFoNQzV_1e9xebtjJK9u5WcmiRhuXRw5GGdwUKpyEqAXg"
    }, {
            id: 200,
            type: "XM1014",
            skinName: "Fallout Warning",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07ODYTjNX59mlgJKCh_LLPrrDmWRf18l4jeHVu9T33lK1qBVvYzynIoaQdQM-aA6Dqwe8kua-gpPtvJmay3RhsyIi5i7D30vgm-UlNbc"
    }, {
            id: 201,
            type: "M4A4",
            skinName: "Radiation Hazard",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhzw8zGZDZH_8iknZCOqPjmMrXWk1Rc7cF4n-SP9o6h2gfjrhY-Z2-lcYWde1NsNAmC-APok-zm0Z-_vMvBz3tq7yEmsWGdwUJ6nxi7Dw"
    }, {
            id: 202,
            type: "P250",
            skinName: "Nuclear Threat",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhzw8zGZDZH_8iknZCOqPDmNr7fqWNU6dNoxLmQrdX031DhrRY5YGmgLNDBIQU5NFDT_gS-ybi5gp_uu5iayyc2uyM8pSGKb7DLmmE"
    }, {
            id: 203,
            type: "Tec-9",
            skinName: "Nuclear Threat",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhzw8zGZDZH_8iknZCOqPDmNr7fqX9U65xOguzA45W7ilfm_EVqYWvyIdSRJ1Q_YVzT8lC6wu3vjZW-uc-YwHUwvHZ05Hvaygv330_9fYlOZg"
    }, {
            id: 204,
            type: "FAMAS",
            skinName: "Contrast Spray",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRfwOP3Yi1Q7cWJmImMn-O6Nb6Jzj1VsJch3b2X9tzz3Afn-BBsNmmmdYDBcQY2ZV_Tr1O6wL3r14j84sqUdMychw"
    }, {
            id: 205,
            type: "Galil AR",
            skinName: "Winter Forest",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbupIgthwczAaAJE486zh5S0gP76J77DqWdY781lxLvApY723Vfj80c6MG_0LISWcgJrM1uFrFe2lOq5hZHvus7AyyZg6HY8pSGKRerlrt4"
    }, {
            id: 206,
            type: "G3SG1",
            skinName: "Arctic Camo",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposem2LFZf2-r3cC9B-NW1q4yCkP_gfevUlD4F7cBzieyQoN2i3QXnrhA4MWr0LI6Rdw9tYVHT_1m3xu-5gpGi_MOeXMs2wjo"
    }, {
            id: 207,
            type: "M249",
            skinName: "Blizzard Marbleized",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-jxcjhoyszKfTRY9t2kkL-HnvD8J_XVxD8GvZYhi-2YoYnw2lXkqEJqZ2jyItSde1BqYg7T8gC6wrq905W8ot2XnqjzBKae"
    }, {
            id: 208,
            type: "P2000",
            skinName: "Silver",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zJfwJR5dCgkZK0m_7zO6-fzj9T7sEjjLnD8Y-iiVbi-kc4ajqnI4eVcVQ5NVjX-1e-x-_ujZe6uoOJlyU5sT_JRA"
    }, {
            id: 209,
            type: "MP7",
            skinName: "Whiteout",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFBRv7OTAeClH48miq4yCkP_gferXxDwDv5Zy27GY9t2sigDm_kVrMT2nIILDJFU9NF2Cr1a-lL_s1JKi_MOeui7SoYY"
    }, {
            id: 210,
            type: "M249",
            skinName: "Contrast Spray",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-jxcjhzw8zbYS9D9eO-kYGdjrnyMOjTkGkCuJYh3-qUrN-i3Ay3qEo6MGmiJYPGdwI9NVrZqVjsl-y7m9bi66ggGMLw"
    }, {
            id: 211,
            type: "UMP-45",
            skinName: "Scorched",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1JfwOP3dTxS_NCzq42Ok_7hPvWAlzsGv5Jy27rDo4r22lG1qhFvazv7IIPAelU2YguG-wC2w7vn08W8ot2XnjjPeAaD"
    }, {
            id: 212,
            type: "MAG-7",
            skinName: "Storm",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7uifDhz3MzbZTJQ4dqkm46fqPrxN7LEmyUEup1127nEoN6l3lfm-EZrMj3xIYGTJAU2Ml7Yrlftxui6hJe46pqc1zI97WswWNrq"
    }, {
            id: 213,
            type: "MP9",
            skinName: "Storm",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FBRv7ODcfi9P6s65mpS0mvLwOq7c2GoG65wnib6Q9tXz3VLkqBVpZ2rzIdfGd1c7ZVzU8gK8xuy-0Ja86svXiSw038eOvP4"
    }, {
            id: 214,
            type: "Sawed-Off",
            skinName: "Sage Spray",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbuyLgNv1fX3Yi19_8yklZm0k_LnNqnFqXhQ78BOguzA45W72AWxqERpMmzwLNeTeg82MlDW-gK4k73tg8K4uszBmnM1vyZzsCrVnwv3309qRyEFCw"
    }, {
            id: 215,
            type: "MP7",
            skinName: "Gunsmoke",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFA957PTNfS1H4uO7kYSCgvq6ZbnXwW5UuJ0nju3D8NSs31KwrhdsYmnyd9eSIwVtaQqF_lfswry-gYj84sqn5btZoA"
    }, {
            id: 216,
            type: "Desert Eagle",
            skinName: "Urban DDPAT",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PvRTjlG_N2iq5WZlcj5Nr_Yg2YfscQo3r3H9Nuki1HsrkdlMGuncoCcJAc9ZF_Q_1Dqk-zrhJDqvZ7Jymwj5HeAXIDD2Q"
    }, {
            id: 217,
            type: "Glock-18",
            skinName: "Night",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxfwPz3fzRF5MiJmYWPnuL5fb7TxG0D7cYk27zCotin2Fay8kA_NmzwI4WTcwZvYwzY_lntwbzv08Oi_MOe5mNtCOI"
    }, {
            id: 218,
            type: "P2000",
            skinName: "Grassland",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zbfgJF_t2lh4yKmfPLPr7Vn35cppQj3rqS9oit3gyx-UdlYm_wIIaQdg84YAvU_lm9lee9hcO-78zBnCF9-n51xIPJ5Oo"
    }, {
            id: 219,
            type: "CZ75-Auto",
            skinName: "Nitro",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotaDyfgZfwPz3fi9D4tuzq4GIlPL6J6iDqWZU7Mxkh6eSo9Wm0FW3_hJrajinJtXDcg82MgnY-lS3leq8gJS56ZXOnCRh6yN2-z-DyFmfHqmu"
    }, {
            id: 220,
            type: "SSG 08",
            skinName: "Detour",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f2-r3Yi5FvISJmYGZnPLmDLbUkmJE5Ysm37-Vpoj32wXs-EJrNmumLNDAclI6Z1zX_Vjqxb29hcO878nPmyRlpGB8sq1srR54"
    }, {
            id: 221,
            type: "XM1014",
            skinName: "VariCamo Blue",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07PvRTitD_tW1lY2EqPX4Jr7um25V4dB8xOyXoI7w2gayrUZoYj32IdPAdgY7ZAvV-ljvwevtgJe_6pScyicx7CM8pSGKFSQfI94"
    }, {
            id: 222,
            type: "USP-S",
            skinName: "Road Rash",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jnMrXVhmpB7dd0jtbJ8I3jkRrk-kA6amCgd9edcg9qaA7YrgLrxeu60JG87prMy3dquCB2tHaJzkHmn1gSOSGslERB"
    }, {
            id: 223,
            type: "M4A1-S",
            skinName: "Master Piece",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alfqjuhWJd7ctyj9bM8Ij8nVn6_ERkNT_0IoXHIQI9M1CE_1G3ku6605K-us7InyNhvnQnt37VnkOx1QYMMLJOVeO32Q"
    }, {
            id: 224,
            type: "G3SG1",
            skinName: "Orange Kimono",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposem2LFZf2-r3ejRP49K5q4SClvr7Pb_CqWRD6ct2j9bJ8I3jkRrnqEI9Njv2ddKWIQE3YQ7T_lPtwuvr1sS675zKmyQwuXYk43zcn0bmn1gSOQyGRkl0"
    }, {
            id: 225,
            type: "Tec-9",
            skinName: "Bamboo Forest",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhoyszKcDBA49OJnpWFkPvxDLPUl31IppEijOvFrdr0iwzirRA4Ymqnco_HcAc-NFCD_VK9l7_njJDtuczAynR9-n51oajK6Us"
    }, {
            id: 226,
            type: "P250",
            skinName: "Mint Kimono",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhzw8zDeDBN4tOJkImKmvj6N6junm5Q_tw_372R9N333QPs_hJlZGjyIIHEJwJsZQ2G_ATtxO2-jZG5uc7Nn3M2sz5iuygclVPvsA"
    }, {
            id: 227,
            type: "PP-Bizon",
            skinName: "Bamboo Print",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlf2-r3czxP7tO5q4qemfD4NoTYmGBu4MBwnPCP8dSj2Vbi_hJtZGCmJtKQJlBtZlnV8wC6l-bphMS0vpWYzHRmviQh52GdwUImyimesA"
    }, {
            id: 228,
            type: "Sawed-Off",
            skinName: "Bamboo Shadow",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbuyLgNv1fX3eSR97t27lo-EqP3hPbzdk1RT5MRygdbJ8I3jkRrgqEpqN2D2LY6XJFA_N1rV_ljrx--8g8W97ZrPnSY1syh0tCmInRy-n1gSOTvdU3xS"
    }, {
            id: 229,
            type: "Desert Eagle",
            skinName: "Midnight Storm",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLFTi5H7c-im5KGqP_xMq3I2DID7pZw2b6UpY6hjQTj_0ZkNz_xcdOXdgA2aV_S8gXqk7jqg5G-v53XiSw0vau75Eg"
    }, {
            id: 230,
            type: "P250",
            skinName: "Crimson Kimono",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhoyszDeDBN4tOJkImKmvj6N6juhG5V1810i__Yu4it0QHm-ks_YWn1IIXEcFI2Yl_U8gDtkObvhpa4vMicm3RjsiBz5yrD30vggAIcFk0"
    }, {
            id: 231,
            type: "Tec-9",
            skinName: "Terrace",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhoyszPdDJP6ciknYO0hOPxI6juj25d5MpmteTE8YXghRq2rhE6NzyiI4adIFU_ZFmCq1Dqle_thce0upjBz3IxuSIrsXaOnhHin1gSOam774aE"
    }, {
            id: 232,
            type: "Galil AR",
            skinName: "Aqua Terrace",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbupIgthwczJfAJF6dO7kZSZnvTLIK_Uhnhu4MBwnPCPoI_2iVK1_RVrMGz2IYKRdVdrMF6E_wW_w-bqhZbpu5rIz3Ni6Cgms2GdwUJTK7A28Q"
    }, {
            id: 233,
            type: "MAG-7",
            skinName: "Counter Terrace",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7uifDhoyszPdDJP6ciknYO0hOPxI6jukXlU7ctOguzA45W72Q3k_hdpYm-iIYSddQc-YVyD-lK7l-3v1p-56MiYz3RquCV2sHvfzQv330-hLT2elw"
    }, {
            id: 234,
            type: "M4A4",
            skinName: "Daybreak",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhh3szDeDBN4tOJh5WFhf7nNoTZk2pH8Ysii7uYo4r221DkqkdvZm37LYecdlQ8YgrSrgK3kOzu05C-u53AyXI1pGB8suJlCAfZ"
    }, {
            id: 235,
            type: "Desert Eagle",
            skinName: "Sunset Storm 壱",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLFTi5H7c-im5KGqPX4PLTVqWZU7Mxkh6eYoNug0Qzn80Y9ZTyncNPAJlJvMF2EqFi6wOa-gpC47pmYz3Zk6XF2-z-DyOzAiWG4"
    }, {
            id: 236,
            type: "Desert Eagle",
            skinName: "Sunset Storm 弐",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLFTi5H7c-im5KGqOT8PLHeqWNU6dNoxLHEoY6n2VXiqEdpazulddOWIAdtZFGF8lnol7_uh5K_upybnHs3vCc8pSGKn-HkWew"
    }, {
            id: 237,
            type: "Five-SeveN",
            skinName: "Neon Kimono",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTjVb09e_mY-FmMjwOrrcmWVV-_p8j-3I4IG70AHk-xZqMm2iItWQcgc-MwzT_Fm3xubqjJe87p7KzydmvyMg4H3ayQv3309niA2tcQ"
    }, {
            id: 238,
            type: "MP7",
            skinName: "Army Recon",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFBRw7ODYYzxb092kmZm0m_7zO6-fkzMGsccp0rmZ89T20QLjrkc6Y2GlcNOUewJqZwzV8ge4xbq50cS-6IOJlyXkj-WPVg"
    }, {
            id: 239,
            type: "Tec-9",
            skinName: "Army Mesh",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhzw8zFdC5K092kmZm0m_7zO6-flDkFuJFz3OjApY-ijQXh80c6Nmv1LYfGJFNsMF_Qrlm8wr-505O6voOJlyUZNPPaxw"
    }, {
            id: 240,
            type: "SSG 08",
            skinName: "Blue Spruce",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19fwPz3fDJR_-O6nYeDg7mjZ-yExW9Qu5wkj7-W8dis2AXk-kFqamHwLNLDcA5rYArW-VC9kOzqm9bi61mW1oPB"
    }, {
            id: 241,
            type: "SCAR-20",
            skinName: "Contractor",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbmkOVUw7ODHTi1P7-O6nYeDg7n3YL6Bw2lQ7cZy27yTp9X00Qztrxc4Y2DwLYCRJw9tZQ3ZrAPrx-a-m9bi67t5CePh"
    }, {
            id: 242,
            type: "Dual Berettas",
            skinName: "Contractor",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJfwPz3YTBB09C_k4if2fL2Y7mHw20IvpRy2L7Hp9-mjAzs_0U_a2nwJIeTdAA3Y13X-1PryO3xxcjroxw_w2w"
    }, {
            id: 243,
            type: "MP9",
            skinName: "Orange Peel",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFBRw7OfJYTh94863moeOqPv9NLPF2D4Jv5V12e2TpNj23VbgqBdlYWqnIo7Gdlc-YF6C_VO7yOjnhZ7o7pzXiSw0U0YXXNA"
    }, {
            id: 244,
            type: "AUG",
            skinName: "Condemned",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFBRw7P7NYjV96tOkkZOfqPH9Ib7ummJW4NE_j-jD89v33g23qkJoZ26hcdOQewBtNQqBrFO_k-rn1sK7uZ7OnSAw7z5iuyhKuKzaAw"
    }, {
            id: 245,
            type: "USP-S",
            skinName: "Forest Leaves",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ08-mq4yOluHxIITdn2xZ_Itw3bjCrYj23AzmrRY9ZziidYfGdFQ7MlnR_wS9xu6-gsO9v5mdnSQ3pGB8stw9ewh8"
    }, {
            id: 246,
            type: "Galil AR",
            skinName: "VariCamo",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbupIgthwczAaAJU7c6_l4GGmMj4OrzZgiUFsJwij-3E89qt2wzh-Us6Mj2gd4bEdQ8-MFiFrlC9w72705Tqvc_A1zI97VeOATXT"
    }, {
            id: 247,
            type: "M249",
            skinName: "Gator Mesh",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-jxcjhzw8zFdC5K08yvgIiEmcj4OrzZgiUCscMj2u-UodWsiQOw_Us5azv6JNecJwY4ZQvZ81LryL_nhZXou5_I1zI97T4Sdvxh"
    }, {
            id: 248,
            type: "G3SG1",
            skinName: "VariCamo",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposem2LFZf2-r3ZzxQ5d-3mY-0m_7zO6-fwGgIvJF00ruRrdzz3gyw80Rka2igcNfHegA2ZFqF81K5xL-5jMTutYOJlyXlhr-41Q"
    }, {
            id: 249,
            type: "FAMAS",
            skinName: "Teardown",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRfwOP3fDhR5OO-m5S0lvnwDLjemm9u5Mx2gv2P9tWmiQPk-xE-YDqlINKUdgQ6YAzTqVm9xuvpjMS5u5zPwXcxunIg7GGdwUK4xWYQ4w"
    }, {
            id: 250,
            type: "SSG 08",
            skinName: "Acid Fade",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0vL3dzxG6eOxhoGYhPv1Pb_ummJW4NE_0ruYoNz0jgflqEJrZD3yII-dcQA4ZFzV8wXqlLvogsC6v57OwCRn7j5iuyiZeoRmBw"
    }, {
            id: 251,
            type: "M4A1-S",
            skinName: "Nitro",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOlm7-Ehfb6NL7ul2hS7ctlmdbN_Iv9nBri-UY6ZmGgcNWQdAI_N1zU-gLtl-y50J66us7KyHdh6CUq5XyJnkO1n1gSOWcLwBkX"
    }, {
            id: 252,
            type: "PP-Bizon",
            skinName: "Urban Dashed",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlfwOP3ZTxS6eOlnI-Zg8jhIbnQmFRd4cJ5nqeQod3z21blrUFoMTr1d4-Tdlc5aQuB_1nswua8hZft6JrOyiQx6SEg-z-DyOXCGwQA"
    }, {
            id: 253,
            type: "Nova",
            skinName: "Polar Mesh",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouLWzKjhzw8zFdC5K092kl5SClMj3PLXFhGpC_Pp9g-7J4cL30AGyqEdqZW_2doaQIQRvYQ2Fq1i7xL_ojJK66ZvNzSNkvCEq7HvZgVXp1kdWkONk"
    }, {
            id: 254,
            type: "Five-SeveN",
            skinName: "Forest Night",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTjVb09q5hoWYg8j6OrzZglRd4cJ5nqfH9t6h3Qzs_RE5N2CmI46ccQM-YFrXrFm6xb-50JC_6p7Nn3RnsyMk-z-DyFDWgkdW"
    }, {
            id: 255,
            type: "G3SG1",
            skinName: "Polar Camo",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposem2LFZf2-r3cC9B-NW1q4OEmePmMqjFqWdY781lxO2Qodih3ALjrhZlam72cIfHdlI7Y1DXq1O2wbvng5646ZrKynpnsyM8pSGKziuLMdo"
    }, {
            id: 256,
            type: "Dual Berettas",
            skinName: "Colony",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJfwPz3Yi1D79mJmYGZnvnxDLfYkWNFppQh2-qX996s2wXhr0BrNzvzIYbEdlU5aVnXq1XtwO_qhJHu7czIz3V9-n51SayrbWI"
    }, {
            id: 257,
            type: "UMP-45",
            skinName: "Urban DDPAT",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf2-r3dTlS7ciJgZKJqPv9NLPF2DlQsJNw2bvD8N2t3gG1qURrZm6nLIbHJFRrNFzUqVm-x-jt0MO46JTXiSw0-ev9IDQ"
    }, {
            id: 258,
            type: "M4A4",
            skinName: "Urban DDPAT",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhoyszMdS1D-OOjhoK0m_7zO6-fwWhU7JQn27uR8dmhilewqEE6Mjj1ItKXcwNvNFDR-lW_kLzthsTvuIOJlyVFp_EY2g"
    }, {
            id: 259,
            type: "MAC-10",
            skinName: "Candy Apple",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldfwPz3YzhG09C_k4if2aD2Y-6DlDsHscQp2L6RoNWs2VDm8xU_NWv0JYTBdABsNAzT_AC-kObxxcjrpiSwxaw"
    }, {
            id: 260,
            type: "P90",
            skinName: "Ash Wood",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FBRw7OffeDpR09C_k4if2aSmNeKDz2kHvsZ1jLqVrNWi0A3jqkdkYW_zdYOWewI4NF_Y_AC7wu_xxcjrWn3XXSU"
    }, {
            id: 261,
            type: "SCAR-20",
            skinName: "Carbon Fiber",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbmkOVUw7PLFTj5D_t65mr-NnvXxIYTdn2xZ_Isgj7vDrN2t0FXjqBU6MWv1d4HEewc8aFHVrgS9w-e90ZG86J2dyCZqpGB8suxfkl-y"
    }, {
            id: 262,
            type: "MAG-7",
            skinName: "Metallic DDPAT",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7uifDhh3szdYz9D4uO6nYeDg7mgariClDMFusQh2LiTo9nw0FCw_UU6Y2ymdtOXclBtZl6B_AXolby-m9bi6yrTVV9L"
    }, {
            id: 263,
            type: "P250",
            skinName: "Metallic DDPAT",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhh3szdYz9D4uO6nYeDg7mmNe3UkD8GsMEo3erDp9St31K3_0JsZTqlLI-SdA5oZwuDqQW2lLrpm9bi6_KhRAkC"
    }, {
            id: 264,
            type: "Five-SeveN",
            skinName: "Silver Quartz",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTjxP09-kjZOflvv4OqHUklRC4clnj_v--YXygED6-hBpNmuldoPEcQM6YF3S-Qe_l7js1JS06pnIyno3siN3sCvezhOw1wYMMLJHgOIdFw"
    }, {
            id: 265,
            type: "Sawed-Off",
            skinName: "Amber Fade",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbuyLgNv1fX3cDx96t2ykb-GkuP1P7fYlVRd4cJ5nqfA9Nuh2Qzm-0VlZmqmcILHdQE-ZgyEqAK2xOe915fp7pqbn3Qws3Fw-z-DyIWEAXkH"
    }, {
            id: 266,
            type: "Desert Eagle",
            skinName: "Urban Rubble",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PvRTitD_tW1lY2EqOLmMbrfqWdY781lxOiYotWkjATk_0VuY2-lLI6VegNoYwzQ8lS-lL3qgpHvusvMyncyvic8pSGK-KHzzSg"
    }, {
            id: 267,
            type: "Tec-9",
            skinName: "Red Quartz",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhh3szLYyRR-N26mImRkvPLP7LWnn8fv50miL7A8N6s0Vfn-BJsY2r2JYOQcQFqZFvT_wO9ybrqjZ_pvsjAn2wj5Hc2tBLiaQ"
    }, {
            id: 268,
            type: "XM1014",
            skinName: "Urban Perforated",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07ODYTilD_NmJkI-fhMjhIbnQmFRd4cJ5nqeWoN322VHm-0ZlNmihLdSdJ1A4ZQrUqQW3xbzth8O_uc6amiZjvicl-z-DyOX_dJuw"
    }, {
            id: 269,
            type: "MAC-10",
            skinName: "Urban DDPAT",
            rarity: "consumer",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldf2-r3dTlS7ciJgZKJqPv9NLPF2DoCvZ10iOjF8Nr321Hn8xA_YGH3IIOSc1c_NVCB8lnqlLy6hpS8v5vXiSw0rU_vVoI"
    }, {
            id: 270,
            type: "PP-Bizon",
            skinName: "Carbon Fiber",
            rarity: "industrial",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlf0v73cjxQ7tO4q4aClfLmDLfYkWNFpsdy3u_D8YnxjgPlqUA-amvxdYSQewBqMAvYrge9kuvvhpa66c6fzHN9-n51aYxySVE"
    }, {
            id: 271,
            type: "P90",
            skinName: "Glacier Mesh",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FBRw7P7NYjV969C3l4mOhcj4OrzZgiUGvJck2bCYpdzx3QXs_RVqaz2mctSQJFdtZg3Wq1m8xunu1pW8vsmd1zI97XX66x_K"
    }, {
            id: 272,
            type: "AK-47",
            skinName: "Black Laminate",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhoyszJemkV4N27q4KcqPv9NLPF2GgEuJFyi-uTotT03A3h_hZlYWv2IdPAcAY8Y1vU-gPrw7rvjJ6-7ZnXiSw034A6uhk"
    }, {
            id: 273,
            type: "Dual Berettas",
            skinName: "Demolition",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJfwPz3ZTxM69mknY6OqPrxN7LEmyUJ7JUmi-zFrNys3ATiqUduZGymdYTGJldoMFzX_Va3lebshZa_uMzO1zI97ULd0Egc"
    }, {
            id: 274,
            type: "XM1014",
            skinName: "Slipstream",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07PvRTiVPvYznwL-Nhfb3J7rdqWld_cBOhuDG_Zi7jQ3j-UM6MW6hIY-XelJsaQqDrFa3lejtjZO87cvMmyRnvSVw7CqOmgv3309KvhYMug"
    }, {
            id: 275,
            type: "UMP-45",
            skinName: "Briefing",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf0Ob3ZDBSuImJmYWfhf7gNqnQqWdY781lxL2X9I-h2wzsqkpqZmigIYOQJ1U4aVzZ-VS2k-bq05C87ZXOmnFhsnQ8pSGKJGHF3CM"
    }, {
            id: 276,
            type: "P90",
            skinName: "Grim",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FAR17OORIQJF_tW7mb-HnvD8J_WEzz4AvMEmiLyV89qm31Ln-kdvYWChdoXDJ1A_Ml-GrAW_k-_qhsTtot2Xnl5g8bQH"
    }, {
            id: 277,
            type: "Negev",
            skinName: "Dazzle",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouL-iLhFf2-r3fzhF6cqJkIGRjfvxDLfYkWNFppYk37HE9omniQPk-UZuNzqidY7AIw9rYlrU_1K3kLvu1JLq75ybmnJ9-n51ZvItZMo"
    }, {
            id: 278,
            type: "G3SG1",
            skinName: "Ventilator",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposem2LFZf1OD3dm5R642JgoWFg_74Mq_ehFRd4cJ5nqeU9oim3gDnr0c4ajqnJIOce1M8ZAnR-VG8lOnnjZC9vc-dwCNjuiIh-z-DyLXb1QOb"
    }, {
            id: 279,
            type: "Five-SeveN",
            skinName: "Scumbria",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTjxT09q_goW0hPLiNrXuhWhE5cdjg-j--YXygED6qRBsZj-gIoKWd1Q2ZV3S_wC-kLzugZbu75rLnHJguHEr7SuMzRK2gQYMMLImO8cY6g"
    }, {
            id: 280,
            type: "CZ75-Auto",
            skinName: "Imprint",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotaDyfgZf1OD3cicVueOihoWKk8j4OrzZgiUJ65cm3O3Dot-lilbn-EdrZDiidYOXJAFvY1vY-FTow-fq0Je4v5vN1zI97U0IONk-"
    }, {
            id: 281,
            type: "SG 553",
            skinName: "Triarch",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflFf0Ob3YjoXuYqJgJKCluX3O4Tdn2xZ_Isij-iWoY7wiQHn-xI4NzjyJIbBcAM3YFnT_VPtkO3uhsPttZTNzHEypGB8snpeMLkS"
    }, {
            id: 282,
            type: "SCAR-20",
            skinName: "Powercore",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbmkOVUw7PTbTi5B7c7kxL-bmODxIbjehG5u5Mx2gv2Potj3i1Di_hFtMm2iIYTBJgU3Zg2Er1TvkOvm1566vM6YzSFgsikh7GGdwUIxojBz1A"
    }, {
            id: 283,
            type: "MAG-7",
            skinName: "Petroglyph",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7uifDhjxszFcDoV08iknYKKm8j4OrzZgiVSupcn3buZ9Iqh3AOy-0RkY2GmdYOcdwJrM1GB-FW7w-bvjJTotZrL1zI97ch2lL8S"
    }, {
            id: 284,
            type: "Glock-18",
            skinName: "Weasel",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79fnzL-ckvbnNrfummJW4NE_j7mT8Nrw3QXt_RY-NzymIIHGdw87ZlHZrAe-wO-70ZC4uZzNzndjvz5iuyhP0kvddA"
    }, {
            id: 285,
            type: "Desert Eagle",
            skinName: "Directive",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLZTjlH_9mkgL-OlvD4NoTSmWVC_MRzhuz--YXygED6rRFuNWv1I4XBJgU3aF-B-FDsl7jmhJS16Z2dyydhsyRx5XzdlhDiiQYMMLJVFcMKgw"
    }, {
            id: 286,
            type: "Tec-9",
            skinName: "Fuel Injector",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhnwMzcdD4b08-jhIWZlP_1IbzUklRd4cJ5nqfEpon3iwbkrUJsNjimJISSewZoNFHV_VG9k-jvjJ_t786YyCZisiAr-z-DyHMz0KNe"
    }, {
            id: 287,
            type: "MP9",
            skinName: "Airlock",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FAR17P7YKAJM7c61nZO0m_7zO6-flT0C7cR32e_A99T23gGxqEA9MWvxcNedcAY7MgqF-QK7wO3pg8K77YOJlyX5QzWtUg"
    }, {
            id: 288,
            type: "AUG",
            skinName: "Syd Mead",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFABz7PLddgJR9diJmYWKk8j4OrzZgiUCu5Yk077Epdmg3QLn8hVpN270IYKUIQU4YgnZqAO9ybrmgJa5ucvK1zI97Wf9hRPh"
    }, {
            id: 289,
            type: "FAMAS",
            skinName: "Roll Cage",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRf1OD3dzxP7c-JhoGHm-7LP7LWnn8fvZYpiOjE8NihjVbj_EE4NmD2JIScJwI8Z1-Fq1jtxe_uhZfu7s7AzWwj5HcX23zPaA"
    }, {
            id: 290,
            type: "AK-47",
            skinName: "Neon Revolution",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV0924lZKIn-7LP7LWnn9u5MRjjeyPo4ms0FLkqEU6MDv7JdfEJ1VvYVuD_1frlLrpjZ-6vsvMySFq73Yr4WGdwUIt-GQI9g"
    }, {
            id: 291,
            type: "SG 553",
            skinName: "Aerial",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflFf0Ob3YjoXuY-JlYWZnvb4DLfYkWNF18lwmO7Eu42k2gfs_EdsamyiLYDEewRvMAmDrlHox-q-gcDp6pjNnyNnvyV37X3D30vg15lPbYY"
    }, {
            id: 292,
            type: "Tec-9",
            skinName: "Ice Cap",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhh3szcdD59teOlkYG0hPb4J4Tdn2xZ_Pp9i_vG8MKi2gKy_Es6N2H0JtfEcFVtNwuBqFjvwevu15Luu5SaynNn7iUitHuIgVXp1hWR0d90"
    }, {
            id: 293,
            type: "PP-Bizon",
            skinName: "Harvester",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlf1OD3YS197tWsm460n_bmJb7Cgm5D18l4jeHVyoD0mlOx5UVpZz3xItKRcVI5NFzV8lLvwbu70JPpvMiYzyAxvCkl7XrVmRy_1UtSLrs45ecDBro"
    }, {
            id: 294,
            type: "P250",
            skinName: "Iron Clad",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhnwMzYI2gS09GzgIGHqOf1Pb7dhVRd4cJ5ntbN9J7yjRq1-kNoMDzyJtOQclBvY1zX-1C5webojZTpucnOm3Bg7yFwti3ayxTln1gSOY0jANDF"
    }, {
            id: 295,
            type: "Nova",
            skinName: "Exo",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouLWzKjhhwszGfitD08-1nb-Nnsj4OrzZglRd6dd2j6eY9oqn3gzs-kU_Mj32dtLHJwU9MwzUrlDqlb26hMPutJyfwHJmuyYm-z-DyCU-Nwd1"
    }, {
            id: 296,
            type: "MAC-10",
            skinName: "Carnivore",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldf0uL3fDxB043mq4GHnvL6DLjQm2Ru5Mx2gv3--Y3nj1H6_ko5Yz2md4TAdAQ5NFGFr1Lsl-vmgMC76smfySE16CIhs3eOmBzhgQYMMLJwa5DPVA"
    }, {
            id: 297,
            type: "Five-SeveN",
            skinName: "Violent Daimyo",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTj5X09q_goW0hPLiNrXukmpY5dx-teXI8oTht1i1uRQ5fT3wLYKWew5tMA3R81a5xOrpjZ67vZnMnSE1vHEm7Xbfyxfi1RpFP7RxxavJIr0mSF0"
    }, {
            id: 298,
            type: "R8 Revolver",
            skinName: "Reboot",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopL-zJAt21uH3cih9_oSJl5mJkuXnI7TDglRd4cJ5ntbN9J7yjRqw_hY-a2v0co-cIwI-YFHR_wO2wuno0MLtu8_ByCNj6HMrti6Im0fhn1gSOcqlDG5e"
    }, {
            id: 299,
            type: "Sawed-Off",
            skinName: "Limelight",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbuyLgNv1fX3cih9_92hkYS0mPHyDLfYm25u5Mx2gv3--Y3nj1H680Q6MTumJYOcdVNvYVyB_1DsxOi5hsS86pqayiQwvHEnsynbmhC00gYMMLL5vqM2Eg"
    }, {
            id: 300,
            type: "P90",
            skinName: "Chopper",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FABz7OORIQJE-dC6q5SDhfjgJ7fUqWdY781lteXA54vwxgPkrhVqaz30JICUdVNsYlnYr1Pql-7q0Ja16prByXZnsnEjty6Ln0GpwUYb2X3XyHA"
    }, {
            id: 301,
            type: "AUG",
            skinName: "Aristocrat",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFABz7PLddgJD_tWlgI-IhfbgDLfYkWNF18lwmO7Eu9il2ACwqRFuYzrzJ9KUIwQ_YQ6G8wC3yefpjcLo7p_MyCA37HR2tnnD30vglNIOKno"
    }, {
            id: 302,
            type: "AWP",
            skinName: "Phobos",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FABz7PLfYQJS5NO0m5O0m_7zO6_ummpD78A_jOrArNqki1ft8hBrY22lJI_GdgJrZw3Y-FK5yersgcPqvMjLy3JrvT5iuyisReGAWQ"
    }, {
            id: 303,
            type: "P2000",
            skinName: "Imperial Dragon",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zPYgJSvozmxL-CmufxIbLQmlRV-sR2hef--YXygECLpxIuNDztd9WdcFRtZ1vV-QC-lOa80J-6v8vPm3IxvCAi7H_YyxHj0htLPLNr1OveFwurwpmPNg"
    }, {
            id: 304,
            type: "SCAR-20",
            skinName: "Bloodsport",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbmkOVUw7PTbTi5B7c7kxL-Jm_j7N6jBmXlF18l4jeHVyoD0mlOx5Rc4amClcdXGIAU_NVqFqVO3x7y80ZC-vMybnXprv3UksyrYn0GzhU1SLrs42O1g5dc"
    }, {
            id: 305,
            type: "M4A4",
            skinName: "Desolate Space",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09izh4-HluPxDKjBl2hU18l4jeHVyoD0mlOx5UI6MDunIdOUcAJvNF-D_1Xtl-_t0JDqu5uazXFi7yYk4n6MmBa_hR1SLrs43QiD0nI"
    }, {
            id: 306,
            type: "M4A1-S",
            skinName: "Mecha Industries",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alDLbUlWNQ18x_jvzS4Z78jUeLpxo7Oy2ceNfXJVMgY1HX-QLoxL2-jMK9uZTLnXRlvyJws37Zzka_iEofOu1qjPbKTQqeVrsJQvdPcVsWZg"
    }, {
            id: 307,
            type: "Glock-18",
            skinName: "Wasteland Rebel",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79eJg4GYg_L4MrXVqXlU6sB9teXI8oTht1i1uRQ5fWv7II6ce1dsYl2F_wC8yL3p0MLuupmbyyM1uykmtiqInhzmgU0YZuxxxavJ__KWVeE"
    }, {
            id: 308,
            type: "SG 553",
            skinName: "Atlas",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflFf0Ob3YjoXuY-JlZSHluTLP7LWnn9u5MRjjeyPoN-j2gXsrUttZWn3LIPDIw88Zg3R8wfvwei50MLt6ZnKnXswuiR342GdwULx076BRw"
    }, {
            id: 309,
            type: "Sawed-Off",
            skinName: "Fubar",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbuyLgNv1fX3di59_92hkYSEkfHLNa7Tl3lu5cB1g_zMyoD0mlOx5UdoNzyiIIPHd1U2NV3QqFm9yL3s0ZO675jNmyRkvyIg53mOlxThgRlSLrs4e6p2_yc"
    }, {
            id: 310,
            type: "P2000",
            skinName: "Oceanic",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zAaAJSvozmxL-ElPL1PbLummJW4NFOhujT8om70FLi_0VpZzr2LYCRewE7MlDV-FG_k--718To6pqbwSQ163Il43ePygv330-1I2r84w"
    }, {
            id: 311,
            type: "MP9",
            skinName: "Bioleak",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FAZt7P7YKAJA5dO6kYGAqPv9NLPFqWdQ-sJ0xO2Y99zx2FHtrRY9YWjzII6Sc1M-ZFnQqAW5weq908e8v86dnXRjvyY8pSGK5bVi9vE"
    }, {
            id: 312,
            type: "M249",
            skinName: "Spectre",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-jxcjhjxszFI2kb08-mkYOfhfLLP7LWnn9u5MRjjeyP99z02ge3_0c5Zm_wLYbHdlRsNQvSqVK2yOfuhMC6787Lm3Zh7nEhsWGdwUJ2Zq7hgA"
    }, {
            id: 313,
            type: "G3SG1",
            skinName: "Orange Crash",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposem2LFZfwOP3dm5R642JmYmHnuP9MrTDl2VW7fp9g-7J4bP5iUazrl1uYmynIYLBd1U2Z1nY_wS4wLrpgJC1uJXAwCA1uiIrs3mInxK30kkecKUx0niP4_PE"
    }, {
            id: 314,
            type: "Dual Berettas",
            skinName: "Ventilators",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJf1OD3dShD4N6zhoWfg_bnDK3UmH9Y5MRlhfvSyoD8j1yglB89IT6mOoKQIVQ_Nw6E-FTqlO-60ZPutZ2bmHNjvnIjs3eIn0S_1EpOO7dtgPCACQLJsAlt72A"
    }, {
            id: 315,
            type: "XM1014",
            skinName: "Black Tie",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07PDdTiVPvYznwL-Yh_L3J6nEm1Rd4cJ5ntbN9J7yjRri-EJkNjz2JdWRcgNoM12F8gC6wb-60cDvv8nAwSZmuSB04nfUzhDln1gSOamXNP31"
    }, {
            id: 316,
            type: "Tec-9",
            skinName: "Re-Entry",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhh3szcdD4b086zkIKHluTgDLfYkWNF18lwmO7Eu9zz0FCx_EZrYG6gd4WQI1U_NVnUqQe5xeftgZ6_tMmYzSZk63Iq4XbD30vg4jvN4E0"
    }, {
            id: 317,
            type: "SSG 08",
            skinName: "Ghost Crusader",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f1OD3Yi5FvISJlZKGlvT7Ib7ummJW4NFOhujT8om72ADn-Edua2_6d4CRJwdvYVDR-la-xOu-gcO97p7KyyM3s3Ml43yOnwv330-AaacpqQ"
    }, {
            id: 318,
            type: "Galil AR",
            skinName: "Firefight",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbupIgthwczPYgJF7dC_mIGZqP76ML7fk3lQ_MpjteXI8oTht1i1uRQ5fW_1LY-Vc1Q2ZVrT_FDsxejuhZ7v6cnJmHdmv3Yn4HjYlxa-1RhFbbBxxavJuP_di1g"
    }, {
            id: 319,
            type: "CZ75-Auto",
            skinName: "Red Astor",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotaDyfgZf1OD3cicVud2JhoWPluTgPKnummJW4NFOhujT8om7jQTkrkVka2D7ItWQcg45ZgnR-lLolOjp0ZG86smfyCQwuyNwtyrVzQv3308yHtCojQ"
    }, {
            id: 320,
            type: "UMP-45",
            skinName: "Primal Saber",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf0Ob3ZDBSuImJhJKCmvb4ILrTk3lu5Mx2gv3--Y3nj1H6_UQ-Nj_6JdeRcQE9ZQzW_1W7wOi5g5PvuJ_BwXViu3Ig4HiJnRWziAYMMLJag8KlOQ"
    }, {
            id: 321,
            type: "P250",
            skinName: "Asiimov",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhjxszYI2gS092lnYmGmOHLP7LWnn9u5MRjjeyPoo_2jgDi_hVrNzr2IdKXJg84YVzW_wW6weq8hJbv7s7BmnZnuHN3sGGdwUIcgRyEsg"
    }, {
            id: 322,
            type: "AUG",
            skinName: "Fleet Flock",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFAR17PLddgJR-926mI-chMj4OrzZglRd6dd2j6eZpdz02wDlrhFuMjz2INLGcgBoMlCE8gTsxbro0cLuvM7Mn3NgsyR0-z-DyLrumJEn"
    }, {
            id: 323,
            type: "M4A1-S",
            skinName: "Chantico's Fire",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITCmX5d_MR6j_v--YXygECLpxIuNDztIoOSIFM9YFrYrgK8l-rnjJPpuZzJnCFiviQqt3nay0SxgRBFabdqgeveFwuw6cQQkw"
    }, {
            id: 324,
            type: "PP-Bizon",
            skinName: "Judgement of Anubis",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlf0Ob3czRY49KJl5WZhPLLP7LWnn9u5MRjjeyP9t2si1Lh80c4YDzxLNLHdg8_ZQzR_1S3krrsjZG1tZTNzHVqviR27WGdwUJIurA39A"
    }, {
            id: 325,
            type: "AK-47",
            skinName: "Elite Build",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56P7fiDzRyTQXJVfdhUfQp4A3-EBg_7cNqQdqJ-7oULlnx4IbPZ7YkNN9IGMnSC6KBYQ_4v0kw1PdZJ5KNqS--2Hy4aWgPWRPq_XVExrEYKUC6xQ"
    }, {
            id: 326,
            type: "MP7",
            skinName: "Armor Core",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52JLSKMSZYfxSVPrVSSOc7-QfoDDU818tqU9-iyLcHO1u6qofFNrF5MdFOGZXUC_-DbwCp608x06VUK5TYqCzv3nvtO2oJDUXi82Ia2LjQjcMi_PQ"
    }, {
            id: 327,
            type: "Desert Eagle",
            skinName: "Bronze Deco",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5_MeKyPDJYcwn9A7JRUu8_yxv8CDU55MJcWdKy_q4LFlC-9tWTLbIrN9hIHMfQW_7SNV__4hg9g6JUJpba8yjo2yy9OjxZWxLq_mkNy-KZ-uw8pmry-JI"
    }, {
            id: 328,
            type: "P250",
            skinName: "Valence",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5rZrblDzZ2TRSQVPBhX_o04Af5Gxg_7cNqQdqJ-7oULlnxvNeTYbgkZt5JGcTTWKWFNQD84h861qZdK8bYo37v1S_qbG4PWkHs8nVExrFKJNMnjg"
    }, {
            id: 329,
            type: "Negev",
            skinName: "Man-o'-war",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz51MeSwJghmfzvMBKdbSso9-Af-EBg-4cBrQOi69qkBLBLutdeUYeUpMt0ZFsKCDvbXYw-pvk9sg_BaKJyM8SnujC3oMmwJCULs5Ctaz7ibAjCv"
    }, {
            id: 330,
            type: "Sawed-Off",
            skinName: "Origami",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5oNfSwNDhhdDvBFJ9NXeI_8AfqDxg9-s5kVdq_yLcPLlSr296Xced5Lt0aHpLTCaPQYF3460Nr1PBbJsHY8Xy7iXngaGxZWRfrq2kNy7CH6eF1wjFBAh5S4Mo"
    }, {
            id: 331,
            type: "AWP",
            skinName: "Worm God",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56I_OKMSZYcxPSPrRJVfs_ywTlDi8m18tiRtCzub1ffgq8sIOUO-YlN9AYHZLYDveFYQr5vEo81qdYJ5OAqCi71SjgbG8UG028p6V0PDo"
    }, {
            id: 332,
            type: "MAG-7",
            skinName: "Heat",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52NeTiDzRyTQnDBvdhTvA-_Af4Nio37M52Wei69qkBLBLovYDAZuIpNItFGMOCXvXUYA34uEs-1fAJfJaPqS68jC24bjhbUxDj5Ctaz0CuSGif"
    }, {
            id: 333,
            type: "CZ75-Auto",
            skinName: "Pole Position",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz54LrTgMQhkZzvBG_cLY-Uo8QvlGi495vhvXdC-44QKKE644ZyXM-QsZYlFS8nSDKCPNQz-7xhq1PAMJsaJp3vujCTsa2sLUxK68mlWhqbZ7RHTLq9k"
    }, {
            id: 334,
            type: "UMP-45",
            skinName: "Grand Prix",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5uOfPhZQhmfzvXDLBhTvQ58RrTBCI24dJua9u35bwDZw675daVO7glZt1FG5PYD_WGbwCsu01rifNUfZGP8Xjn23y9PGYKWUL1ujVTGwldwdc"
    }, {
            id: 335,
            type: "Five-SeveN",
            skinName: "Monkey Business",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz59PfWwIzJxdwr9ArVhWvws8RvpHyI818ViWta49oQLLFi28d-pb-FuZ41SH8nTC6LSZQCvvxg70vBUJ5WL9HvsjyzhaWtfCRLt_DoMmuaGvbBu1HFWHSawKQYvKQ"
    }, {
            id: 336,
            type: "FAMAS",
            skinName: "Djinn",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz59Ne60IwhmYzvEAK1fT8ow_QbiNio37M52Wei69qkBLBLvsNTCO7koMI1OTpLXX6PTMg377Bo6gfIIKpeL8S-52yzrPGZcWxrt5CtazzU75Wol"
    }, {
            id: 337,
            type: "★ Flip Knife",
            skinName: "Doppler",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhfg3SPqFTY_E15BjgDDUN-M9iR9LiyLcPLlSr296Xced5LttNSZbQW_XUZ1v7ux4xgvILKcCN8yPo3S3ubjpbXhHuqGwDnu7R7uZ1wjFB8ZY2tGk",
            patternChance: 20,
            patterns: [
                {
                    img: 'Phases/Flip-Doppler/p1.webp',
                    chance: 50
            },
                {
                    img: 'Phases/Flip-Doppler/p2.webp',
                    chance: 50
            },
                {
                    img: 'Phases/Flip-Doppler/p3.webp',
                    chance: 50
            },
                {
                    img: 'Phases/Flip-Doppler/p4.webp',
                    chance: 50
            },
                {
                    img: 'Phases/Flip-Doppler/ruby.webp',
                    chance: 20
            },
                {
                    img: 'Phases/Flip-Doppler/sapphire.webp',
                    chance: 10
            },
                {
                    img: 'Phases/Flip-Doppler/black-pearl.webp',
                    chance: 5
            },
        ]
    }, {
            id: 338,
            type: "★ Bayonet",
            skinName: "Doppler",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz55Nfq6PjJzTQXPPqRRTOU28RrTGS8z-8Iwa9u_8LMSFlC-9tWTLbYsMIxESsSBCPCDZgD44x1p06NULMSPo3652i-6O2kCCkHu-W4CneeZ-uw8JM0c440",
            patternChance: 20,
            patterns: [
                {
                    img: 'Phases/Bayonet-Doppler/p1.webp',
                    chance: 50
            },
                {
                    img: 'Phases/Bayonet-Doppler/p2.webp',
                    chance: 50
            },
                {
                    img: 'Phases/Bayonet-Doppler/p3.webp',
                    chance: 50
            },
                {
                    img: 'Phases/Bayonet-Doppler/p4.webp',
                    chance: 50
            },
                {
                    img: 'Phases/Bayonet-Doppler/ruby.webp',
                    chance: 20
            },
                {
                    img: 'Phases/Bayonet-Doppler/sapphire.webp',
                    chance: 10
            },
                {
                    img: 'Phases/Bayonet-Doppler/black-pearl.webp',
                    chance: 5
            },
        ]
    }, {
            id: 339,
            type: "Glock-18",
            skinName: "Catacombs",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz58OOy2OwhkZzvFDa9dV8o-8Qn4ATM95MtcWN6x_685JV2t49fYYOZ_Y94dHsfQWfHXZQqvuBk9gqUOfpSBpSy83Sq6bGkMD0e6_m8NzPjH5OVwKWjZhQ"
    }, {
            id: 340,
            type: "M249",
            skinName: "System Lock",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52ZrfsDzRyTQmQVflhT_Ax4Af-Nis77893a9u35bwDZ1_msYWTNLB_Nt1KH8LUCPTVZg__vExp1qNdLJTYpyy8jy66Mm1cWkD1ujVTVFVP0W0"
    }, {
            id: 341,
            type: "MP9",
            skinName: "Deadly Poison",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52JLqKMyJYfxSbPqRbXfE27Tf8Bi4h58lcWN6x_685JV2t49fYM7crNtFLGZXXWv_TNQ6v70s71PVaepGO8iK81CvrOW0CXRLuqG5QyfjH5OVWTbGSlQ"
    }, {
            id: 342,
            type: "SCAR-20",
            skinName: "Grotto",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5oN-KnYmdYcxX9EqNfTqdqywTpCCwN5M5kXMOJ-7oULlnxtISUOrIvMd5PF5KBWfKBMwD8uU0_gfQOeZfaoSnp2SrsPmkDXxvi-XVExrGSZo1ewA"
    }, {
            id: 343,
            type: "XM1014",
            skinName: "Quicksilver",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5jObLlYWNYcxX9Ga0PDKRuyxvlDisz18tqU9-iyLcHO1u6qoXHYLEkMIsYHJLYCKLTNw6p6hk5gagMfZfbqX7q2SrgOD0PWkHoqzoa2LjQ78kjYhs"
    }, {
            id: 344,
            type: "Dual Berettas",
            skinName: "Urban Shock",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5-OOqhNQhkZzvHDalKWeYF4RruCCkh_MhxWei6_rwOPWOz5cCRZq54M9sfFpSEXPOCZQ2p4hkx1qUIKMeMoCPti366ODsKXELj_W9RnuSCpPI11fqKGsLr"
    }, {
            id: 345,
            type: "Desert Eagle",
            skinName: "Naga",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5_MeKyPDJYcxX9BaVfW_k_ywbtDiYN5M5kXMOJ-7oULlnx5obHM-F4ONtJTcHYU_LXYg317Ew-0fRdKpyJpSLp3yThazgICEHo-XVExrHsEocDmg"
    }, {
            id: 346,
            type: "MAC-10",
            skinName: "Malachite",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52NeDkYAhmfzvPAKMPDMo39QTtCi87_MJcWN6x_685JV2t49fYOrh4Y9pPGcjSWPPTZ1qs7xhtgqZfKJaJ9nvs33zgOGlZDRHo_TlWy_jH5OWEIq_jLA"
    }, {
            id: 347,
            type: "Sawed-Off",
            skinName: "Serenity",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5oNfSwNDhhdDvBFJ9NXeI_8AfqDxg27dFia9u_8LMSFlC-9tWTLbl6ZowZH8SGWKCGbgupuR48iaMPLcPYpn_t2C2_PGdcXhDjq24EyuOZ-uw8CazJ5C8"
    }, {
            id: 348,
            type: "Galil AR",
            skinName: "Chatterbox",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz58Ne-8PDZ1TQfXPqdfUPw2ywnuGyYh4chta9qz87ITJGOz5cCRZq4oN45OF8eGWKKAY1-u4x081vQIe8eN9izojCjpP2xYCRXj_G4MyrSOpPI11eqEdWL_"
    }, {
            id: 349,
            type: "★ Butterfly Knife",
            skinName: "Slaughter",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhlZxDWBLJYUOwF9QXTEyIw-sZcWN6x_685JV2t49fYO-YpZNpESciCUvCGYV316Us9ifJZe8OPoSK93iTgb2xcChbu-zlWnPjH5OXGTTUtRA"
    }, {
            id: 350,
            type: "R8 Revolver",
            skinName: "Crimson Web",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopL-zJAt21uH3eSR9-9m0h7-GkvP9JrafwjsHvsQmjrmUrI_00FHg_EY-YzzycNeSe1JsZw7R-QS6kry5hMDu6oOJlyWSzPI-Lg"
    }, {
            id: 351,
            type: "AUG",
            skinName: "Ricochet",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFAZt7PLddgJI-dG0mIW0m_7zO6-fkjMHsZUgi72T896m0VCwqEBlMD31IIPBcFc_ZlrY-1m2wLi6hpHouYOJlyUksb3lzA"
    }, {
            id: 352,
            type: "Desert Eagle",
            skinName: "Corinthian",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLZTjlH7du6kb-ImOX9Pa_Zn2pf18h0juDU-MKm2ley-kE6MGGnJIOXclA2ZQ7Vr1Lrlem8gpfvuMzOySBjsyd3s3vUgVXp1hBYWgPe"
    }, {
            id: 353,
            type: "P2000",
            skinName: "Imperial",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zJfAJSvozmxL-CmufxIbLQmlRD7cFOhuDG_Zi7iwDjrkFsZGrzI4GXd1NqYA7Zr1ntl-i7hJK7tMmbnyZgvyIhtniMmAv3308P9JxMBw"
    }, {
            id: 354,
            type: "Sawed-Off",
            skinName: "Yorick",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbuyLgNv1fX3di59_92hkYSEkfHLPb7ShGRc6ctyj_v--YXygED68xA5Mj3xIYHEJFJoMA7VqFm7w7_phMK-v5jBmCNg7HIq4SuIyR2xgQYMMLK-nAIxoA"
    }, {
            id: 355,
            type: "SCAR-20",
            skinName: "Outbreak",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbmkOVUw7PvRTi5B7c7kxL-BgvnzP77DqWdY781lxL3Ho9il2lK1qEY_Mmn3JdfEJwFqM1nXqFO_xbvq1sDouZjIzXswviQ8pSGKZe0NLy8"
    }, {
            id: 356,
            type: "PP-Bizon",
            skinName: "Fuel Rod",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlf0Ob3czRY49KJmo-TnvjhIITdn2xZ_It1ibrA89mijlXk-UdoZ2GhJoLAdlJqM1DY-Vnvwb_shp_v6cjNzyE2pGB8st2-4asr"
    }, {
            id: 357,
            type: "Five-SeveN",
            skinName: "Retrobution",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTj5X09q_goWYkuHxPYTDk39D58dknuDO-7P5gVO8v11rNj_3doSVIA5taAmFrlXqx-rphJ66vc7AnXtg6Cgj43zdyRPm0h9NcKUx0kOQhc3i"
    }, {
            id: 358,
            type: "Negev",
            skinName: "Power Loader",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouL-iLhFf0Ob3fzhF6cqJnY2blvTgDLfYkWNFppYi27zHo96i2lftqRFrammlLYCScQc4ZVvS-VO-wea9gcS075rLwHR9-n51CuXQpfM"
    }, {
            id: 359,
            type: "SG 553",
            skinName: "Tiger Moth",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflFf1OD3YjoXuY-JgImMkuXLPrTFnlRd4cJ5nqeQrYjw2FHhrkNuam73JdeTdQU9YVjT8gS4xei51MS9uZTPnyE17ygq-z-DyOkB2OsD"
    }, {
            id: 360,
            type: "Tec-9",
            skinName: "Avalanche",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhjxszcdD4b092glYyKmfT8NoTdn2xZ_It0iL-Wp9r02gDk80c-NWylJ9WdIQ5tZliDrlnrkO3ogZS57ZrJwSdgpGB8sqmt10R9"
    }, {
            id: 361,
            type: "XM1014",
            skinName: "Teclu Burner",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07PLZTiVPvYznwL-DmOPLIbTVqWdY781lxO-Xo9j32Afirko-ZzygIoWddwE6N1nXq1jsxru-hZ-8ucjBmndk7yA8pSGKrPA1flw"
    }, {
            id: 362,
            type: "G3SG1",
            skinName: "The Executioner",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposem2LFZf0Ob3dm5R642JkZiOlOLgOrTfk3lu5cB1g_zMu9ili1Kw_kY5YTqndo-SJwc4Z1yG_ge2lb27h5C_vJzJySBrvCMntnnD30vg20AigU4"
    }, {
            id: 363,
            type: "P90",
            skinName: "Shapewood",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FAR17OORIQJR5N2mkZeEmPPLP7LWnn8f7ZIm3r2Zodz20A22-hFkYDumLITBcFA4ZQqFqFTvx-nujMW4u8-dymwj5HeKrOWJ7A"
    }, {
            id: 364,
            type: "M4A4",
            skinName: "Royal Paladin",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhnwMzFJTwW0865jYGHqOTlJrLDk1Rc7cF4n-SP8dSm2gHk-UtoZGv7I9DBcVM5ZV_XqFe_lervhsS76sjIyCBhviYg52GdwUI8s6PzHQ"
    }, {
            id: 365,
            type: "R8 Revolver",
            skinName: "Fade",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopL-zJAt21uH3cDx96t2ykb-ZkuH7P63UhFRd4cJ5nqfA89uiiVGx8hVkYWDwItOSdwc-M1DZr1bowb3u18Tqus-fmCM17CQn-z-DyMgtirei"
    }, {
            id: 366,
            type: "★ Huntsman Knife",
            skinName: "Case Hardened",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfx_LLZTRB7dCJlZG0mP74Nr_um25V4dB8xOyV8Nmk2gLnrRA5ZjjzJNCce1NsZ1_T_le9yO7qhJG96pzLynZlvig8pSGK0BpTrQ0"
    }, {
            id: 367,
            type: "★ Karambit",
            skinName: "Slaughter",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20jfL2IbrummJW4NE_0rGVoNvzilG3qkduNmCnd4eSdAE3aVuD_Ve8wOe7hpLuuJuYmyRivj5iuyi_zJQcBA"
    }, {
            id: 368,
            type: "★ M9 Bayonet",
            skinName: "Crimson Web",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-DjsjjNrnCqWZU7Mxkh6fF8Yqmiw3l_BdrZ2vzIo-QdQBsaA2B-lC3yb_v0JW_uc_JmHQ16yYh-z-DyKLv5rKC"
    }, {
            id: 369,
            type: "Galil AR",
            skinName: "Sandstorm",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz58Ne-8PDZ1TQfXPrNfUvEp4Af-BBg-4cBrQOi69qkBLBLvtIrPMLcrMt8ZGMWCDP6CZl3_uE45gfVee52NqSm-3C-7PzteWUK45Ctaz0ith5CI"
    }, {
            id: 370,
            type: "Five-SeveN",
            skinName: "Kami",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz59PfWwIzJxdwr9CblhV_Q3_TfgACA6_PhvVcWx8vUFLAjmt4uQZrQtYttMTMbRXvXQYgH64kwx0aRaepHfpXzt3yq8Mm8LRVO1rSl_NBek"
    }, {
            id: 371,
            type: "M249",
            skinName: "Magma",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52ZrfsDzZ2TQvAEqlaVfQ0ywTlDi8m18tiRtCzubheKA_n54vFNrR_Mo5IGsPRDPaOZguouxo8ifIMfpyBpyK9j3vgbzoUG028nK1bRDI"
    }, {
            id: 372,
            type: "PP-Bizon",
            skinName: "Cobalt Halftone",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz55Pfm6PghmfzvWFLJPU_wp8TfkCCs0_MhtUei6_rwOPWOz5cCRZq55M9wYTMSCC6SEMAipu00-0qFZfcGL9Cm8jHm7P28JWBq4r2MFzuLTpPI11aeG_vDx"
    }, {
            id: 373,
            type: "FAMAS",
            skinName: "Pulse",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz59Ne60IwhkZzvEAK1fT8oq4QT_DBg-4cBrQOi69qkBLBK55dbDZ-Z_ZN8eH5ODDKOAYwyu7Rg7iaFee5WAoSvr3STpPmcPUka45Ctaz43kx0xd"
    }, {
            id: 374,
            type: "Dual Berettas",
            skinName: "Marina",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5-OOqhNQhvazvPALJXUvQF5x3iGy4h7fhvXdC-44QKKE644ZyUYOR6M9kaGpGGXqeDNACvvx060vNde5CKoyzo3Ci4OT8KXxPsqGIGhqbZ7cfEGYZ8"
    }, {
            id: 375,
            type: "MP9",
            skinName: "Rose Iron",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52JLqKMTpYZgzNE65HY-c15w3TBDdr18tqU9-iyLcHO1u6qtPHO7d6MdtIH8SFCKePYF2o7Ek61qUOJpHcqC_v2iW_aG8CDxu__Tga2LjQTMcg99M"
    }, {
            id: 376,
            type: "Nova",
            skinName: "Rising Skull",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz51O_W0DzRyTRfJFKxSY_s14gnTBS414NNcWNak8L5IfAnn4IbEN7IoYYwYTsiDCfWFbgqv6k5shaJVJ8OOpSLs2n_pPTtcCg2rpDz3X_s53g"
    }, {
            id: 377,
            type: "M4A1-S",
            skinName: "Guardian",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52YOLkDyRufgHMAqVMY_YvywW4CHZ_-_hmWNKx9rUSFlC249qCXOx9co8ZAcGBCaTUZgn76k08iKFULsTapSntiXjvMj1cDxTp-jkDybKOsrJuhGsIAy_nGTrvCT4"
    }, {
            id: 378,
            type: "P250",
            skinName: "Mehndi",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5rZrblDzRyTRSQVPBhTvA8_QbpDRg-4cBrQOi69qkBLBLm4NPFO-J_Nd5NTcbVXfCDYwyv60w4gPRUepSJ9H69jijrM2cOCBXs5Ctaz0X8rQo8"
    }, {
            id: 379,
            type: "Sawed-Off",
            skinName: "The Kraken",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5oNfSwNDhhdDvBFJ9NXeI_8AfqDxg969NsRMK754QKIFu38O2aYvJ7ZcZLGcGEDPOPZwiovBg-0ahbL5OI8y293im8Pm9bWUW9_D5XnufSv7o5nC9IFJFCr8KS"
    }, {
            id: 380,
            type: "★ Gut Knife",
            skinName: "Tiger Tooth",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhgZxD9AK5hSPw98RrTBjUz5sBma9u_8LMSFlC-9tWTLbQpOdgYHJHZXPCAZ1r4v0480fdeLZ2M83jt3irpPWlcCBXorm8MnrSZ-uw8-9ETQO4"
    }, {
            id: 381,
            type: "★ Flip Knife",
            skinName: "Fade",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhfg3SPqFfY_M78A3TBS414NNcWNak8L5IcQ3u4oqTO-F6Mo1MH8bXX6WGYg6s4xg51agLL5Hb8n_qjH68Mm1YWg2rpDz-PIrjNA"
    }, {
            id: 382,
            type: "★ Huntsman Knife",
            skinName: "Night",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhzcwfWCKNfUMop-zfiACA6_PhuUdO_4rY5JV2t49fYO7V-ZdFJFsSBXPWAYwqp70s6gqRZfJyOqC_viSXtaGteXkG_8mxXmvjH5OVitTZMMg"
    }, {
            id: 383,
            type: "Galil AR",
            skinName: "Rocket Pop",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz58Ne-8PDZ1TQfXPqdfUPw29RrTGSYg_M5gWNKlyLYDLVWq6e2aYvJ7ZcYeSZOEXaCCbgH_6x0x1akMepLao3jp2yq9b20DWRHt_T0EzLLS67c_nC9IFLYL1mrZ"
    }, {
            id: 384,
            type: "Glock-18",
            skinName: "Bunsen Burner",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz58OOy2OwhmYzvFDa9dV6Riyw7gCCo3-_hhWMKzyLcPLlSr296Xced5Lt0aSpTSWaKDNwr_7UI706NYJpSN9X-91CS7PmtcWkLpqGtXyu_TvOF1wjFBmRSH7Cw"
    }, {
            id: 385,
            type: "Nova",
            skinName: "Ranger",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz51O_W0DzRyTQrNF6FhTvQ08w3-Nis77893a9u35bwDZ1ns4YuSMOQoN4xJGMDXWv-EZAv-u0k-iPQLKpzY9Hjq3n68PWgIXBv1ujVTb3I2RPc"
    }, {
            id: 386,
            type: "P90",
            skinName: "Elite Build",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5rbbOKMyJYYl2SPq1fT-E_5hHTBS414NNcWNak8L5ILwnn4tTCO7l_OdoaSZHYCfDTYlr56EM5hPMMe5WI8ynq33m_Oj9YXQ2rpDwHd5SOPQ"
    }, {
            id: 387,
            type: "UMP-45",
            skinName: "Riot",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5uOfPhZQhkZzvXDLAKCcov5BrjCDUN5M5kXMOJ-7oULlnxtIaVZ7goM9pMTMTTXfbUNVyp609pg6hVJseJ9Svr3H6_bGgNDkDj8nVExrHq5qP_Iw"
    }, {
            id: 388,
            type: "USP-S",
            skinName: "Torque",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5uJ_OKIz5rdwrBBLJhX-AF4Rv8Njcg58BxUcSl_q05JVW47Mapb-FuZ41SFsGDDqOBbgiuvktriKRdLcfb8njp23vqPT1ZXEXqqDpSmreGuuFrh3FWHSaeZn8kMg"
    }, {
            id: 389,
            type: "FAMAS",
            skinName: "Neural Net",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz59Ne60IwhmfzvEAK1fT8o--xz_Nis77893a9u35bwDZ1i8stTHOrIrOIodTMXSD6eGYFv1v0g9h6cLfpaLpCzt2XvrbGYICRf1ujVTMR8h6dA"
    }, {
            id: 390,
            type: "M4A4",
            skinName: "Evil Daimyo",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52YOLkDzRyTQmWAPRhWeMz-DfoCC4_8chcWN6x_685JV2t49fYYLIsOIodHcXSCfbSbgD96Bhp0ahaLMSPoy68j3u4M2oPXhPjq2wFnvjH5OWQSzhsMQ"
    }, {
            id: 391,
            type: "MP9",
            skinName: "Ruby Poison Dart",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52JLqKMTpYfxSbPq5XSOc18w3iNis77893a9u35bwDZw--tNDDYrd_ZNtNTseDDKKDMAmp40tqifBdfpTd8ny8iX_vPmxZCEL1ujVT23-_sLM"
    }, {
            id: 392,
            type: "Negev",
            skinName: "Loudmouth",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz51MeSwJghkZzvMBKdbSso7-gblAS4-6dNsRui6_rwOPWOz5cCRZq4oMtlMHMnTX_HVNVuvuRkx0vBcK5CP83u-3Hi9OD9fXxvp8zkBnO-CpPI11SU0272-"
    }, {
            id: 393,
            type: "P2000",
            skinName: "Handgun",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5zP_PnYGc3TQXTPrAMDKVqywrjBioN5M5kXMOJ-7oULlnxt4uQM7F-MIpEGZLXU_PUM1j47Eg4gKVeLcPc83y9iyTqPm8PDkbu8nVExrGZVdfHFg"
    }, {
            id: 394,
            type: "CZ75-Auto",
            skinName: "Yellow Jacket",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz54LrTgMQhkZzvBG_cLXco5_An_HS4o7dVcWN6x_685JV2t49fYZ7MuM9wfGMHSCfXVZg_1ux9q0vcJKpKIqHnr2yW6PWkCDRHo_2pQzPjH5OV2yXnMiA"
    }, {
            id: 395,
            type: "MP7",
            skinName: "Nemesis",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52JLSKMyJYfxSVPq5bUeYz5zfgACA6_PhvVcWx8vVRewzosNfBMuEuN9BOGJbUW6LVY137vE45gfVfeZWJo3nujyvpbmZbRVO1rQV_0bh4"
    }, {
            id: 396,
            type: "SG 553",
            skinName: "Cyrex",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5oM7bgZghkZzvRBvULD8o57RrpERg-4cBrQOi69qkBLBK64oCQYbF5NIxEF5XYD6SBNQmovB45gvRfLJTYpy3sjnzoPWcIChe_5Ctaz3AB5wK9"
    }, {
            id: 397,
            type: "★ Falchion Knife",
            skinName: "Night",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhcwjBCalRUsop-zfiACA6_PhuUdO_4rY5JV2t49fYOrl4NtFNTpTSUvKPMgirvhltgqlfLsaPqHnt23vrP24CU0C9rmpQmPjH5OU_T7XgZQ"
    }, {
            id: 398,
            type: "★ Falchion Knife",
            skinName: "Stained",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhcwjBCalRUso75TfqBjUx7cNcWN6x_685JV2t49fYMOIlON4YSZPTU_PTYA_97R851qFYecbdoXzsiCu7Mj0ICBG4-z0BkfjH5OUx1yeioQ"
    }, {
            id: 399,
            type: "★ Falchion Knife",
            skinName: "Urban Masked",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhcwjBCalRUsop5Df4CDc319JxVta4yLYDLVWq6e2aYvJ7ZcZPG8HYWKXVbl2r6009hPdafJaKqX_o2CTubG4NWxXi-zgAkOWE77s9nC9IFBG64vUO"
    }, {
            id: 400,
            type: "G3SG1",
            skinName: "Murky",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz58Z_CyYQhmfzvFUrNZDco34RrnEBg-4cBrQOi69qkBLBK954aTO-QsZd9MS8LZX_SDYQ-p7xgxhqRee8SOoXzt3H-6OmxYUxLr5Ctaz2ByeXjz"
    }, {
            id: 401,
            type: "MAG-7",
            skinName: "Firestarter",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52NeTiDyR3TQnDBvdhWvwo8QrlHTM35vhvXdC-44QKKE644ZzAN7B9ZtoZS5LVWKeBMAj66k06gPRcKJDd9Hu-2HvsaTgNXRDo-G5WhqbZ7eH05by4"
    }, {
            id: 402,
            type: "MP9",
            skinName: "Dart",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52JLqKMyJYfxSbPqNWWeMo-wbTBS414NNcWNak8L5IfwXn5dDDO7MpM98ZHJWEXqSBYA_8vkhu0_daKsfcpii53X69bD9YUg2rpDwPQXfqow"
    }, {
            id: 403,
            type: "Five-SeveN",
            skinName: "Urban Hazard",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz59PfWwIzJxdwr9ArVhWvws8RvpHyI819JxVta4yLMHM12t4O2aaud0dLcQToKHD-iCYw_07E1sgqILfsOIoCnrjijoaGYLWBO5_ToDmOSOvuM9gmcRQ3O2s6zS_pb-hwV-"
    }, {
            id: 404,
            type: "UMP-45",
            skinName: "Delusion",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5uOfPhZQh0YjvXDLAKCco-uR7lGi495tRcWN6x_685JV2t49fYMLN9Zd8ZFpXYCKCEYlyo40xuhPdee5bc9Svu3njsO2kCWULs_21SyfjH5OWma4QvFA"
    }, {
            id: 405,
            type: "Glock-18",
            skinName: "Grinder",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz58OOy2OwhmYzvFDa9dV8o5-wHgDCMN5M5kXMOJ-7oULlnxvYDDMbAtNIlNS8aGUv-HYFyv601ugvMPJ5HY8yLs2nvpPWcMWEDtqXVExrF-qWWg-A"
    }, {
            id: 406,
            type: "M4A1-S",
            skinName: "Basilisk",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52YOLkDyRufgHMAqVMY_QrywW4CHYh18ViR966_qgNFlC249qCXOx9co8ZAcHYWfGGMg_470w9gKFeKJPcoSnojiq_PDwKXEDsrz8AnrWO7uE41G0IAy_nDZWl0i0"
    }, {
            id: 407,
            type: "M4A4",
            skinName: "Griffin",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52YOLkDzRyTQmWAPRhW-cz8g7lBxg-4cBrQOi69qkBLBK-5dDBYLB4MtgZS5HQCKeEMg_840sxhKMJfJaMqSq5iCXvPWxeXRDt5Ctaz9MW9lnQ"
    }, {
            id: 408,
            type: "Sawed-Off",
            skinName: "Highwayman",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5oNfSwNDhhdDvDEJ9NXeI_8AfqDxgw5MZgX9C5-785JVW47Mapb-FuZ41SG5HYCfXXZA6u7UM406MMKsDao3_rjyvvMmgOUhu_qT4Am-_Tv-NsgXFWHSZ8v7z9Aw"
    }, {
            id: 409,
            type: "P250",
            skinName: "Cartel",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5rZrblDzZ2TRSQVPBhX_Qo4A3gNis77893a9u35bwDZ1jpt9eXMrErOdtITpPYDP_XYgmsvB44gqYLfpHYoS7s1Xm7aG8NXBT1ujVTX8t-hgs"
    }, {
            id: 410,
            type: "SCAR-20",
            skinName: "Cardiac",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5oN-KnYmdYcRH9EqNfTqdqywHiHSIg_sJtQN65-YQKIFu38O2aYvJ7ZcZFGZTZC_SANVqs7Eo_gqFaLZWB8SLs23ntOGpeXRTtqDhWmrXSueBinC9IFNKrHl9C"
    }, {
            id: 411,
            type: "XM1014",
            skinName: "Tranquility",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5jObLlYWNYcRH9Ga0PDKRuywvtGy4m6dRcWN6x_685JV2t49fYM7YsZd5PGMiGX6SDN1v7vBg9g_Bfe8eNpSu53nnvMjwCWxDorGgEnPjH5OUhOLJtjw"
    }, {
            id: 412,
            type: "★ Gut Knife",
            skinName: "Fade",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhgZxD9AKFhWvQ-8TfgACA6_PhvVcWx8vVQLATm54DFNLAqZYkaTMPUD_GBZwqu6E081vUJeseApC7r2XzgaGgNRVO1rQU2Lej8"
    }, {
            id: 413,
            type: "UMP-45",
            skinName: "Corporal",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5uOfPhZQhkZzvXDLBhX_oo5Af-CCsN5M5kXMOJ-7oULlnxsIuUNOZ-NokaHsPQCaOFNA-ovhps1fJYLMTfoS3t3XnsOToPCUDp_XVExrF5MWgaMQ"
    }, {
            id: 414,
            type: "Negev",
            skinName: "Terrain",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz51MeSwJgh0YjvMBKdbSsou4Rr9NjM3-tViXdmJ-7IBIUiA6NOEZOUyOYtKTMbXUqSGMw-vuUI8ifJdKZ2B9im63H6_OWdZChTor2tVnOLW76wr3DjKUnQWFg"
    }, {
            id: 415,
            type: "Tec-9",
            skinName: "Sandstorm",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhjxszcdD4b08-3moSYg_jmPoTdn2xZ_Pp9i_vG8MLw2wy2-xc9MjqhJ9fEd1I2N17Z-AC7lLvvgMfouM-ayXprvygi7SyJgVXp1mC692Rx"
    }, {
            id: 416,
            type: "MAG-7",
            skinName: "Heaven Guard",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52NeTiDzRyTQnDBvdhVPA74g3iNis77893a9u35bwDZ1m-tILEZuF9MY5FF8SFWPGOMAz0u0I7hPIMJpWIpnzv3iW9OmgLWRP1ujVTn5gDvZ0"
    }, {
            id: 417,
            type: "MAC-10",
            skinName: "Heat",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52NeDkYAhkZzvPAKMPDMoo8QzkBjMN5M5kXMOJ-7oULlnxsdPBYuIuYdpFHcKECPeFZgz17hg60_MILpCN9Sm81S3tazpZCkbqrnVExrE60SBKWw"
    }, {
            id: 418,
            type: "SG 553",
            skinName: "Pulse",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5oM7bgZghkZzvRBvULD8oq4QT_DBg-4cBrQOi69qkBLBK7sYTCOrAsZNhJS5bQD6OHMlj66Uxr1PRbLpGN9Xjq2Hu4OWgMUxe95Ctazza3vale"
    }, {
            id: 419,
            type: "FAMAS",
            skinName: "Sergeant",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz59Ne60IwhmfDvEAK1fT8op8xzTBS414NNcWNak8L5IfF3mtobHZ7QtYdsfHMWBWaDUNAv9ux5q0_VfLZeMo3vpjCXsbGkIDQ2rpDzWyUyVMA"
    }, {
            id: 420,
            type: "USP-S",
            skinName: "Guardian",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5uJ_OKIz5rdwrBBLJhX-AF4Rv8NiI-7cBiWsOJ-7IBIUiA6NOEZOUyNNlKScbQXaXVY1-svxk9gvMIL8OLon_ujyThPmsKWBrqrG8BmrfUuKwr3DioatWxnA"
    }, {
            id: 421,
            type: "Nova",
            skinName: "Antique",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz51O_W0DzRyTQrNF6FhXfsu_Rn5DBg-4cBrQOi69qkBLBLst4vHZrIsYo5KFpTRC_CFZliv6k49gfcJL8aL9nvu1Cu9OmwCDhfv5Ctaz1mn-C4j"
    }, {
            id: 422,
            type: "AUG",
            skinName: "Chameleon",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56IeSKMyJYcxHFPqNWXfg_-A3jByY7-sJcWN6x_685JV2t49fYYuQtZNoaGcKEW_KOZwD-6x8w1aNeepXY8iq5j3ntb2lbXRLq-W5Sn_jH5OV5Tktu2Q"
    }, {
            id: 423,
            type: "★ Karambit",
            skinName: "Forest DDPAT",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhscxbDDKJXSMoy7TfoDTcz_PhvXdC-44QKKE644ZzCYOUvZNgYGsnXC_eCbgirvE9r1PJUesbaqHnu2izuPmZeXxrp8mgGhqbZ7fQ9-fxZ"
    }, {
            id: 424,
            type: "★ M9 Bayonet",
            skinName: "Slaughter",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhqKzvAALlRUvAuywnhNj036tVia9qz87ITJGOz5cCRZq4rNotJSpTTXPeFZAD56UpshqULJ8GBoH681Su_ODwMCRft_mhQnLPTpPI11Y9Vd8RM"
    }, {
            id: 425,
            type: "★ Flip Knife",
            skinName: "Slaughter",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhfg3SPqFTY-8_9hrtNis77893a9u35bwDZwnqsITBZeIqNdxLGpTYWKWCYwuvuUI-galde5SJoXy5iSq8PWgLUhH1ujVTthpPV9Y"
    }, {
            id: 426,
            type: "Tec-9",
            skinName: "Isaac",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5vMeDsDzRyTRDHAvlhXeYz_QXjHxg-4cBrQOi69qkBLBLm5YaQYbl-Yo5KScDRWPaPNAGrvkht1vcIe8SI9X-8i37ob2tbUkLo5CtazzD0Wa_w"
    }, {
            id: 427,
            type: "SSG 08",
            skinName: "Slashed",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5oJ-TlaAhkZzvREqcOBMoz-QXjGzMz5PhuUdO_4rY5JV2t49fYO-V5ZYlJSpWGDqOEbgGp7Bpr0vULKpCO8Xi81H7qa2kOXEHr-mNQyvjH5OW0Ya_3zg"
    }, {
            id: 428,
            type: "Galil AR",
            skinName: "Kami",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz58Ne-8PDZ1TQzbPqdfUPw2ywPtBC4N5M5kXMOJ-7oULlnx4oPBO7MrMtkeGsPRUqPXYwivuRk_iKhdfcOA837v3SXtazhZDxC--XVExrGeCLbGcQ"
    }, {
            id: 429,
            type: "CZ75-Auto",
            skinName: "Twist",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz54LrTgMQhmfzvFGLJfSPAF-AHrATMN5MZxU9L4rusAcAvssouXNLkqOd0dGJaECaSAZQqs4xgx0agIKpPfoiO-3Si9P3BKBURxmw6Iiw"
    }, {
            id: 430,
            type: "P90",
            skinName: "Module",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5rbbOKMTlYYAvbAKxcUPA_8DfgACA6_PhvVcWx8vVTcVi55obONrElMNAYGMiDWffTZAn47kw_h6hefpOLoCPt3irqPTpYRVO1rWm4_UXk"
    }, {
            id: 431,
            type: "P2000",
            skinName: "Pulse",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5zP_PnYGc3TQfXPrAMDKVqyxj5BTQ318tqU9-iyLcHO1u6qtPBOuZ_ZosYGsnSWvSCbwz47Uhp0vcJe8aI9S3p3yq7b2gICRe--zga2LjQEwt0vE4"
    }, {
            id: 432,
            type: "AUG",
            skinName: "Torque",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56IeSKMyJYcxHFPrBMU_Io8Rv_ADEN5M5kXMOJ-7oULlnx4oXHMeJ9ZtFOGsOCDvWDYVr66xo5haNYe8TapSu63i3rM2ZZUhbo_3VExrFoxWsz9A"
    }, {
            id: 433,
            type: "PP-Bizon",
            skinName: "Antique",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz55Pfm6PghkZzvACLpRUso7-hzlGDI318tqU9-iyLcHO1u6qoLAN7YrMd9JGsHRU_GAMlio7kk5ifRUfMeL9nnnjH_rOjpcW0bt_2ga2LjQydTIqSk"
    }, {
            id: 434,
            type: "XM1014",
            skinName: "Heaven Guard",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5jObLlYWNYcRH9Ga0PDKRuywDpCDE35vhkQdak84QKIFu38O2aYvJ7ZcYfGJbTDP6OZwyr4xhp0ahfe8TYpXy5iCnqM24CUxO4-20EnrCD67pqnC9IFE-N-xNJ"
    }, {
            id: 435,
            type: "MAC-10",
            skinName: "Tatter",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52NeDkYAhkZzvJDrJLTOEF-AHrATMN5MZxU9L48epWLQXrs4OVO7IqZNpJHMCGCKXUNQH9vk091aJdfJCKonvq1X_sPXBKBUS5NmffOw"
    }, {
            id: 436,
            type: "SCAR-20",
            skinName: "Cyrex",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5oN-KnYmdYcRH9EqNfTso57RrpERg-4cBrQOi69qkBLBLpsYCQYrAkZIseG8fWCKTXMFr-70pt1aYLep2JqSu63CS7PW5eDxLt5Ctaz6ReUTeC"
    }, {
            id: 437,
            type: "USP-S",
            skinName: "Caiman",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5uJ_OKIz5rdwrBBLJhX-AF_wnlBCY818tqU9-iyLcHO1u6qoqTZ7EqONxLF5XTWvDUMgr16BoxgPALfZTbpyu-iSS_PWsPWkHo_mka2LjQogR8FS4"
    }, {
            id: 438,
            type: "M4A4",
            skinName: "Desert-Strike",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52YOLkDzRyTRDLFaFQT-E15gXTBS414NNcWNak8L5IKA3ptdSQNeV9MtsdScKEU6TUMlr9u0w9h_dYLpOK9nvujHnhPT8JWw2rpDxQlljW_A"
    }, {
            id: 439,
            type: "★ Huntsman Knife",
            skinName: "Slaughter",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhzcwfWCKNfUMo7-Tf2DCUg6fhvXdC-44QKKE644ZzHMbkqZN9KS8PUDPfTYw7-4k46hPJVL53foyzq2CXta20CCkK9_DlShqbZ7Wmh-3NS"
    }, {
            id: 440,
            type: "★ Huntsman Knife",
            skinName: "Fade",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhzcwfWCKNfUMo79TfqCCM318tqU9-iyLcHO1u6qoSQMbEqM4sfSsSGDPeHYAv_7h0wgKhfL5XaqX_m3yW9aDhfWkDi-Doa2LjQL_jvEsc"
    }, {
            id: 441,
            type: "★ Huntsman Knife",
            skinName: "Scorched",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhzcwfWCKNfUMop5DfoCDci5MJcWN6x_685JV2t49fYZbF5MopNG8fYWP-Pbw_-vxls1qgOJ5eL8ny823i_aD9YCBK-qWpXkPjH5OUC1jXlVA"
    }, {
            id: 442,
            type: "MP7",
            skinName: "Urban Hazard",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52JLSKMyJYfxSVTKNRUfg7-gzpGxg-4cBrQOi69qkBLBLtsoKSMOYuN95JTMjTDPGDM1ipuxg90fMJKcDfpCvn2ni4OD0IWxvi5CtazxCLTIoO"
    }, {
            id: 443,
            type: "Negev",
            skinName: "Desert-Strike",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz51MeSwJghkZzvMBKdbSsou_RztBzQm59Vua9u_8LMSFlC-9tWTLeV-N4odS5PXX6PVNFv8uE9r1PdeKsff8i_s3SXhPW0LCUG--2pXyuaZ-uw8UAQJFkg"
    }, {
            id: 444,
            type: "P2000",
            skinName: "Ivory",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5zP_PnYGc3TQfXPrAMDKVqywH6BjUr18tqU9-iyLcHO1u6qoCXN7d-MdweGsmDD_GPYAD47EI9iPIILpba8izv2yzuO2oCDRTs-2oa2LjQxpZttMo"
    }, {
            id: 445,
            type: "SSG 08",
            skinName: "Abyss",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5oJ-TlaAhmYzvOBLZXXeEy9QbTBS414NNcWNak8L5IeVjv59fCMbV-NdtLG8bUWKKGMgiruB1sgPJdesaPoy66jyXsPW5cCQ2rpDx0zn4ssg"
    }, {
            id: 446,
            type: "UMP-45",
            skinName: "Labyrinth",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5uOfPhZQhvazvOCK5bT8o15gniDiIN5M5kXMOJ-7oULlnx4ILGN-V9M9BFHcPWD_DQNwypu0lugKRYKsTbpXjs2i_qaDpcWBW_-3VExrHui8poXg"
    }, {
            id: 447,
            type: "PP-Bizon",
            skinName: "Osiris",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz55Pfm6PghkZzvACLpRUrg15wH-ADQN5M5kXMOJ-7oULlnxtoTPZrAvZdkdS8XZUqSBYFipuEMwhKZdK8aN9i7niSrrPzxfCRa9qXVExrECS2z-2w"
    }, {
            id: 448,
            type: "CZ75-Auto",
            skinName: "Tigris",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz54LrTgMQhkZzvBVvVfEeEz8w3-Nis77893a9u35bwDZ17osYaUNuErM4tEScKCWPaBbw3_vxk4hKcIecHb9C68jHm8OmoPWhD1ujVToYhPwzE"
    }, {
            id: 449,
            type: "Nova",
            skinName: "Koi",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz51O_W0DzRyTQrNF6FhV_ozywTlDi8m18tiRtCzueleKg-54YLFZbcvNopIF5SFD_eGMwio4kNth6YMfJWLoSntiX67a2gUG028humfMw0"
    }, {
            id: 450,
            type: "P250",
            skinName: "Supernova",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5rZrblDzRyTQbLFbRbTuYt8Q34Nis77893a9u35bwDZwTs59bCO7kqOIxLFsTRWKOGNV__6Eg70qkILp2PoCi5iy_uM25bDxf1ujVTlZEMO3Y"
    }, {
            id: 451,
            type: "Desert Eagle",
            skinName: "Conspiracy",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5_MeKyPDJYcRH9BaVfW_k_ywn5GyIn-_hvXdC-44QKKE644ZzBZeErNthJGJOCWvPQZFqsuEM6ifMIK5GB9ivt3Xy8P2oKXBLurmtRhqbZ7Tllk6hd"
    }, {
            id: 452,
            type: "Five-SeveN",
            skinName: "Fowl Play",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz59PfWwIzJxdwr9ALFhCaIF8g3tHS83-tRcWN6x_685JV2t49fYYuElNNoaHciEX6DSbg_17E870qRZfcSJ8ynu2irpOToCCRXq_2wBnPjH5OWhSCyC7g"
    }, {
            id: 453,
            type: "★ Butterfly Knife",
            skinName: "Fade",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhlZxDWBLJYUOwF9QnTDyY27fhvXdC-44QKKE644ZyUMuF-NY4eHJWEWv6Hbgys6E0-g6JZfZONqCK-3ivtaDwJDRHp-j0MhqbZ7VLOXRkn"
    }, {
            id: 454,
            type: "★ Butterfly Knife",
            skinName: "Case Hardened",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhlZxDWBLJYUOwF9RnTBi4-7cNcWdKy_q4LFlC-9tWTLbAvYdkfFpSFDv-GZQz14kM4hvVUfcHfoCu61C3qOGhYDRHpqzpSkLCZ-uw8KMc6tY0"
    }, {
            id: 455,
            type: "★ Butterfly Knife",
            skinName: "Stained",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhlZxDWBLJYUOwF9RnTDygg68Jna9u_8LMSFlC-9tWTLbF5NdpOGsmGUqTSYFv-uUk8gvIIe8eL9Cq-1Srgb2dcCBLsqGxVmuWZ-uw8pT4tNB0"
    }, {
            id: 456,
            type: "FAMAS",
            skinName: "Survivor Z",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRf0Ob3dzxP7c-JmIWFg_bLP7LWnn8fv8Rz37mZ9Nil31Hh_RI-Zm3ycNfAcwQ5NA7VrAK4xbjvjMC67cjJwWwj5HfemqCEuw"
    }, {
            id: 457,
            type: "XM1014",
            skinName: "Scumbria",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07PLZTiVPvYznwL-YlOL5ManYl1RZ7cRnk6fAoNyljQTh-BVvNmGmdoDDJlU8MwmFqFO6ybvnhMK1uJ6cziZj6yIn-z-DyORWjMSs"
    }, {
            id: 458,
            type: "MAC-10",
            skinName: "Rangeen",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldf0Ob3fDxBvYyJlYyOnP_tMoTVg2Ru5Mx2gv2PrdvxigTs80VpMj-nIoLHIABqZV-G_Fi7l7jog8e97p_Iy3JquSIgs2GdwULIC3Uk8A"
    }, {
            id: 459,
            type: "SCAR-20",
            skinName: "Green Marine",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbmkOVUw7PTbTi5B7c7kxL-bkvb3NrbQnW5DuJZOguzA45W72VXm_EtsazzzJ4LHew9oYVvZ-1Lqxe7mgcXtv5zOmnsx6XEktymIyQv3309GIEFkOw"
    }, {
            id: 460,
            type: "MAG-7",
            skinName: "Cobalt Core",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7uifDhjxszFcDoV09GvhoOOmfLLP7LWnn8fv8Z12uzFrdXxigO1qBA_Z22nJ4Sde1A3N1nV-Fjrwb_ogMC4upnKnGwj5Hd-M-D3zQ"
    }, {
            id: 461,
            type: "Glock-18",
            skinName: "Wraiths",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf1OD3djFN79fnzL-chfbgO6LCqWZU7Mxkh6eT9o6gi1fn-0duMG2gdoDDcAE_aA6FrwS5xevs1Mft6cvOySdh6SQr-z-DyMHeYcY1"
    }, {
            id: 462,
            type: "Dual Berettas",
            skinName: "Dualing Dragons",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJf0Ob3dShD4N6zhpKOg-P1DL_Dl2xe5tZOh-zF_Jn4xgHh_UY6YWv7cNPHcFBtYguD-Fbsx-rsh5e-upXIyXE3vydwtC3dykOpwUYb4qDnZ3s"
    }, {
            id: 463,
            type: "M249",
            skinName: "Nebula Crusader",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-jxcjhnwMzFI2kb09KzlpWHlsj3Ia7Cl29U-vp8j-3I4IG7iwft_EdsYWH3cYSTewNtYwrT_AW2yOrq0Me86p6cyHYyuyIisXbUmQv330_sWCKJ8w"
    }, {
            id: 464,
            type: "Galil AR",
            skinName: "Stone Cold",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbupIgthwczPYgJF7dC_mL-FnvD8J6zYmGxu5cB1g_zMu9-iiwG28xE5Y2D1dtfDcFQ8Yl_Q8lm4x72515_v6Z6dn3ZrviUr7X_D30vg_fm3OKI"
    }, {
            id: 465,
            type: "MP7",
            skinName: "Special Delivery",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFAR17P7YJgJB4N2lh4mNnvLwDLPUl31IpsEl3OuT842nigbs_EVpZmCmJdOXJFVrNFqB-1C6xO_vgMW66M6bm3N9-n5113IxsB4"
    }, {
            id: 466,
            type: "P250",
            skinName: "Wingshot",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhoyszYI2gS09-klYOAhP_7J4Tck29Y_cg_3-yXrdij3FDm_ko_N2GhJISWJwZvMl6F-1a5xu7mgcDq7Z3IzXdg7z5iuyj5ZGFXzw"
    }, {
            id: 467,
            type: "G3SG1",
            skinName: "Flux",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposem2LFZf1OD3dm5R642Jkoyej8jkJqnBmm5u5cB1g_zMu4qn0VbtrkFqY232JoaQJAA-MwqBqQLvwujmgp7o7cjPmCAwvSJ353zD30vgKnwwj7U"
    }, {
            id: 468,
            type: "SSG 08",
            skinName: "Big Iron",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3Yi5FvISJgIWIn_n9MLrdn39I18h0juDU-MKsjlaxrkFramyhdoDBJ1c_ZVnQ-1G8w7zmhZe4u5_MyXNivCchtHiJgVXp1kzLClVg"
    }, {
            id: 469,
            type: "USP-S",
            skinName: "Kill Confirmed",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWhe5sN4mOTE8bP4jVC9vh5yYGr7IoWVdABrYQ3Y-1m8xezp0ZTtvpjNmHpguCAhtnndzRW10x9KOvsv26KUE4Zjjg"
    }, {
            id: 470,
            type: "MP7",
            skinName: "Skulls",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52JLSKOC5YYQ_XDaxNY_kz8wD4Nisz-sBmGoSzpONfeA694NCTYrh9MopMHJLRXv_TYAj0vEJugaVcepCN9nu8i3n3ejBdd2J7H1Q"
    }, {
            id: 471,
            type: "AUG",
            skinName: "Wings",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56IeSKOC5YdAHDFahbTuYF9R3rNis77893a9u35bwDZ1nusIPPYbUuYdsYS5TUCKPSYwr_4h08g6kIfpDd9Xvv2n_paD8IXxv1ujVTB2wI0Vs"
    }, {
            id: 472,
            type: "SG 553",
            skinName: "Ultraviolet",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5oM7bgZgh0fTvSFLJOUPAF-AHrATMN5MZxU9L4o-9ScQ_ssYSUMLMoNN5KTpOCXKOBbgj970xsiPdUKcSOo3m93irvbHBKBUQk4p5o-Q"
    }, {
            id: 473,
            type: "Glock-18",
            skinName: "Dragon Tattoo",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz58OOy2OwhmfzvGE6FZU_sF8wTjCiwN5M5kXMOJ-7oULlnx4YbEYrcuYdlFTsLSWf_VbwD_70w70qlVLpKAqCPojHvqPT0NDRvv83VExrH0fQSUtQ"
    }, {
            id: 474,
            type: "USP-S",
            skinName: "Dark Water",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5uJ_OKIz5rdwrBBLJhXfgF7g3uGyYN7MZxX-i6_rwOPWOz5cCRZq59ZIxLH8mCWKPUYAH-4k471qhYL53d9Hzmji_rP24JDxS-rDkNkeSCpPI11czPZI_J"
    }, {
            id: 475,
            type: "M4A1-S",
            skinName: "Dark Water",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52YOLkDyRufgHMAqVMY_Q3yxLpCzUz18NiRtyJ-7IBIUiA6NOEZOUyZtxEG8PWUqeCYQGr7x44gvVcfZzdpX_t1SzvOWsODUbs-m4BmOXRuawr3Dgdxl9FpQ"
    }, {
            id: 476,
            type: "★ Flip Knife",
            skinName: "Crimson Web",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhfg3SPqhHY-I_9hvTBCI24dJua9u35bwDZw_t5dDGNuN9Y4tOHpTTX_TQMwn740Jq1KRcKJKP9n-8iC-7PmZbDkD1ujVTXDtaQyI"
    }, {
            id: 477,
            type: "★ Butterfly Knife",
            skinName: "Crimson Web",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhlZxDWBLJYUOwF_BHTHiIw-_hvXdC-44QKKE644ZzOZrN9M95KF5HYXPGONw2uv04-0qNbKJDapiq72ni6PD8NXhXj-GxVhqbZ7T7USzse"
    }, {
            id: 478,
            type: "★ Gut Knife",
            skinName: "Night",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhgZxD9Eq9hUvw9_BzTBS414NNcWNak8L5ILFm8ttCUN7AoYdxPGZLWDvGCMAj0uUw60qlVeZKJoyLvjH_qOztfDg2rpDwy3z-Xlw"
    }, {
            id: 479,
            type: "Tec-9",
            skinName: "Blue Titanium",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5vMeDsDzZpTRDLFaFQVeA3p1j6Nis77893a9u35bwDZwvptIXOM7YpMttJTsnZXKLQbgj17hk-iKVcKpzd9n-62ni_aToPWBP1ujVTzFIM_QA"
    }, {
            id: 480,
            type: "M4A1-S",
            skinName: "Blood Tiger",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52YOLkDyRufgHMAqVMY_0jyxrpDTM778Jxa9u_8LMSFlC-9tWTLbB-NNgdGsGCWvaEZl-s60wwgfUJfZKKpiK63n_qMz0KWBHt-TkGzLKZ-uw8KAp2jYo"
    }, {
            id: 481,
            type: "FAMAS",
            skinName: "Hexane",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz59Ne60IwhvazvADbVbVPAiywTlDi8m18tiRtCzub0DcQvosoGUMLN5YdBFGcODDP6BMwCv4h1sh_NUfcPaqSru2XnuPmkUG028Pg7_kVo"
    }, {
            id: 482,
            type: "P250",
            skinName: "Hive",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5rZrblDz9-TRbHBahbRMo2_Q_kHRg-6dVkUZnmruJWcA6859TDNbQvOYpFHcKCX_eDYACuv0M_1qMLJpWB8Xi8jizgJC5UDNXUXX5X"
    }, {
            id: 483,
            type: "SCAR-20",
            skinName: "Crimson Web",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5oN-KnYmdYeh39FqVcT8o-9RrnDDUN5M5kXMOJ-7oULlnxvNfGNeUkN9AfHcKCUvTVYFuv60s8hfdfKcCI8ni83CTrPDhbDkC9-HVExrH48MN72A"
    }, {
            id: 484,
            type: "Five-SeveN",
            skinName: "Case Hardened",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz59PfWwIzJxdwr9ALFhU_w28QzTBS414NNcWNak8L5IL1i-5YLPNrQpM9FKGpLSCKOPZV_1uxoxgPAIK5OA9CPt23u4aWpfXA2rpDxx136i6g"
    }, {
            id: 485,
            type: "MP9",
            skinName: "Hypnotic",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52JLqKMTZYZAHQFalZU8o2_Q_kHRg-6dVkUZniprpReAXq4YKXNeJ9NNwfHZaDXPLSYA2vvx44hqJYK5GN8iq82CvgJC5UDGBuEjX3"
    }, {
            id: 486,
            type: "Nova",
            skinName: "Graphite",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz51O_W0DzZqTQfQFK1OUPAF-AHrATMN5MZxU9L48u9QK129tNaVO-YkZo1NH5LYWaWHblyp4x0x1KhUK5CKpSjo1Sy4bHBKBUR7i1qU_w"
    }, {
            id: 487,
            type: "Dual Berettas",
            skinName: "Hemoglobin",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5-OOqhNQhmfzvNErNXWuwF5g3oNis77893a9u35bwDZwW75YDHZ7N4Y98eGcTZX_TSbgz-4kowgKZYeZCLpHvmiCm6OzpcDxD1ujVTAYAgDmg"
    }, {
            id: 488,
            type: "P90",
            skinName: "Cold Blooded",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5rbbOKMTpYYQjLFahbTsoqrVjTBS414NNcWNak8L5IfATs5YvGYLYqON1ETJbQCaWEZgv46R861qUML8fcoSvp1Xi4bjxZCg2rpDz6aELJ1A"
    }, {
            id: 489,
            type: "USP-S",
            skinName: "Serum",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5uJ_OKIz5rdwrBBLJhXfgF8QTpCjMg4cRcRtKyyLcPLlSr296Xced5Lo0aF8DQX6TTNFj67k89iPcMfcfcqHzp2ym8OjwIWhO5-D5Sm7eHurV1wjFB-kug79g"
    }, {
            id: 490,
            type: "★ Karambit",
            skinName: "Ultraviolet",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhscxbDDKJXSMop-zf8HDUi5MJcWdKy_q4LFlC-9tWTLbl9NI0aSsjXC_eOMg35uEpt06JdesaB83zojCy9bDteUxTjqGsBnO6Z-uw8bSDJz_o"
    }, {
            id: 491,
            type: "★ Butterfly Knife",
            skinName: "Forest DDPAT",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhlZxDWBLJYUOwF_BHTDSMi6dNcWN6x_685JV2t49fYNeUkN9wYH5HWDqSDMgj57ENrg_NYfZyA8ynv3n-_PWgCWBTu82hSzfjH5OVLJOs30w"
    }, {
            id: 492,
            type: "★ Huntsman Knife",
            skinName: "Blue Steel",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhzcwfWCKNfUMo75TfuBTI37PhvXdC-44QKKE644ZzBYLQvOIpPTMfQU_WFMl39v01qiKFafpCPqSq-2iruaW0KXBrj_mhShqbZ7RsaTLqD"
    }, {
            id: 493,
            type: "CZ75-Auto",
            skinName: "Crimson Web",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz54LrTgMQhvazvVBKJNY_kz8wD4Nisz-sBmGoXmrugEfQ--4dSXO7J5Zd5LHsODXvGEZQH5vxo6iKILe8GNpHzv3y73ejBdsUDqtWc"
    }, {
            id: 494,
            type: "P2000",
            skinName: "Red FragCam",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5zP_PnYGc3TQzbPrBRUOwF9wnhBhg-4cBrQOi69qkBLBK6sNHANrcqZdhNHcnXXqTXYAmo7B9q06ZdecCM837ujny6aW0KWxLq5Ctaz3-OvRb0"
    }, {
            id: 495,
            type: "Dual Berettas",
            skinName: "Panther",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5-OOqhNQh0fTvSAK5KVPAoywTlDi8m18tiRtCzuetXcAjstdDFZeN9MdAeH8LXDvaBMFz_4x841fRafcOBqH652ijsPWgUG028Tp8ML_c"
    }, {
            id: 496,
            type: "USP-S",
            skinName: "Stainless",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5uJ_OKIz5rdwrBBLJhXeQF4Rv8NjQm6c5tWNKl5IQKIFu38O2aYvJ7ZcZPScaFDqSOM1up7ko7iKZZLZCJpCLq1Hjpbm1fXEDu-zoGm7WEs-Y5nC9IFKT_zQ0L"
    }, {
            id: 497,
            type: "Glock-18",
            skinName: "Blue Fissure",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz58OOy2OwhvazvBE6FPSfA24RrpNis77893a9u35bwDZwS6vYWTYbErYdhNSsfTCfKBNwH04kw-iKQJKJGJ8inr2Xy8aGxZCRv1ujVT4aqOE_A"
    }, {
            id: 498,
            type: "CZ75-Auto",
            skinName: "Tread Plate",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz54LrTgMQhmfzvGCKFTU_s-yxjgCDM318tqU9-iyLcHO1u6qteQN7IpY9BOTZGFX6KPYQivvk5tgfRUfJCN8iO8iS-_M2cIDhe--20a2LjQBlnfwm8"
    }, {
            id: 499,
            type: "Tec-9",
            skinName: "Titanium Bit",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5vMeDsDzZqTQLOFLRbWMou8Qu1Nis77893a9u35bwDZ1655obDM7YtNdgdGcfVCPSCMgr87UNuhKRaKpWO9Hjt1C3qOWgODxX1ujVTmjkUQO0"
    }, {
            id: 500,
            type: "Desert Eagle",
            skinName: "Heirloom",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5_MeKyPDJYcxX9BK5ZTvQs8QzTDSIz78tma9u_8LMSFlC-9tWTLbgsNIlNTsDRC_SPNF_16k0_g_NaLJzfo3-93y_pOGkIChXj-WMFkeWZ-uw8nESEsTc"
    }, {
            id: 501,
            type: "Five-SeveN",
            skinName: "Copper Galaxy",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz59PfWwIzJxdwr9AK1hX_oq5A3-NiE-7cRoR-i6_rwOPWOz5cCRZq54MokaF8HUCPGAYQ_-4kM4hKZdfcaOoCnmiSjsPGdfCRTvqGkCkeGPpPI11V_wyrEq"
    }, {
            id: 502,
            type: "CZ75-Auto",
            skinName: "The Fuschia Is Now",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz54LrTgMQhmfzvEFLNdVPw7ywTlDi8m18tiRtCzueIFKAjttYrOMLUoMt4fGMnRXv6ENwqp7Rhrg_NdL8GJoHnm2CW9Pm4UG028S55Y5Kg"
    }, {
            id: 503,
            type: "P250",
            skinName: "Undertow",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5rZrblDzZqTRSQVPBhXvA78A3oNjcz4cl3a9u_8LMSFlC-9tWTLbJ4ZIxNS8SCXKLSYF-s6EswgqFdLp2Jonvp3Xy6bD8DD0K5q2wGmrKZ-uw8EE8iuMc"
    }, {
            id: 504,
            type: "★ Huntsman Knife",
            skinName: "Forest DDPAT",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhzcwfWCKNfUMoy7TfoDTcz_PhvXdC-44QKKE644ZzHM7kqON9EFsWEXfSBY1yv4ktuhPBaJ8OLoSi6jn-8aGYLCRC5rjhWhqbZ7f3T5ZL3"
    }, {
            id: 505,
            type: "M4A4",
            skinName: "Faded Zebra",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52YOLkDyR3TR7HA7JfX_Q3ywr7Nis77893a9u35bwDZ1i6tIqTZbJ9NoxLGsLUD_COZAj84hht1qQJLpeIoi682CzsPDpcChv1ujVTIoV6sFw"
    }, {
            id: 506,
            type: "MAG-7",
            skinName: "Memento",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52NeTiDz9-TQ3BDrNfVPA-5gfiNis77893a9u35bwDZ1ro4dPOYON9MIpIF5HQXvCFMgn17Uxp1qgOJpHcp3zq2XnpbG9eXBr1ujVTTtIwBl4"
    }, {
            id: 507,
            type: "FAMAS",
            skinName: "Doomkitty",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz59Ne60IwhvazvGDq9TV_wu4BHTBS414NNcWNak8L5IKgW74IWUO-Z-MYlIG5TVXP-HYAH5uxpthKFbe5aPoC7s3ijsOmoMUw2rpDyn8pvVug"
    }, {
            id: 508,
            type: "Galil AR",
            skinName: "Orange DDPAT",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz58Ne-8PDZ1TQzbPqRaTPQuywf-CCk17fhvXdC-44QKKE644ZzON7klYdhOHJXWW6CAMgqr7R84g6FcLZCLoS7t33-8bj9fD0ftqWlWhqbZ7SzXnitr"
    }, {
            id: 509,
            type: "Sawed-Off",
            skinName: "Orange DDPAT",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5oNfSwNDhhdDvKGJ9aWOU74DfjGyY878JcWN6x_685JV2t49fYM7R6ZdlKHMjXWqfSYAyo60xsiPRZe8GApCrs3CXpbzoJCBa6-GoMzPjH5OWpE4eCng"
    }, {
            id: 510,
            type: "P250",
            skinName: "Splash",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5rZrblDyR3TRfSDaFNVMoqpl28Nis77893a9u35bwDZwXts4KSO-QtNItPFpGFDP6FYgn6vxo9gPRYLsOJ9Xjn1H7oPWwMWEf1ujVTbzPp70w"
    }, {
            id: 511,
            type: "AWP",
            skinName: "BOOM",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56I_OKOC5YcAjDDJ9NVfgq-A3TBS414NNcWNak8L5ILFjutYbPN7coONkZH8PWXKSENV2o6kI60akJe8TapH7o3yjpPWkPCQ2rpDzhF3nw7A"
    }, {
            id: 512,
            type: "★ Karambit",
            skinName: "Case Hardened",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhscxbDDKJXSMo75TfjACs37PhuUdO_4rY5JV2t49fYYLApNolKHJPTC6XTZAD76UM506lcJpLbpCPq1S27MjxZUhu9qGgCzPjH5OUcQbPO0g"
    }, {
            id: 513,
            type: "★ Flip Knife",
            skinName: "Case Hardened",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhfg3SPqFPY_oz-A3oNis77893a9u35bwDZw3rsYrPZ7R6M95KHMPQXv-Gbgv5vEg-1aYLKJCLoSPr2iW8OD1bCUf1ujVTxaDwZJQ"
    }, {
            id: 514,
            type: "★ M9 Bayonet",
            skinName: "Boreal Forest",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhqKzvAALlRUvAuywD1NiE9-sJwQOi0-KkDKFCA6NuRa_RDbIkOSJXOWvGCNw6s401piKZYfpCO9Sy-iSzvb2ZbXRTj-G8BzuSE77U_hmlEEW_w87uLpmm_PQ"
    }, {
            id: 515,
            type: "Galil AR",
            skinName: "Blue Titanium",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz58Ne-8PDZ1TQXMPrRXSPQ0_R3hWnck18tqU9-iyLcHO1u6qobENbR5OI0fHpOFDqSFNFqo6UppiKgOJpaN8yzs3X-9P2heXxvrqWoa2LjQVdphTEM"
    }, {
            id: 516,
            type: "Five-SeveN",
            skinName: "Nightshade",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz59PfWwIzJxdwr9CblhWvk14w3-Ghg-4cBrQOi69qkBLBLr4ovCZuR6NokfH8PSCfeDMFypux1phvMMLsOLpCjqjCm6a2ZYD0a_5Ctaz9U_2XtO"
    }, {
            id: 517,
            type: "PP-Bizon",
            skinName: "Water Sigil",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz55Pfm6PghvazvVALRbTso55g3_HRg-4cBrQOi69qkBLBK8sNbGYuF4OYseF8fYXfbQbg2r6Uw4ifcLLMeB9Xm81Hu8PmYDDxvi5Ctazyi3Rjk3"
    }, {
            id: 518,
            type: "Nova",
            skinName: "Ghost Camo",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz51O_W0DyR3TQfDDK9hS_o18DfuBTI318tqU9-iyLcHO1u6qtbAMOUsNolPF5WGWf-ANwD57x9t1vVafJTY9CO7jCS7a2kDDUbt-j8a2LjQUmD0stw"
    }, {
            id: 519,
            type: "G3SG1",
            skinName: "Azure Zebra",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz58Z_CyYQh0YjvYBKJMXfY7-TfuBTI318tqU9-iyLcHO1u6qobEMrklZtEfG5PQCKKHMF_0vE4-ifVbepKKpCK82H68bjgOXRDrrG4a2LjQFSpjlZ4"
    }, {
            id: 520,
            type: "P250",
            skinName: "Steel Disruption",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5rZrblDzZqTQDGEaFKWPA05w3TGi4-_sJxa9u_8LMSFlC-9tWTLbMqMtpMTcPYXvaPb1yp7EprgvNUfcSPpHu51STgaGYDWUbvq29Xne6Z-uw8bAJFJOs"
    }, {
            id: 521,
            type: "AK-47",
            skinName: "Blue Laminate",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56P7fiDz9-TQXJVfdSXfgF9gT5DBg-4cBrQOi69qkBLBLm4oqTYLUtMNsZSZHVCPHXZlv-40ox0aBefZHd9S3niCy7bmgLWULr5Ctaz976J8rK"
    }, {
            id: 522,
            type: "P90",
            skinName: "Blind Spot",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5rbbOKOC5YfwvGErBRSOYF-AHrATMN5MZxU9L49uxWe17n4teXZbB5Mt1KF5XWWqPQNAusuEw6gqlcJseJpSjuiHztaHBKBURqttZgyg"
    }, {
            id: 523,
            type: "AWP",
            skinName: "Electric Hive",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56I_OKOC5Yeg3UBJ9SVfIy4DfgCDU17YkxBY_vru5eLA6-4tPEYLYlY44fS5TYWvGHZA2u6Ewx0aEIKZGMpijqw223bcT044Vo"
    }, {
            id: 524,
            type: "Desert Eagle",
            skinName: "Cobalt Disruption",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5_MeKyPDJYcwn9BaROXeE-8Qb_DBgi7cZgW9S9yLcPLlSr296Xced5LolIF8aECPWHYAmvuR9r1qcPfJDYoX7n3CrgaWoPW0Hr-D0CmuaGv7N1wjFBG4zK3W4"
    }, {
            id: 525,
            type: "★ Flip Knife",
            skinName: "Forest DDPAT",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhfg3SPqhHY_E-5An4Nis77893a9u35bwDZwTnttbHMrIsZd8ZGsXYU_CPZwv840s61KdcJ8HYqCq91SXoOmtZWEL1ujVTYfKVD1U"
    }, {
            id: 526,
            type: "SSG 08",
            skinName: "Dark Water",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5oJ-TlaAhmfzvYBKJMXco-9RrnNis77893a9u35bwDZwnpt4TFNLEqOd4ZSpXTWKKPNwqo70Mw1vdefZGL9iy93i7uPWheUhr1ujVTcziKRL4"
    }, {
            id: 527,
            type: "MAC-10",
            skinName: "Ultraviolet",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52NeDkYAh0fTvSFLJOUPAF-AHrATMN5MZxU9L4oO9WewTu5taSMrMsOd5IFsmGXvKDYl357k1sgKdaL5aO8i_m3y-7PXBKBUQ5ngn3pA"
    }, {
            id: 528,
            type: "USP-S",
            skinName: "Blood Tiger",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5uJ_OKIz5rdwrBBLJhVOwF5g3oHS417dVcWN6x_685JV2t49fYNuQrN9AaGcDTWqLTYgD_401ug6VUL52IpyLuiSXtbzgIWha68zkNmPjH5OV4NRwZqw"
    }, {
            id: 529,
            type: "CZ75-Auto",
            skinName: "Hexane",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz54LrTgMQhvazvADbVbVPAiywTlDi8m18tiRtCzuetVe1nr5oLPOrkkM9gdG8WEXfKFb1397R1p1fdbKceBoiPmjCzpPzgUG028e5rmkFI"
    }, {
            id: 530,
            type: "Negev",
            skinName: "Bratatat",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz51MeSwJghkZzvAE6FKXeE74DfiDCA3_vhvXdC-44QKKE644ZyUNLUkOYtPHMWGCPGGYA-p70hqgalUKMCJoCq53S7obm0LXRXv-z4ChqbZ7TkAVlPV"
    }, {
            id: 531,
            type: "XM1014",
            skinName: "Red Python",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5jObLlYWNYeh39Eq5fV_Ap_wHiNjU37PhvXdC-44QKKE644ZySM7ElYdpJSsHQDKODZV__vx9ugqhYJ8PboyjtjijgPGwLCkG4_j9RhqbZ7Q5-_3PB"
    }, {
            id: 532,
            type: "PP-Bizon",
            skinName: "Blue Streak",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz55Pfm6PghvazvREaxfSOE_5jfgACA6_PhvVcWx8vVRKAvrtYWSOrUoON0fSpLSW_KONF2p6R86gqlfLpyKoC3v1S-8a2ZbRVO1rfg44WyZ"
    }, {
            id: 533,
            type: "P90",
            skinName: "Virus",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5rbbOKOC5YaAvPA6lbY_kz8wD4Nisz-sBmGoCwoe0Eegy6sovGMeF5N99OHZLXU_OHMF367k8-0fRaepzboyLn3Xj3ejBd3WA8gZ8"
    }, {
            id: 534,
            type: "MP7",
            skinName: "Ocean Foam",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52JLSKMTpYfRfRCKZHY_c24Q3TBS414NNcWNak8L5IKw68tIXBYuZ_MtsYS5LUUvWOZw__40o9haZcLJ2Ipn69iy3gbDwCXw2rpDzl3kMWhw"
    }, {
            id: 535,
            type: "Glock-18",
            skinName: "Steel Disruption",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz58OOy2OwhmfzvGBbBfSPE_-hvpNjQ75NFmRui6_rwOPWOz5cCRZq4oZNBPTMCBWqSPYwGvuEo91qdUK8aOoC7o1CTvbz1fXhq9_jlRmOPWpPI11VgXmgp7"
    }, {
            id: 536,
            type: "Desert Eagle",
            skinName: "Crimson Web",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5_MeKyPDJYeh39FqVcT8o-9RrnDDUN5M5kXMOJ-7oULlnxs9DPYOItOYodTMXSD6TTYVr54x470fMJeceJ8y7v3Xi4OGsIDUa98nVExrEBa25J_A"
    }, {
            id: 537,
            type: "Nova",
            skinName: "Bloomstick",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz51O_W0DzRyTRfSE6lQW8o0-x7tNis77893a9u35bwDZwy94YvDYrAtZIxJG5LVXf-Hbg_57E9sgKReLMaMoSPqi3u7O2pbU0X1ujVTSqeRL14"
    }, {
            id: 538,
            type: "AWP",
            skinName: "Corticera",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PXJZzhO7eO3g5C0m_7zO6_ummpD78A_3rqTrI-l3AOxqkJkamClJ46RdFc_MFDR_1K3k7_t1JS7upvMmHdn7z5iuygrdWg_VA"
    }, {
            id: 539,
            type: "M4A4",
            skinName: "Bullet Rain",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52YOLkDzRyTQbXDaxbSMoo9QHiNipm6ZZcWN6x_685JV2t49fYN-IvNdFPF8eCUqfUNV2v6hptiaNcLJHb8Sq53yzpPD0OWxa_82kGmvjH5OXima9UFQ"
    }, {
            id: 540,
            type: "AK-47",
            skinName: "Jaguar",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56P7fiDzRyTRTDD7RWWecF9QO4Xhg-4cBrQOi69qkBLBLp5oWVO7IsONseGpaCCPGHYAr8ux8_iadcfsaIpS7siSy_aWxbXkC_5Ctaz1HySfSj"
    }, {
            id: 541,
            type: "★ Karambit",
            skinName: "Boreal Forest",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhscxbDDKJXSMoy7TfqBjU3-9NcVtik8roKFlG64NuDbt9wYZobSt6DWaCDNQms4hhriagMfsGO8yrp2SvubDwCCkfu_2pQkbWBvro412lCXTHu-vwNOTyx"
    }, {
            id: 542,
            type: "PP-Bizon",
            skinName: "Photic Zone",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlf0Ob3czRY49KJl4mfnu3xPYTck29Y_cg_iL_F9t6m3wOw-xE4YGz1doGWewE6Y1CF-le7xL28hMO-6svIwCdk6z5iuyjW2C7Erw"
    }, {
            id: 543,
            type: "USP-S",
            skinName: "Lead Conduit",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09ulq5WYh8jiPLfFl2xU18h0juDU-MKljgLjqRVuaj-gLIKUdQdtMgvS-VK_wrvpgZ7quM_Im3Qw6Cdz4CzZgVXp1o7eGVz_"
    }, {
            id: 544,
            type: "Dual Berettas",
            skinName: "Cartel",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJf0uL3dShD4N6zhoWfg_bnDLjQhH9U5Pp8j-3I4IG7ilfj_RBrZDzyJoOdcgI9aVvWqAToxe3mg8Tv78zLynAw6CMl4XzYyQv330_FBz5Big"
    }, {
            id: 545,
            type: "Tec-9",
            skinName: "Jambiya",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhnwMzcdD4b09a3mYKCjvbLPr7Vn35cppFw3LiW94n02A21_EZrYWz6J4aRIw86aAnW_1Doxe--hMW9tJSYyXt9-n51XLgSqKg"
    }, {
            id: 546,
            type: "SSG 08",
            skinName: "Necropos",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3Yi5FvISJmoWIhfjkPKjum25V4dB8xLqZ89vx2Vbm-kc-Zm31JIfDIAZqZFjQqFa4xOi9hJ-678udwXJmuyI8pSGKHJ6NlhM"
    }, {
            id: 547,
            type: "MAC-10",
            skinName: "Lapis Gator",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldf0v73fDxBvYyJkYyOlOPmOrjYgnJu5cB1g_zMu9_x21Xi_hJkYj3xJoOQdlU8MwnU81XtlLu51J696pqan3U3uCcgsynD30vg17el3Nc"
    }, {
            id: 548,
            type: "Glock-18",
            skinName: "Royal Legion",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf1OD3djFN79fnzL-KgPbmN4Tck29Y_cg_2e2W9orx2gPh_UE5ZmindYWddwI3aVnT_VG-krvph57p6sjAyyY17D5iuyi-oMCxlg"
    }, {
            id: 549,
            type: "MP7",
            skinName: "Impire",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFBRw7P7YJgJL4cy_hoW0mvLwOq7c2D1VvpYki73HotT0iVDg_hFrZj_1LY-RegU3YVnT-Vnowe_rjZ_v6pXXiSw0kXssCIY"
    }, {
            id: 550,
            type: "Five-SeveN",
            skinName: "Triumvirate",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTj5X09q_goWYkuHxPYTQg2xc7ctlj-3--InxgUG55RE-a22hLIbEIwY-NFrT_gPqwunsg5C66cnOwXVnuCUk7H3el0O2hh1SLrs4pbUXKjo"
    }, {
            id: 551,
            type: "FAMAS",
            skinName: "Valence",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRf0uL3dzxP7c-Jl4-Fg_jhIYTck29Y_cg_0rrEodik0FC38kU5NmqnJICddlc4aAnX-AO3lL2-08C4vp7Ayns1vD5iuygKw238fw"
    }, {
            id: 552,
            type: "MAG-7",
            skinName: "Praetorian",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7uifDhnwMzFcDoV08yklYWfmOX9MrXum25V4dB8xL6Y89333AzgrhFoYm36INSVcVU8Yw3X-1O6xLrmhce76J3Am3dn7Cg8pSGK25lWOzo"
    }, {
            id: 553,
            type: "Desert Eagle",
            skinName: "Kumicho Dragon",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLZTjlH_9mkgIWKkPvxDLDEm2JS4Mp1mOjG-oLKhVGwogYxfTyncteSd1BtYwvY-AO6lei5g5fo7snOyCZivCd24nbczEewghFIOLBxxavJWhp7hGw"
    }, {
            id: 554,
            type: "Nova",
            skinName: "Hyper Beast",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouLWzKjhjxszGfitD09SvhIWZlfL1IK_um25V4dB8xLnApor33FK2qkBtYWvwIYaXdlM-NFrYqQK7kLvogsS5tJSdyncwvCU8pSGKT_oyuxQ"
    }, {
            id: 555,
            type: "AWP",
            skinName: "Elite Build",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJP7c-ikZKSqPrxN7LEmyVTsZV33OiT9tys2AG1_UJlZ2HxJ47EIAI_N1CErAe_lOzsgMO66syd1zI97a8kXc4r"
    }, {
            id: 556,
            type: "AK-47",
            skinName: "Fuel Injector",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhnwMzJemkV08-jhIWZlP_1IbzUklRc7cF4n-SPpIr33gS1rkJqYGD7J4GQcQY5aFCG-lHrlO650JLv6ZzMziA2vXMgtmGdwULg8tCd0w"
    }, {
            id: 557,
            type: "M4A4",
            skinName: "The Battlestar",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhnwMzFJTwW08y_m46OkuXLPr7Vn35cpp0m2b-Xo92s3Ffj_Epkazzzd4KcelRvYlzQ-lC8x-q8gsDvu5-fnSZ9-n51hKpk1bE"
    }, {
            id: 558,
            type: "★ Bowie Knife",
            skinName: "Night",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfwObaZzRU7dCJlo-cnvLLILTumGJW4NFOhuDG_Zi7jASw_RBuNmyiJo-TdAU_NwzQ_1K_wOntg5C_uJTAyXtmuiMitn2PnQv330_dJ3i8aA"
    }, {
            id: 559,
            type: "★ Bowie Knife",
            skinName: "Scorched",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfwObaZzRU7dCJlo-cnvLLIKvukmpB-Ml0teXI8oThxgDt-hBsZ2HwLIOWI1U5ZF7YqwS-lefn1Ja17pibmHQ2s3Il4HjZnhSpwUYbUxQp7R8"
    }, {
            id: 560,
            type: "★ Bowie Knife",
            skinName: "Urban Masked",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfwObaZzRU7dCJlo-cnvLLIKvugmpB7fpkmOvA-7P5gVO8v11kY2r7cITAJAVsZVnSrAK7wOvuhZC9uZ_BznJhuSArsS7fzhK2hBxJcKUx0sfXsL-_"
    }, {
            id: 561,
            type: "SG 553",
            skinName: "Wave Spray",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5oM7bgZgh0YjvREbJfRcot9R7pGhgw-sZ1W-i6_rwOPWOz5cCRZq4pZNwZH5XTU_GBNF_0vEpu0akJe5SMpyy92CjuPDwOWRru_m1Ske7TpPI11Wf5Cc_N"
    }, {
            id: 562,
            type: "Dual Berettas",
            skinName: "Black Limba",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5-OOqhNQhkZzvRBKFNU_sF8QTlHSIh18VxVcG5yLcPLlSr296Xced5LthPTcWGXqfQNVurvBkwgPdaLMbcoCrmiXzrPm5cX0K6-28BnbWGv-R1wjFBMAyMc9k"
    }, {
            id: 563,
            type: "Nova",
            skinName: "Tempest",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz51O_W0Dz9-TRfHALNXWPAF9hrtHygN5M5kXMOJ-7oULlnx5tOSMrN-Yt5LSsbXD6OGZFv64klphaZZLJKP9HzqiCq8PjhcXBXtrnVExrF218wRmg"
    }, {
            id: 564,
            type: "Galil AR",
            skinName: "Shattered",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz58Ne-8PDZ1TQzbPqNMSfgq-A3TCzUz_shcWN6x_685JV2t49fYZeN6Mt1EHceDWqPQbgGvuxg_1aQPL5CPp3-8iSi4PTpYDkbr-2wNmfjH5OXb7GiByw"
    }, {
            id: 565,
            type: "UMP-45",
            skinName: "Bone Pile",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1JfwOP3YjZX4NCJkImKkOX1PoTThGpH5_p9g-7J4bP5iUazrl06YDulIYCWJABrYVrX_ge7xO3ogsO46sjJzXBhsyAn4HfbzhbjgBEecKUx0mY3Obru"
    }, {
            id: 566,
            type: "G3SG1",
            skinName: "Demeter",
            rarity: "milspec",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz58Z_CyYQhvazvADbVbTPo27Q_jBxgw-sZ1W-i6_rwOPWOz5cCRZq4qNttEGcLTC_KPYQD460lq0qFZJ8PYoii51Hi6OmhbXkDq-2wGy-HSpPI11Uvtms_a"
    }, {
            id: 567,
            type: "USP-S",
            skinName: "Overgrowth",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5uJ_OKIz5rdwrBBLJhVOwF5wHpDiIN6tViQtiJ-7IBIUiA6NOEZOUyNdlLTcjZD_GONF-o4hlp1KYOfpTY8XjoiHm_OzoKWULu_DkGzLeFvKwr3Dg07JikZA"
    }, {
            id: 568,
            type: "M4A4",
            skinName: "Zirka",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52YOLkDyR3TRfWALJhXuc74gfTBS414NNcWNak8L5ILQi-sYSXYeUkON0dHpHQWaPXZw7-u01p0fQPK8OIoHi8iH7va25ZWQ2rpDyVvfC7sQ"
    }, {
            id: 569,
            type: "MAC-10",
            skinName: "Graven",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52NeDkYAhmYzvHFaNWWfEF-QnvWHcN6tViQtiJ-7IBIUiA6NOEZOUyNdFNSZOCCaPXbgD-7E471PAMKpeL8nvm1H_sb25fU0e-_mxQnOKFuawr3Dhc3LxHWw"
    }, {
            id: 570,
            type: "M4A1-S",
            skinName: "Bright Water",
            rarity: "restricted",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52YOLkDyRufgHMAqVMY_0jywfvDCY818VxVcG5yLcPLlSr296Xced5Lt8dFsTSXvKPbwv76047haZYLZOA8Xzu2inuOW1fD0DsqD5QnbDW7-B1wjFBV4zgU1c"
    }, {
            id: 571,
            type: "P90",
            skinName: "Emerald Dragon",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5rbbOKMyJYdhbDBq9QY-VjpDfuGyYk5_hvXdC-44QKKE644ZzEM7B5Zt1NHJGFWP_XMw7770pp1KILLJTcpiK92H_oMmgIXBru_WlShqbZ7aDCcRhz"
    }, {
            id: 572,
            type: "P2000",
            skinName: "Ocean Foam",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5zP_PnYGc3TQXPPq9NT_w87TfuBTI319cxBIfmyLkUKEqw296fZOhoX4QdXZeFRP-HMAv_7007hfdaepHYqSLpjyjob24DCUG6-2sCy7eB67Y51GhCESOu7bLbIx9TbPM"
    }, {
            id: 573,
            type: "Desert Eagle",
            skinName: "Golden Koi",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5_MeKyPDJYcwn9EqNfUPApywr-CDE918tqU9-iyLcHO1u6qoSVYeEoNt5FGpXXXqeONFyo40g61fBUL8bc8SjriCztPD1YDkXur2wa2LjQNvU8OSA"
    }, {
            id: 574,
            type: "★ Karambit",
            skinName: "Blue Steel",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhscxbDDKJXSMo75TfuBTI37PhuUdO_4rY5JV2t49fYNbJ9YtlOSZTVW__SYgD74kI-hvVUepCKpCjn1H-9bjsNW0Dt8j0EyvjH5OVLma4hOg"
    }, {
            id: 575,
            type: "★ Bayonet",
            skinName: "Case Hardened",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz55Nfq6PjJzTQXTPq9XUPA-ywTlDi8m18tiRtCzueJUeQTpstfEYrF6Md8aS5HXXfaEMwmv7hhqiaQLK5DYqHvnji3pPW4UG028JI0XXjw"
    }, {
            id: 576,
            type: "★ Bowie Knife",
            skinName: "Blue Steel",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfwObaZzRU7dCJlo-cnvLLMqrulGdE7cFOhuDG_Zi7jAbgqENvNjv2cYHDJ1Q4ZAqB-Vi5l-u-1MXtucvIynJn63N3syzbnQv3308wj9M7Tg"
    }, {
            id: 577,
            type: "★ Bowie Knife",
            skinName: "Boreal Forest",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfwObaZzRU7dCJlo-cnvLLO6LukGRD7dZltevO54n0hGu4ohQ0J3f3J4_EdFRqYQ7Y8gO9kr--gpXou8iYwXZkviUgtH7cmUDjgE0fO7Zom7XAHgyvqmnm"
    }, {
            id: 578,
            type: "★ Bowie Knife",
            skinName: "Case Hardened",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfwObaZzRU7dCJlo-cnvLLMqrumWJd7cFOhuDG_Zi73VDi-hdqNmn6INCXc1Q8NFDV_Qe-x7i8g5e-v8ydzSZi7HUr437UnAv3309ikmqnoA"
    }, {
            id: 579,
            type: "★ Bowie Knife",
            skinName: "Forest DDPAT",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfwObaZzRU7dCJlo-cnvLLO6Lukm9B6dFOhuDG_Zi73AW3rkI4Yz37Jo_HJlBrYlHY8lPvyershZK57Z-YwHZj7nEktyrVyQv3309AwMWh8A"
    }, {
            id: 580,
            type: "★ Bowie Knife",
            skinName: "Slaughter",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfwObaZzRU7dCJlo-cnvLLMrbujG5T-sROh-zF_Jn4xgfk_xJvYGqlI9OQJAc-YgzX81a4w-rpgsC16Mubz3Qxv3Zx4HqJmkSpwUYbBsqV8z8"
    }, {
            id: 581,
            type: "★ Bowie Knife",
            skinName: "Stained",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfwObaZzRU7dCJlo-cnvLLMqrukGRD68B1teXI8oThxlC38kJsZDigJYGVdQY6YVmC_APrwO_s0Jft6p3Om3M17yIn4izUmhSpwUYbpuF0ilg"
    }, {
            id: 582,
            type: "★ Gut Knife",
            skinName: "Blue Steel",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjxT0966gYWPqPrxN7LEm1Rd6dd2j6fF89Xxiway-ktuNW7wdoKUdA5raQ7SrlW5yejoh5G5tZvNwCdmuyYm-z-DyMBqk-Qb"
    }, {
            id: 583,
            type: "★ Gut Knife",
            skinName: "Crimson Web",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjVb08uzlpO0m_7zO6_ummpD78A_2LiW9Nuj0VGw-0JvYj2hJdKWI1NoZAnU-gPtyOzo0ZK4u52bm3Bh7j5iuyiVfFD71A"
    }, {
            id: 584,
            type: "★ Gut Knife",
            skinName: "Case Hardened",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjxT09O_mIWPqPv9NLPFqWdQ-sJ0xO-Qod2i2wOy_EdpYW_7LIDBclI6aVHV-Fm_lOe-gJG5vpvKyHYwv3M8pSGKIGsDSZw"
    }, {
            id: 585,
            type: "★ Gut Knife",
            skinName: "Slaughter",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhgZxD9AK1hRvA45gnTBS414NNcWNak8L5IKg_osNTOZrctZttMH5XUWfOHNA_16hk-gqVbe8SPpC-73nm8a24LDw2rpDxc1kJY2A"
    }, {
            id: 586,
            type: "★ Gut Knife",
            skinName: "Doppler",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhgZxD9AK1hWPoq5ATpGxgi4MZwUYOJ-7IBIUiA6NOEZOUyZItNFsWGU6WDMlus60wwhaIIK8fb8XnmiCi9aW4JXBHi_WoByuTV7Kwr3DhWsXJSNg",
            patternChance: 20,
            patterns: [
                {
                    img: 'Phases/Gut-Doppler/p1.webp',
                    chance: 50
            },
                {
                    img: 'Phases/Gut-Doppler/p2.webp',
                    chance: 50
            },
                {
                    img: 'Phases/Gut-Doppler/p3.webp',
                    chance: 50
            },
                {
                    img: 'Phases/Gut-Doppler/p4.webp',
                    chance: 50
            },
                {
                    img: 'Phases/Gut-Doppler/ruby.webp',
                    chance: 20
            },
                {
                    img: 'Phases/Gut-Doppler/sapphire.webp',
                    chance: 10
            },
                {
                    img: 'Phases/Gut-Doppler/black-pearl.webp',
                    chance: 5
            },
        ]
    }, {
            id: 587,
            type: "★ M9 Bayonet",
            skinName: "Autotronic",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-MhMj5aoTTl3Ju6dBlhf3T-oL8i2u4ohQ0JwavdcTCJxhoaVmG_Fnoxua9hcS4vJrIznRjuHZx7XeLmRflhUxLP7NsgfPNTV-eGeUXSwZKyJQd"
    }, {
            id: 588,
            type: "★ M9 Bayonet",
            skinName: "Bright Water",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-Djsj7ML7QmFRa5sx3j9aYpbP4jVC9vh4DPzixc9OLIwVsZwzSrlK5wOu9jMPvuMzJwCZjunN0tHrbykSzg0kYabZmh_OWGkLeWfITTUunnw"
    }, {
            id: 589,
            type: "★ M9 Bayonet",
            skinName: "Black Laminate",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-Igsj5aoTTl3Ju-9F-hOzW9J_9t1i9rBsoDDWiZtHAbFdqNQ2Crge8kO-615e_6ZnJnyRkuyAgsHiMlhS_1RlNaONqhvGfTQ6AR_seYQFe0Lg"
    }, {
            id: 590,
            type: "★ M9 Bayonet",
            skinName: "Lore",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-Igsj5aoTTl3Ju5Mpjj9bJ8I3jkWu4qgE7NnfyIoDGdg4_YwrYqAS8xrvthcK6vMyfyXBnsiFzti2Pyxe0g0tKbeFrm7XAHjZ37Nzu"
    }, {
            id: 591,
            type: "★ M9 Bayonet",
            skinName: "Freehand",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-Kmsj5Mqnak29u_dVO07n--InxgUG5lB89IT6mOtXAIwE4YlnW8lW7yebp05Tpv5rJmCQ26Scl7HfanBfjhkkaZrNph_GACQLJ_Utp8Mc"
    }, {
            id: 592,
            type: "★ Bayonet",
            skinName: "Gamma Doppler",
            rarity: "rare",
            img: "Phases/Bayonet-Gamma-Doppler/p1.png",
            patternChance: 20,
            patterns: [
                {
                    img: 'Phases/Bayonet-Gamma-Doppler/p1.png',
                    chance: 50
            },
                {
                    img: 'Phases/Bayonet-Gamma-Doppler/p2.webp',
                    chance: 30
            },
                {
                    img: 'Phases/Bayonet-Gamma-Doppler/p3.webp',
                    chance: 50
            },
                {
                    img: 'Phases/Bayonet-Gamma-Doppler/p4.webp',
                    chance: 20
            },
                {
                    img: 'Phases/Bayonet-Gamma-Doppler/p5.webp',
                    chance: 10
            },
        ]
    }, {
            id: 593,
            type: "★ M9 Bayonet",
            skinName: "Doppler",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhqKzvAALlRUvAuywnhNiM9-NdvUcWJ57MHOlns296fZOhoX4QdXZeFRP-DMFr46h040vUMeZzYpS-62ny9OmhZWxC68jkAzOWF67Y-gmkeRyOu7bLbz4tHjC8"
    }, {
            id: 594,
            type: "★ M9 Bayonet",
            skinName: "Rust Coat",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhqKzvAALlRUvAuywn9NjQm7cJva9y4_r0DFlG64NuDbt9wYZobSt7SWvHSNVuo4ho-iaULLceOqCzoiCq4bmcMWxvo_WhVzLPW7uRu0T4TXTHu-ivWhSeB"
    }, {
            id: 595,
            type: "★ M9 Bayonet",
            skinName: "Marble Fade",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhqKzvAALlRUvAuywnhNioz-sVvUeiw9r8DFlC249qCLbcvMopOTMCFWaWEbw707ENr0_JdfJLc83663SnqMj9YUhrurGIDmuaZ-uw8ipOzogw"
    }, {
            id: 596,
            type: "★ M9 Bayonet",
            skinName: "Damascus Steel",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhqKzvAALlRUvAuywn9NiMz5cZwV8KlyOJWFlC249qCXOx9co8ZAZPYX_eGNQ-o6kg506dce5zaoXnt2S_objgJCRrq-GoGneODveY4imwIAy_n_4o6DWQ"
    }, {
            id: 597,
            type: "★ M9 Bayonet",
            skinName: "Tiger Tooth",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhqKzvAALlRUvAuywniNjM778Jxa9ik9rUBLGOz7dWed64oOYxJTpaCXKKBMAj6uRk40qJVK8fcoS7u23zgP20JUxfq-2wAybWCpPI11SAedH7w"
    }, {
            id: 598,
            type: "★ M9 Bayonet",
            skinName: "Ultraviolet",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhqKzvAALlRUvAuyxvjNjcn-tdvUei6_rwOPWOz5cCRZq4pY4lEHMOBCPOHNA6s40w61KgPKsfbpy3m337hMmcPXELt8zgAyuLUpPI11X67t9n9"
    }, {
            id: 599,
            type: "★ M9 Bayonet",
            skinName: "Urban Masked",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhqKzvAALlRUvAuyxv8NjMz-MJcQcW09rU5JVW47Mapb-FuZ41STcnUWqKPMlj8401piagJecSIoHzv1XzhMz0MDxHj_mhWne6DvuQ-1HFWHSboOSh3gQ"
    }, {
            id: 600,
            type: "★ M9 Bayonet",
            skinName: "Stained",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhqKzvAALlRUvAuywn9NiE9-sRmUOi6_rwOPWOz5cCRZq55NNhFTcHYXvOEZgr9vEht1vBZLpSOqHjr3iTsP2heXUXr_GxSyeOFpPI11TekLEVH"
    }, {
            id: 601,
            type: "★ M9 Bayonet",
            skinName: "Scorched",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhqKzvAALlRUvAuyxv8NiMz-NdvUei6_rwOPWOz5cCRZq5-ONlMSZWGXvCCbwD740w-gKcLeZfapyru3iThOmtYDkHs8m9XnbfSpPI11XcQHFlR"
    }, {
            id: 602,
            type: "★ M9 Bayonet",
            skinName: "Safari Mesh",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhqKzvAALlRUvAuyxv8Nio3-89cQNa4yLcPLlSr296Xced5LtlMF8nWCfHVZQn_4kw_ifNbKZ2BqC--3y_gb2tYChTs-W0Hn7SBs-F1wjFBDsjagn4"
    }, {
            id: 603,
            type: "★ M9 Bayonet",
            skinName: "Night",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhqKzvAALlRUvAuyxvjNik77893a9u_8LMSFlC-9tWTLbV9Y4oeSpPUXqeHZFj-vk5thaJVJpXap3vtiCjhaz9cUxC6r2kMn-eZ-uw8rMzTcjo"
    }, {
            id: 604,
            type: "★ M9 Bayonet",
            skinName: "Forest DDPAT",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhqKzvAALlRUvAuywD1NiM2-MZ3a9u_8LMSFlC-9tWTLbF6NdlNSsTWU_6HNw78vhg-h_AIfJeAoC6-iyi6PT8JUke-_2kGnu6Z-uw8FmO3LEw"
    }, {
            id: 605,
            type: "★ M9 Bayonet",
            skinName: "Fade",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhqKzvAALlRUvAuywntNiEz7MJcWN6x_685JV2t49fYNbYsMt8aHJHXXPXXblv9u0MxiKhYeZbb9H7q2CnhPzoIWkfjrjhQyfjH5OUJpqnFow"
    }, {
            id: 606,
            type: "★ M9 Bayonet",
            skinName: "Case Hardened",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhqKzvAALlRUvAuywn9Nig75MJna9u_8LMSFlC-9tWTLbcpYo4ZTJbYD_-GYQqu6k5q0aNcLZCIqCLmjyW9PmcCUxq982sCnu-Z-uw8NABrhGY"
    }, {
            id: 607,
            type: "★ M9 Bayonet",
            skinName: "Blue Steel",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhqKzvAALlRUvAuywn9NiU-_cJna9u_8LMSFlC-9tWTLeN6MY0dSsWCWqKCZFr9uUk-hfQIKJLY9H68iSzrOmlfCULsq2NVnLSZ-uw8_unZThQ"
    }, {
            id: 608,
            type: "★ Karambit",
            skinName: "Bright Water",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJnJm0mPTxMrXunWVY7sBOh-zF_Jn4t1i1uRQ5fTryLIbBegRqaFzWqwLtl-7t1pTvv5_Jmyc3uycqtH3enh20hhwaZrBxxavJey8mJTk"
    }, {
            id: 609,
            type: "★ Karambit",
            skinName: "Autotronic",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJk5O0nPbmMrbul35F59FjhefI9rP9jVWisiwwMiukcZiccQBtZVyF_lW7kLzvg8Xvup7Lz3Qx6CUj5iqLnBzhhxkZabBshKaaVxzAUIJQ4Np6"
    }, {
            id: 610,
            type: "★ Karambit",
            skinName: "Black Laminate",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJl5W0nPbmMrbuhX9e5sBmi_rJyoD8j1yglB89IT6mOteRd1JoMl-EqFS5we28h5Xp6p6czHVguXZxtnuMmEe10BEeOOM7gvaACQLJ8ajP6XE"
    }, {
            id: 611,
            type: "★ Karambit",
            skinName: "Lore",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJl5W0nPbmMrbummRD7fp9g-7J4bP5iUazrl1rY2DzddPEdwFsYgnSqwPqyey6hZ_qvM6dm3pnunFx4n2LmxTj1x9PcKUx0uHhTF2B"
    }, {
            id: 612,
            type: "★ Karambit",
            skinName: "Freehand",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20mvbmOL7VqX5B18N4hOz--YXygECLpxIuNDztLI6Udlc9aQmGq1O9ye3rjZ_tu5_KyXNq7HMrsHmImxbhgRpNOOVrguveFwu3UI9Gug"
    }, {
            id: 613,
            type: "★ Karambit",
            skinName: "Gamma Doppler",
            rarity: "rare",
            img: "Phases/Karambit-Gamma-Doppler/p1.webp",
            patternChance: 20,
            patterns: [
                {
                    img: 'Phases/Karambit-Gamma-Doppler/p1.webp',
                    chance: 50
                }, {
                    img: 'Phases/Karambit-Gamma-Doppler/p2.webp',
                    chance: 50
                }, {
                    img: 'Phases/Karambit-Gamma-Doppler/p3.webp',
                    chance: 50
                }, {
                    img: 'Phases/Karambit-Gamma-Doppler/p4.webp',
                    chance: 50
                }, {
                    img: 'Phases/Karambit-Gamma-Doppler/emerald.webp',
                    chance: 10
                },
            ]
    }, {
            id: 614,
            type: "★ Karambit",
            skinName: "Doppler",
            rarity: "rare",
            img: "Phases/Karambit-Doppler/p1.webp",
            patternChance: 20,
            patterns: [
                {
                    img: 'Phases/Karambit-Doppler/p1.webp',
                    chance: 50
                }, {
                    img: 'Phases/Karambit-Doppler/p2.webp',
                    chance: 50
                }, {
                    img: 'Phases/Karambit-Doppler/p3.webp',
                    chance: 50
                }, {
                    img: 'Phases/Karambit-Doppler/p4.webp',
                    chance: 50
                }, {
                    img: 'Phases/Karambit-Doppler/ruby.webp',
                    chance: 20
                }, {
                    img: 'Phases/Karambit-Doppler/emerald.webp',
                    chance: 10
                }, {
                    img: 'Phases/Karambit-Doppler/black-pearl.webp',
                    chance: 5
                },
            ]
    }, {
            id: 615,
            type: "★ Karambit",
            skinName: "Rust Coat",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhscxbDDKJXSMo75Tf_HSI35PhoWt6w8oQLLFi28d-pb-FuZ41SG8OBU6KBMg344h0wgfReKpHf9Cq83Xy_Mm9eXRW6rz4FzeTUveM_hnFWHSaOGLKzXQ"
    }, {
            id: 616,
            type: "★ Karambit",
            skinName: "Marble Fade",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhscxbDDKJXSMo7-TfhCDUw5MJcUtay8oQKIFu38JyTNuQsZtxLHpODXqfXMgGpvh8-1fUIK5eA8Xy61X69ODoCW0DqqT0GhqbZ7U3rlwo1"
    }, {
            id: 617,
            type: "★ Karambit",
            skinName: "Damascus Steel",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhscxbDDKJXSMo75TfoCCoz-8R2R-i6_rwOPWOz5cCRZq4oN4lLGZbXUvDVZwmpuR8w1aEOfsfb9i273Xu_aztZUhC-q2INnubWpPI11VyGQ9DQ"
    }, {
            id: 618,
            type: "★ Karambit",
            skinName: "Tiger Tooth",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhscxbDDKJXSMo7-jf4ACA3-vhsRta48L45JVW47MbYYOQpYdEYGJSBW6CHY1v46U041alfKseO9CLt2yzrO25ZDhTq_W0Am_jH5OWLuQC7ZQ"
    }, {
            id: 619,
            type: "★ Karambit",
            skinName: "Urban Masked",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhscxbDDKJXSMop5Df4CDc319JxVta4yLcPLlSr296Xced5LoxPGZTRCaCOZwH_6RpsgKVbLMSNony53nzhbmdYWkK9rG8NmebWvbF1wjFBWafnDHI"
    }, {
            id: 620,
            type: "★ Karambit",
            skinName: "Stained",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhscxbDDKJXSMo75TfqBjUx7cNcWN6x_685JV2t49fYNrQkZtlNScjYCaLXb136vh86iaBYfcGMo37u2njqO2deWRu6_GtRzPjH5OWh0rdYxA"
    }, {
            id: 621,
            type: "★ Karambit",
            skinName: "Scorched",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhscxbDDKJXSMop5DfoCDci5MJcWN6x_685JV2t49fYO7h9ZI5JHpKDUqKDZVyruUtsiPJdK5SIpHi73S69OWYCDhPrrmlWkPjH5OUGS-1aRQ"
    }, {
            id: 622,
            type: "★ Karambit",
            skinName: "Safari Mesh",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhscxbDDKJXSMop5DfhDDQ619NiWui6_rwOPWOz5cCRZq59MoxITJOGU_-DYlv070xriKBUfsHcpyi-3H67bz8NCELrrGtVzOfRpPI11aVlXOou"
    }, {
            id: 623,
            type: "★ Karambit",
            skinName: "Night",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhscxbDDKJXSMop-zfiACA6_PhvXdC-44QKKE644ZzCMbcoONweF8LWUvHUb1yv6E9tg6lcLZDfpX--1HjgMm0CXxS9_GNShqbZ7QXcaW5k"
    }, {
            id: 624,
            type: "★ Karambit",
            skinName: "Fade",
            rarity: "rare",
            img: "hy71GAP3ufb8R-ppRUkn3z9iP6lHh7e2KIk5c6Gvb3hOJcLjWuv_5Fye9pdjKXtRJ2Vk7k6Yt7Iugj5hoLl4ckFn1ulL7_jtTO_ynWBjaEAjcy_2Cs35qyKDD3nhtX14cCPT_kzj7-hM7_SZUWB7RTJJJ7AawOz1L9RgIey_fi1LKoS5Se26tQmFo5w9MSwYM3B84E2e_Lgu1WImvrkqewE43Os="
    }, {
            id: 625,
            type: "★ Karambit",
            skinName: "Crimson Web",
            rarity: "rare",
            img: "5DJI8C6QkPeBTzKNlwBr1Vx-gkFq4J63VYHhl3PmI3ItOX8Ld4zW5SGWLnOxYDdbRHnZBmP_nrNTiuaFcvA0eCJ7awFmiNHsMecqebIqJEpAb5IeJ6rQql-L150z_DFyEz9uFmGExukx5yVlgzgzSUdVmlg3p8X0B9C7lz6mZCd1MGoBZtqXtSPZLyu9KWZOUDvBAGirge8J0-yQafczI2IkYQM="
    }, {
            id: 626,
            type: "★ Butterfly Knife",
            skinName: "Urban Masked",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq5ObqOP1I77ug3lT6ctOhuDG_ZjKhFWmrBZyNzihIIXDdg5sNVqFqFPtyOnsgcW1vM_MzXph7CIg5yqMzhyy0k0ePPsv26IotkEDow"
    }, {
            id: 627,
            type: "★ Butterfly Knife",
            skinName: "Scorched",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq5ObqPP1I6vdk1Rd4cJ5ntbN9J7yjRri-kJsMmDyco6Ve1U3aF7W81fokObo0Z-87pqcmHpr7yAh4niJn0Hhn1gSOTpeEaNS"
    }, {
            id: 628,
            type: "★ Butterfly Knife",
            skinName: "Night",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq5OEqPn9NLPFqWdY781lteXA54vwxg2y-UZoZzrwIY6TdVc7ZViG-wW-kOu6gZK66JzJnXFm6CRwt3zfnxepwUYb2Pp00lU"
    }, {
            id: 629,
            type: "★ Flip Knife",
            skinName: "Bright Water",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJK9eO5l4WKmcj_PbLXk1Rd4cJ5ntbN9J7yjRrir0BpNWChd47BcldsYwyB_VC_w-_qgMXqv5qcn3VruHUn4X2IyRa2n1gSOZ6lSNoc"
    }, {
            id: 630,
            type: "★ Flip Knife",
            skinName: "Autotronic",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJF_-OwmImbqPbhJ7TFhGRf4cZOhuDG_ZjKhFWmrBZya2HxcIaUcFNoYA3X_1ntyLvsh5Xo6Jidz3BjuHMm7CmPyh2-hU1Ma_sv26IF0j6FwQ"
    }, {
            id: 631,
            type: "★ Flip Knife",
            skinName: "Black Laminate",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJB-eOwmImbqOTgPLXUgWpC4Pp9g-7J4bP5iUazrl05ZT_0JdKUewVqY1HW_wO6xe260cO7vJzMwHNi7HV3sSmIzhPihElEcKUx0oH2X3dW"
    }, {
            id: 632,
            type: "★ Flip Knife",
            skinName: "Lore",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJB-eOwmImbqPv7Ib7um25V4dB8teXA54vwxlHjqkBta2vyIdOTIQM_YVmG_lfox7rtgMe_tJvMn3Awsykn7X7YnkSpwUYbImluMl8"
    }, {
            id: 633,
            type: "★ Flip Knife",
            skinName: "Freehand",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJD4eO7lZKAkvPLJqvummJW4NFOhujT8om73gDm-0dvaz_yLYWVIQE8N1GBrwS_l7zp0ZTpvcjNyHBgsnNzs3zZnwv330_U-q7jVg"
    }, {
            id: 634,
            type: "★ Flip Knife",
            skinName: "Gamma Doppler",
            rarity: "rare",
            img: "Phases/Flip-Gamma-Doppler/p1.webp",
            patternChance: 20,
            patterns: [
                {
                    img: 'Phases/Flip-Gamma-Doppler/p1.webp',
                    chance: 50
            },
                {
                    img: 'Phases/Flip-Gamma-Doppler/p2.webp',
                    chance: 50
            },
                {
                    img: 'Phases/Flip-Gamma-Doppler/p3.webp',
                    chance: 50
            },
                {
                    img: 'Phases/Flip-Gamma-Doppler/p4.webp',
                    chance: 50
            },
                {
                    img: 'Phases/Flip-Gamma-Doppler/emerald.webp',
                    chance: 10
            },
                ]
    }, {
            id: 635,
            type: "★ Flip Knife",
            skinName: "Rust Coat",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhfg3SPqFPY-Yu8Q3gNiw84cFma9qz87ITJGOz5cCRZq4pMo1MHZPUXqOCMlz0vB44hqJYfMbY8iq52SzobGpbWhXi82NXy-KCpPI11bIb1hbd"
    }, {
            id: 636,
            type: "★ Flip Knife",
            skinName: "Marble Fade",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhfg3SPqFTY_g75grgDBg06cNma9u_8LMSFlC-9tWTLbUrYdFFHJGCXPCFZFusuEw8gvUOJpPcqH-9iHm_M2YOXBC9q25WnO6Z-uw8Y8ANU94"
    }, {
            id: 637,
            type: "★ Flip Knife",
            skinName: "Damascus Steel",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhfg3SPqFPY_E7-Qn_CjIh18tqU9-iyLcHO1u6qouUM7h-Y9tMHcTZC_KFZ131vxo4iKUJfsOO9CO5jn_hbj8PDhO--2Ia2LjQI41o9KY"
    }, {
            id: 638,
            type: "★ Flip Knife",
            skinName: "Tiger Tooth",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhfg3SPqFQY-Ez8w3-Nigg6clkUei6_rwOPWOz5cCRZq4oNNkfH5TSCaCCZA6p40tu0qFaJsCBonu53XnpPWpZWkG9qz8Fm7ODpPI11e7G-Um7"
    }, {
            id: 639,
            type: "★ Flip Knife",
            skinName: "Ultraviolet",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhfg3SPrNRY-Uv5hjgDBg-4cBrQOi69qkBLBLp5YXAYeIpMIwYHJWCDPeDNF307hhrhfRde5aA9Hu53im7OmwIXBO95CtazzhCH8L6"
    }, {
            id: 640,
            type: "★ Flip Knife",
            skinName: "Urban Masked",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhfg3SPrNOY-E75A3THDUw6clcWN6x_685JV2t49fYYeQtY9hIHMnVD6eGZA2suRkwhqIMfMePoiK9iH6_PWlfD0fvr29RyvjH5OXG2hpQHA"
    }, {
            id: 641,
            type: "★ Flip Knife",
            skinName: "Stained",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhfg3SPqFPY_M15gvpDRg-4cBrQOi69qkBLBK6vdPANrcqYdFOF5HRW6DVZQ766xk7gKMLLcePpi_s1Hm7OGdYXhPo5Ctaz043bOns"
    }, {
            id: 642,
            type: "★ Flip Knife",
            skinName: "Scorched",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhfg3SPrNOY_E75BjgDBg-4cBrQOi69qkBLBK54NSTZrEtZNlNG8iGUveDbgur7kgw0_dcecHfoS3q2izuaWkLChO-5Ctaz-iUruLD"
    }, {
            id: 643,
            type: "★ Flip Knife",
            skinName: "Safari Mesh",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhfg3SPrNOY_g_5wDTHSY818tqU9-iyLcHO1u6qoHAMuMkNN4dTMeCCaODZwur7Us_h_ULJ8eB8n7p33m4Mm0CDkG--D4a2LjQKGuiy1Y"
    }, {
            id: 644,
            type: "★ Flip Knife",
            skinName: "Night",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhfg3SPrNRY_sz8wD4Nis77893a9u35bwDZ1-7soPFN7YsYo4YScjUUv-PZFz_7x040aVYfsSK8Xju2n_vbmoMCRX1ujVT7gNIytI"
    }, {
            id: 645,
            type: "★ Flip Knife",
            skinName: "Boreal Forest",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhfg3SPqhHY_M15g3_HRgw59VmVduJ-7IBIUiA6NOEZOUyZNxEGMjYX_eDZg6s7E8xgqQOfZSIoCrvj3u9azwPXkC6rzkHzeaA6awr3DgaDfI7XQ"
    }, {
            id: 646,
            type: "★ Flip Knife",
            skinName: "Blue Steel",
            rarity: "rare",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhfg3SPqFPY_c24Q3oNis77893a9u35bwDZwjmsdeQYLYlMo4YTMXVW_WFZ1z56kw-iaZcKpfdqSK81CTpOGkICBD1ujVTzVntbj4"
    }, {
            id: 647,
            type: "★ Huntsman Knife",
            skinName: "Safari Mesh",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfx_LLZTRB7dCJh5C0mvLnO4TFl2Vu5Mx2gv3--Y3nj1H6-EJoNjj1IYLGJlRvaAvZ-1Hvwuboh5K4vp_NzCZhuCYqtyrZnxHk1wYMMLI47XWL5Q"
    }, {
            id: 648,
            type: "★ Huntsman Knife",
            skinName: "Crimson Web",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfx_LLZTRB7dCJnJm0gPL2IITck29Y_chOhujT8om73QHlr0o_Njv6IIKde1M3YFmB8lm9w-nthp-6vcyYyXRqvXEmt37bmwv3308f4sOUEg"
    }, {
            id: 649,
            type: "★ Huntsman Knife",
            skinName: "Boreal Forest",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfx_LLZTRB7dCJnJm0kfjmNqjFqWle-sBwhtbN_Iv9nGu4qgE7NnehIoHBcVI_aFnQrlS5w-vt05S7u5nAmHc2uCcn5nrZzhKzhR8ZZrFsm7XAHnEvQoLM"
    }, {
            id: 650,
            type: "★ Shadow Daggers",
            skinName: "Blue Steel",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfw-bbeQJD_eO0mJWOk8j4OrzZgiVUuMcjj-rF8In221K2-ENqZTqmd9fDd1Q8NVHT81Psl7vr0cTvuprN1zI97fJ4ylzC"
    }, {
            id: 651,
            type: "★ Shadow Daggers",
            skinName: "Case Hardened",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfw-bbeQJD_eO5nYyOk8j5Nr_Yg2Zu5MRjjeyPpN72iVDlqEo_YD_2JNKRdVJtZw7V8li9xOq7h8DqvZqayXVmvCZ07GGdwULkTS1GEw"
    }, {
            id: 652,
            type: "★ Shadow Daggers",
            skinName: "Fade",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfw-bbeQJD7eOwlYSOqPv9NLPF2G0Gu8Eo2bDApt-g0FXl-UU6NTuhI9SccVU3N1DXqFjsxua-g8W7tMvXiSw0K6R8VrQ"
    }, {
            id: 653,
            type: "★ Shadow Daggers",
            skinName: "Safari Mesh",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfw-bbeQJR_OO7kZODqOP1PYTdn2xZ_Itz3OuSrNz22wLh-RBuMTryd4aSdlVqY1uC-QLvyOzu18C1tJrJm3YxpGB8sjaSYMPt"
    }, {
            id: 654,
            type: "★ Shadow Daggers",
            skinName: "Slaughter",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfw-bbeQJD4eOskYKZlsj4OrzZgiVQuJxw3OrHptitigXk-RVkYzz7I4SXdFVtZlmE-lK7xeq6gJa-u53K1zI97VbkI_gt"
    }, {
            id: 655,
            type: "★ Shadow Daggers",
            skinName: "Stained",
            rarity: "rare",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfw-bbeQJD_eOwm5KIkvPLP7LWnn8fusZ0i-_E992l3FWyrhFoYz_6dteRIQFvZguD_gW7yO691pW6756dnWwj5He74Aez4A"
    }, {
            id: 656,
            type: "M4A1-S",
            skinName: "Hyper Beast",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52YOLkDyRufgHMAqVMY_YvywW4CHYN4N5zUcWJ9b4HOkiA6deSavVxX4QdXZeFRPPQYlivuB1u1KFeJ52AoS7q1SjgbGdbWRG_-ToHzrCO7Odph2xCEXGu7bLbJHLl5no"
    }, {
            id: 657,
            type: "AK-47",
            skinName: "Aquamarine Revenge",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56P7fiDzRyTQXJVfdhX_ov5gnrDBgz5NNcWN6x_685JV2t49fYMbd5NI1LS8PYDqWENVz-7B1u1albfcGP9Xnp2HnvbGsIXhTu-z5VyfjH5OUN6wKZjw"
    }, {
            id: 658,
            type: "M4A4",
            skinName: "Asiimov",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52YOLkDzRyTQmWPqFNVfg14jfhDCM7_cpcWNak8L5IK1nu4NOSMbB_MotLS8KGDqXQYQj7vE871fddJpeL8n_vjyy8PmxZDw2rpDwJTGGyIQ"
    }, {
            id: 659,
            type: "M4A1-S",
            skinName: "Cyrex",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52YOLkDyRufgHMAqVMY_YvywW4CHYh18R6RtKuyLcPLlSr296Xced5LtlIG5LUWvOFM1v66Rk80aVaeZ2IoiK6j3_pb2YKU0fjr2kMzuPVs-F1wjFBLhxWp7I"
    }, {
            id: 660,
            type: "AK-47",
            skinName: "Fire Serpent",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56P7fiDzRyTQLLE6VNWecq8Qb4NiY5vJBcVsW34bQ5JVW47Mapb-FuZ41SFsPZWqOBMF3940pt0akML5GKpHy73yztOTsKCkC9-j8BzOfV6OFihXFWHSb0S-ZgUA"
    }, {
            id: 661,
            type: "P90",
            skinName: "Asiimov",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5rbbOKMyJYYl2STKFNVfw3-x7TBS414NNcWNak8L5IeV--s9TBZeMsM9ofFsiDX6XVYwn7uRhs1ahffZaK9S_n3iu4Mj8CUw2rpDw1YXWUJg"
    }, {
            id: 662,
            type: "M4A4",
            skinName: "X-Ray",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52YOLkDzRyTRzQALlhUaEF-AHrATMN5MZxU9L48uJUcF69t4vPO-R6NNFMHZPSCKKAMA-ruBk_h6QOesaJpyvq2CW7a3BKBUQFWGseyw"
    }, {
            id: 663,
            type: "P90",
            skinName: "Death by Kitty",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5rbbOKMyJYcQXWEqtLUPkpyxi1WRg-4cBrQOi69qkBLBLv4tTEYLV_NdsdGcnRD_SOMlz96Bhsh_NZL8CKqS-72C69Mj0MUxHt5CtazyMJYE6_"
    }, {
            id: 664,
            type: "AK-47",
            skinName: "Vulcan",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56P7fiDzRyTQXJVfdhTuA49g3-Nis77893a9u35bwDZwnnt4SVMLh4M9hPGJHVC_fQbwmrvB9riPJUe5XbqS7s2yq6a2ZfDUf1ujVT14JGn7I"
    }, {
            id: 665,
            type: "SSG 08",
            skinName: "Blood in the Water",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5oJ-TlaAhkZzvRCaFMV8o2_Q_kHRg-6dVkUZnmp-NXe1_ttNPOOrYkNN9MHsOCWqeEbwj-u0o-hvdbfcSLoiq-3yjhJC5UDOugWvow"
    }, {
            id: 666,
            type: "CZ75-Auto",
            skinName: "Victoria",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz54LrTgMQhmYzvHFaNWWfEF9xK7XBg-4cBrQOi69qkBLBLq4tPBZrR6Nd5KH8CFDKPXNVyv40JpiaVVfJPf8S-7ji7vPmZbWEHi5Ctaz0bS9aXa"
    }, {
            id: 667,
            type: "AUG",
            skinName: "Akihabara Accept",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFAR17PLGeDBH092jk7-HnvD8J_XXxj8IuJIkib-VoNSi2VGx_UQ-Yzv3I4SQcVA7aAvS_FC6wru51pK1ot2XnmtK7ev7"
    }, {
            id: 668,
            type: "P2000",
            skinName: "Fire Elemental",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5zP_PnYGc3TQfXPrAMDKVqyw7lGyIN7ctmWdK447oKFlC249qCXOx9co8ZAcGFX_HSYl30vEprhaAIKZSK8yvm3y7qPWlbChburDpWnLSH6-Bq0DwIAy_n77aVEso"
    }, {
            id: 669,
            type: "MAC-10",
            skinName: "Neon Rider",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52NeDkYAhkZzvPAKMPDMo08QfiGy427dVcWN6x_685JV2t49fYZrElZI1MH8KFXaWEMl-o6ho6hPMJfcaMpny5iyXgOjtZXxa6-j8CyvjH5OWd_Q3jAQ"
    }, {
            id: 670,
            type: "AK-47",
            skinName: "Wasteland Rebel",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56P7fiDzRyTRDQCKJLSPAF9QO4Xhg-4cBrQOi69qkBLBK5tIqTM7F5Y9lMFpTQU6SEN1_96Es51PJeLMGKoSK5jyzuODwDCEe65Ctaz8HGPHc9"
    }, {
            id: 671,
            type: "M4A4",
            skinName: "Howl",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwT09S5g4yCmfDLPr7Vn35cppYo0riZp4-t3Q2x_UVpYGr6LIXHJABrYVGB_QS5k72905S_75ycm3t9-n51e4WtYjg"
    }, {
            id: 672,
            type: "AWP",
            skinName: "Hyper Beast",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56I_OKMyJYcxPSPqhHTPAoywrpCDQm18pmUN6j-oQKKE644ZyVO-IsMdFJG8DZXKWBZVj67ExugfNVe8CJoivr3Su_PmlYCBrrqz0HhqbZ7W1KaKdj"
    }, {
            id: 673,
            type: "AWP",
            skinName: "Lightning Strike",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56I_OKMTpYfg3FCbRQVfs9ywn7GRg-4cBrQOi69qkBLBLss4THO7koMdhPSpXQDKPVbwmsvE89iahfJ5OKpSPs3n-4OGlfWBW_5Ctaz7zg_DXL"
    }, {
            id: 674,
            type: "AWP",
            skinName: "Asiimov",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56I_OKMyJYcxPSPqFNVfg14jfhDCM7_cpcWNak8L5ILF3ot4SXMeMtY95MTcDZCPbSNACpuUo6hvNYfJCLoS3vjn_taDtZUw2rpDytVfjhQg"
    }, {
            id: 675,
            type: "AWP",
            skinName: "Man-o'-war",
            rarity: "covert",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56I_OKMTpYcxPSPqdSU-cjywTlDi8m18tiRtCzuehScVm-4YKQNuQoZIlEGcfRUv6Abgv77E8w1PVZLpyO8SPn3yTpM24UG028omRZCoA"
    }, {
            id: 676,
            type: "AK-47",
            skinName: "Cartel",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56P7fiDzZ2TQXJVfdhX_Qo4A3gNis77893a9u35bwDZw66s9CTOuYoY98eS5HTWvLQZFj6uUg_hKNbL8GApXu5i364M21cW0H1ujVTyBd8HaM"
    }, {
            id: 677,
            type: "M4A4",
            skinName: "龍王 (Dragon King)",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52YOLkDzRyTQmWAPRhXfs58Rv4GyY-18tqU9-iyLcHO1u6qtGUZ7krM9pKF8mGXvTUYViouUI50vUPJpSPpnjuiHjtO2oDXBe4qGwa2LjQ-8EAblc"
    }, {
            id: 678,
            type: "AK-47",
            skinName: "Red Laminate",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56P7fiDz9-TQXJVfdSXfgF-AHrATMN5MZxU9L4puJffw7v4YrGO7UrOd5PFsLWXqXQYQz-vks-haFaLZTbpHi83HvqPXBKBUQbZsOMyg"
    }, {
            id: 679,
            type: "AWP",
            skinName: "Redline",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56I_OKMyJYcxPSPqNRXuc7ywTlDi8m18tiRtCzubgAewy84YSXYLEtNdkeG5HTWqKONwH56kM51fJZLJKK83i5jHnta2oUG028bEnLGFg"
    }, {
            id: 680,
            type: "M4A1-S",
            skinName: "Atomic Alloy",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52YOLkDyRufgHMAqVMY_Q3ywW4CHZ_-_hiWNu57oQJO12x49epb-l7aJwjQ5GSDaOYbguvvkk_gvVdLZCP9ivoiH_hPG4IUkLjrmoAmefUvudu0DkUESK5_vLM95cjMz2U1Q"
    }, {
            id: 681,
            type: "AWP",
            skinName: "Graphite",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56I_OKMTpYcRbXDLBSWco45gn6Bhg-4cBrQOi69qkBLBLq4ofPZ-UuMt8YHcjQDPXVZVv-4x1p1aYIK5zY8yvr3i7qMj1bXkHp5Ctaz8vYRbYi"
    }, {
            id: 682,
            type: "AK-47",
            skinName: "Redline",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56P7fiDzRyTQXJVfdhX_o45gnTBS414NNcWNak8L5IfgjmsNCQZ-YoON1JSZTUD_DXZF2vvkIwg_QJL8SLpCm81S28bGYJWw2rpDzip-2Q0g"
    }, {
            id: 683,
            type: "AUG",
            skinName: "Bengal Tiger",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56IeSKOC5YZg3FBLJhUPw9_BzTBSYg78ItUIWw8uJTfljsvYLFZ-MpN99FG8DTD6KHNQD4408_1aBVecSO9Sy5iTOpZDnMe7RhPA"
    }, {
            id: 684,
            type: "AK-47",
            skinName: "Case Hardened",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56P7fiDzZ2TQvLDaVaY_kz8wD4Nisz-sBmGo7k9OMCeA7q4YaTNrQrNdAYHMeFU_KAYgD76kg41agMLp2Boym92CX3ejBdMGIcS0s"
    }, {
            id: 685,
            type: "Desert Eagle",
            skinName: "Hypnotic",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5_MeKyPDJYcwX9F6VMSPw9-zfgACA6_PhvVcWx8vVefF3ustfCYeZ-OIpNTJPWWf-FNVj4vktrhvVefpTcpn_p3S_qOWwJRVO1rdQNtFZ2"
    }, {
            id: 686,
            type: "Glock-18",
            skinName: "Water Elemental",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz58OOy2OwhkZzvFDa9dV7g2_Rn5DDQx7cl3a9u_8LMSFlC-9tWTLbEpMY1FGsSFDvLXM1__4hhr06RYe5Xa8S692S64PToDXRfvrGgCybWZ-uw8dna1jag"
    }, {
            id: 687,
            type: "P250",
            skinName: "Muertos",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5rZrblDzRyTRSQVPBhUfQ08AngCBg-4cBrQOi69qkBLBLv5dGUNrEoNtwfS8fSXPKFNQ-s6x1t1vALJ5KKpijn1Xi7PzoKWUXs5Ctaz4FQJ-4V"
    }, {
            id: 688,
            type: "FAMAS",
            skinName: "Afterimage",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz59Ne60IwhkZzvAE69VWfsF5An4ARg06cpiR-i6_rwOPWOz5cCRZq4pZNxJGsPZXfWDMgH-4h1u1fcJLZONpi2-1X7uPGlYXBLj-mxXn-6CpPI11ZK_4Z1K"
    }, {
            id: 689,
            type: "P90",
            skinName: "Trigon",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5rbbOKMyJYYl2SPrRMVfI1-jfgACA6_PhvVcWx8vVfLwXs4orDOuZ5MYxMHJSGCaPSYAuo70lrhPIMfZaA8X_tiyW4MzgJRVO1rfbRisl0"
    }, {
            id: 690,
            type: "Galil AR",
            skinName: "Eco",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz58Ne-8PDZ1TQfXPqdfUPw2yw3vBhg_7cNqQdqJ-7oULlnxsdeUMrMpZNodSseEWKDVYVz6uB841vNUK52Aonnn3S3oPGkPWRPor3VExrHwzwdDoA"
    }, {
            id: 691,
            type: "P2000",
            skinName: "Corticera",
            rarity: "classified",
            img: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5zP_PnYGc3TQfXPqZfSvA29Tf8W3diuPhvXdC-44QKKE644ZyVYLQsZIpIS8XQXv7VYV2puR1qhaNbK5fdqS_riCToPm4KDhbi-GIEhqbZ7RAAKX2k"
    }, {
            id: 692,
            type: "AWP",
            skinName: "Snake Camo",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FBRw7ODGcDZH09GzkImemrmsY-PUxmgAv5Up2rnFrdmijlXgqUA_ZjzzIIKQcQA7Y1uE_Fbtlefum9bi68KPYhsE"
    }, {
            id: 693,
            type: "AWP",
            skinName: "Pink DDPAT",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957PfMYTxW08y_mou0mvLwOq7c2DxUscQkiO2S8I-h2gTm-hA4NTyhdoDDcVU3MwzV_1G4xb_uhpPo6Z7XiSw03MaHlHE"
    }, {
            id: 694,
            type: "AWP",
            skinName: "Medusa",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdShR7eO3g5C0mvLwOq7c2DkAvJQg27iT9NWm2VK3rkU6YmmiI4SVJAQ9MljUr1O5ku7ug8K1usnXiSw07gvX0uU"
    }, {
            id: 695,
            type: "AWP",
            skinName: "Dragon Lore",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdTRH-t26q4SZlvD7PYTQgXtu5cB1g_zMu9zw3g2yrkVtZ2r6IoSVdAU-ZVrY_lS6lb_ogsDqu57NmCQ27iJx53nD30vgUTXWscs",
            can: {
                buy: false
            }
    }, {
            id: 696,
            type: "M4A1-S",
            skinName: "VariCamo",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO-jb-dluX9MLrcmVRd4cJ5nqeWrNit2AewqhY_Yj31cIDGJgRtZV-E8gS2xOzv0Z_qucvJm3M16SFw-z-DyBeWkcOk"
    }, {
            id: 697,
            type: "M4A1-S",
            skinName: "Icarus Fell",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO-jb-ClPbmJqjummJW4NE_3ujHpY2sigXl-UFoZGj7JYCXdgQ4YVnQ-1Lqxenn1MLpuszJz3tk6D5iuyjCqdNpmA"
    }, {
            id: 698,
            type: "M4A1-S",
            skinName: "Hot Rod",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO3mr-ZkvPLPu_Qx3hu5Mx2gv2P8I-g0VHtqUNlNmimLdCRdFdoYFCErwC4xLu6jJbpuc-dnydq73Jw5GGdwULhEbgmIQ"
    }, {
            id: 699,
            type: "M4A1-S",
            skinName: "Golden Coil",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alIITCmGpa7cd4nuz-8oP5jGu5rhc1JjTtLIfEdVQ-YA6G-FbqwOzs05Tp6smdzHdiuCUi5y7YnRG1gB9OOLE50OveFwutvS5J8A"
    }, {
            id: 700,
            type: "AK-47",
            skinName: "Emerald Pinstripe",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszYeDNR-M6_hIW0lvygZITZk2pH8Yt33byV8N-ii1Dn8kVqMWv0IYGQIQ47YQvS_FG4k-i6h8Tq6pjBznBqpGB8snmEYrAC"
    }, {
            id: 701,
            type: "AK-47",
            skinName: "First Class",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszPYzhH4uO6kYGfn_LmDLrawjxu5cB1g_zMu9rw0Fbl-kJuY2r3cI-RIVI-MlzTr1foxOe6hcC-6ZvPnCFquChz5XjD30vgHKsTYF0"
    }, {
            id: 702,
            type: "AK-47",
            skinName: "Hydroponic",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhh3szKcDBA49OJnpWFkPvxDLfYkWNFppwpie2Rp9_w0VDm-UNrMj30IoPHdAY-M1rY-1K7w7291pO8vJTJzHN9-n51xLwwH8g"
    }, {
            id: 703,
            type: "AK-47",
            skinName: "Jet Set",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszfdDFO08iklZaOm_LwDLrawjxu5Mx2gv2PotytiQHnqhBoZGqnI9XBcgQ-Yl_Y_Vfvyey9g8S4753JzSA1s3Eh5GGdwUIoc5a5cw"
    }, {
            id: 704,
            type: "AK-47",
            skinName: "Frontside Misty",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV08u_mpSOhcjnI7TDglRc7cF4n-SPpI-iigLg80ZvZzryd4_GI1Q6Yg3VqFe4w-y90JLo753NzXtmsnEl4mGdwUIuRPhSEw"
    }, {
            id: 705,
            type: "AK-47",
            skinName: "Point Disarray",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV08y5nY6fqPP9ILrDhGpI18h0juDU-MLx2gKy8xFqMDr2IIORcAU6MlnS_Vjtxu7rhcK-u5-cyXZqsiEg7HnUgVXp1kpd_x09"
    }, {
            id: 706,
            type: "Sawed-Off",
            skinName: "Cutaway",
            rarity: "milspec",
            img: "Workshop/Sawed-Off-Cutaway.png"
    }, {
            id: 707,
            type: "PP-Bizon",
            skinName: "Nostromo",
            rarity: "milspec",
            img: "Workshop/PP-Bizon-Nostromo.png"
    }, {
            id: 708,
            type: "Five-Seven",
            skinName: "Blot",
            rarity: "milspec",
            img: "Workshop/Five-Seven-Blot.png"
    }, {
            id: 709,
            type: "SSG 08",
            skinName: "King Cobra",
            rarity: "milspec",
            img: "Workshop/SSG-08-King-Cobra.png"
    }, {
            id: 710,
            type: "MAC-10",
            skinName: "Kinetics",
            rarity: "restricted",
            img: "Workshop/MAC-10-Kinetics.png"
    }, {
            id: 711,
            type: "M4A1-S",
            skinName: "Never Fly",
            rarity: "restricted",
            img: "Workshop/M4A1-S-Never-Fly.png"
    }, {
            id: 712,
            type: "CZ75",
            skinName: "Badass Comic",
            rarity: "restricted",
            img: "Workshop/CZ75-Badass-Comic.png"
    }, {
            id: 713,
            type: "P250",
            skinName: "N-Force",
            rarity: "restricted",
            img: "Workshop/P250-N-Force-R.png"
    }, {
            id: 714,
            type: "AWP",
            skinName: "Phoenix",
            rarity: "classified",
            img: "Workshop/AWP-Phoenix.png"
    }, {
            id: 715,
            type: "Desert Eagle",
            skinName: "Gold",
            rarity: "classified",
            img: "Workshop/Deagle-Gold.png"
    }, {
            id: 716,
            type: "AK-47",
            skinName: "Fluentem",
            rarity: "covert",
            img: "Workshop/AK-47-Fluentem.png"
    }, {
            id: 717,
            type: "USP-S",
            skinName: "Draco",
            rarity: "covert",
            img: "Workshop/USP-S-Draco.png"
    }, {
            id: 718,
            type: "Tec-9",
            skinName: "Chemical smoke",
            rarity: "milspec",
            img: "Workshop2/Tec-9-Chemical-smoke.png"
    }, {
            id: 719,
            type: "PP-Bizon",
            skinName: "TF2",
            rarity: "milspec",
            img: "Workshop2/PP-Bizon-TF2.png"
    }, {
            id: 720,
            type: "USP-S",
            skinName: "Dystopia",
            rarity: "milspec",
            img: "Workshop2/USP-S-Dystopia.png"
    }, {
            id: 721,
            type: "SG 553",
            skinName: "Erlkoenig",
            rarity: "milspec",
            img: "Workshop2/Galil-AR-Erlkoenig.png"
    }, {
            id: 722,
            type: "M4A4",
            skinName: "DeathWalker",
            rarity: "restricted",
            img: "Workshop2/M4A4-DeathWalker.png"
    }, {
            id: 723,
            type: "UMP-45",
            skinName: "Armamancer",
            rarity: "restricted",
            img: "Workshop2/UMP-45-Armamancer.png"
    }, {
            id: 724,
            type: "MP7",
            skinName: "Way of the Samurai",
            rarity: "restricted",
            img: "Workshop2/MP7-Way-of-the-Samurai.png"
    }, {
            id: 725,
            type: "R8 Revolver",
            skinName: "Kingdom of Dragons",
            rarity: "restricted",
            img: "Workshop2/R8-Revolver-Kingdom-of-Dragons.png"
    }, {
            id: 726,
            type: "FAMAS",
            skinName: "BlueWolf",
            rarity: "classified",
            img: "Workshop2/FAMAS-BlueWolf.png"
    }, {
            id: 727,
            type: "M4A1-S",
            skinName: "BlueWolf",
            rarity: "classified",
            img: "Workshop2/M4A1-S-BlueWolf.png"
    }, {
            id: 728,
            type: "AWP",
            skinName: "BlueWolf",
            rarity: "classified",
            img: "Workshop2/AWP-BlueWolf.png"
    }, {
            id: 729,
            type: "Glock-18",
            skinName: "BlueWolf",
            rarity: "covert",
            img: "Workshop2/Glock-18-BlueWolf.png"
    }, {
            id: 730,
            type: "AK-47",
            skinName: "BlueWolf",
            rarity: "covert",
            img: "Workshop2/AK-47-BlueWolf.png"
    }, {
            id: 731,
            type: "★ Gut Knife",
            skinName: "Revenge in Sweet",
            rarity: "rare",
            img: "Workshop/Gut-Knife-Revenge-is-Sweet.png"
    }, {
            id: 732,
            type: "★ Karambit",
            skinName: "Purple Abstract",
            rarity: "rare",
            img: "Workshop/Karambit-Purple-Abstract.png"
    }, {
            id: 733,
            type: "★ Karambit",
            skinName: "Bloodline",
            rarity: "rare",
            img: "Workshop2/Karambit-Bloodline.png"
    }, {
            id: 734,
            type: "★ Karambit",
            skinName: "Scorpion",
            rarity: "rare",
            img: "Workshop2/Karambit-Scorpion.png"
    }, {
            id: 735,
            type: "Glock-18",
            skinName: "Candy Racer",
            rarity: "milspec",
            img: "SteachCase/Glock-18-Candy-Racer.png"
    }, {
            id: 736,
            type: "AWP",
            skinName: "Animal",
            rarity: "milspec",
            img: "SteachCase/AWP-Animal.png"
    }, {
            id: 737,
            type: "FAMAS",
            skinName: "Stinger",
            rarity: "milspec",
            img: "SteachCase/Famas-Stinger.png"
    }, {
            id: 738,
            type: "UMP-45",
            skinName: "AGGRESSOR",
            rarity: "restricted",
            img: "SteachCase/UMP-45-AGGRESSOR.png"
    }, {
            id: 739,
            type: "USP-S",
            skinName: "Banker",
            rarity: "restricted",
            img: "SteachCase/USP-S-Banker.png"
    }, {
            id: 740,
            type: "Desert Eagle",
            skinName: "Crude",
            rarity: "restricted",
            img: "SteachCase/Deagle-Crude.png"
    }, {
            id: 741,
            type: "M4A4",
            skinName: "Shark's Prey",
            rarity: "classified",
            img: "SteachCase/M4A4-Sharks-Prey.png"
    }, {
            id: 742,
            type: "P90",
            skinName: "Stone story",
            rarity: "classified",
            img: "SteachCase/P90-Stone-story.png"
    }, {
            id: 743,
            type: "AK-47",
            skinName: "Wolf Attack",
            rarity: "covert",
            img: "SteachCase/AK-47-Wolf-Attack.png"
    }, {
            id: 744,
            type: "USP-S",
            skinName: "Apis",
            rarity: "covert",
            img: "SteachCase/USP-S-Apis.png"
    }, {
            id: 745,
            type: "AK-47",
            skinName: "Lawbreaker",
            rarity: "covert",
            img: "SteachCase/AK-47-Lawbreaker.png"
    }, {
            id: 746,
            type: "M4A4",
            skinName: "Howl (REMOVED)",
            rarity: "covert",
            img: "SteachCase/M4A4-Howl-REMOVED.png"
    }, {
            id: 747,
            type: "★ M9 Bayonet",
            skinName: "RedBlade",
            rarity: "rare",
            img: "SteachCase/M9-Bayonet-RedBlade.png"
    }, {
            id: 748,
            type: "★ Karambit",
            skinName: "Cosplay",
            rarity: "rare",
            img: "SteachCase/Karambit-Cosplay.png"
    }, {
            id: 749,
            type: "P2000",
            skinName: "Turf",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zPYgJSvozmxM2Yh_jmJ4Tdn2xZ_Iso3OjFrI6i3gXn-xA5MmD2cdWXJAdsMl7RrwS6w-a6g8e1tZWYyntrpGB8suGATXim"
    }, {
            id: 750,
            type: "MAG-7",
            skinName: "Sonar",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7uifDhh3szFcDoV09G3mIaEhfrLP7LWnn8fsMQp3eqYrNmg2FXgrUVsajz0J4OSIFQ6N17TrADtl-bph5G17cuamGwj5HefKFtC5g"
    }, {
            id: 751,
            type: "MP9",
            skinName: "Sand Scale",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FAZh7PvBdTgP4czvq4yCkP_gfeyGlG4B65V0jrGTotqm0Ae3_RJuN23xLIKXJlA9YFjYqAPqle_ohsSi_MOeHdPXcDU"
    }, {
            id: 752,
            type: "Galil AR",
            skinName: "Black Sand",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbupIgthwczLZAJF7dC_mL-Khbr3MrbeqWdY781lxO-Y9Nun3FLh_UdrMTqicYWWJAA8MFmF8lXvwu67hMO6usvJm3tmuiE8pSGKxhAV22c"
    }, {
            id: 753,
            type: "MP7",
            skinName: "Cirrus",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFABz7PXBfzxO08y5m4yPkvbwJenummJW4NE_2bnE9N720Fft-Ec-Z2CldYbEd1M8M1CD_1HrkubnhcW9vMjLn3Bqvz5iuyjHksjlGg"
    }, {
            id: 754,
            type: "Glock-18",
            skinName: "Ironwork",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0uL3djFN79eJkIGZnLryMrfdqWdY781lxOjCptn22ga2qEZsZW_zd46cJ1VoNF_W_1XrlOfs18S16p3JmyZl7CQ8pSGKL8GUOzY"
    }, {
            id: 755,
            type: "CZ75-Auto",
            skinName: "Polymer",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotaDyfgZf0v73cidUvuO7kr-HnvD8J_XUzzJV7MAj07rEoNrz3gWw_ERlY2GhLIWXdFI8MFDZ-1S7wubmgp6_ot2Xnh9O--Qm"
    }, {
            id: 756,
            type: "USP-S",
            skinName: "Cyrex",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j3KqnUjlRd4cJ5nqfC9Inz3VHtrRJrNmj6d4XEdlBqZw7R-VTqxr-6hJS-uJjAm3FnsnQi-z-DyGAd0sdD"
    }, {
            id: 757,
            type: "Nova",
            skinName: "Gila",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouLWzKjhh3szGfitD08-3moS0m_7zO6-fxm9S6pV3ibmXoNii31Hk-hI6Nzj7cdXHIQ49Y1jY_1S_kOu5h8O1u4OJlyXObzUKtw"
    }, {
            id: 758,
            type: "M4A1-S",
            skinName: "Flashback",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDL3dl3hZ6sRygdbN_Iv9nBrhrkU_YT32LITBcQU-YV7U-FTsx--71pbpvMjBmnBr73N2tHaLlxC0n1gSOTTnAQeD"
    }, {
            id: 759,
            type: "G3SG1",
            skinName: "Stinger",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposem2LFZf1OD3dm5R642JgombkuXLKr7dmmRG18l4jeHVu9n03wO3_ko-azrxLYPBcFM_YQ7S_QO2wunt1Je4usjAznE37nZw53rD30vgmcE2eQU"
    }, {
            id: 760,
            type: "Dual Berettas",
            skinName: "Royal Consorts",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJf1OD3dShD4OO0kZKOg-P1IITWmWdV7ctOnOzP_I_wt1i9rBsofWvwcIGWJlQ4Mg7SqFPvxr-5h5C4vZmdy3RgvSMj4n6Jyxbl1BhKPORxxavJR7JVvdI"
    }, {
            id: 761,
            type: "Sawed-Off",
            skinName: "Wasteland Princess",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbuyLgNv1fX3cih9-8yJh4GckvP7Nb3ummJW4NE_3-qS89uki1bt-Uo5Zj3xLYSXIAQ7Ml_W_lXqwbi5hJ-0vcnAyyQyuj5iuyhoSspqEg"
    }, {
            id: 762,
            type: "P90",
            skinName: "Shallow Grave",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FABz7OORIQJR5N26mI-cqPDmMq3UqWdY781lxLCVrdyk0VLhrRU-ZG-hd9WXdlVoNAyF-1jtyOft08Duv5mcyicw63Y8pSGKeWe5Vcs"
    }, {
            id: 763,
            type: "FAMAS",
            skinName: "Mecha Industries",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRf1OD3dzxP7c-JmYWIn_bLP7LWnn8f65cnjrrH9o_22QHirRZuZTuiJ4WXd1NqZluC-Fi-yOy9hsO9tJ3Aymwj5Hdve0dwuA"
    }, {
            id: 764,
            type: "M4A4",
            skinName: "Buzz Kill",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhnwMzFJTwW08-zl5SEhcj4OrzZgiUAu5wh27GV9tyj3ADg8kc-YzjxJ9XBdg86N17Z-wO_k-nng5Lp7svA1zI97UBmtSOi"
    }, {
            id: 765,
            type: "SSG 08",
            skinName: "Dragonfire",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3Yi5FvISJkJKKkPj6NbLDk1RC68phj9bN_Iv9nBrg80FkZmGgLdKVeg46ZFyC_lPrxO25hZTotZ_OmHphuiNx43aJyUa1n1gSOaKu3f6c"
    }, {
            id: 766,
            type: "★ Sport Gloves",
            skinName: "Pandora's Box",
            rarity: "extraordinary",
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1JmMR1osbaqPQJz7ODYfi9W9eOmgZKbm_LLPr7Vn35cppIp2uvA896kiQW1-hdvMT30I9fHIAA9MFqDrlntkLru1J67v5nBmHp9-n51oZE8XSM"
    }, {
            id: 767,
            type: "★ Driver Gloves",
            skinName: "Lunar Weave",
            rarity: "extraordinary",
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAX1R3LjtQurWzLhRfwP_BcjZ97tC3l4u0m_7zO6-fx2oCsMAk07-Z9tmh0VDg8hZramigcoOQIFU6N1DZ-FK8lO_m0JS66oOJlyXrKxYjaQ"
    }, {
            id: 768,
            type: "★ Hand Wraps",
            skinName: "Spruce DDPAT",
            rarity: "extraordinary",
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DfVlxgLQFFibKkJQN3wfLYYgJK7dKyg5KKh8j3MrbeqWxD7dxOh-zF_Jn4xlCyrktsZmvxINLBdw9vNA7T_Fbrx73vjJPptJucnHdqvCJwsSyImBypwUYblwFxuLY"
    }, {
            id: 769,
            type: "★ Hand Wraps",
            skinName: "Leather",
            rarity: "extraordinary",
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DfVlxgLQFFibKkJQN3wfLYYgJK7dKyg5KKh8j4NrrFnm5D8fp8j-3I4IG7jgSy8xZpa2HyINXEdgZtMg7Q-gW5kObs15G9vZXIzyRiu3Zx4X3Zywv3308JRzw8kw"
    }, {
            id: 770,
            type: "★ Specialist Gloves",
            skinName: "Forest DDPAT",
            rarity: "extraordinary",
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1h3LAVbv6mxFABs3OXNYgJR_Nm1nYGHnuTgDL_VhmpF18Jjj-zPyo_0hVuLphY4OiyuOoTDdgFoMArYrAS7l7_rg5W-7pzOmnRq7yUnty7YyRSzhUpEZ7Ft1_2ACQLJ0i7bxGA"
    }, {
            id: 771,
            type: "★ Moto Gloves",
            skinName: "Cool Mint",
            rarity: "extraordinary",
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DeXEl7NwdOtbagFABs3OXNYgJP48i5hoOSlPvxDK_Dn2pf78l0tevN4InKhVGwogYxfWj1II6cdFQ9YgqBqAO7wry51Je8tZSawHc3vChw7S7byhK20hxLOuBxxavJFO0HS7A"
    }, {
            id: 772,
            type: "★ Moto Gloves",
            skinName: "Eclipse",
            rarity: "extraordinary",
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DeXEl7NwdOtbagFABs3OXNYgJP48i5hoOSlPvxDLnQhWJS18d9i-rKyoTwiUKt5RI4NWimIdLBcAFraVyE_Ae8kOjv1MW7uZTBmCNkvygh5XbYzkO0gklSLrs49Bcipm8"
    }, {
            id: 773,
            type: "★ Specialist Gloves",
            skinName: "Foundation",
            rarity: "extraordinary",
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1h3LAVbv6mxFABs3OXNYgJR_Nm1nYGHnuTgDLTDl2VW7fpmguDV8LP4jVC9vh5yYWqldoSXcFM5ZlrRqATtwersh57tvMzAmiY2vyF0t3rYyRy3hRxPavsv26Lj6N29Hg"
    }, {
            id: 774,
            type: "AK-47",
            skinName: "Shark's Reef",
            rarity: "covert",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "Christmas/AK-47-Shark's-Reef.png"
    }, {
            id: 775,
            type: "P90",
            skinName: "Green Hunter",
            rarity: "restricted",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "Christmas/P90-Green-Hunter.png"
    }, {
            id: 776,
            type: "AWP",
            skinName: "Kyoto Craftsman",
            rarity: "restricted",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "Christmas/AWP-Kyoto-Craftsman.png"
    }, {
            id: 777,
            type: "AK-47",
            skinName: "Toucan",
            rarity: "classified",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "Christmas/AK-47-Toucan.png"
    }, {
            id: 778,
            type: "M4A4",
            skinName: "Vengeful Power",
            rarity: "classified",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "Christmas/M4A4-Vengeful-Power.png"
    }, {
            id: 779,
            type: "Five-SeveN",
            skinName: "Dragon Force",
            rarity: "milspec",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "Christmas/Five-SeveN-Dragon-Force.png"
    }, {
            id: 780,
            type: "M4A4",
            skinName: "WildStyle",
            rarity: "restricted",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "Christmas/M4A4-WildStyle.png"
    }, {
            id: 781,
            type: "USP-S",
            skinName: "Desolate Space",
            rarity: "covert",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "Christmas/USP-S-Desolate-Space.png"
    }, {
            id: 782,
            type: "AWP",
            skinName: "Revenge of the Martian",
            rarity: "classified",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "Christmas/AWP-Revenge-of-the-Martian.png"
    }, {
            id: 783,
            type: "Tec-9",
            skinName: "Tiger",
            rarity: "milspec",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "Christmas/Tec-9-Tiger.png"
    }, {
            id: 784,
            type: "P250",
            skinName: "Pearl",
            rarity: "milspec",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "Christmas/P250-Pearl.png"
    }, {
            id: 785,
            type: "P2000",
            skinName: "Discord",
            rarity: "milspec",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "Christmas/P2000-Discord.png"
    }, {
            id: 786,
            type: "★ Moto Gloves",
            skinName: "Spearmint",
            rarity: "extraordinary",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DeXEl7NwdOtbagFABs3OXNYgJP48i5hoOSlPvxDLnQhWJS18d9i-rKyoHwjF2hpiwwMiukcZicegQ9NwmF-VfvkLvu08C9tJ7Lmidk73R2t3eLyUPigxBNOOY70fTPVxzAULnApTN1"
    }, {
            id: 787,
            type: "★ Hand Wraps",
            skinName: "Slaughter",
            rarity: "extraordinary",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DfVlxgLQFFibKkJQN3wfLYYgJK7dKyg5KKh8jmNr_uhWdQ_cJ5nuzTyoTwiUKtlB89IT6mOoPGdldtMg7SrFG4kOe908W1uJqcySEwviQjsX6OnhbihUoabeNugPKACQLJaQPumo0"
    }, {
            id: 788,
            type: "★ Driver Gloves",
            skinName: "Crimson Weave",
            rarity: "extraordinary",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAX1R3LjtQurWzLhRfwP_BcjZ9_tmyq4iOluHtDLfQhGxUppQj2e2Vpo2j3Ffm-RBlYD_3JY-XcgdqMAzUqVLrkrvuhZG575-bmCd9-n51r6-V7-4"
    }, {
            id: 789,
            type: "★ Specialist Gloves",
            skinName: "Emerald Web",
            rarity: "extraordinary",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1h3LAVbv6mxFABs3OXNYgJR_Nm1nYGHnuTgDL7ck3lQ5MFOnezDyoHwjF2hpiwwMiukcZjGJg85NQnR81LolObogsLo6MvJzHBlsyl04nvUmke-hxEfPeVojPXKVxzAUDsQyVOl"
    }, {
            id: 790,
            type: "★ Hand Wraps",
            skinName: "Badlands",
            rarity: "extraordinary",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DfVlxgLQFFibKkJQN3wfLYYgJK7dKyg5KKh8jyMrnDn2hu59dwhO7Eyo_0hVuLpxo7Oy2ceNfXJVMgN1DU_1Ltx-65gpLttJnPmyZg6SAn5n7dy0Cz1xhMarY7jPDPSA3PBbsJQvf6eanOuA"
    }, {
            id: 791,
            type: "★ Sport Gloves",
            skinName: "Hedge Maze",
            rarity: "extraordinary",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1JmMR1osbaqPQJz7ODYfi9W9eOxhoWOmcj5Nr_Yg2Zu5MRjjeyPpdX22gbhqkppMWz7coGcIAE9ZVvV8le2wOq7h5TotM7My3FkuCEk42GdwUK5qPdDsA"
    }, {
            id: 792,
            type: "★ Driver Gloves",
            skinName: "Diamondback",
            rarity: "extraordinary",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAX1R3LjtQurWzLhRfwP_BcjZ9_9K3n4WYnP76DKLUmmde__p9g-7J4bP5iUazrl1sYm6lJtWSJFdsYwuFqQLrk-rrgZLvvJiawXI16yIh7SnZmRexhU1McKUx0oSSfN1A"
    }, {
            id: 793,
            type: "★ Sport Gloves",
            skinName: "Arid",
            rarity: "extraordinary",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1JmMR1osbaqPQJz7ODYfi9W9eO7nYyCg_bmKoTdn2xZ_Pp9i_vG8MKh2QK1_kRtNzyhJY-dcgU7NF7Z-QLvxuq70Je7vsydy3Ay7iEq7X_UgVXp1uxQF-Nd"
    }, {
            id: 794,
            type: "★ Driver Gloves",
            skinName: "Convoy",
            rarity: "extraordinary",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAX1R3LjtQurWzLhRfwP_BcjZ94dW6nZSKhe7LPr7Vn35c18lwmO7Eu92s2FW1-ko4NWjxJYGdegE-YA3U-wC_lbvmgMe_tcidzXdquikntH3D30vgtGG3lFU"
    }, {
            id: 795,
            type: "★ Moto Gloves",
            skinName: "Boom!",
            rarity: "extraordinary",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DeXEl7NwdOtbagFABs3OXNYgJP48i5hoOSlPvxDLbemGRu6sp-h9bJ8I3jkWu4qgE7Nnf7ctOXIVM-NFzV-VS_xLvpjJDtvc6Yy3A3uCYr5S7YnRS_gh8eOLZrm7XAHhnmQDx4"
    }, {
            id: 796,
            type: "★ Sport Gloves",
            skinName: "Superconductor",
            rarity: "extraordinary",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1JmMR1osbaqPQJz7ODYfi9W9eO6nYeDg8j2P67UqWNU6dNoteXA54vwxlbi-0duYWulLIHDcVdtNF7S_VDrwb_vgpe-tJXNwXdmvChwtnjUnEGpwUYb1m-kts8"
    }, {
            id: 797,
            type: "AK-47",
            skinName: "Ganesha",
            rarity: "covert",
            buy: false,
            bot: false,
            can: {
                buy: false,
                bot: false,
                specialCase: false
            },
            img: "Other/AK-47-Ganesha.png"
    }, {
            id: 798,
            type: "P250",
            skinName: "Ripple",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhh3szYI2gS08-mgZSFnvzLP7LWnn8fu50m3L-Uptys3wG1qhJoY2n1cNLEdVc8ZV3T-QDtwLzvgMe67puYwWwj5Hf4p3Uhrg"
    }, {
            id: 799,
            type: "Sawed-Off",
            skinName: "Zander",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbuyLgNv1fX3cCx9_92hkYSEkfHLKbrfkm5Duvp9g-7J4cKg2QCy_BBqMG_zIoScdA49aQ7V_FG8webogsK7u5vLmndqvnRx4S2JgVXp1gGJxOF0"
    }, {
            id: 800,
            type: "MP7",
            skinName: "Akoben",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFBRw7P7YJgJW_tW0lYy0jvL4P7TGqWdY781lxLjCpdnx2gPg80Q6Njv2cI6XJw4_Z13X-FC3xey61JXtupqczyAyuSM8pSGKG3rzCmA"
    }, {
            id: 801,
            type: "PP-Bizon",
            skinName: "Jungle Slipstream",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlf2-r3czRY49KJgI-ZmcjzIb7UmFRd4cJ5nqeQ9I2l3wKxrxZqMmv2JYfHJAA5Zw6GqFDtxL_s0Mfq78zOyCFmsnEk-z-DyIQLMxpA"
    }, {
            id: 802,
            type: "SCAR-20",
            skinName: "Blueprint",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbmkOVUw7PDdTj9O-dmmhomFg8jnMLrDqWdY781lxLDAot3w0AXt-hBuMWvzLIfDd1BqYlDY_ge7xrjmhJ-6up6by3Q27yU8pSGKGwiMA-c"
    }, {
            id: 803,
            type: "Five-SeveN",
            skinName: "Capillary",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTj5X09q_goWYkuHxPYTHk2Jf18l4jeHVu9ij3FG3_UptMWqgJ9WcIQ48aQmB-wC2leq6h8S8u5udmCNn6Cdz4SnD30vgWlTck20"
    }, {
            id: 804,
            type: "Desert Eagle",
            skinName: "Oxide Blaze",
            rarity: "milspec",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PDdTjlH_9mkgL-OlvD4NoTSmXlD58F0hNbN_Iv9nBrhrRc5YTqgJdWcIA48M1iF81m8wurrgMW76s_LmydguSRwtn3VmUThn1gSOZyN_0a1"
    }, {
            id: 805,
            type: "MAC-10",
            skinName: "Last Dive",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldf0vL3fDxBvYyJgIiOqPv1IK_ukmJH7fp9g-7J4cLwiQDm_RdpMGjxI9OXdQ5oYw2F_Vjsw-u715futZ2cyXFmv3EksS3fgVXp1layEcKi"
    }, {
            id: 806,
            type: "UMP-45",
            skinName: "Scaffold",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf1OD3ZDBS0920jZOYqPv9NLPF2D4EsZQh2LCZ9Nr3jQ22-0RtYmz1cdCUdQBvYlmE-Fe-wem7jJTovMvXiSw0GHO1Iuc"
    }, {
            id: 807,
            type: "XM1014",
            skinName: "Seasons",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07PLZTiVP09CzlYa0kfbwNoTdn2xZ_It33byS99333wXkqktsYWqmJo-cJgc3YFCDq1C7wbzrh5K0v86YyCE3pGB8sheESime"
    }, {
            id: 808,
            type: "M249",
            skinName: "Emerald Poison Dart",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-jxcjhzw8zFI2kb09qkm4e0mOX9NLLfl2du5Mx2gv2Pot-m2VG2-BdqZG-mdtLDelJoZlmBrgO7ybzrhsfp7ZvKz3Rj7Ccq4GGdwUJpddwSYA"
    }, {
            id: 809,
            type: "Galil AR",
            skinName: "Crimson Tsunami",
            rarity: "restricted",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbupIgthwczbYQJF7dC_mL-cluHxDLfYkWNFppVw3r6XpIn3igLi-0duazj0I9eTcAQ2aV3Q_1XrwL3rgcXqvJ7AzHt9-n51xe-nTf0"
    }, {
            id: 810,
            type: "CZ75-Auto",
            skinName: "Xiangliu",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotaDyfgZf1OD3cid9_9K3n4WYqOfhIavdk1Rd4cJ5nqfApdqg0Q2yqhFtN27wJ4OXJFI3ZliGqVG9xOi8h5e575jJmiNk7ylz-z-DyEHqwXVj"
    }, {
            id: 811,
            type: "AWP",
            skinName: "Fever Dream",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJS_8W1nI-bluP8DLfYkWNFppQgj7yV9Nqi2Fbj_Eo5Ym72I9XGJwc2NAnS_1Pqxu6615W575uYznd9-n51iddPieY"
    }, {
            id: 812,
            type: "M4A1-S",
            skinName: "Decimator",
            rarity: "classified",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alDL_UlWJc6dF-mNbN_Iv9nBrhqhVkYTz6LYSScVBtMliB_gDqwuu9h5-7vc_PynVrvXV37HfUyxPmn1gSOa-1kwUB"
    }, {
            id: 813,
            type: "AK-47",
            skinName: "Bloodsport",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhnwMzJemkV0966m4-PhOf7Ia_ummJW4NFOhujT8om73ASy-0RqNW-hLYTAcg5vMgvT_Vm4wefthpO_v8yYwHVlsicr4C3fzQv330_79eypFA"
    }, {
            id: 814,
            type: "USP-S",
            skinName: "Neo-Noir",
            rarity: "covert",
            img: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh-TLPbTYhFRd4cJ5nqfE8dzz3Abg_hBtMWDzJ4fGdFI6YFjT-lHtlOi70Jfqvcifm3Vmvigj-z-DyA8aEmbE"
    }, {
            "id": 815,
            "type": "★ Huntsman Knife",
            "skinName": "Damascus Steel",
            "rarity": "rare",
            "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfx_LLZTRB7dCJlZG0k_b5MqjSg3husZVOhuDG_ZjKhFWmrBZyNWHycNPDdg43Z17Rq1C2kLvogZfvuJTJyHM3vSB05HnemhC10kwfO_sv26Ix5Gf1Rg",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": false,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 816,
            "type": "★ Butterfly Knife",
            "skinName": "Damascus Steel",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_butterfly_aq_damascus_90_light_large.f6eecc56e9d69742d80ad0bf59695a89cb8d9684.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 817,
            "type": "★ Bowie Knife",
            "skinName": "Damascus Steel",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_survival_bowie_aq_damascus_90_light_large.b53066882790815ba15f508ac268f29cd6cedf2a.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": false,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 818,
            "type": "★ Falchion Knife",
            "skinName": "Damascus Steel",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_falchion_aq_damascus_90_light_large.9bd7e0f1d32a177ab01bc8c52a51dac9ad61e5a9.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 819,
            "type": "★ Shadow Daggers",
            "skinName": "Damascus Steel",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_push_aq_damascus_90_light_large.682e0e63f745ebea76a093e8ff4f7cdb17d5d093.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 820,
            "type": "★ Falchion Knife",
            "skinName": "Doppler",
            "rarity": "rare",
            "img": "Phases/Falchion-Doppler/p1.webp",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": false,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            },
            patternChance: 20,
            patterns: [
                {
                    img: 'Phases/Falchion-Doppler/p1.webp',
                    chance: 50
                }, {
                    img: 'Phases/Falchion-Doppler/p2.webp',
                    chance: 50
                }, {
                    img: 'Phases/Falchion-Doppler/p3.webp',
                    chance: 50
                }, {
                    img: 'Phases/Falchion-Doppler/p4.webp',
                    chance: 50
                }, {
                    img: 'Phases/Falchion-Doppler/ruby.webp',
                    chance: 20
                }, {
                    img: 'Phases/Falchion-Doppler/sapphire.webp',
                    chance: 10
                }, {
                    img: 'Phases/Falchion-Doppler/black-pearl.webp',
                    chance: 5
                }
                ]
    }, {
            "id": 821,
            "type": "★ Shadow Daggers",
            "skinName": "Doppler",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_push_am_doppler_phase2_b_light_large.516d6cf5e16c964cd35b839a2b8b6f62ad564083.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": false,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 822,
            "type": "★ Shadow Daggers",
            "skinName": "Marble Fade",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_push_am_marble_fade_light_large.fce3f43a307394dcfa71988787dbb5d2ef6a3611.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": false,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 823,
            "type": "★ Falchion Knife",
            "skinName": "Marble Fade",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_falchion_am_marble_fade_light_large.6702e01c69bbdd050ed27964385eaf57fd96d579.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": false,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 824,
            "type": "★ Huntsman Knife",
            "skinName": "Rust Coat",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_tactical_aq_steel_knife_light_large.1e93732da4a5534deaa88e65c22274c57f2cd924.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": false,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 825,
            "type": "★ Bowie Knife",
            "skinName": "Rust Coat",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_survival_bowie_aq_steel_knife_light_large.3a61b0cf23bfa737be1cac012f4cdcde14347921.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": false,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 826,
            "type": "★ Falchion Knife",
            "skinName": "Rust Coat",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_falchion_aq_steel_knife_light_large.6d5b1f9bbc924ae1335175a262a69b1587448ccc.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 827,
            "type": "★ Butterfly Knife",
            "skinName": "Rust Coat",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_butterfly_aq_steel_knife_light_large.033e7505158efd2a1758a7144ccccfb554fcf576.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": false,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 828,
            "type": "★ Shadow Daggers",
            "skinName": "Rust Coat",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_push_aq_steel_knife_light_large.2753f1bc2008c99c34103b2b247801d3eb881d20.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 829,
            "type": "★ Shadow Daggers",
            "skinName": "Tiger Tooth",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_push_an_tiger_orange_light_large.dc3ed0014b7b2024a7fbcaaaca1fbbfae3331735.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 830,
            "type": "★ Falchion Knife",
            "skinName": "Tiger Tooth",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_falchion_an_tiger_orange_light_large.c467ce8f738dd9bce8cd7af54610f9186dadd362.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": false,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 831,
            "type": "★ Falchion Knife",
            "skinName": "Ultraviolet",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_falchion_so_purple_falchion_light_large.010830e050576efeb80b3e046d9dccf6ee21c31b.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 832,
            "type": "★ Huntsman Knife",
            "skinName": "Ultraviolet",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_tactical_cu_purple_huntsman_light_large.3d9355c0a0c0c170d10856ebc2492fef61832fbc.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 833,
            "type": "★ Bowie Knife",
            "skinName": "Ultraviolet",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_survival_bowie_so_purple_light_large.af202da5d81b8667477667b6db332769a96bf80e.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": false,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 834,
            "type": "★ Shadow Daggers",
            "skinName": "Ultraviolet",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_push_so_purple_light_large.af1841afc5146b836e87e6afab49f9a78d90ed1b.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 835,
            "type": "★ Butterfly Knife",
            "skinName": "Ultraviolet",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_butterfly_so_purple_light_large.116c48bf6a4a33f56d11b3204919422aa58f9337.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 836,
            "type": "M4A1-S",
            "skinName": "Froststorm",
            "rarity": "covert",
            "img": "Other/M4A4-S-Froststorm.png",
            "can": {
                "buy": false,
                "souvenir": false,
                "specialCase": false,
            }
    }, {
            "id": 837,
            "type": "P250",
            "skinName": "Zipper",
            "rarity": "milspec",
            "img": "Workshop3/P250-Zipper.png",
            "can": {
                "buy": false,
                "souvenir": false,
                "specialCase": false,
                "bot": false
            }
    }, {
            "id": 838,
            "type": "Sawed-Off",
            "skinName": "Purple Maniac",
            "rarity": "restricted",
            "img": "Workshop3/Sawed-Off-Purple-Maniac.png",
            "can": {
                "buy": false,
                "souvenir": false,
                "specialCase": false,
                "bot": false
            }
    }, {
            "id": 839,
            "type": "M4A4",
            "skinName": "Demon Attack",
            "rarity": "restricted",
            "img": "Workshop3/M4A4-Demon-Attack.png",
            "can": {
                "buy": false,
                "souvenir": false,
                "specialCase": false,
                "bot": false
            }
    }, {
            "id": 840,
            "type": "Five-SeveN",
            "skinName": "Bad Queen",
            "rarity": "milspec",
            "img": "Workshop3/Five-seven-Bad-Queen.png",
            "can": {
                "buy": false,
                "souvenir": false,
                "specialCase": false,
                "bot": false
            }
    }, {
            "id": 841,
            "type": "Desert-Eagle",
            "skinName": "Trigger Happy",
            "rarity": "classified",
            "img": "Workshop3/Desert-Eagle-Trigger-Happy.png",
            "can": {
                "buy": false,
                "souvenir": false,
                "specialCase": false,
                "bot": false
            }
    }, {
            "id": 842,
            "type": "AWP",
            "skinName": "White Boom",
            "rarity": "covert",
            "img": "Workshop3/AWP-White-Boom.png",
            "can": {
                "buy": false,
                "souvenir": false,
                "specialCase": false,
                "bot": false
            }
    }, {
            "id": 843,
            "type": "★ Huntsman Knife",
            "skinName": "PurpNYellow",
            "rarity": "rare",
            "img": "Workshop3/Huntsman-PurpNYellow.png",
            "can": {
                "buy": false,
                "souvenir": false,
                "specialCase": false,
                "bot": false
            },
            chances: {
                default: {
                    4: 20
                },
                stattrak: {
                    4: 10
                }
            }
    }, {
            "id": 844,
            "type": "Karambit",
            "skinName": "Soul",
            "rarity": "rare",
            "img": "Workshop3/Karambit-Soul.png",
            "can": {
                "buy": false,
                "souvenir": false,
                "specialCase": false,
                "bot": false
            },
            chances: {
                default: {
                    4: 20
                },
                stattrak: {
                    4: 10
                }
            }
    }, {
        "id": 845,
        "type": "Five-SeveN",
        "skinName": "Celtic Wyvern",
        "rarity": "restricted",
        "img": "Workshop3/Five-seven-Celtic-Wyvern.png",
        "can": {
            "buy": false,
            "souvenir": false,
            "specialCase": false,
            "bot": false
        },
        patternChance: 20,
        patterns: [
            {
                img: 'Workshop3/Five-seven-Celtic-Wyvern-(Green).png',
                chance: 20
            }, {
                img: 'Workshop3/Five-seven-Celtic-Wyvern-(Blue).png',
                chance: 50
            }
            ]
    }, {
            "id": 846,
            "type": "USP-S",
            "skinName": "Orion",
            "rarity": "classified",
            "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jnI7LFkGJD7fp9g-7J4bP5iUazrl1ka2qhLIGSIw5vZF-D8wXqwO_tjcC-uZjJnSY3vCkmsXbYlkO0gB1McKUx0vNO72r1",
            "can": {
                "buy": false,
                "contract": false,
                "bot": false,
                "stattrak": true,
                "souvenir": false,
                "inCase": false,
                "specialCase": false
            }
    }, {
            "id": 847,
            "type": "MAC-10",
            "skinName": "Aloha",
            "rarity": "milspec",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_mac10_am_mac10_aloha_light_large.98a6a9d8e546d31e6ebdab0e40ff2aa248fb126a.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 848,
            "type": "UMP-45",
            "skinName": "Metal Flowers",
            "rarity": "milspec",
            "img": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf0uL3ZDBSuImJkoyKmvLyP7TGk3lu5Mx2gv2PrI-giVGwqUFtMj31IICUJAY5Z1nT_VTtxO29gJbqvJ7JnyNj7yEitmGdwULd1U8dAw",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 849,
            "type": "FAMAS",
            "skinName": "Macabre",
            "rarity": "milspec",
            "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRfwOP3dzxP7c-JmYGIlvXmNoTdn2xZ_Ism37GTpNmljQbgqkVlamvxdo6UdlI4M13W-lG6wuzo0JS-vZTBwHI3pGB8svCrsedC",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 850,
            "type": "MAG-7",
            "skinName": "Hard Water",
            "rarity": "milspec",
            "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7uifDhh3szFcDoV09-3gZOfnvTLP7LWnn8fuZYiiOvH9NXz21ey80FuYz_7cdSQdwM4NVyE_1Xvxujp1sC975ScyWwj5HeAY-I7KQ",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 851,
            "type": "Tec-9",
            "skinName": "Cut Out",
            "rarity": "milspec",
            "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhhwszcdD4b09--lYyAqOf1J6_UhGVu5Mx2gv2P8Nyh2gGw-xJpZTqiIdeXcAI-M1_R_li7kOu605Tu75mYn3I2syMh5GGdwULq_VC6dg",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 852,
            "type": "M4A1-S",
            "skinName": "Briefing",
            "rarity": "milspec",
            "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITck39D4dF0mOj--YXygED6rhBlMGylLIDBdAE2aVzQ-FS_yLy6gsTouZybwXZquSUnsy2Llhbi1AYMMLKLissC3Q",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 853,
            "type": "USP-S",
            "skinName": "Blueprint",
            "rarity": "milspec",
            "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh-TLMbfEk3tD4ctlteXI8oThxlHg-kppY2D7dtSWIwc-ZA3W_1W7le3t1pLou5_BwXo1vCchtyvamRSpwUYbl4sQs20",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 854,
            "type": "P2000",
            "skinName": "Woodsman",
            "rarity": "restricted",
            "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zLZAJSvozmxL-DgvngNqnummJW4NE_377HoYn03Vax_xVlMTygcYDEcVQ5YF3S-wC9xu67jMfq7pmYmyBi7D5iuyhbjmQOcg",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 855,
            "type": "P90",
            "skinName": "Death Grip",
            "rarity": "restricted",
            "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FA957OORIQJA7c6zlo-FkuTLMbfEk1Rd4cJ5nqfCrNytjAKyqEU4ZmqgdoTDdgc4aQnW_gO3kO3t0JLuus_MzXVq7HMq-z-DyDp1RLqf",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 856,
            "type": "SSG 08",
            "skinName": "Death's Head",
            "rarity": "restricted",
            "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3Yi5FvISJkIWKg__nO77QklRd4cJ5nqeWrdqi3la3_hU_Nm73ddCQcw9vMwyDqQDrxbruhJ-7vpqaynth7HF0-z-DyAzfVpYm",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 857,
            "type": "P250",
            "skinName": "Red Rock",
            "rarity": "restricted",
            "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhjxszYI2gS092unY-GqPv9NLPF2GoI6pYlj7nArN_xilW18xU9ZWmnctLHcg4-aVrXqFi_yOfsjcK16pvXiSw0GYfq61U",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 858,
            "type": "AK-47",
            "skinName": "Orbit Mk01",
            "rarity": "restricted",
            "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhnwMzJegJB49C5mpnbxsjmNr_ummJW4NE_iL-ZrYj03wLl_hFqNm71cteWdlA5Zl2F-FG-yO_r0cW4uMnMynFl6T5iuyjnxSwaOw",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 859,
            "type": "Galil AR",
            "skinName": "Sugar Rush",
            "rarity": "classified",
            "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbupIgthwczLZAJF7dC_mL-IlvnwKrjZl2RC18l4jeHVu9uliwWwqRJqMGuncY-cdFNtZ17Wq1O4wbzphZLvu5vJnHJi6HIg5SvD30vgL7LkLAY",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 860,
            "type": "Dual Berettas",
            "skinName": "Cobra Strike",
            "rarity": "classified",
            "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJf1OD3dShD4N6zhoWfg_bnDLjelHlQ18l4jeHVu9z22gHj_UFvZz36IdXHcwQ-aVGE8wfqkLrrgsK96pqcnCZk7CUktnfD30vg2qddNKU",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 861,
            "type": "M4A4",
            "skinName": "Hellfire",
            "rarity": "classified",
            "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09SzmIyNnuXxDLfYkWNFpsEi3L6UrdiljFXlr0VsNmj6dteXdFBtYFnV-VjryO3qhMe86c7BwHB9-n51JK1M_qQ",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 862,
            "type": "Five-SeveN",
            "skinName": "Hyper Beast",
            "rarity": "covert",
            "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTj5X09q_goWYkuHxPYTZj3tU-sd0i_rVyoD8j1yg5RduNj_yLNSQdVQ-M1DS-1e8xbvrh56_vMiczSFnvXUg4X6IyxGzhh5SLrs4rcs7-T4",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 863,
            "type": "AWP",
            "skinName": "Oni Taiji",
            "rarity": "covert",
            "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJK7dK4jYG0m_7zO6-fk28C65V0ibnEoon00AHj80Jla2qlI9fHIwNqYl3YqVO4wb3pgpK17oOJlyWSYujjQg",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 864,
            "type": "★ Bayonet",
            "skinName": "Autotronic",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_gs_bayonet_autotronic_light_large.4b7f809f4ee434dff8f270b041100012f39c5ebe.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 865,
            "type": "★ Bayonet",
            "skinName": "Lore",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_cu_bayonet_lore_light_large.372c7e0ec654f3be5d53e87cbbac3ab160c8c76e.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
    }, {
            "id": 866,
            "type": "★ Bayonet",
            "skinName": "Black Laminate",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_cu_bayonet_stonewash_light_large.0f931ca831c405927983d5b2ca3120aa9363d7d3.png",
            "can": {
                "buy": true,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": true,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 867,
            "type": "★ Bayonet",
            "skinName": "Bright Water",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_hy_ocean_knife_light_large.d262ade9c249afcfbeeacf19deef49ccb0049c1a.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 868,
            "type": "★ Bayonet",
            "skinName": "Freehand",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_am_marked_up_light_large.c2a4dbca9338c1a5ffaa246715696f92168a49bc.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 869,
            "type": "★ Bayonet",
            "skinName": "Marble Fade",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_am_marble_fade_light_large.adc286f39c98a9630620a97831ca2e5050229dff.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 870,
            "type": "★ Bayonet",
            "skinName": "Ultraviolet",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_so_purple_light_large.c7f08cb18f5cc792a27e186ee630614b93c35200.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 871,
            "type": "★ Bayonet",
            "skinName": "Tiger Tooth",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_an_tiger_orange_light_large.780ff3a58d01a73d4d7d755adbdca46483d13faf.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 872,
            "type": "★ Bayonet",
            "skinName": "Damascus Steel",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_aq_damascus_light_large.bd2b3b3fcd70fdec736a782fa5108ea9286d86a8.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 873,
            "type": "★ Bayonet",
            "skinName": "Rust Coat",
            "rarity": "rare",
            "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJYAJR-NmzmL-Amf7yNoTZk2pH8fp9i_vG8MLx2wTs-RU5YmmhIoaUdQ49NV3Q8li-wLzthZ7utMjNwSRjuSJw53ragVXp1ir4a_TV",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 874,
            "type": "★ Bayonet",
            "skinName": "Urban Masked",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_sp_tape_urban_light_large.81c4d2a06c2d8c271a2b6de4bc47f0cb0d3f32be.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 875,
            "type": "★ Bayonet",
            "skinName": "Fade",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_aa_fade_light_large.5ac4f422043b48b47e4453cc250c79fda3e78855.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 876,
            "type": "★ Bayonet",
            "skinName": "Slaughter",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_am_zebra_light_large.2234064362204e87ea5ce3f997dc691d844d9168.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 877,
            "type": "★ Bayonet",
            "skinName": "Blue Steel",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_aq_blued_light_large.40905736c36dbdb9d08077ddaebb06cbb237f583.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 878,
            "type": "★ Bayonet",
            "skinName": "Crimson Web",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_hy_webs_light_large.9246001fd8c8b0c077dc2836ea7271a4a020750b.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 879,
            "type": "★ Bayonet",
            "skinName": "Case Hardened",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_aq_oiled_light_large.920866e2a1f17fda7702e0b4cb95f45a8a8c0070.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 880,
            "type": "★ Bayonet",
            "skinName": "Stained",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_aq_forced_light_large.460998cd194f90f65aec10ccaea8644b42430fc0.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 881,
            "type": "★ Bayonet",
            "skinName": "Night",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_so_night_light_large.11b2117af2e0f240111305857ab93e0091e347ed.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 882,
            "type": "★ Bayonet",
            "skinName": "Forest DDPAT",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_hy_ddpat_light_large.f53cb47d0ef8b431116008ec3896f8cedb712fb5.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 883,
            "type": "★ Bayonet",
            "skinName": "Boreal Forest",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_hy_forest_boreal_light_large.4ecbfdb740d7345cb38430c1a4da15cec468b5ce.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 884,
            "type": "★ Bayonet",
            "skinName": "Scorched",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_sp_dapple_light_large.5c6962d79b65eb2053770a887facae88b361fcfe.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 885,
            "type": "★ Bayonet",
            "skinName": "Safari Mesh",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_bayonet_sp_mesh_tan_light_large.f0c1b71fd210b74b42dbf78253556e7ba9a99d15.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 886,
            "type": "★ Bowie Knife",
            "skinName": "Marble Fade",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_survival_bowie_am_marble_fade_light_large.ee64f39331b11b42f6ef7e00f570bc0da09cf0ee.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 887,
            "type": "★ Bowie Knife",
            "skinName": "Doppler",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_survival_bowie_am_doppler_phase2_light_large.7a45d59ff8f1e6ac362d26a044b5628b53935d35.png",
            patternChance: 20,
            patterns: [
                {
                    img: 'Phases/Bowie-Doppler/p1.webp',
                    chance: 50
    }, {
                    img: 'Phases/Bowie-Doppler/p2.webp',
                    chance: 50
    }, {
                    img: 'Phases/Bowie-Doppler/p3.webp',
                    chance: 50
    }, {
                    img: 'Phases/Bowie-Doppler/p4.webp',
                    chance: 50
    }, {
                    img: 'Phases/Bowie-Doppler/p4.webp',
                    chance: 50
    }, {
                    img: 'Phases/Bowie-Doppler/ruby.webp',
                    chance: 10
    }, {
                    img: 'Phases/Bowie-Doppler/sapphire.webp',
                    chance: 10
    }, {
                    img: 'Phases/Bowie-Doppler/black-pearl.webp',
                    chance: 5
    }
    ],
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
            "id": 888,
            "type": "★ Bowie Knife",
            "skinName": "Tiger Tooth",
            "rarity": "rare",
            "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_survival_bowie_an_tiger_orange_light_large.a8cf2f4214c950f59798f15d0013f7a33e6972fa.png",
            "can": {
                "buy": false,
                "sell": true,
                "trade": true,
                "contract": true,
                "bot": true,
                "stattrak": true,
                "souvenir": false,
                "inCase": true,
                "specialCase": true
            }
}, {
    "id": 889,
    "type": "★ Bowie Knife",
    "skinName": "Fade",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_survival_bowie_aa_fade_light_large.fd85e3d9fbd875ca2551b3758f5374e33d167fbf.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 890,
    "type": "★ Bowie Knife",
    "skinName": "Crimson Web",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_survival_bowie_hy_webs_light_large.d03e755f33f66df9ee9d8b1cf50b633ff458978b.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 891,
    "type": "★ Bowie Knife",
    "skinName": "Safari Mesh",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_survival_bowie_sp_mesh_tan_light_large.360aa198bded3bec8d3c051bd1d6dc7270b3b91f.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 892,
    "type": "★ Butterfly Knife",
    "skinName": "Doppler",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_butterfly_am_doppler_phase2_b_light_large.13ae18aef1c12378596266b5dc03647d7eee1345.png",
    "can": {
        "buy": false,
        "souvenir": false,
    },
    patternChance: 20,
    patterns: [
        {
            img: 'Phases/Butterfly-Doppler/p1.webp',
            chance: 50
        }, {
            img: 'Phases/Butterfly-Doppler/p2.webp',
            chance: 50
        }, {
            img: 'Phases/Butterfly-Doppler/p3.webp',
            chance: 50
        }, {
            img: 'Phases/Butterfly-Doppler/p4.webp',
            chance: 50
        }, {
            img: 'Phases/Butterfly-Doppler/ruby.webp',
            chance: 20
        }, {
            img: 'Phases/Butterfly-Doppler/sapphire.webp',
            chance: 10
        }, {
            img: 'Phases/Butterfly-Doppler/black-pearl.webp',
            chance: 5
        },
    ]
}, {
    "id": 893,
    "type": "★ Butterfly Knife",
    "skinName": "Marble Fade",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_butterfly_am_marble_fade_light_large.c9170bcb854e5d3ed0f3a22bae8a4513fd46954a.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 894,
    "type": "★ Butterfly Knife",
    "skinName": "Tiger Tooth",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_butterfly_an_tiger_orange_light_large.2fece0b06a84ce2bb6e15e7cd3a37f400f218940.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 895,
    "type": "★ Butterfly Knife",
    "skinName": "Blue Steel",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_butterfly_aq_blued_light_large.969518ce760404d72095af853f90df7582e7889f.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 896,
    "type": "★ Butterfly Knife",
    "skinName": "Boreal Forest",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_butterfly_hy_forest_boreal_light_large.f817483d1e53b69919a8a11349b075c27d8829b1.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 897,
    "type": "★ Butterfly Knife",
    "skinName": "Safari Mesh",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_butterfly_sp_mesh_tan_light_large.9c30ece5beb38356f406e5c5fa56e7f4056f0757.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 898,
    "type": "★ Falchion Knife",
    "skinName": "Fade",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_falchion_aa_fade_light_large.1db6bc12f4b49677b330382c3e5af21f46d0c124.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 899,
    "type": "★ Falchion Knife",
    "skinName": "Slaughter",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_falchion_am_zebra_light_large.3cbce2191d2a20b88e610d8180c2f4a9ee0066ca.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 900,
    "type": "★ Falchion Knife",
    "skinName": "Crimson Web",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_falchion_hy_webs_light_large.9c355c7819b8fd993b543bceec976e798e6e8633.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 901,
    "type": "★ Falchion Knife",
    "skinName": "Case Hardened",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_falchion_aq_oiled_light_large.ddcd8f4a87e08ab50fe3241e6791896125c48e03.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 902,
    "type": "★ Falchion Knife",
    "skinName": "Boreal Forest",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_falchion_hy_forest_boreal_light_large.9bf4abd73deee0ae82ce0a8670e1056d3a546107.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 903,
    "type": "★ Falchion Knife",
    "skinName": "Blue Steel",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_falchion_aq_blued_light_large.ead09a065b115e707a59aa49689af0ed3dd8d1f3.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 904,
    "type": "★ Falchion Knife",
    "skinName": "Forest DDPAT",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_falchion_hy_ddpat_light_large.3b2857b99bb2aa1b1337248d8a1ae24aae1bf450.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 905,
    "type": "★ Falchion Knife",
    "skinName": "Scorched",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_falchion_sp_dapple_light_large.072bd4143a0c769f2d78835eaee88de49c849bd3.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 906,
    "type": "★ Falchion Knife",
    "skinName": "Safari Mesh",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_falchion_sp_mesh_tan_light_large.eccb7999f574f5e1080dfef159c3903c4e6db0de.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 907,
    "type": "★ Gut Knife",
    "skinName": "Black Laminate",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_gut_cu_gut_stonewash_light_large.52a1c223ee5d85ddb2242c75a67c1f2f49b0e0b9.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": true,
        "inCase": false,
        "specialCase": true
    }
}, {
    "id": 908,
    "type": "★ Gut Knife",
    "skinName": "Autotronic",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_gut_gs_gut_autotronic_light_large.160e79d868da6ebb84c52e835aaf24ab9c6334f1.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 909,
    "type": "★ Gut Knife",
    "skinName": "Lore",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_gut_cu_gut_lore_light_large.5cf5a77978675bd3d276a86017e6d1fcacd7bf00.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 910,
    "type": "★ Gut Knife",
    "skinName": "Gamma Doppler",
    "rarity": "rare",
    "img": "Phases/Gut-Gamma-Doppler/p1.webp",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    },
    patternChance: 20,
    patterns: [
        {
            img: 'Phases/Gut-Gamma-Doppler/p1.webp',
            chance: 50
        },{
            img: 'Phases/Gut-Gamma-Doppler/p2.webp',
            chance: 50
        },{
            img: 'Phases/Gut-Gamma-Doppler/p3.webp',
            chance: 50
        },{
            img: 'Phases/Gut-Gamma-Doppler/p4.webp',
            chance: 50
        },{
            img: 'Phases/Gut-Gamma-Doppler/emerald.webp',
            chance: 10
        },
    ]
}, {
    "id": 911,
    "type": "★ Gut Knife",
    "skinName": "Bright Water",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_gut_hy_ocean_knife_light_large.649f890d55e6ee2987e988e44a0f52e1a5020486.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 912,
    "type": "★ Gut Knife",
    "skinName": "Freehand",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_gut_am_marked_up_light_large.08dac4cfbf7b626df37bb2b6ffd3d07d2fc86988.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 913,
    "type": "★ Gut Knife",
    "skinName": "Marble Fade",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_gut_am_marble_fade_light_large.85f1cad22ba4e6716045d53e9e0cf5459760d152.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 914,
    "type": "★ Gut Knife",
    "skinName": "Rust Coat",
    "rarity": "rare",
    "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjxT08-ikYWHqPz6Or3UqWNU6dNoteXA54vwxgDlrxdtZjr3J4GXdQI4aA6DrgO_kLzvhp6-vczAyyA36ykk5XeLn0epwUYbYI3sIZ8",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 915,
    "type": "★ Gut Knife",
    "skinName": "Ultraviolet",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_gut_so_purple_light_large.dbe6989416501166c43bd1cfb18ee835dbfa0ac7.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 916,
    "type": "★ Gut Knife",
    "skinName": "Damascus Steel",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_gut_aq_damascus_light_large.9eaf9c050c3f5dfe5c647d361538a1ea7001f835.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 917,
    "type": "★ Gut Knife",
    "skinName": "Safari Mesh",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_gut_sp_mesh_tan_light_large.5f58d777d76148ba031b587fff1b0b3465d2c441.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 918,
    "type": "★ Gut Knife",
    "skinName": "Forest DDPAT",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_gut_hy_ddpat_light_large.855f6ca62686c8f365e503d379b07b4c41a8658a.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 919,
    "type": "★ Gut Knife",
    "skinName": "Stained",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_gut_aq_forced_light_large.3f5b057c710fc4403f54d3979f482f511eb69d8b.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 920,
    "type": "★ Gut Knife",
    "skinName": "Scorched",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_gut_sp_dapple_light_large.657af646f54600080b5c5e79133410eb47397fd6.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 921,
    "type": "★ Gut Knife",
    "skinName": "Urban Masked",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_gut_sp_tape_urban_light_large.71f4811888602d3b48f35e030bd39ecbcac7f22e.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 922,
    "type": "★ Gut Knife",
    "skinName": "Boreal Forest",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_gut_hy_forest_boreal_light_large.b28a4cfb134cd8be5da39f82db0df407577478e8.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 923,
    "type": "★ Huntsman Knife",
    "skinName": "Marble Fade",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_tactical_am_marble_fade_light_large.3efc76764c1aa62477fee4b4df1a380b115f5103.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 924,
    "type": "★ Huntsman Knife",
    "skinName": "Doppler",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_tactical_am_doppler_phase2_light_large.8b1857e53cdda632984e78da3198148f979ba750.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    },
    patternChance: 20,
    patterns: [
        {
            img: 'Phases/Huntsman-Doppler/p1.webp',
            chance: 50
        }, {
            img: 'Phases/Huntsman-Doppler/p2.webp',
            chance: 50
        }, {
            img: 'Phases/Huntsman-Doppler/p3.webp',
            chance: 50
        }, {
            img: 'Phases/Huntsman-Doppler/p4.webp',
            chance: 50
        }, {
            img: 'Phases/Huntsman-Doppler/ruby.webp',
            chance: 20
        }, {
            img: 'Phases/Huntsman-Doppler/sapphire.webp',
            chance: 10
        }, {
            img: 'Phases/Huntsman-Doppler/black-pearl.webp',
            chance: 5
        }, 
    ]
}, {
    "id": 925,
    "type": "★ Huntsman Knife",
    "skinName": "Tiger Tooth",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_tactical_an_tiger_orange_light_large.961c75c287d5cba0859ef13ed8eb638d707b1129.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 926,
    "type": "★ Huntsman Knife",
    "skinName": "Stained",
    "rarity": "rare",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_tactical_aq_forced_light_large.ba0ab23cf7421f130454b3e1816eb3302b588712.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}, {
    "id": 927,
    "type": "★ Huntsman Knife",
    "skinName": "Urban Masked",
    "rarity": "covert",
    "img": "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_tactical_sp_tape_urban_light_large.b1741a783b7017d5bf191ec9ab8f3a5427718294.png",
    "can": {
        "buy": false,
        "sell": true,
        "trade": true,
        "contract": true,
        "bot": true,
        "stattrak": true,
        "souvenir": false,
        "inCase": true,
        "specialCase": true
    }
}
    ],

    /* ===== STICKERS ===== */
    stickers: [
        {
        item_id: 0,
        name: "Skull Troop",
        rarity: 'high',
        img: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYQkrFeOesx9zGX1g7Ng9CurajPhNy3PzHYQJO7c6xkc7fwvagMr-DwTIB7Z0g3bjA9Nrz3ATj_RI6Y26hJI6RdQ82Zl2B_lC8366x0gyLUcSS'
    }, {
        item_id: 1,
        name: 'Bombsquad',
        rarity: 'high',
        img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYQkrFeOesx9zGX1g7IApRo4WnJApiwOLdcDl94N2kk4XFkfKmNr-Izz4C68B1ieyS9NuijFGyr0s-ZjymJNfBIFA2NV6B_FLqlfCv28HBhzn9xA/360fx360f'
    }, {
        item_id: 2,
        name: 'Unicorn (Holo)',
        rarity: 'remarkable',
        img: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYQkrFeOesx9zGX1g7MApetbW3JTho3P_HTjFD_tuz2oaNwK_3ZeqIwj0FusEn3OuX89-j0Q3lrkM-N2HzLYGVJgRqYwnRqwWggbC42qqHM58'
    }],
    
    /* ===== GRAFFITI ===== */
    graffiti: [
    {
        item_id: 0,
        name: 'Rage Mode',
        rarity: 'consumer',
        img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XxFfZIGnCfhr92MQQ',
        colors: [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XxFfZIGnCfhr92MQQ",
            "name": "Battle Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XwQJJ1ayybIdwjwZg",
            "name": "Bazooka Pink"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XwQdJ8GnXAiAu6ebw",
            "name": "Blood Red"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XxKcp9WnSAZqTUUGw",
            "name": "Brick Red"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XwTc8hWyCHGj2C0OA",
            "name": "Cash Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XwTIJNRmnDWssAxKg",
            "name": "Desert Amber"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XxKI5wGnHAgNuVI9Q",
            "name": "Dust Brown"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XxGfZMEkSSz8wFt8A",
            "name": "Frog Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XxGdJwDnXVccibwCg",
            "name": "Jungle Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XxGIJwEyC2TQhMTnw",
            "name": "Monarch Blue"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XxEIJ8EkHLuR6a6Kw",
            "name": "Monster Purple"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XxLIZ5UnnUlo9Zlxw",
            "name": "Princess Pink"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XxGJp4AkCz1pX4HMw",
            "name": "SWAT Blue"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XwRdMhTyiWCR1lnRw",
            "name": "Shark White"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XwQfZxTnSypvt4J2g",
            "name": "Tiger Orange"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XwWcchbnHYu-drGJQ",
            "name": "Tracer Yellow"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XwTI5JQzXKbwQu5Sg",
            "name": "Violent Violet"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XwXccgBzSEM9fk65w",
            "name": "War Pig Pink"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPSEEEvycTL7IyDLG1smRLBfZDvRr2ejs7iWRTDJF-h4FQpQKKsC8GZLaZ-IbBA-hYUJrjbvxAptEBFuccpKfx2233gHOK0p0XxEJ8pXyyZ5_-lEUA",
            "name": "Wire Blue"
            }]
        }, {
        item_id: 1,
        name: 'Ninja',
        rarity: 'consumer',
        img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPcpNbzSHzK9A71Go',
        colors: [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPcpNbzSHzK9A71Go",
            "name": "Battle Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPJ8pUkXbyvAL_lmw",
            "name": "Bazooka Pink"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPJ5pWzSCkPqRFLYg",
            "name": "Blood Red"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPfZxWnSD0TwGqBEY",
            "name": "Brick Red"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPJJ0BnXX1rGaAdcc",
            "name": "Cash Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPJM5amiekLeroQJw",
            "name": "Desert Amber"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPfc1VzSGk8fDtciI",
            "name": "Dust Brown"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPcZNazyzwlSekDXg",
            "name": "Frog Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPcZpVyCCh0w7kunI",
            "name": "Jungle Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPcc5Vz3X5gD8rvb0",
            "name": "Monarch Blue"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPc85Wzy2mN1EAAT4",
            "name": "Monster Purple"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPfM9XnyOh_ZP0vjU",
            "name": "Princess Pink"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPcchXyy34p0whTZ4",
            "name": "SWAT Blue"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPJpoBmHfxCs0IJW4",
            "name": "Shark White"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPJ5NVmCD45JB5FyY",
            "name": "Tiger Orange"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPIZ8BkCGiCt8b4pY",
            "name": "Tracer Yellow"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPJM1bm3CmeFRuEYY",
            "name": "Violent Violet"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPIJ8BynD1N4-33VA",
            "name": "War Pig Pink"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3r-Zj3FEC3YDlltU-UKN2rd9zSj4-_FFm3JFOskFw9SdfRR9WBKaJyNOhdpgdIP8me8xBMzDhgvNMZJfACpx2EfJbQ1xDhPc8kDnHbyO1h_IY4",
            "name": "Wire Blue"
            }]
            }, {
        item_id: 2,
        name: 'Backstab',
        rarity: 'consumer',
        img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0Cn3Lp2NgFxaoPRJiw',
        colors: [
            {
                img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0Cn3Lp2NgFxaoPRJiw',
                name: 'Battle Green'
                },
            {
                img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0Cmid5LR111VKpPdbw',
                name: 'Bazooka Pink'
                },
            {
                img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0CmiJ5CNgQsAkNxHlQ',
                name: 'Blood Red'
                },
            {
                img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0Cn4IZDdgVubnDgRIw',
                name: 'Brick Red'
                },
            {
                img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0CmhIMfd1FpGu7Ks7g',
                name: 'Cash Green'
                },
            {
                img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0Cmhc5zahguCVA5xkA',
                name: 'Desert Amber'
                },
            {
                img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0Cn4cJONgAt3X9T0YA',
                name: 'Dust Brown'
                },
            {
                img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0Cn0LpyPjV9-nMa6ng',
                name: 'Jungle Green'
                },
            {
                img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0Cn0J5OIgQ79JG3Bgg',
                name: 'Frog Green'
                },
            {
                img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0Cn0c5OP1FbKr0cR0g',
                name: 'Monarch Blue'
                },
            {
                img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0Cn2c5CPjAlcFnsWng',
                name: 'Monster Purple'
                },
            {
                img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0Cn5cpHfgg5vuD7X4w',
                name: 'Princess Pink'
                },
            {
                img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0Cn0dZGLjFep2Vjkuw',
                name: 'SWAT Blue'
                },
            {
                img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0CmjJ8fY1l7kGupsUg',
                name: 'Shark White'
                },
            {
                img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0CmiLpPYgVe8_-f9Iw',
                name: 'Tiger Orange'
                },
            {
                img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0CmkIsfQgA2iEPfKvg',
                name: 'Tracer Yellow'
                },
            {
                img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0CmhcJ3b0QklFpuqDA',
                name: 'Violent Violet'
                },
            {
                img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0CmlIseK0VqUcByDSw',
                name: 'War Pig Pink'
                },
            {
                img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv1fSPQKjPfEEdXEeIcYj3HrDbz5r6UFzycFeF_FQhVfaQH8TVJNcyPbEA71tUJ_zy8wUd4SUJ8cYtWfgj9yXsfPq8o3S0GLNsO0Cn2dMXc112AEssmqQ',
                name: 'Wire Blue'
                }
            ]
        }, {
        item_id: 3,
        name: 'GTG',
        rarity: 'consumer',
        img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1OZuV8zHRB8FM1hC4',
        colors: [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1OZuV8zHRB8FM1hC4",
            "name": "Battle Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1OM7xzkCNAyg0hgsg",
            "name": "Bazooka Pink"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1OM-xxzHUWLF4P_t8",
            "name": "Blood Red"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1OaepxnHVGfOlrSkQ",
            "name": "Brick Red"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1OMOsmnCBHnCdGaTk",
            "name": "Cash Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1OMLh9m3IWPEvBWgw",
            "name": "Desert Amber"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1OabtyzHQWxNGrkMc",
            "name": "Dust Brown"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1OZeV9znlCDUcFyfg",
            "name": "Frog Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1OZexyyXUT8wk4Wxs",
            "name": "Jungle Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1OZbhyziBLUt6iVag",
            "name": "Monarch Blue"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1OZ7hxzngUdrnCQzM",
            "name": "Monster Purple"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1OaLlwnnYTin6pSPc",
            "name": "Princess Pink"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1OZb5wynhKVCD9woc",
            "name": "SWAT Blue"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1OMuwmmSJDhXcbq_s",
            "name": "Shark White"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1OM-VymXVKN9E9-jU",
            "name": "Tiger Orange"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1ONekmkXQQG7T6oP8",
            "name": "Tracer Yellow"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1OMLt8miUU92snsk0",
            "name": "Violent Violet"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1ONOkmyyVHl-Nm2wQ",
            "name": "War Pig Pink"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pvaKI3j2ejDBYSXdTVtqSLdfNWDR-DGi5-WQSz7PRrkvSlwELqdXpjZOOJuOOhY_gIMVu2u_0UdyEhk6f9BKZAarxm1OZ78knSNAaRNlZGo",
            "name": "Wire Blue"
            }]
        }, {
        item_id: 4,
        name: 'Quickdraw',
        rarity: 'consumer',
        img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XxFfZIGnCdrVyUsAg',
        colors: [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XxFfZIGnCdrVyUsAg",
            "name": "Battle Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XwQJJ1ayyaIUYxkQQ",
            "name": "Bazooka Pink"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XwQdJ8GnXDmkZ4HdQ",
            "name": "Blood Red"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XxKcp9WnSDtWWQHig",
            "name": "Brick Red"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XwTc8hWyCEcmRmigQ",
            "name": "Cash Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XwTIJNRmnAH0wvrRA",
            "name": "Desert Amber"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XxKI5wGnHAFsI_t0g",
            "name": "Dust Brown"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XxGfZMEkSRxXPtDCQ",
            "name": "Frog Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XxGdJwDnXWdYXyziA",
            "name": "Jungle Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XxGIJwEyC1KJBK1qQ",
            "name": "Monarch Blue"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XxEIJ8EkHLHcmW-8w",
            "name": "Monster Purple"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XxLIZ5UnnW6N5PMBg",
            "name": "Princess Pink"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XxGJp4AkCz2ZjWTKg",
            "name": "SWAT Blue"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XwRdMhTyiXAG4d1zA",
            "name": "Shark White"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XwQfZxTnSxNFlPzww",
            "name": "Tiger Orange"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XwWcchbnHbkKCXQdw",
            "name": "Tracer Yellow"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XwTI5JQzXL93uIg8w",
            "name": "Violent Violet"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XwXccgBzSEYmGdIyA",
            "name": "War Pig Pink"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pveDD3n4YzL7IyDLG1smGedeNWGP-Gfx5bjCQ2rMQrksEQgMf_AAp2dBbJuPahFp1oJe_z25lAptEBFuccpKfx2233gHOK0p0XxEJ8pXyyaAltL43A",
            "name": "Wire Blue"
            }]
        }, {
        item_id: 5,
        name: 'Speechless',
        rarity: 'consumer',
        img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblCP4L8DchhRdG5D2',
        colors: [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblCP4L8DchhRdG5D2",
            "name": "Battle Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblHahIJyLhzrL-6TS",
            "name": "Bazooka Pink"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblHbxIsDd0abvbZfR",
            "name": "Blood Red"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblCz3IpDdgc5fsBdW",
            "name": "Brick Red"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblHX2dZCIgK0VU3kF",
            "name": "Cash Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblHWlLpfa0Zct5q64",
            "name": "Desert Amber"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblCymIcDc0Wtl37Ae",
            "name": "Dust Brown"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblCD4LsLRhUDqrYk4",
            "name": "Frog Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblCDxIcXd1HpOZwiT",
            "name": "Jungle Green"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblCClIcKIjKhzLyMv",
            "name": "Monarch Blue"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblCKlIsLQ0_7ZsIW9",
            "name": "Monster Purple"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblC2kI5Le1CZu_T5n",
            "name": "Princess Pink"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblCCjI8bQjR5RqNZw",
            "name": "SWAT Blue"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblHfxdZWKhO0bWixb",
            "name": "Shark White"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblHb4IZXdjf_T30ya",
            "name": "Tiger Orange"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblHD0dZ3c11CPxn5D",
            "name": "Tracer Yellow"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblHWmL5aN0-3_7kWK",
            "name": "Violent Violet"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblHH0dceNgH6LkAI2",
            "name": "War Pig Pink"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3blaT7KIyTKD2FkHPEJYHbR_2ej5-zAF27KR7x9QVhXL6tQoWdMOsiOPxM81o8C_GHtwkd-HEMqPNVId0m4xXgcI7AwxDUbNccblCKid5GLh95OKdzj",
            "name": "Wire Blue"
            }]
        }, {
        item_id: 6,
        name: 'Eye Spy',
        rarity: 'consumer',
        img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lXZKfM9XmpfmazzN',
        colors: [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lXZKfM9XmpfmazzN",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lSMTc5MAm8PBxYJu",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lSNDcc9WzUvkYn3v",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lXlFcZ9WnX4uleDm",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lSBEJp8DnNLYQnuD",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lSAXfZhRzUXpu3bq",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lXkUcs9XzYdh5dZP",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lXVKfc1ama4ZSAeY",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lXVDcspWyLUI7YDg",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lXUXcs0DkLh5VPD5",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lXcXcc1bz2q03haL",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lXgWcJ1VyE-NupAV",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lXURcMlbkdsVdt94",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lSJDJpoBmM605n2q",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lSNKcppWkTSy2Xaa",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lSVGJpJXy7xPGcps",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lSAUfJkGzxg8xg19",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lSRGJsgGnOOe2-tk",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pPuIHnX7ZAjILjPeGRBsTuZYN2iM-mHwt7-cFjvOQOB4EloAfaRX8DcdPsjdaRBohoADr2fg2VRzGVArfclJYgKuxmAaIbE8lXcQJJ4Am4ZGnK77",
            "name": "Wire Blue"
        }]
        }, {
        item_id: 7,
        name: 'Mr. Teeth',
        rarity: 'consumer',
        img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3z2eCfdEC3YDlltU7QIMWiK_Was7O-dRT_AQ-5-EAlRePQFoWIYb53YOBNr1dVZ_zG-wxYzDhgvNMZJfACpx2EfJbQ1xDhPcpNbzSHzquz-u68',
        colors: [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3z2eCfdEC3YDlltU7QIMWiK_Was7O-dRT_AQ-5-EAlRePQFoWIYb53YOBNr1dVZ_zG-wxYzDhgvNMZJfACpx2EfJbQ1xDhPcpNbzSHzquz-u68",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3z2eCfdEC3YDlltU7QIMWiK_Was7O-dRT_AQ-5-EAlRePQFoWIYb53YOBNr1dVZ_zG-wxYzDhgvNMZJfACpx2EfJbQ1xDhPJ8pUkXbyBXpztNg",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3z2eCfdEC3YDlltU7QIMWiK_Was7O-dRT_AQ-5-EAlRePQFoWIYb53YOBNr1dVZ_zG-wxYzDhgvNMZJfACpx2EfJbQ1xDhPJ5pWzSCkD50CxXo",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3z2eCfdEC3YDlltU7QIMWiK_Was7O-dRT_AQ-5-EAlRePQFoWIYb53YOBNr1dVZ_zG-wxYzDhgvNMZJfACpx2EfJbQ1xDhPfZxWnSD0DbPQhMQ",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3z2eCfdEC3YDlltU7QIMWiK_Was7O-dRT_AQ-5-EAlRePQFoWIYb53YOBNr1dVZ_zG-wxYzDhgvNMZJfACpx2EfJbQ1xDhPJJ0BnXX1aGMRaFs",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3z2eCfdEC3YDlltU7QIMWiK_Was7O-dRT_AQ-5-EAlRePQFoWIYb53YOBNr1dVZ_zG-wxYzDhgvNMZJfACpx2EfJbQ1xDhPJM5amiek9QfSbwA",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3z2eCfdEC3YDlltU7QIMWiK_Was7O-dRT_AQ-5-EAlRePQFoWIYb53YOBNr1dVZ_zG-wxYzDhgvNMZJfACpx2EfJbQ1xDhPfc1VzSGkTbw1LBQ",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3z2eCfdEC3YDlltU7QIMWiK_Was7O-dRT_AQ-5-EAlRePQFoWIYb53YOBNr1dVZ_zG-wxYzDhgvNMZJfACpx2EfJbQ1xDhPcZNazyzwov1uSRQ",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3z2eCfdEC3YDlltU7QIMWiK_Was7O-dRT_AQ-5-EAlRePQFoWIYb53YOBNr1dVZ_zG-wxYzDhgvNMZJfACpx2EfJbQ1xDhPcZpVyCChgUbZJ9Q",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3z2eCfdEC3YDlltU7QIMWiK_Was7O-dRT_AQ-5-EAlRePQFoWIYb53YOBNr1dVZ_zG-wxYzDhgvNMZJfACpx2EfJbQ1xDhPfM9XnyOhMZnSj1w",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3z2eCfdEC3YDlltU7QIMWiK_Was7O-dRT_AQ-5-EAlRePQFoWIYb53YOBNr1dVZ_zG-wxYzDhgvNMZJfACpx2EfJbQ1xDhPJ5NVmCD47Fb1bII",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3z2eCfdEC3YDlltU7QIMWiK_Was7O-dRT_AQ-5-EAlRePQFoWIYb53YOBNr1dVZ_zG-wxYzDhgvNMZJfACpx2EfJbQ1xDhPIZ8BkCGiQLp4-S0",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3z2eCfdEC3YDlltU7QIMWiK_Was7O-dRT_AQ-5-EAlRePQFoWIYb53YOBNr1dVZ_zG-wxYzDhgvNMZJfACpx2EfJbQ1xDhPIJ8BynD1p9yrBh4",
            "name": "War Pig Pink"
        }]
        }, {
        item_id: 7,
        name: 'Bling',
        rarity: 'consumer',
        img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-eOF3j2azL7Ky7VEF96Iu8Pdz-M4Gek7bvCFzqYQbktSw0ELqVVpmNJPJ2LP0Y81NYLrz3slhV5R0R5K5wIYAG8jHccPbI3xTQeMcISxW39IZzQ0Vphcel84xI',
        colors: [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-eOF3j2azL7Ky7VEF96Iu8Pdz-M4Gek7bvCFzqYQbktSw0ELqVVpmNJPJ2LP0Y81NYLrz3slhV5R0R5K5wIYAG8jHccPbI3xTQeMcISxW39IZzQ0Vphcel84xI",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-eOF3j2azL7Ky7VEF96Iu8Pdz-M4Gek7bvCFzqYQbktSw0ELqVVpmNJPJ2LP0Y81NYLrz3slhV5R0R5K5wIYAG8jHccPbI3xTQeMcISxW39dJXd0Vs2vHOqHaU",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-eOF3j2azL7Ky7VEF96Iu8Pdz-M4Gek7bvCFzqYQbktSw0ELqVVpmNJPJ2LP0Y81NYLrz3slhV5R0R5K5wIYAG8jHccPbI3xTQeMcISxW39d5KKgQ5n5InvgYw",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-eOF3j2azL7Ky7VEF96Iu8Pdz-M4Gek7bvCFzqYQbktSw0ELqVVpmNJPJ2LP0Y81NYLrz3slhV5R0R5K5wIYAG8jHccPbI3xTQeMcISxW39d8HRhlw2kNXNivg",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-eOF3j2azL7Ky7VEF96Iu8Pdz-M4Gek7bvCFzqYQbktSw0ELqVVpmNJPJ2LP0Y81NYLrz3slhV5R0R5K5wIYAG8jHccPbI3xTQeMcISxW39LsLe0Vo2TKwaZPk",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-eOF3j2azL7Ky7VEF96Iu8Pdz-M4Gek7bvCFzqYQbktSw0ELqVVpmNJPJ2LP0Y81NYLrz3slhV5R0R5K5wIYAG8jHccPbI3xTQeMcISxW39IpzR01dii5czdEI",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-eOF3j2azL7Ky7VEF96Iu8Pdz-M4Gek7bvCFzqYQbktSw0ELqVVpmNJPJ2LP0Y81NYLrz3slhV5R0R5K5wIYAG8jHccPbI3xTQeMcISxW39IpXe1FszoA9_3hE",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-eOF3j2azL7Ky7VEF96Iu8Pdz-M4Gek7bvCFzqYQbktSw0ELqVVpmNJPJ2LP0Y81NYLrz3slhV5R0R5K5wIYAG8jHccPbI3xTQeMcISxW39IsHe0w5rjW32Sp8",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-eOF3j2azL7Ky7VEF96Iu8Pdz-M4Gek7bvCFzqYQbktSw0ELqVVpmNJPJ2LP0Y81NYLrz3slhV5R0R5K5wIYAG8jHccPbI3xTQeMcISxW39IMHd01Y0ppV9LMo",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-eOF3j2azL7Ky7VEF96Iu8Pdz-M4Gek7bvCFzqYQbktSw0ELqVVpmNJPJ2LP0Y81NYLrz3slhV5R0R5K5wIYAG8jHccPbI3xTQeMcISxW39dZWKhAxjqNOviQ8",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-eOF3j2azL7Ky7VEF96Iu8Pdz-M4Gek7bvCFzqYQbktSw0ELqVVpmNJPJ2LP0Y81NYLrz3slhV5R0R5K5wIYAG8jHccPbI3xTQeMcISxW39dJzehFtqiqjBlB4",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-eOF3j2azL7Ky7VEF96Iu8Pdz-M4Gek7bvCFzqYQbktSw0ELqVVpmNJPJ2LP0Y81NYLrz3slhV5R0R5K5wIYAG8jHccPbI3xTQeMcISxW39cpCKjFowhTAG5U4",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-eOF3j2azL7Ky7VEF96Iu8Pdz-M4Gek7bvCFzqYQbktSw0ELqVVpmNJPJ2LP0Y81NYLrz3slhV5R0R5K5wIYAG8jHccPbI3xTQeMcISxW39c5CK1gtnbrBcWAU",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-eOF3j2azL7Ky7VEF96Iu8Pdz-M4Gek7bvCFzqYQbktSw0ELqVVpmNJPJ2LP0Y81NYLrz3slhV5R0R5K5wIYAG8jHccPbI3xTQeMcISxW39IMaIgA1gN6QQoHQ",
            "name": "Wire Blue"
        }]
        }, {
        item_id: 8,
        name: 'Keep the Change',
        rarity: 'consumer',
        img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2BEHXlVzvFPSbcUglrRLdXYGnd9mX3sbyUS23BQO0qFl0HL6oBo2cYb5-JOUY60NUL_Gf2h0p6WBUnfspUfRq33n0DPaR4n3lLIZ5RAF2X_08',
        colors: [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2BEHXlVzvFPSbcUglrRLdXYGnd9mX3sbyUS23BQO0qFl0HL6oBo2cYb5-JOUY60NUL_Gf2h0p6WBUnfspUfRq33n0DPaR4n3lLIZ5RAF2X_08",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2BEHXlVzvFPSbcUglrRLdXYGnd9mX3sbyUS23BQO0qFl0HL6oBo2cYb5-JOUY60NUL_Gf2h0p6WBUnfspUfRq33n0DPaR4yXcRccpXZsIUY5w",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2BEHXlVzvFPSbcUglrRLdXYGnd9mX3sbyUS23BQO0qFl0HL6oBo2cYb5-JOUY60NUL_Gf2h0p6WBUnfspUfRq33n0DPaR4nHlKI5NSRaT9dM0",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2BEHXlVzvFPSbcUglrRLdXYGnd9mX3sbyUS23BQO0qFl0HL6oBo2cYb5-JOUY60NUL_Gf2h0p6WBUnfspUfRq33n0DPaR4nHBFJJ8DbUG49o0",
            "name": "Jungle Green"
        }]
        }, {
        item_id: 9,
        name: 'Still Happy',
        rarity: 'consumer',
        img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yD3n-ZDLdEC3YDlltU-cLND7c92Hxt-SVFGqfFe54SgACdfcFoDJPP82AOBtrhdZZ-Ga9zhwzDhgvNMZJfACpx2EfJbQ1xDhPcpNbzSHznR7B8xY',
        colors: [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yD3n-ZDLdEC3YDlltU-cLND7c92Hxt-SVFGqfFe54SgACdfcFoDJPP82AOBtrhdZZ-Ga9zhwzDhgvNMZJfACpx2EfJbQ1xDhPcpNbzSHznR7B8xY",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yD3n-ZDLdEC3YDlltU-cLND7c92Hxt-SVFGqfFe54SgACdfcFoDJPP82AOBtrhdZZ-Ga9zhwzDhgvNMZJfACpx2EfJbQ1xDhPJ8pUkXbyR7BPMH0",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yD3n-ZDLdEC3YDlltU-cLND7c92Hxt-SVFGqfFe54SgACdfcFoDJPP82AOBtrhdZZ-Ga9zhwzDhgvNMZJfACpx2EfJbQ1xDhPJ5pWzSCkM6zP97E",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yD3n-ZDLdEC3YDlltU-cLND7c92Hxt-SVFGqfFe54SgACdfcFoDJPP82AOBtrhdZZ-Ga9zhwzDhgvNMZJfACpx2EfJbQ1xDhPfZxWnSD0cd_ZoxY",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yD3n-ZDLdEC3YDlltU-cLND7c92Hxt-SVFGqfFe54SgACdfcFoDJPP82AOBtrhdZZ-Ga9zhwzDhgvNMZJfACpx2EfJbQ1xDhPJJ0BnXX1CMMO_eM",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yD3n-ZDLdEC3YDlltU-cLND7c92Hxt-SVFGqfFe54SgACdfcFoDJPP82AOBtrhdZZ-Ga9zhwzDhgvNMZJfACpx2EfJbQ1xDhPJM5amiekAf1NktA",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yD3n-ZDLdEC3YDlltU-cLND7c92Hxt-SVFGqfFe54SgACdfcFoDJPP82AOBtrhdZZ-Ga9zhwzDhgvNMZJfACpx2EfJbQ1xDhPfc1VzSGk8SMCS0E",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yD3n-ZDLdEC3YDlltU-cLND7c92Hxt-SVFGqfFe54SgACdfcFoDJPP82AOBtrhdZZ-Ga9zhwzDhgvNMZJfACpx2EfJbQ1xDhPcZNazyzwEvw9B_g",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yD3n-ZDLdEC3YDlltU-cLND7c92Hxt-SVFGqfFe54SgACdfcFoDJPP82AOBtrhdZZ-Ga9zhwzDhgvNMZJfACpx2EfJbQ1xDhPcZpVyCChBqB1Wls",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yD3n-ZDLdEC3YDlltU-cLND7c92Hxt-SVFGqfFe54SgACdfcFoDJPP82AOBtrhdZZ-Ga9zhwzDhgvNMZJfACpx2EfJbQ1xDhPfM9XnyOhK_jNDlc",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yD3n-ZDLdEC3YDlltU-cLND7c92Hxt-SVFGqfFe54SgACdfcFoDJPP82AOBtrhdZZ-Ga9zhwzDhgvNMZJfACpx2EfJbQ1xDhPJ5NVmCD4D8WfL5o",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yD3n-ZDLdEC3YDlltU-cLND7c92Hxt-SVFGqfFe54SgACdfcFoDJPP82AOBtrhdZZ-Ga9zhwzDhgvNMZJfACpx2EfJbQ1xDhPIZ8BkCGivdfF-9Y",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yD3n-ZDLdEC3YDlltU-cLND7c92Hxt-SVFGqfFe54SgACdfcFoDJPP82AOBtrhdZZ-Ga9zhwzDhgvNMZJfACpx2EfJbQ1xDhPIJ8BynD1r40JMrk",
            "name": "War Pig Pink"
        }]
        }, {
        item_id: 10,
        name: 'X-Knives',
        rarity: 'consumer',
        img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0Cn3Lp2NgFwQH4Z7yA',
        colors: [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0Cn3Lp2NgFwQH4Z7yA",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0Cmid5LR1127uqeUBA",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0CmiJ5CNgQuJ6wzDew",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0Cn4IZDdgVssbDCpEw",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0CmhIMfd1FpkyeH7nA",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0Cmhc5zahgt0-fnl4Q",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0Cn4cJONgAt7x3H0Cw",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0Cn0LpyPjV_UKqTgow",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0Cn0J5OIgQ4FWyIDog",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0Cn0c5OP1FbN6Hwc5w",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0Cn2c5CPjAkZ2Wuq0g",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0Cn5cpHfgg6vB4nGvw",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0Cn0dZGLjFeLwVj2jA",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0CmjJ8fY1l5fiXbBYg",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0CmiLpPYgVe8NvC2XA",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0CmkIsfQgA0WwVjmyA",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0CmhcJ3b0QnWc5b0oQ",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0CmlIseK0Vrs8dSlFw",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quyECnHkVzTWIDLKGVpXEeIcYj3Hrzrx4euQQDnOE-x4Rl0DevMC-mxIaJ-JN0E61dIOqDXpzxQlRhJ-c4tWfgj9yXsfPq8o3S0GLNsO0Cn2dMXc112UM-fRIw",
            "name": "Wire Blue"
        }]
        }, {
        item_id: 11,
        name: 'Chess King',
        rarity: 'consumer',
        img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeJxakHD1JUPiFv6n',
        colors: [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeJxakHD1JUPiFv6n",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeMkDnyyiJFgRuWJZ",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeMlTnXD0cqV2PerG",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeJNVnSD0Iv9n9bRp",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeMpUyiChI-DCzM-_",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeMoHkSfzckDCqZit",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeJMEnnD1chUFtYD0",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeJ9akXL4Jh-B-Yhv",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeJ9TnnX0d6qM9Pdl",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeJ8HnnKhL4B7PO4K",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeJ0HnXL5cOaf7wgx",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeJIGnCL3dw-EMjAX",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeJ8BnHb5LtxSt6tN",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeMhTyiWjJ65kDN4Z",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeMlaniX0Lj2zrgEF",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeM9Wyi31dOWQ4TyR",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeMoEkCakcKbnZ4_v",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeM5WynekI0YPdNOE",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ouqID2fIYz7KKB7VHUxvGK1WYW-P_2Gi7buUQDHAFeApQAEFdPAG9DZJPM3fbENshoNfrTa-kkAlUAYmdYNFfwO02HkGPaks2C0LeJ0AyCGiJFDePMVM",
            "name": "Wire Blue"
        }]
        }, {
        item_id: 12,
        name: 'Jump Shot',
        rarity: 'consumer',
        img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPcpNbzSHzPSlsfWI',
        colors: [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPcpNbzSHzPSlsfWI",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPJ8pUkXbyCqpm7fk",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPJ5pWzSCkHojMXyU",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPfZxWnSD0_HiQRSw",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPJJ0BnXX1AsfxFAM",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPJM5amiekX7wFVIQ",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPfc1VzSGkyNYdV6U",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPcZNazyzwdCOfNDE",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPcZpVyCChRqYMt0Y",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPcc5Vz3X5BBKNghQ",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPc85Wzy2mzQX-1qA",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPfM9XnyOhdJsOTQ8",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPcchXyy34Gr3dtpk",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPJpoBmHfxkOMnPDM",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPJ5NVmCD402NN844",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPIZ8BkCGip_FhWGk",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPJM1bm3CmZDHn6Sg",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPIJ8BynD1SxHfN9U",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0q_eADEvkYDjQEC3YDlltU7MKZ2mN-DWh5bvFSmvLFbkuFl8MLvEGoWMdb8GOOUM40tIJ_De7khUzDhgvNMZJfACpx2EfJbQ1xDhPc8kDnHbyAzhn5hY",
            "name": "Wire Blue"
        }]
        }, {
        item_id: 13,
        name: 'Double',
        rarity: 'consumer',
        img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJZVkS2kI5cok4Y7tw',
        colors: [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJZVkS2kI5cok4Y7tw",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJYAyCL4dJZSWePp2w",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJYAmCCkIsA7oZIhhg",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJZaniD0IpDihPQC3g",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJYDn3f0d5EunT1HQA",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJYDzCzzJcA_H6TArA",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJZazyOkI8CQzhXOqA",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJZWkSymLpTYDijnCA",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJZWmCOhIsUhqW2w8w",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJZWzCOmd50PSHjHCA",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJZUzCCmL8LzVEh2Nw",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJZbzSH2IcUjRaxZ0Q",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJZWyiGiL5yT3KK4mA",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJYBmHfxdZV9k9Cyfg",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJYAkSPxIpxebxQIJA",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJYGnXf5I8aa9Yhq2w",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJYDzy3ycsImSl5cmA",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJYHnXejcpGMssQiCA",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pe2YHnjyVzzNIy3mEF96GuZAYT2I_TKn4OqQQ2rAQ-EoSwlRf6MN8TFBaMGLbBJo1tYI_DLoxRwuR1g4fMIAcwC3xWYeJLExwTEePJZUy3X1dJbaqILocg",
            "name": "Wire Blue"
        }]
        }, {
        item_id: 14,
        name: 'GGWP',
        rarity: 'consumer',
        img: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOBykHgWcJgkTpd2Yw',
        colors: [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOBykHgWcJgkTpd2Yw",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOAnyXdKJ5kr-SaTeQ",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOAnmXUWcc98mbQduQ",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOB9n3VGcZ_ZRNBuQw",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOAkniJGJJ7YBj0lUw",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOAkzXlBds9MCKFSBQ",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOB9znYWcM-ZIeJr1A",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOBxkHkUfZucrwfTQg",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOBxmXYTccpVGJh0gw",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOBxzXYUJJLBgxrmKw",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOBzzXUUfM1fwuaUFg",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOB8zHREcsr_QrLkdQ",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOBxy3QQfJM48WSgyQ",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOAmmSJDJppm6BOTdg",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOAnkHZDcZOPN0pG3w",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOAhnCJLcMnCBa-PzQ",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOAkznhAIc0XcPgN-Q",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOAgnCIRIZ6pEM5fCA",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCbIZDbWKCSXTFswHLUNYWzQrzb35OrGETvOFeB5SwEFfqAB9zAaOJrdOEM4htIJ_CuomUM7HRkkfddLZQOvw2QfKOBzyiBHJ5lgidmz8w",
            "name": "Wire Blue"
        }]
        }, {
        "item_id": 15,
        "name": "Piggles",
        "rarity": "base",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0seuKG3jyewjILjPeGRBrG7BXPD6I_WGl5OrBQ27JEL15RFxVeaNX-jZOOJuOPhZsgIUC-je62VRzGVArfclJYgKuxmAaIbE8lSMTc5MAm1kVg1p_",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0seuKG3jyewjILjPeGRBrG7BXPD6I_WGl5OrBQ27JEL15RFxVeaNX-jZOOJuOPhZsgIUC-je62VRzGVArfclJYgKuxmAaIbE8lSMTc5MAm1kVg1p_",
            "name": "Bazooka Pink"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0seuKG3jyewjILjPeGRBrG7BXPD6I_WGl5OrBQ27JEL15RFxVeaNX-jZOOJuOPhZsgIUC-je62VRzGVArfclJYgKuxmAaIbE8lSNDcc9WzYARZAk7",
            "name": "Blood Red"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0seuKG3jyewjILjPeGRBrG7BXPD6I_WGl5OrBQ27JEL15RFxVeaNX-jZOOJuOPhZsgIUC-je62VRzGVArfclJYgKuxmAaIbE8lXlFcZ9Wnfaq40MP",
            "name": "Brick Red"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0seuKG3jyewjILjPeGRBrG7BXPD6I_WGl5OrBQ27JEL15RFxVeaNX-jZOOJuOPhZsgIUC-je62VRzGVArfclJYgKuxmAaIbE8lSAXfZhRzb0BhTtY",
            "name": "Desert Amber"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0seuKG3jyewjILjPeGRBrG7BXPD6I_WGl5OrBQ27JEL15RFxVeaNX-jZOOJuOPhZsgIUC-je62VRzGVArfclJYgKuxmAaIbE8lXkUcs9Xze79Wgi-",
            "name": "Dust Brown"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0seuKG3jyewjILjPeGRBrG7BXPD6I_WGl5OrBQ27JEL15RFxVeaNX-jZOOJuOPhZsgIUC-je62VRzGVArfclJYgKuxmAaIbE8lXcXcc1bzzEkOvZh",
            "name": "Monster Purple"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0seuKG3jyewjILjPeGRBrG7BXPD6I_WGl5OrBQ27JEL15RFxVeaNX-jZOOJuOPhZsgIUC-je62VRzGVArfclJYgKuxmAaIbE8lXgWcJ1VyKnATolz",
            "name": "Princess Pink"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0seuKG3jyewjILjPeGRBrG7BXPD6I_WGl5OrBQ27JEL15RFxVeaNX-jZOOJuOPhZsgIUC-je62VRzGVArfclJYgKuxmAaIbE8lSNKcppWkYDzqR17",
            "name": "Tiger Orange"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0seuKG3jyewjILjPeGRBrG7BXPD6I_WGl5OrBQ27JEL15RFxVeaNX-jZOOJuOPhZsgIUC-je62VRzGVArfclJYgKuxmAaIbE8lSVGJpJXy3l0pnpJ",
            "name": "Tracer Yellow"
            }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0seuKG3jyewjILjPeGRBrG7BXPD6I_WGl5OrBQ27JEL15RFxVeaNX-jZOOJuOPhZsgIUC-je62VRzGVArfclJYgKuxmAaIbE8lSRGJsgGnEGWiZe8",
            "name": "War Pig Pink"
            }]
        }, {
        "item_id": 16,
        "name": "X-Axes",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfniz5cpHafYu3OIc",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfniz5cpHafYu3OIc",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfy3X2LsbbplLBLkU",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfyyX0cpCNveySYLg",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfkSP0IpDdxCHZolI",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfyCKjIsXca5Q3Ekw",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfyHH4JZeNJucFwmk",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfkXL3cpGNw-VwhxA",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfnSz4cJzZghgr6I8",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfnSX3d5CI6MoJ2g0",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfnXH3cMXQGTn-OCA",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfn3H0cJ2PeMqxXno",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfkHD1IJOIAVwIlHA",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfnXf1dJ3RyGNH62c",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfyiWjJ8fYD4mJiEU",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfyyz3J5DRL9n1W80",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfzSCjL5GLKV_lUIY",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfyHL5JMCPGfEAsL4",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfzCCjdcDcNNjSNcU",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0oPqID0v0ejjXPCTdI1JpD-QLK2yKqjP05-6TQG7MQL4pRQsDKKFX9WcaP5jYbRc03IYJrmS-whAsHU9mYstBNgy0xnsBPKgp3CgCKdJfn3ahI8bbmzjcN0Y",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 17,
        "name": "Death Sentence",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJZVkS2kI5er3rpUnw",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJZVkS2kI5er3rpUnw",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJYAyCL4dJZA9Eq6jQ",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJYAmCCkIsBJx375fw",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJZaniD0IpDQZ9U3iw",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJYDn3f0d5HMETBFyw",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJYDzCzzJcBjIvojzA",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJZazyOkI8BZKI6onA",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJZWkSymLpRIMFPBHQ",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJZWmCOhIsW9z7Xw2Q",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJZWzCOmd5330wr9fg",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJZUzCCmL8KGcXP-Sw",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJZbzSH2IcV6hsv81A",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJZWyiGiL5zadzhzHA",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJYBmHfxdZWGZMMHLw",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJYAkSPxIpymK6rOqA",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJYGnXf5I8aS1flFTg",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJYDzy3ycsJ_nNvmEw",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJYHnXejcpGrkp0gQA",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0o_ePHnjyVzPBLiXmEF96GuZANGnRrGWt4uzHRTvNQOEuFwxSK_YF9jVLa8raOEE51oID_GbvkxYpS1g4fMIAcwC3xWYeJLExwTEePJZUy3X1dJbq3cETlA",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 18,
        "name": "Tilt",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPcpNbzSHzjpQrZC8",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPcpNbzSHzjpQrZC8",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPJ8pUkXbynI5BA8g",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPJ5pWzSCkqNqNk0A",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPfZxWnSD0_oOMS5A",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPJJ0BnXX1dzWXSO8",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPJM5amiekwCeaado",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPfc1VzSGkvFRZKY8",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPcZNazyzwP8IKaSM",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPcZpVyCChHUD1oIo",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPcc5Vz3X5k2Tu_fo",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPc85Wzy2mui51F_4",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPfM9XnyOhYa6SDxo",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPcchXyy346IGr4zg",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPJpoBmHfx1mXNsWg",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPJ5NVmCD4kl8ZuJs",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPIZ8BkCGiRcfnoc4",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPJM1bm3CmFnGSP0w",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPIJ8BynD1BsyEBlo",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3X5byXdEC3YDlltU7oPMm_c9zrw4uycEzCYR75-ElsHKKUN8mVLaMmAOxI40oIPrzfuwkAzDhgvNMZJfACpx2EfJbQ1xDhPc8kDnHbyXW0d7nQ",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 19,
        "name": "8-Ball",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfniz5cpHatX7qzWE",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfniz5cpHatX7qzWE",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfy3X2LsbbhJl-sv8",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfyyX0cpCN2n-yrn4",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfkSP0IpDdS3GCjys",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfyCKjIsXcgoDDprU",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfyHH4JZeNCgc-vv0",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfkXL3cpGN7Q5y014",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfnSz4cJzZYx6tD64",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfnSX3d5CInRKSiAc",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfnXH3cMXQhCmq8hM",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfn3H0cJ2PIVQAdb0",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfkHD1IJOIJs9hMiY",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfnXf1dJ3R8B5ch4o",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfyiWjJ8fY3VrjfrM",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfyyz3J5DRBCEvbHI",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfzSCjL5GL3SsXIqg",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfyHL5JMCPOKSdgDY",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfzCCjdcDcHczYNaY",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yGX3wYCPGLi3VI1JpD-QLKz2M-WKlt76UQjGbF-0lSwwMePAD9GdLOc3bbkY50oEM8jfqwUEqSUFmYstBNgy0xnsBPKgp3CgCKdJfn3ahI8bbKBUPiYA",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 20,
        "name": "GLHF",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbOp9kSVHdtssdUub",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbOp9kSVHdtssdUub",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbL8knnkQd78iX5dV",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbL90nCVGIYoaGvGu",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbOVynHVGcQY21OEP",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbLxzy3UTcHpxEVMp",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbLwgkHJBIfq61ZLL",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbOUjnyVHIU3rGcL8",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbOl9kCdKdcD5oj8o",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbOl0nyBGJOi6r28d",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbOkgnycTfJYPfkRk",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbOsgnCdLI8y4mOyq",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbOQhnXdFJKQA86sd",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbOkmnSNLfewSKWq1",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbL50y3ARdPsnnnW1",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbL99n3BGfcYmT-iW",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbLlxy3hHJ7QXcDql",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbLwjkXMWI5hCgoWg",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbLhxyyIWcA7klCRA",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pu6FGkv7aSXDKm_dSAo_GeEMM23Z_jqt4uqVFzjIQO4uQQkFKKRVoGAcO5vfPkBvhoFZ5XW2kAJ-ERonYMhTfBuy2ngKbOsnyXQQd9RfLuzm",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 21,
        "name": "Popdog",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4n3lLIZ5RQo4G3wE",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4n3lLIZ5RQo4G3wE",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4yiBEfclQjF_nPSI",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4ynBGIZ8GrTIW-Cw",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4kHZGcZ9WExLdvSk",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4yXcRccpXopgROSc",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4ySRKdpgGO_kTc7s",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4kCdFIZ4GVGYFbtk",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4nHlKI5NS5CySCsE",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4nHBFJJ8DSAxUMAk",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4nCRFI8pb-tl3dFQ",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4niRGI5IEQMRrM98",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4kSVHc5wDXjXbWA0",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4nCJHJ5JaxfWmDII",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4y3ARdMhTq1twVVo",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4ynlFdJ9aK5dWd44",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4zHURfJ4AqnyZtpg",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4ySdLd88EjK3yIXQ",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4zXURJs9X8jDZsbs",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0se2dGHvwVzvFPSbcUls6SbsPPGjerGKn5LzHRTCcQuh4FQ8CeKFRpzYdNZ-JPxs9gYRa8zb2h0p6WBUnfspUfRq33n0DPaR4niMTcMlQ73n4mMs",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 22,
        "name": "QQ",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJZVkS2kI5cvBshUiw",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJZVkS2kI5cvBshUiw",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJYAyCL4dJZ-qDqEjQ",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJYAmCCkIsAsg1d5nw",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJZaniD0IpAxVae5vw",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJYDn3f0d5E3iG41Vw",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJYDzCzzJcDf4sIQPg",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJZazyOkI8B4vKteYA",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJZWkSymLpSjaj-Waw",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJZWmCOhIsUBRpNlIA",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJZWzCOmd52SvBzPNQ",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJZUzCCmL8KD8iRFrQ",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJZbzSH2IcVbfH2RPg",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJZWyiGiL5wtDtBMaw",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJYBmHfxdZVVMiJahw",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJYAkSPxIpzDDqXOMw",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJYGnXf5I8YbRi5Zjg",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJYDzy3ycsIyUgS4gw",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJYHnXejcpFTaPfFoQ",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI3DyeyfFJjPmEF96GuZAMTuMrTGktOuSF2qcE70sRA4NKaJQo2IdOpqAaUQ-0oNY_TPok0d4S1g4fMIAcwC3xWYeJLExwTEePJZUy3X1dJbB3n4_Zg",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 23,
        "name": "Noscope",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XxFfZIGnCfjIzV4GA",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XxFfZIGnCfjIzV4GA",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XwQJJ1ayyb-hVNyqQ",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XwQdJ8GnXBOnRSyEA",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XxKcp9WnSCakNRdEg",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XwTc8hWyCHX23k-Jg",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XwTIJNRmnBv5tF2wQ",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XxKI5wGnHBgVmStow",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XxGfZMEkSR7O4jvCg",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XxGdJwDnXUo61fxaQ",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XxGIJwEyC0G4wBAXw",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XxEIJ8EkHJWJxbUlA",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XxLIZ5UnnX_XfjWZg",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XxGJp4AkCwSyz2H5Q",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XwRdMhTyiVhgs3nTQ",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XwQfZxTnSwFmmpTTA",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XwWcchbnHZLKa49kA",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XwTI5JQzXJm_Zvlwg",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XwXccgBzSEizUI7Og",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0r-2yD3f4eDL7IyDLG1smSeZeNG-L_TT2se_FETqfQeEoQF8DfKIG82MfaJqKPBQ8044P_jLqkQptEBFuccpKfx2233gHOK0p0XxEJ8pXyyav9CuJbw",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 24,
        "name": "Eat It",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4n3lLIZ5Rt3JvtDk",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4n3lLIZ5Rt3JvtDk",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4yiBEfclQVSZHYR8",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4ynBGIZ8GF9ekNWo",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4kHZGcZ9WPFBqOSk",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4yXcRccpXSTRSVsk",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4ySRKdpgGLc-Y1mw",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4kCdFIZ4GS2jh58M",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4nHlKI5NSe_ECsaE",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4nHBFJJ8D61MLi6g",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4nCRFI8pbSsSVfMc",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4niRGI5IE2o7eqs4",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4kSVHc5wDzR5Buog",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4nCJHJ5JaOC6QQUo",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4y3ARdMhToUo2Mgw",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4ynlFdJ9ah52pZ90",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4zHURfJ4AFTIKcx0",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4ySdLd88EelNCye0",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4zXURJs9XWzUK-Cs",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0te2DG2HyVzvFPSbcUg9qSrJeMDmNq2Gmsb6QQm7BQugkSgoCfPFQpzVPPMyLO0c_h9Vd-2T2h0p6WBUnfspUfRq33n0DPaR4niMTcMlQJ-XcwEA",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 25,
        "name": "Worry",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPcpNbzSHznvpiKg4",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPcpNbzSHznvpiKg4",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPJ8pUkXbySiAuEIk",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPJ5pWzSCkai1EOCQ",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPfZxWnSD0HXisWfo",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPJJ0BnXX1fX-vxZ4",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPJM5amiekBpdaH10",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPfc1VzSGk1RfMV7E",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPcZNazyzw-iraS-g",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPcZpVyCCh2P7hw2M",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPcc5Vz3X5z3Sa54w",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPc85Wzy2m8mt2qf4",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPfM9XnyOhVecJKYw",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPcchXyy34COxT8yc",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPJpoBmHfxrsL9nWs",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPJ5NVmCD4U22TKs0",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPIZ8BkCGiKbKCL7Q",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPJM1bm3Cm-9hu2bk",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPIJ8BynD1-MS5pvo",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pO-CI2P4eiXdEC3YDlltU7RXYDrRqjb2tLyRR23LEOx4Qw5WeqYG8W1NOsrdakc4gIZfqmC5z0YzDhgvNMZJfACpx2EfJbQ1xDhPc8kDnHby0WaN6mI",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 26,
        "name": "Take Flight",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOBykHgWcJj4naFCKA",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOBykHgWcJj4naFCKA",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOAnyXdKJ5nJIp-WlQ",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOAnmXUWcc-Axdiirg",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOB9n3VGcZ_HLbfGeg",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOAkniJGJJ7LYNtKnw",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOAkzXlBds835jcmMA",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOB9znYWcM_wUlbfMA",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOBxkHkUfZuflIcLPg",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOBxmXYTccol6Ol_sg",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOBxzXYUJJLkfp57xA",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOBzzXUUfM1ZzmrMKQ",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOB8zHREcsrjs6oN9g",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOBxy3QQfJNMj4z_Sg",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOAmmSJDJppVlnQTew",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOAnkHZDcZNx25Tghw",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOAhnCJLcMnwHhdAzQ",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOAkznhAIc3eOtmVCw",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOAgnCIRIZ6triF3JQ",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0tuuDG2fIZDbWKCSXTl8_HrMLYTve-TOgtrmdQ2nKFLt-EVwGLKUA8mYfO82PNxc71oYK8yuomUM7HRkkfddLZQOvw2QfKOBzyiBHJ5k-UiP8Nw",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 27,
        "name": "Loser",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeJxakHD1JSNanqju",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeJxakHD1JSNanqju",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeMkDnyyiJM3Iac9A",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeMlTnXD0cgyj_bQ5",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeJNVnSD0IpEZVr51",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeMpUyiChI1hcPktq",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeMoHkSfzchIS6tAh",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeJMEnnD1cqQiOula",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeJ9akXL4JmHa7Xjw",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeJ9TnnX0d2M9VC4d",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeJ8HnnKhLyb804cr",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeJ0HnXL5cH8UjTLq",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeJIGnCL3d8YkIfMQ",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeJ8BnHb5LmJGELID",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeMhTyiWjJ6eg534S",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeMlaniX0LisnG11E",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeM9Wyi31dHCKkKmL",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeMoEkCakcFrRBV21",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeM5WynekIw2EFKLu",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeODGEv7ZyTBPR7VHUxvGK1dNG_Y_Tei7OuVFz2cSOAsQQ8EevcMo20aacjfPxQ10oENqDXpkxMlUAYmdYNFfwO02HkGPaks2C0LeJ0AyCGiJOy_xYBH",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 28,
        "name": "Lambda",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPcpNbzSHzy-kyaNM",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPcpNbzSHzy-kyaNM",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPJ8pUkXbyWDNDdLw",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPJ5pWzSCkht6En6E",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPfZxWnSD0kudAzAI",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPJJ0BnXX1WE27ej4",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPJM5amiekFuM04N4",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPfc1VzSGkR-pctwQ",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPcZNazyzwcWVnp8k",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPcZpVyCChQXpr1P8",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPcc5Vz3X5_vFb1kA",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPc85Wzy2mbQAAzHQ",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPfM9XnyOhT_sPvBE",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPcchXyy34w97N8h0",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPJpoBmHfxK2TgGRQ",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPJ5NVmCD4WT1wvRI",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPIZ8BkCGi4gCCDTE",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPJM1bm3Cm6J8UFhs",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPIJ8BynD1RkSdssc",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qe6yEHX6ajPFEC3YDlltU-ZWPGnQ-DHwtrmTFjmfQbt6S1tSK_cEpGBNbpqOORI83YEJ-zXtxRQzDhgvNMZJfACpx2EfJbQ1xDhPc8kDnHby8bX3euw",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 29,
        "name": "Eco",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeJxakHD1JVmCzpKs",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeJxakHD1JVmCzpKs",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeMkDnyyiJPUFGDNx",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeMlTnXD0cuSShW-J",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeJNVnSD0ItA1vjFE",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeMpUyiChI88xYS_P",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeMoHkSfzcrqcL_Co",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeJMEnnD1ckJCbAmE",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeJ9akXL4Jrzm0J3r",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeJ9TnnX0d9orKq3K",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeJ8HnnKhL_ciw-5S",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeJ0HnXL5cLSYT_06",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeJIGnCL3d8bvBrrR",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeJ8BnHb5LrG-FbIQ",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeMhTyiWjJ06qgRZV",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeMlaniX0Lk_5va_w",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeM9Wyi31dN3IKccq",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeMoEkCakcPca6tA1",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeM5WynekI8sP-y_y",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0pOGCI2T-eyPLIx7VHUxvGK1fPGHR-2al5uWdRTucE-glQFoAefQH9DBIOZrbbkA6gY4L8me5khJ5UAYmdYNFfwO02HkGPaks2C0LeJ0AyCGiJIEdZDp1",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 30,
        "name": "GGEZ",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOBykHgWcJhfZgiKHQ",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOBykHgWcJhfZgiKHQ",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOAnyXdKJ5k4sISaZg",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOAnmXUWcc8DVBzt2w",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOB9n3VGcZ_nDxhbeA",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOAkniJGJJ6ACTelPw",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOAkzXlBds_g4O7LWA",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOB9znYWcM--0SurLQ",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOBxkHkUfZsrH6Veyw",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOBxmXYTccr1qDKojw",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOBxzXYUJJI8bPYv8A",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOBzzXUUfM0lz7-iFg",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOB8zHREcspp6SJ7nA",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOBxy3QQfJM6qSvVGQ",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOAmmSJDJprtJ6VNIw",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOAnkHZDcZPMm_KbYA",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOAhnCJLcMlbejR0Gg",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOAkznhAIc2xskh5Yg",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOAgnCIRIZ65B4mhyQ",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0puWyTCXIZDbWKCSXT1oxSLteYTrbqzvx4-mUSzzIEugvEQgDL6MFoGVIO8iMbBNsgIIC8iuomUM7HRkkfddLZQOvw2QfKOBzyiBHJ5nBQUcnNg",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 31,
        "name": "Sorry",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOBykHgWcJigDfPWoQ",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOBykHgWcJigDfPWoQ",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOAnyXdKJ5m3h-SINw",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOAnmXUWcc8B4EW7mQ",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOB9n3VGcZ_uJ0eMIQ",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOAkniJGJJ6tqzaeVA",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOAkzXlBds848X_4GA",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOB9znYWcM_9-hUgqw",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOBxkHkUfZsyW2-otg",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOBxmXYTccpKVM3ZCA",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOBxzXYUJJLtluPqHg",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOBzzXUUfM3n17cn5w",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOB8zHREcsq-KEgwKQ",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOBxy3QQfJPAKv-6Ig",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOAmmSJDJpq4hhy2fg",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOAnkHZDcZNzlmHdEA",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOAhnCJLcMncqP0gGA",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOAkznhAIc1tGj0Paw",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOAgnCIRIZ5dfFpn4g",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0su2fDm3IZDbWKCSXSQ5sTLRXYzzd_mGnt-vGFjGYR7okEV9RL6VWp2RAaMuNPUdrh4MPqSuomUM7HRkkfddLZQOvw2QfKOBzyiBHJ5ndcqfdYQ",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 32,
        "name": "Karambit",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XxFfZIGnCcXNrtfgg",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XxFfZIGnCcXNrtfgg",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XwQJJ1ayyaoMJ6BVA",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XwQdJ8GnXA2LP7pNA",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XxKcp9WnSDWwlBDtQ",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XwTc8hWyCHU3VfozA",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XwTIJNRmnB3EtijDQ",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XxKI5wGnHDsz48Kng",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XxGfZMEkSQO9091TQ",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XxGdJwDnXW7_9uA2Q",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XxGIJwEyC39nIBR-w",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XxEIJ8EkHKdGe_eHg",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XxLIZ5UnnUOgmlWfA",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XxGJp4AkCzba-PnpA",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XwRdMhTyiXJEpNAhw",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XwQfZxTnSxOk1o7Hw",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XwWcchbnHbz5vp1xA",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XwTI5JQzXKLniBwwQ",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XwXccgBzSHECIwblg",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0quOfHXn1YSP7IyDLG1smSrJcNm-NqGCk4eucFj6aR-svQVoDe6YN9jJBbs_dOBU10oIO82btzwptEBFuccpKfx2233gHOK0p0XxEJ8pXyyZpRqpzjg",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 33,
        "name": "Tombstone",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblCP4L8Dchvhi2Mg3",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblCP4L8Dchvhi2Mg3",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblHahIJyLh4cRo8ym",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblHbxIsDd0bKcMmr6",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblCz3IpDdgVD7xM7o",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblHX2dZCIgDdxcs_L",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblHWlLpfa0TaIbxsS",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblCymIcDc0WqU6z4n",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblCD4LsLRheX_ViGk",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblCDxIcXd1BnVa_Yn",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblCClIcKIjBxnjYIG",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblCKlIsLQ09r_Lyn-",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblC2kI5Le1BYcHxPy",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblCCjI8bQjfFam-nS",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblHfxdZWKhAHmpwQE",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblHb4IZXdjbRWmSDs",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblHD0dZ3c16teRNXC",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblHWmL5aN0_-gLkk_",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblHH0dceNgLgD83Lo",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMGGfjZznBEDPQDGFkHPEJYHbQ9jant-XBQGmcEusuQg8Ae_YF8TFOO5iNNxVoh9EL8jzokR0vS0B-PNVId0m4xXgcI7AwxDUbNccblCKid5GLh2Ev_K-E",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 34,
        "name": "Cocky",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lXZKfM9XmjvDmHHR",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lXZKfM9XmjvDmHHR",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lSMTc5MAmywt3u9n",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lSNDcc9Wzd3Wh-Jj",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lXlFcZ9WnfvKNGnA",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lSBEJp8DnB1c4qxR",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lSAXfZhRzZo9RLXQ",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lXkUcs9XzXHalhp3",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lXVKfc1amQboq3MG",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lXVDcspWyBgZtwij",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lXUXcs0DkEZHJDUb",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lXcXcc1bzxzepXvM",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lXgWcJ1VyPIPIpMi",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lXURcMlbkYUvLepN",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lSJDJpoBmDg1HYbk",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lSNKcppWkZ0rJ7JX",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lSVGJpJXy2cVxjr3",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lSAUfJkGz_kgsHT2",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lSRGJsgGnGPQIoPy",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0s-2CD2DyegjILjPeGRA9GLMNY2zd-mWhsOWcQj2aF7l-RAhVLPYEpGAda5jaNxI90YVerTO92VRzGVArfclJYgKuxmAaIbE8lXcQJJ4Am7jfkejZ",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 35,
        "name": "King Me",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOBykHgWcJgAQUoedw",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOBykHgWcJgAQUoedw",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOAnyXdKJ5k8eadsTQ",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOAnmXUWcc_XQuMz6A",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOB9n3VGcZ_i9wCd_A",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOAkniJGJJ57ckDfmg",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOAkzXlBds9zhoDK2A",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOB9znYWcM8IBmfftw",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOBxkHkUfZteoCISWw",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOBxmXYTccpgAyVVMQ",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOBxzXYUJJIZfCkAow",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOBzzXUUfM0OD-prMQ",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOB8zHREcsr_LODnVw",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOBxy3QQfJPc4-IO-Q",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOAmmSJDJpqULkAiwA",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOAnkHZDcZNntUcHzw",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOAhnCJLcMmjss6-Lg",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOAkznhAIc2IJAufJg",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOAgnCIRIZ6k7TaeCw",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0ovCCC3rIZDbWKCSXH19pRLQKPWvY-Gek5L-QRD6bFOsrR1pXffMA821INcvbbEA1gNIO_SuomUM7HRkkfddLZQOvw2QfKOBzyiBHJ5kE7k0oTg",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 36,
        "name": "NaCl",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0suOBCG3IZDbWKCSXSlsxHLENZDvaqjSi4-TCEDyaQeF6QlhSeaMA-mcaOMzcORJr09YKqSuomUM7HRkkfddLZQOvw2QfKOAmmSJDJpoMGFMTmg",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0suOBCG3IZDbWKCSXSlsxHLENZDvaqjSi4-TCEDyaQeF6QlhSeaMA-mcaOMzcORJr09YKqSuomUM7HRkkfddLZQOvw2QfKOAmmSJDJpoMGFMTmg",
            "name": "Shark White"
        }]
    },
    {
        "item_id": 37,
        "name": "Sheriff",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeJxakHD1JflzDpJx",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeJxakHD1JflzDpJx",
            "name": "Battle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeMkDnyyiJDDZBl2b",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeMlTnXD0ctBvWZn_",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeJNVnSD0IhRf8shU",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeMpUyiChI85fY5tM",
            "name": "Cash Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeMoHkSfzchAn5Kal",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeJMEnnD1ckr-CbO0",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeJ9akXL4Js8BBXmF",
            "name": "Frog Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeJ9TnnX0d39_aXq9",
            "name": "Jungle Green"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeJ8HnnKhL7CCL-7p",
            "name": "Monarch Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeJ0HnXL5cGJr4kpL",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeJIGnCL3dxfHmb9N",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeJ8BnHb5LtEG_3rj",
            "name": "SWAT Blue"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeMhTyiWjJ8IQwjKs",
            "name": "Shark White"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeMlaniX0Lu0P0Bnq",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeM9Wyi31dAjtZLvV",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeMoEkCakcLTibWHE",
            "name": "Violent Violet"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeM5WynekI8fohY0R",
            "name": "War Pig Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeOZI2f_bSXNKR7VHUxvGK1eMGne_TbxtrmQQzzNRet5EgwMK_YN92caOJvabRdp3dEL-2HqwUEqUAYmdYNFfwO02HkGPaks2C0LeJ0AyCGiJPyNMnbm",
            "name": "Wire Blue"
        }]
    },
    {
        "item_id": 38,
        "name": "Heart",
        "rarity": "consumer",
        "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMDmDIZDbWKCSXGF9rTbRaZG_b_jPwt7-RFmqYRr4oQg8CfaQF9G0ab87YOEc73dYC-yuomUM7HRkkfddLZQOvw2QfKOAnyXdKJ5nZBINhHw",
        "colors": [{
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMDmDIZDbWKCSXGF9rTbRaZG_b_jPwt7-RFmqYRr4oQg8CfaQF9G0ab87YOEc73dYC-yuomUM7HRkkfddLZQOvw2QfKOAnyXdKJ5nZBINhHw",
            "name": "Bazooka Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMDmDIZDbWKCSXGF9rTbRaZG_b_jPwt7-RFmqYRr4oQg8CfaQF9G0ab87YOEc73dYC-yuomUM7HRkkfddLZQOvw2QfKOAnmXUWcc8ZTt-iJQ",
            "name": "Blood Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMDmDIZDbWKCSXGF9rTbRaZG_b_jPwt7-RFmqYRr4oQg8CfaQF9G0ab87YOEc73dYC-yuomUM7HRkkfddLZQOvw2QfKOB9n3VGcZ_asFKJgw",
            "name": "Brick Red"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMDmDIZDbWKCSXGF9rTbRaZG_b_jPwt7-RFmqYRr4oQg8CfaQF9G0ab87YOEc73dYC-yuomUM7HRkkfddLZQOvw2QfKOAkzXlBds9RF-7Z0w",
            "name": "Desert Amber"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMDmDIZDbWKCSXGF9rTbRaZG_b_jPwt7-RFmqYRr4oQg8CfaQF9G0ab87YOEc73dYC-yuomUM7HRkkfddLZQOvw2QfKOB9znYWcM8HF_3ayg",
            "name": "Dust Brown"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMDmDIZDbWKCSXGF9rTbRaZG_b_jPwt7-RFmqYRr4oQg8CfaQF9G0ab87YOEc73dYC-yuomUM7HRkkfddLZQOvw2QfKOBzzXUUfM3B219S8Q",
            "name": "Monster Purple"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMDmDIZDbWKCSXGF9rTbRaZG_b_jPwt7-RFmqYRr4oQg8CfaQF9G0ab87YOEc73dYC-yuomUM7HRkkfddLZQOvw2QfKOB8zHREcsr_4bu20Q",
            "name": "Princess Pink"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMDmDIZDbWKCSXGF9rTbRaZG_b_jPwt7-RFmqYRr4oQg8CfaQF9G0ab87YOEc73dYC-yuomUM7HRkkfddLZQOvw2QfKOAnkHZDcZMha6EX1A",
            "name": "Tiger Orange"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMDmDIZDbWKCSXGF9rTbRaZG_b_jPwt7-RFmqYRr4oQg8CfaQF9G0ab87YOEc73dYC-yuomUM7HRkkfddLZQOvw2QfKOAhnCJLcMmcdcg_8A",
            "name": "Tracer Yellow"
        }, {
            "img": "IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3UfvMYB8UsvjiMXojflsZalyxSh31CIyHz2GZ-KuFpPsrTzBG0qeeMDmDIZDbWKCSXGF9rTbRaZG_b_jPwt7-RFmqYRr4oQg8CfaQF9G0ab87YOEc73dYC-yuomUM7HRkkfddLZQOvw2QfKOAgnCIRIZ4LDQdo-Q",
            "name": "War Pig Pink"
        }]
    },
    {
        item_id: 39,
        name: 'Banana',
        rarity: 'milspec',
        img: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRLTUDGQtu-x93SSk47JwVZt7SkFAthwfTNP2VBtdi3wdmOxqCiZb2Hkm4HuJEh2-iV8Nj0jFCxrkJvN26iJtTGIAYgIQaH8PkMfx8'
        },
    {
        "item_id": 40,
        "name": "Phoenix",
        "rarity": "milspec",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRLTUDGQtu-x93SSk47NQxYs7SsMzhs0uHPdHMX6o3nxtiKxK6iNbnVzzkAsJRw3rqT993wilW2_kJpMm6gctWRJgJrfxiOrTfMhyM4"
    },
    {
        "item_id": 41,
        "name": "Ace",
        "rarity": "milspec",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRLTUDGQtu-x93SSk47JAdSier0FAthwfTNPz9D79mzkoPawqKmZeqHzjtUsMZ3iLDDodyg2gLg-EQ5Z2qlLYSRJFcgIQaH8Xl4fqU"
    },
    {
        "item_id": 42,
        "name": "Skull n' Crosshairs",
        "rarity": "milspec",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRLTUDGQtu-x93SSk47MQVFsb-xFFcy7P_JYzpHotmwxoXfz_L2Mr7Tw2oH7cRyiOuXptT00AWyr0ppMjr3dtTGclI_NV7Oug_pxSg-O9E"
    },
    {
        "item_id": 43,
        "name": "Easy Peasy",
        "rarity": "milspec",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRLTUDGQtu-x93SSk47KQFaubSaOBZ11vbSdAJO7c6xkc7fxKemY7jTwzgJuZwn0riSpNqkiwHnrks-NW3zI9XBdlJvMF2GqFC7366x0kYOyYvD"
    },
    {
        "item_id": 44,
        "name": "Nice Shot",
        "rarity": "milspec",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRLTUDGQtu-x93SSk47Kw1Us4W2Iwh07PDHfTJQ09C3hoeO2aX2YOjQzzoEsMZzj7mQ9t-tiQ3t_kZla2r2LY-VJlJtM1mD_QC-xb3xxcjrnKCwLr4"
    },
    {
        "item_id": 45,
        "name": "Guardian",
        "rarity": "milspec",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRLTUDGQtu-x93SSk47JhBouru3LAIu16ecJzlAvdm1l9DYk_KtZr3Uz2pQ65AhibuXpN33jFGyrkQ5YGD7d5jVLFFFYrgrdQ"
    },
    {
        "item_id": 46,
        "name": "Wings",
        "rarity": "milspec",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRLTUDGQtu-x93SSk47Mg1ZsamaJwZy1PaGdDxGvdrmxNHez6GtZr-Hkm5SvZcm3O-ZrIqm0QSw8xY9YGH6LIKRcRh-Pw_tirgTOg"
    },
    {
        "item_id": 47,
        "name": "Welcome to the Clutch",
        "rarity": "milspec",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRLTUDGQtu-x93SSk47MgFbtbWoLjhj3-bccjV94N2kk4XFwvSlZ7-Jl20DscAn37HDpd-t2VfhqEBqNm36ddLGdw44YF3XrFHvwfCv28HzUjuvNw"
    },
    {
        "item_id": 48,
        "name": "Real MVP",
        "rarity": "restricted",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRLTUDGQtu-x93SSk47NwFWurezOzgwgczEcC9F6ZK3kYXfwvWmML2ElW4IsZIi2e2Yo4jz3gLnqkE4ZTymcNWTIVA6MgzQ5BHglrmK1N0x"
    },
    {
        "item_id": 49,
        "name": "Kisses",
        "rarity": "restricted",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRLTUDGQtu-x93SSk47Lg1Epb-2FAthwfTNP2kR6dizxtiPlvH2N-zSkj4BucQjj-3Aoo-l2FXn80toa2_3JdXDcQIgIQaH1hhrveA"
    },
    {
        "item_id": 50,
        "name": "R.I.P.I.P.",
        "rarity": "restricted",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRLTUDGQtu-x93SSk47Nw1Hv6qaJwZy1PaGImtA6oXuwIWNxK72MOLSl20FvMEi2e3Hrdik3FHlr0ZvMWqhd4LAIRh-Pw8bqlmZIg"
    },
    {
        "item_id": 51,
        "name": "Cerberus",
        "rarity": "restricted",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRLTUDGQtu-x93SSk47JgFFtL-3PhRf3_LadjgMvtrgzdjflfSsYu2GxG5TvsQi2OiZrI3w3Aft_BI-Yj-mdYPBJldsZEaQpAZoQDIBJA"
    },
    {
        "item_id": 52,
        "name": "EZ",
        "rarity": "restricted",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRLTUDGQtu-x93SSk47IB5o5uiaJwZy1PaGJjtE6YjuwdHTx6fyN7iElTwIusMgjuuZoY_32wa1_EVrZjz6ItOVJxh-Pw9mlmfxpA"
    },
    {
        "item_id": 53,
        "name": "Crown",
        "rarity": "restricted",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRLTUDGQtu-x93SSk47JhZYobSaJwZy1PaGdWRH74Tgl9mNlfb3Mb-HlzsEsZZ33r_Cp9Sh3QTi_kM5YGCmJ9OUchh-Pw8eAVa3NQ"
    },
    {
        "item_id": 54,
        "name": "Fire Serpent",
        "rarity": "classified",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRLTUDGQtu-x93SSk47Iw1Fs6mgORdl3ef3fTxQ69n4xtffz6asZerVlz5SvJR127jApd-sjFHt_kU5ZGqnLdTAdg49YA2G-k_-n7l53li5rA"
    },
    {
        "item_id": 55,
        "name": "Clutch King",
        "rarity": "classified",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRLTUDGQtu-x93SSk47JghCormtFFcx7P_JYzpHoo2zw9GPlKGjYurUwj4HvJdzjO2UpY70i1Xi-kFpajz3LNWSJ1BtZljOug_pbmHHD9g"
    },
    {
        "item_id": 56,
        "name": "Howling Dawn",
        "rarity": "classified",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRLTUDGQtu-x93SSk47LQtAurOrLDhk0uTGTjFD_tuz2tPSkaXwN73TxDgAvMQj07-Wp9-m0QexqktkNW_zcY6dclVqYQ2D-wSggbC4bQxF5bY"
    },
    {
        "item_id": 57,
        "name": "Pocket BBQ",
        "rarity": "milspec",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0HdUuqkw9bsXlRsdVUYprWmIAJ07PHKYAJO7c6xkc6Iz_X3NePVzzoA7JFz2OvCpN7xjQ3m-xduN22lcdPHIFU8MA7QqVTo366x0jRzWXzI"
    },
    {
        "item_id": 58,
        "name": "Winged Defuser",
        "rarity": "milspec",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0HdUuqkw9bsXlRsdVUYobOrLAJk7PfNdyhR6c6JmIGZkPK6ZezQzm4G68Ej3uuSpN7zjgTmqUc-N231JNCQelA8ZV_RrlTryOzrhIj84sp0s4o0mA"
    },
    {
        "item_id": 59,
        "name": "Old School",
        "rarity": "milspec",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0HdUuqkw9bsXlRsdVUYubahOARo3PzETjFD_tuz2tfZwfWjMO2Fxz0A7sZ10r6Roo6sjlCx-kJtYzymI4-QcQ48Ml_VrlKggbC4730BxU8"
    },
    {
        "item_id": 60,
        "name": "Shooting Star Return",
        "rarity": "milspec",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0HdUuqkw9bsXlRsdVUYpbKqJBNp3fTbZTxQ09C3hoeO2fLyNb2IkjMJ7Md33LvEoo733gLnqEdlNmmlcdLEcFA5YlDY_Fm7lO_xxcjr7_SjeSI"
    }, {
        "item_id": 61,
        "name": "Ivette",
        "rarity": "milspec",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0HdUuqkw9bsXlRsdVUYv6ygPxNl7P_JYzpHotnkzdmNwqT3MemHxzkIu5x1i7nFpNun2AO1-kNqam6gLNTEIABoM13Oug_p6VrWLb8"
    },
    {
        "item_id": 62,
        "name": "Shave Master",
        "rarity": "milspec",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0HdUuqkw9bsXlRsdVUYpbKkPQJf3vLbZThQ09C3hoeO2a71YO6IxjwEv8RyieiRptWsiwy1_EdlYGj3co_DIQ49MA2DrAO5k7rxxcjrXp0NRHY"
    }, {
        "item_id": 63,
        "name": "Flickshot",
        "rarity": "milspec",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0HdUuqkw9bsXlRsdVUYsLasKAxz2_zcTjFD_tuz2tmPwqL1ZLjSxTNVupYnjLGWrdrx2QCx-EZqMTvxINLGJ1M3aVnW-AeggbC45JyYoBc"
    },
    {
        "item_id": 64,
        "name": "Unicorn",
        "rarity": "milspec",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0HdUuqkw9bsXlRsdVUYo7SsKAhy3czEcC9F6ZKzx9Pczq_xZeiFlToAu5F3iLmQotyh2gLt_hJkYm33I4TAcQE5ZwmB5BHglvspMyTq"
    },
    {
        "item_id": 65,
        "name": "Chabo",
        "rarity": "milspec",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0HdUuqkw9bsXlRsdVUYtbKsKAxl3czEcC9F6ZLiwtmKxKejY-mIxzlUu5Mlj-iRo4iijlbm8hVtYT-gJI_Gcw49NVjY5BHgloKCNJl_"
    },
    {
        "item_id": 66,
        "name": "Martha",
        "rarity": "restricted",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0HdUuqkw9bsXlRsdVUYu7u3Pw9h7P_JYzpHooTjx9iKxK6iN-zQxGpQu8Enj-uV9Nyg0QHnrxBpZG6gLdWTJAU6aF_Oug_pyRaZiAE"
    },
    {
        "item_id": 67,
        "name": "Hamster Hawk",
        "rarity": "restricted",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0HdUuqkw9bsXlRsdVUYvruoOBNlwczAcCpJ09C3hoeO2aLxa-PQlToAscd0j7mXo9Sn2Qzg-0Roajjxdo7Hcw9rNA3ZqVTtlL3xxcjroHmY684"
    },
    {
        "item_id": 68,
        "name": "Rising Skull",
        "rarity": "restricted",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0HdUuqkw9bsXlRsdVUYpbGwJwtf3_LadjgMu4y1w9nSkq_3Ne-JwzhX6sEmiezDp9qmiQDh-EFqZmHyJoeTdQ9oMEaQpAZ5QeqR4w"
    },
    {
        "item_id": 69,
        "name": "Tamara",
        "rarity": "restricted",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0HdUuqkw9bsXlRsdVUYoruoKhVh7P_JYzpHoonhktLbxq6gZOuIzmpXuMQg0rjC8dX2ilaw_RJqam2iLYHBIwI9ZwrOug_p2sthS4I"
    },
    {
        "item_id": 70,
        "name": "Kawaii Killer Terrorist",
        "rarity": "restricted",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0HdUuqkw9bsXlRsdVUYvbuyKg5p2PrEfThQ08iJmIGZkPK6Mb6DwWhSvZQjjrmUrduj3wWw8hBoYmzyJtPBcVc5YljW_ge4x7zog4j84sobPm_q3w"
    },
    {
        "item_id": 71,
        "name": "Kawaii Killer CT",
        "rarity": "restricted",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0HdUuqkw9bsXlRsdVUYvbuyKg5p2PrEfThQ09C3hoeO2aajMbqDwj8FvJEi0u2S89yg2gSy-UVpZD30ddKRJwJvYFvV-VO4w7zxxcjruk-B2-E"
    },
    {
        "item_id": 72,
        "name": "Blood Boiler",
        "rarity": "classified",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0HdUuqkw9bsXlRsdVUYtLaqJANf0fzBfThQ09C3hoeO2fWiYbnVwD0F65Yp3eyXo9z23AHs-xBqMj_0JNPAdFM8MA6C_VXrxOfxxcjrWgUGmwE"
    },
    {
        "item_id": 73,
        "name": "Drug War Veteran",
        "rarity": "classified",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0HdUuqkw9bsXlRsdVUYsqiwLBBhweXNZThQ7dKJmIGZkPK6ZumCwz0Iv5wgi7jA8dqg3A3t-kA9YWuiJtOTewRrYFrW-gC_w7i9goj84sqrRSDlQw"
    },
    {
        "item_id": 74,
        "name": "Rekt",
        "rarity": "classified",
        "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0HdUuqkw9bsXlRsdVUYpL-uPzhs0uHPdHNH6d63w9PclvH3Nb-FlG5VsJYijLGU99Siig3tqhFpa27xJ4eRI1Q-fxiOrQGv-foz"
    }
    ]
}
