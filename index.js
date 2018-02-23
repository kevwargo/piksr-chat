$(function() {
    var state = {
        user: null
    };

    $('#user-dialog').dialog({
        autoOpen: true,
        modal: true,
        title: 'Choose username',
        buttons: {
            'OK': function() {
                var $this = $(this),
                    user = $this.find('input').val();
                if (user) {
                    state.user = user;
                    initApi();
                    initChannels(state);
                    $this.dialog('close');
                }
            }
        }
    });

});
