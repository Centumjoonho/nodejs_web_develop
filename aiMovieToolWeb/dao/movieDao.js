/**
 * movieDao.js mysql db 연결 객체를 생성하여 전달
 *
 * date : 20.04.03
 * author : sdkim
 */

var gDb         = require('../lib/db');
var gError      = require('../lib/error');
var gConfig     = require('../config');
var gDaoName    = 'movieDao';

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
    params:{dbParamId:1},   // 전달할 파라미터
    data:{}                 // 전달할 데이타
};
*/
var resultDao   = function (tranData){
   console.log(`${gDaoName} - ${tranData.tranId}`)

   switch (tranData.tranId){
        case 'movie/movie_management_create':
            movie_management_create(tranData);
            break;

        case 'movie/movie_management_create2':
            movie_management_create2(tranData);
            break;

        case 'movie/movie_management_createSave':
            movie_management_createSave(tranData);
            break;

        case 'movie/movie_management_createSave2':
            movie_management_createSave2(tranData);
        break;

        case 'movie/movie_management_list':
            movie_management_list(tranData);
            break;

        case 'movie/movie_management_delete':
            movie_management_delete(tranData);
            break;

        case 'movie/movie_management_view':
            movie_management_view(tranData);
            break;

        case 'movie/movie_management_fid':
            movie_management_fid(tranData);
            break;

        case 'movie/movie_management_onen':
            movie_management_onen(tranData);
            break;

        default:
            console.log(gError.userMessage.noPageHandler);
            var error   = new Error(gError.userMessage.noPageHandler);
            gError.errorPage(tranData.res, error);
            break;
   }
}

/**
 * 영상 생성 페이지로 이동
 *
 * @param {*} tranData
 */
function movie_management_create(tranData){

    // 시나리오 조회
    gDb.query(`
    SELECT group_cd, common_cd, common_nm FROM common_cd WHERE group_cd = 'SCENARIO' AND common_cd != '*' AND use_yn = 'Y' ORDER BY order_no
    `,
    function(error, result, fields){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            return;
        }
        tranData.data.listScenario  = result;

        // 학습 조회
        gDb.query(`
        SELECT learning_cd, learning_nm FROM learning WHERE learning_state_cd = 'DONE' ORDER BY learning_cd
        `,
        function(error, result, fields){
            if (error){
                console.log(error);
                gError.errorPage(tranData.res, error);
                return;
            }
            tranData.data.listLearning  = result;

            // 동영상 조회
            gDb.query(`
            SELECT group_cd, common_cd, common_nm FROM common_cd WHERE group_cd = 'MOVIE_TYPE' AND common_cd != '*' AND use_yn = 'Y' ORDER BY order_no
            `,
            function(error, result, fields){
                if (error){
                    console.log(error);
                    gError.errorPage(tranData.res, error);
                    return;
                }
                tranData.data.listInMovieType   = result;

                // 화면 이동
                tranData.res.render(tranData.tranId, {tranData:tranData});

            }); // 동영상 조회 종료

        }); // 학습 조회 종료

    }); // 시나리오 조회 종료
}

/**
 * 이미지 생성 페이지로 이동
 *
 * @param {*} tranData
 */
function movie_management_create2(tranData){

    // 시나리오 조회
    gDb.query(`
    SELECT group_cd, common_cd, common_nm FROM common_cd WHERE group_cd = 'SCENARIO' AND common_cd != '*' AND use_yn = 'Y' ORDER BY order_no
    `,
    function(error, result, fields){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            return;
        }
        tranData.data.listScenario  = result;

        // 학습 조회
        gDb.query(`
        SELECT learning_cd, learning_nm FROM learning WHERE learning_state_cd = 'DONE' ORDER BY learning_cd
        `,
        function(error, result, fields){
            if (error){
                console.log(error);
                gError.errorPage(tranData.res, error);
                return;
            }
            tranData.data.listLearning  = result;

            // 동영상 조회
            gDb.query(`
            SELECT group_cd, common_cd, common_nm FROM common_cd WHERE group_cd = 'MOVIE_TYPE' AND common_cd != '*' AND use_yn = 'Y' ORDER BY order_no
            `,
            function(error, result, fields){
                if (error){
                    console.log(error);
                    gError.errorPage(tranData.res, error);
                    return;
                }
                tranData.data.listInMovieType   = result;

                // 화면 이동
                tranData.res.render(tranData.tranId, {tranData:tranData});

            }); // 동영상 조회 종료

        }); // 학습 조회 종료

    }); // 시나리오 조회 종료
}
/**
 * 생성할 이미지을 저장하고 리스트 페이지로 이동
 *
 * @param {*} tranData
 */
