<script>

</script>
<template>
    <div class="Container_menu">
        <div class="block_menu">
            <div class="account_block">
                <div class="account_name">
                    <img src="../assets/pageGame/player.png" alt="player"/>
                    xxxxxxxxx.wam
                </div>
                <div class="account_exit">
                    exit
                </div>
            </div>
            <div class="part_manu">
                <div class="elemetn active">game</div>
                <div class="elemetn">inventory</div>
                <div class="elemetn">shop</div>
                <div class="elemetn">exchange</div>
                <div class="elemetn">calculator</div>
                <div class="elemetn">leaderboard</div>
            </div>
            <div class="link_game">
                <a href="">whitepapper</a>
                <a href="">collection</a>
                <a href="">roadmap</a>
            </div>
            <div class="link_chanel">
                <a href="">discord</a>
                <a href="">twitter</a>
            </div>
            <div class="close">
                <img src="../assets/pageGame/close.png" alt="close"/>
            </div>
        </div>
    </div>
</template>
<style scoped>
.close{
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    transition: all 0.5s;
}
.close:hover{
    transform: rotate(90deg);
    transition: all 0.35s;
}
.Container_menu{
    position: fixed;
    left: 0;
    width: 400px;
    height: 100vh;
    background: #1A1A20;
    z-index: 10;
}
.block_menu{
    width: 90%;
    height: 95%;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 28px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.account_block{
    width: 100%;
    height: 15%;  
    justify-content: flex-start;  
    align-items: center;
}
.account_name{
    width: 100%;
    justify-content: flex-start;  
    flex-direction: row;
}
.account_name img{
    margin: 0px 10px 0px 0px;
}
.account_exit{
    color: red;
    transition: all 0.2s;
}
.account_exit:hover{
    cursor: pointer;
    color: rgb(58, 7, 7);
}
.part_manu{
    font-size: 38px;
    width: 100%;
    height: 60%;
    justify-content: center;
    align-items: flex-start;
}
.part_manu div{
    margin: 3% 0%;
    transition: all 0.2s;
}
.part_manu div:hover{
    color: #F5A516;
    cursor: pointer;    
}
.elemetn.active{
    color: #F5A516;
}
.link_game{
    width: 100%;
    height: 15%;
    justify-content: center;
    align-items: center;    
}
.link_game a{
    color: #FFFFFF;
    transition: all 0.25s;
}
.link_chanel{
    width: 100%;
    height: 10%;
    justify-content: space-around;
    align-items: center;    
    flex-direction: row;   
}
.link_chanel a{
    transition: all 0.25s;
    color: #75A2FB;
}

.link_game a:hover, .link_chanel a:hover{
    background: none;
    color: #F5A516;
    cursor: pointer;
}
</style>
