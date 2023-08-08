import html from "choo/html";
import { css } from "@emotion/css";

import GlitterElement from '../components/glitter-element.js';

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
        ${ this.state.cache(GlitterElement, 'my-glitter').render() }
      </div>
    </div>
  `;
}