function movie_management_createSave2(tranData){

    // 영상 cd 값 생성
    gDb.query(`
    SELECT   CONCAT('I', LEFT(CAST(YEAR(NOW()) AS CHAR(4)), 2), '-', LPAD(CAST(CAST(IFNULL(RIGHT(MAX(mv.movie_cd),4),'0000') AS SIGNED) + 1 AS CHAR(4)), 4, '0')) AS next_cd
    FROM     movie mv
    WHERE    mv.movie_cd LIKE CONCAT('I', LEFT(CAST(YEAR(NOW()) AS CHAR(4)), 2), '%')
    `,
    function(error, result, fields){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            return;
        }
        tranData.params.next_cd = result[0].next_cd;

        var fs = require('fs');
        var dir = './data/datasets/' + tranData.params.next_cd;
        var dirA = dir + '/' + 'testA';
        //var dirB = dir + '/' + 'testB';

        //var pirA = dir + '/' + 'A';
        //var pirB = dir + '/' + 'B';
        //var tirA = pirA + '/' + 'train';
        //var tirB = pirB + '/' + 'train';

        //var pir = dir + '/' + 'test';

        var rimraf = require("rimraf");
        if (fs.existsSync(dir)) {
          rimraf.sync(dir);
        }
        fs.mkdirSync(dir);

        if (fs.existsSync(dirA)) {
          rimraf.sync(dirA);
        }
        fs.mkdirSync(dirA);
        /*
        if (fs.existsSync(dirB)) {
          rimraf.sync(dirB);
        }
        fs.mkdirSync(dirB);

        if (fs.existsSync(pirA)) {
          rimraf.sync(pirA);
        }
        fs.mkdirSync(pirA);
        if (fs.existsSync(pirB)) {
          rimraf.sync(pirB);
        }
        fs.mkdirSync(pirB);
        if (fs.existsSync(tirA)) {
          rimraf.sync(tirA);
        }
        fs.mkdirSync(tirA);
        if (fs.existsSync(tirB)) {
          rimraf.sync(tirB);
        }
        fs.mkdirSync(tirB);
        */

        //if (fs.existsSync(pir)) {
        //  rimraf.sync(pir);
        //}
        //fs.mkdirSync(pir);

        //console.log(tranData.params.imgx_web_url);
        var path = require('path');
        var AdmZip = require('adm-zip'); //임시로 동영상이 아닌 이미지 파일들.에 오류있음.

        var filename = "." + tranData.params.in_movie_web_url;
        //if(path.extname(filename) == '.zip') {

          //var zipB = new AdmZip("." + tranData.params.imgy_web_url);

          try {
            var zipA = new AdmZip(filename);
            zipA.extractAllTo(dirA, true);
          }
          catch ( e ) {
            console.log( 'Caught exception: ', e );
          }
        //}
        //zipB.extractAllTo(dirB, true);
        //zipA.extractAllTo(tirA, true);
        //'zipB.extractAllTo(tirB, true);

        //zipA.extractAllTo(pir, true);

        /*
        var pyshell = require('python-shell');
        console.log("python-shell");

        var options = {
          mode: 'text',
          pythonPath: '',
          pytonOptions: ['-u'],
          scriptPath: '',
          args: [pirA,pirB,dir]
          //args:dbParams3,
        }; //--gpu_ids 0 --input_nc 3 --n_epochs 100 --n_epochs_decay 100 --lr 0.0002
        console.log("ok");
        let py = pyshell.PythonShell.run('combine.py', options, function (err, results) {
          if (err) throw err;
          console.log('results: %j', results);
            rimraf.sync(pirA);
            rimraf.sync(pirB);
          });
        */




        // 저장시 transaction 처리
        gDb.beginTransaction(function(error){
            if (error){
                console.log(error);
                gError.errorPage(tranData.res, error);
                gDb.rollback();

                return;
            }

            // dataset insert
            var dbParams    = [
                tranData.params.next_cd,
                tranData.req.body.txtMovieNm,
                tranData.req.body.txtRemark,
                tranData.req.body.slcScenarioCd,
                tranData.req.body.slcLearningCd,
                'ZIP',
                '0',
                tranData.params.in_movie_nm,
                tranData.params.in_movie_size_kb,
                tranData.params.in_movie_save_path,
                tranData.params.in_movie_save_nm,
                tranData.params.in_movie_web_url,
                'MAKING'//'READY'
            ];

            gDb.query(`
            INSERT INTO movie(
                movie_cd,
                create_tm,
                movie_nm,
                remark,
                scenario_cd,
                learning_cd,
                in_movie_type_cd,
                in_movie_frame_rate,
                in_movie_nm,
                in_movie_size_kb,
                in_movie_save_path,
                in_movie_save_nm,
                in_movie_web_url,
                movie_state_cd,
                start_tm
            ) VALUES (
                ?,                 -- movie_cd,
                NOW(),             -- create_tm,
                ?,                 -- movie_nm,
                ?,                 -- remark,
                ?,                 -- scenario_cd,
                ?,                 -- learning_cd,
                ?,                 -- in_movie_type_cd,
                ?,                 -- in_movie_frame_rate,
                ?,                 -- in_movie_nm,
                ?,                 -- in_movie_size_kb,
                ?,                 -- in_movie_save_path,
                ?,                 -- in_movie_save_nm,
                ?,                 -- in_movie_web_url,
                ?,                 -- movie_state_cd
                NOW()
            )
            `,
            dbParams,
            function(error, result, fields){
                if (error){
                    console.log(error);
                    gError.errorPage(tranData.res, error);
                    gDb.rollback();
                    return;
                }
                gDb.commit();

                tranData.tranId  = 'movie/movie_management_list';
                movie_management_list(tranData);

                var dbParams2   = [
                    tranData.req.body.slcLearningCd
                ];

                gDb.query(`
                SELECT * FROM learning
                WHERE
                    learning_cd = ?
                `
                ,
                dbParams2,
                function(error, result, fields){
                    if (error){
                        console.log(error);
                        gError.errorPage(tranData.res, error);
                        gDb.rollback();
                        return;
                    }

                    tranData.params.learning_model_cd = result[0].learning_model_cd;
                    tranData.params.dataset_cd = result[0].dataset_cd;

                    var fs = require('fs');
                    var dir = './data/datasets/' + tranData.params.dataset_cd;
                    var lir = './data/checkpoints/' + tranData.req.body.slcLearningCd;
                    //var lir1 = lir + '/' + 'latest_net_D.pth'
                    var lir2 = lir + '/' + 'latest_net_G.pth'
                    //var lir3 = lir + '/' + 'latest_net_D_A.pth'
                    //var lir4 = lir + '/' + 'latest_net_D_B.pth'
                    var lir5 = lir + '/' + 'latest_net_G_A.pth'
                    //var lir6 = lir + '/' + 'latest_net_G_B.pth'

                    var cir = './data/checkpoints' + '/' + tranData.params.next_cd;
                    //var cir1 = cir + '/' + 'latest_net_D.pth'
                    var cir2 = cir + '/' + 'latest_net_G.pth'
                    //var cir3 = cir + '/' + 'latest_net_D_A.pth'
                    //var cir4 = cir + '/' + 'latest_net_D_B.pth'
                    //var cir5 = cir + '/' + 'latest_net_G_A.pth'
                    //var cir6 = cir + '/' + 'latest_net_G_B.pth'

                    var rimraf = require("rimraf");
                    if (fs.existsSync(cir)) {
                      rimraf.sync(cir);
                    }
                    fs.mkdirSync(cir);

                    //const copyFileSync = require('fs-copy-file-sync');
                    //const { COPYFILE_EXCL } = copyFileSync.constants;

                    //if (fs.existsSync(lir1)) {
                    //  fs.copyFileSync(lir1, cir1);
                    //}

                    if (fs.existsSync(lir2)) {
                      fs.copyFileSync(lir2, cir2);
                    }
                    /*
                    if (fs.existsSync(lir3)) {
                      fs.copyFileSync(lir3, cir3);
                    }

                    if (fs.existsSync(lir4)) {
                      fs.copyFileSync(lir4, cir4);
                    }*/

                    if (fs.existsSync(lir5)) {
                      fs.copyFileSync(lir5, cir2);
                    }

                    //if (fs.existsSync(lir6)) {
                    //  fs.copyFileSync(lir6, cir6);
                    //}
                    var filename = "." + tranData.params.in_movie_web_url;

                    var dbParams3   = [
                        tranData.params.next_cd,
                        tranData.params.learning_model_cd,//DB
                        tranData.req.body.slcLearningCd,
                        //tranData.req.body.slcInMovieTypeCd,
                        //tranData.req.body.txtInMovieFrameRate,
                        tranData.params.dataset_cd,
                        filename

                    ];

                    var pyshell = require('python-shell');
                    console.log("python-shell");

                    var options = {
                      mode: 'text',
                      pythonPath: 'python3',
                      pytonOptions: ['-u'],
                      scriptPath: './',
                      //args: ['value1','value2','value3','value4','value5','value6','value7']
                      args:dbParams3,
                    }; //--gpu_ids 0 --input_nc 3 --n_epochs 100 --n_epochs_decay 100 --lr 0.0002
                    console.log("ok");
                    let py = pyshell.PythonShell.run('test2.py', options, function (err, results) {
                      if (err) throw err;
                      console.log('results: %j', results);

                      var dbParams4 = [
                        tranData.params.next_cd

                      ];

                      var iir = './data/movie/' + tranData.params.next_cd +'/test_latest/images';
                      var iirPath = './data/movie/' + tranData.params.next_cd +'/' + tranData.params.next_cd + '.ZIP';

                      var zipI = new AdmZip();
                      zipI.addLocalFolder(iir);
                      zipI.writeZip(iirPath);

                      gDb.query(`
                          UPDATE movie SET end_tm = NOW(), movie_state_cd = 'DONE' WHERE movie_cd = ?
                        `,
                        dbParams4,
                        function(error, result, fields){
                            if (error){
                                console.log(error);
                                gError.errorPage(tranData.res, error);
                                return;
                            }
                        });
                        gDb.commit();

                    });



                  });



                //훈련



            }); // movie insert 종료

        }); // transaction 종료

    }); // movie_cd 조회 종료
}
/**
 * 생성할 영상을 저장하고 리스트 페이지로 이동
 *
 * @param {*} tranData
 */
