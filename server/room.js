const { io } = require('../app.js');
const { rooms, maps } = require("./common");
const Map = require('./map.js');
const { RoomSocketType, CommonSocketType } = require("../type/socket.type");

class Room {

    constructor(id) {
        this.id = id;
        this.playerCount = 0;
        this.playerList = ['', '', ''];
        this.socket = null;
    }
  
    init() {
        this.socket = io.of(`/room${this.id}`).on(CommonSocketType.CONNECT,(socket) => {
            this.playerCount++;
            console.log(`有人进入了房间${this.id}号，房间${this.id}号现在有${this.playerCount}人`);
            let index = this.findFirstAvailableSlotinRoom(this) || 0;
            
            socket.on(RoomSocketType.JOIN_ROOM, (data) => {
                this.updatePlayerStatus(data, index);
                this.broadcastRoomStatus();
            });

            socket.on(RoomSocketType.START_GAME, () => {
                this.createMap(this.id);
                this.socket.emit(RoomSocketType.START_GAME);
            });

            // 用户退出，通告房间里其他用户
            socket.on(CommonSocketType.DISCONNECT,() => {
                this.playerCount--;
                this.playerList[index] = '';
                this.broadcastRoomStatus();
                console.log(`有人退出了房间${this.id}号，房间${this.id}号现在有${this.playerCount}人`);
                if(this.playerCount === 0){
                    rooms.delete(this.id);
                    socket.disconnect();
                    socket = null;
                }
            });

        });
    };

    createMap(key) {
        const map = new Map(key);
        map.init();
        maps.set(key, map);
    };
    

    /**
     * 
     * @param {any} data 玩家信息
     * @param {number} index 玩家位置
     */
    updatePlayerStatus(data, index) {
        this.playerList[index] = new Player(data);
    }

    /**
     * 全局广播房间状态
     */
    broadcastRoomStatus(){
        this.socket.emit(RoomSocketType.ROOM_STATUS, this.playerList);
    }

    /**
     * 查找第一个空的位置
     */
    findFirstAvailableSlotinRoom(room){
        const list = room.playerList;
        for(let i = 0; i < list.length; i++){
            if(list[i] === ''){
                return i;
            }
        }
    }
}

class Player {
    constructor(id, isHost, avatar){
        this.id = id;
        this.isHost = isHost;
        this.avatar = avatar;
    }
}
  
module.exports =  Room;
  

