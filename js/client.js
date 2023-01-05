const client = function(){
    // let place = document.querySelector('#place');
    let isReady = false;
    let ws;

    document.addEventListener('keydown', (ev) => {
        console.log(ev);
        if(isReady){

        }
    });

    document.addEventListener('keyup', (ev) => {
        console.log(ev);
        if(isReady){

        }
    });

    place.addEventListener('mousemove', (e) => {
        // console.log(e);
        if(isReady){
            ws.send(JSON.stringify({
                type: 'move',
                data: {x: e.clientX, y: e.clientY}
            }));
        }
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
                    //shape = req.data;
                    if(req.data == 'ok'){
                        isReady = true;
                    }
                    break;
                case 'move':
                    place.innerText = '';
                    for(const id in req.data){
                        //console.log(val);
                        place.insertAdjacentHTML('beforeend', `<div style="position: absolute; background-color: ${req.data[id].color}; height: ${req.data[id].r}px; width: ${req.data[id].r}px; border-radius: 100%; top: ${req.data[id].y - Math.round(req.data[id].r / 2)}px; left: ${req.data[id].x - Math.round(req.data[id].r / 2)}px;"></div>`);
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
