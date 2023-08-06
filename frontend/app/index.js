// import choo
// import devtools from "choo-devtools";
import choo from "choo";
import html from "choo/html";

import { io } from "socket.io-client";

const socket = io();
socket.on("connect", () => {
});

socket.on("osc", (e) => {
  if (e.address == "/openbci/time-series-filtered/ch0") {
    document.querySelector('#counter').innerText = e.args[0].value//JSON.stringify(e)
  }
});

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