function movie_management_createSave(tranData){

    // 영상 cd 값 생성
    gDb.query(`
    SELECT   CONCAT('I', LEFT(CAST(YEAR(NOW()) AS CHAR(4)), 2), '-', LPAD(CAST(CAST(IFNULL(RIGHT(MAX(mv.movie_cd),4),'0000') AS SIGNED) + 1 AS CHAR(4)), 4, '0')) AS next_cd
    FROM     movie mv
    WHERE    mv.movie_cd LIKE CONCAT('I', LEFT(CAST(YEAR(NOW()) AS CHAR(4)), 2), '%')
    `,
    function(error, result, fields){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            return;
        }
        tranData.params.next_cd = result[0].next_cd;

        var fs = require('fs');
        var dir = './data/movie/' + tranData.params.next_cd;
        var bir = dir + "/before";
        var air = dir + "/after";

        var rimraf = require("rimraf");
        if (fs.existsSync(dir)) {
          rimraf.sync(dir);
        }
        fs.mkdirSync(dir);
        fs.mkdirSync(air);
        fs.mkdirSync(bir);

        var path = require('path');

        var filename = "." + tranData.params.in_movie_web_url;


        /*try {
          fs.copyFileSync(filename, dir + "/before/" + tranData.params.in_movie_nm);
          console.log(filename);
          console.log(dir + "/before/" + tranData.params.in_movie_nm);


        }
        catch ( e ) {
          console.log( 'Caught exception: ', e );
        }*/


        /*var AdmZip = require('adm-zip'); //임시로 동영상이 아닌 이미지 파일들.에 오류있음.

        var filename = "." + tranData.params.in_movie_web_url;
        //if(path.extname(filename) == '.zip') {

          //var zipB = new AdmZip("." + tranData.params.imgy_web_url);

          try {
            var zipA = new AdmZip(filename);
            zipA.extractAllTo(dirA, true);
          }
          catch ( e ) {
            console.log( 'Caught exception: ', e );
          }*/



        // 저장시 transaction 처리
        gDb.beginTransaction(function(error){
            if (error){
                console.log(error);
                gError.errorPage(tranData.res, error);
                gDb.rollback();

                return;
            }

            // dataset insert
            var dbParams    = [
                tranData.params.next_cd,
                tranData.req.body.txtMovieNm,
                tranData.req.body.txtRemark,
                tranData.req.body.slcScenarioCd,
                tranData.req.body.slcLearningCd,
                tranData.req.body.slcInMovieTypeCd,
                tranData.req.body.txtInMovieFrameRate,
                tranData.params.in_movie_nm,
                tranData.params.in_movie_size_kb,
                tranData.params.in_movie_save_path,
                tranData.params.in_movie_save_nm,
                tranData.params.in_movie_web_url,
                'MAKING'//'READY'
            ];


            gDb.query(`
            INSERT INTO movie(
                movie_cd,
                create_tm,
                movie_nm,
                remark,
                scenario_cd,
                learning_cd,
                in_movie_type_cd,
                in_movie_frame_rate,
                in_movie_nm,
                in_movie_size_kb,
                in_movie_save_path,
                in_movie_save_nm,
                in_movie_web_url,
                movie_state_cd,
                start_tm
            ) VALUES (
                ?,                 -- movie_cd,
                NOW(),             -- create_tm,
                ?,                 -- movie_nm,
                ?,                 -- remark,
                ?,                 -- scenario_cd,
                ?,                 -- learning_cd,
                ?,                 -- in_movie_type_cd,
                ?,                 -- in_movie_frame_rate,
                ?,                 -- in_movie_nm,
                ?,                 -- in_movie_size_kb,
                ?,                 -- in_movie_save_path,
                ?,                 -- in_movie_save_nm,
                ?,                 -- in_movie_web_url,
                ?,                 -- movie_state_cd
                NOW()
            )
            `,
            dbParams,
            function(error, result, fields){
                if (error){
                    console.log(error);
                    gError.errorPage(tranData.res, error);
                    gDb.rollback();
                    return;
                }
                gDb.commit();

                tranData.tranId  = 'movie/movie_management_list';
                movie_management_list(tranData);
                
                var dbParams2   = [
                    tranData.req.body.slcLearningCd
                ];

                gDb.query(`
                SELECT * FROM learning
                WHERE
                    learning_cd = ?
                `
                ,
                dbParams2,
                function(error, result, fields){
                    if (error){
                        console.log(error);
                        gError.errorPage(tranData.res, error);
                        gDb.rollback();
                        return;
                    }
                   


                    tranData.params.learning_model_cd = result[0].learning_model_cd;
                    tranData.params.dataset_cd = result[0].dataset_cd;

                    var fs = require('fs');

                    var filename = "." + tranData.params.in_movie_nm;

                    var dbParams3   = [
                        tranData.req.body.slcLearningCd,
                        tranData.params.next_cd,
                        tranData.params.in_movie_nm,
                        tranData.params.in_movie_save_nm
                    ];

                    console.log(dbParams3);

                    var pyshell = require('python-shell');
                    console.log("python-shell");

                    var options = {
                      mode: 'text',
                      pythonPath: 'python3',
                      pytonOptions: ['-u'],
                      scriptPath: './',
                      //args: ['value1','value2','value3','value4','value5','value6','value7']
                      args:dbParams3,
                    }; //--gpu_ids 0 --input_nc 3 --n_epochs 100 --n_epochs_decay 100 --lr 0.0002
                    console.log("ok");
                    let py = pyshell.PythonShell.run('yolo.py', options, function (err, results) {
                      if (err) throw err;
                      console.log('results: %j', results);

                      var dbParams4 = [
                        tranData.params.next_cd

                      ];

                      gDb.query(`
                          UPDATE movie SET end_tm = NOW(), movie_state_cd = 'DONE' WHERE movie_cd = ?
                        `,
                        dbParams4,
                        function(error, result, fields){
                            if (error){
                                console.log(error);
                                gError.errorPage(tranData.res, error);
                                return;
                            }
                        });
                        gDb.commit();
                        

                    });

                   


                  });

                //훈련
                
            }); // movie insert 종료
            

        }); // transaction 종료
        
    }); // movie_cd 조회 종료

    
}

