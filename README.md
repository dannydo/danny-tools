# danny-tools

A collection of productivity tools for the [Antigravity IDE](https://antigravity.ai) (VS Code-based).

**Author:** Danny Do

---

## Extensions

| Extension | Description | Version |
|-----------|-------------|---------|
| [ag-quota](./extensions/ag-quota) | Shows live AI model quota (Flash, Pro, Claude) in the status bar | 0.1.0 |

---

## ag-quota

Displays your real-time Antigravity AI quota for Flash, Pro, and Claude models directly in your IDE status bar — no browser needed.

### What it looks like

```
Flash 🟢 100%   Pro 🟢 100%   Claude 🟢 100%
```

Color indicators:
- 🟢 **Green** — above 40% remaining
- 🟡 **Yellow** — between 20–40% remaining
- 🔴 **Red** — below 20% remaining

Hover over the status bar item for a breakdown of each model's reset time.

---

## Installation (Antigravity IDE)

### Option A: Install from VSIX (Recommended)

1. Download the latest `.vsix` from the [Releases](../../releases) page
2. Open your IDE and press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
3. Run **"Extensions: Install from VSIX..."**
4. Select the downloaded `.vsix` file
5. Reload the window when prompted

### Option B: Manual install on a Remote Server

If you are connecting to a remote Linux server via SSH (e.g. OrbStack), copy the extension folder directly:

```bash
# From your server
cp -r extensions/ag-quota ~/.antigravity-server/extensions/danny.ag-quota-0.1.0
```

Then reload your IDE window.

---

## How it works

`ag-quota` connects to the Antigravity language server running locally on your machine. It dynamically:
1. Locates the running language server process (`ps aux`)
2. Extracts its session token
3. Makes a secure local HTTP request for your quota data
4. Refreshes every 2 minutes (configurable)

Works on both **macOS** and **Linux**.

---

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `agQuota.refreshInterval` | `120` | How often (in seconds) to poll for updates |

---

## Contributing

Pull requests welcome! To add a new tool, create a new folder under `extensions/` following the same structure as `ag-quota`.

---

## License

MIT © Danny Do
