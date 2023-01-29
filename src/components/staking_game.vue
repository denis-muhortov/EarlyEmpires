<script>
import { useGameStore } from '../stores/game.js';
import item_time_withdrow from "../components/item_time_withdrow.vue";
export default {
  name: "staking_game",
  props:{
  },
  data() {
    let game = useGameStore();
    return {
      game: game,
      amountEMT: 0,
      userLogged: false,
      currentSec: game.getCurrentSeconds(),
      timerId: 0,
      checkedRefunds:[]
    };
  },
  mounted() {
    this.timerId = setInterval(() => { this.currentSec = this.game.getCurrentSeconds() }, 1000);
  },
  beforeUnmount() {
      clearInterval(this.timerId);
  },
  components: {
    item_time_withdrow,
  },
  methods: {
    refresh() {
      this.$toast.show(`await`, {
        asyncFunction: async () => { await this.game.loadstats(); },
        onSuccessMessage: (res) => { return `Game data updated` },
      });
    },
    editBalanceUnstake(amount) {
            this.amountEMT = this.yourStake * (amount / 100);
        },
    editBalanceStake(amount) {
        this.amountEMT = this.game.balanceEMT * (amount / 100);
    },
    stakeToken() {
        this.$toast.show(`await`, {
            asyncFunction: async () => { return await this.game.stake(`${this.amountEMT.toFixed(8)} EMT`); },
            onSuccessMessage: (res) => {
                return `the transaction is successful`;
            },
        });
    },
    unstakeToken() {
        this.$toast.show(`await`, {
            asyncFunction: async () => { return await this.game.unstake(`${this.amountEMT.toFixed(8)} EMT`); },
            onSuccessMessage: (res) => {
                return `the transaction is successful`;
            },
        });
    },
    claimEWT() {
        this.$toast.show(`await`, {
            asyncFunction: async () => { return await this.game.claimEwt(); },
            onSuccessMessage: (res) => {
                return `the transaction is successful`;
            },
        });
    },
    refund() {
        this.$toast.show(`await`, {
            asyncFunction: async () => { return await this.game.refund(); },
            onSuccessMessage: (res) => {
                return `the transaction is successful`;
            },
        });
    },

  },
  computed:{
    yourStake(){
        return +this.game.playerStake?.stake.split(' ')[0] ?? 0;
    },
    totalStake(){
        return +this.game.stakeStat?.stake_sum.split(' ')[0] ?? 1;
    },
    yourRewardEWT(){
        let reward = this.totalRewardEWT * this.yourStake / this.totalStake;
        return Number.isNaN(reward) ? 0 : reward;
    },
    totalRewardEWT(){
        return +this.game.stakeStat?.stake_pool.split(' ')[0] ?? 1;
    },

    refundList(){
        let list = this.game.playerRefunds;
        let update = false;

        let calculated = list.map((refund) => {
            let remainingSecs = this.game.ISOToSeconds(refund.unstake_time) + this.game.gameConfig.stake_refund - this.currentSec;
            refund.time = remainingSecs; 
            refund.amount = +refund.quantity.split(' ')[0];

            let isChecked = this.checkedRefunds.find(r => r == refund.unstake_time);

            if(refund.time < 0 && !isChecked){
                this.checkedRefunds.push(refund.unstake_time);
                if(!update){
                    update = true;
                    this.game.updateRefund();
                }
            }
            return refund;
        })

        return calculated;
        
    },
    unclaimed() {
        let accumulated = +this.game.playerStake?.accumulated.split(' ')[0] ?? 0;
        let accumulateRate = +this.game.playerStake?.accumulate_rate.split(' ')[0] ?? 0;
        let elastedSeconds = this.currentSec - this.game.ISOToSeconds(this.game.playerStake.accumulate_point);

        let ticksCount = elastedSeconds / (this.game.gameConfig?.accumulate_tick ?? 1);

        let resultIncome = accumulated + accumulateRate * ticksCount;

        return resultIncome;
    },
    


  }

};
</script>
<template>
  <div class="block_game">
    <div class="element_control">
      <div class="name_block">
        <div class="container_info_up">
            <div class="name_block_container">
                <div class="reward_block">
                    <p>All stake &nbsp;</p> 
                    <img src="/EMT.png" alt="EMT" />
                    <p> EMT: {{ +totalStake.toFixed(2) }} </p>
                </div>
                <div class="reward_block">
                    <p class="your_info">Your stake &nbsp;</p> 
                    <img src="/EMT.png" alt="EMT" />
                    <p class="your_info"> EMT: {{ +yourStake.toFixed(2) }} </p>
                </div>
            </div>
            <div class="name_block_container">
                <div class="reward_block">
                    <img src="/EWT.png" alt="EWT" />
                    <p>&nbsp;EWT all reward: {{ +totalRewardEWT.toFixed(2) }} per/s</p>
                </div>
                <div class="reward_block">
                    <p class="your_info">Your reward &nbsp; </p> 
                    <img src="/EWT.png" alt="EWT" />
                    <p class="your_info">EWT: {{ +yourRewardEWT.toFixed(2) }} per/s</p>
                </div>
            </div>
        </div>
        <!-- <div class="block_time">
            <p>Update &nbsp; </p> 
                <img src="/EMT.png" alt="EWT" />
            <p>EWT all reward: &nbsp; </p> 
                <img src="../assets/pageGame/time.png" alt="time" />
            <p>{{ time }}</p>
        </div> -->
      </div>
      <div class="reload" @click="refresh()">
        <img src="../assets/pageGame/reload.png" alt="reload" />
      </div>
    </div>
    <div class="content">
        <div class="change_container">
            <div class="block_change">
                <div class="container_change">
                    <div class="container_tokenChange">
                        <div class="token_block">
                            <img src="/EMT.png" alt="EMT" />
                            EMT
                        </div>
                        <input type="text" v-model.number="amountEMT">
                    </div>
                </div>
                <div class="helpblockv2">
                    <div class="helpercolumn_btnContainer">
                        <div class="btn" @click="stakeToken">
                            Stake
                        </div>
                        <div class="helperblock">
                            <div class="btn" @click="editBalanceStake(25)">
                                25%
                            </div>
                            <div class="btn" @click="editBalanceStake(50)">
                                50%
                            </div>
                            <div class="btn" @click="editBalanceStake(75)">
                                75%
                            </div>
                            <div class="btn" @click="editBalanceStake(100)">
                                100%
                            </div>
                        </div>
                    </div>
                    <div class="helpercolumn_btnContainer">
                        <div class="btn" @click="unstakeToken">
                            Unstake
                        </div>
                        <div class="helperblock">
                            <div class="btn" @click="editBalanceUnstake(25)">
                                25%
                            </div>
                            <div class="btn" @click="editBalanceUnstake(50)">
                                50%
                            </div>
                            <div class="btn" @click="editBalanceUnstake(75)">
                                75%
                            </div>
                            <div class="btn" @click="editBalanceUnstake(100)">
                                100%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="block_change">
                <div class="container_change">
                    <div class="container_tokenChange">
                        <div class="token_block claim_block">
                            <img src="/EWT.png" alt="EWT" />
                            EWT&nbsp;{{+unclaimed.toFixed(2)}}
                        </div>
                    </div>
                </div>
                <div class="helpblockv2">
                    <div class="helpercolumn_btnContainer">
                        <div class="btn" @click="claimEWT">
                            Claim
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="withdrow_container_token">
            <div v-if="refundList.length == 0">No refunds</div>
            <item_time_withdrow
            v-for="refund in refundList"
            :key="refund.unstake_time"
            :amount="refund.amount"
            :secLeft="refund.time"
            @refund="refund"
            />
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
  z-index: 1;
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

