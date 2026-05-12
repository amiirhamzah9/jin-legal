"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createPost, updatePost, type BlogFormState } from "@/app/admin/blog/actions";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/insights/markdown-content";
import type { Database } from "@/lib/supabase/types";

type Post = Database["public"]["Tables"]["blog_posts"]["Row"];

const INITIAL: BlogFormState = { status: "idle" };

const FIELD_BASE =
  "w-full bg-white border border-ivory-dark px-4 py-3 font-sans text-[13px] text-ink focus:border-gold focus:outline-none transition-colors";

function SaveButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();
  return (
    <Button variant="gold" type="submit" disabled={pending} className="px-9 py-3.5">
      {pending ? "Saving…" : mode === "create" ? "Create Post" : "Save Changes"}
    </Button>
  );
}

export function BlogForm({
  mode,
  post,
}: {
  mode: "create" | "edit";
  post?: Post;
}) {
  const boundAction =
    mode === "create" ? createPost : updatePost.bind(null, post!.id);
  const [state, formAction] = useFormState<BlogFormState, FormData>(
    boundAction,
    INITIAL
  );

  const [content, setContent] = useState(post?.content ?? "");
  const [showPreview, setShowPreview] = useState(false);

  return (
    <form action={formAction} className="grid grid-cols-[2fr_1fr] gap-8">
      <div className="space-y-5">
        {state.status === "error" && state.message && (
          <div className="bg-red-50 border-l-2 border-red-400 px-5 py-3">
            <p className="font-sans text-[13px] text-red-700">{state.message}</p>
          </div>
        )}
        {state.status === "success" && state.message && (
          <div className="bg-gold/10 border-l-2 border-gold px-5 py-3">
            <p className="font-sans text-[13px] text-forest">{state.message}</p>
          </div>
        )}

        <div>
          <label
            htmlFor="title"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={post?.title}
            className={FIELD_BASE}
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={post?.slug}
            placeholder="auto-generated from title if blank"
            className={FIELD_BASE}
          />
        </div>

        <div>
          <label
            htmlFor="excerpt"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Excerpt
          </label>
          <input
            id="excerpt"
            name="excerpt"
            type="text"
            defaultValue={post?.excerpt ?? ""}
            placeholder="Short summary shown on the listing page"
            className={FIELD_BASE}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="content"
              className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted"
            >
              Content (Markdown) *
            </label>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold hover:underline"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
          </div>
          <textarea
            id="content"
            name="content"
            required
            rows={20}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${FIELD_BASE} font-mono`}
          />
          {showPreview && (
            <div className="mt-5 bg-ivory p-7 border-l-2 border-gold">
              <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-4">
                Live Preview
              </div>
              <MarkdownContent source={content} />
            </div>
          )}
        </div>
      </div>

      <aside className="space-y-5">
        <div>
          <label
            htmlFor="category"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            defaultValue={post?.category ?? ""}
            placeholder="e.g. Corporate Law"
            className={FIELD_BASE}
          />
        </div>

        <div>
          <label
            htmlFor="cover_image_url"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Cover Image URL
          </label>
          <input
            id="cover_image_url"
            name="cover_image_url"
            type="url"
            defaultValue={post?.cover_image_url ?? ""}
            placeholder="https://..."
            className={FIELD_BASE}
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer pt-3 border-t border-ivory-dark">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={post?.is_published}
            className="w-4 h-4 accent-gold"
          />
          <span className="font-sans text-[11px] font-medium tracking-wide text-ink">
            Published
          </span>
        </label>

        <div className="pt-5 border-t border-ivory-dark">
          <SaveButton mode={mode} />
        </div>
      </aside>
    </form>
  );
}
