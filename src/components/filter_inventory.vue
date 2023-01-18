<script>
export default {
  name: "popup_inventory_filter",
  emits: ['close', 'setRarityFilter', 'setTypeFilter'],
  data() {
    let rarityList = [
        {view:"All", value:-1},
        {view:"1", value:1},
        {view:"2", value:2},
        {view:"3", value:3},
        {view:"4", value:4},
        {view:"5", value:5},
    ]
    let typeList = [
        {view:"All", value:''},
        {view:"Tools", value:'tool'},
        {view:"Chest", value:'chest'},
    ]

    return {
        rarityList: rarityList,
        typeList: typeList,
        rarityFilter: rarityList[0].value,
        typeFilter: typeList[0].value
    };
  },
  components: {
  },
  methods:{
    vieposition(){
        this.$emit('close');
    },
    selectFilter(){
        this.$emit('setRarityFilter', this.rarityFilter);
        this.$emit('setTypeFilter', this.typeFilter);
        this.$emit('close');
    }
  },
};
</script>
<template>
    <div class="container_filter" >
        <div class="block_filter">
            <div class="block_position">
                <p>Rarity</p>
                <select v-model="rarityFilter">
                    <option
                    v-for="rar in rarityList"
                    :key="rar.value"
                    :value="rar.value"
                    >{{rar.view}}</option>
                </select>
            </div>
            <div class="block_position">
                <p>Type</p>
                <select v-model="typeFilter">
                    <option
                    v-for="item in typeList"
                    :key="item.value"
                    :value="item.value"
                    >{{item.view}}</option>
                </select>
            </div>
            <div class="btn" @click="selectFilter">
                Filter
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
    height: 300px;
    border: 1px solid #F5A516;
    background: #171B28;
}
.block_position{
    margin: 20px 0px;
    flex-direction: row;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;   
}
.block_position p{
    width: 100px;
}
select {
    outline:none;
    width: 280px;
    padding: 10px;
    font-size: 18px;
    border: 1px solid #F5A516;
    background: #F5A51660;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;   
}
select:focus {
    outline:none;
}
option{
    cursor: pointer;
    font-size: 18px;
    background: rgba(255, 255, 255, 0.0);
    color: black;
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
