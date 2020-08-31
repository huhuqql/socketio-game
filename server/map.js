const { io } = require('../app.js');
const { maps } = require("./common");
const { CommonSocketType } = require("../type/socket.type");

class MapOne {

    constructor(id) {
        this.id = id;
        this.socket = null;
        this.playerCount = 0;
        this.playerStatus = {};
        this.gameOn = true;
        this.halfwayDone = false;
    }
  
    init() {
        this.socket = io.of(`/map${this.id}`).on('connection',(socket) => {

            this.playerCount++;
            console.log(`有人进入了游戏${this.id}号, 现在房间一共${this.playerCount}人`);

            socket.on('player_enter', (data) => {
                console.log(`有人成功加入了游戏${this.id}号`);
                console.log(data);
                this.playerStatus[data.playerId] = data;
                this.socket.emit('player_enter', this.playerStatus);
            });

            socket.on('report_status', (status) => {
                this.playerStatus[status.playerId] = status;
                if(status.playerStatus.score >= 150){
                    if(this.gameOn){
                        this.gameOn = false;
                        this.socket.emit('game_end', this.playerStatus);
                    }
                }
                else if(status.playerStatus.score >= 100){
                    if(!this.halfwayDone){
                        this.halfwayDone = true;
                        this.socket.emit('world_break');
                    }
                }
            });

            socket.on(CommonSocketType.DISCONNECT, () => {
                this.playerCount--;
                console.log(`有人退出了游戏${this.id}号, 现在房间一共${this.playerCount}人`);
            });
        });

        let gameStatusUpdate = setInterval(() => {
            if(this.gameOn){
                this.socket.emit('broadcast_status', this.playerStatus);
            }
        }, 30);
    };
}
  
module.exports =  MapOne;