
<script>
import tool from "./tool.vue";
import popup_filter from "./filter_game.vue";
import { useGameStore } from '../stores/game.js'
import { markRaw } from "vue";
export default {
    name: "auto_game",
    data() {
        const game = useGameStore();
        return {
            game: game,
            currentSec: game.getCurrentSeconds(),
            timerId: 0,
            //timerClaimId: 0,
            intervalWorker: undefined,
            started: false
        };
    },
    mounted() {
        this.timerId = setInterval(() => { this.currentSec = this.game.getCurrentSeconds() }, 1000);
        this.intervalWorker = markRaw(new Worker("/interval_worker.js"));
    },
    beforeUnmount() {
        clearInterval(this.timerId);
        this.intervalWorker.terminate();
    },
    components: {
        tool,
    },
    methods: {
        startAuto() {

            this.intervalWorker.postMessage({type: 'start', interval: 3600000});
            this.started = true;
            this.intervalWorker.onmessage = function(e) {
                let m = e.data;
              if(m.type == 'interval'){
                this.updateAuto();
              }
            }
            
            
            // this.timerClaimId = setInterval(() => {
            //      this.updateAuto();
            //     }, 3600000);
        },
        testWorker() {
            this.intervalWorker.postMessage({type: 'start', interval: 10000});
            this.started = true;
            this.intervalWorker.onmessage = (e) => {
                let m = e.data;
                  if(m.type == 'interval'){
                    console.log(this.game.getCurrentSeconds());
                  }
                }


        // this.timerClaimId = setInterval(() => {
        //      this.updateAuto();
        //     }, 3600000);
        },
        stopAuto() {
            this.intervalWorker.postMessage({type: 'stop'});
            this.started = false;
            // clearInterval(this.timerClaimId);
            // this.timerClaimId = 0;
        },
        async updateAuto() {

            let oldEAT = this.game.balanceEAT;

            await this.claimAllMany();

            let deltaEAT = this.game.balanceEAT - oldEAT;


            await this.exchange(deltaEAT, 'EAT');
        },

        unstakeAll() {
            this.$toast.show(`await`, {
                asyncFunction: async () => { return await this.game.removeAllTools(); },
                onSuccessMessage: (res) => {
                    console.log(res);
                    return `the transaction is successful`;
                },
            });
        },
        claimAll() {
            this.$toast.show(`await`, {
                asyncFunction: async () => { return await this.game.claimAll(); },
                onSuccessMessage: (res) => {
                    console.log(res);
                    return 'the transaction is successful';
                },
            });
        },
        async claimAllMany(toast = false) {

            let count = Math.ceil(this.game.playerUsedTools.length / 50);

            let claim = async () => {
                for(let i = 0; i< count; i++){
                        await this.game.claimAll(); 
                    }
            }

            if(toast){
                this.$toast.show(`await`, {
                    asyncFunction: claim,
                    onSuccessMessage: (res) => {
                        return 'the transaction is successful';
                    },
                });
            }else{
                return await claim();
            }

            
        },
        async exchange(quantity, symbol, toast = false) {

            let change = async () => {
                return await this.game.exchange(`${quantity.toFixed(8)} ${symbol}`); 
            }


            if(toast){
                this.$toast.show(`await`, {
                    asyncFunction: change,
                    onSuccessMessage: (res) => {
                        return 'the transaction is successful';
                    },
                });
            }else{
                return await change();
            }
        },
        refresh() {
            this.$toast.show('await', {
                asyncFunction: async () => { await this.game.loadstats(); },
                onSuccessMessage: (res) => { return `Game data updated` },
            });
        },

    },
    computed: {
        toolsList() {

            let usedTools = this.game.playerUsedTools;
            let tools = this.game.playerTools;

            //tools = tools.filter(t => this.game.inventoryAssets.some(a => +a.asset_id == +t.asset_id));

            let resultItems = [];

            for (let usedTool of usedTools) {
                let tool = tools.find(t => +t.asset_id == +usedTool.asset_id);
                let resultItem = {
                    //asset_id: +tool.asset_id,
                    rarity: tool.config.rarity,
                    gen: tool.config.gen,
                    tool: tool
                }
                resultItems.push(Object.assign({}, usedTool, resultItem));
            }

            return resultItems;
        },
        unclaimedSum(){
            function calcUnclaimed(tool, secs, state){
                    let accumulated = +tool.accumulated.split(' ')[0];
                  let accumulateRate = +tool.accumulate_rate.split(' ')[0];
                  let elastedSeconds = secs - state.ISOToSeconds(tool.accumulate_point);

                  let ticksCount = elastedSeconds / (state.gameConfig?.accumulate_tick ?? 1);

                  let resultIncome = accumulated + accumulateRate * ticksCount;

                  return resultIncome;
            }


            let sum = this.toolsList.reduce((accum, current)=>{
                let unclaimed = calcUnclaimed(current, this.currentSec, this.game);
                return accum + unclaimed
            }, 0);


            return sum;
        }
    }
};
</script>
<template>
    <div class="block_game">
        <div class="element_control">
            <div class="btnv2" @click="startAuto">
                Start auto  (started: {{started}})
            </div>
            <div class="btnv2" @click="testWorker">
                test timer
            </div>
            <div class="btnv2" @click="stopAuto">
                Stop auto
            </div>
            <div class="btnv2" @click="updateAuto">
                Once auto
            </div>
            <div class="btnv2" @click="exchange(this.game.balanceEAT, 'EAT')">
                Change all EAT
            </div>
            <div class="btnv2" @click="unstakeAll">
                Unstake all
            </div>
            <div class="btnv2 claim_all" @click="claimAll">
                <p>Claim all:</p>
                <p>{{ +unclaimedSum.toFixed(2) }}</p>
            </div>
            <div class="reload" @click="refresh()">
                <img src="../assets/pageGame/reload.png" alt="reload" />
            </div>
        </div>
        <div class="content">
            <tool v-for="item in toolsList" :key="item.asset_id" :userTool="item" />
            <div class="view_box" v-if="toolsList.length == 0">
                You don't have an nft at the moment
                <a href="https://wax.atomichub.io/market?collection_name=earlyempires&order=asc&sort=price&symbol=WAX" target="_blank">buy</a>
            </div>
        </div>
    </div>
