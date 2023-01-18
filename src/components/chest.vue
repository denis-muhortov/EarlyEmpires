<script>
import { useGameStore } from '../stores/game.js';
export default {
  name: "chest_shop",
  emits: ['buy'],
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
  computed:{
    chestName(){
        return this.chest.collectionTemplate?.immutable_data.name ?? 'Chest';
    },
    costMeat(){
        return this.game.findBalance(this.chest.cost, 'MEAT');
    },
    costEat(){
        return this.game.findBalance(this.chest.cost, 'EAT');
    },
    costEet(){
        return this.game.findBalance(this.chest.cost, 'EET');
    },
  }

};
</script>
<template>
    <div class="item">
        <div class="name">
            {{chestName}}
        </div>
        <div class="nft">
            <img :src="chest.image" alt="nft"/>
        </div>
        <div class="amount_container">
            <div class="cost">
                <img src="../assets/shop/wax.png" alt="wax"/>
                {{costMeat > 0 ?  `${costMeat} MEAT ` : ``}}{{costEat > 0 ?  `${costEat} EAT ` : ``}}{{costEet > 0 ?  `${costEet} EET ` : ``}}
            </div>
            <div class="amount">
                {{chest.left}}/{{chest.total}}
            </div>
        </div>
        <div class="rarity" 
        v-for="string in chest.description"
        :key="string.name"
        >
            {{string.name}}: {{string.percent}}%
        </div>

        <div class="btn" @click="$emit('buy')">
            Buy
        </div>
    </div>
</template>
<style scoped>
.item{
    margin: 10px 10px 50px 10px;
    width: 350px;
    height: 420px;
    border: 1px solid var(--vt-c-white);
    background: rgba(0, 0, 0, 0.5);
    justify-content: space-around;
}
.name{
    width: 100%;
    height: 15%;
    text-transform: uppercase;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    justify-content: space-around;   
}
.nft{
    height: 50%;
}
.nft img{
    width: 100%;
    height: 100%;
}
.amount_container{
    width: 100%;
    height: 15%;
    flex-direction: row;
    text-transform: uppercase;
    font-size: 18px;
    color: #F5A516;
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    justify-content: space-around;       
}
.cost{
    flex-direction: row;
}
.cost img{
    width: 25px;
    margin: 0px 10px 0px 0px;
}
.rarity{
    width: 70%;
    justify-content: flex-start;
    align-items: flex-start;
    text-transform: uppercase;
    font-size: 18px;
    color: #F5A516;
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    justify-content: space-around;   
}
.btn{
    position: absolute;
    bottom: 0%;
    transform: translate(0%, 150%);
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