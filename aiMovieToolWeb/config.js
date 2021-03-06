/**
 * config.js 시스템에서 환경 변수 관리
 *
 * date : 20.03.20
 * author : sdkim
 */

module.exports = {
   apps : [
      {
         // pm2로 실행한 프로세스 목록에서 이 애플리케이션의 이름으로 지정될 문자열
         name : "ai_movie_tool",
         // pm2로 실행될 파일 경로
         script : "./bin/ai_movie_tool",
         // 개발환경시 적용될 설정 지정
         env : {
            PORT : 3001,
            NODE_ENV : "development",
            DB_CONN_IP : "ivcjyoungsoft.duckdns.org",
            DB_CONN_ID : "jysoft",
            DB_CONN_PW : "jy.soft1910",
            DB_CONN_DB : "aiToolDB2"
         },
         // 배포환경시 적용될 설정 지정
         env_production: {
            PORT : 3001,
            NODE_ENV : "production",
            DB_CONN_IP : "aijyoungsoft.duckdns.org",
            DB_CONN_ID : "jysoft",
            DB_CONN_PW : "jy.soft1910",
            DB_CONN_NM : "aiToolDB2"
         },
         // paging 상수값
         pageing : {
            LIST_PER_PAGE : 10,
            PAGE_PER_PAGING : 10
         },
         // root 경로 설정
         rootDirName : "",
         // 다운로드 경로
         download : {
            FILE_DATASET : "/download/file/datasets/", // dsCd(dataset_cd)/trainType(X or Y)
            FILE_MOVIE : "/download/file/movie/"
         }
      }
   ]
}
