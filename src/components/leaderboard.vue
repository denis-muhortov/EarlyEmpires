<script>
import player_leaderboard from "../components/player_leaderboard.vue";
import { useGameStore } from '../stores/game.js';
export default {
  name: "rate_leaderboard",
  data() {
    let game = useGameStore();
    return {
      game: game,
      userLogged: false,
    };
  },
  components: {
    player_leaderboard,
  },
  methods: {
    refresh() {
      this.$toast.show(`await`, {
        asyncFunction: async () => { await this.game.loadstats(); },
        onSuccessMessage: (res) => { return `Game data updated` },
      });
    },
  }

};
</script>
<template>
  <div class="block_game">
    <div class="element_control">
      <div class="name_block">
        leaderboard
      </div>
      <div class="reload" @click="refresh()">
        <img src="../assets/pageGame/reload.png" alt="reload" />
      </div>
    </div>
    <div class="content">
      <player_leaderboard />
    </div>
  </div>
</template>
<style scoped>
.block_game {
  width: 95%;
  height: 800px;
  flex-direction: column;
  justify-content: flex-start;
  border: 1px solid #D89718;
  background: rgba(23, 27, 40, 0.5);
  overflow-y: auto;
}

.reload {
  cursor: pointer;
  border: 1px solid #D89718;
  position: absolute;
  right: 10px;
  top: 5px;
  margin: 5px 0px;
  z-index: 2;
  transition: all 0.25s ease;
}

.reload:hover {
  background: #D8971840;
}

.element_control {
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
}

.content {
  width: calc(100% - 10px);
  padding: 10px;
  height: calc(100% - 102px);
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  flex-direction: column;
}

.name_block {
  margin: 30px 0px 30px 0px;
  width: 100%;
  font-size: 42px;
  color: var(--vt-c-white);
  font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
  @media (max-width: 400px) {
    .block_game{
        min-height: 800px;
        height: fit-content;
    }
    .element_control{
      flex-direction: column-reverse;
    }
    .name_block{
      margin: 0px;
    }
    .reload img{
        position: relative;
        left: unset;
        right: unset;
        bottom: unset;
        top: unset;
        width: 30px;
    }
    .reload{
        position: relative;
        width: calc(100% - 20px);
        margin: 5px 10px;
        left: unset;
        right: unset;
        bottom: unset;
        top: unset;
    }
}
</style>