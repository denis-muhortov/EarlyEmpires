<script setup>
import game from "../components/game.vue";
import inventory from "../components/inventory.vue";
import shop from "../components/shop.vue";
import change from "../components/change.vue";
import calculate from "../components/calculate.vue";
import leaderboard from "../components/leaderboard.vue";
import popup_menu from "../components/popup_menu.vue";
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
    inventory,
    shop,
    change,
    calculate,
    leaderboard,
    popup_menu,
    },
    methods: {
        openmenu(){
            this.$refs.window_menu.togglepopup();
        }
},
};
</script>
<template>
    <popup_menu ref="window_menu"/>
    <div class="GameContainer">
        <div class="Menu" @click="openmenu">
            m<br>
            e<br>
            n<br>
            u<br>
            <img src="../assets/pageGame/calculate.png" alt="calculate"/>
        </div>
        <div class="Block">
            <transition name="fade" mode="out-in">
                <component :is="currentTab" @selectTab="(tab) => { currentTab = tab }"></component>
            </transition>
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
    user-select: none;
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
    z-index: 5;
}
.Block{
    width: 90%;
}
.element_menu:hover::after{
    opacity: 1;
    right: 80px;
    z-index: 2;
}
.element_menu::after{
    position: absolute;
    padding: 5px 20px;
    top: 25%;
    right: 60px;
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
.element_menu.game::after{
    content: "game";
}
.element_menu.inventory::after{
    content: "inventory";
}
.element_menu.shop::after{
    content: "shop";
}
.element_menu.change::after{
    content: "change";
}
.element_menu.calculate::after{
    content: "calculate";
}
.element_menu.leaderboard::after{
    content: "leaderboard";
}
</style>