import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import z, { parse } from "zod";

const additionSchema = z.object({
  nums: z.array(z.number()).min(2),
});

const subtractionSchema = z.object({
  num1: z.number(),
  num2: z.number(),
});

const divisionSchema = z.object({
  num1: z.number(),
  num2: z.number(),
});

export function bindToolsToServer(server: McpServer) {
  server.registerTool(
    "addition",
    {
      title: "addition tool",
      description:
        "Gives up the sum of all the given numbers, can take upto n numbers",
      inputSchema: additionSchema,
    },
    async (args): Promise<CallToolResult> => {
      const parsed = additionSchema.parse(args);

      const sum = parsed.nums.reduce((acc, curr) => acc + curr, 0);

      return {
        content: [
          {
            type: "text",
            text: `Sum: ${sum}`,
          },
        ],
      };
    },
  );

  server.registerTool(
    "subtraction",
    {
      title: "subtraction tool",
      description: "Subtracts 2 numberss",
      inputSchema: subtractionSchema,
    },
    async (args): Promise<CallToolResult> => {
      const parsed = subtractionSchema.parse(args);
      return {
        content: [
          {
            type: "text",
            text: `Ans: ${parsed.num1 - parsed.num2}`,
          },
        ],
      };
    },
  );

  server.registerTool(
    "multiplication",
    {
      title: "multiplication tool",
      description: "multiplies n numberss",
      inputSchema: additionSchema,
    },
    async (args): Promise<CallToolResult> => {
      const parsed = additionSchema.parse(args);

      const ans = parsed.nums.reduce((acc, curr) => acc * curr, 1);
      return {
        content: [
          {
            type: "text",
            text: `Multiply: ${ans}`,
          },
        ],
      };
    },
  );
  server.registerTool(
    "division",
    {
      title: "division tool",
      description: "Divides two numbers (num1 / num2)",
      inputSchema: divisionSchema,
    },
    async (args): Promise<CallToolResult> => {
      const parsed = divisionSchema.parse(args);

      if (parsed.num2 === 0) {
        return {
          content: [
            {
              type: "text",
              text: "Error: Division by zero is undefined.",
            },
          ],
          isError: true,
        };
      }

      const result = parsed.num1 / parsed.num2;

      return {
        content: [
          {
            type: "text",
            text: `Ans: ${result}`,
          },
        ],
      };
    },
  );
}
