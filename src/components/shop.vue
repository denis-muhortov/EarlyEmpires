<script>
import chest from "../components/chest.vue";
import { useGameStore } from '../stores/game.js';



export default {
  name: "window_shop",
  data() {
    let game = useGameStore();
    return {
        game: game,
        buyMeatQuantity: 0,
        sellWaxQuantity: 0,
    };
  },
  components: {
    chest,
  },
  computed:{
    computedShopList(){

    let products = this.game.shopList;
    let resultItems = [];

    for (let product of products) {
        let imgPath = `/product/${product.template_id}.png`;
        let collectionTemplate = this.game.collectionTemplates.find(t => +t.template_id == product.template_id);
        let resultItem = Object.assign({description: [], image: imgPath, collectionTemplate: collectionTemplate}, product);


        let box = this.game.boxesList.find(t => +t.template_id == +product.template_id);
        if (box) {

            let contains = JSON.parse(box.contains)
            resultItem.description = contains;
            resultItems.push(resultItem);
            continue;
    }

}

return resultItems;
    },
  },
  methods:{
    buyMeat() {
        this.$toast.show(`...`, {
            asyncFunction: async () => { return await this.game.depositWax(`${this.sellWaxQuantity.toFixed(8)} WAX`); },
            onSuccessMessage: (res) => { 
                return `.!.`;
             },
        });
    },
    buyShop(id) {
        this.$toast.show(`...`, {
            asyncFunction: async () => { return await this.game.buy(id); },
            onSuccessMessage: (res) => { 
                return `.!.`;
             },
        });
    },
    checkInputWAX(inputEvent) {
        let input = inputEvent.target;

        let quantity = Number(input.value)
        if (quantity < 0) {
            quantity = 0;
        }

        let token = quantity;
        let multiplier = this.game.gameConfig?.meat_by_wax ?? 1;
        token *= multiplier;

        this.buyMeatQuantity = token;
    },
    checkInputMEAT(inputEvent) {
        let input = inputEvent.target;

        let quantity = Number(input.value)
        if (quantity < 0) {
            quantity = 0;
        }

        let token = quantity;
        let multiplier = this.game.gameConfig?.meat_by_wax ?? 1;
        token /= multiplier;

        this.sellWaxQuantity = token;
    },
  }

};
</script>
<template>
    <div class="block_game">
        <div class="element_control">
            <div class="container_change">
                <div class="balance">
                    Balance: {{game.walletBalanceWAX.toFixed(2)}}
                </div>
                <div class="container_tokenChange">
                    <div class="token_block">
                        <img src="../assets/shop/wax.png" alt="token"/>
                        WAX
                    </div>
                    <input type="text" v-model.number="sellWaxQuantity" @input="checkInputWAX($event)">
                </div>
            </div>
            <div class="container_change">
                <div class="balance">
                    Balance: {{game.balanceMEAT.toFixed(2)}}
                </div>
                <div class="container_tokenChange">
                    <div class="token_block">
                        <img src="../assets/shop/wax.png" alt="token"/>
                        MEAT
                    </div>
                    <input type="text" v-model.number="buyMeatQuantity" @input="checkInputMEAT($event)">
                </div>
            </div>
            <div class="btn" @click="buyMeat">
                Confirm
            </div>
            <div class="reload" @click="game.loadstats()">
                <img src="../assets/pageGame/reload.png" alt="reload"/>
            </div>
        </div>
        <div class="content">
            <chest
            v-for="chest in computedShopList"
            :key="chest.id"
            :chest="chest"
            @buy="buyShop(chest.id)"
            />
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
.element_control{
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
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
.btn{
    margin: 5px 0px;
    padding: 6px 30px;
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
.content{
    width: calc(100% - 10px);
    padding: 10px;
    height: fit-content;
    justify-content: center;
    align-items: flex-start;
    align-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
}


.container_change{
    margin: 5px 15px;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.container_change:first-child{
    margin: 5px 50px 5px 15px;
}
.container_change:first-child::before{
    content: '\2192';
    position: absolute;
    right: 0;
    transform: translate(225%, 50%);
}
.balance{
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
}
.container_tokenChange{
    flex-direction: row;
}
.token_block{
    flex-direction: row;
    margin: 0px 5px 0px 0px;
}
.token_block img{
    width: 25px;
    margin: 0px 5px 0px 0px;
}
input{
    outline:none;
    width: 180px;
    padding: 10px;
    border: 1px solid #F5A516;
    background: #F5A51660;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
@media (max-width: 1080px) {
    .element_control{
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
    }
    .container_change:first-child{
        margin: 5px 5px 50px 15px;
    }
    .container_change:first-child::before{
        right: unset;
        bottom: 0;
        transform: translate(0%, 150%) rotate(90deg);
    }
    .btn{
        margin: 10px 0px 5px 100px;
    }
}
</style>
