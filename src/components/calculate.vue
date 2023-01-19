<script>
import { useGameStore } from '../stores/game.js';
export default {
  name: "calculator",
  data() {
    let game = useGameStore();
    return {
        game: game,
        selectedGen: 1,
        selectedRarity: 1,
        oldLevel: 1,
        newLevel: 2
    };
  },
  components: {
  },
  mounted(){
    this.selectedGen = this.genList[0];
    this.selectedRarity = this.rarityList[0];
  },
  computed:{
    rarityList(){
        let list = [0];

        for(let config of this.game.toolsList){
            if(!list.find(e => e == config.rarity)){
                list.push(config.rarity);
            }
        }

        return list;
    },
    rarityNamedList(){
        let list = [];

        for(let rarity of this.rarityList){
           switch(rarity){
            case 1: list.push({name:'Common', value: rarity}); break;
            case 2: list.push({name:'Rare', value: rarity}); break;
            case 3: list.push({name:'Epic', value: rarity}); break;
            case 4: list.push({name:'Legendary', value: rarity}); break;
            default: list.push({name:'Undef', value: rarity}); break;
           }
        }

        return list;
    },
    genList(){
        let list = [0];

        for(let config of this.game.toolsList){
            if(!list.find(e => e == config.gen)){
                list.push(config.gen);
            }
        }

        return list;
    },
    selectedToolConfig(){
        let config = this.game.toolsList.find(t => t.gen == this.selectedGen &&  t.rarity == this.selectedRarity);
        return config;
    },
    toolExpectedPower(){
        if(!this.selectedToolConfig) return 0;
        let expRate = this.game.calcAccumulateRate(this.selectedToolConfig, this.newLevel);
        return expRate;
    },
    toolExpectedUpgradePaid(){
        if(!this.selectedToolConfig) return {balance: ["0 EAT"], time: 0, speedup: "0 EAT"}; 

        return this.game.calcUpgradePaid(this.selectedToolConfig, this.oldLevel, this.newLevel);
    },
    toolExpectedUpgradeTime(){

    let remainingSecs = this.toolExpectedUpgradePaid.time;

    if(remainingSecs <= 0){
      return "00:00:00";
    }

    return `${String(Math.floor(remainingSecs / 3600)).padStart(2, "0")}:${String(Math.floor((remainingSecs % 3600) / 60)).padStart(2, "0")}:${String(Math.floor((remainingSecs % 60))).padStart(2, "0")}`;

    },
    toolExpectedSpeedUpCost(){
        return [this.toolExpectedUpgradePaid.speedup];
    },
    toolExpectedUpgradeCost(){

    let couner = {};
    let balance = this.toolExpectedUpgradePaid.balance;

    for(let token of balance)
    {
        let amount = +token.split(' ')[0];
        let symbol = token.split(' ')[1];
        if(couner[symbol]){
            couner[symbol] += amount;
        }
        else{
            couner[symbol] = amount;
        }
    }
    let list = [];
    for(let prop in couner){
         list.push(`${couner[prop].toFixed(8)} ${prop}`)
     }


    return list;

    },
  },
  methods:{
    refresh() {
      this.$toast.show(`...---.-.--.-.-.-..-`, {
        asyncFunction: async () => { await this.game.loadstats(); },
        onSuccessMessage: (res) => { return `.!.` },
      });
    },
  }

};
</script>
<template>
    <div class="block_game">
        <div class="element_control">
            <div class="reload" @click="refresh()">
                <img src="../assets/pageGame/reload.png" alt="reload"/>
            </div>
        </div>
        <div class="content">
            <div class="position_container">
                <div class="block_position">
                    <p>Rarity</p>
                    <select v-model="selectedRarity">
                        <option
                        v-for="rar in rarityNamedList"
                        :key="rar.value"
                        :value="rar.value"
                        >{{rar.name}}</option>
                    </select>
                </div>
                <div class="block_position">
                    <p>Generation</p>
                    <select  v-model="selectedGen">
                        <option
                        v-for="gen in genList"
                        :key="gen"
                        :value="gen"
                        >{{gen}}</option>
                    </select>
                </div>
                <div class="block_position">
                    <p>Lvl</p>
                    <input type="text" v-model.number="oldLevel">
                </div>
                <div class="block_position">
                    <p>Target lvl</p>
                    <input type="text" v-model.number="newLevel">
                </div>
            </div>
            <div class="description_container">
                <div class="block_description">
                    new power: {{toolExpectedPower}}
                </div>
                <div class="block_description">
                    upgrade cost: 
                        <div class="cost_block"
                        v-for="token in toolExpectedUpgradeCost"
                        :key="token"
                        >
                            <p>{{+(+token.split(' ')[0]).toFixed(2)}}</p> 
                            <img :src="`/${token.split(' ')[1]}.png`" :alt="token.split(' ')[1]"/>
                        </div>
                </div>
                <div class="block_description">
                    upgrade time: {{toolExpectedUpgradeTime}}
                </div>
                <div class="block_description">
                    speedup cost: <div class="cost_block"
                        v-for="token in toolExpectedSpeedUpCost"
                        :key="token"
                        >
                            <p>{{+(+token.split(' ')[0]).toFixed(2)}}</p> 
                            <img :src="`/${token.split(' ')[1]}.png`" :alt="token.split(' ')[1]"/>
                        </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.block_game{
    width: 95%;
    height: 800px;
    flex-direction: column;
    justify-content: flex-start;
    border: 1px solid #D89718;
    background: rgba(23, 27, 40, 0.5);
    overflow-y: auto;
}
.reload{
    cursor: pointer;
    border: 1px solid #D89718;
    position: absolute;
    right: 10px;
    top: 5px;
    margin: 5px 0px;
    z-index: 2;
    transition: all 0.25s ease;
}
.reload:hover{
    background: #D8971840;
}
.element_control{
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
}
.content{
    width: calc(100% - 10px);
    padding: 10px;
    height: fit-content;
    height: 100%;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-direction: column;
}

input{
    outline:none;
    width: 280px;
    padding: 10px;
    border: 1px solid #F5A516;
    background: #F5A51660;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}


.position_container, .description_container{
    width: 100%;
    height: 50%;
    justify-content: center;
    align-items: flex-start;
}
.block_position{
    margin: 10px 0px;
    flex-direction: row;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;   
}
.block_position p{
    width: 150px;
}
select {
    outline:none;
    width: 280px;
    padding: 10px;
    font-size: 18px;
    border: 1px solid #F5A516;
    background: #F5A51660;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;   
}
select:focus {
    outline:none;
}
option{
    cursor: pointer;
    font-size: 18px;
    background: rgba(255, 255, 255, 0.0);
    color: black;
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;       
}
.block_description{
    flex-direction: row;
    margin: 10px 0px;
    font-size: 24px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;      
}
.cost_block{
    flex-direction: row;
}
.cost_block p{
    margin: 0px 5px 0px 15px;
}
.cost_block img{
    width: 30px;
}
</style>