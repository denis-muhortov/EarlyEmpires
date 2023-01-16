<script setup>
import popup_upgrade from "./popup_upgrade.vue";
</script>

<script>
export default {
  name: "tool",
  data() {
    return {
        view: false,
    };
  },
  components: {
    popup_upgrade,
  },
  methods:{
    vieposition(){
        this.view = true;
    }
  },
};
</script>
<template>
    <div class="item">
        <div class="timer">
            <img src="../assets/pageGame/time.png" alt="timer"/>
        </div>
        <teleport to="body">
            <transition name="fade" mode="out-in">
                <popup_upgrade v-if="view" @close="view = false"/>
            </transition>
        </teleport>
        <div class="nft" @click="vieposition">
            <img src="/nft/nft.png" alt="filter"/>
        </div>
        <div class="info_container">
            <div class="helpblock">
                <div class="info name">
                    CARD NAME
                </div>
                <div class="info lvl">
                    LVL: 100
                </div>
                <div class="info gen">
                    GEN: 1
                </div>
                <div class="info power">
                    POWER: 99999999
                </div>
                <div class="info time">
                    time: 00:00:00
                </div>
                <div class="info unclaimed">
                    UNCLAIMED: 99999999
                </div>
            </div>
            <div>
                <div class="btn">
                    Unstake
                </div>
            </div>
        </div>
    </div>
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

.timer.active{
    opacity: 1;
}
.timer{
    position: absolute;
    top: 5px;
    right: 5px;
    opacity: 0;
    transition: all 0.25s ease;
}
.timer img{
    width: 30px;
}
.item{
    margin: 10px;
    width: 370px;
    height: 240px;
    border: 1px solid var(--vt-c-white);
    background: rgba(0, 0, 0, 0.5);
    flex-direction: row;
    justify-content: space-around;
}
.info_container{
    height: 100%;
    text-transform: uppercase;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    justify-content: space-around;
}
.info_container .helpblock{
    justify-content: flex-start;
    align-items: flex-start;
}
.btn{
    padding: 2px 25px;
    border: 1px solid var(--vt-c-white);
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    cursor: pointer;
    user-select: none;
    transition: all 0.25s ease;
}
.btn:hover{
    background: rgba(255, 255, 255, 0.2);
}
.nft{
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.0);
    transition: all 0.25s;
}
.nft::after{
    content: "UPGRADE";
    position: absolute;
    top: 0%;
    transform: translate(0%, 250%);
    border: 1px solid #F5A516;
    padding: 5px 10px;
    font-size: 18px;
    color: #F5A516;
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    opacity: 0;
    transition: all 0.25s;
}
.nft:hover::after{
    transition: all 0.5s;
    opacity: 1;
    transform: translate(0%, 200%);
}
.nft:hover{
    transition: all 0.5s;
    border: 1px solid rgba(245, 165, 22, 1.0);
}
.nft:hover img{
    filter: brightness(25%);
}
</style>