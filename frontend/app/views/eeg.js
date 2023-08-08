import html from "choo/html";
import { css } from "@emotion/css";

import EegElement from '../components/eeg-element.js';
import HydraElement from '../components/hydra-element.js';

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
      <div class="p5">
        ${ this.state.cache(HydraElement, 'my-hydra').render({
          // code: "shape(4, 0.5, 0).scale(()=>window.pulse).layer(osc(30,0.1,1.5).mask(osc(30).thresh(.5,.1))).out()"
          code: `
          window.relax = 0;
          osc(30,0.1,()=>window.relax).out()`
        }) }
      </div>
      <div class="p5">
        ${ this.state.cache(EegElement, 'my-eeg').render() }
      </div>
    </div>
  `;
}

