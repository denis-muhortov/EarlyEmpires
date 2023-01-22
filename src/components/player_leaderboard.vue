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
            let list = this.game.leaderboardRate;
            let globalSum = +(this.game.gameStat?.global_rate.split(' ')[0] ?? 0);

            let calculated = list.map((user, idx) => {
                user.rate = +user.sum_rate.split(' ')[0];
                let percent = user.rate / globalSum * 100;
                user.percent = percent;
                user.place = idx + 1;
                return user;
            })

            return calculated;
        }
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
        <div class="elemet_items influence">
            {{ leader.percent.toFixed(2) }}%
        </div>
        <div class="elemet_items potion">
            {{ leader.rate.toFixed(3) }}
        </div>
    </div>
</template>
<style scoped>
.item_leaderboard.active {
    border: 1px solid #D89718;
    color: #D89718;
}

.item_leaderboard {
    width: 50%;
    height: 35px;
    flex-direction: row;
    font-size: 24px;
    color: var(--vt-c-white);
    font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.elemet_items {
    width: 25%;
}

@media (max-width: 1440px) {
    .item_leaderboard {
        width: 100%;
    }
}

@media (max-width: 960px) {
    .item_leaderboard {
        justify-content: flex-start;
    }

    .elemet_items {
        align-items: flex-start;
        justify-content: flex-start;
    }

    .elemet_items.number {
        width: 10%;
    }

    .elemet_items.name {
        width: 35%;
    }

    .elemet_items.influence {
        width: 25%;
    }

    .elemet_items.potion {
        width: 30%;
    }
}

@media (max-width: 780px) {
    .item_leaderboard {
        justify-content: flex-start;
    }

    .elemet_items {
        align-items: flex-start;
        justify-content: flex-start;
        font-size: 16px;
    }
}
@media (max-width: 400px) {
    .elemet_items.name{
        width: 50%;
    }
    .elemet_items.influence{
        justify-content: center;
        align-items: center;
        text-align: center;
    }
}
</style>
