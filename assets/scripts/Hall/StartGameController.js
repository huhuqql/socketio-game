// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const G = require('../Common');
const Collectable = require('../Collectable');

cc.Class({
    extends: Collectable,

    onCollisionEnter: function (other, self) {
        const animstate = this.anim.play('collect');
        animstate.on('finished', this.destroySelf, this);

        G.hallSocket.emit('start_queue');
        G.isQueuing = true;
        const text = cc.find('Canvas/QueuingText');
        text.opacity = 0;
        text.active = true;
    },
});
