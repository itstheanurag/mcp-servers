import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { weather_server } from "./weather/server";
import { maths_server } from "./math/server";

async function main() {
  const transport = new StdioServerTransport();

  await weather_server.connect(transport);
  maths_server.connect(transport);

  console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
