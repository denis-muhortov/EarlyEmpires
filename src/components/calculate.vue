<script>
import { useGameStore } from '../stores/game.js';
export default {
    name: "upgrade_calculator",
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
    mounted() {
        this.selectedGen = this.genList[0] ?? 1;
        this.selectedRarity = this.rarityNamedList[0]?.value ?? 1;
    },
    computed: {
        rarityNamedList() {
            return this.game.rarityNamedList;
        },
        genList() {
            let list = [];

            for (let config of this.game.toolsList) {
                if (!list.find(e => e == config.gen)) {
                    list.push(config.gen);
                }
            }

            return list;
        },
        selectedToolConfig() {
            let config = this.game.toolsList.find(t => t.gen == this.selectedGen && t.rarity == this.selectedRarity);
            return config;
        },
        toolExpectedPower() {
            if (!this.selectedToolConfig) return 0;
            let expRate = this.game.calcAccumulateRate(this.selectedToolConfig, this.newLevel);
            return expRate;
        },
        toolExpectedUpgradePaid() {
            if (!this.selectedToolConfig) return { balance: ["0 EAT"], time: 0, speedup: "0 EAT" };

            return this.game.calcUpgradePaid(this.selectedToolConfig, this.oldLevel, this.newLevel);
        },
        toolExpectedUpgradeTime() {

            let remainingSecs = this.toolExpectedUpgradePaid.time;

            if (remainingSecs <= 0) {
                return "00:00:00";
            }

            return `${String(Math.floor(remainingSecs / 3600)).padStart(2, "0")}:${String(Math.floor((remainingSecs % 3600) / 60)).padStart(2, "0")}:${String(Math.floor((remainingSecs % 60))).padStart(2, "0")}`;

        },
        toolExpectedSpeedUpCost() {
            return [this.toolExpectedUpgradePaid.speedup];
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
    },
    methods: {
        refresh() {
            this.$toast.show(`await`, {
                asyncFunction: async () => { await this.game.loadstats(); },
                onSuccessMessage: (res) => { return `Game data updated` },
            });
        },
    }

};
</script>
<template>
    <div class="block_game">
        <div class="element_control">
            <div class="reload" @click="refresh()">
                <img src="../assets/pageGame/reload.png" alt="reload" />
            </div>
        </div>
        <div class="content">
            <div class="position_container">
                <div class="block_position">
                    <p>Rarity</p>
                    <select v-model="selectedRarity">
                        <option v-for="rar in rarityNamedList" :key="rar.value" :value="rar.value">{{ rar.name }}
                        </option>
                    </select>
                </div>
                <div class="block_position">
                    <p>Generation</p>
                    <select v-model="selectedGen">
                        <option v-for="gen in genList" :key="gen" :value="gen">{{ gen }}</option>
                    </select>
                </div>
                <div class="block_position">
                    <p>Lvl</p>
                    <input type="number" step="1" min="0" :max="newLevel" v-model.number="oldLevel">
                </div>
                <div class="block_position">
                    <p>Target lvl</p>
                    <input type="number" :min="oldLevel" max="100" v-model.number="newLevel">
                </div>
            </div>
            <div class="description_container">
                <div class="block_description">
                    new power: {{+ toolExpectedPower.toFixed(8)}}
                </div>
                <div class="block_description">
                    upgrade cost:
                    <div class="cost_block" v-for="token in toolExpectedUpgradeCost" :key="token">
                        <p>{{+ (+token.split(' ')[0]).toFixed(2)}}</p>
                        <img :src="`/${token.split(' ')[1]}.png`" :alt="token.split(' ')[1]" />
                    </div>
                </div>
                <div class="block_description">
                    upgrade time: {{ toolExpectedUpgradeTime }}
                </div>
                <div class="block_description">
                    speedup cost:
                    <div class="cost_block" v-for="token in toolExpectedSpeedUpCost" :key="token">
                        <p>{{+ (+token.split(' ')[0]).toFixed(2)}}</p>
                        <img :src="`/${token.split(' ')[1]}.png`" :alt="token.split(' ')[1]" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.block_game {
    width: 95%;
    height: 800px;
    flex-direction: column;
    justify-content: flex-start;
    border: 1px solid #D89718;
    background: rgba(23, 27, 40, 0.5);
    overflow-y: auto;
}

.reload {
    cursor: pointer;
    border: 1px solid #D89718;
    position: absolute;
    right: 10px;
    top: 5px;
    margin: 5px 0px;
    z-index: 2;
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

.content {
    width: calc(100% - 10px);
    padding: 10px;
    height: fit-content;
    height: 100%;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-direction: column;
}

input {
    outline: none;
    width: 280px;
    padding: 10px;
    border: 1px solid #F5A516;
    background: #F5A51660;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}


.position_container,
.description_container {
    width: 100%;
    height: 50%;
    justify-content: center;
    align-items: flex-start;
}

.block_position {
    margin: 10px 0px;
    flex-direction: row;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.block_position p {
    width: 150px;
}

select {
    outline: none;
    width: 280px;
    padding: 10px;
    font-size: 18px;
    border: 1px solid #F5A516;
    background: #F5A51660;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

select:focus {
    outline: none;
}

option {
    cursor: pointer;
    font-size: 18px;
    background: rgba(255, 255, 255, 0.0);
    color: black;
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.block_description {
    flex-direction: row;
    margin: 10px 0px;
    font-size: 24px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.cost_block {
    flex-direction: row;
}

.cost_block p {
    letter-spacing: 2px;
    margin: 0px 5px 0px 15px;
}

.cost_block img {
    width: 30px;
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
    select, input{
        width: 140px;
    }
    .block_position p{
        width: 120px;
    }
    .block_position{
        width: 100%;
    }
    .block_description{
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 26px;
    }
    .cost_block{
        width: 100%;
    }
}
</style>