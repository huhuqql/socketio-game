// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const G = require('Common');
const GameManager = require('GameManager');

cc.Class({
    extends: cc.Component,

    properties: {
        Characters: [cc.Prefab]
    },

    onLoad () {

        this.playerList = {};
        this.motion = {};
        this.direction = {};
        this.gameManager = GameManager.getInstance();

        G.gameSocket = io.connect(`10.93.240.134:4747/map${G.roomKey}`, { 'force new connection': true });

        G.gameSocket.on('player_enter', (data) => {
            for(let d in data){
                if(!this.playerList[d]){
                    this.createPlayer(d, data[d]);
                }
            }
        });

        setInterval(() => {
            if(G.gameOn){
                this.gameManager.updateProgressBar(this.playerStatus);
            }
        }, 100);

        this.createPlayer(G.playerId);
    },

    startListeningPlayerStatus(){
        G.gameOn = true;
        G.gameSocket.on('broadcast_status', data => {
            this.playerStatus = data;
        })
    },

    updatePlayerStatus(status, dt){
        const player = this.playerList[status.playerId];
        const detail = status.playerDetail;

        const diffX = player.x - detail.position.x;
        if(diffX > 1){
            player.x -= 100 * dt; 
        }
        else if(diffX < -1){
            player.x += 100 * dt;
        }
        else{
            player.x = detail.position.x;
        }

        const diffY = player.y - detail.position.y;
        if(diffY > 2.4){
            player.y -= 240 * dt; 
        }
        else if(diffY < -2.4){
            player.y += 240 * dt;
        }
        else{
            player.y = detail.position.y
        }

        if(detail.direction.x === 'left'){
            player.scaleX = -1;
        }
        else{
            player.scaleX = 1; 
        }

        if(detail.motion.x){
            if(detail.motion.y){
                this.playAnimation(player, 'jump');
            }
            else{
                this.playAnimation(player, 'run');
            }
        }
        else{
            this.playAnimation(player, 'idle');
        }
    },

    updatePlayerPosition(status){
        const player = this.playerList[status.playerId];
        const detail = status.playerDetail;
        player.x = detail.position.x;
        player.y = detail.position.y;
    },

    playAnimation(sprite, name){
        const anim = sprite.getComponent(cc.Animation);
        if(anim.currentClip && anim.currentClip.name == name){
            return;
        } 
        const animState = anim.play(name);
        animState.repeatCount = Infinity;
    },

    createPlayer(playerId, data = null) {
        const scene = cc.director.getScene();

        if(playerId === G.playerId){
            const player = cc.instantiate(this.Characters[G.character]);
            player.parent = scene;
            player.setPosition(50, 100);
            this.playerList[playerId] = player;

            this.myPlayer = player;
            this.myRigidBody = player.getComponent(cc.RigidBody);

            this.direction.x = 'right';
            this.direction.y = 'up';

            this.motion.x = false;
            this.motion.y = false;
    
            const status = {
                playerId: G.playerId,
                playerDetail: {
                    position: {x: this.myPlayer.x, y: this.myPlayer.y},
                    direction: {x: this.direction.x, y: this.direction.y},
                    motion : {x: this.motion.x, y: this.motion.y},
                    character: G.character
                },
                playerStatus:{
                    score: 0
                }
            }
    
            G.gameSocket.emit('player_enter', status);
        }
        else{
            const player = cc.instantiate(this.Characters[data.playerDetail.character]);
            player.getComponent('Player').destroy();
            player.getComponent(cc.PhysicsCollider).destroy();
            player.getComponent(cc.RigidBody).destroy();
            player.parent = scene;
            player.setPosition(50, 100);
            this.playerList[playerId] = player;
            this.startListeningPlayerStatus();
        }

    },

    playAnimation(sprite, name){
        const anim = sprite.getComponent(cc.Animation);
        if(anim.currentClip && anim.currentClip.name == name){
            return;
        } 
        const animState = anim.play(name);
        animState.repeatCount = Infinity;
    },

    update (dt) {
        for(let d in this.playerStatus){
            if(d !== G.playerId){
                this.updatePlayerStatus(this.playerStatus[d], dt);
            }
        }

    }
});

