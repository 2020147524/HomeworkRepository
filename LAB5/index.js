const express = require('express');
const app = express();
const ejs = require('ejs');
const fs = require('fs');
const multer = require('multer');

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

async function getDBConnection() {
    const db = await sqlite.open({
        filename: 'product.db',
        driver: sqlite3.Database
    });
    return db;
}

app.set('view engine', 'ejs');
app.use(express.static('public'))

app.use(express.urlencoded({extended: true }));
app.use(express.json());
app.use(multer().none());

app.get('/', async function(req, res) {
    let db = await getDBConnection();
    let rows = await db.all('select * from Products');
    await db.close();
    res.render('index', {products : rows});
});

app.post('/', async function(req, res) {
    let category = req.body.chosenCategory;
    let keyword = req.body.searchKeyword;
    let query;

    let db = await getDBConnection();
    if (category == "All") {
        query = `select * from Products where product_title like '%${keyword}%'`;
    }
    else {
        if (keyword == "") query = `select * from Products where product_category like '%${category}%'`;
        else query = `select * from Products where product_category like '%${category}%'and product_title like '%${keyword}%'`;
    }

    let rows = await db.all(query);
    await db.close();

    res.send(rows);
})

app.get('/login', function(req, res) {
    fs.readFile(__dirname + '/public/login.html', function(error, data) {
        res.writeHead(200, { 'Content-type': 'text/html'});
        res.end(data);
    });
    //res.render('login');
});

app.get('/signup', function(req, res) {
    fs.readFile(__dirname + '/public/signup.html', function(error, data) {
        res.writeHead(200, { 'Content-type': 'text/html'});
        res.end(data);
    });
    
    //res.render('signup');
});

app.get('/product/:product_id', async function(req, res) {
    //console.log(req.params.product_id);
    let db = await getDBConnection();
    let rows = await db.all('select * from Products where product_id=' + req.params.product_id + ';');
    await db.close();
    // console.log(rows);

    fs.readFile('comment.json', 'utf8', function(err, data) {
        if (err) throw err;

        let commentJson= JSON.parse(data);
        //console.log(commentJson);
        let comments = commentJson[req.params.product_id - 1];
        // console.log(comments);
        res.render('detail', {productDetail: rows, Comment: comments});
    })
});

app.post('/product/:product_id', function(req, res) {
    let appendComment = req.body.comment;
    let productID = req.params.product_id;

    fs.readFile('comment.json', 'utf8',function(err, data) {
        if (err) throw err;

        let commentJson = JSON.parse(data);
        let comments = commentJson[productID -1];
        comments.comments.unshift(appendComment);
        //console.log(comments);
        fs.writeFile("comment.json", JSON.stringify(commentJson), function(err) {
            if (err) throw err;
            console.log("새로운 comment 로드 성공!");
        });

        res.send(comments);
    })
});


var port = 3000;
app.listen(port, function() {
    console.log('server on! http://localhost:' + port);
});