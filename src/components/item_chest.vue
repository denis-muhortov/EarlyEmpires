<script>

</script>
<template>
    <div class="item">
        <div class="nft">
            <img src="/nft/chest.png" alt="nft"/>
        </div>
        <div class="info_container">
            <div class="helpblock">
                <div class="info name">
                    CARD NAME
                </div>
                <div class="info rariry">
                    common: 79%
                </div>
                <div class="info rariry">
                    rare: 15%
                </div>
                <div class="info rariry">
                    epic: 5%
                </div>
                <div class="info rariry">
                    legendary: 1%
                </div>
            </div>
            <div>
                <div class="btn">
                    open
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.item{
    margin: 10px;
    width: 370px;
    height: 220px;
    border: 1px solid var(--vt-c-white);
    background: rgba(0, 0, 0, 0.5);
    flex-direction: row;
    justify-content: space-around;
}
.nft img{
    width: 180px;
}
.info_container{
    height: 100%;
    text-transform: uppercase;
    font-size: 18px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    justify-content: space-around;
}
.info_container .helpblock{
    justify-content: flex-start;
    align-items: flex-start;
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
</style>