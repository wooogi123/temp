export default class BaseComponent extends HTMLElement {
  protected _shadowRoot: ShadowRoot;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {}
}
