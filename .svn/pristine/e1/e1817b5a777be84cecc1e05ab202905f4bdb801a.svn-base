/**
 * mainDao.js mysql db 연결 객체를 생성하여 전달
 *
 * date : 20.03.20
 * author : sdkim
 */

var gDb         = require('../lib/db');
var gError      = require('../lib/error');
var gConfig     = require('../config');
var gMySql      = require('mysql');

var fs = require('fs');

var gDaoName    = 'learningDao';

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
      case 'learning/learning_management_create':
         learning_management_create(tranData);
         break;

      case 'learning/learning_management_createSave':
         learning_management_createSave(tranData);
         break;

      case 'learning/learning_management_list':
         learning_management_list(tranData);
         break;

      case 'learning/learning_management_view':
         learning_management_view(tranData);
         break;

      case 'learning/learning_management_delete':
         learning_management_delete(tranData);
         break;

      case 'learning/learning_modelManagement_create':
         learning_modelManagement_create(tranData);
         break;

      case 'learning/learning_modelManagement_update':
         learning_modelManagement_update(tranData);
         break;

      case 'learning/learning_modelManagement_createSave':
         learning_modelManagement_createSave(tranData);
         break;

      case 'learning/learning_modelManagement_deleteSave':
         learning_modelManagement_deleteSave(tranData);
         break;

      default:
         console.log(gError.userMessage.noPageHandler);
         var error   = new Error(gError.userMessage.noPageHandler);
         gError.errorPage(tranData.res, error);
         break;
   }
};

/**
 * 학습 생성 페이지로 이동
 *
 * @param {*} tranData
 */
function learning_management_create(tranData){

    // Dataset 조회
    gDb.query(`
    SELECT ds.dataset_cd, ds.dataset_nm FROM dataset ds WHERE use_yn = 'Y' ORDER BY dataset_cd
    `,
    function(error, result, fields){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            return;
        }
        tranData.data.listDataset  = result;

        // 딥러닝 모델 조회
        gDb.query(`
        SELECT lm.learning_model_cd, lm.learning_model_nm FROM learning_model lm WHERE use_yn = 'Y' ORDER BY learning_model_cd
        `,
        function(error, result, fields){
            if (error){
                console.log(error);
                gError.errorPage(tranData.res, error);
                return;
            }
            tranData.data.listLearningModel = result;

            gDb.query(`
            SELECT * from learning_model_params
            `,
            function(error, result, fields){
                if (error){
                    console.log(error);
                    gError.errorPage(tranData.res, error);
                    return;
                }
                tranData.data.listLearningModelParams = result;
                //console.log(result);

                tranData.res.render(tranData.tranId, {tranData:tranData});
              });

            // 화면 이동


        }); // 딥러닝 모델 조회 종료

    }); // Dataset 조회 종료
}

/**
 * 생성할 학습을 저장하고 리스트 페이지로 이동
 *
 * @param {*} tranData
 */
