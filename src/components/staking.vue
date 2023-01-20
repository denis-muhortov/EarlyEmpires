<script>
import player_staking from "../components/player_staking.vue";
import { useGameStore } from '../stores/game.js';
export default {
  name: "stake_leaderboard",
  props:{
    startISO:{
        type: String,
        required: true
    }
  },
  data() {
    let game = useGameStore();
    return {
      game: game,
      amountEET: 0,
      userLogged: false,
      currentSec: game.getCurrentSeconds(),
      timerId: 0,
    };
  },
  mounted() {
    this.timerId = setInterval(() => { this.currentSec = this.game.getCurrentSeconds() }, 1000);
  },
  beforeUnmount() {
      clearInterval(this.timerId);
  },
  components: {
    player_staking,
  },
  methods: {
    refresh() {
      this.$toast.show(`...---.-.--.-.-.-..-`, {
        asyncFunction: async () => { await this.game.loadstats(); },
        onSuccessMessage: (res) => { return `.!.` },
      });
    },
    editBalanceWithdraw(amount) {
            this.amountEET = this.game.balanceEET * (amount / 100);
        },
    editBalanceDeposit(amount) {
        this.amountEET = this.game.walletBalanceEET * (amount / 100);
    },
    depositToken() {
        this.$toast.show(`...`, {
            asyncFunction: async () => { return await this.game.deposit(`${this.amountEET.toFixed(8)} EET`); },
            onSuccessMessage: (res) => {
                return `.!.`;
            },
        });
    },
    withdrawToken() {
        this.$toast.show(`...`, {
            asyncFunction: async () => { return await this.game.withdraw(`${this.amountEET.toFixed(8)} EET`); },
            onSuccessMessage: (res) => {
                return `.!.`;
            },
        });
    },

  },
  computed:{
    awardTime() {

        let remainingSecs = Math.ceil(this.currentSec/86400)*86400 - this.currentSec;

        if (remainingSecs <= 0) {
            return '00:00:00';
        }

        return `${String(Math.floor(remainingSecs / 3600)).padStart(2, "0")}:${String(Math.floor((remainingSecs % 3600) / 60)).padStart(2, "0")}:${String(Math.floor((remainingSecs % 60))).padStart(2, "0")}`;

    },
    startTime() {

    let remainingSecs = this.game.ISOToSeconds(this.startISO) - this.currentSec ;

    if (remainingSecs <= 0) {
        return '00:00:00';
    }

    return `${String(Math.floor(remainingSecs / 3600)).padStart(2, "0")}:${String(Math.floor((remainingSecs % 3600) / 60)).padStart(2, "0")}:${String(Math.floor((remainingSecs % 60))).padStart(2, "0")}`;

    },
  }

};
</script>
<template>
  <div class="block_game">
    <div class="element_control">
      <div class="name_block">
        <div class="container_time_to_start_game">
            <div class="time_to_start_game">
                Time before the game starts: <p>{{startTime}}</p>
            </div>
            <div class="time_to_start_game">
                Time before awards are awarded: <p>{{awardTime}}</p>
            </div>
        </div>
        <div class="block_change">
                <div class="container_change">
                    <div class="balance">
                        Balance: {{ game.walletBalanceEET.toFixed(2) }}
                    </div>
                    <div class="container_tokenChange">
                        <div class="token_block">
                            <img src="/EET.png" alt="EET" />
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
                        <div class="btn" @click="withdrawToken">л
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
      <div class="reload" @click="refresh()">
        <img src="../assets/pageGame/reload.png" alt="reload" />
      </div>
    </div>
    <div class="content">
      <player_staking />
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
    width: 100px;
    flex-direction: row;
    justify-content: flex-start;
    margin: 0px 25px 0px 0px;
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

.name_block {
  margin: 30px 0px 30px 0px;
  width: 100%;
  font-size: 42px;
  color: var(--vt-c-white);
  font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
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
@media (max-width: 1120px) {
    .container_time_to_start_game{
        flex-wrap: wrap;
        justify-content: flex-start;
    }
    .time_to_start_game{
        margin: 0px 10px 0px 10px;
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
</style>