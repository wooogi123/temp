import BaseComponent from './BaseComponent.js';

type AttributePrefix = 'container';

type AttributeItems = 'width' | 'height';

type Attributes = `${AttributePrefix}-${AttributeItems}`;

export default class AppContainer extends BaseComponent {
  private elRef: HTMLDivElement | undefined;

  constructor() {
    super();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          console.log('Node Added: ', mutation.addedNodes[0]);
        }
      });
    });

    observer.observe(this, { childList: true });
  }

  connectedCallback() {
    const initialWidth = this.getAttribute('container-width');
    const initialHeight = this.getAttribute('container-height');

    this._shadowRoot.innerHTML = `
      <style>
        :host {
          --width: ${initialWidth ?? 0}px;
          --height: ${initialHeight ?? 0}px;
        }

        .container {
          width: var(--width);
          height: var(--height);
          backdrop-filter: blur(12px) saturate(160%);
          -webkit-backdrop-filter: blur(12px) saturate(160%);
          background-color: rgba(17, 25, 40, 0.6);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
      </style>
      <div class="container">
        <slot></slot>
      </div>
    `;

    const el = this._shadowRoot.querySelector('.container');
    if (el !== null && el instanceof HTMLDivElement) {
      this.elRef = el;
    }
  }

  _onSlotChange() {
    console.log('slot change!');
  }

  static get observedAttributes(): Attributes[] {
    return ['container-width', 'container-height'];
  }

  attributeChangedCallback(name: Attributes, _: string, newValue: string) {
    if (this.elRef === undefined) return;

    const propertyName = (() => {
      switch (name) {
        case 'container-width': {
          return '--width';
        }
        case 'container-height': {
          return '--height';
        }
        default: {
          return;
        }
      }
    })();

    if (propertyName === undefined) return;

    const num = Number.parseFloat(newValue);
    if (Number.isNaN(num)) return;
    this.style.setProperty(propertyName, `${num}px`);
  }
}

customElements.define('app-container', AppContainer);
