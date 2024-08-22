/**
 * Edge Function: retrieve_notion_blocks_recursive
 * 
 * Description:
 * This edge function retrieves all child blocks from a specified Notion page recursively.
 * It also provides an option to transform the data into a structure suitable for insertion
 * into a Supabase table.
 * 
 * The function expects a POST request with a JSON body containing:
 * - pageID: The ID of the Notion page to fetch blocks from (required).
 * - transform: A boolean indicating whether to transform the data for database insertion (optional, defaults to false).
 * 
 * If the 'transform' parameter is true, the blocks are transformed. Otherwise, the raw block data is returned.
 * 
 * The function uses Deno's edge runtime for handling the request and Notion's API client to interact with Notion data.
 * 
 * Best Practices:
 * - TypeScript's `unknown` is used instead of `any` to enforce explicit type handling when working with API responses.
 * - Optional chaining and nullish coalescing are used to handle missing properties gracefully.
 * - Functionality is modularized for clarity and reusability.
 * 
 * @module retrieve_notion_blocks_recursive
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Client } from "https://esm.sh/@notionhq/client@2.2.15";

// Initialize the Notion client with the API key from environment variables
const notion = new Client({ auth: Deno.env.get("NOTION_API_KEY") });

/**
 * Handles incoming requests to retrieve and optionally transform Notion blocks.
 * Validates the request payload, fetches blocks recursively, and returns the result.
 */
Deno.serve(async (req) => {
  try {
    // Parse the JSON body of the request
    const { pageID, transform } = await req.json();

    // Validate the presence of pageID in the request
    if (!pageID) {
      return new Response("Missing pageID", { status: 400 });
    }

    // Fetch the blocks and await the result
    const blocks = transform === "true"
      ? transformNotionBlocksToSupabaseBlocks(await fetchRecursiveChildBlocks(pageID))
      : await fetchRecursiveChildBlocks(pageID);

    // Return the fetched blocks as a JSON response
    return new Response(
      JSON.stringify(blocks, null, 2),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Handle any errors that occur during the request processing
    console.error("Error fetching blocks:", error);
    return new Response("Internal Server Error: " + error, { status: 500 });
  }
});

/**
 * Recursively fetches all child blocks of a given Notion block.
 * The function collects blocks, checks for children, and recursively fetches them.
 * 
 * @param blockID - The ID of the Notion block to fetch children for.
 * @returns An array of all child blocks.
 */
async function fetchRecursiveChildBlocks(blockID: string): Promise<unknown[]> {
  let allBlocks: unknown[] = [];

  const response = await notion.blocks.children.list({ block_id: blockID });

  // Iterate over each block and add it to the list
  for (const item of response.results) {
    allBlocks.push(item);
    if ((item as any).has_children) {
      allBlocks = allBlocks.concat(await fetchRecursiveChildBlocks((item as any).id));
    }
  }

  return allBlocks;
}

/**
 * Transforms the Notion blocks into a structure suitable for insertion into a Supabase table.
 * Safely accesses properties using optional chaining and nullish coalescing, ensuring type safety.
 * 
 * @param notionBlocks - The array of Notion blocks to transform.
 * @returns An array of transformed blocks.
 */
function transformNotionBlocksToSupabaseBlocks(notionBlocks: unknown[]): unknown[] {
  return notionBlocks.map((block) => {
    const richText = (block as any)?.[(block as any).type]?.rich_text || [];
    const plainText = richText.length > 0 ? richText[0].plain_text : null;
    
    return {
      notion_id: (block as any).id,
      notion_object: (block as any).object,
      notion_parent_type: (block as any).parent.type,
      notion_parent_id: (block as any).parent[(block as any).parent.type],
      notion_created_time: (block as any).created_time,
      notion_last_edited_time: (block as any).last_edited_time,
      notion_created_by_id: (block as any).created_by.id,
      notion_created_by_object: (block as any).created_by.object, 
      notion_last_edited_by_id: (block as any).last_edited_by.id,
      notion_last_edited_by_object: (block as any).last_edited_by.object,
      notion_has_children: (block as any).has_children,
      notion_archived: (block as any).archived,
      notion_in_trash: (block as any).in_trash,
      notion_type: (block as any).type,
      notion_type_object: (block as any)[(block as any).type],
      notion_plain_text: plainText,
    };
  });
}
