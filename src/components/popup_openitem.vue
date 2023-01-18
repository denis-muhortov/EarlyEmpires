<script>
import { useGameStore } from '../stores/game.js';

export default {
  name: "popup_openitem",
  emits: ['close'],
  props:{
    resultItems:{
        required: true,
        type: Array,
    }
  },
  data() {
    let game = useGameStore();
    return {
        game: game,
    };
  },
  components: {
  },
  methods:{
  },
};
</script>
<template>
    <div class="container_filter" >
        <div class="block_filter">
            <div class="drop_item" 
            v-for="item in resultItems"
            :key="item.asset_id">
                <img :src="`/nft/${item.template.template_id}.png`" alt="nft"/>
            </div>
        </div>
    </div>
</template>
<style scoped>
.fade-enter-active {
  transform: translate(0%, 0%);
  opacity: 1;
  transition: all 0.25s 1s ease;
}

.fade-leave-active {
  transform: translate(0%, 0%);
  opacity: 0;
}

.fade-enter-from {
  transform: translate(0%, 0%);
  opacity: 0;
}

.fade-leave-to {
  transform: translate(0%, 0%);
}
.container_filter{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px solid #F5A516;
    background: rgba(0, 0, 0, 0.8);
    z-index: 20;
    font-size: 24px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.block_filter{
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    overflow-y: auto;
}
.drop_item{
    width: 350px;
    height: fit-content;
}
.drop_item img{
    width: 100%;
    z-index: 5;
}
.btn{
    margin: 20px 0px 0px 0px;
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
.close{
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    transition: all 0.5s;
}
.close:hover{
    transform: rotate(90deg);
    transition: all 0.35s;
}
</style>
