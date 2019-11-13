<template>
  <!-- eslint-disable-next-line -->
  <span :class="className" v-html="getSVG()" />
</template>

<script>
import octicons from '@primer/octicons'

export default {
  name: 'Octicon',
  props: {
    icon: {
      type: String,
      required: true
    },
    scale: {
      type: Number,
      default: 1
    },
    className: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  methods: {
    getSVG () {
      return octicons[this.icon].toSVG({
        width: (octicons[this.icon].width * this.scale),
        height: (octicons[this.icon].height * this.scale),
        class: ' ',
        'aria-label': this.label
      })
    }
  }
}
</script>

<style scoped>
.octicon {
  display: inline-block;
  vertical-align: text-top;
  fill: currentColor;
}
</style>
