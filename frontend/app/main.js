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
import ecgView from "./views/ecg.js";

app.route("/", mainView);
app.route("/ecg", ecgView);

// start app
app.mount("#choomount");

app.state.socket = io("http://localhost:3000");
app.state.socket.on("connect", () => {
});
