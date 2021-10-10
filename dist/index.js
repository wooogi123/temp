import AppContainer from './components/AppContainer.js';
import KakaoSDK from './components/KakaoSDK.js';
import GoogleSDK from './components/GoogleSDK.js';
function initializeDom(component) {
    const containerEl = new AppContainer();
    containerEl.setAttribute('container-width', '360');
    containerEl.setAttribute('container-height', '360');
    containerEl.appendChild(component);
    return containerEl;
}
function App() {
    const kakaoContainer = initializeDom(new KakaoSDK());
    const googleContainer = initializeDom(new GoogleSDK());
    document.body.appendChild(kakaoContainer);
    document.body.appendChild(googleContainer);
}
window.onload = () => { App(); };
