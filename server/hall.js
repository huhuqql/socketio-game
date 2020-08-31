function Hall() {
    this.people = 0;
    this.socket = null;   
}

let hall = new Hall();
let roomToKeyMap = new Map();

// 菜单界面，创建房间与加入房间
hall.socket = io.of('/hall').on('connection',function(socket){
    console.log('someone entered hall'); 
    socket.on('create', ()=> {
        const key = generateRandomString();
        const availableRoomId = findFirstAvailableRoom();
        if(typeof availableRoomId !== undefined){
            roomToKeyMap.set(key, availableRoomId);
            socket.emit('created', {key: key, roomId: availableRoomId});
        }
        else{
            socket.emit('create_failed');
        }
    });

    socket.on('join', (key)=> {
        const availableRoomId = roomToKeyMap.get(key);
        if(typeof availableRoomId !== undefined){
            socket.emit('joined', {key: key, roomId: availableRoomId});
        }
        else{
            socket.emit('joined_failed');
        }
    });

    socket.on('disconnect',function(){
        console.log('someone left hall'); 
    });
});

function findFirstAvailableRoom(){
    for(let i = 0; i < rooms.length; i++){
        if(rooms[i].people === 0){
            return i;
        }
    }
    return undefined;
}

function generateRandomString() {
    let ret = '';
    for(let i = 0; i < 5; i++){
        ret += String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
    return ret;
}