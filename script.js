const tg = window.Telegram.WebApp;
const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const input = document.getElementById("user_input").value;
    
    // Безопасные данные от Telegram
    const initData = tg.initData;

    await fetch("https://your-ktor-server.com/webapp-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, initData })
    });

    tg.close();
});

// Опционально: открывает mini-app на весь экран
tg.expand();

