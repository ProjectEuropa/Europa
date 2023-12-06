import { createVuetify } from 'vuetify'
import { MAIN_THEME, mainTheme, MAIN_DARK_THEME, mainDarkTheme } from '@/helpers/themes'
import { defaults } from '@/helpers/defaults'
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    defaults,
    display: {
      mobileBreakpoint: 'sm',
    },
    theme: {
      defaultTheme: MAIN_THEME,
      themes: {
        mainTheme,
        mainDarkTheme,
      },
      variations: {
        colors: ['primary', 'secondary', 'accent'],
        lighten: 9,
        darken: 9,
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
