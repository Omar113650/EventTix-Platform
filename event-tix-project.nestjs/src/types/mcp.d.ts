declare module "@modelcontextprotocol/sdk/server/mcp.js" {
  export class McpServer {
    constructor(options: { name: string; version: string });
    registerTool(
      name: string,
      tool: {
        description: string;
        inputSchema: any;
      },
      handler: (input: any) => Promise<any>
    ): void;
    connect(transport: any): void;
  }
}

declare module "@modelcontextprotocol/sdk/server/stdio.js" {
  export class StdioServerTransport {
    constructor();
  }
}