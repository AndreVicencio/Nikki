create table
  public.notion_blocks (
    supabase_id uuid not null default gen_random_uuid (),
    notion_id uuid null,
    notion_object text null,
    notion_parent_id uuid null,
    notion_parent_type text null,
    notion_created_time timestamp with time zone null,
    notion_last_edited_time timestamp with time zone null,
    notion_created_by uuid null,
    notion_created_by_object text null,
    notion_last_edited_by uuid null,
    notion_last_edited_by_object text null,
    notion_has_children boolean null,
    notion_archived boolean null default false,
    notion_in_trash boolean null default false,
    notion_type text null,
    notion_plain_text text null,
    notion_type_object jsonb null,
    constraint blocks_pkey primary key (supabase_id)
  ) tablespace pg_default;