function learning_management_createSave(tranData){

    // 학습 cd 값 생성
    gDb.query(`
    SELECT   CONCAT('L', LEFT(CAST(YEAR(NOW()) AS CHAR(4)), 2), '-', LPAD(CAST(CAST(IFNULL(RIGHT(MAX(lg.learning_cd),4),'0000') AS SIGNED) + 1 AS CHAR(4)), 4, '0')) AS next_cd
    FROM     learning lg
    WHERE    lg.learning_cd LIKE CONCAT('L', LEFT(CAST(YEAR(NOW()) AS CHAR(4)), 2), '%')
    `,
    function(error, result, fields){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            return;
        }
        tranData.params.next_cd = result[0].next_cd;

        // 저장시 transaction 처리
        gDb.beginTransaction(function(error){
            if (error){
                console.log(error);
                gError.errorPage(tranData.res, error);
                gDb.rollback();

                return;
            }

            // 학습 insert
            var dbParams    = [
                tranData.params.next_cd,
                tranData.req.body.txtLearningNm,
                tranData.req.body.txtRemark,
                tranData.req.body.slcDatasetCd,
                tranData.req.body.slcLearningModelCd,
                0,
                'LEARNING'//'READY'
            ];

            gDb.query(`
            INSERT INTO learning(
                learning_cd,
                create_tm,
                learning_nm,
                remark,
                dataset_cd,
                learning_model_cd,
                now_epoch,
                learning_state_cd,
                start_tm
            ) VALUES (
                ?,      -- learning_cd,
                NOW(),  -- create_tm,
                ?,      -- learning_nm,
                ?,      -- remark,
                ?,      -- dataset_cd,
                ?,      -- learning_model_cd,
                ?,      -- now_epoch,
                ?,       -- learning_state_cd
                now()        -- start_tm
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

                // 학습 Params insert
                var dbParams2   = [
                    tranData.params.next_cd,
                    tranData.req.body.slcLearningModelCd,
                    tranData.req.body.GPU_IDS,
                    tranData.req.body.INPUT_NC,
                    tranData.req.body.n_epochs,
                    tranData.req.body.n_epochs_decay,
                    tranData.req.body.lr
                ];

                // 학습 파라미터 insert
                gDb.query(`
                INSERT INTO learning_params(
                    learning_cd,
                    learning_model_cd,
                    GPU_IDS,
                    INPUT_NC,
                    n_epochs,
                    n_epochs_decay,
                    LR
                ) VALUES (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )
                `,
                dbParams2,
                function(error, result, fields){
                    if (error){
                        console.log(error);
                        gError.errorPage(tranData.res, error);
                        gDb.rollback();
                        return;
                    }
                    gDb.commit();

                    tranData.tranId  = 'learning/learning_management_list';
                    learning_management_list(tranData);



                    //훈련
                    var dbParams3   = [
                        tranData.params.next_cd,
                        tranData.req.body.slcLearningModelCd,
                        tranData.req.body.GPU_IDS,
                        tranData.req.body.INPUT_NC,
                        tranData.req.body.n_epochs,
                        tranData.req.body.n_epochs_decay,
                        tranData.req.body.lr,
                        tranData.req.body.slcDatasetCd,
                        tranData.req.body.BATCH_SIZE
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
                    let py = pyshell.PythonShell.run('train.py', options, function (err, results) {
                      if (err) throw err;
                      console.log('results: %j', results);
                      fs.writeFileSync("pylog.txt", tranData.params.next_cd + " : " + results, {encoding: 'utf8'});

                      });

                      /*console.log('timeout start!');
                      setTimeout(function() {

                        py.end(function (err,code,signal) {
                          if (err) throw err;
                          console.log('The exit code was: ' + code);
                          console.log('The exit signal was: ' + signal);
                          console.log('finished');
                          //console.log('finished');

                        });*/


                        /*
                        pyshell.PythonShell.end(function (err,code,signal) {
                          if (err) throw err;
                          console.log('The exit code was: ' + code);
                          console.log('The exit signal was: ' + signal);
                          console.log('finished');
                          //console.log('finished');

                        }); */
                        /*
                        pyshell.PythonShell.terminate(function (signal) {
                          console.log('The exit signal was: ' + signal);
                          console.log('finished');

                        });

                      }, 3000);*/


                }); // learing params insert 종료

            }); // learing insert 종료

        }); // transaction 종료

    }); // learning_cd 조회 종료
}

/**
 * 학습 리스트를 조회
 *
 * @param {*} tranData
 */
function learning_management_list(tranData){

    learning_refresh(tranData);

    // 전체 건수 조회
    gDb.query(`
    SELECT COUNT(lg.learning_cd) total_cnt FROM learning lg
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
                            lg.learning_cd,
                            lg.create_tm,
                            DATE_FORMAT(lg.create_tm,'%Y.%m.%d') create_tm_desc,
                            lg.update_tm,
                            lg.learning_nm,
                            lg.remark,
                            lg.start_tm,
                            DATE_FORMAT(lg.start_tm,'%Y.%m.%d %T') start_tm_desc,
                            lg.end_tm,
                            DATE_FORMAT(lg.end_tm,'%Y.%m.%d %T') end_tm_desc,
                            lg.dataset_cd,
                            (SELECT ds.dataset_nm FROM dataset ds WHERE ds.dataset_cd = lg.dataset_cd) dataset_nm,
                            lg.learning_model_cd,
                            (SELECT lm.learning_model_nm FROM learning_model lm WHERE lm.learning_model_cd = lg.learning_model_cd) learning_model_nm,
                            lg.now_epoch,
                            lp.n_epochs,
                            lp.n_epochs_decay,
                            lg.learning_state_cd,
                            (SELECT common_nm FROM common_cd WHERE group_cd = 'LEARN_STAT' AND common_cd = lg.learning_state_cd) learning_state_nm
                    FROM    learning lg,
                            learning_params lp
                    WHERE   lg.learning_cd  = lp.learning_cd
                    ORDER BY lg.create_tm DESC
                ) ls

        `,
        //dbParams,// LIMIT ?, ?
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
 * 생성 학습 내용을 조회하고 상세 페이지로 이동
 *
 * @param {*} tranData
 */
function learning_management_view(tranData){

    learning_refresh(tranData);
    // Learning 조회
    if (typeof tranData.req.body.txtLearningCd == 'undefined'){
        console.log(gError.userMessage.noPageHandler);
        var error   = new Error(gError.userMessage.inValidParameter);
        gError.errorPage(tranData.res, error);
        return;
    }

    var dbParams    = [
        tranData.req.body.txtLearningCd
    ];
    gDb.query(`
    SELECT
        lg.learning_cd,
        lg.create_tm,
        DATE_FORMAT(lg.create_tm,'%Y.%m.%d') create_tm_desc,
        lg.update_tm,
        lg.learning_nm,
        lg.remark,
        lg.start_tm,
        DATE_FORMAT(lg.start_tm,'%Y.%m.%d %T') start_tm_desc,
        lg.end_tm,
        DATE_FORMAT(lg.end_tm,'%Y.%m.%d %T') end_tm_desc,
        lg.dataset_cd,
        (SELECT ds.dataset_nm FROM dataset ds WHERE ds.dataset_cd = lg.dataset_cd) dataset_nm,
        lg.learning_model_cd,
        (SELECT lm.learning_model_nm FROM learning_model lm WHERE lm.learning_model_cd = lg.learning_model_cd) learning_model_nm,
        lg.now_epoch,
        lp.n_epochs,
        lp.n_epochs_decay,
        lg.learning_state_cd,
        (SELECT common_nm FROM common_cd WHERE group_cd = 'LEARN_STAT' AND common_cd = lg.learning_state_cd) learning_state_nm,
        CONCAT('GPU_IDS=', lp.GPU_IDS, ', INPUT_NC=', lp.INPUT_NC, ', n_epochs=', n_epochs, ', n_epochs_decay=', n_epochs_decay, ', lr=', lr) params_desc
    FROM    learning lg,
            learning_params lp
    WHERE   lg.learning_cd  = lp.learning_cd
    AND     lg.learning_cd   = ?
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

        tranData.data.learningCd    = tranData.req.body.txtLearningCd;
        tranData.data.detailData    = result;

        function pad(n, width) {
          n = n + '';
          return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
        }

        var nowE = parseInt(result[0].now_epoch, 10);
        var nowL = result[0].learning_cd;
        var nowM = result[0].learning_model_cd;
        var nowD = result[0].dataset_cd;
        var cp = "";
        var cp2 = "";

        for(var i = nowE ; i > 0; i--) {
          //if(nowM == 'LM20-0001') {
          //var ct ='./data/dataset/' + nowD + '/' + nowL + "/web/images/" + "epoch" + pad(i,3) + "_real_A.png";
          //var ct2 ='./data/dataset/' + nowD + '/' + nowL + "/web/images/" + "epoch" + pad(i,3) + "_fake_B.png";
          var ct ='./data/checkpoints/' + nowL + "/web/images/" + "epoch" + pad(i,3) + "_real_A.png";
          var ct2 ='./data/checkpoints/' + nowL + "/web/images/" + "epoch" + pad(i,3) + "_fake_B.png";
          var cc ='../../' + nowL + "/web/images/" + "epoch" + pad(i,3) + "_real_A.png";
          var cc2 ='../../' + nowL + "/web/images/" + "epoch" + pad(i,3) + "_fake_B.png";
            console.log(ct);
          //}
          //else {
          //}
          if(fs.existsSync(ct) && fs.existsSync(ct2)){
            cp = cc;
            cp2 = cc2;
            console.log(cp);
            break;
          }
        }

        tranData.data.detailData[0].image = cp;
        tranData.data.detailData[0].image2 = cp2;
        tranData.data.table = "";

        var count = 0;
        var table = [];

        //var txt = './data/dataset/' + nowD + '/' + nowL + '/loss_log.txt';
        var txt = './data/checkpoints/' + nowL + '/loss_log.txt';
        console.log(txt);
        if (fs.existsSync(txt)) {
          //var lossLog = fs.readFileSync(txt, 'utf8');
          //console.log(lossLog);
          var stream = fs.createReadStream(txt);
          stream.setEncoding('utf8');
          var readline = require('readline');

          var line = readline.createInterface({
            input:stream,
            crlfDelay:Infinity
          });
          //console.log(line);

          line.on('line', function(line) {
            //console.log('한 줄 읽음 : ' + line);


            // 공백으로 구분
            var tokens = line.split(' ');

            if (tokens != undefined && tokens.length > 0 && count >= 1) {
              table[count-1] = [];
              table[count-1][0] = tokens[1].slice(0,-1);



              if(nowM == 'LM20-0001') {
                  table[count-1][1] = tokens[9];
                  table[count-1][2] = tokens[11];
                  table[count-1][3] = tokens[13];
                  table[count-1][4] = tokens[15];
                  table[count-1][5] = tokens[17];
                  table[count-1][6] = tokens[19];
                  table[count-1][7] = tokens[21];
                  table[count-1][8] = tokens[23];

              }
              else {
                table[count-1][1] = tokens[9];
                table[count-1][2] = tokens[11];
                table[count-1][3] = tokens[13];
                table[count-1][4] = tokens[15];
              }


              tranData.data.table = table;
              //console.log(tranData.data.table);
              //console.log('#' + count + ' -> ' + tokens[0]);
            }
            count += 1;

          });

          line.on('close', function(line) {
              //console.log(tranData.data);
              tranData.res.render(tranData.tranId, {tranData:tranData});
              //console.log(table);
          });

          //await tranData.data.table = table;
          /*
          stream.on('data',function(fileData) {
            console.log("data " + fileData);
            fildData.
          });
          stream.on('end', function(){
            console.log("---fileend---");
          })*/
        }
        else {
            //console.log(tranData.data);
            tranData.res.render(tranData.tranId, {tranData:tranData});
        }

        //if(count >= 1) {
        //  console.log(table);
        //  tranData.data.table = table;
        //}

        //console.log(tranData.data);



    }); // Learning 조회 종료
}

/**
 * 학습 내용을 삭제하고 리스트 화면으로 이동
 *
 * @param {*} tranData
 */
function learning_management_delete(tranData){

    if (typeof tranData.req.body.txtLearningCd == 'undefined'){
        console.log(gError.userMessage.noPageHandler);
        var error   = new Error(gError.userMessage.inValidParameter);
        gError.errorPage(tranData.res, error);
        return;
    }

    // 저장시 transaction 처리
    gDb.beginTransaction(function(error){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            gDb.rollback();

            return;
        }

        // 학습 delete
        var dbParams    = [
            tranData.req.body.txtLearningCd
        ];

        gDb.query(`
        DELETE FROM learning
        WHERE learning_cd  =  ?
        `,
        dbParams,
        function(error, result, fields){
            if (error){
                console.log(error);
                gError.errorPage(tranData.res, error);
                gDb.rollback();
                return;
            }

            gDb.query(`
            DELETE FROM learning_params
            WHERE learning_cd  =  ?
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

                //var fs = require('fs');
                //var dir = '../pytorch-CycleGAN-and-pix2pix/checkpoints/' + tranData.req.body.txtLearningCd;
                //console.log(tranData.req.body)
                //var dir = './data/dataset/' +  tranData.req.body.txtDatasetCd + '/' + tranData.req.body.txtLearningCd;
                var dir = './data/checkpoints/' + tranData.req.body.txtLearningCd;

                console.log(dir);

                var rimraf = require("rimraf");

                if (fs.existsSync(dir)) {
                  rimraf.sync(dir);
                }


                /*
                var dir2 = '../pytourch-CycleGAN-and-pix2pix/results/' + tranData.req.body.txtLearningCd;
                if (fs.existsSync(dir2)) {
                  rimraf.sync(dir2);
                }
                */

                tranData.req.body.txtPageNo = "1";
                tranData.tranId  = 'learning/learning_management_list';
                learning_management_list(tranData);
            }); // learing_params delete 종료

        }); // learing delete 종료

    }); // transaction 종료
}

function learning_refresh(tranData) {

  //console.log(tranData.req.body);
  gDb.query(`
    SELECT COUNT(lg.learning_state_cd) ing_cnt FROM learning lg WHERE lg.learning_state_cd = 'LEARNING'
  `,
  function(error, result, fields){
      if (error){
          console.log(error);
          gError.errorPage(tranData.res, error);
          return;
      }
      tranData.data.ingCnt = parseInt(result[0].ing_cnt, 10);


      if(tranData.data.ingCnt > 0) {
          gDb.query(`
              SELECT * FROM learning WHERE learning_state_cd = 'LEARNING'
            `,
            function(error, result, fields){
                if (error){
                    console.log(error);
                    gError.errorPage(tranData.res, error);
                    return;
                }
                //console.log(result);


                for(var i = 0; i<tranData.data.ingCnt; i++) {
                  /*var txt = '../pytorch-CycleGAN-and-pix2pix/checkpoints/' + result[i].learning_cd + '/loss_log.txt';
                  console.log(txt);
                  if (fs.existsSync(txt)) {
                    var lossLog = fs.readFileSync(txt, 'utf8');
                    console.log(lossLog);
                  }*/

                  console.log ("currenti : " + i);
                  console.log(result[i]);

                  tranData.data.ingCd = result[i].learning_cd;
                  var dbParams = [
                    tranData.data.ingCd
                  ];
                  tranData.data.nowEpoch = parseInt(result[i].now_epoch, 10);
                  tranData.data.modelCd = result[i].learning_model_cd;
                  tranData.data.dataCd = result[i].dataset_cd;

                  gDb.query(`
                      SELECT * FROM learning_params WHERE learning_cd = ?
                    `,
                    dbParams,
                    function(error, result, fields){
                        if (error){
                            console.log(error);
                            gError.errorPage(tranData.res, error);
                            return;
                        }
                        console.log("paramsqueryStart");
                        console.log(result[0]);

                        tranData.data.maxEpoch = parseInt(result[0].n_epochs, 10) + parseInt(result[0].n_epochs_decay, 10);
                        //tranData.data.endTm = 'null';

                        console.log("j value: " +tranData.data.nowEpoch + " " +tranData.data.maxEpoch);

                        for(var j = tranData.data.nowEpoch ; j < tranData.data.maxEpoch; j++) {

                          console.log("currentj : " + j);
                          if(tranData.data.modelCd == 'LM20-0001') {
                            //var cp = '../pytorch-CycleGAN-and-pix2pix/checkpoints/' + tranData.data.ingCd + "/" + (j+1) + "_net_G_B.pth";
                            var cp = './data/checkpoints/' + tranData.data.ingCd + "/" + (j+1) + "_net_G_B.pth";
                            console.log(cp);
                          }
                          else {
                            //var cp = '../pytorch-CycleGAN-and-pix2pix/checkpoints/' + tranData.data.ingCd + "/" + (j+1) + "_net_G.pth";
                            var cp = './data/checkpoints/' + tranData.data.ingCd + "/" + (j+1) + "_net_G.pth";
                            console.log(cp);

                          }

                          if(fs.existsSync(cp)) {
                            var tzoffset = (new Date()).getTimezoneOffset() * 60000;
                            var stat = fs.statSync(cp);
                            tranData.data.endTm = new Date(stat.birthtimeMs-tzoffset).toISOString().slice(0, 19).replace('T', ' ');
                          }
                          else {
                            break;
                          }

                          /*
                          var cp = '../pytorch-CycleGAN-and-pix2pix/checkpoints/' + tranData.data.ingCd + "/" + (j+1) + "_net_G_B.pth";
                          var cp2 = '../pytorch-CycleGAN-and-pix2pix/checkpoints/' + tranData.data.ingCd + "/" + (j+1) + "_net_G.pth";
                          console.log(cp);
                          if(fs.existsSync(cp) || fs.existsSync(cp2)) {
                            var tzoffset = (new Date()).getTimezoneOffset() * 60000;
                            if(fs.existsSync(cp)) {
                                var stat = fs.statSync(cp);
                                tranData.data.endTm = new Date(stat.birthtimeMs-tzoffset).toISOString().slice(0, 19).replace('T', ' ');
                                // tranData.data.endTm = stat.birthtimeMs;
                            }
                            //  tranData.data.endTm = fs.statSync(cp).birthtimeMs;
                            else {
                            //  tranData.data.endTm = fs.statSync(cp2).birthtimeMs;
                              var stat = fs.statSync(cp2);
                              tranData.data.endTm = new Date(stat.birthtimeMs-tzoffset).toISOString().slice(0, 19).replace('T', ' ');
                            }
                          }

                          else {
                            break;
                          }*/

                        }




                        if(j >= tranData.data.nowEpoch) {

                          tranData.data.cEpoch = parseInt(j, 10);

                          if(j == tranData.data.maxEpoch) {
                            tranData.data.cState = 'DONE';

                            var dbParams2 = [
                              tranData.data.cEpoch,
                              tranData.data.cState,
                              tranData.data.endTm,
                              tranData.data.ingCd

                            ];

                            console.log(dbParams2);

                            gDb.query(`
                                UPDATE learning SET now_epoch = ?, learning_state_cd = ?, end_tm = ? WHERE learning_cd = ?
                              `,
                              dbParams2,
                              function(error, result, fields){
                                  if (error){
                                      console.log(error);
                                      gError.errorPage(tranData.res, error);
                                      return;
                                  }
                              });
                              gDb.commit();
                          }
                          else {
                            tranData.data.cState = 'LEARNING';

                            var dbParams2 = [
                              tranData.data.cEpoch,
                              tranData.data.cState,
                              tranData.data.ingCd,
                            ];

                            console.log(dbParams2);

                            gDb.query(`
                                UPDATE learning SET now_epoch = ?, learning_state_cd = ? WHERE learning_cd = ?
                              `,
                              dbParams2,
                              function(error, result, fields){
                                  if (error){
                                      console.log(error);
                                      gError.errorPage(tranData.res, error);
                                      return;
                                  }
                              });
                              gDb.commit();
                          }


                            //tranData.data.endTm = null;
                        }
                        //console.log(result);
                        //console.log(tranData.data);
                            //tranData.data.endTm = 'null';

                    });

                }
            });
        }
    });
}

/**
 * 학습 모델 생성 페이지로 이동
 *
 * @param {*} tranData
 */
function learning_modelManagement_create(tranData){

    // 모델 조회
    gDb.query(`
    SELECT
            lm.learning_model_cd,
            lm.learning_model_nm,
            lm.use_yn,
            CASE WHEN lm.use_yn = 'Y' THEN '사용됨' ELSE '미사용' END use_yn_desc
    FROM    learning_model lm
    ORDER BY learning_model_cd
    `,
    function(error, result, fields){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            return;
        }
        tranData.data.listLearningModel = result;

        // 화면 이동
        tranData.res.render(tranData.tranId, {tranData:tranData});

    }); // 딥러닝 모델 조회 종료
}

/**
 * 학습 모델 정보 조회 페이지로 이동
 *
 * @param {*} tranData
 */
function learning_modelManagement_update(tranData){

    var dbParams    = [
        tranData.req.body.txtLearningModelCd
    ];

    // 모델 조회
    gDb.query(`
    SELECT
            lm.learning_model_cd,
            lm.create_tm,
            DATE_FORMAT(lm.create_tm,'%Y.%m.%d %T') create_tm_desc,
            lm.update_tm,
            IFNULL(DATE_FORMAT(lm.update_tm,'%Y.%m.%d %T'), ' ') update_tm_desc,
            lm.learning_model_nm,
            lm.remark,
            lm.use_yn,
            CASE WHEN lm.use_yn = 'Y' THEN '사용됨' ELSE '미사용' END use_yn_desc
    FROM    learning_model lm
    WHERE   lm.learning_model_cd = ?
    `,
    dbParams,
    function(error, result, fields){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            return;
        }
        tranData.data.listLearningModel = result;

        // 모델 파라미터 조회
        gDb.query(`
        SELECT
                 mp.param_idx,
                 mp.param_nm,
                 mp.default_val
        FROM     learning_model_params mp
        WHERE    mp.learning_model_cd = ?
        ORDER BY mp.param_idx
        `,
        dbParams,
        function(error, result, fields){
            if (error){
                console.log(error);
                gError.errorPage(tranData.res, error);
                return;
            }
            tranData.data.listLearningModelParams = result;

            var jsonDatas = JSON.stringify(tranData.data);
            tranData.res.writeHead(200,
                { "Content-Type": "application/json;characterset=utf-8" }
            );
            tranData.res.write(jsonDatas);
            tranData.res.end();

        }); // 모델 파라미터 조회 종료


    }); // 모델 조회 종료
}

/**
 * 학습 모델 정보를 새로 생성하거나 수정
 *
 * @param {*} tranData
 */
function learning_modelManagement_createSave(tranData){

    // 저장시 transaction 처리
    gDb.beginTransaction(function(error){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            gDb.rollback();

            return;
        }

        // insert
        if (tranData.req.body.txtLearningModelCd == ""){

            gDb.query(`
            SELECT   CONCAT('LM', LEFT(CAST(YEAR(NOW()) AS CHAR(4)), 2), '-', LPAD(CAST(CAST(IFNULL(RIGHT(MAX(lm.learning_model_cd),4),'0000') AS SIGNED) + 1 AS CHAR(4)), 4, '0')) AS next_cd
            FROM     learning_model lm
            WHERE    lm.learning_model_cd LIKE CONCAT('LM', LEFT(CAST(YEAR(NOW()) AS CHAR(4)), 2), '%')
            `,
            function(error, result, fields){
                if (error){
                    console.log(error);
                    gError.errorPage(tranData.res, error);
                    gDb.rollback();
                    return;
                }
                tranData.req.body.txtLearningModelCd    = result[0].next_cd;

                var dbParams    = [
                    tranData.req.body.txtLearningModelCd,
                    tranData.req.body.txtLearningModelNm,
                    tranData.req.body.txtRemark,
                ];

                gDb.query(`
                INSERT INTO learning_model(
                   learning_model_cd,
                   create_tm,
                   learning_model_nm,
                   remark,
                   use_yn
               ) VALUES (
                    ?,    -- learning_model_cd,
                   NOW(), -- create_tm,
                   ?,     -- learning_model_nm,
                   ?,     -- remark,
                   'N'    -- use_yn
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

                    insertModelParams(tranData);
                });
            }); // insert 종료

        } // if... 종료
        else {
                var dbParams    = [
                    tranData.req.body.txtLearningModelCd,
                    tranData.req.body.txtLearningModelNm,
                    tranData.req.body.txtRemark,
                ];

                gDb.query(`
                UPDATE learning_model
                SET
                   update_tm            = NOW(),
                   learning_model_nm    = ?,
                   remark               = ?
                WHERE learning_model_cd = ?
                `,
                dbParams,
                function(error, result, fields){
                    if (error){
                        console.log(error);
                        gError.errorPage(tranData.res, error);
                        gDb.rollback();
                        return;
                    }

                    insertModelParams(tranData);
                });

        } // elsee 종료

    }); // transaction 종료
}

