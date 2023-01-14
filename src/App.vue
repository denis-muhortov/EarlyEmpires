<script setup>
import window_login from "./components/window_login.vue";

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
  },

};
</script>
<template>
  <window_login/>
</template>

<style scoped></style>
