<script>
import { useGameStore } from '../stores/game.js';
export default {
    name: "player_leaderboard",
    data() {
        let game = useGameStore();
        return {
            game: game,
        };
    },
    components: {
    },
    methods: {
    },
    computed: {
        leadersList() {
            let list = this.game.leaderboardStake;
            let globalSum = +(this.game.gameStat?.global_rate.split(' ')[0] ?? 0);
            let awardsList = this.game.gameConfig?.stake_rewards ?? [];

            let calculated = list.map((user, idx) => {

                user.stake = +user.stakeidx.split(' ')[0];
                // let percent = user.rate / globalSum * 100;
                // user.percent = percent;
                user.place = idx + 1;



                let award = awardsList.find(a => a.place == user.place);


                let awardItem = this.game.collectionTemplates.find(t => +t.template_id == +award.items[0]);

                user.awardTitle = awardItem?.immutable_data.name;

                return user;
            })

            return calculated;
        },
    }
};
</script>
<template>
    <div class="item_leaderboard" v-for="leader in leadersList" :key="leader.wallet"
        :class="{ active: leader.wallet == game.player.wallet }">
        <div class="elemet_items number">
            #{{ leader.place }}
        </div>
        <div class="elemet_items name">
            {{ leader.wallet }}
        </div>
        <!-- <div class="elemet_items influence">
            {{ leader.percent.toFixed(2) }}%
        </div> -->
        <div class="elemet_items potion">
            {{ leader.stake.toFixed(3) }}
        </div>
        <div class="elemet_items chest">
            {{ leader.awardTitle }}
        </div>
    </div>
</template>
<style scoped>
.item_leaderboard.active {
    border: 1px solid #D89718;
    color: #D89718;
}

.item_leaderboard {
    width: 95%;
    height: 35px;
    flex-direction: row;
    font-size: 24px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.elemet_items {
    width: 20%;
}

@media (max-width: 1440px) {
    .item_leaderboard {
        width: 100%;
        font-size: 22px;
    }
    .elemet_items.number{
        width: 5%;
    }
    .elemet_items.name{
        width: 25%;
    }
    .elemet_items.potion{
        width: 25%;
    }
    .elemet_items.chest{
        width: 40%;
    }
}

@media (max-width: 1060px) {
    .item_leaderboard {
        justify-content: center;
    }

    .elemet_items {
        align-items: center;
        justify-content: center;
    }

    .elemet_items.number{
        width: 5%;
    }
    .elemet_items.name{
        width: 25%;
    }
    .elemet_items.potion{
        width: 25%;
    }
    .elemet_items.chest{
        width: 40%;
    }
}

@media (max-width: 740px) {
    .elemet_items {
        font-size: 12px;
    }
}
@media (max-width: 640px) {
    .block_game{
        width: 100%;
    }
    .content{
        width: 100%;
        padding: 10px 0px;
    }
    .elemet_items.number{
        width: 5%;
    }
    .elemet_items.name{
        width: 25%;
    }
    .elemet_items.potion{
        width: 25%;
    }
    .elemet_items.chest{
        width: 40%;
    }
}
@media (max-width: 400px) {
    .item_leaderboard{
        width: 100%;
    }
    .elemet_items.name{
        width: 30%;
    }
    .elemet_items.chest {
        width: 35%;
    }
}
@media (max-width: 350px) {
    .elemet_items.number{
        width: 5%;
    }
    .elemet_items.name{
        width: 25%;
    }
    .elemet_items.potion{
        width: 20%;
    }
    .elemet_items.chest{
        width: 45%;
    }    
}
</style>
