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
exports.QuotaStatusBar = void 0;
const vscode = __importStar(require("vscode"));
const ENGINE_CONFIG = {
    flash: { label: 'Flash', priority: 102 },
    pro: { label: 'High', priority: 101 },
    claude: { label: 'Claude', priority: 100 },
};
function quotaDot(pct) {
    if (pct <= 20) {
        return '🔴';
    }
    if (pct <= 40) {
        return '🟡';
    }
    return '🟢';
}
function formatReset(seconds) {
    if (seconds === null || seconds <= 0) {
        return '';
    }
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) {
        return ` — resets in ${h}h ${m}m`;
    }
    return ` — resets in ${m}m`;
}
class QuotaStatusBar {
    constructor(command) {
        this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.item.command = command;
        this.item.show();
        this.setLoading();
    }
    update(result) {
        if (!result) {
            this.item.text = `Flash ⚫ High ⚫ Claude ⚫`;
            this.item.tooltip = `AG Quota — Antigravity offline\nClick to retry`;
            this.item.color = new vscode.ThemeColor('statusBarItem.warningForeground');
            return;
        }

        const parts = [];
        const tooltips = [];
        let lowestPercent = 100;

        for (const engine of ['flash', 'pro', 'claude']) {
            const cfg = ENGINE_CONFIG[engine];
            const quota = result[engine];
            
            if (!quota) {
                parts.push(`${cfg.label} —`);
                tooltips.push(`${cfg.label}: no quota data`);
            } else {
                const dot = quotaDot(quota.remainingPercent);
                parts.push(`${cfg.label} ${dot} ${quota.remainingPercent}%`);
                
                tooltips.push(
                    `${cfg.label} (${quota.modelId})\nRemaining: ${quota.remainingPercent}%` + 
                    formatReset(quota.resetInSeconds)
                );

                if (quota.remainingPercent < lowestPercent) {
                    lowestPercent = quota.remainingPercent;
                }
            }
        }

        this.item.text = parts.join('   ');
        this.item.tooltip = tooltips.join('\n\n') + '\n\nClick to refresh';

        if (lowestPercent <= 20) {
            this.item.color = new vscode.ThemeColor('statusBarItem.errorForeground');
        } else if (lowestPercent <= 40) {
            this.item.color = new vscode.ThemeColor('statusBarItem.warningForeground');
        } else {
            this.item.color = undefined;
        }
    }
    setLoading() {
        this.item.text = `Flash ⏳   High ⏳   Claude ⏳`;
        this.item.tooltip = 'AG Quota — loading…';
        this.item.color = undefined;
    }
    dispose() {
        this.item.dispose();
    }
}
exports.QuotaStatusBar = QuotaStatusBar;
//# sourceMappingURL=statusBar.js.map