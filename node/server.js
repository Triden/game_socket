import WebSocket, { WebSocketServer } from 'ws';
import {v4 as uuid} from 'uuid';
import Utils from './modules/Utils.js';

const server = function(){
    const clients = {};
    const shapes = {};
    const oldShapes = {};
    const shots = {};
    let shotNum = 0;
    const r = 50;
    const wss = new WebSocketServer({port: 5554}); //wss - webSocket server

    wss.on('connection', (ws) => {
        const id   = uuid();
        const hash = uuid();
        clients[id] = {
            ws: ws
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
                    if(req.data.hash && (oldShapes[req.data.hash] !== undefined)){
                        shapes[id] = Object.assign({}, oldShapes[req.data.hash]);
                    } else {
                        shapes[id] = {
                            r: r,
                            color: `#${Math.random().toString(16).substr(-6)}`,
                            x: Utils.getRandomInt(0, 700),
                            y: Utils.getRandomInt(0, 500),
                            points: 0,
                            move: {}
                        };
                    }
                    clients[id].ws.send(JSON.stringify({
                        type: 'init', data: {
                            status: 'ok',
                            hash: hash
                        }
                    }));
                    break;
                case 'keyDown':
                    if(req.data && req.data.key){
                        shapes[id].move[req.data.key] = 1;
                    }
                    break;
                case 'keyUp':
                    if(req.data && req.data.key){
                        shapes[id].move[req.data.key] = 0;
                    }
                    break;

                case 'push':
                    if(req.data && req.data.x && req.data.y){

                        //f.x:=(Mxpos)/sqrt(sqr(Mxpos)+sqr(Mypos));
                        // f.y:=(Mypos)/sqrt(sqr(Mxpos)+sqr(Mypos));
                        let xRast = shapes[id].x - req.data.x;
                        let yRast = shapes[id].y - req.data.y;
                        if(xRast == 0 && yRast == 0){
                            return;
                        }
                        let rast = Math.sqrt(Math.pow(xRast, 2) + Math.pow(yRast, 2));
                        shots[++shotNum] = {
                            color: '#ff0000',
                            r: 5,
                            // x: req.data.x,
                            // y: req.data.y,
                            x: shapes[id].x - xRast / rast * 26,
                            y: shapes[id].y - yRast / rast * 26,
                            from: id,
                            step: {
                                x: xRast / rast * 10,
                                y: yRast / rast * 10
                            }
                        }
                    }
                    break;
                default:

            }
        });

        ws.on('close', () => {
            shapes[id].move = {};
            oldShapes[hash] = Object.assign({}, shapes[id]);
            delete clients[id];
            delete shapes[id];
            // console.log(`Client is closed ${id}`);
        });
    });

    process.on('SIGINT', () => {
        wss.close();
        process.exit();
    });

    function startTimer(){
        let time = Date.now();

        for (const id in shots) {
            shots[id].x -= shots[id].step.x;
            shots[id].y -= shots[id].step.y;

            if(shots[id].x > 800 || shots[id].x < 0 || shots[id].y > 600 || shots[id].y < 0){
                delete shots[id];
                continue;
            }
            for(const wid in shapes){
                if(Math.sqrt(Math.pow(shapes[wid].x - shots[id].x, 2) + Math.pow(shapes[wid].y - shots[id].y, 2)) < 25 ){
                    delete shots[id];
                    break;
                }
            }
        }

        for(const id in shapes){
            if(shapes[id].move.d){
                shapes[id].x += 3;
                if(shapes[id].x > 770){
                    shapes[id].x = 770;
                }
            }
            if(shapes[id].move.a){
                shapes[id].x -= 3;
                if(shapes[id].x < 0){
                    shapes[id].x = 0;
                }
            }
            if(shapes[id].move.s){
                shapes[id].y += 3;
                if(shapes[id].y > 570){
                    shapes[id].y = 570;
                }
            }
            if(shapes[id].move.w){
                shapes[id].y -= 3;
                if(shapes[id].y < 0){
                    shapes[id].y = 0;
                }
            }
        }

        for(const id in clients){
            clients[id].ws.send(JSON.stringify({
                type: 'move', data: {
                    shapes: shapes,
                    shots: shots
                }
            }));
        }

        setTimeout(startTimer, 33 - (Date.now() - time));
    }

    function init(){
        startTimer();
        console.log('запущен');
    }

    return {
        init: init
    }
}();
server.init();