/**
 * 영상 리스트를 조회
 *
 * @param {*} tranData
 */
function movie_management_list(tranData){

    // 전체 건수 조회
    gDb.query(`
    SELECT COUNT(mv.movie_cd) total_cnt FROM movie mv
    `,
    function(error, result, fields){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            return;
        }
        /*
        // 조회 변수 설정
        if (typeof tranData.req.body.txtPageNo == 'undefined')  tranData.req.body.txtPageNo = 1;
        if (typeof tranData.req.body.slcListPerPage == 'undefined')  tranData.req.body.slcListPerPage = gConfig.apps[0].pageing.LIST_PER_PAGE;

        tranData.data.pageNo        = parseInt(tranData.req.body.txtPageNo, 10);
        tranData.data.listPerPage   = parseInt(tranData.req.body.slcListPerPage, 10);
        tranData.data.pagePerPaging = parseInt(gConfig.apps[0].pageing.PAGE_PER_PAGING, 10);

        tranData.data.totalCnt      = parseInt(result[0].total_cnt, 10);

        // 리스트 조회
        var dbParams    = [
            (tranData.data.pageNo-1)*tranData.data.listPerPage,
            tranData.data.listPerPage
        ];*/
        gDb.query(`
        SELECT
                ls.*
        FROM    (
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
                    ORDER BY mv.create_tm DESC
                ) ls

        `,
        //dbParams, //LIMIT ?, ?
        function(error, result, fields){
            if (error){
                console.log(error);
                gError.errorPage(tranData.res, error);
                return;
            }
            tranData.data.listData  = result;

            // 페이지 전달
            tranData.res.render(tranData.tranId, {tranData:tranData});
            
        }); // 리스트 조회 종료

    }); // 전체 건수 조회 종료
}

