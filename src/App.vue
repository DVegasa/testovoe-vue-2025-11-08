<template>
  <h1>Демо календаря</h1>
  <div style="padding: 50px; display: flex">
    <AppCalendar v-model:date="date" :lang="lang" />
    <div>
      <div @click="lang = 'ru'">[lang=ru]</div>
      <div @click="lang = 'en'">[lang=en]</div>
      <br />
      <pre>{{ JSON.stringify({ date: date }, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppCalendar, type AppCalendarLangs } from '@/components/calendar'
import { ref } from 'vue'

const date = ref<string | undefined>()
const lang = ref<AppCalendarLangs>('ru')
</script>

<style lang="scss">
@import '@/styles/reset';
@import '@/styles/colors';
@import '@/styles/fonts';
@import '@/styles/base';
</style>
