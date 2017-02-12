var onlineGames = (function(module) {
    module = module || {};
    module.onlineCount = function(online) {
        $('.onlineCount').text(online);
    }

    module.chatMessage = function(message, opt) {
        opt = opt || {}
        opt.selector = opt.selector || '.chat__messages';
        opt.increaseCounter = typeof opt.increaseCounter !== 'undefined' ? opt.increaseCounter === true : true;
        
        var msgType = typeof message.specialType != 'undefined' ? message.specialType : ''; 
        message.from = fbProfile.XSSreplace(message.from);
        message.message = fbProfile.XSSreplace(message.message);
        $(opt.selector).append('<li class="text-'+msgType+'"><span class="text-warning">'+message.from+'</span>: <span class="message__text">'+message.message+'</span></li>');

        $(opt.selector).scrollTop($(opt.selector)[0].scrollHeight);

        if (!$('.chat-panel .panel-collapse').hasClass('in') && opt.increaseCounter) {
            $('.chat_new_messages_count').text(parseInt($('.chat_new_messages_count').text())+1);
        }
    }
    
    $(document).on('click', '.chat-panel', function() {
        $('.chat_new_messages_count').text(0);
    })

    $(document).on('click', '#chat-send-msg', function() {
        var message = $('.chat__new-message__textbox').val() || $('.chat__new-message__textbox').text();

        if (message.length == 0) return null;
        if (message.length > $('.chat__new-message__textbox').attr("max"))
            message = message.substring(0, $('.chat__new-message__textbox').attr("max"));
        $('.chat__new-message__textbox').empty();
        $('.chat__new-message__textbox').val('');
        
        $(document).trigger('send_chat_msg', [message]);
    })
    
    $(document).on('send_chat_msg', function(event, message) {
        try {
            //var message = event.msg;
            var msgObj = {
                type: 'message',
                from: Player.nickname,
                message: message
            }

            socket.send(JSON.stringify(msgObj));
        } catch (e) {
            console.log('can\'t send msg');
        }
    }) 
    
    return module;
})(onlineGames || {});