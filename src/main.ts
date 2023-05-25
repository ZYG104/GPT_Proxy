import { createApp } from 'vue'
import App from './App.vue'

import { router } from './router/main'
import { pinia } from './stores/main';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

// import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'


const vuetify = createVuetify({
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
})

const app = createApp(App)



app.use(pinia).use(router).use(vuetify).mount('#app')


