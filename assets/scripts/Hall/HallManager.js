// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const G = require('../Common');

cc.Class({
    extends: cc.Component,

    onLoad () {
        cc.game.setFrameRate(59);
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true; 
        G.playerId = this.createRandomId();
        
        this.enterScene();
        
        G.hallSocket = io.connect('10.93.240.134:4747/hall', { 'force new connection': true });

        G.hallSocket.on('key_generated', data => {
            this.key = data.key;
        })

        G.hallSocket.on('map_ready', data => {
            if(G.isQueuing){
                G.roomKey = data.key;
                G.seed = data.seed;
                this.jumpToGameScene();
            }
        })
    },

    enterScene() {
        const mask = cc.find('mask');
        mask.active = true;
        mask.getComponent(cc.Animation).play('canvas_fadein');
    },

    jumpToGameScene(){
        const mask = cc.find('mask');
        mask.setSiblingIndex(999);
        const canvasHide = mask.getComponent(cc.Animation).play('canvas_fadeout');
        if(canvasHide){
            canvasHide.on('stop', () => {
                cc.director.loadScene('Game');
            })
        }
    },

    createRandomId() {
        return (Math.random()*10000000).toString(16).substr(0,4)+Math.random().toString().substr(2,5);
    }
});
