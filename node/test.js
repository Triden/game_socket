// const express = require('express')
// const app = express()
// const port = 5555
//
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
//
// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })

import { WebSocketServer } from 'ws';
import {v4 as uuid} from "uuid";
const clients = {};
const shapes = {};
