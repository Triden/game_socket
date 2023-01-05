import WebSocket, { WebSocketServer } from 'ws';
import {v4 as uuid} from 'uuid';
import Utils from './modules/Utils.js';

const server = function(){
    const clients = {};
    const oldClients = {};
    const wss = new WebSocketServer({port: 5554}); //wss - webSocket server

    wss.on('connection', (ws) => {
        const id = uuid();
        clients[id] = {
            ws: ws,
            shape: {}
        };

        ws.on('message', (rawMessage) => {
            var req;
            try {
                req = JSON.parse(rawMessage);
            } catch(e) {
                return;
            }

            switch (req.type) {
                case 'init':
                    if(req.data.hash && (oldClients[req.data.hash] !== undefined)){
                        clients[id].shape = Object.assign({}, oldClients[req.data.hash]);
                    } else {
                        clients[id].shape = {
                            r: 50,
                            color: `#${Math.random().toString(16).substr(-6)}`,
                            x: Utils.getRandomInt(0, 700),
                            y: Utils.getRandomInt(0, 500),
                            points: 0
                        };
                    }
                    clients[id].ws.send(JSON.stringify({
                        type: 'init', data: {
                            status: 'ok',
                            hash: id
                        }
                    }));
                    break;
                case 'move':
                    shapes[id].x = req.data.x;
                    shapes[id].y = req.data.y;
                    for(const id in clients){
                        clients[id].ws.send(JSON.stringify({type: 'move', data: shapes}));
                    }
                    break;
                default:

            }
        });

        ws.on('close', () => {
            oldClients[id] = clients[id].shape;
            delete clients[id];
            // delete shapes[id];
            console.log(`Client is closed ${id}`);
        });
    });

    process.on('SIGINT', () => {
        wss.close();
        process.exit();
    });

    function init(){
        console.log('запущен');
    }

    return {
        init: init
    }
}();
server.init();
