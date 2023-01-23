<script>
import block_game from "../components/block_game.vue";
import { useGameStore } from '../stores/game.js';
import popup_openitem from "../components/popup_openitem.vue";
import stake_leaderboard from "../components/staking.vue";
export default {
    name: "window_game",
    emits: ['logout'],
    data() {
        let game = useGameStore();
        return {
            game: game,
            view: false,
            status_chest: false,
            timerId: 0,
            currentSec: game.getCurrentSeconds(),
            timerId2: 0,
            startISO: '2023-01-20T15:28:00'
        };
    },
    mounted() {
        this.timerId = setInterval(() => { this.game.updateGlobalStat() }, 10000);
        this.timerId2 = setInterval(() => { this.currentSec = this.game.getCurrentSeconds() }, 1000);
    },
    beforeUnmount() {
        clearInterval(this.timerId);
        clearInterval(this.timerId2);
    },
    components: {
        popup_openitem,
        block_game,
        stake_leaderboard,
    },
    methods: {
        vieposition() {
            this.view = true;
        },
        testError(){
            throw new Error('sentry test');
        }
    },
    computed: {
        globalHashrate() {
            return +(this.game.gameStat?.global_rate.split(' ')[0] ?? 0);
        },
        userHashrate() {
            return +(this.game.player?.sum_rate.split(' ')[0] ?? 0);
        },
        isStakingWindow(){
          let end = this.game.ISOToSeconds(this.game.gameConfig.start);

          return this.currentSec < end;
        }
    }

};
</script>
<template>
    <div class="MainContainer">
        <div class="logo">
            <img src="../assets/login/logo.png" alt="logo" />
        </div>
        <div class="ContainerHashrate">
            <div class="Hashrate"  @click="testError">
                Hashrate:
            </div>
            <div class="Global">
                Global: {{ globalHashrate.toFixed(6) }}
            </div>
            <div class="Your">
                Your: {{ userHashrate.toFixed(6) }}
            </div>
        </div>
        <div class="ContainerTokens">
            <div class="Tokens">
                <a href="https://wp.earlyempire-nft.com/game-mechanics/tokens" target="_blank">Tokens:</a>
            </div>
            <div class="BlockTokens">
                <div class="Token EAT">
                    <img src="/EAT.png" alt="EAT" />
                    {{ game.balanceEAT.toFixed(2) }}
                </div>
                <div class="Token EET">
                    <img src="/EET.png" alt="EET" />
                    {{ game.balanceEET.toFixed(2) }}
                </div>
                <div class="Token MEAT">
                    <img src="/MEAT.png" alt="MEAT" />
                    {{ game.balanceMEAT.toFixed(2) }}
                </div>
            </div>
        </div>
    </div>
    <teleport to="body">
        <transition name="fade" mode="out-in">
            <popup_openitem v-if="status_chest" @close="status_chest = false" />
        </transition>
    </teleport>
    <block_game v-if="!isStakingWindow" @logout="game.logout(), $emit('logout')" />
    <stake_leaderboard v-else @logout="game.logout(), $emit('logout')"/>
</template>
<style scoped>
.fade-enter-active {
    opacity: 1;
    transition: all 0.25s 1s ease;
}

.fade-leave-active {
    opacity: 0;
}

.fade-enter-from {
    opacity: 0;
}

.fade-leave-to {
    opacity: 0;
}


.fade-leave-to .drop_item{
  transform: translate(0%, 50%);
}

img {
    width: 100%;
    display: flex;
}

.MainContainer {
    width: 100%;
    height: fit-content;
    min-width: 100vw;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
}

.logo {
    width: 500px;
    height: 100px;
}

.ContainerHashrate {
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    align-items: flex-start;
    justify-content: flex-start;
}

.ContainerTokens {
    margin: 0px 0px 0px 50px;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    align-items: flex-start;
    justify-content: flex-start;
}
.Tokens a{
    color: #FFF;
    transition: all 0.25s ease;
}
.Tokens a:hover{
    color: #75A2FB;
    background: none;
}
.Token{
    letter-spacing: 2px;
}

.Token:hover::after {
    transform: translate(0%, 125%);
    opacity: 1;
}

.Token::after {
    position: absolute;
    bottom: 0px;
    padding: 3px 25px;
    transform: translate(0%, 25%);
    border: 1px solid var(--vt-c-white);
    text-transform: uppercase;
    font-size: 18px;
    background: #1F1F1F;
    color: #D89718;
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    transition: all 0.25s ease;
    opacity: 0;
    pointer-events: none;
    z-index: 2;
}

.Token.EAT::after {
    content: "EAT";
}

.Token.EET::after {
    content: "EET";
}

.Token.MEAT::after {
    content: "MEAT";
}

.Token,
.BlockTokens {
    flex-direction: row;
}

.Token {
    padding: 5px 15px;
    margin: 5px 10px 0px 0px;
    border: 1px solid var(--vt-c-white);
}

.Token img {
    width: 40px;
    margin: 0px 5px 0px 0px;
}

.block_token_open {
    padding: 5px;
    margin: 5px 10px 0px 0px;
    border: 1px solid white;
    cursor: pointer;
    transition: all 0.25s ease;
}

.block_token_open img {
    width: 29px;
}

.block_token_open:hover {
    background: rgba(255, 255, 255, 0.4);
}
@media (max-width: 1300px) {
    .logo {
        width: 300px;
        height: 100px;
    }
}


@media (max-width: 1110px) {
    .logo {
        width: 250px;
        height: 100px;
    }

    .ContainerTokens {
        margin: 0px 0px 0px 10px;
    }
}

@media (max-width: 940px) {
    .logo {
        width: 200px;
        height: 100px;
    }
}

@media (max-width: 920px) {
    .MainContainer {
        flex-wrap: wrap;
    }

    .logo {
        width: 400px;
        height: 100px;
    }

    .ContainerHashrate {
        margin: 10px 0px 10px 10px;
    }

    .BlockTokens {
        margin: 5px 0px 20px 0px;
    }
}

@media (max-width: 640px) {
    .BlockTokens {
        flex-wrap: wrap;
    }
}
@media (max-width: 400px) {
    .Token  {
        justify-content: flex-start;
        width: 100%;
    }
    .Token:hover::after {
    transform: translate(0%, -20%);
    opacity: 1;
}
}
</style>