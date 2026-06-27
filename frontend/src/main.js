import './style.css'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/vs2015.css'
import { mount } from 'svelte'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')
})

export default app
