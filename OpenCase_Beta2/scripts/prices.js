var DEBUG = false;

function getPrice(item_id, opt) {
    opt = opt || {};
    var quality = typeof opt.quality !== 'undefined' ? opt.quality : 0;
    var stattrak = typeof opt.stattrak !== 'undefined' ? opt.stattrak : false;
    var souvenir = typeof opt.souvenir !== 'undefined' ? opt.souvenir : false;
    var type = typeof opt.type !== 'undefined' ? opt.type : "";
    var name = typeof opt.name !== 'undefined' ? opt.name : "";
    var cat = stattrak == true ? 'stattrak' : souvenir == true ? 'souvenir' : 'default';
    var item = Prices[item_id];
    if (typeof item == 'undefined') {
        if (type != '' && name != '') {
            for (var key in Prices) {
                if (Prices[key].item_id == item_id || (Prices[key].type == type && Prices[key].skinName == name)) {
                    item = Prices[key]
                    break;
                }
            }
        } else {
            return 0;
        }
    }
    var prices = item.prices[cat] ? item.prices[cat][quality] : 0;
    var price = 0;
    if (typeof prices == 'undefined') return price;
    if (prices.market != -1) price = prices.market;
    else if (prices.analyst != -1) price = prices.analyst;
    else if (prices.opskins != -1) price = prices.opskins
    return price;
}

function getPriceWithNewQuality(item_id, opt) {
    opt = opt || {};
    var price = getPrice(item_id, opt);
    if (price == 0 || price == -1) {
        for (var i = 0; i < Quality.length; i++) {
            opt.quality = i;
            price = getPrice(item_id, opt);
            if (price != 0) break;
        }
    }
    return {
        price: price,
        quality: opt.quality
    };
}
var Prices = {
  "0": {
    "item_id": 0,
    "type": "M249",
    "skinName": "Jungle DDPAT",
    "prices": {
      "default": {
        "0": {
          "market": 0.72,
          "analyst": 0.59,
          "opskins": 0.95
        },
        "1": {
          "market": 0.86,
          "analyst": -1,
          "opskins": 0.37
        },
        "2": {
          "market": 0.53,
          "analyst": 0.29,
          "opskins": 0.28
        },
        "3": {
          "market": 0.44,
          "analyst": 0.35,
          "opskins": 0.69
        },
        "4": {
          "market": 3.42,
          "analyst": 3.28,
          "opskins": 5.95
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "1": {
    "item_id": 1,
    "type": "Tec-9",
    "skinName": "Tornado",
    "prices": {
      "default": {
        "0": {
          "market": 0.41,
          "analyst": 0.32,
          "opskins": 0.4
        },
        "1": {
          "market": 0.49,
          "analyst": 0.54,
          "opskins": 0.74
        },
        "2": {
          "market": 0.34,
          "analyst": 0.52,
          "opskins": 9.98
        },
        "3": {
          "market": 0.73,
          "analyst": 0.53,
          "opskins": 0.6
        },
        "4": {
          "market": 6.72,
          "analyst": 5.22,
          "opskins": 4.49
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "2": {
    "item_id": 2,
    "type": "MP9",
    "skinName": "Dry Season",
    "prices": {
      "default": {
        "0": {
          "market": 0.41,
          "analyst": 0.4,
          "opskins": 5
        },
        "1": {
          "market": 0.76,
          "analyst": 1.59,
          "opskins": 0.77
        },
        "2": {
          "market": 0.49,
          "analyst": 0.29,
          "opskins": 0.26
        },
        "3": {
          "market": 0.41,
          "analyst": 0.38,
          "opskins": 1
        },
        "4": {
          "market": 2.14,
          "analyst": 2.87,
          "opskins": 2.71
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "3": {
    "item_id": 3,
    "type": "Five-SeveN",
    "skinName": "Anodized Gunmetal",
    "prices": {
      "default": {
        "3": {
          "market": 1.54,
          "analyst": 1.07,
          "opskins": 0.96
        },
        "4": {
          "market": 1.49,
          "analyst": 1.1,
          "opskins": 0.98
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "4": {
    "item_id": 4,
    "type": "XM1014",
    "skinName": "Jungle",
    "prices": {
      "default": {
        "0": {
          "market": 0.35,
          "analyst": 0.49,
          "opskins": 0.75
        },
        "1": {
          "market": 0.71,
          "analyst": 0.54,
          "opskins": 0.98
        },
        "2": {
          "market": 0.23,
          "analyst": 0.31,
          "opskins": 0.75
        },
        "3": {
          "market": 0.45,
          "analyst": 0.41,
          "opskins": 2
        },
        "4": {
          "market": 2.83,
          "analyst": 3,
          "opskins": 3.34
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "5": {
    "item_id": 5,
    "type": "MP7",
    "skinName": "Groundwater",
    "prices": {
      "default": {
        "0": {
          "market": 0.93,
          "analyst": 0.79,
          "opskins": 3.98
        },
        "1": {
          "market": 0.47,
          "analyst": 0.61,
          "opskins": 0.88
        },
        "2": {
          "market": 0.44,
          "analyst": 0.28,
          "opskins": 0.49
        },
        "3": {
          "market": 0.53,
          "analyst": 0.44,
          "opskins": 0.44
        },
        "4": {
          "market": 5.07,
          "analyst": 8.15,
          "opskins": 9.98
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "6": {
    "item_id": 6,
    "type": "Glock-18",
    "skinName": "Sand Dune",
    "prices": {
      "default": {
        "0": {
          "market": 1.09,
          "analyst": 0.92,
          "opskins": 0.81
        },
        "1": {
          "market": 1.02,
          "analyst": 0.73,
          "opskins": 0.9
        },
        "2": {
          "market": 0.75,
          "analyst": 0.5,
          "opskins": 1.83
        },
        "3": {
          "market": 1.9,
          "analyst": 1.47,
          "opskins": 1.94
        },
        "4": {
          "market": 14,
          "analyst": 14.79,
          "opskins": 15.75
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "7": {
    "item_id": 7,
    "type": "SSG 08",
    "skinName": "Mayan Dreams",
    "prices": {
      "default": {
        "0": {
          "market": 0.83,
          "analyst": 0.69,
          "opskins": 1.1
        },
        "1": {
          "market": 0.93,
          "analyst": 0.49,
          "opskins": 0.45
        },
        "2": {
          "market": 0.55,
          "analyst": 0.43,
          "opskins": 0.47
        },
        "3": {
          "market": 1.41,
          "analyst": 1.25,
          "opskins": 1.29
        },
        "4": {
          "market": 15.7,
          "analyst": 18.66,
          "opskins": 18.75
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "8": {
    "item_id": 8,
    "type": "Negev",
    "skinName": "Palm",
    "prices": {
      "default": {
        "0": {
          "market": 0.64,
          "analyst": 0.98,
          "opskins": 2
        },
        "1": {
          "market": 1,
          "analyst": -1,
          "opskins": 2.49
        },
        "2": {
          "market": 0.54,
          "analyst": 0.43,
          "opskins": 0.55
        },
        "3": {
          "market": 1.01,
          "analyst": 0.95,
          "opskins": 1.6
        },
        "4": {
          "market": 13.68,
          "analyst": 14.79,
          "opskins": 44.44
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "9": {
    "item_id": 9,
    "type": "Sawed-Off",
    "skinName": "Mosaico",
    "prices": {
      "default": {
        "0": {
          "market": 0.85,
          "analyst": 1.56,
          "opskins": 2.15
        },
        "1": {
          "market": 0.69,
          "analyst": 0.73,
          "opskins": 0.79
        },
        "2": {
          "market": 0.53,
          "analyst": 0.45,
          "opskins": 0.7
        },
        "3": {
          "market": 1.03,
          "analyst": 1.13,
          "opskins": 1.23
        },
        "4": {
          "market": 21.44,
          "analyst": 18.72,
          "opskins": 45
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "10": {
    "item_id": 10,
    "type": "P250",
    "skinName": "Facets",
    "prices": {
      "default": {
        "0": {
          "market": 0.69,
          "analyst": 0.47,
          "opskins": 1
        },
        "1": {
          "market": 2.51,
          "analyst": 1.54,
          "opskins": 164.89
        },
        "2": {
          "market": 0.58,
          "analyst": 0.53,
          "opskins": 175.92
        },
        "3": {
          "market": 1.37,
          "analyst": 1.11,
          "opskins": 1.08
        },
        "4": {
          "market": 16.24,
          "analyst": 10.94,
          "opskins": 10.92
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "11": {
    "item_id": 11,
    "type": "MAG-7",
    "skinName": "Hazard",
    "prices": {
      "default": {
        "0": {
          "market": 2.87,
          "analyst": 5.25,
          "opskins": 4.75
        },
        "1": {
          "market": 4.58,
          "analyst": 35.44,
          "opskins": 49.99
        },
        "2": {
          "market": 1.45,
          "analyst": 1.11,
          "opskins": 3.7
        },
        "3": {
          "market": 5.53,
          "analyst": 4.19,
          "opskins": 3.78
        },
        "4": {
          "market": 15.33,
          "analyst": 92.73,
          "opskins": 84.85
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "12": {
    "item_id": 12,
    "type": "PP-Bizon",
    "skinName": "Rust Coat",
    "prices": {
      "default": {
        "0": {
          "market": 3.79,
          "analyst": 3.92,
          "opskins": 3.29
        },
        "1": {
          "market": 1.45,
          "analyst": 3.13,
          "opskins": 5.65
        },
        "2": {
          "market": 1.45,
          "analyst": 1.74,
          "opskins": 1.7
        },
        "3": {
          "market": 2.5,
          "analyst": 3.81,
          "opskins": 3.33
        },
        "4": {
          "market": 7.58,
          "analyst": 9.38,
          "opskins": 10.98
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "13": {
    "item_id": 13,
    "type": "AUG",
    "skinName": "Anodized Navy",
    "prices": {
      "default": {
        "3": {
          "market": 5.09,
          "analyst": 7.85,
          "opskins": 13.55
        },
        "4": {
          "market": 7.07,
          "analyst": 5.75,
          "opskins": 5.99
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "14": {
    "item_id": 14,
    "type": "FAMAS",
    "skinName": "Spitfire",
    "prices": {
      "default": {
        "0": {
          "market": 1.6,
          "analyst": 1.32,
          "opskins": 1.46
        },
        "1": {
          "market": 3.35,
          "analyst": 3.51,
          "opskins": 3.11
        },
        "2": {
          "market": 2.95,
          "analyst": 2.93,
          "opskins": 2.62
        },
        "3": {
          "market": 15.38,
          "analyst": 13.82,
          "opskins": 12.21
        },
        "4": {
          "market": 110,
          "analyst": 104.15,
          "opskins": 85
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "15": {
    "item_id": 15,
    "type": "SCAR-20",
    "skinName": "Emerald",
    "prices": {
      "default": {
        "3": {
          "market": 7.44,
          "analyst": 7.48,
          "opskins": 6.3
        },
        "4": {
          "market": 3.5,
          "analyst": 2.88,
          "opskins": 2.39
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "16": {
    "item_id": 16,
    "type": "SG 553",
    "skinName": "Tornado",
    "prices": {
      "default": {
        "0": {
          "market": 0.96,
          "analyst": 0.99,
          "opskins": 0.88
        },
        "1": {
          "market": 1.03,
          "analyst": 0.9,
          "opskins": 25
        },
        "2": {
          "market": 0.97,
          "analyst": 0.92,
          "opskins": 1.83
        },
        "3": {
          "market": 1.59,
          "analyst": 1.11,
          "opskins": 1.5
        },
        "4": {
          "market": 3.98,
          "analyst": 4.37,
          "opskins": 9.33
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "17": {
    "item_id": 17,
    "type": "UMP-45",
    "skinName": "Caramel",
    "prices": {
      "default": {
        "0": {
          "market": 1.01,
          "analyst": 0.92,
          "opskins": 0.8
        },
        "1": {
          "market": 1.34,
          "analyst": 0.99,
          "opskins": 1.14
        },
        "2": {
          "market": 1.09,
          "analyst": 0.95,
          "opskins": 1.38
        },
        "3": {
          "market": 2.22,
          "analyst": 1.75,
          "opskins": 1.5
        },
        "4": {
          "market": 9.75,
          "analyst": 7.36,
          "opskins": 6.59
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "18": {
    "item_id": 18,
    "type": "Five-SeveN",
    "skinName": "Candy Apple",
    "prices": {
      "default": {
        "2": {
          "market": 7.19,
          "analyst": 6.45,
          "opskins": 8.15
        },
        "3": {
          "market": 7.95,
          "analyst": 6.49,
          "opskins": 6.19
        },
        "4": {
          "market": 9.11,
          "analyst": 7.6,
          "opskins": 7.39
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "19": {
    "item_id": 19,
    "type": "AUG",
    "skinName": "Hot Rod",
    "prices": {
      "default": {
        "3": {
          "market": 50.68,
          "analyst": 64.3,
          "opskins": 59
        },
        "4": {
          "market": 58.32,
          "analyst": 50.54,
          "opskins": 50.27
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "20": {
    "item_id": 20,
    "type": "Negev",
    "skinName": "Anodized Navy",
    "prices": {
      "default": {
        "3": {
          "market": 50.77,
          "analyst": 73.9,
          "opskins": 63.16
        },
        "4": {
          "market": 45.45,
          "analyst": 46.34,
          "opskins": 44.44
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "21": {
    "item_id": 21,
    "type": "Glock-18",
    "skinName": "Fade",
    "prices": {
      "default": {
        "3": {
          "market": 236.7,
          "analyst": 248.39,
          "opskins": 209.99
        },
        "4": {
          "market": 262.36,
          "analyst": 227.94,
          "opskins": 192.63
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "22": {
    "item_id": 22,
    "type": "MP9",
    "skinName": "Bulldozer",
    "prices": {
      "default": {
        "0": {
          "market": 4.13,
          "analyst": 2.87,
          "opskins": 12.84
        },
        "1": {
          "market": 4.42,
          "analyst": 4.85,
          "opskins": 15
        },
        "2": {
          "market": 3.96,
          "analyst": 3.24,
          "opskins": 2.99
        },
        "3": {
          "market": 17.58,
          "analyst": 16.81,
          "opskins": 14.79
        },
        "4": {
          "market": -1,
          "analyst": 434,
          "opskins": 439
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "23": {
    "item_id": 23,
    "type": "Nova",
    "skinName": "Forest Leaves",
    "prices": {
      "default": {
        "0": {
          "market": 0.2,
          "analyst": 0.22,
          "opskins": 0.6
        },
        "1": {
          "market": 0.22,
          "analyst": 0.94,
          "opskins": 0.96
        },
        "2": {
          "market": 0.19,
          "analyst": 0.14,
          "opskins": 0.12
        },
        "3": {
          "market": 0.38,
          "analyst": 0.29,
          "opskins": 0.21
        },
        "4": {
          "market": 2.83,
          "analyst": 2.37,
          "opskins": 2.59
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "24": {
    "item_id": 24,
    "type": "Five-SeveN",
    "skinName": "Jungle",
    "prices": {
      "default": {
        "0": {
          "market": 0.2,
          "analyst": 0.15,
          "opskins": 0.14
        },
        "1": {
          "market": 0.37,
          "analyst": 0.24,
          "opskins": 0.19
        },
        "2": {
          "market": 0.17,
          "analyst": 0.15,
          "opskins": 0.25
        },
        "3": {
          "market": 0.46,
          "analyst": 0.35,
          "opskins": 0.31
        },
        "4": {
          "market": 3.54,
          "analyst": 2.55,
          "opskins": 2.49
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "25": {
    "item_id": 25,
    "type": "SSG 08",
    "skinName": "Lichen Dashed",
    "prices": {
      "default": {
        "0": {
          "market": 0.28,
          "analyst": 0.25,
          "opskins": 1.59
        },
        "1": {
          "market": 0.26,
          "analyst": 0.22,
          "opskins": 9.87
        },
        "2": {
          "market": 0.17,
          "analyst": 0.19,
          "opskins": 0.52
        },
        "3": {
          "market": 0.44,
          "analyst": 0.33,
          "opskins": 0.31
        },
        "4": {
          "market": 3.51,
          "analyst": 3.05,
          "opskins": 2.62
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "26": {
    "item_id": 26,
    "type": "AK-47",
    "skinName": "Jungle Spray",
    "prices": {
      "default": {
        "0": {
          "market": 1.07,
          "analyst": 0.79,
          "opskins": 0.69
        },
        "1": {
          "market": 1.35,
          "analyst": 0.99,
          "opskins": 0.89
        },
        "2": {
          "market": 0.83,
          "analyst": 0.57,
          "opskins": 0.56
        },
        "3": {
          "market": 2.13,
          "analyst": 1.49,
          "opskins": 1.43
        },
        "4": {
          "market": 19.87,
          "analyst": 15.09,
          "opskins": 13.86
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "27": {
    "item_id": 27,
    "type": "M4A4",
    "skinName": "Jungle Tiger",
    "prices": {
      "default": {
        "0": {
          "market": 0.83,
          "analyst": 0.59,
          "opskins": 0.65
        },
        "1": {
          "market": 0.93,
          "analyst": 0.71,
          "opskins": 0.66
        },
        "2": {
          "market": 0.81,
          "analyst": 0.54,
          "opskins": 0.63
        },
        "3": {
          "market": 1.74,
          "analyst": 1.33,
          "opskins": 1.15
        },
        "4": {
          "market": 12.27,
          "analyst": 10.2,
          "opskins": 9.5
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "28": {
    "item_id": 28,
    "type": "Tec-9",
    "skinName": "Ossified",
    "prices": {
      "default": {
        "3": {
          "market": 1.87,
          "analyst": 1.66,
          "opskins": 1.41
        },
        "4": {
          "market": 0.64,
          "analyst": 0.48,
          "opskins": 0.42
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "29": {
    "item_id": 29,
    "type": "MP9",
    "skinName": "Green Plaid",
    "prices": {
      "default": {
        "0": {
          "market": 0.91,
          "analyst": 1.16,
          "opskins": 0.66
        },
        "1": {
          "market": 0.95,
          "analyst": 0.87,
          "opskins": 2
        },
        "2": {
          "market": 0.38,
          "analyst": 0.18,
          "opskins": 0.41
        },
        "3": {
          "market": 0.28,
          "analyst": 0.21,
          "opskins": 0.25
        },
        "4": {
          "market": 0.47,
          "analyst": 0.48,
          "opskins": 0.69
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "30": {
    "item_id": 30,
    "type": "CZ75-Auto",
    "skinName": "Green Plaid",
    "prices": {
      "default": {
        "0": {
          "market": 0.44,
          "analyst": 0.69,
          "opskins": 0.63
        },
        "1": {
          "market": 0.53,
          "analyst": 0.92,
          "opskins": 0.73
        },
        "2": {
          "market": 0.19,
          "analyst": 0.24,
          "opskins": 0.26
        },
        "3": {
          "market": 0.23,
          "analyst": 0.23,
          "opskins": 1.49
        },
        "4": {
          "market": 0.51,
          "analyst": 0.55,
          "opskins": 0.54
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "31": {
    "item_id": 31,
    "type": "G3SG1",
    "skinName": "Contractor",
    "prices": {
      "default": {
        "0": {
          "market": 0.51,
          "analyst": 0.23,
          "opskins": 1.36
        },
        "1": {
          "market": 0.34,
          "analyst": 1.14,
          "opskins": 4.97
        },
        "2": {
          "market": 0.18,
          "analyst": 0.2,
          "opskins": 1.03
        },
        "3": {
          "market": 0.25,
          "analyst": 0.22,
          "opskins": 0.3
        },
        "4": {
          "market": 1.44,
          "analyst": 1.44,
          "opskins": 1.88
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "32": {
    "item_id": 32,
    "type": "MP7",
    "skinName": "Olive Plaid",
    "prices": {
      "default": {
        "0": {
          "market": 1.71,
          "analyst": 2.45,
          "opskins": 8.32
        },
        "1": {
          "market": 0.57,
          "analyst": 1.29,
          "opskins": 1.21
        },
        "2": {
          "market": 0.28,
          "analyst": 0.2,
          "opskins": 0.69
        },
        "3": {
          "market": 0.29,
          "analyst": 0.23,
          "opskins": 0.2
        },
        "4": {
          "market": 0.46,
          "analyst": 0.45,
          "opskins": 0.46
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "33": {
    "item_id": 33,
    "type": "SSG 08",
    "skinName": "Sand Dune",
    "prices": {
      "default": {
        "0": {
          "market": 0.59,
          "analyst": 0.38,
          "opskins": 0.34
        },
        "1": {
          "market": 0.41,
          "analyst": 0.41,
          "opskins": 0.51
        },
        "2": {
          "market": 0.34,
          "analyst": 0.21,
          "opskins": 0.19
        },
        "3": {
          "market": 0.98,
          "analyst": 0.57,
          "opskins": 0.73
        },
        "4": {
          "market": 5.28,
          "analyst": 6.11,
          "opskins": 12.63
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "34": {
    "item_id": 34,
    "type": "MAC-10",
    "skinName": "Commuter",
    "prices": {
      "default": {
        "0": {
          "market": 2.18,
          "analyst": 0.45,
          "opskins": 0.49
        },
        "1": {
          "market": 0.49,
          "analyst": 0.38,
          "opskins": 496.14
        },
        "2": {
          "market": 0.52,
          "analyst": 0.36,
          "opskins": 3
        },
        "3": {
          "market": 0.87,
          "analyst": 0.68,
          "opskins": 0.63
        },
        "4": {
          "market": 2.57,
          "analyst": 2.52,
          "opskins": 2.78
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "35": {
    "item_id": 35,
    "type": "P2000",
    "skinName": "Coach Class",
    "prices": {
      "default": {
        "0": {
          "market": 0.53,
          "analyst": 0.4,
          "opskins": 0.33
        },
        "1": {
          "market": 0.46,
          "analyst": 0.34,
          "opskins": 0.73
        },
        "2": {
          "market": 0.52,
          "analyst": 0.34,
          "opskins": 0.45
        },
        "3": {
          "market": 0.7,
          "analyst": 0.58,
          "opskins": 0.5
        },
        "4": {
          "market": 1.79,
          "analyst": 1.64,
          "opskins": 1.66
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "36": {
    "item_id": 36,
    "type": "P90",
    "skinName": "Leather",
    "prices": {
      "default": {
        "0": {
          "market": 0.49,
          "analyst": 0.47,
          "opskins": 0.46
        },
        "1": {
          "market": 0.48,
          "analyst": 0.36,
          "opskins": 0.4
        },
        "2": {
          "market": 0.53,
          "analyst": 0.37,
          "opskins": 0.34
        },
        "3": {
          "market": 0.75,
          "analyst": 0.55,
          "opskins": 0.47
        },
        "4": {
          "market": 1.92,
          "analyst": 1.73,
          "opskins": 1.54
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "37": {
    "item_id": 37,
    "type": "SG 553",
    "skinName": "Traveler",
    "prices": {
      "default": {
        "0": {
          "market": 0.5,
          "analyst": 0.47,
          "opskins": 0.34
        },
        "1": {
          "market": 0.46,
          "analyst": 0.32,
          "opskins": 0.83
        },
        "2": {
          "market": 0.5,
          "analyst": 0.34,
          "opskins": 1.46
        },
        "3": {
          "market": 0.71,
          "analyst": 0.5,
          "opskins": 0.5
        },
        "4": {
          "market": 1.63,
          "analyst": 1.72,
          "opskins": 1.58
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "38": {
    "item_id": 38,
    "type": "USP-S",
    "skinName": "Business Class",
    "prices": {
      "default": {
        "0": {
          "market": 4.1,
          "analyst": 4.62,
          "opskins": 4.66
        },
        "1": {
          "market": 3.88,
          "analyst": 2.1,
          "opskins": 3.46
        },
        "2": {
          "market": 3.05,
          "analyst": 2.3,
          "opskins": 2.7
        },
        "3": {
          "market": 5.39,
          "analyst": 4.68,
          "opskins": 5
        },
        "4": {
          "market": 14.67,
          "analyst": 14.94,
          "opskins": 14.65
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "39": {
    "item_id": 39,
    "type": "Sawed-Off",
    "skinName": "First Class",
    "prices": {
      "default": {
        "0": {
          "market": 3.81,
          "analyst": 2.37,
          "opskins": 3.17
        },
        "1": {
          "market": 6.83,
          "analyst": 13.12,
          "opskins": 12.2
        },
        "2": {
          "market": 2.69,
          "analyst": 2.6,
          "opskins": 7.54
        },
        "3": {
          "market": 2.81,
          "analyst": 2.57,
          "opskins": 2.33
        },
        "4": {
          "market": 3.18,
          "analyst": 3.77,
          "opskins": 2.8
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "40": {
    "item_id": 40,
    "type": "XM1014",
    "skinName": "Red Leather",
    "prices": {
      "default": {
        "0": {
          "market": 2.7,
          "analyst": 3.14,
          "opskins": 5.06
        },
        "1": {
          "market": 2.39,
          "analyst": 2.56,
          "opskins": 20
        },
        "2": {
          "market": 2.4,
          "analyst": 1.95,
          "opskins": 3
        },
        "3": {
          "market": 2.71,
          "analyst": 2.28,
          "opskins": 2.32
        },
        "4": {
          "market": 3.75,
          "analyst": 3.37,
          "opskins": 2.99
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "41": {
    "item_id": 41,
    "type": "Desert Eagle",
    "skinName": "Pilot",
    "prices": {
      "default": {
        "0": {
          "market": 9.95,
          "analyst": 8.63,
          "opskins": 10.94
        },
        "1": {
          "market": 10.16,
          "analyst": 7.26,
          "opskins": 7.99
        },
        "2": {
          "market": 12.09,
          "analyst": 8.1,
          "opskins": 9.25
        },
        "3": {
          "market": 18.61,
          "analyst": 14.68,
          "opskins": 13.93
        },
        "4": {
          "market": 29.52,
          "analyst": 32.63,
          "opskins": 30
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "42": {
    "item_id": 42,
    "type": "MP7",
    "skinName": "Forest DDPAT",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.08,
          "analyst": 0.07,
          "opskins": 0.07
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "43": {
    "item_id": 43,
    "type": "Tec-9",
    "skinName": "Urban DDPAT",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.18,
          "analyst": 0.13,
          "opskins": 0.1
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "44": {
    "item_id": 44,
    "type": "Sawed-Off",
    "skinName": "Forest DDPAT",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "4": {
          "market": 0.08,
          "analyst": 0.06,
          "opskins": 0.09
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "45": {
    "item_id": 45,
    "type": "SG 553",
    "skinName": "Army Sheen",
    "prices": {
      "default": {
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "46": {
    "item_id": 46,
    "type": "Negev",
    "skinName": "Army Sheen",
    "prices": {
      "default": {
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "47": {
    "item_id": 47,
    "type": "Glock-18",
    "skinName": "Death Rattle",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.05,
          "opskins": 0.13
        },
        "1": {
          "market": 0.07,
          "analyst": 0.06,
          "opskins": 0.07
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.07
        },
        "3": {
          "market": 0.05,
          "analyst": 0.04,
          "opskins": 0.05
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "48": {
    "item_id": 48,
    "type": "MAC-10",
    "skinName": "Silver",
    "prices": {
      "default": {
        "3": {
          "market": 0.06,
          "analyst": 0.05,
          "opskins": 0.05
        },
        "4": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "49": {
    "item_id": 49,
    "type": "Nova",
    "skinName": "Caged Steel",
    "prices": {
      "default": {
        "2": {
          "market": 0.05,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "50": {
    "item_id": 50,
    "type": "G3SG1",
    "skinName": "Green Apple",
    "prices": {
      "default": {
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "4": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "51": {
    "item_id": 51,
    "type": "UMP-45",
    "skinName": "Carbon Fiber",
    "prices": {
      "default": {
        "3": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.1
        },
        "4": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.05
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "52": {
    "item_id": 52,
    "type": "Desert Eagle",
    "skinName": "Meteorite",
    "prices": {
      "default": {
        "2": {
          "market": 0.33,
          "analyst": 0.25,
          "opskins": 0.21
        },
        "3": {
          "market": 0.28,
          "analyst": 0.22,
          "opskins": 0.18
        },
        "4": {
          "market": 0.34,
          "analyst": 0.26,
          "opskins": 0.26
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "53": {
    "item_id": 53,
    "type": "Galil AR",
    "skinName": "Tuxedo",
    "prices": {
      "default": {
        "0": {
          "market": 0.1,
          "analyst": 0.08,
          "opskins": 0.08
        },
        "1": {
          "market": 0.25,
          "analyst": 0.15,
          "opskins": 0.17
        },
        "2": {
          "market": 0.12,
          "analyst": 0.08,
          "opskins": 0.08
        },
        "3": {
          "market": 0.2,
          "analyst": 0.14,
          "opskins": 0.12
        },
        "4": {
          "market": 0.37,
          "analyst": 0.28,
          "opskins": 0.27
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "54": {
    "item_id": 54,
    "type": "CZ75-Auto",
    "skinName": "Tuxedo",
    "prices": {
      "default": {
        "0": {
          "market": 0.1,
          "analyst": 0.08,
          "opskins": 0.09
        },
        "1": {
          "market": 0.14,
          "analyst": 0.15,
          "opskins": 0.13
        },
        "2": {
          "market": 0.11,
          "analyst": 0.08,
          "opskins": 0.08
        },
        "3": {
          "market": 0.18,
          "analyst": 0.12,
          "opskins": 0.11
        },
        "4": {
          "market": 0.33,
          "analyst": 0.25,
          "opskins": 0.21
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "55": {
    "item_id": 55,
    "type": "P250",
    "skinName": "Franklin",
    "prices": {
      "default": {
        "1": {
          "market": 0.77,
          "analyst": 0.64,
          "opskins": 0.52
        },
        "2": {
          "market": 0.46,
          "analyst": 0.4,
          "opskins": 0.33
        },
        "3": {
          "market": 0.66,
          "analyst": 0.59,
          "opskins": 0.47
        },
        "4": {
          "market": 1.07,
          "analyst": 0.88,
          "opskins": 0.67
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "56": {
    "item_id": 56,
    "type": "AUG",
    "skinName": "Radiation Hazard",
    "prices": {
      "default": {
        "0": {
          "market": 0.21,
          "analyst": 0.13,
          "opskins": 4
        },
        "1": {
          "market": 0.29,
          "analyst": 0.24,
          "opskins": 0.23
        },
        "2": {
          "market": 0.22,
          "analyst": 0.14,
          "opskins": 0.14
        },
        "3": {
          "market": 0.36,
          "analyst": 0.23,
          "opskins": 0.21
        },
        "4": {
          "market": 0.64,
          "analyst": 0.43,
          "opskins": 0.47
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.2,
          "analyst": 1.05,
          "opskins": 1.1
        },
        "1": {
          "market": 1.35,
          "analyst": 1.3,
          "opskins": 11.03
        },
        "2": {
          "market": 1.08,
          "analyst": 0.75,
          "opskins": 0.73
        },
        "3": {
          "market": 1.78,
          "analyst": 1.34,
          "opskins": 1.19
        },
        "4": {
          "market": 3.16,
          "analyst": 3.03,
          "opskins": 2.36
        }
      }
    }
  },
  "57": {
    "item_id": 57,
    "type": "Five-SeveN",
    "skinName": "Hot Shot",
    "prices": {
      "default": {
        "0": {
          "market": 0.13,
          "analyst": 0.1,
          "opskins": 0.1
        },
        "1": {
          "market": 0.15,
          "analyst": 0.11,
          "opskins": 0.1
        },
        "2": {
          "market": 0.18,
          "analyst": 0.13,
          "opskins": 0.29
        },
        "3": {
          "market": 0.3,
          "analyst": 0.22,
          "opskins": 0.18
        },
        "4": {
          "market": 1.35,
          "analyst": 1.06,
          "opskins": 0.89
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.52,
          "analyst": 0.55,
          "opskins": 0.49
        },
        "1": {
          "market": 0.64,
          "analyst": 0.65,
          "opskins": 0.7
        },
        "2": {
          "market": 0.74,
          "analyst": 0.71,
          "opskins": 0.66
        },
        "3": {
          "market": 2.34,
          "analyst": 2.5,
          "opskins": 2.37
        },
        "4": {
          "market": 11.4,
          "analyst": 10.36,
          "opskins": 10.5
        }
      }
    }
  },
  "58": {
    "item_id": 58,
    "type": "SG 553",
    "skinName": "Fallout Warning",
    "prices": {
      "default": {
        "0": {
          "market": 0.16,
          "analyst": 0.11,
          "opskins": 0.17
        },
        "1": {
          "market": 0.22,
          "analyst": 0.22,
          "opskins": 0.19
        },
        "2": {
          "market": 0.19,
          "analyst": 0.11,
          "opskins": 0.13
        },
        "3": {
          "market": 0.26,
          "analyst": 0.18,
          "opskins": 0.15
        },
        "4": {
          "market": 0.63,
          "analyst": 0.51,
          "opskins": 0.4
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.54,
          "analyst": 0.49,
          "opskins": 0.39
        },
        "1": {
          "market": 1.35,
          "analyst": 1.06,
          "opskins": 1.39
        },
        "2": {
          "market": 0.5,
          "analyst": 0.49,
          "opskins": 0.41
        },
        "3": {
          "market": 0.93,
          "analyst": 0.85,
          "opskins": 0.82
        },
        "4": {
          "market": 3.41,
          "analyst": 3.26,
          "opskins": 2.9
        }
      }
    }
  },
  "59": {
    "item_id": 59,
    "type": "Negev",
    "skinName": "Nuclear Waste",
    "prices": {
      "default": {
        "1": {
          "market": 0.23,
          "analyst": 0.22,
          "opskins": 0.17
        },
        "2": {
          "market": 0.21,
          "analyst": 0.12,
          "opskins": 0.12
        },
        "3": {
          "market": 0.25,
          "analyst": 0.17,
          "opskins": 0.17
        },
        "4": {
          "market": 0.34,
          "analyst": 0.24,
          "opskins": 0.18
        }
      },
      "stattrak": {},
      "souvenir": {
        "1": {
          "market": 1.09,
          "analyst": 1.29,
          "opskins": 1.06
        },
        "2": {
          "market": 0.32,
          "analyst": 0.33,
          "opskins": 0.28
        },
        "3": {
          "market": 0.55,
          "analyst": 0.48,
          "opskins": 0.42
        },
        "4": {
          "market": 1.07,
          "analyst": 0.86,
          "opskins": 0.76
        }
      }
    }
  },
  "60": {
    "item_id": 60,
    "type": "P250",
    "skinName": "Contamination",
    "prices": {
      "default": {
        "0": {
          "market": 0.14,
          "analyst": 0.11,
          "opskins": 0.2
        },
        "1": {
          "market": 0.21,
          "analyst": 0.15,
          "opskins": 0.14
        },
        "2": {
          "market": 0.19,
          "analyst": 0.12,
          "opskins": 0.22
        },
        "3": {
          "market": 0.26,
          "analyst": 0.18,
          "opskins": 0.16
        },
        "4": {
          "market": 0.54,
          "analyst": 0.43,
          "opskins": 0.36
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.43,
          "analyst": 0.41,
          "opskins": 0.36
        },
        "1": {
          "market": 0.98,
          "analyst": 0.93,
          "opskins": 0.95
        },
        "2": {
          "market": 0.41,
          "analyst": 0.38,
          "opskins": 0.29
        },
        "3": {
          "market": 0.99,
          "analyst": 0.98,
          "opskins": 0.78
        },
        "4": {
          "market": 3.16,
          "analyst": 3.17,
          "opskins": 3.88
        }
      }
    }
  },
  "61": {
    "item_id": 61,
    "type": "PP-Bizon",
    "skinName": "Chemical Green",
    "prices": {
      "default": {
        "0": {
          "market": 0.14,
          "analyst": 0.1,
          "opskins": 0.2
        },
        "1": {
          "market": 0.16,
          "analyst": 0.14,
          "opskins": 0.11
        },
        "2": {
          "market": 0.17,
          "analyst": 0.12,
          "opskins": 0.1
        },
        "3": {
          "market": 0.25,
          "analyst": 0.17,
          "opskins": 0.13
        },
        "4": {
          "market": 0.7,
          "analyst": 0.58,
          "opskins": 0.49
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.36,
          "analyst": 0.29,
          "opskins": 0.23
        },
        "1": {
          "market": 0.48,
          "analyst": 0.37,
          "opskins": 0.43
        },
        "2": {
          "market": 0.47,
          "analyst": 0.36,
          "opskins": 0.32
        },
        "3": {
          "market": 0.86,
          "analyst": 0.82,
          "opskins": 0.62
        },
        "4": {
          "market": 4.57,
          "analyst": 5.89,
          "opskins": 5
        }
      }
    }
  },
  "62": {
    "item_id": 62,
    "type": "XM1014",
    "skinName": "Bone Machine",
    "prices": {
      "default": {
        "0": {
          "market": 0.37,
          "analyst": 0.31,
          "opskins": 0.33
        },
        "1": {
          "market": 0.68,
          "analyst": 0.58,
          "opskins": 0.58
        },
        "2": {
          "market": 0.59,
          "analyst": 0.42,
          "opskins": 0.39
        },
        "3": {
          "market": 0.9,
          "analyst": 0.64,
          "opskins": 0.51
        },
        "4": {
          "market": 1.27,
          "analyst": 0.89,
          "opskins": 0.8
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.76,
          "analyst": 1.76,
          "opskins": 2.37
        },
        "1": {
          "market": 4.21,
          "analyst": 3.7,
          "opskins": 3.3
        },
        "2": {
          "market": 2.13,
          "analyst": 1.82,
          "opskins": 1.52
        },
        "3": {
          "market": 4.26,
          "analyst": 3.48,
          "opskins": 3
        },
        "4": {
          "market": 8.08,
          "analyst": 8.99,
          "opskins": 7.71
        }
      }
    }
  },
  "63": {
    "item_id": 63,
    "type": "Tec-9",
    "skinName": "Toxic",
    "prices": {
      "default": {
        "0": {
          "market": 0.92,
          "analyst": 0.68,
          "opskins": 0.65
        },
        "1": {
          "market": 1.96,
          "analyst": 1.66,
          "opskins": 1.36
        },
        "2": {
          "market": 1.15,
          "analyst": 0.87,
          "opskins": 0.73
        },
        "3": {
          "market": 2.39,
          "analyst": 1.91,
          "opskins": 1.54
        },
        "4": {
          "market": 4.08,
          "analyst": 3.32,
          "opskins": 2.7
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 3.38,
          "analyst": 3.17,
          "opskins": 3.4
        },
        "1": {
          "market": 6.5,
          "analyst": 8.19,
          "opskins": 7.99
        },
        "2": {
          "market": 3.58,
          "analyst": 3.84,
          "opskins": 3.5
        },
        "3": {
          "market": 10.62,
          "analyst": 10.94,
          "opskins": 11.33
        },
        "4": {
          "market": 25.82,
          "analyst": 29.98,
          "opskins": 26.32
        }
      }
    }
  },
  "64": {
    "item_id": 64,
    "type": "Glock-18",
    "skinName": "Reactor",
    "prices": {
      "default": {
        "0": {
          "market": 1.1,
          "analyst": 0.9,
          "opskins": 0.86
        },
        "1": {
          "market": 1.25,
          "analyst": 0.99,
          "opskins": 0.84
        },
        "2": {
          "market": 1.36,
          "analyst": 1.06,
          "opskins": 0.89
        },
        "3": {
          "market": 2.32,
          "analyst": 1.96,
          "opskins": 1.57
        },
        "4": {
          "market": 4.6,
          "analyst": 3.5,
          "opskins": 3.33
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 4.15,
          "analyst": 4.05,
          "opskins": 3.99
        },
        "1": {
          "market": 5.66,
          "analyst": 5.27,
          "opskins": 4.56
        },
        "2": {
          "market": 7.36,
          "analyst": 6.71,
          "opskins": 5.6
        },
        "3": {
          "market": 13.16,
          "analyst": 12.04,
          "opskins": 11
        },
        "4": {
          "market": 50,
          "analyst": 51.23,
          "opskins": 52
        }
      }
    }
  },
  "65": {
    "item_id": 65,
    "type": "MAC-10",
    "skinName": "Nuclear Garden",
    "prices": {
      "default": {
        "0": {
          "market": 0.37,
          "analyst": 0.25,
          "opskins": 1.18
        },
        "1": {
          "market": 0.56,
          "analyst": 0.4,
          "opskins": 0.49
        },
        "2": {
          "market": 0.48,
          "analyst": 0.39,
          "opskins": 0.43
        },
        "3": {
          "market": 0.86,
          "analyst": 0.61,
          "opskins": 0.6
        },
        "4": {
          "market": 1.06,
          "analyst": 0.84,
          "opskins": 0.71
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.15,
          "analyst": 1.06,
          "opskins": 2.5
        },
        "1": {
          "market": 1.92,
          "analyst": 1.93,
          "opskins": 1.88
        },
        "2": {
          "market": 1.32,
          "analyst": 1.24,
          "opskins": 1.96
        },
        "3": {
          "market": 2.96,
          "analyst": 2.76,
          "opskins": 2
        },
        "4": {
          "market": 6.9,
          "analyst": 6.92,
          "opskins": 7.99
        }
      }
    }
  },
  "66": {
    "item_id": 66,
    "type": "MP9",
    "skinName": "Setting Sun",
    "prices": {
      "default": {
        "0": {
          "market": 0.76,
          "analyst": 0.27,
          "opskins": 0.5
        },
        "1": {
          "market": 0.38,
          "analyst": 0.31,
          "opskins": 0.31
        },
        "2": {
          "market": 0.45,
          "analyst": 0.38,
          "opskins": 0.45
        },
        "3": {
          "market": 0.91,
          "analyst": 0.65,
          "opskins": 0.57
        },
        "4": {
          "market": 1.23,
          "analyst": 1.07,
          "opskins": 0.88
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.22,
          "analyst": 0.93,
          "opskins": 0.89
        },
        "1": {
          "market": 1.22,
          "analyst": 1.28,
          "opskins": 2.42
        },
        "2": {
          "market": 1.76,
          "analyst": 1.64,
          "opskins": 1.62
        },
        "3": {
          "market": 3.88,
          "analyst": 4.01,
          "opskins": 3.49
        },
        "4": {
          "market": 20.02,
          "analyst": 23.71,
          "opskins": 48.42
        }
      }
    }
  },
  "67": {
    "item_id": 67,
    "type": "FAMAS",
    "skinName": "Styx",
    "prices": {
      "default": {
        "0": {
          "market": 0.69,
          "analyst": 0.38,
          "opskins": 1.4
        },
        "1": {
          "market": 1.35,
          "analyst": 1,
          "opskins": 0.92
        },
        "2": {
          "market": 0.76,
          "analyst": 0.68,
          "opskins": 0.56
        },
        "3": {
          "market": 2.08,
          "analyst": 1.79,
          "opskins": 1.4
        },
        "4": {
          "market": 3.42,
          "analyst": 3.14,
          "opskins": 2.59
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 3.87,
          "analyst": 3.96,
          "opskins": 9
        },
        "1": {
          "market": 7.99,
          "analyst": 8.31,
          "opskins": 18.54
        },
        "2": {
          "market": 5.23,
          "analyst": 3.74,
          "opskins": 3.94
        },
        "3": {
          "market": 10.61,
          "analyst": 9.41,
          "opskins": 9.2
        },
        "4": {
          "market": 22.83,
          "analyst": 23.06,
          "opskins": 27.99
        }
      }
    }
  },
  "68": {
    "item_id": 68,
    "type": "Galil AR",
    "skinName": "Cerberus",
    "prices": {
      "default": {
        "0": {
          "market": 1.23,
          "analyst": 0.84,
          "opskins": 0.99
        },
        "1": {
          "market": 2.18,
          "analyst": 1.73,
          "opskins": 1.45
        },
        "2": {
          "market": 2.6,
          "analyst": 2.01,
          "opskins": 1.66
        },
        "3": {
          "market": 6.52,
          "analyst": 5.26,
          "opskins": 4.54
        },
        "4": {
          "market": 11.78,
          "analyst": 8.96,
          "opskins": 7.63
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 5.53,
          "analyst": 5.15,
          "opskins": 3.72
        },
        "1": {
          "market": 6.07,
          "analyst": 6.01,
          "opskins": 9.99
        },
        "2": {
          "market": 7.02,
          "analyst": 7.21,
          "opskins": 6.29
        },
        "3": {
          "market": 22.23,
          "analyst": 19.2,
          "opskins": 22
        },
        "4": {
          "market": 264.81,
          "analyst": 163.02,
          "opskins": 149.89
        }
      }
    }
  },
  "69": {
    "item_id": 69,
    "type": "M249",
    "skinName": "Impact Drill",
    "prices": {
      "default": {
        "0": {
          "market": 0.05,
          "analyst": 0.04,
          "opskins": 0.04
        },
        "1": {
          "market": 0.05,
          "analyst": 0.04,
          "opskins": 0.04
        },
        "2": {
          "market": 0.06,
          "analyst": 0.04,
          "opskins": 0.05
        },
        "3": {
          "market": 0.1,
          "analyst": 0.08,
          "opskins": 0.05
        },
        "4": {
          "market": 0.37,
          "analyst": 0.29,
          "opskins": 0.23
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "70": {
    "item_id": 70,
    "type": "SCAR-20",
    "skinName": "Army Sheen",
    "prices": {
      "default": {
        "2": {
          "market": 0.07,
          "analyst": 0.04,
          "opskins": 0.17
        },
        "3": {
          "market": 0.11,
          "analyst": 0.08,
          "opskins": 0.15
        },
        "4": {
          "market": 0.3,
          "analyst": 0.22,
          "opskins": 0.19
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "71": {
    "item_id": 71,
    "type": "MAG-7",
    "skinName": "Seabird",
    "prices": {
      "default": {
        "0": {
          "market": 0.05,
          "analyst": 0.04,
          "opskins": 0.09
        },
        "1": {
          "market": 0.12,
          "analyst": 0.05,
          "opskins": 0.08
        },
        "2": {
          "market": 0.05,
          "analyst": 0.04,
          "opskins": 0.09
        },
        "3": {
          "market": 0.11,
          "analyst": 0.08,
          "opskins": 0.07
        },
        "4": {
          "market": 0.41,
          "analyst": 0.31,
          "opskins": 0.99
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "72": {
    "item_id": 72,
    "type": "CZ75-Auto",
    "skinName": "Army Sheen",
    "prices": {
      "default": {
        "2": {
          "market": 0.08,
          "analyst": 0.06,
          "opskins": 0.05
        },
        "3": {
          "market": 0.11,
          "analyst": 0.08,
          "opskins": 0.06
        },
        "4": {
          "market": 0.3,
          "analyst": 0.23,
          "opskins": 0.2
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "73": {
    "item_id": 73,
    "type": "USP-S",
    "skinName": "Para Green",
    "prices": {
      "default": {
        "0": {
          "market": 0.39,
          "analyst": 0.26,
          "opskins": 0.47
        },
        "1": {
          "market": 0.6,
          "analyst": 0.47,
          "opskins": 0.49
        },
        "2": {
          "market": 0.34,
          "analyst": 0.26,
          "opskins": 0.23
        },
        "3": {
          "market": 0.65,
          "analyst": 0.5,
          "opskins": 0.42
        },
        "4": {
          "market": 1.96,
          "analyst": 1.68,
          "opskins": 1.42
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "74": {
    "item_id": 74,
    "type": "Desert Eagle",
    "skinName": "Night",
    "prices": {
      "default": {
        "0": {
          "market": 0.33,
          "analyst": 0.25,
          "opskins": 0.24
        },
        "1": {
          "market": 0.49,
          "analyst": 0.33,
          "opskins": 0.29
        },
        "2": {
          "market": 0.33,
          "analyst": 0.25,
          "opskins": 0.34
        },
        "3": {
          "market": 1.05,
          "analyst": 0.81,
          "opskins": 0.68
        },
        "4": {
          "market": 10.92,
          "analyst": 9,
          "opskins": -1
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "75": {
    "item_id": 75,
    "type": "Galil AR",
    "skinName": "Urban Rubble",
    "prices": {
      "default": {
        "0": {
          "market": 0.31,
          "analyst": 0.26,
          "opskins": 0.25
        },
        "1": {
          "market": 0.33,
          "analyst": 0.26,
          "opskins": 0.21
        },
        "2": {
          "market": 0.32,
          "analyst": 0.22,
          "opskins": 0.2
        },
        "3": {
          "market": 0.53,
          "analyst": 0.4,
          "opskins": 0.36
        },
        "4": {
          "market": 1.74,
          "analyst": 1.33,
          "opskins": 1.12
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "76": {
    "item_id": 76,
    "type": "Five-SeveN",
    "skinName": "Nitro",
    "prices": {
      "default": {
        "0": {
          "market": 0.84,
          "analyst": 0.74,
          "opskins": 0.69
        },
        "1": {
          "market": 0.93,
          "analyst": 0.76,
          "opskins": 0.83
        },
        "2": {
          "market": 0.88,
          "analyst": 0.77,
          "opskins": 0.75
        },
        "3": {
          "market": 1.32,
          "analyst": 0.98,
          "opskins": 0.92
        },
        "4": {
          "market": 6.28,
          "analyst": 6.09,
          "opskins": 6.11
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "77": {
    "item_id": 77,
    "type": "MAC-10",
    "skinName": "Fade",
    "prices": {
      "default": {
        "3": {
          "market": 5.44,
          "analyst": 4.37,
          "opskins": 4.47
        },
        "4": {
          "market": 2.82,
          "analyst": 2.1,
          "opskins": 2.06
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "78": {
    "item_id": 78,
    "type": "MP7",
    "skinName": "Full Stop",
    "prices": {
      "default": {
        "0": {
          "market": 0.89,
          "analyst": 0.85,
          "opskins": 0.65
        },
        "1": {
          "market": 1.54,
          "analyst": 0.97,
          "opskins": 0.9
        },
        "2": {
          "market": 0.88,
          "analyst": 0.8,
          "opskins": 0.66
        },
        "3": {
          "market": 1.17,
          "analyst": 0.95,
          "opskins": 0.77
        },
        "4": {
          "market": 1.7,
          "analyst": 1.39,
          "opskins": 1.21
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "79": {
    "item_id": 79,
    "type": "P250",
    "skinName": "Whiteout",
    "prices": {
      "default": {
        "0": {
          "market": 1.65,
          "analyst": 0.86,
          "opskins": 1
        },
        "1": {
          "market": 1.13,
          "analyst": 0.99,
          "opskins": 0.93
        },
        "2": {
          "market": 1.12,
          "analyst": 0.82,
          "opskins": 0.72
        },
        "3": {
          "market": 7.27,
          "analyst": 5.82,
          "opskins": 5.02
        },
        "4": {
          "market": 59.12,
          "analyst": 65.69,
          "opskins": 53.98
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "80": {
    "item_id": 80,
    "type": "CZ75-Auto",
    "skinName": "Emerald",
    "prices": {
      "default": {
        "3": {
          "market": 3.21,
          "analyst": 2.34,
          "opskins": 2.05
        },
        "4": {
          "market": 1.65,
          "analyst": 1.3,
          "opskins": 1.12
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "81": {
    "item_id": 81,
    "type": "Dual Berettas",
    "skinName": "Duelist",
    "prices": {
      "default": {
        "0": {
          "market": 6.64,
          "analyst": 7.76,
          "opskins": 7.59
        },
        "1": {
          "market": 6.76,
          "analyst": 6.39,
          "opskins": 5.67
        },
        "2": {
          "market": 6.86,
          "analyst": 5.86,
          "opskins": 5.75
        },
        "3": {
          "market": 8.02,
          "analyst": 7.65,
          "opskins": 7.13
        },
        "4": {
          "market": 11.2,
          "analyst": 10.12,
          "opskins": 9.7
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "82": {
    "item_id": 82,
    "type": "SG 553",
    "skinName": "Bulldozer",
    "prices": {
      "default": {
        "0": {
          "market": 6.74,
          "analyst": 7.14,
          "opskins": 6.89
        },
        "1": {
          "market": 7.51,
          "analyst": 12.57,
          "opskins": 11.95
        },
        "2": {
          "market": 7.19,
          "analyst": 5.44,
          "opskins": 5.37
        },
        "3": {
          "market": 9.14,
          "analyst": 7.43,
          "opskins": 7.64
        },
        "4": {
          "market": 20.1,
          "analyst": 15.76,
          "opskins": 15.26
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "83": {
    "item_id": 83,
    "type": "Glock-18",
    "skinName": "Twilight Galaxy",
    "prices": {
      "default": {
        "2": {
          "market": 10.8,
          "analyst": 7.68,
          "opskins": 7.67
        },
        "3": {
          "market": 11.01,
          "analyst": 8.1,
          "opskins": 6.99
        },
        "4": {
          "market": 13.61,
          "analyst": 10.14,
          "opskins": 8.99
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "84": {
    "item_id": 84,
    "type": "UMP-45",
    "skinName": "Indigo",
    "prices": {
      "default": {
        "0": {
          "market": 0.07,
          "analyst": 0.05,
          "opskins": 0.07
        },
        "1": {
          "market": 0.08,
          "analyst": 0.06,
          "opskins": 0.05
        },
        "2": {
          "market": 0.07,
          "analyst": 0.05,
          "opskins": 0.05
        },
        "3": {
          "market": 0.15,
          "analyst": 0.09,
          "opskins": 0.07
        },
        "4": {
          "market": 1.64,
          "analyst": 1.14,
          "opskins": 1.04
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.46,
          "analyst": 0.34,
          "opskins": 0.3
        },
        "1": {
          "market": 0.64,
          "analyst": 0.65,
          "opskins": 0.56
        },
        "2": {
          "market": 0.6,
          "analyst": 0.5,
          "opskins": 0.56
        },
        "3": {
          "market": 2.32,
          "analyst": 1.91,
          "opskins": 1.83
        },
        "4": {
          "market": 12.73,
          "analyst": 12.17,
          "opskins": 19.68
        }
      }
    }
  },
  "85": {
    "item_id": 85,
    "type": "Dual Berettas",
    "skinName": "Briar",
    "prices": {
      "default": {
        "2": {
          "market": 0.1,
          "analyst": 0.06,
          "opskins": 0.09
        },
        "3": {
          "market": 0.11,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "4": {
          "market": 0.34,
          "analyst": 0.21,
          "opskins": 0.19
        }
      },
      "stattrak": {},
      "souvenir": {
        "2": {
          "market": 0.27,
          "analyst": 0.25,
          "opskins": 0.26
        },
        "3": {
          "market": 0.24,
          "analyst": 0.25,
          "opskins": 0.24
        },
        "4": {
          "market": 0.58,
          "analyst": 0.38,
          "opskins": 0.35
        }
      }
    }
  },
  "86": {
    "item_id": 86,
    "type": "MAC-10",
    "skinName": "Indigo",
    "prices": {
      "default": {
        "0": {
          "market": 0.07,
          "analyst": 0.04,
          "opskins": 0.1
        },
        "1": {
          "market": 0.07,
          "analyst": 0.06,
          "opskins": 0.09
        },
        "2": {
          "market": 0.07,
          "analyst": 0.04,
          "opskins": 0.06
        },
        "3": {
          "market": 0.11,
          "analyst": 0.08,
          "opskins": 0.08
        },
        "4": {
          "market": 0.64,
          "analyst": 0.51,
          "opskins": 0.7
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.25,
          "analyst": 0.22,
          "opskins": 0.2
        },
        "1": {
          "market": 0.4,
          "analyst": 0.34,
          "opskins": 0.28
        },
        "2": {
          "market": 0.31,
          "analyst": 0.23,
          "opskins": 0.15
        },
        "3": {
          "market": 0.77,
          "analyst": 0.6,
          "opskins": 0.59
        },
        "4": {
          "market": 4.02,
          "analyst": 4.08,
          "opskins": 3.25
        }
      }
    }
  },
  "87": {
    "item_id": 87,
    "type": "SCAR-20",
    "skinName": "Storm",
    "prices": {
      "default": {
        "0": {
          "market": 0.07,
          "analyst": 0.05,
          "opskins": 0.04
        },
        "1": {
          "market": 0.07,
          "analyst": 0.06,
          "opskins": 0.07
        },
        "2": {
          "market": 0.07,
          "analyst": 0.04,
          "opskins": 0.04
        },
        "3": {
          "market": 0.11,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "4": {
          "market": 0.57,
          "analyst": 0.34,
          "opskins": 0.37
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.18,
          "analyst": 0.16,
          "opskins": 0.14
        },
        "1": {
          "market": 0.19,
          "analyst": 0.19,
          "opskins": 0.14
        },
        "2": {
          "market": 0.14,
          "analyst": 0.13,
          "opskins": 0.13
        },
        "3": {
          "market": 0.23,
          "analyst": 0.22,
          "opskins": 0.15
        },
        "4": {
          "market": 1.43,
          "analyst": 1.87,
          "opskins": 1.36
        }
      }
    }
  },
  "88": {
    "item_id": 88,
    "type": "P90",
    "skinName": "Storm",
    "prices": {
      "default": {
        "0": {
          "market": 0.07,
          "analyst": 0.05,
          "opskins": 0.05
        },
        "1": {
          "market": 0.08,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "2": {
          "market": 0.07,
          "analyst": 0.05,
          "opskins": 0.05
        },
        "3": {
          "market": 0.11,
          "analyst": 0.08,
          "opskins": 0.07
        },
        "4": {
          "market": 0.63,
          "analyst": 0.39,
          "opskins": 0.44
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.27,
          "analyst": 0.23,
          "opskins": 0.27
        },
        "1": {
          "market": 0.28,
          "analyst": 0.25,
          "opskins": 0.21
        },
        "2": {
          "market": 0.2,
          "analyst": 0.18,
          "opskins": 0.17
        },
        "3": {
          "market": 0.39,
          "analyst": 0.36,
          "opskins": 0.31
        },
        "4": {
          "market": 2.61,
          "analyst": 3.15,
          "opskins": 2.73
        }
      }
    }
  },
  "89": {
    "item_id": 89,
    "type": "USP-S",
    "skinName": "Royal Blue",
    "prices": {
      "default": {
        "0": {
          "market": 0.49,
          "analyst": 0.37,
          "opskins": 0.7
        },
        "1": {
          "market": 0.9,
          "analyst": 0.65,
          "opskins": 0.68
        },
        "2": {
          "market": 0.63,
          "analyst": 0.35,
          "opskins": 0.47
        },
        "3": {
          "market": 2.2,
          "analyst": 1.44,
          "opskins": 1.63
        },
        "4": {
          "market": 16.59,
          "analyst": 14.65,
          "opskins": 14.66
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 3.71,
          "analyst": 2.79,
          "opskins": 6.99
        },
        "1": {
          "market": 5.24,
          "analyst": 4.34,
          "opskins": 4.24
        },
        "2": {
          "market": 4.71,
          "analyst": 4.01,
          "opskins": 4.27
        },
        "3": {
          "market": 14.6,
          "analyst": 14.74,
          "opskins": 13.77
        },
        "4": {
          "market": 179,
          "analyst": 178.23,
          "opskins": 178.46
        }
      }
    }
  },
  "90": {
    "item_id": 90,
    "type": "Sawed-Off",
    "skinName": "Rust Coat",
    "prices": {
      "default": {
        "0": {
          "market": 0.4,
          "analyst": 0.28,
          "opskins": 0.28
        },
        "1": {
          "market": 0.51,
          "analyst": 0.3,
          "opskins": 0.41
        },
        "2": {
          "market": 0.39,
          "analyst": 0.29,
          "opskins": 1
        },
        "3": {
          "market": 0.41,
          "analyst": 0.29,
          "opskins": 0.28
        },
        "4": {
          "market": 0.47,
          "analyst": 0.34,
          "opskins": 0.34
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.47,
          "analyst": 0.42,
          "opskins": 0.38
        },
        "1": {
          "market": 0.7,
          "analyst": 0.63,
          "opskins": 10
        },
        "2": {
          "market": 0.32,
          "analyst": 0.26,
          "opskins": 1
        },
        "3": {
          "market": 0.37,
          "analyst": 0.28,
          "opskins": 0.44
        },
        "4": {
          "market": 1.47,
          "analyst": 1.28,
          "opskins": 1
        }
      }
    }
  },
  "91": {
    "item_id": 91,
    "type": "MAG-7",
    "skinName": "Silver",
    "prices": {
      "default": {
        "3": {
          "market": 0.56,
          "analyst": 0.34,
          "opskins": 0.37
        },
        "4": {
          "market": 0.51,
          "analyst": 0.37,
          "opskins": 0.3
        }
      },
      "stattrak": {},
      "souvenir": {
        "3": {
          "market": 1.78,
          "analyst": 1.73,
          "opskins": 2.29
        },
        "4": {
          "market": 1.09,
          "analyst": 0.93,
          "opskins": 0.87
        }
      }
    }
  },
  "92": {
    "item_id": 92,
    "type": "Nova",
    "skinName": "Green Apple",
    "prices": {
      "default": {
        "2": {
          "market": 0.41,
          "analyst": 0.29,
          "opskins": 0.3
        },
        "3": {
          "market": 0.4,
          "analyst": 0.3,
          "opskins": 0.29
        },
        "4": {
          "market": 0.46,
          "analyst": 0.34,
          "opskins": 0.29
        }
      },
      "stattrak": {},
      "souvenir": {
        "2": {
          "market": 0.66,
          "analyst": 0.39,
          "opskins": 0.4
        },
        "3": {
          "market": 0.48,
          "analyst": 0.45,
          "opskins": 0.37
        },
        "4": {
          "market": 1,
          "analyst": 0.89,
          "opskins": 0.87
        }
      }
    }
  },
  "93": {
    "item_id": 93,
    "type": "P2000",
    "skinName": "Chainmail",
    "prices": {
      "default": {
        "2": {
          "market": 4.21,
          "analyst": 2.98,
          "opskins": 2.95
        },
        "3": {
          "market": 4.01,
          "analyst": 3,
          "opskins": 2.9
        },
        "4": {
          "market": 4.14,
          "analyst": 3.08,
          "opskins": 2.86
        }
      },
      "stattrak": {},
      "souvenir": {
        "2": {
          "market": 2.19,
          "analyst": 2.36,
          "opskins": 4.95
        },
        "3": {
          "market": 2.34,
          "analyst": 2.21,
          "opskins": 2.09
        },
        "4": {
          "market": 3.3,
          "analyst": 3.27,
          "opskins": 2.52
        }
      }
    }
  },
  "94": {
    "item_id": 94,
    "type": "MP9",
    "skinName": "Dark Age",
    "prices": {
      "default": {
        "2": {
          "market": 4.04,
          "analyst": 3.42,
          "opskins": 3.09
        },
        "3": {
          "market": 4.16,
          "analyst": 2.85,
          "opskins": 2.9
        },
        "4": {
          "market": 4.08,
          "analyst": 3.06,
          "opskins": 2.62
        }
      },
      "stattrak": {},
      "souvenir": {
        "2": {
          "market": 1.91,
          "analyst": 1.93,
          "opskins": 4
        },
        "3": {
          "market": 2.3,
          "analyst": 2.07,
          "opskins": 2.69
        },
        "4": {
          "market": 2.9,
          "analyst": 2.89,
          "opskins": 7.59
        }
      }
    }
  },
  "95": {
    "item_id": 95,
    "type": "Desert Eagle",
    "skinName": "Hand Cannon",
    "prices": {
      "default": {
        "0": {
          "market": 26.91,
          "analyst": 22.46,
          "opskins": 24.96
        },
        "1": {
          "market": 38.94,
          "analyst": 24.22,
          "opskins": 27
        },
        "2": {
          "market": 28.42,
          "analyst": 21.88,
          "opskins": 19.94
        },
        "3": {
          "market": 29.07,
          "analyst": 22.49,
          "opskins": 23.01
        },
        "4": {
          "market": 32.88,
          "analyst": 25.68,
          "opskins": 25.16
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 26.54,
          "analyst": 30.3,
          "opskins": 37.56
        },
        "1": {
          "market": 53.52,
          "analyst": 33.55,
          "opskins": 50
        },
        "2": {
          "market": 29.01,
          "analyst": 28.01,
          "opskins": 28
        },
        "3": {
          "market": 50,
          "analyst": 46.16,
          "opskins": 44
        },
        "4": {
          "market": 400,
          "analyst": 315.04,
          "opskins": 300
        }
      }
    }
  },
  "96": {
    "item_id": 96,
    "type": "CZ75-Auto",
    "skinName": "Chalice",
    "prices": {
      "default": {
        "3": {
          "market": 27.73,
          "analyst": 22.65,
          "opskins": 24.5
        },
        "4": {
          "market": 31.18,
          "analyst": 25.21,
          "opskins": 21.11
        }
      },
      "stattrak": {},
      "souvenir": {
        "3": {
          "market": 25.37,
          "analyst": 28.76,
          "opskins": 50
        },
        "4": {
          "market": 21.23,
          "analyst": 17.29,
          "opskins": 19
        }
      }
    }
  },
  "97": {
    "item_id": 97,
    "type": "M4A1-S",
    "skinName": "Knight",
    "prices": {
      "default": {
        "3": {
          "market": 208.06,
          "analyst": 233.3,
          "opskins": 208.88
        },
        "4": {
          "market": 279.69,
          "analyst": 232.47,
          "opskins": 194
        }
      },
      "stattrak": {},
      "souvenir": {
        "3": {
          "market": 368,
          "analyst": 394.26,
          "opskins": 312
        },
        "4": {
          "market": 400,
          "analyst": 365,
          "opskins": 330
        }
      }
    }
  },
  "98": {
    "item_id": 98,
    "type": "AK-47",
    "skinName": "Predator",
    "prices": {
      "default": {
        "0": {
          "market": 0.95,
          "analyst": 0.69,
          "opskins": 0.64
        },
        "1": {
          "market": 1.29,
          "analyst": 0.92,
          "opskins": 0.95
        },
        "2": {
          "market": 0.88,
          "analyst": 0.6,
          "opskins": 0.56
        },
        "3": {
          "market": 1.64,
          "analyst": 1.11,
          "opskins": 1.21
        },
        "4": {
          "market": 9.51,
          "analyst": 6.95,
          "opskins": 6.98
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "99": {
    "item_id": 99,
    "type": "M4A4",
    "skinName": "Desert Storm",
    "prices": {
      "default": {
        "0": {
          "market": 0.81,
          "analyst": 0.6,
          "opskins": 0.59
        },
        "1": {
          "market": 0.99,
          "analyst": 0.7,
          "opskins": 0.76
        },
        "2": {
          "market": 0.79,
          "analyst": 0.55,
          "opskins": 0.62
        },
        "3": {
          "market": 1.37,
          "analyst": 0.99,
          "opskins": 0.89
        },
        "4": {
          "market": 6.96,
          "analyst": 5.96,
          "opskins": 6.42
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "100": {
    "item_id": 100,
    "type": "SCAR-20",
    "skinName": "Palm",
    "prices": {
      "default": {
        "0": {
          "market": 0.7,
          "analyst": 0.5,
          "opskins": 0.41
        },
        "1": {
          "market": 0.8,
          "analyst": 0.52,
          "opskins": 0.45
        },
        "2": {
          "market": 0.69,
          "analyst": 0.43,
          "opskins": 0.56
        },
        "3": {
          "market": 0.98,
          "analyst": 0.53,
          "opskins": 0.62
        },
        "4": {
          "market": 3.41,
          "analyst": 2.76,
          "opskins": 2.59
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "101": {
    "item_id": 101,
    "type": "AUG",
    "skinName": "Copperhead",
    "prices": {
      "default": {
        "2": {
          "market": 5.03,
          "analyst": 3.51,
          "opskins": 3.95
        },
        "3": {
          "market": 6.78,
          "analyst": 5.91,
          "opskins": 5.49
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "102": {
    "item_id": 102,
    "type": "Sawed-Off",
    "skinName": "Copper",
    "prices": {
      "default": {
        "0": {
          "market": 4.93,
          "analyst": 4.69,
          "opskins": 4.25
        },
        "1": {
          "market": 4.88,
          "analyst": 4.23,
          "opskins": 4.67
        },
        "2": {
          "market": 4.96,
          "analyst": 3.22,
          "opskins": 3.97
        },
        "3": {
          "market": 6.29,
          "analyst": 6.38,
          "opskins": 6.9
        },
        "4": {
          "market": 9.55,
          "analyst": 8.01,
          "opskins": 15
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "103": {
    "item_id": 103,
    "type": "Desert Eagle",
    "skinName": "Blaze",
    "prices": {
      "default": {
        "3": {
          "market": 55.18,
          "analyst": 48.23,
          "opskins": 41.99
        },
        "4": {
          "market": 57.69,
          "analyst": 45.68,
          "opskins": 38.5
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "104": {
    "item_id": 104,
    "type": "Glock-18",
    "skinName": "Brass",
    "prices": {
      "default": {
        "0": {
          "market": 1.5,
          "analyst": 1.08,
          "opskins": 1.39
        },
        "1": {
          "market": 1.75,
          "analyst": 1.26,
          "opskins": 4
        },
        "2": {
          "market": 1.77,
          "analyst": 1.3,
          "opskins": 1.37
        },
        "3": {
          "market": 3.81,
          "analyst": 3.02,
          "opskins": 2.7
        },
        "4": {
          "market": 9.62,
          "analyst": 7.83,
          "opskins": 7.95
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "105": {
    "item_id": 105,
    "type": "P2000",
    "skinName": "Scorpion",
    "prices": {
      "default": {
        "3": {
          "market": 2.92,
          "analyst": 3.82,
          "opskins": 3.23
        },
        "4": {
          "market": 1.07,
          "analyst": 0.93,
          "opskins": 0.78
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "106": {
    "item_id": 106,
    "type": "G3SG1",
    "skinName": "Desert Storm",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.13
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.19,
          "analyst": 0.16,
          "opskins": 0.17
        },
        "1": {
          "market": 0.21,
          "analyst": 0.19,
          "opskins": 0.2
        },
        "2": {
          "market": 0.15,
          "analyst": 0.14,
          "opskins": 0.14
        },
        "3": {
          "market": 0.27,
          "analyst": 0.26,
          "opskins": 0.27
        },
        "4": {
          "market": 8.24,
          "analyst": 5.69,
          "opskins": 6.95
        }
      }
    }
  },
  "107": {
    "item_id": 107,
    "type": "MP9",
    "skinName": "Sand Dashed",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "4": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.1
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.24,
          "analyst": 0.21,
          "opskins": 0.19
        },
        "1": {
          "market": 0.24,
          "analyst": 0.22,
          "opskins": 0.22
        },
        "2": {
          "market": 0.21,
          "analyst": 0.18,
          "opskins": 0.18
        },
        "3": {
          "market": 0.35,
          "analyst": 0.31,
          "opskins": 0.25
        },
        "4": {
          "market": 3.28,
          "analyst": 3.38,
          "opskins": 3.48
        }
      }
    }
  },
  "108": {
    "item_id": 108,
    "type": "Nova",
    "skinName": "Predator",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.08
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.18,
          "analyst": 0.18,
          "opskins": 0.17
        },
        "1": {
          "market": 0.3,
          "analyst": 0.28,
          "opskins": 0.28
        },
        "2": {
          "market": 0.15,
          "analyst": 0.14,
          "opskins": 0.13
        },
        "3": {
          "market": 0.23,
          "analyst": 0.22,
          "opskins": 0.2
        },
        "4": {
          "market": 2.5,
          "analyst": 3.28,
          "opskins": -1
        }
      }
    }
  },
  "109": {
    "item_id": 109,
    "type": "P250",
    "skinName": "Sand Dune",
    "prices": {
      "default": {
        "0": {
          "market": 0.05,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.26,
          "analyst": 0.19,
          "opskins": 0.15
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.59,
          "analyst": 0.73,
          "opskins": 0.65
        },
        "1": {
          "market": 0.47,
          "analyst": 0.46,
          "opskins": 0.4
        },
        "2": {
          "market": 0.34,
          "analyst": 0.34,
          "opskins": 0.3
        },
        "3": {
          "market": 1.17,
          "analyst": 1.1,
          "opskins": 0.92
        },
        "4": {
          "market": 18.45,
          "analyst": 14.2,
          "opskins": 15.5
        }
      }
    }
  },
  "110": {
    "item_id": 110,
    "type": "P90",
    "skinName": "Sand Spray",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.07
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.24,
          "analyst": 0.24,
          "opskins": 0.19
        },
        "1": {
          "market": 0.3,
          "analyst": 0.3,
          "opskins": 0.34
        },
        "2": {
          "market": 0.21,
          "analyst": 0.19,
          "opskins": 0.16
        },
        "3": {
          "market": 0.39,
          "analyst": 0.36,
          "opskins": 0.3
        },
        "4": {
          "market": 5.24,
          "analyst": 3.82,
          "opskins": 8.99
        }
      }
    }
  },
  "111": {
    "item_id": 111,
    "type": "SCAR-20",
    "skinName": "Sand Mesh",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.12,
          "analyst": 0.08,
          "opskins": 0.08
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.21,
          "analyst": 0.22,
          "opskins": 0.2
        },
        "1": {
          "market": 0.2,
          "analyst": 0.19,
          "opskins": 1
        },
        "2": {
          "market": 0.16,
          "analyst": 0.13,
          "opskins": 0.14
        },
        "3": {
          "market": 0.24,
          "analyst": 0.22,
          "opskins": 0.29
        },
        "4": {
          "market": 2.44,
          "analyst": 3.24,
          "opskins": 3.43
        }
      }
    }
  },
  "112": {
    "item_id": 112,
    "type": "AK-47",
    "skinName": "Safari Mesh",
    "prices": {
      "default": {
        "0": {
          "market": 0.14,
          "analyst": 0.1,
          "opskins": 0.08
        },
        "1": {
          "market": 0.17,
          "analyst": 0.13,
          "opskins": 0.09
        },
        "2": {
          "market": 0.11,
          "analyst": 0.08,
          "opskins": 0.06
        },
        "3": {
          "market": 0.29,
          "analyst": 0.22,
          "opskins": 0.19
        },
        "4": {
          "market": 2.36,
          "analyst": 1.92,
          "opskins": 1.82
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 5.99,
          "analyst": 4.97,
          "opskins": 4.66
        },
        "1": {
          "market": 5.22,
          "analyst": 5.02,
          "opskins": 5.23
        },
        "2": {
          "market": 5,
          "analyst": 4.95,
          "opskins": 4.99
        },
        "3": {
          "market": 10.27,
          "analyst": 10.7,
          "opskins": 11
        },
        "4": {
          "market": 105.74,
          "analyst": 108.1,
          "opskins": 90
        }
      }
    }
  },
  "113": {
    "item_id": 113,
    "type": "Five-SeveN",
    "skinName": "Orange Peel",
    "prices": {
      "default": {
        "0": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.07,
          "analyst": 0.05,
          "opskins": 0.05
        },
        "4": {
          "market": 0.44,
          "analyst": 0.36,
          "opskins": 0.33
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.7,
          "analyst": 0.79,
          "opskins": 1
        },
        "1": {
          "market": 0.89,
          "analyst": 1.36,
          "opskins": 1.99
        },
        "2": {
          "market": 0.83,
          "analyst": 0.8,
          "opskins": 0.69
        },
        "3": {
          "market": 2.2,
          "analyst": 2.28,
          "opskins": 2.12
        },
        "4": {
          "market": 89.82,
          "analyst": 105.24,
          "opskins": 72.3
        }
      }
    }
  },
  "114": {
    "item_id": 114,
    "type": "MAC-10",
    "skinName": "Palm",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.26,
          "analyst": 0.25,
          "opskins": 0.2
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.34,
          "analyst": 0.3,
          "opskins": 0.33
        },
        "1": {
          "market": 0.48,
          "analyst": 0.78,
          "opskins": 0.78
        },
        "2": {
          "market": 0.46,
          "analyst": 0.27,
          "opskins": 0.29
        },
        "3": {
          "market": 0.95,
          "analyst": 0.87,
          "opskins": 2.99
        },
        "4": {
          "market": 32.48,
          "analyst": 28.99,
          "opskins": 23.7
        }
      }
    }
  },
  "115": {
    "item_id": 115,
    "type": "Tec-9",
    "skinName": "VariCamo",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.08
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "4": {
          "market": 0.06,
          "analyst": 0.04,
          "opskins": 0.04
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.5,
          "analyst": 1.3,
          "opskins": 1.47
        },
        "1": {
          "market": 2.07,
          "analyst": 2.09,
          "opskins": 1.56
        },
        "2": {
          "market": 1.07,
          "analyst": 1.06,
          "opskins": 0.78
        },
        "3": {
          "market": 1.49,
          "analyst": 1.59,
          "opskins": 4.2
        },
        "4": {
          "market": 2.73,
          "analyst": 2.44,
          "opskins": 3.99
        }
      }
    }
  },
  "116": {
    "item_id": 116,
    "type": "Sawed-Off",
    "skinName": "Snake Camo",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.13,
          "analyst": 0.14,
          "opskins": 0.19
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.23,
          "analyst": 0.24,
          "opskins": 0.25
        },
        "1": {
          "market": 0.32,
          "analyst": 0.43,
          "opskins": 1.14
        },
        "2": {
          "market": 0.17,
          "analyst": 0.17,
          "opskins": 1.52
        },
        "3": {
          "market": 0.37,
          "analyst": 0.33,
          "opskins": 0.39
        },
        "4": {
          "market": 6.37,
          "analyst": 6.09,
          "opskins": 15.79
        }
      }
    }
  },
  "117": {
    "item_id": 117,
    "type": "PP-Bizon",
    "skinName": "Brass",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.06
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "3": {
          "market": 0.14,
          "analyst": 0.08,
          "opskins": 0.08
        },
        "4": {
          "market": 0.48,
          "analyst": 0.46,
          "opskins": 0.39
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.7,
          "analyst": 1.68,
          "opskins": 5
        },
        "1": {
          "market": 1.84,
          "analyst": 1.29,
          "opskins": 1.75
        },
        "2": {
          "market": 1.9,
          "analyst": 1.53,
          "opskins": 1.6
        },
        "3": {
          "market": 2.9,
          "analyst": 3.26,
          "opskins": 3.36
        },
        "4": {
          "market": 33.41,
          "analyst": 25.41,
          "opskins": 29.5
        }
      }
    }
  },
  "118": {
    "item_id": 118,
    "type": "SG 553",
    "skinName": "Damascus Steel",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.09
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.12
        },
        "2": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.09
        },
        "3": {
          "market": 0.11,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "4": {
          "market": 0.32,
          "analyst": 0.26,
          "opskins": 0.26
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.92,
          "analyst": 1.32,
          "opskins": 1.59
        },
        "1": {
          "market": 1.28,
          "analyst": 1.17,
          "opskins": 1.27
        },
        "2": {
          "market": 1.91,
          "analyst": 1.41,
          "opskins": 3.88
        },
        "3": {
          "market": 3.95,
          "analyst": 4.5,
          "opskins": 5
        },
        "4": {
          "market": 28.7,
          "analyst": 44.07,
          "opskins": 31.19
        }
      }
    }
  },
  "119": {
    "item_id": 119,
    "type": "P2000",
    "skinName": "Amber Fade",
    "prices": {
      "default": {
        "1": {
          "market": 0.36,
          "analyst": 0.26,
          "opskins": 2
        },
        "2": {
          "market": 0.26,
          "analyst": 0.21,
          "opskins": 0.45
        },
        "3": {
          "market": 0.34,
          "analyst": 0.24,
          "opskins": 0.24
        },
        "4": {
          "market": 0.66,
          "analyst": 0.42,
          "opskins": 0.49
        }
      },
      "stattrak": {},
      "souvenir": {
        "1": {
          "market": 21.81,
          "analyst": 21.82,
          "opskins": 23.87
        },
        "2": {
          "market": 4.73,
          "analyst": 4.46,
          "opskins": 3.95
        },
        "3": {
          "market": 7.08,
          "analyst": 9.74,
          "opskins": 8.6
        },
        "4": {
          "market": 21.64,
          "analyst": 19.22,
          "opskins": 19.09
        }
      }
    }
  },
  "120": {
    "item_id": 120,
    "type": "R8 Revolver",
    "skinName": "Amber Fade",
    "prices": {
      "default": {
        "1": {
          "market": 0.69
        },
        "2": {
          "market": 0.45
        },
        "3": {
          "market": 0.47
        },
        "4": {
          "market": 0.64
        }
      },
      "stattrak": {},
      "souvenir": {
          "1": {
              "market": 68.89
          },
          "2": {
              "market": 73.68
          },
          "3": {
              "market": 87.36
          },
      }
    }
  },
  "121": {
    "item_id": 121,
    "type": "AUG",
    "skinName": "Daedalus",
    "prices": {
      "default": {
        "0": {
          "market": 0.2,
          "analyst": 0.14,
          "opskins": 0.12
        },
        "1": {
          "market": 0.21,
          "analyst": 0.2,
          "opskins": 0.18
        },
        "2": {
          "market": 0.19,
          "analyst": 0.14,
          "opskins": 0.11
        },
        "3": {
          "market": 0.24,
          "analyst": 0.18,
          "opskins": 0.14
        },
        "4": {
          "market": 0.31,
          "analyst": 0.22,
          "opskins": 0.2
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "122": {
    "item_id": 122,
    "type": "Dual Berettas",
    "skinName": "Moon in Libra",
    "prices": {
      "default": {
        "0": {
          "market": 0.19,
          "analyst": 0.17,
          "opskins": 0.17
        },
        "1": {
          "market": 0.24,
          "analyst": 0.15,
          "opskins": 0.13
        },
        "2": {
          "market": 0.19,
          "analyst": 0.14,
          "opskins": 0.12
        },
        "3": {
          "market": 0.25,
          "analyst": 0.18,
          "opskins": 0.16
        },
        "4": {
          "market": 0.28,
          "analyst": 0.21,
          "opskins": 0.19
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "123": {
    "item_id": 123,
    "type": "Nova",
    "skinName": "Moon in Libra",
    "prices": {
      "default": {
        "0": {
          "market": 0.19,
          "analyst": 0.15,
          "opskins": 0.14
        },
        "1": {
          "market": 0.21,
          "analyst": 0.16,
          "opskins": 0.13
        },
        "2": {
          "market": 0.19,
          "analyst": 0.14,
          "opskins": 0.11
        },
        "3": {
          "market": 0.25,
          "analyst": 0.18,
          "opskins": 0.14
        },
        "4": {
          "market": 0.29,
          "analyst": 0.21,
          "opskins": 0.17
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "124": {
    "item_id": 124,
    "type": "MP7",
    "skinName": "Asterion",
    "prices": {
      "default": {
        "0": {
          "market": 0.19,
          "analyst": 0.16,
          "opskins": 0.14
        },
        "1": {
          "market": 0.23,
          "analyst": 0.22,
          "opskins": 0.19
        },
        "2": {
          "market": 0.19,
          "analyst": 0.14,
          "opskins": 0.12
        },
        "3": {
          "market": 0.23,
          "analyst": 0.19,
          "opskins": 0.14
        },
        "4": {
          "market": 0.29,
          "analyst": 0.25,
          "opskins": 0.2
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "125": {
    "item_id": 125,
    "type": "AWP",
    "skinName": "Sun in Leo",
    "prices": {
      "default": {
        "0": {
          "market": 2.28,
          "analyst": 1.79,
          "opskins": 1.77
        },
        "1": {
          "market": 2.41,
          "analyst": 2.04,
          "opskins": 1.79
        },
        "2": {
          "market": 2.15,
          "analyst": 1.59,
          "opskins": 1.4
        },
        "3": {
          "market": 3.98,
          "analyst": 2.69,
          "opskins": 2.5
        },
        "4": {
          "market": 5.75,
          "analyst": 4.19,
          "opskins": 3.52
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "126": {
    "item_id": 126,
    "type": "Tec-9",
    "skinName": "Hades",
    "prices": {
      "default": {
        "0": {
          "market": 0.67,
          "analyst": 0.48,
          "opskins": 0.44
        },
        "1": {
          "market": 0.64,
          "analyst": 0.47,
          "opskins": 0.44
        },
        "2": {
          "market": 0.64,
          "analyst": 0.46,
          "opskins": 0.41
        },
        "3": {
          "market": 0.67,
          "analyst": 0.5,
          "opskins": 0.42
        },
        "4": {
          "market": 1.06,
          "analyst": 0.82,
          "opskins": 0.64
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "127": {
    "item_id": 127,
    "type": "M249",
    "skinName": "Shipping Forecast",
    "prices": {
      "default": {
        "0": {
          "market": 0.68,
          "analyst": 0.59,
          "opskins": 0.59
        },
        "1": {
          "market": 0.68,
          "analyst": 0.56,
          "opskins": 0.43
        },
        "2": {
          "market": 0.61,
          "analyst": 0.46,
          "opskins": 0.44
        },
        "3": {
          "market": 0.65,
          "analyst": 0.47,
          "opskins": 0.44
        },
        "4": {
          "market": 0.71,
          "analyst": 0.54,
          "opskins": 0.48
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "128": {
    "item_id": 128,
    "type": "P2000",
    "skinName": "Pathfinder",
    "prices": {
      "default": {
        "2": {
          "market": 0.67,
          "analyst": 0.45,
          "opskins": 0.43
        },
        "3": {
          "market": 0.65,
          "analyst": 0.46,
          "opskins": 0.42
        },
        "4": {
          "market": 0.72,
          "analyst": 0.54,
          "opskins": 0.5
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "129": {
    "item_id": 129,
    "type": "UMP-45",
    "skinName": "Minotaur's Labyrinth",
    "prices": {
      "default": {
        "1": {
          "market": 6.52,
          "analyst": 7.41,
          "opskins": 8.31
        },
        "2": {
          "market": 6.64,
          "analyst": 4.81,
          "opskins": 4.75
        },
        "3": {
          "market": 6.57,
          "analyst": 4.97,
          "opskins": 4.56
        },
        "4": {
          "market": 7.14,
          "analyst": 5.49,
          "opskins": 5.06
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "130": {
    "item_id": 130,
    "type": "MP9",
    "skinName": "Pandora's Box",
    "prices": {
      "default": {
        "2": {
          "market": 6.77,
          "analyst": 5.64,
          "opskins": 5.16
        },
        "3": {
          "market": 6.72,
          "analyst": 5.14,
          "opskins": 4.69
        },
        "4": {
          "market": 7.15,
          "analyst": 5.36,
          "opskins": 4.68
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "131": {
    "item_id": 131,
    "type": "G3SG1",
    "skinName": "Chronos",
    "prices": {
      "default": {
        "1": {
          "market": 15.12,
          "analyst": 17.89,
          "opskins": 19.99
        },
        "2": {
          "market": 19.22,
          "analyst": 22.85,
          "opskins": 22.85
        },
        "3": {
          "market": 20.03,
          "analyst": 16.53,
          "opskins": 16.31
        },
        "4": {
          "market": 21.83,
          "analyst": 16.78,
          "opskins": 16.12
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "132": {
    "item_id": 132,
    "type": "M4A4",
    "skinName": "Poseidon",
    "prices": {
      "default": {
        "2": {
          "market": 98.99,
          "analyst": 85.18,
          "opskins": 81
        },
        "3": {
          "market": 111.39,
          "analyst": 93.4,
          "opskins": 78.7
        },
        "4": {
          "market": 166.65,
          "analyst": 125.71,
          "opskins": 106.99
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "133": {
    "item_id": 133,
    "type": "MAG-7",
    "skinName": "Sand Dune",
    "prices": {
      "default": {
        "0": {
          "market": 0.25,
          "analyst": 0.16,
          "opskins": 0.12
        },
        "1": {
          "market": 0.34,
          "analyst": 0.18,
          "opskins": 0.15
        },
        "2": {
          "market": 0.19,
          "analyst": 0.12,
          "opskins": 0.11
        },
        "3": {
          "market": 0.3,
          "analyst": 0.25,
          "opskins": 0.28
        },
        "4": {
          "market": 1.9,
          "analyst": 1.52,
          "opskins": 2.63
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.16,
          "analyst": 0.14,
          "opskins": 0.14
        },
        "1": {
          "market": 0.17,
          "analyst": 0.15,
          "opskins": 0.13
        },
        "2": {
          "market": 0.15,
          "analyst": 0.12,
          "opskins": 0.12
        },
        "3": {
          "market": 0.2,
          "analyst": 0.21,
          "opskins": 0.23
        },
        "4": {
          "market": 3.74,
          "analyst": 2.74,
          "opskins": 2.49
        }
      }
    }
  },
  "134": {
    "item_id": 134,
    "type": "Nova",
    "skinName": "Walnut",
    "prices": {
      "default": {
        "0": {
          "market": 0.2,
          "analyst": 0.16,
          "opskins": 0.14
        },
        "1": {
          "market": 0.24,
          "analyst": 0.2,
          "opskins": 0.22
        },
        "2": {
          "market": 0.19,
          "analyst": 0.15,
          "opskins": 0.33
        },
        "3": {
          "market": 0.41,
          "analyst": 0.35,
          "opskins": 0.29
        },
        "4": {
          "market": 2.46,
          "analyst": 2.85,
          "opskins": 2.14
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.21,
          "analyst": 0.2,
          "opskins": 0.19
        },
        "1": {
          "market": 0.27,
          "analyst": 0.29,
          "opskins": 0.23
        },
        "2": {
          "market": 0.2,
          "analyst": 0.17,
          "opskins": 0.18
        },
        "3": {
          "market": 0.48,
          "analyst": 0.42,
          "opskins": 0.34
        },
        "4": {
          "market": 4.49,
          "analyst": 7.08,
          "opskins": 19.99
        }
      }
    }
  },
  "135": {
    "item_id": 135,
    "type": "M4A4",
    "skinName": "Tornado",
    "prices": {
      "default": {
        "0": {
          "market": 0.93,
          "analyst": 0.62,
          "opskins": 0.93
        },
        "1": {
          "market": 0.98,
          "analyst": 0.78,
          "opskins": 0.7
        },
        "2": {
          "market": 0.78,
          "analyst": 0.51,
          "opskins": 0.5
        },
        "3": {
          "market": 1.93,
          "analyst": 1.44,
          "opskins": 1.37
        },
        "4": {
          "market": 11.01,
          "analyst": 10.91,
          "opskins": 10.75
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 2.81,
          "analyst": 2.18,
          "opskins": 2.12
        },
        "1": {
          "market": 2.94,
          "analyst": 2.46,
          "opskins": 2.39
        },
        "2": {
          "market": 2.56,
          "analyst": 2.15,
          "opskins": 1.82
        },
        "3": {
          "market": 5.7,
          "analyst": 4.9,
          "opskins": 4.18
        },
        "4": {
          "market": 61.91,
          "analyst": 50.62,
          "opskins": 50
        }
      }
    }
  },
  "136": {
    "item_id": 136,
    "type": "P250",
    "skinName": "Gunsmoke",
    "prices": {
      "default": {
        "0": {
          "market": 0.28,
          "analyst": 0.26,
          "opskins": 0.23
        },
        "1": {
          "market": 0.36,
          "analyst": 0.25,
          "opskins": 0.21
        },
        "2": {
          "market": 0.23,
          "analyst": 0.17,
          "opskins": 0.17
        },
        "3": {
          "market": 0.74,
          "analyst": 0.54,
          "opskins": 0.43
        },
        "4": {
          "market": 7.01,
          "analyst": 8.19,
          "opskins": 7.4
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.58,
          "analyst": 0.54,
          "opskins": 2
        },
        "1": {
          "market": 1.24,
          "analyst": 0.77,
          "opskins": 6.4
        },
        "2": {
          "market": 0.81,
          "analyst": 0.69,
          "opskins": 0.99
        },
        "3": {
          "market": 2.7,
          "analyst": 2.79,
          "opskins": 2.7
        },
        "4": {
          "market": 38.26,
          "analyst": 29.35,
          "opskins": 32
        }
      }
    }
  },
  "137": {
    "item_id": 137,
    "type": "Dual Berettas",
    "skinName": "Anodized Navy",
    "prices": {
      "default": {
        "3": {
          "market": 0.81,
          "analyst": 0.81,
          "opskins": 0.74
        },
        "4": {
          "market": 0.17,
          "analyst": 0.14,
          "opskins": 0.12
        }
      },
      "stattrak": {},
      "souvenir": {
        "3": {
          "market": 9.43,
          "analyst": 7.2,
          "opskins": 5
        },
        "4": {
          "market": 1.93,
          "analyst": 1.72,
          "opskins": 1.6
        }
      }
    }
  },
  "138": {
    "item_id": 138,
    "type": "Tec-9",
    "skinName": "Brass",
    "prices": {
      "default": {
        "0": {
          "market": 0.39,
          "analyst": 0.29,
          "opskins": 0.41
        },
        "1": {
          "market": 0.45,
          "analyst": 0.31,
          "opskins": 0.32
        },
        "2": {
          "market": 0.35,
          "analyst": 0.34,
          "opskins": 0.35
        },
        "3": {
          "market": 1.08,
          "analyst": 0.86,
          "opskins": 0.69
        },
        "4": {
          "market": 6.98,
          "analyst": 6.13,
          "opskins": 5.34
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 3.76,
          "analyst": 2.44,
          "opskins": 2.5
        },
        "1": {
          "market": 3.45,
          "analyst": 3.15,
          "opskins": 3.65
        },
        "2": {
          "market": 3.63,
          "analyst": 3.71,
          "opskins": 4
        },
        "3": {
          "market": 5.75,
          "analyst": 6.31,
          "opskins": 6.15
        },
        "4": {
          "market": 32.12,
          "analyst": 38.96,
          "opskins": 39.98
        }
      }
    }
  },
  "139": {
    "item_id": 139,
    "type": "AUG",
    "skinName": "Contractor",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.14,
          "analyst": 0.09,
          "opskins": 0.09
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.9,
          "analyst": 3.54,
          "opskins": 7.1
        },
        "1": {
          "market": 2.23,
          "analyst": 3.37,
          "opskins": 10
        },
        "2": {
          "market": 1.17,
          "analyst": 1.18,
          "opskins": 1.2
        },
        "3": {
          "market": 2.1,
          "analyst": 7.53,
          "opskins": 14.85
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "140": {
    "item_id": 140,
    "type": "FAMAS",
    "skinName": "Colony",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "4": {
          "market": 0.12,
          "analyst": 0.1,
          "opskins": 0.09
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.07,
          "analyst": 1.4,
          "opskins": 2.6
        },
        "1": {
          "market": 2.67,
          "analyst": 6.58,
          "opskins": 8.87
        },
        "2": {
          "market": 1.33,
          "analyst": 2.42,
          "opskins": 3.65
        },
        "3": {
          "market": 4.95,
          "analyst": 7.05,
          "opskins": 6.4
        },
        "4": {
          "market": 49.99,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "141": {
    "item_id": 141,
    "type": "Tec-9",
    "skinName": "Groundwater",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "4": {
          "market": 0.11,
          "analyst": 0.08,
          "opskins": 0.07
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.49,
          "analyst": 3.72,
          "opskins": 1.99
        },
        "1": {
          "market": 2.46,
          "analyst": 2.53,
          "opskins": 2.26
        },
        "2": {
          "market": 1.07,
          "analyst": 1.15,
          "opskins": 1.13
        },
        "3": {
          "market": 10.9,
          "analyst": 16.05,
          "opskins": 25
        },
        "4": {
          "market": 400,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "142": {
    "item_id": 142,
    "type": "PP-Bizon",
    "skinName": "Sand Dashed",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "4": {
          "market": 0.08,
          "analyst": 0.05,
          "opskins": 0.07
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.15,
          "analyst": 2.55,
          "opskins": 3.96
        },
        "1": {
          "market": 5.38,
          "analyst": 4.73,
          "opskins": 9.98
        },
        "2": {
          "market": 0.71,
          "analyst": 0.69,
          "opskins": 2.69
        },
        "3": {
          "market": 1.85,
          "analyst": 1.52,
          "opskins": 11.63
        },
        "4": {
          "market": 39.99,
          "analyst": -1,
          "opskins": 43.09
        }
      }
    }
  },
  "143": {
    "item_id": 143,
    "type": "Nova",
    "skinName": "Sand Dune",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.18,
          "analyst": 1.76,
          "opskins": 1.54
        },
        "1": {
          "market": 1.84,
          "analyst": -1,
          "opskins": 9.99
        },
        "2": {
          "market": 0.92,
          "analyst": 0.51,
          "opskins": 1.55
        },
        "3": {
          "market": 1.57,
          "analyst": 3.03,
          "opskins": 3.43
        },
        "4": {
          "market": 90.59,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "144": {
    "item_id": 144,
    "type": "M4A1-S",
    "skinName": "Boreal Forest",
    "prices": {
      "default": {
        "0": {
          "market": 0.1,
          "analyst": 0.08,
          "opskins": 0.07
        },
        "1": {
          "market": 0.17,
          "analyst": 0.15,
          "opskins": 0.11
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "3": {
          "market": 0.31,
          "analyst": 0.25,
          "opskins": 0.2
        },
        "4": {
          "market": 2.19,
          "analyst": 2.04,
          "opskins": 1.79
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 31.41,
          "analyst": 41.09,
          "opskins": 48.64
        },
        "1": {
          "market": 25,
          "analyst": 14.95,
          "opskins": 23.61
        },
        "2": {
          "market": 14.63,
          "analyst": 21.12,
          "opskins": 100
        },
        "3": {
          "market": 61,
          "analyst": 38.14,
          "opskins": 99.99
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "145": {
    "item_id": 145,
    "type": "Dual Berettas",
    "skinName": "Stained",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.13,
          "analyst": 0.09,
          "opskins": 0.08
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 6.9,
          "analyst": 8.06,
          "opskins": 35
        },
        "1": {
          "market": 4.49,
          "analyst": 5.52,
          "opskins": 9.99
        },
        "2": {
          "market": 3.84,
          "analyst": 7.83,
          "opskins": 27.67
        },
        "3": {
          "market": 18.06,
          "analyst": 10.51,
          "opskins": 13
        },
        "4": {
          "market": 94.94,
          "analyst": 92.49,
          "opskins": -1
        }
      }
    }
  },
  "146": {
    "item_id": 146,
    "type": "XM1014",
    "skinName": "CaliCamo",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.1
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 1
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.07
        },
        "4": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.04
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 9.56,
          "analyst": -1,
          "opskins": 7.96
        },
        "1": {
          "market": 18.31,
          "analyst": -1,
          "opskins": 21.11
        },
        "2": {
          "market": 2.34,
          "analyst": 2.75,
          "opskins": 4.76
        },
        "3": {
          "market": 4.65,
          "analyst": 4.22,
          "opskins": 12.74
        },
        "4": {
          "market": 16.81,
          "analyst": -1,
          "opskins": 30
        }
      }
    }
  },
  "147": {
    "item_id": 147,
    "type": "UMP-45",
    "skinName": "Gunsmoke",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.05,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.81,
          "analyst": 0.64,
          "opskins": 0.5
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 9.44,
          "analyst": 5.58,
          "opskins": 5.56
        },
        "1": {
          "market": 21.12,
          "analyst": -1,
          "opskins": 38.33
        },
        "2": {
          "market": 5.31,
          "analyst": 8.54,
          "opskins": 10.03
        },
        "3": {
          "market": 31.74,
          "analyst": 17.37,
          "opskins": 45
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "148": {
    "item_id": 148,
    "type": "P2000",
    "skinName": "Granite Marbleized",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.18,
          "analyst": 0.17,
          "opskins": 0.17
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 5.59,
          "analyst": 5.5,
          "opskins": 5.26
        },
        "1": {
          "market": 15.8,
          "analyst": 27.93,
          "opskins": 15.15
        },
        "2": {
          "market": 7.44,
          "analyst": 6.18,
          "opskins": 22.47
        },
        "3": {
          "market": 8.51,
          "analyst": 25.48,
          "opskins": 25.46
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "149": {
    "item_id": 149,
    "type": "Nova",
    "skinName": "Candy Apple",
    "prices": {
      "default": {
        "2": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.06,
          "analyst": 0.04,
          "opskins": 0.04
        }
      },
      "stattrak": {},
      "souvenir": {
        "2": {
          "market": 7.93,
          "analyst": 16.96,
          "opskins": 39.77
        },
        "3": {
          "market": 8.3,
          "analyst": 11.94,
          "opskins": 10
        },
        "4": {
          "market": 28.19,
          "analyst": 28.73,
          "opskins": 28.77
        }
      }
    }
  },
  "150": {
    "item_id": 150,
    "type": "Sawed-Off",
    "skinName": "Full Stop",
    "prices": {
      "default": {
        "0": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.13
        },
        "1": {
          "market": 0.11,
          "analyst": 0.08,
          "opskins": 0.18
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.15
        },
        "3": {
          "market": 0.15,
          "analyst": 0.09,
          "opskins": 0.09
        },
        "4": {
          "market": 0.22,
          "analyst": 0.16,
          "opskins": 0.13
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 80.5,
          "analyst": -1,
          "opskins": -1
        },
        "1": {
          "market": 150,
          "analyst": -1,
          "opskins": -1
        },
        "2": {
          "market": 9.2,
          "analyst": -1,
          "opskins": 13.02
        },
        "3": {
          "market": 54.92,
          "analyst": 45.74,
          "opskins": 59
        },
        "4": {
          "market": 172.5,
          "analyst": 39.03,
          "opskins": -1
        }
      }
    }
  },
  "151": {
    "item_id": 151,
    "type": "MP7",
    "skinName": "Anodized Navy",
    "prices": {
      "default": {
        "3": {
          "market": 0.22,
          "analyst": 0.24,
          "opskins": 0.26
        },
        "4": {
          "market": 0.22,
          "analyst": 0.16,
          "opskins": 0.13
        }
      },
      "stattrak": {},
      "souvenir": {
        "3": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        },
        "4": {
          "market": 17.82,
          "analyst": 39.19,
          "opskins": 30
        }
      }
    }
  },
  "152": {
    "item_id": 152,
    "type": "Glock-18",
    "skinName": "Candy Apple",
    "prices": {
      "default": {
        "2": {
          "market": 0.3,
          "analyst": 0.24,
          "opskins": 0.23
        },
        "3": {
          "market": 0.3,
          "analyst": 0.25,
          "opskins": 0.22
        },
        "4": {
          "market": 0.45,
          "analyst": 0.41,
          "opskins": 0.33
        }
      },
      "stattrak": {},
      "souvenir": {
        "2": {
          "market": 83.8,
          "analyst": 59.44,
          "opskins": 47.95
        },
        "3": {
          "market": 54.89,
          "analyst": 41.29,
          "opskins": 40
        },
        "4": {
          "market": 98.99,
          "analyst": 122.39,
          "opskins": 150
        }
      }
    }
  },
  "153": {
    "item_id": 153,
    "type": "AWP",
    "skinName": "Pit Viper",
    "prices": {
      "default": {
        "0": {
          "market": 0.97,
          "analyst": 0.85,
          "opskins": 0.7
        },
        "1": {
          "market": 1.07,
          "analyst": 0.84,
          "opskins": 0.73
        },
        "2": {
          "market": 0.76,
          "analyst": 0.61,
          "opskins": 0.54
        },
        "3": {
          "market": 1.21,
          "analyst": 0.96,
          "opskins": 0.78
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        },
        "1": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        },
        "2": {
          "market": 61.27,
          "analyst": 48.65,
          "opskins": 200
        },
        "3": {
          "market": 167.12,
          "analyst": 71.52,
          "opskins": 500
        }
      }
    }
  },
  "154": {
    "item_id": 154,
    "type": "G3SG1",
    "skinName": "Jungle Dashed",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.05
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 11.5,
          "analyst": 10.07,
          "opskins": 100
        },
        "1": {
          "market": 2.31,
          "analyst": 2.64,
          "opskins": 2.27
        },
        "2": {
          "market": 0.66,
          "analyst": 0.77,
          "opskins": 2.99
        },
        "3": {
          "market": 1.49,
          "analyst": 3.57,
          "opskins": 10
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": 2785
        }
      }
    }
  },
  "155": {
    "item_id": 155,
    "type": "SG 553",
    "skinName": "Waves Perforated",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "4": {
          "market": 0.12,
          "analyst": 0.09,
          "opskins": 0.05
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.76,
          "analyst": 1.59,
          "opskins": 2.44
        },
        "1": {
          "market": 2.35,
          "analyst": 3.1,
          "opskins": 5.55
        },
        "2": {
          "market": 1,
          "analyst": 2.32,
          "opskins": 4
        },
        "3": {
          "market": 1.4,
          "analyst": 3.81,
          "opskins": 4.05
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "156": {
    "item_id": 156,
    "type": "Galil AR",
    "skinName": "Sage Spray",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.05
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.07
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.26,
          "analyst": 2.34,
          "opskins": 3.33
        },
        "1": {
          "market": 1.21,
          "analyst": 1.81,
          "opskins": 1.96
        },
        "2": {
          "market": 0.59,
          "analyst": 2.16,
          "opskins": 3
        },
        "3": {
          "market": 7.31,
          "analyst": 9.01,
          "opskins": 8.41
        },
        "4": {
          "market": 377.5,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "157": {
    "item_id": 157,
    "type": "AUG",
    "skinName": "Storm",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.15,
          "analyst": 0.11,
          "opskins": 0.1
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.62,
          "analyst": 3.82,
          "opskins": 6
        },
        "1": {
          "market": 2.44,
          "analyst": 2.56,
          "opskins": 2.79
        },
        "2": {
          "market": 0.89,
          "analyst": 1,
          "opskins": 1.72
        },
        "3": {
          "market": 3.14,
          "analyst": 3.3,
          "opskins": 2.67
        },
        "4": {
          "market": 131.34,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "158": {
    "item_id": 158,
    "type": "XM1014",
    "skinName": "Blue Spruce",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "4": {
          "market": 0.12,
          "analyst": 0.12,
          "opskins": 0.11
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.32,
          "analyst": 1.21,
          "opskins": 10.36
        },
        "1": {
          "market": 2.34,
          "analyst": 2.4,
          "opskins": 3.97
        },
        "2": {
          "market": 0.89,
          "analyst": 1.61,
          "opskins": 3
        },
        "3": {
          "market": 1.69,
          "analyst": 3.29,
          "opskins": 1.8
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "159": {
    "item_id": 159,
    "type": "P250",
    "skinName": "Boreal Forest",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.15,
          "analyst": 0.11,
          "opskins": 0.1
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.15,
          "analyst": 1.77,
          "opskins": 3.99
        },
        "1": {
          "market": 2.72,
          "analyst": 3.37,
          "opskins": 3.01
        },
        "2": {
          "market": 1.18,
          "analyst": 1.09,
          "opskins": 4.31
        },
        "3": {
          "market": 3.14,
          "analyst": 16.82,
          "opskins": 24.24
        },
        "4": {
          "market": 400,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "160": {
    "item_id": 160,
    "type": "XM1014",
    "skinName": "Blue Steel",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.11,
          "analyst": 0.08,
          "opskins": 0.08
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 10.89,
          "analyst": 12.41,
          "opskins": 13.6
        },
        "1": {
          "market": 4.86,
          "analyst": 6.18,
          "opskins": 8
        },
        "2": {
          "market": 5.72,
          "analyst": 6.25,
          "opskins": 7.96
        },
        "3": {
          "market": 16.82,
          "analyst": 14.56,
          "opskins": 11.24
        },
        "4": {
          "market": 80.5,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "161": {
    "item_id": 161,
    "type": "FAMAS",
    "skinName": "Cyanospatter",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.05,
          "analyst": 0.04,
          "opskins": 0.19
        },
        "4": {
          "market": 0.47,
          "analyst": 0.43,
          "opskins": 0.41
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 7.43,
          "analyst": 7.51,
          "opskins": 35
        },
        "1": {
          "market": 5.83,
          "analyst": 5.05,
          "opskins": 20
        },
        "2": {
          "market": 3.18,
          "analyst": 3.52,
          "opskins": 7
        },
        "3": {
          "market": 13.81,
          "analyst": 23.33,
          "opskins": 29.99
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "162": {
    "item_id": 162,
    "type": "PP-Bizon",
    "skinName": "Night Ops",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "4": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 24.34,
          "analyst": -1,
          "opskins": 19.99
        },
        "1": {
          "market": 161,
          "analyst": -1,
          "opskins": -1
        },
        "2": {
          "market": 1.42,
          "analyst": 1.61,
          "opskins": 4.5
        },
        "3": {
          "market": 4.6,
          "analyst": 4.98,
          "opskins": 6.08
        },
        "4": {
          "market": 31.85,
          "analyst": 19.92,
          "opskins": 25
        }
      }
    }
  },
  "163": {
    "item_id": 163,
    "type": "AWP",
    "skinName": "Safari Mesh",
    "prices": {
      "default": {
        "0": {
          "market": 0.39,
          "analyst": 0.33,
          "opskins": 0.26
        },
        "1": {
          "market": 0.18,
          "analyst": 0.14,
          "opskins": 0.11
        },
        "2": {
          "market": 0.1,
          "analyst": 0.08,
          "opskins": 0.07
        },
        "3": {
          "market": 0.31,
          "analyst": 0.25,
          "opskins": 0.19
        },
        "4": {
          "market": 2.1,
          "analyst": 1.81,
          "opskins": 1.6
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 47.11,
          "analyst": 31.01,
          "opskins": 100
        },
        "1": {
          "market": 61.03,
          "analyst": 35.73,
          "opskins": -1
        },
        "2": {
          "market": 22.5,
          "analyst": 23.95,
          "opskins": 33.33
        },
        "3": {
          "market": 51.84,
          "analyst": 38.41,
          "opskins": 70
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "164": {
    "item_id": 164,
    "type": "Desert Eagle",
    "skinName": "Mudder",
    "prices": {
      "default": {
        "0": {
          "market": 0.05,
          "analyst": 0.03,
          "opskins": 0.04
        },
        "1": {
          "market": 0.05,
          "analyst": 0.03,
          "opskins": 0.06
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.07,
          "analyst": 0.04,
          "opskins": 0.05
        },
        "4": {
          "market": 0.46,
          "analyst": 0.31,
          "opskins": 0.39
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 21.52,
          "analyst": 29.15,
          "opskins": 20
        },
        "1": {
          "market": 85,
          "analyst": 93.91,
          "opskins": 55
        },
        "2": {
          "market": 6.69,
          "analyst": 8.05,
          "opskins": 7.48
        },
        "3": {
          "market": 20.27,
          "analyst": 16.62,
          "opskins": 11.98
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "165": {
    "item_id": 165,
    "type": "SG 553",
    "skinName": "Anodized Navy",
    "prices": {
      "default": {
        "3": {
          "market": 0.23,
          "analyst": 0.19,
          "opskins": 0.29
        },
        "4": {
          "market": 0.19,
          "analyst": 0.12,
          "opskins": 0.09
        }
      },
      "stattrak": {},
      "souvenir": {
        "3": {
          "market": -1,
          "analyst": -1,
          "opskins": 69.36
        },
        "4": {
          "market": 32.2,
          "analyst": 31.77,
          "opskins": 34.19
        }
      }
    }
  },
  "166": {
    "item_id": 166,
    "type": "P90",
    "skinName": "Teardown",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.1
        },
        "1": {
          "market": 0.11,
          "analyst": 0.11,
          "opskins": 0.09
        },
        "2": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.06
        },
        "3": {
          "market": 0.11,
          "analyst": 0.08,
          "opskins": 0.1
        },
        "4": {
          "market": 0.2,
          "analyst": 0.16,
          "opskins": 0.13
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 48.88,
          "analyst": 38.45,
          "opskins": 79.56
        },
        "1": {
          "market": 379.99,
          "analyst": -1,
          "opskins": -1
        },
        "2": {
          "market": 16,
          "analyst": 13.73,
          "opskins": 21.11
        },
        "3": {
          "market": 33.97,
          "analyst": 15.63,
          "opskins": 19.79
        },
        "4": {
          "market": 48.83,
          "analyst": -1,
          "opskins": 49.85
        }
      }
    }
  },
  "167": {
    "item_id": 167,
    "type": "USP-S",
    "skinName": "Night Ops",
    "prices": {
      "default": {
        "0": {
          "market": 0.18,
          "analyst": 0.13,
          "opskins": 0.23
        },
        "1": {
          "market": 0.31,
          "analyst": 0.24,
          "opskins": 0.22
        },
        "2": {
          "market": 0.15,
          "analyst": 0.1,
          "opskins": 0.1
        },
        "3": {
          "market": 0.25,
          "analyst": 0.17,
          "opskins": 0.16
        },
        "4": {
          "market": 0.44,
          "analyst": 0.33,
          "opskins": 0.28
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 399.05,
          "analyst": 25.94,
          "opskins": -1
        },
        "1": {
          "market": 40.85,
          "analyst": -1,
          "opskins": 22
        },
        "2": {
          "market": 18.31,
          "analyst": 35.86,
          "opskins": 38.99
        },
        "3": {
          "market": 91.56,
          "analyst": -1,
          "opskins": 89
        },
        "4": {
          "market": 219.9,
          "analyst": 240.09,
          "opskins": 200
        }
      }
    }
  },
  "168": {
    "item_id": 168,
    "type": "Dual Berettas",
    "skinName": "Cobalt Quartz",
    "prices": {
      "default": {
        "1": {
          "market": 0.23,
          "analyst": 0.21,
          "opskins": 0.21
        },
        "2": {
          "market": 0.19,
          "analyst": 0.17,
          "opskins": 0.15
        },
        "3": {
          "market": 0.19,
          "analyst": 0.17,
          "opskins": 0.14
        },
        "4": {
          "market": 0.2,
          "analyst": 0.18,
          "opskins": 0.15
        }
      },
      "stattrak": {},
      "souvenir": {
        "1": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        },
        "2": {
          "market": 31.85,
          "analyst": 51,
          "opskins": 39
        },
        "3": {
          "market": 92,
          "analyst": 156.42,
          "opskins": 116.42
        },
        "4": {
          "market": 132.94,
          "analyst": 181.2,
          "opskins": 250
        }
      }
    }
  },
  "169": {
    "item_id": 169,
    "type": "XM1014",
    "skinName": "Grassland",
    "prices": {
      "default": {
        "0": {
          "market": 0.27,
          "analyst": 0.14,
          "opskins": 0.11
        },
        "1": {
          "market": 0.49,
          "analyst": 0.19,
          "opskins": 0.73
        },
        "2": {
          "market": 0.24,
          "analyst": 0.16,
          "opskins": 1
        },
        "3": {
          "market": 0.71,
          "analyst": 0.43,
          "opskins": 0.58
        },
        "4": {
          "market": 7.04,
          "analyst": 4.61,
          "opskins": 7.99
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "170": {
    "item_id": 170,
    "type": "MAC-10",
    "skinName": "Tornado",
    "prices": {
      "default": {
        "0": {
          "market": 0.23,
          "analyst": 0.18,
          "opskins": 0.6
        },
        "1": {
          "market": 0.4,
          "analyst": 1.38,
          "opskins": 249.99
        },
        "2": {
          "market": 0.24,
          "analyst": 0.16,
          "opskins": 0.94
        },
        "3": {
          "market": 0.59,
          "analyst": 0.4,
          "opskins": 0.55
        },
        "4": {
          "market": 5.3,
          "analyst": 5.07,
          "opskins": 5.87
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "171": {
    "item_id": 171,
    "type": "PP-Bizon",
    "skinName": "Forest Leaves",
    "prices": {
      "default": {
        "0": {
          "market": 0.25,
          "analyst": 0.17,
          "opskins": 11.99
        },
        "1": {
          "market": 0.39,
          "analyst": 1.02,
          "opskins": 0.98
        },
        "2": {
          "market": 0.33,
          "analyst": 0.16,
          "opskins": 0.16
        },
        "3": {
          "market": 0.69,
          "analyst": 0.38,
          "opskins": 0.5
        },
        "4": {
          "market": 4.58,
          "analyst": 5.95,
          "opskins": 5.65
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "172": {
    "item_id": 172,
    "type": "P2000",
    "skinName": "Grassland Leaves",
    "prices": {
      "default": {
        "0": {
          "market": 1.05,
          "analyst": 0.66,
          "opskins": 0.9
        },
        "1": {
          "market": 1.24,
          "analyst": -1,
          "opskins": 3.25
        },
        "2": {
          "market": 0.94,
          "analyst": 0.64,
          "opskins": 0.84
        },
        "3": {
          "market": 3.64,
          "analyst": 3.05,
          "opskins": 2.58
        },
        "4": {
          "market": 25.89,
          "analyst": 48.33,
          "opskins": 85
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "173": {
    "item_id": 173,
    "type": "Nova",
    "skinName": "Blaze Orange",
    "prices": {
      "default": {
        "0": {
          "market": 2.07,
          "analyst": 2.63,
          "opskins": 2.59
        },
        "1": {
          "market": 1.93,
          "analyst": 4.04,
          "opskins": 4.79
        },
        "2": {
          "market": 1.55,
          "analyst": 1.68,
          "opskins": 1.46
        },
        "3": {
          "market": 5.01,
          "analyst": 4.86,
          "opskins": 4.85
        },
        "4": {
          "market": 69.34,
          "analyst": 101.31,
          "opskins": 99
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "174": {
    "item_id": 174,
    "type": "P250",
    "skinName": "Modern Hunter",
    "prices": {
      "default": {
        "0": {
          "market": 1.84,
          "analyst": 2.36,
          "opskins": 7.21
        },
        "1": {
          "market": 2.76,
          "analyst": 5.45,
          "opskins": 4.89
        },
        "2": {
          "market": 1.89,
          "analyst": 1.79,
          "opskins": 3.95
        },
        "3": {
          "market": 7.59,
          "analyst": 7.58,
          "opskins": 7.77
        },
        "4": {
          "market": 108.18,
          "analyst": 339.18,
          "opskins": 399.99
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "175": {
    "item_id": 175,
    "type": "XM1014",
    "skinName": "Blaze Orange",
    "prices": {
      "default": {
        "0": {
          "market": 2.31,
          "analyst": 6.74,
          "opskins": 9.99
        },
        "1": {
          "market": 2.66,
          "analyst": 3.21,
          "opskins": 4.17
        },
        "2": {
          "market": 1.46,
          "analyst": 1.31,
          "opskins": 1.47
        },
        "3": {
          "market": 5.79,
          "analyst": 5.83,
          "opskins": 5.03
        },
        "4": {
          "market": 38.75,
          "analyst": 64.42,
          "opskins": 55
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "176": {
    "item_id": 176,
    "type": "PP-Bizon",
    "skinName": "Modern Hunter",
    "prices": {
      "default": {
        "0": {
          "market": 2.66,
          "analyst": 3.69,
          "opskins": 3.13
        },
        "1": {
          "market": 4.04,
          "analyst": 3.38,
          "opskins": 9.99
        },
        "2": {
          "market": 1.75,
          "analyst": 1.84,
          "opskins": 1.57
        },
        "3": {
          "market": 4.68,
          "analyst": 6.54,
          "opskins": 9.95
        },
        "4": {
          "market": 65.12,
          "analyst": -1,
          "opskins": 70
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "177": {
    "item_id": 177,
    "type": "Nova",
    "skinName": "Modern Hunter",
    "prices": {
      "default": {
        "0": {
          "market": 3.74,
          "analyst": 4.72,
          "opskins": 4.25
        },
        "1": {
          "market": 5.22,
          "analyst": 7.87,
          "opskins": 6
        },
        "2": {
          "market": 1.96,
          "analyst": 2.29,
          "opskins": 1.9
        },
        "3": {
          "market": 6.37,
          "analyst": 7.02,
          "opskins": 6.84
        },
        "4": {
          "market": 65.47,
          "analyst": -1,
          "opskins": 69.99
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "178": {
    "item_id": 178,
    "type": "M4A4",
    "skinName": "Modern Hunter",
    "prices": {
      "default": {
        "0": {
          "market": 4.65,
          "analyst": 7.54,
          "opskins": 5.64
        },
        "1": {
          "market": 4.53,
          "analyst": 5.46,
          "opskins": 11
        },
        "2": {
          "market": 5.93,
          "analyst": 4.75,
          "opskins": 9.32
        },
        "3": {
          "market": 15.76,
          "analyst": 15.47,
          "opskins": 16.54
        },
        "4": {
          "market": 90.12,
          "analyst": 124.19,
          "opskins": 114.81
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "179": {
    "item_id": 179,
    "type": "SCAR-20",
    "skinName": "Splash Jam",
    "prices": {
      "default": {
        "0": {
          "market": 1.46,
          "analyst": 1.64,
          "opskins": 2.32
        },
        "1": {
          "market": 1.51,
          "analyst": 2.01,
          "opskins": 1.85
        },
        "2": {
          "market": 1.6,
          "analyst": 1.37,
          "opskins": 1.62
        },
        "3": {
          "market": 7.14,
          "analyst": 6.99,
          "opskins": 6.02
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": 349.9
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "180": {
    "item_id": 180,
    "type": "AUG",
    "skinName": "Colony",
    "prices": {
      "default": {
        "0": {
          "market": 0.08,
          "analyst": 0.11,
          "opskins": 0.13
        },
        "1": {
          "market": 0.14,
          "analyst": 0.17,
          "opskins": 0.15
        },
        "2": {
          "market": 0.07,
          "analyst": 0.07,
          "opskins": 0.08
        },
        "3": {
          "market": 0.16,
          "analyst": 0.14,
          "opskins": 0.12
        },
        "4": {
          "market": 0.95,
          "analyst": 1.17,
          "opskins": 1.97
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.38,
          "analyst": 0.37,
          "opskins": 0.27
        },
        "1": {
          "market": 0.59,
          "analyst": 0.37,
          "opskins": 0.39
        },
        "2": {
          "market": 0.3,
          "analyst": 0.27,
          "opskins": 0.22
        },
        "3": {
          "market": 0.57,
          "analyst": 0.52,
          "opskins": 0.43
        },
        "4": {
          "market": 4.46,
          "analyst": 4.55,
          "opskins": 3.52
        }
      }
    }
  },
  "181": {
    "item_id": 181,
    "type": "G3SG1",
    "skinName": "Safari Mesh",
    "prices": {
      "default": {
        "0": {
          "market": 0.08,
          "analyst": 0.11,
          "opskins": 0.1
        },
        "1": {
          "market": 0.11,
          "analyst": 0.19,
          "opskins": 0.15
        },
        "2": {
          "market": 0.07,
          "analyst": 0.07,
          "opskins": 0.14
        },
        "3": {
          "market": 0.11,
          "analyst": 0.12,
          "opskins": 0.11
        },
        "4": {
          "market": 1.26,
          "analyst": 1.04,
          "opskins": 1.07
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.19,
          "analyst": 0.15,
          "opskins": 0.16
        },
        "1": {
          "market": 0.15,
          "analyst": 0.15,
          "opskins": 0.18
        },
        "2": {
          "market": 0.14,
          "analyst": 0.13,
          "opskins": 0.13
        },
        "3": {
          "market": 0.23,
          "analyst": 0.2,
          "opskins": 0.23
        },
        "4": {
          "market": 3.16,
          "analyst": 3.21,
          "opskins": 4.99
        }
      }
    }
  },
  "182": {
    "item_id": 182,
    "type": "Galil AR",
    "skinName": "Hunting Blind",
    "prices": {
      "default": {
        "0": {
          "market": 0.17,
          "analyst": 0.12,
          "opskins": 0.11
        },
        "1": {
          "market": 0.25,
          "analyst": 2.78,
          "opskins": 2.41
        },
        "2": {
          "market": 0.08,
          "analyst": 0.08,
          "opskins": 0.1
        },
        "3": {
          "market": 0.12,
          "analyst": 0.13,
          "opskins": 0.11
        },
        "4": {
          "market": 0.49,
          "analyst": 0.32,
          "opskins": 0.29
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.48,
          "analyst": 0.47,
          "opskins": 0.45
        },
        "1": {
          "market": 0.74,
          "analyst": 0.72,
          "opskins": 2.58
        },
        "2": {
          "market": 0.35,
          "analyst": 0.31,
          "opskins": 0.29
        },
        "3": {
          "market": 0.46,
          "analyst": 0.47,
          "opskins": 0.3
        },
        "4": {
          "market": 1.2,
          "analyst": 1.11,
          "opskins": 0.99
        }
      }
    }
  },
  "183": {
    "item_id": 183,
    "type": "Five-SeveN",
    "skinName": "Contractor",
    "prices": {
      "default": {
        "0": {
          "market": 0.15,
          "analyst": 0.16,
          "opskins": 0.12
        },
        "1": {
          "market": 0.18,
          "analyst": 0.14,
          "opskins": 0.12
        },
        "2": {
          "market": 0.09,
          "analyst": 0.1,
          "opskins": 0.11
        },
        "3": {
          "market": 0.27,
          "analyst": 0.27,
          "opskins": 0.23
        },
        "4": {
          "market": 2.62,
          "analyst": 2.48,
          "opskins": 1.99
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.41,
          "analyst": 0.41,
          "opskins": 0.34
        },
        "1": {
          "market": 0.48,
          "analyst": 0.49,
          "opskins": 0.58
        },
        "2": {
          "market": 0.38,
          "analyst": 0.32,
          "opskins": 0.26
        },
        "3": {
          "market": 0.71,
          "analyst": 0.69,
          "opskins": 1.99
        },
        "4": {
          "market": 8.6,
          "analyst": 8.29,
          "opskins": 7
        }
      }
    }
  },
  "184": {
    "item_id": 184,
    "type": "P90",
    "skinName": "Scorched",
    "prices": {
      "default": {
        "0": {
          "market": 0.11,
          "analyst": 0.09,
          "opskins": 0.12
        },
        "1": {
          "market": 0.16,
          "analyst": 0.25,
          "opskins": 0.21
        },
        "2": {
          "market": 0.08,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "3": {
          "market": 0.12,
          "analyst": 0.17,
          "opskins": 0.14
        },
        "4": {
          "market": 2.45,
          "analyst": 1.8,
          "opskins": 2.62
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.25,
          "analyst": 0.22,
          "opskins": 0.23
        },
        "1": {
          "market": 0.29,
          "analyst": 0.25,
          "opskins": 0.25
        },
        "2": {
          "market": 0.21,
          "analyst": 0.19,
          "opskins": 0.19
        },
        "3": {
          "market": 0.4,
          "analyst": 0.41,
          "opskins": 0.4
        },
        "4": {
          "market": 4.88,
          "analyst": 4.14,
          "opskins": 3.5
        }
      }
    }
  },
  "185": {
    "item_id": 185,
    "type": "P250",
    "skinName": "Bone Mask",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.25,
          "opskins": 0.22
        },
        "1": {
          "market": 0.12,
          "analyst": 0.19,
          "opskins": 0.18
        },
        "2": {
          "market": 0.08,
          "analyst": 0.07,
          "opskins": 0.47
        },
        "3": {
          "market": 0.12,
          "analyst": 0.15,
          "opskins": 0.14
        },
        "4": {
          "market": 1.97,
          "analyst": 1.86,
          "opskins": 5.5
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.35,
          "analyst": 0.35,
          "opskins": 0.33
        },
        "1": {
          "market": 0.38,
          "analyst": 0.41,
          "opskins": 0.41
        },
        "2": {
          "market": 0.32,
          "analyst": 0.28,
          "opskins": 0.24
        },
        "3": {
          "market": 0.61,
          "analyst": 0.58,
          "opskins": 0.46
        },
        "4": {
          "market": 3.91,
          "analyst": 4.47,
          "opskins": 25
        }
      }
    }
  },
  "186": {
    "item_id": 186,
    "type": "SG 553",
    "skinName": "Gator Mesh",
    "prices": {
      "default": {
        "0": {
          "market": 0.77,
          "analyst": 1.19,
          "opskins": 2
        },
        "1": {
          "market": 0.68,
          "analyst": 0.62,
          "opskins": 1.4
        },
        "2": {
          "market": 0.67,
          "analyst": 0.47,
          "opskins": 0.45
        },
        "3": {
          "market": 0.79,
          "analyst": 0.55,
          "opskins": 0.52
        },
        "4": {
          "market": 0.92,
          "analyst": 0.68,
          "opskins": 0.62
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.81,
          "analyst": 0.88,
          "opskins": 0.79
        },
        "1": {
          "market": 1.28,
          "analyst": 1.42,
          "opskins": 5.02
        },
        "2": {
          "market": 0.54,
          "analyst": 0.52,
          "opskins": 0.45
        },
        "3": {
          "market": 1.01,
          "analyst": 0.76,
          "opskins": 0.68
        },
        "4": {
          "market": 2.14,
          "analyst": 2.11,
          "opskins": 5
        }
      }
    }
  },
  "187": {
    "item_id": 187,
    "type": "MP7",
    "skinName": "Orange Peel",
    "prices": {
      "default": {
        "0": {
          "market": 0.61,
          "analyst": 0.56,
          "opskins": 0.55
        },
        "1": {
          "market": 1.38,
          "analyst": 1.7,
          "opskins": 1.45
        },
        "2": {
          "market": 0.62,
          "analyst": 0.45,
          "opskins": 0.39
        },
        "3": {
          "market": 0.76,
          "analyst": 0.57,
          "opskins": 0.55
        },
        "4": {
          "market": 4.69,
          "analyst": 3.53,
          "opskins": 15
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.83,
          "analyst": 0.74,
          "opskins": 1
        },
        "1": {
          "market": 0.84,
          "analyst": 0.81,
          "opskins": 3.6
        },
        "2": {
          "market": 0.65,
          "analyst": 0.69,
          "opskins": 0.63
        },
        "3": {
          "market": 2.09,
          "analyst": 1.83,
          "opskins": 5.2
        },
        "4": {
          "market": 22.24,
          "analyst": 21.3,
          "opskins": 25
        }
      }
    }
  },
  "188": {
    "item_id": 188,
    "type": "Glock-18",
    "skinName": "Groundwater",
    "prices": {
      "default": {
        "0": {
          "market": 0.62,
          "analyst": 0.53,
          "opskins": 0.88
        },
        "1": {
          "market": 0.68,
          "analyst": 0.64,
          "opskins": 0.79
        },
        "2": {
          "market": 0.63,
          "analyst": 0.48,
          "opskins": 0.53
        },
        "3": {
          "market": 1.09,
          "analyst": 0.89,
          "opskins": 0.93
        },
        "4": {
          "market": 9.57,
          "analyst": 9.64,
          "opskins": 19.99
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 2,
          "analyst": 1.84,
          "opskins": 2.1
        },
        "1": {
          "market": 2.82,
          "analyst": 2.33,
          "opskins": 2.61
        },
        "2": {
          "market": 2.14,
          "analyst": 1.96,
          "opskins": 1.81
        },
        "3": {
          "market": 5.2,
          "analyst": 4.94,
          "opskins": 5.5
        },
        "4": {
          "market": 41.02,
          "analyst": 47.15,
          "opskins": 125
        }
      }
    }
  },
  "189": {
    "item_id": 189,
    "type": "Negev",
    "skinName": "CaliCamo",
    "prices": {
      "default": {
        "0": {
          "market": 0.71,
          "analyst": 1.46,
          "opskins": 1.19
        },
        "1": {
          "market": 1.26,
          "analyst": 1.91,
          "opskins": 1.65
        },
        "2": {
          "market": 0.62,
          "analyst": 0.46,
          "opskins": 2.96
        },
        "3": {
          "market": 0.74,
          "analyst": 0.6,
          "opskins": 0.55
        },
        "4": {
          "market": 1.16,
          "analyst": 0.74,
          "opskins": 0.98
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.39,
          "analyst": 0.36,
          "opskins": 0.42
        },
        "1": {
          "market": 0.46,
          "analyst": 0.41,
          "opskins": 4.09
        },
        "2": {
          "market": 0.3,
          "analyst": 0.27,
          "opskins": 0.27
        },
        "3": {
          "market": 0.49,
          "analyst": 0.34,
          "opskins": 0.29
        },
        "4": {
          "market": 1.2,
          "analyst": 1.22,
          "opskins": 1.49
        }
      }
    }
  },
  "190": {
    "item_id": 190,
    "type": "SSG 08",
    "skinName": "Tropical Storm",
    "prices": {
      "default": {
        "0": {
          "market": 0.6,
          "analyst": 0.59,
          "opskins": 0.48
        },
        "1": {
          "market": 0.62,
          "analyst": 0.7,
          "opskins": 0.81
        },
        "2": {
          "market": 0.61,
          "analyst": 0.47,
          "opskins": 0.41
        },
        "3": {
          "market": 0.77,
          "analyst": 0.61,
          "opskins": 0.58
        },
        "4": {
          "market": 5.47,
          "analyst": 6.93,
          "opskins": 6.92
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.88,
          "analyst": 1.68,
          "opskins": 1.79
        },
        "1": {
          "market": 1.66,
          "analyst": 1.71,
          "opskins": 2.73
        },
        "2": {
          "market": 1.5,
          "analyst": 1.47,
          "opskins": 1.41
        },
        "3": {
          "market": 4.8,
          "analyst": 4.37,
          "opskins": 7
        },
        "4": {
          "market": 87.45,
          "analyst": 43.47,
          "opskins": 42
        }
      }
    }
  },
  "191": {
    "item_id": 191,
    "type": "MP9",
    "skinName": "Hot Rod",
    "prices": {
      "default": {
        "3": {
          "market": 6.36,
          "analyst": 4.46,
          "opskins": 6.35
        },
        "4": {
          "market": 4.63,
          "analyst": 3.95,
          "opskins": 3.27
        }
      },
      "stattrak": {},
      "souvenir": {
        "3": {
          "market": 12.65,
          "analyst": 12.78,
          "opskins": 11.11
        },
        "4": {
          "market": 10.49,
          "analyst": 10.66,
          "opskins": 11.55
        }
      }
    }
  },
  "192": {
    "item_id": 192,
    "type": "MAC-10",
    "skinName": "Amber Fade",
    "prices": {
      "default": {
        "1": {
          "market": 3.66,
          "analyst": 3.14,
          "opskins": 7.75
        },
        "2": {
          "market": 1.1,
          "analyst": 1.03,
          "opskins": 2.97
        },
        "3": {
          "market": 1.47,
          "analyst": 1.13,
          "opskins": 1.71
        },
        "4": {
          "market": 3.29,
          "analyst": 2.94,
          "opskins": 3.79
        }
      },
      "stattrak": {},
      "souvenir": {
        "1": {
          "market": 7.31,
          "analyst": 5.98,
          "opskins": 4.5
        },
        "2": {
          "market": 2.68,
          "analyst": 1.89,
          "opskins": 2.5
        },
        "3": {
          "market": 4.15,
          "analyst": 3.88,
          "opskins": 3.4
        },
        "4": {
          "market": 8.44,
          "analyst": 9.07,
          "opskins": 8
        }
      }
    }
  },
  "193": {
    "item_id": 193,
    "type": "UMP-45",
    "skinName": "Blaze",
    "prices": {
      "default": {
        "3": {
          "market": 15.08,
          "analyst": 12.27,
          "opskins": 12.19
        },
        "4": {
          "market": 9.97,
          "analyst": 7.16,
          "opskins": 6.15
        }
      },
      "stattrak": {},
      "souvenir": {
        "3": {
          "market": 32.91,
          "analyst": 28.9,
          "opskins": 35
        },
        "4": {
          "market": 25.96,
          "analyst": 24.68,
          "opskins": 23
        }
      }
    }
  },
  "194": {
    "item_id": 194,
    "type": "MAG-7",
    "skinName": "Bulldozer",
    "prices": {
      "default": {
        "0": {
          "market": 0.39,
          "analyst": 0.33,
          "opskins": 0.3
        },
        "1": {
          "market": 0.78,
          "analyst": 0.63,
          "opskins": 0.61
        },
        "2": {
          "market": 0.48,
          "analyst": 0.41,
          "opskins": 0.33
        },
        "3": {
          "market": 3.52,
          "analyst": 2.74,
          "opskins": 2.26
        },
        "4": {
          "market": 28.23,
          "analyst": 31.45,
          "opskins": 29.97
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 3.64,
          "analyst": 3.26,
          "opskins": 3.83
        },
        "1": {
          "market": 3.18,
          "analyst": 3.45,
          "opskins": 3.6
        },
        "2": {
          "market": 3.84,
          "analyst": 3.72,
          "opskins": 4.98
        },
        "3": {
          "market": 20.17,
          "analyst": 16.32,
          "opskins": 20
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "195": {
    "item_id": 195,
    "type": "MAG-7",
    "skinName": "Irradiated Alert",
    "prices": {
      "default": {
        "0": {
          "market": 0.45,
          "analyst": 1.09,
          "opskins": 5
        },
        "1": {
          "market": 0.89,
          "analyst": 0.32,
          "opskins": 0.24
        },
        "2": {
          "market": 0.2,
          "analyst": 0.19,
          "opskins": 0.16
        },
        "3": {
          "market": 0.44,
          "analyst": 0.4,
          "opskins": 0.38
        },
        "4": {
          "market": 3.14,
          "analyst": 3.17,
          "opskins": 2.68
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.24,
          "analyst": 0.23,
          "opskins": 2
        },
        "1": {
          "market": 0.46,
          "analyst": 0.23,
          "opskins": 0.25
        },
        "2": {
          "market": 0.2,
          "analyst": 0.2,
          "opskins": 0.2
        },
        "3": {
          "market": 0.73,
          "analyst": 0.76,
          "opskins": 0.57
        },
        "4": {
          "market": 12.61,
          "analyst": 13.26,
          "opskins": 21.18
        }
      }
    }
  },
  "196": {
    "item_id": 196,
    "type": "PP-Bizon",
    "skinName": "Irradiated Alert",
    "prices": {
      "default": {
        "0": {
          "market": 0.18,
          "analyst": 0.28,
          "opskins": 0.8
        },
        "1": {
          "market": 0.23,
          "analyst": 0.2,
          "opskins": 0.19
        },
        "2": {
          "market": 0.22,
          "analyst": 0.19,
          "opskins": 0.24
        },
        "3": {
          "market": 0.42,
          "analyst": 0.37,
          "opskins": 0.41
        },
        "4": {
          "market": 3.12,
          "analyst": 3.47,
          "opskins": 3
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.23,
          "analyst": 0.22,
          "opskins": 0.29
        },
        "1": {
          "market": 0.39,
          "analyst": 0.38,
          "opskins": 2.5
        },
        "2": {
          "market": 0.25,
          "analyst": 0.24,
          "opskins": 0.24
        },
        "3": {
          "market": 1,
          "analyst": 0.69,
          "opskins": 0.85
        },
        "4": {
          "market": 7.49,
          "analyst": 14.9,
          "opskins": 14.9
        }
      }
    }
  },
  "197": {
    "item_id": 197,
    "type": "Sawed-Off",
    "skinName": "Irradiated Alert",
    "prices": {
      "default": {
        "0": {
          "market": 0.25,
          "analyst": 0.18,
          "opskins": 0.27
        },
        "1": {
          "market": 0.27,
          "analyst": 0.28,
          "opskins": 0.27
        },
        "2": {
          "market": 0.2,
          "analyst": 0.16,
          "opskins": 0.12
        },
        "3": {
          "market": 0.39,
          "analyst": 0.37,
          "opskins": 0.34
        },
        "4": {
          "market": 2.58,
          "analyst": 3.18,
          "opskins": 4
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.2,
          "analyst": 0.19,
          "opskins": 0.19
        },
        "1": {
          "market": 0.25,
          "analyst": 0.24,
          "opskins": 0.8
        },
        "2": {
          "market": 0.18,
          "analyst": 0.18,
          "opskins": 0.18
        },
        "3": {
          "market": 0.4,
          "analyst": 0.33,
          "opskins": 0.32
        },
        "4": {
          "market": 14.44,
          "analyst": 17.08,
          "opskins": 17.22
        }
      }
    }
  },
  "198": {
    "item_id": 198,
    "type": "P90",
    "skinName": "Fallout Warning",
    "prices": {
      "default": {
        "0": {
          "market": 1,
          "analyst": 0.88,
          "opskins": 1.18
        },
        "1": {
          "market": 0.93,
          "analyst": 0.84,
          "opskins": 0.81
        },
        "2": {
          "market": 1.09,
          "analyst": 0.9,
          "opskins": 0.81
        },
        "3": {
          "market": 3.01,
          "analyst": 2.47,
          "opskins": 2.44
        },
        "4": {
          "market": 13.43,
          "analyst": 15.61,
          "opskins": 20.6
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.34,
          "analyst": 3.35,
          "opskins": 3.04
        },
        "1": {
          "market": 2.26,
          "analyst": 3.5,
          "opskins": 2.89
        },
        "2": {
          "market": 1.49,
          "analyst": 1.26,
          "opskins": 1.19
        },
        "3": {
          "market": 3.61,
          "analyst": 3.51,
          "opskins": 4.85
        },
        "4": {
          "market": 241.69,
          "analyst": 162.27,
          "opskins": 115
        }
      }
    }
  },
  "199": {
    "item_id": 199,
    "type": "UMP-45",
    "skinName": "Fallout Warning",
    "prices": {
      "default": {
        "0": {
          "market": 1.01,
          "analyst": 0.99,
          "opskins": 1
        },
        "1": {
          "market": 1.45,
          "analyst": 0.95,
          "opskins": 1.04
        },
        "2": {
          "market": 1.31,
          "analyst": 1,
          "opskins": 1.03
        },
        "3": {
          "market": 3.64,
          "analyst": 3.01,
          "opskins": 2.55
        },
        "4": {
          "market": 21.09,
          "analyst": 23.75,
          "opskins": 24.99
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.84,
          "analyst": 2.85,
          "opskins": 2.75
        },
        "1": {
          "market": 2.7,
          "analyst": 3.15,
          "opskins": 3.06
        },
        "2": {
          "market": 2.89,
          "analyst": 2.74,
          "opskins": 2.35
        },
        "3": {
          "market": 8.18,
          "analyst": 7.97,
          "opskins": 6.79
        },
        "4": {
          "market": 382.38,
          "analyst": 138.95,
          "opskins": 150
        }
      }
    }
  },
  "200": {
    "item_id": 200,
    "type": "XM1014",
    "skinName": "Fallout Warning",
    "prices": {
      "default": {
        "0": {
          "market": 1.01,
          "analyst": 2.21,
          "opskins": 0.75
        },
        "1": {
          "market": 1.11,
          "analyst": 1.07,
          "opskins": 1.74
        },
        "2": {
          "market": 1.11,
          "analyst": 0.97,
          "opskins": 0.97
        },
        "3": {
          "market": 2.68,
          "analyst": 2.6,
          "opskins": 2.47
        },
        "4": {
          "market": 17.2,
          "analyst": 20.41,
          "opskins": 35
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.94,
          "analyst": 1.23,
          "opskins": 1.45
        },
        "1": {
          "market": 1.33,
          "analyst": 1.6,
          "opskins": 2.95
        },
        "2": {
          "market": 0.95,
          "analyst": 0.9,
          "opskins": 1
        },
        "3": {
          "market": 1.92,
          "analyst": 1.91,
          "opskins": 1.89
        },
        "4": {
          "market": 87.56,
          "analyst": 87.89,
          "opskins": 189.99
        }
      }
    }
  },
  "201": {
    "item_id": 201,
    "type": "M4A4",
    "skinName": "Radiation Hazard",
    "prices": {
      "default": {
        "0": {
          "market": 4.97,
          "analyst": 3.88,
          "opskins": 5.97
        },
        "1": {
          "market": 5.73,
          "analyst": 3.73,
          "opskins": 5.2
        },
        "2": {
          "market": 5.04,
          "analyst": 4.04,
          "opskins": 4.16
        },
        "3": {
          "market": 16.25,
          "analyst": 14.5,
          "opskins": 13.28
        },
        "4": {
          "market": 119.7,
          "analyst": 90,
          "opskins": 106.99
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 7.43,
          "analyst": 8.49,
          "opskins": 21
        },
        "1": {
          "market": 14.74,
          "analyst": 14.06,
          "opskins": 17.51
        },
        "2": {
          "market": 10.74,
          "analyst": 10.4,
          "opskins": 9.5
        },
        "3": {
          "market": 41.23,
          "analyst": 36.22,
          "opskins": 36.87
        },
        "4": {
          "market": -1,
          "analyst": 223.87,
          "opskins": 420
        }
      }
    }
  },
  "202": {
    "item_id": 202,
    "type": "P250",
    "skinName": "Nuclear Threat",
    "prices": {
      "default": {
        "0": {
          "market": 3.1,
          "analyst": 2.27,
          "opskins": 2.69
        },
        "1": {
          "market": 4.85,
          "analyst": 3.63,
          "opskins": 3.89
        },
        "2": {
          "market": 5.55,
          "analyst": 4.33,
          "opskins": 3.78
        },
        "3": {
          "market": 24.84,
          "analyst": 19.5,
          "opskins": 16.95
        },
        "4": {
          "market": 243,
          "analyst": 239,
          "opskins": 252.99
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 26.49,
          "analyst": 27.77,
          "opskins": 24.63
        },
        "1": {
          "market": 50.74,
          "analyst": 35.89,
          "opskins": 30
        },
        "2": {
          "market": 35,
          "analyst": 38.63,
          "opskins": 37.57
        },
        "3": {
          "market": 305.48,
          "analyst": 277.7,
          "opskins": 215
        }
      }
    }
  },
  "203": {
    "item_id": 203,
    "type": "Tec-9",
    "skinName": "Nuclear Threat",
    "prices": {
      "default": {
        "0": {
          "market": 8.13,
          "analyst": 8.91,
          "opskins": 7.68
        },
        "1": {
          "market": 11.6,
          "analyst": 10.08,
          "opskins": 8.95
        },
        "2": {
          "market": 13.74,
          "analyst": 10.49,
          "opskins": 10.13
        },
        "3": {
          "market": 30.93,
          "analyst": 29.61,
          "opskins": 25.9
        },
        "4": {
          "market": 310.05,
          "analyst": 252,
          "opskins": 278.95
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 45.44,
          "analyst": 36.7,
          "opskins": 46.99
        },
        "1": {
          "market": 43.35,
          "analyst": 46.51,
          "opskins": 39.55
        },
        "2": {
          "market": 84.06,
          "analyst": 68.11,
          "opskins": 52.47
        },
        "3": {
          "market": 353.88,
          "analyst": 293.39,
          "opskins": 240
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "204": {
    "item_id": 204,
    "type": "FAMAS",
    "skinName": "Contrast Spray",
    "prices": {
      "default": {
        "0": {
          "market": 0.83,
          "analyst": 0.33,
          "opskins": 27.78
        },
        "1": {
          "market": 1.34,
          "analyst": 0.57,
          "opskins": 15
        },
        "2": {
          "market": 0.39,
          "analyst": 0.32,
          "opskins": 0.35
        },
        "3": {
          "market": 0.73,
          "analyst": 0.73,
          "opskins": 0.72
        },
        "4": {
          "market": 5.88,
          "analyst": 6.56,
          "opskins": 5.25
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "205": {
    "item_id": 205,
    "type": "Galil AR",
    "skinName": "Winter Forest",
    "prices": {
      "default": {
        "0": {
          "market": 0.88,
          "analyst": 0.96,
          "opskins": 5
        },
        "1": {
          "market": 1.23,
          "analyst": 1.45,
          "opskins": 2
        },
        "2": {
          "market": 0.93,
          "analyst": 0.62,
          "opskins": 3.99
        },
        "3": {
          "market": 3.08,
          "analyst": 2.15,
          "opskins": 2.41
        },
        "4": {
          "market": 43.99,
          "analyst": 29.34,
          "opskins": 50
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "206": {
    "item_id": 206,
    "type": "G3SG1",
    "skinName": "Arctic Camo",
    "prices": {
      "default": {
        "0": {
          "market": 2.85,
          "analyst": 5.09,
          "opskins": 1.55
        },
        "1": {
          "market": 0.83,
          "analyst": 2.04,
          "opskins": 1.5
        },
        "2": {
          "market": 0.98,
          "analyst": 0.65,
          "opskins": 0.66
        },
        "3": {
          "market": 2.38,
          "analyst": 2.2,
          "opskins": 1.68
        },
        "4": {
          "market": 24.09,
          "analyst": 27.33,
          "opskins": 26
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "207": {
    "item_id": 207,
    "type": "M249",
    "skinName": "Blizzard Marbleized",
    "prices": {
      "default": {
        "0": {
          "market": 2.34,
          "analyst": 3.78,
          "opskins": 3.48
        },
        "1": {
          "market": 3.15,
          "analyst": 8.67,
          "opskins": 7.99
        },
        "2": {
          "market": 0.87,
          "analyst": 0.62,
          "opskins": 0.7
        },
        "3": {
          "market": 2.83,
          "analyst": 2.04,
          "opskins": 3.13
        },
        "4": {
          "market": 21.78,
          "analyst": 21.45,
          "opskins": 26
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "208": {
    "item_id": 208,
    "type": "P2000",
    "skinName": "Silver",
    "prices": {
      "default": {
        "3": {
          "market": 3.54,
          "analyst": 8.1,
          "opskins": 11.27
        },
        "4": {
          "market": 0.82,
          "analyst": 0.79,
          "opskins": 0.71
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "209": {
    "item_id": 209,
    "type": "MP7",
    "skinName": "Whiteout",
    "prices": {
      "default": {
        "0": {
          "market": 1.3,
          "analyst": 1.5,
          "opskins": 1.5
        },
        "1": {
          "market": 2.85,
          "analyst": 1.54,
          "opskins": 1.87
        },
        "2": {
          "market": 1.39,
          "analyst": 1.27,
          "opskins": 1.19
        },
        "3": {
          "market": 20.03,
          "analyst": 17.52,
          "opskins": 17.5
        },
        "4": {
          "market": 265.47,
          "analyst": 371.28,
          "opskins": 325
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "210": {
    "item_id": 210,
    "type": "M249",
    "skinName": "Contrast Spray",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.08
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.04
        },
        "3": {
          "market": 0.05,
          "analyst": 0.04,
          "opskins": 0.05
        },
        "4": {
          "market": 0.56,
          "analyst": 0.46,
          "opskins": 0.34
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.18,
          "analyst": 0.17,
          "opskins": 0.17
        },
        "1": {
          "market": 0.24,
          "analyst": 0.21,
          "opskins": 0.21
        },
        "2": {
          "market": 0.16,
          "analyst": 0.15,
          "opskins": 0.15
        },
        "3": {
          "market": 0.27,
          "analyst": 0.29,
          "opskins": 0.33
        },
        "4": {
          "market": 6.58,
          "analyst": 5.07,
          "opskins": 6.8
        }
      }
    }
  },
  "211": {
    "item_id": 211,
    "type": "UMP-45",
    "skinName": "Scorched",
    "prices": {
      "default": {
        "0": {
          "market": 0.06,
          "analyst": 0.03,
          "opskins": 1
        },
        "1": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.05,
          "analyst": 0.03,
          "opskins": 0.05
        },
        "4": {
          "market": 0.48,
          "analyst": 0.39,
          "opskins": 0.39
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.4,
          "analyst": 0.35,
          "opskins": 0.37
        },
        "1": {
          "market": 0.6,
          "analyst": 0.38,
          "opskins": 0.55
        },
        "2": {
          "market": 0.36,
          "analyst": 0.34,
          "opskins": 0.32
        },
        "3": {
          "market": 0.69,
          "analyst": 0.73,
          "opskins": 0.74
        },
        "4": {
          "market": 16.81,
          "analyst": 6.2,
          "opskins": 12.45
        }
      }
    }
  },
  "212": {
    "item_id": 212,
    "type": "MAG-7",
    "skinName": "Storm",
    "prices": {
      "default": {
        "0": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.05,
          "analyst": 0.04,
          "opskins": 0.05
        },
        "4": {
          "market": 0.53,
          "analyst": 0.37,
          "opskins": 0.37
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.18,
          "analyst": 0.21,
          "opskins": 0.2
        },
        "1": {
          "market": 0.19,
          "analyst": 0.19,
          "opskins": 0.18
        },
        "2": {
          "market": 0.17,
          "analyst": 0.15,
          "opskins": 0.14
        },
        "3": {
          "market": 0.23,
          "analyst": 0.24,
          "opskins": 0.69
        },
        "4": {
          "market": 3.4,
          "analyst": 4.44,
          "opskins": 4.19
        }
      }
    }
  },
  "213": {
    "item_id": 213,
    "type": "MP9",
    "skinName": "Storm",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.05,
          "analyst": 0.03,
          "opskins": 0.33
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.06,
          "analyst": 0.04,
          "opskins": 0.04
        },
        "4": {
          "market": 0.58,
          "analyst": 0.36,
          "opskins": 0.33
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.28,
          "analyst": 0.31,
          "opskins": 0.25
        },
        "1": {
          "market": 0.39,
          "analyst": 0.4,
          "opskins": 2.6
        },
        "2": {
          "market": 0.28,
          "analyst": 0.27,
          "opskins": 0.23
        },
        "3": {
          "market": 0.59,
          "analyst": 0.65,
          "opskins": 0.57
        },
        "4": {
          "market": 5.24,
          "analyst": 5.63,
          "opskins": 6.31
        }
      }
    }
  },
  "214": {
    "item_id": 214,
    "type": "Sawed-Off",
    "skinName": "Sage Spray",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.04,
          "opskins": 0.1
        },
        "1": {
          "market": 0.03,
          "analyst": 0.05,
          "opskins": 0.08
        },
        "2": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.05,
          "analyst": 0.03,
          "opskins": 0.04
        },
        "4": {
          "market": 0.47,
          "analyst": 0.34,
          "opskins": 0.31
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.19,
          "analyst": 0.18,
          "opskins": 0.19
        },
        "1": {
          "market": 0.19,
          "analyst": 0.19,
          "opskins": 0.2
        },
        "2": {
          "market": 0.16,
          "analyst": 0.15,
          "opskins": 0.14
        },
        "3": {
          "market": 0.25,
          "analyst": 0.25,
          "opskins": 0.22
        },
        "4": {
          "market": 3.25,
          "analyst": 3.44,
          "opskins": 9.99
        }
      }
    }
  },
  "215": {
    "item_id": 215,
    "type": "MP7",
    "skinName": "Gunsmoke",
    "prices": {
      "default": {
        "0": {
          "market": 0.19,
          "analyst": 0.15,
          "opskins": 0.14
        },
        "1": {
          "market": 0.22,
          "analyst": 0.22,
          "opskins": 0.19
        },
        "2": {
          "market": 0.23,
          "analyst": 0.17,
          "opskins": 0.14
        },
        "3": {
          "market": 0.42,
          "analyst": 0.37,
          "opskins": 0.31
        },
        "4": {
          "market": 3.57,
          "analyst": 3.15,
          "opskins": 2.7
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.61,
          "analyst": 1.17,
          "opskins": 3
        },
        "1": {
          "market": 1.75,
          "analyst": 1.72,
          "opskins": 1.94
        },
        "2": {
          "market": 1.07,
          "analyst": 1.22,
          "opskins": 1.16
        },
        "3": {
          "market": 5.32,
          "analyst": 4.14,
          "opskins": 3.95
        },
        "4": {
          "market": 45.09,
          "analyst": 54.9,
          "opskins": 70
        }
      }
    }
  },
  "216": {
    "item_id": 216,
    "type": "Desert Eagle",
    "skinName": "Urban DDPAT",
    "prices": {
      "default": {
        "0": {
          "market": 0.21,
          "analyst": 0.18,
          "opskins": 0.24
        },
        "1": {
          "market": 0.26,
          "analyst": 0.18,
          "opskins": 0.18
        },
        "2": {
          "market": 0.24,
          "analyst": 0.17,
          "opskins": 0.18
        },
        "3": {
          "market": 0.53,
          "analyst": 0.36,
          "opskins": 0.32
        },
        "4": {
          "market": 3.65,
          "analyst": 2.74,
          "opskins": 2.83
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 3.63,
          "analyst": 3.38,
          "opskins": 5.73
        },
        "1": {
          "market": 4.16,
          "analyst": 3.91,
          "opskins": 3.63
        },
        "2": {
          "market": 3.33,
          "analyst": 3.07,
          "opskins": 3.5
        },
        "3": {
          "market": 10.4,
          "analyst": 7.14,
          "opskins": 7.16
        },
        "4": {
          "market": 80.19,
          "analyst": 72.03,
          "opskins": 80
        }
      }
    }
  },
  "217": {
    "item_id": 217,
    "type": "Glock-18",
    "skinName": "Night",
    "prices": {
      "default": {
        "0": {
          "market": 0.19,
          "analyst": 0.16,
          "opskins": 0.14
        },
        "1": {
          "market": 0.25,
          "analyst": 0.18,
          "opskins": 0.18
        },
        "2": {
          "market": 0.23,
          "analyst": 0.18,
          "opskins": 0.15
        },
        "3": {
          "market": 0.45,
          "analyst": 0.38,
          "opskins": 0.34
        },
        "4": {
          "market": 6.36,
          "analyst": 5.91,
          "opskins": 5.75
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 3.17,
          "analyst": 3.04,
          "opskins": 7
        },
        "1": {
          "market": 3.42,
          "analyst": 3.31,
          "opskins": 7
        },
        "2": {
          "market": 3.24,
          "analyst": 3.01,
          "opskins": 3.1
        },
        "3": {
          "market": 8.93,
          "analyst": 8.81,
          "opskins": 8.5
        },
        "4": {
          "market": 129.17,
          "analyst": 157.63,
          "opskins": 150
        }
      }
    }
  },
  "218": {
    "item_id": 218,
    "type": "P2000",
    "skinName": "Grassland",
    "prices": {
      "default": {
        "0": {
          "market": 0.2,
          "analyst": 0.15,
          "opskins": 0.2
        },
        "1": {
          "market": 0.22,
          "analyst": 0.18,
          "opskins": 0.18
        },
        "2": {
          "market": 0.23,
          "analyst": 0.16,
          "opskins": 0.16
        },
        "3": {
          "market": 0.38,
          "analyst": 0.28,
          "opskins": 0.25
        },
        "4": {
          "market": 1.62,
          "analyst": 1.35,
          "opskins": 1.49
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.87,
          "analyst": 0.83,
          "opskins": 3.38
        },
        "1": {
          "market": 1.05,
          "analyst": 1.04,
          "opskins": 1.16
        },
        "2": {
          "market": 0.72,
          "analyst": 0.64,
          "opskins": 0.6
        },
        "3": {
          "market": 1.34,
          "analyst": 1.46,
          "opskins": 1.5
        },
        "4": {
          "market": 71.16,
          "analyst": 32.76,
          "opskins": 30
        }
      }
    }
  },
  "219": {
    "item_id": 219,
    "type": "CZ75-Auto",
    "skinName": "Nitro",
    "prices": {
      "default": {
        "0": {
          "market": 1.64,
          "analyst": 1.3,
          "opskins": 1.19
        },
        "1": {
          "market": 1.57,
          "analyst": 1.48,
          "opskins": 3.88
        },
        "2": {
          "market": 1.76,
          "analyst": 1.43,
          "opskins": 1.15
        },
        "3": {
          "market": 2.19,
          "analyst": 1.83,
          "opskins": 1.49
        },
        "4": {
          "market": 9,
          "analyst": 9.13,
          "opskins": 7.92
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 4.29,
          "analyst": 3.84,
          "opskins": 3.8
        },
        "1": {
          "market": 5,
          "analyst": 5.73,
          "opskins": 30
        },
        "2": {
          "market": 3.41,
          "analyst": 3.35,
          "opskins": 4.43
        },
        "3": {
          "market": 13.73,
          "analyst": 13.17,
          "opskins": 11.99
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": 600
        }
      }
    }
  },
  "220": {
    "item_id": 220,
    "type": "SSG 08",
    "skinName": "Detour",
    "prices": {
      "default": {
        "1": {
          "market": 1.97,
          "analyst": 1.43,
          "opskins": 1.24
        },
        "2": {
          "market": 1.8,
          "analyst": 1.44,
          "opskins": 1.16
        },
        "3": {
          "market": 2.34,
          "analyst": 1.72,
          "opskins": 1.37
        },
        "4": {
          "market": 3.94,
          "analyst": 3.01,
          "opskins": 2.43
        }
      },
      "stattrak": {},
      "souvenir": {
        "1": {
          "market": 19.95,
          "analyst": 14.2,
          "opskins": 48.49
        },
        "2": {
          "market": 12.69,
          "analyst": 11.16,
          "opskins": 11.48
        },
        "3": {
          "market": 21.74,
          "analyst": 20.93,
          "opskins": 20
        },
        "4": {
          "market": 36.64,
          "analyst": 43.4,
          "opskins": 38.89
        }
      }
    }
  },
  "221": {
    "item_id": 221,
    "type": "XM1014",
    "skinName": "VariCamo Blue",
    "prices": {
      "default": {
        "0": {
          "market": 1.35,
          "analyst": 1.44,
          "opskins": 1.4
        },
        "1": {
          "market": 1.53,
          "analyst": 1.56,
          "opskins": 1.2
        },
        "2": {
          "market": 1.81,
          "analyst": 1.35,
          "opskins": 1.4
        },
        "3": {
          "market": 2.65,
          "analyst": 2.26,
          "opskins": 1.84
        },
        "4": {
          "market": 3.52,
          "analyst": 2.81,
          "opskins": 2.55
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 3.76,
          "analyst": 6.35,
          "opskins": 12
        },
        "1": {
          "market": 3,
          "analyst": 3.01,
          "opskins": 2.59
        },
        "2": {
          "market": 2.1,
          "analyst": 2.09,
          "opskins": 1.61
        },
        "3": {
          "market": 4.42,
          "analyst": 4.81,
          "opskins": 3.6
        },
        "4": {
          "market": 4.5,
          "analyst": 5.34,
          "opskins": 4.9
        }
      }
    }
  },
  "222": {
    "item_id": 222,
    "type": "USP-S",
    "skinName": "Road Rash",
    "prices": {
      "default": {
        "0": {
          "market": 6.56,
          "analyst": 5.58,
          "opskins": 5.82
        },
        "1": {
          "market": 6.65,
          "analyst": 5.97,
          "opskins": 5.66
        },
        "2": {
          "market": 7.34,
          "analyst": 6.47,
          "opskins": 5.62
        },
        "3": {
          "market": 9.92,
          "analyst": 8.59,
          "opskins": 7.85
        },
        "4": {
          "market": 15.36,
          "analyst": 13.69,
          "opskins": 12.21
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 50.71,
          "analyst": 45,
          "opskins": 40
        },
        "1": {
          "market": 36.22,
          "analyst": 30.82,
          "opskins": 33.33
        },
        "2": {
          "market": 49.77,
          "analyst": 41.29,
          "opskins": 50
        },
        "3": {
          "market": 129.99,
          "analyst": 53.53,
          "opskins": 400
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": 300
        }
      }
    }
  },
  "223": {
    "item_id": 223,
    "type": "M4A1-S",
    "skinName": "Master Piece",
    "prices": {
      "default": {
        "0": {
          "market": 18.33,
          "analyst": 15.69,
          "opskins": 13.85
        },
        "1": {
          "market": 23.66,
          "analyst": 18.14,
          "opskins": 15.98
        },
        "2": {
          "market": 30.09,
          "analyst": 24.53,
          "opskins": 21.69
        },
        "3": {
          "market": 44.68,
          "analyst": 37.45,
          "opskins": 32.89
        },
        "4": {
          "market": 99.42,
          "analyst": 87.58,
          "opskins": 72.79
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 211.25,
          "analyst": 206.95,
          "opskins": 209.99
        },
        "1": {
          "market": 187.19,
          "analyst": 257.22,
          "opskins": 199.99
        },
        "2": {
          "market": 400,
          "analyst": 243,
          "opskins": 259
        },
        "3": {
          "market": 411.77,
          "analyst": 1013,
          "opskins": 610
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "224": {
    "item_id": 224,
    "type": "G3SG1",
    "skinName": "Orange Kimono",
    "prices": {
      "default": {
        "0": {
          "market": 0.06,
          "analyst": 0.04,
          "opskins": 0.06
        },
        "1": {
          "market": 0.09,
          "analyst": 0.08,
          "opskins": 0.07
        },
        "2": {
          "market": 0.06,
          "analyst": 0.04,
          "opskins": 0.03
        },
        "3": {
          "market": 0.15,
          "analyst": 0.09,
          "opskins": 0.07
        },
        "4": {
          "market": 0.28,
          "analyst": 0.24,
          "opskins": 0.19
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "225": {
    "item_id": 225,
    "type": "Tec-9",
    "skinName": "Bamboo Forest",
    "prices": {
      "default": {
        "0": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.08
        },
        "1": {
          "market": 0.17,
          "analyst": 0.12,
          "opskins": 0.1
        },
        "2": {
          "market": 0.08,
          "analyst": 0.06,
          "opskins": 0.06
        },
        "3": {
          "market": 0.19,
          "analyst": 0.13,
          "opskins": 0.11
        },
        "4": {
          "market": 0.45,
          "analyst": 0.3,
          "opskins": 0.24
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "226": {
    "item_id": 226,
    "type": "P250",
    "skinName": "Mint Kimono",
    "prices": {
      "default": {
        "0": {
          "market": 0.06,
          "analyst": 0.04,
          "opskins": 0.04
        },
        "1": {
          "market": 0.1,
          "analyst": 0.09,
          "opskins": 0.06
        },
        "2": {
          "market": 0.06,
          "analyst": 0.04,
          "opskins": 0.03
        },
        "3": {
          "market": 0.17,
          "analyst": 0.12,
          "opskins": 0.1
        },
        "4": {
          "market": 0.41,
          "analyst": 0.27,
          "opskins": 0.22
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "227": {
    "item_id": 227,
    "type": "PP-Bizon",
    "skinName": "Bamboo Print",
    "prices": {
      "default": {
        "0": {
          "market": 0.06,
          "analyst": 0.04,
          "opskins": 0.05
        },
        "1": {
          "market": 0.12,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "2": {
          "market": 0.06,
          "analyst": 0.04,
          "opskins": 0.1
        },
        "3": {
          "market": 0.15,
          "analyst": 0.1,
          "opskins": 0.08
        },
        "4": {
          "market": 0.38,
          "analyst": 0.27,
          "opskins": 0.23
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "228": {
    "item_id": 228,
    "type": "Sawed-Off",
    "skinName": "Bamboo Shadow",
    "prices": {
      "default": {
        "0": {
          "market": 0.06,
          "analyst": 0.04,
          "opskins": 0.3
        },
        "1": {
          "market": 0.59,
          "analyst": 0.25,
          "opskins": 0.59
        },
        "2": {
          "market": 0.06,
          "analyst": 0.04,
          "opskins": 0.04
        },
        "3": {
          "market": 0.14,
          "analyst": 0.1,
          "opskins": 0.08
        },
        "4": {
          "market": 0.25,
          "analyst": 0.19,
          "opskins": 0.19
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "229": {
    "item_id": 229,
    "type": "Desert Eagle",
    "skinName": "Midnight Storm",
    "prices": {
      "default": {
        "0": {
          "market": 0.37,
          "analyst": 0.28,
          "opskins": 0.45
        },
        "1": {
          "market": 1.13,
          "analyst": 0.84,
          "opskins": 0.7
        },
        "2": {
          "market": 0.4,
          "analyst": 0.29,
          "opskins": 0.29
        },
        "3": {
          "market": 1.84,
          "analyst": 1.29,
          "opskins": 1.12
        },
        "4": {
          "market": 3.65,
          "analyst": 2.56,
          "opskins": 2.24
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "230": {
    "item_id": 230,
    "type": "P250",
    "skinName": "Crimson Kimono",
    "prices": {
      "default": {
        "0": {
          "market": 0.26,
          "analyst": 0.22,
          "opskins": 0.21
        },
        "1": {
          "market": 0.29,
          "analyst": 0.25,
          "opskins": 0.3
        },
        "2": {
          "market": 0.28,
          "analyst": 0.21,
          "opskins": 0.18
        },
        "3": {
          "market": 0.41,
          "analyst": 0.27,
          "opskins": 0.23
        },
        "4": {
          "market": 0.97,
          "analyst": 0.74,
          "opskins": 0.6
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "231": {
    "item_id": 231,
    "type": "Tec-9",
    "skinName": "Terrace",
    "prices": {
      "default": {
        "0": {
          "market": 2.11,
          "analyst": 1.56,
          "opskins": 2.97
        },
        "1": {
          "market": 2.25,
          "analyst": 1.81,
          "opskins": 1.75
        },
        "2": {
          "market": 2.48,
          "analyst": 1.9,
          "opskins": 1.75
        },
        "3": {
          "market": 2.81,
          "analyst": 2.19,
          "opskins": 1.86
        },
        "4": {
          "market": 5.79,
          "analyst": 4.53,
          "opskins": 4.07
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "232": {
    "item_id": 232,
    "type": "Galil AR",
    "skinName": "Aqua Terrace",
    "prices": {
      "default": {
        "0": {
          "market": 2.18,
          "analyst": 2.01,
          "opskins": 1.76
        },
        "1": {
          "market": 2.25,
          "analyst": 2.88,
          "opskins": 2.96
        },
        "2": {
          "market": 2.45,
          "analyst": 1.93,
          "opskins": 1.95
        },
        "3": {
          "market": 2.72,
          "analyst": 2.14,
          "opskins": 2.43
        },
        "4": {
          "market": 3.86,
          "analyst": 3.11,
          "opskins": 3
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "233": {
    "item_id": 233,
    "type": "MAG-7",
    "skinName": "Counter Terrace",
    "prices": {
      "default": {
        "0": {
          "market": 2.24,
          "analyst": 1.51,
          "opskins": 5.18
        },
        "1": {
          "market": 2.31,
          "analyst": 2.22,
          "opskins": 1.87
        },
        "2": {
          "market": 2.45,
          "analyst": 1.88,
          "opskins": 1.91
        },
        "3": {
          "market": 2.77,
          "analyst": 2.21,
          "opskins": 1.94
        },
        "4": {
          "market": 3.66,
          "analyst": 2.68,
          "opskins": 2.36
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "234": {
    "item_id": 234,
    "type": "M4A4",
    "skinName": "Daybreak",
    "prices": {
      "default": {
        "0": {
          "market": 5.6,
          "analyst": 6.55,
          "opskins": 8.99
        },
        "1": {
          "market": 7.15,
          "analyst": 7.54,
          "opskins": 339.8
        },
        "2": {
          "market": 8.21,
          "analyst": 6.83,
          "opskins": 6.17
        },
        "3": {
          "market": 12.22,
          "analyst": 9.2,
          "opskins": 8.32
        },
        "4": {
          "market": 17.25,
          "analyst": 12.32,
          "opskins": 10.78
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "235": {
    "item_id": 235,
    "type": "Desert Eagle",
    "skinName": "Sunset Storm 壱",
    "prices": {
      "default": {
        "0": {
          "market": 7.46,
          "analyst": 6.75,
          "opskins": -1
        },
        "1": {
          "market": 7.01,
          "analyst": 7.9,
          "opskins": -1
        },
        "2": {
          "market": 8.59,
          "analyst": 6.83,
          "opskins": -1
        },
        "3": {
          "market": 13.42,
          "analyst": 10.95,
          "opskins": -1
        },
        "4": {
          "market": 16.96,
          "analyst": 13.43,
          "opskins": -1
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "236": {
    "item_id": 236,
    "type": "Desert Eagle",
    "skinName": "Sunset Storm 弐",
    "prices": {
      "default": {
        "0": {
          "market": 6.6,
          "analyst": 7.38,
          "opskins": -1
        },
        "1": {
          "market": 9.59,
          "analyst": 13.8,
          "opskins": -1
        },
        "2": {
          "market": 8.23,
          "analyst": 6.17,
          "opskins": -1
        },
        "3": {
          "market": 13.26,
          "analyst": 10.64,
          "opskins": -1
        },
        "4": {
          "market": 17.05,
          "analyst": 13.07,
          "opskins": -1
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "237": {
    "item_id": 237,
    "type": "Five-SeveN",
    "skinName": "Neon Kimono",
    "prices": {
      "default": {
        "0": {
          "market": 5.75,
          "analyst": 6.03,
          "opskins": 6.99
        },
        "1": {
          "market": 5.94,
          "analyst": 7.64,
          "opskins": 10.8
        },
        "2": {
          "market": 7.95,
          "analyst": 7.34,
          "opskins": 6.78
        },
        "3": {
          "market": 12.55,
          "analyst": 9.98,
          "opskins": 10.23
        },
        "4": {
          "market": 16.66,
          "analyst": 12.12,
          "opskins": 10.97
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "238": {
    "item_id": 238,
    "type": "MP7",
    "skinName": "Army Recon",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.08,
          "analyst": 0.07,
          "opskins": 0.07
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.53,
          "analyst": 2.12,
          "opskins": 6
        },
        "1": {
          "market": 4.27,
          "analyst": 3.2,
          "opskins": 5.12
        },
        "2": {
          "market": 1.1,
          "analyst": 1.41,
          "opskins": 1.23
        },
        "3": {
          "market": 2.78,
          "analyst": 2.86,
          "opskins": 3.5
        },
        "4": {
          "market": 49.99,
          "analyst": -1,
          "opskins": 27.78
        }
      }
    }
  },
  "239": {
    "item_id": 239,
    "type": "Tec-9",
    "skinName": "Army Mesh",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.31
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "4": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.76,
          "analyst": 12.16,
          "opskins": 11.11
        },
        "1": {
          "market": 3.4,
          "analyst": 9.94,
          "opskins": 9.55
        },
        "2": {
          "market": 1.5,
          "analyst": 1.3,
          "opskins": 6.46
        },
        "3": {
          "market": 2.33,
          "analyst": 5.14,
          "opskins": 9.24
        },
        "4": {
          "market": 3.65,
          "analyst": 5.59,
          "opskins": 5.13
        }
      }
    }
  },
  "240": {
    "item_id": 240,
    "type": "SSG 08",
    "skinName": "Blue Spruce",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.04
        },
        "4": {
          "market": 0.2,
          "analyst": 0.17,
          "opskins": 0.15
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 2.62,
          "analyst": 2.81,
          "opskins": 99
        },
        "1": {
          "market": 3,
          "analyst": 3.93,
          "opskins": 2.83
        },
        "2": {
          "market": 1.56,
          "analyst": 1.65,
          "opskins": 5
        },
        "3": {
          "market": 4.85,
          "analyst": 7.27,
          "opskins": 7
        },
        "4": {
          "market": 80,
          "analyst": -1,
          "opskins": 90
        }
      }
    }
  },
  "241": {
    "item_id": 241,
    "type": "SCAR-20",
    "skinName": "Contractor",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "4": {
          "market": 0.07,
          "analyst": 0.05,
          "opskins": 0.11
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 2.18,
          "analyst": 2.2,
          "opskins": 2.29
        },
        "1": {
          "market": 2.13,
          "analyst": 1.89,
          "opskins": 3
        },
        "2": {
          "market": 0.53,
          "analyst": 1.33,
          "opskins": 3.99
        },
        "3": {
          "market": 1.69,
          "analyst": 1.95,
          "opskins": 3
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "242": {
    "item_id": 242,
    "type": "Dual Berettas",
    "skinName": "Contractor",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "4": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 1.18,
          "analyst": 1.55,
          "opskins": 25.05
        },
        "1": {
          "market": 2.2,
          "analyst": 2.18,
          "opskins": 2.11
        },
        "2": {
          "market": 0.78,
          "analyst": 2.16,
          "opskins": 2.11
        },
        "3": {
          "market": 1.93,
          "analyst": 3.2,
          "opskins": 8.01
        },
        "4": {
          "market": 31.85,
          "analyst": 29.88,
          "opskins": 14.38
        }
      }
    }
  },
  "243": {
    "item_id": 243,
    "type": "MP9",
    "skinName": "Orange Peel",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.24,
          "analyst": 0.23,
          "opskins": 0.18
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 3.45,
          "analyst": -1,
          "opskins": 8.34
        },
        "1": {
          "market": 100.87,
          "analyst": -1,
          "opskins": 9.63
        },
        "2": {
          "market": 2,
          "analyst": 3.1,
          "opskins": 10
        },
        "3": {
          "market": 2.77,
          "analyst": 11.29,
          "opskins": 19
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "244": {
    "item_id": 244,
    "type": "AUG",
    "skinName": "Condemned",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.07,
          "analyst": 0.05,
          "opskins": 0.05
        },
        "4": {
          "market": 0.7,
          "analyst": 0.62,
          "opskins": 0.59
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 21.01,
          "analyst": 8.77,
          "opskins": 9.62
        },
        "1": {
          "market": 12.65,
          "analyst": 11.97,
          "opskins": 11
        },
        "2": {
          "market": 5.06,
          "analyst": 5.45,
          "opskins": 6
        },
        "3": {
          "market": 24.04,
          "analyst": 24.13,
          "opskins": 40.9
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "245": {
    "item_id": 245,
    "type": "USP-S",
    "skinName": "Forest Leaves",
    "prices": {
      "default": {
        "0": {
          "market": 0.08,
          "analyst": 0.05,
          "opskins": 0.13
        },
        "1": {
          "market": 0.06,
          "analyst": 0.04,
          "opskins": 0.05
        },
        "2": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.04
        },
        "3": {
          "market": 0.13,
          "analyst": 0.09,
          "opskins": 0.07
        },
        "4": {
          "market": 0.74,
          "analyst": 0.55,
          "opskins": 0.54
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 31.41,
          "analyst": 21.24,
          "opskins": 19.6
        },
        "1": {
          "market": 18.31,
          "analyst": 20.6,
          "opskins": -1
        },
        "2": {
          "market": 12.9,
          "analyst": 10.33,
          "opskins": 16.43
        },
        "3": {
          "market": 17.25,
          "analyst": 35.29,
          "opskins": 96.94
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "246": {
    "item_id": 246,
    "type": "Galil AR",
    "skinName": "VariCamo",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.06,
          "analyst": 0.03,
          "opskins": 0.03
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 8.55,
          "analyst": -1,
          "opskins": 30
        },
        "1": {
          "market": 64.88,
          "analyst": -1,
          "opskins": 50
        },
        "2": {
          "market": 2.15,
          "analyst": 2.69,
          "opskins": 2.05
        },
        "3": {
          "market": 8.55,
          "analyst": 8.05,
          "opskins": 6.95
        },
        "4": {
          "market": 63.72,
          "analyst": 32.86,
          "opskins": 38
        }
      }
    }
  },
  "247": {
    "item_id": 247,
    "type": "M249",
    "skinName": "Gator Mesh",
    "prices": {
      "default": {
        "0": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.04
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 10.92,
          "analyst": 16.88,
          "opskins": 35
        },
        "1": {
          "market": 108.02,
          "analyst": -1,
          "opskins": -1
        },
        "2": {
          "market": 2.89,
          "analyst": 3.05,
          "opskins": 32
        },
        "3": {
          "market": 4.66,
          "analyst": 5.18,
          "opskins": 4.6
        },
        "4": {
          "market": 16.48,
          "analyst": 19.41,
          "opskins": 14.13
        }
      }
    }
  },
  "248": {
    "item_id": 248,
    "type": "G3SG1",
    "skinName": "VariCamo",
    "prices": {
      "default": {
        "0": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 9.12,
          "analyst": 5.21,
          "opskins": 52
        },
        "1": {
          "market": 401.69,
          "analyst": 26.55,
          "opskins": 44.48
        },
        "2": {
          "market": 4.04,
          "analyst": 5.72,
          "opskins": 25
        },
        "3": {
          "market": 6,
          "analyst": 4.16,
          "opskins": 3.5
        },
        "4": {
          "market": 41.18,
          "analyst": -1,
          "opskins": 28
        }
      }
    }
  },
  "249": {
    "item_id": 249,
    "type": "FAMAS",
    "skinName": "Teardown",
    "prices": {
      "default": {
        "0": {
          "market": 0.12,
          "analyst": 0.09,
          "opskins": 0.09
        },
        "1": {
          "market": 0.18,
          "analyst": 0.11,
          "opskins": 0.1
        },
        "2": {
          "market": 0.12,
          "analyst": 0.09,
          "opskins": 0.07
        },
        "3": {
          "market": 0.19,
          "analyst": 0.14,
          "opskins": 0.13
        },
        "4": {
          "market": 0.31,
          "analyst": 0.28,
          "opskins": 0.23
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 400,
          "analyst": 17.5,
          "opskins": -1
        },
        "1": {
          "market": 34,
          "analyst": -1,
          "opskins": 21.01
        },
        "2": {
          "market": 6.75,
          "analyst": 9.48,
          "opskins": 6.23
        },
        "3": {
          "market": 15.5,
          "analyst": 21.84,
          "opskins": 26.69
        },
        "4": {
          "market": 185,
          "analyst": 41.33,
          "opskins": 41.3
        }
      }
    }
  },
  "250": {
    "item_id": 250,
    "type": "SSG 08",
    "skinName": "Acid Fade",
    "prices": {
      "default": {
        "4": {
          "market": 0.42,
          "analyst": 0.35,
          "opskins": 0.33
        }
      },
      "stattrak": {},
      "souvenir": {
        "4": {
          "market": 48.82,
          "analyst": 48.34,
          "opskins": 60
        }
      }
    }
  },
  "251": {
    "item_id": 251,
    "type": "M4A1-S",
    "skinName": "Nitro",
    "prices": {
      "default": {
        "0": {
          "market": 1.06,
          "analyst": 0.94,
          "opskins": 0.8
        },
        "1": {
          "market": 1.32,
          "analyst": 1.17,
          "opskins": 0.99
        },
        "2": {
          "market": 1.1,
          "analyst": 0.98,
          "opskins": 0.84
        },
        "3": {
          "market": 2,
          "analyst": 1.68,
          "opskins": 1.43
        },
        "4": {
          "market": 3.63,
          "analyst": 3.16,
          "opskins": 2.6
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 132.68,
          "analyst": -1,
          "opskins": 120
        },
        "1": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        },
        "2": {
          "market": 77.47,
          "analyst": 86.79,
          "opskins": 199
        },
        "3": {
          "market": 145.55,
          "analyst": -1,
          "opskins": 202
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "252": {
    "item_id": 252,
    "type": "PP-Bizon",
    "skinName": "Urban Dashed",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.06
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.21,
          "analyst": 0.22,
          "opskins": 0.2
        },
        "1": {
          "market": 0.24,
          "analyst": 0.23,
          "opskins": 0.18
        },
        "2": {
          "market": 0.19,
          "analyst": 0.18,
          "opskins": 0.17
        },
        "3": {
          "market": 0.35,
          "analyst": 0.29,
          "opskins": 0.27
        },
        "4": {
          "market": 6.37,
          "analyst": 4.96,
          "opskins": 3.33
        }
      }
    }
  },
  "253": {
    "item_id": 253,
    "type": "Nova",
    "skinName": "Polar Mesh",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "4": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.18,
          "analyst": 0.16,
          "opskins": 0.22
        },
        "1": {
          "market": 0.23,
          "analyst": 0.18,
          "opskins": 0.17
        },
        "2": {
          "market": 0.29,
          "analyst": 0.14,
          "opskins": 0.14
        },
        "3": {
          "market": 0.24,
          "analyst": 0.22,
          "opskins": 0.21
        },
        "4": {
          "market": 6.4,
          "analyst": 7.89,
          "opskins": 4.21
        }
      }
    }
  },
  "254": {
    "item_id": 254,
    "type": "Five-SeveN",
    "skinName": "Forest Night",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.17,
          "analyst": 0.12,
          "opskins": 0.12
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.43,
          "analyst": 0.39,
          "opskins": 0.4
        },
        "1": {
          "market": 0.5,
          "analyst": 0.5,
          "opskins": 0.51
        },
        "2": {
          "market": 0.38,
          "analyst": 0.35,
          "opskins": 0.32
        },
        "3": {
          "market": 1.64,
          "analyst": 0.92,
          "opskins": 0.98
        },
        "4": {
          "market": 20.27,
          "analyst": 15.79,
          "opskins": 17.99
        }
      }
    }
  },
  "255": {
    "item_id": 255,
    "type": "G3SG1",
    "skinName": "Polar Camo",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.05
        },
        "4": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.07
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.24,
          "analyst": 0.23,
          "opskins": 0.22
        },
        "1": {
          "market": 0.27,
          "analyst": 0.25,
          "opskins": 0.76
        },
        "2": {
          "market": 0.19,
          "analyst": 0.18,
          "opskins": 0.19
        },
        "3": {
          "market": 0.5,
          "analyst": 0.56,
          "opskins": 1.76
        },
        "4": {
          "market": 16.98,
          "analyst": 13.46,
          "opskins": 15
        }
      }
    }
  },
  "256": {
    "item_id": 256,
    "type": "Dual Berettas",
    "skinName": "Colony",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "4": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.07
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.23,
          "analyst": 0.21,
          "opskins": 0.23
        },
        "1": {
          "market": 0.27,
          "analyst": 0.28,
          "opskins": 0.29
        },
        "2": {
          "market": 0.18,
          "analyst": 0.16,
          "opskins": 0.14
        },
        "3": {
          "market": 0.26,
          "analyst": 0.27,
          "opskins": 0.2
        },
        "4": {
          "market": 2.3,
          "analyst": 6.16,
          "opskins": 6.5
        }
      }
    }
  },
  "257": {
    "item_id": 257,
    "type": "UMP-45",
    "skinName": "Urban DDPAT",
    "prices": {
      "default": {
        "0": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "1": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "4": {
          "market": 0.18,
          "analyst": 0.12,
          "opskins": 0.1
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 0.43,
          "analyst": 0.37,
          "opskins": 0.38
        },
        "1": {
          "market": 0.51,
          "analyst": 0.59,
          "opskins": 0.49
        },
        "2": {
          "market": 0.49,
          "analyst": 0.39,
          "opskins": 0.38
        },
        "3": {
          "market": 1.2,
          "analyst": 1.21,
          "opskins": 1.3
        },
        "4": {
          "market": 8.54,
          "analyst": 11.25,
          "opskins": 13
        }
      }
    }
  },
  "258": {
    "item_id": 258,
    "type": "M4A4",
    "skinName": "Urban DDPAT",
    "prices": {
      "default": {
        "0": {
          "market": 0.08,
          "analyst": 0.06,
          "opskins": 0.1
        },
        "1": {
          "market": 0.16,
          "analyst": 0.12,
          "opskins": 0.1
        },
        "2": {
          "market": 0.08,
          "analyst": 0.05,
          "opskins": 0.1
        },
        "3": {
          "market": 0.4,
          "analyst": 0.32,
          "opskins": 0.27
        },
        "4": {
          "market": 2.68,
          "analyst": 2.07,
          "opskins": 1.76
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 2.73,
          "analyst": 2.44,
          "opskins": 4.97
        },
        "1": {
          "market": 3.5,
          "analyst": 3.25,
          "opskins": 2.8
        },
        "2": {
          "market": 3.6,
          "analyst": 2.79,
          "opskins": 2.33
        },
        "3": {
          "market": 7.65,
          "analyst": 7.29,
          "opskins": 7.65
        },
        "4": {
          "market": 71.94,
          "analyst": 51.6,
          "opskins": 77
        }
      }
    }
  },
  "259": {
    "item_id": 259,
    "type": "MAC-10",
    "skinName": "Candy Apple",
    "prices": {
      "default": {
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.1
        },
        "3": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.06,
          "analyst": 0.04,
          "opskins": 0.04
        }
      },
      "stattrak": {},
      "souvenir": {
        "2": {
          "market": 1.34,
          "analyst": 1.34,
          "opskins": 1.75
        },
        "3": {
          "market": 1.3,
          "analyst": 1.32,
          "opskins": 1.35
        },
        "4": {
          "market": 2.88,
          "analyst": 2.96,
          "opskins": 2.62
        }
      }
    }
  },
  "260": {
    "item_id": 260,
    "type": "P90",
    "skinName": "Ash Wood",
    "prices": {
      "default": {
        "1": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.22
        },
        "2": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "3": {
          "market": 0.03,
          "analyst": 0.03,
          "opskins": 0.02
        },
        "4": {
          "market": 0.05,
          "analyst": 0.03,
          "opskins": 0.03
        }
      },
      "stattrak": {},
      "souvenir": {
        "1": {
          "market": 1.22,
          "analyst": 1.79,
          "opskins": 2.05
        },
        "2": {
          "market": 0.99,
          "analyst": 0.66,
          "opskins": 0.5
        },
        "3": {
          "market": 1.22,
          "analyst": 1.14,
          "opskins": 1.08
        },
        "4": {
          "market": 1.98,
          "analyst": 1.88,
          "opskins": 1.95
        }
      }
    }
  },
  "261": {
    "item_id": 261,
    "type": "SCAR-20",
    "skinName": "Carbon Fiber",
    "prices": {
      "default": {
        "3": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        },
        "4": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        }
      },
      "stattrak": {},
      "souvenir": {
        "3": {
          "market": 1.35,
          "analyst": 1.48,
          "opskins": 1
        },
        "4": {
          "market": 1.19,
          "analyst": 1.19,
          "opskins": 1.09
        }
      }
    }
  },
  "262": {
    "item_id": 262,
    "type": "MAG-7",
    "skinName": "Metallic DDPAT",
    "prices": {
      "default": {
        "3": {
          "market": 0.05,
          "analyst": 0.04,
          "opskins": 0.06
        },
        "4": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        }
      },
      "stattrak": {},
      "souvenir": {
        "3": {
          "market": 3.91,
          "analyst": 2.87,
          "opskins": 4.25
        },
        "4": {
          "market": 0.73,
          "analyst": 0.64,
          "opskins": 0.72
        }
      }
    }
  },
  "263": {
    "item_id": 263,
    "type": "P250",
    "skinName": "Metallic DDPAT",
    "prices": {
      "default": {
        "3": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.07
        },
        "4": {
          "market": 0.04,
          "analyst": 0.03,
          "opskins": 0.03
        }
      },
      "stattrak": {},
      "souvenir": {
        "3": {
          "market": 5.32,
          "analyst": 6.35,
          "opskins": 6.45
        },
        "4": {
          "market": 2.64,
          "analyst": 2.53,
          "opskins": 2.12
        }
      }
    }
  },
  "264": {
    "item_id": 264,
    "type": "Five-SeveN",
    "skinName": "Silver Quartz",
    "prices": {
      "default": {
        "1": {
          "market": 0.22,
          "analyst": 0.18,
          "opskins": 0.26
        },
        "2": {
          "market": 0.13,
          "analyst": 0.1,
          "opskins": 0.08
        },
        "3": {
          "market": 0.18,
          "analyst": 0.14,
          "opskins": 0.12
        },
        "4": {
          "market": 0.29,
          "analyst": 0.26,
          "opskins": 0.22
        }
      },
      "stattrak": {},
      "souvenir": {
        "1": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        },
        "2": {
          "market": 34.47,
          "analyst": 15.2,
          "opskins": 25
        },
        "3": {
          "market": 55.73,
          "analyst": 34.25,
          "opskins": -1
        },
        "4": {
          "market": 89.99,
          "analyst": 74.81,
          "opskins": 63
        }
      }
    }
  },
  "265": {
    "item_id": 265,
    "type": "Sawed-Off",
    "skinName": "Amber Fade",
    "prices": {
      "default": {
        "1": {
          "market": 0.13,
          "analyst": 0.08,
          "opskins": 0.15
        },
        "2": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.14
        },
        "3": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.2
        },
        "4": {
          "market": 0.16,
          "analyst": 0.11,
          "opskins": 0.11
        }
      },
      "stattrak": {},
      "souvenir": {
        "1": {
          "market": 2.39,
          "analyst": 3.53,
          "opskins": 4.73
        },
        "2": {
          "market": 0.82,
          "analyst": 0.67,
          "opskins": 0.5
        },
        "3": {
          "market": 1.22,
          "analyst": 1.05,
          "opskins": 0.92
        },
        "4": {
          "market": 2.19,
          "analyst": 2.09,
          "opskins": 2.4
        }
      }
    }
  },
  "266": {
    "item_id": 266,
    "type": "Desert Eagle",
    "skinName": "Urban Rubble",
    "prices": {
      "default": {
        "0": {
          "market": 0.15,
          "analyst": 0.12,
          "opskins": 0.28
        },
        "1": {
          "market": 0.16,
          "analyst": 0.13,
          "opskins": 0.12
        },
        "2": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "3": {
          "market": 0.13,
          "analyst": 0.08,
          "opskins": 0.07
        },
        "4": {
          "market": 0.18,
          "analyst": 0.14,
          "opskins": 0.14
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 6.55,
          "analyst": 6.73,
          "opskins": 150
        },
        "1": {
          "market": 4.3,
          "analyst": 5.67,
          "opskins": 6.31
        },
        "2": {
          "market": 3.52,
          "analyst": 3.1,
          "opskins": 3.18
        },
        "3": {
          "market": 5.47,
          "analyst": 4.93,
          "opskins": 3.78
        },
        "4": {
          "market": 9.1,
          "analyst": 8.71,
          "opskins": 8
        }
      }
    }
  },
  "267": {
    "item_id": 267,
    "type": "Tec-9",
    "skinName": "Red Quartz",
    "prices": {
      "default": {
        "1": {
          "market": 0.26,
          "analyst": 0.2,
          "opskins": 0.19
        },
        "2": {
          "market": 0.2,
          "analyst": 0.17,
          "opskins": 0.15
        },
        "3": {
          "market": 0.21,
          "analyst": 0.18,
          "opskins": 0.14
        },
        "4": {
          "market": 0.28,
          "analyst": 0.2,
          "opskins": 0.17
        }
      },
      "stattrak": {},
      "souvenir": {
        "1": {
          "market": 20.75,
          "analyst": -1,
          "opskins": 38.2
        },
        "2": {
          "market": 5.84,
          "analyst": 6.02,
          "opskins": 6.99
        },
        "3": {
          "market": 9.56,
          "analyst": 11.82,
          "opskins": 11.82
        },
        "4": {
          "market": 20.2,
          "analyst": 21.06,
          "opskins": 18.9
        }
      }
    }
  },
  "268": {
    "item_id": 268,
    "type": "XM1014",
    "skinName": "Urban Perforated",
    "prices": {
      "default": {
        "0": {
          "market": 0.42,
          "analyst": 0.49,
          "opskins": 0.49
        },
        "1": {
          "market": 0.4,
          "analyst": 0.43,
          "opskins": 0.34
        },
        "2": {
          "market": 0.41,
          "analyst": 0.38,
          "opskins": 0.6
        },
        "3": {
          "market": 0.53,
          "analyst": 0.42,
          "opskins": 0.5
        },
        "4": {
          "market": 2.23,
          "analyst": 3.2,
          "opskins": 7.83
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "269": {
    "item_id": 269,
    "type": "MAC-10",
    "skinName": "Urban DDPAT",
    "prices": {
      "default": {
        "0": {
          "market": 0.41,
          "analyst": 0.52,
          "opskins": 1
        },
        "1": {
          "market": 0.85,
          "analyst": 0.88,
          "opskins": 2.8
        },
        "2": {
          "market": 0.42,
          "analyst": 0.37,
          "opskins": 1.2
        },
        "3": {
          "market": 0.58,
          "analyst": 0.43,
          "opskins": 0.8
        },
        "4": {
          "market": 2.97,
          "analyst": 2.97,
          "opskins": 3.3
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "270": {
    "item_id": 270,
    "type": "PP-Bizon",
    "skinName": "Carbon Fiber",
    "prices": {
      "default": {
        "3": {
          "market": 3.48,
          "analyst": 3.44,
          "opskins": 3.26
        },
        "4": {
          "market": 4.6,
          "analyst": 4.14,
          "opskins": 4.03
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "271": {
    "item_id": 271,
    "type": "P90",
    "skinName": "Glacier Mesh",
    "prices": {
      "default": {
        "0": {
          "market": 1.72,
          "analyst": 2.45,
          "opskins": 6
        },
        "1": {
          "market": 2.28,
          "analyst": 2.51,
          "opskins": 1.54
        },
        "2": {
          "market": 0.84,
          "analyst": 0.81,
          "opskins": 1.5
        },
        "3": {
          "market": 1.29,
          "analyst": 1.26,
          "opskins": 1.29
        },
        "4": {
          "market": 9.05,
          "analyst": 9.98,
          "opskins": 9.52
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "272": {
    "item_id": 272,
    "type": "AK-47",
    "skinName": "Black Laminate",
    "prices": {
      "default": {
        "0": {
          "market": 7.71,
          "analyst": 5.62,
          "opskins": 5.53
        },
        "1": {
          "market": 7.78,
          "analyst": 5.57,
          "opskins": 5.5
        },
        "2": {
          "market": 7.62,
          "analyst": 5.55,
          "opskins": 5.05
        },
        "3": {
          "market": 8.67,
          "analyst": 6.6,
          "opskins": 5.76
        },
        "4": {
          "market": 78.08,
          "analyst": 118.91,
          "opskins": 104.99
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "273": {
    "item_id": 273,
    "type": "Dual Berettas",
    "skinName": "Demolition",
    "prices": {
      "default": {
        "0": {
          "market": 1.44,
          "analyst": 1.37,
          "opskins": 4.42
        },
        "1": {
          "market": 1.35,
          "analyst": 0.95,
          "opskins": 0.99
        },
        "2": {
          "market": 1.18,
          "analyst": 1,
          "opskins": 0.86
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "274": {
    "item_id": 274,
    "type": "XM1014",
    "skinName": "Slipstream",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.08
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "2": {
          "market": 0.08,
          "analyst": 0.06,
          "opskins": 0.05
        },
        "3": {
          "market": 0.1,
          "analyst": 0.1,
          "opskins": 0.08
        },
        "4": {
          "market": 0.19,
          "analyst": 0.16,
          "opskins": 0.13
        }
      },
      "stattrak": {
        "0": {
          "market": 0.24,
          "analyst": 0.21,
          "opskins": 0.2
        },
        "1": {
          "market": 0.31,
          "analyst": 0.22,
          "opskins": 0.22
        },
        "2": {
          "market": 0.24,
          "analyst": 0.2,
          "opskins": 0.17
        },
        "3": {
          "market": 0.53,
          "analyst": 0.47,
          "opskins": 0.36
        },
        "4": {
          "market": 1.01,
          "analyst": 1.04,
          "opskins": 0.84
        }
      },
      "souvenir": {}
    }
  },
  "275": {
    "item_id": 275,
    "type": "UMP-45",
    "skinName": "Briefing",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "3": {
          "market": 0.19,
          "analyst": 0.17,
          "opskins": 0.11
        },
        "4": {
          "market": 1.09,
          "analyst": 0.86,
          "opskins": 0.7
        }
      },
      "stattrak": {
        "0": {
          "market": 0.38,
          "analyst": 0.31,
          "opskins": 0.24
        },
        "1": {
          "market": 0.47,
          "analyst": 0.4,
          "opskins": 0.32
        },
        "2": {
          "market": 0.65,
          "analyst": 0.63,
          "opskins": 0.49
        },
        "3": {
          "market": 1.51,
          "analyst": 1.26,
          "opskins": 1.02
        },
        "4": {
          "market": 6.12,
          "analyst": 5.43,
          "opskins": 4.88
        }
      },
      "souvenir": {}
    }
  },
  "276": {
    "item_id": 276,
    "type": "P90",
    "skinName": "Grim",
    "prices": {
      "default": {
        "0": {
          "market": 0.2,
          "analyst": 0.19,
          "opskins": 0.15
        },
        "1": {
          "market": 0.41,
          "analyst": 0.42,
          "opskins": 0.32
        },
        "2": {
          "market": 0.22,
          "analyst": 0.23,
          "opskins": 0.2
        },
        "3": {
          "market": 0.43,
          "analyst": 0.47,
          "opskins": 0.36
        },
        "4": {
          "market": 1.06,
          "analyst": 1.11,
          "opskins": 0.89
        }
      },
      "stattrak": {
        "0": {
          "market": 0.87,
          "analyst": 0.89,
          "opskins": 0.69
        },
        "1": {
          "market": 1.54,
          "analyst": 1.63,
          "opskins": 1.36
        },
        "2": {
          "market": 0.95,
          "analyst": 0.96,
          "opskins": 0.74
        },
        "3": {
          "market": 1.79,
          "analyst": 1.9,
          "opskins": 1.53
        },
        "4": {
          "market": 5.02,
          "analyst": 4.78,
          "opskins": 4.17
        }
      },
      "souvenir": {}
    }
  },
  "277": {
    "item_id": 277,
    "type": "Negev",
    "skinName": "Dazzle",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "1": {
          "market": 0.1,
          "analyst": 0.08,
          "opskins": 0.07
        },
        "2": {
          "market": 0.08,
          "analyst": 0.06,
          "opskins": 0.05
        },
        "3": {
          "market": 0.17,
          "analyst": 0.14,
          "opskins": 0.12
        }
      },
      "stattrak": {
        "0": {
          "market": 0.22,
          "analyst": 0.19,
          "opskins": 0.17
        },
        "1": {
          "market": 0.26,
          "analyst": 0.22,
          "opskins": 0.18
        },
        "2": {
          "market": 0.22,
          "analyst": 0.19,
          "opskins": 0.16
        },
        "3": {
          "market": 0.68,
          "analyst": 0.86,
          "opskins": 0.7
        }
      },
      "souvenir": {}
    }
  },
  "278": {
    "item_id": 278,
    "type": "G3SG1",
    "skinName": "Ventilator",
    "prices": {
      "default": {
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "2": {
          "market": 0.08,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "3": {
          "market": 0.09,
          "analyst": 0.09,
          "opskins": 0.06
        },
        "4": {
          "market": 0.19,
          "analyst": 0.16,
          "opskins": 0.12
        }
      },
      "stattrak": {
        "1": {
          "market": 0.35,
          "analyst": 0.33,
          "opskins": 0.26
        },
        "2": {
          "market": 0.25,
          "analyst": 0.24,
          "opskins": 0.2
        },
        "3": {
          "market": 0.44,
          "analyst": 0.44,
          "opskins": 0.38
        },
        "4": {
          "market": 1.03,
          "analyst": 0.99,
          "opskins": 0.88
        }
      },
      "souvenir": {}
    }
  },
  "279": {
    "item_id": 279,
    "type": "Five-SeveN",
    "skinName": "Scumbria",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "3": {
          "market": 0.11,
          "analyst": 0.09,
          "opskins": 0.07
        },
        "4": {
          "market": 0.3,
          "analyst": 0.26,
          "opskins": 0.22
        }
      },
      "stattrak": {
        "0": {
          "market": 0.47,
          "analyst": 0.44,
          "opskins": 0.36
        },
        "1": {
          "market": 0.48,
          "analyst": 0.43,
          "opskins": 0.36
        },
        "2": {
          "market": 0.5,
          "analyst": 0.45,
          "opskins": 0.35
        },
        "3": {
          "market": 0.66,
          "analyst": 0.64,
          "opskins": 0.51
        },
        "4": {
          "market": 1.9,
          "analyst": 1.79,
          "opskins": 1.4
        }
      },
      "souvenir": {}
    }
  },
  "280": {
    "item_id": 280,
    "type": "CZ75-Auto",
    "skinName": "Imprint",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "1": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.06
        },
        "2": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.06
        },
        "3": {
          "market": 0.1,
          "analyst": 0.09,
          "opskins": 0.06
        },
        "4": {
          "market": 0.23,
          "analyst": 0.21,
          "opskins": 0.21
        }
      },
      "stattrak": {
        "0": {
          "market": 0.23,
          "analyst": 0.2,
          "opskins": 0.16
        },
        "1": {
          "market": 0.25,
          "analyst": 0.2,
          "opskins": 0.16
        },
        "2": {
          "market": 0.24,
          "analyst": 0.22,
          "opskins": 0.19
        },
        "3": {
          "market": 0.45,
          "analyst": 0.43,
          "opskins": 0.35
        },
        "4": {
          "market": 1.48,
          "analyst": 1.4,
          "opskins": 1.11
        }
      },
      "souvenir": {}
    }
  },
  "281": {
    "item_id": 281,
    "type": "SG 553",
    "skinName": "Triarch",
    "prices": {
      "default": {
        "0": {
          "market": 0.24,
          "analyst": 0.21,
          "opskins": 0.18
        },
        "1": {
          "market": 0.25,
          "analyst": 0.21,
          "opskins": 0.18
        },
        "2": {
          "market": 0.24,
          "analyst": 0.21,
          "opskins": 0.18
        },
        "3": {
          "market": 0.38,
          "analyst": 0.32,
          "opskins": 0.26
        },
        "4": {
          "market": 1.15,
          "analyst": 0.97,
          "opskins": 0.8
        }
      },
      "stattrak": {
        "0": {
          "market": 0.68,
          "analyst": 0.65,
          "opskins": 0.53
        },
        "1": {
          "market": 0.71,
          "analyst": 0.67,
          "opskins": 0.54
        },
        "2": {
          "market": 0.79,
          "analyst": 0.72,
          "opskins": 0.57
        },
        "3": {
          "market": 1.77,
          "analyst": 1.68,
          "opskins": 1.4
        },
        "4": {
          "market": 7.37,
          "analyst": 6.03,
          "opskins": 7.74
        }
      },
      "souvenir": {}
    }
  },
  "282": {
    "item_id": 282,
    "type": "SCAR-20",
    "skinName": "Powercore",
    "prices": {
      "default": {
        "0": {
          "market": 0.25,
          "analyst": 0.22,
          "opskins": 0.17
        },
        "1": {
          "market": 0.25,
          "analyst": 0.21,
          "opskins": 0.17
        },
        "2": {
          "market": 0.25,
          "analyst": 0.21,
          "opskins": 0.18
        },
        "3": {
          "market": 0.37,
          "analyst": 0.34,
          "opskins": 0.28
        },
        "4": {
          "market": 0.9,
          "analyst": 0.91,
          "opskins": 0.71
        }
      },
      "stattrak": {
        "0": {
          "market": 0.67,
          "analyst": 0.69,
          "opskins": 0.61
        },
        "1": {
          "market": 0.68,
          "analyst": 0.69,
          "opskins": 0.59
        },
        "2": {
          "market": 0.77,
          "analyst": 0.76,
          "opskins": 0.6
        },
        "3": {
          "market": 1.38,
          "analyst": 1.34,
          "opskins": 1.18
        },
        "4": {
          "market": 3.79,
          "analyst": 3.32,
          "opskins": 2.91
        }
      },
      "souvenir": {}
    }
  },
  "283": {
    "item_id": 283,
    "type": "MAG-7",
    "skinName": "Petroglyph",
    "prices": {
      "default": {
        "1": {
          "market": 0.26,
          "analyst": 0.22,
          "opskins": 0.2
        },
        "2": {
          "market": 0.25,
          "analyst": 0.21,
          "opskins": 0.17
        },
        "3": {
          "market": 0.35,
          "analyst": 0.3,
          "opskins": 0.24
        },
        "4": {
          "market": 0.62,
          "analyst": 0.58,
          "opskins": 0.5
        }
      },
      "stattrak": {
        "1": {
          "market": 0.72,
          "analyst": 0.68,
          "opskins": 0.66
        },
        "2": {
          "market": 0.74,
          "analyst": 0.7,
          "opskins": 0.62
        },
        "3": {
          "market": 1.32,
          "analyst": 1.18,
          "opskins": 1.08
        },
        "4": {
          "market": 3.06,
          "analyst": 2.41,
          "opskins": 2.28
        }
      },
      "souvenir": {}
    }
  },
  "284": {
    "item_id": 284,
    "type": "Glock-18",
    "skinName": "Weasel",
    "prices": {
      "default": {
        "0": {
          "market": 0.78,
          "analyst": 0.83,
          "opskins": 0.67
        },
        "1": {
          "market": 0.82,
          "analyst": 0.89,
          "opskins": 0.72
        },
        "2": {
          "market": 0.89,
          "analyst": 1.01,
          "opskins": 0.84
        },
        "3": {
          "market": 1.71,
          "analyst": 1.71,
          "opskins": 1.42
        },
        "4": {
          "market": 3.93,
          "analyst": 3.78,
          "opskins": 3.25
        }
      },
      "stattrak": {
        "0": {
          "market": 3.8,
          "analyst": 3.71,
          "opskins": 3.13
        },
        "1": {
          "market": 4.01,
          "analyst": 3.89,
          "opskins": 3.19
        },
        "2": {
          "market": 4.77,
          "analyst": 4.68,
          "opskins": 4.3
        },
        "3": {
          "market": 7.71,
          "analyst": 7.35,
          "opskins": 6.47
        },
        "4": {
          "market": 18.67,
          "analyst": 17.37,
          "opskins": 17.4
        }
      },
      "souvenir": {}
    }
  },
  "285": {
    "item_id": 285,
    "type": "Desert Eagle",
    "skinName": "Directive",
    "prices": {
      "default": {
        "0": {
          "market": 0.38,
          "analyst": 0.39,
          "opskins": 0.32
        },
        "1": {
          "market": 0.52,
          "analyst": 0.55,
          "opskins": 0.42
        },
        "2": {
          "market": 0.45,
          "analyst": 0.49,
          "opskins": 0.39
        },
        "3": {
          "market": 1.86,
          "analyst": 1.63,
          "opskins": 1.52
        },
        "4": {
          "market": 8.08,
          "analyst": 7.83,
          "opskins": 7.44
        }
      },
      "stattrak": {
        "0": {
          "market": 2.46,
          "analyst": 2.23,
          "opskins": 1.84
        },
        "1": {
          "market": 2.85,
          "analyst": 2.56,
          "opskins": 2.15
        },
        "2": {
          "market": 3.34,
          "analyst": 2.79,
          "opskins": 2.33
        },
        "3": {
          "market": 9.37,
          "analyst": 9.15,
          "opskins": 8.05
        },
        "4": {
          "market": 65.58,
          "analyst": 58.97,
          "opskins": 54.79
        }
      },
      "souvenir": {}
    }
  },
  "286": {
    "item_id": 286,
    "type": "Tec-9",
    "skinName": "Fuel Injector",
    "prices": {
      "default": {
        "0": {
          "market": 2.73,
          "analyst": 2.34,
          "opskins": 2.09
        },
        "1": {
          "market": 2.98,
          "analyst": 2.51,
          "opskins": 2.1
        },
        "2": {
          "market": 3.33,
          "analyst": 2.94,
          "opskins": 2.42
        },
        "3": {
          "market": 5.04,
          "analyst": 4.38,
          "opskins": 3.95
        },
        "4": {
          "market": 9.74,
          "analyst": 8.82,
          "opskins": 7.5
        }
      },
      "stattrak": {
        "0": {
          "market": 9.37,
          "analyst": 8.42,
          "opskins": 7.5
        },
        "1": {
          "market": 10.29,
          "analyst": 8.88,
          "opskins": 7.51
        },
        "2": {
          "market": 12.65,
          "analyst": 11.33,
          "opskins": 10.06
        },
        "3": {
          "market": 19.84,
          "analyst": 18.06,
          "opskins": 16.5
        },
        "4": {
          "market": 48.65,
          "analyst": 45.68,
          "opskins": 41.26
        }
      },
      "souvenir": {}
    }
  },
  "287": {
    "item_id": 287,
    "type": "MP9",
    "skinName": "Airlock",
    "prices": {
      "default": {
        "0": {
          "market": 1.73,
          "analyst": 1.59,
          "opskins": 1.39
        },
        "1": {
          "market": 1.81,
          "analyst": 1.67,
          "opskins": 1.35
        },
        "2": {
          "market": 1.92,
          "analyst": 1.86,
          "opskins": 1.55
        },
        "3": {
          "market": 2.99,
          "analyst": 2.98,
          "opskins": 2.57
        },
        "4": {
          "market": 5.14,
          "analyst": 5.3,
          "opskins": 4.7
        }
      },
      "stattrak": {
        "0": {
          "market": 4.12,
          "analyst": 4.33,
          "opskins": 4.23
        },
        "1": {
          "market": 4.51,
          "analyst": 4.19,
          "opskins": 3.59
        },
        "2": {
          "market": 5.2,
          "analyst": 5.35,
          "opskins": 5.03
        },
        "3": {
          "market": 9.6,
          "analyst": 10.74,
          "opskins": 10.85
        },
        "4": {
          "market": 23.61,
          "analyst": 18.61,
          "opskins": 20
        }
      },
      "souvenir": {}
    }
  },
  "288": {
    "item_id": 288,
    "type": "AUG",
    "skinName": "Syd Mead",
    "prices": {
      "default": {
        "0": {
          "market": 1.74,
          "analyst": 1.6,
          "opskins": 1.48
        },
        "1": {
          "market": 2.04,
          "analyst": 1.94,
          "opskins": 1.72
        },
        "2": {
          "market": 1.92,
          "analyst": 1.84,
          "opskins": 1.53
        },
        "3": {
          "market": 3.24,
          "analyst": 3.02,
          "opskins": 2.56
        },
        "4": {
          "market": 5.04,
          "analyst": 5.15,
          "opskins": 4.89
        }
      },
      "stattrak": {
        "0": {
          "market": 4.33,
          "analyst": 4.37,
          "opskins": 4
        },
        "1": {
          "market": 8.85,
          "analyst": 7.82,
          "opskins": 6.69
        },
        "2": {
          "market": 5.45,
          "analyst": 5.68,
          "opskins": 4.82
        },
        "3": {
          "market": 12.73,
          "analyst": 11.9,
          "opskins": 12.05
        },
        "4": {
          "market": 22.89,
          "analyst": 17.22,
          "opskins": 20
        }
      },
      "souvenir": {}
    }
  },
  "289": {
    "item_id": 289,
    "type": "FAMAS",
    "skinName": "Roll Cage",
    "prices": {
      "default": {
        "0": {
          "market": 3.88,
          "analyst": 4.22,
          "opskins": 3.68
        },
        "1": {
          "market": 4.24,
          "analyst": 4.73,
          "opskins": 4
        },
        "2": {
          "market": 5.11,
          "analyst": 5.72,
          "opskins": 5.07
        },
        "3": {
          "market": 7.47,
          "analyst": 8.56,
          "opskins": 7.79
        },
        "4": {
          "market": 18.82,
          "analyst": 18.19,
          "opskins": 18.35
        }
      },
      "stattrak": {
        "0": {
          "market": 12.34,
          "analyst": 11.92,
          "opskins": 12.06
        },
        "1": {
          "market": 13.34,
          "analyst": 14.27,
          "opskins": 13.48
        },
        "2": {
          "market": 16.41,
          "analyst": 19.51,
          "opskins": 18.49
        },
        "3": {
          "market": 26.67,
          "analyst": 27.5,
          "opskins": 29.55
        },
        "4": {
          "market": 199.02,
          "analyst": 110.57,
          "opskins": 93.9
        }
      },
      "souvenir": {}
    }
  },
  "290": {
    "item_id": 290,
    "type": "AK-47",
    "skinName": "Neon Revolution",
    "prices": {
      "default": {
        "0": {
          "market": 25.06,
          "analyst": 21.49,
          "opskins": 20.04
        },
        "1": {
          "market": 36.17,
          "analyst": 31.69,
          "opskins": 26.97
        },
        "2": {
          "market": 33.34,
          "analyst": 28.06,
          "opskins": 25.51
        },
        "3": {
          "market": 45.88,
          "analyst": 41.15,
          "opskins": 37.09
        },
        "4": {
          "market": 72.85,
          "analyst": 70.61,
          "opskins": 64.75
        }
      },
      "stattrak": {
        "0": {
          "market": 62.31,
          "analyst": 59.15,
          "opskins": 54.99
        },
        "1": {
          "market": 100.85,
          "analyst": 93.23,
          "opskins": 75.99
        },
        "2": {
          "market": 89.36,
          "analyst": 81.11,
          "opskins": 69
        },
        "3": {
          "market": 140.12,
          "analyst": 122.8,
          "opskins": 114.79
        },
        "4": {
          "market": 310.43,
          "analyst": 333.03,
          "opskins": 281.99
        }
      },
      "souvenir": {}
    }
  },
  "291": {
    "item_id": 291,
    "type": "SG 553",
    "skinName": "Aerial",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "1": {
          "market": 0.14,
          "analyst": 0.1,
          "opskins": 0.09
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "3": {
          "market": 0.15,
          "analyst": 0.13,
          "opskins": 0.1
        },
        "4": {
          "market": 0.26,
          "analyst": 0.22,
          "opskins": 0.17
        }
      },
      "stattrak": {
        "0": {
          "market": 0.37,
          "analyst": 0.32,
          "opskins": 0.26
        },
        "1": {
          "market": 0.6,
          "analyst": 0.6,
          "opskins": 0.48
        },
        "2": {
          "market": 0.39,
          "analyst": 0.32,
          "opskins": 0.25
        },
        "3": {
          "market": 0.85,
          "analyst": 0.74,
          "opskins": 0.57
        },
        "4": {
          "market": 1.9,
          "analyst": 1.52,
          "opskins": 1.22
        }
      },
      "souvenir": {}
    }
  },
  "292": {
    "item_id": 292,
    "type": "Tec-9",
    "skinName": "Ice Cap",
    "prices": {
      "default": {
        "0": {
          "market": 0.1,
          "analyst": 0.1,
          "opskins": 0.15
        },
        "1": {
          "market": 0.14,
          "analyst": 0.11,
          "opskins": 0.09
        },
        "2": {
          "market": 0.1,
          "analyst": 0.08,
          "opskins": 0.06
        },
        "3": {
          "market": 0.19,
          "analyst": 0.16,
          "opskins": 0.12
        },
        "4": {
          "market": 0.28,
          "analyst": 0.25,
          "opskins": 0.22
        }
      },
      "stattrak": {
        "0": {
          "market": 0.55,
          "analyst": 0.51,
          "opskins": 0.42
        },
        "1": {
          "market": 0.91,
          "analyst": 0.74,
          "opskins": 0.58
        },
        "2": {
          "market": 0.57,
          "analyst": 0.59,
          "opskins": 0.45
        },
        "3": {
          "market": 1.45,
          "analyst": 1.24,
          "opskins": 0.97
        },
        "4": {
          "market": 2.17,
          "analyst": 1.9,
          "opskins": 1.53
        }
      },
      "souvenir": {}
    }
  },
  "293": {
    "item_id": 293,
    "type": "PP-Bizon",
    "skinName": "Harvester",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.04
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "3": {
          "market": 0.12,
          "analyst": 0.1,
          "opskins": 0.07
        },
        "4": {
          "market": 0.19,
          "analyst": 0.18,
          "opskins": 0.16
        }
      },
      "stattrak": {
        "0": {
          "market": 0.26,
          "analyst": 0.21,
          "opskins": 0.17
        },
        "1": {
          "market": 0.27,
          "analyst": 0.21,
          "opskins": 0.18
        },
        "2": {
          "market": 0.32,
          "analyst": 0.25,
          "opskins": 0.2
        },
        "3": {
          "market": 0.43,
          "analyst": 0.38,
          "opskins": 0.32
        },
        "4": {
          "market": 0.93,
          "analyst": 0.91,
          "opskins": 0.77
        }
      },
      "souvenir": {}
    }
  },
  "294": {
    "item_id": 294,
    "type": "P250",
    "skinName": "Iron Clad",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.11
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.13
        },
        "2": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "3": {
          "market": 0.12,
          "analyst": 0.11,
          "opskins": 0.09
        },
        "4": {
          "market": 0.3,
          "analyst": 0.26,
          "opskins": 0.23
        }
      },
      "stattrak": {
        "0": {
          "market": 0.32,
          "analyst": 0.29,
          "opskins": 0.23
        },
        "1": {
          "market": 0.36,
          "analyst": 0.31,
          "opskins": 0.24
        },
        "2": {
          "market": 0.35,
          "analyst": 0.28,
          "opskins": 0.21
        },
        "3": {
          "market": 0.49,
          "analyst": 0.45,
          "opskins": 0.33
        },
        "4": {
          "market": 2.41,
          "analyst": 2.25,
          "opskins": 1.92
        }
      },
      "souvenir": {}
    }
  },
  "295": {
    "item_id": 295,
    "type": "Nova",
    "skinName": "Exo",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.08,
          "opskins": 0.07
        },
        "1": {
          "market": 0.1,
          "analyst": 0.08,
          "opskins": 0.07
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "3": {
          "market": 0.12,
          "analyst": 0.11,
          "opskins": 0.08
        },
        "4": {
          "market": 0.19,
          "analyst": 0.16,
          "opskins": 0.12
        }
      },
      "stattrak": {
        "0": {
          "market": 0.33,
          "analyst": 0.3,
          "opskins": 0.25
        },
        "1": {
          "market": 0.33,
          "analyst": 0.31,
          "opskins": 0.28
        },
        "2": {
          "market": 0.34,
          "analyst": 0.29,
          "opskins": 0.24
        },
        "3": {
          "market": 0.51,
          "analyst": 0.43,
          "opskins": 0.35
        },
        "4": {
          "market": 0.83,
          "analyst": 0.73,
          "opskins": 0.58
        }
      },
      "souvenir": {}
    }
  },
  "296": {
    "item_id": 296,
    "type": "MAC-10",
    "skinName": "Carnivore",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.1
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.09
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "3": {
          "market": 0.12,
          "analyst": 0.1,
          "opskins": 0.08
        },
        "4": {
          "market": 0.25,
          "analyst": 0.2,
          "opskins": 0.16
        }
      },
      "stattrak": {
        "0": {
          "market": 0.27,
          "analyst": 0.22,
          "opskins": 0.2
        },
        "1": {
          "market": 0.28,
          "analyst": 0.23,
          "opskins": 0.2
        },
        "2": {
          "market": 0.33,
          "analyst": 0.26,
          "opskins": 0.23
        },
        "3": {
          "market": 0.45,
          "analyst": 0.4,
          "opskins": 0.3
        },
        "4": {
          "market": 1.17,
          "analyst": 1.01,
          "opskins": 0.92
        }
      },
      "souvenir": {}
    }
  },
  "297": {
    "item_id": 297,
    "type": "Five-SeveN",
    "skinName": "Violent Daimyo",
    "prices": {
      "default": {
        "0": {
          "market": 0.18,
          "analyst": 0.15,
          "opskins": 0.12
        },
        "1": {
          "market": 0.35,
          "analyst": 0.34,
          "opskins": 0.27
        },
        "2": {
          "market": 0.22,
          "analyst": 0.18,
          "opskins": 0.14
        },
        "3": {
          "market": 0.36,
          "analyst": 0.31,
          "opskins": 0.25
        },
        "4": {
          "market": 0.72,
          "analyst": 0.66,
          "opskins": 0.52
        }
      },
      "stattrak": {
        "0": {
          "market": 0.95,
          "analyst": 0.92,
          "opskins": 0.72
        },
        "1": {
          "market": 1.59,
          "analyst": 1.43,
          "opskins": 1.16
        },
        "2": {
          "market": 0.99,
          "analyst": 0.94,
          "opskins": 0.7
        },
        "3": {
          "market": 1.84,
          "analyst": 1.71,
          "opskins": 1.33
        },
        "4": {
          "market": 4.29,
          "analyst": 3.82,
          "opskins": 3.29
        }
      },
      "souvenir": {}
    }
  },
  "298": {
    "item_id": 298,
    "type": "R8 Revolver",
    "skinName": "Reboot",
    "prices": {
      "default": {
        "0": {
          "market": 0.5,
          "analyst": 0.41,
          "opskins": 0.34
        },
        "1": {
          "market": 0.51,
          "analyst": 0.43,
          "opskins": 0.33
        },
        "2": {
          "market": 0.56,
          "analyst": 0.49,
          "opskins": 0.41
        },
        "3": {
          "market": 0.8,
          "analyst": 0.69,
          "opskins": 0.54
        },
        "4": {
          "market": 2.06,
          "analyst": 1.66,
          "opskins": 1.33
        }
      },
      "stattrak": {
        "0": {
          "market": 1.32,
          "analyst": 1.21,
          "opskins": 1.01
        },
        "1": {
          "market": 1.41,
          "analyst": 1.28,
          "opskins": 1.05
        },
        "2": {
          "market": 1.86,
          "analyst": 1.71,
          "opskins": 1.39
        },
        "3": {
          "market": 3.07,
          "analyst": 2.98,
          "opskins": 2.42
        },
        "4": {
          "market": 12.01,
          "analyst": 11.11,
          "opskins": 10.14
        }
      },
      "souvenir": {}
    }
  },
  "299": {
    "item_id": 299,
    "type": "Sawed-Off",
    "skinName": "Limelight",
    "prices": {
      "default": {
        "0": {
          "market": 0.5,
          "analyst": 0.42,
          "opskins": 0.36
        },
        "1": {
          "market": 0.51,
          "analyst": 0.43,
          "opskins": 0.36
        },
        "2": {
          "market": 0.57,
          "analyst": 0.48,
          "opskins": 0.41
        },
        "3": {
          "market": 0.79,
          "analyst": 0.68,
          "opskins": 0.57
        },
        "4": {
          "market": 1.6,
          "analyst": 1.36,
          "opskins": 1.09
        }
      },
      "stattrak": {
        "0": {
          "market": 1.31,
          "analyst": 1.1,
          "opskins": 1.01
        },
        "1": {
          "market": 1.4,
          "analyst": 1.15,
          "opskins": 1.02
        },
        "2": {
          "market": 1.75,
          "analyst": 1.58,
          "opskins": 1.32
        },
        "3": {
          "market": 2.77,
          "analyst": 2.41,
          "opskins": 2.31
        },
        "4": {
          "market": 5.55,
          "analyst": 5.61,
          "opskins": 5.4
        }
      },
      "souvenir": {}
    }
  },
  "300": {
    "item_id": 300,
    "type": "P90",
    "skinName": "Chopper",
    "prices": {
      "default": {
        "0": {
          "market": 0.59,
          "analyst": 0.49,
          "opskins": 0.39
        },
        "1": {
          "market": 0.67,
          "analyst": 0.63,
          "opskins": 0.5
        },
        "2": {
          "market": 0.56,
          "analyst": 0.52,
          "opskins": 0.41
        },
        "3": {
          "market": 0.83,
          "analyst": 0.76,
          "opskins": 0.59
        },
        "4": {
          "market": 1.44,
          "analyst": 1.39,
          "opskins": 1.11
        }
      },
      "stattrak": {
        "0": {
          "market": 1.66,
          "analyst": 1.67,
          "opskins": 1.29
        },
        "1": {
          "market": 2.65,
          "analyst": 2.46,
          "opskins": 2.11
        },
        "2": {
          "market": 1.9,
          "analyst": 1.76,
          "opskins": 1.42
        },
        "3": {
          "market": 3.13,
          "analyst": 3.15,
          "opskins": 2.54
        },
        "4": {
          "market": 5.59,
          "analyst": 5.58,
          "opskins": 5.06
        }
      },
      "souvenir": {}
    }
  },
  "301": {
    "item_id": 301,
    "type": "AUG",
    "skinName": "Aristocrat",
    "prices": {
      "default": {
        "0": {
          "market": 0.51,
          "analyst": 0.45,
          "opskins": 0.37
        },
        "1": {
          "market": 0.58,
          "analyst": 0.55,
          "opskins": 0.47
        },
        "2": {
          "market": 0.56,
          "analyst": 0.49,
          "opskins": 0.38
        },
        "3": {
          "market": 0.81,
          "analyst": 0.7,
          "opskins": 0.55
        },
        "4": {
          "market": 1.41,
          "analyst": 1.35,
          "opskins": 1.09
        }
      },
      "stattrak": {
        "0": {
          "market": 1.73,
          "analyst": 1.51,
          "opskins": 1.27
        },
        "1": {
          "market": 2.3,
          "analyst": 2.05,
          "opskins": 1.7
        },
        "2": {
          "market": 1.83,
          "analyst": 1.68,
          "opskins": 1.43
        },
        "3": {
          "market": 2.89,
          "analyst": 2.58,
          "opskins": 2.23
        },
        "4": {
          "market": 5.69,
          "analyst": 5.16,
          "opskins": 4.53
        }
      },
      "souvenir": {}
    }
  },
  "302": {
    "item_id": 302,
    "type": "AWP",
    "skinName": "Phobos",
    "prices": {
      "default": {
        "1": {
          "market": 3.16,
          "analyst": 2.79,
          "opskins": 2.47
        },
        "2": {
          "market": 2.4,
          "analyst": 2.03,
          "opskins": 1.77
        },
        "3": {
          "market": 2.66,
          "analyst": 2.21,
          "opskins": 1.91
        },
        "4": {
          "market": 3.61,
          "analyst": 3,
          "opskins": 2.55
        }
      },
      "stattrak": {
        "1": {
          "market": 10.93,
          "analyst": 10.21,
          "opskins": 10.41
        },
        "2": {
          "market": 9.38,
          "analyst": 7.6,
          "opskins": 6.36
        },
        "3": {
          "market": 10.63,
          "analyst": 8.76,
          "opskins": 7.41
        },
        "4": {
          "market": 14.51,
          "analyst": 11.79,
          "opskins": 10.2
        }
      },
      "souvenir": {}
    }
  },
  "303": {
    "item_id": 303,
    "type": "P2000",
    "skinName": "Imperial Dragon",
    "prices": {
      "default": {
        "0": {
          "market": 1.63,
          "analyst": 1.41,
          "opskins": 1.19
        },
        "1": {
          "market": 1.69,
          "analyst": 1.53,
          "opskins": 1.36
        },
        "2": {
          "market": 1.52,
          "analyst": 1.34,
          "opskins": 1.1
        },
        "3": {
          "market": 2.02,
          "analyst": 1.95,
          "opskins": 1.55
        },
        "4": {
          "market": 3.17,
          "analyst": 3.23,
          "opskins": 2.76
        }
      },
      "stattrak": {
        "0": {
          "market": 7.97,
          "analyst": 7.98,
          "opskins": 7.44
        },
        "1": {
          "market": 7.48,
          "analyst": 6.57,
          "opskins": 6.38
        },
        "2": {
          "market": 6.28,
          "analyst": 5.76,
          "opskins": 5.04
        },
        "3": {
          "market": 10.41,
          "analyst": 8.83,
          "opskins": 8.16
        },
        "4": {
          "market": 20.22,
          "analyst": 17.63,
          "opskins": 15.73
        }
      },
      "souvenir": {}
    }
  },
  "304": {
    "item_id": 304,
    "type": "SCAR-20",
    "skinName": "Bloodsport",
    "prices": {
      "default": {
        "1": {
          "market": 1.53,
          "analyst": 1.45,
          "opskins": 1.2
        },
        "2": {
          "market": 1.51,
          "analyst": 1.32,
          "opskins": 1.12
        },
        "3": {
          "market": 1.81,
          "analyst": 1.71,
          "opskins": 1.46
        },
        "4": {
          "market": 2.7,
          "analyst": 2.43,
          "opskins": 2.09
        }
      },
      "stattrak": {
        "1": {
          "market": 4.97,
          "analyst": 4.51,
          "opskins": 4.61
        },
        "2": {
          "market": 4.91,
          "analyst": 4.34,
          "opskins": 3.84
        },
        "3": {
          "market": 6.59,
          "analyst": 6.55,
          "opskins": 6.94
        },
        "4": {
          "market": 11.84,
          "analyst": 12.45,
          "opskins": 11.5
        }
      },
      "souvenir": {}
    }
  },
  "305": {
    "item_id": 305,
    "type": "M4A4",
    "skinName": "Desolate Space",
    "prices": {
      "default": {
        "0": {
          "market": 10.04,
          "analyst": 8.4,
          "opskins": 7.28
        },
        "1": {
          "market": 11.51,
          "analyst": 10,
          "opskins": 8.58
        },
        "2": {
          "market": 13.31,
          "analyst": 11.77,
          "opskins": 10.24
        },
        "3": {
          "market": 17.46,
          "analyst": 15.73,
          "opskins": 13.36
        },
        "4": {
          "market": 30.05,
          "analyst": 33.09,
          "opskins": 29.49
        }
      },
      "stattrak": {
        "0": {
          "market": 26.37,
          "analyst": 23.39,
          "opskins": 21.36
        },
        "1": {
          "market": 32.61,
          "analyst": 28.18,
          "opskins": 25.69
        },
        "2": {
          "market": 40.16,
          "analyst": 37.04,
          "opskins": 31.75
        },
        "3": {
          "market": 58.17,
          "analyst": 52.84,
          "opskins": 44.12
        },
        "4": {
          "market": 113.27,
          "analyst": 109.75,
          "opskins": 99.99
        }
      },
      "souvenir": {}
    }
  },
  "306": {
    "item_id": 306,
    "type": "M4A1-S",
    "skinName": "Mecha Industries",
    "prices": {
      "default": {
        "0": {
          "market": 13.79,
          "analyst": 11.55,
          "opskins": 10.09
        },
        "1": {
          "market": 18.84,
          "analyst": 15.81,
          "opskins": 13.97
        },
        "2": {
          "market": 16.75,
          "analyst": 13.86,
          "opskins": 12.01
        },
        "3": {
          "market": 24.47,
          "analyst": 20.46,
          "opskins": 18.19
        },
        "4": {
          "market": 37.64,
          "analyst": 33.45,
          "opskins": 28.99
        }
      },
      "stattrak": {
        "0": {
          "market": 40.48,
          "analyst": 36.97,
          "opskins": 33.37
        },
        "1": {
          "market": 67.13,
          "analyst": 52.48,
          "opskins": 47.22
        },
        "2": {
          "market": 54.3,
          "analyst": 47.78,
          "opskins": 44.38
        },
        "3": {
          "market": 83.29,
          "analyst": 89.4,
          "opskins": 77.95
        },
        "4": {
          "market": 191.08,
          "analyst": 182.22,
          "opskins": 149.98
        }
      },
      "souvenir": {}
    }
  },
  "307": {
    "item_id": 307,
    "type": "Glock-18",
    "skinName": "Wasteland Rebel",
    "prices": {
      "default": {
        "0": {
          "market": 7.6,
          "analyst": 6.3,
          "opskins": 6.7
        },
        "1": {
          "market": 10.21,
          "analyst": 9.22,
          "opskins": 8.19
        },
        "2": {
          "market": 9.9,
          "analyst": 9.19,
          "opskins": 7.95
        },
        "3": {
          "market": 11.99,
          "analyst": 11.35,
          "opskins": 10.15
        },
        "4": {
          "market": 14.81,
          "analyst": 14.28,
          "opskins": 12.86
        }
      },
      "stattrak": {
        "0": {
          "market": 21.09,
          "analyst": 25.11,
          "opskins": 22.64
        },
        "1": {
          "market": 41.64,
          "analyst": 36.22,
          "opskins": 30
        },
        "2": {
          "market": 34.74,
          "analyst": 29.83,
          "opskins": 27.64
        },
        "3": {
          "market": 43.68,
          "analyst": 45.07,
          "opskins": 40
        },
        "4": {
          "market": 64.86,
          "analyst": 62.38,
          "opskins": 52
        }
      },
      "souvenir": {}
    }
  },
  "308": {
    "item_id": 308,
    "type": "SG 553",
    "skinName": "Atlas",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.15
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "2": {
          "market": 0.08,
          "analyst": 0.06,
          "opskins": 0.06
        },
        "3": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.11
        },
        "4": {
          "market": 0.19,
          "analyst": 0.15,
          "opskins": 0.35
        }
      },
      "stattrak": {
        "0": {
          "market": 0.3,
          "analyst": 0.27,
          "opskins": 0.22
        },
        "1": {
          "market": 0.49,
          "analyst": 0.38,
          "opskins": 0.33
        },
        "2": {
          "market": 0.29,
          "analyst": 0.25,
          "opskins": 0.2
        },
        "3": {
          "market": 0.52,
          "analyst": 0.46,
          "opskins": 0.38
        },
        "4": {
          "market": 1.44,
          "analyst": 1.36,
          "opskins": 1.14
        }
      },
      "souvenir": {}
    }
  },
  "309": {
    "item_id": 309,
    "type": "Sawed-Off",
    "skinName": "Fubar",
    "prices": {
      "default": {
        "0": {
          "market": 0.08,
          "analyst": 0.06,
          "opskins": 0.05
        },
        "1": {
          "market": 0.09,
          "analyst": 0.08,
          "opskins": 0.06
        }
      },
      "stattrak": {
        "0": {
          "market": 0.22,
          "analyst": 0.19,
          "opskins": 0.15
        },
        "1": {
          "market": 0.36,
          "analyst": 0.37,
          "opskins": 0.32
        }
      },
      "souvenir": {}
    }
  },
  "310": {
    "item_id": 310,
    "type": "P2000",
    "skinName": "Oceanic",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "1": {
          "market": 0.14,
          "analyst": 0.14,
          "opskins": 0.11
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "3": {
          "market": 0.12,
          "analyst": 0.1,
          "opskins": 0.08
        },
        "4": {
          "market": 0.21,
          "analyst": 0.19,
          "opskins": 0.15
        }
      },
      "stattrak": {
        "0": {
          "market": 0.31,
          "analyst": 0.31,
          "opskins": 0.26
        },
        "1": {
          "market": 0.53,
          "analyst": 0.59,
          "opskins": 0.5
        },
        "2": {
          "market": 0.32,
          "analyst": 0.31,
          "opskins": 0.24
        },
        "3": {
          "market": 0.66,
          "analyst": 0.68,
          "opskins": 0.51
        },
        "4": {
          "market": 1.19,
          "analyst": 1.08,
          "opskins": 0.9
        }
      },
      "souvenir": {}
    }
  },
  "311": {
    "item_id": 311,
    "type": "MP9",
    "skinName": "Bioleak",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.12,
          "opskins": 0.19
        },
        "1": {
          "market": 0.13,
          "analyst": 0.14,
          "opskins": 0.11
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.12
        },
        "3": {
          "market": 0.13,
          "analyst": 0.12,
          "opskins": 0.11
        },
        "4": {
          "market": 0.2,
          "analyst": 0.19,
          "opskins": 0.13
        }
      },
      "stattrak": {
        "0": {
          "market": 0.32,
          "analyst": 0.28,
          "opskins": 0.27
        },
        "1": {
          "market": 0.5,
          "analyst": 0.44,
          "opskins": 0.4
        },
        "2": {
          "market": 0.33,
          "analyst": 0.29,
          "opskins": 0.23
        },
        "3": {
          "market": 0.61,
          "analyst": 0.63,
          "opskins": 0.49
        },
        "4": {
          "market": 0.93,
          "analyst": 0.88,
          "opskins": 0.69
        }
      },
      "souvenir": {}
    }
  },
  "312": {
    "item_id": 312,
    "type": "M249",
    "skinName": "Spectre",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.09,
          "opskins": 0.09
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "2": {
          "market": 0.08,
          "analyst": 0.06,
          "opskins": 0.06
        },
        "3": {
          "market": 0.1,
          "analyst": 0.08,
          "opskins": 0.06
        },
        "4": {
          "market": 0.16,
          "analyst": 0.13,
          "opskins": 0.1
        }
      },
      "stattrak": {
        "0": {
          "market": 0.23,
          "analyst": 0.2,
          "opskins": 0.47
        },
        "1": {
          "market": 0.26,
          "analyst": 0.21,
          "opskins": 0.21
        },
        "2": {
          "market": 0.24,
          "analyst": 0.21,
          "opskins": 0.16
        },
        "3": {
          "market": 0.46,
          "analyst": 0.4,
          "opskins": 0.33
        },
        "4": {
          "market": 0.77,
          "analyst": 0.74,
          "opskins": 0.65
        }
      },
      "souvenir": {}
    }
  },
  "313": {
    "item_id": 313,
    "type": "G3SG1",
    "skinName": "Orange Crash",
    "prices": {
      "default": {
        "0": {
          "market": 0.08,
          "analyst": 0.07,
          "opskins": 0.2
        },
        "1": {
          "market": 0.08,
          "analyst": 0.07,
          "opskins": 0.12
        },
        "2": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.06
        },
        "3": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "4": {
          "market": 0.15,
          "analyst": 0.13,
          "opskins": 0.1
        }
      },
      "stattrak": {
        "0": {
          "market": 0.26,
          "analyst": 0.29,
          "opskins": 0.25
        },
        "1": {
          "market": 0.32,
          "analyst": 0.38,
          "opskins": 0.31
        },
        "2": {
          "market": 0.26,
          "analyst": 0.23,
          "opskins": 0.19
        },
        "3": {
          "market": 0.43,
          "analyst": 0.5,
          "opskins": 0.39
        },
        "4": {
          "market": 0.77,
          "analyst": 0.77,
          "opskins": 0.64
        }
      },
      "souvenir": {}
    }
  },
  "314": {
    "item_id": 314,
    "type": "Dual Berettas",
    "skinName": "Ventilators",
    "prices": {
      "default": {
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.09
        },
        "3": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.13
        },
        "4": {
          "market": 0.15,
          "analyst": 0.13,
          "opskins": 0.1
        }
      },
      "stattrak": {
        "1": {
          "market": 0.37,
          "analyst": 0.38,
          "opskins": 0.33
        },
        "2": {
          "market": 0.29,
          "analyst": 0.27,
          "opskins": 0.21
        },
        "3": {
          "market": 0.51,
          "analyst": 0.55,
          "opskins": 0.43
        },
        "4": {
          "market": 0.84,
          "analyst": 0.91,
          "opskins": 0.7
        }
      },
      "souvenir": {}
    }
  },
  "315": {
    "item_id": 315,
    "type": "XM1014",
    "skinName": "Black Tie",
    "prices": {
      "default": {
        "0": {
          "market": 0.31,
          "analyst": 0.27,
          "opskins": 0.23
        },
        "1": {
          "market": 0.37,
          "analyst": 0.29,
          "opskins": 0.26
        },
        "2": {
          "market": 0.33,
          "analyst": 0.27,
          "opskins": 0.23
        },
        "3": {
          "market": 0.6,
          "analyst": 0.51,
          "opskins": 0.42
        },
        "4": {
          "market": 1.11,
          "analyst": 0.97,
          "opskins": 0.81
        }
      },
      "stattrak": {
        "0": {
          "market": 0.94,
          "analyst": 0.78,
          "opskins": 0.73
        },
        "1": {
          "market": 1.41,
          "analyst": 1.32,
          "opskins": 1.19
        },
        "2": {
          "market": 1.18,
          "analyst": 0.99,
          "opskins": 0.84
        },
        "3": {
          "market": 2.62,
          "analyst": 2.33,
          "opskins": 1.99
        },
        "4": {
          "market": 5.65,
          "analyst": 5.31,
          "opskins": 4.65
        }
      },
      "souvenir": {}
    }
  },
  "316": {
    "item_id": 316,
    "type": "Tec-9",
    "skinName": "Re-Entry",
    "prices": {
      "default": {
        "1": {
          "market": 0.53,
          "analyst": 0.42,
          "opskins": 0.35
        },
        "2": {
          "market": 0.36,
          "analyst": 0.29,
          "opskins": 0.23
        },
        "3": {
          "market": 0.65,
          "analyst": 0.53,
          "opskins": 0.4
        },
        "4": {
          "market": 1.13,
          "analyst": 0.98,
          "opskins": 0.75
        }
      },
      "stattrak": {
        "1": {
          "market": 2.51,
          "analyst": 2.29,
          "opskins": 1.73
        },
        "2": {
          "market": 2.19,
          "analyst": 1.78,
          "opskins": 1.36
        },
        "3": {
          "market": 4.21,
          "analyst": 3.6,
          "opskins": 2.94
        },
        "4": {
          "market": 6.83,
          "analyst": 5.72,
          "opskins": 5.09
        }
      },
      "souvenir": {}
    }
  },
  "317": {
    "item_id": 317,
    "type": "SSG 08",
    "skinName": "Ghost Crusader",
    "prices": {
      "default": {
        "0": {
          "market": 0.32,
          "analyst": 0.26,
          "opskins": 0.22
        },
        "1": {
          "market": 0.36,
          "analyst": 0.29,
          "opskins": 0.22
        },
        "2": {
          "market": 0.42,
          "analyst": 0.35,
          "opskins": 0.27
        },
        "3": {
          "market": 1.09,
          "analyst": 0.91,
          "opskins": 0.72
        },
        "4": {
          "market": 3.16,
          "analyst": 2.49,
          "opskins": 2.06
        }
      },
      "stattrak": {
        "0": {
          "market": 2.02,
          "analyst": 1.94,
          "opskins": 1.54
        },
        "1": {
          "market": 2.39,
          "analyst": 1.98,
          "opskins": 1.59
        },
        "2": {
          "market": 3.24,
          "analyst": 2.73,
          "opskins": 2.17
        },
        "3": {
          "market": 6.25,
          "analyst": 5.12,
          "opskins": 4.49
        },
        "4": {
          "market": 16.14,
          "analyst": 15.77,
          "opskins": 16.2
        }
      },
      "souvenir": {}
    }
  },
  "318": {
    "item_id": 318,
    "type": "Galil AR",
    "skinName": "Firefight",
    "prices": {
      "default": {
        "0": {
          "market": 0.3,
          "analyst": 0.25,
          "opskins": 0.21
        },
        "1": {
          "market": 0.31,
          "analyst": 0.26,
          "opskins": 0.24
        },
        "2": {
          "market": 0.32,
          "analyst": 0.27,
          "opskins": 0.21
        },
        "3": {
          "market": 0.58,
          "analyst": 0.53,
          "opskins": 0.41
        },
        "4": {
          "market": 1.43,
          "analyst": 1.31,
          "opskins": 1.14
        }
      },
      "stattrak": {
        "0": {
          "market": 0.92,
          "analyst": 0.89,
          "opskins": 0.69
        },
        "1": {
          "market": 1.02,
          "analyst": 0.86,
          "opskins": 0.69
        },
        "2": {
          "market": 1.24,
          "analyst": 1.04,
          "opskins": 0.84
        },
        "3": {
          "market": 2.74,
          "analyst": 2.46,
          "opskins": 2.09
        },
        "4": {
          "market": 6.05,
          "analyst": 6.3,
          "opskins": 5.74
        }
      },
      "souvenir": {}
    }
  },
  "319": {
    "item_id": 319,
    "type": "CZ75-Auto",
    "skinName": "Red Astor",
    "prices": {
      "default": {
        "0": {
          "market": 0.3,
          "analyst": 0.25,
          "opskins": 0.21
        },
        "1": {
          "market": 0.31,
          "analyst": 0.26,
          "opskins": 0.21
        },
        "2": {
          "market": 0.32,
          "analyst": 0.27,
          "opskins": 0.22
        },
        "3": {
          "market": 0.61,
          "analyst": 0.52,
          "opskins": 0.44
        },
        "4": {
          "market": 1.26,
          "analyst": 1.06,
          "opskins": 0.88
        }
      },
      "stattrak": {
        "0": {
          "market": 0.95,
          "analyst": 0.81,
          "opskins": 0.68
        },
        "1": {
          "market": 0.98,
          "analyst": 0.86,
          "opskins": 0.81
        },
        "2": {
          "market": 1.18,
          "analyst": 1.02,
          "opskins": 0.79
        },
        "3": {
          "market": 2.64,
          "analyst": 2.36,
          "opskins": 2.02
        },
        "4": {
          "market": 7.04,
          "analyst": 6.9,
          "opskins": 6.89
        }
      },
      "souvenir": {}
    }
  },
  "320": {
    "item_id": 320,
    "type": "UMP-45",
    "skinName": "Primal Saber",
    "prices": {
      "default": {
        "0": {
          "market": 2.99,
          "analyst": 2.36,
          "opskins": 1.97
        },
        "1": {
          "market": 5.01,
          "analyst": 4.18,
          "opskins": 4.29
        },
        "2": {
          "market": 4.54,
          "analyst": 3.69,
          "opskins": 2.99
        },
        "3": {
          "market": 7.17,
          "analyst": 5.96,
          "opskins": 5.09
        },
        "4": {
          "market": 12.18,
          "analyst": 10.77,
          "opskins": 9.22
        }
      },
      "stattrak": {
        "0": {
          "market": 9.89,
          "analyst": 9.52,
          "opskins": 9.02
        },
        "1": {
          "market": 16.1,
          "analyst": 14.83,
          "opskins": 14.49
        },
        "2": {
          "market": 14.75,
          "analyst": 13.18,
          "opskins": 11.45
        },
        "3": {
          "market": 25.38,
          "analyst": 23.92,
          "opskins": 21.9
        },
        "4": {
          "market": 54.48,
          "analyst": 55.11,
          "opskins": 53.89
        }
      },
      "souvenir": {}
    }
  },
  "321": {
    "item_id": 321,
    "type": "P250",
    "skinName": "Asiimov",
    "prices": {
      "default": {
        "0": {
          "market": 2,
          "analyst": 1.75,
          "opskins": 1.48
        },
        "1": {
          "market": 4.09,
          "analyst": 3.45,
          "opskins": 3.05
        },
        "2": {
          "market": 4.32,
          "analyst": 3.88,
          "opskins": 3.22
        },
        "3": {
          "market": 16.76,
          "analyst": 16.82,
          "opskins": 15.46
        }
      },
      "stattrak": {
        "0": {
          "market": 7.57,
          "analyst": 6.61,
          "opskins": 5.63
        },
        "1": {
          "market": 15.62,
          "analyst": 14.12,
          "opskins": 12.19
        },
        "2": {
          "market": 18.53,
          "analyst": 15.93,
          "opskins": 14
        },
        "3": {
          "market": 72.88,
          "analyst": 92.82,
          "opskins": 78.82
        }
      },
      "souvenir": {}
    }
  },
  "322": {
    "item_id": 322,
    "type": "AUG",
    "skinName": "Fleet Flock",
    "prices": {
      "default": {
        "0": {
          "market": 1.21,
          "analyst": 1.07,
          "opskins": 0.97
        },
        "1": {
          "market": 1.25,
          "analyst": 1.12,
          "opskins": 0.93
        },
        "2": {
          "market": 1.34,
          "analyst": 1.19,
          "opskins": 0.96
        },
        "3": {
          "market": 2.16,
          "analyst": 1.86,
          "opskins": 1.58
        },
        "4": {
          "market": 4.63,
          "analyst": 4.09,
          "opskins": 3.6
        }
      },
      "stattrak": {
        "0": {
          "market": 3.42,
          "analyst": 3.01,
          "opskins": 2.75
        },
        "1": {
          "market": 3.32,
          "analyst": 3.08,
          "opskins": 2.98
        },
        "2": {
          "market": 4.1,
          "analyst": 4.16,
          "opskins": 4.13
        },
        "3": {
          "market": 8.3,
          "analyst": 8.84,
          "opskins": 8.73
        },
        "4": {
          "market": 24.39,
          "analyst": 35.52,
          "opskins": 64.99
        }
      },
      "souvenir": {}
    }
  },
  "323": {
    "item_id": 323,
    "type": "M4A1-S",
    "skinName": "Chantico's Fire",
    "prices": {
      "default": {
        "0": {
          "market": 12.92,
          "analyst": 11.13,
          "opskins": 10.1
        },
        "1": {
          "market": 17.34,
          "analyst": 13.75,
          "opskins": 12.26
        },
        "2": {
          "market": 22.05,
          "analyst": 17.8,
          "opskins": 16.34
        },
        "3": {
          "market": 30.93,
          "analyst": 25.41,
          "opskins": 22.15
        },
        "4": {
          "market": 66.51,
          "analyst": 53.8,
          "opskins": 49.79
        }
      },
      "stattrak": {
        "0": {
          "market": 35.24,
          "analyst": 27.87,
          "opskins": 27.89
        },
        "1": {
          "market": 43.01,
          "analyst": 38.63,
          "opskins": 34.1
        },
        "2": {
          "market": 61.17,
          "analyst": 50.67,
          "opskins": 44.1
        },
        "3": {
          "market": 102.95,
          "analyst": 97.28,
          "opskins": 84.8
        },
        "4": {
          "market": 380.01,
          "analyst": 380.71,
          "opskins": 319.99
        }
      },
      "souvenir": {}
    }
  },
  "324": {
    "item_id": 324,
    "type": "PP-Bizon",
    "skinName": "Judgement of Anubis",
    "prices": {
      "default": {
        "0": {
          "market": 4.05,
          "analyst": 3.4,
          "opskins": 3.48
        },
        "1": {
          "market": 4.83,
          "analyst": 4.11,
          "opskins": 3.65
        },
        "2": {
          "market": 4.58,
          "analyst": 4,
          "opskins": 3.38
        },
        "3": {
          "market": 6.98,
          "analyst": 6.16,
          "opskins": 5.4
        },
        "4": {
          "market": 9.6,
          "analyst": 9.7,
          "opskins": 7.46
        }
      },
      "stattrak": {
        "0": {
          "market": 12.47,
          "analyst": 13.65,
          "opskins": 16
        },
        "1": {
          "market": 12.91,
          "analyst": 13.57,
          "opskins": 13.49
        },
        "2": {
          "market": 12.48,
          "analyst": 11.87,
          "opskins": 10.68
        },
        "3": {
          "market": 23.05,
          "analyst": 26.2,
          "opskins": 23.75
        },
        "4": {
          "market": 36.34,
          "analyst": 37.08,
          "opskins": 33.4
        }
      },
      "souvenir": {}
    }
  },
  "325": {
    "item_id": 325,
    "type": "AK-47",
    "skinName": "Elite Build",
    "prices": {
      "default": {
        "0": {
          "market": 0.43,
          "analyst": 0.2,
          "opskins": 0.27
        },
        "1": {
          "market": 0.45,
          "analyst": 0.21,
          "opskins": 0.3
        },
        "2": {
          "market": 0.55,
          "analyst": 0.28,
          "opskins": 0.32
        },
        "3": {
          "market": 0.85,
          "analyst": 0.53,
          "opskins": 0.53
        },
        "4": {
          "market": 2.53,
          "analyst": 1.82,
          "opskins": 1.54
        }
      },
      "stattrak": {
        "0": {
          "market": 2.6,
          "analyst": 1.95,
          "opskins": 1.7
        },
        "1": {
          "market": 2.67,
          "analyst": 2,
          "opskins": 1.68
        },
        "2": {
          "market": 3.17,
          "analyst": 2.31,
          "opskins": 2.05
        },
        "3": {
          "market": 4.58,
          "analyst": 3.32,
          "opskins": 2.8
        },
        "4": {
          "market": 11.85,
          "analyst": 9.79,
          "opskins": 8.25
        }
      },
      "souvenir": {}
    }
  },
  "326": {
    "item_id": 326,
    "type": "MP7",
    "skinName": "Armor Core",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "2": {
          "market": 0.08,
          "analyst": 0.06,
          "opskins": 0.05
        },
        "3": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "4": {
          "market": 0.11,
          "analyst": 0.1,
          "opskins": 0.07
        }
      },
      "stattrak": {
        "0": {
          "market": 0.27,
          "analyst": 0.23,
          "opskins": 0.2
        },
        "1": {
          "market": 0.3,
          "analyst": 0.24,
          "opskins": 0.19
        },
        "2": {
          "market": 0.25,
          "analyst": 0.21,
          "opskins": 0.17
        },
        "3": {
          "market": 0.31,
          "analyst": 0.25,
          "opskins": 0.21
        },
        "4": {
          "market": 0.55,
          "analyst": 0.43,
          "opskins": 0.37
        }
      },
      "souvenir": {}
    }
  },
  "327": {
    "item_id": 327,
    "type": "Desert Eagle",
    "skinName": "Bronze Deco",
    "prices": {
      "default": {
        "0": {
          "market": 0.19,
          "analyst": 0.14,
          "opskins": 0.15
        },
        "1": {
          "market": 0.14,
          "analyst": 0.08,
          "opskins": 0.08
        },
        "2": {
          "market": 0.1,
          "analyst": 0.08,
          "opskins": 0.11
        },
        "3": {
          "market": 0.15,
          "analyst": 0.1,
          "opskins": 0.1
        },
        "4": {
          "market": 0.2,
          "analyst": 0.15,
          "opskins": 0.13
        }
      },
      "stattrak": {
        "0": {
          "market": 1.41,
          "analyst": 1.07,
          "opskins": 1.02
        },
        "1": {
          "market": 0.82,
          "analyst": 0.64,
          "opskins": 0.56
        },
        "2": {
          "market": 0.63,
          "analyst": 0.48,
          "opskins": 0.42
        },
        "3": {
          "market": 1,
          "analyst": 0.72,
          "opskins": 0.62
        },
        "4": {
          "market": 1.31,
          "analyst": 1.05,
          "opskins": 0.9
        }
      },
      "souvenir": {}
    }
  },
  "328": {
    "item_id": 328,
    "type": "P250",
    "skinName": "Valence",
    "prices": {
      "default": {
        "0": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "1": {
          "market": 0.16,
          "analyst": 0.12,
          "opskins": 0.12
        },
        "2": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "3": {
          "market": 0.14,
          "analyst": 0.1,
          "opskins": 0.08
        },
        "4": {
          "market": 0.32,
          "analyst": 0.28,
          "opskins": 0.23
        }
      },
      "stattrak": {
        "0": {
          "market": 0.35,
          "analyst": 0.3,
          "opskins": 0.23
        },
        "1": {
          "market": 0.6,
          "analyst": 0.66,
          "opskins": 0.54
        },
        "2": {
          "market": 0.36,
          "analyst": 0.3,
          "opskins": 0.25
        },
        "3": {
          "market": 0.57,
          "analyst": 0.51,
          "opskins": 0.4
        },
        "4": {
          "market": 1.89,
          "analyst": 1.57,
          "opskins": 1.25
        }
      },
      "souvenir": {}
    }
  },
  "329": {
    "item_id": 329,
    "type": "Negev",
    "skinName": "Man-o'-war",
    "prices": {
      "default": {
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "3": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.13
        }
      },
      "stattrak": {
        "2": {
          "market": 0.23,
          "analyst": 0.19,
          "opskins": 0.16
        },
        "3": {
          "market": 0.25,
          "analyst": 0.21,
          "opskins": 0.15
        }
      },
      "souvenir": {}
    }
  },
  "330": {
    "item_id": 330,
    "type": "Sawed-Off",
    "skinName": "Origami",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.11
        },
        "1": {
          "market": 0.1,
          "analyst": 0.06,
          "opskins": 0.11
        },
        "2": {
          "market": 0.08,
          "analyst": 0.06,
          "opskins": 0.09
        },
        "3": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.09
        },
        "4": {
          "market": 0.13,
          "analyst": 0.1,
          "opskins": 0.09
        }
      },
      "stattrak": {
        "0": {
          "market": 0.22,
          "analyst": 0.19,
          "opskins": 0.17
        },
        "1": {
          "market": 0.24,
          "analyst": 0.23,
          "opskins": 0.2
        },
        "2": {
          "market": 0.23,
          "analyst": 0.2,
          "opskins": 0.16
        },
        "3": {
          "market": 0.3,
          "analyst": 0.24,
          "opskins": 0.18
        },
        "4": {
          "market": 0.54,
          "analyst": 0.42,
          "opskins": 0.35
        }
      },
      "souvenir": {}
    }
  },
  "331": {
    "item_id": 331,
    "type": "AWP",
    "skinName": "Worm God",
    "prices": {
      "default": {
        "1": {
          "market": 1.05,
          "analyst": 0.85,
          "opskins": 0.73
        },
        "2": {
          "market": 0.84,
          "analyst": 0.66,
          "opskins": 0.55
        },
        "3": {
          "market": 0.91,
          "analyst": 0.72,
          "opskins": 0.62
        },
        "4": {
          "market": 1.4,
          "analyst": 1.11,
          "opskins": 0.95
        }
      },
      "stattrak": {
        "1": {
          "market": 5,
          "analyst": 4.39,
          "opskins": 3.74
        },
        "2": {
          "market": 4.82,
          "analyst": 3.45,
          "opskins": 2.84
        },
        "3": {
          "market": 5.13,
          "analyst": 3.78,
          "opskins": 3.16
        },
        "4": {
          "market": 6.64,
          "analyst": 5.26,
          "opskins": 4.51
        }
      },
      "souvenir": {}
    }
  },
  "332": {
    "item_id": 332,
    "type": "MAG-7",
    "skinName": "Heat",
    "prices": {
      "default": {
        "0": {
          "market": 0.24,
          "analyst": 0.2,
          "opskins": 0.17
        },
        "1": {
          "market": 0.24,
          "analyst": 0.2,
          "opskins": 0.17
        },
        "2": {
          "market": 0.24,
          "analyst": 0.2,
          "opskins": 0.17
        },
        "3": {
          "market": 0.3,
          "analyst": 0.24,
          "opskins": 0.21
        },
        "4": {
          "market": 0.88,
          "analyst": 0.72,
          "opskins": 0.61
        }
      },
      "stattrak": {
        "0": {
          "market": 0.62,
          "analyst": 0.52,
          "opskins": 0.45
        },
        "1": {
          "market": 0.62,
          "analyst": 0.52,
          "opskins": 0.46
        },
        "2": {
          "market": 0.64,
          "analyst": 0.53,
          "opskins": 0.48
        },
        "3": {
          "market": 1.1,
          "analyst": 0.98,
          "opskins": 0.77
        },
        "4": {
          "market": 5,
          "analyst": 3.56,
          "opskins": 3.18
        }
      },
      "souvenir": {}
    }
  },
  "333": {
    "item_id": 333,
    "type": "CZ75-Auto",
    "skinName": "Pole Position",
    "prices": {
      "default": {
        "0": {
          "market": 0.24,
          "analyst": 0.2,
          "opskins": 0.17
        },
        "1": {
          "market": 0.25,
          "analyst": 0.24,
          "opskins": 0.2
        },
        "2": {
          "market": 0.23,
          "analyst": 0.2,
          "opskins": 0.15
        },
        "3": {
          "market": 0.28,
          "analyst": 0.22,
          "opskins": 0.17
        },
        "4": {
          "market": 0.54,
          "analyst": 0.41,
          "opskins": 0.36
        }
      },
      "stattrak": {
        "0": {
          "market": 0.61,
          "analyst": 0.52,
          "opskins": 0.45
        },
        "1": {
          "market": 0.63,
          "analyst": 0.54,
          "opskins": 0.43
        },
        "2": {
          "market": 0.61,
          "analyst": 0.52,
          "opskins": 0.41
        },
        "3": {
          "market": 1.01,
          "analyst": 0.88,
          "opskins": 0.68
        },
        "4": {
          "market": 2.19,
          "analyst": 2.06,
          "opskins": 1.66
        }
      },
      "souvenir": {}
    }
  },
  "334": {
    "item_id": 334,
    "type": "UMP-45",
    "skinName": "Grand Prix",
    "prices": {
      "default": {
        "2": {
          "market": 0.23,
          "analyst": 0.2,
          "opskins": 0.15
        }
      },
      "stattrak": {
        "2": {
          "market": 0.69,
          "analyst": 0.54,
          "opskins": 0.41
        }
      },
      "souvenir": {}
    }
  },
  "335": {
    "item_id": 335,
    "type": "Five-SeveN",
    "skinName": "Monkey Business",
    "prices": {
      "default": {
        "0": {
          "market": 1.15,
          "analyst": 1.13,
          "opskins": 1.18
        },
        "1": {
          "market": 1.24,
          "analyst": 1.03,
          "opskins": 0.89
        },
        "2": {
          "market": 1.34,
          "analyst": 1.07,
          "opskins": 0.93
        },
        "3": {
          "market": 6.53,
          "analyst": 5.33,
          "opskins": 4.59
        }
      },
      "stattrak": {
        "0": {
          "market": 3.01,
          "analyst": 2.49,
          "opskins": 2.17
        },
        "1": {
          "market": 4.15,
          "analyst": 3.32,
          "opskins": 2.66
        },
        "2": {
          "market": 4.92,
          "analyst": 3.93,
          "opskins": 3.37
        },
        "3": {
          "market": 27.44,
          "analyst": 20.91,
          "opskins": 18.49
        }
      },
      "souvenir": {}
    }
  },
  "336": {
    "item_id": 336,
    "type": "FAMAS",
    "skinName": "Djinn",
    "prices": {
      "default": {
        "0": {
          "market": 1.1,
          "analyst": 0.96,
          "opskins": 0.79
        },
        "1": {
          "market": 1.1,
          "analyst": 0.96,
          "opskins": 0.79
        },
        "2": {
          "market": 1.1,
          "analyst": 0.98,
          "opskins": 0.79
        },
        "3": {
          "market": 1.46,
          "analyst": 1.24,
          "opskins": 1.01
        },
        "4": {
          "market": 3.09,
          "analyst": 3.02,
          "opskins": 2.53
        }
      },
      "stattrak": {
        "0": {
          "market": 2.64,
          "analyst": 2.34,
          "opskins": 2.27
        },
        "1": {
          "market": 2.59,
          "analyst": 2.32,
          "opskins": 2.02
        },
        "2": {
          "market": 2.67,
          "analyst": 2.37,
          "opskins": 2.04
        },
        "3": {
          "market": 4.77,
          "analyst": 4.05,
          "opskins": 3.72
        },
        "4": {
          "market": 13.51,
          "analyst": 14.5,
          "opskins": 13.46
        }
      },
      "souvenir": {}
    }
  },
  "337": {
    "item_id": 337,
    "type": "★ Flip Knife",
    "skinName": "Doppler",
    "prices": {
      "default": {
        "3": {
          "market": 131.21,
          "analyst": 124.69,
          "opskins": 100
        },
        "4": {
          "market": 118.13,
          "analyst": 104.62,
          "opskins": 88
        }
      },
      "stattrak": {
        "3": {
          "market": 180,
          "analyst": 211.36,
          "opskins": 189.93
        },
        "4": {
          "market": 153.18,
          "analyst": 144.76,
          "opskins": 123.31
        }
      },
      "souvenir": {}
    }
  },
  "338": {
    "item_id": 338,
    "type": "★ Bayonet",
    "skinName": "Doppler",
    "prices": {
      "default": {
        "3": {
          "market": 185.32,
          "analyst": 168.42,
          "opskins": 137.99
        },
        "4": {
          "market": 179.8,
          "analyst": 159.08,
          "opskins": 132
        }
      },
      "stattrak": {
        "3": {
          "market": 237.94,
          "analyst": 241,
          "opskins": 285.23
        },
        "4": {
          "market": 230.75,
          "analyst": 212.56,
          "opskins": 175.22
        }
      },
      "souvenir": {}
    }
  },
  "339": {
    "item_id": 339,
    "type": "Glock-18",
    "skinName": "Catacombs",
    "prices": {
      "default": {
        "0": {
          "market": 0.18,
          "analyst": 0.17,
          "opskins": 0.16
        },
        "1": {
          "market": 0.26,
          "analyst": 0.17,
          "opskins": 0.38
        },
        "2": {
          "market": 0.14,
          "analyst": 0.11,
          "opskins": 0.1
        },
        "3": {
          "market": 0.17,
          "analyst": 0.13,
          "opskins": 0.1
        },
        "4": {
          "market": 0.24,
          "analyst": 0.19,
          "opskins": 0.2
        }
      },
      "stattrak": {
        "0": {
          "market": 0.84,
          "analyst": 0.73,
          "opskins": 0.72
        },
        "1": {
          "market": 1,
          "analyst": 0.87,
          "opskins": 0.73
        },
        "2": {
          "market": 0.62,
          "analyst": 0.54,
          "opskins": 0.49
        },
        "3": {
          "market": 0.77,
          "analyst": 0.67,
          "opskins": 0.59
        },
        "4": {
          "market": 1.26,
          "analyst": 1.1,
          "opskins": 0.91
        }
      },
      "souvenir": {}
    }
  },
  "340": {
    "item_id": 340,
    "type": "M249",
    "skinName": "System Lock",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.13
        },
        "1": {
          "market": 0.11,
          "analyst": 0.08,
          "opskins": 0.09
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.13
        },
        "3": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.09
        },
        "4": {
          "market": 0.23,
          "analyst": 0.18,
          "opskins": 0.16
        }
      },
      "stattrak": {
        "0": {
          "market": 0.23,
          "analyst": 0.2,
          "opskins": 0.17
        },
        "1": {
          "market": 0.34,
          "analyst": 0.24,
          "opskins": 0.24
        },
        "2": {
          "market": 0.23,
          "analyst": 0.2,
          "opskins": 0.17
        },
        "3": {
          "market": 0.31,
          "analyst": 0.26,
          "opskins": 0.23
        },
        "4": {
          "market": 0.9,
          "analyst": 0.73,
          "opskins": 0.58
        }
      },
      "souvenir": {}
    }
  },
  "341": {
    "item_id": 341,
    "type": "MP9",
    "skinName": "Deadly Poison",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "2": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "3": {
          "market": 0.13,
          "analyst": 0.1,
          "opskins": 0.08
        },
        "4": {
          "market": 0.5,
          "analyst": 0.41,
          "opskins": 0.35
        }
      },
      "stattrak": {
        "0": {
          "market": 0.29,
          "analyst": 0.23,
          "opskins": 0.22
        },
        "1": {
          "market": 0.29,
          "analyst": 0.22,
          "opskins": 0.2
        },
        "2": {
          "market": 0.3,
          "analyst": 0.23,
          "opskins": 0.2
        },
        "3": {
          "market": 0.47,
          "analyst": 0.38,
          "opskins": 0.3
        },
        "4": {
          "market": 2.1,
          "analyst": 1.8,
          "opskins": 1.42
        }
      },
      "souvenir": {}
    }
  },
  "342": {
    "item_id": 342,
    "type": "SCAR-20",
    "skinName": "Grotto",
    "prices": {
      "default": {
        "0": {
          "market": 0.16,
          "analyst": 0.15,
          "opskins": 0.13
        },
        "1": {
          "market": 0.15,
          "analyst": 0.11,
          "opskins": 0.08
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.13
        },
        "3": {
          "market": 0.13,
          "analyst": 0.08,
          "opskins": 0.07
        },
        "4": {
          "market": 0.16,
          "analyst": 0.11,
          "opskins": 0.09
        }
      },
      "stattrak": {
        "0": {
          "market": 0.43,
          "analyst": 0.26,
          "opskins": 0.2
        },
        "1": {
          "market": 0.37,
          "analyst": 0.31,
          "opskins": 0.25
        },
        "2": {
          "market": 0.26,
          "analyst": 0.2,
          "opskins": 0.17
        },
        "3": {
          "market": 0.38,
          "analyst": 0.27,
          "opskins": 0.22
        },
        "4": {
          "market": 0.73,
          "analyst": 0.51,
          "opskins": 0.44
        }
      },
      "souvenir": {}
    }
  },
  "343": {
    "item_id": 343,
    "type": "XM1014",
    "skinName": "Quicksilver",
    "prices": {
      "default": {
        "0": {
          "market": 0.1,
          "analyst": 0.08,
          "opskins": 1
        },
        "1": {
          "market": 0.1,
          "analyst": 0.1,
          "opskins": 0.1
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.1
        },
        "3": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.1
        },
        "4": {
          "market": 0.14,
          "analyst": 0.1,
          "opskins": 0.09
        }
      },
      "stattrak": {
        "0": {
          "market": 0.44,
          "analyst": 0.23,
          "opskins": 0.22
        },
        "1": {
          "market": 0.34,
          "analyst": 0.21,
          "opskins": 0.21
        },
        "2": {
          "market": 0.23,
          "analyst": 0.19,
          "opskins": 0.16
        },
        "3": {
          "market": 0.31,
          "analyst": 0.22,
          "opskins": 0.17
        },
        "4": {
          "market": 0.56,
          "analyst": 0.44,
          "opskins": 0.36
        }
      },
      "souvenir": {}
    }
  },
  "344": {
    "item_id": 344,
    "type": "Dual Berettas",
    "skinName": "Urban Shock",
    "prices": {
      "default": {
        "0": {
          "market": 0.39,
          "analyst": 0.35,
          "opskins": 0.35
        },
        "1": {
          "market": 0.46,
          "analyst": 0.4,
          "opskins": 0.4
        },
        "2": {
          "market": 0.37,
          "analyst": 0.28,
          "opskins": 0.26
        },
        "3": {
          "market": 0.45,
          "analyst": 0.36,
          "opskins": 0.31
        },
        "4": {
          "market": 0.66,
          "analyst": 0.52,
          "opskins": 0.39
        }
      },
      "stattrak": {
        "0": {
          "market": 1.14,
          "analyst": 1.3,
          "opskins": 1.11
        },
        "1": {
          "market": 1.15,
          "analyst": 0.99,
          "opskins": 0.98
        },
        "2": {
          "market": 1.09,
          "analyst": 1,
          "opskins": 0.78
        },
        "3": {
          "market": 1.61,
          "analyst": 1.37,
          "opskins": 1.11
        },
        "4": {
          "market": 2.64,
          "analyst": 2.27,
          "opskins": 1.84
        }
      },
      "souvenir": {}
    }
  },
  "345": {
    "item_id": 345,
    "type": "Desert Eagle",
    "skinName": "Naga",
    "prices": {
      "default": {
        "0": {
          "market": 0.39,
          "analyst": 0.3,
          "opskins": 0.28
        },
        "1": {
          "market": 0.43,
          "analyst": 0.32,
          "opskins": 0.31
        },
        "2": {
          "market": 0.38,
          "analyst": 0.3,
          "opskins": 0.27
        },
        "3": {
          "market": 0.61,
          "analyst": 0.48,
          "opskins": 0.5
        },
        "4": {
          "market": 1.87,
          "analyst": 1.42,
          "opskins": 1.18
        }
      },
      "stattrak": {
        "0": {
          "market": 1.88,
          "analyst": 1.38,
          "opskins": 1.25
        },
        "1": {
          "market": 1.81,
          "analyst": 1.42,
          "opskins": 1.17
        },
        "2": {
          "market": 1.91,
          "analyst": 1.39,
          "opskins": 1.26
        },
        "3": {
          "market": 3.04,
          "analyst": 2.22,
          "opskins": 1.84
        },
        "4": {
          "market": 10.32,
          "analyst": 7.84,
          "opskins": 7.68
        }
      },
      "souvenir": {}
    }
  },
  "346": {
    "item_id": 346,
    "type": "MAC-10",
    "skinName": "Malachite",
    "prices": {
      "default": {
        "0": {
          "market": 0.38,
          "analyst": 0.33,
          "opskins": 0.28
        },
        "1": {
          "market": 0.49,
          "analyst": 0.56,
          "opskins": 0.45
        },
        "2": {
          "market": 0.38,
          "analyst": 0.29,
          "opskins": 0.77
        },
        "3": {
          "market": 0.49,
          "analyst": 0.38,
          "opskins": 0.33
        },
        "4": {
          "market": 0.66,
          "analyst": 0.6,
          "opskins": 0.47
        }
      },
      "stattrak": {
        "0": {
          "market": 1.21,
          "analyst": 0.82,
          "opskins": 1.25
        },
        "1": {
          "market": 1.21,
          "analyst": 1.08,
          "opskins": 1.03
        },
        "2": {
          "market": 1.13,
          "analyst": 0.97,
          "opskins": 0.81
        },
        "3": {
          "market": 1.61,
          "analyst": 1.31,
          "opskins": 1.2
        },
        "4": {
          "market": 2.59,
          "analyst": 2.38,
          "opskins": 1.95
        }
      },
      "souvenir": {}
    }
  },
  "347": {
    "item_id": 347,
    "type": "Sawed-Off",
    "skinName": "Serenity",
    "prices": {
      "default": {
        "0": {
          "market": 0.45,
          "analyst": 0.34,
          "opskins": 0.33
        },
        "1": {
          "market": 0.45,
          "analyst": 0.35,
          "opskins": 0.41
        },
        "2": {
          "market": 0.37,
          "analyst": 0.28,
          "opskins": 0.24
        },
        "3": {
          "market": 0.46,
          "analyst": 0.36,
          "opskins": 0.34
        },
        "4": {
          "market": 0.67,
          "analyst": 0.53,
          "opskins": 0.4
        }
      },
      "stattrak": {
        "0": {
          "market": 0.94,
          "analyst": 1.05,
          "opskins": 1.26
        },
        "1": {
          "market": 1.28,
          "analyst": 1.26,
          "opskins": 4.44
        },
        "2": {
          "market": 1.09,
          "analyst": 0.93,
          "opskins": 0.77
        },
        "3": {
          "market": 1.54,
          "analyst": 1.35,
          "opskins": 1.22
        },
        "4": {
          "market": 2.65,
          "analyst": 2.2,
          "opskins": 1.96
        }
      },
      "souvenir": {}
    }
  },
  "348": {
    "item_id": 348,
    "type": "Galil AR",
    "skinName": "Chatterbox",
    "prices": {
      "default": {
        "0": {
          "market": 1.38,
          "analyst": 1.14,
          "opskins": 1.01
        },
        "1": {
          "market": 2.71,
          "analyst": 2.05,
          "opskins": 1.72
        },
        "2": {
          "market": 11,
          "analyst": 9.32,
          "opskins": 8.3
        }
      },
      "stattrak": {
        "0": {
          "market": 5.68,
          "analyst": 5.11,
          "opskins": 4.59
        },
        "1": {
          "market": 12.5,
          "analyst": 12.41,
          "opskins": 10.97
        },
        "2": {
          "market": 63.9,
          "analyst": 65.63,
          "opskins": 60
        }
      },
      "souvenir": {}
    }
  },
  "349": {
    "item_id": 349,
    "type": "★ Butterfly Knife",
    "skinName": "Slaughter",
    "prices": {
      "default": {
        "2": {
          "market": 156.22,
          "analyst": 127.02,
          "opskins": 106.89
        },
        "3": {
          "market": 176.53,
          "analyst": 144.54,
          "opskins": 119.9
        },
        "4": {
          "market": 203.39,
          "analyst": 175.14,
          "opskins": 143.99
        }
      },
      "stattrak": {
        "2": {
          "market": 214,
          "analyst": 242.98,
          "opskins": 192.02
        },
        "3": {
          "market": 224.62,
          "analyst": 212.11,
          "opskins": 174.39
        },
        "4": {
          "market": 323.47,
          "analyst": 350.16,
          "opskins": 254.99
        }
      },
      "souvenir": {}
    }
  },
  "350": {
    "item_id": 350,
    "type": "R8 Revolver",
    "skinName": "Crimson Web",
    "prices": {
      "default": {
        "0": {
          "market": 0.1,
          "analyst": 0.08,
          "opskins": 0.05
        },
        "1": {
          "market": 0.14,
          "analyst": 0.09,
          "opskins": 0.08
        },
        "2": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "3": {
          "market": 0.27,
          "analyst": 0.2,
          "opskins": 0.14
        },
        "4": {
          "market": 2.34,
          "analyst": 1.8,
          "opskins": 1.46
        }
      },
      "stattrak": {
        "0": {
          "market": 0.4,
          "analyst": 0.33,
          "opskins": 0.26
        },
        "1": {
          "market": 0.55,
          "analyst": 0.47,
          "opskins": 0.37
        },
        "2": {
          "market": 0.44,
          "analyst": 0.33,
          "opskins": 0.27
        },
        "3": {
          "market": 1.44,
          "analyst": 1.1,
          "opskins": 0.87
        },
        "4": {
          "market": 17.37,
          "analyst": 19.69,
          "opskins": 18.29
        }
      },
      "souvenir": {}
    }
  },
  "351": {
    "item_id": 351,
    "type": "AUG",
    "skinName": "Ricochet",
    "prices": {
      "default": {
        "0": {
          "market": 0.15,
          "analyst": 0.09,
          "opskins": 0.11
        },
        "1": {
          "market": 0.39,
          "analyst": 0.24,
          "opskins": 0.26
        },
        "2": {
          "market": 0.18,
          "analyst": 0.12,
          "opskins": 0.09
        },
        "3": {
          "market": 0.38,
          "analyst": 0.26,
          "opskins": 0.22
        },
        "4": {
          "market": 0.88,
          "analyst": 0.66,
          "opskins": 0.52
        }
      },
      "stattrak": {
        "0": {
          "market": 0.93,
          "analyst": 0.64,
          "opskins": 0.62
        },
        "1": {
          "market": 1.35,
          "analyst": 1.08,
          "opskins": 0.97
        },
        "2": {
          "market": 1.02,
          "analyst": 0.72,
          "opskins": 0.62
        },
        "3": {
          "market": 1.44,
          "analyst": 1.17,
          "opskins": 0.97
        },
        "4": {
          "market": 3.46,
          "analyst": 2.98,
          "opskins": 2.52
        }
      },
      "souvenir": {}
    }
  },
  "352": {
    "item_id": 352,
    "type": "Desert Eagle",
    "skinName": "Corinthian",
    "prices": {
      "default": {
        "1": {
          "market": 0.58,
          "analyst": 0.35,
          "opskins": 0.36
        },
        "2": {
          "market": 0.32,
          "analyst": 0.23,
          "opskins": 0.22
        },
        "3": {
          "market": 0.4,
          "analyst": 0.3,
          "opskins": 0.25
        },
        "4": {
          "market": 0.7,
          "analyst": 0.44,
          "opskins": 0.41
        }
      },
      "stattrak": {
        "1": {
          "market": 2.53,
          "analyst": 1.97,
          "opskins": 1.87
        },
        "2": {
          "market": 1.89,
          "analyst": 1.37,
          "opskins": 1.19
        },
        "3": {
          "market": 2.44,
          "analyst": 1.96,
          "opskins": 1.64
        },
        "4": {
          "market": 4.19,
          "analyst": 2.95,
          "opskins": 2.55
        }
      },
      "souvenir": {}
    }
  },
  "353": {
    "item_id": 353,
    "type": "P2000",
    "skinName": "Imperial",
    "prices": {
      "default": {
        "2": {
          "market": 0.16,
          "analyst": 0.13,
          "opskins": 0.13
        },
        "3": {
          "market": 0.19,
          "analyst": 0.15,
          "opskins": 0.13
        },
        "4": {
          "market": 0.28,
          "analyst": 0.23,
          "opskins": 0.18
        }
      },
      "stattrak": {
        "2": {
          "market": 0.62,
          "analyst": 0.56,
          "opskins": 0.44
        },
        "3": {
          "market": 0.92,
          "analyst": 0.81,
          "opskins": 0.66
        },
        "4": {
          "market": 1.26,
          "analyst": 1.04,
          "opskins": 0.8
        }
      },
      "souvenir": {}
    }
  },
  "354": {
    "item_id": 354,
    "type": "Sawed-Off",
    "skinName": "Yorick",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.08
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "3": {
          "market": 0.16,
          "analyst": 0.12,
          "opskins": 0.1
        },
        "4": {
          "market": 0.38,
          "analyst": 0.3,
          "opskins": 0.25
        }
      },
      "stattrak": {
        "0": {
          "market": 0.24,
          "analyst": 0.2,
          "opskins": 0.17
        },
        "1": {
          "market": 0.24,
          "analyst": 0.21,
          "opskins": 0.17
        },
        "2": {
          "market": 0.29,
          "analyst": 0.23,
          "opskins": 0.21
        },
        "3": {
          "market": 0.72,
          "analyst": 0.55,
          "opskins": 0.44
        },
        "4": {
          "market": 2.1,
          "analyst": 1.48,
          "opskins": 1.51
        }
      },
      "souvenir": {}
    }
  },
  "355": {
    "item_id": 355,
    "type": "SCAR-20",
    "skinName": "Outbreak",
    "prices": {
      "default": {
        "0": {
          "market": 0.12,
          "analyst": 0.09,
          "opskins": 0.07
        },
        "1": {
          "market": 0.13,
          "analyst": 0.1,
          "opskins": 0.09
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "3": {
          "market": 0.16,
          "analyst": 0.12,
          "opskins": 0.09
        },
        "4": {
          "market": 0.26,
          "analyst": 0.18,
          "opskins": 0.14
        }
      },
      "stattrak": {
        "0": {
          "market": 0.27,
          "analyst": 0.27,
          "opskins": 0.48
        },
        "1": {
          "market": 0.34,
          "analyst": 0.28,
          "opskins": 0.24
        },
        "2": {
          "market": 0.31,
          "analyst": 0.29,
          "opskins": 0.24
        },
        "3": {
          "market": 0.7,
          "analyst": 0.56,
          "opskins": 0.47
        },
        "4": {
          "market": 1.29,
          "analyst": 1.07,
          "opskins": 0.84
        }
      },
      "souvenir": {}
    }
  },
  "356": {
    "item_id": 356,
    "type": "PP-Bizon",
    "skinName": "Fuel Rod",
    "prices": {
      "default": {
        "0": {
          "market": 0.47,
          "analyst": 0.37,
          "opskins": 0.28
        },
        "1": {
          "market": 0.5,
          "analyst": 0.38,
          "opskins": 0.32
        },
        "2": {
          "market": 0.52,
          "analyst": 0.38,
          "opskins": 0.34
        },
        "3": {
          "market": 1.01,
          "analyst": 0.75,
          "opskins": 0.72
        },
        "4": {
          "market": 2.05,
          "analyst": 1.63,
          "opskins": 1.35
        }
      },
      "stattrak": {
        "0": {
          "market": 1.41,
          "analyst": 1.06,
          "opskins": 0.95
        },
        "1": {
          "market": 1.51,
          "analyst": 1.18,
          "opskins": 1.02
        },
        "2": {
          "market": 1.83,
          "analyst": 1.42,
          "opskins": 1.13
        },
        "3": {
          "market": 4.28,
          "analyst": 3.48,
          "opskins": 2.98
        },
        "4": {
          "market": 8.63,
          "analyst": 8.41,
          "opskins": 7.99
        }
      },
      "souvenir": {}
    }
  },
  "357": {
    "item_id": 357,
    "type": "Five-SeveN",
    "skinName": "Retrobution",
    "prices": {
      "default": {
        "0": {
          "market": 0.48,
          "analyst": 0.37,
          "opskins": 0.38
        },
        "1": {
          "market": 0.51,
          "analyst": 0.43,
          "opskins": 0.35
        },
        "2": {
          "market": 0.51,
          "analyst": 0.38,
          "opskins": 0.41
        },
        "3": {
          "market": 1.12,
          "analyst": 0.85,
          "opskins": 0.68
        },
        "4": {
          "market": 3.03,
          "analyst": 2.1,
          "opskins": 1.68
        }
      },
      "stattrak": {
        "0": {
          "market": 1.42,
          "analyst": 1.21,
          "opskins": 1.06
        },
        "1": {
          "market": 1.89,
          "analyst": 1.41,
          "opskins": 1.14
        },
        "2": {
          "market": 2.39,
          "analyst": 1.86,
          "opskins": 1.49
        },
        "3": {
          "market": 6.02,
          "analyst": 5.26,
          "opskins": 4.6
        },
        "4": {
          "market": 16.46,
          "analyst": 14.23,
          "opskins": 13.02
        }
      },
      "souvenir": {}
    }
  },
  "358": {
    "item_id": 358,
    "type": "Negev",
    "skinName": "Power Loader",
    "prices": {
      "default": {
        "0": {
          "market": 0.46,
          "analyst": 0.41,
          "opskins": 0.42
        },
        "1": {
          "market": 0.53,
          "analyst": 0.4,
          "opskins": 0.41
        },
        "2": {
          "market": 0.53,
          "analyst": 0.4,
          "opskins": 0.32
        },
        "3": {
          "market": 1.09,
          "analyst": 0.78,
          "opskins": 0.63
        },
        "4": {
          "market": 2.36,
          "analyst": 1.72,
          "opskins": 1.43
        }
      },
      "stattrak": {
        "0": {
          "market": 1.42,
          "analyst": 1.08,
          "opskins": 1.05
        },
        "1": {
          "market": 1.45,
          "analyst": 1.04,
          "opskins": 1.02
        },
        "2": {
          "market": 1.77,
          "analyst": 1.41,
          "opskins": 1.17
        },
        "3": {
          "market": 4.02,
          "analyst": 3.77,
          "opskins": 3.11
        },
        "4": {
          "market": 9.36,
          "analyst": 8.35,
          "opskins": 7.74
        }
      },
      "souvenir": {}
    }
  },
  "359": {
    "item_id": 359,
    "type": "SG 553",
    "skinName": "Tiger Moth",
    "prices": {
      "default": {
        "0": {
          "market": 0.49,
          "analyst": 0.38,
          "opskins": 0.32
        },
        "1": {
          "market": 0.53,
          "analyst": 0.44,
          "opskins": 0.33
        },
        "2": {
          "market": 0.52,
          "analyst": 0.39,
          "opskins": 0.3
        },
        "3": {
          "market": 1.14,
          "analyst": 0.77,
          "opskins": 0.58
        },
        "4": {
          "market": 2.48,
          "analyst": 1.86,
          "opskins": 1.5
        }
      },
      "stattrak": {
        "0": {
          "market": 1.72,
          "analyst": 1.42,
          "opskins": 1.49
        },
        "1": {
          "market": 1.95,
          "analyst": 1.66,
          "opskins": 1.47
        },
        "2": {
          "market": 2.44,
          "analyst": 2.03,
          "opskins": 1.64
        },
        "3": {
          "market": 5.38,
          "analyst": 4.29,
          "opskins": 3.82
        },
        "4": {
          "market": 13.82,
          "analyst": 12.2,
          "opskins": 10.75
        }
      },
      "souvenir": {}
    }
  },
  "360": {
    "item_id": 360,
    "type": "Tec-9",
    "skinName": "Avalanche",
    "prices": {
      "default": {
        "0": {
          "market": 0.49,
          "analyst": 0.37,
          "opskins": 0.33
        },
        "1": {
          "market": 0.57,
          "analyst": 0.45,
          "opskins": 0.33
        },
        "2": {
          "market": 0.65,
          "analyst": 0.56,
          "opskins": 0.42
        },
        "3": {
          "market": 1.74,
          "analyst": 1.33,
          "opskins": 1.06
        },
        "4": {
          "market": 4.1,
          "analyst": 3.26,
          "opskins": 2.68
        }
      },
      "stattrak": {
        "0": {
          "market": 2.61,
          "analyst": 2.26,
          "opskins": 1.82
        },
        "1": {
          "market": 3.7,
          "analyst": 2.92,
          "opskins": 2.49
        },
        "2": {
          "market": 4.73,
          "analyst": 3.87,
          "opskins": 3.14
        },
        "3": {
          "market": 9.25,
          "analyst": 8.32,
          "opskins": 7.36
        },
        "4": {
          "market": 20.01,
          "analyst": 15.62,
          "opskins": 14.9
        }
      },
      "souvenir": {}
    }
  },
  "361": {
    "item_id": 361,
    "type": "XM1014",
    "skinName": "Teclu Burner",
    "prices": {
      "default": {
        "0": {
          "market": 0.52,
          "analyst": 0.39,
          "opskins": 0.34
        },
        "1": {
          "market": 0.63,
          "analyst": 0.54,
          "opskins": 0.42
        },
        "2": {
          "market": 0.53,
          "analyst": 0.4,
          "opskins": 0.33
        },
        "3": {
          "market": 0.93,
          "analyst": 0.74,
          "opskins": 0.58
        },
        "4": {
          "market": 1.65,
          "analyst": 1.19,
          "opskins": 1.12
        }
      },
      "stattrak": {
        "0": {
          "market": 1.84,
          "analyst": 1.32,
          "opskins": 1.46
        },
        "1": {
          "market": 2.74,
          "analyst": 2.44,
          "opskins": 2.19
        },
        "2": {
          "market": 1.86,
          "analyst": 1.36,
          "opskins": 1.19
        },
        "3": {
          "market": 4.18,
          "analyst": 3.46,
          "opskins": 3.24
        },
        "4": {
          "market": 6.61,
          "analyst": 5.53,
          "opskins": 5.45
        }
      },
      "souvenir": {}
    }
  },
  "362": {
    "item_id": 362,
    "type": "G3SG1",
    "skinName": "The Executioner",
    "prices": {
      "default": {
        "0": {
          "market": 1.1,
          "analyst": 0.97,
          "opskins": 0.88
        },
        "1": {
          "market": 1.13,
          "analyst": 0.98,
          "opskins": 0.82
        },
        "2": {
          "market": 1.13,
          "analyst": 1,
          "opskins": 0.81
        },
        "3": {
          "market": 10.97,
          "analyst": 11.82,
          "opskins": 11.12
        }
      },
      "stattrak": {
        "0": {
          "market": 3.23,
          "analyst": 3.17,
          "opskins": 2.99
        },
        "1": {
          "market": 3.54,
          "analyst": 3.2,
          "opskins": 3.15
        },
        "2": {
          "market": 4.18,
          "analyst": 3.63,
          "opskins": 3.23
        },
        "3": {
          "market": 350,
          "analyst": 124.25,
          "opskins": 130
        }
      },
      "souvenir": {}
    }
  },
  "363": {
    "item_id": 363,
    "type": "P90",
    "skinName": "Shapewood",
    "prices": {
      "default": {
        "0": {
          "market": 1.13,
          "analyst": 1.01,
          "opskins": 0.84
        },
        "1": {
          "market": 1.14,
          "analyst": 1.02,
          "opskins": 0.85
        },
        "2": {
          "market": 1.13,
          "analyst": 0.99,
          "opskins": 0.78
        },
        "3": {
          "market": 1.82,
          "analyst": 1.37,
          "opskins": 1.31
        },
        "4": {
          "market": 4.43,
          "analyst": 4.37,
          "opskins": 4.14
        }
      },
      "stattrak": {
        "0": {
          "market": 3.54,
          "analyst": 3.31,
          "opskins": 2.79
        },
        "1": {
          "market": 3.57,
          "analyst": 3.24,
          "opskins": 3.15
        },
        "2": {
          "market": 4.15,
          "analyst": 3.79,
          "opskins": 3.15
        },
        "3": {
          "market": 8.43,
          "analyst": 6.12,
          "opskins": 5.93
        },
        "4": {
          "market": 22.84,
          "analyst": 25.39,
          "opskins": 27.07
        }
      },
      "souvenir": {}
    }
  },
  "364": {
    "item_id": 364,
    "type": "M4A4",
    "skinName": "Royal Paladin",
    "prices": {
      "default": {
        "0": {
          "market": 4.73,
          "analyst": 3.91,
          "opskins": 3.79
        },
        "1": {
          "market": 8.63,
          "analyst": 7.58,
          "opskins": 6.84
        },
        "2": {
          "market": 5.9,
          "analyst": 4.82,
          "opskins": 4.25
        },
        "3": {
          "market": 16.07,
          "analyst": 12.03,
          "opskins": 11.06
        },
        "4": {
          "market": 49.09,
          "analyst": 38.62,
          "opskins": 35.73
        }
      },
      "stattrak": {
        "0": {
          "market": 20.88,
          "analyst": 19.88,
          "opskins": 18.2
        },
        "1": {
          "market": 32.66,
          "analyst": 34.48,
          "opskins": 35.11
        },
        "2": {
          "market": 28.66,
          "analyst": 24.95,
          "opskins": 22.66
        },
        "3": {
          "market": 76.9,
          "analyst": 65.77,
          "opskins": 54
        },
        "4": {
          "market": 198.66,
          "analyst": 271.18,
          "opskins": 233.32
        }
      },
      "souvenir": {}
    }
  },
  "365": {
    "item_id": 365,
    "type": "R8 Revolver",
    "skinName": "Fade",
    "prices": {
      "default": {
        "1": {
          "market": 4.12,
          "analyst": 3.55,
          "opskins": 5
        },
        "2": {
          "market": 2.3,
          "analyst": 1.75,
          "opskins": 1.75
        },
        "3": {
          "market": 3.2,
          "analyst": 2.56,
          "opskins": 2.4
        },
        "4": {
          "market": 6.82,
          "analyst": 7.72,
          "opskins": 7.97
        }
      },
      "stattrak": {
        "1": {
          "market": 26.49,
          "analyst": 38.83,
          "opskins": 37.78
        },
        "2": {
          "market": 9.36,
          "analyst": 7.47,
          "opskins": 8.55
        },
        "3": {
          "market": 15.14,
          "analyst": 14.22,
          "opskins": 14.36
        },
        "4": {
          "market": 31.98,
          "analyst": 28.53,
          "opskins": 24.84
        }
      },
      "souvenir": {}
    }
  },
  "366": {
    "item_id": 366,
    "type": "★ Huntsman Knife",
    "skinName": "Case Hardened",
    "prices": {
      "default": {
        "0": {
          "market": 72.25,
          "analyst": 62.62,
          "opskins": 55.44
        },
        "1": {
          "market": 75.11,
          "analyst": 66.16,
          "opskins": 53.97
        },
        "2": {
          "market": 78.45,
          "analyst": 68.72,
          "opskins": 59.7
        },
        "3": {
          "market": 92.16,
          "analyst": 75.82,
          "opskins": 64.99
        },
        "4": {
          "market": 86.85,
          "analyst": 131.24,
          "opskins": 119.69
        }
      },
      "stattrak": {
        "0": {
          "market": 100,
          "analyst": 97.13,
          "opskins": 96
        },
        "1": {
          "market": 122.9,
          "analyst": 123.3,
          "opskins": 99.9
        },
        "2": {
          "market": 103.33,
          "analyst": 126.31,
          "opskins": 103.98
        },
        "3": {
          "market": 148.5,
          "analyst": 157.28,
          "opskins": 165.99
        },
        "4": {
          "market": 250,
          "analyst": 500,
          "opskins": 500
        }
      },
      "souvenir": {}
    }
  },
  "367": {
    "item_id": 367,
    "type": "★ Karambit",
    "skinName": "Slaughter",
    "prices": {
      "default": {
        "2": {
          "market": 249.02,
          "analyst": 219.54,
          "opskins": 194.97
        },
        "3": {
          "market": 276.58,
          "analyst": 249.52,
          "opskins": 200
        },
        "4": {
          "market": 335.35,
          "analyst": 312.69,
          "opskins": 255.99
        }
      },
      "stattrak": {
        "2": {
          "market": 310.25,
          "analyst": 318.74,
          "opskins": 249
        },
        "3": {
          "market": 360.66,
          "analyst": 369.94,
          "opskins": 294.99
        },
        "4": {
          "market": 400.75,
          "analyst": 335,
          "opskins": 344.99
        }
      },
      "souvenir": {}
    }
  },
  "368": {
    "item_id": 368,
    "type": "★ M9 Bayonet",
    "skinName": "Crimson Web",
    "prices": {
      "default": {
        "0": {
          "market": 105.02,
          "analyst": 95.59,
          "opskins": 80.95
        },
        "1": {
          "market": 126.44,
          "analyst": 105.3,
          "opskins": 89.94
        },
        "2": {
          "market": 143.4,
          "analyst": 115.18,
          "opskins": 100.95
        },
        "3": {
          "market": 417,
          "analyst": 336,
          "opskins": 329.99
        },
        "4": {
          "market": 3407.7,
          "analyst": 3660,
          "opskins": 2921.31
        }
      },
      "stattrak": {
        "0": {
          "market": 152.29,
          "analyst": 138.25,
          "opskins": 138
        },
        "1": {
          "market": 164.89,
          "analyst": 184.07,
          "opskins": 150.43
        },
        "2": {
          "market": 187.63,
          "analyst": 179.91,
          "opskins": 143.99
        },
        "3": {
          "market": 586,
          "analyst": 486,
          "opskins": 498.48
        },
        "4": {
          "market": 4062.5,
          "analyst": 5023,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "369": {
    "item_id": 369,
    "type": "Galil AR",
    "skinName": "Sandstorm",
    "prices": {
      "default": {
        "0": {
          "market": 0.17,
          "analyst": 0.15,
          "opskins": 0.13
        },
        "1": {
          "market": 0.27,
          "analyst": 0.25,
          "opskins": 0.23
        },
        "2": {
          "market": 0.12,
          "analyst": 0.09,
          "opskins": 0.09
        },
        "3": {
          "market": 0.38,
          "analyst": 0.27,
          "opskins": 0.27
        }
      },
      "stattrak": {
        "0": {
          "market": 0.35,
          "analyst": 0.25,
          "opskins": 0.23
        },
        "1": {
          "market": 0.6,
          "analyst": 0.42,
          "opskins": 0.34
        },
        "2": {
          "market": 0.32,
          "analyst": 0.25,
          "opskins": 0.2
        },
        "3": {
          "market": 0.82,
          "analyst": 0.68,
          "opskins": 0.55
        }
      },
      "souvenir": {}
    }
  },
  "370": {
    "item_id": 370,
    "type": "Five-SeveN",
    "skinName": "Kami",
    "prices": {
      "default": {
        "2": {
          "market": 0.27,
          "analyst": 0.23,
          "opskins": 0.22
        },
        "3": {
          "market": 0.29,
          "analyst": 0.24,
          "opskins": 0.23
        },
        "4": {
          "market": 0.4,
          "analyst": 0.32,
          "opskins": 0.27
        }
      },
      "stattrak": {
        "2": {
          "market": 0.86,
          "analyst": 0.74,
          "opskins": 0.61
        },
        "3": {
          "market": 0.93,
          "analyst": 0.75,
          "opskins": 0.57
        },
        "4": {
          "market": 1.35,
          "analyst": 1.05,
          "opskins": 0.81
        }
      },
      "souvenir": {}
    }
  },
  "371": {
    "item_id": 371,
    "type": "M249",
    "skinName": "Magma",
    "prices": {
      "default": {
        "0": {
          "market": 0.12,
          "analyst": 0.11,
          "opskins": 0.49
        },
        "1": {
          "market": 0.19,
          "analyst": 0.24,
          "opskins": 0.36
        },
        "2": {
          "market": 0.11,
          "analyst": 0.09,
          "opskins": 0.09
        },
        "3": {
          "market": 0.14,
          "analyst": 0.11,
          "opskins": 0.11
        },
        "4": {
          "market": 0.28,
          "analyst": 0.24,
          "opskins": 0.24
        }
      },
      "stattrak": {
        "0": {
          "market": 0.3,
          "analyst": 0.22,
          "opskins": 0.25
        },
        "1": {
          "market": 0.31,
          "analyst": 0.27,
          "opskins": 0.22
        },
        "2": {
          "market": 0.28,
          "analyst": 0.22,
          "opskins": 0.2
        },
        "3": {
          "market": 0.46,
          "analyst": 0.4,
          "opskins": 0.33
        },
        "4": {
          "market": 1.07,
          "analyst": 0.75,
          "opskins": 0.77
        }
      },
      "souvenir": {}
    }
  },
  "372": {
    "item_id": 372,
    "type": "PP-Bizon",
    "skinName": "Cobalt Halftone",
    "prices": {
      "default": {
        "1": {
          "market": 0.13,
          "analyst": 0.17,
          "opskins": 0.14
        },
        "2": {
          "market": 0.1,
          "analyst": 0.08,
          "opskins": 0.15
        },
        "3": {
          "market": 0.14,
          "analyst": 0.11,
          "opskins": 0.09
        },
        "4": {
          "market": 0.52,
          "analyst": 0.4,
          "opskins": 0.45
        }
      },
      "stattrak": {
        "1": {
          "market": 0.33,
          "analyst": 0.25,
          "opskins": 0.22
        },
        "2": {
          "market": 0.29,
          "analyst": 0.23,
          "opskins": 0.19
        },
        "3": {
          "market": 0.46,
          "analyst": 0.39,
          "opskins": 0.31
        },
        "4": {
          "market": 2.12,
          "analyst": 1.57,
          "opskins": 1.39
        }
      },
      "souvenir": {}
    }
  },
  "373": {
    "item_id": 373,
    "type": "FAMAS",
    "skinName": "Pulse",
    "prices": {
      "default": {
        "1": {
          "market": 1.37,
          "analyst": 1.61,
          "opskins": 1.44
        },
        "2": {
          "market": 1,
          "analyst": 0.89,
          "opskins": 0.76
        },
        "3": {
          "market": 1.14,
          "analyst": 0.93,
          "opskins": 0.85
        },
        "4": {
          "market": 1.56,
          "analyst": 1.31,
          "opskins": 1.05
        }
      },
      "stattrak": {
        "1": {
          "market": 3.02,
          "analyst": 3.1,
          "opskins": 3.6
        },
        "2": {
          "market": 2.6,
          "analyst": 2.04,
          "opskins": 1.72
        },
        "3": {
          "market": 3.49,
          "analyst": 2.67,
          "opskins": 2.3
        },
        "4": {
          "market": 5.49,
          "analyst": 4.2,
          "opskins": 3.62
        }
      },
      "souvenir": {}
    }
  },
  "374": {
    "item_id": 374,
    "type": "Dual Berettas",
    "skinName": "Marina",
    "prices": {
      "default": {
        "0": {
          "market": 1.16,
          "analyst": 1.37,
          "opskins": 1.36
        },
        "1": {
          "market": 1.27,
          "analyst": 0.88,
          "opskins": 0.9
        },
        "2": {
          "market": 0.85,
          "analyst": 0.74,
          "opskins": 0.65
        },
        "3": {
          "market": 1.01,
          "analyst": 0.83,
          "opskins": 0.68
        },
        "4": {
          "market": 3.22,
          "analyst": 3.15,
          "opskins": 2.65
        }
      },
      "stattrak": {
        "0": {
          "market": 2.14,
          "analyst": 2.24,
          "opskins": 2.14
        },
        "1": {
          "market": 2.35,
          "analyst": 2.12,
          "opskins": 1.89
        },
        "2": {
          "market": 2.15,
          "analyst": 1.75,
          "opskins": 1.66
        },
        "3": {
          "market": 3.03,
          "analyst": 2.71,
          "opskins": 2.31
        },
        "4": {
          "market": 18.64,
          "analyst": 25.86,
          "opskins": 23.49
        }
      },
      "souvenir": {}
    }
  },
  "375": {
    "item_id": 375,
    "type": "MP9",
    "skinName": "Rose Iron",
    "prices": {
      "default": {
        "2": {
          "market": 1.26,
          "analyst": 1.03,
          "opskins": 0.99
        },
        "3": {
          "market": 1.4,
          "analyst": 1.14,
          "opskins": 0.98
        },
        "4": {
          "market": 1.76,
          "analyst": 1.37,
          "opskins": 1.12
        }
      },
      "stattrak": {
        "2": {
          "market": 2.68,
          "analyst": 2.3,
          "opskins": 2.08
        },
        "3": {
          "market": 3.59,
          "analyst": 3,
          "opskins": 2.51
        },
        "4": {
          "market": 5.34,
          "analyst": 4.7,
          "opskins": 4.33
        }
      },
      "souvenir": {}
    }
  },
  "376": {
    "item_id": 376,
    "type": "Nova",
    "skinName": "Rising Skull",
    "prices": {
      "default": {
        "0": {
          "market": 0.97,
          "analyst": 1.89,
          "opskins": 1.53
        },
        "1": {
          "market": 0.92,
          "analyst": 0.92,
          "opskins": 0.79
        },
        "2": {
          "market": 0.86,
          "analyst": 0.77,
          "opskins": 0.67
        },
        "3": {
          "market": 1,
          "analyst": 0.86,
          "opskins": 0.71
        },
        "4": {
          "market": 1.3,
          "analyst": 1.15,
          "opskins": 0.91
        }
      },
      "stattrak": {
        "0": {
          "market": 1.84,
          "analyst": 2.25,
          "opskins": 1.7
        },
        "1": {
          "market": 2.45,
          "analyst": 2.68,
          "opskins": 2.21
        },
        "2": {
          "market": 2.09,
          "analyst": 1.59,
          "opskins": 1.48
        },
        "3": {
          "market": 2.93,
          "analyst": 2.65,
          "opskins": 2.43
        },
        "4": {
          "market": 4.88,
          "analyst": 3.87,
          "opskins": 3.61
        }
      },
      "souvenir": {}
    }
  },
  "377": {
    "item_id": 377,
    "type": "M4A1-S",
    "skinName": "Guardian",
    "prices": {
      "default": {
        "0": {
          "market": 4.61,
          "analyst": 4.2,
          "opskins": 3.99
        },
        "1": {
          "market": 5.07,
          "analyst": 4.45,
          "opskins": 3.9
        },
        "2": {
          "market": 4.79,
          "analyst": 4.08,
          "opskins": 3.33
        },
        "3": {
          "market": 5.42,
          "analyst": 4.49,
          "opskins": 3.86
        },
        "4": {
          "market": 6.85,
          "analyst": 5.6,
          "opskins": 5.02
        }
      },
      "stattrak": {
        "0": {
          "market": 14.23,
          "analyst": 15.05,
          "opskins": 12.94
        },
        "1": {
          "market": 14.73,
          "analyst": 14.29,
          "opskins": 13.76
        },
        "2": {
          "market": 15.68,
          "analyst": 12.84,
          "opskins": 11.1
        },
        "3": {
          "market": 21.31,
          "analyst": 18.08,
          "opskins": 15.88
        },
        "4": {
          "market": 31.64,
          "analyst": 28.52,
          "opskins": 25.49
        }
      },
      "souvenir": {}
    }
  },
  "378": {
    "item_id": 378,
    "type": "P250",
    "skinName": "Mehndi",
    "prices": {
      "default": {
        "0": {
          "market": 3.03,
          "analyst": 2.54,
          "opskins": 2.55
        },
        "1": {
          "market": 3.27,
          "analyst": 2.68,
          "opskins": 2.36
        },
        "2": {
          "market": 3.56,
          "analyst": 2.87,
          "opskins": 2.35
        },
        "3": {
          "market": 4.11,
          "analyst": 3.3,
          "opskins": 2.86
        },
        "4": {
          "market": 7.61,
          "analyst": 6.81,
          "opskins": 5.8
        }
      },
      "stattrak": {
        "0": {
          "market": 7.94,
          "analyst": 6.11,
          "opskins": 5.42
        },
        "1": {
          "market": 8.61,
          "analyst": 7.62,
          "opskins": 6.78
        },
        "2": {
          "market": 11.54,
          "analyst": 10.67,
          "opskins": 8.87
        },
        "3": {
          "market": 16.02,
          "analyst": 17.15,
          "opskins": 15.24
        },
        "4": {
          "market": 41.26,
          "analyst": 40.82,
          "opskins": 35.8
        }
      },
      "souvenir": {}
    }
  },
  "379": {
    "item_id": 379,
    "type": "Sawed-Off",
    "skinName": "The Kraken",
    "prices": {
      "default": {
        "1": {
          "market": 3.31,
          "analyst": 3.48,
          "opskins": 3.95
        },
        "2": {
          "market": 2.45,
          "analyst": 2.08,
          "opskins": 2.02
        },
        "3": {
          "market": 3.01,
          "analyst": 2.54,
          "opskins": 2.33
        },
        "4": {
          "market": 4.3,
          "analyst": 3.95,
          "opskins": 3.49
        }
      },
      "stattrak": {
        "1": {
          "market": 11.98,
          "analyst": 16.67,
          "opskins": 35
        },
        "2": {
          "market": 8.12,
          "analyst": 6.92,
          "opskins": 7.62
        },
        "3": {
          "market": 13.84,
          "analyst": 13.86,
          "opskins": 12.44
        },
        "4": {
          "market": 25.88,
          "analyst": 26.33,
          "opskins": 23.98
        }
      },
      "souvenir": {}
    }
  },
  "380": {
    "item_id": 380,
    "type": "★ Gut Knife",
    "skinName": "Tiger Tooth",
    "prices": {
      "default": {
        "3": {
          "market": 84.09,
          "analyst": 79.01,
          "opskins": 65.99
        },
        "4": {
          "market": 83.4,
          "analyst": 65.33,
          "opskins": 56.95
        }
      },
      "stattrak": {
        "3": {
          "market": 109.9,
          "analyst": 108.44,
          "opskins": 500
        },
        "4": {
          "market": 118.29,
          "analyst": 90.69,
          "opskins": 79.07
        }
      },
      "souvenir": {}
    }
  },
  "381": {
    "item_id": 381,
    "type": "★ Flip Knife",
    "skinName": "Fade",
    "prices": {
      "default": {
        "3": {
          "market": 150.28,
          "analyst": 171.29,
          "opskins": 149.79
        },
        "4": {
          "market": 148.47,
          "analyst": 116.06,
          "opskins": 97
        }
      },
      "stattrak": {
        "3": {
          "market": 188.74,
          "analyst": -1,
          "opskins": 219.99
        },
        "4": {
          "market": 183.44,
          "analyst": 152.91,
          "opskins": 144.89
        }
      },
      "souvenir": {}
    }
  },
  "382": {
    "item_id": 382,
    "type": "★ Huntsman Knife",
    "skinName": "Night",
    "prices": {
      "default": {
        "0": {
          "market": 50.65,
          "analyst": 50,
          "opskins": 42.84
        },
        "1": {
          "market": 51.33,
          "analyst": 58.42,
          "opskins": 59
        },
        "2": {
          "market": 52.33,
          "analyst": 51.75,
          "opskins": 46.37
        },
        "3": {
          "market": 111.71,
          "analyst": 83.71,
          "opskins": 69.98
        },
        "4": {
          "market": 486,
          "analyst": 424,
          "opskins": 499.99
        }
      },
      "stattrak": {
        "0": {
          "market": 73.29,
          "analyst": 70.6,
          "opskins": 99.99
        },
        "1": {
          "market": 88.86,
          "analyst": 87.48,
          "opskins": 95.99
        },
        "2": {
          "market": 89,
          "analyst": 79.41,
          "opskins": 73.3
        },
        "3": {
          "market": 174.15,
          "analyst": 172.47,
          "opskins": 148.99
        },
        "4": {
          "market": 2165,
          "analyst": 2007,
          "opskins": 1889
        }
      },
      "souvenir": {}
    }
  },
  "383": {
    "item_id": 383,
    "type": "Galil AR",
    "skinName": "Rocket Pop",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "1": {
          "market": 0.1,
          "analyst": 0.08,
          "opskins": 0.07
        },
        "2": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "3": {
          "market": 0.2,
          "analyst": 0.14,
          "opskins": 0.11
        },
        "4": {
          "market": 0.86,
          "analyst": 0.6,
          "opskins": 0.51
        }
      },
      "stattrak": {
        "0": {
          "market": 0.28,
          "analyst": 0.23,
          "opskins": 0.18
        },
        "1": {
          "market": 0.29,
          "analyst": 0.23,
          "opskins": 0.19
        },
        "2": {
          "market": 0.32,
          "analyst": 0.25,
          "opskins": 0.21
        },
        "3": {
          "market": 0.65,
          "analyst": 0.56,
          "opskins": 0.42
        },
        "4": {
          "market": 3.47,
          "analyst": 2.94,
          "opskins": 2.54
        }
      },
      "souvenir": {}
    }
  },
  "384": {
    "item_id": 384,
    "type": "Glock-18",
    "skinName": "Bunsen Burner",
    "prices": {
      "default": {
        "0": {
          "market": 0.17,
          "analyst": 0.12,
          "opskins": 0.11
        },
        "1": {
          "market": 0.3,
          "analyst": 0.23,
          "opskins": 0.2
        },
        "2": {
          "market": 0.16,
          "analyst": 0.12,
          "opskins": 0.14
        },
        "3": {
          "market": 0.22,
          "analyst": 0.17,
          "opskins": 0.14
        },
        "4": {
          "market": 0.53,
          "analyst": 0.41,
          "opskins": 0.35
        }
      },
      "stattrak": {
        "0": {
          "market": 0.74,
          "analyst": 0.63,
          "opskins": 0.5
        },
        "1": {
          "market": 1.23,
          "analyst": 1.2,
          "opskins": 1.21
        },
        "2": {
          "market": 0.71,
          "analyst": 0.6,
          "opskins": 0.54
        },
        "3": {
          "market": 1.16,
          "analyst": 0.86,
          "opskins": 0.8
        },
        "4": {
          "market": 2.96,
          "analyst": 2.45,
          "opskins": 2.27
        }
      },
      "souvenir": {}
    }
  },
  "385": {
    "item_id": 385,
    "type": "Nova",
    "skinName": "Ranger",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.12
        },
        "1": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.09
        },
        "2": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.09
        },
        "3": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "4": {
          "market": 0.19,
          "analyst": 0.16,
          "opskins": 0.14
        }
      },
      "stattrak": {
        "0": {
          "market": 0.23,
          "analyst": 0.19,
          "opskins": 0.16
        },
        "1": {
          "market": 0.23,
          "analyst": 0.19,
          "opskins": 0.16
        },
        "2": {
          "market": 0.24,
          "analyst": 0.19,
          "opskins": 0.16
        },
        "3": {
          "market": 0.35,
          "analyst": 0.26,
          "opskins": 0.21
        },
        "4": {
          "market": 0.99,
          "analyst": 0.76,
          "opskins": 0.63
        }
      },
      "souvenir": {}
    }
  },
  "386": {
    "item_id": 386,
    "type": "P90",
    "skinName": "Elite Build",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.11
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "2": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "3": {
          "market": 0.18,
          "analyst": 0.14,
          "opskins": 0.11
        },
        "4": {
          "market": 0.64,
          "analyst": 0.48,
          "opskins": 0.44
        }
      },
      "stattrak": {
        "0": {
          "market": 0.43,
          "analyst": 0.38,
          "opskins": 0.32
        },
        "1": {
          "market": 0.43,
          "analyst": 0.4,
          "opskins": 0.33
        },
        "2": {
          "market": 0.5,
          "analyst": 0.46,
          "opskins": 0.36
        },
        "3": {
          "market": 0.92,
          "analyst": 0.77,
          "opskins": 0.61
        },
        "4": {
          "market": 4.11,
          "analyst": 3.5,
          "opskins": 2.95
        }
      },
      "souvenir": {}
    }
  },
  "387": {
    "item_id": 387,
    "type": "UMP-45",
    "skinName": "Riot",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "1": {
          "market": 0.15,
          "analyst": 0.09,
          "opskins": 0.12
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "3": {
          "market": 0.13,
          "analyst": 0.08,
          "opskins": 0.06
        },
        "4": {
          "market": 0.26,
          "analyst": 0.18,
          "opskins": 0.16
        }
      },
      "stattrak": {
        "0": {
          "market": 0.28,
          "analyst": 0.21,
          "opskins": 0.18
        },
        "1": {
          "market": 0.6,
          "analyst": 0.38,
          "opskins": 0.33
        },
        "2": {
          "market": 0.3,
          "analyst": 0.22,
          "opskins": 0.19
        },
        "3": {
          "market": 0.6,
          "analyst": 0.43,
          "opskins": 0.36
        },
        "4": {
          "market": 1.75,
          "analyst": 1.31,
          "opskins": 1.09
        }
      },
      "souvenir": {}
    }
  },
  "388": {
    "item_id": 388,
    "type": "USP-S",
    "skinName": "Torque",
    "prices": {
      "default": {
        "0": {
          "market": 0.54,
          "analyst": 0.41,
          "opskins": 0.46
        },
        "1": {
          "market": 0.57,
          "analyst": 0.24,
          "opskins": 0.34
        },
        "2": {
          "market": 0.43,
          "analyst": 0.17,
          "opskins": 0.4
        },
        "3": {
          "market": 0.61,
          "analyst": 0.29,
          "opskins": 0.39
        },
        "4": {
          "market": 0.85,
          "analyst": 0.47,
          "opskins": 0.52
        }
      },
      "stattrak": {
        "0": {
          "market": 1.99,
          "analyst": 1.52,
          "opskins": 2.99
        },
        "1": {
          "market": 1.87,
          "analyst": 1.39,
          "opskins": 1.39
        },
        "2": {
          "market": 1.6,
          "analyst": 1.18,
          "opskins": 1.1
        },
        "3": {
          "market": 2.31,
          "analyst": 1.85,
          "opskins": 1.5
        },
        "4": {
          "market": 3.39,
          "analyst": 2.58,
          "opskins": 2.35
        }
      },
      "souvenir": {}
    }
  },
  "389": {
    "item_id": 389,
    "type": "FAMAS",
    "skinName": "Neural Net",
    "prices": {
      "default": {
        "0": {
          "market": 0.27,
          "analyst": 0.21,
          "opskins": 0.2
        },
        "1": {
          "market": 0.3,
          "analyst": 0.25,
          "opskins": 0.2
        },
        "2": {
          "market": 0.25,
          "analyst": 0.21,
          "opskins": 0.19
        },
        "3": {
          "market": 0.34,
          "analyst": 0.28,
          "opskins": 0.21
        },
        "4": {
          "market": 0.59,
          "analyst": 0.43,
          "opskins": 0.43
        }
      },
      "stattrak": {
        "0": {
          "market": 0.75,
          "analyst": 0.64,
          "opskins": 0.62
        },
        "1": {
          "market": 0.96,
          "analyst": 0.87,
          "opskins": 0.7
        },
        "2": {
          "market": 0.74,
          "analyst": 0.64,
          "opskins": 0.54
        },
        "3": {
          "market": 1.34,
          "analyst": 1.2,
          "opskins": 0.95
        },
        "4": {
          "market": 2.47,
          "analyst": 2.21,
          "opskins": 1.86
        }
      },
      "souvenir": {}
    }
  },
  "390": {
    "item_id": 390,
    "type": "M4A4",
    "skinName": "Evil Daimyo",
    "prices": {
      "default": {
        "0": {
          "market": 1.11,
          "analyst": 0.77,
          "opskins": 0.78
        },
        "1": {
          "market": 1.44,
          "analyst": 1.04,
          "opskins": 0.94
        },
        "2": {
          "market": 1.18,
          "analyst": 0.84,
          "opskins": 0.73
        },
        "3": {
          "market": 1.72,
          "analyst": 1.24,
          "opskins": 1.06
        },
        "4": {
          "market": 2.65,
          "analyst": 1.98,
          "opskins": 1.66
        }
      },
      "stattrak": {
        "0": {
          "market": 4.65,
          "analyst": 3.61,
          "opskins": 3.22
        },
        "1": {
          "market": 4.99,
          "analyst": 4.11,
          "opskins": 3.47
        },
        "2": {
          "market": 4.93,
          "analyst": 3.67,
          "opskins": 3.05
        },
        "3": {
          "market": 7.14,
          "analyst": 5.55,
          "opskins": 4.73
        },
        "4": {
          "market": 11.36,
          "analyst": 8.82,
          "opskins": 8.1
        }
      },
      "souvenir": {}
    }
  },
  "391": {
    "item_id": 391,
    "type": "MP9",
    "skinName": "Ruby Poison Dart",
    "prices": {
      "default": {
        "0": {
          "market": 0.29,
          "analyst": 0.28,
          "opskins": 0.24
        },
        "1": {
          "market": 0.29,
          "analyst": 0.28,
          "opskins": 0.24
        },
        "2": {
          "market": 0.25,
          "analyst": 0.21,
          "opskins": 0.17
        },
        "3": {
          "market": 0.34,
          "analyst": 0.26,
          "opskins": 0.22
        },
        "4": {
          "market": 0.58,
          "analyst": 0.43,
          "opskins": 0.36
        }
      },
      "stattrak": {
        "0": {
          "market": 0.86,
          "analyst": 0.83,
          "opskins": 1.2
        },
        "1": {
          "market": 1.04,
          "analyst": 0.82,
          "opskins": 0.82
        },
        "2": {
          "market": 0.78,
          "analyst": 0.68,
          "opskins": 0.53
        },
        "3": {
          "market": 1.43,
          "analyst": 1.25,
          "opskins": 1.01
        },
        "4": {
          "market": 2.65,
          "analyst": 2.28,
          "opskins": 1.85
        }
      },
      "souvenir": {}
    }
  },
  "392": {
    "item_id": 392,
    "type": "Negev",
    "skinName": "Loudmouth",
    "prices": {
      "default": {
        "0": {
          "market": 0.25,
          "analyst": 0.21,
          "opskins": 0.18
        },
        "1": {
          "market": 0.31,
          "analyst": 0.24,
          "opskins": 0.21
        },
        "2": {
          "market": 0.24,
          "analyst": 0.2,
          "opskins": 0.17
        },
        "3": {
          "market": 1.69,
          "analyst": 1.34,
          "opskins": 1.18
        }
      },
      "stattrak": {
        "0": {
          "market": 0.64,
          "analyst": 0.52,
          "opskins": 0.54
        },
        "1": {
          "market": 0.75,
          "analyst": 0.8,
          "opskins": 0.68
        },
        "2": {
          "market": 0.69,
          "analyst": 0.55,
          "opskins": 0.43
        },
        "3": {
          "market": 5.73,
          "analyst": 6.85,
          "opskins": 10.99
        }
      },
      "souvenir": {}
    }
  },
  "393": {
    "item_id": 393,
    "type": "P2000",
    "skinName": "Handgun",
    "prices": {
      "default": {
        "0": {
          "market": 0.25,
          "analyst": 0.21,
          "opskins": 0.4
        },
        "1": {
          "market": 0.26,
          "analyst": 0.21,
          "opskins": 0.19
        },
        "2": {
          "market": 0.25,
          "analyst": 0.21,
          "opskins": 0.19
        },
        "3": {
          "market": 0.33,
          "analyst": 0.27,
          "opskins": 0.24
        },
        "4": {
          "market": 1.16,
          "analyst": 1.06,
          "opskins": 0.87
        }
      },
      "stattrak": {
        "0": {
          "market": 0.73,
          "analyst": 0.62,
          "opskins": 0.54
        },
        "1": {
          "market": 0.78,
          "analyst": 0.63,
          "opskins": 0.51
        },
        "2": {
          "market": 0.9,
          "analyst": 0.74,
          "opskins": 0.59
        },
        "3": {
          "market": 1.77,
          "analyst": 1.75,
          "opskins": 1.38
        },
        "4": {
          "market": 8.4,
          "analyst": 6.59,
          "opskins": 6.03
        }
      },
      "souvenir": {}
    }
  },
  "394": {
    "item_id": 394,
    "type": "CZ75-Auto",
    "skinName": "Yellow Jacket",
    "prices": {
      "default": {
        "0": {
          "market": 1.81,
          "analyst": 1.33,
          "opskins": 1.44
        },
        "1": {
          "market": 1.81,
          "analyst": 1.41,
          "opskins": 1.46
        },
        "2": {
          "market": 1.91,
          "analyst": 1.46,
          "opskins": 1.43
        },
        "3": {
          "market": 2.83,
          "analyst": 2.24,
          "opskins": 1.92
        },
        "4": {
          "market": 4.49,
          "analyst": 4.15,
          "opskins": 3.55
        }
      },
      "stattrak": {
        "0": {
          "market": 4.34,
          "analyst": 3.97,
          "opskins": 7.56
        },
        "1": {
          "market": 4.55,
          "analyst": 3.53,
          "opskins": 3.99
        },
        "2": {
          "market": 5.26,
          "analyst": 4.94,
          "opskins": 4.3
        },
        "3": {
          "market": 9.24,
          "analyst": 7.48,
          "opskins": 6.74
        },
        "4": {
          "market": 19.76,
          "analyst": 19.38,
          "opskins": 16.86
        }
      },
      "souvenir": {}
    }
  },
  "395": {
    "item_id": 395,
    "type": "MP7",
    "skinName": "Nemesis",
    "prices": {
      "default": {
        "2": {
          "market": 2.45,
          "analyst": 2.01,
          "opskins": 1.69
        },
        "3": {
          "market": 2.92,
          "analyst": 2.27,
          "opskins": 1.82
        },
        "4": {
          "market": 4.04,
          "analyst": 3.47,
          "opskins": 2.81
        }
      },
      "stattrak": {
        "2": {
          "market": 7.03,
          "analyst": 6.28,
          "opskins": 5.73
        },
        "3": {
          "market": 9.66,
          "analyst": 8.61,
          "opskins": 7.31
        },
        "4": {
          "market": 16.29,
          "analyst": 17.73,
          "opskins": 15.44
        }
      },
      "souvenir": {}
    }
  },
  "396": {
    "item_id": 396,
    "type": "SG 553",
    "skinName": "Cyrex",
    "prices": {
      "default": {
        "0": {
          "market": 1.79,
          "analyst": 1.41,
          "opskins": 1.3
        },
        "1": {
          "market": 1.85,
          "analyst": 1.45,
          "opskins": 1.25
        },
        "2": {
          "market": 1.96,
          "analyst": 1.53,
          "opskins": 1.21
        },
        "3": {
          "market": 3.02,
          "analyst": 2.28,
          "opskins": 1.99
        },
        "4": {
          "market": 6.42,
          "analyst": 5.03,
          "opskins": 4.2
        }
      },
      "stattrak": {
        "0": {
          "market": 4.66,
          "analyst": 4.02,
          "opskins": 3.88
        },
        "1": {
          "market": 4.84,
          "analyst": 4.57,
          "opskins": 3.83
        },
        "2": {
          "market": 6.05,
          "analyst": 5.11,
          "opskins": 4.46
        },
        "3": {
          "market": 10.98,
          "analyst": 9.31,
          "opskins": 8.74
        },
        "4": {
          "market": 30.34,
          "analyst": 25.79,
          "opskins": 23.92
        }
      },
      "souvenir": {}
    }
  },
  "397": {
    "item_id": 397,
    "type": "★ Falchion Knife",
    "skinName": "Night",
    "prices": {
      "default": {
        "0": {
          "market": 42.16,
          "analyst": 33.02,
          "opskins": 29.63
        },
        "1": {
          "market": 50.3,
          "analyst": 39.2,
          "opskins": 32.54
        },
        "2": {
          "market": 51.9,
          "analyst": 38.4,
          "opskins": 33
        },
        "3": {
          "market": 71.45,
          "analyst": 53.78,
          "opskins": 45.75
        },
        "4": {
          "market": 310.95,
          "analyst": 362.52,
          "opskins": 289.99
        }
      },
      "stattrak": {
        "0": {
          "market": 54.65,
          "analyst": 50.73,
          "opskins": 39.99
        },
        "1": {
          "market": 56.87,
          "analyst": 55.29,
          "opskins": 69.98
        },
        "2": {
          "market": 65.54,
          "analyst": 53.66,
          "opskins": 49.31
        },
        "3": {
          "market": 116.55,
          "analyst": 109.91,
          "opskins": 97.74
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": 2700
        }
      },
      "souvenir": {}
    }
  },
  "398": {
    "item_id": 398,
    "type": "★ Falchion Knife",
    "skinName": "Stained",
    "prices": {
      "default": {
        "0": {
          "market": 42.82,
          "analyst": 31.84,
          "opskins": 28.07
        },
        "1": {
          "market": 43.61,
          "analyst": 32.15,
          "opskins": 27.98
        },
        "2": {
          "market": 44.48,
          "analyst": 32.98,
          "opskins": 28.86
        },
        "3": {
          "market": 47.64,
          "analyst": 34.89,
          "opskins": 31.48
        },
        "4": {
          "market": 60.36,
          "analyst": 58.91,
          "opskins": 53.89
        }
      },
      "stattrak": {
        "0": {
          "market": 46.65,
          "analyst": 50.34,
          "opskins": 42.5
        },
        "1": {
          "market": 52.64,
          "analyst": 49.05,
          "opskins": 50
        },
        "2": {
          "market": 56.29,
          "analyst": 50.38,
          "opskins": 42.9
        },
        "3": {
          "market": 51.81,
          "analyst": 49.48,
          "opskins": 43.5
        },
        "4": {
          "market": 160.16,
          "analyst": -1,
          "opskins": 110
        }
      },
      "souvenir": {}
    }
  },
  "399": {
    "item_id": 399,
    "type": "★ Falchion Knife",
    "skinName": "Urban Masked",
    "prices": {
      "default": {
        "0": {
          "market": 39.76,
          "analyst": 30.1,
          "opskins": 27.68
        },
        "1": {
          "market": 40.97,
          "analyst": 30.74,
          "opskins": 27.94
        },
        "2": {
          "market": 41.47,
          "analyst": 30.59,
          "opskins": 27.8
        },
        "3": {
          "market": 47.42,
          "analyst": 35.17,
          "opskins": 30.73
        },
        "4": {
          "market": 77.41,
          "analyst": 80.34,
          "opskins": 70.69
        }
      },
      "stattrak": {
        "0": {
          "market": 36.1,
          "analyst": 38.56,
          "opskins": 39.95
        },
        "1": {
          "market": 48.15,
          "analyst": 40.74,
          "opskins": 63.99
        },
        "2": {
          "market": 45.55,
          "analyst": 70.64,
          "opskins": 64
        },
        "3": {
          "market": 54,
          "analyst": 61.48,
          "opskins": 47.96
        },
        "4": {
          "market": 221.66,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "400": {
    "item_id": 400,
    "type": "G3SG1",
    "skinName": "Murky",
    "prices": {
      "default": {
        "2": {
          "market": 0.18,
          "analyst": 0.15,
          "opskins": 0.35
        },
        "3": {
          "market": 0.18,
          "analyst": 0.16,
          "opskins": 0.22
        },
        "4": {
          "market": 0.26,
          "analyst": 0.2,
          "opskins": 0.39
        }
      },
      "stattrak": {
        "2": {
          "market": 0.49,
          "analyst": 0.42,
          "opskins": 0.39
        },
        "3": {
          "market": 0.61,
          "analyst": 0.49,
          "opskins": 0.4
        },
        "4": {
          "market": 1.06,
          "analyst": 0.86,
          "opskins": 0.84
        }
      },
      "souvenir": {}
    }
  },
  "401": {
    "item_id": 401,
    "type": "MAG-7",
    "skinName": "Firestarter",
    "prices": {
      "default": {
        "0": {
          "market": 0.23,
          "analyst": 0.19,
          "opskins": 0.21
        },
        "1": {
          "market": 0.21,
          "analyst": 0.16,
          "opskins": 0.14
        },
        "2": {
          "market": 0.15,
          "analyst": 0.12,
          "opskins": 0.13
        },
        "3": {
          "market": 0.2,
          "analyst": 0.15,
          "opskins": 0.15
        },
        "4": {
          "market": 1.14,
          "analyst": 0.85,
          "opskins": 0.79
        }
      },
      "stattrak": {
        "0": {
          "market": 0.6,
          "analyst": 0.47,
          "opskins": 0.54
        },
        "1": {
          "market": 0.59,
          "analyst": 0.45,
          "opskins": 0.49
        },
        "2": {
          "market": 0.49,
          "analyst": 0.41,
          "opskins": 0.5
        },
        "3": {
          "market": 0.63,
          "analyst": 0.49,
          "opskins": 0.48
        },
        "4": {
          "market": 6.01,
          "analyst": 6.29,
          "opskins": 5.66
        }
      },
      "souvenir": {}
    }
  },
  "402": {
    "item_id": 402,
    "type": "MP9",
    "skinName": "Dart",
    "prices": {
      "default": {
        "0": {
          "market": 0.69,
          "analyst": 0.97,
          "opskins": 2
        },
        "1": {
          "market": 0.25,
          "analyst": 0.19,
          "opskins": 0.2
        },
        "2": {
          "market": 0.17,
          "analyst": 0.14,
          "opskins": 0.13
        },
        "3": {
          "market": 0.24,
          "analyst": 0.2,
          "opskins": 0.18
        },
        "4": {
          "market": 0.3,
          "analyst": 0.25,
          "opskins": 0.2
        }
      },
      "stattrak": {
        "0": {
          "market": 3.42,
          "analyst": 1.58,
          "opskins": 1.9
        },
        "1": {
          "market": 0.56,
          "analyst": 0.42,
          "opskins": 0.42
        },
        "2": {
          "market": 0.46,
          "analyst": 0.39,
          "opskins": 0.33
        },
        "3": {
          "market": 0.68,
          "analyst": 0.53,
          "opskins": 0.53
        },
        "4": {
          "market": 1.07,
          "analyst": 0.93,
          "opskins": 0.83
        }
      },
      "souvenir": {}
    }
  },
  "403": {
    "item_id": 403,
    "type": "Five-SeveN",
    "skinName": "Urban Hazard",
    "prices": {
      "default": {
        "2": {
          "market": 0.39,
          "analyst": 0.31,
          "opskins": 0.29
        },
        "3": {
          "market": 0.43,
          "analyst": 0.35,
          "opskins": 0.29
        },
        "4": {
          "market": 0.57,
          "analyst": 0.45,
          "opskins": 0.37
        }
      },
      "stattrak": {
        "2": {
          "market": 1.28,
          "analyst": 1.09,
          "opskins": 0.9
        },
        "3": {
          "market": 1.56,
          "analyst": 1.33,
          "opskins": 1.1
        },
        "4": {
          "market": 2.35,
          "analyst": 1.92,
          "opskins": 1.5
        }
      },
      "souvenir": {}
    }
  },
  "404": {
    "item_id": 404,
    "type": "UMP-45",
    "skinName": "Delusion",
    "prices": {
      "default": {
        "2": {
          "market": 0.17,
          "analyst": 0.13,
          "opskins": 0.04
        },
        "3": {
          "market": 0.26,
          "analyst": 0.16,
          "opskins": 0.12
        },
        "4": {
          "market": 1.94,
          "analyst": 1.31,
          "opskins": 1.23
        }
      },
      "stattrak": {
        "2": {
          "market": 0.56,
          "analyst": 0.41,
          "opskins": 0.32
        },
        "3": {
          "market": 0.97,
          "analyst": 0.65,
          "opskins": 0.5
        },
        "4": {
          "market": 6.6,
          "analyst": 4.7,
          "opskins": 4.84
        }
      },
      "souvenir": {}
    }
  },
  "405": {
    "item_id": 405,
    "type": "Glock-18",
    "skinName": "Grinder",
    "prices": {
      "default": {
        "2": {
          "market": 0.59,
          "analyst": 0.52,
          "opskins": 0.51
        },
        "3": {
          "market": 0.58,
          "analyst": 0.46,
          "opskins": 0.5
        },
        "4": {
          "market": 0.67,
          "analyst": 0.58,
          "opskins": 0.45
        }
      },
      "stattrak": {
        "2": {
          "market": 3.05,
          "analyst": 2.4,
          "opskins": 2.3
        },
        "3": {
          "market": 2.89,
          "analyst": 2.39,
          "opskins": 2.05
        },
        "4": {
          "market": 4.1,
          "analyst": 3.51,
          "opskins": 2.86
        }
      },
      "souvenir": {}
    }
  },
  "406": {
    "item_id": 406,
    "type": "M4A1-S",
    "skinName": "Basilisk",
    "prices": {
      "default": {
        "0": {
          "market": 1.37,
          "analyst": 1.15,
          "opskins": 0.99
        },
        "1": {
          "market": 2.12,
          "analyst": 1.82,
          "opskins": 1.64
        },
        "2": {
          "market": 1.33,
          "analyst": 1.12,
          "opskins": 0.95
        },
        "3": {
          "market": 1.65,
          "analyst": 1.37,
          "opskins": 1.16
        },
        "4": {
          "market": 2.9,
          "analyst": 2.61,
          "opskins": 2.17
        }
      },
      "stattrak": {
        "0": {
          "market": 7,
          "analyst": 6.01,
          "opskins": 5.11
        },
        "1": {
          "market": 7.3,
          "analyst": 6.44,
          "opskins": 6
        },
        "2": {
          "market": 6.77,
          "analyst": 5.6,
          "opskins": 4.83
        },
        "3": {
          "market": 7.51,
          "analyst": 6.24,
          "opskins": 5.29
        },
        "4": {
          "market": 12.18,
          "analyst": 10.35,
          "opskins": 8.89
        }
      },
      "souvenir": {}
    }
  },
  "407": {
    "item_id": 407,
    "type": "M4A4",
    "skinName": "Griffin",
    "prices": {
      "default": {
        "0": {
          "market": 1.42,
          "analyst": 0.99,
          "opskins": 1
        },
        "1": {
          "market": 2.48,
          "analyst": 1.94,
          "opskins": 1.75
        },
        "2": {
          "market": 1.53,
          "analyst": 1.07,
          "opskins": 0.95
        },
        "3": {
          "market": 2.17,
          "analyst": 1.52,
          "opskins": 1.35
        },
        "4": {
          "market": 4.55,
          "analyst": 3.39,
          "opskins": 2.94
        }
      },
      "stattrak": {
        "0": {
          "market": 5.23,
          "analyst": 4.09,
          "opskins": 3.54
        },
        "1": {
          "market": 7.57,
          "analyst": 6.17,
          "opskins": 6.1
        },
        "2": {
          "market": 5.44,
          "analyst": 4.27,
          "opskins": 3.69
        },
        "3": {
          "market": 7.96,
          "analyst": 6.18,
          "opskins": 5.19
        },
        "4": {
          "market": 16.92,
          "analyst": 14.56,
          "opskins": 14.81
        }
      },
      "souvenir": {}
    }
  },
  "408": {
    "item_id": 408,
    "type": "Sawed-Off",
    "skinName": "Highwayman",
    "prices": {
      "default": {
        "0": {
          "market": 0.42,
          "analyst": 0.24,
          "opskins": 0.28
        },
        "1": {
          "market": 0.29,
          "analyst": 0.23,
          "opskins": 0.23
        },
        "2": {
          "market": 0.29,
          "analyst": 0.27,
          "opskins": 0.46
        },
        "3": {
          "market": 0.34,
          "analyst": 0.28,
          "opskins": 0.45
        },
        "4": {
          "market": 0.8,
          "analyst": 0.63,
          "opskins": 0.62
        }
      },
      "stattrak": {
        "0": {
          "market": 0.71,
          "analyst": 0.7,
          "opskins": 0.59
        },
        "1": {
          "market": 0.72,
          "analyst": 0.6,
          "opskins": 0.59
        },
        "2": {
          "market": 0.75,
          "analyst": 0.65,
          "opskins": 0.75
        },
        "3": {
          "market": 1.37,
          "analyst": 1.1,
          "opskins": 1.11
        },
        "4": {
          "market": 3.65,
          "analyst": 3.55,
          "opskins": 3.73
        }
      },
      "souvenir": {}
    }
  },
  "409": {
    "item_id": 409,
    "type": "P250",
    "skinName": "Cartel",
    "prices": {
      "default": {
        "0": {
          "market": 1.85,
          "analyst": 1.5,
          "opskins": 1.74
        },
        "1": {
          "market": 2.3,
          "analyst": 1.97,
          "opskins": 1.71
        },
        "2": {
          "market": 1.85,
          "analyst": 1.45,
          "opskins": 1.3
        },
        "3": {
          "market": 2.39,
          "analyst": 1.87,
          "opskins": 1.58
        },
        "4": {
          "market": 5.9,
          "analyst": 5.11,
          "opskins": 4.7
        }
      },
      "stattrak": {
        "0": {
          "market": 6.78,
          "analyst": 5.36,
          "opskins": 4.94
        },
        "1": {
          "market": 7.46,
          "analyst": 7.03,
          "opskins": 6.35
        },
        "2": {
          "market": 6.97,
          "analyst": 5.45,
          "opskins": 4.71
        },
        "3": {
          "market": 10.62,
          "analyst": 8.73,
          "opskins": 7.8
        },
        "4": {
          "market": 28.48,
          "analyst": 27.29,
          "opskins": 23.97
        }
      },
      "souvenir": {}
    }
  },
  "410": {
    "item_id": 410,
    "type": "SCAR-20",
    "skinName": "Cardiac",
    "prices": {
      "default": {
        "0": {
          "market": 2.07,
          "analyst": 1.78,
          "opskins": 1.75
        },
        "1": {
          "market": 1.66,
          "analyst": 1.27,
          "opskins": 1.16
        },
        "2": {
          "market": 1.69,
          "analyst": 1.29,
          "opskins": 1.13
        },
        "3": {
          "market": 2.16,
          "analyst": 1.8,
          "opskins": 1.54
        },
        "4": {
          "market": 6.23,
          "analyst": 5.47,
          "opskins": 4.7
        }
      },
      "stattrak": {
        "0": {
          "market": 5.15,
          "analyst": 4.89,
          "opskins": 4.75
        },
        "1": {
          "market": 5.13,
          "analyst": 6.09,
          "opskins": 6.35
        },
        "2": {
          "market": 5.43,
          "analyst": 5.06,
          "opskins": 4.35
        },
        "3": {
          "market": 8.96,
          "analyst": 7.97,
          "opskins": 6.78
        },
        "4": {
          "market": 32.13,
          "analyst": 34.3,
          "opskins": 29.89
        }
      },
      "souvenir": {}
    }
  },
  "411": {
    "item_id": 411,
    "type": "XM1014",
    "skinName": "Tranquility",
    "prices": {
      "default": {
        "0": {
          "market": 2.16,
          "analyst": 1.97,
          "opskins": 5
        },
        "1": {
          "market": 1.96,
          "analyst": 1.7,
          "opskins": 1.97
        },
        "2": {
          "market": 1.85,
          "analyst": 1.49,
          "opskins": 1.42
        },
        "3": {
          "market": 2.34,
          "analyst": 1.82,
          "opskins": 1.56
        },
        "4": {
          "market": 5.69,
          "analyst": 4.46,
          "opskins": 3.77
        }
      },
      "stattrak": {
        "0": {
          "market": 11.32,
          "analyst": 13.93,
          "opskins": 42.94
        },
        "1": {
          "market": 6.05,
          "analyst": 6.51,
          "opskins": 7.36
        },
        "2": {
          "market": 5.64,
          "analyst": 5.19,
          "opskins": 5.15
        },
        "3": {
          "market": 10.28,
          "analyst": 8.89,
          "opskins": 8.08
        },
        "4": {
          "market": 23.54,
          "analyst": 21.02,
          "opskins": 19.89
        }
      },
      "souvenir": {}
    }
  },
  "412": {
    "item_id": 412,
    "type": "★ Gut Knife",
    "skinName": "Fade",
    "prices": {
      "default": {
        "3": {
          "market": 84.66,
          "analyst": 80.5,
          "opskins": 67.48
        },
        "4": {
          "market": 85.92,
          "analyst": 65.39,
          "opskins": 61.31
        }
      },
      "stattrak": {
        "3": {
          "market": 183.22,
          "analyst": 141,
          "opskins": 220
        },
        "4": {
          "market": 116.03,
          "analyst": 103.07,
          "opskins": 88.6
        }
      },
      "souvenir": {}
    }
  },
  "413": {
    "item_id": 413,
    "type": "UMP-45",
    "skinName": "Corporal",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "1": {
          "market": 0.1,
          "analyst": 0.08,
          "opskins": 0.07
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "3": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.1
        },
        "4": {
          "market": 0.43,
          "analyst": 0.29,
          "opskins": 0.27
        }
      },
      "stattrak": {
        "0": {
          "market": 0.24,
          "analyst": 0.19,
          "opskins": 0.16
        },
        "1": {
          "market": 0.28,
          "analyst": 0.22,
          "opskins": 0.2
        },
        "2": {
          "market": 0.24,
          "analyst": 0.19,
          "opskins": 0.16
        },
        "3": {
          "market": 0.35,
          "analyst": 0.26,
          "opskins": 0.22
        },
        "4": {
          "market": 2,
          "analyst": 1.53,
          "opskins": 1.45
        }
      },
      "souvenir": {}
    }
  },
  "414": {
    "item_id": 414,
    "type": "Negev",
    "skinName": "Terrain",
    "prices": {
      "default": {
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 15
        },
        "2": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.05
        },
        "3": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.1
        },
        "4": {
          "market": 0.14,
          "analyst": 0.1,
          "opskins": 0.09
        }
      },
      "stattrak": {
        "1": {
          "market": 0.23,
          "analyst": 0.21,
          "opskins": 0.19
        },
        "2": {
          "market": 0.23,
          "analyst": 0.19,
          "opskins": 0.17
        },
        "3": {
          "market": 0.34,
          "analyst": 0.26,
          "opskins": 0.23
        },
        "4": {
          "market": 0.54,
          "analyst": 0.41,
          "opskins": 0.38
        }
      },
      "souvenir": {}
    }
  },
  "415": {
    "item_id": 415,
    "type": "Tec-9",
    "skinName": "Sandstorm",
    "prices": {
      "default": {
        "0": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.11
        },
        "1": {
          "market": 0.19,
          "analyst": 0.13,
          "opskins": 0.14
        },
        "2": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "3": {
          "market": 0.34,
          "analyst": 0.21,
          "opskins": 0.19
        }
      },
      "stattrak": {
        "0": {
          "market": 0.31,
          "analyst": 0.24,
          "opskins": 0.2
        },
        "1": {
          "market": 0.57,
          "analyst": 0.47,
          "opskins": 0.39
        },
        "2": {
          "market": 0.3,
          "analyst": 0.24,
          "opskins": 0.19
        },
        "3": {
          "market": 1.3,
          "analyst": 1.1,
          "opskins": 0.88
        }
      },
      "souvenir": {}
    }
  },
  "416": {
    "item_id": 416,
    "type": "MAG-7",
    "skinName": "Heaven Guard",
    "prices": {
      "default": {
        "1": {
          "market": 0.12,
          "analyst": 0.09,
          "opskins": 0.07
        },
        "2": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.17
        },
        "3": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.09
        },
        "4": {
          "market": 0.14,
          "analyst": 0.1,
          "opskins": 0.09
        }
      },
      "stattrak": {
        "1": {
          "market": 0.33,
          "analyst": 0.28,
          "opskins": 0.3
        },
        "2": {
          "market": 0.23,
          "analyst": 0.19,
          "opskins": 0.15
        },
        "3": {
          "market": 0.36,
          "analyst": 0.27,
          "opskins": 0.2
        },
        "4": {
          "market": 0.56,
          "analyst": 0.45,
          "opskins": 0.38
        }
      },
      "souvenir": {}
    }
  },
  "417": {
    "item_id": 417,
    "type": "MAC-10",
    "skinName": "Heat",
    "prices": {
      "default": {
        "0": {
          "market": 0.38,
          "analyst": 0.31,
          "opskins": 0.28
        },
        "1": {
          "market": 0.4,
          "analyst": 0.33,
          "opskins": 0.32
        },
        "2": {
          "market": 0.39,
          "analyst": 0.32,
          "opskins": 0.29
        },
        "3": {
          "market": 0.78,
          "analyst": 0.62,
          "opskins": 0.5
        },
        "4": {
          "market": 1.3,
          "analyst": 0.98,
          "opskins": 0.78
        }
      },
      "stattrak": {
        "0": {
          "market": 1.04,
          "analyst": 0.91,
          "opskins": 0.8
        },
        "1": {
          "market": 1.17,
          "analyst": 0.95,
          "opskins": 0.78
        },
        "2": {
          "market": 1.31,
          "analyst": 1.09,
          "opskins": 0.89
        },
        "3": {
          "market": 3.14,
          "analyst": 2.64,
          "opskins": 2.54
        },
        "4": {
          "market": 5.16,
          "analyst": 4.26,
          "opskins": 4.61
        }
      },
      "souvenir": {}
    }
  },
  "418": {
    "item_id": 418,
    "type": "SG 553",
    "skinName": "Pulse",
    "prices": {
      "default": {
        "0": {
          "market": 0.4,
          "analyst": 0.33,
          "opskins": 0.3
        },
        "1": {
          "market": 0.7,
          "analyst": 0.54,
          "opskins": 0.48
        },
        "2": {
          "market": 0.4,
          "analyst": 0.31,
          "opskins": 0.3
        },
        "3": {
          "market": 1.09,
          "analyst": 0.78,
          "opskins": 0.62
        }
      },
      "stattrak": {
        "0": {
          "market": 1.12,
          "analyst": 0.9,
          "opskins": 0.72
        },
        "1": {
          "market": 1.45,
          "analyst": 1.38,
          "opskins": 1.14
        },
        "2": {
          "market": 1.26,
          "analyst": 0.97,
          "opskins": 0.78
        },
        "3": {
          "market": 4.38,
          "analyst": 3.27,
          "opskins": 3.03
        }
      },
      "souvenir": {}
    }
  },
  "419": {
    "item_id": 419,
    "type": "FAMAS",
    "skinName": "Sergeant",
    "prices": {
      "default": {
        "0": {
          "market": 0.36,
          "analyst": 0.29,
          "opskins": 0.48
        },
        "1": {
          "market": 0.39,
          "analyst": 0.3,
          "opskins": 0.27
        },
        "2": {
          "market": 0.38,
          "analyst": 0.31,
          "opskins": 0.25
        },
        "3": {
          "market": 0.88,
          "analyst": 0.75,
          "opskins": 0.63
        }
      },
      "stattrak": {
        "0": {
          "market": 0.9,
          "analyst": 0.69,
          "opskins": 0.56
        },
        "1": {
          "market": 1.06,
          "analyst": 0.88,
          "opskins": 0.71
        },
        "2": {
          "market": 1.2,
          "analyst": 0.95,
          "opskins": 0.75
        },
        "3": {
          "market": 3.56,
          "analyst": 3.07,
          "opskins": 3.75
        }
      },
      "souvenir": {}
    }
  },
  "420": {
    "item_id": 420,
    "type": "USP-S",
    "skinName": "Guardian",
    "prices": {
      "default": {
        "2": {
          "market": 0.7,
          "analyst": 0.55,
          "opskins": 0.52
        },
        "3": {
          "market": 0.95,
          "analyst": 0.73,
          "opskins": 0.65
        },
        "4": {
          "market": 1.28,
          "analyst": 1,
          "opskins": 0.89
        }
      },
      "stattrak": {
        "2": {
          "market": 2.8,
          "analyst": 2.23,
          "opskins": 2.07
        },
        "3": {
          "market": 3.99,
          "analyst": 3.25,
          "opskins": 2.8
        },
        "4": {
          "market": 5.66,
          "analyst": 4.52,
          "opskins": 3.94
        }
      },
      "souvenir": {}
    }
  },
  "421": {
    "item_id": 421,
    "type": "Nova",
    "skinName": "Antique",
    "prices": {
      "default": {
        "2": {
          "market": 2.82,
          "analyst": 2.23,
          "opskins": 2.05
        },
        "3": {
          "market": 2.55,
          "analyst": 2.16,
          "opskins": 1.86
        },
        "4": {
          "market": 3.05,
          "analyst": 2.65,
          "opskins": 2.21
        }
      },
      "stattrak": {
        "2": {
          "market": 6.58,
          "analyst": 5.12,
          "opskins": 5.1
        },
        "3": {
          "market": 6.2,
          "analyst": 4.87,
          "opskins": 4.55
        },
        "4": {
          "market": 10.82,
          "analyst": 8.51,
          "opskins": 8.41
        }
      },
      "souvenir": {}
    }
  },
  "422": {
    "item_id": 422,
    "type": "AUG",
    "skinName": "Chameleon",
    "prices": {
      "default": {
        "0": {
          "market": 1.41,
          "analyst": 1.17,
          "opskins": 1.08
        },
        "1": {
          "market": 1.54,
          "analyst": 1.23,
          "opskins": 1.2
        },
        "2": {
          "market": 1.32,
          "analyst": 1.07,
          "opskins": 1
        },
        "3": {
          "market": 1.63,
          "analyst": 1.2,
          "opskins": 1.15
        },
        "4": {
          "market": 2.31,
          "analyst": 1.88,
          "opskins": 1.56
        }
      },
      "stattrak": {
        "0": {
          "market": 5.07,
          "analyst": 5,
          "opskins": 4.77
        },
        "1": {
          "market": 4.63,
          "analyst": 4.69,
          "opskins": 4.24
        },
        "2": {
          "market": 4.4,
          "analyst": 3.77,
          "opskins": 3.75
        },
        "3": {
          "market": 6.5,
          "analyst": 5.52,
          "opskins": 5.01
        },
        "4": {
          "market": 11.21,
          "analyst": 9.61,
          "opskins": 8.93
        }
      },
      "souvenir": {}
    }
  },
  "423": {
    "item_id": 423,
    "type": "★ Karambit",
    "skinName": "Forest DDPAT",
    "prices": {
      "default": {
        "0": {
          "market": 108.45,
          "analyst": 85.52,
          "opskins": 74.94
        },
        "1": {
          "market": 114.61,
          "analyst": 84.64,
          "opskins": 75.97
        },
        "2": {
          "market": 115.81,
          "analyst": 88.59,
          "opskins": 75
        },
        "3": {
          "market": 133.25,
          "analyst": 105.43,
          "opskins": 94.9
        },
        "4": {
          "market": 256.5,
          "analyst": -1,
          "opskins": 249
        }
      },
      "stattrak": {
        "0": {
          "market": 116.4,
          "analyst": 119.96,
          "opskins": 113
        },
        "1": {
          "market": 117.65,
          "analyst": 139,
          "opskins": 120.81
        },
        "2": {
          "market": 129.03,
          "analyst": 116.44,
          "opskins": 118.09
        },
        "3": {
          "market": 150.15,
          "analyst": 170.97,
          "opskins": 145
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "424": {
    "item_id": 424,
    "type": "★ M9 Bayonet",
    "skinName": "Slaughter",
    "prices": {
      "default": {
        "2": {
          "market": 172.55,
          "analyst": 163.9,
          "opskins": 133.33
        },
        "3": {
          "market": 219.15,
          "analyst": 184.54,
          "opskins": 158.95
        },
        "4": {
          "market": 272.67,
          "analyst": 240.25,
          "opskins": 200
        }
      },
      "stattrak": {
        "2": {
          "market": 185.35,
          "analyst": 192.99,
          "opskins": 175
        },
        "3": {
          "market": 256.78,
          "analyst": 250.69,
          "opskins": 211.11
        },
        "4": {
          "market": 395,
          "analyst": 311,
          "opskins": 320.94
        }
      },
      "souvenir": {}
    }
  },
  "425": {
    "item_id": 425,
    "type": "★ Flip Knife",
    "skinName": "Slaughter",
    "prices": {
      "default": {
        "2": {
          "market": 107.09,
          "analyst": 82.31,
          "opskins": 73
        },
        "3": {
          "market": 112.17,
          "analyst": 90.63,
          "opskins": 78.55
        },
        "4": {
          "market": 123.28,
          "analyst": 96.43,
          "opskins": 83.44
        }
      },
      "stattrak": {
        "2": {
          "market": 126.44,
          "analyst": 133.45,
          "opskins": 112.51
        },
        "3": {
          "market": 127.11,
          "analyst": 148.18,
          "opskins": 118.88
        },
        "4": {
          "market": 142.07,
          "analyst": 156.9,
          "opskins": 127.78
        }
      },
      "souvenir": {}
    }
  },
  "426": {
    "item_id": 426,
    "type": "Tec-9",
    "skinName": "Isaac",
    "prices": {
      "default": {
        "0": {
          "market": 0.31,
          "analyst": 0.21,
          "opskins": 0.21
        },
        "1": {
          "market": 0.37,
          "analyst": 0.26,
          "opskins": 0.24
        },
        "2": {
          "market": 0.42,
          "analyst": 0.31,
          "opskins": 0.27
        },
        "3": {
          "market": 0.78,
          "analyst": 0.56,
          "opskins": 0.43
        },
        "4": {
          "market": 2.81,
          "analyst": 2.19,
          "opskins": 1.93
        }
      },
      "stattrak": {
        "0": {
          "market": 0.88,
          "analyst": 0.64,
          "opskins": 0.53
        },
        "1": {
          "market": 1.01,
          "analyst": 0.71,
          "opskins": 0.55
        },
        "2": {
          "market": 1.34,
          "analyst": 0.97,
          "opskins": 0.76
        },
        "3": {
          "market": 2.5,
          "analyst": 1.9,
          "opskins": 1.48
        },
        "4": {
          "market": 10.09,
          "analyst": 8.91,
          "opskins": 8.33
        }
      },
      "souvenir": {}
    }
  },
  "427": {
    "item_id": 427,
    "type": "SSG 08",
    "skinName": "Slashed",
    "prices": {
      "default": {
        "0": {
          "market": 0.18,
          "analyst": 0.12,
          "opskins": 0.12
        },
        "1": {
          "market": 0.25,
          "analyst": 0.15,
          "opskins": 0.12
        },
        "2": {
          "market": 0.27,
          "analyst": 0.15,
          "opskins": 0.12
        }
      },
      "stattrak": {
        "0": {
          "market": 0.45,
          "analyst": 0.37,
          "opskins": 0.3
        },
        "1": {
          "market": 0.6,
          "analyst": 0.45,
          "opskins": 0.39
        },
        "2": {
          "market": 0.75,
          "analyst": 0.55,
          "opskins": 0.43
        }
      },
      "souvenir": {}
    }
  },
  "428": {
    "item_id": 428,
    "type": "Galil AR",
    "skinName": "Kami",
    "prices": {
      "default": {
        "0": {
          "market": 0.11,
          "analyst": 0.1,
          "opskins": 0.15
        },
        "1": {
          "market": 0.17,
          "analyst": 0.13,
          "opskins": 0.23
        },
        "2": {
          "market": 0.1,
          "analyst": 0.08,
          "opskins": 0.1
        },
        "3": {
          "market": 0.16,
          "analyst": 0.12,
          "opskins": 0.1
        },
        "4": {
          "market": 0.27,
          "analyst": 0.19,
          "opskins": 0.18
        }
      },
      "stattrak": {
        "0": {
          "market": 0.29,
          "analyst": 0.26,
          "opskins": 0.94
        },
        "1": {
          "market": 0.44,
          "analyst": 0.34,
          "opskins": 0.3
        },
        "2": {
          "market": 0.3,
          "analyst": 0.23,
          "opskins": 0.19
        },
        "3": {
          "market": 0.5,
          "analyst": 0.41,
          "opskins": 0.33
        },
        "4": {
          "market": 1.11,
          "analyst": 0.9,
          "opskins": 0.74
        }
      },
      "souvenir": {}
    }
  },
  "429": {
    "item_id": 429,
    "type": "CZ75-Auto",
    "skinName": "Twist",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.1
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.1
        },
        "3": {
          "market": 0.13,
          "analyst": 0.09,
          "opskins": 0.08
        },
        "4": {
          "market": 0.28,
          "analyst": 0.28,
          "opskins": 0.28
        }
      },
      "stattrak": {
        "0": {
          "market": 0.24,
          "analyst": 0.21,
          "opskins": 0.17
        },
        "1": {
          "market": 0.24,
          "analyst": 0.2,
          "opskins": 0.16
        },
        "2": {
          "market": 0.25,
          "analyst": 0.2,
          "opskins": 0.17
        },
        "3": {
          "market": 0.39,
          "analyst": 0.32,
          "opskins": 0.27
        },
        "4": {
          "market": 1.33,
          "analyst": 1.11,
          "opskins": 0.97
        }
      },
      "souvenir": {}
    }
  },
  "430": {
    "item_id": 430,
    "type": "P90",
    "skinName": "Module",
    "prices": {
      "default": {
        "2": {
          "market": 0.45,
          "analyst": 0.4,
          "opskins": 0.42
        },
        "3": {
          "market": 0.4,
          "analyst": 0.3,
          "opskins": 0.27
        },
        "4": {
          "market": 0.57,
          "analyst": 0.4,
          "opskins": 0.33
        }
      },
      "stattrak": {
        "2": {
          "market": 0.95,
          "analyst": 0.82,
          "opskins": 0.66
        },
        "3": {
          "market": 1.03,
          "analyst": 0.85,
          "opskins": 0.67
        },
        "4": {
          "market": 1.74,
          "analyst": 1.49,
          "opskins": 1.19
        }
      },
      "souvenir": {}
    }
  },
  "431": {
    "item_id": 431,
    "type": "P2000",
    "skinName": "Pulse",
    "prices": {
      "default": {
        "0": {
          "market": 0.11,
          "analyst": 0.12,
          "opskins": 0.12
        },
        "1": {
          "market": 0.2,
          "analyst": 0.2,
          "opskins": 0.21
        },
        "2": {
          "market": 0.11,
          "analyst": 0.1,
          "opskins": 0.1
        },
        "3": {
          "market": 0.16,
          "analyst": 0.14,
          "opskins": 0.12
        },
        "4": {
          "market": 0.28,
          "analyst": 0.25,
          "opskins": 0.2
        }
      },
      "stattrak": {
        "0": {
          "market": 0.3,
          "analyst": 0.26,
          "opskins": 0.23
        },
        "1": {
          "market": 0.45,
          "analyst": 0.54,
          "opskins": 0.45
        },
        "2": {
          "market": 0.31,
          "analyst": 0.27,
          "opskins": 0.22
        },
        "3": {
          "market": 0.53,
          "analyst": 0.5,
          "opskins": 0.42
        },
        "4": {
          "market": 1.17,
          "analyst": 1.11,
          "opskins": 0.87
        }
      },
      "souvenir": {}
    }
  },
  "432": {
    "item_id": 432,
    "type": "AUG",
    "skinName": "Torque",
    "prices": {
      "default": {
        "0": {
          "market": 0.81,
          "analyst": 0.83,
          "opskins": 0.77
        },
        "1": {
          "market": 0.68,
          "analyst": 0.61,
          "opskins": 0.53
        },
        "2": {
          "market": 0.55,
          "analyst": 0.45,
          "opskins": 0.39
        },
        "3": {
          "market": 0.72,
          "analyst": 0.56,
          "opskins": 0.57
        },
        "4": {
          "market": 1.14,
          "analyst": 0.92,
          "opskins": 0.78
        }
      },
      "stattrak": {
        "0": {
          "market": 2.17,
          "analyst": 2.41,
          "opskins": 2.02
        },
        "1": {
          "market": 2.02,
          "analyst": 1.89,
          "opskins": 1.62
        },
        "2": {
          "market": 1.93,
          "analyst": 1.5,
          "opskins": 1.32
        },
        "3": {
          "market": 2.62,
          "analyst": 2.25,
          "opskins": 1.85
        },
        "4": {
          "market": 4.47,
          "analyst": 3.48,
          "opskins": 3
        }
      },
      "souvenir": {}
    }
  },
  "433": {
    "item_id": 433,
    "type": "PP-Bizon",
    "skinName": "Antique",
    "prices": {
      "default": {
        "0": {
          "market": 0.9,
          "analyst": 0.95,
          "opskins": 1.57
        },
        "1": {
          "market": 0.68,
          "analyst": 0.54,
          "opskins": 0.56
        },
        "2": {
          "market": 0.54,
          "analyst": 0.44,
          "opskins": 0.38
        },
        "3": {
          "market": 0.66,
          "analyst": 0.52,
          "opskins": 0.45
        },
        "4": {
          "market": 1.09,
          "analyst": 0.91,
          "opskins": 0.76
        }
      },
      "stattrak": {
        "0": {
          "market": 1.89,
          "analyst": 2.41,
          "opskins": 1.99
        },
        "1": {
          "market": 1.81,
          "analyst": 1.54,
          "opskins": 1.8
        },
        "2": {
          "market": 1.9,
          "analyst": 1.33,
          "opskins": 1.24
        },
        "3": {
          "market": 2.61,
          "analyst": 2.16,
          "opskins": 1.82
        },
        "4": {
          "market": 3.96,
          "analyst": 3.39,
          "opskins": 3.15
        }
      },
      "souvenir": {}
    }
  },
  "434": {
    "item_id": 434,
    "type": "XM1014",
    "skinName": "Heaven Guard",
    "prices": {
      "default": {
        "0": {
          "market": 0.94,
          "analyst": 0.94,
          "opskins": 0.8
        },
        "1": {
          "market": 0.68,
          "analyst": 0.58,
          "opskins": 0.5
        },
        "2": {
          "market": 0.52,
          "analyst": 0.43,
          "opskins": 0.36
        },
        "3": {
          "market": 0.65,
          "analyst": 0.52,
          "opskins": 0.41
        },
        "4": {
          "market": 1.18,
          "analyst": 1.04,
          "opskins": 0.86
        }
      },
      "stattrak": {
        "0": {
          "market": 1.82,
          "analyst": 1.83,
          "opskins": 1.68
        },
        "1": {
          "market": 1.69,
          "analyst": 1.25,
          "opskins": 1.53
        },
        "2": {
          "market": 1.82,
          "analyst": 1.34,
          "opskins": 1.2
        },
        "3": {
          "market": 2.48,
          "analyst": 2.09,
          "opskins": 1.97
        },
        "4": {
          "market": 5.56,
          "analyst": 4.59,
          "opskins": 3.96
        }
      },
      "souvenir": {}
    }
  },
  "435": {
    "item_id": 435,
    "type": "MAC-10",
    "skinName": "Tatter",
    "prices": {
      "default": {
        "0": {
          "market": 1.16,
          "analyst": 1.02,
          "opskins": 1.23
        },
        "1": {
          "market": 0.63,
          "analyst": 0.61,
          "opskins": 0.49
        },
        "2": {
          "market": 0.54,
          "analyst": 0.44,
          "opskins": 0.8
        },
        "3": {
          "market": 0.68,
          "analyst": 0.56,
          "opskins": 0.47
        },
        "4": {
          "market": 1.24,
          "analyst": 1.07,
          "opskins": 0.86
        }
      },
      "stattrak": {
        "0": {
          "market": 2.02,
          "analyst": 2.72,
          "opskins": 2.4
        },
        "1": {
          "market": 1.89,
          "analyst": 1.64,
          "opskins": 1.63
        },
        "2": {
          "market": 1.86,
          "analyst": 1.31,
          "opskins": 1.24
        },
        "3": {
          "market": 2.53,
          "analyst": 2.18,
          "opskins": 2.01
        },
        "4": {
          "market": 3.92,
          "analyst": 3.88,
          "opskins": 3.39
        }
      },
      "souvenir": {}
    }
  },
  "436": {
    "item_id": 436,
    "type": "SCAR-20",
    "skinName": "Cyrex",
    "prices": {
      "default": {
        "0": {
          "market": 2.86,
          "analyst": 3.43,
          "opskins": 3.45
        },
        "1": {
          "market": 2.6,
          "analyst": 2.62,
          "opskins": 2.5
        },
        "2": {
          "market": 2.5,
          "analyst": 2.07,
          "opskins": 2.09
        },
        "3": {
          "market": 3.18,
          "analyst": 2.38,
          "opskins": 2.11
        },
        "4": {
          "market": 4.51,
          "analyst": 3.83,
          "opskins": 3.15
        }
      },
      "stattrak": {
        "0": {
          "market": 7,
          "analyst": 7.14,
          "opskins": 6.65
        },
        "1": {
          "market": 6.33,
          "analyst": 8.37,
          "opskins": 9.7
        },
        "2": {
          "market": 5.69,
          "analyst": 7.17,
          "opskins": 6.45
        },
        "3": {
          "market": 11.23,
          "analyst": 10.38,
          "opskins": 10
        },
        "4": {
          "market": 19.2,
          "analyst": 18.61,
          "opskins": 15.9
        }
      },
      "souvenir": {}
    }
  },
  "437": {
    "item_id": 437,
    "type": "USP-S",
    "skinName": "Caiman",
    "prices": {
      "default": {
        "1": {
          "market": 4.57,
          "analyst": 3.68,
          "opskins": 3.49
        },
        "2": {
          "market": 3.55,
          "analyst": 3.25,
          "opskins": 2.86
        },
        "3": {
          "market": 4.23,
          "analyst": 3.86,
          "opskins": 3.28
        },
        "4": {
          "market": 5.72,
          "analyst": 5.09,
          "opskins": 4.37
        }
      },
      "stattrak": {
        "1": {
          "market": 10.28,
          "analyst": 11.34,
          "opskins": 9.95
        },
        "2": {
          "market": 9.39,
          "analyst": 7.98,
          "opskins": 7
        },
        "3": {
          "market": 14.84,
          "analyst": 12.17,
          "opskins": 10.78
        },
        "4": {
          "market": 21.66,
          "analyst": 18.34,
          "opskins": 16
        }
      },
      "souvenir": {}
    }
  },
  "438": {
    "item_id": 438,
    "type": "M4A4",
    "skinName": "Desert-Strike",
    "prices": {
      "default": {
        "0": {
          "market": 1.97,
          "analyst": 1.58,
          "opskins": 1.53
        },
        "1": {
          "market": 2.67,
          "analyst": 2.23,
          "opskins": 2.21
        },
        "2": {
          "market": 2.1,
          "analyst": 1.68,
          "opskins": 1.55
        },
        "3": {
          "market": 3.33,
          "analyst": 2.71,
          "opskins": 2.43
        },
        "4": {
          "market": 5.64,
          "analyst": 4.56,
          "opskins": 3.91
        }
      },
      "stattrak": {
        "0": {
          "market": 7.48,
          "analyst": 6.71,
          "opskins": 7
        },
        "1": {
          "market": 11.22,
          "analyst": 11.53,
          "opskins": 11.99
        },
        "2": {
          "market": 8.85,
          "analyst": 7.05,
          "opskins": 6.43
        },
        "3": {
          "market": 16.33,
          "analyst": 13.07,
          "opskins": 12.38
        },
        "4": {
          "market": 29.88,
          "analyst": 28.01,
          "opskins": 25.5
        }
      },
      "souvenir": {}
    }
  },
  "439": {
    "item_id": 439,
    "type": "★ Huntsman Knife",
    "skinName": "Slaughter",
    "prices": {
      "default": {
        "2": {
          "market": 108.2,
          "analyst": 87.29,
          "opskins": 76.99
        },
        "3": {
          "market": 134.34,
          "analyst": 110.38,
          "opskins": 94.9
        },
        "4": {
          "market": 167.76,
          "analyst": 137.39,
          "opskins": 115
        }
      },
      "stattrak": {
        "2": {
          "market": 178.2,
          "analyst": 189.87,
          "opskins": 200.59
        },
        "3": {
          "market": 199.8,
          "analyst": 199.84,
          "opskins": 166
        },
        "4": {
          "market": 268,
          "analyst": 316.57,
          "opskins": 246
        }
      },
      "souvenir": {}
    }
  },
  "440": {
    "item_id": 440,
    "type": "★ Huntsman Knife",
    "skinName": "Fade",
    "prices": {
      "default": {
        "3": {
          "market": 161.57,
          "analyst": 150.59,
          "opskins": 124.09
        },
        "4": {
          "market": 163.73,
          "analyst": 127.78,
          "opskins": 107.89
        }
      },
      "stattrak": {
        "3": {
          "market": 309.15,
          "analyst": 308.21,
          "opskins": 239.99
        },
        "4": {
          "market": 203.1,
          "analyst": 228.43,
          "opskins": 189
        }
      },
      "souvenir": {}
    }
  },
  "441": {
    "item_id": 441,
    "type": "★ Huntsman Knife",
    "skinName": "Scorched",
    "prices": {
      "default": {
        "0": {
          "market": 48.88,
          "analyst": 36.55,
          "opskins": 32.81
        },
        "1": {
          "market": 48.72,
          "analyst": 38.16,
          "opskins": 32.98
        },
        "2": {
          "market": 51.69,
          "analyst": 37.21,
          "opskins": 32
        },
        "3": {
          "market": 61.4,
          "analyst": 48.13,
          "opskins": 42
        },
        "4": {
          "market": 134.81,
          "analyst": -1,
          "opskins": 130
        }
      },
      "stattrak": {
        "0": {
          "market": 52.1,
          "analyst": 59.57,
          "opskins": 55.73
        },
        "1": {
          "market": 56.6,
          "analyst": 62.92,
          "opskins": 59.21
        },
        "2": {
          "market": 65.74,
          "analyst": 72.83,
          "opskins": 60.54
        },
        "3": {
          "market": 90.5,
          "analyst": 92.48,
          "opskins": 77.99
        },
        "4": {
          "market": -1,
          "analyst": 160,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "442": {
    "item_id": 442,
    "type": "MP7",
    "skinName": "Urban Hazard",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.9
        },
        "1": {
          "market": 0.11,
          "analyst": 0.1,
          "opskins": 0.16
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "3": {
          "market": 0.11,
          "analyst": 0.09,
          "opskins": 0.09
        },
        "4": {
          "market": 0.15,
          "analyst": 0.13,
          "opskins": 0.11
        }
      },
      "stattrak": {
        "0": {
          "market": 0.34,
          "analyst": 0.3,
          "opskins": 0.27
        },
        "1": {
          "market": 0.37,
          "analyst": 0.3,
          "opskins": 0.23
        },
        "2": {
          "market": 0.29,
          "analyst": 0.23,
          "opskins": 0.17
        },
        "3": {
          "market": 0.41,
          "analyst": 0.35,
          "opskins": 0.29
        },
        "4": {
          "market": 0.73,
          "analyst": 0.73,
          "opskins": 0.56
        }
      },
      "souvenir": {}
    }
  },
  "443": {
    "item_id": 443,
    "type": "Negev",
    "skinName": "Desert-Strike",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.08,
          "opskins": 0.1
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.35
        },
        "2": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.17
        },
        "3": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.1
        },
        "4": {
          "market": 0.13,
          "analyst": 0.1,
          "opskins": 0.09
        }
      },
      "stattrak": {
        "0": {
          "market": 0.26,
          "analyst": 0.19,
          "opskins": 0.22
        },
        "1": {
          "market": 0.22,
          "analyst": 0.19,
          "opskins": 0.16
        },
        "2": {
          "market": 0.23,
          "analyst": 0.19,
          "opskins": 0.15
        },
        "3": {
          "market": 0.26,
          "analyst": 0.2,
          "opskins": 0.18
        },
        "4": {
          "market": 0.51,
          "analyst": 0.39,
          "opskins": 0.37
        }
      },
      "souvenir": {}
    }
  },
  "444": {
    "item_id": 444,
    "type": "P2000",
    "skinName": "Ivory",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.05
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "3": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.09
        },
        "4": {
          "market": 0.17,
          "analyst": 0.15,
          "opskins": 0.14
        }
      },
      "stattrak": {
        "0": {
          "market": 0.23,
          "analyst": 0.2,
          "opskins": 0.16
        },
        "1": {
          "market": 0.23,
          "analyst": 0.2,
          "opskins": 0.15
        },
        "2": {
          "market": 0.23,
          "analyst": 0.2,
          "opskins": 0.16
        },
        "3": {
          "market": 0.29,
          "analyst": 0.22,
          "opskins": 0.16
        },
        "4": {
          "market": 1.04,
          "analyst": 0.87,
          "opskins": 0.7
        }
      },
      "souvenir": {}
    }
  },
  "445": {
    "item_id": 445,
    "type": "SSG 08",
    "skinName": "Abyss",
    "prices": {
      "default": {
        "0": {
          "market": 0.13,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "1": {
          "market": 0.13,
          "analyst": 0.08,
          "opskins": 0.08
        },
        "2": {
          "market": 0.16,
          "analyst": 0.1,
          "opskins": 0.09
        },
        "3": {
          "market": 0.28,
          "analyst": 0.2,
          "opskins": 0.15
        },
        "4": {
          "market": 1.34,
          "analyst": 0.95,
          "opskins": 0.86
        }
      },
      "stattrak": {
        "0": {
          "market": 0.43,
          "analyst": 0.29,
          "opskins": 0.22
        },
        "1": {
          "market": 0.43,
          "analyst": 0.3,
          "opskins": 0.25
        },
        "2": {
          "market": 0.56,
          "analyst": 0.37,
          "opskins": 0.3
        },
        "3": {
          "market": 1.24,
          "analyst": 0.92,
          "opskins": 0.72
        },
        "4": {
          "market": 6.29,
          "analyst": 4.84,
          "opskins": 4.12
        }
      },
      "souvenir": {}
    }
  },
  "446": {
    "item_id": 446,
    "type": "UMP-45",
    "skinName": "Labyrinth",
    "prices": {
      "default": {
        "1": {
          "market": 0.12,
          "analyst": 0.1,
          "opskins": 0.09
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "3": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "4": {
          "market": 0.15,
          "analyst": 0.1,
          "opskins": 0.09
        }
      },
      "stattrak": {
        "1": {
          "market": 0.42,
          "analyst": 0.34,
          "opskins": 0.42
        },
        "2": {
          "market": 0.25,
          "analyst": 0.2,
          "opskins": 0.16
        },
        "3": {
          "market": 0.36,
          "analyst": 0.23,
          "opskins": 0.21
        },
        "4": {
          "market": 0.7,
          "analyst": 0.43,
          "opskins": 0.37
        }
      },
      "souvenir": {}
    }
  },
  "447": {
    "item_id": 447,
    "type": "PP-Bizon",
    "skinName": "Osiris",
    "prices": {
      "default": {
        "0": {
          "market": 0.29,
          "analyst": 0.26,
          "opskins": 0.27
        },
        "1": {
          "market": 0.36,
          "analyst": 0.3,
          "opskins": 0.26
        },
        "2": {
          "market": 0.26,
          "analyst": 0.21,
          "opskins": 0.18
        },
        "3": {
          "market": 0.32,
          "analyst": 0.26,
          "opskins": 0.19
        },
        "4": {
          "market": 0.54,
          "analyst": 0.4,
          "opskins": 0.33
        }
      },
      "stattrak": {
        "0": {
          "market": 0.76,
          "analyst": 0.62,
          "opskins": 0.62
        },
        "1": {
          "market": 0.94,
          "analyst": 0.75,
          "opskins": 0.6
        },
        "2": {
          "market": 0.86,
          "analyst": 0.66,
          "opskins": 0.62
        },
        "3": {
          "market": 1.26,
          "analyst": 0.97,
          "opskins": 0.8
        },
        "4": {
          "market": 2.34,
          "analyst": 2.04,
          "opskins": 1.63
        }
      },
      "souvenir": {}
    }
  },
  "448": {
    "item_id": 448,
    "type": "CZ75-Auto",
    "skinName": "Tigris",
    "prices": {
      "default": {
        "0": {
          "market": 0.25,
          "analyst": 0.21,
          "opskins": 0.2
        },
        "1": {
          "market": 0.26,
          "analyst": 0.21,
          "opskins": 0.18
        },
        "2": {
          "market": 0.25,
          "analyst": 0.22,
          "opskins": 0.21
        },
        "3": {
          "market": 0.31,
          "analyst": 0.25,
          "opskins": 0.22
        },
        "4": {
          "market": 0.89,
          "analyst": 0.76,
          "opskins": 0.6
        }
      },
      "stattrak": {
        "0": {
          "market": 0.72,
          "analyst": 0.59,
          "opskins": 0.57
        },
        "1": {
          "market": 0.74,
          "analyst": 0.63,
          "opskins": 0.56
        },
        "2": {
          "market": 0.81,
          "analyst": 0.68,
          "opskins": 0.56
        },
        "3": {
          "market": 1.31,
          "analyst": 1.06,
          "opskins": 0.89
        },
        "4": {
          "market": 4.53,
          "analyst": 3.48,
          "opskins": 2.82
        }
      },
      "souvenir": {}
    }
  },
  "449": {
    "item_id": 449,
    "type": "Nova",
    "skinName": "Koi",
    "prices": {
      "default": {
        "2": {
          "market": 0.31,
          "analyst": 0.24,
          "opskins": 0.23
        },
        "3": {
          "market": 0.32,
          "analyst": 0.26,
          "opskins": 0.23
        },
        "4": {
          "market": 0.51,
          "analyst": 0.39,
          "opskins": 0.33
        }
      },
      "stattrak": {
        "2": {
          "market": 0.9,
          "analyst": 0.78,
          "opskins": 0.61
        },
        "3": {
          "market": 1.18,
          "analyst": 0.98,
          "opskins": 0.74
        },
        "4": {
          "market": 2.29,
          "analyst": 1.87,
          "opskins": 1.51
        }
      },
      "souvenir": {}
    }
  },
  "450": {
    "item_id": 450,
    "type": "P250",
    "skinName": "Supernova",
    "prices": {
      "default": {
        "1": {
          "market": 0.49,
          "analyst": 0.41,
          "opskins": 0.35
        },
        "2": {
          "market": 0.31,
          "analyst": 0.23,
          "opskins": 0.2
        },
        "3": {
          "market": 0.36,
          "analyst": 0.28,
          "opskins": 0.24
        },
        "4": {
          "market": 0.55,
          "analyst": 0.43,
          "opskins": 0.34
        }
      },
      "stattrak": {
        "1": {
          "market": 1.9,
          "analyst": 1.47,
          "opskins": 1.28
        },
        "2": {
          "market": 1.19,
          "analyst": 0.87,
          "opskins": 0.72
        },
        "3": {
          "market": 1.73,
          "analyst": 1.2,
          "opskins": 1.04
        },
        "4": {
          "market": 3.04,
          "analyst": 2.21,
          "opskins": 1.86
        }
      },
      "souvenir": {}
    }
  },
  "451": {
    "item_id": 451,
    "type": "Desert Eagle",
    "skinName": "Conspiracy",
    "prices": {
      "default": {
        "2": {
          "market": 1.97,
          "analyst": 1.51,
          "opskins": 1.4
        },
        "3": {
          "market": 2.14,
          "analyst": 1.62,
          "opskins": 1.37
        },
        "4": {
          "market": 2.69,
          "analyst": 2.13,
          "opskins": 1.81
        }
      },
      "stattrak": {
        "2": {
          "market": 7.71,
          "analyst": 5.75,
          "opskins": 5.09
        },
        "3": {
          "market": 9.79,
          "analyst": 7.68,
          "opskins": 6.48
        },
        "4": {
          "market": 14.56,
          "analyst": 11.46,
          "opskins": 9.99
        }
      },
      "souvenir": {}
    }
  },
  "452": {
    "item_id": 452,
    "type": "Five-SeveN",
    "skinName": "Fowl Play",
    "prices": {
      "default": {
        "0": {
          "market": 1.13,
          "analyst": 0.99,
          "opskins": 0.82
        },
        "1": {
          "market": 1.11,
          "analyst": 0.98,
          "opskins": 0.84
        },
        "2": {
          "market": 1.11,
          "analyst": 0.97,
          "opskins": 0.78
        },
        "3": {
          "market": 1.44,
          "analyst": 1.29,
          "opskins": 1.05
        },
        "4": {
          "market": 2.8,
          "analyst": 2.31,
          "opskins": 2.09
        }
      },
      "stattrak": {
        "0": {
          "market": 2.87,
          "analyst": 2.33,
          "opskins": 2.03
        },
        "1": {
          "market": 2.97,
          "analyst": 2.39,
          "opskins": 2.08
        },
        "2": {
          "market": 3.09,
          "analyst": 2.63,
          "opskins": 2.29
        },
        "3": {
          "market": 5.29,
          "analyst": 4.11,
          "opskins": 3.63
        },
        "4": {
          "market": 12.64,
          "analyst": 9.48,
          "opskins": 9.74
        }
      },
      "souvenir": {}
    }
  },
  "453": {
    "item_id": 453,
    "type": "★ Butterfly Knife",
    "skinName": "Fade",
    "prices": {
      "default": {
        "3": {
          "market": 227.89,
          "analyst": 234.01,
          "opskins": 189.89
        },
        "4": {
          "market": 221.98,
          "analyst": 176.71,
          "opskins": 148.89
        }
      },
      "stattrak": {
        "3": {
          "market": 355.25,
          "analyst": 246,
          "opskins": 315.25
        },
        "4": {
          "market": 323.91,
          "analyst": 287.68,
          "opskins": 232.99
        }
      },
      "souvenir": {}
    }
  },
  "454": {
    "item_id": 454,
    "type": "★ Butterfly Knife",
    "skinName": "Case Hardened",
    "prices": {
      "default": {
        "0": {
          "market": 95.24,
          "analyst": 81.62,
          "opskins": 67.94
        },
        "1": {
          "market": 96.76,
          "analyst": 83.6,
          "opskins": 70.9
        },
        "2": {
          "market": 101.07,
          "analyst": 88.92,
          "opskins": 73.89
        },
        "3": {
          "market": 116.57,
          "analyst": 106.95,
          "opskins": 88.2
        },
        "4": {
          "market": 159.77,
          "analyst": 186.88,
          "opskins": 154.99
        }
      },
      "stattrak": {
        "0": {
          "market": 121.55,
          "analyst": 128.94,
          "opskins": 134.99
        },
        "1": {
          "market": 128.94,
          "analyst": 137.42,
          "opskins": 107.92
        },
        "2": {
          "market": 139.4,
          "analyst": 148.85,
          "opskins": 119.94
        },
        "3": {
          "market": 170.45,
          "analyst": 194.06,
          "opskins": 172
        },
        "4": {
          "market": 399.99,
          "analyst": 520,
          "opskins": 495
        }
      },
      "souvenir": {}
    }
  },
  "455": {
    "item_id": 455,
    "type": "★ Butterfly Knife",
    "skinName": "Stained",
    "prices": {
      "default": {
        "0": {
          "market": 81.34,
          "analyst": 60.13,
          "opskins": 53.28
        },
        "1": {
          "market": 83.11,
          "analyst": 62.11,
          "opskins": 53.57
        },
        "2": {
          "market": 84.75,
          "analyst": 63.63,
          "opskins": 53.89
        },
        "3": {
          "market": 91.7,
          "analyst": 70.03,
          "opskins": 61
        },
        "4": {
          "market": 119.65,
          "analyst": 110.2,
          "opskins": 88.89
        }
      },
      "stattrak": {
        "0": {
          "market": 90.1,
          "analyst": 100.01,
          "opskins": 79.99
        },
        "1": {
          "market": 92.63,
          "analyst": 91.53,
          "opskins": 114.69
        },
        "2": {
          "market": 105.88,
          "analyst": 98.08,
          "opskins": 80.98
        },
        "3": {
          "market": 120.46,
          "analyst": 103.8,
          "opskins": 90.25
        },
        "4": {
          "market": 250,
          "analyst": -1,
          "opskins": 520
        }
      },
      "souvenir": {}
    }
  },
  "456": {
    "item_id": 456,
    "type": "FAMAS",
    "skinName": "Survivor Z",
    "prices": {
      "default": {
        "0": {
          "market": 0.12,
          "analyst": 0.08,
          "opskins": 0.07
        },
        "1": {
          "market": 0.15,
          "analyst": 0.11,
          "opskins": 0.1
        },
        "2": {
          "market": 0.12,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "3": {
          "market": 0.16,
          "analyst": 0.12,
          "opskins": 0.1
        },
        "4": {
          "market": 0.28,
          "analyst": 0.21,
          "opskins": 0.18
        }
      },
      "stattrak": {
        "0": {
          "market": 0.46,
          "analyst": 0.37,
          "opskins": 0.31
        },
        "1": {
          "market": 0.62,
          "analyst": 0.63,
          "opskins": 0.5
        },
        "2": {
          "market": 0.46,
          "analyst": 0.36,
          "opskins": 0.27
        },
        "3": {
          "market": 0.7,
          "analyst": 0.57,
          "opskins": 0.47
        },
        "4": {
          "market": 1.23,
          "analyst": 1.02,
          "opskins": 0.81
        }
      },
      "souvenir": {}
    }
  },
  "457": {
    "item_id": 457,
    "type": "XM1014",
    "skinName": "Scumbria",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.07
        },
        "1": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.08
        },
        "2": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.07
        },
        "3": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "4": {
          "market": 0.19,
          "analyst": 0.16,
          "opskins": 0.14
        }
      },
      "stattrak": {
        "0": {
          "market": 0.22,
          "analyst": 0.19,
          "opskins": 0.16
        },
        "1": {
          "market": 0.23,
          "analyst": 0.19,
          "opskins": 0.16
        },
        "2": {
          "market": 0.23,
          "analyst": 0.19,
          "opskins": 0.17
        },
        "3": {
          "market": 0.3,
          "analyst": 0.22,
          "opskins": 0.19
        },
        "4": {
          "market": 0.92,
          "analyst": 0.84,
          "opskins": 0.66
        }
      },
      "souvenir": {}
    }
  },
  "458": {
    "item_id": 458,
    "type": "MAC-10",
    "skinName": "Rangeen",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.36
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "3": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "4": {
          "market": 0.17,
          "analyst": 0.13,
          "opskins": 0.09
        }
      },
      "stattrak": {
        "0": {
          "market": 0.25,
          "analyst": 0.22,
          "opskins": 1.31
        },
        "1": {
          "market": 0.28,
          "analyst": 0.25,
          "opskins": 0.41
        },
        "2": {
          "market": 0.25,
          "analyst": 0.2,
          "opskins": 0.16
        },
        "3": {
          "market": 0.42,
          "analyst": 0.32,
          "opskins": 0.28
        },
        "4": {
          "market": 0.73,
          "analyst": 0.6,
          "opskins": 0.47
        }
      },
      "souvenir": {}
    }
  },
  "459": {
    "item_id": 459,
    "type": "SCAR-20",
    "skinName": "Green Marine",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.08
        },
        "1": {
          "market": 0.15,
          "analyst": 0.13,
          "opskins": 0.13
        },
        "2": {
          "market": 0.08,
          "analyst": 0.06,
          "opskins": 0.06
        },
        "3": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "4": {
          "market": 0.19,
          "analyst": 0.14,
          "opskins": 0.12
        }
      },
      "stattrak": {
        "0": {
          "market": 0.25,
          "analyst": 0.2,
          "opskins": 0.17
        },
        "1": {
          "market": 0.28,
          "analyst": 0.24,
          "opskins": 0.21
        },
        "2": {
          "market": 0.24,
          "analyst": 0.2,
          "opskins": 0.16
        },
        "3": {
          "market": 0.39,
          "analyst": 0.32,
          "opskins": 0.25
        },
        "4": {
          "market": 0.82,
          "analyst": 0.6,
          "opskins": 0.54
        }
      },
      "souvenir": {}
    }
  },
  "460": {
    "item_id": 460,
    "type": "MAG-7",
    "skinName": "Cobalt Core",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.1
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "3": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "4": {
          "market": 0.18,
          "analyst": 0.13,
          "opskins": 0.11
        }
      },
      "stattrak": {
        "0": {
          "market": 0.24,
          "analyst": 0.21,
          "opskins": 0.18
        },
        "1": {
          "market": 0.26,
          "analyst": 0.21,
          "opskins": 0.18
        },
        "2": {
          "market": 0.24,
          "analyst": 0.19,
          "opskins": 0.15
        },
        "3": {
          "market": 0.39,
          "analyst": 0.31,
          "opskins": 0.26
        },
        "4": {
          "market": 0.72,
          "analyst": 0.58,
          "opskins": 0.48
        }
      },
      "souvenir": {}
    }
  },
  "461": {
    "item_id": 461,
    "type": "Glock-18",
    "skinName": "Wraiths",
    "prices": {
      "default": {
        "0": {
          "market": 0.12,
          "analyst": 0.1,
          "opskins": 0.1
        },
        "1": {
          "market": 0.25,
          "analyst": 0.2,
          "opskins": 0.18
        },
        "2": {
          "market": 0.11,
          "analyst": 0.09,
          "opskins": 0.08
        },
        "3": {
          "market": 0.15,
          "analyst": 0.12,
          "opskins": 0.11
        },
        "4": {
          "market": 0.44,
          "analyst": 0.33,
          "opskins": 0.48
        }
      },
      "stattrak": {
        "0": {
          "market": 0.65,
          "analyst": 0.58,
          "opskins": 0.52
        },
        "1": {
          "market": 1.04,
          "analyst": 1.16,
          "opskins": 1.32
        },
        "2": {
          "market": 0.64,
          "analyst": 0.56,
          "opskins": 0.53
        },
        "3": {
          "market": 0.88,
          "analyst": 0.8,
          "opskins": 0.68
        },
        "4": {
          "market": 2.47,
          "analyst": 2.17,
          "opskins": 1.86
        }
      },
      "souvenir": {}
    }
  },
  "462": {
    "item_id": 462,
    "type": "Dual Berettas",
    "skinName": "Dualing Dragons",
    "prices": {
      "default": {
        "0": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "2": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "3": {
          "market": 0.14,
          "analyst": 0.1,
          "opskins": 0.09
        },
        "4": {
          "market": 0.63,
          "analyst": 0.55,
          "opskins": 0.43
        }
      },
      "stattrak": {
        "0": {
          "market": 0.32,
          "analyst": 0.25,
          "opskins": 0.22
        },
        "1": {
          "market": 0.33,
          "analyst": 0.25,
          "opskins": 0.22
        },
        "2": {
          "market": 0.35,
          "analyst": 0.27,
          "opskins": 0.22
        },
        "3": {
          "market": 0.63,
          "analyst": 0.51,
          "opskins": 0.41
        },
        "4": {
          "market": 3.76,
          "analyst": 3.04,
          "opskins": 2.51
        }
      },
      "souvenir": {}
    }
  },
  "463": {
    "item_id": 463,
    "type": "M249",
    "skinName": "Nebula Crusader",
    "prices": {
      "default": {
        "0": {
          "market": 0.43,
          "analyst": 0.31,
          "opskins": 0.28
        },
        "1": {
          "market": 0.45,
          "analyst": 0.34,
          "opskins": 0.36
        },
        "2": {
          "market": 0.47,
          "analyst": 0.34,
          "opskins": 0.27
        },
        "3": {
          "market": 0.67,
          "analyst": 0.48,
          "opskins": 0.38
        },
        "4": {
          "market": 1.37,
          "analyst": 1.08,
          "opskins": 0.89
        }
      },
      "stattrak": {
        "0": {
          "market": 0.99,
          "analyst": 0.78,
          "opskins": 0.74
        },
        "1": {
          "market": 1.08,
          "analyst": 0.91,
          "opskins": 0.78
        },
        "2": {
          "market": 1.25,
          "analyst": 0.95,
          "opskins": 0.8
        },
        "3": {
          "market": 2.02,
          "analyst": 1.59,
          "opskins": 1.33
        },
        "4": {
          "market": 5.13,
          "analyst": 4.39,
          "opskins": 3.78
        }
      },
      "souvenir": {}
    }
  },
  "464": {
    "item_id": 464,
    "type": "Galil AR",
    "skinName": "Stone Cold",
    "prices": {
      "default": {
        "0": {
          "market": 0.44,
          "analyst": 0.33,
          "opskins": 0.33
        },
        "1": {
          "market": 0.47,
          "analyst": 0.35,
          "opskins": 0.33
        },
        "2": {
          "market": 0.46,
          "analyst": 0.35,
          "opskins": 0.33
        },
        "3": {
          "market": 0.73,
          "analyst": 0.51,
          "opskins": 0.4
        },
        "4": {
          "market": 1.76,
          "analyst": 1.44,
          "opskins": 1.18
        }
      },
      "stattrak": {
        "0": {
          "market": 1.05,
          "analyst": 0.9,
          "opskins": 0.74
        },
        "1": {
          "market": 1.15,
          "analyst": 1,
          "opskins": 0.8
        },
        "2": {
          "market": 1.28,
          "analyst": 1.06,
          "opskins": 0.83
        },
        "3": {
          "market": 2.3,
          "analyst": 1.85,
          "opskins": 1.5
        },
        "4": {
          "market": 7.28,
          "analyst": 6.63,
          "opskins": 5.75
        }
      },
      "souvenir": {}
    }
  },
  "465": {
    "item_id": 465,
    "type": "MP7",
    "skinName": "Special Delivery",
    "prices": {
      "default": {
        "0": {
          "market": 0.44,
          "analyst": 0.31,
          "opskins": 0.3
        },
        "1": {
          "market": 0.45,
          "analyst": 0.38,
          "opskins": 0.34
        },
        "2": {
          "market": 0.47,
          "analyst": 0.34,
          "opskins": 0.27
        },
        "3": {
          "market": 0.63,
          "analyst": 0.48,
          "opskins": 0.37
        },
        "4": {
          "market": 1.14,
          "analyst": 0.9,
          "opskins": 0.77
        }
      },
      "stattrak": {
        "0": {
          "market": 1,
          "analyst": 0.81,
          "opskins": 0.74
        },
        "1": {
          "market": 1.13,
          "analyst": 1.08,
          "opskins": 0.83
        },
        "2": {
          "market": 1.21,
          "analyst": 0.95,
          "opskins": 0.79
        },
        "3": {
          "market": 2.05,
          "analyst": 1.66,
          "opskins": 1.4
        },
        "4": {
          "market": 4.01,
          "analyst": 3.56,
          "opskins": 3.1
        }
      },
      "souvenir": {}
    }
  },
  "466": {
    "item_id": 466,
    "type": "P250",
    "skinName": "Wingshot",
    "prices": {
      "default": {
        "0": {
          "market": 0.46,
          "analyst": 0.33,
          "opskins": 0.29
        },
        "1": {
          "market": 0.5,
          "analyst": 0.37,
          "opskins": 0.29
        },
        "2": {
          "market": 0.49,
          "analyst": 0.34,
          "opskins": 0.28
        },
        "3": {
          "market": 0.76,
          "analyst": 0.57,
          "opskins": 0.46
        },
        "4": {
          "market": 1.81,
          "analyst": 1.64,
          "opskins": 1.36
        }
      },
      "stattrak": {
        "0": {
          "market": 1.39,
          "analyst": 1.11,
          "opskins": 0.93
        },
        "1": {
          "market": 1.51,
          "analyst": 1.32,
          "opskins": 1.1
        },
        "2": {
          "market": 1.59,
          "analyst": 1.22,
          "opskins": 0.94
        },
        "3": {
          "market": 3,
          "analyst": 2.23,
          "opskins": 1.85
        },
        "4": {
          "market": 7.98,
          "analyst": 6.78,
          "opskins": 6.23
        }
      },
      "souvenir": {}
    }
  },
  "467": {
    "item_id": 467,
    "type": "G3SG1",
    "skinName": "Flux",
    "prices": {
      "default": {
        "0": {
          "market": 1.88,
          "analyst": 1.63,
          "opskins": 1.43
        },
        "1": {
          "market": 1.94,
          "analyst": 1.72,
          "opskins": 1.42
        },
        "2": {
          "market": 2,
          "analyst": 1.78,
          "opskins": 1.44
        },
        "3": {
          "market": 2.99,
          "analyst": 2.56,
          "opskins": 2.15
        },
        "4": {
          "market": 5.22,
          "analyst": 4.99,
          "opskins": 4.35
        }
      },
      "stattrak": {
        "0": {
          "market": 5.16,
          "analyst": 4.39,
          "opskins": 55
        },
        "1": {
          "market": 5.44,
          "analyst": 5.18,
          "opskins": 5.67
        },
        "2": {
          "market": 6.16,
          "analyst": 5.09,
          "opskins": 5.34
        },
        "3": {
          "market": 11.13,
          "analyst": 11.06,
          "opskins": 9.9
        },
        "4": {
          "market": 23.6,
          "analyst": 28.1,
          "opskins": 24.76
        }
      },
      "souvenir": {}
    }
  },
  "468": {
    "item_id": 468,
    "type": "SSG 08",
    "skinName": "Big Iron",
    "prices": {
      "default": {
        "0": {
          "market": 2.1,
          "analyst": 1.74,
          "opskins": 1.54
        },
        "1": {
          "market": 2.31,
          "analyst": 2,
          "opskins": 1.65
        },
        "2": {
          "market": 2.27,
          "analyst": 1.92,
          "opskins": 1.55
        },
        "3": {
          "market": 3.29,
          "analyst": 2.72,
          "opskins": 2.3
        },
        "4": {
          "market": 5.18,
          "analyst": 4.4,
          "opskins": 3.78
        }
      },
      "stattrak": {
        "0": {
          "market": 6,
          "analyst": 4.94,
          "opskins": 4.9
        },
        "1": {
          "market": 7.43,
          "analyst": 5.37,
          "opskins": 5.24
        },
        "2": {
          "market": 6.66,
          "analyst": 5.84,
          "opskins": 4.94
        },
        "3": {
          "market": 12.92,
          "analyst": 11.2,
          "opskins": 10.07
        },
        "4": {
          "market": 21.62,
          "analyst": 20.33,
          "opskins": 18.99
        }
      },
      "souvenir": {}
    }
  },
  "469": {
    "item_id": 469,
    "type": "USP-S",
    "skinName": "Kill Confirmed",
    "prices": {
      "default": {
        "0": {
          "market": 20.36,
          "analyst": 16.22,
          "opskins": 14.18
        },
        "1": {
          "market": 21.78,
          "analyst": 17.6,
          "opskins": 15.31
        },
        "2": {
          "market": 24.54,
          "analyst": 19.95,
          "opskins": 17.34
        },
        "3": {
          "market": 34.36,
          "analyst": 27.83,
          "opskins": 24.42
        },
        "4": {
          "market": 57.97,
          "analyst": 49.97,
          "opskins": 42.9
        }
      },
      "stattrak": {
        "0": {
          "market": 62.09,
          "analyst": 53.32,
          "opskins": 48.35
        },
        "1": {
          "market": 68.76,
          "analyst": 61.66,
          "opskins": 53.02
        },
        "2": {
          "market": 85.26,
          "analyst": 75.59,
          "opskins": 63.45
        },
        "3": {
          "market": 130.81,
          "analyst": 113.06,
          "opskins": 87.99
        },
        "4": {
          "market": 257.06,
          "analyst": 240.75,
          "opskins": 191.99
        }
      },
      "souvenir": {}
    }
  },
  "470": {
    "item_id": 470,
    "type": "MP7",
    "skinName": "Skulls",
    "prices": {
      "default": {
        "2": {
          "market": 0.72,
          "analyst": 0.61,
          "opskins": 0.57
        },
        "3": {
          "market": 0.83,
          "analyst": 0.74,
          "opskins": 0.69
        }
      },
      "stattrak": {
        "2": {
          "market": 1.72,
          "analyst": 1.41,
          "opskins": 1.23
        },
        "3": {
          "market": 2.2,
          "analyst": 2.1,
          "opskins": 1.68
        }
      },
      "souvenir": {}
    }
  },
  "471": {
    "item_id": 471,
    "type": "AUG",
    "skinName": "Wings",
    "prices": {
      "default": {
        "3": {
          "market": 0.84,
          "analyst": 0.7,
          "opskins": 0.98
        },
        "4": {
          "market": 0.79,
          "analyst": 0.7,
          "opskins": 0.68
        }
      },
      "stattrak": {
        "3": {
          "market": 2.29,
          "analyst": 1.92,
          "opskins": 1.5
        },
        "4": {
          "market": 2.41,
          "analyst": 1.98,
          "opskins": 1.58
        }
      },
      "souvenir": {}
    }
  },
  "472": {
    "item_id": 472,
    "type": "SG 553",
    "skinName": "Ultraviolet",
    "prices": {
      "default": {
        "0": {
          "market": 0.74,
          "analyst": 0.59,
          "opskins": 1.3
        },
        "1": {
          "market": 0.73,
          "analyst": 0.68,
          "opskins": 0.67
        },
        "2": {
          "market": 0.71,
          "analyst": 0.63,
          "opskins": 0.7
        },
        "3": {
          "market": 1,
          "analyst": 0.78,
          "opskins": 0.7
        },
        "4": {
          "market": 5.87,
          "analyst": 5.7,
          "opskins": 5.22
        }
      },
      "stattrak": {
        "0": {
          "market": 1.55,
          "analyst": 1.24,
          "opskins": 1.34
        },
        "1": {
          "market": 1.64,
          "analyst": 1.41,
          "opskins": 1.28
        },
        "2": {
          "market": 1.65,
          "analyst": 1.33,
          "opskins": 1.27
        },
        "3": {
          "market": 2.94,
          "analyst": 2.4,
          "opskins": 2.14
        },
        "4": {
          "market": 25.44,
          "analyst": 30.01,
          "opskins": 29.08
        }
      },
      "souvenir": {}
    }
  },
  "473": {
    "item_id": 473,
    "type": "Glock-18",
    "skinName": "Dragon Tattoo",
    "prices": {
      "default": {
        "3": {
          "market": 7.44,
          "analyst": 6.09,
          "opskins": 5.64
        },
        "4": {
          "market": 7.18,
          "analyst": 5.74,
          "opskins": 4.86
        }
      },
      "stattrak": {
        "3": {
          "market": 21.73,
          "analyst": 19.96,
          "opskins": 17.37
        },
        "4": {
          "market": 24.14,
          "analyst": 18.89,
          "opskins": 17
        }
      },
      "souvenir": {}
    }
  },
  "474": {
    "item_id": 474,
    "type": "USP-S",
    "skinName": "Dark Water",
    "prices": {
      "default": {
        "2": {
          "market": 5.88,
          "analyst": 4.8,
          "opskins": 4.8
        },
        "3": {
          "market": 6.48,
          "analyst": 5.2,
          "opskins": 5.09
        }
      },
      "stattrak": {
        "2": {
          "market": 13.57,
          "analyst": 13.79,
          "opskins": 11.73
        },
        "3": {
          "market": 18.94,
          "analyst": 16.54,
          "opskins": 16.38
        }
      },
      "souvenir": {}
    }
  },
  "475": {
    "item_id": 475,
    "type": "M4A1-S",
    "skinName": "Dark Water",
    "prices": {
      "default": {
        "2": {
          "market": 5.95,
          "analyst": 5.01,
          "opskins": 4.75
        },
        "3": {
          "market": 6.41,
          "analyst": 5.37,
          "opskins": 4.84
        }
      },
      "stattrak": {
        "2": {
          "market": 12.96,
          "analyst": 11.69,
          "opskins": 11.36
        },
        "3": {
          "market": 17.08,
          "analyst": 14.75,
          "opskins": 13.29
        }
      },
      "souvenir": {}
    }
  },
  "476": {
    "item_id": 476,
    "type": "★ Flip Knife",
    "skinName": "Crimson Web",
    "prices": {
      "default": {
        "0": {
          "market": 61.61,
          "analyst": 49.55,
          "opskins": 46.9
        },
        "1": {
          "market": 82.97,
          "analyst": 69.92,
          "opskins": 56.43
        },
        "2": {
          "market": 88.75,
          "analyst": 70.9,
          "opskins": 60
        },
        "3": {
          "market": 160.14,
          "analyst": 145.03,
          "opskins": 117.78
        },
        "4": {
          "market": 476.41,
          "analyst": 483,
          "opskins": 875
        }
      },
      "stattrak": {
        "0": {
          "market": 81.75,
          "analyst": 84.6,
          "opskins": 74
        },
        "1": {
          "market": 96.73,
          "analyst": 112.62,
          "opskins": 90
        },
        "2": {
          "market": 107.52,
          "analyst": 101.21,
          "opskins": 85.81
        },
        "3": {
          "market": 280,
          "analyst": 209.02,
          "opskins": 248.99
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "477": {
    "item_id": 477,
    "type": "★ Butterfly Knife",
    "skinName": "Crimson Web",
    "prices": {
      "default": {
        "0": {
          "market": 84.53,
          "analyst": 73.67,
          "opskins": 61.35
        },
        "1": {
          "market": 107.5,
          "analyst": 96.22,
          "opskins": 79.08
        },
        "2": {
          "market": 114.91,
          "analyst": 95.17,
          "opskins": 82.98
        },
        "3": {
          "market": 206.04,
          "analyst": 182.92,
          "opskins": 156.79
        },
        "4": {
          "market": 852.57,
          "analyst": 703,
          "opskins": 749.99
        }
      },
      "stattrak": {
        "0": {
          "market": 113.4,
          "analyst": 116.82,
          "opskins": 110
        },
        "1": {
          "market": 134.7,
          "analyst": 174.9,
          "opskins": 144.99
        },
        "2": {
          "market": 156.17,
          "analyst": 158.11,
          "opskins": 135.88
        },
        "3": {
          "market": 291.6,
          "analyst": 394.39,
          "opskins": 298.89
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": 2899
        }
      },
      "souvenir": {}
    }
  },
  "478": {
    "item_id": 478,
    "type": "★ Gut Knife",
    "skinName": "Night",
    "prices": {
      "default": {
        "0": {
          "market": 41.77,
          "analyst": 30.91,
          "opskins": 29.25
        },
        "1": {
          "market": 44.09,
          "analyst": 33.6,
          "opskins": 30.38
        },
        "2": {
          "market": 44.07,
          "analyst": 32,
          "opskins": 28.93
        },
        "3": {
          "market": 60.45,
          "analyst": 49.06,
          "opskins": 42.12
        },
        "4": {
          "market": 130.71,
          "analyst": 134.1,
          "opskins": 160
        }
      },
      "stattrak": {
        "0": {
          "market": 41.08,
          "analyst": 47.5,
          "opskins": 40.27
        },
        "1": {
          "market": 47.2,
          "analyst": 107.68,
          "opskins": 88.28
        },
        "2": {
          "market": 52.12,
          "analyst": 47.01,
          "opskins": 41.57
        },
        "3": {
          "market": 80.22,
          "analyst": 76.62,
          "opskins": 63.34
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "479": {
    "item_id": 479,
    "type": "Tec-9",
    "skinName": "Blue Titanium",
    "prices": {
      "default": {
        "4": {
          "market": 1.03,
          "analyst": 0.83,
          "opskins": 0.82
        }
      },
      "stattrak": {
        "4": {
          "market": 2.67,
          "analyst": 2.61,
          "opskins": 2.62
        }
      },
      "souvenir": {}
    }
  },
  "480": {
    "item_id": 480,
    "type": "M4A1-S",
    "skinName": "Blood Tiger",
    "prices": {
      "default": {
        "2": {
          "market": 1.8,
          "analyst": 1.44,
          "opskins": 1.24
        },
        "3": {
          "market": 1.9,
          "analyst": 1.51,
          "opskins": 1.3
        },
        "4": {
          "market": 2.4,
          "analyst": 2.05,
          "opskins": 1.71
        }
      },
      "stattrak": {
        "2": {
          "market": 7.61,
          "analyst": 6.69,
          "opskins": 5.85
        },
        "3": {
          "market": 7.85,
          "analyst": 6.6,
          "opskins": 5.59
        },
        "4": {
          "market": 10.54,
          "analyst": 9.28,
          "opskins": 8.32
        }
      },
      "souvenir": {}
    }
  },
  "481": {
    "item_id": 481,
    "type": "FAMAS",
    "skinName": "Hexane",
    "prices": {
      "default": {
        "1": {
          "market": 0.85,
          "analyst": 0.81,
          "opskins": 0.73
        },
        "2": {
          "market": 0.59,
          "analyst": 0.54,
          "opskins": 0.68
        },
        "3": {
          "market": 0.79,
          "analyst": 0.66,
          "opskins": 0.73
        },
        "4": {
          "market": 1.08,
          "analyst": 0.87,
          "opskins": 0.74
        }
      },
      "stattrak": {
        "1": {
          "market": 2.78,
          "analyst": 2.53,
          "opskins": 2.65
        },
        "2": {
          "market": 1.21,
          "analyst": 1.16,
          "opskins": 0.99
        },
        "3": {
          "market": 1.82,
          "analyst": 1.55,
          "opskins": 1.28
        },
        "4": {
          "market": 2.99,
          "analyst": 2.79,
          "opskins": 3.4
        }
      },
      "souvenir": {}
    }
  },
  "482": {
    "item_id": 482,
    "type": "P250",
    "skinName": "Hive",
    "prices": {
      "default": {
        "2": {
          "market": 0.71,
          "analyst": 0.63,
          "opskins": 0.65
        },
        "3": {
          "market": 0.8,
          "analyst": 0.7,
          "opskins": 0.65
        },
        "4": {
          "market": 1.06,
          "analyst": 0.89,
          "opskins": 0.84
        }
      },
      "stattrak": {
        "2": {
          "market": 1.64,
          "analyst": 1.45,
          "opskins": 1.32
        },
        "3": {
          "market": 2.06,
          "analyst": 1.75,
          "opskins": 1.58
        },
        "4": {
          "market": 3.32,
          "analyst": 3.02,
          "opskins": 3.43
        }
      },
      "souvenir": {}
    }
  },
  "483": {
    "item_id": 483,
    "type": "SCAR-20",
    "skinName": "Crimson Web",
    "prices": {
      "default": {
        "0": {
          "market": 0.48,
          "analyst": 0.45,
          "opskins": 0.49
        },
        "1": {
          "market": 0.53,
          "analyst": 0.5,
          "opskins": 0.44
        },
        "2": {
          "market": 0.58,
          "analyst": 0.53,
          "opskins": 0.55
        },
        "3": {
          "market": 0.86,
          "analyst": 0.69,
          "opskins": 0.64
        },
        "4": {
          "market": 3.49,
          "analyst": 2.86,
          "opskins": 2.6
        }
      },
      "stattrak": {
        "0": {
          "market": 0.96,
          "analyst": 0.89,
          "opskins": 0.85
        },
        "1": {
          "market": 1.09,
          "analyst": 1.02,
          "opskins": 1.25
        },
        "2": {
          "market": 1.08,
          "analyst": 0.93,
          "opskins": 0.86
        },
        "3": {
          "market": 2.2,
          "analyst": 1.83,
          "opskins": 1.47
        },
        "4": {
          "market": 20.47,
          "analyst": 23.39,
          "opskins": 21.55
        }
      },
      "souvenir": {}
    }
  },
  "484": {
    "item_id": 484,
    "type": "Five-SeveN",
    "skinName": "Case Hardened",
    "prices": {
      "default": {
        "0": {
          "market": 2.62,
          "analyst": 2.02,
          "opskins": 2.01
        },
        "1": {
          "market": 2.79,
          "analyst": 2.25,
          "opskins": 1.95
        },
        "2": {
          "market": 3.19,
          "analyst": 2.53,
          "opskins": 2.22
        },
        "3": {
          "market": 5.05,
          "analyst": 4.12,
          "opskins": 3.5
        },
        "4": {
          "market": 10.61,
          "analyst": 9.31,
          "opskins": 8.58
        }
      },
      "stattrak": {
        "0": {
          "market": 8.92,
          "analyst": 7.47,
          "opskins": 6.93
        },
        "1": {
          "market": 9.11,
          "analyst": 8.96,
          "opskins": 7.7
        },
        "2": {
          "market": 10.81,
          "analyst": 9.31,
          "opskins": 8
        },
        "3": {
          "market": 17.79,
          "analyst": 19.58,
          "opskins": 17.92
        },
        "4": {
          "market": 51.47,
          "analyst": 39.85,
          "opskins": 34.95
        }
      },
      "souvenir": {}
    }
  },
  "485": {
    "item_id": 485,
    "type": "MP9",
    "skinName": "Hypnotic",
    "prices": {
      "default": {
        "3": {
          "market": 2.49,
          "analyst": 2.39,
          "opskins": 2.13
        },
        "4": {
          "market": 1.14,
          "analyst": 0.95,
          "opskins": 0.76
        }
      },
      "stattrak": {
        "3": {
          "market": 6.6,
          "analyst": 12.06,
          "opskins": 14.99
        },
        "4": {
          "market": 4.35,
          "analyst": 3.94,
          "opskins": 3.33
        }
      },
      "souvenir": {}
    }
  },
  "486": {
    "item_id": 486,
    "type": "Nova",
    "skinName": "Graphite",
    "prices": {
      "default": {
        "3": {
          "market": 0.89,
          "analyst": 0.81,
          "opskins": 0.64
        },
        "4": {
          "market": 0.89,
          "analyst": 0.73,
          "opskins": 0.6
        }
      },
      "stattrak": {
        "3": {
          "market": 2.88,
          "analyst": 2.86,
          "opskins": 2.45
        },
        "4": {
          "market": 3.29,
          "analyst": 2.97,
          "opskins": 2.79
        }
      },
      "souvenir": {}
    }
  },
  "487": {
    "item_id": 487,
    "type": "Dual Berettas",
    "skinName": "Hemoglobin",
    "prices": {
      "default": {
        "2": {
          "market": 0.94,
          "analyst": 0.73,
          "opskins": 0.68
        },
        "3": {
          "market": 1,
          "analyst": 0.77,
          "opskins": 0.68
        },
        "4": {
          "market": 0.97,
          "analyst": 0.83,
          "opskins": 0.67
        }
      },
      "stattrak": {
        "2": {
          "market": 2.63,
          "analyst": 3.25,
          "opskins": 2.72
        },
        "3": {
          "market": 2.87,
          "analyst": 3.04,
          "opskins": 2.49
        },
        "4": {
          "market": 4.45,
          "analyst": 4.49,
          "opskins": 3.83
        }
      },
      "souvenir": {}
    }
  },
  "488": {
    "item_id": 488,
    "type": "P90",
    "skinName": "Cold Blooded",
    "prices": {
      "default": {
        "3": {
          "market": 5.1,
          "analyst": 4.93,
          "opskins": 4.7
        },
        "4": {
          "market": 4.41,
          "analyst": 4.06,
          "opskins": 3.69
        }
      },
      "stattrak": {
        "3": {
          "market": 18.74,
          "analyst": 22.47,
          "opskins": 21
        },
        "4": {
          "market": 20.8,
          "analyst": 19.21,
          "opskins": 18.89
        }
      },
      "souvenir": {}
    }
  },
  "489": {
    "item_id": 489,
    "type": "USP-S",
    "skinName": "Serum",
    "prices": {
      "default": {
        "2": {
          "market": 5.62,
          "analyst": 5.11,
          "opskins": 5.65
        },
        "3": {
          "market": 5.99,
          "analyst": 5.21,
          "opskins": 5.09
        },
        "4": {
          "market": 6.96,
          "analyst": 6.34,
          "opskins": 6.03
        }
      },
      "stattrak": {
        "2": {
          "market": 16.56,
          "analyst": 16.85,
          "opskins": 15.98
        },
        "3": {
          "market": 19.7,
          "analyst": 19.72,
          "opskins": 18.05
        },
        "4": {
          "market": 25,
          "analyst": 25.32,
          "opskins": 24.32
        }
      },
      "souvenir": {}
    }
  },
  "490": {
    "item_id": 490,
    "type": "★ Karambit",
    "skinName": "Ultraviolet",
    "prices": {
      "default": {
        "0": {
          "market": 140.68,
          "analyst": 116.08,
          "opskins": 97.99
        },
        "1": {
          "market": 152.84,
          "analyst": 142.45,
          "opskins": 119.71
        },
        "2": {
          "market": 156.24,
          "analyst": 134.74,
          "opskins": 108.78
        },
        "3": {
          "market": 233.84,
          "analyst": 188.74,
          "opskins": 163.95
        },
        "4": {
          "market": 1013.2,
          "analyst": 950,
          "opskins": 799.99
        }
      },
      "stattrak": {
        "0": {
          "market": 158.3,
          "analyst": 159.25,
          "opskins": 129.99
        },
        "1": {
          "market": 194.5,
          "analyst": 197.86,
          "opskins": 158.98
        },
        "2": {
          "market": 212.67,
          "analyst": 188.16,
          "opskins": 159.89
        },
        "3": {
          "market": 322,
          "analyst": 332.72,
          "opskins": 332.22
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "491": {
    "item_id": 491,
    "type": "★ Butterfly Knife",
    "skinName": "Forest DDPAT",
    "prices": {
      "default": {
        "0": {
          "market": 65.35,
          "analyst": 49.23,
          "opskins": 42.5
        },
        "1": {
          "market": 68.16,
          "analyst": 51.54,
          "opskins": 46.05
        },
        "2": {
          "market": 70.23,
          "analyst": 52.04,
          "opskins": 45.97
        },
        "3": {
          "market": 84.02,
          "analyst": 64.16,
          "opskins": 55.38
        },
        "4": {
          "market": 125,
          "analyst": 122.4,
          "opskins": 107.39
        }
      },
      "stattrak": {
        "0": {
          "market": 74.94,
          "analyst": 65.33,
          "opskins": 58
        },
        "1": {
          "market": 71.35,
          "analyst": 83.99,
          "opskins": 71.89
        },
        "2": {
          "market": 84.77,
          "analyst": 70.54,
          "opskins": 61.9
        },
        "3": {
          "market": 101.53,
          "analyst": 106.5,
          "opskins": 84.19
        },
        "4": {
          "market": -1,
          "analyst": 703,
          "opskins": 800
        }
      },
      "souvenir": {}
    }
  },
  "492": {
    "item_id": 492,
    "type": "★ Huntsman Knife",
    "skinName": "Blue Steel",
    "prices": {
      "default": {
        "0": {
          "market": 75.76,
          "analyst": 55.19,
          "opskins": 49.22
        },
        "1": {
          "market": 73.92,
          "analyst": 55.59,
          "opskins": 49.83
        },
        "2": {
          "market": 78.44,
          "analyst": 58.22,
          "opskins": 51.11
        },
        "3": {
          "market": 90.02,
          "analyst": 67.86,
          "opskins": 60.98
        },
        "4": {
          "market": 100.75,
          "analyst": 124.54,
          "opskins": 109.79
        }
      },
      "stattrak": {
        "0": {
          "market": 104.4,
          "analyst": 102.18,
          "opskins": 109
        },
        "1": {
          "market": 90.36,
          "analyst": 100.89,
          "opskins": 83.99
        },
        "2": {
          "market": 96.06,
          "analyst": 90.14,
          "opskins": 78
        },
        "3": {
          "market": 120,
          "analyst": 118.45,
          "opskins": 111.11
        },
        "4": {
          "market": 341.9,
          "analyst": 331,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "493": {
    "item_id": 493,
    "type": "CZ75-Auto",
    "skinName": "Crimson Web",
    "prices": {
      "default": {
        "0": {
          "market": 0.18,
          "analyst": 0.16,
          "opskins": 0.17
        },
        "1": {
          "market": 0.28,
          "analyst": 0.2,
          "opskins": 0.21
        },
        "2": {
          "market": 0.22,
          "analyst": 0.18,
          "opskins": 0.19
        },
        "3": {
          "market": 0.54,
          "analyst": 0.46,
          "opskins": 0.37
        },
        "4": {
          "market": 7.29,
          "analyst": 6,
          "opskins": 5.74
        }
      },
      "stattrak": {
        "0": {
          "market": 0.53,
          "analyst": 0.43,
          "opskins": 0.53
        },
        "1": {
          "market": 0.73,
          "analyst": 0.61,
          "opskins": 0.48
        },
        "2": {
          "market": 0.61,
          "analyst": 0.5,
          "opskins": 0.42
        },
        "3": {
          "market": 3.08,
          "analyst": 2.42,
          "opskins": 2.06
        },
        "4": {
          "market": 47.1,
          "analyst": 58.91,
          "opskins": 50
        }
      },
      "souvenir": {}
    }
  },
  "494": {
    "item_id": 494,
    "type": "P2000",
    "skinName": "Red FragCam",
    "prices": {
      "default": {
        "0": {
          "market": 0.17,
          "analyst": 0.15,
          "opskins": 1
        },
        "1": {
          "market": 0.28,
          "analyst": 0.2,
          "opskins": 0.5
        },
        "2": {
          "market": 0.12,
          "analyst": 0.1,
          "opskins": 0.19
        },
        "3": {
          "market": 0.17,
          "analyst": 0.15,
          "opskins": 0.15
        },
        "4": {
          "market": 0.38,
          "analyst": 0.37,
          "opskins": 0.33
        }
      },
      "stattrak": {
        "0": {
          "market": 0.45,
          "analyst": 0.48,
          "opskins": 0.47
        },
        "1": {
          "market": 0.62,
          "analyst": 0.52,
          "opskins": 0.65
        },
        "2": {
          "market": 0.47,
          "analyst": 0.42,
          "opskins": 0.39
        },
        "3": {
          "market": 0.87,
          "analyst": 0.7,
          "opskins": 0.65
        },
        "4": {
          "market": 2.45,
          "analyst": 2.51,
          "opskins": 2.36
        }
      },
      "souvenir": {}
    }
  },
  "495": {
    "item_id": 495,
    "type": "Dual Berettas",
    "skinName": "Panther",
    "prices": {
      "default": {
        "0": {
          "market": 0.2,
          "analyst": 0.23,
          "opskins": 0.22
        },
        "1": {
          "market": 0.39,
          "analyst": 0.42,
          "opskins": 0.45
        },
        "2": {
          "market": 0.15,
          "analyst": 0.11,
          "opskins": 0.16
        },
        "3": {
          "market": 0.38,
          "analyst": 0.36,
          "opskins": 0.31
        },
        "4": {
          "market": 0.7,
          "analyst": 0.7,
          "opskins": 0.59
        }
      },
      "stattrak": {
        "0": {
          "market": 0.44,
          "analyst": 0.39,
          "opskins": 0.44
        },
        "1": {
          "market": 1.02,
          "analyst": 0.91,
          "opskins": 1.07
        },
        "2": {
          "market": 0.51,
          "analyst": 0.44,
          "opskins": 0.37
        },
        "3": {
          "market": 1.45,
          "analyst": 1.41,
          "opskins": 1.15
        },
        "4": {
          "market": 3.19,
          "analyst": 3.03,
          "opskins": 2.57
        }
      },
      "souvenir": {}
    }
  },
  "496": {
    "item_id": 496,
    "type": "USP-S",
    "skinName": "Stainless",
    "prices": {
      "default": {
        "0": {
          "market": 1.47,
          "analyst": 0.99,
          "opskins": 1.03
        },
        "1": {
          "market": 2.31,
          "analyst": 1.56,
          "opskins": 1.7
        },
        "2": {
          "market": 1.53,
          "analyst": 1.05,
          "opskins": 1.08
        },
        "3": {
          "market": 2.49,
          "analyst": 1.83,
          "opskins": 1.74
        },
        "4": {
          "market": 5.84,
          "analyst": 4.53,
          "opskins": 4.59
        }
      },
      "stattrak": {
        "0": {
          "market": 5.65,
          "analyst": 4.54,
          "opskins": 4.55
        },
        "1": {
          "market": 8.8,
          "analyst": 6.79,
          "opskins": 7.49
        },
        "2": {
          "market": 6.02,
          "analyst": 4.88,
          "opskins": 4.57
        },
        "3": {
          "market": 10.05,
          "analyst": 8.53,
          "opskins": 7.54
        },
        "4": {
          "market": 26.01,
          "analyst": 26.96,
          "opskins": 24.8
        }
      },
      "souvenir": {}
    }
  },
  "497": {
    "item_id": 497,
    "type": "Glock-18",
    "skinName": "Blue Fissure",
    "prices": {
      "default": {
        "0": {
          "market": 0.53,
          "analyst": 0.44,
          "opskins": 0.43
        },
        "1": {
          "market": 0.81,
          "analyst": 0.66,
          "opskins": 0.94
        },
        "2": {
          "market": 0.47,
          "analyst": 0.36,
          "opskins": 0.33
        },
        "3": {
          "market": 0.84,
          "analyst": 0.67,
          "opskins": 0.55
        },
        "4": {
          "market": 5.13,
          "analyst": 4.16,
          "opskins": 3.76
        }
      },
      "stattrak": {
        "0": {
          "market": 2.34,
          "analyst": 1.99,
          "opskins": 1.6
        },
        "1": {
          "market": 3.56,
          "analyst": 3.16,
          "opskins": 2.79
        },
        "2": {
          "market": 2.42,
          "analyst": 2.07,
          "opskins": 1.65
        },
        "3": {
          "market": 4.81,
          "analyst": 3.84,
          "opskins": 3.31
        },
        "4": {
          "market": 29.7,
          "analyst": 30.19,
          "opskins": 29.99
        }
      },
      "souvenir": {}
    }
  },
  "498": {
    "item_id": 498,
    "type": "CZ75-Auto",
    "skinName": "Tread Plate",
    "prices": {
      "default": {
        "2": {
          "market": 0.43,
          "analyst": 0.43,
          "opskins": 2.99
        },
        "3": {
          "market": 0.43,
          "analyst": 0.37,
          "opskins": 0.34
        },
        "4": {
          "market": 0.57,
          "analyst": 0.43,
          "opskins": 0.47
        }
      },
      "stattrak": {
        "2": {
          "market": 1.86,
          "analyst": 1.91,
          "opskins": 3.28
        },
        "3": {
          "market": 2,
          "analyst": 1.75,
          "opskins": 1.45
        },
        "4": {
          "market": 2.95,
          "analyst": 2.26,
          "opskins": 1.98
        }
      },
      "souvenir": {}
    }
  },
  "499": {
    "item_id": 499,
    "type": "Tec-9",
    "skinName": "Titanium Bit",
    "prices": {
      "default": {
        "2": {
          "market": 0.56,
          "analyst": 0.64,
          "opskins": 0.52
        },
        "3": {
          "market": 0.57,
          "analyst": 0.42,
          "opskins": 0.37
        },
        "4": {
          "market": 0.63,
          "analyst": 0.46,
          "opskins": 0.39
        }
      },
      "stattrak": {
        "2": {
          "market": 2.52,
          "analyst": 2.32,
          "opskins": 1.91
        },
        "3": {
          "market": 2.75,
          "analyst": 2.14,
          "opskins": 2.03
        },
        "4": {
          "market": 3.76,
          "analyst": 2.92,
          "opskins": 2.63
        }
      },
      "souvenir": {}
    }
  },
  "500": {
    "item_id": 500,
    "type": "Desert Eagle",
    "skinName": "Heirloom",
    "prices": {
      "default": {
        "0": {
          "market": 1.06,
          "analyst": 0.85,
          "opskins": 0.82
        },
        "1": {
          "market": 1.64,
          "analyst": 1.34,
          "opskins": 1.63
        },
        "2": {
          "market": 0.73,
          "analyst": 0.52,
          "opskins": 0.47
        },
        "3": {
          "market": 1.32,
          "analyst": 0.96,
          "opskins": 0.79
        },
        "4": {
          "market": 4.37,
          "analyst": 3.28,
          "opskins": 3.12
        }
      },
      "stattrak": {
        "0": {
          "market": 4.97,
          "analyst": 4.08,
          "opskins": 3.9
        },
        "1": {
          "market": 7.4,
          "analyst": 8.46,
          "opskins": 6.99
        },
        "2": {
          "market": 5.28,
          "analyst": 3.69,
          "opskins": 3.44
        },
        "3": {
          "market": 8.43,
          "analyst": 6.89,
          "opskins": 6.45
        },
        "4": {
          "market": 25.11,
          "analyst": 25.88,
          "opskins": 23
        }
      },
      "souvenir": {}
    }
  },
  "501": {
    "item_id": 501,
    "type": "Five-SeveN",
    "skinName": "Copper Galaxy",
    "prices": {
      "default": {
        "2": {
          "market": 0.92,
          "analyst": 0.71,
          "opskins": 0.69
        },
        "3": {
          "market": 1.28,
          "analyst": 1.03,
          "opskins": 0.91
        },
        "4": {
          "market": 1.4,
          "analyst": 1.09,
          "opskins": 0.88
        }
      },
      "stattrak": {
        "2": {
          "market": 3.58,
          "analyst": 3.12,
          "opskins": 2.98
        },
        "3": {
          "market": 7.44,
          "analyst": 5.93,
          "opskins": 5.24
        },
        "4": {
          "market": 10.33,
          "analyst": 7.59,
          "opskins": 6.77
        }
      },
      "souvenir": {}
    }
  },
  "502": {
    "item_id": 502,
    "type": "CZ75-Auto",
    "skinName": "The Fuschia Is Now",
    "prices": {
      "default": {
        "1": {
          "market": 1.98,
          "analyst": 6.84,
          "opskins": 1.98
        },
        "2": {
          "market": 1.57,
          "analyst": 1.43,
          "opskins": 1.45
        },
        "3": {
          "market": 1.9,
          "analyst": 1.65,
          "opskins": 1.56
        },
        "4": {
          "market": 2.8,
          "analyst": 2.5,
          "opskins": 2.83
        }
      },
      "stattrak": {
        "1": {
          "market": 12.1,
          "analyst": 32,
          "opskins": 42
        },
        "2": {
          "market": 5.5,
          "analyst": 4.72,
          "opskins": 4.65
        },
        "3": {
          "market": 9.14,
          "analyst": 9.19,
          "opskins": 9.04
        },
        "4": {
          "market": 14.72,
          "analyst": 13.37,
          "opskins": 11.72
        }
      },
      "souvenir": {}
    }
  },
  "503": {
    "item_id": 503,
    "type": "P250",
    "skinName": "Undertow",
    "prices": {
      "default": {
        "2": {
          "market": 2.89,
          "analyst": 2.43,
          "opskins": 2.71
        },
        "3": {
          "market": 3.26,
          "analyst": 2.55,
          "opskins": 2.15
        },
        "4": {
          "market": 3.71,
          "analyst": 2.96,
          "opskins": 2.51
        }
      },
      "stattrak": {
        "2": {
          "market": 8.36,
          "analyst": 7.59,
          "opskins": 6.59
        },
        "3": {
          "market": 13.41,
          "analyst": 11.96,
          "opskins": 11.62
        },
        "4": {
          "market": 20.03,
          "analyst": 16.51,
          "opskins": 14.69
        }
      },
      "souvenir": {}
    }
  },
  "504": {
    "item_id": 504,
    "type": "★ Huntsman Knife",
    "skinName": "Forest DDPAT",
    "prices": {
      "default": {
        "0": {
          "market": 50.43,
          "analyst": 36.84,
          "opskins": 32.5
        },
        "1": {
          "market": 50.07,
          "analyst": 38.9,
          "opskins": 34
        },
        "2": {
          "market": 51.74,
          "analyst": 37.39,
          "opskins": 32.3
        },
        "3": {
          "market": 64.3,
          "analyst": 47.87,
          "opskins": 43
        },
        "4": {
          "market": 88.4,
          "analyst": 81.52,
          "opskins": 88.84
        }
      },
      "stattrak": {
        "0": {
          "market": 50.9,
          "analyst": 62.6,
          "opskins": 100
        },
        "1": {
          "market": 53.3,
          "analyst": 86.11,
          "opskins": 86.11
        },
        "2": {
          "market": 55.71,
          "analyst": 53.85,
          "opskins": 51.99
        },
        "3": {
          "market": 88.99,
          "analyst": 85.48,
          "opskins": 109.98
        },
        "4": {
          "market": 323.58,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "505": {
    "item_id": 505,
    "type": "M4A4",
    "skinName": "Faded Zebra",
    "prices": {
      "default": {
        "0": {
          "market": 0.83,
          "analyst": 0.6,
          "opskins": 0.85
        },
        "1": {
          "market": 0.85,
          "analyst": 0.68,
          "opskins": 0.85
        },
        "2": {
          "market": 0.86,
          "analyst": 0.62,
          "opskins": 0.8
        },
        "3": {
          "market": 1.15,
          "analyst": 0.87,
          "opskins": 1.07
        },
        "4": {
          "market": 4.01,
          "analyst": 3.83,
          "opskins": 4.1
        }
      },
      "stattrak": {
        "0": {
          "market": 4.42,
          "analyst": 3.32,
          "opskins": 3.69
        },
        "1": {
          "market": 3.87,
          "analyst": 3.01,
          "opskins": 2.81
        },
        "2": {
          "market": 3.68,
          "analyst": 2.78,
          "opskins": 2.97
        },
        "3": {
          "market": 4.78,
          "analyst": 3.72,
          "opskins": 3.5
        },
        "4": {
          "market": 21.74,
          "analyst": 19.92,
          "opskins": 23.49
        }
      },
      "souvenir": {}
    }
  },
  "506": {
    "item_id": 506,
    "type": "MAG-7",
    "skinName": "Memento",
    "prices": {
      "default": {
        "2": {
          "market": 0.55,
          "analyst": 0.66,
          "opskins": 1.57
        },
        "3": {
          "market": 0.56,
          "analyst": 0.53,
          "opskins": 0.43
        },
        "4": {
          "market": 1.17,
          "analyst": 0.88,
          "opskins": 0.91
        }
      },
      "stattrak": {
        "2": {
          "market": 1.04,
          "analyst": 0.92,
          "opskins": 1.5
        },
        "3": {
          "market": 1.22,
          "analyst": 1.07,
          "opskins": 0.87
        },
        "4": {
          "market": 5.4,
          "analyst": 4.32,
          "opskins": 3.67
        }
      },
      "souvenir": {}
    }
  },
  "507": {
    "item_id": 507,
    "type": "FAMAS",
    "skinName": "Doomkitty",
    "prices": {
      "default": {
        "2": {
          "market": 0.59,
          "analyst": 0.5,
          "opskins": 0.54
        },
        "3": {
          "market": 0.56,
          "analyst": 0.51,
          "opskins": 0.67
        }
      },
      "stattrak": {
        "2": {
          "market": 1.08,
          "analyst": 0.99,
          "opskins": 0.84
        },
        "3": {
          "market": 1.21,
          "analyst": 1.03,
          "opskins": 0.84
        }
      },
      "souvenir": {}
    }
  },
  "508": {
    "item_id": 508,
    "type": "Galil AR",
    "skinName": "Orange DDPAT",
    "prices": {
      "default": {
        "0": {
          "market": 2.01,
          "analyst": 2.14,
          "opskins": 2.26
        },
        "1": {
          "market": 2.26,
          "analyst": 2.08,
          "opskins": 6
        },
        "2": {
          "market": 2.3,
          "analyst": 1.93,
          "opskins": 1.85
        },
        "3": {
          "market": 3.07,
          "analyst": 2.27,
          "opskins": 2.68
        },
        "4": {
          "market": 14.05,
          "analyst": 12.52,
          "opskins": 12.73
        }
      },
      "stattrak": {
        "0": {
          "market": 4.32,
          "analyst": 4.28,
          "opskins": 3.45
        },
        "1": {
          "market": 4.25,
          "analyst": 4.58,
          "opskins": 5
        },
        "2": {
          "market": 4.78,
          "analyst": 4,
          "opskins": 3.8
        },
        "3": {
          "market": 8.38,
          "analyst": 8.28,
          "opskins": 7.98
        },
        "4": {
          "market": 15.65,
          "analyst": 147.76,
          "opskins": 124.99
        }
      },
      "souvenir": {}
    }
  },
  "509": {
    "item_id": 509,
    "type": "Sawed-Off",
    "skinName": "Orange DDPAT",
    "prices": {
      "default": {
        "0": {
          "market": 2.17,
          "analyst": 2.06,
          "opskins": 2.99
        },
        "1": {
          "market": 2.9,
          "analyst": 3.49,
          "opskins": 2.95
        },
        "2": {
          "market": 2.43,
          "analyst": 1.83,
          "opskins": 1.81
        },
        "3": {
          "market": 3.08,
          "analyst": 2.7,
          "opskins": 2.44
        },
        "4": {
          "market": 8.55,
          "analyst": 11.4,
          "opskins": 11.5
        }
      },
      "stattrak": {
        "0": {
          "market": 4.27,
          "analyst": 4.38,
          "opskins": 3.7
        },
        "1": {
          "market": 4.18,
          "analyst": 4.26,
          "opskins": 4.19
        },
        "2": {
          "market": 4.91,
          "analyst": 4.29,
          "opskins": 3.98
        },
        "3": {
          "market": 7.43,
          "analyst": 6.26,
          "opskins": 5.69
        },
        "4": {
          "market": 67.82,
          "analyst": 66.66,
          "opskins": 68.1
        }
      },
      "souvenir": {}
    }
  },
  "510": {
    "item_id": 510,
    "type": "P250",
    "skinName": "Splash",
    "prices": {
      "default": {
        "2": {
          "market": 3.36,
          "analyst": 3.31,
          "opskins": 2.8
        },
        "3": {
          "market": 3.67,
          "analyst": 2.71,
          "opskins": 2.41
        },
        "4": {
          "market": 10.52,
          "analyst": 9.76,
          "opskins": 8.5
        }
      },
      "stattrak": {
        "2": {
          "market": 10.57,
          "analyst": 10.73,
          "opskins": 10.99
        },
        "3": {
          "market": 11.25,
          "analyst": 8.53,
          "opskins": 7.73
        },
        "4": {
          "market": 30.43,
          "analyst": 31.33,
          "opskins": 27.75
        }
      },
      "souvenir": {}
    }
  },
  "511": {
    "item_id": 511,
    "type": "AWP",
    "skinName": "BOOM",
    "prices": {
      "default": {
        "2": {
          "market": 18.14,
          "analyst": 13.32,
          "opskins": 12
        },
        "3": {
          "market": 22.83,
          "analyst": 16.89,
          "opskins": 14.9
        },
        "4": {
          "market": 83.86,
          "analyst": 63.56,
          "opskins": 57.93
        }
      },
      "stattrak": {
        "2": {
          "market": 51.2,
          "analyst": 39.19,
          "opskins": 35.55
        },
        "3": {
          "market": 73.71,
          "analyst": 56.01,
          "opskins": 49
        },
        "4": {
          "market": 350,
          "analyst": 263,
          "opskins": 350
        }
      },
      "souvenir": {}
    }
  },
  "512": {
    "item_id": 512,
    "type": "★ Karambit",
    "skinName": "Case Hardened",
    "prices": {
      "default": {
        "0": {
          "market": 172.88,
          "analyst": 160.7,
          "opskins": 140.63
        },
        "1": {
          "market": 186.4,
          "analyst": 166.32,
          "opskins": 139.95
        },
        "2": {
          "market": 193.17,
          "analyst": 172.76,
          "opskins": 140.92
        },
        "3": {
          "market": 212.56,
          "analyst": 202.67,
          "opskins": 168.51
        },
        "4": {
          "market": 350.65,
          "analyst": 360.67,
          "opskins": 311.99
        }
      },
      "stattrak": {
        "0": {
          "market": 314.68,
          "analyst": -1,
          "opskins": 268.99
        },
        "1": {
          "market": 305.55,
          "analyst": 354.56,
          "opskins": 269.99
        },
        "2": {
          "market": 320.65,
          "analyst": 323.48,
          "opskins": 269
        },
        "3": {
          "market": 325.35,
          "analyst": 368.29,
          "opskins": 282
        },
        "4": {
          "market": 704.25,
          "analyst": 868,
          "opskins": 530
        }
      },
      "souvenir": {}
    }
  },
  "513": {
    "item_id": 513,
    "type": "★ Flip Knife",
    "skinName": "Case Hardened",
    "prices": {
      "default": {
        "0": {
          "market": 64.41,
          "analyst": 56.23,
          "opskins": 51.56
        },
        "1": {
          "market": 66.67,
          "analyst": 55.29,
          "opskins": 49.59
        },
        "2": {
          "market": 69.26,
          "analyst": 57.38,
          "opskins": 51
        },
        "3": {
          "market": 75.54,
          "analyst": 68.86,
          "opskins": 58.16
        },
        "4": {
          "market": 97.56,
          "analyst": 89.16,
          "opskins": 76.97
        }
      },
      "stattrak": {
        "0": {
          "market": 70.96,
          "analyst": 94.89,
          "opskins": 76.99
        },
        "1": {
          "market": 75.94,
          "analyst": 88.56,
          "opskins": 77.03
        },
        "2": {
          "market": 99.85,
          "analyst": 99.57,
          "opskins": 99.7
        },
        "3": {
          "market": 105.33,
          "analyst": 108.36,
          "opskins": 97.97
        },
        "4": {
          "market": 170.16,
          "analyst": -1,
          "opskins": 249.95
        }
      },
      "souvenir": {}
    }
  },
  "514": {
    "item_id": 514,
    "type": "★ M9 Bayonet",
    "skinName": "Boreal Forest",
    "prices": {
      "default": {
        "0": {
          "market": 77.64,
          "analyst": 55.91,
          "opskins": 53.08
        },
        "1": {
          "market": 78.63,
          "analyst": 61.04,
          "opskins": 51.94
        },
        "2": {
          "market": 81.95,
          "analyst": 61.93,
          "opskins": 53.6
        },
        "3": {
          "market": 101.98,
          "analyst": 77.44,
          "opskins": 72.68
        },
        "4": {
          "market": 244.8,
          "analyst": 287.31,
          "opskins": 279
        }
      },
      "stattrak": {
        "0": {
          "market": 65.66,
          "analyst": 65.07,
          "opskins": 67.96
        },
        "1": {
          "market": 92.25,
          "analyst": 102.81,
          "opskins": 78
        },
        "2": {
          "market": 96.63,
          "analyst": 83.48,
          "opskins": 70
        },
        "3": {
          "market": 135.5,
          "analyst": 135.76,
          "opskins": 141
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "515": {
    "item_id": 515,
    "type": "Galil AR",
    "skinName": "Blue Titanium",
    "prices": {
      "default": {
        "4": {
          "market": 0.33,
          "analyst": 0.23,
          "opskins": 0.22
        }
      },
      "stattrak": {
        "4": {
          "market": 1.33,
          "analyst": 1.06,
          "opskins": 0.97
        }
      },
      "souvenir": {}
    }
  },
  "516": {
    "item_id": 516,
    "type": "Five-SeveN",
    "skinName": "Nightshade",
    "prices": {
      "default": {
        "0": {
          "market": 0.26,
          "analyst": 0.41,
          "opskins": 2
        },
        "1": {
          "market": 0.33,
          "analyst": 0.26,
          "opskins": 0.51
        },
        "2": {
          "market": 0.22,
          "analyst": 0.21,
          "opskins": 0.36
        },
        "3": {
          "market": 0.33,
          "analyst": 0.32,
          "opskins": 0.36
        },
        "4": {
          "market": 0.44,
          "analyst": 0.35,
          "opskins": 0.28
        }
      },
      "stattrak": {
        "0": {
          "market": 0.84,
          "analyst": 0.57,
          "opskins": 0.6
        },
        "1": {
          "market": 0.83,
          "analyst": 0.68,
          "opskins": 0.67
        },
        "2": {
          "market": 0.72,
          "analyst": 0.6,
          "opskins": 0.51
        },
        "3": {
          "market": 1.09,
          "analyst": 0.85,
          "opskins": 0.68
        },
        "4": {
          "market": 1.66,
          "analyst": 1.34,
          "opskins": 1.21
        }
      },
      "souvenir": {}
    }
  },
  "517": {
    "item_id": 517,
    "type": "PP-Bizon",
    "skinName": "Water Sigil",
    "prices": {
      "default": {
        "0": {
          "market": 0.34,
          "analyst": 0.52,
          "opskins": 1.59
        },
        "1": {
          "market": 0.3,
          "analyst": 0.22,
          "opskins": 0.21
        },
        "2": {
          "market": 0.2,
          "analyst": 0.17,
          "opskins": 0.16
        },
        "3": {
          "market": 0.28,
          "analyst": 0.21,
          "opskins": 0.59
        },
        "4": {
          "market": 0.34,
          "analyst": 0.24,
          "opskins": 0.21
        }
      },
      "stattrak": {
        "0": {
          "market": 0.81,
          "analyst": 2.58,
          "opskins": 2.18
        },
        "1": {
          "market": 0.79,
          "analyst": 0.58,
          "opskins": 0.55
        },
        "2": {
          "market": 0.7,
          "analyst": 0.53,
          "opskins": 0.49
        },
        "3": {
          "market": 0.9,
          "analyst": 0.72,
          "opskins": 0.7
        },
        "4": {
          "market": 1.12,
          "analyst": 0.9,
          "opskins": 0.8
        }
      },
      "souvenir": {}
    }
  },
  "518": {
    "item_id": 518,
    "type": "Nova",
    "skinName": "Ghost Camo",
    "prices": {
      "default": {
        "1": {
          "market": 0.77,
          "analyst": 2.29,
          "opskins": 0.52
        },
        "2": {
          "market": 0.23,
          "analyst": 0.21,
          "opskins": 1.2
        },
        "3": {
          "market": 0.24,
          "analyst": 0.19,
          "opskins": 0.17
        },
        "4": {
          "market": 0.31,
          "analyst": 0.24,
          "opskins": 0.21
        }
      },
      "stattrak": {
        "1": {
          "market": 1.23,
          "analyst": 1.38,
          "opskins": 1.51
        },
        "2": {
          "market": 0.7,
          "analyst": 0.57,
          "opskins": 0.53
        },
        "3": {
          "market": 0.91,
          "analyst": 0.71,
          "opskins": 0.56
        },
        "4": {
          "market": 1.12,
          "analyst": 0.92,
          "opskins": 0.73
        }
      },
      "souvenir": {}
    }
  },
  "519": {
    "item_id": 519,
    "type": "G3SG1",
    "skinName": "Azure Zebra",
    "prices": {
      "default": {
        "2": {
          "market": 0.25,
          "analyst": 0.21,
          "opskins": 0.6
        },
        "3": {
          "market": 0.26,
          "analyst": 0.2,
          "opskins": 0.49
        },
        "4": {
          "market": 0.29,
          "analyst": 0.22,
          "opskins": 0.28
        }
      },
      "stattrak": {
        "2": {
          "market": 0.68,
          "analyst": 0.52,
          "opskins": 0.63
        },
        "3": {
          "market": 0.89,
          "analyst": 0.65,
          "opskins": 0.56
        },
        "4": {
          "market": 1.12,
          "analyst": 0.91,
          "opskins": 0.73
        }
      },
      "souvenir": {}
    }
  },
  "520": {
    "item_id": 520,
    "type": "P250",
    "skinName": "Steel Disruption",
    "prices": {
      "default": {
        "2": {
          "market": 0.28,
          "analyst": 0.25,
          "opskins": 0.98
        },
        "3": {
          "market": 0.29,
          "analyst": 0.24,
          "opskins": 0.28
        },
        "4": {
          "market": 0.41,
          "analyst": 0.27,
          "opskins": 0.38
        }
      },
      "stattrak": {
        "2": {
          "market": 0.97,
          "analyst": 0.84,
          "opskins": 0.76
        },
        "3": {
          "market": 1.01,
          "analyst": 0.82,
          "opskins": 0.66
        },
        "4": {
          "market": 1.23,
          "analyst": 0.96,
          "opskins": 0.82
        }
      },
      "souvenir": {}
    }
  },
  "521": {
    "item_id": 521,
    "type": "AK-47",
    "skinName": "Blue Laminate",
    "prices": {
      "default": {
        "1": {
          "market": 4.37,
          "analyst": 3.32,
          "opskins": 3.08
        },
        "2": {
          "market": 2.55,
          "analyst": 1.87,
          "opskins": 1.68
        },
        "3": {
          "market": 2.68,
          "analyst": 1.99,
          "opskins": 1.74
        },
        "4": {
          "market": 3.61,
          "analyst": 2.58,
          "opskins": 2.31
        }
      },
      "stattrak": {
        "1": {
          "market": 12.6,
          "analyst": 10.58,
          "opskins": 10.46
        },
        "2": {
          "market": 10.86,
          "analyst": 8.41,
          "opskins": 7.12
        },
        "3": {
          "market": 11.69,
          "analyst": 9.09,
          "opskins": 7.64
        },
        "4": {
          "market": 16.35,
          "analyst": 12.13,
          "opskins": 10.3
        }
      },
      "souvenir": {}
    }
  },
  "522": {
    "item_id": 522,
    "type": "P90",
    "skinName": "Blind Spot",
    "prices": {
      "default": {
        "0": {
          "market": 1.05,
          "analyst": 0.78,
          "opskins": 1.56
        },
        "1": {
          "market": 0.85,
          "analyst": 0.72,
          "opskins": 0.63
        },
        "2": {
          "market": 0.79,
          "analyst": 0.61,
          "opskins": 0.53
        },
        "3": {
          "market": 0.88,
          "analyst": 0.65,
          "opskins": 0.6
        },
        "4": {
          "market": 1,
          "analyst": 0.72,
          "opskins": 0.66
        }
      },
      "stattrak": {
        "0": {
          "market": 2.02,
          "analyst": 2.12,
          "opskins": 2.03
        },
        "1": {
          "market": 1.99,
          "analyst": 1.84,
          "opskins": 2.09
        },
        "2": {
          "market": 2.48,
          "analyst": 1.71,
          "opskins": 1.45
        },
        "3": {
          "market": 2.73,
          "analyst": 1.94,
          "opskins": 1.79
        },
        "4": {
          "market": 3.61,
          "analyst": 2.68,
          "opskins": 2.49
        }
      },
      "souvenir": {}
    }
  },
  "523": {
    "item_id": 523,
    "type": "AWP",
    "skinName": "Electric Hive",
    "prices": {
      "default": {
        "1": {
          "market": 11.6,
          "analyst": 9.24,
          "opskins": 8.37
        },
        "2": {
          "market": 10.79,
          "analyst": 7.53,
          "opskins": 6.61
        },
        "3": {
          "market": 13.02,
          "analyst": 9.46,
          "opskins": 8.18
        },
        "4": {
          "market": 15.28,
          "analyst": 10.95,
          "opskins": 9.67
        }
      },
      "stattrak": {
        "1": {
          "market": 31.26,
          "analyst": 28.82,
          "opskins": 27.86
        },
        "2": {
          "market": 30.05,
          "analyst": 21.91,
          "opskins": 19.76
        },
        "3": {
          "market": 41.64,
          "analyst": 29.8,
          "opskins": 25.89
        },
        "4": {
          "market": 52.82,
          "analyst": 43.41,
          "opskins": 36.98
        }
      },
      "souvenir": {}
    }
  },
  "524": {
    "item_id": 524,
    "type": "Desert Eagle",
    "skinName": "Cobalt Disruption",
    "prices": {
      "default": {
        "2": {
          "market": 6.89,
          "analyst": 4.89,
          "opskins": 5.38
        },
        "3": {
          "market": 6.37,
          "analyst": 4.58,
          "opskins": 4.1
        },
        "4": {
          "market": 7.17,
          "analyst": 5.17,
          "opskins": 4.56
        }
      },
      "stattrak": {
        "2": {
          "market": 17.86,
          "analyst": 15.4,
          "opskins": 15.1
        },
        "3": {
          "market": 22.46,
          "analyst": 18.38,
          "opskins": 17
        },
        "4": {
          "market": 31.57,
          "analyst": 25.88,
          "opskins": 23
        }
      },
      "souvenir": {}
    }
  },
  "525": {
    "item_id": 525,
    "type": "★ Flip Knife",
    "skinName": "Forest DDPAT",
    "prices": {
      "default": {
        "0": {
          "market": 47.41,
          "analyst": 33.51,
          "opskins": 31.99
        },
        "1": {
          "market": 50.43,
          "analyst": 37.47,
          "opskins": 33.25
        },
        "2": {
          "market": 50.4,
          "analyst": 35.86,
          "opskins": 31.89
        },
        "3": {
          "market": 57.77,
          "analyst": 43.62,
          "opskins": 38.18
        },
        "4": {
          "market": 103.95,
          "analyst": 98.17,
          "opskins": 105.26
        }
      },
      "stattrak": {
        "0": {
          "market": 41.82,
          "analyst": 52.63,
          "opskins": 53.27
        },
        "1": {
          "market": 50.01,
          "analyst": 67.63,
          "opskins": 53.97
        },
        "2": {
          "market": 57.58,
          "analyst": 51.57,
          "opskins": 45.97
        },
        "3": {
          "market": 75.77,
          "analyst": 66.59,
          "opskins": 65.99
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "526": {
    "item_id": 526,
    "type": "SSG 08",
    "skinName": "Dark Water",
    "prices": {
      "default": {
        "2": {
          "market": 0.23,
          "analyst": 0.16,
          "opskins": 0.14
        },
        "3": {
          "market": 0.33,
          "analyst": 0.24,
          "opskins": 0.19
        }
      },
      "stattrak": {
        "2": {
          "market": 0.65,
          "analyst": 0.48,
          "opskins": 0.41
        },
        "3": {
          "market": 1.3,
          "analyst": 1,
          "opskins": 0.77
        }
      },
      "souvenir": {}
    }
  },
  "527": {
    "item_id": 527,
    "type": "MAC-10",
    "skinName": "Ultraviolet",
    "prices": {
      "default": {
        "0": {
          "market": 0.12,
          "analyst": 0.1,
          "opskins": 3.5
        },
        "1": {
          "market": 0.18,
          "analyst": 0.17,
          "opskins": 0.18
        },
        "2": {
          "market": 0.14,
          "analyst": 0.11,
          "opskins": 0.2
        },
        "3": {
          "market": 0.43,
          "analyst": 0.32,
          "opskins": 0.24
        },
        "4": {
          "market": 2.61,
          "analyst": 1.96,
          "opskins": 1.74
        }
      },
      "stattrak": {
        "0": {
          "market": 0.34,
          "analyst": 0.23,
          "opskins": 0.27
        },
        "1": {
          "market": 0.35,
          "analyst": 0.31,
          "opskins": 0.27
        },
        "2": {
          "market": 0.35,
          "analyst": 0.25,
          "opskins": 0.26
        },
        "3": {
          "market": 1.01,
          "analyst": 0.88,
          "opskins": 0.72
        },
        "4": {
          "market": 8.25,
          "analyst": 9.08,
          "opskins": 8.5
        }
      },
      "souvenir": {}
    }
  },
  "528": {
    "item_id": 528,
    "type": "USP-S",
    "skinName": "Blood Tiger",
    "prices": {
      "default": {
        "2": {
          "market": 0.6,
          "analyst": 0.36,
          "opskins": 0.59
        },
        "3": {
          "market": 0.71,
          "analyst": 0.4,
          "opskins": 0.58
        },
        "4": {
          "market": 1,
          "analyst": 0.71,
          "opskins": 0.62
        }
      },
      "stattrak": {
        "2": {
          "market": 1.99,
          "analyst": 1.55,
          "opskins": 1.33
        },
        "3": {
          "market": 2.27,
          "analyst": 1.73,
          "opskins": 1.55
        },
        "4": {
          "market": 4.76,
          "analyst": 3.78,
          "opskins": 3.29
        }
      },
      "souvenir": {}
    }
  },
  "529": {
    "item_id": 529,
    "type": "CZ75-Auto",
    "skinName": "Hexane",
    "prices": {
      "default": {
        "1": {
          "market": 0.26,
          "analyst": 0.18,
          "opskins": 0.12
        },
        "2": {
          "market": 0.15,
          "analyst": 0.14,
          "opskins": 0.11
        },
        "3": {
          "market": 0.26,
          "analyst": 0.21,
          "opskins": 0.16
        },
        "4": {
          "market": 0.59,
          "analyst": 0.56,
          "opskins": 0.41
        }
      },
      "stattrak": {
        "1": {
          "market": 0.6,
          "analyst": 0.47,
          "opskins": 0.53
        },
        "2": {
          "market": 0.42,
          "analyst": 0.34,
          "opskins": 0.27
        },
        "3": {
          "market": 0.8,
          "analyst": 0.69,
          "opskins": 0.56
        },
        "4": {
          "market": 4.02,
          "analyst": 3.12,
          "opskins": 2.97
        }
      },
      "souvenir": {}
    }
  },
  "530": {
    "item_id": 530,
    "type": "Negev",
    "skinName": "Bratatat",
    "prices": {
      "default": {
        "0": {
          "market": 0.17,
          "analyst": 0.14,
          "opskins": 0.26
        },
        "1": {
          "market": 0.18,
          "analyst": 0.14,
          "opskins": 0.13
        },
        "2": {
          "market": 0.19,
          "analyst": 0.17,
          "opskins": 0.29
        },
        "3": {
          "market": 0.33,
          "analyst": 0.25,
          "opskins": 0.19
        },
        "4": {
          "market": 1.37,
          "analyst": 0.99,
          "opskins": 0.85
        }
      },
      "stattrak": {
        "0": {
          "market": 0.34,
          "analyst": 0.28,
          "opskins": 0.24
        },
        "1": {
          "market": 0.34,
          "analyst": 0.28,
          "opskins": 0.23
        },
        "2": {
          "market": 0.4,
          "analyst": 0.33,
          "opskins": 0.29
        },
        "3": {
          "market": 0.88,
          "analyst": 0.62,
          "opskins": 0.54
        },
        "4": {
          "market": 5.8,
          "analyst": 4.22,
          "opskins": 4
        }
      },
      "souvenir": {}
    }
  },
  "531": {
    "item_id": 531,
    "type": "XM1014",
    "skinName": "Red Python",
    "prices": {
      "default": {
        "0": {
          "market": 0.19,
          "analyst": 0.23,
          "opskins": 0.19
        },
        "1": {
          "market": 0.22,
          "analyst": 0.18,
          "opskins": 0.39
        },
        "2": {
          "market": 0.13,
          "analyst": 0.1,
          "opskins": 0.17
        },
        "3": {
          "market": 0.27,
          "analyst": 0.21,
          "opskins": 0.16
        }
      },
      "stattrak": {
        "0": {
          "market": 0.47,
          "analyst": 0.48,
          "opskins": 0.5
        },
        "1": {
          "market": 0.46,
          "analyst": 0.36,
          "opskins": 0.31
        },
        "2": {
          "market": 0.35,
          "analyst": 0.26,
          "opskins": 0.27
        },
        "3": {
          "market": 0.89,
          "analyst": 0.73,
          "opskins": 0.71
        }
      },
      "souvenir": {}
    }
  },
  "532": {
    "item_id": 532,
    "type": "PP-Bizon",
    "skinName": "Blue Streak",
    "prices": {
      "default": {
        "0": {
          "market": 0.54,
          "analyst": 0.38,
          "opskins": 0.62
        },
        "1": {
          "market": 0.46,
          "analyst": 0.36,
          "opskins": 0.35
        },
        "2": {
          "market": 0.39,
          "analyst": 0.29,
          "opskins": 0.24
        },
        "3": {
          "market": 0.89,
          "analyst": 0.67,
          "opskins": 0.75
        },
        "4": {
          "market": 5.7,
          "analyst": 4.23,
          "opskins": 3.88
        }
      },
      "stattrak": {
        "0": {
          "market": 0.88,
          "analyst": 1.09,
          "opskins": 0.69
        },
        "1": {
          "market": 1.19,
          "analyst": 1.06,
          "opskins": 0.99
        },
        "2": {
          "market": 1.04,
          "analyst": 0.79,
          "opskins": 0.68
        },
        "3": {
          "market": 1.93,
          "analyst": 1.81,
          "opskins": 1.46
        },
        "4": {
          "market": 21.19,
          "analyst": 49.79,
          "opskins": 49.68
        }
      },
      "souvenir": {}
    }
  },
  "533": {
    "item_id": 533,
    "type": "P90",
    "skinName": "Virus",
    "prices": {
      "default": {
        "0": {
          "market": 0.38,
          "analyst": 0.35,
          "opskins": 0.78
        },
        "1": {
          "market": 0.46,
          "analyst": 0.36,
          "opskins": 0.34
        },
        "2": {
          "market": 0.36,
          "analyst": 0.28,
          "opskins": 0.24
        },
        "3": {
          "market": 0.5,
          "analyst": 0.47,
          "opskins": 0.43
        },
        "4": {
          "market": 2.56,
          "analyst": 2.42,
          "opskins": 2.27
        }
      },
      "stattrak": {
        "0": {
          "market": 0.96,
          "analyst": 0.83,
          "opskins": 0.7
        },
        "1": {
          "market": 1.18,
          "analyst": 1.07,
          "opskins": 1.1
        },
        "2": {
          "market": 0.91,
          "analyst": 0.84,
          "opskins": 0.71
        },
        "3": {
          "market": 1.81,
          "analyst": 1.58,
          "opskins": 1.35
        },
        "4": {
          "market": 14.28,
          "analyst": 29.24,
          "opskins": 29
        }
      },
      "souvenir": {}
    }
  },
  "534": {
    "item_id": 534,
    "type": "MP7",
    "skinName": "Ocean Foam",
    "prices": {
      "default": {
        "3": {
          "market": 1.21,
          "analyst": 1.25,
          "opskins": 1.33
        },
        "4": {
          "market": 0.93,
          "analyst": 0.84,
          "opskins": 0.65
        }
      },
      "stattrak": {
        "3": {
          "market": 4.36,
          "analyst": 4.42,
          "opskins": 4.12
        },
        "4": {
          "market": 3.47,
          "analyst": 2.97,
          "opskins": 2.5
        }
      },
      "souvenir": {}
    }
  },
  "535": {
    "item_id": 535,
    "type": "Glock-18",
    "skinName": "Steel Disruption",
    "prices": {
      "default": {
        "2": {
          "market": 0.82,
          "analyst": 0.69,
          "opskins": 0.68
        },
        "3": {
          "market": 0.69,
          "analyst": 0.69,
          "opskins": 0.67
        },
        "4": {
          "market": 0.98,
          "analyst": 0.8,
          "opskins": 0.87
        }
      },
      "stattrak": {
        "2": {
          "market": 2.6,
          "analyst": 2.25,
          "opskins": 2.07
        },
        "3": {
          "market": 2.51,
          "analyst": 2.06,
          "opskins": 1.75
        },
        "4": {
          "market": 3.43,
          "analyst": 3.13,
          "opskins": 2.68
        }
      },
      "souvenir": {}
    }
  },
  "536": {
    "item_id": 536,
    "type": "Desert Eagle",
    "skinName": "Crimson Web",
    "prices": {
      "default": {
        "0": {
          "market": 1.1,
          "analyst": 0.73,
          "opskins": 0.88
        },
        "1": {
          "market": 1.82,
          "analyst": 1.18,
          "opskins": 1.2
        },
        "2": {
          "market": 1.24,
          "analyst": 0.83,
          "opskins": 0.85
        },
        "3": {
          "market": 5.69,
          "analyst": 3.71,
          "opskins": 3.37
        },
        "4": {
          "market": 30.55,
          "analyst": 22.22,
          "opskins": 21.94
        }
      },
      "stattrak": {
        "0": {
          "market": 4.01,
          "analyst": 3.07,
          "opskins": 2.84
        },
        "1": {
          "market": 6.17,
          "analyst": 4.52,
          "opskins": 5.54
        },
        "2": {
          "market": 5.52,
          "analyst": 3.81,
          "opskins": 3.42
        },
        "3": {
          "market": 24.02,
          "analyst": 18.56,
          "opskins": 16.14
        },
        "4": {
          "market": 279,
          "analyst": 222.83,
          "opskins": 250
        }
      },
      "souvenir": {}
    }
  },
  "537": {
    "item_id": 537,
    "type": "Nova",
    "skinName": "Bloomstick",
    "prices": {
      "default": {
        "0": {
          "market": 1.47,
          "analyst": 1.11,
          "opskins": 1.34
        },
        "1": {
          "market": 1.72,
          "analyst": 1.85,
          "opskins": 1.85
        },
        "2": {
          "market": 1.46,
          "analyst": 1.18,
          "opskins": 1.15
        },
        "3": {
          "market": 2.22,
          "analyst": 1.81,
          "opskins": 1.64
        },
        "4": {
          "market": 10.83,
          "analyst": 13.19,
          "opskins": 11.75
        }
      },
      "stattrak": {
        "0": {
          "market": 3.92,
          "analyst": 4.48,
          "opskins": 4.18
        },
        "1": {
          "market": 3.92,
          "analyst": 4.66,
          "opskins": 6.39
        },
        "2": {
          "market": 4.37,
          "analyst": 4.33,
          "opskins": 3.76
        },
        "3": {
          "market": 7.88,
          "analyst": 8.51,
          "opskins": 8
        },
        "4": {
          "market": 50,
          "analyst": 48.4,
          "opskins": 47.37
        }
      },
      "souvenir": {}
    }
  },
  "538": {
    "item_id": 538,
    "type": "AWP",
    "skinName": "Corticera",
    "prices": {
      "default": {
        "2": {
          "market": 5.67,
          "analyst": 4.37,
          "opskins": 3.73
        },
        "3": {
          "market": 6.11,
          "analyst": 4.7,
          "opskins": 3.87
        },
        "4": {
          "market": 11.33,
          "analyst": 8.53,
          "opskins": 7.53
        }
      },
      "stattrak": {
        "2": {
          "market": 17.88,
          "analyst": 13.95,
          "opskins": 12.14
        },
        "3": {
          "market": 21.65,
          "analyst": 16.35,
          "opskins": 14.16
        },
        "4": {
          "market": 41.38,
          "analyst": 33.65,
          "opskins": 30.36
        }
      },
      "souvenir": {}
    }
  },
  "539": {
    "item_id": 539,
    "type": "M4A4",
    "skinName": "Bullet Rain",
    "prices": {
      "default": {
        "0": {
          "market": 7.17,
          "analyst": 6.95,
          "opskins": 6.48
        },
        "1": {
          "market": 5.85,
          "analyst": 4.78,
          "opskins": 4.6
        },
        "2": {
          "market": 5.44,
          "analyst": 4.31,
          "opskins": 3.88
        },
        "3": {
          "market": 7.69,
          "analyst": 6.19,
          "opskins": 5.3
        },
        "4": {
          "market": 15.71,
          "analyst": 11.68,
          "opskins": 10.64
        }
      },
      "stattrak": {
        "0": {
          "market": 40.03,
          "analyst": 31.45,
          "opskins": 45
        },
        "1": {
          "market": 19.5,
          "analyst": 18.26,
          "opskins": 18.95
        },
        "2": {
          "market": 18.24,
          "analyst": 15.47,
          "opskins": 14.15
        },
        "3": {
          "market": 33.21,
          "analyst": 31.2,
          "opskins": 28.95
        },
        "4": {
          "market": 63.9,
          "analyst": 68.21,
          "opskins": 57.82
        }
      },
      "souvenir": {}
    }
  },
  "540": {
    "item_id": 540,
    "type": "AK-47",
    "skinName": "Jaguar",
    "prices": {
      "default": {
        "0": {
          "market": 9.26,
          "analyst": 6.8,
          "opskins": 6.29
        },
        "1": {
          "market": 10.69,
          "analyst": 8,
          "opskins": 6.77
        },
        "2": {
          "market": 11.6,
          "analyst": 8.53,
          "opskins": 7.34
        },
        "3": {
          "market": 15.71,
          "analyst": 11.7,
          "opskins": 10.18
        },
        "4": {
          "market": 36.37,
          "analyst": 27.99,
          "opskins": 25.58
        }
      },
      "stattrak": {
        "0": {
          "market": 29.78,
          "analyst": 28.23,
          "opskins": 25.89
        },
        "1": {
          "market": 36.15,
          "analyst": 29.52,
          "opskins": 27.21
        },
        "2": {
          "market": 47.34,
          "analyst": 36.28,
          "opskins": 32.51
        },
        "3": {
          "market": 74.4,
          "analyst": 57.75,
          "opskins": 56.33
        },
        "4": {
          "market": 214.65,
          "analyst": 236.13,
          "opskins": 196.99
        }
      },
      "souvenir": {}
    }
  },
  "541": {
    "item_id": 541,
    "type": "★ Karambit",
    "skinName": "Boreal Forest",
    "prices": {
      "default": {
        "0": {
          "market": 102.94,
          "analyst": 86.03,
          "opskins": 75.24
        },
        "1": {
          "market": 104.25,
          "analyst": 92.86,
          "opskins": 77.78
        },
        "2": {
          "market": 105.29,
          "analyst": 91.1,
          "opskins": 80
        },
        "3": {
          "market": 126.1,
          "analyst": 120.02,
          "opskins": 99.89
        },
        "4": {
          "market": 202.41,
          "analyst": 296,
          "opskins": 280
        }
      },
      "stattrak": {
        "0": {
          "market": 124.34,
          "analyst": 184.16,
          "opskins": 158.99
        },
        "1": {
          "market": 132.47,
          "analyst": 161.65,
          "opskins": 144.99
        },
        "2": {
          "market": 134.69,
          "analyst": 119.72,
          "opskins": 101.96
        },
        "3": {
          "market": 158.2,
          "analyst": 162.7,
          "opskins": 139.99
        },
        "4": {
          "market": -1,
          "analyst": 800,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "542": {
    "item_id": 542,
    "type": "PP-Bizon",
    "skinName": "Photic Zone",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.11
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "2": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "3": {
          "market": 0.15,
          "analyst": 0.09,
          "opskins": 0.07
        },
        "4": {
          "market": 0.51,
          "analyst": 0.36,
          "opskins": 0.3
        }
      },
      "stattrak": {
        "0": {
          "market": 0.29,
          "analyst": 0.23,
          "opskins": 0.22
        },
        "1": {
          "market": 0.31,
          "analyst": 0.24,
          "opskins": 0.2
        },
        "2": {
          "market": 0.33,
          "analyst": 0.26,
          "opskins": 0.21
        },
        "3": {
          "market": 0.6,
          "analyst": 0.54,
          "opskins": 0.4
        },
        "4": {
          "market": 2.11,
          "analyst": 1.86,
          "opskins": 1.63
        }
      },
      "souvenir": {}
    }
  },
  "543": {
    "item_id": 543,
    "type": "USP-S",
    "skinName": "Lead Conduit",
    "prices": {
      "default": {
        "0": {
          "market": 0.19,
          "analyst": 0.13,
          "opskins": 0.1
        },
        "1": {
          "market": 0.2,
          "analyst": 0.14,
          "opskins": 0.12
        },
        "2": {
          "market": 0.22,
          "analyst": 0.16,
          "opskins": 0.12
        },
        "3": {
          "market": 0.34,
          "analyst": 0.27,
          "opskins": 0.22
        },
        "4": {
          "market": 1.15,
          "analyst": 1.01,
          "opskins": 0.84
        }
      },
      "stattrak": {
        "0": {
          "market": 1.34,
          "analyst": 1.09,
          "opskins": 0.92
        },
        "1": {
          "market": 1.35,
          "analyst": 1.1,
          "opskins": 0.94
        },
        "2": {
          "market": 1.43,
          "analyst": 1.2,
          "opskins": 1.02
        },
        "3": {
          "market": 2.04,
          "analyst": 1.68,
          "opskins": 1.34
        },
        "4": {
          "market": 6.33,
          "analyst": 5.56,
          "opskins": 4.89
        }
      },
      "souvenir": {}
    }
  },
  "544": {
    "item_id": 544,
    "type": "Dual Berettas",
    "skinName": "Cartel",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.06
        },
        "1": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.06
        },
        "2": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.06
        },
        "3": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "4": {
          "market": 0.23,
          "analyst": 0.18,
          "opskins": 0.24
        }
      },
      "stattrak": {
        "0": {
          "market": 0.23,
          "analyst": 0.21,
          "opskins": 0.16
        },
        "1": {
          "market": 0.23,
          "analyst": 0.2,
          "opskins": 0.17
        },
        "2": {
          "market": 0.24,
          "analyst": 0.2,
          "opskins": 0.17
        },
        "3": {
          "market": 0.37,
          "analyst": 0.33,
          "opskins": 0.3
        },
        "4": {
          "market": 1.15,
          "analyst": 1.34,
          "opskins": 1.17
        }
      },
      "souvenir": {}
    }
  },
  "545": {
    "item_id": 545,
    "type": "Tec-9",
    "skinName": "Jambiya",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "1": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.06
        },
        "2": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.07
        },
        "3": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.04
        },
        "4": {
          "market": 0.41,
          "analyst": 0.3,
          "opskins": 0.26
        }
      },
      "stattrak": {
        "0": {
          "market": 0.37,
          "analyst": 0.29,
          "opskins": 0.23
        },
        "1": {
          "market": 0.38,
          "analyst": 0.3,
          "opskins": 0.23
        },
        "2": {
          "market": 0.45,
          "analyst": 0.36,
          "opskins": 0.28
        },
        "3": {
          "market": 0.67,
          "analyst": 0.63,
          "opskins": 0.5
        },
        "4": {
          "market": 3.27,
          "analyst": 2.69,
          "opskins": 2.38
        }
      },
      "souvenir": {}
    }
  },
  "546": {
    "item_id": 546,
    "type": "SSG 08",
    "skinName": "Necropos",
    "prices": {
      "default": {
        "0": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "1": {
          "market": 0.11,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "2": {
          "market": 0.11,
          "analyst": 0.07,
          "opskins": 0.05
        },
        "3": {
          "market": 0.2,
          "analyst": 0.12,
          "opskins": 0.09
        },
        "4": {
          "market": 0.93,
          "analyst": 0.74,
          "opskins": 0.61
        }
      },
      "stattrak": {
        "0": {
          "market": 0.42,
          "analyst": 0.3,
          "opskins": 0.23
        },
        "1": {
          "market": 0.46,
          "analyst": 0.34,
          "opskins": 0.27
        },
        "2": {
          "market": 0.55,
          "analyst": 0.41,
          "opskins": 0.33
        },
        "3": {
          "market": 1.18,
          "analyst": 0.97,
          "opskins": 0.75
        },
        "4": {
          "market": 5.5,
          "analyst": 5.27,
          "opskins": 4.45
        }
      },
      "souvenir": {}
    }
  },
  "547": {
    "item_id": 547,
    "type": "MAC-10",
    "skinName": "Lapis Gator",
    "prices": {
      "default": {
        "0": {
          "market": 0.09,
          "analyst": 0.1,
          "opskins": 0.12
        },
        "1": {
          "market": 0.09,
          "analyst": 0.07,
          "opskins": 0.06
        },
        "2": {
          "market": 0.09,
          "analyst": 0.06,
          "opskins": 0.06
        },
        "3": {
          "market": 0.1,
          "analyst": 0.07,
          "opskins": 0.07
        },
        "4": {
          "market": 0.16,
          "analyst": 0.12,
          "opskins": 0.1
        }
      },
      "stattrak": {
        "0": {
          "market": 0.26,
          "analyst": 0.21,
          "opskins": 0.19
        },
        "1": {
          "market": 0.32,
          "analyst": 0.26,
          "opskins": 0.21
        },
        "2": {
          "market": 0.26,
          "analyst": 0.21,
          "opskins": 0.15
        },
        "3": {
          "market": 0.44,
          "analyst": 0.38,
          "opskins": 0.33
        },
        "4": {
          "market": 0.78,
          "analyst": 0.69,
          "opskins": 0.53
        }
      },
      "souvenir": {}
    }
  },
  "548": {
    "item_id": 548,
    "type": "Glock-18",
    "skinName": "Royal Legion",
    "prices": {
      "default": {
        "0": {
          "market": 0.34,
          "analyst": 0.29,
          "opskins": 0.25
        },
        "1": {
          "market": 0.35,
          "analyst": 0.3,
          "opskins": 0.28
        },
        "2": {
          "market": 0.35,
          "analyst": 0.3,
          "opskins": 0.25
        },
        "3": {
          "market": 0.65,
          "analyst": 0.62,
          "opskins": 0.51
        },
        "4": {
          "market": 2.28,
          "analyst": 1.88,
          "opskins": 1.64
        }
      },
      "stattrak": {
        "0": {
          "market": 2.06,
          "analyst": 1.68,
          "opskins": 1.56
        },
        "1": {
          "market": 2.26,
          "analyst": 1.91,
          "opskins": 1.54
        },
        "2": {
          "market": 2.53,
          "analyst": 2.13,
          "opskins": 1.76
        },
        "3": {
          "market": 4.8,
          "analyst": 3.76,
          "opskins": 3.18
        },
        "4": {
          "market": 14.01,
          "analyst": 12.14,
          "opskins": 10.8
        }
      },
      "souvenir": {}
    }
  },
  "549": {
    "item_id": 549,
    "type": "MP7",
    "skinName": "Impire",
    "prices": {
      "default": {
        "1": {
          "market": 0.48,
          "analyst": 0.65,
          "opskins": 0.56
        },
        "2": {
          "market": 0.36,
          "analyst": 0.28,
          "opskins": 0.24
        },
        "3": {
          "market": 0.51,
          "analyst": 0.4,
          "opskins": 0.34
        },
        "4": {
          "market": 0.89,
          "analyst": 0.71,
          "opskins": 0.61
        }
      },
      "stattrak": {
        "1": {
          "market": 1.86,
          "analyst": 1.68,
          "opskins": 1.6
        },
        "2": {
          "market": 1.48,
          "analyst": 1.15,
          "opskins": 0.92
        },
        "3": {
          "market": 2.23,
          "analyst": 1.96,
          "opskins": 1.6
        },
        "4": {
          "market": 3.98,
          "analyst": 3.48,
          "opskins": 2.94
        }
      },
      "souvenir": {}
    }
  },
  "550": {
    "item_id": 550,
    "type": "Five-SeveN",
    "skinName": "Triumvirate",
    "prices": {
      "default": {
        "0": {
          "market": 0.34,
          "analyst": 0.27,
          "opskins": 0.25
        },
        "1": {
          "market": 0.38,
          "analyst": 0.3,
          "opskins": 0.27
        },
        "2": {
          "market": 0.34,
          "analyst": 0.26,
          "opskins": 0.2
        },
        "3": {
          "market": 0.53,
          "analyst": 0.38,
          "opskins": 0.31
        },
        "4": {
          "market": 0.89,
          "analyst": 0.7,
          "opskins": 0.55
        }
      },
      "stattrak": {
        "0": {
          "market": 1.23,
          "analyst": 1.04,
          "opskins": 1.02
        },
        "1": {
          "market": 1.59,
          "analyst": 1.58,
          "opskins": 1.64
        },
        "2": {
          "market": 1.45,
          "analyst": 1.07,
          "opskins": 0.92
        },
        "3": {
          "market": 2.72,
          "analyst": 2.27,
          "opskins": 1.86
        },
        "4": {
          "market": 5.09,
          "analyst": 4.09,
          "opskins": 3.72
        }
      },
      "souvenir": {}
    }
  },
  "551": {
    "item_id": 551,
    "type": "FAMAS",
    "skinName": "Valence",
    "prices": {
      "default": {
        "0": {
          "market": 0.47,
          "analyst": 0.35,
          "opskins": 0.3
        },
        "1": {
          "market": 0.9,
          "analyst": 0.85,
          "opskins": 0.66
        },
        "2": {
          "market": 0.51,
          "analyst": 0.4,
          "opskins": 0.29
        },
        "3": {
          "market": 1.02,
          "analyst": 0.86,
          "opskins": 0.66
        },
        "4": {
          "market": 2.52,
          "analyst": 2.35,
          "opskins": 1.94
        }
      },
      "stattrak": {
        "0": {
          "market": 1.71,
          "analyst": 1.5,
          "opskins": 1.23
        },
        "1": {
          "market": 2.64,
          "analyst": 2.99,
          "opskins": 2.7
        },
        "2": {
          "market": 1.97,
          "analyst": 1.82,
          "opskins": 1.48
        },
        "3": {
          "market": 3.91,
          "analyst": 3.53,
          "opskins": 2.98
        },
        "4": {
          "market": 10.06,
          "analyst": 12.13,
          "opskins": 10.77
        }
      },
      "souvenir": {}
    }
  },
  "552": {
    "item_id": 552,
    "type": "MAG-7",
    "skinName": "Praetorian",
    "prices": {
      "default": {
        "1": {
          "market": 0.35,
          "analyst": 0.28,
          "opskins": 0.25
        },
        "2": {
          "market": 0.35,
          "analyst": 0.26,
          "opskins": 0.21
        },
        "3": {
          "market": 0.49,
          "analyst": 0.37,
          "opskins": 0.29
        },
        "4": {
          "market": 0.89,
          "analyst": 0.68,
          "opskins": 0.53
        }
      },
      "stattrak": {
        "1": {
          "market": 1.34,
          "analyst": 1.05,
          "opskins": 0.92
        },
        "2": {
          "market": 1.4,
          "analyst": 1.04,
          "opskins": 0.88
        },
        "3": {
          "market": 2.05,
          "analyst": 1.73,
          "opskins": 1.47
        },
        "4": {
          "market": 3.72,
          "analyst": 3.05,
          "opskins": 2.68
        }
      },
      "souvenir": {}
    }
  },
  "553": {
    "item_id": 553,
    "type": "Desert Eagle",
    "skinName": "Kumicho Dragon",
    "prices": {
      "default": {
        "0": {
          "market": 3.04,
          "analyst": 2.34,
          "opskins": 2.13
        },
        "1": {
          "market": 4.92,
          "analyst": 3.84,
          "opskins": 3.22
        },
        "2": {
          "market": 3.67,
          "analyst": 2.78,
          "opskins": 2.38
        },
        "3": {
          "market": 5.62,
          "analyst": 4.2,
          "opskins": 3.65
        },
        "4": {
          "market": 9.7,
          "analyst": 7.55,
          "opskins": 6.78
        }
      },
      "stattrak": {
        "0": {
          "market": 14.41,
          "analyst": 11.54,
          "opskins": 10.04
        },
        "1": {
          "market": 20.54,
          "analyst": 18.38,
          "opskins": 18
        },
        "2": {
          "market": 16.52,
          "analyst": 12.74,
          "opskins": 10.94
        },
        "3": {
          "market": 25.05,
          "analyst": 19.99,
          "opskins": 17.88
        },
        "4": {
          "market": 49.62,
          "analyst": 39,
          "opskins": 33.76
        }
      },
      "souvenir": {}
    }
  },
  "554": {
    "item_id": 554,
    "type": "Nova",
    "skinName": "Hyper Beast",
    "prices": {
      "default": {
        "0": {
          "market": 1.88,
          "analyst": 1.5,
          "opskins": 1.41
        },
        "1": {
          "market": 2.19,
          "analyst": 1.85,
          "opskins": 1.54
        },
        "2": {
          "market": 2.09,
          "analyst": 1.66,
          "opskins": 1.42
        },
        "3": {
          "market": 2.87,
          "analyst": 2.22,
          "opskins": 1.79
        },
        "4": {
          "market": 4.54,
          "analyst": 3.85,
          "opskins": 3.19
        }
      },
      "stattrak": {
        "0": {
          "market": 5.28,
          "analyst": 5.06,
          "opskins": 4.5
        },
        "1": {
          "market": 7.26,
          "analyst": 7.19,
          "opskins": 6.02
        },
        "2": {
          "market": 6.63,
          "analyst": 5.33,
          "opskins": 4.85
        },
        "3": {
          "market": 11.73,
          "analyst": 10.37,
          "opskins": 9.06
        },
        "4": {
          "market": 18.83,
          "analyst": 15.81,
          "opskins": 13.9
        }
      },
      "souvenir": {}
    }
  },
  "555": {
    "item_id": 555,
    "type": "AWP",
    "skinName": "Elite Build",
    "prices": {
      "default": {
        "0": {
          "market": 3.14,
          "analyst": 2.3,
          "opskins": 2
        },
        "1": {
          "market": 3.59,
          "analyst": 2.62,
          "opskins": 2.42
        },
        "2": {
          "market": 4.14,
          "analyst": 3.05,
          "opskins": 2.7
        },
        "3": {
          "market": 6.8,
          "analyst": 5.07,
          "opskins": 4.35
        },
        "4": {
          "market": 11.25,
          "analyst": 9.12,
          "opskins": 7.86
        }
      },
      "stattrak": {
        "0": {
          "market": 12,
          "analyst": 9.93,
          "opskins": 9.47
        },
        "1": {
          "market": 13.48,
          "analyst": 10.82,
          "opskins": 9.63
        },
        "2": {
          "market": 15.85,
          "analyst": 12.63,
          "opskins": 10.85
        },
        "3": {
          "market": 25.31,
          "analyst": 19.4,
          "opskins": 17.79
        },
        "4": {
          "market": 48.3,
          "analyst": 42.14,
          "opskins": 37.64
        }
      },
      "souvenir": {}
    }
  },
  "556": {
    "item_id": 556,
    "type": "AK-47",
    "skinName": "Fuel Injector",
    "prices": {
      "default": {
        "0": {
          "market": 22.97,
          "analyst": 16.5,
          "opskins": 14.3
        },
        "1": {
          "market": 26.06,
          "analyst": 18.94,
          "opskins": 16.6
        },
        "2": {
          "market": 30.5,
          "analyst": 22.75,
          "opskins": 19.99
        },
        "3": {
          "market": 38.92,
          "analyst": 29.85,
          "opskins": 26.25
        },
        "4": {
          "market": 70.45,
          "analyst": 58.82,
          "opskins": 50.45
        }
      },
      "stattrak": {
        "0": {
          "market": 64.79,
          "analyst": 50.23,
          "opskins": 42.7
        },
        "1": {
          "market": 76.12,
          "analyst": 57.58,
          "opskins": 48.87
        },
        "2": {
          "market": 96.6,
          "analyst": 76.33,
          "opskins": 62.89
        },
        "3": {
          "market": 135.59,
          "analyst": 119.87,
          "opskins": 98.69
        },
        "4": {
          "market": 307.86,
          "analyst": 275.68,
          "opskins": 278.99
        }
      },
      "souvenir": {}
    }
  },
  "557": {
    "item_id": 557,
    "type": "M4A4",
    "skinName": "The Battlestar",
    "prices": {
      "default": {
        "0": {
          "market": 3.15,
          "analyst": 2.55,
          "opskins": 2.35
        },
        "1": {
          "market": 4.53,
          "analyst": 3.64,
          "opskins": 3.46
        },
        "2": {
          "market": 3.75,
          "analyst": 2.98,
          "opskins": 2.54
        },
        "3": {
          "market": 6.15,
          "analyst": 4.7,
          "opskins": 3.98
        },
        "4": {
          "market": 8.98,
          "analyst": 7.2,
          "opskins": 6.17
        }
      },
      "stattrak": {
        "0": {
          "market": 13.35,
          "analyst": 12.67,
          "opskins": 14
        },
        "1": {
          "market": 25.07,
          "analyst": 24.2,
          "opskins": 34.99
        },
        "2": {
          "market": 16.97,
          "analyst": 13.05,
          "opskins": 12
        },
        "3": {
          "market": 28.97,
          "analyst": 23.74,
          "opskins": 20.99
        },
        "4": {
          "market": 41.23,
          "analyst": 43.77,
          "opskins": 38.31
        }
      },
      "souvenir": {}
    }
  },
  "558": {
    "item_id": 558,
    "type": "★ Bowie Knife",
    "skinName": "Night",
    "prices": {
      "default": {
        "0": {
          "market": 66.54,
          "analyst": 55.01,
          "opskins": 47.63
        },
        "1": {
          "market": 74.78,
          "analyst": 55.74,
          "opskins": 52.9
        },
        "2": {
          "market": 82.11,
          "analyst": 62.82,
          "opskins": 53.88
        },
        "3": {
          "market": 126.97,
          "analyst": 100.03,
          "opskins": 89.88
        },
        "4": {
          "market": 298.94,
          "analyst": 414,
          "opskins": 414.99
        }
      },
      "stattrak": {
        "0": {
          "market": 90.23,
          "analyst": 104.86,
          "opskins": 127.93
        },
        "1": {
          "market": 134,
          "analyst": 124.74,
          "opskins": 105
        },
        "2": {
          "market": 99.79,
          "analyst": 101.67,
          "opskins": 90.99
        },
        "3": {
          "market": 230,
          "analyst": 279.06,
          "opskins": 239.99
        }
      },
      "souvenir": {}
    }
  },
  "559": {
    "item_id": 559,
    "type": "★ Bowie Knife",
    "skinName": "Scorched",
    "prices": {
      "default": {
        "0": {
          "market": 50.18,
          "analyst": 38.61,
          "opskins": 36.97
        },
        "1": {
          "market": 50.41,
          "analyst": 42.89,
          "opskins": 38.74
        },
        "2": {
          "market": 51.71,
          "analyst": 37.86,
          "opskins": 35.89
        },
        "3": {
          "market": 64.66,
          "analyst": 48.02,
          "opskins": 40.99
        },
        "4": {
          "market": 165,
          "analyst": 210,
          "opskins": -1
        }
      },
      "stattrak": {
        "0": {
          "market": 69,
          "analyst": 70.41,
          "opskins": 66.25
        },
        "1": {
          "market": 52.99,
          "analyst": 55.43,
          "opskins": 71.2
        },
        "2": {
          "market": 60.55,
          "analyst": 56.2,
          "opskins": 50.48
        },
        "3": {
          "market": 83.05,
          "analyst": 80.65,
          "opskins": 67.99
        }
      },
      "souvenir": {}
    }
  },
  "560": {
    "item_id": 560,
    "type": "★ Bowie Knife",
    "skinName": "Urban Masked",
    "prices": {
      "default": {
        "0": {
          "market": 52.35,
          "analyst": 41.49,
          "opskins": 38.21
        },
        "1": {
          "market": 47.49,
          "analyst": 40.5,
          "opskins": 37.48
        },
        "2": {
          "market": 52.21,
          "analyst": 37.64,
          "opskins": 34.37
        },
        "3": {
          "market": 66.38,
          "analyst": 48.69,
          "opskins": 45.79
        },
        "4": {
          "market": 290,
          "analyst": 393,
          "opskins": 410
        }
      },
      "stattrak": {
        "0": {
          "market": 69,
          "analyst": 67.96,
          "opskins": 56.99
        },
        "1": {
          "market": 56.67,
          "analyst": 50.25,
          "opskins": 48.09
        },
        "2": {
          "market": 53.08,
          "analyst": 52.41,
          "opskins": 45.99
        },
        "3": {
          "market": 210,
          "analyst": 83.48,
          "opskins": 86
        }
      },
      "souvenir": {}
    }
  },
  "561": {
    "item_id": 561,
    "type": "SG 553",
    "skinName": "Wave Spray",
    "prices": {
      "default": {
        "0": {
          "market": 0.48,
          "analyst": 0.46,
          "opskins": 1.09
        },
        "1": {
          "market": 0.57,
          "analyst": 0.56,
          "opskins": 0.53
        },
        "2": {
          "market": 0.49,
          "analyst": 0.48,
          "opskins": 6.72
        },
        "3": {
          "market": 0.78,
          "analyst": 0.64,
          "opskins": 7.95
        },
        "4": {
          "market": 2.98,
          "analyst": 2.97,
          "opskins": 2.9
        }
      },
      "stattrak": {
        "0": {
          "market": 1.03,
          "analyst": 1.11,
          "opskins": 1.12
        },
        "1": {
          "market": 1.1,
          "analyst": 1.18,
          "opskins": 3
        },
        "2": {
          "market": 1.11,
          "analyst": 1.08,
          "opskins": 1.45
        },
        "3": {
          "market": 1.97,
          "analyst": 1.84,
          "opskins": 1.57
        },
        "4": {
          "market": 12.76,
          "analyst": 24.22,
          "opskins": 24
        }
      },
      "souvenir": {}
    }
  },
  "562": {
    "item_id": 562,
    "type": "Dual Berettas",
    "skinName": "Black Limba",
    "prices": {
      "default": {
        "0": {
          "market": 0.65,
          "analyst": 0.72,
          "opskins": 1.09
        },
        "1": {
          "market": 0.51,
          "analyst": 0.48,
          "opskins": 1.06
        },
        "2": {
          "market": 0.5,
          "analyst": 0.5,
          "opskins": 0.98
        },
        "3": {
          "market": 0.66,
          "analyst": 0.62,
          "opskins": 1.11
        },
        "4": {
          "market": 3.37,
          "analyst": 3.02,
          "opskins": 2.68
        }
      },
      "stattrak": {
        "0": {
          "market": 1.07,
          "analyst": 1.15,
          "opskins": 3.99
        },
        "1": {
          "market": 1.11,
          "analyst": 1.92,
          "opskins": 48.5
        },
        "2": {
          "market": 1.14,
          "analyst": 1.08,
          "opskins": 0.9
        },
        "3": {
          "market": 1.97,
          "analyst": 1.64,
          "opskins": 1.5
        },
        "4": {
          "market": 19.87,
          "analyst": 27.21,
          "opskins": 24
        }
      },
      "souvenir": {}
    }
  },
  "563": {
    "item_id": 563,
    "type": "Nova",
    "skinName": "Tempest",
    "prices": {
      "default": {
        "2": {
          "market": 0.61,
          "analyst": 0.58,
          "opskins": 0.68
        },
        "3": {
          "market": 0.64,
          "analyst": 0.64,
          "opskins": 0.58
        },
        "4": {
          "market": 2.76,
          "analyst": 2.38,
          "opskins": 2.42
        }
      },
      "stattrak": {
        "2": {
          "market": 1.4,
          "analyst": 1.41,
          "opskins": 1.24
        },
        "3": {
          "market": 1.87,
          "analyst": 1.62,
          "opskins": 1.27
        },
        "4": {
          "market": 12.12,
          "analyst": 9.19,
          "opskins": 14.69
        }
      },
      "souvenir": {}
    }
  },
  "564": {
    "item_id": 564,
    "type": "Galil AR",
    "skinName": "Shattered",
    "prices": {
      "default": {
        "0": {
          "market": 0.57,
          "analyst": 0.6,
          "opskins": 0.98
        },
        "1": {
          "market": 0.54,
          "analyst": 0.58,
          "opskins": 0.66
        },
        "2": {
          "market": 0.51,
          "analyst": 0.5,
          "opskins": 2.39
        },
        "3": {
          "market": 0.8,
          "analyst": 0.64,
          "opskins": 0.99
        },
        "4": {
          "market": 3.54,
          "analyst": 3.21,
          "opskins": 2.97
        }
      },
      "stattrak": {
        "0": {
          "market": 1.1,
          "analyst": 1.13,
          "opskins": 1.9
        },
        "1": {
          "market": 1.06,
          "analyst": 1.1,
          "opskins": 1.39
        },
        "2": {
          "market": 1.13,
          "analyst": 1.13,
          "opskins": 1.29
        },
        "3": {
          "market": 2.04,
          "analyst": 1.66,
          "opskins": 1.89
        },
        "4": {
          "market": 16.43,
          "analyst": 27.96,
          "opskins": 27.98
        }
      },
      "souvenir": {}
    }
  },
  "565": {
    "item_id": 565,
    "type": "UMP-45",
    "skinName": "Bone Pile",
    "prices": {
      "default": {
        "2": {
          "market": 0.54,
          "analyst": 0.52,
          "opskins": 0.73
        },
        "3": {
          "market": 0.69,
          "analyst": 0.61,
          "opskins": 0.71
        },
        "4": {
          "market": 3.77,
          "analyst": 3.17,
          "opskins": 2.99
        }
      },
      "stattrak": {
        "2": {
          "market": 1.32,
          "analyst": 1.27,
          "opskins": 1.1
        },
        "3": {
          "market": 2.06,
          "analyst": 1.75,
          "opskins": 1.49
        },
        "4": {
          "market": 15.05,
          "analyst": 14.94,
          "opskins": 15.59
        }
      },
      "souvenir": {}
    }
  },
  "566": {
    "item_id": 566,
    "type": "G3SG1",
    "skinName": "Demeter",
    "prices": {
      "default": {
        "0": {
          "market": 0.63,
          "analyst": 0.49,
          "opskins": 1.01
        },
        "1": {
          "market": 0.64,
          "analyst": 0.56,
          "opskins": 0.92
        },
        "2": {
          "market": 0.51,
          "analyst": 0.49,
          "opskins": 0.98
        },
        "3": {
          "market": 0.71,
          "analyst": 0.65,
          "opskins": 0.91
        },
        "4": {
          "market": 2.81,
          "analyst": 3.59,
          "opskins": 3.31
        }
      },
      "stattrak": {
        "0": {
          "market": 1.32,
          "analyst": 1.02,
          "opskins": 1.07
        },
        "1": {
          "market": 1.24,
          "analyst": 1.25,
          "opskins": 1.2
        },
        "2": {
          "market": 1.12,
          "analyst": 1.08,
          "opskins": 1.1
        },
        "3": {
          "market": 2.01,
          "analyst": 1.58,
          "opskins": 1.39
        },
        "4": {
          "market": 15.18,
          "analyst": 19.42,
          "opskins": 18.81
        }
      },
      "souvenir": {}
    }
  },
  "567": {
    "item_id": 567,
    "type": "USP-S",
    "skinName": "Overgrowth",
    "prices": {
      "default": {
        "0": {
          "market": 3.54,
          "analyst": 3.12,
          "opskins": 3.55
        },
        "1": {
          "market": 4.1,
          "analyst": 3.61,
          "opskins": 3.42
        },
        "2": {
          "market": 4.23,
          "analyst": 3.62,
          "opskins": 3.31
        },
        "3": {
          "market": 7.32,
          "analyst": 5.79,
          "opskins": 5.3
        },
        "4": {
          "market": 26.34,
          "analyst": 26.16,
          "opskins": 26.77
        }
      },
      "stattrak": {
        "0": {
          "market": 11.4,
          "analyst": 14.45,
          "opskins": 14.69
        },
        "1": {
          "market": 11.29,
          "analyst": 11.15,
          "opskins": 9.62
        },
        "2": {
          "market": 11.97,
          "analyst": 10.71,
          "opskins": 9.58
        },
        "3": {
          "market": 29.38,
          "analyst": 27.29,
          "opskins": 24.79
        },
        "4": {
          "market": 313.7,
          "analyst": 310.1,
          "opskins": 295
        }
      },
      "souvenir": {}
    }
  },
  "568": {
    "item_id": 568,
    "type": "M4A4",
    "skinName": "Zirka",
    "prices": {
      "default": {
        "1": {
          "market": 3.56,
          "analyst": 3.64,
          "opskins": 3.56
        },
        "2": {
          "market": 3.55,
          "analyst": 3.04,
          "opskins": 3
        },
        "3": {
          "market": 4.05,
          "analyst": 3.26,
          "opskins": 3.31
        },
        "4": {
          "market": 10.03,
          "analyst": 9.98,
          "opskins": 9.71
        }
      },
      "stattrak": {
        "1": {
          "market": 9.85,
          "analyst": 10.62,
          "opskins": 12.09
        },
        "2": {
          "market": 9.79,
          "analyst": 9.38,
          "opskins": 9.39
        },
        "3": {
          "market": 14.05,
          "analyst": 12.24,
          "opskins": 12.8
        },
        "4": {
          "market": 67.09,
          "analyst": 83.55,
          "opskins": 68.71
        }
      },
      "souvenir": {}
    }
  },
  "569": {
    "item_id": 569,
    "type": "MAC-10",
    "skinName": "Graven",
    "prices": {
      "default": {
        "0": {
          "market": 4,
          "analyst": 3.12,
          "opskins": 2.81
        },
        "1": {
          "market": 3.56,
          "analyst": 3.17,
          "opskins": 2.5
        },
        "2": {
          "market": 3.43,
          "analyst": 2.97,
          "opskins": 8.65
        },
        "3": {
          "market": 4.06,
          "analyst": 3.87,
          "opskins": 5.62
        },
        "4": {
          "market": 8.8,
          "analyst": 13.49,
          "opskins": 13.45
        }
      },
      "stattrak": {
        "0": {
          "market": 9.03,
          "analyst": 8.49,
          "opskins": 12.44
        },
        "1": {
          "market": 11.43,
          "analyst": 11.07,
          "opskins": 9.17
        },
        "2": {
          "market": 9.6,
          "analyst": 8.82,
          "opskins": 8.44
        },
        "3": {
          "market": 12.42,
          "analyst": 11.22,
          "opskins": 10.5
        },
        "4": {
          "market": 63.85,
          "analyst": 102.9,
          "opskins": 85.73
        }
      },
      "souvenir": {}
    }
  },
  "570": {
    "item_id": 570,
    "type": "M4A1-S",
    "skinName": "Bright Water",
    "prices": {
      "default": {
        "2": {
          "market": 3.97,
          "analyst": 3.31,
          "opskins": 3.1
        },
        "3": {
          "market": 4.12,
          "analyst": 3.45,
          "opskins": 2.92
        }
      },
      "stattrak": {
        "2": {
          "market": 12.9,
          "analyst": 10.7,
          "opskins": 10.14
        },
        "3": {
          "market": 14.22,
          "analyst": 11.84,
          "opskins": 10.3
        }
      },
      "souvenir": {}
    }
  },
  "571": {
    "item_id": 571,
    "type": "P90",
    "skinName": "Emerald Dragon",
    "prices": {
      "default": {
        "0": {
          "market": 14.89,
          "analyst": 20.16,
          "opskins": 23.23
        },
        "1": {
          "market": 17.14,
          "analyst": 19.21,
          "opskins": 17.89
        },
        "2": {
          "market": 20.32,
          "analyst": 17.91,
          "opskins": 16.67
        },
        "3": {
          "market": 23.83,
          "analyst": 20.44,
          "opskins": 19.17
        },
        "4": {
          "market": 70.76,
          "analyst": 81.15,
          "opskins": 75
        }
      },
      "stattrak": {
        "0": {
          "market": 44.99,
          "analyst": 45.04,
          "opskins": 77
        },
        "1": {
          "market": 59.61,
          "analyst": 70.42,
          "opskins": 100
        },
        "2": {
          "market": 56.83,
          "analyst": 52.52,
          "opskins": 42.83
        },
        "3": {
          "market": 76.48,
          "analyst": 77.38,
          "opskins": 66.99
        },
        "4": {
          "market": -1,
          "analyst": 987,
          "opskins": 1029.99
        }
      },
      "souvenir": {}
    }
  },
  "572": {
    "item_id": 572,
    "type": "P2000",
    "skinName": "Ocean Foam",
    "prices": {
      "default": {
        "3": {
          "market": 27.13,
          "analyst": 26.9,
          "opskins": 27.44
        },
        "4": {
          "market": 28.01,
          "analyst": 23.14,
          "opskins": 24.43
        }
      },
      "stattrak": {
        "3": {
          "market": 79.06,
          "analyst": 74.35,
          "opskins": 66.9
        },
        "4": {
          "market": 90.89,
          "analyst": 86.59,
          "opskins": 78.19
        }
      },
      "souvenir": {}
    }
  },
  "573": {
    "item_id": 573,
    "type": "Desert Eagle",
    "skinName": "Golden Koi",
    "prices": {
      "default": {
        "3": {
          "market": 11.8,
          "analyst": 10.23,
          "opskins": 9.94
        },
        "4": {
          "market": 12.02,
          "analyst": 9.56,
          "opskins": 9.11
        }
      },
      "stattrak": {
        "3": {
          "market": 71.73,
          "analyst": 91.83,
          "opskins": 79.99
        },
        "4": {
          "market": 84.76,
          "analyst": 76.24,
          "opskins": 59.99
        }
      },
      "souvenir": {}
    }
  },
  "574": {
    "item_id": 574,
    "type": "★ Karambit",
    "skinName": "Blue Steel",
    "prices": {
      "default": {
        "0": {
          "market": 169.07,
          "analyst": 132.57,
          "opskins": 114.49
        },
        "1": {
          "market": 177.1,
          "analyst": 137.24,
          "opskins": 114
        },
        "2": {
          "market": 180.96,
          "analyst": 145.68,
          "opskins": 123
        },
        "3": {
          "market": 204.57,
          "analyst": 163.33,
          "opskins": 133
        },
        "4": {
          "market": 239.89,
          "analyst": 253.84,
          "opskins": 215.55
        }
      },
      "stattrak": {
        "0": {
          "market": 182.8,
          "analyst": 203.55,
          "opskins": 164.97
        },
        "1": {
          "market": 184.41,
          "analyst": 253.66,
          "opskins": 198.98
        },
        "2": {
          "market": 204.08,
          "analyst": 203.49,
          "opskins": 167.99
        },
        "3": {
          "market": 259.55,
          "analyst": 273.8,
          "opskins": 220
        },
        "4": {
          "market": 576,
          "analyst": 508,
          "opskins": 690
        }
      },
      "souvenir": {}
    }
  },
  "575": {
    "item_id": 575,
    "type": "★ Bayonet",
    "skinName": "Case Hardened",
    "prices": {
      "default": {
        "0": {
          "market": 99.17,
          "analyst": 90.7,
          "opskins": 75.32
        },
        "1": {
          "market": 98.81,
          "analyst": 83.12,
          "opskins": 70
        },
        "2": {
          "market": 104.47,
          "analyst": 90.7,
          "opskins": 77.99
        },
        "3": {
          "market": 122.39,
          "analyst": 110.98,
          "opskins": 95.85
        },
        "4": {
          "market": 146.52,
          "analyst": 177.56,
          "opskins": 163.99
        }
      },
      "stattrak": {
        "0": {
          "market": 110.4,
          "analyst": 151.19,
          "opskins": 127.8
        },
        "1": {
          "market": 115.95,
          "analyst": 138.32,
          "opskins": 109.76
        },
        "2": {
          "market": 117.9,
          "analyst": 138.54,
          "opskins": 117.3
        },
        "3": {
          "market": 179.99,
          "analyst": 165.6,
          "opskins": 169.98
        },
        "4": {
          "market": 350.31,
          "analyst": 351,
          "opskins": 474
        }
      },
      "souvenir": {}
    }
  },
  "576": {
    "item_id": 576,
    "type": "★ Bowie Knife",
    "skinName": "Blue Steel",
    "prices": {
      "default": {
        "0": {
          "market": 76.27,
          "analyst": 64.65,
          "opskins": 54.39
        },
        "1": {
          "market": 82.44,
          "analyst": 62.07,
          "opskins": 54
        },
        "2": {
          "market": 86.67,
          "analyst": 63.39,
          "opskins": 54.99
        },
        "3": {
          "market": 96.6,
          "analyst": 70.45,
          "opskins": 65.87
        },
        "4": {
          "market": 209.25,
          "analyst": 220.58,
          "opskins": 190
        }
      },
      "stattrak": {
        "0": {
          "market": 113,
          "analyst": 147.51,
          "opskins": 129.57
        },
        "1": {
          "market": 183.12,
          "analyst": 108.87,
          "opskins": 110
        },
        "2": {
          "market": 119.22,
          "analyst": 113.13,
          "opskins": 89.47
        },
        "3": {
          "market": 218.27,
          "analyst": 142.43,
          "opskins": 129.99
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": 350
        }
      },
      "souvenir": {}
    }
  },
  "577": {
    "item_id": 577,
    "type": "★ Bowie Knife",
    "skinName": "Boreal Forest",
    "prices": {
      "default": {
        "0": {
          "market": 52.48,
          "analyst": 40.05,
          "opskins": 51.06
        },
        "1": {
          "market": 55.63,
          "analyst": 39.77,
          "opskins": 39.35
        },
        "2": {
          "market": 57.92,
          "analyst": 44.59,
          "opskins": 38.19
        },
        "3": {
          "market": 69.43,
          "analyst": 55.96,
          "opskins": 46.98
        },
        "4": {
          "market": 100.85,
          "analyst": 148.45,
          "opskins": 129.98
        }
      },
      "stattrak": {
        "0": {
          "market": 74,
          "analyst": 56.82,
          "opskins": 50.49
        },
        "1": {
          "market": 60,
          "analyst": 100,
          "opskins": 96.14
        },
        "2": {
          "market": 63.3,
          "analyst": 65.59,
          "opskins": 57.47
        },
        "3": {
          "market": 106.17,
          "analyst": 97.51,
          "opskins": 86.99
        }
      },
      "souvenir": {}
    }
  },
  "578": {
    "item_id": 578,
    "type": "★ Bowie Knife",
    "skinName": "Case Hardened",
    "prices": {
      "default": {
        "0": {
          "market": 82.71,
          "analyst": 73.03,
          "opskins": 62.18
        },
        "1": {
          "market": 84.58,
          "analyst": 77.79,
          "opskins": 63.7
        },
        "2": {
          "market": 92.21,
          "analyst": 77.28,
          "opskins": 67.1
        },
        "3": {
          "market": 108.95,
          "analyst": 98.84,
          "opskins": 81
        },
        "4": {
          "market": 185.78,
          "analyst": 203.02,
          "opskins": 185.96
        }
      },
      "stattrak": {
        "0": {
          "market": 127.39,
          "analyst": 137.23,
          "opskins": 128.5
        },
        "1": {
          "market": 159.22,
          "analyst": 143.44,
          "opskins": 129.99
        },
        "2": {
          "market": 189.75,
          "analyst": 154.39,
          "opskins": 153
        },
        "3": {
          "market": 327.46,
          "analyst": 238,
          "opskins": 239.98
        },
        "4": {
          "market": 399.62,
          "analyst": 473,
          "opskins": 530
        }
      },
      "souvenir": {}
    }
  },
  "579": {
    "item_id": 579,
    "type": "★ Bowie Knife",
    "skinName": "Forest DDPAT",
    "prices": {
      "default": {
        "0": {
          "market": 52.26,
          "analyst": 42.99,
          "opskins": 42.18
        },
        "1": {
          "market": 42.47,
          "analyst": 43.91,
          "opskins": 37.74
        },
        "2": {
          "market": 56.4,
          "analyst": 41.27,
          "opskins": 37.47
        },
        "3": {
          "market": 68.4,
          "analyst": 53.52,
          "opskins": 45.99
        },
        "4": {
          "market": 134.27,
          "analyst": 299,
          "opskins": 167
        }
      },
      "stattrak": {
        "0": {
          "market": 72.93,
          "analyst": 59.72,
          "opskins": 55.47
        },
        "1": {
          "market": 145.74,
          "analyst": 71,
          "opskins": 70
        },
        "2": {
          "market": 72.18,
          "analyst": 67.97,
          "opskins": 61.48
        },
        "3": {
          "market": 122.07,
          "analyst": 112.03,
          "opskins": 87.14
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "580": {
    "item_id": 580,
    "type": "★ Bowie Knife",
    "skinName": "Slaughter",
    "prices": {
      "default": {
        "2": {
          "market": 152.46,
          "analyst": 121.27,
          "opskins": 105.95
        },
        "3": {
          "market": 165.34,
          "analyst": 136.47,
          "opskins": 116.16
        },
        "4": {
          "market": 191.82,
          "analyst": 160.01,
          "opskins": 129.99
        }
      },
      "stattrak": {
        "2": {
          "market": 306.78,
          "analyst": 166,
          "opskins": 205
        },
        "3": {
          "market": 255.55,
          "analyst": 220.27,
          "opskins": 174.99
        },
        "4": {
          "market": 191.87,
          "analyst": 313.96,
          "opskins": 259.99
        }
      },
      "souvenir": {}
    }
  },
  "581": {
    "item_id": 581,
    "type": "★ Bowie Knife",
    "skinName": "Stained",
    "prices": {
      "default": {
        "0": {
          "market": 66.51,
          "analyst": 51.67,
          "opskins": 43.61
        },
        "1": {
          "market": 69.68,
          "analyst": 53.38,
          "opskins": 48.71
        },
        "2": {
          "market": 72.43,
          "analyst": 52.59,
          "opskins": 44.78
        },
        "3": {
          "market": 78.27,
          "analyst": 58.44,
          "opskins": 55.14
        },
        "4": {
          "market": 119.43,
          "analyst": 114.34,
          "opskins": 99.9
        }
      },
      "stattrak": {
        "0": {
          "market": 114.83,
          "analyst": 94.87,
          "opskins": 76.89
        },
        "1": {
          "market": 83,
          "analyst": 63.17,
          "opskins": 74.8
        },
        "2": {
          "market": 82.68,
          "analyst": 84.47,
          "opskins": 79
        },
        "3": {
          "market": 124.7,
          "analyst": 167.84,
          "opskins": 167.84
        },
        "4": {
          "market": 371.6,
          "analyst": 344,
          "opskins": 388.89
        }
      },
      "souvenir": {}
    }
  },
  "582": {
    "item_id": 582,
    "type": "★ Gut Knife",
    "skinName": "Blue Steel",
    "prices": {
      "default": {
        "0": {
          "market": 50.91,
          "analyst": 37.15,
          "opskins": 32.98
        },
        "1": {
          "market": 50.87,
          "analyst": 37.49,
          "opskins": 31.5
        },
        "2": {
          "market": 52.16,
          "analyst": 38.45,
          "opskins": 36.94
        },
        "3": {
          "market": 54.56,
          "analyst": 40.29,
          "opskins": 35.09
        },
        "4": {
          "market": 59.9,
          "analyst": 61.43,
          "opskins": 58
        }
      },
      "stattrak": {
        "0": {
          "market": 51.25,
          "analyst": 55.98,
          "opskins": 54.9
        },
        "1": {
          "market": 56.39,
          "analyst": 58.68,
          "opskins": 62.99
        },
        "2": {
          "market": 59.57,
          "analyst": 49.06,
          "opskins": 51.45
        },
        "3": {
          "market": 61.75,
          "analyst": 62.25,
          "opskins": 59.99
        },
        "4": {
          "market": 101.96,
          "analyst": 165.64,
          "opskins": 172.67
        }
      },
      "souvenir": {}
    }
  },
  "583": {
    "item_id": 583,
    "type": "★ Gut Knife",
    "skinName": "Crimson Web",
    "prices": {
      "default": {
        "0": {
          "market": 46.53,
          "analyst": 37.94,
          "opskins": 34.45
        },
        "1": {
          "market": 50.26,
          "analyst": 41.38,
          "opskins": 35.87
        },
        "2": {
          "market": 51.85,
          "analyst": 40.48,
          "opskins": 35.25
        },
        "3": {
          "market": 79.92,
          "analyst": 63.45,
          "opskins": 54.97
        },
        "4": {
          "market": 398,
          "analyst": 330,
          "opskins": 315
        }
      },
      "stattrak": {
        "0": {
          "market": 64,
          "analyst": 60.54,
          "opskins": 54.14
        },
        "1": {
          "market": 65.1,
          "analyst": 74.62,
          "opskins": 65
        },
        "2": {
          "market": 63.66,
          "analyst": 56.66,
          "opskins": 51.58
        },
        "3": {
          "market": 111,
          "analyst": 105.01,
          "opskins": 99
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "584": {
    "item_id": 584,
    "type": "★ Gut Knife",
    "skinName": "Case Hardened",
    "prices": {
      "default": {
        "0": {
          "market": 52.5,
          "analyst": 43.39,
          "opskins": 38.72
        },
        "1": {
          "market": 52.99,
          "analyst": 44.13,
          "opskins": 38.93
        },
        "2": {
          "market": 53.87,
          "analyst": 45.47,
          "opskins": 38.86
        },
        "3": {
          "market": 61.07,
          "analyst": 52.45,
          "opskins": 44.64
        },
        "4": {
          "market": 81.43,
          "analyst": 90.45,
          "opskins": 78.99
        }
      },
      "stattrak": {
        "0": {
          "market": 60.4,
          "analyst": 66.04,
          "opskins": 58.58
        },
        "1": {
          "market": 79.2,
          "analyst": 65.01,
          "opskins": 73.68
        },
        "2": {
          "market": 68.62,
          "analyst": 75.91,
          "opskins": 62.19
        },
        "3": {
          "market": 87.67,
          "analyst": 88.12,
          "opskins": 82.5
        },
        "4": {
          "market": 150.6,
          "analyst": 190,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "585": {
    "item_id": 585,
    "type": "★ Gut Knife",
    "skinName": "Slaughter",
    "prices": {
      "default": {
        "2": {
          "market": 57.22,
          "analyst": 45.55,
          "opskins": 49.47
        },
        "3": {
          "market": 66.54,
          "analyst": 55.84,
          "opskins": 48.68
        },
        "4": {
          "market": 75.26,
          "analyst": 61.27,
          "opskins": 52.5
        }
      },
      "stattrak": {
        "2": {
          "market": 70,
          "analyst": 72.57,
          "opskins": 61.29
        },
        "3": {
          "market": 79.12,
          "analyst": 77.12,
          "opskins": 64.99
        },
        "4": {
          "market": 100.91,
          "analyst": 104.28,
          "opskins": 89.9
        }
      },
      "souvenir": {}
    }
  },
  "586": {
    "item_id": 586,
    "type": "★ Gut Knife",
    "skinName": "Doppler",
    "prices": {
      "default": {
        "3": {
          "market": 75.25,
          "analyst": 60.28,
          "opskins": 53.96
        },
        "4": {
          "market": 69.92,
          "analyst": 58.29,
          "opskins": 50.31
        }
      },
      "stattrak": {
        "3": {
          "market": 100.89,
          "analyst": 113.75,
          "opskins": 129
        },
        "4": {
          "market": 90.21,
          "analyst": 81.34,
          "opskins": 72.89
        }
      },
      "souvenir": {}
    }
  },
  "587": {
    "item_id": 587,
    "type": "★ M9 Bayonet",
    "skinName": "Autotronic",
    "prices": {
      "default": {
        "0": {
          "market": 251.6,
          "analyst": 205.53,
          "opskins": 183.99
        },
        "1": {
          "market": 377.69,
          "analyst": 249.22,
          "opskins": 699
        },
        "2": {
          "market": 291.19,
          "analyst": 234.98,
          "opskins": 204.99
        },
        "3": {
          "market": 347.92,
          "analyst": 348.18,
          "opskins": 290.76
        },
        "4": {
          "market": 571.15,
          "analyst": 463,
          "opskins": 600
        }
      },
      "stattrak": {
        "0": {
          "market": 318.47,
          "analyst": 309.02,
          "opskins": 256.99
        },
        "1": {
          "market": 322.17,
          "analyst": -1,
          "opskins": 259
        },
        "2": {
          "market": 391.5,
          "analyst": 376.69,
          "opskins": 289.99
        },
        "3": {
          "market": -1,
          "analyst": 521,
          "opskins": 499.94
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": 1199
        }
      },
      "souvenir": {}
    }
  },
  "588": {
    "item_id": 588,
    "type": "★ M9 Bayonet",
    "skinName": "Bright Water",
    "prices": {
      "default": {
        "0": {
          "market": 91.56,
          "analyst": 82.64,
          "opskins": 74.68
        },
        "1": {
          "market": 94.99,
          "analyst": 93.97,
          "opskins": 84.44
        },
        "2": {
          "market": 116.68,
          "analyst": 94.28,
          "opskins": 79.94
        },
        "3": {
          "market": 147.41,
          "analyst": 114.4,
          "opskins": 100.64
        },
        "4": {
          "market": 167.29,
          "analyst": 148.64,
          "opskins": 128.99
        }
      },
      "stattrak": {
        "0": {
          "market": 172.35,
          "analyst": -1,
          "opskins": -1
        },
        "1": {
          "market": 213.14,
          "analyst": 96.69,
          "opskins": 96
        },
        "2": {
          "market": 120.19,
          "analyst": 110.39,
          "opskins": 98.42
        },
        "3": {
          "market": 180.46,
          "analyst": 186.63,
          "opskins": 168
        },
        "4": {
          "market": 318.47,
          "analyst": 318.02,
          "opskins": 269.69
        }
      },
      "souvenir": {}
    }
  },
  "589": {
    "item_id": 589,
    "type": "★ M9 Bayonet",
    "skinName": "Black Laminate",
    "prices": {
      "default": {
        "0": {
          "market": 179.83,
          "analyst": 148.41,
          "opskins": 135
        },
        "1": {
          "market": 174.33,
          "analyst": 130.92,
          "opskins": 133
        },
        "2": {
          "market": 184.96,
          "analyst": 145.66,
          "opskins": 139.99
        },
        "3": {
          "market": 200.63,
          "analyst": 169.42,
          "opskins": 145.95
        },
        "4": {
          "market": 382.16,
          "analyst": 360,
          "opskins": 364.98
        }
      },
      "stattrak": {
        "0": {
          "market": 211.8,
          "analyst": 229.29,
          "opskins": 180.23
        },
        "1": {
          "market": 180.46,
          "analyst": 173.32,
          "opskins": 155.84
        },
        "2": {
          "market": 360,
          "analyst": 201.5,
          "opskins": 183.99
        },
        "3": {
          "market": 366.23,
          "analyst": 255.79,
          "opskins": 222
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "590": {
    "item_id": 590,
    "type": "★ M9 Bayonet",
    "skinName": "Lore",
    "prices": {
      "default": {
        "0": {
          "market": 200.01,
          "analyst": 170.81,
          "opskins": 154.99
        },
        "1": {
          "market": 330.9,
          "analyst": 271.26,
          "opskins": 239.99
        },
        "2": {
          "market": 350.45,
          "analyst": 346,
          "opskins": 334.88
        },
        "3": {
          "market": 580,
          "analyst": 595,
          "opskins": 580
        },
        "4": {
          "market": 1032.75,
          "analyst": 810,
          "opskins": 894.99
        }
      },
      "stattrak": {
        "2": {
          "market": 398.88,
          "analyst": 422,
          "opskins": 420.98
        },
        "3": {
          "market": 799,
          "analyst": 766,
          "opskins": 950
        },
        "4": {
          "market": 2000,
          "analyst": -1,
          "opskins": 2299
        }
      },
      "souvenir": {}
    }
  },
  "591": {
    "item_id": 591,
    "type": "★ M9 Bayonet",
    "skinName": "Freehand",
    "prices": {
      "default": {
        "0": {
          "market": 122.07,
          "analyst": 128.02,
          "opskins": 109.95
        },
        "1": {
          "market": 142.97,
          "analyst": 128.42,
          "opskins": 114.49
        },
        "2": {
          "market": 173.81,
          "analyst": 140.6,
          "opskins": 125
        },
        "3": {
          "market": 219.78,
          "analyst": 197.29,
          "opskins": 186.98
        },
        "4": {
          "market": 287.86,
          "analyst": 265.4,
          "opskins": 234.99
        }
      },
      "stattrak": {
        "0": {
          "market": 84.8,
          "analyst": 172.15,
          "opskins": -1
        },
        "1": {
          "market": 144.45,
          "analyst": 129.14,
          "opskins": -1
        },
        "2": {
          "market": 235.69,
          "analyst": 163.55,
          "opskins": 310
        },
        "3": {
          "market": 325.25,
          "analyst": 296.81,
          "opskins": 254.99
        },
        "4": {
          "market": 382.16,
          "analyst": 335.5,
          "opskins": 339.99
        }
      },
      "souvenir": {}
    }
  },
  "592": {
    "item_id": 592,
    "type": "★ M9 Bayonet",
    "skinName": "Gamma Doppler",
    "prices": {
      "default": {
        "3": {
          "market": 330.11,
          "analyst": 334,
          "opskins": 370
        },
        "4": {
          "market": 349.66,
          "analyst": 378,
          "opskins": 359.99
        }
      },
      "stattrak": {
        "4": {
          "market": 598,
          "analyst": 488,
          "opskins": 495.99
        }
      },
      "souvenir": {}
    }
  },
  "593": {
    "item_id": 593,
    "type": "★ M9 Bayonet",
    "skinName": "Doppler",
    "prices": {
      "default": {
        "3": {
          "market": 238.25,
          "analyst": 223.27,
          "opskins": 183.82
        },
        "4": {
          "market": 224.16,
          "analyst": 207.32,
          "opskins": 170
        }
      },
      "stattrak": {
        "3": {
          "market": 309.6,
          "analyst": 330.71,
          "opskins": 302.06
        },
        "4": {
          "market": 307.84,
          "analyst": 294.1,
          "opskins": 234.93
        }
      },
      "souvenir": {}
    }
  },
  "594": {
    "item_id": 594,
    "type": "★ M9 Bayonet",
    "skinName": "Rust Coat",
    "prices": {
      "default": {
        "0": {
          "market": 101.31,
          "analyst": 75.9,
          "opskins": 64.88
        },
        "1": {
          "market": 112.44,
          "analyst": 101.4,
          "opskins": 82.32
        }
      },
      "stattrak": {
        "0": {
          "market": 122.83,
          "analyst": 107.69,
          "opskins": 94
        },
        "1": {
          "market": 214.83,
          "analyst": -1,
          "opskins": 199.97
        }
      },
      "souvenir": {}
    }
  },
  "595": {
    "item_id": 595,
    "type": "★ M9 Bayonet",
    "skinName": "Marble Fade",
    "prices": {
      "default": {
        "3": {
          "market": 361.51,
          "analyst": 397.82,
          "opskins": 338.84
        },
        "4": {
          "market": 373.58,
          "analyst": 320,
          "opskins": 309.68
        }
      },
      "stattrak": {
        "3": {
          "market": 480,
          "analyst": 371,
          "opskins": 699
        },
        "4": {
          "market": 540,
          "analyst": 417,
          "opskins": 404.9
        }
      },
      "souvenir": {}
    }
  },
  "596": {
    "item_id": 596,
    "type": "★ M9 Bayonet",
    "skinName": "Damascus Steel",
    "prices": {
      "default": {
        "0": {
          "market": 122.02,
          "analyst": 108.94,
          "opskins": 93.94
        },
        "1": {
          "market": 122.62,
          "analyst": 109.68,
          "opskins": 89.98
        },
        "2": {
          "market": 127.17,
          "analyst": 106.27,
          "opskins": 92
        },
        "3": {
          "market": 149.18,
          "analyst": 115.53,
          "opskins": 96.99
        },
        "4": {
          "market": 163.41,
          "analyst": 128.07,
          "opskins": 105.99
        }
      },
      "stattrak": {
        "0": {
          "market": 162.2,
          "analyst": -1,
          "opskins": 335
        },
        "1": {
          "market": 166.55,
          "analyst": 165.54,
          "opskins": 145
        },
        "2": {
          "market": 152.48,
          "analyst": 125.01,
          "opskins": 136
        },
        "3": {
          "market": 193.39,
          "analyst": 183.21,
          "opskins": 166.67
        },
        "4": {
          "market": 233.35,
          "analyst": 278.4,
          "opskins": 256
        }
      },
      "souvenir": {}
    }
  },
  "597": {
    "item_id": 597,
    "type": "★ M9 Bayonet",
    "skinName": "Tiger Tooth",
    "prices": {
      "default": {
        "3": {
          "market": 262.37,
          "analyst": 290.41,
          "opskins": 239.99
        },
        "4": {
          "market": 300.44,
          "analyst": 250.95,
          "opskins": 208
        }
      },
      "stattrak": {
        "3": {
          "market": 480,
          "analyst": 401,
          "opskins": -1
        },
        "4": {
          "market": 391.72,
          "analyst": 373.53,
          "opskins": 298.9
        }
      },
      "souvenir": {}
    }
  },
  "598": {
    "item_id": 598,
    "type": "★ M9 Bayonet",
    "skinName": "Ultraviolet",
    "prices": {
      "default": {
        "0": {
          "market": 87.58,
          "analyst": 67.21,
          "opskins": 58.37
        },
        "1": {
          "market": 95.86,
          "analyst": 76.96,
          "opskins": 65.27
        },
        "2": {
          "market": 104.43,
          "analyst": 78.55,
          "opskins": 65.5
        },
        "3": {
          "market": 171.83,
          "analyst": 134.32,
          "opskins": 117.89
        },
        "4": {
          "market": 594.26,
          "analyst": 750,
          "opskins": 539.99
        }
      },
      "stattrak": {
        "0": {
          "market": 95.32,
          "analyst": 92.3,
          "opskins": 99
        },
        "1": {
          "market": 112.4,
          "analyst": 106.68,
          "opskins": 94.42
        },
        "2": {
          "market": 127.54,
          "analyst": 99.34,
          "opskins": 88.38
        },
        "3": {
          "market": 232.6,
          "analyst": 244.8,
          "opskins": 213.99
        }
      },
      "souvenir": {}
    }
  },
  "599": {
    "item_id": 599,
    "type": "★ M9 Bayonet",
    "skinName": "Urban Masked",
    "prices": {
      "default": {
        "0": {
          "market": 67.99,
          "analyst": 61.7,
          "opskins": 55.29
        },
        "1": {
          "market": 68.58,
          "analyst": 60.54,
          "opskins": 51.65
        },
        "2": {
          "market": 69.51,
          "analyst": 58.33,
          "opskins": 51.68
        },
        "3": {
          "market": 101.13,
          "analyst": 76.72,
          "opskins": 69.27
        },
        "4": {
          "market": 159.84,
          "analyst": 227.91,
          "opskins": 146.98
        }
      },
      "stattrak": {
        "0": {
          "market": 56.75,
          "analyst": 76.96,
          "opskins": 94.94
        },
        "1": {
          "market": 79.16,
          "analyst": 76.5,
          "opskins": 67.62
        },
        "2": {
          "market": 90.12,
          "analyst": 75.81,
          "opskins": 64.34
        },
        "3": {
          "market": 98.85,
          "analyst": 113.42,
          "opskins": 109
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "600": {
    "item_id": 600,
    "type": "★ M9 Bayonet",
    "skinName": "Stained",
    "prices": {
      "default": {
        "0": {
          "market": 97.89,
          "analyst": 72.61,
          "opskins": 62.5
        },
        "1": {
          "market": 96.62,
          "analyst": 74.08,
          "opskins": 62.36
        },
        "2": {
          "market": 102.06,
          "analyst": 77.77,
          "opskins": 67
        },
        "3": {
          "market": 106.52,
          "analyst": 81.49,
          "opskins": 69.33
        },
        "4": {
          "market": 115.61,
          "analyst": 121.9,
          "opskins": 103.35
        }
      },
      "stattrak": {
        "0": {
          "market": 98.8,
          "analyst": 95.98,
          "opskins": 81.37
        },
        "1": {
          "market": 110.74,
          "analyst": 97.12,
          "opskins": 101.91
        },
        "2": {
          "market": 109.26,
          "analyst": 101.64,
          "opskins": 82.88
        },
        "3": {
          "market": 119.25,
          "analyst": 140.18,
          "opskins": 150
        },
        "4": {
          "market": 195.34,
          "analyst": 191.18,
          "opskins": 164.99
        }
      },
      "souvenir": {}
    }
  },
  "601": {
    "item_id": 601,
    "type": "★ M9 Bayonet",
    "skinName": "Scorched",
    "prices": {
      "default": {
        "0": {
          "market": 77.77,
          "analyst": 56.73,
          "opskins": 50.85
        },
        "1": {
          "market": 73.79,
          "analyst": 54.51,
          "opskins": 50.49
        },
        "2": {
          "market": 74.83,
          "analyst": 57.3,
          "opskins": 50.44
        },
        "3": {
          "market": 88.08,
          "analyst": 69.22,
          "opskins": 59.47
        },
        "4": {
          "market": 139.05,
          "analyst": -1,
          "opskins": 152
        }
      },
      "stattrak": {
        "0": {
          "market": 85.95,
          "analyst": 88.39,
          "opskins": 107.64
        },
        "1": {
          "market": 88.2,
          "analyst": 79.25,
          "opskins": 90
        },
        "2": {
          "market": 85.83,
          "analyst": 70.7,
          "opskins": 60.95
        },
        "3": {
          "market": 102.6,
          "analyst": 117.92,
          "opskins": 95.99
        }
      },
      "souvenir": {}
    }
  },
  "602": {
    "item_id": 602,
    "type": "★ M9 Bayonet",
    "skinName": "Safari Mesh",
    "prices": {
      "default": {
        "0": {
          "market": 67.84,
          "analyst": 57.73,
          "opskins": 52.39
        },
        "1": {
          "market": 70.7,
          "analyst": 55.24,
          "opskins": 51.16
        },
        "2": {
          "market": 70.82,
          "analyst": 55.44,
          "opskins": 48.99
        },
        "3": {
          "market": 83.75,
          "analyst": 66.97,
          "opskins": 59.79
        },
        "4": {
          "market": 159.75,
          "analyst": -1,
          "opskins": 149.95
        }
      },
      "stattrak": {
        "0": {
          "market": 74.65,
          "analyst": 82.49,
          "opskins": 80
        },
        "1": {
          "market": 76.41,
          "analyst": 100.33,
          "opskins": 88.91
        },
        "2": {
          "market": 80.07,
          "analyst": 64.28,
          "opskins": 62.25
        },
        "3": {
          "market": 93.05,
          "analyst": 95.49,
          "opskins": 83.99
        }
      },
      "souvenir": {}
    }
  },
  "603": {
    "item_id": 603,
    "type": "★ M9 Bayonet",
    "skinName": "Night",
    "prices": {
      "default": {
        "0": {
          "market": 89.47,
          "analyst": 65.47,
          "opskins": 59.93
        },
        "1": {
          "market": 92.83,
          "analyst": 81.84,
          "opskins": 66.99
        },
        "2": {
          "market": 103.25,
          "analyst": 78.92,
          "opskins": 66.64
        },
        "3": {
          "market": 165,
          "analyst": 136.79,
          "opskins": 115
        },
        "4": {
          "market": 866,
          "analyst": 681,
          "opskins": 699
        }
      },
      "stattrak": {
        "0": {
          "market": 102.43,
          "analyst": 119.24,
          "opskins": 126.28
        },
        "1": {
          "market": 103.98,
          "analyst": 103.82,
          "opskins": 135
        },
        "2": {
          "market": 128.38,
          "analyst": 114.26,
          "opskins": 105
        },
        "3": {
          "market": 254,
          "analyst": 258.4,
          "opskins": 196.42
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": 4000
        }
      },
      "souvenir": {}
    }
  },
  "604": {
    "item_id": 604,
    "type": "★ M9 Bayonet",
    "skinName": "Forest DDPAT",
    "prices": {
      "default": {
        "0": {
          "market": 76.3,
          "analyst": 59.12,
          "opskins": 52.4
        },
        "1": {
          "market": 77.95,
          "analyst": 62.62,
          "opskins": 53.91
        },
        "2": {
          "market": 79.95,
          "analyst": 59.02,
          "opskins": 49.98
        },
        "3": {
          "market": 97.52,
          "analyst": 75.55,
          "opskins": 62.46
        },
        "4": {
          "market": 215.55,
          "analyst": -1,
          "opskins": 292
        }
      },
      "stattrak": {
        "0": {
          "market": 83.31,
          "analyst": 90.2,
          "opskins": 74.99
        },
        "1": {
          "market": 86.63,
          "analyst": 82.86,
          "opskins": 74.99
        },
        "2": {
          "market": 90.8,
          "analyst": 82.16,
          "opskins": 79.99
        },
        "3": {
          "market": 126.63,
          "analyst": 152.67,
          "opskins": 136
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "605": {
    "item_id": 605,
    "type": "★ M9 Bayonet",
    "skinName": "Fade",
    "prices": {
      "default": {
        "3": {
          "market": 228.05,
          "analyst": 244.29,
          "opskins": 204.95
        },
        "4": {
          "market": 261.11,
          "analyst": 215.3,
          "opskins": 181.68
        }
      },
      "stattrak": {
        "3": {
          "market": 408.75,
          "analyst": 500,
          "opskins": 374.99
        },
        "4": {
          "market": 368.94,
          "analyst": 354,
          "opskins": 275.99
        }
      },
      "souvenir": {}
    }
  },
  "606": {
    "item_id": 606,
    "type": "★ M9 Bayonet",
    "skinName": "Case Hardened",
    "prices": {
      "default": {
        "0": {
          "market": 117.59,
          "analyst": 102.29,
          "opskins": 87.15
        },
        "1": {
          "market": 116.6,
          "analyst": 104.04,
          "opskins": 84.38
        },
        "2": {
          "market": 122.26,
          "analyst": 110.36,
          "opskins": 92.07
        },
        "3": {
          "market": 143.1,
          "analyst": 123.14,
          "opskins": 103.8
        },
        "4": {
          "market": 207.99,
          "analyst": 187.62,
          "opskins": 179.98
        }
      },
      "stattrak": {
        "0": {
          "market": 144.12,
          "analyst": 139.56,
          "opskins": 126.11
        },
        "1": {
          "market": 168.2,
          "analyst": 156.19,
          "opskins": 130
        },
        "2": {
          "market": 151.18,
          "analyst": 159.92,
          "opskins": 144.11
        },
        "3": {
          "market": 202.4,
          "analyst": 214.56,
          "opskins": 195
        },
        "4": {
          "market": 445.63,
          "analyst": 500,
          "opskins": 399.99
        }
      },
      "souvenir": {}
    }
  },
  "607": {
    "item_id": 607,
    "type": "★ M9 Bayonet",
    "skinName": "Blue Steel",
    "prices": {
      "default": {
        "0": {
          "market": 130.44,
          "analyst": 97.67,
          "opskins": 86
        },
        "1": {
          "market": 123.47,
          "analyst": 97,
          "opskins": 85.55
        },
        "2": {
          "market": 132.06,
          "analyst": 101.57,
          "opskins": 91.55
        },
        "3": {
          "market": 146.26,
          "analyst": 110.37,
          "opskins": 97.75
        },
        "4": {
          "market": 172.88,
          "analyst": 180.69,
          "opskins": 157.49
        }
      },
      "stattrak": {
        "0": {
          "market": 131.11,
          "analyst": 127.78,
          "opskins": 108.89
        },
        "1": {
          "market": 144,
          "analyst": 147.24,
          "opskins": 137
        },
        "2": {
          "market": 150.95,
          "analyst": 135.92,
          "opskins": 115.53
        },
        "3": {
          "market": 165.55,
          "analyst": 186.23,
          "opskins": 159
        },
        "4": {
          "market": 607.5,
          "analyst": 525,
          "opskins": 494.99
        }
      },
      "souvenir": {}
    }
  },
  "608": {
    "item_id": 608,
    "type": "★ Karambit",
    "skinName": "Bright Water",
    "prices": {
      "default": {
        "0": {
          "market": 166.08,
          "analyst": 127.28,
          "opskins": 111.11
        },
        "1": {
          "market": 162,
          "analyst": 138.77,
          "opskins": 120.17
        },
        "2": {
          "market": 169.38,
          "analyst": 131.45,
          "opskins": 114.28
        },
        "3": {
          "market": 198.63,
          "analyst": 170.58,
          "opskins": 150
        },
        "4": {
          "market": 237.42,
          "analyst": 201.73,
          "opskins": 165
        }
      },
      "stattrak": {
        "1": {
          "market": 194.69,
          "analyst": 134,
          "opskins": 179.99
        },
        "2": {
          "market": 167.29,
          "analyst": 160.3,
          "opskins": 145
        },
        "3": {
          "market": 237.84,
          "analyst": 283.5,
          "opskins": 221.98
        },
        "4": {
          "market": 380.22,
          "analyst": 341,
          "opskins": 311.8
        }
      },
      "souvenir": {}
    }
  },
  "609": {
    "item_id": 609,
    "type": "★ Karambit",
    "skinName": "Autotronic",
    "prices": {
      "default": {
        "0": {
          "market": 309.83,
          "analyst": 273.72,
          "opskins": 265
        },
        "1": {
          "market": 353.25,
          "analyst": 271,
          "opskins": 299
        },
        "2": {
          "market": 361.83,
          "analyst": 323.77,
          "opskins": 278.99
        },
        "3": {
          "market": 494.1,
          "analyst": 379,
          "opskins": 384.99
        },
        "4": {
          "market": 796.5,
          "analyst": 630,
          "opskins": 619.99
        }
      },
      "stattrak": {
        "0": {
          "market": 388.02,
          "analyst": 372.13,
          "opskins": 299.99
        },
        "1": {
          "market": 386,
          "analyst": -1,
          "opskins": 319
        },
        "2": {
          "market": 437.85,
          "analyst": 331,
          "opskins": 344.99
        },
        "3": {
          "market": -1,
          "analyst": 460,
          "opskins": 534.5
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "610": {
    "item_id": 610,
    "type": "★ Karambit",
    "skinName": "Black Laminate",
    "prices": {
      "default": {
        "0": {
          "market": 234.09,
          "analyst": 202.29,
          "opskins": 167.86
        },
        "1": {
          "market": 234.56,
          "analyst": 191.18,
          "opskins": 170
        },
        "2": {
          "market": 263.57,
          "analyst": 208.48,
          "opskins": 200
        },
        "3": {
          "market": 299.61,
          "analyst": 259.08,
          "opskins": 218.88
        },
        "4": {
          "market": 386,
          "analyst": 350,
          "opskins": 379.84
        }
      },
      "stattrak": {
        "0": {
          "market": 297.1,
          "analyst": 219,
          "opskins": 226
        },
        "1": {
          "market": 265.37,
          "analyst": 292.41,
          "opskins": 268.5
        },
        "2": {
          "market": 337.84,
          "analyst": 291,
          "opskins": 298
        },
        "3": {
          "market": 350.37,
          "analyst": 341,
          "opskins": 385
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": 999
        }
      },
      "souvenir": {}
    }
  },
  "611": {
    "item_id": 611,
    "type": "★ Karambit",
    "skinName": "Lore",
    "prices": {
      "default": {
        "0": {
          "market": 249.99,
          "analyst": 267.44,
          "opskins": 236.9
        },
        "1": {
          "market": 280,
          "analyst": 357.77,
          "opskins": 315
        },
        "2": {
          "market": 330.1,
          "analyst": 352,
          "opskins": 355
        },
        "3": {
          "market": 560,
          "analyst": 580,
          "opskins": 587
        },
        "4": {
          "market": 959.1,
          "analyst": 926,
          "opskins": 978
        }
      },
      "stattrak": {
        "0": {
          "market": 383,
          "analyst": -1,
          "opskins": 333
        },
        "1": {
          "market": 350,
          "analyst": -1,
          "opskins": -1
        },
        "2": {
          "market": 394.75,
          "analyst": 465,
          "opskins": 460
        },
        "3": {
          "market": 724,
          "analyst": -1,
          "opskins": 660
        },
        "4": {
          "market": 1489.6,
          "analyst": 189.6,
          "opskins": 1298.57
        }
      },
      "souvenir": {}
    }
  },
  "612": {
    "item_id": 612,
    "type": "★ Karambit",
    "skinName": "Freehand",
    "prices": {
      "default": {
        "0": {
          "market": 273.75,
          "analyst": 203.87,
          "opskins": 187.99
        },
        "1": {
          "market": 216.76,
          "analyst": 212.97,
          "opskins": 189.89
        },
        "2": {
          "market": 245.55,
          "analyst": 225.73,
          "opskins": 182
        },
        "3": {
          "market": 305.82,
          "analyst": 265.75,
          "opskins": 235.59
        },
        "4": {
          "market": 357.95,
          "analyst": 358.8,
          "opskins": 284.98
        }
      },
      "stattrak": {
        "1": {
          "market": 395.45,
          "analyst": -1,
          "opskins": 235
        },
        "2": {
          "market": 325.5,
          "analyst": 332.44,
          "opskins": 295
        },
        "3": {
          "market": 381.4,
          "analyst": 345,
          "opskins": 345.8
        },
        "4": {
          "market": 347.61,
          "analyst": -1,
          "opskins": 369.82
        }
      },
      "souvenir": {}
    }
  },
  "613": {
    "item_id": 613,
    "type": "★ Karambit",
    "skinName": "Gamma Doppler",
    "prices": {
      "default": {
        "3": {
          "market": 540,
          "analyst": -1,
          "opskins": 450
        },
        "4": {
          "market": 580,
          "analyst": 781,
          "opskins": 476.98
        }
      },
      "stattrak": {
        "3": {
          "market": -1,
          "analyst": -1,
          "opskins": 549.99
        },
        "4": {
          "market": 987,
          "analyst": 716,
          "opskins": 765
        }
      },
      "souvenir": {}
    }
  },
  "614": {
    "item_id": 614,
    "type": "★ Karambit",
    "skinName": "Doppler",
    "prices": {
      "default": {
        "3": {
          "market": 318.05,
          "analyst": 314.54,
          "opskins": 248.49
        },
        "4": {
          "market": 297.1,
          "analyst": 279.87,
          "opskins": 231.7
        }
      },
      "stattrak": {
        "3": {
          "market": 390.15,
          "analyst": 292,
          "opskins": 350
        },
        "4": {
          "market": 378.58,
          "analyst": 324,
          "opskins": 325
        }
      },
      "souvenir": {}
    }
  },
  "615": {
    "item_id": 615,
    "type": "★ Karambit",
    "skinName": "Rust Coat",
    "prices": {
      "default": {
        "0": {
          "market": 130.98,
          "analyst": 114.78,
          "opskins": 99.99
        },
        "1": {
          "market": 151.64,
          "analyst": 137.63,
          "opskins": 115.79
        }
      },
      "stattrak": {
        "0": {
          "market": 179.7,
          "analyst": 160.22,
          "opskins": 137.78
        },
        "1": {
          "market": 314.36,
          "analyst": 303,
          "opskins": 499
        }
      },
      "souvenir": {}
    }
  },
  "616": {
    "item_id": 616,
    "type": "★ Karambit",
    "skinName": "Marble Fade",
    "prices": {
      "default": {
        "3": {
          "market": 470.55,
          "analyst": 351,
          "opskins": 379.99
        },
        "4": {
          "market": 346.03,
          "analyst": 387,
          "opskins": 364.56
        }
      },
      "stattrak": {
        "3": {
          "market": -1,
          "analyst": 453,
          "opskins": 469
        },
        "4": {
          "market": 612,
          "analyst": 513,
          "opskins": 475
        }
      },
      "souvenir": {}
    }
  },
  "617": {
    "item_id": 617,
    "type": "★ Karambit",
    "skinName": "Damascus Steel",
    "prices": {
      "default": {
        "0": {
          "market": 181.9,
          "analyst": 164.75,
          "opskins": 147.99
        },
        "1": {
          "market": 185.24,
          "analyst": 171.38,
          "opskins": 139.99
        },
        "2": {
          "market": 200.04,
          "analyst": 159.12,
          "opskins": 134.89
        },
        "3": {
          "market": 228.05,
          "analyst": 192.08,
          "opskins": 155
        },
        "4": {
          "market": 203.61,
          "analyst": 216.89,
          "opskins": 182
        }
      },
      "stattrak": {
        "0": {
          "market": 220.12,
          "analyst": 243,
          "opskins": -1
        },
        "1": {
          "market": 305,
          "analyst": 276.76,
          "opskins": 257.99
        },
        "2": {
          "market": 229.77,
          "analyst": 206.69,
          "opskins": 177
        },
        "3": {
          "market": 280.25,
          "analyst": 282.68,
          "opskins": 238.99
        },
        "4": {
          "market": 380.1,
          "analyst": 396.92,
          "opskins": 330.08
        }
      },
      "souvenir": {}
    }
  },
  "618": {
    "item_id": 618,
    "type": "★ Karambit",
    "skinName": "Tiger Tooth",
    "prices": {
      "default": {
        "3": {
          "market": 391.33,
          "analyst": 316,
          "opskins": 329
        },
        "4": {
          "market": 417.54,
          "analyst": 319,
          "opskins": 320.4
        }
      },
      "stattrak": {
        "3": {
          "market": 655.29,
          "analyst": 528,
          "opskins": 788.26
        },
        "4": {
          "market": 519.1,
          "analyst": 417,
          "opskins": 408.22
        }
      },
      "souvenir": {}
    }
  },
  "619": {
    "item_id": 619,
    "type": "★ Karambit",
    "skinName": "Urban Masked",
    "prices": {
      "default": {
        "0": {
          "market": 89.95,
          "analyst": 84.31,
          "opskins": 75.89
        },
        "1": {
          "market": 108.12,
          "analyst": 92.24,
          "opskins": 75.64
        },
        "2": {
          "market": 88.17,
          "analyst": 89.58,
          "opskins": 79
        },
        "3": {
          "market": 143.65,
          "analyst": 109.09,
          "opskins": 97.58
        },
        "4": {
          "market": 342.05,
          "analyst": 332,
          "opskins": -1
        }
      },
      "stattrak": {
        "0": {
          "market": 109.09,
          "analyst": 111.9,
          "opskins": 110
        },
        "1": {
          "market": 121.1,
          "analyst": 175.12,
          "opskins": 134.99
        },
        "2": {
          "market": 134.56,
          "analyst": 126.48,
          "opskins": 104.99
        },
        "3": {
          "market": 165,
          "analyst": 237.52,
          "opskins": 177.69
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "620": {
    "item_id": 620,
    "type": "★ Karambit",
    "skinName": "Stained",
    "prices": {
      "default": {
        "0": {
          "market": 150.16,
          "analyst": 116.73,
          "opskins": 97.95
        },
        "1": {
          "market": 157.7,
          "analyst": 124.36,
          "opskins": 104.99
        },
        "2": {
          "market": 162.49,
          "analyst": 128.55,
          "opskins": 106.75
        },
        "3": {
          "market": 173.58,
          "analyst": 139.96,
          "opskins": 114.66
        },
        "4": {
          "market": 216.25,
          "analyst": 225.38,
          "opskins": 198.56
        }
      },
      "stattrak": {
        "0": {
          "market": 138.72,
          "analyst": 149.9,
          "opskins": 141.79
        },
        "1": {
          "market": 153.45,
          "analyst": 163.77,
          "opskins": 134.28
        },
        "2": {
          "market": 178.49,
          "analyst": 168.34,
          "opskins": 170
        },
        "3": {
          "market": 225.79,
          "analyst": 183.27,
          "opskins": 183.9
        },
        "4": {
          "market": 550.71,
          "analyst": 573,
          "opskins": 484.99
        }
      },
      "souvenir": {}
    }
  },
  "621": {
    "item_id": 621,
    "type": "★ Karambit",
    "skinName": "Scorched",
    "prices": {
      "default": {
        "0": {
          "market": 108.36,
          "analyst": 81.81,
          "opskins": 71.9
        },
        "1": {
          "market": 104,
          "analyst": 88.81,
          "opskins": 73.97
        },
        "2": {
          "market": 109.62,
          "analyst": 86.37,
          "opskins": 73.79
        },
        "3": {
          "market": 129.65,
          "analyst": 101.75,
          "opskins": 85.89
        },
        "4": {
          "market": 340.6,
          "analyst": 261,
          "opskins": 299
        }
      },
      "stattrak": {
        "0": {
          "market": 110.8,
          "analyst": 129.13,
          "opskins": 105.56
        },
        "1": {
          "market": 135,
          "analyst": 130.73,
          "opskins": 117.6
        },
        "2": {
          "market": 135.78,
          "analyst": 119.08,
          "opskins": 115
        },
        "3": {
          "market": 180,
          "analyst": 189.75,
          "opskins": 155
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "622": {
    "item_id": 622,
    "type": "★ Karambit",
    "skinName": "Safari Mesh",
    "prices": {
      "default": {
        "0": {
          "market": 103.42,
          "analyst": 81.94,
          "opskins": 71.4
        },
        "1": {
          "market": 99.06,
          "analyst": 82.63,
          "opskins": 70.83
        },
        "2": {
          "market": 105.41,
          "analyst": 80.83,
          "opskins": 70.5
        },
        "3": {
          "market": 114.92,
          "analyst": 95.45,
          "opskins": 79.89
        },
        "4": {
          "market": 194,
          "analyst": 273.09,
          "opskins": 245
        }
      },
      "stattrak": {
        "0": {
          "market": 103.35,
          "analyst": 109.23,
          "opskins": 99.99
        },
        "1": {
          "market": 113.68,
          "analyst": -1,
          "opskins": 111.84
        },
        "2": {
          "market": 118,
          "analyst": 104.91,
          "opskins": 89.75
        },
        "3": {
          "market": 131.72,
          "analyst": 118.89,
          "opskins": 100
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "623": {
    "item_id": 623,
    "type": "★ Karambit",
    "skinName": "Night",
    "prices": {
      "default": {
        "0": {
          "market": 142.58,
          "analyst": 127.83,
          "opskins": 101.97
        },
        "1": {
          "market": 153.82,
          "analyst": 124.91,
          "opskins": 104.98
        },
        "2": {
          "market": 157.74,
          "analyst": 125.2,
          "opskins": 105
        },
        "3": {
          "market": 215.51,
          "analyst": 182.57,
          "opskins": 159.99
        },
        "4": {
          "market": 972.99,
          "analyst": 738,
          "opskins": 735
        }
      },
      "stattrak": {
        "0": {
          "market": 145.85,
          "analyst": 165.55,
          "opskins": 131.58
        },
        "1": {
          "market": 207,
          "analyst": 214.95,
          "opskins": 188.99
        },
        "2": {
          "market": 196.68,
          "analyst": 178.19,
          "opskins": 145
        },
        "3": {
          "market": 306.19,
          "analyst": 287.66,
          "opskins": 235.87
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "624": {
    "item_id": 624,
    "type": "★ Karambit",
    "skinName": "Fade",
    "prices": {
      "default": {
        "3": {
          "market": 440.1,
          "analyst": 341,
          "opskins": 350
        },
        "4": {
          "market": 400.43,
          "analyst": 361,
          "opskins": 357
        }
      },
      "stattrak": {
        "3": {
          "market": -1,
          "analyst": 490,
          "opskins": 450
        },
        "4": {
          "market": 540,
          "analyst": 454,
          "opskins": 464.98
        }
      },
      "souvenir": {}
    }
  },
  "625": {
    "item_id": 625,
    "type": "★ Karambit",
    "skinName": "Crimson Web",
    "prices": {
      "default": {
        "0": {
          "market": 173.11,
          "analyst": 139.11,
          "opskins": 116.93
        },
        "1": {
          "market": 210.28,
          "analyst": 201.39,
          "opskins": 159.89
        },
        "2": {
          "market": 227.58,
          "analyst": 198.31,
          "opskins": 163.7
        },
        "3": {
          "market": 403.46,
          "analyst": 334,
          "opskins": 331.99
        },
        "4": {
          "market": 1756.47,
          "analyst": 1363,
          "opskins": 1499
        }
      },
      "stattrak": {
        "0": {
          "market": 237.85,
          "analyst": 207.72,
          "opskins": 210.95
        },
        "1": {
          "market": 265.75,
          "analyst": 212,
          "opskins": 224.9
        },
        "2": {
          "market": 271.37,
          "analyst": 303.96,
          "opskins": 232.99
        },
        "3": {
          "market": 510.75,
          "analyst": 413,
          "opskins": 498.99
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": 8999
        }
      },
      "souvenir": {}
    }
  },
  "626": {
    "item_id": 626,
    "type": "★ Butterfly Knife",
    "skinName": "Urban Masked",
    "prices": {
      "default": {
        "0": {
          "market": 65.6,
          "analyst": 50.24,
          "opskins": 45.1
        },
        "1": {
          "market": 69.49,
          "analyst": 52.16,
          "opskins": 47.96
        },
        "2": {
          "market": 69.54,
          "analyst": 53.02,
          "opskins": 51.49
        },
        "3": {
          "market": 86.74,
          "analyst": 64.91,
          "opskins": 58.04
        },
        "4": {
          "market": 145.16,
          "analyst": 180.77,
          "opskins": 124.98
        }
      },
      "stattrak": {
        "0": {
          "market": 74.84,
          "analyst": 75.59,
          "opskins": 57.44
        },
        "1": {
          "market": 71.81,
          "analyst": 74.13,
          "opskins": 61.98
        },
        "2": {
          "market": 79.75,
          "analyst": 77.63,
          "opskins": 64
        },
        "3": {
          "market": 112.85,
          "analyst": 113.06,
          "opskins": 150
        },
        "4": {
          "market": 204.64,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "627": {
    "item_id": 627,
    "type": "★ Butterfly Knife",
    "skinName": "Scorched",
    "prices": {
      "default": {
        "0": {
          "market": 64.11,
          "analyst": 49.61,
          "opskins": 43.24
        },
        "1": {
          "market": 68.74,
          "analyst": 55.44,
          "opskins": 51.45
        },
        "2": {
          "market": 68.32,
          "analyst": 51.35,
          "opskins": 45.39
        },
        "3": {
          "market": 88.59,
          "analyst": 66.72,
          "opskins": 56.29
        },
        "4": {
          "market": 91.1,
          "analyst": 174.18,
          "opskins": 144.44
        }
      },
      "stattrak": {
        "0": {
          "market": 63.72,
          "analyst": 73.13,
          "opskins": 64.89
        },
        "1": {
          "market": 73.04,
          "analyst": 93.82,
          "opskins": 82.99
        },
        "2": {
          "market": 77.15,
          "analyst": 71.99,
          "opskins": 61
        },
        "3": {
          "market": 95.48,
          "analyst": 117.15,
          "opskins": 86
        },
        "4": {
          "market": 226.25,
          "analyst": 410,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "628": {
    "item_id": 628,
    "type": "★ Butterfly Knife",
    "skinName": "Night",
    "prices": {
      "default": {
        "0": {
          "market": 73.12,
          "analyst": 54.33,
          "opskins": 49.42
        },
        "1": {
          "market": 90.69,
          "analyst": 68.14,
          "opskins": 57.99
        },
        "2": {
          "market": 91.3,
          "analyst": 70.59,
          "opskins": 58.41
        },
        "3": {
          "market": 143.51,
          "analyst": 110.59,
          "opskins": 94.85
        },
        "4": {
          "market": 472,
          "analyst": 360,
          "opskins": -1
        }
      },
      "stattrak": {
        "0": {
          "market": 64.12,
          "analyst": 89.47,
          "opskins": 129.48
        },
        "1": {
          "market": 98.39,
          "analyst": 110.69,
          "opskins": 111.11
        },
        "2": {
          "market": 116.02,
          "analyst": 101.14,
          "opskins": 89.75
        },
        "3": {
          "market": 207.7,
          "analyst": 196,
          "opskins": 163
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "629": {
    "item_id": 629,
    "type": "★ Flip Knife",
    "skinName": "Bright Water",
    "prices": {
      "default": {
        "0": {
          "market": 55.78,
          "analyst": 49.57,
          "opskins": 55
        },
        "1": {
          "market": 66.89,
          "analyst": 60.2,
          "opskins": 64.95
        },
        "2": {
          "market": 71.02,
          "analyst": 54.09,
          "opskins": 46.93
        },
        "3": {
          "market": 79.19,
          "analyst": 64.73,
          "opskins": 59.89
        },
        "4": {
          "market": 90.99,
          "analyst": 71.32,
          "opskins": 63.99
        }
      },
      "stattrak": {
        "2": {
          "market": 253.52,
          "analyst": 69.15,
          "opskins": 83.9
        },
        "3": {
          "market": 122.07,
          "analyst": 88.76,
          "opskins": 85.89
        },
        "4": {
          "market": 143.31,
          "analyst": 116.9,
          "opskins": 130
        }
      },
      "souvenir": {}
    }
  },
  "630": {
    "item_id": 630,
    "type": "★ Flip Knife",
    "skinName": "Autotronic",
    "prices": {
      "default": {
        "0": {
          "market": 103.74,
          "analyst": 89.86,
          "opskins": 77.77
        },
        "1": {
          "market": 120.56,
          "analyst": 103.5,
          "opskins": 103.99
        },
        "2": {
          "market": 121.23,
          "analyst": 96.73,
          "opskins": 84.44
        },
        "3": {
          "market": 145.98,
          "analyst": 120.99,
          "opskins": 111.96
        },
        "4": {
          "market": 170,
          "analyst": 176.57,
          "opskins": 179.99
        }
      },
      "stattrak": {
        "0": {
          "market": 125.05,
          "analyst": 124.6,
          "opskins": 145
        },
        "1": {
          "market": 241.05,
          "analyst": -1,
          "opskins": 200
        },
        "2": {
          "market": 139.91,
          "analyst": 126.25,
          "opskins": 124.5
        },
        "3": {
          "market": 189.21,
          "analyst": 189.71,
          "opskins": 175.79
        },
        "4": {
          "market": 400,
          "analyst": -1,
          "opskins": 380
        }
      },
      "souvenir": {}
    }
  },
  "631": {
    "item_id": 631,
    "type": "★ Flip Knife",
    "skinName": "Black Laminate",
    "prices": {
      "default": {
        "0": {
          "market": 75.18,
          "analyst": 57.32,
          "opskins": 54.4
        },
        "1": {
          "market": 73.42,
          "analyst": 56.99,
          "opskins": 55.08
        },
        "2": {
          "market": 75.73,
          "analyst": 58.63,
          "opskins": 54.72
        },
        "3": {
          "market": 80.34,
          "analyst": 63.24,
          "opskins": 60.65
        },
        "4": {
          "market": 183.12,
          "analyst": 111.89,
          "opskins": 161.7
        }
      },
      "stattrak": {
        "0": {
          "market": 306.86,
          "analyst": 81.89,
          "opskins": 145.5
        },
        "1": {
          "market": 83.62,
          "analyst": 73.46,
          "opskins": 100
        },
        "2": {
          "market": 94.47,
          "analyst": 90.74,
          "opskins": 76.75
        },
        "3": {
          "market": 120,
          "analyst": 128.72,
          "opskins": 128
        },
        "4": {
          "market": 400,
          "analyst": -1,
          "opskins": 319.99
        }
      },
      "souvenir": {}
    }
  },
  "632": {
    "item_id": 632,
    "type": "★ Flip Knife",
    "skinName": "Lore",
    "prices": {
      "default": {
        "0": {
          "market": 130,
          "analyst": 96.22,
          "opskins": 96.82
        },
        "1": {
          "market": 207,
          "analyst": 139.94,
          "opskins": 140
        },
        "2": {
          "market": 175.2,
          "analyst": 135.49,
          "opskins": 119.99
        },
        "3": {
          "market": 161,
          "analyst": 198.68,
          "opskins": 184
        },
        "4": {
          "market": 302.66,
          "analyst": 314.31,
          "opskins": 269.95
        }
      },
      "stattrak": {
        "0": {
          "market": 230,
          "analyst": -1,
          "opskins": 160
        },
        "2": {
          "market": 200.67,
          "analyst": 193.78,
          "opskins": 174.98
        },
        "3": {
          "market": 340,
          "analyst": 271.34,
          "opskins": 244.43
        },
        "4": {
          "market": 389.28,
          "analyst": 465,
          "opskins": 399.94
        }
      },
      "souvenir": {}
    }
  },
  "633": {
    "item_id": 633,
    "type": "★ Flip Knife",
    "skinName": "Freehand",
    "prices": {
      "default": {
        "0": {
          "market": 70.91,
          "analyst": 71.82,
          "opskins": 250
        },
        "1": {
          "market": 90.51,
          "analyst": 82.68,
          "opskins": 74.93
        },
        "2": {
          "market": 98.34,
          "analyst": 78.63,
          "opskins": 71.54
        },
        "3": {
          "market": 108.02,
          "analyst": 90.99,
          "opskins": 82.68
        },
        "4": {
          "market": 116.81,
          "analyst": 99.23,
          "opskins": 86.02
        }
      },
      "stattrak": {
        "1": {
          "market": 106,
          "analyst": -1,
          "opskins": -1
        },
        "2": {
          "market": 120.55,
          "analyst": 110.35,
          "opskins": 93.99
        },
        "3": {
          "market": 141.94,
          "analyst": 129,
          "opskins": 124.99
        },
        "4": {
          "market": 149.8,
          "analyst": 170,
          "opskins": 169.99
        }
      },
      "souvenir": {}
    }
  },
  "634": {
    "item_id": 634,
    "type": "★ Flip Knife",
    "skinName": "Gamma Doppler",
    "prices": {
      "default": {
        "3": {
          "market": 278.48,
          "analyst": 260.02,
          "opskins": 240
        },
        "4": {
          "market": 178.48,
          "analyst": 177.73,
          "opskins": 144.99
        }
      },
      "stattrak": {
        "3": {
          "market": 379.99,
          "analyst": -1,
          "opskins": 255
        },
        "4": {
          "market": 364.98,
          "analyst": 328.01,
          "opskins": 292
        }
      },
      "souvenir": {}
    }
  },
  "635": {
    "item_id": 635,
    "type": "★ Flip Knife",
    "skinName": "Rust Coat",
    "prices": {
      "default": {
        "0": {
          "market": 57.6,
          "analyst": 43.31,
          "opskins": 37.24
        },
        "1": {
          "market": 62.99,
          "analyst": 50.4,
          "opskins": 45.7
        }
      },
      "stattrak": {
        "0": {
          "market": 73.49,
          "analyst": 58.36,
          "opskins": 51.48
        },
        "1": {
          "market": 152.19,
          "analyst": -1,
          "opskins": 221.99
        }
      },
      "souvenir": {}
    }
  },
  "636": {
    "item_id": 636,
    "type": "★ Flip Knife",
    "skinName": "Marble Fade",
    "prices": {
      "default": {
        "3": {
          "market": 174.52,
          "analyst": 199.56,
          "opskins": 162.76
        },
        "4": {
          "market": 162.04,
          "analyst": 143.4,
          "opskins": 121
        }
      },
      "stattrak": {
        "3": {
          "market": 290.32,
          "analyst": 284,
          "opskins": 200
        },
        "4": {
          "market": 240,
          "analyst": 236.22,
          "opskins": 185
        }
      },
      "souvenir": {}
    }
  },
  "637": {
    "item_id": 637,
    "type": "★ Flip Knife",
    "skinName": "Damascus Steel",
    "prices": {
      "default": {
        "0": {
          "market": 62.8,
          "analyst": 52.65,
          "opskins": 45.68
        },
        "1": {
          "market": 63.94,
          "analyst": 49.74,
          "opskins": 55
        },
        "2": {
          "market": 65.45,
          "analyst": 49.69,
          "opskins": 42.92
        },
        "3": {
          "market": 74.12,
          "analyst": 57.32,
          "opskins": 51.03
        },
        "4": {
          "market": 83.19,
          "analyst": 62.71,
          "opskins": 52.7
        }
      },
      "stattrak": {
        "0": {
          "market": 73.17,
          "analyst": 85.05,
          "opskins": 70
        },
        "1": {
          "market": 73.31,
          "analyst": 75.4,
          "opskins": 65
        },
        "2": {
          "market": 84.87,
          "analyst": 88.03,
          "opskins": 80.16
        },
        "3": {
          "market": 92.46,
          "analyst": 88.57,
          "opskins": 78
        },
        "4": {
          "market": 118.1,
          "analyst": 114.93,
          "opskins": 101.96
        }
      },
      "souvenir": {}
    }
  },
  "638": {
    "item_id": 638,
    "type": "★ Flip Knife",
    "skinName": "Tiger Tooth",
    "prices": {
      "default": {
        "3": {
          "market": 139.25,
          "analyst": 143.78,
          "opskins": 123.99
        },
        "4": {
          "market": 144.04,
          "analyst": 117.55,
          "opskins": 98
        }
      },
      "stattrak": {
        "3": {
          "market": 379.99,
          "analyst": -1,
          "opskins": 320.5
        },
        "4": {
          "market": 200.02,
          "analyst": 177.58,
          "opskins": 143.19
        }
      },
      "souvenir": {}
    }
  },
  "639": {
    "item_id": 639,
    "type": "★ Flip Knife",
    "skinName": "Ultraviolet",
    "prices": {
      "default": {
        "0": {
          "market": 52.92,
          "analyst": 40.12,
          "opskins": 36.96
        },
        "1": {
          "market": 63.61,
          "analyst": 54.57,
          "opskins": 45.69
        },
        "2": {
          "market": 68.48,
          "analyst": 50.53,
          "opskins": 43.5
        },
        "3": {
          "market": 101.23,
          "analyst": 78.36,
          "opskins": 67.99
        },
        "4": {
          "market": 241,
          "analyst": 305.65,
          "opskins": 229.99
        }
      },
      "stattrak": {
        "0": {
          "market": 64.35,
          "analyst": 62.57,
          "opskins": 55.59
        },
        "1": {
          "market": 77.57,
          "analyst": 98.28,
          "opskins": 79.92
        },
        "2": {
          "market": 84.68,
          "analyst": 80.99,
          "opskins": 67.89
        },
        "3": {
          "market": 126.51,
          "analyst": 144.72,
          "opskins": 122.72
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "640": {
    "item_id": 640,
    "type": "★ Flip Knife",
    "skinName": "Urban Masked",
    "prices": {
      "default": {
        "0": {
          "market": 47.88,
          "analyst": 34.68,
          "opskins": 30.93
        },
        "1": {
          "market": 50.54,
          "analyst": 39.6,
          "opskins": 35.89
        },
        "2": {
          "market": 50.59,
          "analyst": 37.49,
          "opskins": 31.99
        },
        "3": {
          "market": 58.22,
          "analyst": 43.22,
          "opskins": 40.1
        },
        "4": {
          "market": 88.4,
          "analyst": -1,
          "opskins": 100.23
        }
      },
      "stattrak": {
        "0": {
          "market": 50.1,
          "analyst": 54.14,
          "opskins": 48.85
        },
        "1": {
          "market": 55.18,
          "analyst": 66.8,
          "opskins": 53.99
        },
        "2": {
          "market": 63.21,
          "analyst": 50.03,
          "opskins": 44.85
        },
        "3": {
          "market": 65.76,
          "analyst": 69,
          "opskins": 64.02
        },
        "4": {
          "market": -1,
          "analyst": 96,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "641": {
    "item_id": 641,
    "type": "★ Flip Knife",
    "skinName": "Stained",
    "prices": {
      "default": {
        "0": {
          "market": 54.6,
          "analyst": 40.64,
          "opskins": 36.14
        },
        "1": {
          "market": 55.69,
          "analyst": 41.93,
          "opskins": 36.46
        },
        "2": {
          "market": 56.7,
          "analyst": 41.49,
          "opskins": 35.71
        },
        "3": {
          "market": 60.22,
          "analyst": 46.58,
          "opskins": 41.07
        },
        "4": {
          "market": 73.2,
          "analyst": 73.77,
          "opskins": 65
        }
      },
      "stattrak": {
        "0": {
          "market": 53.93,
          "analyst": 55.54,
          "opskins": 55.47
        },
        "1": {
          "market": 70.2,
          "analyst": 93.12,
          "opskins": 71.87
        },
        "2": {
          "market": 71.31,
          "analyst": 70.6,
          "opskins": 55.86
        },
        "3": {
          "market": 75.75,
          "analyst": 68.07,
          "opskins": 85
        },
        "4": {
          "market": -1,
          "analyst": 100,
          "opskins": 480
        }
      },
      "souvenir": {}
    }
  },
  "642": {
    "item_id": 642,
    "type": "★ Flip Knife",
    "skinName": "Scorched",
    "prices": {
      "default": {
        "0": {
          "market": 46.31,
          "analyst": 34.46,
          "opskins": 31.59
        },
        "1": {
          "market": 47.86,
          "analyst": 41.78,
          "opskins": 38
        },
        "2": {
          "market": 47.77,
          "analyst": 35.13,
          "opskins": 30.79
        },
        "3": {
          "market": 54.4,
          "analyst": 40.81,
          "opskins": 35.98
        },
        "4": {
          "market": 145,
          "analyst": 134.44,
          "opskins": 129.88
        }
      },
      "stattrak": {
        "0": {
          "market": 45.44,
          "analyst": 49.34,
          "opskins": 47
        },
        "1": {
          "market": 47.1,
          "analyst": 62.93,
          "opskins": 49
        },
        "2": {
          "market": 58.2,
          "analyst": 48.82,
          "opskins": 40.09
        },
        "3": {
          "market": 80.88,
          "analyst": 70.33,
          "opskins": 74.85
        },
        "4": {
          "market": 400,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "643": {
    "item_id": 643,
    "type": "★ Flip Knife",
    "skinName": "Safari Mesh",
    "prices": {
      "default": {
        "0": {
          "market": 45.65,
          "analyst": 32.91,
          "opskins": 31.66
        },
        "1": {
          "market": 45.13,
          "analyst": 36,
          "opskins": 30.38
        },
        "2": {
          "market": 46.68,
          "analyst": 34.3,
          "opskins": 31.74
        },
        "3": {
          "market": 50.38,
          "analyst": 38.4,
          "opskins": 33.15
        },
        "4": {
          "market": 71.1,
          "analyst": 76.63,
          "opskins": 199
        }
      },
      "stattrak": {
        "0": {
          "market": 41,
          "analyst": 45.3,
          "opskins": 45
        },
        "1": {
          "market": 46,
          "analyst": 54.35,
          "opskins": 46
        },
        "2": {
          "market": 55.44,
          "analyst": 47.38,
          "opskins": 46.95
        },
        "3": {
          "market": 60.76,
          "analyst": 66.85,
          "opskins": 55.66
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "644": {
    "item_id": 644,
    "type": "★ Flip Knife",
    "skinName": "Night",
    "prices": {
      "default": {
        "0": {
          "market": 53.06,
          "analyst": 38.39,
          "opskins": 33.97
        },
        "1": {
          "market": 58.37,
          "analyst": 46.07,
          "opskins": 40.94
        },
        "2": {
          "market": 62.3,
          "analyst": 45.47,
          "opskins": 38.97
        },
        "3": {
          "market": 94.97,
          "analyst": 71.5,
          "opskins": 63.18
        },
        "4": {
          "market": 298.29,
          "analyst": 282,
          "opskins": 320
        }
      },
      "stattrak": {
        "0": {
          "market": 73.11,
          "analyst": 72.74,
          "opskins": 63.99
        },
        "1": {
          "market": 74.37,
          "analyst": 87.43,
          "opskins": 74.95
        },
        "2": {
          "market": 80.4,
          "analyst": 68.65,
          "opskins": 59.85
        },
        "3": {
          "market": 108.85,
          "analyst": 128.31,
          "opskins": 98.5
        },
        "4": {
          "market": -1,
          "analyst": 1722,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "645": {
    "item_id": 645,
    "type": "★ Flip Knife",
    "skinName": "Boreal Forest",
    "prices": {
      "default": {
        "0": {
          "market": 47.38,
          "analyst": 34.53,
          "opskins": 31.37
        },
        "1": {
          "market": 50.92,
          "analyst": 36.92,
          "opskins": 33.2
        },
        "2": {
          "market": 50.28,
          "analyst": 36.49,
          "opskins": 31.5
        },
        "3": {
          "market": 57.92,
          "analyst": 41.16,
          "opskins": 38.96
        },
        "4": {
          "market": 89.55,
          "analyst": 78.22,
          "opskins": 76.85
        }
      },
      "stattrak": {
        "0": {
          "market": 47.1,
          "analyst": 50.06,
          "opskins": 84.99
        },
        "1": {
          "market": 52.1,
          "analyst": 54.28,
          "opskins": 48
        },
        "2": {
          "market": 57.37,
          "analyst": 55.91,
          "opskins": 49.87
        },
        "3": {
          "market": 72,
          "analyst": 61.93,
          "opskins": 61.81
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "646": {
    "item_id": 646,
    "type": "★ Flip Knife",
    "skinName": "Blue Steel",
    "prices": {
      "default": {
        "0": {
          "market": 61.18,
          "analyst": 48.04,
          "opskins": 42.99
        },
        "1": {
          "market": 61.61,
          "analyst": 47.52,
          "opskins": 38.99
        },
        "2": {
          "market": 65.33,
          "analyst": 48.04,
          "opskins": 41.98
        },
        "3": {
          "market": 69.76,
          "analyst": 51.77,
          "opskins": 45.34
        },
        "4": {
          "market": 85.2,
          "analyst": 87.93,
          "opskins": 74.95
        }
      },
      "stattrak": {
        "0": {
          "market": 64.8,
          "analyst": 76.05,
          "opskins": 63.96
        },
        "1": {
          "market": 75.59,
          "analyst": 71.95,
          "opskins": 59.95
        },
        "2": {
          "market": 79.44,
          "analyst": 85.84,
          "opskins": 72.46
        },
        "3": {
          "market": 90.66,
          "analyst": 85.9,
          "opskins": 72.19
        },
        "4": {
          "market": 143.27,
          "analyst": -1,
          "opskins": 146
        }
      },
      "souvenir": {}
    }
  },
  "647": {
    "item_id": 647,
    "type": "★ Huntsman Knife",
    "skinName": "Safari Mesh",
    "prices": {
      "default": {
        "0": {
          "market": 47.86,
          "analyst": 35.3,
          "opskins": 31.79
        },
        "1": {
          "market": 48.82,
          "analyst": 36.04,
          "opskins": 30.38
        },
        "2": {
          "market": 49.68,
          "analyst": 36.03,
          "opskins": 31.89
        },
        "3": {
          "market": 57.04,
          "analyst": 42.95,
          "opskins": 38.19
        },
        "4": {
          "market": 102.88,
          "analyst": 117.37,
          "opskins": 117.37
        }
      },
      "stattrak": {
        "0": {
          "market": 41,
          "analyst": 60.27,
          "opskins": 55
        },
        "1": {
          "market": 45.45,
          "analyst": 54.58,
          "opskins": 48.08
        },
        "2": {
          "market": 58.76,
          "analyst": 57.28,
          "opskins": 50.6
        },
        "3": {
          "market": 63.3,
          "analyst": 77.95,
          "opskins": 70
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "648": {
    "item_id": 648,
    "type": "★ Huntsman Knife",
    "skinName": "Crimson Web",
    "prices": {
      "default": {
        "0": {
          "market": 72.17,
          "analyst": 58.08,
          "opskins": 53.27
        },
        "1": {
          "market": 78.88,
          "analyst": 69.86,
          "opskins": 59.98
        },
        "2": {
          "market": 84.5,
          "analyst": 68.33,
          "opskins": 59.82
        },
        "3": {
          "market": 153.67,
          "analyst": 147.51,
          "opskins": 120
        },
        "4": {
          "market": 651,
          "analyst": 495,
          "opskins": 549.99
        }
      },
      "stattrak": {
        "0": {
          "market": 95.15,
          "analyst": 76.61,
          "opskins": 86
        },
        "1": {
          "market": 112.95,
          "analyst": 112.54,
          "opskins": 98.98
        },
        "2": {
          "market": 117.75,
          "analyst": 96.44,
          "opskins": 94.7
        },
        "3": {
          "market": 355.9,
          "analyst": 364.29,
          "opskins": 292
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "649": {
    "item_id": 649,
    "type": "★ Huntsman Knife",
    "skinName": "Boreal Forest",
    "prices": {
      "default": {
        "0": {
          "market": 51.2,
          "analyst": 36.17,
          "opskins": 32.28
        },
        "1": {
          "market": 53.79,
          "analyst": 39.14,
          "opskins": 36.57
        },
        "2": {
          "market": 53.2,
          "analyst": 38.58,
          "opskins": 33.21
        },
        "3": {
          "market": 68.19,
          "analyst": 49.78,
          "opskins": 44.61
        },
        "4": {
          "market": 145.53,
          "analyst": 145.82,
          "opskins": 136.03
        }
      },
      "stattrak": {
        "0": {
          "market": 60.12,
          "analyst": 62.78,
          "opskins": 51
        },
        "1": {
          "market": 70.53,
          "analyst": 63.41,
          "opskins": 58.22
        },
        "2": {
          "market": 69.03,
          "analyst": 51.37,
          "opskins": 49.84
        },
        "3": {
          "market": 102.6,
          "analyst": 97.05,
          "opskins": 94
        },
        "4": {
          "market": 743.75,
          "analyst": 700,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "650": {
    "item_id": 650,
    "type": "★ Shadow Daggers",
    "skinName": "Blue Steel",
    "prices": {
      "default": {
        "0": {
          "market": 50.26,
          "analyst": 36.64,
          "opskins": 35.69
        },
        "1": {
          "market": 51.31,
          "analyst": 37.52,
          "opskins": 34.33
        },
        "2": {
          "market": 52.69,
          "analyst": 38.69,
          "opskins": 34.48
        },
        "3": {
          "market": 55.63,
          "analyst": 42.43,
          "opskins": 36.98
        },
        "4": {
          "market": 75.62,
          "analyst": 79.63,
          "opskins": 68.99
        }
      },
      "stattrak": {
        "0": {
          "market": 58.8,
          "analyst": 59.34,
          "opskins": 62.95
        },
        "1": {
          "market": 64.77,
          "analyst": 64.07,
          "opskins": 55.99
        },
        "2": {
          "market": 67.6,
          "analyst": 56.45,
          "opskins": 54.9
        },
        "3": {
          "market": 95.85,
          "analyst": 82.13,
          "opskins": 78.88
        },
        "4": {
          "market": 407.39,
          "analyst": 269,
          "opskins": 379.99
        }
      },
      "souvenir": {}
    }
  },
  "651": {
    "item_id": 651,
    "type": "★ Shadow Daggers",
    "skinName": "Case Hardened",
    "prices": {
      "default": {
        "0": {
          "market": 51.47,
          "analyst": 43.82,
          "opskins": 38.96
        },
        "1": {
          "market": 54.3,
          "analyst": 45.04,
          "opskins": 37.24
        },
        "2": {
          "market": 55.23,
          "analyst": 47.76,
          "opskins": 40.89
        },
        "3": {
          "market": 60.47,
          "analyst": 53.85,
          "opskins": 49.45
        },
        "4": {
          "market": 71.29,
          "analyst": 97.95,
          "opskins": 89.85
        }
      },
      "stattrak": {
        "0": {
          "market": 67.34,
          "analyst": 81.17,
          "opskins": 111.33
        },
        "1": {
          "market": 68.15,
          "analyst": 85.47,
          "opskins": 80
        },
        "2": {
          "market": 77.09,
          "analyst": 82.5,
          "opskins": 101.99
        },
        "3": {
          "market": 78.3,
          "analyst": 117.31,
          "opskins": 88
        },
        "4": {
          "market": 264.95,
          "analyst": -1,
          "opskins": 250
        }
      },
      "souvenir": {}
    }
  },
  "652": {
    "item_id": 652,
    "type": "★ Shadow Daggers",
    "skinName": "Fade",
    "prices": {
      "default": {
        "3": {
          "market": 117.42,
          "analyst": 108.6,
          "opskins": 90.02
        },
        "4": {
          "market": 111.78,
          "analyst": 89.06,
          "opskins": 78.33
        }
      },
      "stattrak": {
        "3": {
          "market": 240.55,
          "analyst": -1,
          "opskins": 279.99
        },
        "4": {
          "market": 182.78,
          "analyst": 163.04,
          "opskins": 136.5
        }
      },
      "souvenir": {}
    }
  },
  "653": {
    "item_id": 653,
    "type": "★ Shadow Daggers",
    "skinName": "Safari Mesh",
    "prices": {
      "default": {
        "0": {
          "market": 40.1,
          "analyst": 28.99,
          "opskins": 27.75
        },
        "1": {
          "market": 40.38,
          "analyst": 30.14,
          "opskins": 27.98
        },
        "2": {
          "market": 40.78,
          "analyst": 29.93,
          "opskins": 27.24
        },
        "3": {
          "market": 42.37,
          "analyst": 32.36,
          "opskins": 28.5
        },
        "4": {
          "market": 75.61,
          "analyst": -1,
          "opskins": 100
        }
      },
      "stattrak": {
        "0": {
          "market": 44.66,
          "analyst": 50.2,
          "opskins": 45
        },
        "1": {
          "market": 43.85,
          "analyst": 59.34,
          "opskins": 50.99
        },
        "2": {
          "market": 49.92,
          "analyst": 40,
          "opskins": 38.39
        },
        "3": {
          "market": 61.5,
          "analyst": 58.99,
          "opskins": 61.79
        },
        "4": {
          "market": 345,
          "analyst": 183,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "654": {
    "item_id": 654,
    "type": "★ Shadow Daggers",
    "skinName": "Slaughter",
    "prices": {
      "default": {
        "2": {
          "market": 76.87,
          "analyst": 61.79,
          "opskins": 54.48
        },
        "3": {
          "market": 80.22,
          "analyst": 65.94,
          "opskins": 57.48
        },
        "4": {
          "market": 89.26,
          "analyst": 75.25,
          "opskins": 63.79
        }
      },
      "stattrak": {
        "2": {
          "market": 125.25,
          "analyst": 152.81,
          "opskins": 99
        },
        "3": {
          "market": 108.64,
          "analyst": 114,
          "opskins": 101.54
        },
        "4": {
          "market": 138.4,
          "analyst": 133.47,
          "opskins": 107.88
        }
      },
      "souvenir": {}
    }
  },
  "655": {
    "item_id": 655,
    "type": "★ Shadow Daggers",
    "skinName": "Stained",
    "prices": {
      "default": {
        "0": {
          "market": 45.07,
          "analyst": 33.59,
          "opskins": 30.48
        },
        "1": {
          "market": 45.65,
          "analyst": 33.98,
          "opskins": 31.59
        },
        "2": {
          "market": 47.84,
          "analyst": 35.3,
          "opskins": 30.75
        },
        "3": {
          "market": 51.65,
          "analyst": 37.27,
          "opskins": 31.36
        },
        "4": {
          "market": 69.17,
          "analyst": 76.77,
          "opskins": 75.9
        }
      },
      "stattrak": {
        "0": {
          "market": 50.14,
          "analyst": 50.91,
          "opskins": 59.19
        },
        "1": {
          "market": 58.57,
          "analyst": 51.81,
          "opskins": 53
        },
        "2": {
          "market": 60.06,
          "analyst": 58.34,
          "opskins": 63.82
        },
        "3": {
          "market": 59.98,
          "analyst": 71.83,
          "opskins": 59.98
        },
        "4": {
          "market": 402.93,
          "analyst": -1,
          "opskins": 285
        }
      },
      "souvenir": {}
    }
  },
  "656": {
    "item_id": 656,
    "type": "M4A1-S",
    "skinName": "Hyper Beast",
    "prices": {
      "default": {
        "0": {
          "market": 7.76,
          "analyst": 6.06,
          "opskins": 5.31
        },
        "1": {
          "market": 9.05,
          "analyst": 6.95,
          "opskins": 5.92
        },
        "2": {
          "market": 10.99,
          "analyst": 8.65,
          "opskins": 7.34
        },
        "3": {
          "market": 16.66,
          "analyst": 13.14,
          "opskins": 11.19
        },
        "4": {
          "market": 38.16,
          "analyst": 31.82,
          "opskins": 27.71
        }
      },
      "stattrak": {
        "0": {
          "market": 19.33,
          "analyst": 14.97,
          "opskins": 13.46
        },
        "1": {
          "market": 23.17,
          "analyst": 17.7,
          "opskins": 15.93
        },
        "2": {
          "market": 29.77,
          "analyst": 22.84,
          "opskins": 20.44
        },
        "3": {
          "market": 52.24,
          "analyst": 42.01,
          "opskins": 35.99
        },
        "4": {
          "market": 162.42,
          "analyst": 158.88,
          "opskins": 140
        }
      },
      "souvenir": {}
    }
  },
  "657": {
    "item_id": 657,
    "type": "AK-47",
    "skinName": "Aquamarine Revenge",
    "prices": {
      "default": {
        "0": {
          "market": 10.35,
          "analyst": 7.72,
          "opskins": 6.63
        },
        "1": {
          "market": 13.22,
          "analyst": 9.83,
          "opskins": 8.28
        },
        "2": {
          "market": 15.85,
          "analyst": 11.75,
          "opskins": 10.35
        },
        "3": {
          "market": 21.59,
          "analyst": 16.31,
          "opskins": 14
        },
        "4": {
          "market": 31.68,
          "analyst": 24.3,
          "opskins": 21.19
        }
      },
      "stattrak": {
        "0": {
          "market": 26.9,
          "analyst": 19.75,
          "opskins": 17.57
        },
        "1": {
          "market": 36.4,
          "analyst": 28.17,
          "opskins": 25.94
        },
        "2": {
          "market": 51.57,
          "analyst": 40.39,
          "opskins": 33.84
        },
        "3": {
          "market": 72.58,
          "analyst": 61.08,
          "opskins": 50.57
        },
        "4": {
          "market": 122.8,
          "analyst": 124.36,
          "opskins": 103.79
        }
      },
      "souvenir": {}
    }
  },
  "658": {
    "item_id": 658,
    "type": "M4A4",
    "skinName": "Asiimov",
    "prices": {
      "default": {
        "0": {
          "market": 14.95,
          "analyst": 11.16,
          "opskins": 10.07
        },
        "1": {
          "market": 27.83,
          "analyst": 21.46,
          "opskins": 19.95
        },
        "2": {
          "market": 38.27,
          "analyst": 29.26,
          "opskins": 26
        }
      },
      "stattrak": {
        "0": {
          "market": 52.63,
          "analyst": 42.51,
          "opskins": 38.85
        },
        "1": {
          "market": 112.16,
          "analyst": 97.25,
          "opskins": 88
        },
        "2": {
          "market": 170.52,
          "analyst": 158.43,
          "opskins": 129.88
        }
      },
      "souvenir": {}
    }
  },
  "659": {
    "item_id": 659,
    "type": "M4A1-S",
    "skinName": "Cyrex",
    "prices": {
      "default": {
        "0": {
          "market": 7,
          "analyst": 5.7,
          "opskins": 5.55
        },
        "1": {
          "market": 8.46,
          "analyst": 6.62,
          "opskins": 5.65
        },
        "2": {
          "market": 7.77,
          "analyst": 6.24,
          "opskins": 5.31
        },
        "3": {
          "market": 10.67,
          "analyst": 8.23,
          "opskins": 7.11
        },
        "4": {
          "market": 13.83,
          "analyst": 10.6,
          "opskins": 9.8
        }
      },
      "stattrak": {
        "0": {
          "market": 20.95,
          "analyst": 16.58,
          "opskins": 18.27
        },
        "1": {
          "market": 23.31,
          "analyst": 19.31,
          "opskins": 18.95
        },
        "2": {
          "market": 24.63,
          "analyst": 18.65,
          "opskins": 16.61
        },
        "3": {
          "market": 39.29,
          "analyst": 31.36,
          "opskins": 27.48
        },
        "4": {
          "market": 62.25,
          "analyst": 50.26,
          "opskins": 42.99
        }
      },
      "souvenir": {}
    }
  },
  "660": {
    "item_id": 660,
    "type": "AK-47",
    "skinName": "Fire Serpent",
    "prices": {
      "default": {
        "0": {
          "market": 108.26,
          "analyst": 86.02,
          "opskins": 76.49
        },
        "1": {
          "market": 163.58,
          "analyst": 144.29,
          "opskins": 118
        },
        "2": {
          "market": 182.21,
          "analyst": 148.39,
          "opskins": 122.99
        },
        "3": {
          "market": 266.15,
          "analyst": 234.62,
          "opskins": 192.56
        },
        "4": {
          "market": 700,
          "analyst": 573,
          "opskins": 586.25
        }
      },
      "stattrak": {
        "0": {
          "market": 349.27,
          "analyst": 388.94,
          "opskins": 315.55
        },
        "1": {
          "market": 450,
          "analyst": 361,
          "opskins": 399
        },
        "2": {
          "market": 701,
          "analyst": 560,
          "opskins": 548
        },
        "3": {
          "market": 972.34,
          "analyst": 855,
          "opskins": 869.99
        },
        "4": {
          "market": 3700.99,
          "analyst": 2495,
          "opskins": 2699.99
        }
      },
      "souvenir": {}
    }
  },
  "661": {
    "item_id": 661,
    "type": "P90",
    "skinName": "Asiimov",
    "prices": {
      "default": {
        "0": {
          "market": 2.64,
          "analyst": 2.26,
          "opskins": 2
        },
        "1": {
          "market": 4.43,
          "analyst": 3.45,
          "opskins": 3.02
        },
        "2": {
          "market": 4.71,
          "analyst": 3.84,
          "opskins": 3.2
        },
        "3": {
          "market": 7.87,
          "analyst": 6.34,
          "opskins": 5.52
        },
        "4": {
          "market": 15.97,
          "analyst": 12.7,
          "opskins": 11.04
        }
      },
      "stattrak": {
        "0": {
          "market": 7.31,
          "analyst": 6.16,
          "opskins": 5.78
        },
        "1": {
          "market": 11.22,
          "analyst": 9.84,
          "opskins": 8.75
        },
        "2": {
          "market": 14.08,
          "analyst": 11.88,
          "opskins": 10.63
        },
        "3": {
          "market": 29.64,
          "analyst": 25.17,
          "opskins": 21.93
        },
        "4": {
          "market": 89.66,
          "analyst": 85.43,
          "opskins": 75.98
        }
      },
      "souvenir": {}
    }
  },
  "662": {
    "item_id": 662,
    "type": "M4A4",
    "skinName": "X-Ray",
    "prices": {
      "default": {
        "2": {
          "market": 4.52,
          "analyst": 3.73,
          "opskins": 3.85
        },
        "3": {
          "market": 5.23,
          "analyst": 4.32,
          "opskins": 3.8
        },
        "4": {
          "market": 6.71,
          "analyst": 5.56,
          "opskins": 4.75
        }
      },
      "stattrak": {
        "2": {
          "market": 18.19,
          "analyst": 13.83,
          "opskins": 12.67
        },
        "3": {
          "market": 23.36,
          "analyst": 20.45,
          "opskins": 18
        },
        "4": {
          "market": 39,
          "analyst": 33.28,
          "opskins": 32.49
        }
      },
      "souvenir": {}
    }
  },
  "663": {
    "item_id": 663,
    "type": "P90",
    "skinName": "Death by Kitty",
    "prices": {
      "default": {
        "2": {
          "market": 19.41,
          "analyst": 15.46,
          "opskins": 14.48
        },
        "3": {
          "market": 30.73,
          "analyst": 25.64,
          "opskins": 24.65
        }
      },
      "stattrak": {
        "2": {
          "market": 66.36,
          "analyst": 57.08,
          "opskins": 64.75
        },
        "3": {
          "market": 134.18,
          "analyst": 149.28,
          "opskins": 122
        }
      },
      "souvenir": {}
    }
  },
  "664": {
    "item_id": 664,
    "type": "AK-47",
    "skinName": "Vulcan",
    "prices": {
      "default": {
        "0": {
          "market": 11.36,
          "analyst": 8.76,
          "opskins": 7.94
        },
        "1": {
          "market": 19.46,
          "analyst": 14.32,
          "opskins": 12.39
        },
        "2": {
          "market": 22.74,
          "analyst": 17.34,
          "opskins": 14.9
        },
        "3": {
          "market": 37.48,
          "analyst": 27.83,
          "opskins": 23.95
        },
        "4": {
          "market": 58.63,
          "analyst": 45.64,
          "opskins": 40.63
        }
      },
      "stattrak": {
        "0": {
          "market": 29.84,
          "analyst": 22.72,
          "opskins": 21.87
        },
        "1": {
          "market": 56.68,
          "analyst": 44.94,
          "opskins": 41.16
        },
        "2": {
          "market": 79.82,
          "analyst": 63.25,
          "opskins": 54
        },
        "3": {
          "market": 135.92,
          "analyst": 128.44,
          "opskins": 109.75
        },
        "4": {
          "market": 339.6,
          "analyst": 342.83,
          "opskins": 274.49
        }
      },
      "souvenir": {}
    }
  },
  "665": {
    "item_id": 665,
    "type": "SSG 08",
    "skinName": "Blood in the Water",
    "prices": {
      "default": {
        "2": {
          "market": 20.71,
          "analyst": 18.6,
          "opskins": 16.89
        },
        "3": {
          "market": 21.29,
          "analyst": 19.24,
          "opskins": 16.69
        },
        "4": {
          "market": 28.85,
          "analyst": 28.41,
          "opskins": 24.65
        }
      },
      "stattrak": {
        "2": {
          "market": 71.63,
          "analyst": 79.96,
          "opskins": 68.54
        },
        "3": {
          "market": 79.15,
          "analyst": 81.04,
          "opskins": 72
        },
        "4": {
          "market": 179.1,
          "analyst": 240.66,
          "opskins": 225
        }
      },
      "souvenir": {}
    }
  },
  "666": {
    "item_id": 666,
    "type": "CZ75-Auto",
    "skinName": "Victoria",
    "prices": {
      "default": {
        "0": {
          "market": 2.37,
          "analyst": 1.93,
          "opskins": 1.86
        },
        "1": {
          "market": 2.97,
          "analyst": 2.89,
          "opskins": 2.71
        },
        "2": {
          "market": 2.58,
          "analyst": 2.07,
          "opskins": 1.89
        },
        "3": {
          "market": 3.75,
          "analyst": 3.19,
          "opskins": 3.13
        },
        "4": {
          "market": 7.37,
          "analyst": 6.06,
          "opskins": 6.5
        }
      },
      "stattrak": {
        "0": {
          "market": 15.05,
          "analyst": 15.43,
          "opskins": 14.98
        },
        "1": {
          "market": 14.8,
          "analyst": 41.2,
          "opskins": 34.39
        },
        "2": {
          "market": 17.59,
          "analyst": 17.76,
          "opskins": 15.99
        },
        "3": {
          "market": 35.57,
          "analyst": 34.33,
          "opskins": 36.5
        },
        "4": {
          "market": 91.8,
          "analyst": 93.37,
          "opskins": 87.4
        }
      },
      "souvenir": {}
    }
  },
  "667": {
    "item_id": 667,
    "type": "AUG",
    "skinName": "Akihabara Accept",
    "prices": {
      "default": {
        "0": {
          "market": 26.73,
          "analyst": 22.77,
          "opskins": 65
        },
        "1": {
          "market": 39.79,
          "analyst": 31.29,
          "opskins": 29.99
        },
        "2": {
          "market": 61.66,
          "analyst": 49.24,
          "opskins": 45.99
        },
        "3": {
          "market": 170.87,
          "analyst": 166.2,
          "opskins": 134.75
        },
        "4": {
          "market": 520,
          "analyst": 533,
          "opskins": 500
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "668": {
    "item_id": 668,
    "type": "P2000",
    "skinName": "Fire Elemental",
    "prices": {
      "default": {
        "0": {
          "market": 4.89,
          "analyst": 3.81,
          "opskins": 3.52
        },
        "1": {
          "market": 5.58,
          "analyst": 4.69,
          "opskins": 4.49
        },
        "2": {
          "market": 5.13,
          "analyst": 4.06,
          "opskins": 3.49
        },
        "3": {
          "market": 6.49,
          "analyst": 5.25,
          "opskins": 4.5
        },
        "4": {
          "market": 10.26,
          "analyst": 8.18,
          "opskins": 6.96
        }
      },
      "stattrak": {
        "0": {
          "market": 24.8,
          "analyst": 23.52,
          "opskins": 21.93
        },
        "1": {
          "market": 25.04,
          "analyst": 27.34,
          "opskins": 24.74
        },
        "2": {
          "market": 28.88,
          "analyst": 22.03,
          "opskins": 20.21
        },
        "3": {
          "market": 38.56,
          "analyst": 31.58,
          "opskins": 27.78
        },
        "4": {
          "market": 75.89,
          "analyst": 79.47,
          "opskins": 65.56
        }
      },
      "souvenir": {}
    }
  },
  "669": {
    "item_id": 669,
    "type": "MAC-10",
    "skinName": "Neon Rider",
    "prices": {
      "default": {
        "1": {
          "market": 2.1,
          "analyst": 1.74,
          "opskins": 1.7
        },
        "2": {
          "market": 1.9,
          "analyst": 1.65,
          "opskins": 1.41
        },
        "3": {
          "market": 3.27,
          "analyst": 2.6,
          "opskins": 2.1
        },
        "4": {
          "market": 5.37,
          "analyst": 4.41,
          "opskins": 3.75
        }
      },
      "stattrak": {
        "1": {
          "market": 5.86,
          "analyst": 5.06,
          "opskins": 5.14
        },
        "2": {
          "market": 5.02,
          "analyst": 4.27,
          "opskins": 3.69
        },
        "3": {
          "market": 11.21,
          "analyst": 9.24,
          "opskins": 8.37
        },
        "4": {
          "market": 20.39,
          "analyst": 16.93,
          "opskins": 14.23
        }
      },
      "souvenir": {}
    }
  },
  "670": {
    "item_id": 670,
    "type": "AK-47",
    "skinName": "Wasteland Rebel",
    "prices": {
      "default": {
        "0": {
          "market": 16.04,
          "analyst": 12.5,
          "opskins": 10.96
        },
        "1": {
          "market": 20.83,
          "analyst": 16.37,
          "opskins": 13.95
        },
        "2": {
          "market": 18.15,
          "analyst": 13.77,
          "opskins": 11.83
        },
        "3": {
          "market": 25.59,
          "analyst": 20.18,
          "opskins": 17.76
        },
        "4": {
          "market": 81.64,
          "analyst": 68.69,
          "opskins": 60
        }
      },
      "stattrak": {
        "0": {
          "market": 51.36,
          "analyst": 42.15,
          "opskins": 40.99
        },
        "1": {
          "market": 62.03,
          "analyst": 64.34,
          "opskins": 56.95
        },
        "2": {
          "market": 68.48,
          "analyst": 50.08,
          "opskins": 45.98
        },
        "3": {
          "market": 111.33,
          "analyst": 95.79,
          "opskins": 82.85
        },
        "4": {
          "market": 480.99,
          "analyst": 422,
          "opskins": 428.99
        }
      },
      "souvenir": {}
    }
  },
  "671": {
    "item_id": 671,
    "type": "M4A4",
    "skinName": "Howl",
    "prices": {
      "default": {
        "1": {
          "market": 444.44,
          "analyst": 378,
          "opskins": -1
        },
        "2": {
          "market": 505,
          "analyst": 427,
          "opskins": 415
        },
        "3": {
          "market": 590,
          "analyst": 472,
          "opskins": 478.95
        },
        "4": {
          "market": 750,
          "analyst": 667,
          "opskins": 660
        }
      },
      "stattrak": {
        "1": {
          "market": -1,
          "analyst": 796,
          "opskins": 793
        },
        "2": {
          "market": 825.02,
          "analyst": 752,
          "opskins": 801.99
        },
        "3": {
          "market": 1115.29,
          "analyst": 1107,
          "opskins": 1169.69
        },
        "4": {
          "market": 1668.52,
          "analyst": 1815,
          "opskins": 1600
        }
      },
      "souvenir": {}
    }
  },
  "672": {
    "item_id": 672,
    "type": "AWP",
    "skinName": "Hyper Beast",
    "prices": {
      "default": {
        "0": {
          "market": 12.85,
          "analyst": 9.12,
          "opskins": 8.27
        },
        "1": {
          "market": 19.21,
          "analyst": 13.91,
          "opskins": 11.96
        },
        "2": {
          "market": 22.86,
          "analyst": 16.85,
          "opskins": 14.69
        },
        "3": {
          "market": 34.82,
          "analyst": 25.5,
          "opskins": 22.14
        },
        "4": {
          "market": 50.52,
          "analyst": 39.74,
          "opskins": 34.33
        }
      },
      "stattrak": {
        "0": {
          "market": 33.36,
          "analyst": 25.7,
          "opskins": 22.15
        },
        "1": {
          "market": 47.49,
          "analyst": 33.95,
          "opskins": 29.84
        },
        "2": {
          "market": 62.3,
          "analyst": 48.89,
          "opskins": 40.18
        },
        "3": {
          "market": 109.5,
          "analyst": 83.59,
          "opskins": 69.5
        },
        "4": {
          "market": 189.63,
          "analyst": 173.17,
          "opskins": 146.75
        }
      },
      "souvenir": {}
    }
  },
  "673": {
    "item_id": 673,
    "type": "AWP",
    "skinName": "Lightning Strike",
    "prices": {
      "default": {
        "3": {
          "market": 57.35,
          "analyst": 43.72,
          "opskins": 40.88
        },
        "4": {
          "market": 56.9,
          "analyst": 43.17,
          "opskins": 37.45
        }
      },
      "stattrak": {
        "3": {
          "market": 157.49,
          "analyst": 183.67,
          "opskins": 149.98
        },
        "4": {
          "market": 214.38,
          "analyst": 174.33,
          "opskins": 141
        }
      },
      "souvenir": {}
    }
  },
  "674": {
    "item_id": 674,
    "type": "AWP",
    "skinName": "Asiimov",
    "prices": {
      "default": {
        "0": {
          "market": 22.2,
          "analyst": 16.78,
          "opskins": 15.24
        },
        "1": {
          "market": 27.23,
          "analyst": 20.54,
          "opskins": 17.88
        },
        "2": {
          "market": 31.99,
          "analyst": 25.18,
          "opskins": 21.94
        }
      },
      "stattrak": {
        "0": {
          "market": 57.65,
          "analyst": 42.28,
          "opskins": 35.96
        },
        "1": {
          "market": 76.19,
          "analyst": 58.96,
          "opskins": 50.83
        },
        "2": {
          "market": 94.98,
          "analyst": 74.61,
          "opskins": 63
        }
      },
      "souvenir": {}
    }
  },
  "675": {
    "item_id": 675,
    "type": "AWP",
    "skinName": "Man-o'-war",
    "prices": {
      "default": {
        "2": {
          "market": 10.05,
          "analyst": 7.34,
          "opskins": 6.28
        },
        "3": {
          "market": 10.48,
          "analyst": 7.56,
          "opskins": 6.47
        }
      },
      "stattrak": {
        "2": {
          "market": 29.3,
          "analyst": 22.5,
          "opskins": 20.82
        },
        "3": {
          "market": 32.8,
          "analyst": 24.8,
          "opskins": 22
        }
      },
      "souvenir": {}
    }
  },
  "676": {
    "item_id": 676,
    "type": "AK-47",
    "skinName": "Cartel",
    "prices": {
      "default": {
        "0": {
          "market": 2.61,
          "analyst": 2.03,
          "opskins": 1.92
        },
        "1": {
          "market": 4.1,
          "analyst": 2.91,
          "opskins": 3.16
        },
        "2": {
          "market": 2.52,
          "analyst": 1.86,
          "opskins": 1.74
        },
        "3": {
          "market": 3.07,
          "analyst": 2.23,
          "opskins": 2.02
        },
        "4": {
          "market": 5.88,
          "analyst": 4.44,
          "opskins": 4.19
        }
      },
      "stattrak": {
        "0": {
          "market": 11.37,
          "analyst": 9.01,
          "opskins": 7.46
        },
        "1": {
          "market": 13.1,
          "analyst": 10.59,
          "opskins": 9.75
        },
        "2": {
          "market": 11.18,
          "analyst": 8.52,
          "opskins": 7.25
        },
        "3": {
          "market": 14.19,
          "analyst": 11.21,
          "opskins": 9.48
        },
        "4": {
          "market": 23.39,
          "analyst": 19.63,
          "opskins": 17.05
        }
      },
      "souvenir": {}
    }
  },
  "677": {
    "prices": {
      "default": {
        "0": {
          "market": 3.2
        },
        "1": {
          "market": 5.29
        },
        "2": {
          "market": 3.87
        },
        "3": {
          "market": 5.99
        },
        "4": {
          "market": 10.04
        }
      },
      "stattrak": {
        "0": {
          "market": 9.62
        },
        "1": {
          "market": 15.05
        },
        "2": {
          "market": 11.13
        },
        "3": {
          "market": 20.49
        },
        "4": {
          "market": 35.51
        }
      }
    }
  },
  "678": {
    "item_id": 678,
    "type": "AK-47",
    "skinName": "Red Laminate",
    "prices": {
      "default": {
        "0": {
          "market": 7.51,
          "analyst": 5.68,
          "opskins": 5.1
        },
        "1": {
          "market": 7.95,
          "analyst": 6.35,
          "opskins": 5.51
        },
        "2": {
          "market": 7.59,
          "analyst": 5.72,
          "opskins": 5.1
        },
        "3": {
          "market": 11.88,
          "analyst": 8.86,
          "opskins": 7.96
        },
        "4": {
          "market": 100,
          "analyst": 76.76,
          "opskins": 89.99
        }
      },
      "stattrak": {
        "0": {
          "market": 34.09,
          "analyst": 26.61,
          "opskins": 23.39
        },
        "1": {
          "market": 33.11,
          "analyst": 26.62,
          "opskins": 24.35
        },
        "2": {
          "market": 35.18,
          "analyst": 26.23,
          "opskins": 22.18
        },
        "3": {
          "market": 53.76,
          "analyst": 55.16,
          "opskins": 46
        },
        "4": {
          "market": -1,
          "analyst": 572,
          "opskins": 696
        }
      },
      "souvenir": {}
    }
  },
  "679": {
    "item_id": 679,
    "type": "AWP",
    "skinName": "Redline",
    "prices": {
      "default": {
        "1": {
          "market": 12.21,
          "analyst": 10.34,
          "opskins": 9.26
        },
        "2": {
          "market": 10.08,
          "analyst": 7.4,
          "opskins": 6.4
        },
        "3": {
          "market": 15.14,
          "analyst": 11.3,
          "opskins": 10.06
        }
      },
      "stattrak": {
        "1": {
          "market": 31.72,
          "analyst": 28.14,
          "opskins": 24.94
        },
        "2": {
          "market": 29.62,
          "analyst": 23.15,
          "opskins": 20.8
        },
        "3": {
          "market": 52.17,
          "analyst": 40.13,
          "opskins": 33.87
        }
      },
      "souvenir": {}
    }
  },
  "680": {
    "item_id": 680,
    "type": "M4A1-S",
    "skinName": "Atomic Alloy",
    "prices": {
      "default": {
        "0": {
          "market": 2.73,
          "analyst": 2.55,
          "opskins": 4.66
        },
        "1": {
          "market": 3.06,
          "analyst": 2.78,
          "opskins": 2.45
        },
        "2": {
          "market": 2.87,
          "analyst": 2.41,
          "opskins": 2.15
        },
        "3": {
          "market": 4.93,
          "analyst": 4.11,
          "opskins": 3.33
        },
        "4": {
          "market": 10.08,
          "analyst": 8.12,
          "opskins": 7.06
        }
      },
      "stattrak": {
        "0": {
          "market": 7.95,
          "analyst": 7.02,
          "opskins": 6.68
        },
        "1": {
          "market": 9.13,
          "analyst": 8.31,
          "opskins": 7.19
        },
        "2": {
          "market": 9.3,
          "analyst": 7.96,
          "opskins": 6.76
        },
        "3": {
          "market": 16.42,
          "analyst": 13.49,
          "opskins": 11.59
        },
        "4": {
          "market": 39.33,
          "analyst": 31.34,
          "opskins": 27
        }
      },
      "souvenir": {}
    }
  },
  "681": {
    "item_id": 681,
    "type": "AWP",
    "skinName": "Graphite",
    "prices": {
      "default": {
        "3": {
          "market": 36.29,
          "analyst": 28.79,
          "opskins": 25.95
        },
        "4": {
          "market": 37.38,
          "analyst": 28.13,
          "opskins": 25.13
        }
      },
      "stattrak": {
        "3": {
          "market": 121.11,
          "analyst": 97.07,
          "opskins": 87
        },
        "4": {
          "market": 137.78,
          "analyst": 118.96,
          "opskins": 98.75
        }
      },
      "souvenir": {}
    }
  },
  "682": {
    "item_id": 682,
    "type": "AK-47",
    "skinName": "Redline",
    "prices": {
      "default": {
        "0": {
          "market": 3.74,
          "analyst": 2.93,
          "opskins": 2.91
        },
        "1": {
          "market": 6.6,
          "analyst": 5.11,
          "opskins": 4.57
        },
        "2": {
          "market": 6.12,
          "analyst": 4.8,
          "opskins": 4.35
        },
        "3": {
          "market": 19.76,
          "analyst": 14.72,
          "opskins": 13.2
        }
      },
      "stattrak": {
        "0": {
          "market": 11.08,
          "analyst": 8.74,
          "opskins": 7.45
        },
        "1": {
          "market": 19.93,
          "analyst": 14.67,
          "opskins": 12.4
        },
        "2": {
          "market": 23,
          "analyst": 17.6,
          "opskins": 14.99
        },
        "3": {
          "market": 107.12,
          "analyst": 81.47,
          "opskins": 72
        }
      },
      "souvenir": {}
    }
  },
  "683": {
    "item_id": 683,
    "type": "AUG",
    "skinName": "Bengal Tiger",
    "prices": {
      "default": {
        "0": {
          "market": 1.68,
          "analyst": 1.28,
          "opskins": 1.54
        },
        "1": {
          "market": 1.87,
          "analyst": 1.61,
          "opskins": 1.41
        },
        "2": {
          "market": 1.55,
          "analyst": 1.21,
          "opskins": 1.15
        },
        "3": {
          "market": 2.58,
          "analyst": 2.05,
          "opskins": 1.72
        },
        "4": {
          "market": 14.19,
          "analyst": 14.59,
          "opskins": 13.86
        }
      },
      "stattrak": {
        "0": {
          "market": 4.24,
          "analyst": 4.58,
          "opskins": 4.4
        },
        "1": {
          "market": 5.28,
          "analyst": 5.21,
          "opskins": 4.75
        },
        "2": {
          "market": 4.77,
          "analyst": 3.84,
          "opskins": 3.8
        },
        "3": {
          "market": 11,
          "analyst": 10.81,
          "opskins": 9.59
        },
        "4": {
          "market": 72.7,
          "analyst": 61.05,
          "opskins": 66.06
        }
      },
      "souvenir": {}
    }
  },
  "684": {
    "item_id": 684,
    "type": "AK-47",
    "skinName": "Case Hardened",
    "prices": {
      "default": {
        "0": {
          "market": 21.34,
          "analyst": 15.58,
          "opskins": 15.45
        },
        "1": {
          "market": 22.81,
          "analyst": 17.59,
          "opskins": 15.78
        },
        "2": {
          "market": 25.16,
          "analyst": 19.17,
          "opskins": 16.58
        },
        "3": {
          "market": 32.09,
          "analyst": 23.34,
          "opskins": 20.85
        },
        "4": {
          "market": 52.5,
          "analyst": 40.61,
          "opskins": 35.76
        }
      },
      "stattrak": {
        "0": {
          "market": 69.51,
          "analyst": 51.54,
          "opskins": 47.77
        },
        "1": {
          "market": 77.12,
          "analyst": 75.48,
          "opskins": 61.2
        },
        "2": {
          "market": 90.86,
          "analyst": 62.42,
          "opskins": 55.44
        },
        "3": {
          "market": 118.92,
          "analyst": 87.65,
          "opskins": 84.55
        },
        "4": {
          "market": 263,
          "analyst": 224.92,
          "opskins": 213.99
        }
      },
      "souvenir": {}
    }
  },
  "685": {
    "item_id": 685,
    "type": "Desert Eagle",
    "skinName": "Hypnotic",
    "prices": {
      "default": {
        "3": {
          "market": 13.04,
          "analyst": 11.74,
          "opskins": 11.95
        },
        "4": {
          "market": 9.34,
          "analyst": 6.94,
          "opskins": 6.59
        }
      },
      "stattrak": {
        "3": {
          "market": 31,
          "analyst": 39.97,
          "opskins": 43.15
        },
        "4": {
          "market": 28.7,
          "analyst": 25,
          "opskins": 22.89
        }
      },
      "souvenir": {}
    }
  },
  "686": {
    "item_id": 686,
    "type": "Glock-18",
    "skinName": "Water Elemental",
    "prices": {
      "default": {
        "0": {
          "market": 2.38,
          "analyst": 1.92,
          "opskins": 1.69
        },
        "1": {
          "market": 3.55,
          "analyst": 2.73,
          "opskins": 2.48
        },
        "2": {
          "market": 2.94,
          "analyst": 2.24,
          "opskins": 1.87
        },
        "3": {
          "market": 4.02,
          "analyst": 3.13,
          "opskins": 2.6
        },
        "4": {
          "market": 6.48,
          "analyst": 5.05,
          "opskins": 4.47
        }
      },
      "stattrak": {
        "0": {
          "market": 7.21,
          "analyst": 5.98,
          "opskins": 5.53
        },
        "1": {
          "market": 10.81,
          "analyst": 9.51,
          "opskins": 8.32
        },
        "2": {
          "market": 10.17,
          "analyst": 7.93,
          "opskins": 6.7
        },
        "3": {
          "market": 16.45,
          "analyst": 13.69,
          "opskins": 11.65
        },
        "4": {
          "market": 27.56,
          "analyst": 20.72,
          "opskins": 17.7
        }
      },
      "souvenir": {}
    }
  },
  "687": {
    "item_id": 687,
    "type": "P250",
    "skinName": "Muertos",
    "prices": {
      "default": {
        "0": {
          "market": 1.86,
          "analyst": 1.39,
          "opskins": 1.35
        },
        "1": {
          "market": 1.98,
          "analyst": 1.9,
          "opskins": 1.63
        },
        "2": {
          "market": 1.81,
          "analyst": 1.34,
          "opskins": 1.27
        },
        "3": {
          "market": 2.03,
          "analyst": 1.45,
          "opskins": 1.3
        },
        "4": {
          "market": 3.21,
          "analyst": 2.6,
          "opskins": 2.24
        }
      },
      "stattrak": {
        "0": {
          "market": 6.4,
          "analyst": 5.16,
          "opskins": 4.79
        },
        "1": {
          "market": 7.2,
          "analyst": 6.5,
          "opskins": 6.09
        },
        "2": {
          "market": 6.8,
          "analyst": 5.19,
          "opskins": 4.57
        },
        "3": {
          "market": 8.72,
          "analyst": 6.84,
          "opskins": 5.96
        },
        "4": {
          "market": 14.57,
          "analyst": 12.43,
          "opskins": 10.45
        }
      },
      "souvenir": {}
    }
  },
  "688": {
    "item_id": 688,
    "type": "FAMAS",
    "skinName": "Afterimage",
    "prices": {
      "default": {
        "1": {
          "market": 2.43,
          "analyst": 3.27,
          "opskins": 3.11
        },
        "2": {
          "market": 1.79,
          "analyst": 1.45,
          "opskins": 1.6
        },
        "3": {
          "market": 2.01,
          "analyst": 1.75,
          "opskins": 1.57
        },
        "4": {
          "market": 3.15,
          "analyst": 2.79,
          "opskins": 2.59
        }
      },
      "stattrak": {
        "1": {
          "market": 10.35,
          "analyst": 14.97,
          "opskins": 19.2
        },
        "2": {
          "market": 3.94,
          "analyst": 4.24,
          "opskins": 4.03
        },
        "3": {
          "market": 6.04,
          "analyst": 5.04,
          "opskins": 4.32
        },
        "4": {
          "market": 14,
          "analyst": 11.94,
          "opskins": 10.19
        }
      },
      "souvenir": {}
    }
  },
  "689": {
    "item_id": 689,
    "type": "P90",
    "skinName": "Trigon",
    "prices": {
      "default": {
        "0": {
          "market": 2.29,
          "analyst": 1.83,
          "opskins": 1.72
        },
        "1": {
          "market": 2.36,
          "analyst": 1.87,
          "opskins": 1.88
        },
        "2": {
          "market": 2.08,
          "analyst": 1.85,
          "opskins": 1.5
        },
        "3": {
          "market": 2.98,
          "analyst": 2.5,
          "opskins": 2.09
        }
      },
      "stattrak": {
        "0": {
          "market": 4.56,
          "analyst": 3.85,
          "opskins": 3.74
        },
        "1": {
          "market": 5.42,
          "analyst": 5.61,
          "opskins": 8.97
        },
        "2": {
          "market": 5.34,
          "analyst": 4.41,
          "opskins": 3.69
        },
        "3": {
          "market": 10.17,
          "analyst": 8.52,
          "opskins": 7.33
        }
      },
      "souvenir": {}
    }
  },
  "690": {
    "item_id": 690,
    "type": "Galil AR",
    "skinName": "Eco",
    "prices": {
      "default": {
        "0": {
          "market": 1.1,
          "analyst": 0.96,
          "opskins": 0.78
        },
        "1": {
          "market": 1.12,
          "analyst": 0.96,
          "opskins": 0.8
        },
        "2": {
          "market": 1.12,
          "analyst": 0.96,
          "opskins": 0.75
        },
        "3": {
          "market": 3.84,
          "analyst": 3.03,
          "opskins": 2.53
        }
      },
      "stattrak": {
        "0": {
          "market": 2.65,
          "analyst": 2.15,
          "opskins": 2.03
        },
        "1": {
          "market": 2.69,
          "analyst": 2.31,
          "opskins": 2.02
        },
        "2": {
          "market": 2.88,
          "analyst": 2.42,
          "opskins": 2.07
        },
        "3": {
          "market": 13.47,
          "analyst": 10.37,
          "opskins": 9.16
        }
      },
      "souvenir": {}
    }
  },
  "691": {
    "item_id": 691,
    "type": "P2000",
    "skinName": "Corticera",
    "prices": {
      "default": {
        "2": {
          "market": 2.1,
          "analyst": 1.54,
          "opskins": 1.55
        },
        "3": {
          "market": 1.62,
          "analyst": 1.35,
          "opskins": 1.22
        },
        "4": {
          "market": 3.02,
          "analyst": 2.89,
          "opskins": 2.44
        }
      },
      "stattrak": {
        "2": {
          "market": 4.94,
          "analyst": 4.29,
          "opskins": 3.62
        },
        "3": {
          "market": 7.37,
          "analyst": 6.15,
          "opskins": 5.38
        },
        "4": {
          "market": 16.38,
          "analyst": 17.35,
          "opskins": 15.79
        }
      },
      "souvenir": {}
    }
  },
  "692": {
    "item_id": 692,
    "type": "AWP",
    "skinName": "Snake Camo",
    "prices": {
      "default": {
        "0": {
          "market": 5.17,
          "analyst": 3.83,
          "opskins": 3.99
        },
        "1": {
          "market": 4.62,
          "analyst": 3.48,
          "opskins": 4
        },
        "2": {
          "market": 5.35,
          "analyst": 3.62,
          "opskins": 4.84
        },
        "3": {
          "market": 7.48,
          "analyst": 5.06,
          "opskins": 5.75
        },
        "4": {
          "market": 31.45,
          "analyst": 36.19,
          "opskins": 45
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "693": {
    "item_id": 693,
    "type": "AWP",
    "skinName": "Pink DDPAT",
    "prices": {
      "default": {
        "0": {
          "market": 10.22,
          "analyst": 7.48,
          "opskins": 7.88
        },
        "1": {
          "market": 12.69,
          "analyst": 9.58,
          "opskins": 8.32
        },
        "2": {
          "market": 13,
          "analyst": 9.2,
          "opskins": 7.87
        },
        "3": {
          "market": 20.2,
          "analyst": 14.35,
          "opskins": 12.38
        },
        "4": {
          "market": 60.09,
          "analyst": 44.87,
          "opskins": 44.54
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 71.42,
          "analyst": 57.34,
          "opskins": 150
        },
        "1": {
          "market": 177,
          "analyst": 85.17,
          "opskins": 199
        },
        "2": {
          "market": 90.12,
          "analyst": 67.54,
          "opskins": 92
        },
        "3": {
          "market": 280.72,
          "analyst": 292.59,
          "opskins": 349
        },
        "4": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      }
    }
  },
  "694": {
    "item_id": 694,
    "type": "AWP",
    "skinName": "Medusa",
    "prices": {
      "default": {
        "0": {
          "market": 394.9,
          "analyst": 363,
          "opskins": 370
        },
        "1": {
          "market": 391.39,
          "analyst": 371,
          "opskins": 375
        },
        "2": {
          "market": 386.27,
          "analyst": 434,
          "opskins": 422
        },
        "3": {
          "market": 508.05,
          "analyst": 483,
          "opskins": 483.14
        },
        "4": {
          "market": 934.2,
          "analyst": 941,
          "opskins": 965.92
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "695": {
    "item_id": 695,
    "type": "AWP",
    "skinName": "Dragon Lore",
    "prices": {
      "default": {
        "0": {
          "market": 534.2,
          "analyst": 497,
          "opskins": 505
        },
        "1": {
          "market": 640.71,
          "analyst": 527,
          "opskins": 562.5
        },
        "2": {
          "market": 800.49,
          "analyst": 666,
          "opskins": 676.95
        },
        "3": {
          "market": 1002.15,
          "analyst": 915,
          "opskins": 900
        },
        "4": {
          "market": 1504.35,
          "analyst": 1173,
          "opskins": 1175.02
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": -1,
          "analyst": -1,
          "opskins": 1800
        },
        "1": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        },
        "2": {
          "market": -1,
          "analyst": 2413,
          "opskins": 2199
        },
        "3": {
          "market": -1,
          "analyst": 7425,
          "opskins": 4399
        },
        "4": {
          "market": -1,
          "analyst": 11000,
          "opskins": -1
        }
      }
    }
  },
  "696": {
    "item_id": 696,
    "type": "M4A1-S",
    "skinName": "VariCamo",
    "prices": {
      "default": {
        "0": {
          "market": 0.28,
          "analyst": 0.22,
          "opskins": 0.23
        },
        "1": {
          "market": 0.55,
          "analyst": 0.58,
          "opskins": 0.48
        },
        "2": {
          "market": 0.2,
          "analyst": 0.17,
          "opskins": 0.14
        },
        "3": {
          "market": 0.34,
          "analyst": 0.31,
          "opskins": 0.24
        },
        "4": {
          "market": 0.86,
          "analyst": 0.72,
          "opskins": 0.56
        }
      },
      "stattrak": {},
      "souvenir": {
        "0": {
          "market": 11.39,
          "analyst": 12.27,
          "opskins": 15
        },
        "1": {
          "market": 12.66,
          "analyst": 10.68,
          "opskins": 12.35
        },
        "2": {
          "market": 11.3,
          "analyst": 7.61,
          "opskins": 11
        },
        "3": {
          "market": 11.86,
          "analyst": 13.42,
          "opskins": 17
        },
        "4": {
          "market": 26.12,
          "analyst": 23.34,
          "opskins": 49
        }
      }
    }
  },
  "697": {
    "item_id": 697,
    "type": "M4A1-S",
    "skinName": "Icarus Fell",
    "prices": {
      "default": {
        "3": {
          "market": 55.96,
          "analyst": 45.67,
          "opskins": 41.25
        },
        "4": {
          "market": 56.97,
          "analyst": 45.6,
          "opskins": 39.89
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "698": {
    "item_id": 698,
    "type": "M4A1-S",
    "skinName": "Hot Rod",
    "prices": {
      "default": {
        "3": {
          "market": 72.92,
          "analyst": 66.35,
          "opskins": 52
        },
        "4": {
          "market": 76.02,
          "analyst": 63.13,
          "opskins": 53
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "699": {
    "item_id": 699,
    "type": "M4A1-S",
    "skinName": "Golden Coil",
    "prices": {
      "default": {
        "0": {
          "market": 10.45,
          "analyst": 8.42,
          "opskins": 7.33
        },
        "1": {
          "market": 12.54,
          "analyst": 10.08,
          "opskins": 8.58
        },
        "2": {
          "market": 14.35,
          "analyst": 11.12,
          "opskins": 9.48
        },
        "3": {
          "market": 20.39,
          "analyst": 16.76,
          "opskins": 14.41
        },
        "4": {
          "market": 34.55,
          "analyst": 28.54,
          "opskins": 25.77
        }
      },
      "stattrak": {
        "0": {
          "market": 28.83,
          "analyst": 23.94,
          "opskins": 21.67
        },
        "1": {
          "market": 35.75,
          "analyst": 27.24,
          "opskins": 25.24
        },
        "2": {
          "market": 43.42,
          "analyst": 33.71,
          "opskins": 29.64
        },
        "3": {
          "market": 73.83,
          "analyst": 58.56,
          "opskins": 50.98
        },
        "4": {
          "market": 142.37,
          "analyst": 122.28,
          "opskins": 102.9
        }
      },
      "souvenir": {}
    }
  },
  "700": {
    "item_id": 700,
    "type": "AK-47",
    "skinName": "Emerald Pinstripe",
    "prices": {
      "default": {
        "0": {
          "market": 1.09,
          "analyst": 0.86,
          "opskins": 0.74
        },
        "1": {
          "market": 1.11,
          "analyst": 0.89,
          "opskins": 0.72
        },
        "2": {
          "market": 1.17,
          "analyst": 0.92,
          "opskins": 0.79
        },
        "3": {
          "market": 1.66,
          "analyst": 1.29,
          "opskins": 1.15
        },
        "4": {
          "market": 2.96,
          "analyst": 2.42,
          "opskins": 2.03
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "701": {
    "item_id": 701,
    "type": "AK-47",
    "skinName": "First Class",
    "prices": {
      "default": {
        "0": {
          "market": 9.89,
          "analyst": 6.32,
          "opskins": 8.19
        },
        "1": {
          "market": 9.97,
          "analyst": 7.09,
          "opskins": 11
        },
        "2": {
          "market": 9.89,
          "analyst": 7.38,
          "opskins": 7.42
        },
        "3": {
          "market": 14.18,
          "analyst": 11.12,
          "opskins": 10.45
        },
        "4": {
          "market": 21.45,
          "analyst": 20.85,
          "opskins": 19.19
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "702": {
    "item_id": 702,
    "type": "AK-47",
    "skinName": "Hydroponic",
    "prices": {
      "default": {
        "0": {
          "market": 20.61,
          "analyst": 15.75,
          "opskins": 15.34
        },
        "1": {
          "market": 37.28,
          "analyst": 38.47,
          "opskins": 34.69
        },
        "2": {
          "market": 41.6,
          "analyst": 32.06,
          "opskins": 27.38
        },
        "3": {
          "market": 83.19,
          "analyst": 67.97,
          "opskins": 57
        },
        "4": {
          "market": 123.21,
          "analyst": 98.06,
          "opskins": 95.54
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "703": {
    "item_id": 703,
    "type": "AK-47",
    "skinName": "Jet Set",
    "prices": {
      "default": {
        "0": {
          "market": 25.09,
          "analyst": 21.44,
          "opskins": 22
        },
        "1": {
          "market": 27.26,
          "analyst": 22.79,
          "opskins": 20.9
        },
        "2": {
          "market": 29.6,
          "analyst": 25.21,
          "opskins": 23
        },
        "3": {
          "market": 41.2,
          "analyst": 36.74,
          "opskins": 30.82
        },
        "4": {
          "market": 121.75,
          "analyst": 118.94,
          "opskins": 107.99
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "704": {
    "item_id": 704,
    "type": "AK-47",
    "skinName": "Frontside Misty",
    "prices": {
      "default": {
        "0": {
          "market": 6.37,
          "analyst": 4.75,
          "opskins": 4.2
        },
        "1": {
          "market": 9.12,
          "analyst": 6.8,
          "opskins": 5.74
        },
        "2": {
          "market": 9.51,
          "analyst": 7.2,
          "opskins": 6.03
        },
        "3": {
          "market": 13.5,
          "analyst": 9.94,
          "opskins": 8.67
        },
        "4": {
          "market": 23.94,
          "analyst": 19.03,
          "opskins": 16.41
        }
      },
      "stattrak": {
        "0": {
          "market": 15.91,
          "analyst": 12.51,
          "opskins": 11.38
        },
        "1": {
          "market": 22.73,
          "analyst": 17.53,
          "opskins": 15.83
        },
        "2": {
          "market": 25.13,
          "analyst": 18.78,
          "opskins": 16.15
        },
        "3": {
          "market": 39.48,
          "analyst": 30.06,
          "opskins": 25.87
        },
        "4": {
          "market": 81.54,
          "analyst": 70.21,
          "opskins": 60.47
        }
      },
      "souvenir": {}
    }
  },
  "705": {
    "item_id": 705,
    "type": "AK-47",
    "skinName": "Point Disarray",
    "prices": {
      "default": {
        "0": {
          "market": 7.54,
          "analyst": 6.07,
          "opskins": 5.29
        },
        "1": {
          "market": 11.9,
          "analyst": 9.64,
          "opskins": 8.15
        },
        "2": {
          "market": 11.06,
          "analyst": 8.23,
          "opskins": 6.97
        },
        "3": {
          "market": 15.51,
          "analyst": 11.63,
          "opskins": 10.07
        },
        "4": {
          "market": 23.8,
          "analyst": 18.63,
          "opskins": 16
        }
      },
      "stattrak": {
        "0": {
          "market": 20.87,
          "analyst": 16.73,
          "opskins": 15.99
        },
        "1": {
          "market": 32.42,
          "analyst": 23.54,
          "opskins": 24.49
        },
        "2": {
          "market": 32.37,
          "analyst": 24.16,
          "opskins": 20.89
        },
        "3": {
          "market": 49.77,
          "analyst": 37.24,
          "opskins": 31.93
        },
        "4": {
          "market": 80.38,
          "analyst": 59.66,
          "opskins": 50
        }
      },
      "souvenir": {}
    }
  },
  "706": {
    "item_id": 706,
    "type": "Sawed-Off",
    "skinName": "Cutaway",
    "prices": {
      "default": {
        "0": {
          "market": 0.8
        },
        "1": {
          "market": 1.7
        },
        "2": {
          "market": 2.2
        },
        "3": {
          "market": 3.5
        },
        "4": {
          "market": 5.81
        }
      },
      "stattrak": {
        "0": {
          "market": 1.96
        },
        "1": {
          "market": 3.24
        },
        "2": {
          "market": 5.41
        },
        "3": {
          "market": 7.22
        },
        "4": {
          "market": 9.44
        }
      },
      "souvenir": {}
    }
  },
  "707": {
    "item_id": 707,
    "type": "PP-Bizon",
    "skinName": "Nostromo",
    "prices": {
      "default": {
        "0": {
          "market": 2.3
        },
        "1": {
          "market": 3.54
        },
        "2": {
          "market": 5.21
        },
        "3": {
          "market": 6.15
        },
        "4": {
          "market": 10.38
        }
      },
      "stattrak": {
        "0": {
          "market": 4.9
        },
        "1": {
          "market": 6.3
        },
        "2": {
          "market": 8.8
        },
        "3": {
          "market": 12.5
        },
        "4": {
          "market": 17
        }
      },
      "souvenir": {}
    }
  },
  "708": {
    "item_id": 708,
    "type": "Five-Seven",
    "skinName": "Blot",
    "prices": {
      "default": {
        "0": {
          "market": 3.44
        },
        "1": {
          "market": 4.62
        },
        "2": {
          "market": 5.3
        },
        "3": {
          "market": 6.84
        },
        "4": {
          "market": 8.95
        }
      },
      "stattrak": {
        "0": {
          "market": 4.8
        },
        "1": {
          "market": 5.96
        },
        "2": {
          "market": 7.8
        },
        "3": {
          "market": 9.7
        },
        "4": {
          "market": 11.7
        }
      },
      "souvenir": {}
    }
  },
  "709": {
    "item_id": 709,
    "type": "SSG 08",
    "skinName": "King Cobra",
    "prices": {
      "default": {
        "0": {
          "market": 0.1
        },
        "1": {
          "market": 0.3
        },
        "2": {
          "market": 0.6
        },
        "3": {
          "market": 0.9
        },
        "4": {
          "market": 1.6
        }
      },
      "stattrak": {
        "0": {
          "market": 0.2
        },
        "1": {
          "market": 0.6
        },
        "2": {
          "market": 0.9
        },
        "3": {
          "market": 1.3
        },
        "4": {
          "market": 1.9
        }
      },
      "souvenir": {}
    }
  },
  "710": {
    "item_id": 710,
    "type": "MAC-10",
    "skinName": "Kinetics",
    "prices": {
      "default": {
        "0": {
          "market": 4.7
        },
        "1": {
          "market": 6.5
        },
        "2": {
          "market": 8.9
        },
        "3": {
          "market": 12.5
        },
        "4": {
          "market": 15.7
        }
      },
      "stattrak": {
        "0": {
          "market": 6.2
        },
        "1": {
          "market": 7.9
        },
        "2": {
          "market": 9.3
        },
        "3": {
          "market": 13
        },
        "4": {
          "market": 21
        }
      },
      "souvenir": {}
    }
  },
  "711": {
    "item_id": 711,
    "type": "M4A1-S",
    "skinName": "Never Fly",
    "prices": {
      "default": {
        "0": {
          "market": 4.9
        },
        "1": {
          "market": 8.4
        },
        "2": {
          "market": 12.1
        },
        "3": {
          "market": 20.8
        },
        "4": {
          "market": 23.6
        }
      },
      "stattrak": {
        "0": {
          "market": 8.8
        },
        "1": {
          "market": 10.4
        },
        "2": {
          "market": 14.8
        },
        "3": {
          "market": 21.8
        },
        "4": {
          "market": 30.1
        }
      },
      "souvenir": {}
    }
  },
  "712": {
    "item_id": 712,
    "type": "CZ75",
    "skinName": "Badass Comic",
    "prices": {
      "default": {
        "0": {
          "market": 10.1
        },
        "1": {
          "market": 13.6
        },
        "2": {
          "market": 17.6
        },
        "3": {
          "market": 23.2
        },
        "4": {
          "market": 34.8
        }
      },
      "stattrak": {
        "0": {
          "market": 12.7
        },
        "1": {
          "market": 19.1
        },
        "2": {
          "market": 24.9
        },
        "3": {
          "market": 37.1
        },
        "4": {
          "market": 53.7
        }
      },
      "souvenir": {}
    }
  },
  "713": {
    "item_id": 713,
    "type": "P250",
    "skinName": "N-Force",
    "prices": {
      "default": {
        "0": {
          "market": 7
        },
        "1": {
          "market": 14.4
        },
        "2": {
          "market": 19.9
        },
        "3": {
          "market": 27.8
        },
        "4": {
          "market": 36.4
        }
      },
      "stattrak": {
        "0": {
          "market": 11.8
        },
        "1": {
          "market": 17.4
        },
        "2": {
          "market": 23.8
        },
        "3": {
          "market": 37.7
        },
        "4": {
          "market": 58.8
        }
      },
      "souvenir": {}
    }
  },
  "714": {
    "item_id": 714,
    "type": "AWP",
    "skinName": "Phoenix",
    "prices": {
      "default": {
        "0": {
          "market": 9.5
        },
        "1": {
          "market": 14.4
        },
        "2": {
          "market": 22
        },
        "3": {
          "market": 37.9
        },
        "4": {
          "market": 51.3
        }
      },
      "stattrak": {
        "0": {
          "market": 14.9
        },
        "1": {
          "market": 18.6
        },
        "2": {
          "market": 29.3
        },
        "3": {
          "market": 47.2
        },
        "4": {
          "market": 82.1
        }
      },
      "souvenir": {}
    }
  },
  "715": {
    "item_id": 715,
    "type": "Desert Eagle",
    "skinName": "Gold",
    "prices": {
      "default": {
        "0": {
          "market": 7.5
        },
        "1": {
          "market": 11.2
        },
        "2": {
          "market": 27.4
        },
        "3": {
          "market": 54.2
        },
        "4": {
          "market": 77.1
        }
      },
      "stattrak": {
        "0": {
          "market": 15.3
        },
        "1": {
          "market": 23.2
        },
        "2": {
          "market": 33.2
        },
        "3": {
          "market": 58.2
        },
        "4": {
          "market": 114.1
        }
      },
      "souvenir": {}
    }
  },
  "716": {
    "item_id": 716,
    "type": "AK-47",
    "skinName": "Fluentem",
    "prices": {
      "default": {
        "0": {
          "market": 22.5
        },
        "1": {
          "market": 28.2
        },
        "2": {
          "market": 41.4
        },
        "3": {
          "market": 68.2
        },
        "4": {
          "market": 97.1
        }
      },
      "stattrak": {
        "0": {
          "market": 30.8
        },
        "1": {
          "market": 37.2
        },
        "2": {
          "market": 56.4
        },
        "3": {
          "market": 89.2
        },
        "4": {
          "market": 128.7
        }
      },
      "souvenir": {}
    }
  },
  "717": {
    "item_id": 717,
    "type": "USP-S",
    "skinName": "Draco",
    "prices": {
      "default": {
        "0": {
          "market": 10.5
        },
        "1": {
          "market": 16.2
        },
        "2": {
          "market": 28.4
        },
        "3": {
          "market": 36.2
        },
        "4": {
          "market": 54.1
        }
      },
      "stattrak": {
        "0": {
          "market": 17.2
        },
        "1": {
          "market": 27.2
        },
        "2": {
          "market": 40.9
        },
        "3": {
          "market": 52.5
        },
        "4": {
          "market": 89.1
        }
      },
      "souvenir": {}
    }
  },
  "718": {
    "item_id": 718,
    "type": "Tec-9",
    "skinName": "Chemical smoke",
    "prices": {
      "default": {
        "0": {
          "market": 0.69
        },
        "1": {
          "market": 0.99
        },
        "2": {
          "market": 1.54
        },
        "3": {
          "market": 1.95
        },
        "4": {
          "market": 2.92
        }
      },
      "stattrak": {
        "0": {
          "market": 0.87
        },
        "1": {
          "market": 1.24
        },
        "2": {
          "market": 1.97
        },
        "3": {
          "market": 2.47
        },
        "4": {
          "market": 3.75
        }
      },
      "souvenir": {}
    }
  },
  "719": {
    "item_id": 719,
    "type": "PP-Bizon",
    "skinName": "TF2",
    "prices": {
      "default": {
        "0": {
          "market": 1.42
        },
        "1": {
          "market": 2.04
        },
        "2": {
          "market": 3.51
        },
        "3": {
          "market": 4.65
        },
        "4": {
          "market": 8.79
        }
      },
      "stattrak": {
        "0": {
          "market": 1.9
        },
        "1": {
          "market": 2.77
        },
        "2": {
          "market": 4.1
        },
        "3": {
          "market": 5.5
        },
        "4": {
          "market": 13.7
        }
      },
      "souvenir": {}
    }
  },
  "720": {
    "item_id": 720,
    "type": "USP-S",
    "skinName": "Dystopia",
    "prices": {
      "default": {
        "0": {
          "market": 2.22
        },
        "1": {
          "market": 3.31
        },
        "2": {
          "market": 3.74
        },
        "3": {
          "market": 4.42
        },
        "4": {
          "market": 6.95
        }
      },
      "stattrak": {
        "0": {
          "market": 2.8
        },
        "1": {
          "market": 3.85
        },
        "2": {
          "market": 4.8
        },
        "3": {
          "market": 5.7
        },
        "4": {
          "market": 8.75
        }
      },
      "souvenir": {}
    }
  },
  "721": {
    "item_id": 721,
    "type": "SG 553",
    "skinName": "Erlkoenig",
    "prices": {
      "default": {
        "0": {
          "market": 0.21
        },
        "1": {
          "market": 0.52
        },
        "2": {
          "market": 0.9
        },
        "3": {
          "market": 1.45
        },
        "4": {
          "market": 2.36
        }
      },
      "stattrak": {
        "0": {
          "market": 0.44
        },
        "1": {
          "market": 0.76
        },
        "2": {
          "market": 1.37
        },
        "3": {
          "market": 1.78
        },
        "4": {
          "market": 3.2
        }
      },
      "souvenir": {}
    }
  },
  "722": {
    "item_id": 722,
    "type": "M4A4",
    "skinName": "DeathWalker",
    "prices": {
      "default": {
        "0": {
          "market": 7.44
        },
        "1": {
          "market": 9.07
        },
        "2": {
          "market": 12
        },
        "3": {
          "market": 13.27
        },
        "4": {
          "market": 15.7
        }
      },
      "stattrak": {
        "0": {
          "market": 8.87
        },
        "1": {
          "market": 11.9
        },
        "2": {
          "market": 13.3
        },
        "3": {
          "market": 14.9
        },
        "4": {
          "market": 18.7
        }
      },
      "souvenir": {}
    }
  },
  "723": {
    "item_id": 723,
    "type": "UMP-45",
    "skinName": "Armamancer",
    "prices": {
      "default": {
        "0": {
          "market": 1.62
        },
        "1": {
          "market": 2.04
        },
        "2": {
          "market": 2.39
        },
        "3": {
          "market": 3.12
        },
        "4": {
          "market": 6.27
        }
      },
      "stattrak": {
        "0": {
          "market": 1.92
        },
        "1": {
          "market": 2.84
        },
        "2": {
          "market": 3.19
        },
        "3": {
          "market": 3.82
        },
        "4": {
          "market": 7.67
        }
      },
      "souvenir": {}
    }
  },
  "724": {
    "item_id": 724,
    "type": "MP7",
    "skinName": "Way of the Samurai",
    "prices": {
      "default": {
        "0": {
          "market": 6.45
        },
        "1": {
          "market": 6.96
        },
        "2": {
          "market": 8.12
        },
        "3": {
          "market": 9.54
        },
        "4": {
          "market": 18.9
        }
      },
      "stattrak": {
        "0": {
          "market": 7.04
        },
        "1": {
          "market": 7.86
        },
        "2": {
          "market": 9
        },
        "3": {
          "market": 10.13
        },
        "4": {
          "market": 20.9
        }
      },
      "souvenir": {}
    }
  },
  "725": {
    "item_id": 725,
    "type": "R8 Revolver",
    "skinName": "Kingdom of Dragons",
    "prices": {
      "default": {
        "0": {
          "market": 7.21
        },
        "1": {
          "market": 9.4
        },
        "2": {
          "market": 16.9
        },
        "3": {
          "market": 19.8
        },
        "4": {
          "market": 21.4
        }
      },
      "stattrak": {
        "0": {
          "market": 8.41
        },
        "1": {
          "market": 10.12
        },
        "2": {
          "market": 18.97
        },
        "3": {
          "market": 21.12
        },
        "4": {
          "market": 25.1
        }
      },
      "souvenir": {}
    }
  },
  "726": {
    "item_id": 726,
    "type": "FAMAS",
    "skinName": "BlueWolf",
    "prices": {
      "default": {
        "0": {
          "market": 10.75
        },
        "1": {
          "market": 13.33
        },
        "2": {
          "market": 17.01
        },
        "3": {
          "market": 22.94
        },
        "4": {
          "market": 38.3
        }
      },
      "stattrak": {
        "0": {
          "market": 11.1
        },
        "1": {
          "market": 14.23
        },
        "2": {
          "market": 18.31
        },
        "3": {
          "market": 24.07
        },
        "4": {
          "market": 42.77
        }
      },
      "souvenir": {}
    }
  },
  "727": {
    "item_id": 727,
    "type": "M4A1-S",
    "skinName": "BlueWolf",
    "prices": {
      "default": {
        "0": {
          "market": 14.5
        },
        "1": {
          "market": 16.2
        },
        "2": {
          "market": 24.4
        },
        "3": {
          "market": 33.3
        },
        "4": {
          "market": 67.1
        }
      },
      "stattrak": {
        "0": {
          "market": 16.3
        },
        "1": {
          "market": 19.44
        },
        "2": {
          "market": 28.31
        },
        "3": {
          "market": 47.47
        },
        "4": {
          "market": 86.15
        }
      },
      "souvenir": {}
    }
  },
  "728": {
    "item_id": 728,
    "type": "AWP",
    "skinName": "BlueWolf",
    "prices": {
      "default": {
        "0": {
          "market": 21.5
        },
        "1": {
          "market": 29.62
        },
        "2": {
          "market": 38.33
        },
        "3": {
          "market": 49.35
        },
        "4": {
          "market": 86.75
        }
      },
      "stattrak": {
        "0": {
          "market": 28.1
        },
        "1": {
          "market": 34.77
        },
        "2": {
          "market": 46.15
        },
        "3": {
          "market": 67.85
        },
        "4": {
          "market": 110.75
        }
      },
      "souvenir": {}
    }
  },
  "729": {
    "item_id": 729,
    "type": "Glock-18",
    "skinName": "BlueWolf",
    "prices": {
      "default": {
        "0": {
          "market": 21.5
        },
        "1": {
          "market": 27.2
        },
        "2": {
          "market": 34.4
        },
        "3": {
          "market": 46.2
        },
        "4": {
          "market": 68.1
        }
      },
      "stattrak": {
        "0": {
          "market": 23.5
        },
        "1": {
          "market": 30.2
        },
        "2": {
          "market": 37.44
        },
        "3": {
          "market": 58.2
        },
        "4": {
          "market": 87.1
        }
      },
      "souvenir": {}
    }
  },
  "730": {
    "item_id": 730,
    "type": "AK-47",
    "skinName": "BlueWolf",
    "prices": {
      "default": {
        "0": {
          "market": 28.34
        },
        "1": {
          "market": 30.44
        },
        "2": {
          "market": 47.43
        },
        "3": {
          "market": 68.2
        },
        "4": {
          "market": 93.1
        }
      },
      "stattrak": {
        "0": {
          "market": 34.34
        },
        "1": {
          "market": 39.44
        },
        "2": {
          "market": 57.43
        },
        "3": {
          "market": 76.2
        },
        "4": {
          "market": 113.1
        }
      },
      "souvenir": {}
    }
  },
  "731": {
    "item_id": 731,
    "type": "★ Gut Knife",
    "skinName": "Revenge in Sweet",
    "prices": {
      "default": {
        "0": {
          "market": 99
        },
        "1": {
          "market": 120
        },
        "2": {
          "market": 170
        },
        "3": {
          "market": 210
        },
        "4": {
          "market": 300
        }
      },
      "stattrak": {
        "0": {
          "market": 147
        },
        "1": {
          "market": 182.4
        },
        "2": {
          "market": 232.9
        },
        "3": {
          "market": 294.1
        },
        "4": {
          "market": 383.7
        }
      },
      "souvenir": {}
    }
  },
  "732": {
    "item_id": 732,
    "type": "★ Karambit",
    "skinName": "Purple Abstract",
    "prices": {
      "default": {
        "0": {
          "market": 158.3
        },
        "1": {
          "market": 193.6
        },
        "2": {
          "market": 230.1
        },
        "3": {
          "market": 272.6
        },
        "4": {
          "market": 397.6
        }
      },
      "stattrak": {
        "0": {
          "market": 195.3
        },
        "1": {
          "market": 227.3
        },
        "2": {
          "market": 260.2
        },
        "3": {
          "market": 301.2
        },
        "4": {
          "market": 440.6
        }
      },
      "souvenir": {}
    }
  },
  "733": {
    "item_id": 733,
    "type": "★ Karambit",
    "skinName": "Bloodline",
    "prices": {
      "default": {
        "0": {
          "market": 123.4
        },
        "1": {
          "market": 148.4
        },
        "2": {
          "market": 156.99
        },
        "3": {
          "market": 208.52
        },
        "4": {
          "market": 399
        }
      },
      "stattrak": {
        "0": {
          "market": 173.4
        },
        "1": {
          "market": 197.4
        },
        "2": {
          "market": 243.99
        },
        "3": {
          "market": 283.52
        },
        "4": {
          "market": 490
        }
      },
      "souvenir": {}
    }
  },
  "734": {
    "item_id": 734,
    "type": "★ Karambit",
    "skinName": "Scorpion",
    "prices": {
      "default": {
        "0": {
          "market": 210.3
        },
        "1": {
          "market": 285.6
        },
        "2": {
          "market": 347.1
        },
        "3": {
          "market": 399.99
        },
        "4": {
          "market": 427.6
        }
      },
      "stattrak": {
        "0": {
          "market": 267.3
        },
        "1": {
          "market": 386.6
        },
        "2": {
          "market": 415.1
        },
        "3": {
          "market": 482.99
        },
        "4": {
          "market": 596.6
        }
      },
      "souvenir": {}
    }
  },
  "735": {
    "item_id": 735,
    "type": "Glock-18",
    "skinName": "Candy Racer",
    "prices": {
      "default": {
        "1": {
          "market": 0.23
        },
        "2": {
          "market": 0.1
        },
        "3": {
          "market": 0.7
        },
        "4": {
          "market": 2
        }
      },
      "stattrak": {
        "1": {
          "market": 1
        },
        "2": {
          "market": 1.79
        },
        "3": {
          "market": 1.2
        },
        "4": {
          "market": 4
        }
      },
      "souvenir": {}
    }
  },
  "736": {
    "item_id": 736,
    "type": "AWP",
    "skinName": "Animal",
    "prices": {
      "default": {
        "2": {
          "market": 5
        },
        "3": {
          "market": 4
        },
        "4": {
          "market": 12
        }
      },
      "stattrak": {
        "2": {
          "market": 14
        },
        "3": {
          "market": 15
        },
        "4": {
          "market": 38
        }
      },
      "souvenir": {}
    }
  },
  "737": {
    "item_id": 737,
    "type": "FAMAS",
    "skinName": "Stinger",
    "prices": {
      "default": {
        "0": {
          "market": 4
        },
        "1": {
          "market": 2
        },
        "2": {
          "market": 3
        },
        "3": {
          "market": 7
        },
        "4": {
          "market": 6
        }
      },
      "stattrak": {
        "0": {
          "market": 9
        },
        "1": {
          "market": 5
        },
        "2": {
          "market": 2
        },
        "3": {
          "market": 13
        },
        "4": {
          "market": 29
        }
      },
      "souvenir": {}
    }
  },
  "738": {
    "item_id": 738,
    "type": "UMP-45",
    "skinName": "AGGRESSOR",
    "prices": {
      "default": {
        "0": {
          "market": 2
        },
        "1": {
          "market": 1.5
        },
        "2": {
          "market": 1
        },
        "3": {
          "market": 3
        },
        "4": {
          "market": 5
        }
      },
      "stattrak": {
        "0": {
          "market": 4
        },
        "1": {
          "market": 3.94
        },
        "2": {
          "market": 4.3
        },
        "3": {
          "market": 6
        },
        "4": {
          "market": 10
        }
      },
      "souvenir": {}
    }
  },
  "739": {
    "item_id": 739,
    "type": "USP-S",
    "skinName": "Banker",
    "prices": {
      "default": {
        "0": {
          "market": 0.47
        },
        "1": {
          "market": 1
        },
        "2": {
          "market": 0.2
        },
        "3": {
          "market": 2
        },
        "4": {
          "market": 3
        }
      },
      "stattrak": {
        "0": {
          "market": 1
        },
        "1": {
          "market": 2
        },
        "2": {
          "market": 1.1
        },
        "3": {
          "market": 3
        },
        "4": {
          "market": 12
        }
      },
      "souvenir": {}
    }
  },
  "740": {
    "item_id": 740,
    "type": "Desert Eagle",
    "skinName": "Crude",
    "prices": {
      "default": {
        "3": {
          "market": 75
        },
        "4": {
          "market": 77
        }
      },
      "stattrak": {
        "3": {
          "market": 75
        },
        "4": {
          "market": 77
        }
      },
      "souvenir": {}
    }
  },
  "741": {
    "item_id": 741,
    "type": "M4A4",
    "skinName": "Shark's Prey",
    "prices": {
      "default": {
        "0": {
          "market": 16
        },
        "1": {
          "market": 15
        },
        "2": {
          "market": 20
        },
        "3": {
          "market": 30
        },
        "4": {
          "market": 45
        }
      },
      "stattrak": {
        "0": {
          "market": 28
        },
        "1": {
          "market": 36
        },
        "2": {
          "market": 48
        },
        "3": {
          "market": 67
        },
        "4": {
          "market": 84
        }
      },
      "souvenir": {}
    }
  },
  "742": {
    "item_id": 742,
    "type": "P90",
    "skinName": "Stone story",
    "prices": {
      "default": {
        "0": {
          "market": 4.07
        },
        "1": {
          "market": 5.18
        },
        "2": {
          "market": 4
        },
        "3": {
          "market": 8
        },
        "4": {
          "market": 11
        }
      },
      "stattrak": {
        "0": {
          "market": 19
        },
        "1": {
          "market": 14.23
        },
        "2": {
          "market": 14.63
        },
        "3": {
          "market": 23.7
        },
        "4": {
          "market": 44
        }
      },
      "souvenir": {}
    }
  },
  "743": {
    "item_id": 743,
    "type": "AK-47",
    "skinName": "Wolf Attack",
    "prices": {
      "default": {
        "0": {
          "market": 19
        },
        "1": {
          "market": 22
        },
        "2": {
          "market": 28
        },
        "3": {
          "market": 37
        },
        "4": {
          "market": 73
        }
      },
      "stattrak": {
        "0": {
          "market": 34
        },
        "1": {
          "market": 53
        },
        "2": {
          "market": 74
        },
        "3": {
          "market": 107
        },
        "4": {
          "market": 207
        }
      },
      "souvenir": {}
    }
  },
  "744": {
    "item_id": 744,
    "type": "USP-S",
    "skinName": "Apis",
    "prices": {
      "default": {
        "0": {
          "market": 34
        },
        "1": {
          "market": 54
        },
        "2": {
          "market": 76
        },
        "3": {
          "market": 89
        },
        "4": {
          "market": 113
        }
      },
      "stattrak": {
        "0": {
          "market": 45
        },
        "1": {
          "market": 59
        },
        "2": {
          "market": 84
        },
        "3": {
          "market": 107
        },
        "4": {
          "market": 138
        }
      },
      "souvenir": {}
    }
  },
  "745": {
    "item_id": 745,
    "type": "AK-47",
    "skinName": "Lawbreaker",
    "prices": {
      "default": {
        "0": {
          "market": 87
        },
        "1": {
          "market": 145
        },
        "2": {
          "market": 177
        },
        "3": {
          "market": 230
        },
        "4": {
          "market": 228
        }
      },
      "stattrak": {
        "0": {
          "market": 320
        },
        "1": {
          "market": 430
        },
        "2": {
          "market": 655
        },
        "3": {
          "market": 980
        },
        "4": {
          "market": 670
        }
      },
      "souvenir": {}
    }
  },
  "746": {
    "item_id": 746,
    "type": "M4A4",
    "skinName": "Howl (REMOVED)",
    "prices": {
      "default": {
        "2": {
          "market": 277
        },
        "3": {
          "market": 357
        },
        "4": {
          "market": 415
        }
      },
      "stattrak": {
        "2": {
          "market": 475
        },
        "3": {
          "market": 550
        },
        "4": {
          "market": 650
        }
      },
      "souvenir": {}
    }
  },
  "747": {
    "item_id": 747,
    "type": "★ M9 Bayonet",
    "skinName": "RedBlade",
    "prices": {
      "default": {
        "0": {
          "market": 135
        },
        "1": {
          "market": 185
        },
        "2": {
          "market": 299
        },
        "3": {
          "market": 477
        },
        "4": {
          "market": 607
        }
      },
      "stattrak": {
        "0": {
          "market": 204
        },
        "1": {
          "market": 332
        },
        "2": {
          "market": 575
        },
        "3": {
          "market": 602
        },
        "4": {
          "market": 725
        }
      },
      "souvenir": {}
    }
  },
  "748": {
    "item_id": 748,
    "type": "★ Karambit",
    "skinName": "Cosplay",
    "prices": {
      "default": {
        "0": {
          "market": 100
        },
        "1": {
          "market": 130
        },
        "2": {
          "market": 200
        },
        "3": {
          "market": 350
        },
        "4": {
          "market": 600
        }
      },
      "stattrak": {
        "0": {
          "market": 243
        },
        "1": {
          "market": 311
        },
        "2": {
          "market": 470
        },
        "3": {
          "market": 620
        },
        "4": {
          "market": 933
        }
      },
      "souvenir": {}
    }
  },
  "749": {
    "item_id": 749,
    "type": "P2000",
    "skinName": "Turf",
    "prices": {
      "default": {
        "0": {
          "market": 0.15,
          "analyst": 0.46,
          "opskins": -1
        },
        "1": {
          "market": 0.16,
          "analyst": 0.52,
          "opskins": -1
        },
        "2": {
          "market": 0.17,
          "analyst": 0.59,
          "opskins": -1
        },
        "3": {
          "market": 0.24,
          "analyst": 0.87,
          "opskins": -1
        },
        "4": {
          "market": 0.81,
          "analyst": 2.65,
          "opskins": -1
        }
      },
      "stattrak": {
        "0": {
          "market": 0.52,
          "analyst": 1.43,
          "opskins": -1
        },
        "1": {
          "market": 0.55,
          "analyst": 1.55,
          "opskins": -1
        },
        "2": {
          "market": 0.71,
          "analyst": 2.37,
          "opskins": -1
        },
        "3": {
          "market": 1.32,
          "analyst": 4.04,
          "opskins": -1
        },
        "4": {
          "market": 5.62,
          "analyst": 10.29,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "750": {
    "item_id": 750,
    "type": "MAG-7",
    "skinName": "Sonar",
    "prices": {
      "default": {
        "1": {
          "market": 0.17,
          "analyst": 0.45,
          "opskins": -1
        },
        "2": {
          "market": 0.17,
          "analyst": 0.53,
          "opskins": -1
        },
        "3": {
          "market": 0.24,
          "analyst": 0.67,
          "opskins": -1
        },
        "4": {
          "market": 0.33,
          "analyst": 0.81,
          "opskins": -1
        }
      },
      "stattrak": {
        "1": {
          "market": 0.54
        },
        "2": {
          "market": 0.56,
          "analyst": 1.39,
          "opskins": -1
        },
        "3": {
          "market": 0.95,
          "analyst": 2,
          "opskins": -1
        },
        "4": {
          "market": 1.46,
          "analyst": 2.95,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "751": {
    "item_id": 751,
    "type": "MP9",
    "skinName": "Sand Scale",
    "prices": {
      "default": {
        "1": {
          "market": 0.16,
          "analyst": 0.48,
          "opskins": -1
        },
        "2": {
          "market": 0.17,
          "analyst": 0.51,
          "opskins": -1
        },
        "3": {
          "market": 0.24,
          "analyst": 0.71,
          "opskins": -1
        },
        "4": {
          "market": 0.32,
          "analyst": 0.79,
          "opskins": -1
        }
      },
      "stattrak": {
        "1": {
          "market": 0.52,
          "analyst": 1.87,
          "opskins": -1
        },
        "2": {
          "market": 0.6,
          "analyst": 1.35,
          "opskins": -1
        },
        "3": {
          "market": 0.96,
          "analyst": 1.99,
          "opskins": -1
        },
        "4": {
          "market": 1.47,
          "analyst": 3.03,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "752": {
    "item_id": 752,
    "type": "Galil AR",
    "skinName": "Black Sand",
    "prices": {
      "default": {
        "0": {
          "market": 0.14,
          "analyst": 0.47,
          "opskins": -1
        },
        "1": {
          "market": 0.15,
          "analyst": 0.47,
          "opskins": -1
        },
        "2": {
          "market": 0.17,
          "analyst": 0.55,
          "opskins": -1
        },
        "3": {
          "market": 0.24,
          "analyst": 0.75,
          "opskins": -1
        },
        "4": {
          "market": 0.55,
          "analyst": 1.7,
          "opskins": -1
        }
      },
      "stattrak": {
        "0": {
          "market": 0.47,
          "analyst": 1.17,
          "opskins": -1
        },
        "1": {
          "market": 0.5,
          "analyst": 1.11,
          "opskins": -1
        },
        "2": {
          "market": 0.59,
          "analyst": 1.48,
          "opskins": -1
        },
        "3": {
          "market": 1.03,
          "analyst": 2.36,
          "opskins": -1
        },
        "4": {
          "market": 3.27,
          "analyst": 13.93,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "753": {
    "item_id": 753,
    "type": "MP7",
    "skinName": "Cirrus",
    "prices": {
      "default": {
        "0": {
          "market": 0.21,
          "analyst": 0.67,
          "opskins": -1
        },
        "1": {
          "market": 0.45,
          "analyst": 1.1,
          "opskins": -1
        },
        "2": {
          "market": 0.21,
          "analyst": 0.81,
          "opskins": -1
        },
        "3": {
          "market": 0.44,
          "analyst": 1.24,
          "opskins": -1
        },
        "4": {
          "market": 1.07,
          "analyst": 2.29,
          "opskins": -1
        }
      },
      "stattrak": {
        "0": {
          "market": 0.98,
          "analyst": 2.03,
          "opskins": -1
        },
        "1": {
          "market": 1.93,
          "analyst": 3.59,
          "opskins": -1
        },
        "2": {
          "market": 1.09,
          "analyst": 2.23,
          "opskins": -1
        },
        "3": {
          "market": 2.12,
          "analyst": 4.59,
          "opskins": -1
        },
        "4": {
          "market": 4.84,
          "analyst": 7.63,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "754": {
    "item_id": 754,
    "type": "Glock-18",
    "skinName": "Ironwork",
    "prices": {
      "default": {
        "0": {
          "market": 0.15,
          "analyst": 0.63,
          "opskins": -1
        },
        "1": {
          "market": 0.16,
          "analyst": 0.63,
          "opskins": -1
        },
        "2": {
          "market": 0.18,
          "analyst": 0.77,
          "opskins": -1
        },
        "3": {
          "market": 0.27,
          "analyst": 1.14,
          "opskins": -1
        },
        "4": {
          "market": 0.89,
          "analyst": 3.4,
          "opskins": -1
        }
      },
      "stattrak": {
        "0": {
          "market": 0.96,
          "analyst": 2.55,
          "opskins": -1
        },
        "1": {
          "market": 0.96,
          "analyst": 2.29,
          "opskins": -1
        },
        "2": {
          "market": 1.03,
          "analyst": 3.08,
          "opskins": -1
        },
        "3": {
          "market": 1.65,
          "analyst": 4.88,
          "opskins": -1
        },
        "4": {
          "market": 5.89,
          "analyst": 14.08,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "755": {
    "item_id": 755,
    "type": "CZ75-Auto",
    "skinName": "Polymer",
    "prices": {
      "default": {
        "0": {
          "market": 0.16,
          "analyst": 0.46,
          "opskins": -1
        },
        "1": {
          "market": 0.17,
          "analyst": 0.51,
          "opskins": -1
        },
        "2": {
          "market": 0.17,
          "analyst": 0.54,
          "opskins": -1
        },
        "3": {
          "market": 0.25,
          "analyst": 0.7,
          "opskins": -1
        },
        "4": {
          "market": 0.36,
          "analyst": 0.93,
          "opskins": -1
        }
      },
      "stattrak": {
        "0": {
          "market": 0.53,
          "analyst": 1.37,
          "opskins": -1
        },
        "1": {
          "market": 0.59,
          "analyst": 1.43,
          "opskins": -1
        },
        "2": {
          "market": 0.59,
          "analyst": 1.35,
          "opskins": -1
        },
        "3": {
          "market": 1.01,
          "analyst": 2.08,
          "opskins": -1
        },
        "4": {
          "market": 1.52,
          "analyst": 3.29,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "756": {
    "item_id": 756,
    "type": "USP-S",
    "skinName": "Cyrex",
    "prices": {
      "default": {
        "0": {
          "market": 2.33,
          "analyst": 3.69,
          "opskins": -1
        },
        "1": {
          "market": 3.74,
          "analyst": 5.89,
          "opskins": -1
        },
        "2": {
          "market": 3.21,
          "analyst": 5.81,
          "opskins": -1
        },
        "3": {
          "market": 5.32,
          "analyst": 10.44,
          "opskins": -1
        },
        "4": {
          "market": 7.08,
          "analyst": 14.39,
          "opskins": -1
        }
      },
      "stattrak": {
        "0": {
          "market": 7.11
        },
        "1": {
          "market": 11.56
        },
        "2": {
          "market": 10.96,
          "analyst": 18.23,
          "opskins": -1
        },
        "3": {
          "market": 19.47,
          "analyst": 35.58,
          "opskins": -1
        },
        "4": {
          "market": 28.42,
          "analyst": 55.08,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "757": {
    "item_id": 757,
    "type": "Nova",
    "skinName": "Gila",
    "prices": {
      "default": {
        "2": {
          "market": 0.36,
          "analyst": 0.92,
          "opskins": -1
        },
        "3": {
          "market": 0.38,
          "analyst": 1.12,
          "opskins": -1
        },
        "4": {
          "market": 0.56,
          "analyst": 1.34,
          "opskins": -1
        }
      },
      "stattrak": {
        "2": {
          "market": 1,
          "analyst": 3.26,
          "opskins": -1
        },
        "3": {
          "market": 1.36,
          "analyst": 3.9,
          "opskins": -1
        },
        "4": {
          "market": 2.39,
          "analyst": 4.97,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "758": {
    "item_id": 758,
    "type": "M4A1-S",
    "skinName": "Flashback",
    "prices": {
      "default": {
        "0": {
          "market": 2.59,
          "analyst": 6.15,
          "opskins": -1
        },
        "1": {
          "market": 2.78,
          "analyst": 6.51,
          "opskins": -1
        },
        "2": {
          "market": 3.1,
          "analyst": 7.74,
          "opskins": -1
        },
        "3": {
          "market": 4.57,
          "analyst": 11.33,
          "opskins": -1
        },
        "4": {
          "market": 8.19,
          "analyst": 18.95,
          "opskins": -1
        }
      },
      "stattrak": {
        "0": {
          "market": 9.89,
          "analyst": 17.96,
          "opskins": -1
        },
        "1": {
          "market": 10.21,
          "analyst": 17.93,
          "opskins": -1
        },
        "2": {
          "market": 11.7,
          "analyst": 22.37,
          "opskins": -1
        },
        "3": {
          "market": 17.05,
          "analyst": 35.85,
          "opskins": -1
        },
        "4": {
          "market": 35.67,
          "analyst": 52.15,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "759": {
    "item_id": 759,
    "type": "G3SG1",
    "skinName": "Stinger",
    "prices": {
      "default": {
        "0": {
          "market": 0.31,
          "analyst": 0.92,
          "opskins": -1
        },
        "1": {
          "market": 0.42,
          "analyst": 1.2,
          "opskins": -1
        },
        "2": {
          "market": 0.29,
          "analyst": 1.01,
          "opskins": -1
        },
        "3": {
          "market": 0.42,
          "analyst": 1.22,
          "opskins": -1
        },
        "4": {
          "market": 0.75,
          "analyst": 1.7,
          "opskins": -1
        }
      },
      "stattrak": {
        "0": {
          "market": 0.95
        },
        "1": {
          "market": 1.79,
          "analyst": 4.14,
          "opskins": -1
        },
        "2": {
          "market": 1.03,
          "analyst": 2.63,
          "opskins": -1
        },
        "3": {
          "market": 1.72,
          "analyst": 4.11,
          "opskins": -1
        },
        "4": {
          "market": 3.19,
          "analyst": 6.26,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "760": {
    "item_id": 760,
    "type": "Dual Berettas",
    "skinName": "Royal Consorts",
    "prices": {
      "default": {
        "0": {
          "market": 0.3,
          "analyst": 1.25,
          "opskins": -1
        },
        "1": {
          "market": 0.3,
          "analyst": 1.3,
          "opskins": -1
        },
        "2": {
          "market": 0.3,
          "analyst": 1.66,
          "opskins": -1
        },
        "3": {
          "market": 0.73,
          "analyst": 3.54,
          "opskins": -1
        },
        "4": {
          "market": 2.15,
          "analyst": 6,
          "opskins": -1
        }
      },
      "stattrak": {
        "0": {
          "market": 1.31
        },
        "1": {
          "market": 1.27,
          "analyst": 4.34,
          "opskins": -1
        },
        "2": {
          "market": 1.47,
          "analyst": 5.51,
          "opskins": -1
        },
        "3": {
          "market": 3.6,
          "analyst": 11.16,
          "opskins": -1
        },
        "4": {
          "market": 10.51,
          "analyst": 32.02,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "761": {
    "item_id": 761,
    "type": "Sawed-Off",
    "skinName": "Wasteland Princess",
    "prices": {
      "default": {
        "0": {
          "market": 2.24,
          "analyst": 4.9,
          "opskins": -1
        },
        "1": {
          "market": 2.73
        },
        "2": {
          "market": 2.42,
          "analyst": 5.34,
          "opskins": -1
        },
        "3": {
          "market": 3.44,
          "analyst": 7.76,
          "opskins": -1
        },
        "4": {
          "market": 4.62,
          "analyst": 12.04,
          "opskins": -1
        }
      },
      "stattrak": {
        "2": {
          "market": 7.13
        },
        "3": {
          "market": 11.42
        },
        "4": {
          "market": 16.99,
          "analyst": 38.1,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "762": {
    "item_id": 762,
    "type": "P90",
    "skinName": "Shallow Grave",
    "prices": {
      "default": {
        "0": {
          "market": 2.41,
          "analyst": 4.68,
          "opskins": -1
        },
        "1": {
          "market": 3.03
        },
        "2": {
          "market": 2.46,
          "analyst": 5.43,
          "opskins": -1
        },
        "3": {
          "market": 3.57,
          "analyst": 7.6,
          "opskins": -1
        },
        "4": {
          "market": 5.34,
          "analyst": 12.85,
          "opskins": -1
        }
      },
      "stattrak": {
        "0": {
          "market": 6.76
        },
        "2": {
          "market": 7.95,
          "analyst": 15.39,
          "opskins": -1
        },
        "3": {
          "market": 13.64,
          "analyst": 30.08,
          "opskins": -1
        },
        "4": {
          "market": 25.54
        }
      },
      "souvenir": {}
    }
  },
  "763": {
    "item_id": 763,
    "type": "FAMAS",
    "skinName": "Mecha Industries",
    "prices": {
      "default": {
        "0": {
          "market": 2.4
        },
        "1": {
          "market": 2.61
        },
        "2": {
          "market": 2.76,
          "analyst": 6.2,
          "opskins": -1
        },
        "3": {
          "market": 4.27,
          "analyst": 9.64,
          "opskins": -1
        },
        "4": {
          "market": 5.6,
          "analyst": 12.76,
          "opskins": -1
        }
      },
      "stattrak": {
        "2": {
          "market": 8.46,
          "analyst": 16.88,
          "opskins": -1
        },
        "3": {
          "market": 13.97,
          "analyst": 25.58,
          "opskins": -1
        },
        "4": {
          "market": 18.96,
          "analyst": 45.31,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "764": {
    "item_id": 764,
    "type": "M4A4",
    "skinName": "Buzz Kill",
    "prices": {
      "default": {
        "0": {
          "market": 14.63,
          "analyst": 21.86,
          "opskins": -1
        },
        "1": {
          "market": 18.86
        },
        "2": {
          "market": 19.03,
          "analyst": 31.77,
          "opskins": -1
        },
        "3": {
          "market": 27.15,
          "analyst": 45.44,
          "opskins": -1
        },
        "4": {
          "market": 39.22,
          "analyst": 85.59,
          "opskins": -1
        }
      },
      "stattrak": {
        "2": {
          "market": 61.35
        },
        "3": {
          "market": 96.83,
          "analyst": 246.31,
          "opskins": -1
        }
      },
      "souvenir": {}
    }
  },
  "765": {
    "item_id": 765,
    "type": "SSG 08",
    "skinName": "Dragonfire",
    "prices": {
      "default": {
        "0": {
          "market": 20.22
        },
        "1": {
          "market": 24.85
        },
        "2": {
          "market": 27.05,
          "analyst": 43.66,
          "opskins": -1
        },
        "3": {
          "market": 35.01,
          "analyst": 63.5,
          "opskins": -1
        },
        "4": {
          "market": 43.44,
          "analyst": 81.85,
          "opskins": -1
        }
      },
      "stattrak": {
        "2": {
          "market": 68.37,
          "analyst": 114.78,
          "opskins": -1
        },
        "3": {
          "market": 103.44,
          "analyst": 133.42,
          "opskins": -1
        },
        "4": {
          "market": 146.15
        }
      },
      "souvenir": {}
    }
  },
  "766": {
    "item_id": 766,
    "type": "★ Sport Gloves",
    "skinName": "Pandora's Box",
    "prices": {
      "default": {
        "2": {
          "market": 394,
          "analyst": -1,
          "opskins": -1
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "767": {
    "item_id": 767,
    "type": "★ Driver Gloves",
    "skinName": "Lunar Weave",
    "prices": {
      "default": {
        "2": {
          "market": 148.97
        },
        "3": {
          "market": 380,
          "analyst": -1,
          "opskins": -1
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "768": {
    "item_id": 768,
    "type": "★ Hand Wraps",
    "skinName": "Spruce DDPAT",
    "prices": {
      "default": {
        "1": {
          "market": 200,
          "analyst": -1,
          "opskins": -1
        },
        "2": {
          "market": 123.03,
          "analyst": 385.41,
          "opskins": -1
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "769": {
    "item_id": 769,
    "type": "★ Hand Wraps",
    "skinName": "Leather",
    "prices": {
      "default": {
        "0": {
          "market": 143,
          "analyst": 287.82,
          "opskins": -1
        },
        "2": {
          "market": 162.83,
          "analyst": 482.19,
          "opskins": -1
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "770": {
    "item_id": 770,
    "type": "★ Specialist Gloves",
    "skinName": "Forest DDPAT",
    "prices": {
      "default": {
        "3": {
          "market": 230,
          "analyst": -1,
          "opskins": -1
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "771": {
    "item_id": 771,
    "type": "★ Moto Gloves",
    "skinName": "Cool Mint",
    "prices": {
      "default": {
        "2": {
          "market": 181.81,
          "analyst": 446.36,
          "opskins": -1
        },
        "3": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "772": {
    "item_id": 772,
    "type": "★ Moto Gloves",
    "skinName": "Eclipse",
    "prices": {
      "default": {
        "2": {
          "market": 155.78
        },
        "3": {
          "market": 235.36,
          "analyst": -1,
          "opskins": -1
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "773": {
    "item_id": 773,
    "type": "★ Specialist Gloves",
    "skinName": "Foundation",
    "prices": {
      "default": {
        "0": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        },
        "2": {
          "market": 186.07
        },
        "3": {
          "market": -1,
          "analyst": -1,
          "opskins": -1
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "774": {
    "item_id": 774,
    "type": "AK-47",
    "skinName": "Shark's Reef",
    "prices": {
      "default": {
        "0": {
          "market": 21
        },
        "1": {
          "market": 34
        },
        "2": {
          "market": 66.5
        },
        "3": {
          "market": 97.11
        },
        "4": {
          "market": 144.54
        }
      },
      "stattrak": {
        "0": {
          "market": 67
        },
        "1": {
          "market": 85.52
        },
        "2": {
          "market": 102.42
        },
        "3": {
          "market": 131.43
        },
        "4": {
          "market": 195
        }
      },
      "souvenir": {}
    }
  },
  "775": {
    "item_id": 775,
    "type": "P90",
    "skinName": "Green Hunter",
    "prices": {
      "default": {
        "0": {
          "market": 0.56
        },
        "1": {
          "market": 0.87
        },
        "2": {
          "market": 0.99
        },
        "3": {
          "market": 1.12
        },
        "4": {
          "market": 2.1
        }
      },
      "stattrak": {
        "0": {
          "market": 1.67
        },
        "1": {
          "market": 2.01
        },
        "2": {
          "market": 2.75
        },
        "3": {
          "market": 3.66
        },
        "4": {
          "market": 5.21
        }
      },
      "souvenir": {}
    }
  },
  "776": {
    "item_id": 776,
    "type": "AWP",
    "skinName": "Kyoto Craftsman",
    "prices": {
      "default": {
        "0": {
          "market": 0.87
        },
        "1": {
          "market": 1.22
        },
        "2": {
          "market": 1.25
        },
        "3": {
          "market": 2.17
        },
        "4": {
          "market": 3.54
        }
      },
      "stattrak": {
        "0": {
          "market": 4.33
        },
        "1": {
          "market": 5.21
        },
        "2": {
          "market": 5.99
        },
        "3": {
          "market": 6.22
        },
        "4": {
          "market": 8.33
        }
      },
      "souvenir": {}
    }
  },
  "777": {
    "item_id": 777,
    "type": "AK-47",
    "skinName": "Toucan",
    "prices": {
      "default": {
        "2": {
          "market": 10.3
        },
        "3": {
          "market": 15.23
        },
        "4": {
          "market": 26.21
        }
      },
      "stattrak": {
        "2": {
          "market": 23.41
        },
        "3": {
          "market": 32.12
        },
        "4": {
          "market": 61.2
        }
      },
      "souvenir": {}
    }
  },
  "778": {
    "item_id": 778,
    "type": "M4A4",
    "skinName": "Vengeful Power",
    "prices": {
      "default": {
        "1": {
          "market": 5.02
        },
        "2": {
          "market": 2.96
        },
        "3": {
          "market": 4.99
        },
        "4": {
          "market": 8.65
        }
      },
      "stattrak": {
        "1": {
          "market": 14.2
        },
        "2": {
          "market": 8.21
        },
        "3": {
          "market": 16.3
        },
        "4": {
          "market": 28
        }
      },
      "souvenir": {}
    }
  },
  "779": {
    "item_id": 779,
    "type": "Five-SeveN",
    "skinName": "Dragon Force",
    "prices": {
      "default": {
        "2": {
          "market": 0.35
        },
        "3": {
          "market": 0.4
        },
        "4": {
          "market": 0.49
        }
      },
      "stattrak": {
        "2": {
          "market": 1.03
        },
        "3": {
          "market": 1.42
        },
        "4": {
          "market": 2.02
        }
      },
      "souvenir": {}
    }
  },
  "780": {
    "item_id": 780,
    "type": "M4A4",
    "skinName": "WildStyle",
    "prices": {
      "default": {
        "0": {
          "market": 0.89
        },
        "1": {
          "market": 0.99
        },
        "2": {
          "market": 1.12
        },
        "3": {
          "market": 1.84
        },
        "4": {
          "market": 2.57
        }
      },
      "stattrak": {
        "0": {
          "market": 4.12
        },
        "1": {
          "market": 4.47
        },
        "2": {
          "market": 4.5
        },
        "3": {
          "market": 6.2
        },
        "4": {
          "market": 10.34
        }
      },
      "souvenir": {}
    }
  },
  "781": {
    "item_id": 781,
    "type": "USP-S",
    "skinName": "Desolate Space",
    "prices": {
      "default": {
        "2": {
          "market": 17.78
        },
        "3": {
          "market": 19.61
        },
        "4": {
          "market": 69.41
        }
      },
      "stattrak": {
        "2": {
          "market": 60.33
        },
        "3": {
          "market": 68.12
        },
        "4": {
          "market": 275.11
        }
      },
      "souvenir": {}
    }
  },
  "782": {
    "item_id": 782,
    "type": "AWP",
    "skinName": "Revenge of the Martian",
    "prices": {
      "default": {
        "2": {
          "market": 16
        },
        "3": {
          "market": 18.12
        },
        "4": {
          "market": 85
        }
      },
      "stattrak": {
        "2": {
          "market": 47.48
        },
        "3": {
          "market": 64.12
        }
      },
      "souvenir": {}
    }
  },
  "783": {
    "item_id": 783,
    "type": "Tec-9",
    "skinName": "Tiger",
    "prices": {
      "default": {
        "0": {
          "market": 0.21
        },
        "1": {
          "market": 0.31
        },
        "2": {
          "market": 0.34
        },
        "3": {
          "market": 0.88
        },
        "4": {
          "market": 2.43
        }
      },
      "stattrak": {
        "0": {
          "market": 0.75
        },
        "1": {
          "market": 0.79
        },
        "2": {
          "market": 0.8
        },
        "3": {
          "market": 1.89
        },
        "4": {
          "market": 9.88
        }
      },
      "souvenir": {}
    }
  },
  "784": {
    "item_id": 784,
    "type": "P250",
    "skinName": "Pearl",
    "prices": {
      "default": {
        "2": {
          "market": 0.41
        },
        "3": {
          "market": 0.45
        },
        "4": {
          "market": 0.54
        }
      },
      "stattrak": {
        "2": {
          "market": 0.92
        },
        "3": {
          "market": 1.01
        },
        "4": {
          "market": 1.38
        }
      },
      "souvenir": {}
    }
  },
  "785": {
    "item_id": 785,
    "type": "P2000",
    "skinName": "Discord",
    "prices": {
      "default": {
        "0": {
          "market": 0.15
        },
        "1": {
          "market": 0.17
        },
        "2": {
          "market": 0.18
        },
        "3": {
          "market": 0.21
        },
        "4": {
          "market": 0.38
        }
      },
      "stattrak": {
        "0": {
          "market": 0.4
        },
        "1": {
          "market": 0.47
        },
        "2": {
          "market": 0.58
        },
        "3": {
          "market": 0.62
        },
        "4": {
          "market": 1.82
        }
      },
      "souvenir": {}
    }
  },
  "786": {
    "item_id": 786,
    "type": "★ Moto Gloves",
    "skinName": "Spearmint",
    "prices": {
      "default": {
        "0": {
          "market": 135.87
        },
        "2": {
          "market": 244.34
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "787": {
    "item_id": 787,
    "type": "★ Hand Wraps",
    "skinName": "Slaughter",
    "prices": {
      "default": {
        "0": {
          "market": 149
        },
        "1": {
          "market": 191.75
        },
        "2": {
          "market": 177.6
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "788": {
    "item_id": 788,
    "type": "★ Driver Gloves",
    "skinName": "Crimson Weave",
    "prices": {
      "default": {
        "0": {
          "market": 236.57
        },
        "1": {
          "market": 254
        },
        "2": {
          "market": 286.05
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "789": {
    "item_id": 789,
    "type": "★ Specialist Gloves",
    "skinName": "Emerald Web",
    "prices": {
      "default": {
        "0": {
          "market": 174.49
        },
        "1": {
          "market": 203.73
        },
        "2": {
          "market": 236.96
        },
        "3": {
          "market": 359.54
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "790": {
    "item_id": 790,
    "type": "★ Hand Wraps",
    "skinName": "Badlands",
    "prices": {
      "default": {
        "0": {
          "market": 116.84
        },
        "1": {
          "market": 143.33
        },
        "2": {
          "market": 133.79
        },
        "3": {
          "market": 238.63
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "791": {
    "item_id": 791,
    "type": "★ Sport Gloves",
    "skinName": "Hedge Maze",
    "prices": {
      "default": {
        "0": {
          "market": 139.75
        },
        "1": {
          "market": 192.67
        },
        "2": {
          "market": 231.82
        },
        "3": {
          "market": 353.3
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "792": {
    "item_id": 792,
    "type": "★ Driver Gloves",
    "skinName": "Diamondback",
    "prices": {
      "default": {
        "0": {
          "market": 128.99
        },
        "1": {
          "market": 140
        },
        "2": {
          "market": 123.92
        },
        "3": {
          "market": 170.94
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "793": {
    "item_id": 793,
    "type": "★ Sport Gloves",
    "skinName": "Arid",
    "prices": {
      "default": {
        "0": {
          "market": 94.3
        },
        "1": {
          "market": 171.97
        },
        "2": {
          "market": 115.37
        },
        "3": {
          "market": 199.8
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "794": {
    "item_id": 794,
    "type": "★ Driver Gloves",
    "skinName": "Convoy",
    "prices": {
      "default": {
        "0": {
          "market": 100.87
        },
        "1": {
          "market": 99.01
        },
        "2": {
          "market": 109.06
        },
        "3": {
          "market": 182.39
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "795": {
    "item_id": 795,
    "type": "★ Moto Gloves",
    "skinName": "Boom!",
    "prices": {
      "default": {
        "0": {
          "market": 120.59
        },
        "1": {
          "market": 145.91
        },
        "2": {
          "market": 184.36
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "796": {
    "item_id": 796,
    "type": "★ Sport Gloves",
    "skinName": "Superconductor",
    "prices": {
      "default": {
        "0": {
          "market": 150
        },
        "2": {
          "market": 230.65
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "797": {
    "item_id": 797,
    "type": "AK-47",
    "skinName": "Ganesha",
    "prices": {
      "default": {
        "4": {
          "market": 4314
        },
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "798": {
    "item_id": 798,
    "type": "P250",
    "skinName": "Ripple",
    "prices": {
      "default": {
        "0": {
          "market": 3.42
        },
        "1": {
          "market": 2.43
        },
        "2": {
          "market": 2.54
        },
        "3": {
          "market": 4.27
        },
        "4": {
          "market": 11.50
        }
      },
      "stattrak": {
          "0": {
          "market": 1.7
        },
        "1": {
          "market":1.5
        },
        "2": {
          "market": 1.15
        },
        "3": {
          "market": 1.5
        },
        "4": {
          "market": 1.57
        }
      },
      "souvenir": {}
    }
  },
  "799": {
    "item_id": 799,
    "type": "Sawed-Off",
    "skinName": "Zander",
    "prices": {
      "default": {
        "0": {
          "market": 0.69
        },
        "1": {
          "market": 0.98
        },
        "2": {
          "market": 0.7
        },
        "3": {
          "market": 1.7
        },
        "4": {
          "market": 5.75
        }
      },
      "stattrak": {
          "0": {
          "market": 1.24
        },
        "1": {
          "market": 11
        },
        "2": {
          "market": 2.23
        },
        "3": {
          "market": 5
        }
      },
      "souvenir": {}
    }
  },
  "799": {
    "item_id": 799,
    "type": "Sawed-Off",
    "skinName": "Zander",
    "prices": {
      "default": {
        "0": {
          "market": 0.69
        },
        "1": {
          "market": 0.98
        },
        "2": {
          "market": 0.7
        },
        "3": {
          "market": 1.7
        },
        "4": {
          "market": 5.75
        }
      },
      "stattrak": {
          "0": {
          "market": 1.24
        },
        "1": {
          "market": 11
        },
        "2": {
          "market": 2.23
        },
        "3": {
          "market": 5
        }
      },
      "souvenir": {}
    }
  },
  "800": {
    "item_id": 800,
    "type": "MP7",
    "skinName": "Akoben",
    "prices": {
      "default": {
        "0": {
          "market": 0.96
        },
        "1": {
          "market": 2.87
        },
        "2": {
          "market": 0.88
        },
        "3": {
          "market": 1.18
        },
        "4": {
          "market": 2.2
        }
      },
      "stattrak": {
          "0": {
          "market": 3
        },
        "1": {
          "market": 6.99
        },
        "2": {
          "market": 2.5
        },
        "3": {
          "market": 3.41
        },
        "4": {
          "market": 12
        }
      },
      "souvenir": {}
    }
  },
  "801": {
    "item_id": 801,
    "type": "PP-Bizon",
    "skinName": "Jungle Slipstream",
    "prices": {
      "default": {
        "0": {
          "market": 1.5
        },
        "1": {
          "market": 12.11
        },
        "2": {
          "market": 1.23
        },
        "3": {
          "market": 1.01
        },
        "4": {
          "market": 1
        }
      },
      "stattrak": {
          "0": {
          "market": 0.5
        },
        "1": {
          "market": 9.2
        },
        "2": {
          "market": 3.86
        },
        "3": {
          "market": 6.36
        },
        "4": {
          "market": 5
        }
      },
      "souvenir": {}
    }
  },
  "802": {
    "item_id": 802,
    "type": "SCAR-20",
    "skinName": "Blueprint",
    "prices": {
      "default": {
        "0": {
          "market": 1.01
        },
        "1": {
          "market": 1.74
        },
        "2": {
          "market": 1
        },
        "3": {
          "market": 1
        },
        "4": {
          "market": 4
        }
      },
      "stattrak": {
          "0": {
          "market": 2.87
        },
        "1": {
          "market": 35
        },
        "2": {
          "market": 3
        },
        "3": {
          "market": 3.75
        },
        "4": {
          "market": 29.74
        }
      },
      "souvenir": {}
    }
  },
  "803": {
    "item_id": 803,
    "type": "Five-SeveN",
    "skinName": "Capillary",
    "prices": {
      "default": {
        "0": {
          "market": 1.79
        },
        "1": {
          "market": 2.99
        },
        "2": {
          "market": 2.33
        },
        "3": {
          "market": 4.5
        },
        "4": {
          "market": 8.02
        }
      },
      "stattrak": {
          "0": {
          "market": 8
        },
        "2": {
          "market": 18
        },
        "3": {
          "market": 14.85
        },
        "4": {
          "market": 89.89
        }
      },
      "souvenir": {}
    }
  },
  "804": {
    "item_id": 804,
    "type": "Desert Eagle",
    "skinName": "Oxide Blaze",
    "prices": {
      "default": {
        "0": {
          "market": 6.1
        },
        "1": {
          "market": 4
        },
        "2": {
          "market": 3.87
        },
        "3": {
          "market": 9.2
        },
        "4": {
          "market": 11.5
        }
      },
      "stattrak": {
          "0": {
          "market": 28.75
        },
        "1": {
          "market": 45
        },
          "2": {
          "market": 11
        },
        "3": {
          "market": 19.5
        },
        "4": {
          "market": 33
        }
      },
      "souvenir": {}
    }
  },
  "805": {
    "item_id": 805,
    "type": "MAC-10",
    "skinName": "Last Dive",
    "prices": {
      "default": {
        "0": {
          "market": 9.93
        },
        "1": {
          "market": 10
        },
        "2": {
          "market": 5.25
        },
        "3": {
          "market": 6
        },
        "4": {
          "market": 7.51
        }
      },
      "stattrak": {
          "2": {
          "market": 11.99
        },
        "3": {
          "market": 29.74
        },
        "4": {
          "market": 19
        }
      },
      "souvenir": {}
    }
  },
  "806": {
    "item_id": 806,
    "type": "UMP-45",
    "skinName": "Scaffold",
    "prices": {
      "default": {
        "0": {
          "market": 5.17
        },
        "1": {
          "market": 5.2
        },
        "2": {
          "market": 7.49
        },
        "3": {
          "market": 8.48
        },
        "4": {
          "market": 22.01
        }
      },
      "stattrak": {
        "1": {
          "market": 18.49
        },
        "2": {
          "market": 19.97
        },
        "3": {
          "market": 28.75
        }
      },
      "souvenir": {}
    }
  },
  "807": {
    "item_id": 807,
    "type": "XM1014",
    "skinName": "Seasons",
    "prices": {
      "default": {
        "0": {
          "market": 8.19
        },
        "1": {
          "market": 13
        },
        "2": {
          "market": 6.6
        },
        "3": {
          "market": 7.25
        },
        "4": {
          "market": 6.38
        }
      },
      "stattrak": {
        "0": {
          "market": 26.26
        },
        "2": {
          "market": 12
        },
        "3": {
          "market": 25
        },
        "4": {
          "market": 53.05
        }
      },
      "souvenir": {}
    }
  },
  "808": {
    "item_id": 808,
    "type": "M249",
    "skinName": "Emerald Poison Dart",
    "prices": {
      "default": {
        "1": {
          "market": 46
        },
        "2": {
          "market": 4.1
        },
        "3": {
          "market": 7.99
        },
        "4": {
          "market": 6.21
        }
      },
      "stattrak": {
        "2": {
          "market": 5
        },
        "3": {
          "market": 24.35
        },
        "4": {
          "market": 39.99
        }
      },
      "souvenir": {}
    }
  },
  "809": {
    "item_id": 809,
    "type": "Galil AR",
    "skinName": "Crimson Tsunami",
    "prices": {
      "default": {
        "0": {
          "market": 3.99
        },
        "1": {
          "market": 10
        },
        "2": {
          "market": 4.02
        },
        "3": {
          "market": 3.45
        },
        "4": {
          "market": 6.96
        }
      },
      "stattrak": {
        "0": {
          "market": 28.75
        },
        "2": {
          "market": 10.26
        },
        "3": {
          "market": 256.53
        },
        "4": {
          "market": 149
        }
      },
      "souvenir": {}
    }
  },
  "810": {
    "item_id": 810,
    "type": "CZ75-Auto",
    "skinName": "Xiangliu",
    "prices": {
      "default": {
        "0": {
          "market": 61
        },
        "1": {
          "market": 25
        },
        "2": {
          "market": 13.8
        },
        "3": {
          "market": 17.25
        },
        "4": {
          "market": 23
        }
      },
      "stattrak": {
        "0": {
          "market": 225
        },
        "2": {
          "market": 39.99
        },
        "4": {
          "market": 50
        }
      },
      "souvenir": {}
    }
  },
  "811": {
    "item_id": 811,
    "type": "AWP",
    "skinName": "Fever Dream",
    "prices": {
      "default": {
        "0": {
          "market": 34
        },
        "1": {
          "market": 43.99
        },
        "2": {
          "market": 50
        },
        "3": {
          "market": 66.85
        },
        "4": {
          "market": 85.99
        }
      },
      "stattrak": {
        "2": {
          "market": 150
        },
        "4": {
          "market": 400
        }
      },
      "souvenir": {}
    }
  },
  "812": {
    "item_id": 812,
    "type": "M4A1-S",
    "skinName": "Decimator",
    "prices": {
      "default": {
        "0": {
          "market": 35.35
        },
        "1": {
          "market": 80
        },
        "2": {
          "market": 47
        },
        "3": {
          "market": 70
        },
        "4": {
          "market": 159.32
        }
      },
      "stattrak": {
        "1": {
          "market": 396.75
        },
        "3": {
          "market": 260.26
        }
      },
      "souvenir": {}
    }
  },
  "813": {
    "item_id": 813,
    "type": "AK-47",
    "skinName": "Bloodsport",
    "prices": {
      "default": {
        "2": {
          "market": 115.86
        },
        "3": {
          "market": 210
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  },
  "814": {
    "item_id": 814,
    "type": "USP-S",
    "skinName": "Neo-Noir",
    "prices": {
      "default": {
        "0": {
          "market": 39.99
        },
        "1": {
          "market": 161
        },
        "2": {
          "market": 152
        },
        "3": {
          "market": 177.1
        },
        "4": {
          "market": 363.42
        }
      },
      "stattrak": {},
      "souvenir": {}
    }
  }
}