import BaseComponent from "./BaseComponent.js";
import { debounce } from '../utils.js';
const fetchGoogleLogin = async (url, payload, token) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);
    const resp = await fetch(url, {
        method: 'POST',
        headers,
        body: payload,
    });
    if (resp.ok) {
        const data = await resp.json();
        return data;
    }
    throw new Error(`Fetch Failure\n${resp.status} ${resp.statusText}`.trim());
};
export default class GoogleSDK extends BaseComponent {
    connectedCallback() {
        this._shadowRoot.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
        }

        .container {
          width: 100%;
          height: 100%;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        input {
          outline: none;
          border: 2px solid rgba(255, 255, 255, 0.16);
          border-radius: 12px;
          background: transparent;
          color: #ffffff;
          margin: 0 0 24px 0;
          padding: 0 8px;
          width: 328px;
          height: 36px;
          font-size: 16px;
        }

        input:hover {
          border: 2px solid rgba(255, 255, 255, 0.48);
        }

        input:active {
          border: 2px solid rgba(255, 255, 255, 0.48);
        }

        input:focus {
          border: 2px solid rgba(255, 255, 255, 0.48);
        }

        textarea {
          outline: none;
          border: 2px solid rgba(255, 255, 255, 0.16);
          border-radius: 12px;
          background: transparent;
          color: #ffffff;
          margin: 0 0 24px 0;
          padding: 8px;
          width: 328px;
          min-height: 36px;
          height: 148px;
          max-height: 148px;
          font-size: 16px;
          resize: vertical;
        }

        textarea:hover {
          border: 2px solid rgba(255, 255, 255, 0.48);
        }

        textarea:active {
          border: 2px solid rgba(255, 255, 255, 0.48);
        }

        textarea:focus {
          border: 2px solid rgba(255, 255, 255, 0.48);
        }

        .google-login {
          --color-google: #ffffff;
          --hover-gradient: linear-gradient(rgba(51, 51, 51, 0.08), rgba(51, 51, 51, 0.08));
          --active-gradient: linear-gradient(rgba(51, 51, 51, 0.16), rgba(51, 51, 51, 0.16));

          border: none;
          outline: none;
          width: 328px;
          height: 36px;
          display: inline-flex;
          border-radius: 12px;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 0;
          font-size: 12px;
          font-weight: 700;

          background: var(--color-google);
        }

        .google-login:hover {
          background: var(--hover-gradient), var(--color-google);
        }

        .google-login:active {
          background: var(--active-gradient), var(--color-google);
        }

        .google-login:disabled {
          background: #8e8e8e;
        }

        .google-login > span {
          margin-left: 8px;
        }
      </style>
      <div class="container">
        <input class="js-key" />
        <input class="server-auth-url" />
        <textarea class="payload-style"></textarea>
        <button class="google-login">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><title>Google Icon</title><path d="M23.494 12.281c0-.813-.065-1.63-.206-2.43H12.004v4.606h6.462a5.537 5.537 0 01-2.391 3.635v2.99h3.855c2.263-2.084 3.564-5.161 3.564-8.8z" fill="#4285F4"></path><path d="M12.004 23.97c3.227 0 5.948-1.06 7.93-2.889l-3.855-2.989c-1.072.73-2.457 1.143-4.07 1.143-3.121 0-5.767-2.105-6.717-4.936H1.314v3.081a11.964 11.964 0 0010.69 6.59z" fill="#34A853"></path><path d="M5.288 14.299a7.165 7.165 0 010-4.58V6.637H1.314a11.973 11.973 0 000 10.743L5.288 14.3z" fill="#FBBC04"></path><path d="M12.004 4.778a6.5 6.5 0 014.59 1.793l3.415-3.415A11.497 11.497 0 0012.004.044a11.96 11.96 0 00-10.69 6.593L5.288 9.72c.945-2.835 3.595-4.941 6.716-4.941z" fill="#EA4335"></path></svg>
          <span>구글 계정으로 로그인</span>
        </button>
      </div>
    `;
        const jsKeyInputEl = this._shadowRoot.querySelector('.js-key');
        const serverAuthUrlInputEl = this._shadowRoot.querySelector('.server-auth-url');
        const textareaEl = this._shadowRoot.querySelector('.payload-style');
        const googleLoginButtonEl = this._shadowRoot.querySelector('.google-login');
        if (jsKeyInputEl === null)
            return;
        if (!(jsKeyInputEl instanceof HTMLInputElement))
            return;
        if (serverAuthUrlInputEl === null)
            return;
        if (!(serverAuthUrlInputEl instanceof HTMLInputElement))
            return;
        if (textareaEl === null)
            return;
        if (!(textareaEl instanceof HTMLTextAreaElement))
            return;
        if (googleLoginButtonEl === null)
            return;
        if (!(googleLoginButtonEl instanceof HTMLButtonElement))
            return;
        jsKeyInputEl.placeholder = 'Google JavaScript 키';
        jsKeyInputEl.addEventListener('change', debounce(() => {
            const id = 'google-sdk';
            const sdk = document.createElement('script');
            const firstScript = document.getElementsByTagName('script')[0];
            const existElement = document.getElementById(id);
            if (existElement !== null) {
                document.head.removeChild(existElement);
            }
            sdk.id = id;
            sdk.src = 'https://apis.google.com/js/platform.js';
            document.head.appendChild(sdk);
            sdk.onload = () => {
                window.gapi.load('auth2', () => {
                    const auth2 = window.gapi.auth2.init({
                        client_id: jsKeyInputEl.value,
                        scope: 'profile email',
                    });
                    googleLoginButtonEl.disabled = false;
                    auth2.attachClickHandler(googleLoginButtonEl, {
                        ux_mode: 'popup',
                    }, (googleUser) => {
                        const { id_token } = googleUser.getAuthResponse();
                        const callbackUrl = serverAuthUrlInputEl.value;
                        if (callbackUrl === '') {
                            alert('callback url not exist!');
                            return;
                        }
                        const payloadStyle = textareaEl.value.trim().replace('$1', id_token);
                        fetchGoogleLogin(callbackUrl, payloadStyle, id_token)
                            .then(console.log)
                            .catch(console.error);
                    }, (error) => {
                        console.error(error);
                    });
                });
            };
        }, 500));
        serverAuthUrlInputEl.placeholder = 'Server Auth Callback URL';
        textareaEl.value = `
{
  "accessToken": "$1"
}
    `.trim();
        googleLoginButtonEl.disabled = true;
    }
}
customElements.define('app-google-sdk', GoogleSDK);
