<script>
import { useGameStore } from '../stores/game.js';
export default {
  name: "chest_item",
  props:{
    chest:{
        required: true,
        type: Object,
    }
  },
  emits:["openChest"],
  data() {
    let game = useGameStore();
    return {
        game: game,
    };
  },
  components: {
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
  }

};
</script>
<template>
    <div class="item">
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
                <div class="btn" @click="this.$emit('chestOpen', chest.asset_id)">
                    open
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