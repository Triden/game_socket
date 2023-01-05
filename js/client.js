const client = function(){
    let place = document.querySelector('#place');
    let isReady = false;
    let ws;
    let coorM = {x: 0, y: 0};
    let keys = {a: 0, s: 0, d: 0, w: 0};
    let shapes = {};
    let shots = {};

    document.addEventListener('keydown', (ev) => {
        let key = ev.key;
        if(key == 'ф'){
            key = 'a';
        }
        if(key == 'ы'){
            key = 's';
        }
        if(key == 'в'){
            key = 'd';
        }
        if(key == 'ц'){
            key = 'w';
        }
        if(isReady && keys[key] == 0){
            keys[key] = 1;
            ws.send(JSON.stringify({
                type: 'keyDown',
                data: {key: key}
            }));
        }
    });

    document.addEventListener('keyup', (ev) => {
        let key = ev.key;
        if(key == 'ф'){
            key = 'a';
        }
        if(key == 'ы'){
            key = 's';
        }
        if(key == 'в'){
            key = 'd';
        }
        if(key == 'ц'){
            key = 'w';
        }

        if(isReady && keys[key] == 1){
            keys[key] = 0;
            ws.send(JSON.stringify({
                type: 'keyUp',
                data: {key: key}
            }));
        }
    });

    place.addEventListener('mousedown', (e) => {

        ws.send(JSON.stringify({
            type: 'push',
            data: {
                x: e.clientX,
                y: e.clientY
            }
        }));
    });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        return parts.length === 2? parts.pop().split(';').shift(): null;
    }

    function start(){
        let hash = getCookie('hash');
        ws.send(JSON.stringify({
            type: 'init', data: {hash: hash}
        }));
    }

    function init(){
        ws = new WebSocket("wss://game.randomup.ru/ws/");

        ws.onerror = function(error) {
          console.log(error);
        };
        ws.onmessage = (message) => {
            const req = JSON.parse(message.data);
            switch (req.type){
                case 'init':
                    if(req.data.status == 'ok'){
                        isReady = true;
                    }
                    break;
                case 'move':
                    for(const id in shapes){
                        if(!req.data.shapes[id]){
                            delete shapes[id];
                            const el = document.getElementById(id);
                            if(el){
                                el.remove();
                            }
                        }
                    }

                    for(const id in shots){
                        if(!req.data.shots[id]){
                            delete shots[id];
                            const el = document.getElementById(id);
                            if(el){
                                el.remove();
                            }
                        }
                    }

                    for(const id in req.data.shots){
                        // console.log(val);
                        if(shots[id]){
                            const el = document.getElementById(id);
                            if(!el){
                                delete shots[id];
                                continue;
                            }
                            el.style.left = `${req.data.shots[id].x - Math.round(req.data.shots[id].r / 2)}px`;
                            el.style.top  = `${req.data.shots[id].y - Math.round(req.data.shots[id].r / 2)}px`;
                        } else {
                            shots[id] = 1;
                            place.insertAdjacentHTML('beforeend', `<div id="${id}" style="position: absolute; background-color: ${req.data.shots[id].color}; height: ${req.data.shots[id].r}px; width: ${req.data.shots[id].r}px; border-radius: 100%; top: ${req.data.shots[id].y - Math.round(req.data.shots[id].r / 2)}px; left: ${req.data.shots[id].x - Math.round(req.data.shots[id].r / 2)}px;"></div>`);
                        }
                    }

                    for(const id in req.data.shapes){
                        // console.log(val);
                        if(shapes[id]){
                            const el = document.getElementById(id);
                            if(!el){
                                delete shapes[id];
                                continue;
                            }
                            el.style.left = `${req.data.shapes[id].x - Math.round(req.data.shapes[id].r / 2)}px`;
                            el.style.top  = `${req.data.shapes[id].y - Math.round(req.data.shapes[id].r / 2)}px`;
                        } else {
                            shapes[id] = 1;
                            place.insertAdjacentHTML('beforeend', `<div id="${id}" style="position: absolute; background-color: ${req.data.shapes[id].color}; height: ${req.data.shapes[id].r}px; width: ${req.data.shapes[id].r}px; border-radius: 100%; top: ${req.data.shapes[id].y - Math.round(req.data.shapes[id].r / 2)}px; left: ${req.data.shapes[id].x - Math.round(req.data.shapes[id].r / 2)}px;"></div>`);
                        }
                    }
                    break;
            }
        }
        ws.onopen = () => {
            start();
        };
        ws.onclose = () => {
            isReady = false;
        };

    }

    return {
        init: init
    }
}();

client.init();
