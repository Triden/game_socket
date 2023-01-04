<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title></title>
    </head>
    <body>
        <h1 id="load">XXXX</h1>
        <script>
        document.addEventListener('DOMContentLoaded', function(){
            if(!~document.cookie.indexOf('test')){
                document.cookie = `test=0; expires=Sun, 1 Jan 2023 00:00:00 UTC; path=/`;
            }
            function getCookies() {
                var cookies = document.cookie.split('; ');
                var ret = [];
                for (var i = 0; i < cookies.length; i++) {
                    var sp = cookies[i].split('=');
                    ret.push({name: sp[0], val: sp[1]});
                }
                return ret;
            }
            var c = getCookies();
            for (var v in c){
                var cell = c[v];
                cell.val = +cell.val + 1;
                document.cookie = `${cell.name}=${cell.val}; path=/`;
            }
            var a = document.querySelector('#load');
            a.innerText = document.cookie;
            console.log(cell.val + '@@@');
        });
        </script>
    </body>
</html>
