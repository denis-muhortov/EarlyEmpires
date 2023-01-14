<script setup>
import block_game from "../components/block_game.vue";
</script>

<script>
export default {
  name: "window_game",
  data() {
    return {
      userLogged: false,
    };
  },
  components: {
    block_game,
  },

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
                Global: 999999
            </div>
            <div class="Your">
                Your: 999999
            </div>
        </div>
        <div class="ContainerTokens">
            <div class="Tokens">
                Tokens: 
            </div>
            <div class="BlockTokens">
                <div class="Token">
                    <img src="../assets/pageGame/token.png" alt="logo"/>
                    999999
                </div>
                <div class="Token">
                    <img src="../assets/pageGame/token.png" alt="logo"/>
                    999999
                </div>
                <div class="Token">
                    <img src="../assets/pageGame/token.png" alt="logo"/>
                    999999
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