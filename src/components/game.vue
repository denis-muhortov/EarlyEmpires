<script setup>
import item from "../components/item.vue";
</script>

<script>
export default {
  name: "game",
  data() {
    return {
      userLogged: false,
    };
  },
  components: {
    item,
  },

};
</script>
<template>
    <div class="block_game">
        <div class="element_control">
            <div class="btnv2">
                Unstake all
            </div>
            <div class="btnv2">
                Claim all
            </div>
            <div class="filter">
                <img src="../assets/pageGame/filter.png" alt="filter"/>
            </div>
            <div class="reload">
                <img src="../assets/pageGame/reload.png" alt="reload"/>
            </div>
        </div>
        <div class="content">
            <item/>
        </div>
    </div>
</template>
<style scoped>
.block_game{
    width: 95%;
    height: 800px;
    flex-direction: column;
    justify-content: flex-start;
    border: 1px solid #D89718;
    background: rgba(23, 27, 40, 0.5);
    overflow-y: auto;
}
.element_control{
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
}
.btnv2{
    padding: 5px 40px;
    border: 1px solid rgba(245, 165, 22, 0.9);
    margin: 0px 24px;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    background: rgba(245, 165, 22, 0.5);
    cursor: pointer;
}
.content{
    width: calc(100% - 10px);
    padding: 10px;
    height: fit-content;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
}
</style>