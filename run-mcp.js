const { spawn } = require('child_process');

const child = spawn('npx', ['tsx', 'src/mcp/mcp-server.ts'], {
  stdio: 'inherit',
  shell: true
});

child.on('error', (err) => {
  console.error('Failed to start MCP server:', err);
});