</template>
<style scoped>
.fade-enter-active {
    opacity: 1;
    transition: all 0.25s ease-out;
}

.fade-leave-active {
    opacity: 0;
    transition: all 0.25s 0.25s ease-out;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}






.block_game.active {
    pointer-events: none;
    filter: brightness(40%);
}

.block_game {
    width: 95%;
    height: 800px;
    flex-direction: column;
    justify-content: flex-start;
    border: 1px solid #D89718;
    background: rgba(23, 27, 40, 0.5);
    overflow-y: auto;
}

.filter:hover {
    border: 1px solid #D89718;
    background: #D8971820;
}

.filter {
    margin: 5px 0px 0px;
    border: 1px solid #D8971800;
    cursor: pointer;
    transition: all 0.25s ease;
}
.filter img {
    width: 89%;
}

.reload {
    cursor: pointer;
    border: 1px solid #D89718;
    position: absolute;
    right: 10px;
    top: 5px;
    margin: 5px 0px;
    transition: all 0.25s ease;
}

.reload:hover {
    background: #D8971840;
}

.element_control {
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
}

.btnv2 {
    padding: 5px 40px;
    border: 1px solid rgba(245, 165, 22, 0.9);
    margin: 0px 24px;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    background: rgba(245, 165, 22, 0.5);
    cursor: pointer;
    user-select: none;
    transition: all 0.25s ease;
}
.btnv2.claim_all{
    padding: 5px 10px;
    flex-direction: row;
    justify-content: flex-start;
    width: fit-content;
}
.btnv2.claim_all p{
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
}
.btnv2.claim_all p:first-child{
    width: 100px;
}
.btnv2.claim_all p:last-child{
    width: 110px;
    justify-content: flex-start;
}

.btnv2:hover {
    background: rgba(245, 165, 22, 0.2);
}

.content {
    width: calc(100% - 10px);
    padding: 10px;
    height: fit-content;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
}

.view_box {
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 24px;
    color: var(--vt-c-text-dark-2);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.view_box a {
    padding: 0px 0px 0px 0px;
    color: var(--game-color-yellow-lite);
    cursor: pointer;
    transition: all 0.25s ease;
}

.view_box a:hover {
    background: none;
    color: #75A2FB;
    text-decoration: underline;
    transition: all 0.15s ease;
}

@media (max-width: 1080px) {
    .element_control {
        flex-direction: column;
        align-items: flex-start;
    }

    .filter {
        position: absolute;
        top: 5px;
        right: 60px;
        border: 1px solid#D89718;
    }

    .filter img {
        width: 77%;
    }

    .btnv2 {
        margin: 10px 0px 10px 25px;
    }
}
@media (max-width: 480px) {
    .block_game{
        min-height: 800px;
        height: fit-content;
    }
    .btnv2, .btnv2.claim_all{
        width: calc(100% - 20px);
        padding: 5px;
        margin: 5px 10px;
    }
    .filter img, .reload img{
        position: relative;
        left: unset;
        right: unset;
        bottom: unset;
        top: unset;
        width: 30px;
    }
    .filter, .reload{
        position: relative;
        width: calc(100% - 20px);
        margin: 5px 10px;
        left: unset;
        right: unset;
        bottom: unset;
        top: unset;
    }
}
</style>