<script>
</script>
<template>
    <div class="container_filter">
        <div class="block_filter">
            <div class="nft">
                <img src="/nft/nft.png" alt="filter"/>
            </div>
            <div class="info_container">
                <div class="helpblock">
                    <div class="info name">
                        CARD NAME
                    </div>
                    <div class="info lvl">
                        LVL: 100
                        <div class="slidecontainer">
                            <input type="range" min="1" max="100" class="slider" id="myRange">
                        </div>
                    </div>
                    <div class="info gen">
                        GEN: 1
                    </div>
                    <div class="info power">
                        POWER: 99999999
                    </div>
                    <div class="info unclaimed">
                        UNCLAIMED: 99999999
                    </div>
                </div>
            <div class="helpblockv2">
                <div class="btn">
                    Upgrade
                </div>
                <div class="btn">
                    Speed up
                </div>
            </div>
        </div>
            <div class="close">
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
    background: #171B2890;
    flex-direction: row;
}
.nft{
    height: 100%;
    width: 40%;
    justify-content: center;
}
.info_container{
    width: 60%;
    height: 100%;
    text-transform: uppercase;
    font-size: 18px;
    color: #F5A516;
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    justify-content: space-around;
    align-items: flex-start;
}
.info_container .helpblock{
    justify-content: flex-start;
    align-items: flex-start;
}
.helpblockv2{
    width: 90%;
    flex-direction: row;
    justify-content: space-around;
}
.info{
    flex-direction: row;
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

.slidecontainer{
    justify-content: center;
    align-items: center;
    margin: 0px 0px 0px 10px;
}
.slider {
    -webkit-appearance: none;
    width: 200px;
    height: 8px;
    border-radius: 5px;  
    background: #ffffff;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%; 
    border: 1px solid #F5A516;
    background: #F5A516;
    cursor: pointer;
}

.slider::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 1px solid #F5A516;
    background: #F5A516;
    cursor: pointer;
}
</style>
