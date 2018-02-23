function joinChannel($channels, channel) {
    var panelId = 'channel-' + channel + '-panel',
        $panel = $channels.find('#' + panelId);
    if ($panel.length === 0) {
        var $newPanel = $('#templates .channel-panel').clone(),
            $newTab = $('#templates .channel-tab').clone();
        $newPanel.attr('id', panelId);
        $newTab.find('a').attr('href', '#' + panelId).text(channel);
        $channels.append($newPanel);
        $('#channels-tabs').append($newTab);
        $channels.tabs('refresh');
        $newPanel.data('channel', channel);
    }
    $channels.find('.channel-panel').each(function(i) {
        if ($(this).attr('id') == panelId) {
            $channels.tabs('option', 'active', i);
        }
    });
}

function initChannels(state) {
    var $dialog = $('#join-channel-dialog'),
        $joinButton = $('#join-button'),
        $channels = $('#channels'),
        loadState = {
            timeout: null
        };
    
    $dialog.dialog({
        autoOpen: false,
        buttons: {
            'Join': function() {
                joinChannel($channels, $(this).find('input').val());
                $(this).dialog('close');
            }
        }
    });
    $channels.tabs({
        activate: function(event, ui) {
            if (loadState.timeout) {
                clearInterval(loadState.timeout);
            }
            loadState.timeout = setTimeout(function() {
                loadMessages(ui.newPanel, loadState);
            }, 1000);
        }
    });
    $joinButton.click(function () {
        $dialog.dialog('open');
    });
    $channels.on('click', '.channel-panel .send-button', function() {
        var $this = $(this),
            channel = $this.parents('.channel-panel').data('channel'),
            user = state.user,
            $messageInput = $this.siblings('.message-input'),
            message = $messageInput.val();
        $messageInput.val('');
        if (message) {
            sendMessage(channel, user, message);
        }
    });
}
