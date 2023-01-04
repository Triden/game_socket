<!DOCTYPE html>
<html lang="en" dir="ltr" style="height: 100%; margin: 0px;">
    <head>
        <meta charset="utf-8">
        <title></title>
    </head>
    <body style="height: 100%; margin: 0px;">
        <div style="border: 1px solid; height: 99%;" id="place">

        </div>
        <script type="text/javascript">
            place = document.querySelector('#place');

            //const shape = {r: 0, color: '#000000', x: 0, y: 0};
            const ws = new WebSocket("ws://dev2.randomup.ru:5555");
            let isLoad = false;

            ws.onopen = () => {
                init();
            };
            place.addEventListener('mousemove', (e) => {
                console.log(e);
                if(isLoad){
                    ws.send(JSON.stringify({
                        type: 'move',
                        data: {x: e.clientX, y: e.clientY}
                    }));
                }
            }, false);
            ws.onmessage = (message) => {
                const req = JSON.parse(message.data);
                switch (req.type){
                    case 'init':
                        //shape = req.data;
                        if(req.data == 'ok'){
                            isLoad = true;
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

            function init(){
                ws.send(JSON.stringify({
                    type: 'init', data: []
                }));
            }
        </script>
    </body>
</html>
