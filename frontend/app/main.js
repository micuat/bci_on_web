// import choo
// import devtools from "choo-devtools";
import choo from "choo";
import html from "choo/html";

import { io } from "socket.io-client";

// initialize choo
const app = choo({ hash: true });
// app.use(devtools())

app.route("/*", notFound);

// const splash = urlParams.get("splash");

function notFound() {
  return html`
    <div>
      <a href="/"> 404 with love ❤ back to top! </a>
    </div>
  `;
}

// import a template
import mainView from "./views/main.js";

app.route("/", mainView);

// start app
app.mount("#choomount");

app.state.socket = io("http://localhost:3000");
app.state.socket.on("connect", () => {
});

// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'
// import { io } from "socket.io-client";

// document.querySelector('#app').innerHTML = `
//   <div>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))

// const socket = io("http://localhost:3000");
// socket.on("connect", (e) => {
//   console.log("connected")
// });
// socket.on("osc", (e) => {
//   if (e.address == "/openbci/time-series-filtered/ch0") {
//     document.querySelector('#counter').innerText = e.args[0].value//JSON.stringify(e)
//   }
// });
