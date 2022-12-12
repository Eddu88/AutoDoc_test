//import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/main.scss'
import {initialize} from './bootstrap/initialize.js'
import { router } from './router/index.router.js'

//Required templates
require.context('./assets/templates/generate_scripts/', true)

initialize();

/* Listening for a change in the hash and then calling the router function with the new hash. */
window.addEventListener('hashchange', () => {
    router(window.location.hash)
});