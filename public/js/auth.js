// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyBDtbIQ5NT1dhUfRFnauQuH8AbxInmCKjY",
  authDomain: "mojito-4369e.firebaseapp.com",
  projectId: "mojito-4369e",
  storageBucket: "mojito-4369e.appspot.com",
  messagingSenderId: "931450115321",
  appId: "1:931450115321:web:2e4e0ec6bff5fc8ce43e28",
  measurementId: "G-EHL5MNFE3M"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM 元素
const loginForm = document.getElementById('loginForm');
const userInfo = document.getElementById('userInfo');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const returnToExtensionBtn = document.getElementById('returnToExtensionBtn');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const statusMessage = document.getElementById('statusMessage');

// 获取查询参数
const urlParams = new URLSearchParams(window.location.search);
const extensionId = urlParams.get('extensionId');

// 登录事件监听
googleLoginBtn.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .catch(error => {
      console.error('登录错误:', error);
      alert('登录失败: ' + error.message);
    });
});

// 登出事件监听
logoutBtn.addEventListener('click', () => {
  auth.signOut()
    .catch(error => {
      console.error('登出错误:', error);
    });
});

// 返回扩展按钮事件监听
if (returnToExtensionBtn) {
  returnToExtensionBtn.addEventListener('click', () => {
    if (extensionId) {
      window.open(`chrome-extension://${extensionId}/popup.html`, '_blank');
    } else {
      alert('无法找到扩展ID，请手动打开扩展');
    }
  });
}

// 认证状态监听
auth.onAuthStateChanged(user => {
  if (user) {
    // 用户已登录
    showUserInfo(user);
  } else {
    // 用户未登录
    showLoginForm();
  }
});

// 显示用户信息
function showUserInfo(user) {
  loginForm.style.display = 'none';
  userInfo.style.display = 'block';
  
  // 显示用户资料
  userAvatar.src = user.photoURL || 'default-avatar.png';
  userName.textContent = user.displayName || '用户';
  userEmail.textContent = user.email || '';

  // 如果有扩展ID，尝试与扩展通信
  if (extensionId) {
    statusMessage.textContent = '已连接到扩展';
  } else {
    statusMessage.textContent = '未找到扩展ID，请手动打开扩展';
  }
}

// 显示登录表单
function showLoginForm() {
  userInfo.style.display = 'none';
  loginForm.style.display = 'block';
} 