<script>
import { useGameStore } from '../stores/game.js';
export default {
    name: "popup_upgrade",
    emits: ['close'],
    props: {
        userTool: {
            required: true,
            type: Object
        }
    },
    data() {
        let game = useGameStore();
        return {
            view: false,
            game: game,
            currentSec: game.getCurrentSeconds(),
            timerId: 0,
            lvl: 0,
        };
    },
    mounted() {
        this.lvl = Math.min(this.toolLevel+1, 100);
        this.timerId = setInterval(() => { this.currentSec = this.game.getCurrentSeconds() }, 1000);
    },
    beforeUnmount() {
        clearInterval(this.timerId);
    },
    components: {
    },
    methods: {
        vieposition() {
            this.$emit('close');
        },
        upgradeTool() {
            this.$toast.show(`await`, {
                asyncFunction: async () => {
                    let res = await this.game.upgradeTool(+this.userTool.asset_id, this.lvl - this.toolLevel);
                    this.vieposition();
                    return res;
                },
                onSuccessMessage: (res) => {
                    return `the transaction is successful`;
                },
            });
        },
        speedUp() {
            this.$toast.show(`await`, {
                asyncFunction: async () => {
                    let res = await this.game.speedUp(+this.userTool.asset_id);
                    this.vieposition();
                    return res;
                },
                onSuccessMessage: (res) => {
                    console.log(res);
                    return `the transaction is successful`;
                },
            });
        },
    },
    computed: {
        toolName() {
            return this.userTool.tool.data.name ?? 'Tool';
        },
        toolLevel() {
            return this.userTool.level ?? 0;
        },
        toolGen() {
            return this.userTool.tool.config.gen;
        },
        toolPower() {
            return this.game.calcAccumulateRate(this.userTool.tool.config, this.toolLevel);
        },
        toolExpectedPower() {
            let expRate = this.game.calcAccumulateRate(this.userTool.tool.config, this.lvl);
            return expRate;
        },
        toolExpectedUpgradePaid() {
            return this.game.calcUpgradePaid(this.userTool.tool.config, this.toolLevel, this.lvl);
        },
        toolExpectedUpgradeCost() {

            let couner = {};
            let balance = this.toolExpectedUpgradePaid.balance;

            for (let token of balance) {
                let amount = +token.split(' ')[0];
                let symbol = token.split(' ')[1];
                if (couner[symbol]) {
                    couner[symbol] += amount;
                }
                else {
                    couner[symbol] = amount;
                }
            }
            let list = [];
            for (let prop in couner) {
                list.push(`${couner[prop].toFixed(8)} ${prop}`)
            }


            return list;

        },
        toolExpectedUpgradeTime() {

            let remainingSecs = this.toolExpectedUpgradePaid.time;

            if (remainingSecs <= 0) {
                return "00:00:00";
            }

            return `${String(Math.floor(remainingSecs / 3600)).padStart(2, "0")}:${String(Math.floor((remainingSecs % 3600) / 60)).padStart(2, "0")}:${String(Math.floor((remainingSecs % 60))).padStart(2, "0")}`;

        },
        unclaimed() {
            let accumulated = +this.userTool.accumulated.split(' ')[0];
            let accumulateRate = +this.userTool.accumulate_rate.split(' ')[0];
            let elastedSeconds = this.currentSec - this.game.ISOToSeconds(this.userTool.accumulate_point);

            let ticksCount = elastedSeconds / (this.game.gameConfig?.accumulate_tick ?? 1);

            let resultIncome = accumulated + accumulateRate * ticksCount;

            return resultIncome;
        },
        toolImage() {

            return `/nft/${this.userTool.tool.template.template_id}.png`;

        },
        isUpgrading() {
            return this.game.ISOToSeconds(this.userTool.upgrade_end) > this.currentSec;
        },
        speedupCost() {
            if (this.isUpgrading) {

                let totalSecs = this.game.ISOToSeconds(this.userTool.upgrade_end) - this.game.ISOToSeconds(this.userTool.upgrade_start);
                let leftSecs = this.game.ISOToSeconds(this.userTool.upgrade_end) - this.currentSec;

                let multiplier = leftSecs / totalSecs;

                let value = (+this.userTool.speedup_cost.split(' ')[0]) * multiplier

                return [`${+value.toFixed(8)} ${this.userTool.speedup_cost.split(' ')[1]}`];

            } else {
                return [this.toolExpectedUpgradePaid.speedup];
            }
        }
    },
};

