
<script>
import tool from "./tool.vue";
import popup_filter from "./filter_game.vue";
import { useGameStore } from '../stores/game.js'
export default {
  name: "game",
  data() {
    const game = useGameStore();
    return {
        game: game,
        view: false,
        filterRarity: -1,
        filterGen: -1,
    };
  },
  components: {
    tool,
    popup_filter,
  },
  methods:{
    vieposition(){
        this.view = true;
    },
    setRarityFilter(rar){
        this.filterRarity = rar;
    },
    setGenFilter(gen){
        this.filterGen = gen;
    },
    unstakeAll() {
        this.$toast.show(`...`, {
            asyncFunction: async () => { return await this.game.removeAllTools(); },
            onSuccessMessage: (res) => { 
                console.log(res);
                return `.!.`;
             },
        });
    },
    claimAll() {
        this.$toast.show(`...`, {
            asyncFunction: async () => { return await this.game.claimAll(); },
            onSuccessMessage: (res) => { 
                console.log(res);
                return `.!.`;
             },
        });
    },
  },
  computed:{
    toolsList() {
        let tools = this.game.playerTools;
        let resultItems = [];

        for (let tool of tools) {
                let resultItem = {
                    asset_id: +asset.asset_id,
                    rarity: tool.config.rarity,
                    gen: tool.config.gen,
                }
                resultItems.push(Object.assign({}, tool, resultItem));
        }

        return resultItems;
    },
    filterList() {
        let list = this.toolsList;

        if(this.filterRarity > 0){
            list = list.filter((item)=> {
                return item.rarity == this.filterRarity;
            });
        }

        if(this.filterGen > 0){
            list = list.filter((item)=> {
                return item.gen == this.filterGen;
            });
        }
        return list;
    },
  }
};
</script>
<template>
    <div class="block_game">
        <teleport to="body">
            <transition name="fade" mode="out-in">
                <popup_filter v-if="view" @close="view = false" @setRarityFilter="setRarityFilter"  @setGenFilter="setGenFilter"/>
            </transition>
        </teleport>
        <div class="element_control">
            <div class="btnv2" @click="unstakeAll">
                Unstake all
            </div>
            <div class="btnv2" @click="claimAll">
                Claim all
            </div>
            <div class="filter" @click="vieposition">
                <img src="../assets/pageGame/filter.png" alt="filter"/>
            </div>
            <div class="reload" @click="game.loadstats()">
                <img src="../assets/pageGame/reload.png" alt="reload"/>
            </div>
        </div>
        <div class="content">
            <tool
            v-for="item in filterList"
            :key="item.asset_id"
            :tool="item"/>
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



.block_game{
    width: 95%;
    height: 800px;
    flex-direction: column;
    justify-content: flex-start;
    border: 1px solid #D89718;
    background: rgba(23, 27, 40, 0.5);
    overflow-y: auto;
}
.filter:hover{
    border: 1px solid #D89718;
    background: #D8971820;
}
.filter{
    margin: 5px 0px 0px;
    border: 1px solid #D8971800;
    cursor: pointer;
    transition: all 0.25s ease;
}
.filter img{
    width: 89%;
}
.reload{
    cursor: pointer;
    border: 1px solid #D89718;
    position: absolute;
    right: 10px;
    top: 5px;
    margin: 5px 0px;
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
.btnv2{
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
.btnv2:hover{
    background: rgba(245, 165, 22, 0.2);
}
.content{
    width: calc(100% - 10px);
    padding: 10px;
    height: fit-content;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
}
@media (max-width: 1080px) {
    .element_control{
        flex-direction: column;
        align-items: flex-start;
    }
    .filter{
        position: absolute;
        top: 5px;
        right: 60px;
        border: 1px solid#D89718;
    }
    .filter img{
    width: 77%;
    }
    .btnv2{
        margin: 10px 0px 10px 25px;
    }
}
</style>