/**
 * 생성된 영상을 삭제
 *
 * @param {*} tranData
 */
function movie_management_delete(tranData){

    // 저장시 transaction 처리
    gDb.beginTransaction(function(error){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            gDb.rollback();

            return;
        }

        // 영상 update
        var dbParams    = [
            tranData.req.body.txtMovieCd
        ];

        gDb.query(`
        SELECT * FROM  movie
        WHERE   movie_cd        = ?
        `,
        dbParams,
        function(error, result, fields){
            if (error){
                console.log(error);
                gError.errorPage(tranData.res, error);
                gDb.rollback();
                return;
            }
            gDb.commit();

            var vir = './data/movie/' + result[0].in_movie_save_nm;

            console.log(vir);
            var fs = require("fs");
            var rimraf = require("rimraf");

            if (fs.existsSync(vir)) {
              rimraf.sync(vir);
            }

            gDb.query(`
            DELETE FROM  movie
            WHERE   movie_cd        = ?
            `,
            dbParams,
            function(error, result, fields){
                if (error){
                    console.log(error);
                    gError.errorPage(tranData.res, error);
                    gDb.rollback();
                    return;
                }
                gDb.commit();

                var dir = './data/movie/' + tranData.req.body.txtMovieCd;
                var dir2 = './data/checkpoints/' + tranData.req.body.txtMovieCd;
                var dir3 = './data/datasets/' + tranData.req.body.txtMovieCd;

                console.log(dir);

                //var rimraf = require("rimraf");

                if (fs.existsSync(dir)) {
                  rimraf.sync(dir);
                }
                if (fs.existsSync(dir2)) {
                  rimraf.sync(dir2);
                }
                if (fs.existsSync(dir3)) {
                  rimraf.sync(dir3);
                }

                // 리스트 화면으로 이동
                tranData.tranId  = 'movie/movie_management_list';
                tranData.req.body.txtPageNo = 1
                movie_management_list(tranData);
            }); // 생성 영상 update 종료

        }); // 생성 영상 update 종료


        /*gDb.query(`
        UPDATE  movie
        SET     update_tm         = NOW()
        WHERE   movie_cd        = ?
        `,*/


    }); // transaction 종료
}

