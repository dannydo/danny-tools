"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchQuota = fetchQuota;
const cp = require("child_process");

const FLASH_KEYWORDS = ['flash'];
const PRO_KEYWORDS = ['pro', 'ultra'];
const CLAUDE_KEYWORDS = ['claude', 'anthropic', 'sonnet', 'haiku', 'opus'];

function classifyModel(modelId) {
    const id = modelId.toLowerCase();
    if (CLAUDE_KEYWORDS.some(k => id.includes(k))) return 'claude';
    if (FLASH_KEYWORDS.some(k => id.includes(k))) return 'flash';
    if (PRO_KEYWORDS.some(k => id.includes(k))) return 'pro';
    return null;
}

const pyScript = `
import urllib.request
import json
import subprocess
import re
import socket
import sys

def get_args():
    try:
        ps = subprocess.check_output(['ps', 'aux']).decode('utf-8')
        for line in ps.split('\\n'):
            if ('language_server_linux' in line or 'language_server_darwin' in line or 'language_server_windows' in line or 'language_server' in line) and '--csrf_token' in line:
                m = re.search(r'--csrf_token\\s+([\\w-]+)', line)
                if m: return m.group(1)
    except:
        pass
    return None

def get_ports():
    ports = []
    
    if sys.platform == 'darwin':
        try:
            lsof = subprocess.check_output(['lsof', '-iTCP', '-sTCP:LISTEN', '-P', '-n']).decode('utf-8')
            for line in lsof.split('\\n'):
                if 'language_' in line or '1508' in line:
                    m = re.search(r':(\\d+)\\s+\\(LISTEN\\)', line)
                    if m: ports.append(int(m.group(1)))
            if ports: return ports
        except:
            pass
            
    try:
        ss = subprocess.check_output(['ss', '-tlpn']).decode('utf-8')
        for line in ss.split('\\n'):
            if 'language_' in line or '1508' in line:
                m = re.search(r':(\\d+)', line)
                if m: ports.append(int(m.group(1)))
        if ports: return ports
    except:
        pass
        
    try:
        ns = subprocess.check_output(['netstat', '-nltp']).decode('utf-8')
        for line in ns.split('\\n'):
            if 'language_' in line or '1508' in line:
                m = re.search(r':(\\d+)', line)
                if m: ports.append(int(m.group(1)))
    except:
        pass
        
    return ports

token = get_args()
ports = get_ports()
if not token or not ports:
    print(json.dumps([]))
    exit(0)

found_data = False
for port in ports:
    req = urllib.request.Request(
        f'http://127.0.0.1:{port}/exa.language_server_pb.LanguageServerService/GetUserStatus',
        data=b'{}',
        headers={
            'Content-Type': 'application/json',
            'Connect-Protocol-Version': '1',
            'x-codeium-csrf-token': token
        },
        method='POST'
    )
    try:
        with urllib.request.urlopen(req, timeout=1) as response:
            body = response.read().decode('utf-8')
            print(body)
            found_data = True
            break
    except Exception:
        continue

if not found_data:
    print(json.dumps([]))
`;

async function fetchQuota(port_ignored, timeoutMs = 5000) {
    let raw;
    try {
        raw = cp.execSync(`python3 -c "${pyScript}"`, { timeout: timeoutMs }).toString();
    } catch {
        return null;
    }

    if (!raw) return null;

    let payload;
    try {
        payload = JSON.parse(raw);
    } catch {
        return null;
    }

    let models = [];
    if (payload?.userStatus?.cascadeModelConfigData?.clientModelConfigs) {
        models = payload.userStatus.cascadeModelConfigData.clientModelConfigs;
    }

    const result = { flash: null, pro: null, claude: null };
    const now = Date.now();

    for (const m of models) {
        if (typeof m !== 'object' || m === null) continue;
        
        const modelId = String(m.label || m.modelOrAlias?.model || '');
        if (!modelId) continue;
        
        const bucket = classifyModel(modelId);
        if (!bucket) continue;

        let remainingPercent = 100;
        if (m.quotaInfo && typeof m.quotaInfo.remainingFraction === 'number') {
            remainingPercent = Math.round(m.quotaInfo.remainingFraction * 100);
        }

        let resetInSeconds = null;
        if (m.quotaInfo && m.quotaInfo.resetTime) {
            const time = new Date(m.quotaInfo.resetTime).getTime();
            if (!isNaN(time) && time > now) {
                resetInSeconds = Math.round((time - now) / 1000);
            } else {
                resetInSeconds = 0;
            }
        }

        const quota = { modelId, remainingPercent, resetInSeconds };

        const existing = result[bucket];
        const isHigh = id => id.toLowerCase().includes('high');
        if (!existing ||
            quota.remainingPercent < existing.remainingPercent ||
            (quota.remainingPercent === existing.remainingPercent && isHigh(quota.modelId) && !isHigh(existing.modelId))) {
            result[bucket] = quota;
        }
    }
    return result;
}