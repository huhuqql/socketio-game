const { io } = require('../app');
const { maps } = require("./common");
const Map = require('./map.js');
const { HallSocketType, CommonSocketType } = require("../type/socket.type");

class Hall {

  constructor() {
    this.playerCount = 0;
    this.socket = null;
    this.waitingQueue = new Set();
  }

  init() {
    this.socket = io.of("/hall").on("connection", (socket) => {
      this.playerCount++;
      console.log("有人加入了大厅，现在大厅一共", this.playerCount, '人');
      let uniqueKey = '';

      /** 监听用户开始匹配队列 */
      socket.on('start_queue', () => {
        const key = this.findAvailableQueue();
        if(key){
          this.createMap(key);
          this.socket.emit('map_ready', {key, seed: Math.floor(Math.random() * 1000)});
        }
        else{
          const key = this.generateRandomString();
          uniqueKey = key;
          this.waitingQueue.add(key);
          socket.emit('key_generated', {key});
        }
      });

      /** 监听用户离开当前大厅 */
      socket.on(CommonSocketType.DISCONNECT, () => {
        this.playerCount--;
        this.waitingQueue.delete(uniqueKey);
        console.log("有人退出了大厅，现在大厅一共", this.playerCount, '人');
      });
    });
  };

  createMap(key) {
    const map = new Map(key);
    map.init();
    maps.set(key, map);
  };

  generateRandomString() {
    let ret = "";
    for (let i = 0; i < 7; i++) {
      ret += String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
    return ret;
  };

  findAvailableQueue(){
    if(this.waitingQueue.size === 0){
      return null;
    }
    else{
      const key = this.waitingQueue.values().next().value;
      this.waitingQueue.delete(key);
      return key;
    }
  }
}

module.exports =  Hall;
