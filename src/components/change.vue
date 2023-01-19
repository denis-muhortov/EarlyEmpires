<script>
import item_wax from "../components/item_wax.vue";
import item_chest from "../components/item_chest.vue";
import { useGameStore } from '../stores/game.js';


export default {
  name: "game",
  data() {
    let game = useGameStore();
    return {
        game: game,
        amountEET: 0,
        sellTokenSymbol: 'EAT',
        sellQuantity: 0,
        buyQuantity: 0,
        buyMeatQuantity: 0,
        sellWaxQuantity: 0,

    };
  },
  methods:{
    refresh() {
      this.$toast.show(`...---.-.--.-.-.-..-`, {
        asyncFunction: async () => { await this.game.loadstats(); },
        onSuccessMessage: (res) => { return `.!.` },
      });
    },
    buyMeat() {
        this.$toast.show(`...`, {
            asyncFunction: async () => { return await this.game.depositWax(`${this.sellWaxQuantity.toFixed(8)} WAX`); },
            onSuccessMessage: (res) => { 
                return `.!.`;
             },
        });
    },
    depositToken() {
        this.$toast.show(`...`, {
            asyncFunction: async () => { return await this.game.deposit(`${this.amountEET.toFixed(8)} EET`); },
            onSuccessMessage: (res) => { 
                return `нужно больше золота`;
             },
        });
    },
    withdrawToken() {
        this.$toast.show(`...`, {
            asyncFunction: async () => { return await this.game.withdraw(`${this.amountEET.toFixed(8)} EET`); },
            onSuccessMessage: (res) => { 
                return `вы успешно пополнили казну`;
             },
        });
    },
    exchange() {
        this.$toast.show(`...`, {
            asyncFunction: async () => { return await this.game.exchange(this.sellExchangeQuantity); },
            onSuccessMessage: (res) => { 
                return `.!.`;
             },
        });
    },
    checkInputSell() {
        let input = this.$refs.inputsell;

        let quantity = Number(input.value)
        if (quantity < 0) {
            quantity = 0;
        }

        let eatByEet = this.globalHashrate;

        let result = 0;

        if(this.sellTokenSymbol == 'EAT'){

            // check(player_itr->exchange_time + game_config.get().exchange_lock < current_time_point_sec(), ERR_EXCHANGE_LOCKED);

            let eet = quantity * (this.game.gameConfig.population_multiplier / 100000000.0) / eatByEet

            let exchangeFee = eet * (this.game.gameConfig.exchange_tax / 100000000.0);
            let eetReceive = eet - exchangeFee;

            result = eetReceive;
        }else{

            let eat = quantity / (this.game.gameConfig.population_multiplier / 100000000.0) * eatByEet;
            result = eat;
        }


        this.buyQuantity = result;


    },
    checkInputBuy() {
        let input = this.$refs.inputbuy;

        let quantity = Number(input.value)
        if (quantity < 0) {
            quantity = 0;
        }

        let eatByEet = this.globalHashrate;

        let result = 0;


        if(this.sellTokenSymbol == 'EAT'){

            // check(player_itr->exchange_time + game_config.get().exchange_lock < current_time_point_sec(), ERR_EXCHANGE_LOCKED);
            let eetResult = quantity;
            let eetNeed = eetResult / (1-(this.game.gameConfig.exchange_tax / 100000000.0));
            let eetSell = eetNeed / (this.game.gameConfig.population_multiplier / 100000000.0) * eatByEet;
            result = eetSell;
        }else{
            let eetResult = quantity;
            let eetSell = eetResult * (this.game.gameConfig.population_multiplier / 100000000.0) / eatByEet;
            result = eetSell;
        }


        this.sellQuantity = result;
    },
    changeSymbol(){

        if(this.sellTokenSymbol == 'EET'){
            this.sellTokenSymbol = 'EAT'
        }else{
            this.sellTokenSymbol = 'EET'
        }

        let quantity = this.buyQuantity;
        this.sellQuantity = quantity;
    

        this.checkInputSell();

        
    },
    editBalanceWithdraw(amount){
        this.amountEET = this.game.balanceEET*(amount/100);
    },
    editBalanceDeposit(amount){
        this.amountEET = this.game.walletBalanceEET*(amount/100);
    },

    editBalanceSell(amount){
        this.sellQuantity = this.game.findBalance(this.game.player.balances, this.sellTokenSymbol)*(amount/100);
        setTimeout(this.checkInputSell, 0);
    },
    editBalanceBuy(amount){
        
        this.buyQuantity = this.game.findBalance(this.game.player.balances, this.buyTokenSymbol)*(amount/100);
        setTimeout(this.checkInputBuy, 0);
    },
    checkInputWAX(inputEvent) {
        let input = inputEvent.target;

        let quantity = Number(input.value)
        if (quantity < 0) {
            quantity = 0;
        }

        let token = quantity;
        let multiplier = +(this.game.gameConfig?.meat_by_wax.split(' ')[0] ?? 1);
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
        let multiplier = +(this.game.gameConfig?.meat_by_wax.split(' ')[0] ?? 1);
        token /= multiplier;

        this.sellWaxQuantity = token;
    },
  },
  computed:{
    globalHashrate(){
        return +(this.game.gameStat?.global_rate.split(' ')[0] ?? 0);
    },
    userHashrate(){
        return +(this.game.player?.sum_rate.split(' ')[0] ?? 0);
    },
    exchangerateEAT(){
    return +(1/this.globalHashrate)
  },
  exchangerateEET(){
    return +(this.globalHashrate)
  },
  sellExchangeQuantity(){
    return `${this.sellQuantity.toFixed(8)} ${this.sellTokenSymbol}`;
  },
  buyTokenSymbol(){
    if(this.sellTokenSymbol == 'EET'){
        return 'EAT'
    }else{
        return 'EET'
    }
  }
  }
};
</script>
<template>
    <div class="block_game">
        <div class="element_control">
            <div class="container_waxChange">
                    <div class="container_change">
                        <div class="balance">
                            Balance: {{game.walletBalanceWAX.toFixed(8)}}
                        </div>
                        <div class="container_tokenChange">
                            <div class="token_block">
                                <img src="../assets/shop/wax.png" alt="WAX"/>
                                WAX
                            </div>
                            <input type="text" v-model.number="sellWaxQuantity" @input="checkInputWAX($event)">
                        </div>
                    </div>
                    <div class="container_change">
                        <div class="balance">
                            Balance: {{game.balanceMEAT.toFixed(8)}}
                        </div>
                        <div class="container_tokenChange">
                            <div class="token_block">
                                <img src="/MEAT.png" alt="MEAT"/>
                                MEAT
                            </div>
                            <input type="text" v-model.number="buyMeatQuantity" @input="checkInputMEAT($event)">
                        </div>
                    </div>
                    <div class="btn wax_chage" @click="buyMeat">
                        Confirm
                    </div>
                </div>
            <div class="reload" @click="refresh()">
                <img src="../assets/pageGame/reload.png" alt="reload"/>
            </div>
        </div>
        <div class="content">
            <div class="block_change">
                <div class="container_change">
                    <div class="balance">
                        Balance: {{game.findBalance(game.player.balances, sellTokenSymbol)}}
                        <div class="helperblock_eat">
                            <div class="btn" @click="editBalanceSell(25)">
                                25%
                            </div>
                            <div class="btn" @click="editBalanceSell(50)">
                                50%
                            </div>
                            <div class="btn" @click="editBalanceSell(75)">
                                75%
                            </div>
                            <div class="btn" @click="editBalanceSell(100)">
                                100%
                            </div>
                        </div>
                    </div>
                    <div class="container_tokenChange">
                        <div class="token_block">
                            <img :src="`/${sellTokenSymbol}.png`" :alt="sellTokenSymbol"/>
                            {{sellTokenSymbol}}
                        </div>
                        <input type="text"  v-model.number="sellQuantity" @input="checkInputSell()" ref="inputsell">
                        <div class="iconchange" @click="changeSymbol()">
                            <img src="../assets/shop/iconchange.png" alt="iconchange"/>
                        </div>
                    </div>
                </div>
                <div class="info_change">
                    1 {{'EAT'}} = {{exchangerateEAT.toFixed(8)}} {{'EET'}}
                </div>
                <div class="container_change">
                    <div class="balance">
                        Balance: {{game.findBalance(game.player.balances, buyTokenSymbol)}}
                        <div class="helperblock_eat">
                            <div class="btn" @click="editBalanceBuy(25)">
                                25%
                            </div>
                            <div class="btn" @click="editBalanceBuy(50)">
                                50%
                            </div>
                            <div class="btn" @click="editBalanceBuy(75)">
                                75%
                            </div>
                            <div class="btn" @click="editBalanceBuy(100)">
                                100%
                            </div>
                        </div>
                    </div>
                    <div class="container_tokenChange">
                        <div class="token_block">
                            <img :src="`/${buyTokenSymbol}.png`" :alt="buyTokenSymbol"/>
                            {{buyTokenSymbol}}
                        </div>
                        <input type="text" v-model.number="buyQuantity" @input="checkInputBuy()" ref="inputbuy">
                    </div>
                </div>
                <div class="btn confirm" @click="exchange">
                    Confirm
                </div>
            </div>
            <div class="block_change">
                <div class="container_change">
                    <div class="balance">
                        Balance: {{game.walletBalanceEET.toFixed(4)}}
                    </div>
                    <div class="container_tokenChange">
                        <div class="token_block">
                            <img src="/EET.png" alt="EET"/>
                            EET
                        </div>
                        <input type="text" v-model.number="amountEET">
                    </div>
                </div>
                <div class="helpblockv2">
                    <div class="helpercolumn_btnContainer">
                        <div class="btn" @click="depositToken">
                            Deposit
                        </div>
                        <div class="helperblock">
                            <div class="btn" @click="editBalanceDeposit(25)">
                                25%
                            </div>
                            <div class="btn" @click="editBalanceDeposit(50)">
                                50%
                            </div>
                            <div class="btn" @click="editBalanceDeposit(75)">
                                75%
                            </div>
                            <div class="btn" @click="editBalanceDeposit(100)">
                                100%
                            </div>
                        </div>
                    </div>
                    <div class="helpercolumn_btnContainer">
                        <div class="btn" @click="withdrawToken">
                            Withdraw
                        </div>
                        <div class="helperblock">
                            <div class="btn" @click="editBalanceWithdraw(25)">
                                25%
                            </div>
                            <div class="btn" @click="editBalanceWithdraw(50)">
                                50%
                            </div>
                            <div class="btn" @click="editBalanceWithdraw(75)">
                                75%
                            </div>
                            <div class="btn" @click="editBalanceWithdraw(100)">
                                100%
                            </div>
                        </div>
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
    height: 100%;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-direction: row-reverse;
}


