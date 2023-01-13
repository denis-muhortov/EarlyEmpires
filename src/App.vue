<script setup>
import blockLogin from "./components/blockLogin.vue";
import blockMainScreen from "./components/blockMainScreen.vue";
import blockmining from "./components/blockmining.vue";
import blockbank from "./components/blockbank.vue";
import blockstation from "./components/blockstation.vue";
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
    blockLogin,
    blockMainScreen,
    //blockmining,
    //blockbank,
    //blockstation,
  },

};
</script>
<template>
  <blockLogin v-if="!userLogged" v-on:login="userLogged = true"/>
  <blockMainScreen v-else v-on:logout="userLogged = false"/>
</template>

<style scoped></style>
