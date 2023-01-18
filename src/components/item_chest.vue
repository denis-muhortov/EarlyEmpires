<script>
import { useGameStore } from '../stores/game.js';
import popup_openitem from "./popup_openitem.vue";
export default {
  name: "chest_item",
  props:{
    chest:{
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
  components: {
    popup_openitem,
  },
  computed:{
    chestName(){
        return this.chest.collectionTemplate?.immutable_data.name ?? 'Chest';
    },
    costMeat(){
        return this.game.findBalance(this.chest.cost, 'MEAT');
    },
    chestContains(){
        let contains = this.chest.config.contains.replaceAll("'", '"');
        return JSON.parse(contains);
    },
  },
  methods:{
    openBox() {
        this.$toast.show(`...`, {
            asyncFunction: async () => { return await this.game.openBox([+this.chest.asset_id]); },
            onSuccessMessage: (res) => { 
                console.log(res);
                return `.!.`;
             },
        });
    },
  }

};
</script>
<template>
    <div class="item">
        <teleport to="body">
            <transition name="fade" mode="out-in">
                <popup_openitem v-if="view" @close="view = false" :userTool="userTool" />
            </transition>
        </teleport>
        <div class="nft">
            <img :src="chest.image"  alt="nft"/>
        </div>
        <div class="info_container">
            <div class="helpblock">
                <div class="info name">
                    {{chestName}}
                </div>


                <div class="info rarity" 
                v-for="string in chestContains"
                :key="string.name"
                >
                    {{string.name}}: {{string.percent}}%
                </div>


            </div>
            <div>
                <div class="btn" @click="openBox">
                    open
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.item{
    margin: 10px;
    width: 370px;
    height: 220px;
    border: 1px solid var(--vt-c-white);
    background: rgba(0, 0, 0, 0.5);
    flex-direction: row;
    justify-content: space-around;
}
.nft img{
    width: 180px;
}
.info_container{
    height: 100%;
    text-transform: uppercase;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    justify-content: space-around;
}
.info_container .helpblock{
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
</style>