// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: Replace with your Firebase project configuration
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project
// 3. Add a web app
// 4. Copy the config object below
const firebaseConfig = {
    apiKey: "AIzaSyD8_kq0MxucV0p2L0V_BzJ2Wvr33OroHVk",
    authDomain: "chatroom-67d01.firebaseapp.com",
    projectId: "chatroom-67d01",
    storageBucket: "chatroom-67d01.firebasestorage.app",
    messagingSenderId: "583819145392",
    appId: "1:583819145392:web:ee4ff7c12757b84ca24b75",
    measurementId: "G-Q0EHV4EQXP"
};

// Initialize Firebase
let app, auth, db;
let isConfigured = false;

try {
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        isConfigured = true;
    } else {
        console.warn("Firebase not configured. Chat will be in demo mode.");
    }
} catch (e) {
    console.error("Error initializing Firebase:", e);
}

// DOM Elements
const loginBtn = document.getElementById('google-login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginOverlay = document.getElementById('login-overlay');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');
const userInfo = document.getElementById('user-info');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');

// Auth State
let currentUser = null;

// Login
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        if (!isConfigured) {
            alert("Please configure Firebase in chat.js to enable Google Login!");
            // Demo Login
            handleLogin({
                displayName: "Demo User",
                photoURL: "https://ui-avatars.com/api/?name=Demo+User&background=random",
                uid: "demo-123"
            });
            return;
        }

        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in:", error);
            alert("Failed to sign in: " + error.message);
        }
    });
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (!isConfigured) {
            handleLogout();
            return;
        }
        signOut(auth);
    });
}

// Auth State Observer
if (isConfigured) {
    // Load messages immediately for everyone (read-only for guests)
    loadMessages();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            handleLogin(user);
        } else {
            handleLogout();
        }
    });
}

function handleLogin(user) {
    currentUser = user;
    loginOverlay.classList.add('hidden');
    chatForm.classList.remove('hidden');
    userInfo.classList.remove('hidden');
    userAvatar.src = user.photoURL;
    userName.textContent = user.displayName.split(' ')[0]; // First name only

    // Refresh messages to update "sent" status (blue bubbles)
    loadMessages();
}

function handleLogout() {
    currentUser = null;
    loginOverlay.classList.remove('hidden');
    chatForm.classList.add('hidden');
    userInfo.classList.add('hidden');
    // Do NOT clear messages, let guests see them
}

// Send Message
if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = messageInput.value.trim();

        if (!text || !currentUser) return;

        if (!isConfigured) {
            // Demo Message
            appendMessage({
                text: text,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                uid: currentUser.uid,
                createdAt: new Date()
            });
            messageInput.value = '';

            // Fake reply
            setTimeout(() => {
                appendMessage({
                    text: "This is a demo reply! Configure Firebase to chat with others.",
                    displayName: "System",
                    photoURL: "https://ui-avatars.com/api/?name=System&background=000&color=fff",
                    uid: "system",
                    createdAt: new Date()
                });
            }, 1000);
            return;
        }

        try {
            await addDoc(collection(db, 'messages'), {
                text: text,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                uid: currentUser.uid,
                createdAt: serverTimestamp()
            });
            messageInput.value = '';
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });
}

// Load Messages
function loadMessages() {
    if (!isConfigured) return;

    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(50));

    onSnapshot(q, (snapshot) => {
        chatMessages.innerHTML = '';
        const messages = [];
        snapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() });
        });

        messages.reverse().forEach(msg => {
            appendMessage(msg);
        });

        scrollToBottom();
    });
}

function appendMessage(msg) {
    const div = document.createElement('div');
    const isOwn = msg.uid === currentUser?.uid;

    div.className = `chat-message ${isOwn ? 'message-sent' : 'message-received'}`;

    // Check if system message
    if (msg.uid === 'system') {
        div.className = 'chat-message system-message';
    }

    const time = msg.createdAt ? new Date(msg.createdAt.seconds * 1000 || msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    div.innerHTML = `
        ${!isOwn && msg.uid !== 'system' ? `<span class="message-author">${msg.displayName}</span>` : ''}
        <p>${escapeHtml(msg.text)}</p>
        <span style="font-size: 0.8rem; opacity: 0.7; float: right; margin-top: 5px;">${time}</span>
    `;

    chatMessages.appendChild(div);
    scrollToBottom();
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
