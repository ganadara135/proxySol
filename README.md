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



<br>

# 작동 방식                                                             <br>
##  가정 :   클라이언트에서 게시글 등록 요청을 하며 보낼 메시지와 시그니처 값을 전달, 릴레이 컨트렉트에서는 넘겨중 메시지를 풀어서 시그니처 검증후에 KingToken 에 게시글 등록 메소드 호출. <br>

1) BouncerProxy.sol 가 중계 역할을 함                                     <br>
2) BouncerProxy.sol 에서 KingToken.sol 의 메소드를 호출하는 방식으로 작동       <br>
3) KingToken 의 registerArticle()  메소드 호출,                             <br>
3-0) 호출자와 호출요청자로 나눠짐                                              <br>
3-1) 호출자는 BounserProxy의 owner or 화이트리스트 등록된자                    <br>
3-2) 호출요청자는 King 토큰을 가진 누구나, 게시판 등록 요청자임                     <br>
3-3) 호출요청자의 King 토큰 50 차감, 없으면 메소드 호출 중단됨                     <br>

#  배포시 주의사항  <br>
1) KingToken.sol 과 BouncerProxy.sol 배포 생성 계정은 같아야 함                  <br>
2) 자세한 계약코드 설명은 test.js 파일 확인
