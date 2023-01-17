

<script>
import window_login from "./components/window_login.vue";
import window_game from "./components/window_game.vue";

export default {
  name: "App",
  data() {
    return {
      userLogged: false,
    };
  },
  components: {
    window_login,
    window_game,
  },

};
</script>
<template>
  <window_login v-if="!userLogged" @login="userLogged = true"/>
  <window_game v-else @logout="userLogged = false"/>

  <!-- <window_game/> -->

</template>

<style scoped></style>