/**
 * 생성 영상 내용을 조회하고 상세 페이지로 이동
 *
 * @param {*} tranData
 */
function movie_management_view(tranData){

    // 생성 영상 조회
    if (typeof tranData.req.body.txtMovieCd == 'undefined'){
        console.log(gError.userMessage.noPageHandler);
        var error   = new Error(gError.userMessage.inValidParameter);
        gError.errorPage(tranData.res, error);
        return;
    }

    var dbParams    = [
        tranData.req.body.txtMovieCd
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
        date_format(mv.end_tm,'%Y.%m.%d %T') end_tm_desc,
        mv.fid,
        mv.fid_cd,
        mv.onen
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

        // 전달 변수 설정
        if (typeof tranData.req.body.txtPageNo == 'undefined')  tranData.req.body.txtPageNo = 1;
        if (typeof tranData.req.body.slcListPerPage == 'undefined')  tranData.req.body.slcListPerPage = gConfig.apps[0].pageing.LIST_PER_PAGE;

        tranData.data.pageNo        = parseInt(tranData.req.body.txtPageNo, 10);
        tranData.data.listPerPage   = parseInt(tranData.req.body.slcListPerPage, 10);
        tranData.data.pagePerPaging = parseInt(gConfig.apps[0].pageing.PAGE_PER_PAGING, 10);

        tranData.data.movieCd     = tranData.req.body.txtMovieCd;
        tranData.data.downloadUrl   = gConfig.apps[0].download.FILE_MOVIE;
        tranData.data.detailData    = result;

        //tranData.data.downloadUrl2 = "/download/file/movie/" + tranData.req.body.txtMovieCd + "/"

        const fs = require('fs');

        var nowM = tranData.data.movieCd;
        //var cp = "";
        //var cp2 = "";

        //var files;

        try {
          //files = fs.readdirSync("./data/movie/" + nowM + "/test_latest/images");
          //var totalFiles = files.length; // return the number of files
          //console.log(totalFiles); // print the total number of files
          //var max = parseInt(totalFiles/2)

          //for(var i= (totalFiles/2)-2; i < (totalFiles/2) ; i++) {
          /*for(var i= max; i > 0 ; i--) {
            //if(nowM == 'LM20-0001') {
            var ct ="./data/movie/" + nowM + "/test_latest/images/frame" + i + "_real.png";
            var ct2 ="./data/movie/" + nowM + "/test_latest/images/frame" + i + "_fake.png";
            var cc ='../../' + nowM + "/test_latest/images/frame" + i + "_real.png";
            var cc2 ='../../' + nowM + "/test_latest/images/frame" + i + "_fake.png";
            console.log(ct);
            //}
            //else {
            //}
            if(fs.existsSync(ct) && fs.existsSync(ct2)){
              cp = cc;
              cp2 = cc2;
              break;
            }
          }

          tranData.data.detailData[0].image = cp;
          tranData.data.detailData[0].image2 = cp2;
          */

          /*dir = "./data/movie/" + nowM + "/test_latest/images/";

          var files = fs.readdirSync(dir)
              .map(function(v) {
                  return { name:v,
                           time:fs.statSync(dir + v).mtime.getTime()
                         };
               })
               .sort(function(a, b) { return a.time - b.time; })
               .map(function(v) { return v.name; });
               */


          files = "./data/movie/" + nowM + "/after/predictions.jpg";

          if(fs.existsSync(files)) {
            tranData.data.imageCheck = "good";

          }
          else {
            tranData.data.imageCheck = "none";
          }



          /*
          if(files.length < 2) {
            tranData.data.imageCheck = "none";
          }
          else {
            tranData.data.imageCheck = "good";
            tranData.data.imageFiles = files;
          }*/

          tranData.res.render(tranData.tranId, {tranData:tranData});


        } catch(err) {
          // An error occurred

          tranData.data.imageCheck = "none";
          console.error(err);
          tranData.res.render(tranData.tranId, {tranData:tranData});
        }
        /*
        fs.readdirSync( "./data/movie/" + nowM + "/test_latest/images", (error, files) => {
          var totalFiles = files.length; // return the number of files
          console.log(totalFiles); // print the total number of files

          for(var i= (totalFiles/2)-1; i < (totalFiles/2) ; i++) {
            //if(nowM == 'LM20-0001') {
            var ct ="./data/movie/" + nowM + "/test_latest/images/frame" + i + "_real.png";
            var ct2 ="./data/movie/" + nowM + "/test_latest/images/frame" + i + "_fake.png";
            var cc ='../../' + nowM + "/test_latest/images/frame" + i + "_real.png";
            var cc2 ='../../' + nowM + "/test_latest/images/frame" + i + "_real.png";
            console.log(ct);
            //}
            //else {
            //}
            if(fs.existsSync(ct) && fs.existsSync(ct2)){
              cp = cc;
              cp2 = cc2;
              break;
            }
          }
        });*/


      //  console.log(cp);

    }); // 생성 영상 조회 종료
}
function movie_management_fid(tranData){

  var dbParams    = [

      tranData.req.body.txtLearningCd,
      tranData.req.body.txtMovieCd
  ];

  gDb.query(`
  SELECT
      lg.dataset_cd,
      mv.fid_cd,
      mv.movie_state_cd
  FROM    learning lg, movie mv
  WHERE   lg.learning_cd  = ?
  AND     mv.movie_cd = ?
  `,
  dbParams,
  function(error, result, fields){
      if (error){
          console.log(error);
          gError.errorPage(tranData.res, error);
          return;
      }

      console.log(result);

      if(result[0].fid_cd == "READY" && result[0].movie_state_cd =="DONE") {

        var fs = require('fs');
        var path = require('path');

        var datasetCd = result[0].dataset_cd;


        var mir = './data/movie/' + tranData.req.body.txtMovieCd;
        var dir = './data/datasets/' + datasetCd;

        var iir1 = mir + '/' + 'test_latest/images';
        var iir2 = mir + '/' + 'test_latest/images2';

        var rimraf = require("rimraf");

        if (fs.existsSync(iir2)) {
          rimraf.sync(iir2);
        }
        fs.mkdirSync(iir2);

        //const regex = new RegExp('\\b' + "fake" + '\\b');

        fs.readdirSync(iir1).forEach(file => {

          //console.log(file);

          //if (file.includes("fake")) {
          if (file.substr(-8,4) == "fake") {
            //console.log(`Your word was found in file: ${file}`);
            fs.copyFileSync(iir1 + "/" + file, iir2 + "/" + file);
          }
        });


        var dbParams1    = [

            tranData.req.body.txtMovieCd
        ];

        gDb.query(`
            UPDATE movie SET fid_cd = "MAKING" WHERE movie_cd = ?
          `,
          dbParams1,
          function(error, result, fields){
              if (error){
                  console.log(error);
                  gError.errorPage(tranData.res, error);
                  return;
              }
              gDb.commit();

              var pyshell = require('python-shell');

              var dbParams2   = [
                datasetCd,
                tranData.req.body.txtMovieCd
              ];

              var options = {
                mode: 'text',
                pythonPath: 'python3',
                pytonOptions: ['-u'],
                scriptPath: './',
                args:dbParams2,
              };


              let py = pyshell.PythonShell.run('fid.py', options, function (err, results) {
                if (err) throw err;
                console.log('results: %j', results);

                var output = results[0].toString().split(/[  ]+/).pop();

                console.log(output);

                var dbParams3 = [
                  output,
                  tranData.req.body.txtMovieCd

                ];

                gDb.query(`
                    UPDATE movie SET fid_cd = "DONE", fid = ? WHERE movie_cd = ?
                  `,
                  dbParams3,
                  function(error, result, fields){
                      if (error){
                          console.log(error);
                          gError.errorPage(tranData.res, error);
                          return;
                      }
                      //console.log(result);

                      gDb.commit();

                });



              });





          });


        //if (fs.existsSync(lir2)) {
        //  fs.copyFileSync(lir2, cir2);
        //}


        tranData.tranId  = 'movie/movie_management_view';
        movie_management_view(tranData);

        //tranData.tranId  = 'movie/movie_management_list';
        //tranData.req.body.txtPageNo = 1
        //movie_management_list(tranData);
      }
      else {
        tranData.tranId  = 'movie/movie_management_list';
        tranData.req.body.txtPageNo = 1
        movie_management_list(tranData);
      }




  });
}

