<script setup>
import window_login from "./components/window_login.vue";
import window_game from "./components/window_game.vue";
import popup_menu from "./components/popup_menu.vue";
import popup_upgrade from "./components/popup_upgrade.vue";
import popup_filter from "./components/filter.vue";

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
    popup_filter,
    popup_upgrade,
  },

};
</script>
<template>
  <window_login/>
</template>

<style scoped></style>
