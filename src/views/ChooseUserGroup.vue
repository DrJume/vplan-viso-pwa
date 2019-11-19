<template>
  <div id="chooseUserGroup">
    <button
      class="btn btn-primary btn-lg"
      @click="() => setUserGroup('students')"
    >
      Schüler
    </button>

    <button
      class="btn btn-primary btn-lg"
      @click="() => setUserGroup('teachers')"
    >
      Lehrer
    </button>
  </div>
</template>

<script>
export default {
  name: 'ChooseUserGroup',

  methods: {
    setUserGroup (userGroup) {
      this.App.settings.userGroup = userGroup
      this.$router.replace({ name: userGroup })
    }
  }
}
</script>

<style scoped lang="scss">
#chooseUserGroup {
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