.container_time_to_start_game{
    width: 100%;
    font-size: 26px;
    flex-direction: row;
    justify-content: space-around;
}
.container_change {
    font-size: 34px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.time_to_start_game {
    flex-direction: row;
}
.time_to_start_game p{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 110px;
}
.container_tokenChange {
    flex-direction: row;
}
.token_block {
    width: 120px;
    flex-direction: row;
    justify-content: flex-start;
    margin: 0px 25px 0px 0px;
}
.token_block.claim_block{
    width: fit-content;
    min-width: 300px;
    margin: 0px;
    justify-content: center;
    align-items: center;
    word-break: break-word;
}

.token_block img {
    width: 45px;
    margin: 0px 5px 0px 0px;
}
.balance {
    width: 100%;
    font-size: 20px;
    letter-spacing: 2px;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
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
.helpblockv2 {
    margin: 20px 0px 0px 0px;
    width: 90%;
    flex-direction: row;
    justify-content: space-around;
}
.helperblock {
    justify-content: flex-end;
    align-items: center;
    flex-direction: row;
}
.helpercolumn_btnContainer .helperblock .btn {
    width: fit-content;
    margin: 0px 3px;
    padding: 0px 5px;
}
.btn {
    width: 200px;
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

.btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.content {
  width: calc(100% - 10px);
  padding: 10px;
  height: calc(100% - 102px);
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  flex-direction: column;
}
.change_container{
    width: 100%;
    justify-content: space-around;
    flex-direction: row;
}

.withdrow_container_token{
    width: 100%;
    padding: 20px 0px 0px 0px;
    font-size: 22px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;    
    align-items: flex-start;
}
.withdrow_container_token img{
    width: 30px;
}
.name_block {
  margin: 10px 0px 30px 0px;
  width: 100%;
  font-size: 22px;
  color: var(--vt-c-white);
  font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.name_block img{
    width: 40px;
}
.container_info_up{
    width: 100%;
    flex-direction: row;
}
.name_block_container{
    width: 80%;
}
.reward_block{
    /* width: 50%; */
    padding: 10px 0px;
    flex-direction: row;
}
.block_time{
    width: 100%;
    padding: 10px 0px 0px 0px;
    flex-direction: row;
}
.block_time img{
    width: 30px;
}
@media (max-width: 1500px) {
    .container_time_to_start_game{
        font-size: 20px;
    }
    .time_to_start_game p{
    width: 90px;
    }
}
@media (max-width: 1400px) {
    .container_time_to_start_game{
        font-size: 16px;
    }
    .time_to_start_game p{
    width: 70px;
    }
}
@media (max-width: 1330px) {
    .name_block{
        font-size: 18px;
    }
    .name_block img{
        width: 30px;
    }
}
@media (max-width: 1160px) {
    .change_container{
        flex-direction: column;
    }
    .block_change:nth-child(2){
        margin: 20px 0px 0px 0px;
    }
    .container_info_up{
        width: 90%;
    }
}
@media (max-width: 1120px) {
    .container_info_up{
        flex-direction: column;
        align-items: flex-start;
    }
    .name_block_container{
        width: 100%;
        align-items: flex-start;
    }
    .block_time{
        width: 90%;
        justify-content: flex-start;
    }
}
@media (max-width: 1000px) {
    .container_time_to_start_game{
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }
    .time_to_start_game{
        margin: 0px 10px 0px 10px;
    }
}
@media (max-width: 640px) {
    .block_game{
        width: 100%;
    }
    .content{
        width: 100%;
        padding: 10px 0px;
    }
}
@media (max-width: 440px) {
    .content{
        padding: 10px 0px;
    }
    .helpblockv2{
        flex-direction: column;
    }
    input{
        width: 200px;
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
    .element_control{
        flex-direction: column-reverse;
    }
    .block_game{
        min-height: 800px;
        height: fit-content;
    }
    .block_logout{
        justify-content: center;
    }
    .btnv2, .btnv2.claim_all{
        width: calc(100% - 20px);
        padding: 5px;
        margin: 5px 10px;
    }
    .container_change .container_tokenChange{
        width: 100%;
        justify-content: space-between;
        flex-direction: row;
    }
    .token_block{
        width: 135px;
        margin: 0px;
    }
    input{
        width: 150px;
    }
    .btn.wax_chage{
        width: calc(100% - 20px);
        margin: 10px 10px 50px 10px;
    }
    .helpblockv2{
        flex-direction: column;
    }
    .block_change{
        padding: 0px 0px 20px 0px;
    }
    .time_to_start_game{
        width: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin: 0px;
    }
    .container_time_to_start_game{
        margin: 0px 0px 20px 0px;
    }
    .name_block_container{
        width: 100%;
        align-items: flex-start;
    }
    .block_time{
        justify-content: flex-start;
    }
    .name_block{
        font-size: 15px;
    }
    .name_block img{
        width: 25px;
    }
    .block_time, .container_info_up{
        width: 100%;
    }
    .your_info{
        font-weight: bold;
    }
    .token_block.claim_block{
        font-size: 24px;
    }
}
</style>