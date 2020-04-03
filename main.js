const path = require('path');
const express = require('express');

const config = require('./config.json');
const helper = require('./helpers');
const serverFacade = require('./ServerFacade');


let app = express();
let facade = new serverFacade.ServerFacade();

// logging
app.use(function (req, res, next) {
    helper.logRequest(req, res);
    next()
});

/**
 * Routes
 */


const buildDir = 'build';

app.use(express.static(path.join(__dirname, buildDir)));

app.get(/^\/(?!.*api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, buildDir, 'index.html'));
});

app.get('/api/tab', async (req, res) => {
    if (!helper.tabParamCheck(req, res))
        return;
    const tab = req.query.tab.toLowerCase();
    const src = req.query.src.toLowerCase();
    const obj = await facade.getTab(tab, src);
    if (obj.status != 'ok') {
        console.log(obj);
        res.status(500);
    }
    res.send(obj)
});


app.get('/api/article', async (req, res) => {
    if (!helper.articleParamCheck(req, res))
        return;


    const b64id = req.query.artId;
    const id = helper.base64.decode(b64id);
    const src = req.query.src.toLowerCase();


    const obj = await facade.getArticle(id, src);
    if (obj.status != 'ok') {
        console.log(obj);
        res.status(500);
    }
    res.send(obj);

});

//TODO: param check
app.get('/api/search', async (req, res) => {

    const q = req.query.q;
    const src = req.query.src.toLowerCase();

    const obj = await facade.getSearch(q, src);
    if (obj.status != 'ok') {
        console.log(obj);
        res.status(500);
    }
    res.send(obj);
});

// main
app.listen(process.env.PORT || config.port, '0.0.0.0', () => {
    console.log("Start listening on port -> " + config.port);
});