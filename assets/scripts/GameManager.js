// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const G = require('Common');

const GameManager = cc.Class({
    extends: cc.Component,

    properties: {
        Statues: [cc.Prefab],
        ResultScreen: {
            default: null,
            type: cc.Prefab
        }
    },

    statics: {
        self : null,
        getInstance : function()
        {
            if(GameManager.self==null)
            {
                var node = new cc.Node("GameManager");
                GameManager.self = node.addComponent(GameManager);
            }
            return GameManager.self;
        } 
    },

    ctor () {
        GameManager.self = this;
    },

    onLoad(){
        G.gameSocket.on('game_end', data => {
            if(G.gameOn){
                G.gameOn = false;
                this.showResult(data);
            }
        })
    },

    updateProgressBar(data){
        for(let d in data){
            if(d === G.playerId){
                if(!this.PlayerOneProgress){
                    this.PlayerOneProgress = cc.find('Canvas/UI/Player1/Progress').getComponent(cc.ProgressBar);
                }
                this.PlayerOneProgress.progress = data[d].playerStatus.score / 150;
            }
            else{
                if(!this.PlayerTwoProgress){
                    this.PlayerTwoProgress = cc.find('Canvas/UI/Player2/Progress').getComponent(cc.ProgressBar);
                }
                this.PlayerTwoProgress.progress = data[d].playerStatus.score / 150;
            }
        }
    },

    showResult(data){
        const scene = cc.director.getScene();

        const resultScreen = cc.instantiate(this.ResultScreen);
        resultScreen.parent = scene;

        const Info = cc.find("Info", resultScreen);

        const Result = cc.find("Result", Info);
        const MyScore = cc.find("MyScore", Info);
        const OtherScore = cc.find("OtherScore", Info);

        for(let d in data){
            if(d === G.playerId){
                const score = data[d].playerStatus.score;
                MyScore.getComponent(cc.Label).string = score;
                const statue = cc.instantiate(this.Statues[data[d].playerDetail.character]);
                statue.parent = Info;
                statue.x = 0;
                statue.y = 40;

                if(score >= 150){
                    Result.getComponent(cc.Label).string = '你赢啦';
                }
                else{
                    Result.getComponent(cc.Label).string = '你输了';
                }
            }
            else{
                const score = data[d].playerStatus.score;
                OtherScore.getComponent(cc.Label).string = score; 
            }
        }
    },

    update (dt) {

    },
});

module.exports = GameManager;