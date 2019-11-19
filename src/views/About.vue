<template>
  <div class="">
    <h2>Über</h2>

    <small class="font-weight-light font-italic">v{{ version }}</small>
  </div>
</template>

<script>
import pkg from '@/../package.json'

export default {
  name: 'About',

  computed: {
    version () {
      return pkg.version
    }
  }
}
</script>
