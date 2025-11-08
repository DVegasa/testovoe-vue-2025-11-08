export type AppCalendarDateType = string // Формат 'YYYY-MM-DD', например, '2001-01-24' - 24 января 2001
export type AppCalendarLangs = 'ru' | 'en'

export type AppCalendarProps = {
  date?: AppCalendarDateType
  lang?: AppCalendarLangs
}

export type AppCalendarEmits = {
  (e: 'update:date', date: AppCalendarDateType): void
}