function movie_management_onen(tranData){

  var dbParams    = [
      tranData.req.body.txtMovieCd
  ];

  gDb.query(`
  SELECT
      mv.onen,
      mv.movie_state_cd
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

      console.log(result);

      if(result[0].onen == "READY" && result[0].movie_state_cd =="DONE") {

        var fs = require('fs');
        var path = require('path');

        //var datasetCd = result[0].dataset_cd;


        var mir = './data/movie/' + tranData.req.body.txtMovieCd;
        //var dir = './data/datasets/' + datasetCd;

        var iir1 = mir + '/' + 'test_latest/images';
        var iir3 = mir + '/' + 'test_latest/images3';
        var iir4 = mir + '/' + 'test_latest/images4';
        var iir5 = mir + '/' + 'test_latest/images5';

        var rimraf = require("rimraf");

        if (fs.existsSync(iir3)) {
          rimraf.sync(iir3);
        }
        fs.mkdirSync(iir3);

        if (fs.existsSync(iir4)) {
          rimraf.sync(iir4);
        }
        fs.mkdirSync(iir4);

        if (fs.existsSync(iir5)) {
          rimraf.sync(iir5);
        }
        fs.mkdirSync(iir5);

        var dbParams1    = [

            tranData.req.body.txtMovieCd
        ];

        gDb.query(`
            UPDATE movie SET onen = "MAKING" WHERE movie_cd = ?
          `,
          dbParams1,
          function(error, result, fields){
              if (error){
                  console.log(error);
                  gError.errorPage(tranData.res, error);
                  return;
              }
              gDb.commit();

              var pyshell = require('python-shell');

              var dbParams2   = [
                //datasetCd,
                tranData.req.body.txtMovieCd
              ];

              var options = {
                mode: 'text',
                pythonPath: 'python3',
                pytonOptions: ['-u'],
                scriptPath: './',
                args:dbParams2,
              };


              let py = pyshell.PythonShell.run('onen.py', options, function (err, results) {
                if (err) throw err;
                console.log('results: %j', results);

                var AdmZip = require('adm-zip');
                var iirPath3 = mir + '/' + tranData.req.body.txtMovieCd + "_3" + '.ZIP';
                var iirPath4 = mir + '/' + tranData.req.body.txtMovieCd + "_4" + '.ZIP';
                var iirPath5 = mir + '/' + tranData.req.body.txtMovieCd + "_5" + '.ZIP';
                var zipI3 = new AdmZip();
                var zipI4 = new AdmZip();
                var zipI5 = new AdmZip();
                zipI3.addLocalFolder(iir3);
                zipI3.writeZip(iirPath3);
                zipI4.addLocalFolder(iir4);
                zipI4.writeZip(iirPath4);
                zipI5.addLocalFolder(iir5);
                zipI5.writeZip(iirPath5);

                var dbParams3 = [
                //  output,
                  tranData.req.body.txtMovieCd

                ];

                gDb.query(`
                    UPDATE movie SET onen = "DONE" WHERE movie_cd = ?
                  `,
                  dbParams3,
                  function(error, result, fields){
                      if (error){
                          console.log(error);
                          gError.errorPage(tranData.res, error);
                          return;
                      }

                      //console.log(result);

                      gDb.commit();

                });



              });





          });


        //if (fs.existsSync(lir2)) {
        //  fs.copyFileSync(lir2, cir2);
        //}


        tranData.tranId  = 'movie/movie_management_view';
        movie_management_view(tranData);

        //tranData.tranId  = 'movie/movie_management_list';
        //tranData.req.body.txtPageNo = 1
        //movie_management_list(tranData);
      }
      else {
        tranData.tranId  = 'movie/movie_management_list';
        tranData.req.body.txtPageNo = 1
        movie_management_list(tranData);
      }




  });
}

module.exports  = resultDao;
