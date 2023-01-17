<script>
import block_game from "../components/block_game.vue";
import { useGameStore } from '../stores/game.js';
import popup_deposit from "../components/popup_deposit.vue";
export default {
  name: "window_game",
  emits: ['logout'],
  data() {
    let game = useGameStore();
    return {
        game: game,
        view: false,
        timerId: 0,
    };
  },
  mounted(){
    // TODO
    // this.timerId = setInterval(()=>{this.game.updateGlobalStat()}, 10000);
  },
  beforeUnmount(){
    clearInterval(this.timerId);
  },
  components: {
    popup_deposit,
    block_game,
  },
  methods:{
    vieposition(){
        this.view = true;
    }
  },
  computed:{
    globalHashrate(){
        return +(this.game.gameStat?.global_rate.split(' ')[0] ?? 0);
    },
    userHashrate(){
        return +(this.game.player?.sum_rate.split(' ')[0] ?? 0);
    },
  }

};
</script>
<template>
    <div class="MainContainer">
        <teleport to="body">
            <transition name="fade" mode="out-in">
                <popup_deposit v-if="view" @close="view = false" @logout="$emit('logout')"/>
            </transition>
        </teleport>
        <div class="logo">
            <img src="../assets/login/logo.png" alt="logo"/>
        </div>
        <div class="ContainerHashrate">
            <div class="Hashrate">
                Hashrate: 
            </div>
            <div class="Global">
                Global: {{globalHashrate.toFixed(6)}}
            </div>
            <div class="Your">
                Your: {{userHashrate.toFixed(6)}}
            </div>
        </div>
        <div class="ContainerTokens">
            <div class="Tokens">
                Tokens: 
            </div>
            <div class="BlockTokens">
                <div class="Token EAT">
                    <img src="../assets/pageGame/token.png" alt="token"/>
                    {{game.balanceEAT.toFixed(4)}}
                </div>
                <div class="Token EET">
                    <img src="../assets/pageGame/token.png" alt="token"/>
                    {{game.balanceEET.toFixed(4)}}
                </div>
                <div class="Token MEAT">
                    <img src="../assets/pageGame/token.png" alt="token"/>
                    {{game.balanceMEAT.toFixed(4)}}
                </div>
            </div>
        </div>
    </div>
    <block_game/>
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

img{
    width: 100%;
    display: flex;
}
.MainContainer{
    width: 100%;
    height: fit-content;
    min-width: 100vw;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
}
.logo{
    width: 500px;
    height: 100px;
}
.ContainerHashrate{
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    align-items: flex-start;
    justify-content: flex-start;
}
.ContainerTokens{
    margin: 0px 0px 0px 50px;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    align-items: flex-start;
    justify-content: flex-start;    
}
.Token:hover::after{
    transform: translate(0%, 125%);
    opacity: 1;
}
.Token::after{
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
.Token.EAT::after{
    content: "EAT";
}
.Token.EET::after{
    content: "EET";
}
.Token.MEAT::after{
    content: "MEAT";
}
.Token, .BlockTokens{
    flex-direction: row;
}
.Token{
    padding: 5px 15px;
    margin: 5px 10px 0px 0px;
    border: 1px solid var(--vt-c-white);
}
.Token img{
    width: 25px;
    margin: 0px 5px 0px 0px;
}
.block_token_open {
    padding: 5px;
    margin: 5px 10px 0px 0px;
    border: 1px solid white;
    cursor: pointer;
    transition: all 0.25s ease;
}
.block_token_open img{
    width: 29px;
}
.block_token_open:hover{
    background: rgba(255, 255, 255, 0.4);
}

@media (max-width: 1110px) {
    .logo{
        width: 250px;
        height: 100px;
    }
    .ContainerTokens{
        margin: 0px 0px 0px 10px;
    }
}
@media (max-width: 820px) {
    .MainContainer{
        flex-wrap: wrap;
    }
    .logo{
        width: 400px;
        height: 100px;
    }
    .ContainerHashrate{
        margin: 10px 0px 10px 10px;
    }
    .BlockTokens{
        margin: 5px 0px 20px 0px;
    }
}
</style>