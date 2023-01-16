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
            <div class="position_container">
                <div class="block_position">
                    <p>Rariry</p>
                    <select>
                        <option>common</option>
                        <option>rare</option> 
                        <option>epic</option> 
                        <option>legendary</option> 
                    </select>
                </div>
                <div class="block_position">
                    <p>Generation</p>
                    <select>
                        <option>F</option>
                        <option>E</option> 
                        <option>D</option> 
                        <option>C</option> 
                        <option>B</option> 
                        <option>A</option>
                        <option>S</option>
                    </select>
                </div>
                <div class="block_position">
                    <p>Lvl</p>
                    <input type="text">
                </div>
                <div class="block_position">
                    <p>Target lvl</p>
                    <input type="text">
                </div>
            </div>
            <div class="description_container">
                <div class="block_description">
                    new power: text
                </div>
                <div class="block_description">
                    upgrade cost: text
                </div>
                <div class="block_description">
                    upgrade time: text
                </div>
                <div class="block_description">
                    speedup cost: text
                </div>
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


.position_container, .description_container{
    width: 100%;
    height: 50%;
    justify-content: center;
    align-items: flex-start;
}
.block_position{
    margin: 10px 0px;
    flex-direction: row;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;   
}
.block_position p{
    width: 150px;
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
.block_description{
    margin: 10px 0px;
    font-size: 24px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;      
}
</style>