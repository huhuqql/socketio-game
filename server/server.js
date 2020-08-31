let app = require('express')();
let server = require('http').Server(app);
let io =require('socket.io')(server);
require('hall.js');

server.listen(4747,function(){
    console.log('开始监听端口: 4747');
});

function Room(){
    this.people = 0;
    this.peopleList = ['', '', ''];
    this.socket = null;
    gameOn = false;
    playerStatusList = [undefined, undefined, undefined];
}

const MAX_ROOM = 10;

let rooms = []; //匹配队列

let dt = 1000/60;

for(let i = 0; i < MAX_ROOM; i++){
    rooms[i] = new Room();
}

io.on('connection',function(socket){
    console.log('someone connected');   
    socket.on('disconnect',function(){
        console.log('someone disconnected');    
    });
});

// 等待房间界面
for(let i = 0; i < MAX_ROOM; i++){
    const room = rooms[i];
    const nsp = io.of(`/room${i}`);
    nsp.on('connection',function(socket){
        room.people++;
        room.playerStatusList = ['', '', ''];
        room.gameOn = false;
        console.log(`Someone entered Room ${i}. There are ${room.people} people in room`);
        let index = 0;

        index = findFirstAvailableSlotinRoom(room);
        socket.emit('join', index);
    
        // 用户加入，通告房间里其他用户
        socket.on('client_joined', (name)=> {
            room.peopleList[index] = name;
            nsp.emit('player_list_updated', {name: name, index: index, action: 'enter', playerList :room.peopleList});
        });
    
        // 用户退出，通告房间里其他用户
        socket.on('disconnect',function(){
            room.people--;
            room.peopleList[index] = '';
            nsp.emit('player_list_updated', {name: '', index: index, action: 'leave', playerList :room.peopleList});
            console.log('someone disconnected match.There are '+room.people+' people in room');
        });

        socket.on('game_start', () => {
            room.gameOn = true;
            nsp.emit('game_started');
        });

        socket.on('report_player_status', (data) => {
            room.playerStatusList[data.playerId] = data;    
        });

        let gameStatusUpdate = setInterval(() => {
            if(room.gameOn){
                const paramList = [];
                for(let i = 0; i < room.playerStatusList.length; i++){
                    paramList.push(processPlayerStatus(room.playerStatusList[i]));
                }
                nsp.emit('update_player_status', paramList);
            }
        }, dt)
    });
}



function findFirstAvailableSlotinRoom(room){
    const list = room.peopleList;
    for(let i = 0; i < list.length; i++){
        if(list[i] === ''){
            return i;
        }
    }
}

function processPlayerStatus(status) {
    if(!status){
        return status;
    }

    let newX = status.position.x;
    if(status.isMoving){
        if(status.direction === 'left'){
            newX = status.position.x - status.xSpeed * status.dt;
        }
        else{
            newX = status.position.x + status.xSpeed * status.dt;
        }
    }

    const params = {
        ...status,
        position: {x: newX, y: status.position.y}
    }

    return params;
}