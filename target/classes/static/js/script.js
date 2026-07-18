// ==========================
// AI SQL GENERATOR
// ==========================

const API_BASE = "/api";

// Elements
const userInput = document.getElementById("userInput");
const sqlOutput = document.getElementById("sqlOutput");
const message = document.getElementById("message");

const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");

const historyList = document.getElementById("historyList");
const themeToggle = document.getElementById("themeToggle");

const authActions = document.getElementById("authActions");
const userActions = document.getElementById("userActions");
const userNameLabel = document.getElementById("userNameLabel");

let generatedSQL = "";

// ==========================
// AUTH STATE
// ==========================

let currentUser = localStorage.getItem("currentUser");

// ==========================
// INIT
// ==========================

window.addEventListener("load", () => {
    loadTheme();
    loadHistory();
    updateUI();
});

// ==========================
// UI LOCK SYSTEM
// ==========================

function updateUI(){

    if(currentUser){
        authActions.style.display = "none";
        userActions.style.display = "flex";

        const stored = localStorage.getItem(currentUser);
        const name = stored ? JSON.parse(stored).name : currentUser;
        userNameLabel.textContent = name || currentUser;
    } else {
        authActions.style.display = "flex";
        userActions.style.display = "none";
    }
}

// ==========================
// AUTH MODALS
// ==========================

function openLogin(){
    document.getElementById("loginModal").classList.add("open");
}

function closeLogin(){
    document.getElementById("loginModal").classList.remove("open");
}

function openRegister(){
    closeLogin();
    document.getElementById("registerModal").classList.add("open");
}

function closeRegister(){
    document.getElementById("registerModal").classList.remove("open");
}

// ==========================
// REGISTER
// ==========================

function register(){

    const user = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPass").value;
    const confirm = document.getElementById("regConfirm").value;

    if(!user || !email || !pass || !confirm){
        alert("All fields required");
        return;
    }

    if(pass !== confirm){
        alert("Passwords do not match");
        return;
    }

    if(localStorage.getItem(email)){
        alert("User already exists");
        return;
    }

    localStorage.setItem(email, JSON.stringify({
        name: user,
        password: pass
    }));

    alert("Registered Successfully");
    closeRegister();
    openLogin();
}

// ==========================
// LOGIN
// ==========================

function login(){

    const email = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value;

    const data = localStorage.getItem(email);

    if(!data){
        alert("User not found");
        return;
    }

    const user = JSON.parse(data);

    if(user.password === pass){

        currentUser = email;
        localStorage.setItem("currentUser", email);

        closeLogin();
        updateUI();

    } else {
        alert("Invalid Credentials");
    }
}

// ==========================
// LOGOUT
// ==========================

function logout(){
    localStorage.removeItem("currentUser");
    currentUser = null;
    updateUI();
}

// ==========================
// GENERATE SQL (PROTECTED)
// ==========================

generateBtn.addEventListener("click", async () => {

    if(!currentUser){
        showMessage("Login required to generate SQL", "red");
        openLogin();
        return;
    }

    const text = userInput.value.trim();

    if(!text){
        showMessage("Enter query first", "red");
        return;
    }

    generateBtn.disabled = true;
    generateBtn.innerText = "Generating...";

    try {

        const res = await fetch(`${API_BASE}/sql/generate`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ userInput: text })
        });

        const data = await res.json();

        if(!res.ok){
            throw new Error(data.message || "Error generating SQL");
        }

        generatedSQL = data.generatedSql;
        sqlOutput.value = generatedSQL;

        showMessage("SQL Generated Successfully", "green");
        loadHistory();

    } catch(err){
        showMessage(err.message, "red");
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate SQL';
    }
});

// ==========================
// CLEAR
// ==========================

clearBtn.onclick = () => {
    userInput.value = "";
    sqlOutput.value = "";
    generatedSQL = "";
    showMessage("", "");
};

// ==========================
// COPY
// ==========================

copyBtn.onclick = async () => {
    if(!generatedSQL){
        showMessage("Nothing to copy", "red");
        return;
    }

    await navigator.clipboard.writeText(generatedSQL);
    showMessage("Copied Successfully", "green");
};

// ==========================
// DOWNLOAD
// ==========================

downloadBtn.onclick = () => {

    if(!generatedSQL){
        showMessage("Nothing to download", "red");
        return;
    }

    const blob = new Blob([generatedSQL], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "query.sql";
    a.click();

    URL.revokeObjectURL(url);
};

// ==========================
// HISTORY
// ==========================

async function loadHistory(){

    try {
        const res = await fetch(`${API_BASE}/history`);
        const data = await res.json();

        historyList.innerHTML = "";

        if(!data.length){
            historyList.innerHTML = '<p class="history-empty">No history yet</p>';
            return;
        }

        data.forEach(item => {
            const div = document.createElement("div");
            div.className = "history-item";
            div.innerHTML = `
                <div class="history-input">${escapeHtml(item.userInput)}</div>
                <div class="history-sql">${escapeHtml(item.generatedSql)}</div>
            `;
            historyList.appendChild(div);
        });

    } catch {
        historyList.innerHTML = '<p class="history-empty">Error loading history</p>';
    }
}

function escapeHtml(str){
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
}

// ==========================
// THEME
// ==========================

themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
});

function loadTheme(){
    if(localStorage.getItem("theme") === "dark"){
        document.body.classList.add("dark");
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
}

// ==========================
// MESSAGE
// ==========================

function showMessage(text, color){
    message.innerText = text;
    message.style.color = color === "red" ? "var(--danger)"
        : color === "green" ? "var(--success)"
        : "var(--text-muted)";
}
