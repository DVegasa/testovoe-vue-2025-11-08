<template>
  <div class="appCalendar">
    <div class="header">
      <div class="prevButton" @click="script.onPrevButtonClick">⯇</div>
      <div class="title">{{ script.visualTitle.value }}</div>
      <div class="nextButton" @click="script.onNextButtonClick">⯈</div>
    </div>
    <div class="daysOfWeek">
      <div class="dow" v-for="dow in script.daysOfWeek.value" :key="dow">{{ dow }}</div>
    </div>
    <div class="body">
      <div class="row" v-for="row in script.visualGrid.value" :key="row[0]?.getDate()">
        <div
          class="cell"
          :class="[
            cell?.getDate() && '_hasDate',
            cell && script.isDateSelected(cell) && '_selected',
          ]"
          v-for="cell in row"
          :key="cell?.getDate()"
          @click="cell && script.onDateClick(cell)"
        >
          {{ cell?.getDate() ?? '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue'
import type { AppCalendarEmits, AppCalendarProps } from './calendar.types'
import { useAppCalendar } from './calendar.scripts'

defineComponent({
  name: 'AppCalendar',
})

const props = withDefaults(defineProps<AppCalendarProps>(), {
  lang: 'ru',
  date: () => {
    const now = new Date()
    const iso = now.toISOString()
    return iso.substring(0, '2025-01-01'.length)
  },
})
const emits = defineEmits<AppCalendarEmits>()

const script = useAppCalendar(props, emits)
</script>

<style lang="scss">
@use './calendar.styles.scss';
</style>
