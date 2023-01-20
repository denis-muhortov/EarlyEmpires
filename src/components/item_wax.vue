<script>
import { useGameStore } from '../stores/game.js';
export default {
    name: "wax_item",
    props: {
        tool: {
            required: true,
            type: Object,
        }
    },
    data() {
        let game = useGameStore();
        return {
            game: game,
        };
    },
    computed: {
        toolName() {
            return this.tool.data.name ?? 'Tool';
        },
        toolLevel() {
            return this.tool.data.Level ?? 0;
        },
        toolPower() {
            return +this.game.calcAccumulateRate(this.tool.config, this.toolLevel).toFixed(6);
            //return +Number(this.tool.data.Power?.split(' ')[0] ?? this.tool.config.base_rate.split(' ')[0]).toFixed(6);
        },
    },
    methods: {
        stakeTool() {
            this.$toast.show(`await`, {
                asyncFunction: async () => { return await this.game.addTool([+this.tool.asset_id]); },
                onSuccessMessage: (res) => {
                    console.log(res);
                    return `the transaction is successful`;
                },
            });
        },
    }

};
</script>
<template>
    <div class="item">
        <div class="nft">
            <img :src="tool.image" alt="nft" />
        </div>
        <div class="info_container">
            <div class="helpblock">
                <div class="info name">
                    {{ toolName }}
                </div>
                <div class="info lvl">
                    LVL: {{ toolLevel }}
                </div>
                <div class="info power">
                    POWER: {{ toolPower }}
                </div>
            </div>
            <div>
                <div class="btn" @click="stakeTool">
                    Stake
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.item {
    margin: 10px;
    width: 370px;
    height: 220px;
    border: 1px solid var(--vt-c-white);
    background: rgba(0, 0, 0, 0.5);
    flex-direction: row;
    justify-content: space-around;
}

.info_container {
    height: 100%;
    text-transform: uppercase;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    justify-content: space-around;
}

.info_container .helpblock {
    justify-content: flex-start;
    align-items: flex-start;
}

.nft img {
    width: 100%;
}

.nft {
    width: 150px;
    border: 1px solid rgba(0, 0, 0, 0.0);
    transition: all 0.25s;
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
</style>