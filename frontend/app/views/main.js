import html from "choo/html";
import { css } from "@emotion/css";

import GraphElement from '../components/graph-element.js';
import HydraElement from '../components/graph-element.js';

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
        ${ this.state.cache(HydraElement, 'my-hydra').render() }
      </div>
      <div class="p5">
        ${ this.state.cache(GraphElement, 'my-p5').render() }
      </div>
    </div>
  `;
}

