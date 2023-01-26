<script>
import { useGameStore } from '../stores/game.js';


export default {
    name: "exchangeTokenOtherToken",
    emits: ['close'],
    // emits: ['statusPanel'],
    data() {
        let game = useGameStore();
        return {
            game: game,
        };
    },
    methods: {

    },
    computed: {
    }
};
</script>
<template>
    <div class="panel_block_main">
        <div class="reload" @click="refresh()">
            <img src="../assets/pageGame/reload.png" alt="reload" />
        </div>
        <div class="back_panel" @close="vieposition()">
            <img src="../assets/pageGame/back.png" alt="back" />
            back
        </div>
        <div class="block_change">
            <div class="container_change">
                <div class="balance">
                    Wallet balance: {{ 9999 }}
                </div>
                <div class="container_tokenChange">
                    <div class="token_block">
                        <img :src="`/EET.png`" alt="EET" />
                    </div>
                    <input type="number" min="0">
                    <div class="btn" @click="withdrawToken">
                        Deposit
                    </div>
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
        <div class="block_change">
            <div class="container_change">
                <div class="balance">
                    Wallet balance: {{ 9999 }}
                </div>
                <div class="container_tokenChange">
                    <div class="token_block">
                        <img :src="`/EMT.png`" alt="EMT" />
                    </div>
                    <input type="number" min="0">
                    <div class="btn" @click="withdrawToken">
                        Deposit
                    </div>
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
</template>



<style scoped>
.back_panel {
    cursor: pointer;
    border: 1px solid #D89718;
    position: absolute;
    left: 10px;
    top: 5px;
    margin: 5px 0px;
    padding: 2px 10px;
    font-size: 26px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    flex-direction: row;
    user-select: none;
    z-index: 2;
    transition: all 0.25s ease;
}

.back_panel:hover {
    background: #D8971840;
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
.panel_block_main{
    width: 100%;
    height: 100%;
}

.block_change{
    margin: 20px 0px;
}
.container_change {
    font-size: 34px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    align-items: flex-start;
}

.balance {
    letter-spacing: 2px;
    width: 100%;
    font-size: 20px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
}
.container_tokenChange {
    flex-direction: row;
}

.token_block {
    width: 50px;
    flex-direction: row;
    justify-content: flex-start;
    margin: 0px 5px 0px 0px;
}

.token_block img {
    width: 45px;
    margin: 0px 5px 0px 0px;
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
.helperblock{
    width: 280px;
    margin: 0px 0px 0px 55px;
    flex-direction: row;
    justify-content: space-between;
}
.helperblock .btn{
    margin: 5px 0px;
    padding: 2px 10px;
}
.btn {
    margin: 5px 10px;
    padding: 6px 35px;
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
</style>