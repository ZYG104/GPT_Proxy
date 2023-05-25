const pinia = createPinia()

const historyPinia = localStorage.getItem('pinia')

if (historyPinia)
    pinia.state.value = JSON.parse(historyPinia)

window.onbeforeunload = () => {
    localStorage.setItem('pinia', JSON.stringify(pinia.state.value))
}

export { pinia }