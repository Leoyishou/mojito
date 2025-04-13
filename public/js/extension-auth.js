// Firebase配置
const firebaseConfig = {
  apiKey: "AIzaSyBDtbIQ5NT1dhUfRFnauQuH8AbxInmCKjY",
  authDomain: "mojito-4369e.firebaseapp.com",
  projectId: "mojito-4369e",
  storageBucket: "mojito-4369e.appspot.com",
  messagingSenderId: "931450115321",
  appId: "1:931450115321:web:2e4e0ec6bff5fc8ce43e28",
  measurementId: "G-EHL5MNFE3M"
};

// 初始化Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM元素
const loginForm = document.getElementById('loginForm');
const userInfo = document.getElementById('userInfo');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const manualReturnBtn = document.getElementById('manualReturnBtn');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const statusMessage = document.getElementById('statusMessage');
const spinner = document.getElementById('spinner');

// 获取URL参数
const urlParams = new URLSearchParams(window.location.search);
const extensionId = urlParams.get('extensionId');
const redirectParam = urlParams.get('redirect');

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
  // 检查是否有扩展ID
  if (!extensionId) {
    statusMessage.textContent = '无法找到扩展ID，请重新从扩展启动此页面';
    showManualReturn();
  }
});

// Google登录事件
googleLoginBtn.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  auth.signInWithPopup(provider)
    .catch(error => {
      console.error('登录错误:', error);
      statusMessage.textContent = '登录失败: ' + error.message;
      showManualReturn();
    });
});

// 登出事件
logoutBtn.addEventListener('click', () => {
  auth.signOut()
    .catch(error => {
      console.error('登出错误:', error);
    });
});

// 手动返回按钮事件
manualReturnBtn.addEventListener('click', () => {
  if (extensionId) {
    const redirectPath = redirectParam ? redirectParam + '.html' : 'popup.html';
    window.open(`chrome-extension://${extensionId}/${redirectPath}`, '_blank');
  } else {
    alert('无法找到扩展ID，请手动打开扩展');
  }
});

// 认证状态监听
auth.onAuthStateChanged(user => {
  if (user) {
    // 用户已登录
    showUserInfo(user);
    
    // 尝试与扩展通信
    if (extensionId) {
      communicateWithExtension(user);
    } else {
      statusMessage.textContent = '未找到扩展ID，无法自动返回';
      showManualReturn();
    }
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
}

// 显示登录表单
function showLoginForm() {
  userInfo.style.display = 'none';
  loginForm.style.display = 'block';
  spinner.style.display = 'none';
}

// 显示手动返回按钮
function showManualReturn() {
  spinner.style.display = 'none';
  manualReturnBtn.style.display = 'block';
}

// 与扩展通信
function communicateWithExtension(user) {
  statusMessage.textContent = '正在与扩展通信...';
  spinner.style.display = 'block';
  
  try {
    // 准备用户数据
    const userData = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    };
    
    // 获取ID令牌
    user.getIdToken()
      .then(token => {
        // 发送消息到扩展
        chrome.runtime.sendMessage(
          extensionId,
          {
            type: 'MOJITO_AUTH_SUCCESS',
            user: userData,
            token: token
          },
          response => {
            if (chrome.runtime.lastError) {
              // 处理错误
              console.error('扩展通信错误:', chrome.runtime.lastError);
              statusMessage.textContent = '与扩展通信失败，请手动返回扩展';
              showManualReturn();
              return;
            }
            
            if (response && response.success) {
              // 成功通信
              statusMessage.textContent = '认证成功！正在返回扩展...';
              spinner.style.display = 'none';
              
              // 自动返回扩展
              setTimeout(() => {
                const redirectPath = redirectParam ? redirectParam + '.html' : 'popup.html';
                window.location.href = `chrome-extension://${extensionId}/${redirectPath}`;
              }, 1500);
            } else {
              // 未收到成功响应
              statusMessage.textContent = '扩展响应无效，请手动返回';
              showManualReturn();
            }
          }
        );
      })
      .catch(error => {
        console.error('获取令牌错误:', error);
        statusMessage.textContent = '获取认证令牌失败，请手动返回扩展';
        showManualReturn();
      });
  } catch (error) {
    console.error('通信错误:', error);
    statusMessage.textContent = '与扩展通信出错，请手动返回扩展';
    showManualReturn();
  }
} 