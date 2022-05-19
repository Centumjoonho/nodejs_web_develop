/**
 * mainDao.js mysql db 연결 객체를 생성하여 전달
 *
 * date : 20.03.20
 * author : sdkim
 */

var gDb         = require('../lib/db');
var gError      = require('../lib/error');
var gDaoName    = 'mainDao';

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
      case 'main/main_main_view':
         main_main_view(tranData);
         break;

      default:
        console.log(gError.userMessage.noPageHandler);
        var error   = new Error(gError.userMessage.noPageHandler);
        gError.errorPage(tranData.res, error);
        break;
   }
};

/**
 * view 관련 데이타를 조회
 *
 * @param {*} tranData
 */
function main_main_view(tranData){

    /*gDb.query('SELECT * FROM AUTHOR WHERE ID = ?', [tranData.params.dbParamId], function(error, result, fields){
        // DB 데이타 설정
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            return;
        }
        tranData.data   = {result:result};
        console.log(result);

        // 페이지 전달
        tranData.res.render(tranData.tranId, {tranData:tranData});
    });*/

    //db: 등록 건 	 	학습 건 	 등록 모델 개수 	등록 모델
    //learning 학습   완료
    //movie 최근 사용 모델 	 	최근 생성 시나리오 	등록 건 	 	생성 건

    gDb.query(`
      SELECT * FROM dataset
      `
    , function(error, result, fields){
        // DB 데이타 설정
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            return;
        }
        //tranData.data   = {result:result};
        //console.log(result.length);
        tranData.data.dsize = result.length;

        var dsnow = 0;
        var dfire = 0;
        var dflood = 0;
        var dtide = 0;
        var dother = 0;

        for(var i=0; i<result.length; i++) {
          if(result[i].scenario_cd == "SNOW") {
            dsnow++;
          }
          else if(result[i].scenario_cd == "FIRE") {
            dfire++;
          }
          else if(result[i].scenario_cd == "FLOOD") {
            dflood++;
          }
          else if(result[i].scenario_cd == "TIDE") {
            dtide++;
          }
          else {
            dother++;
          }
        }

        tranData.data.dsnow = dsnow;
        tranData.data.dfire = dfire;
        tranData.data.dflood = dflood;
        tranData.data.dtide = dtide;
        tranData.data.dother = dother;
        //console.log(result);

        gDb.query(`
          SELECT

          lg.learning_cd,
          lg.learning_nm,
          lg.start_tm,
          DATE_FORMAT(lg.start_tm,'%Y.%m.%d %T') start_tm_desc,
          lg.end_tm,
          DATE_FORMAT(lg.end_tm,'%Y.%m.%d %T') end_tm_desc,
          lg.dataset_cd,
          lg.learning_state_cd


          FROM learning lg ORDER BY create_tm DESC
          `
        , function(error, result, fields){
            // DB 데이타 설정
            if (error){
                console.log(error);
                gError.errorPage(tranData.res, error);
                return;
            }
            //tranData.data   = {result:result};
            tranData.data.lsize = result.length;
            var ldone = 0;
            var lready = 0;


            for(var i=0; i<tranData.data.lsize; i++) {
              if(result[i].learning_state_cd == "DONE") {
                ldone++;
              }
              else {
                lready++;
              }
            }
            tranData.data.ldone = ldone;
            tranData.data.lready = lready;
            tranData.data.llist = result;


            //console.log(result);

            gDb.query(`
              SELECT * FROM learning_model
              `
            , function(error, result, fields){
                // DB 데이타 설정
                if (error){
                    console.log(error);
                    gError.errorPage(tranData.res, error);
                    return;
                }

                //tranData.data   = {result:result};
                tranData.data.msize = result.length;

                var mlist  = "";
                for(var i=0; i<tranData.data.msize; i++) {
                  if(i == 0) {
                    mlist = result[i].learning_model_nm;
                  }
                  else {
                    mlist = mlist + ", " + result[i].learning_model_nm;
                  }
                }
                tranData.data.mlist = mlist;
                //console.log(tranData.data);

                gDb.query(`
                  SELECT mv.learning_cd, mv.movie_state_cd,(SELECT common_nm FROM common_cd WHERE group_cd = 'SCENARIO' AND common_cd = mv.scenario_cd) scenario_nm FROM movie mv ORDER BY create_tm DESC
                  `
                , function(error, result, fields){
                    // DB 데이타 설정
                    if (error){
                        console.log(error);
                        gError.errorPage(tranData.res, error);
                        return;
                    }
                    if(result.length == 0 )
                    {
                      //tranData.res.render(tranData.tranId, {tranData:tranData});
                      tranData.data.vcd = "";
                      var dbParams = [
                        null
                      ];
                    }
                    else {
                      tranData.data.vcd = result[0].scenario_nm;
                      var dbParams = [
                        result[0].learning_cd
                      ];
                    }
                    //console.log(result);

                    tranData.data.vsize = result.length;
                    //tranData.data.vcd = result[0].scenario_cd;

                    var vdone = 0;
                    var vready = 0;

                    for(var i=0; i<tranData.data.vsize; i++) {
                      if(result[i].movie_state_cd == "DONE") {
                        vdone++;
                      }
                      else {
                        vready++;
                      }
                    }
                    tranData.data.vdone = vdone;

                    //console.log(tranData.data);

                    //tranData.res.render(tranData.tranId, {tranData:tranData});
                    tranData.res.render(tranData.tranId, {tranData:tranData});

                    /*

                    gDb.query(`
                      SELECT * FROM learning_params WHERE learning_cd = ?
                      `,
                      dbParams
                    , function(error, result, fields){
                        // DB 데이타 설정
                        if (error){
                            console.log(error);
                            gError.errorPage(tranData.res, error);
                            return;
                        }
                        if(result.length == 0 )
                        {
                          //tranData.res.render(tranData.tranId, {tranData:tranData});
                          var dbParams2 = [
                            null
                          ]
                        }
                        else {
                          var dbParams2 = [
                            result[0].learning_model_cd
                          ]
                        }



                        gDb.query(`
                          SELECT * FROM learning_model WHERE learning_model_cd = ?
                          `,
                          dbParams2
                        , function(error, result, fields){
                            // DB 데이타 설정
                            if (error){
                                console.log(error);
                                gError.errorPage(tranData.res, error);
                                return;
                            }
                            if(result.length == 0 )
                            {
                              //tranData.res.render(tranData.tranId, {tranData:tranData});
                              tranData.data.vmodel="";
                            }
                            else {
                                tranData.data.vmodel = result[0].learning_model_nm;
                            }




                            console.log(tranData.data);

                            //tranData.res.render(tranData.tranId, {tranData:tranData});
                            tranData.res.render(tranData.tranId, {tranData:tranData});


                            // 페이지 전달
                        });

                        //tranData.res.render(tranData.tranId, {tranData:tranData});

                        // 페이지 전달
                    });

                    */

                    // 페이지 전달
                });

                // 페이지 전달
            });



            // 페이지 전달
        });

        // 페이지 전달
    });




    //tranData.res.render(tranData.tranId);

}

module.exports  = resultDao;
