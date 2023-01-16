<script>
export default {
  name: "popup_deposit",
  emits: ['close'],
  data() {
    return {
    };
  },
  components: {
  },
  methods:{
    vieposition(){
        this.$emit('close');
    }
  },
};
</script>
<template>
    <div class="container_filter" >
        <div class="block_filter">
            <div class="block_position">
                <div class="status_balance">
                    Balance: 9999
                </div>
                <img src="../assets/pageGame/token.png" alt="token"/>
                <input type="text">
            </div>
            <div class="btn">
                deposit
            </div>
            <div class="close" @click="vieposition">
                <img src="../assets/pageGame/close.png" alt="close"/>
            </div>
        </div>
    </div>
</template>
<style scoped>
.container_filter{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 20;
    font-size: 24px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.block_filter{
    width: 550px;
    height: 250px;
    border: 1px solid #F5A516;
    background: #171B2890;
}
.status_balance{
    position: absolute;
    top: -30px;
    left: 55px;
}
.block_position{
    margin: 20px 0px;
    flex-direction: row;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;   
}
.block_position img{
    width: 35px;
    margin: 0px 20px 0px 0px;
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


@media (max-width: 600px) {
    .block_filter{
    width: 400px;
    }   
}
</style>
