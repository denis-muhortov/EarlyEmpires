<script>
import { useGameStore } from '../stores/game.js';
import noUiSlider from 'nouislider';
import '../css/nouislider.css';
export default {
  name: "popup_game_filter",
  emits: ['close', 'setRarityFilter', 'setGenFilter', 'setLevelFilter'],
  data() {
    let game = useGameStore();
    return {
        game: game,
        rarityFilter: -1,
        genFilter: -1,
        levelFilter: {min: 0, max: 100},

    };
  },
  mounted(){
    this.rarityFilter = this.rarityList[0].value;

    let slider = this.$refs.slider;
    
    noUiSlider.create(slider, {
    start: [0, 100],
    connect: true,
    range: {
        min: 0,
        max: 100
    },
    step: 1,
    tooltips: {
        to: v => +v,
        from: v => +v
    },
    });

    slider.noUiSlider.on('change', (values) => {
        this.levelFilter = {min: values[0], max: values[1]};
     });


  },
  components: {
  },
  methods:{
    vieposition(){
        this.$emit('close');
    },
    selectFilter(){
        this.$emit('setRarityFilter', this.rarityFilter);
        this.$emit('setGenFilter', this.genFilter);
        this.$emit('setLevelFilter', this.levelFilter);
        this.$emit('close');
    }
  },
  computed:{
    rarityList(){
        return [{name: "All", value: -1 }, ...this.game.rarityNamedList];
    },
    gensList(){
        let list = [];
        for(let config of this.game.toolsList){
            if(!list.find(e => e.value == config.gen)){
                list.push({name: config.gen, value: config.gen });
            }
        }
        return [{name: "All", value: -1 }, ...list];
    },
  }
};
</script>
<template>
    <div class="container_filter">
        <div class="block_filter">
            <div class="block_position">
                <p>Rarity</p>
                <select v-model="rarityFilter">
                    <option
                    v-for="rar in rarityList"
                    :key="rar.value"
                    :value="rar.value"
                    >{{rar.name}}</option>
                </select>
            </div>
            <div class="block_position">
                <p>Gen</p>
                <select v-model="genFilter">
                    <option
                    v-for="item in gensList"
                    :key="item.value"
                    :value="item.value"
                    >{{item.name}}</option>
                </select>
            </div>
            <div class="block_position">
                <p>Lvl</p>
                <div ref="slider" class="slider"></div>
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
.slider{
    margin: 20px 0px 0px 0px;
    width: 280px;
}
.noUi-target{
    border: 1px solid #F5A516;
    background: #F5A51660;
    box-shadow: none;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
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
    height: 350px;
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



@media (max-width: 600px) {
    .block_filter{
    width: 400px;
    }   
}
</style>