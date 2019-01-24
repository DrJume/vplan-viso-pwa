<template>
  <div id="nav">
    <router-link
      to="/schueler/"
      tag="button"
      active-class="active"
      class="btn btn-primary btn-lg"
    >Schüler</router-link>
    <router-link
      to="/lehrer/"
      tag="button"
      active-class="active"
      class="btn btn-primary btn-lg"
    >Lehrer</router-link>
  </div>
</template>

<script>
export default {
  name: 'home'
}
</script>

<style scoped lang="scss">
#nav {
  display: flex;
  flex-direction: row;
  padding-top: 25px;
  height: 100vh;
  justify-content: space-between;
  align-items: center;
}

button {
  width: 48%;
  height: 15%;
  font-size: calc(4vh + 0.7vw);
}
</style>
