
var Quality = [{
    "name": ["Battle-Scarred", "Закалённое в боях"],
    "names": {
        "EN": "Battle-Scarred",
        "RU": "Закалённое в боях",
    },
    "chance": 50
}, {
    "name": ["Well-Worn", "Поношенное"],
    "names": {
        "EN": "Well-Worn",
        "RU": "Поношенное",
    },
    "chance": 40
}, {
    "name": ["Field-Tested", "После полевых испытаний"],
    "names": {
        "EN": "Field-Tested",
        "RU": "После полевых испытаний",
    },
    "chance": 30
}, {
    "name": ["Minimal Wear", "Немного поношенное"],
    "names": {
        "EN": "Minimal Wear",
        "RU": "Немного поношенное",
    },
    "chance": 20
}, {
    "name": ["Factory New", "Прямо с завода"],
    "names": {
        "EN": "Factory New",
        "RU": "Прямо с завода",
    },
    "chance": 10
}];

function getQualityName(fil, lang) {
    var num = 0;
    if (typeof lang == 'undefined') lang = Settings.language;
    if (typeof fil == 'number' && fil < Quality.length) {
        return Quality[fil].names[Settings.language];
    }
    if (lang == 'RU') num = 1
    var qua = Quality.filter(function(obj) {
        return obj.name.indexOf(fil) != -1;
    })
    if (qua.length != 0) {
        return qua[0].name[num];
    } else {
        console.error("Wrong quality! '" + fil + "'");
        return "Wrong quality name";
    }
}

function getNextQuality(quality) {
    var nextQuality = quality.toLowerCase();
    if (typeof nextQuality == 'string') {
        for (var i = 0; i < Quality.length; i++)
            for (var z = 0; z < Quality[i].name.length; z++)
                if (nextQuality == Quality[i].name[z].toLowerCase()) {
                    if (i != Quality.length - 1) {
                        nextQuality = Quality[i + 1].name[z];
                    } else {
                        nextQuality = Quality[i].name[z];
                    }
                    break;
                }
    }

    return nextQuality;
}

function getItemQuality() {
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
            return i;
        }
    }
}