// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    onLoad () {
        this.anim = this.getComponent(cc.Animation);
        let animState = this.anim.play('appear');
        animState.on('finished', this.onAppearComplete, this);
    },

    onAppearComplete () {
        const animState = this.anim.play('idle');
        animState.repeatCount = Infinity;
    },

    onCollisionEnter: function (other, self) {
        const animstate = this.anim.play('collect');
        animstate.on('finished', this.destroySelf, this);
    },

    destroySelf(){
        this.node.destroy();
    }

});
