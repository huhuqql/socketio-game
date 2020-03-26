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
        minCount: 1,
        maxCount: 6,
        shouldRespawn: true,
        respawnInterval: 5000,
        FloatDistance: 60,
        useRandomSeed: true,
        Fruit: {
            default: null,
            type: cc.Prefab,
        },
    },


    onLoad () {
        this.respawn = false;
        this.collectableList = [];
        this.createCollectables();

        if(this.shouldRespawn){
            setInterval(() => {
                for(let i = 0; i < this.collectableList.length; i++){
                    if(this.collectableList[i].name !== '') return;
                }
                if(!this.respawn){
                    this.respawn = true;
                    setTimeout(() => {
                        this.createCollectables();
                    }, this.respawnInterval)
                }
            }, 1000);
        }
    },

    createCollectables(){
        switch(Math.ceil(this.random() * (this.maxCount - this.minCount)) + this.minCount){
            case 1:
                const item = cc.instantiate(this.Fruit);
                item.parent = this.node;
                item.setPosition(0, this.FloatDistance + 20);
                this.collectableList.push(item);
                break;
            case 2:
                for(let i = 0; i < 2; i++){
                    const item = cc.instantiate(this.Fruit);
                    item.parent = this.node;
                    item.setPosition(-10 + i * 20, this.FloatDistance + 10);
                    this.collectableList.push(item);
                }
                break;
            case 3:
                for(let i = 0; i < 3; i++){
                    const item = cc.instantiate(this.Fruit);
                    item.parent = this.node;
                    item.setPosition(-20 + i * 20, this.FloatDistance + 10);
                    this.collectableList.push(item);
                }
                break;
            case 4:
                for(let i = 0; i < 4; i++){
                    const item = cc.instantiate(this.Fruit);
                    item.parent = this.node;
                    item.setPosition(-10 + (i%2) * 20, this.FloatDistance + Math.floor(i/2) * 20);
                    this.collectableList.push(item);
                }
                break;
            case 5:
                for(let i = 0; i < 2; i++){
                    const item = cc.instantiate(this.Fruit);
                    item.parent = this.node;
                    item.setPosition(-10 + i * 20, this.FloatDistance + 20);
                    this.collectableList.push(item);
                }
                for(let i = 0; i < 3; i++){
                    const item = cc.instantiate(this.Fruit);
                    item.parent = this.node;
                    item.setPosition(-20 + i * 20, this.FloatDistance);
                    this.collectableList.push(item);
                }
                break;
            case 6:
                for(let i = 0; i < 2; i++){
                    const item = cc.instantiate(this.Fruit);
                    item.parent = this.node;
                    item.setPosition(-10 - i * 20, this.FloatDistance + 20);
                    this.collectableList.push(item);
                }
                for(let i = 0; i < 2; i++){
                    const item = cc.instantiate(this.Fruit);
                    item.parent = this.node;
                    item.setPosition(10 + i * 20, this.FloatDistance + 20);
                    this.collectableList.push(item);
                }
                for(let i = 0; i < 2; i++){
                    const item = cc.instantiate(this.Fruit);
                    item.parent = this.node;
                    item.setPosition(-10 + i * 20, this.FloatDistance);
                    this.collectableList.push(item);
                }
                break;
            case 7:
                for(let i = 0; i < 7; i++){
                        const item = cc.instantiate(this.Fruit);
                        item.parent = this.node;
                        item.setPosition(-60 + i * 20, this.FloatDistance + 20);
                        this.collectableList.push(item);
                }
                break;
        }
        this.respawn = false;
    },

    random() {
        if(this.useRandomSeed){
            var x = Math.sin(G.seed++) * 10000;
            return x - Math.floor(x);
        }
        else{
            return Math.random();
        }
    },

    start () {
        // setInterval(() => {
     
        // }, 5000);
    },

    // update (dt) {},
});
