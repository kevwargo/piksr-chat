var API_ENDPOINT = 'https://380fj5krja.execute-api.eu-central-1.amazonaws.com/prod/kev_func_2';


function handleError(jqXHR) {
    if (jqXHR.responseJSON) {
        var e = jqXHR.responseJSON;
        $('#error').text(e.exception + '\n' + e.message + '\n' + e.stacktrace);
    } else {
        $('#error').text(jqXHR.responseText);
    }
}

function dateFormat(date) {
    var result = date.getFullYear() + '-'
        + (date.getMonth() + 1) + '-'
        + date.getDate() + ' '
        + date.getHours() + ':'
        + date.getMinutes() + ':'
        + date.getSeconds();
    return result;
}

function loadMessages($channelPanel, loadState) {
    var $messagesContainer = $channelPanel.find('.messages-container');
    $.ajax({
        url: API_ENDPOINT,
        data: {
            channel: $channelPanel.data('channel'),
            timestamp: $messagesContainer.find('.message:last-child').data('timestamp') || 0
        },
        success: function(data) {
            for (var i in data) {
                var $message = $('#templates .message').clone();
                $message.data('timestamp', data[i].timestamp);
                $message.find('.date-time').text(dateFormat(new Date(data[i].timestamp)));
                $message.find('.user-name').text(data[i].user);
                $message.find('.message-text').text(data[i].message);
                $messagesContainer.append($message);
            }
            loadState.timeout = setTimeout(function() {
                loadMessages($channelPanel, loadState);
            }, 1000);
        },
        error: handleError
    });
}


function sendMessage(channel, user, message) {
    $.ajax({
        url: API_ENDPOINT,
        method: 'POST',
        data: JSON.stringify({
            user: user,
            message: message,
            channel: channel
        }),
        contentType: 'application/json',
        error: handleError
    });
}

function initApi() {
    renderjson.set_show_to_level('all');
}
