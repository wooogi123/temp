import AppContainer from './components/AppContainer.js';
import KakaoSDK from './components/KakaoSDK.js';
function initializeDom() {
    const containerEl = new AppContainer();
    containerEl.setAttribute('container-width', '360');
    containerEl.setAttribute('container-height', '360');
    const kakaoSdkEl = new KakaoSDK();
    containerEl.appendChild(kakaoSdkEl);
    return containerEl;
}
function App() {
    const el = initializeDom();
    document.body.appendChild(el);
}
window.onload = () => { App(); };