</script>
<template>
    <div class="container_filter">
        <div class="block_filter">
            <div class="nft">
                <img :src=toolImage alt="nft" />
            </div>
            <div class="info_container">
                <div class="helpblock">
                    <div class="info name">
                        {{ toolName }}
                    </div>
                    <div class="info lvl">
                        <div class="lvlbox"> LVL: {{ lvl }}</div>
                        <div class="slidecontainer" :class="{ active: isUpgrading }">
                            <input type="range" :min="toolLevel" max="100" class="slider" id="myRange"
                                v-model.number="lvl">
                        </div>
                    </div>
                    <div class="info gen">
                        GEN: {{ toolGen }} 
                    </div>
                    <div class="info power">
                        POWER:&nbsp; <p class="power_standart">{{ + toolPower.toFixed(6) }}</p>&nbsp; &#8594; &nbsp;
                                     <p class="power_up"
                                     :class="{disactive: toolPower > toolExpectedPower}"
                                     >
                                     {{+ toolExpectedPower.toFixed(6)}}
                                     </p>
                    </div>
                    <div class="info time">
                        UPGRADE TIME: {{ toolExpectedUpgradeTime }}
                    </div>
                    <div class="info cost">
                        Cost:
                        <div class="cost_block" v-for="token in toolExpectedUpgradeCost" :key="token" :class="{active: game.findBalance(game.player.balances, token.split(' ')[1]) > +(+token.split(' ')[0])}">
                            <p>{{+ (+token.split(' ')[0]).toFixed(2)}}</p>
                            <img :src="`/${token.split(' ')[1]}.png`" :alt="token.split(' ')[1]" />
                        </div>
                    </div>
                    <div class="info speedupcost" :class="{ active: isUpgrading }">
                        Speed up cost:

                        <div class="cost_block" v-for="token in speedupCost" :key="token">
                            <p :class="{active: game.findBalance(game.player.balances, token.split(' ')[1]) > +(+token.split(' ')[0])}">
                                {{+ (+token.split(' ')[0]).toFixed(2)}}</p>
                            <img :src="`/${token.split(' ')[1]}.png`" :alt="token.split(' ')[1]" />
                        </div>
                    </div>
                </div>
                <div class="helpblockv2">
                    <div class="btn upgrade" :class="{ active: !isUpgrading }" @click="upgradeTool">
                        Upgrade
                    </div>
                    <div class="btn speed" :class="{ active: isUpgrading }" @click="speedUp">
                        Speed up
                    </div>
                </div>
            </div>
            <div class="close" @click="vieposition">
                <img src="../assets/pageGame/close.png" alt="close" />
            </div>
        </div>
    </div>
</template>
<style scoped>
.fade-enter-active .block_filter{
    opacity: 1;
    transition: all 0.25s 0.25s ease-out;
}

.fade-leave-active .block_filter{
    opacity: 0;
    transform: translate(0%, -20%);
    transition: all 0.25s ease-out;
}

.fade-enter-from .block_filter{
    opacity: 0;
    transform: translate(0%, -20%);
}

