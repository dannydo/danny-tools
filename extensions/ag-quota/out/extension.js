"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const quotaFetcher_1 = require("./quotaFetcher");
const statusBar_1 = require("./statusBar");
let statusBar;
let timer;
async function activate(context) {
    statusBar = new statusBar_1.QuotaStatusBar('agQuota.refresh');
    // Command: manual refresh
    const refreshCmd = vscode.commands.registerCommand('agQuota.refresh', async () => {
        await poll();
    });
    context.subscriptions.push(refreshCmd);
    // React to config changes (e.g. user changes refreshInterval)
    const configWatcher = vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('agQuota')) {
            restartTimer();
        }
    });
    context.subscriptions.push(configWatcher);
    // Initial fetch
    await poll();
    // Start polling timer
    restartTimer();
    // Make sure we clean up on deactivate
    context.subscriptions.push({ dispose: () => stopTimer() });
}
function deactivate() {
    stopTimer();
    statusBar?.dispose();
}
// ---------------------------------------------------------------------------
async function poll() {
    if (!statusBar) {
        return;
    }
    statusBar.setLoading();
    const cfg = vscode.workspace.getConfiguration('agQuota');
    const port = cfg.get('port') ?? 42424;
    let result = null;
    try {
        result = await (0, quotaFetcher_1.fetchQuota)(port);
    }
    catch {
        result = null;
    }
    statusBar.update(result);
}
function restartTimer() {
    stopTimer();
    const cfg = vscode.workspace.getConfiguration('agQuota');
    const intervalSec = cfg.get('refreshInterval') ?? 120;
    timer = setInterval(() => { void poll(); }, intervalSec * 1000);
}
function stopTimer() {
    if (timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
    }
}
//# sourceMappingURL=extension.js.map