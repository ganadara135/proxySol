
# 작동 방식                                                             <br>
##  가정 :   클라이언트에서 게시글 등록 요청을 하며, 보낼 메시지와 시그니처 값을 전달, 릴레이 컨트렉트에서는 넘겨중 메시지를 풀어서 시그니처 검증후에 KingToken 에 게시글 등록 메소드 호출. <br>

0) 중계 역할하는 Backend 서버가 필요에 따라서 BouncerProxy 호출                  <br>
1) BouncerProxy.sol 가 중계에 필요한 기능 제공                                 <br>
2) KingToken.sol 토큰에 관한 기능 제공                                       <br>
3) 게시판 등록시 KingToken 의 registerArticle()  메소드 호출,                  <br>
3-0) 호출자와 호출요청자로 나눠짐                                              <br>
3-1) 호출자는 BounserProxy의 owner 또는 화이트리스트로 등록된 자                   <br>
3-2) 호출요청자는 King 토큰을 가진 누구나, 게시판 등록 요청자임                     <br>
3-3) 호출요청자의 King 토큰 50 차감, 없으면 메소드 호출 중단됨                     <br>

#  배포시 주의사항                                                          <br>
1) KingToken.sol 과 BouncerProxy.sol 배포 생성 계정은 같아야 함                  <br>
2) 자세한 계약코드 설명은 test.js 파일 확인                                     <br>


# Docker 실행 방법                                                          <br>
# 열어주는 포트  9545, 8545, 3000, 3001                                            <br>
\> docker run -it -p 9545:9545 -p 8545:8545 -p 3000:3000 -p 3001:3001  --volume=$(pwd):/proxy/  --name proxySol -d node <br>
\> npm i -g n                                                               <br>
\> n 10.16.0                                                                 <br>
\> node -v      // 버전 체크, 안 바뀔수가 있으면, 현재 truffle 은  node version 10.1^.0 에서 정상 작동함   <br>
\> npm i                                                                    <br>
\> npm i --unsafe-perm -g truffle                                           <br>
\> truffle develop   // 이것보단 아래 truffle console + ganache 로 가동                                 <br>
\> npm i -g ganache-cli
<br>

##   ganache-cli    서버 가동                                                <br>
\>>  npx ganache-cli                                                         <br>


##   truffle 가동                                                           <br>
\>> truffle console --network development                                 <br>
\>> compile                                                                  <br>
\>> migrate --reset                                                              <br>
\>> test                   // test 폴더 밑에 *.js 실행                                              <br>


##  truffle 테스트 결과 캡처
<img width="1111" alt="registerArtcle event" src="https://user-images.githubusercontent.com/24896007/68085300-e0122580-fe82-11e9-87d4-80322f48818b.png">
![test capture](https://user-images.githubusercontent.com/24896007/67766404-b4adc600-fa91-11e9-9fa3-292b7beeb821.png)