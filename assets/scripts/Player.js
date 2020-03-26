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
        this.motion = {};
        this.direction = {};
        this.myRigidBody = this.node.getComponent(cc.RigidBody);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        if(G.gameSocket){
            setInterval(() => {
                const status = {
                    playerId: G.playerId,
                    playerDetail: {
                        position: {x: this.node.x, y: this.node.y},
                        direction: {x: this.direction.x, y: this.direction.y},
                        motion : {x: this.motion.x, y: this.motion.y},
                        character: G.character
                    },
                    playerStatus: {
                        score: G.score
                    }
                };
                G.gameSocket.emit('report_status', status );
            }, 30);
        }
    },

    onCollisionEnter: function (other, self) {
        if(other.tag === 5){
            G.score++;
        }
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if(otherCollider.tag === 9){
            this.motion.y = false;
            this.displayMoving();
        }
    },

    displayMoving(){
        if(this.motion.y){
            this.playAnimation(this.node, 'jump');
        }
        else if(this.motion.x){
            this.playAnimation(this.node, 'run');
        }
        else{
            this.playAnimation(this.node, 'idle');
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


    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.node.scaleX = -1;
                this.direction.x = 'left';
                this.motion.x = true;
                this.displayMoving();
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.node.scaleX = 1;
                this.direction.x = 'right';
                this.motion.x = true;
                this.displayMoving();
                break;
            case cc.macro.KEY.w:
            case cc.macro.KEY.space:
                if(!this.motion.y){
                    this.myRigidBody.applyForceToCenter(cc.Vec2(0, 10000));
                    this.direction.y = 'up';
                    this.motion.y = true;
                    this.displayMoving();
                }
                break;
        }
    },

	onKeyUp (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                if(this.direction.x === 'left'){
                    this.motion.x = false;
                }
                this.displayMoving();
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right: 
                if(this.direction.x === 'right'){
                    this.motion.x = false;
                }
                this.displayMoving();
                break;
        }   
    },

    update(dt){
        /** 控制自身移动 */
        if(this.motion.x){
            if(this.direction.x === 'right'){
                this.node.x += 100 * dt;
            }
            else{
                this.node.x -= 100 * dt;
            }
        }
    }
});
