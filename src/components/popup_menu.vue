
<script>
import { useGameStore } from '../stores/game.js';
export default {
    name: "popup_menu",
    emits: ['selectTab', 'logout'],
    props: {
        selectedTab: {
            type: String,
            default: 'game'
        }
    },
    data() {
        let game = useGameStore();
        return {
            game: game,
            statuspopup: false,
        };
    },
    components: {
    },
    methods: {
        togglepopup() {
            this.statuspopup = !this.statuspopup;
        },
        changepage(page) {
            this.togglepopup();
            this.$emit('selectTab', page);
        },
        
    },
    computed: {
        username() {
            return this.game.player.wallet ?? 'not logged in';
        }
    }
};
</script>
<template>
    <div class="background_phone" :class="{ active: statuspopup }" @click="togglepopup"></div>
    <div class="Container_menu" :class="{ active: statuspopup }">
        <div class="block_menu">
            <div class="account_block">
                <div class="account_name">
                    <img src="../assets/pageGame/player.png" alt="player" />
                    {{ username }}
                </div>
                <div class="account_exit" @click="$emit('logout')">
                    exit
                </div>
            </div>
            <div class="part_manu">
                <div class="elemetn" @click="changepage('game')" :class="{ active: selectedTab == 'game' }">game</div>
                <div class="elemetn" @click="changepage('inventory')" :class="{ active: selectedTab == 'inventory' }">inventory</div>
                <div class="elemetn" @click="changepage('shop')" :class="{ active: selectedTab == 'shop' }">shop</div>
                <div class="elemetn" @click="changepage('staking_game')" :class="{ active: selectedTab == 'staking_game' }">staking</div>
                <div class="elemetn" @click="changepage('change')" :class="{ active: selectedTab == 'change' }">exchange</div>
                <div class="elemetn" @click="changepage('calculate')" :class="{ active: selectedTab == 'calculate' }">calculator</div>
                <div class="elemetn" @click="changepage('leaderboard')" :class="{ active: selectedTab == 'leaderboard' }">leaderboard</div>
            </div>
            <div class="link_game">
                <a href="https://alcor.exchange/trade/emt-earlytokenss_wax-eosio.token" target="_blank" class="aclor link_hover_block">aclor</a>
                <a href="https://wp.earlyempire-nft.com/early-empires/our-mission" target="_blank" class="whitepapper link_hover_block">whitepapper</a>
                <a href="https://discord.gg/6TJ2rV5Q" target="_blank" class="discord link_hover_block">discord</a>
                <a href="https://wax.atomichub.io/explorer/collection/wax-mainnet/earlyempires" target="_blank" class="collection link_hover_block">collection</a>

            </div>
            <div class="link_chanel">
                <a href="https://twitter.com/Earlyempires" target="_blank" class="twitter link_hover_block">twitter</a>
                <a href="https://wp.earlyempire-nft.com/early-empires/roadmap" target="_blank" class="roadmap link_hover_block">roadmap</a>
            </div>
            <div class="close" @click="togglepopup">
                <img src="../assets/pageGame/close.png" alt="close" />
            </div>
        </div>
    </div>
</template>
<style scoped>
.aclor::after{content: "Trade of game token ";}
.whitepapper::after{content: "whitepaper of the game";}
.discord::after{content: "join discord";}
.collection::after{content: "game collection AH";}
.twitter::after{content: "join twitter";}
.roadmap::after{content: "roadmap of the project";}

.link_hover_block::after{
    position: absolute;
    color: #FFFFFF;
    font-size: 14px;
    opacity: 0;
    pointer-events: none;
    transform: translate(0%, 30%);
    z-index: -10;
    transition: all 0.25s ease-in-out;
}

.link_hover_block:hover::after{
    opacity: 1;
    transform: translate(0%, 100%);
    z-index: 10;
    pointer-events: auto;
}


.close {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    z-index: 4;
    transition: all 0.5s;
}

.close:hover {
    transform: rotate(90deg);
    transition: all 0.35s;
}

.background_phone.active {
    background: rgba(0, 0, 0, 0.8);
    pointer-events: auto;
}

.background_phone {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.0);
    z-index: 19;
    transition: all 0.5s ease-in-out;
    pointer-events: none;
}

.Container_menu.active {
    left: 0;
    opacity: 1;
    pointer-events: auto;
    transition: all 0.5s ease;
}

.Container_menu {
    position: fixed;
    left: -450px;
    width: 400px;
    height: 100vh;
    background: #1A1A20;
    z-index: 20;
    opacity: 0;
    pointer-events: none;
    transition: all 0.5s ease;
}

.block_menu {
    width: 90%;
    height: 95%;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 28px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.account_block {
    width: 100%;
    height: 15vh;
    justify-content: flex-start;
    align-items: center;
}

.account_name {
    width: 100%;
    justify-content: flex-start;
    flex-direction: row;
}

.account_name img {
    margin: 0px 10px 0px 0px;
}

.account_exit {
    color: red;
    transition: all 0.2s;
}

.account_exit:hover {
    cursor: pointer;
    color: rgb(58, 7, 7);
}

.part_manu {
    font-size: 38px;
    width: 100%;
    height: calc(60vh - 10px);
    justify-content: center;
    align-items: flex-start;
}

.part_manu div {
    margin: 5px 0%;
    transition: all 0.2s;
}

.part_manu div:hover {
    color: #F5A516;
    cursor: pointer;
}

.elemetn.active {
    color: #F5A516;
}
.elemetn{flex-direction: row;}
.elemetn::after {
    content: '\2192';
    margin: 0px 0px 0px -15px;
    color: #F5A516;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
}
.elemetn:hover::after {
    content: '\2192';
    margin: 0px 0px 0px 5px;
    color: #F5A516;
    pointer-events: auto;
    opacity: 1;
}

.link_game {
    width: 100%;
    height: 15vh;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

.link_game a {
    width: 50%;
    color: #FFFFFF;
    color: #75A2FB;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.25s;
}

.link_chanel {
    width: 100%;
    height: 10vh;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
}

.link_chanel a {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.25s;
    color: #75A2FB;
}

.link_game a:hover,
.link_chanel a:hover {
    background: none;
    color: #F5A516;
    cursor: pointer;
}
@media (max-height: 750px) {
    .part_manu{
        font-size: 30px;
    }
    .part_manu div{
        margin: 0px;
    }
}
@media (max-height: 600px) {
    .part_manu{
        font-size: 22px;
    }
    .link_game, .link_chanel{
        font-size: 18px;
    }
    .account_block{
        font-size: 18px;
    }
}
@media (max-height: 525px) {
    .Container_menu{
        overflow: auto;
    }
    .account_block{
        height: 100px;
    }
    .part_manu{
        height: 400px;
    }
    .link_game{
        height: 200px;
    }
    .link_chanel{
        height: 100px;
    }
}

@media (max-width: 400px) {
    .Container_menu{
        width: 100vw;
    }
    .part_manu{
        justify-content: center;
        align-items: center;
        font-size: 30px;
    }
    .link_game, .link_chanel{
        justify-content: space-between;
        align-items: space-between;
        font-size: 20px;
    }
    .link_hover_block:hover::after{
        opacity: 0;
        pointer-events: none;
    }
}
</style>
