<script setup>
import window_login from "./components/window_login.vue";
import window_game from "./components/window_game.vue";
import popup_menu from "./components/popup_menu.vue";

</script>

<script>
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
    popup_menu,
  },

};
</script>
<template>
  <window_game/>
</template>

<style scoped></style>
