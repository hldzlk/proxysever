import http from 'http';
import path from 'path';
import express from 'express';
import httpProxy from 'http-proxy';
import {proxySever, severPort, proxyUrl, staticdir} from './proxyconfig';
const proxy = httpProxy.createProxyServer({});
const app = express();
app.use(express.static(staticdir));
app.use(proxyUrl, (req, res) => {
    proxy.web(req, res, {
        target: 'http://' + proxySever + proxyUrl
    });
});
proxy.on('error', function(e) {
    console.log(e);
});
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('host', proxySever);
});
const server = new http.Server(app);
server.listen(severPort, (err) => {
    if (err) {
        console.error(err);
    }
    console.log(`==> 💻  服务地址：http://localhost:${severPort}`);
    console.log(`==> 📃  服务路径：${staticdir}`);
    console.log(`==> 🐻  代理信息：${proxyUrl} 路径会代理 ${proxySever} 的信息`);
});
