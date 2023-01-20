

<script>
import window_login from "./components/window_login.vue";
import window_game from "./components/window_game.vue";
export default {
  name: "App",
  data() {
    return {
      userLogged: false,
      restore: true,
    };
  },
  components: {
    window_login,
    window_game,

  },
  computed:{
    
  }

};
</script>
<template>
  <window_login v-if="!userLogged" @login="userLogged = true, restore = true" :restore="restore"/>

  <window_game v-else @logout="userLogged = false, restore = false"/>

  <!-- <staking/> -->

</template>

<style scoped></style>
