(function ($) {
    $.gradientText = $.gradientText || {version: '1.0'};
    
    $.gradientText.conf = {
		colors: ['#5f3db6', '#c10000']
	};

	$.gradientTextSetup = function(conf) {
		$.extend($.gradientText.conf, conf);
	};

    $.fn.gradientText = function(conf) {
        var color_from = $.gradientText.conf.colors[0];
        var color_to = $.gradientText.conf.colors[1];

        if (conf) {
            if (typeof conf.colors !== 'undefined') {
                color_from = conf.colors[0];
                color_to = conf.colors[1];
            }
        }

        var color_from_r = convert16to10(color_from[1]) * 16 + convert16to10(color_from[2])
            , color_from_g = convert16to10(color_from[3]) * 16 + convert16to10(color_from[4])
            , color_from_b = convert16to10(color_from[5]) * 16 + convert16to10(color_from[6])
            , color_to_r = convert16to10(color_to[1]) * 16 + convert16to10(color_to[2])
            , color_to_g = convert16to10(color_to[3]) * 16 + convert16to10(color_to[4])
            , color_to_b = convert16to10(color_to[5]) * 16 + convert16to10(color_to[6])
            , delta_r = color_to_r - color_from_r
            , delta_g = color_to_g - color_from_g
            , delta_b = color_to_b - color_from_b;

        this.each(function () {
            var field = $(this);
            var string = field.text();
            var len = string.length;
            var stringResult = '';
            for (var i = 0; i <= len - 1; i++) {
                var color_now_r = (color_from_r + delta_r / len * i).toFixed(0)
                    , color_now_g = (color_from_g + delta_g / len * i).toFixed(0)
                    , color_now_b = (color_from_b + delta_b / len * i).toFixed(0)
                    , color_now = '#' + convert10to16(Math.floor(color_now_r / 16)) + convert10to16(color_now_r % 16) + convert10to16(Math.floor(color_now_g / 16)) + convert10to16(color_now_g % 16) + convert10to16(Math.floor(color_now_b / 16)) + convert10to16(color_now_b % 16);
                stringResult += '<span style="color: ' + color_now + ';">' + string[i] + '</span>';
                field.html(stringResult);
            }
        });
    }
        
    // Перевод из 16-ной в 10-ную
    function convert16to10(number) {
        var result = 0;
        if (number <= 9 && number >= 0) {
            result = number;
        }
        else if (number == "A" || number == "a") {
            result = 10;
        }
        else if (number == "B" || number == "b") {
            result = 11;
        }
        else if (number == "C" || number == "c") {
            result = 12;
        }
        else if (number == "D" || number == "d") {
            result = 13;
        }
        else if (number == "E" || number == "e") {
            result = 14;
        }
        else if (number == "F" || number == "f") {
            result = 15;
        }
        return parseInt(result);
    }
    // Перевод из 10-ной в 16-ную
    function convert10to16(number) {
        var result = '0';
        if (number <= 9 && number >= 0) {
            result = number.toString();
        }
        else if (number == 10) {
            result = "A";
        }
        else if (number == 11) {
            result = "B";
        }
        else if (number == 12) {
            result = "C";
        }
        else if (number == 13) {
            result = "D";
        }
        else if (number == 14) {
            result = "E";
        }
        else if (number == 15) {
            result = "F";
        }
        return result;
    }
})(jQuery);