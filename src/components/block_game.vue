<script setup>
import game from "../components/game.vue";
import inventory from "../components/inventory.vue";
import shop from "../components/shop.vue";
import change from "../components/change.vue";
import calculate from "../components/calculate.vue";
import leaderboard from "../components/leaderboard.vue";
// import staking from "../components/staking.vue";
import staking_game from "../components/staking_game.vue";
import popup_menu from "../components/popup_menu.vue";
</script>

<script>
export default {
    name: "window_block",
    emits: ['logout'],
    data() {
        return {
            userLogged: false,
            currentTab: 'game'
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
        staking_game,
        // staking,
    },
    methods: {
        openmenu() {
            this.$refs.windowmenu.togglepopup();
        },
        openpage(page) {
            this.currentTab = page;
        }
    },
};
</script>
<template>
    <popup_menu ref="windowmenu" @selectTab="openpage" :selectedTab="currentTab" @logout="$emit('logout')" />
    <div class="GameContainer">
        <div class="Menu" @click="openmenu">
            m<br>
            e<br>
            n<br>
            u<br>
            <img src="../assets/pageGame/menu.png" alt="menu" />
        </div>
        <div class="Block">
            <transition name="fade" mode="out-in" appear>
                <component :is="currentTab"></component>
            </transition>
        </div>
        <div class="Flat_Menu">
            <div class="element_menu game" @click="openpage('game')" :class="{ active: currentTab == 'game' }">
                <img src="../assets/pageGame/game.png" alt="game" />
            </div>
            <div class="element_menu inventory" @click="openpage('inventory')" :class="{ active: currentTab == 'inventory' }">
                <img src="../assets/pageGame/inventory.png" alt="inventory" />
            </div>
            <div class="element_menu shop" @click="openpage('shop')" :class="{ active: currentTab == 'shop' }">
                <img src="../assets/pageGame/shop.png" alt="shop" />
            </div>
            <div class="element_menu staking_game" @click="openpage('staking_game')" :class="{ active: currentTab == 'staking_game' }">
                <img src="../assets/pageGame/deposit.png" alt="staking_game" />
            </div>
            <div class="element_menu change" @click="openpage('change')" :class="{ active: currentTab == 'change' }">
                <img src="../assets/pageGame/change.png" alt="change" />
            </div>
            <div class="element_menu calculate" @click="openpage('calculate')" :class="{ active: currentTab == 'calculate' }">
                <img src="../assets/pageGame/calculate.png" alt="calculate" />
            </div>
            <div class="element_menu leaderboard" @click="openpage('leaderboard')" :class="{ active: currentTab == 'leaderboard' }">
                <img src="../assets/pageGame/leaderboard.png" alt="leaderboard" />
            </div>
            <div class="Menu_mobile" @click="openmenu">
            menu
            <img src="../assets/pageGame/menu.png" alt="menu" />
        </div>
        </div>
    </div>
</template>
<style scoped>
.fade-enter-active {
    opacity: 1;
    transition: all 0.25s ease-in;
}

.fade-leave-active {
    opacity: 1;
}

.fade-enter-from {
    opacity: 0;
}

.fade-leave-to {
    opacity: 0;
}

.GameContainer {
    width: 100%;
    height: fit-content;
    min-width: 100vw;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.Menu {
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
    transition: all 0.25s ease-out;
}
.Menu:hover{
    padding: 120px 5px;
    background: rgba(0, 0, 0, 0.4);
}

.Menu img {
    margin: 15px 0px 0px 0px;
}

.Menu_mobile{
    display: none;
    cursor: pointer;
    text-align: center;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 0px 20px 0px 20px;
    padding: 5px 15px;
    border: 1px solid var(--vt-c-white);
    text-transform: uppercase;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    user-select: none;
    transition: all 0.25s ease-out;    
}
.Menu_mobile img{
    margin: 0px 0px 0px 10px;
}
.Menu_mobile:hover{
    width: 80%;
    padding: 5px 15px;
    background: rgba(0, 0, 0, 0.4);
}


.Flat_Menu {
    margin: 0px 20px 0px 20px;
}
.element_menu.active{
    background: #6080c4;
}
.element_menu {
    width: 70px;
    height: 70px;
    margin: 25px 0px;
    background: #D89718;
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 5;
    transition: all 0.5s ease;
}
.element_menu img{
    width: 45px;
}

.Block {
    width: 90%;
}

.element_menu:hover::after {
    opacity: 1;
    right: 80px;
    z-index: 2;
}

.element_menu::after {
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

.element_menu.game::after {
    content: "game";
}

.element_menu.inventory::after {
    content: "inventory";
}

.element_menu.shop::after {
    content: "shop";
}

.element_menu.change::after {
    content: "exchange";
}

.element_menu.calculate::after {
    content: "calculate";
}

.element_menu.leaderboard::after {
    content: "leaderboard";
}
.element_menu.staking_game::after {
    content: "staking";
}


@media (max-width: 730px) {
    .GameContainer {
        flex-direction: column-reverse;
    }

    .Block {
        width: 100%;
    }

    .Menu {
        display: none;
    }

    .Flat_Menu {
        width: 100%;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .Menu_mobile{
        display: flex;
        width: 90%;
        margin: 20px 0px;
    }
    .element_menu{
        display: none;
    }

    .element_menu {
        margin: 10px 50px 60px 50px;
    }

    .element_menu::after {
        top: unset;
        bottom: -50px;
        left: unset;
        right: unset;
        opacity: 1;
    }

    .element_menu:hover::after {
        top: unset;
        bottom: -50px;
        left: unset;
        right: unset;
        opacity: 1;
    }
}
@media (max-width: 400px) {
    .Flat_Menu{
        width: 100%;
        justify-content: space-around;
    }
    .element_menu{
        width: 50px;
        height: 50px;
        margin: 10px 40px 60px 40px;
    }
    .element_menu::after{
        font-size: 14px;
    }
    .element_menu img{
        width: 80%;
    }
}
</style>