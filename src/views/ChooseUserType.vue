<template>
  <div id="nav">
    <router-link
      :to="{ name: 'students' }"
      tag="button"
      class="btn btn-primary btn-lg"
    >Schüler</router-link>

    <router-link
      :to="{ name: 'teachers' }"
      tag="button"
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
  height: calc(100vh - 2 * 1.5rem);
  justify-content: space-between;
  align-items: center;
}

button {
  width: 48%;
  height: 15%;
  font-size: calc(4vh + 0.7vw);
}
</style>
