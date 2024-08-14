import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Client } from "https://esm.sh/@notionhq/client@2.2.15";

const notion = new Client({ auth: Deno.env.get("NOTION_API_KEY") });

Deno.serve(async (req) => {
  try {
    const { pageID } = await req.json();

    if (!pageID) {
      return new Response("Missing pageID", { status: 400 });
    }

    // Fetch the first page of block children
    let allBlocks: unknown[] = [];
    let cursor = undefined;
    do {
      const response = await notion.blocks.children.list({
        block_id: pageID,
        start_cursor: cursor,
      });
      
      allBlocks = allBlocks.concat(response.results);
      cursor = response.next_cursor;
    } while (cursor);

    return new Response(
      JSON.stringify(allBlocks, null, 2),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching blocks:", error);
    return new Response("Internal Server Error: " + error, { status: 500 });
  }
});
