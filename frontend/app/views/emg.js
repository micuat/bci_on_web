import html from "choo/html";
import { css } from "@emotion/css";

import EmgElement from '../components/emg-element.js';
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
          window.emg = 0;
          src(o1).color(1,1,1,0.99).mask(src(o1).a().thresh(0.1,0.1)).modulate(
            osc(6,0,1.5).brightness(-.5).modulate(noise(5).sub(gradient()),1),0.003
            ).layer(
            osc(30,0.1,1.5).mask(shape(999,()=>window.emg*0.3,0)).modulate(
              osc(50).kaleid(99).add(noise(1),.3).brightness(-.5),0.1)
            ).out(o1)
          solid().layer(src(o1).mult(solid(1,1,1,0)).add(solid(0,0,0,1))).out()`
        }) }
      </div>
      <div class="p5">
        ${ this.state.cache(EmgElement, 'my-emg').render() }
      </div>
    </div>
  `;
}

