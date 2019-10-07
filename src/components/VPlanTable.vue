<template>
  <transition name="fade" mode="out-in" appear @enter="tableResponsivenessNeededCheck">
    <div v-if="vplanData" key="vplanColumn">
      <div class="rounded shadow-sm p-1 mb-3">
        <h3 class="my-0">{{ vplanData.head.title }}</h3>

        <small class="font-weight-light">Letzte Änderung am: {{ vplanData.head.created }}</small>

        <p class="mt-2 lead font-italic">{{ vplanData.info }}</p>

        <div class="aux mb-3 px-5" v-if="vplanData._type === 'teachers'">
          <strong>Abwesend:</strong>
          <br>
          {{ vplanData.head.missing.teachers }}
        </div>

        <div class="aux" v-if="vplanData._type === 'teachers'">
          <ul class="list-unstyled">
            <strong>Aufsichten:</strong>
            <li
              v-for="(supervision, indexSupervision) in vplanData.supervision"
              :key="indexSupervision"
            >
              <span
                class="fancy-arrow"
                v-html="makeArrowsFancy(supervision)"
              ></span>
            </li>
          </ul>
        </div>

      </div>

      <div>
        <table
          ref="table"
          class="shadow-sm table table-hover table-striped table-sm table-bordered table-responsive-md"
          :class="{'table-dark': isDarkMode}"
        >
          <thead ref="tableHead">
            <tr>
              <slot v-if="vplanData._type === 'students'">
                <th><span>Klasse</span></th>
                <th><span>Stunde</span></th>
                <th><span>Fach</span></th>
                <th><span>Lehrer</span></th>
                <th><span>Raum</span></th>
                <th><span>Info</span></th>
              </slot>

              <slot v-else-if="vplanData._type === 'teachers'">
                <th><span>Lehrer</span></th>
                <th><span>Stunde</span></th>
                <th><span>Klasse/Kurs</span></th>
                <th><span>Fach neu</span></th>
                <th><span>Raum neu</span></th>
                <th><span>für Fach</span></th>
                <th><span>für Lehrer</span></th>
                <th><span>Info</span></th>
              </slot>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in vplanData.body" :key="entry._id">
              <td
                v-for="(column, indexColumn) in columns[vplanData._type]"
                :key="indexColumn"
                :class="{
                  'text-danger' : entry.changed.includes(column),
                  'text-nowrap' : column === 'lesson'
                }"
              >{{ entry[column] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-else-if="this.vplanData === null"
      key="vplanUnavailable"
      class="alert alert-secondary"
      role="alert"
    >
      Vertretungsplan folgt demnächst.
    </div>

    <div
      v-else-if="this.vplanData === undefined"
      key="vplanLoadingSpinner"
      class="d-flex justify-content-center m-5"
    >
      <div class="spinner-grow" style="width: 4rem; height: 4rem;" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </transition>
</template>

<style scoped type="css">

table {
  overflow-wrap: break-word;
}

.fancy-arrow ::v-deep svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

@media (max-width: 767px) {
  th > span {
    writing-mode: vertical-lr;
    text-orientation: mixed;
    transform: rotate(180deg);
    padding: 0.4rem 0 0.4rem 0;
    vertical-align: bottom;
    white-space: nowrap;
    min-width: 1.2rem; /* Fix Safari vertical text width collapse issue and generally better centering */
  }
}

@media (max-width: 460px) {
  table, .aux {
    font-size: 0.8rem;
  }

  .fancy-arrow ::v-deep svg {
    width: 14px;
    height: 14px;
  }
}

</style>

<script>
export default {
  name: 'VPlanTable',

  props: {
    vplanData: Object
  },

  data () {
    return {
      columns: {
        students: [
          'class',
          'lesson',
          'subject',
          'teacher',
          'room',
          'info'
        ],
        teachers: [
          'new_teacher',
          'lesson',
          'class',
          'new_subject',
          'new_room',
          'subject',
          'teacher',
          'info'
        ]
      }
    }
  },

  methods: {
    makeArrowsFancy (supervision) {
      return supervision.replace(/-->/g, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 2 24 24"><path d="M16 8v-4l8 8-8 8v-4h-16l8-8h8z"/></svg>')
    },

    tableResponsivenessNeededCheck () {
      if (!this.vplanData) return

      const tableViewportWidth = this.$refs.table.clientWidth
      const tableContentWidth = this.$refs.tableHead.clientWidth

      // Make table full width when too narrow
      if (tableContentWidth < tableViewportWidth) {
        this.$refs.table.classList.remove('table-responsive-md')
      }
    }
  }
}
</script>
