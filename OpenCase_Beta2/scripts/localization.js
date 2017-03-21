
$(function() {
    var category = $(document.body).data('localization');

    //$.ajaxSetup({cache: true});
    
    $.getScript("../scripts/localization/" + Settings.language + ".js", function(translation, status) {
        console.log('Script loading status:', status);
        Localization.isLoaded = true;
        $(document).trigger('localizationloaded');
        Localization.localizate(category);
    })
})
var Localization = (function (module) {
    'use strict';
    
    module = module || {};
    module.isLoaded = false;
    
    module.supportedLanguages = {
        names: {
            short: ['RU', 'EN', 'FR', 'PL', 'TR'],
            full: ['Русский', 'English', 'Français', 'Polski', 'Türkçe']
        },
        skinNames: {
            arr: ['RU', 'EN'],
            regExp: /(ru|en)/i
        },
        quality: {
            arr: ['RU', 'EN'],
            regExp: /(ru|en)/i
        },
        updates: {
            arr: ['RU', 'EN'],
            regExp: /(ru|en)/i
        }
    }
    
    module.isSupport = function(cat) {
        var category = module.supportedLanguages[cat];
        if (!category) return false;
        
        if (category.regExp) {
            return category.regExp.test(Settings.language);
        }
        
    }
    
    module.changeLanguage = function(lang) {
        lang = lang || 'EN';
        var category = $(document.body).data('localization');
        $.getScript("../scripts/localization/" + lang + ".js", function(translation, status) {
            Localization.isLoaded = true;
            $(document).trigger('localizationloaded');
            Localization.localizate(category);
        })
    }
    
    module.localizate = function(page) {
        var alwaysLoc = ['menu'];
        console.log('Start localization');
        
        for(var i = 0; i < alwaysLoc.length; i++) {
            _localization_start(Translation.translation[alwaysLoc[i]]);
        }
        
        var loc = Translation.translation[page];

        if (!loc) {
            console.log('No localization');
        } else {
            _localization_start(loc);
        }
        
        $(document).trigger('localizationfinished');
    }

    function _localization_start(sectionTr) {
        locBlock(sectionTr);    

        function locBlock(block, parent) {
            parent = parent || document;
            if (!block) return false;
            var keys = Object.keys(block);

            for(var i = 0; i < keys.length; i++) {
                if (block[keys[i]].text) {
                    var $element = $(parent).find('[data-loc="' + keys[i] + '"]');
                    if (!$element || $element.length === 0) continue;
                    for (var z = 0; z < $element.length; z++)
                        locElement($element[z], block[keys[i]].text);
                } else {
                    var $parent = $('[data-loc-group="' + keys[i] + '"]');
                    if ($parent && $parent.length) {
                        for (var z = 0; z < $parent.length; z++)
                            locBlock(block[keys[i]], $($parent)[z]);
                    } else {
                        for (var key in block[keys[i]]) {
                            if (key.indexOf('$') != -1) {
                                var $element = $(parent).find('[data-loc="' + keys[i] + '"]');
                                if (!$element || $element.length === 0) continue;
                                for (var z = 0; z < $element.length; z++)
                                    locElement($element[z], block[keys[i]][key].text, key.replace('$', ''));
                            }
                        }
                    }
                }
            }
        }

        function locElement($element, tr, attr) {
            var varTest = /\$\{\d+\}/gi;
            if (varTest.test(tr) && $($element).data('loc-var')) {
                var vars = $($element).data('loc-var');
                for (var i = 1; i < Object.keys(vars).length+1; i++) {
                    var rg = new RegExp('(\\$\\{' + i + '\\})', 'g');
                    tr = tr.replace(rg, vars[i]);
                }
            }
            if (!attr) {
                $($element).html(tr);
            } else {
                $($element).attr(attr, tr);
            }
        }
    }
    
    module.getString = function(path, defaultText, original) {
        defaultText = defaultText || null;
        original = original || false;
        try{
            var paths = path.split('.'),
                current = Translation.translation,
                i;
            for (i = 0; i < paths.length; ++i) {
                if (current[paths[i]] == undefined) {
                    return '';
                } else {
                    current = current[paths[i]];
                }
            }
            if (typeof current == 'object' && current.text)
                current = original ? current.en : current.text
            return current;
        } catch (e) {
            if (defaultText)
                return defaultText
        }
    }
    
    return module;
}(Localization || {}));


function localizate_old(category) {
    var lng = Settings.language;
    if (category != 'none') {
        var currCat = Localization[category];
        for (var i = 0; i < currCat.length; i++) {
            var currItem = currCat[i];
            for (var key in currItem) {
                if(/^localization/i.test(key) && typeof currItem[key][lng] != 'undefined') {
                    $(currItem.selector).html(currItem.localization[lng]);
                } else if(/^attr\(.*?\)/i.test(key) && typeof currItem[key][lng] != 'undefined') {
                    var attr = key.match(/attr\((.*?)\)/)[1];
                    $(currItem.selector).attr(attr, (currItem[key][lng]));
                }
            }
        }
    }
    for (var i = 0; i < Localization['menu'].length; i++) {
        if (typeof Localization['menu'][i].localization[Settings.language] != 'undefined')
            $(Localization['menu'][i].selector).html(Localization['menu'][i].localization[Settings.language]);
    }
    try {
        checkInventoryForNotification()
    } catch (e) {
        //ERROR
    }
    if ($('.js-var').length)
        $('.js-var').each(function() {
            vr = $(this).data('var');
            $(this).html(eval(vr));
        });
}