
<script>
import tool from "./tool.vue";
import popup_filter from "./filter_game.vue";
import { useGameStore } from '../stores/game.js'
export default {
  name: "game",
  data() {
    const game = useGameStore();
    return {
        game: game,
        view: false,
        filterRarity: -1,
        filterGen: -1,
        filterLevel: {min: 0, max: 100},
    };
  },
  components: {
    tool,
    popup_filter,
  },
  methods:{
    vieposition(){
        this.view = true;
    },
    setRarityFilter(rar){
        this.filterRarity = rar;
    },
    setGenFilter(gen){
        this.filterGen = gen;
    },
    setLevelFilter(levels){
        this.filterLevel = levels;
    },
    unstakeAll() {
        this.$toast.show(`мы осуждаем данный поступок`, {
            asyncFunction: async () => { return await this.game.removeAllTools(); },
            onSuccessMessage: (res) => { 
                console.log(res);
                return `Да и пошел ка ты нахуй... Верни на место все что взял`;
             },
        });
    },
    claimAll() {
        var alphabet = ["Прибыль полученна", "Бабло собрано","Ресурсы собраны","Слышим звон чеканных монет","Вот монетка пиздуй"
        ,"О, а у нас тут свеженькое мясцо","Главное не количество а качество","Пасхалка: вас трахнул медведь",
        "Дань собрали теперь можно и поспать","Звон собраных монет нарушил визг свиноматки"];
        var randomIndex = Math.floor(Math.random() * alphabet.length);

        var randomLetter = alphabet[randomIndex];
        
        this.$toast.show(`ожидаем прибыли`, {
            asyncFunction: async () => { return await this.game.claimAll(); },
            onSuccessMessage: (res) => { 
                console.log(res);
                return randomLetter;
             },
        });
    },
    refresh() {
        var alphabet = ["Обустраиваем пещеру", "Ебем служанок","Занимаемся йёгой","Готовимся к зиме","Ожидаем прибыли"
        ,"Обновляем игровые данные","Играем с палкой-капалкой","Встречаем медведя","Утепляем пещеру","Вешаем шкуры"];
        var randomIndex = Math.floor(Math.random() * alphabet.length);

        var randomLetter = alphabet[randomIndex];

      this.$toast.show(randomLetter, {
        asyncFunction: async () => { await this.game.loadstats(); },
        onSuccessMessage: (res) => { return `готово и не выебывайся` },
      });
    },
  
  },
  computed:{
    toolsList() {

        let usedTools = this.game.playerUsedTools;
        let tools = this.game.playerTools;

        tools = tools.filter(t => this.game.inventoryAssets.some(a => +a.asset_id == +t.asset_id));

        let resultItems = [];

        for (let usedTool of usedTools) {
                let tool = tools.find(t => +t.asset_id == +usedTool.asset_id);
                let resultItem = {
                    //asset_id: +tool.asset_id,
                    rarity: tool.config.rarity,
                    gen: tool.config.gen,
                    tool: tool
                }
                resultItems.push(Object.assign({}, usedTool, resultItem));
        }

        return resultItems;
    },
    filterList() {
        let list = this.toolsList;

        if(this.filterRarity >= 0){
            list = list.filter((item)=> {
                return item.rarity == this.filterRarity;
            });
        }

        if(this.filterGen >= 0){
            list = list.filter((item)=> {
                return item.gen == this.filterGen;
            });
        }

        list = list.filter((item)=> {
            return item.level >= this.filterLevel.min && item.level <= this.filterLevel.max;
        });
        
        return list;
    },
    sortedList() {

        let list = this.filterList.slice();

        list.sort((a, b) => {
            return b.rarity - a.rarity;
        });
        return list;
    },
  }
};
</script>
<template>
    <div class="block_game">
        <teleport to="body">
            <transition name="fade" mode="out-in">
                <popup_filter v-if="view" @close="view = false" @setRarityFilter="setRarityFilter"  @setGenFilter="setGenFilter" @setLevelFilter="setLevelFilter"/>
            </transition>
        </teleport>
        <div class="element_control">
            <div class="btnv2" @click="unstakeAll">
                Unstake all
            </div>
            <div class="btnv2" @click="claimAll">
                Claim all
            </div>
            <div class="filter" @click="vieposition">
                <img src="../assets/pageGame/filter.png" alt="filter"/>
            </div>
            <div class="reload" @click="refresh()">
                <img src="../assets/pageGame/reload.png" alt="reload"/>
            </div>
        </div>
        <div class="content">
            <tool
            v-for="item in sortedList"
            :key="item.asset_id"
            :userTool="item"/>
            <div class="view_box" v-if="toolsList.length == 0">
                You don't have an nft at the moment
                <a href="">buy</a>
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


.block_game.active{
    pointer-events: none;
    filter: brightness(40%);
}
.block_game{
    width: 95%;
    height: 800px;
    flex-direction: column;
    justify-content: flex-start;
    border: 1px solid #D89718;
    background: rgba(23, 27, 40, 0.5);
    overflow-y: auto;
}
.filter:hover{
    border: 1px solid #D89718;
    background: #D8971820;
}
.filter{
    margin: 5px 0px 0px;
    border: 1px solid #D8971800;
    cursor: pointer;
    transition: all 0.25s ease;
}
.filter img{
    width: 89%;
}
.reload{
    cursor: pointer;
    border: 1px solid #D89718;
    position: absolute;
    right: 10px;
    top: 5px;
    margin: 5px 0px;
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
.btnv2{
    padding: 5px 40px;
    border: 1px solid rgba(245, 165, 22, 0.9);
    margin: 0px 24px;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    background: rgba(245, 165, 22, 0.5);
    cursor: pointer;
    user-select: none;
    transition: all 0.25s ease;
}
.btnv2:hover{
    background: rgba(245, 165, 22, 0.2);
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
.view_box{
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 24px;
    color: var(--vt-c-text-dark-2);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;   
}
.view_box a{
    padding: 0px 0px 0px 0px;
    color: var(--game-color-yellow-lite);
    cursor: pointer;
    transition: all 0.1s ease;
}
.view_box a:hover{
    background: none;
    color: var(--scroll-color-dark-orange);
    text-decoration: underline;
    transition: all 0.1s ease;
}
@media (max-width: 1080px) {
    .element_control{
        flex-direction: column;
        align-items: flex-start;
    }
    .filter{
        position: absolute;
        top: 5px;
        right: 60px;
        border: 1px solid#D89718;
    }
    .filter img{
    width: 77%;
    }
    .btnv2{
        margin: 10px 0px 10px 25px;
    }
}
</style>