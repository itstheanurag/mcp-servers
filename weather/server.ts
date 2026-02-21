import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type ServerCapabilities } from "@modelcontextprotocol/sdk/types.js";
import { bindServerTools } from "./tool";

const weather_server = new McpServer(
  {
    name: "weather_app",
    version: "1.0.0",
    description: "A server which deals with the weather related stuff",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

bindServerTools(weather_server);
