'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const uniqid = require('uniqid');
const randomstring = require('randomstring');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const env = require('./env.json');

const { OAuth2Request, User, Contact } = require('./models');
const { MySQL } = require('./db');
const { UnauthorisedError } = require('./exceptions');

const app = express();
const mysql = new MySQL();

const authMiddleware = async (req, res, next) => {
  // This should be replaced by key-value pair storage like memcache
  // or redis when traffic increased
  try {
    if (!req.headers.authorization) {
      throw new UnauthorisedError('Unauthorised request.');
    }
    const auth = new OAuth2Request();
    const res = await auth.validateToken(
      req.headers.authorization,
      new MySQL().connect()
    );
    next();
  } catch (err) {
    res.status(err.statusCode).send(err);
  }
};

app.use(bodyParser.json());

app.post('/auth', async (req, res) => {
  try {
    const db = mysql.connect();
    if (!req.body.refreshToken) {
      const auth = new OAuth2Request(
        req.body.username,
        req.body.password,
        req.body.grantType,
        req.body.scope
      );

      const data = await auth.auth(db);
      res.send(data);
    } else {
      const auth = new OAuth2Request();
      const data = await auth.refreshToken(req.body.refreshToken, db);
      res.send(data);
    }
  } catch (err) {
    res.status(err.statusCode).send(err);
  }
});

app.post('/accounts', async (req, res) => {
  try {
    const salt = randomstring.generate(32);
    const user = new User(
      uniqid(),
      req.body.name,
      req.body.email,
      md5(`${req.body.password + salt}`),
      salt
    );
    const mysql = new MySQL();
    const db = mysql.connect();

    const data = await user.addUser(user, db);
    res.send(data);
  } catch (err) {
    res.status(err.statusCode).send(err);
  }
});

app.get('/accounts/:code', authMiddleware, async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers.authorization, env.tokenSecret);

    if(!decoded || decoded.data.code !== req.params.code){
      throw new UnauthorisedError('Invalid user ID.');
    }
 
    const user = new User();
    const mysql = new MySQL();
    const db = mysql.connect();

    const data = await user.getUser(decoded.data.id, db);
    res.send(data);
  } catch (err) {
    res.status(err.statusCode).send(err);
  }
});

app.listen(8080, () => console.log('Running on port 8080!'));
