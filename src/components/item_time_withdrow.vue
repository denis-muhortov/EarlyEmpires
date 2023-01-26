<script>
export default {
  name: "staking_game",
  emits: ['refund'],
  props:{
    amount:{
        type: Number,
        required: true,
    },
    secLeft:{
        type: Number,
        required: true,
    }
  },
  data() {
    return {
        timerId:0
    };
  },
  computed:{
    timeLeft(){
        let remainingSecs = this.secLeft;
        return  remainingSecs <= 0 ? '00:00' : `${String(Math.floor(remainingSecs / 3600)).padStart(2, "0")}:${String(Math.floor((remainingSecs % 3600) / 60)).padStart(2, "0")}:${String(Math.floor((remainingSecs % 60))).padStart(2, "0")}`;
    }
  }
};
</script>
<template>
    <div class="time_item_withdrow">
        <p>{{amount}}</p>
        <img src="/EWT.png" alt="EWT" />
        <p>&nbsp; : &nbsp; </p> 
        <img src="../assets/pageGame/time.png" alt="time" />
        <p>{{ timeLeft }}</p>
        <p class="successfull active">&nbsp; successfull</p>
        <div v-if="secLeft < 0" @click="this.$emit('refund')">Refund</div>
    </div>
</template>
<style scoped>
.time_item_withdrow.active .successfull{
    opacity: 1;
    pointer-events: auto;
}
.successfull{
    opacity: 0;
    pointer-events: none;
    transition: all 0.25s ease-in-out;
    font-weight: bold;
    color: rgb(61, 185, 61);
}
.time_item_withdrow{
    margin: 10px 0px;
    font-size: 24px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    flex-direction: row;
}
.time_item_withdrow img:nth-child(2){
    width: 40px;
}
.time_item_withdrow img:nth-child(4){
    width: 30px;
}
@media (max-width: 830px) {
    .time_item_withdrow{
        font-size: 18px;
    }
}
@media (max-width: 610px) {
    .time_item_withdrow{
        font-size: 16px;
    }
    .time_item_withdrow img:nth-child(2){
        width: 35px;
    }
    .time_item_withdrow img:nth-child(4){
        width: 25px;
    }
}
@media (max-width: 400px) {
    .time_item_withdrow{
        font-size: 12px;
    }
    .time_item_withdrow img:nth-child(2){
        width: 28px;
    }
    .time_item_withdrow img:nth-child(4){
        width: 20px;
    }
}
</style>