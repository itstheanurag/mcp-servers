import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { bindServerTools } from "./tool";

export const weather_server = new McpServer({
  name: "weather_app",
  version: "1.0.0",
  description: "A server which deals with the weather related stuff",
});

bindServerTools(weather_server);
