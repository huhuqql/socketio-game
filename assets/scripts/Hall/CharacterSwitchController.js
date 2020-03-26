// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const G = require('../Common');
const Hittable = require('../Hittable');

cc.Class({
    extends: Hittable,

    properties:{
        Characters: [cc.Prefab]
    },

    onLoad(){
        this._super();
        this.character = 0;
    },

    onBeginContact: function (contact, self, other) {
        if(!this.collected && other.tag === 1){
            this.collected = true;

            this.character++;
            if(this.character > this.Characters.length - 1){
                this.character = 0;
            }

            const animstate = this.anim.play('hit');
            animstate.on('finished', this.restoreIdle, this);
            const scene = cc.director.getScene();


            const curPlayer = cc.find('Player');
            const newPlayer = cc.instantiate(this.Characters[this.character]);
            newPlayer.name = 'Player';
            newPlayer.parent = scene;
            newPlayer.x = curPlayer.x;
            newPlayer.y = curPlayer.y;

            G.character = this.character;

            curPlayer.removeFromParent();
            curPlayer.destroy();
        }
    },

    restoreIdle(){
        const animState = this.anim.play('idle');
        animState.repeatCount = Infinity;
        setTimeout(() => {
            this.collected = false;
        }, 500)
    }
});
