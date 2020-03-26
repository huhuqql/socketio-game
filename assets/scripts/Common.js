// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const HallSocketType = {
    CREATE: 'create',
    JOIN: 'join',
    CREATE_SUCCESS: 'create_success',
    CREATE_FAIL: 'create_fail',
    JOIN_SUCCESS: 'join_success',
    JOIN_FAIL: 'create_fail',
}


const CommonSocketType = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect'
}

const RoomSocketType = {
    JOIN_ROOM: 'join_room',
    ROOM_STATUS: 'room_status',
    EXIT_ROOM: 'exit_room',
    START_GAME: 'start_game',
}

module.exports = {
    seed: 1,
    character: 0,
    playerId: 0,
    score: 0,

    isQueuing: false,
    gameOn: false,

    hallSocket:null, //队列
    gameSocket:null, //游戏场景

    roomKey: '',
    HallSocketType,
    CommonSocketType,
};