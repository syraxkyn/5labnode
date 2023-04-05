const express = require('express');
const app = require('express')();
const hbs = require('express-handlebars').create({
    layoutsDir: "views/layouts",
    defaultLayout: "main",
    extname: '.hbs',
    helpers: {
        deny(){return `<button onClick="window.location.href='./'">Отказаться</button>`}
    }
});
const fs = require('fs');
const bodyParser = require("body-parser");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.set('port', 3000);
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.get('/', (req, res, next) => {
    fs.readFile('./Telephones.json', (e, data) => {
            if (e) console.log('Ошибка: ', e);
            else {
                let os = JSON.parse(data);
                res.render('index', {names: os})
            }
        }
    );
})
app.get('/Add', (req, res, next) => {
    fs.readFile('./Telephones.json', (e, data) => {
            if (e) {
                console.log('Ошибка: ', e);
            } else {
                let os = JSON.parse(data);
                res.render('Add', {names: os, logicif: true})
            }
        }
    );
});
app.post('/Add', function (req, res) {
    let body = req.body.String;
    let result2 = '[';
    console.log(body);
    let result = (body.split(" ")).filter(function (el) {
        return el != "";
    });
    let names = result[0].split(',')
    let FIO = names[0]+' ' +names[1][0]+'.'+names[2][0]
    console.log(FIO)
    console.log(names[0])
    console.log(names[1])
    console.log(names[2])
    console.log(result[0])
    console.log(result[1])
    result[1] = result[1].replace(/\s+/g, '');
    fs.readFile('./Telephones.json', (e, data) => {
        if (e) console.log('Ошибка: ', e);
        else {
            let os = JSON.parse(data);
            os.forEach(element => {
                result2 += `{ "FIO":"${element.FIO}","Telephone":"${element.Telephone}"},`;
            });
        }
        result2 += `{"FIO":"${FIO}","Telephone":"${result[1]}"}]`;
        fs.writeFile('./Telephones.json', result2, (e) => {
            if (e) throw e;
            console.log("Запись успешно завершена");
        });
        fs.readFile('./Telephones.json', (e, data) => {
            if (e) console.log('Ошибка: ', e);
            else {
                let os = JSON.parse(data);
                res.render('index', {names: os})
            }
        });
    });
});
app.get('/Update', (req, res, next) => {

    fs.readFile('./Telephones.json', (e, data) => {
            if (e) console.log('Ошибка: ', e);
            else {
                let os = JSON.parse(data);
                res.render('Update', {names: os, FIO: req.query.FIO, Telephone: req.query.Telephone, logicif: true})
            }
        }
    );
});
app.post('/Update', function (req, res) {
    let body = req.body.String;
    let result2 = '[';
    console.log(body);
    let result = (body.split(" ")).filter(function (el) {
        return el != "";
    });
    let lastname = result[0]
    let names = result[1]
    let telephone = result[2]
    result[1] = result[1].replace(/\s+/g, '');
    console.log(result);
    let FIO = lastname+ ' ' +names
    console.log(FIO)
    fs.readFile('./Telephones.json', (e, data) => {
        if (e) console.log('Ошибка: ', e);
        else {
            let os = JSON.parse(data);
            os.forEach(element => {
                let result_json = (element.FIO.split(" ")).filter(function (el) {
                    return el != "";
                });
                let lastname_json = result_json[0]
                if (lastname == lastname_json) {
                    result2 += `{ "FIO":"${FIO}","Telephone":"${telephone}"},`
                } else {
                    result2 += `{ "FIO":"${element.FIO}","Telephone":"${element.Telephone}"},`;
                }
            });
        }
        result2 = result2.substring(0, result2.length - 1);
        result2 += ']';
        fs.writeFile('./Telephones.json', result2, (e) => {
            if (e) throw e;
            console.log("Запись успешно завершена");
        });
        fs.readFile('./Telephones.json', (e, data) => {
            if (e) console.log('Ошибка: ', e);
            else {
                let os = JSON.parse(data);
                res.render('index', {names: os})
            }
        });
    });
});
app.post('/Delete', function (req, res) {
    let body = req.body.String;
    let result2 = '[';
    console.log(body);
    let result = (body.split(" ")).filter(function (el) {
        return el != "";
    });
    result[1] = result[1].replace(/\s+/g, '');
    console.log(result);
    let lastname = result[0]
    let names = result[1]
    let telephone = result[2]
    let FIO = lastname+ ' ' +names
    fs.readFile('./Telephones.json', (e, data) => {
        if (e) console.log('Ошибка: ', e);
        else {
            let os = JSON.parse(data);
            os.forEach(element => {
                if (FIO != element.FIO && telephone != element.Telephone) {
                    result2 += `{ "FIO":"${element.FIO}","Telephone":"${element.Telephone}"},`;
                }
                else{
                    console.log('deleted')
                }
            });
        }
        result2 = result2.substring(0, result2.length - 1);
        result2 += ']';
        fs.writeFile('./Telephones.json', result2, (e) => {
            if (e) throw e;
            console.log("Удаление успешно завершено");
        });
        fs.readFile('./Telephones.json', (e, data) => {
            if (e) console.log('Ошибка: ', e);
            else {
                let os = JSON.parse(data);
                res.render('index', {names: os})
            }
        });
    });
});
//var server=app.listen(app.get('port'));
var server = app.listen(process.env.PORT || app.get('port'));