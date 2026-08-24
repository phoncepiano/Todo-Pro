import { createClient } from "@/lib/supabase/client";

async function requireUserId() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("Not authenticated");

  return user.id;
}

/**
 * @param {Record<string, unknown>} row
 * @returns {import("@/lib/constants").Todo}
 */
export function rowToTodo(row) {
  return {
    id: String(row.id),
    text: String(row.text ?? ""),
    completed: Boolean(row.completed),
    category: row.category ?? "personal",
    tags: Array.isArray(row.tags) ? row.tags : [],
    dueDate: row.due_date ?? null,
    order: Number(row.sort_order ?? 0),
    createdAt: row.created_at ? String(row.created_at) : new Date().toISOString(),
  };
}

/**
 * @param {import("@/lib/constants").Todo} todo
 * @param {string} userId
 */
export function todoToRow(todo, userId) {
  return {
    id: todo.id,
    text: todo.text,
    completed: todo.completed,
    category: todo.category,
    tags: todo.tags,
    due_date: todo.dueDate,
    sort_order: todo.order,
    created_at: todo.createdAt,
    user_id: userId,
  };
}

export async function fetchTodos() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(rowToTodo);
}

/**
 * @param {import("@/lib/constants").Todo} todo
 */
export async function insertTodo(todo) {
  const userId = await requireUserId();
  const supabase = createClient();
  const { error } = await supabase.from("todos").insert(todoToRow(todo, userId));
  if (error) throw error;
}

/**
 * @param {import("@/lib/constants").Todo[]} todos
 */
export async function insertTodos(todos) {
  if (todos.length === 0) return;
  const userId = await requireUserId();
  const supabase = createClient();
  const { error } = await supabase.from("todos").upsert(todos.map((todo) => todoToRow(todo, userId)), {
    ignoreDuplicates: true,
  });
  if (error) throw error;
}

/**
 * @param {string} id
 * @param {Partial<import("@/lib/constants").Todo>} updates
 */
export async function updateTodo(id, updates) {
  const supabase = createClient();
  /** @type {Record<string, unknown>} */
  const row = {};

  if (updates.text !== undefined) row.text = updates.text;
  if (updates.completed !== undefined) row.completed = updates.completed;
  if (updates.category !== undefined) row.category = updates.category;
  if (updates.tags !== undefined) row.tags = updates.tags;
  if (updates.dueDate !== undefined) row.due_date = updates.dueDate;
  if (updates.order !== undefined) row.sort_order = updates.order;

  const { error } = await supabase.from("todos").update(row).eq("id", id);
  if (error) throw error;
}

/**
 * @param {string} id
 */
export async function deleteTodoById(id) {
  const supabase = createClient();
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteCompletedTodos() {
  const supabase = createClient();
  const { error } = await supabase.from("todos").delete().eq("completed", true);
  if (error) throw error;
}

/**
 * @param {import("@/lib/constants").Todo[]} todos
 */
export async function replaceTodos(todos) {
  const userId = await requireUserId();
  const supabase = createClient();
  const { error } = await supabase.from("todos").upsert(todos.map((todo) => todoToRow(todo, userId)));
  if (error) throw error;
}

/**
 * @param {(payload: { eventType: string, new: Record<string, unknown>|null, old: Record<string, unknown>|null }) => void} onChange
 * @returns {() => void}
 */
export function subscribeTodos(onChange) {
  const supabase = createClient();
  const channel = supabase
    .channel("todos-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "todos" },
      (payload) => {
        onChange({
          eventType: payload.eventType,
          new: payload.new ?? null,
          old: payload.old ?? null,
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
