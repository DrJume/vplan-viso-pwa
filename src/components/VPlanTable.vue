<template>
  <div v-if="vplanData">
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

    <div class="text-left pl-1 text-muted">
      <small>{{filteredVPlanBody.length}} von {{vplanData.body.length}} Einträgen</small>
    </div>
    <div>
      <table
        ref="table"
        class="shadow-sm table table-hover table-striped table-sm table-bordered table-responsive-md"
      >
        <thead ref="tableHead">
          <tr v-if="filteredVPlanBody.length > 0">
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
          <tr v-for="entry in filteredVPlanBody" :key="entry._id">
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
</template>

<script>
import { debounce } from '@/lib/util.js'

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

  computed: {
    filteredVPlanBody () {
      if (!this.App.settings.filter.active) return this.vplanData.body

      const sanitizedQuery = this.App.settings.filter.query
        .split(';').map(keyword => keyword.trim()).filter(keyword => !!keyword)

      let queryRegExp
      try {
        queryRegExp = RegExp(sanitizedQuery.join('|'))
      } catch (error) {
        return []
      }

      console.debug('Filter RegExp: ', queryRegExp)

      const filtered = this.vplanData.body.filter(entry => {
        let filterCondition = false

        if (this.App.settings.userGroup === 'students') {
          filterCondition = filterCondition || queryRegExp.test(entry.class.replace(/ /g, ''))
        } else { // teachers
          filterCondition = filterCondition || queryRegExp.test(entry.new_teacher.replace(/ /g, ''))
        }

        if (this.App.settings.filter.searchInfo) {
          filterCondition = filterCondition || queryRegExp.test(entry.info)
        }

        return filterCondition
      })

      return filtered
    }
  },

  methods: {
    makeArrowsFancy (supervision) {
      return supervision.replace(/-->/g, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 2 24 24"><path d="M16 8v-4l8 8-8 8v-4h-16l8-8h8z"/></svg>')
    },

    tableResponsivenessNeededCheck () {
      if (!this.vplanData) return

      this.$refs.table.classList.add('table-responsive-md')
      this.$nextTick(() => {
        const tableViewportWidth = this.$refs.table.clientWidth
        const tableContentWidth = this.$refs.tableHead.clientWidth

        // Make table full width when too narrow
        if (tableContentWidth <= tableViewportWidth) {
          this.$refs.table.classList.remove('table-responsive-md')
        }
      })
    }
  },

  mounted () {
    this.tableResponsivenessNeededCheck()

    this._debouncedTableResponsivenessNeededCheck = debounce(() => this.tableResponsivenessNeededCheck(), 100)

    window.addEventListener('orientationchange', this._debouncedTableResponsivenessNeededCheck)
    window.addEventListener('resize', this._debouncedTableResponsivenessNeededCheck)
  },

  updated () {
    this.tableResponsivenessNeededCheck()
  },

  beforeDestroy () {
    window.removeEventListener('orientationchange', this._debouncedTableResponsivenessNeededCheck)
    window.removeEventListener('resize', this._debouncedTableResponsivenessNeededCheck)
  }
}
</script>

<style scoped>
table {
  overflow-wrap: break-word;
}

tbody {
  user-select: text;
}

.fancy-arrow >>> svg {
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

  .fancy-arrow >>> svg {
    width: 14px;
    height: 14px;
  }
}

</style>
