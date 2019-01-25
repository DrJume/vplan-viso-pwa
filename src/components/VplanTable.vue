<template>
  <div v-if="vplanData">
    <div class="rounded shadow-sm p-1 mb-3">
      <h3 class="my-0">{{ vplanData.head.title }}</h3>
      <small class="font-weight-light">Letzte Änderung am: {{ vplanData.head.created }}</small>
      <p class="mt-2 lead font-italic">{{ vplanData.info }}</p>
    </div>

    <div v-if="vplanData.type === 'students'">
      <table class="shadow-sm table table-hover table-striped table-sm table-bordered">
        <thead>
          <tr>
            <th>
              <span>Klasse</span>
            </th>
            <th>
              <span>Stunde</span>
            </th>
            <th>
              <span>Fach</span>
            </th>
            <th>
              <span>Lehrer</span>
            </th>
            <th>
              <span>Raum</span>
            </th>
            <th>
              <span>Info</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, indexEntry) in vplanData.body" :key="indexEntry">
            <td
              v-for="(column, indexColumn) in students_columns"
              :key="indexColumn"
              :class="{ 'text-danger' : entry.changed.includes(column)}"
            >{{ entry[column] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="vplanData.type === 'teachers'">
      <table class="table table-hover table-striped table-sm table-bordered">
        <thead>
          <tr>
            <th>
              <span>Lehrer</span>
            </th>
            <th>
              <span>Stunde</span>
            </th>
            <th>
              <span>Klasse/Kurs</span>
            </th>
            <th>
              <span>Fach neu</span>
            </th>
            <th>
              <span>Raum neu</span>
            </th>
            <th>
              <span>für Fach</span>
            </th>
            <th>
              <span>für Lehrer</span>
            </th>
            <th>
              <span>Info</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in vplanData.body" :key="index">
            <td
              v-for="(column, indexColumn) in teachers_columns"
              :key="indexColumn"
              :class="{ 'text-danger' : entry.changed.includes(column)}"
            >{{ entry[column] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped type="scss">
th > span {
  writing-mode: vertical-lr;
  text-orientation: mixed;
  transform: rotate(180deg);
  padding: 0.4rem 0 0.4rem 0;
  vertical-align: bottom;
  white-space: nowrap;
}

table {
  font-size: 0.8rem;
}

@media (min-width: 576px) {
  th > span {
    writing-mode: unset;
    text-orientation: unset;
    transform: none;
  }

  table {
    font-size: 1rem;
  }
}

@media (min-width: 768px) {
}
</style>

<script>
export default {
  name: 'VplanTable',
  data () {
    return {
      students_columns: [
        'class',
        'lesson',
        'subject',
        'teacher',
        'room',
        'info'
      ],
      teachers_columns: [
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
  },
  props: {
    vplanData: Object
  },
  methods: {
    load (vplan) {
      console.debug(vplan)
      this.vplanData = vplan
    }
  }
}
</script>
