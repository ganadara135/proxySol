# Docker 실행 방법 <br>
# 열어주는 포트  9545, 3000, 3001  <br>
\> docker run -it -p 9545:9545 -p 3000:3000 -p 3001:3001  --volume=$(pwd):/proxy/  --name proxySol -d node <br>
\> npm i -g n    <br>
\> n stable      <br>
\> node -v      // 버전 체크, 안 바뀔수가 있으면, 현재 truffle 은  node version 10.1^.0 에서 정상 작동함   <br>
\> npm i         <br>
\> npm i --unsafe-perm -g truffle        <br>
\> truffle develop                       <br>

<br>

## ----------------   truffle 내부에서         <br>
\>> compile                                 <br>
\>> migrate                                  <br>
\>> test                                     <br>


##    현재 작성된 소스는 클라이언트에서 보낸 데이터가  해시값으로 감싸있다고 전제한 부분까지 작성돼 있음, 릴레이 컨트렉트에서는 넘겨중 파일을 풀어서 시그니처 검증후에 나머지 작업 처리.
