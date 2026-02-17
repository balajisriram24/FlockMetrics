## GitHub Copilot Chat

- Extension: 0.37.1 (prod)
- VS Code: 1.109.0 (bdd88df003631aaa0bcbe057cb0a940b80a476fa)
- OS: win32 10.0.26200 x64
- GitHub Account: Signed Out

## Network

User Settings:
```json
  "http.systemCertificatesNode": true,
  "github.copilot.advanced.debug.useElectronFetcher": true,
  "github.copilot.advanced.debug.useNodeFetcher": false,
  "github.copilot.advanced.debug.useNodeFetchFetcher": true
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 20.207.73.85 (329 ms)
- DNS ipv6 Lookup: Error (11 ms): getaddrinfo ENOTFOUND api.github.com
- Proxy URL: None (6 ms)
- Electron fetch (configured): timed out after 10 seconds
- Node.js https: HTTP 200 (4702 ms)
- Node.js fetch: HTTP 200 (4853 ms)

Connecting to https://api.githubcopilot.com/_ping:
- DNS ipv4 Lookup: timed out after 10 seconds
- DNS ipv6 Lookup: Error (1718 ms): getaddrinfo ENOTFOUND api.githubcopilot.com
- Proxy URL: None (9 ms)
- Electron fetch (configured): timed out after 10 seconds
- Node.js https: timed out after 10 seconds
- Node.js fetch: Error (576 ms): TypeError: fetch failed
	at node:internal/deps/undici/undici:14900:13
	at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
	at async n._fetch (c:\Users\Balaji Sriram\.vscode\extensions\github.copilot-chat-0.37.1\dist\extension.js:4753:26157)
	at async n.fetch (c:\Users\Balaji Sriram\.vscode\extensions\github.copilot-chat-0.37.1\dist\extension.js:4753:25805)
	at async d (c:\Users\Balaji Sriram\.vscode\extensions\github.copilot-chat-0.37.1\dist\extension.js:4785:190)
	at async vA.h (file:///c:/Users/Balaji%20Sriram/AppData/Local/Programs/Microsoft%20VS%20Code/bdd88df003/resources/app/out/vs/workbench/api/node/extensionHostProcess.js:116:41743)
  Error: getaddrinfo ENOTFOUND api.githubcopilot.com
  	at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26)
  	at GetAddrInfoReqWrap.callbackTrampoline (node:internal/async_hooks:130:17)

Connecting to https://copilot-proxy.githubusercontent.com/_ping:
- DNS ipv4 Lookup: 4.225.11.192 (497 ms)
- DNS ipv6 Lookup: Error (339 ms): getaddrinfo ENOTFOUND copilot-proxy.githubusercontent.com
- Proxy URL: None (15 ms)
- Electron fetch (configured): timed out after 10 seconds
- Node.js https: HTTP 200 (6392 ms)
- Node.js fetch: timed out after 10 seconds

Connecting to https://mobile.events.data.microsoft.com: timed out after 10 seconds
Connecting to https://dc.services.visualstudio.com: timed out after 10 seconds
Connecting to https://copilot-telemetry.githubusercontent.com/_ping: timed out after 10 seconds
Connecting to https://copilot-telemetry.githubusercontent.com/_ping: HTTP 200 (5946 ms)
Connecting to https://default.exp-tas.com: timed out after 10 seconds

Number of system certificates: 77

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).