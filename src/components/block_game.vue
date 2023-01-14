<script setup>
import game from "../components/game.vue";
</script>

<script>
export default {
  name: "window_block",
  data() {
    return {
      userLogged: false,
    };
  },
  components: {
    game,
  },

};
</script>
<template>
    <div class="GameContainer">
        <div class="Menu">
            m<br>
            e<br>
            n<br>
            u<br>
            <img src="../assets/pageGame/calculate.png" alt="calculate"/>
        </div>
        <div class="Block">
            <game/>
        </div>
        <div class="Flat_Menu">
            <div class="element_menu game">
                <img src="../assets/pageGame/game.png" alt="game"/>
            </div>
            <div class="element_menu inventory">
                <img src="../assets/pageGame/inventory.png" alt="inventory"/>
            </div>
            <div class="element_menu shop">
                <img src="../assets/pageGame/shop.png" alt="shop"/>
            </div>
            <div class="element_menu change">
                <img src="../assets/pageGame/change.png" alt="change"/>
            </div>
            <div class="element_menu calculate">
                <img src="../assets/pageGame/calculate.png" alt="calculate"/>
            </div>
            <div class="element_menu leaderboard">
                <img src="../assets/pageGame/leaderboard.png" alt="leaderboard"/>
            </div>
        </div>
    </div>
</template>
<style scoped>
.GameContainer{
    width: 100%;
    height: fit-content;
    min-width: 100vw;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.Menu{
    cursor: pointer;
    text-align: center;
    align-items: center;
    justify-content: center;
    margin: 0px 20px 0px 20px;
    padding: 100px 5px;
    border: 1px solid var(--vt-c-white);
    text-transform: uppercase;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.Menu img{
    margin: 15px 0px 0px 0px;
}
.Flat_Menu{
    margin: 0px 20px 0px 20px; 
}
.element_menu{
    width: 70px;
    height: 70px;
    margin: 25px 0px;
    background: #D89718;
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
}
.Block{
    width: 90%;
}
</style>