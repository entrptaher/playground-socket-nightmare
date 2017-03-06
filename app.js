let Nightmare = require('nightmare');
let nightmare;
let express = require('express');

const app = express();
const server = require('http')
    .createServer(app);
const io = require('socket.io')(server);
const PORT = 4200;

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(`${__dirname}/node_modules`));
app.get('/', (req, res, next) => {
    res.sendFile(`${__dirname}/index.html`);
});

let inputRoom = "bot:action";
let outputRoom = "bot:response";
let botStatusRoom = "bot:status";
let botStatus;

const dosomething = {
    INIT: () => {
        nightmare = Nightmare({
            show: true
        });
        io.emit(botStatusRoom, "loading")
        io.emit(outputRoom, "going to duckduckgo")
        nightmare.goto('https://duckduckgo.com')
            .then(() => {
                io.emit(botStatusRoom, "finished")
            })
    },
    TYPE: () => {
        io.emit(botStatusRoom, "loading")
        io.emit(outputRoom, "Typing something")
        nightmare.type('#search_form_input_homepage', 'github nightmare')
            .then(() => {
                io.emit(botStatusRoom, "finished")
            })
    },
    CLICK: () => {
        io.emit(botStatusRoom, "loading")
        io.emit(outputRoom, "STATUS: Loading Result Page")
        nightmare.click('#search_button_homepage')
            .wait('#zero_click_wrapper .c-info__title a')
            .then(() => {
                io.emit(botStatusRoom, "finished")
            })
    },
    GETINFO: () => {
        io.emit(botStatusRoom, "loading")
        io.emit(outputRoom, "STATUS: getting info")
        nightmare
            .evaluate(() => document.querySelector('#zero_click_wrapper .c-info__title a')
                .href)
            .then((result) => {
                io.emit(botStatusRoom, "finished")
                io.emit(outputRoom, `RESULT: ${result}`)
            })
            .catch((error) => {
                io.emit(botStatusRoom, "finished")
                io.emit(outputRoom, `RESULT: ${result}`)
            });
    },
    END: () => {
        io.emit(botStatusRoom, "loading")
        io.emit(outputRoom, "STATUS: Ending Bot")
        nightmare
            .end()
            .then(() => {
                io.emit(botStatusRoom, "finished")
                io.emit(outputRoom, `STATUS: BOT ENDED`)
            })
            .catch((error) => {
                io.emit(botStatusRoom, "finished")
                io.emit(outputRoom, `ERROR: ${error}`)
            });
    },
};

io.on('connection', client => {
    console.log('Client connected...');
    client.on('join', data => {
        console.log(data);
    });
    client.on(inputRoom, data => {
        dosomething[data]()
    });
});


server.listen(PORT);
console.log(`Monitoring server listening on port ${PORT}`);
