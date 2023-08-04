import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { io } from "socket.io-client";

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))

const socket = io("http://localhost:3000");
socket.on("connect", (e) => {
  console.log("oi")
});
socket.on("osc", (e) => {
  document.querySelector('#counter').innerText = e.args[0].value//JSON.stringify(e)
});
