import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getWeatherByCoordinates } from "./api";
import type { ToolArguments } from "./types";

function formatWeatherResponse(
  data: Awaited<ReturnType<typeof getWeatherByCoordinates>>,
): string {
  const lines: string[] = [
    `Weather for ${data.location}, ${data.state}`,
    `Current: ${data.current.temperature}°${data.current.unit} - ${data.current.forecast}`,
    `Wind: ${data.current.wind}`,
    "",
    "Forecast:",
  ];

  for (const day of data.forecast) {
    lines.push(
      `  ${day.day}: ${day.temperature}°${day.unit} - ${day.forecast} (${day.wind})`,
    );
  }

  return lines.join("\n");
}

export async function getCurrentWeatherTool(
  args: ToolArguments,
): Promise<CallToolResult> {
  try {
    const weatherData = await getWeatherByCoordinates(
      args.latitude,
      args.longitude,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: formatWeatherResponse(weatherData),
        },
      ],
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      content: [
        {
          type: "text" as const,
          text: `Error fetching weather: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

// Define input schema using Zod
const WeatherInputSchema = z
  .object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .strict();

export async function bindServerTools(server: McpServer): Promise<void> {
  // Register get_current_weather tool
  server.registerTool(
    "get_current_weather",
    {
      description:
        "Get current weather and forecast for a location using US National Weather Service API. Works best for US locations.",
      inputSchema: WeatherInputSchema,
    },
    async (args): Promise<CallToolResult> => {
      const parsed = WeatherInputSchema.parse(args);
      return getCurrentWeatherTool(parsed);
    },
  );
}