.info_change{
    flex-direction: row;
    margin: 30px 0px;
    font-size: 28px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;   
}
.info_change .btn{
    margin: 0px 0px 0px 20px;
}
.container_change{
    font-size: 34px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.balance{
    width: 100%;
    font-size: 20px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
}
.container_tokenChange{
    flex-direction: row;
}
.token_block{
    width: 100px;
    flex-direction: row;
    justify-content: flex-start;
    margin: 0px 25px 0px 0px;
}
.token_block img{
    width: 45px;
    margin: 0px 5px 0px 0px;
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
.iconchange{
    position: absolute;
    right: 0px;
    cursor: pointer;
    transform: translate(150%, 0%);
    transition: all 0.25s ease;
}
.iconchange img{
    width: 32px;
}
.iconchange:hover{
    transform: translate(150%, 0%) rotate(180deg);
}

.description{
    margin: 40px 0px 10px 0px;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;    
}
.helpblockv2{
    margin: 20px 0px 0px 0px;
    width: 90%;
    flex-direction: row;
    justify-content: space-around;
}
.btn{
    margin: 5px 0px;
    padding: 8px 35px;
    border: 1px solid var(--vt-c-white);
    font-size: 18px;
    color: var(--vt-c-white);
    text-transform: uppercase;
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    cursor: pointer;
    user-select: none;
    transition: all 0.25s ease;
}
.btn:hover{
    background: rgba(255, 255, 255, 0.2);
}

.block_change{
    width: calc(40% - 10px);
    margin: 0px 10px;
}

.helperblock{
    justify-content: flex-end;
    align-items: center;
    flex-direction: row;
}
.btn.confirm{
    margin: 30px 0px 0px 0px;
}
.helpercolumn_btnContainer .helperblock .btn{
    width: fit-content;
    margin: 0px 3px;
    padding: 0px 5px;
}
.helpercolumn_btnContainer .btn{
    width: 200px;
}
.helperblock_eat{
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
}
.helperblock_eat .btn{
    width: fit-content;
    margin: 0px 10px 0px 0px;
    padding: 0px 10px;
}
.container_waxChange{
    flex-direction: row;
}
.container_waxChange .container_change{
    margin: 5px 15px;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.container_waxChange .container_change:first-child{
    margin: 5px 50px 5px 15px;
}
.container_waxChange .container_change:first-child::before{
    content: '\2192';
    position: absolute;
    right: 0;
    transform: translate(225%, 50%);
}
.btn.wax_chage{
    padding: 6px 30px;
    margin: 32px 0px 0px 0px;
}
@media (max-width: 1440px) {
    .block_change{
    width: calc(50% - 10px);
    margin: 0px 10px;
    }
    .element_control{
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
    }
    .container_waxChange{
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column; 
    }
    .container_waxChange .container_change:first-child{
        margin: 5px 5px 10px 15px;
    }
    .container_waxChange .container_change:first-child::before{
        right: unset;
        bottom: 0;
        transform: translate(0%, 150%) rotate(90deg);
    }
    .btn.wax_chage{
        margin: 10px 0px 5px 100px;
    }   
}
@media (max-width: 1300px) {
    .block_change{
    width: calc(100% - 10px);
    margin: 0px 10px;
    }   
    .content{
        flex-direction: column-reverse;
    }
    .block_change:last-child{
        margin: 0px 0px 100px 0px;
    }
}
@media (max-width: 780px) {
    input{
        width: 150px;
    }
}
@media (max-width: 640px) {
    input{
        width: 180px;
    }
}
@media (max-width: 450px) {
    .content{
        width: 100%;
        margin: 0px 0px;
    }
    .block_change{
        width: 100%;
        margin: 0px 0px;
    }   
    input{
        width: 120px;
    }
}

</style>