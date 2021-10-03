import BaseComponent from "./BaseComponent.js";
import { debounce } from '../utils.js';
const fetchKakaoLogin = async (url, payload, token) => {
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
export default class KakaoSDK extends BaseComponent {
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

        .kakao-login {
          --color-kakao: #fee500;
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

          background: var(--color-kakao);
        }

        .kakao-login:hover {
          background: var(--hover-gradient), var(--color-kakao);
        }

        .kakao-login:active {
          background: var(--active-gradient), var(--color-kakao);
        }

        .kakao-login:disabled {
          background: #8e8e8e;
        }

        .kakao-login > span {
          margin-left: 8px;
        }
      </style>
      <div class="container">
        <input class="js-key" />
        <input class="server-auth-url" />
        <textarea class="payload-style"></textarea>
        <button class="kakao-login">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <title>KakaoTalk Icon</title>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.2c6.628 0 12 4.361 12 9.74 0 5.38-5.372 9.74-12 9.74-.727 0-1.44-.052-2.131-.152L8.09 21.803c-1.299.922-2.858 2.003-3.235 2.156l-.057.017s-.155.062-.286-.018c-.132-.08-.108-.289-.108-.289l.033-.152c.181-.747 1.02-3.732 1.188-4.325C2.246 17.47 0 14.418 0 10.94 0 5.561 5.373 1.2 12 1.2z" fill="#3C1E1E"></path>
          </svg>
          <span>카카오톡으로 로그인</span>
        </button>
      </div>
    `;
        const jsKeyInputEl = this._shadowRoot.querySelector('.js-key');
        const serverAuthUrlInputEl = this._shadowRoot.querySelector('.server-auth-url');
        const textareaEl = this._shadowRoot.querySelector('.payload-style');
        const kakaoLoginButtonEl = this._shadowRoot.querySelector('.kakao-login');
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
        if (kakaoLoginButtonEl === null)
            return;
        if (!(kakaoLoginButtonEl instanceof HTMLButtonElement))
            return;
        jsKeyInputEl.placeholder = 'Kakao JavaScript 키';
        jsKeyInputEl.addEventListener('change', debounce(() => {
            window.Kakao.cleanup();
            window.Kakao.init(jsKeyInputEl.value);
            if (window.Kakao.isInitialized()) {
                console.log('Kakao JS SDK initialize status : true');
                kakaoLoginButtonEl.disabled = false;
            }
        }, 500));
        serverAuthUrlInputEl.placeholder = 'Server Auth Callback URL';
        textareaEl.value = `
{
  "accessToken": "$1"
}
    `.trim();
        kakaoLoginButtonEl.disabled = true;
        kakaoLoginButtonEl.addEventListener('click', () => {
            if (!window.Kakao.isInitialized())
                return;
            window.Kakao.Auth.login({
                success: (successResp) => {
                    const callbackUrl = serverAuthUrlInputEl.value;
                    if (callbackUrl === '') {
                        alert('callback url not exist!');
                        return;
                    }
                    const payloadStyle = textareaEl.value.trim().replace("$1", successResp.access_token);
                    fetchKakaoLogin(callbackUrl, payloadStyle, successResp.access_token)
                        .then(console.log)
                        .catch(console.error);
                },
                fail: console.error,
            });
        });
    }
}
customElements.define('app-kakao-sdk', KakaoSDK);
