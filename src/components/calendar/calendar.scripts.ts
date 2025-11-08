import { computed, ref, watch } from 'vue'
import type { AppCalendarEmits, AppCalendarProps } from './calendar.types'
import { AppCalendarI18n } from './calendar.i18n'

export const useAppCalendar = (props: AppCalendarProps, emits: AppCalendarEmits) => {
  const currentYear = ref<number>(Number(props.date?.substring(0, '2025'.length)))
  const currentMonth = ref<number>(Number(props.date?.substring('2025-'.length, '2025-01'.length)))

  const selectedDate = ref<Date>(stringToDate(props.date ?? null))

  watch(
    () => props.date,
    () => {
      try {
        validateStringDate(props?.date ?? '')
      } catch {
        emits('update:date', dateToString(new Date()))
      }
      currentYear.value = Number(props.date?.substring(0, '2025'.length))
      currentMonth.value = Number(props.date?.substring('2025-'.length, '2025-01'.length))
      selectedDate.value = stringToDate(props.date ?? null)
    },
    { immediate: true },
  )

  function validateStringDate(stringDate: string): void {
    // например 2025-01-01
    const regexValidDate = /\d\d\d\d-\d\d-\d\d/
    if (!regexValidDate.test(stringDate)) {
      throw new Error('AppCalendar: Неправильная дата')
    }

    const parts = stringDate.split('-')
    if (parts.length !== 3) {
      throw new Error('AppCalendar: Неправильная дата')
    }

    const y = Number(parts[0])
    const m = Number(parts[1])
    const d = Number(parts[2])

    if (y < 1970 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) {
      throw new Error('AppCalendar: Неправильная дата')
    }

    const date = new Date(y, m - 1, d)
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
      throw new Error('AppCalendar: Неправильная дата')
    }
  }

  const i18n = computed(() => {
    return AppCalendarI18n[props?.lang ?? 'ru']
  })

  const daysOfWeek = computed<string[]>(() => {
    return i18n.value.daysOfWeek
  })

  const visualGrid = computed<Array<Array<Date | null>>>(() => {
    const days = getDaysInMonth(currentMonth.value - 1, currentYear.value)
    const grid: Array<Array<Date | null>> = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
    ]

    let iRow: number = 0
    let iCol: number = 0

    iCol = days[0]?.getDay() ?? 0
    if (iCol === 0) {
      iCol = 7
    }

    for (const day of days) {
      if (iCol > 7) {
        iCol = 1
        iRow++
      }

      if (grid && grid[iRow]) {
        if (iRow < grid.length) {
          // @ts-expect-error Тут ошибки не будет, контроль за значениями есть
          grid[iRow][iCol - 1] = day
          iCol++
        }
      }
    }

    return grid
  })

  function isDateSelected(date: Date): boolean {
    return isDatesEqual(date, selectedDate.value)
  }

  const visualTitle = computed(() => {
    return `${i18n.value.months[currentMonth.value]} ${currentYear.value}`
  })

  function onNextButtonClick() {
    if (currentMonth.value === 12) {
      currentMonth.value = 1
      currentYear.value = currentYear.value + 1
    } else {
      currentMonth.value = currentMonth.value + 1
    }
  }

  function onPrevButtonClick() {
    if (currentMonth.value === 1) {
      currentMonth.value = 12
      currentYear.value = currentYear.value - 1
    } else {
      currentMonth.value = currentMonth.value - 1
    }
  }

  function getDaysInMonth(month: number, year: number): Date[] {
    const date = new Date(year, month, 1)
    const days = []
    while (date.getMonth() === month) {
      days.push(new Date(date))
      date.setDate(date.getDate() + 1)
    }
    return days
  }

  function onDateClick(date: Date): void {
    selectedDate.value = date
  }

  watch(selectedDate, () => {
    emits('update:date', dateToString(selectedDate.value))
  })

  function stringToDate(s: string | null): Date {
    if (!s) {
      return new Date()
    }

    const parts = s.split('-')
    if (parts[0] && parts[1] && parts[2]) {
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
    }
    throw new Error('AppCalendar: Неправильная дата')
  }

  function dateToString(d: Date): string {
    const yyyy = d.getFullYear()
    const mm = `${d.getMonth() + 1}`.padStart(2, '0')
    const dd = `${d.getDate()}`.padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  function isDatesEqual(d1: Date | null, d2: Date | null): boolean {
    if (d1 === null || d2 === null) {
      return false
    }
    return dateToString(d1) === dateToString(d2)
  }

  return {
    currentYear,
    currentMonth,
    visualGrid,
    daysOfWeek,
    visualTitle,
    onNextButtonClick,
    onPrevButtonClick,
    getDaysInMonth,
    isDateSelected,
    onDateClick,
  }
}
