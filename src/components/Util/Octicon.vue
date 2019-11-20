<template>
  <!-- eslint-disable-next-line -->
  <span v-html="getSVG()" />
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
    svgClass: {
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
        class: this.svgClass ? this.svgClass : ' ',
        'aria-label': this.label
      })
    }
  }
}
</script>

<style scoped>
span >>> .octicon {
  display: inline-block;
  vertical-align: text-top;
  fill: currentColor;
}
</style>
