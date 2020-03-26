// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        Backgrounds: [cc.SpriteFrame],
        scrollVelocity: 50
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const index = Math.floor(Math.random() * this.Backgrounds.length);
        let spriteFrame = this.Backgrounds[index];
        this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },

    start () {

    },

    update (dt) {
        let newY = this.node.y - this.scrollVelocity * dt;
        if (newY <= 240) {
            newY = 752;
        }
        this.node.y = newY;
    },
});
