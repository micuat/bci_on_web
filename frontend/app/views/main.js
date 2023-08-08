import html from "choo/html";
import { css } from "@emotion/css";

const mainCss = css`
.p5 {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}
`;

// export module
export default function(state, emit) {
  return html`
    <div class=${ mainCss }>
      <a href="/ecg">ECG</a>
      <a href="/emg">EMG</a>
      <a href="/eeg">EEG</a>
    </div>
  `;
}

