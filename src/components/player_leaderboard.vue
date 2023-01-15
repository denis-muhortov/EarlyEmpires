<script>
</script>
<template>
    <div class="item_leaderboard">
        <div class="elemet_items number">
            #1
        </div>
        <div class="elemet_items name">
            player
        </div>
        <div class="elemet_items influence">
            99.99%
        </div>
        <div class="elemet_items potion">
            999999
        </div>
    </div>
</template>
<style scoped>
.item_leaderboard.active{
    border: 1px solid #D89718;
    color: #D89718;
}
.item_leaderboard{
    width: 50%;
    height: 35px;
    flex-direction: row;
    font-size: 24px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.elemet_items{
    width: 25%;
}

</style>