// 모델 파라미터 등록
// 이전에 transaction 범위에 속해야 됨
function insertModelParams(tranData){

    var dbParams    = [
        tranData.req.body.txtLearningModelCd,
    ];

    // 학습 모델 파라미터 delete
    gDb.query(`
    DELETE FROM learning_model_params
    WHERE learning_model_cd = ?
    `,
    dbParams,
    function(error, result, fields){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            gDb.rollback();
            return;
        }

        // 학습 모델 파라미터 insert
        var paramNms        = tranData.req.body.txtParamNm;
        var defaultVals     = tranData.req.body.txtDefaultVal;
        var insertValArr    = [];
        var insertVal;
        for (var i=0; i<paramNms.length; i++){
            insertVal   = [tranData.req.body.txtLearningModelCd, paramNms[i], defaultVals[i]];
            insertValArr.push(insertVal);
        }

        var sql     = "INSERT INTO learning_model_params (learning_model_cd, param_nm, default_val) VALUES (?,?,?); ";
        var sqls    = "";
        insertValArr.forEach(function(item){
            sqls    += gMySql.format(sql, item);
        });

        gDb.query(sqls,
        function(error, result, fields){
            if (error){
                console.log(error);
                gError.errorPage(tranData.res, error);
                gDb.rollback();
                return;
            }

            gDb.commit();

            tranData.tranId  = 'learning/learning_modelManagement_create';
            learning_modelManagement_create(tranData);
        }); // learing_model_params insert 종료

    }); // learing_model_params delete 종료

}

// 학습 모델 정보 삭제
function learning_modelManagement_deleteSave(tranData){

    // 저장시 transaction 처리
    gDb.beginTransaction(function(error){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            gDb.rollback();

            return;
        }

        // delete
        var sql = `
        DELETE FROM learning_model where learning_model_cd = ? ;
        DELETE FROM learning_model_params where learning_model_cd = ? ;
                `;
        var sqls    = gMySql.format(sql, [tranData.req.body.txtLearningModelCd, tranData.req.body.txtLearningModelCd]);

        gDb.query(sqls,
        function(error, result, fields){
            if (error){
                console.log(error);
                gError.errorPage(tranData.res, error);
                gDb.rollback();
                return;
            }

            gDb.commit();
            tranData.req.body.txtLearningModelCd    = "";

            tranData.tranId  = 'learning/learning_modelManagement_create';
            learning_modelManagement_create(tranData);

        }); // delete 종료

    }); // transaction 종료
}

module.exports  = resultDao;
