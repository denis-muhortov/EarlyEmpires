<script>
import popup_upgrade from "./popup_upgrade.vue";
import { useGameStore } from '../stores/game.js';
export default {
  name: "tool",
  props:{
    tool:{
        required: true,
        type: Object,
        default(){
            return {
                data:{
                    name:"test",
                    level: 72,
                    power:11,
                },
                config:{
                    gen:'A',
                    base_rate: "1.0 EAT",
                    base_cost: "1.0 EAT",
                    base_time: 10,
                    rarity: 1,
                    uprade_multipliers: [
                        {
                        level: 1,
                        multiplier_cost: 110000000,
                        additional_cost: [],
                        multiplier_rate: 110000000,
                        multiplier_time: 110000000,
                        }
                    ]
                }
            }
        }
    }
  },
  data() {
    let game = useGameStore();
    return {
        view: false,
        game: game,
        currentSec: game.getCurrentSeconds(),
        timerId: 0,
    };
  },
  mounted(){
    this.timerId = setInterval(()=>{this.currentSec = this.game.getCurrentSeconds()}, 1000);
  },
  beforeUnmount(){
    clearInterval(this.timerId);
  },
  components: {
    popup_upgrade,
  },
  methods:{
    vieposition(){
        this.view = true;
    },
    unstakeTool() {
        this.$toast.show(`...`, {
            asyncFunction: async () => { return await this.game.removeTool(+this.tool.asset_id); },
            onSuccessMessage: (res) => { 
                console.log(res);
                return `.!.`;
             },
        });
    },
  },
  computed:{
    userTool(){
        let usedtool = this.game.playerUsedTools.find(t => +t.asset_id == +this.tool.asset_id) ?? {
            accumulated: "00 0",
            accumulate_rate: "1 0",
            accumulate_point: "2023-01-17T08:30:20",
            upgrade_end: "2023-01-17T09:30:20",
            level: 72,
        };
        usedtool.tool = this.tool;
        return usedtool;
    },
    toolName(){
        return this.tool.data.name ?? 'Tool';
    },
    toolLevel(){
        return this.userTool.level ?? 1;
    },
    toolGen(){
        return this.tool.config.gen;
    },
    toolPower(){
        return Number(this.tool.data.Power?.split(' ')[0] ?? this.tool.config.base_rate.split(' ')[0]).toFixed(6);
    },
    unclaimed(){
        let accumulated = +this.userTool.accumulated.split(' ')[0];
        let accumulateRate = +this.userTool.accumulate_rate.split(' ')[0];
        let elastedSeconds = this.currentSec - this.game.ISOToSeconds(this.userTool.accumulate_point);

        let ticksCount = elastedSeconds / (this.game.gameConfig?.accumulate_tick ?? 1);

        let resultIncome = accumulated + accumulateRate * ticksCount;

        return resultIncome;
    },
    infoTime(){

        let remainingSecs = this.game.ISOToSeconds(this.userTool.upgrade_end) - this.currentSec;

        if(remainingSecs <= 0){
          return false;
        }

        return `${String(Math.floor(remainingSecs / 3600)).padStart(2, "0")}:${String(Math.floor((remainingSecs % 3600) / 60)).padStart(2, "0")}:${String(Math.floor((remainingSecs % 60))).padStart(2, "0")}`;
    
    },
    toolImage(){

        return `/nft/${this.tool.template.template_id}.png`;

        // return "/nft/free.png";

    },
  },
};
</script>
<template>
    <div class="item">
        <div class="timer">
            <img src="../assets/pageGame/time.png" alt="timer"/>
        </div>
        <teleport to="body">
            <transition name="fade" mode="out-in">
                <popup_upgrade v-if="view" @close="view = false" :userTool="userTool" />
            </transition>
        </teleport>
        <div class="nft" @click="vieposition">
            <img :src=toolImage alt="nft"/>
        </div>
        <div class="info_container">
            <div class="helpblock">
                <div class="info name">
                    {{toolName}}
                </div>
                <div class="info lvl">
                    LVL: {{toolLevel}}
                </div>
                <div class="info gen">
                    GEN: {{toolGen}}
                </div>
                <div class="info power">
                    POWER: {{toolPower}}
                </div>
                <div class="info time" v-if="Boolean(infoTime)">
                    time: {{infoTime}}
                </div>
                <div class="info unclaimed">
                    UNCLAIMED: {{+unclaimed.toFixed(6)}}
                </div>
            </div>
            <div>
                <div class="btn" @click="unstakeTool">
                    Unstake
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.fade-enter-active {
  transform: translate(0%, 0%);
  opacity: 1;
  transition: all 0.25s ease;
}

.fade-leave-active {
  transform: translate(00%, 0%);
  opacity: 0;
}

.fade-enter-from {
  transform: translate(0%, 0%);
  opacity: 0;
}

.fade-leave-to {
  transform: translate(0%, 0%);
}

.timer.active{
    opacity: 1;
}
.timer{
    position: absolute;
    top: 5px;
    left: 5px;
    opacity: 0;
    transition: all 0.25s ease;
}
.timer img{
    width: 30px;
}
.item{
    margin: 10px;
    width: 500px;
    width: 100%;
    height: 240px;
    border: 1px solid var(--vt-c-white);
    background: rgba(0, 0, 0, 0.5);
    flex-direction: row;
    justify-content: space-around;
}
.info_container{
    width: 210px;
    height: 100%;
    text-transform: uppercase;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    justify-content: space-around;
}
.info_container .helpblock{
    width: 100%;
    justify-content: flex-start;
    align-items: flex-start;
}
.btn{
    padding: 2px 25px;
    border: 1px solid var(--vt-c-white);
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    cursor: pointer;
    user-select: none;
    transition: all 0.25s ease;
}
.btn:hover{
    background: rgba(255, 255, 255, 0.2);
}
.nft img{
    width: 100%;
}
.nft{
    width: 150px;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.0);
    transition: all 0.25s;
}
.nft::after{
    content: "UPGRADE";
    position: absolute;
    top: 0%;
    transform: translate(0%, 250%);
    border: 1px solid #F5A516;
    padding: 5px 10px;
    font-size: 18px;
    color: #F5A516;
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    opacity: 0;
    transition: all 0.25s;
}
.nft:hover::after{
    transition: all 0.5s;
    opacity: 1;
    transform: translate(0%, 200%);
}
.nft:hover{
    transition: all 0.5s;
    border: 1px solid rgba(245, 165, 22, 1.0);
}
.nft:hover img{
    filter: brightness(25%);
}
</style>