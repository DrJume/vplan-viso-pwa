<template>
  <div ref="cb" class="connectivity-badge" :class="{blink: active}">
    <span v-if="type === 'offline'" class="badge badge-warning">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z"></path>
        <path
          d="M24 15c0-2.64-2.05-4.78-4.65-4.96C18.67 6.59 15.64 4 12 4c-1.33 0-2.57.36-3.65.97l1.49 1.49C10.51 6.17 11.23 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 .99-.48 1.85-1.21 2.4l1.41 1.41c1.09-.92 1.8-2.27 1.8-3.81zM4.41 3.86L3 5.27l2.77 2.77h-.42C2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h11.73l2 2 1.41-1.41L4.41 3.86zM6 18c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73l8 8H6z"
        ></path>
      </svg>
    </span>
    <span v-else-if="type === 'online'" class="badge badge-success">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z"></path>
        <path
          d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3z"
        ></path>
      </svg>
    </span>
  </div>
</template>

<style scoped lang="scss">
@keyframes blink {
  40% {
    opacity: 1;
  }
  80% {
    opacity: 0;
  }
}

.connectivity-badge {
  position: fixed;
  top: 1.5rem;
  left: 15px;
  float: left;
  z-index: 2;
}

@media (min-width: 576px) {
  .connectivity-badge {
    left: calc(50% - (540px / 2) + 15px);
  }
}

@media (min-width: 768px) {
  .connectivity-badge {
    left: calc(50vw - (720px / 2) + 15px);
  }
}

@media (min-width: 992px) {
  .connectivity-badge {
    left: calc(50vw - (960px / 2) + 15px);
  }
}

@media (min-width: 1200px) {
  .connectivity-badge {
    left: calc(50vw - (1140px / 2) + 15px);
  }
}

.connectivity-badge {
  opacity: 0;
}

.blink {
  animation: blink 1.5s ease-in-out 2;
}
</style>

<script>
export default {
  name: 'ConnectivityBadge',

  data () {
    return {
      active: false,
      type: ''
    }
  },

  methods: {
    status (status) {
      this.type = status
      this.active = false

      this.$nextTick(() => {
        this.active = true
      })
    }
  }
}
</script>
