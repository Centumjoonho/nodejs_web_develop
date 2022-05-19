/**
 * downloadDao.js mysql db 연결 객체를 생성하여 전달
 *
 * date : 20.04.02
 * author : sdkim
 */

var gDb         = require('../lib/db');
var gError      = require('../lib/error');
var gConfig     = require('../config');
var path        = require('path');
var mime        = require('mime');
var fs          = require('fs');
var iconvLite   = require('iconv-lite');

var gDaoName    = 'downloadDao';

/**
 * 요청한 tranId 에 일치하는 DB 데이타를 전달
 * @param {*} tranData tranId 필수 필드
 */

/*
// tranData 정의
var tranData    = {
    tranId:pagePath,        // 이동할 경로
    req:req,                // 요청객체
    res:res,                // 응답객체
    params:{},              // 전달할 파라미터
    data:{}                 // 전달할 데이타
};
*/

var resultDao   = function (tranData){
   console.log(`${gDaoName} - ${tranData.tranId}`)

   switch (tranData.tranId){
        case 'file/download_file_dataset':
            download_file_dataset(tranData);
            break;

        case 'file/download_file_movie':
            download_file_movie(tranData);
            break;

        default:
            console.log(gError.userMessage.noPageHandler);
            var error   = new Error(gError.userMessage.noPageHandler);
            gError.errorPage(tranData.res, error);
            break;
   }
};

/**
 * Dataset 내용을 조회하고 파일을 다운로드
 *
 * @param {*} tranData
 */
function download_file_dataset(tranData){

    // Dataset 조회
    if (typeof tranData.params.datasetCd == 'undefined'){
        console.log(gError.userMessage.noPageHandler);
        var error   = new Error(gError.userMessage.inValidParameter);
        gError.errorPage(tranData.res, error);
        return;
    }

    var dbParams    = [
        tranData.params.datasetCd
    ];
    gDb.query(`
    SELECT
        ds.dataset_cd,
        ds.create_tm,
        DATE_FORMAT(ds.create_tm,'%Y.%m.%d') create_tm_desc,
        ds.update_tm,
        DATE_FORMAT(ds.update_tm,'%Y.%m.%d') update_tm_desc,
        ds.dataset_nm,
        ds.scenario_cd,
        (SELECT common_nm FROM common_cd WHERE group_cd = 'SCENARIO' AND common_cd = ds.scenario_cd) scenario_nm,
        ds.remark,
        ds.img_hor_px,
        ds.img_ver_px,
        ds.img_type_cd,
        (SELECT common_nm FROM common_cd WHERE group_cd = 'IMG_TYPE' AND common_cd = ds.img_type_cd) img_type_nm,
        ds.imgx_up_nm,
        ds.imgx_size_kb,
        ds.imgx_save_path,
        ds.imgx_save_nm,
        ds.imgx_web_url,
        ds.imgy_up_nm,
        ds.imgy_size_kb,
        ds.imgy_save_path,
        ds.imgy_save_nm,
        ds.imgy_web_url,
        ds.use_learning_rate,
        ds.use_verify_rate,
        ds.use_test_rate,
        ds.use_yn
    FROM    dataset ds
    WHERE   ds.dataset_cd = ?
    `,
    dbParams,
    function(error, result, fields){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            return;
        }

        var fileNm          = result[0].imgx_up_nm;
        var saveFilePath    = result[0].imgx_save_path;
        if (tranData.params.trainType == "Y"){
            fileNm          = result[0].imgy_up_nm;
            saveFilePath    = result[0].imgy_save_path;
        }
        var fileFullPath    = path.join(gConfig.apps[0].rootDirName, saveFilePath);
        var mimeType        = mime.lookup(fileNm);

        if (fs.existsSync(fileFullPath)){
            tranData.res.setHeader('Content-disposition', 'attachment; filename=' + getDownloadFilename(tranData.req, fileNm));
            tranData.res.setHeader('Content-type', mimeType);
            var fileStream  = fs.createReadStream(fileFullPath);
            fileStream.pipe(tranData.res);
        }
        else {
            console.log(gError.userMessage.noFile);
            var error   = new Error(gError.userMessage.noFile);
            gError.errorPage(tranData.res, error);
            return;
        }

    }); // Dataset 조회 종료
}

/**
 * Movie 내용을 조회하고 파일을 다운로드
 *
 * @param {*} tranData
 */
