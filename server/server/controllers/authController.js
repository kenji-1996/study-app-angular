/**
 * Created by Kenji on 1/8/2018.
 */
let settings = require('../misc/settings');
let mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
let config = require('../misc/config');
let userModel = require('../models/userModel');
let tokenModel = require('../models/tokenModel');
global.atob = require("atob");