.fade-leave-to .block_filter{
    opacity: 0;
}
.container_filter {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 20;
    font-size: 24px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.block_filter {
    width: 650px;
    height: 350px;
    border: 1px solid #F5A516;
    background: #171B28;
    flex-direction: row;
}

.nft img {
    width: 90%;
}

.nft {
    height: 100%;
    width: 40%;
    justify-content: center;
}

.info_container {
    width: 60%;
    height: 100%;
    text-transform: uppercase;
    font-size: 18px;
    color: #F5A516;
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    justify-content: space-around;
    align-items: flex-start;
}

.info_container .helpblock {
    justify-content: flex-start;
    align-items: flex-start;
}

.helpblockv2 {
    width: 90%;
    flex-direction: row;
    justify-content: space-around;
}

.info {
    margin: 5px 0px;
    flex-direction: row;
}

.lvlbox {
    justify-content: flex-start;
    align-items: flex-start;
    width: 70px;
}

.btn.speed {
    opacity: 0.5;
    pointer-events: none;
    cursor: auto;
}

.btn.upgrade {
    opacity: 0.5;
    pointer-events: none;
    cursor: auto;
}

.btn.upgrade.active {
    opacity: 1;
    pointer-events: auto;
    cursor: pointer;
}

.btn.upgrade.active:hover {
    background: rgba(255, 255, 255, 0.2);
}

.btn.speed.active {
    opacity: 1;
    pointer-events: auto;
    cursor: pointer;
}

.btn.speed.active:hover {
    background: rgba(255, 255, 255, 0.2);
}

.btn {
    padding: 2px 25px;
    border: 1px solid var(--vt-c-white);
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    cursor: pointer;
    user-select: none;
    transition: all 0.25s ease;
}

.btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.close {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    transition: all 0.5s;
}

.close:hover {
    transform: rotate(90deg);
    transition: all 0.35s;
}

.slidecontainer.active {
    pointer-events: none;
    opacity: 0.5;
    cursor: auto;
}

.slidecontainer {
    justify-content: center;
    align-items: center;
    margin: 0px 0px 0px 10px;
}

.slider {
    -webkit-appearance: none;
    width: 200px;
    height: 8px;
    border-radius: 5px;
    background: #ffffff;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 1px solid #F5A516;
    background: #F5A516;
    cursor: pointer;
}

.slider::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 1px solid #F5A516;
    background: #F5A516;
    cursor: pointer;
}
.power_standart{
    color: #F5A516;
}
.power_up{
    color: rgb(5, 209, 5);
}
.power_up.disactive{
    color: red;
}
.cost_block {
    flex-direction: row;
}

.cost_block p {
    letter-spacing: 2px;
    margin: 0px 5px 0px 15px;
}
.cost_block p {
    color: red;
}
.cost_block.active p{
    color: rgb(5, 209, 5);
}
.cost_block p.active{
    color: rgb(5, 209, 5);
}

.cost_block img {
    width: 30px;
}

@media (max-width: 650px) {
    .block_filter {
        width: 400px;
        height: 700px;
        flex-direction: column;
    }
    .block_position{
        width: 90%;
    }
    .nft{
        width: 60%;
    }
    .lvlbox{
        width: 90px;
    }
    .slider {
        width: 270px;
        margin: 0px;
    }
    .info_container{
        width: 100%;
    }
    .helpblock{
        width: calc(100% - 10px);
        margin: 0px 0px 0px 10px;
        font-size: 20px;
    }
    .helpblockv2{
        flex-direction: column;
        width: 100%;
    }
    .btn {
        width: 90%;
        margin: 5px 0px;
    }
}
@media (max-width: 415px) {
    .block_filter {
        width: 300px;
        height: 600px;
        flex-direction: column;
    }
    .block_position{
        width: 90%;
    }
    .nft{
        width: 60%;
    }
    .info_container{
        width: 100%;
    }
    .lvlbox{
        width: 60px;
    }
    .slider{
        width: 200px;
    }
    .helpblock{
        width: calc(100% - 10px);
        margin: 0px 0px 0px 10px;
        font-size: 14px;
    }
    .helpblockv2{
        flex-direction: column;
        width: 100%;
    }
    .btn {
        width: 90%;
    }
}
</style>
