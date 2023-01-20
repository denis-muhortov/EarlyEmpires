
<script>
import popup_filter from "./filter_inventory.vue";
import item_wax from "../components/item_wax.vue";
import item_chest from "../components/item_chest.vue";
import popup_openitem from "./popup_openitem.vue";
import { useGameStore } from '../stores/game.js'
export default {
    name: "wallet_inventory",
    data() {
        const game = useGameStore();
        return {
            game: game,
            view: false,
            viewChest: false,
            resultChestItems: [],
            filterRarity: -1,
            filterType: '',
        };
    },
    components: {
        item_wax,
        item_chest,
        popup_filter,
        popup_openitem,
    },
    methods: {
        viewResultChest(res) {
            this.resultChestItems = res;
            this.viewChest = true;
        },
        vieposition() {
            this.view = true;
        },
        stakeAll() {
            let allTools = this.game.playerTools.filter(t => this.game.walletAssets.some(a => +a.asset_id == t.asset_id));
            this.$toast.show(`await`, {
                asyncFunction: async () => { return await this.game.addTool(allTools.splice(0,50).map(t => t.asset_id)); },
                onSuccessMessage: (res) => {
                    return `the transaction is successful`;
                },
            });
        },
        setRarityFilter(rar) {
            this.filterRarity = rar;
        },
        setTypeFilter(type) {
            this.filterType = type;
        },
        refresh() {
            this.$toast.show(`await`, {
                asyncFunction: async () => { await this.game.loadstats(); },
                onSuccessMessage: (res) => { return `Game data updated` },
            });
        },
        openBox(assetId) {
            this.$toast.show(`await`, {
                asyncFunction: async () => { return await this.game.openBox([assetId]); },
                onSuccessMessage: (res) => {
                    console.log(res);
                    this.viewResultChest(res);
                    return 'the transaction is successful';
                },
            });
        },

    },
    computed: {
        waxItemsList() {
            let assets = this.game.walletAssets;
            let resultItems = [];

            for (let asset of assets) {
                let collectionTemplate = this.game.collectionTemplates.find(t => +t.template_id == +asset.template.template_id);
                let imgPath = `/nft/${asset.template.template_id}.png`;
                let resultItem = {
                    asset_id: +asset.asset_id,
                    type: '',
                    rarity: 0,
                    component: null,
                    tool: null,
                    chest: null,
                }

                let tool = this.game.playerTools.find(c => +c.asset_id == +asset.asset_id);
                if (tool) {
                    resultItem.component = `item_wax`;
                    resultItem.tool = tool;
                    resultItem.tool.image = imgPath;
                    resultItem.tool.collectionTemplate = collectionTemplate;
                    resultItem.rarity = tool.config.rarity;
                    resultItem.type = 'tool';

                    resultItems.push(resultItem);
                    continue;
                }

                let box = this.game.playerBoxes.find(c => +c.asset_id == +asset.asset_id);
                if (box) {
                    resultItem.component = `item_chest`;
                    resultItem.chest = box;
                    resultItem.chest.image = imgPath;
                    resultItem.chest.collectionTemplate = collectionTemplate;
                    resultItem.type = 'chest';
                    resultItems.push(resultItem);
                    continue;
                }
            }

            return resultItems;
        },
        filterList() {
            let list = this.waxItemsList;

            if (this.filterRarity > 0) {
                list = list.filter((item) => {
                    return item.rarity == this.filterRarity;
                });
            }

            if (this.filterType != '') {
                list = list.filter((item) => {
                    return item.type == this.filterType;
                });
            }
            return list;
        },
        sortedList() {

            let list = this.filterList.slice();

            list.sort((a, b) => {
                return b.rarity - a.rarity;
            });
            return list;
        },

    },
};
</script>
<template>
    <div class="block_game">
        <teleport to="body">
            <transition name="fade" mode="out-in">
                <popup_filter v-if="view" @close="view = false" @setRarityFilter="setRarityFilter"
                    @setTypeFilter="setTypeFilter" />
            </transition>
            <transition name="fade" mode="out-in">
                <popup_openitem v-if="viewChest" :resultItems="resultChestItems" @click="viewChest = false" />
            </transition>
        </teleport>
        <div class="element_control">
            <div class="btnv2" @click="stakeAll">
                Stake all
            </div>
            <div class="filter" @click="vieposition">
                <img src="../assets/pageGame/filter.png" alt="filter" />
            </div>
            <div class="reload" @click="refresh()">
                <img src="../assets/pageGame/reload.png" alt="reload" />
            </div>
        </div>
        <div class="content">
            <component v-for="item in sortedList" :key="item.asset_id" :tool="item.tool" :chest="item.chest"
                :is="item.component" @chestOpen="openBox" />
            <div class="view_box" v-if="waxItemsList.length == 0">
                You don't have an nft at the moment
                <a href="">buy</a>
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

.fade-enter-from {
    opacity: 0;
}

.fade-leave-to {
    opacity: 0;
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
    flex-direction: column;
    font-size: 24px;
    color: var(--vt-c-text-dark-2);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.view_box a {
    padding: 0px 0px 0px 0px;
    color: var(--game-color-yellow-lite);
    cursor: pointer;
    transition: all 0.1s ease;
}

.view_box a:hover {
    background: none;
    color: var(--scroll-color-dark-orange);
    text-decoration: underline;
    transition: all 0.1s ease;
}
</style>