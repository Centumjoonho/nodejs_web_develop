/**
 * app.js 웹 요청/응답에 필요한 기능 설정
 *
 * date : 20.03.20
 * author : sdkim
 */

var createError     = require('http-errors');
var express         = require('express');
var path            = require('path');
var cookieParser    = require('cookie-parser');
var logger          = require('morgan');

var gConfig         = require('./config');
var mainRouter      = require('./routers/mainRouter');
var datasetRouter   = require('./routers/datasetRouter');
var learningRouter  = require('./routers/learningRouter');
var movieRouter      = require('./routers/movieRouter');
var analysisRouter  = require('./routers/analysisRouter');
var annotationRouter  = require('./routers/annotationRouter');
var download        = require('./routers/downloadRouter');

var gError          = require('./lib/error');

var app = express();

// view engine 세팅
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 필요 모듈 세팅
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // 외부에서 자원 접근 경로 설정
app.use(express.static(path.join(__dirname, 'data/datasets')));
app.use(express.static(path.join(__dirname, 'data/checkpoints')));
app.use(express.static(path.join(__dirname, 'data/movie')));
// 전역 내용 설정
gConfig.apps[0].rootDirName = __dirname;

// 페이지 라우터 세팅
app.use('/', movieRouter);
app.use('/main', mainRouter);
app.use('/dataset', datasetRouter);
app.use('/learning', learningRouter);
app.use('/movie', movieRouter);
app.use('/analysis', analysisRouter);
app.use('/annotation', annotationRouter);
app.use('/download', download);

// 404 에러처리
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    gError.errorPage(res, err);
});

module.exports = app;
