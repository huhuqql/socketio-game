// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const G = require('Common');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.broken = false;
        this.BlackMask = cc.find('BlackMask');
        G.gameSocket.on('world_break', () => {
            if(!this.broken){
                this.broken = true;
                this.letTheWorldBroken();
            }
        });
    },

    letTheWorldBroken(){
        this.BlackMask.opacity = 0;
        this.BlackMask.setSiblingIndex(999);
        this.BlackMask.active = true;

        const anim = this.BlackMask.getComponent(cc.Animation);
        let animState = anim.play('quick_fadein');
        animState.on('finished', this.breakWorld, this);

    },

    breakWorld(){
        const children = this.node.children;
        for(let i = 0; i < children.length; i++){
            if(children[i].name.indexOf('ground') < 0 && children[i].name.indexOf('border') < 0){
                if(children[i].name === 'wood-2x2'){
                    children[i].getComponent(cc.RigidBody).type = 2;
                }
                children[i].angle = this.random() * 25 * (i % 2 === 0 ? -1 : 1);
            }
        }

        const anim = this.BlackMask.getComponent(cc.Animation);
        let animState = anim.play('quick_fadeout');
        animState.on('finished', this.onWorldBrokenEnd, this);
    },

    onWorldBrokenEnd(){
        this.BlackMask.active = false;
    },

    random() {
        var x = Math.sin(G.seed++) * 10000;
        return x - Math.floor(x);
    },

    start () {
        // this.letTheWorldBroken();
    },

    // update (dt) {},
});