function download_file_movie(tranData){

    // Movie 조회
    if (typeof tranData.params.movieCd == 'undefined'){
        console.log(gError.userMessage.noPageHandler);
        var error   = new Error(gError.userMessage.inValidParameter);
        gError.errorPage(tranData.res, error);
        return;
    }

    var dbParams    = [
        tranData.params.movieCd
    ];
    gDb.query(`
    SELECT
        mv.movie_cd,
        mv.create_tm,
        mv.update_tm,
        mv.movie_nm,
        mv.remark,
        mv.scenario_cd,
        (SELECT common_nm FROM common_cd WHERE group_cd = 'SCENARIO' AND common_cd = mv.scenario_cd) scenario_nm,
        mv.learning_cd,
        (SELECT learning_nm FROM learning WHERE learning_cd = mv.learning_cd) learning_nm,
        mv.in_movie_type_cd,
        (SELECT common_nm FROM common_cd WHERE group_cd = 'MOVIE_TYPE' AND common_cd = mv.in_movie_type_cd) in_movie_type_nm,
        mv.in_movie_frame_rate,
        mv.in_movie_nm,
        mv.in_movie_size_kb,
        mv.in_movie_save_path,
        mv.in_movie_save_nm,
        mv.in_movie_web_url,
        mv.out_movie_nm,
        mv.out_movie_size_kb,
        mv.out_movie_save_path,
        mv.out_movie_save_nm,
        mv.out_movie_web_url,
        mv.movie_state_cd,
        (SELECT common_nm FROM common_cd WHERE group_cd = 'MOVIE_STAT' AND common_cd = mv.movie_state_cd) movie_state_nm,
        mv.start_tm,
        date_format(mv.start_tm,'%Y.%m.%d %T') start_tm_desc,
        mv.end_tm,
        date_format(mv.end_tm,'%Y.%m.%d %T') end_tm_desc
    FROM    movie mv
    WHERE   mv.movie_cd = ?
    `,
    dbParams,
    function(error, result, fields){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            return;
        }

        var fileNm          = result[0].in_movie_nm;
        var saveFilePath    = result[0].in_movie_save_path;
        if (tranData.params.creationType == "OUT"){
            fileNm          = result[0].movie_cd + "." + result[0].in_movie_type_cd;
            saveFilePath    = 'data/movie/' + result[0].movie_cd + '/' + fileNm;
        }
        else if(tranData.params.creationType == "3"){
          fileNm          = result[0].movie_cd + "_3." + result[0].in_movie_type_cd;
          saveFilePath    = 'data/movie/' + result[0].movie_cd + '/' + fileNm;
        }
        else if(tranData.params.creationType == "4"){
          fileNm          = result[0].movie_cd + "_4." + result[0].in_movie_type_cd;
          saveFilePath    = 'data/movie/' + result[0].movie_cd + '/' + fileNm;
        }
        else if(tranData.params.creationType == "5"){
          fileNm          = result[0].movie_cd + "_5." + result[0].in_movie_type_cd;
          saveFilePath    = 'data/movie/' + result[0].movie_cd + '/' + fileNm;
        }

        var fileFullPath    = path.join(gConfig.apps[0].rootDirName, saveFilePath);
        var mimeType        = mime.lookup(fileNm);

        console.log(saveFilePath);

        if (fs.existsSync(fileFullPath)){
            tranData.res.setHeader('Content-disposition', 'attachment; filename=' + getDownloadFilename(tranData.req, fileNm));
            tranData.res.setHeader('Content-type', mimeType);
            var fileStream  = fs.createReadStream(fileFullPath);
            fileStream.pipe(tranData.res);
        }
        else {
            console.log(gError.userMessage.noFile);
            var error   = new Error(gError.userMessage.noFile);
            gError.errorPage(tranData.res, error);
            return;
        }

    }); // Movie 조회 종료
}

/**
 *
 * @param {*} req
 * @param {*} filename
 */
function getDownloadFilename(req, filename) {

    var header = req.headers['user-agent'];

    if (header.includes("MSIE") || header.includes("Trident")) {
        return encodeURIComponent(filename).replace(/\\+/gi, "%20");
    } else if (header.includes("Chrome")) {
        return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
    } else if (header.includes("Opera")) {
        return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
    } else if (header.includes("Firefox")) {
        return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
    }

    return filename;
}

module.exports  = resultDao;
