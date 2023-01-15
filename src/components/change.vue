<script setup>
import item_wax from "../components/item_wax.vue";
import item_chest from "../components/item_chest.vue";
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
    item_wax,
    item_chest,
  },

};
</script>
<template>
    <div class="block_game">
        <div class="element_control">
            <div class="reload">
                <img src="../assets/pageGame/reload.png" alt="reload"/>
            </div>
        </div>
        <div class="content">
            <div class="container_change">
                <div class="balance">
                    Balance: 99999999
                </div>
                <div class="container_tokenChange">
                    <div class="token_block">
                        <img src="../assets/shop/wax.png" alt="token"/>
                        WAX
                    </div>
                    <input type="text">
                </div>
            </div>
            <div class="info_change">
                1 EET = 0.000008 GET
            </div>
            <div class="container_change">
                <div class="balance">
                    Balance: 99999999
                </div>
                <div class="container_tokenChange">
                    <div class="token_block">
                        <img src="../assets/shop/wax.png" alt="token"/>
                        WAX
                    </div>
                    <input type="text">
                </div>
            </div>
            <div class="description">
                text
            </div>
            <div class="btn">
                Confirm
            </div>
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
.reload{
    cursor: pointer;
    border: 1px solid #D89718;
    position: absolute;
    right: 10px;
    top: 5px;
    margin: 5px 0px;
    z-index: 2;
    transition: all 0.25s ease;
}
.reload:hover{
    background: #D8971840;
}
.element_control{
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
}
.content{
    width: calc(100% - 10px);
    padding: 10px;
    height: fit-content;
    height: 100%;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-direction: column;
}


.info_change{
    margin: 30px 0px;
    font-size: 28px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;   
}
.container_change{
    font-size: 34px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.balance{
    width: 100%;
    font-size: 18px;
    flex-direction: row;
    justify-content: flex-start;
}
.container_tokenChange{
    flex-direction: row;
}
.token_block{
    flex-direction: row;
    margin: 0px 25px 0px 0px;
}
.token_block img{
    width: 35px;
    margin: 0px 5px 0px 0px;
}
input{
    outline:none;
    width: 280px;
    padding: 10px;
    border: 1px solid #F5A516;
    background: #F5A51660;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.description{
    margin: 40px 0px 10px 0px;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;    
}
.btn{
    margin: 5px 0px;
    padding: 8px 35px;
    border: 1px solid var(--vt-c-white);
    font-size: 18px;
    color: var(--vt-c-white);
    text-transform: uppercase;
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    cursor: pointer;
    user-select: none;
    transition: all 0.25s ease;
}
.btn:hover{
    background: rgba(255, 255, 255, 0.2);
}
</style>