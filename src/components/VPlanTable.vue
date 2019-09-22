<template>
  <div v-if="vplanData">
    <div class="rounded shadow-sm p-1 mb-3">
      <h3 class="my-0">{{ vplanData.head.title }}</h3>
      <small class="font-weight-light">Letzte Änderung am: {{ vplanData.head.created }}</small>
      <p class="mt-2 lead font-italic">{{ vplanData.info }}</p>
    </div>

    <div>
      <table class="shadow-sm table table-hover table-striped table-sm table-bordered table-responsive-md">
        <thead>
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
              }"
            >{{ entry[column] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped type="scss">

table {
  overflow-wrap: break-word;
}

@media (max-width: 767px) {
  th > span {
    writing-mode: vertical-lr;
    text-orientation: mixed;
    transform: rotate(180deg);
    padding: 0.4rem 0 0.4rem 0;
    vertical-align: bottom;
    white-space: nowrap;
  }
}

@media (max-width: 575px) {
  table {
    font-size: 0.8rem;
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
  }
}
</script>
