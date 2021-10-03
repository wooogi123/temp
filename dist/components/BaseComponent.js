export default class BaseComponent extends HTMLElement {
    _shadowRoot;
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
    }
    connectedCallback() { }
}
