var bot, message;
var URL = "http://localhost:4200";
var socket = io.connect(URL);

socket.on('connect', function(data) {
    socket.emit('join', 'Hello World from client');
});

socket.on('bot:status', function(data) {
    if(data == "loading") {
        $(".control").children().attr('disabled', true);
    } else {
        $(".control").children().attr('disabled', false);
    }
});

socket.on('bot:response', function(data) {
    $('#result')
        .text(data);
});

function next(selector) {
    $(selector)
        .parent()
        .children()
        .hide()
    $(selector)
        .next()
        .show()
}

function init(selector) {
    $(selector)
        .children()
        .hide()
    $(selector)
        .children()
        .first()
        .show()
}

init(".control")

$('.control #init')
    .click(function(e) {
        next(this)
        socket.emit('bot:action', 'INIT');
    });

$('.control #type')
    .click(function(e) {
        next(this)
        socket.emit('bot:action', 'TYPE');
    });

$('.control #click')
    .click(function(e) {
        next(this)
        socket.emit('bot:action', 'CLICK');
    });

$('.control #getinfo')
    .click(function(e) {
        next(this)
        socket.emit('bot:action', 'GETINFO');
    });

$('.control #end')
    .click(function(e) {
        init($(this)
            .parent())
        socket.emit('bot:action', 'END');
    });
