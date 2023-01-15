<script>

</script>
<template>
    <div class="item">
        <div class="name">
            Chest name
        </div>
        <div class="nft">
            <img src="/nft/chest.png" alt="nft"/>
        </div>
        <div class="amount_container">
            <div class="cost">
                <img src="../assets/shop/wax.png" alt="wax"/>
                100
            </div>
            <div class="amount">
                100/1000
            </div>
        </div>
        <div class="rarity">
            common: 79%
        </div>
        <div class="rarity">
            rare: 15%
        </div>
        <div class="rarity">
            epic: 5%
        </div>
        <div class="rarity">
            legendary: 1%
        </div>
        <div class="btn">
            Buy
        </div>
    </div>
</template>
<style scoped>
.item{
    margin: 10px 10px 50px 10px;
    width: 350px;
    height: 420px;
    border: 1px solid var(--vt-c-white);
    background: rgba(0, 0, 0, 0.5);
    justify-content: space-around;
}
.name{
    width: 100%;
    height: 15%;
    text-transform: uppercase;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    justify-content: space-around;   
}
.nft{
    height: 50%;
}
.nft img{
    width: 100%;
    height: 100%;
}
.amount_container{
    width: 100%;
    height: 15%;
    flex-direction: row;
    text-transform: uppercase;
    font-size: 18px;
    color: #F5A516;
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    justify-content: space-around;       
}
.cost{
    flex-direction: row;
}
.cost img{
    width: 25px;
    margin: 0px 10px 0px 0px;
}
.rarity{
    width: 70%;
    justify-content: flex-start;
    align-items: flex-start;
    text-transform: uppercase;
    font-size: 18px;
    color: #F5A516;
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    justify-content: space-around;   
}
.btn{
    position: absolute;
    bottom: 0%;
    transform: translate(0%, 150%);
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
</style>