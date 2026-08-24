"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { createTodo } from "@/lib/constants";
import {
  deleteCompletedTodos,
  deleteTodoById,
  fetchTodos,
  insertTodo,
  replaceTodos,
  rowToTodo,
  subscribeTodos,
  updateTodo,
} from "@/lib/todos";

/**
 * @typedef {import("@/lib/constants").Todo} Todo
 */

/**
 * @param {Todo[]} todos
 * @returns {Todo[]}
 */
function sortByOrder(todos) {
  return [...todos].sort((a, b) => a.order - b.order);
}

/**
 * @returns {{
 *   todos: Todo[],
 *   isReady: boolean,
 *   addTodo: (input: { text: string, category?: Todo["category"], tags?: string[], dueDate?: string|null }) => void,
 *   toggleTodo: (id: string) => void,
 *   deleteTodo: (id: string) => void,
 *   editTodo: (id: string, updates: Partial<Pick<Todo, "text"|"category"|"tags"|"dueDate">>) => void,
 *   clearCompleted: () => void,
 *   reorderTodos: (activeId: string, overId: string) => void,
 *   getFilteredTodos: (filter: "all"|"active"|"completed", category?: string|null) => Todo[],
 *   activeCount: number,
 *   completedCount: number,
 * }}
 */
export function useTodos() {
  const { isAuthenticated, isEmailVerified, isLoading: authLoading } = useAuth();
  const [todos, setTodos] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const canUseTodos = isAuthenticated && isEmailVerified;
  const [wasEligible, setWasEligible] = useState(false);

  if (!authLoading && canUseTodos && !wasEligible) {
    setWasEligible(true);
    setIsReady(false);
  } else if (!authLoading && !canUseTodos && wasEligible) {
    setWasEligible(false);
    setTodos([]);
    setIsReady(true);
  } else if (!authLoading && !canUseTodos && !isReady) {
    setIsReady(true);
  }

  const refreshTodos = useCallback(async () => {
    const next = await fetchTodos();
    setTodos(sortByOrder(next));
  }, []);

  useEffect(() => {
    if (authLoading || !canUseTodos) return undefined;

    let cancelled = false;

    async function hydrate() {
      try {
        const next = await fetchTodos();
        if (!cancelled) {
          setTodos(sortByOrder(next));
        }
      } catch (error) {
        console.error("Failed to load todos from Supabase", error);
        if (!cancelled) {
          setTodos([]);
        }
      } finally {
        if (!cancelled) setIsReady(true);
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [authLoading, canUseTodos]);

  useEffect(() => {
    if (!isReady || !canUseTodos) return undefined;

    return subscribeTodos((payload) => {
      setTodos((current) => {
        if (payload.eventType === "INSERT" && payload.new) {
          const incoming = rowToTodo(payload.new);
          if (current.some((todo) => todo.id === incoming.id)) return current;
          return sortByOrder([...current, incoming]);
        }

        if (payload.eventType === "UPDATE" && payload.new) {
          const incoming = rowToTodo(payload.new);
          return sortByOrder(
            current.map((todo) => (todo.id === incoming.id ? incoming : todo))
          );
        }

        if (payload.eventType === "DELETE" && payload.old?.id) {
          return current.filter((todo) => todo.id !== payload.old.id);
        }

        return current;
      });
    });
  }, [isReady, canUseTodos]);

  const addTodo = useCallback(({ text, category, tags, dueDate }) => {
    const trimmed = text.trim();
    if (!trimmed || !canUseTodos) return;

    const next = createTodo({
      text: trimmed,
      category: category ?? "personal",
      tags: tags ?? [],
      dueDate: dueDate ?? null,
      order: Date.now(),
    });

    setTodos((current) => sortByOrder([...current, next]));
    void insertTodo(next).catch((error) => {
      console.error("Failed to add todo", error);
      void refreshTodos();
    });
  }, [canUseTodos, refreshTodos]);

  const toggleTodo = useCallback((id) => {
    if (!canUseTodos) return;

    let completed = false;
    setTodos((current) =>
      current.map((todo) => {
        if (todo.id !== id) return todo;
        completed = !todo.completed;
        return { ...todo, completed };
      })
    );

    void updateTodo(id, { completed }).catch((error) => {
      console.error("Failed to toggle todo", error);
      void refreshTodos();
    });
  }, [canUseTodos, refreshTodos]);

  const deleteTodo = useCallback((id) => {
    if (!canUseTodos) return;

    setTodos((current) => current.filter((todo) => todo.id !== id));
    void deleteTodoById(id).catch((error) => {
      console.error("Failed to delete todo", error);
      void refreshTodos();
    });
  }, [canUseTodos, refreshTodos]);

  const editTodo = useCallback((id, updates) => {
    if (!canUseTodos) return;

    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );
    void updateTodo(id, updates).catch((error) => {
      console.error("Failed to edit todo", error);
      void refreshTodos();
    });
  }, [canUseTodos, refreshTodos]);

  const clearCompleted = useCallback(() => {
    if (!canUseTodos) return;

    setTodos((current) => current.filter((todo) => !todo.completed));
    void deleteCompletedTodos().catch((error) => {
      console.error("Failed to clear completed todos", error);
      void refreshTodos();
    });
  }, [canUseTodos, refreshTodos]);

  const reorderTodos = useCallback((activeId, overId) => {
    if (!canUseTodos || activeId === overId) return;

    setTodos((current) => {
      const sorted = sortByOrder(current);
      const oldIndex = sorted.findIndex((todo) => todo.id === activeId);
      const newIndex = sorted.findIndex((todo) => todo.id === overId);
      if (oldIndex === -1 || newIndex === -1) return current;

      const reordered = [...sorted];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);

      const next = reordered.map((todo, index) => ({
        ...todo,
        order: index,
      }));

      void replaceTodos(next).catch((error) => {
        console.error("Failed to reorder todos", error);
        void refreshTodos();
      });

      return next;
    });
  }, [canUseTodos, refreshTodos]);

  const getFilteredTodos = useCallback(
    (filter, category = null) => {
      return sortByOrder(todos).filter((todo) => {
        const matchesFilter =
          filter === "all" ||
          (filter === "active" && !todo.completed) ||
          (filter === "completed" && todo.completed);

        const matchesCategory = !category || todo.category === category;
        return matchesFilter && matchesCategory;
      });
    },
    [todos]
  );

  const activeCount = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos]
  );

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos]
  );

  return {
    todos,
    isReady,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    reorderTodos,
    getFilteredTodos,
    activeCount,
    completedCount,
  };
}
