import WebSocket, { WebSocketServer } from 'ws';
import {v4 as uuid} from "uuid";
const clients = {};
const shapes = {};

const wss = new WebSocketServer({port: 5554});
console.log('Запущен');
wss.on('connection', (ws) => {
    const id = uuid();
    clients[id] = ws;

    console.log(`New client ${id}`);

    ws.on('message', (rawMessage) => {
        const req = JSON.parse(rawMessage);

        switch (req.type) {
            case 'init':
                const r = getRandomInt(30, 100);
                const color = `#${Math.random().toString(16).substr(-6)}`;
                shapes[id] = {r, color, x: 0, y: 0};
                clients[id].send(JSON.stringify({type: 'init', data: 'ok'}));
                break;
            case 'move':
                shapes[id].x = req.data.x;
                shapes[id].y = req.data.y;
                for(const id in clients){
                    clients[id].send(JSON.stringify({type: 'move', data: shapes}));
                }
                break;
            default:

        }
    });

    ws.on('close', () => {
        delete clients[id];
        delete shapes[id];
        console.log(`Client is closed ${id}`);
    });
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + +min;
}

process.on('SIGINT', () => {
    wss.close();
    process.exit();
});
