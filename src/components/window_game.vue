<script setup>
import block_game from "../components/block_game.vue";
import { useGameStore } from '../stores/game.js';
</script>

<script>
export default {
  name: "window_game",
  data() {
    let game = useGameStore();
    return {
        game: game,
    };
  },
  components: {
    block_game,
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
        <div class="logo">
            <img src="../assets/login/logo.png" alt="logo"/>
        </div>
        <div class="ContainerHashrate">
            <div class="Hashrate">
                Hashrate: 
            </div>
            <div class="Global">
                Global: {{globalHashrate.toFixed(2)}}
            </div>
            <div class="Your">
                Your: {{userHashrate.toFixed(2)}}
            </div>
        </div>
        <div class="ContainerTokens">
            <div class="Tokens">
                Tokens: 
            </div>
            <div class="BlockTokens">
                <div class="Token">
                    <img src="../assets/pageGame/token.png" alt="logo"/>
                    {{game.balanceEAT.toFixed(2)}}
                </div>
                <div class="Token">
                    <img src="../assets/pageGame/token.png" alt="logo"/>
                    {{game.balanceMEAT.toFixed(2)}}
                </div>
                <div class="Token">
                    <img src="../assets/pageGame/token.png" alt="logo"/>
                    {{game.balanceGEM.toFixed(2)}}
                </div>
            </div>
        </div>
    </div>
    <block_game/>
</template>
<style scoped>
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

@media (max-width: 1080px) {
    .logo{
        width: 250px;
        height: 100px;
    }
    .ContainerTokens{
        margin: 0px 0px 0px 10px;
    }
}
</style>