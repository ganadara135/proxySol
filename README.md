# Docker 실행 방법 <br>
# 열어주는 포트  9545, 3000, 3001  <br>
\> docker run -it -p 9545:9545 -p 3000:3000 -p 3001:3001  --volume=$(pwd):/proxy/  --name proxySol -d node <br>
\> npm i -g n    <br>
\> n stable      <br>
\> npm i         <br>
\> npm i --unsafe-perm -g truffle        <br>
\> truffle develop                       <br>

<br>

## ----------------   truffle 내부에서         <br>
\>> compile                                 <br>
\>> migrate                                  <br>
\>> test                                     <br>