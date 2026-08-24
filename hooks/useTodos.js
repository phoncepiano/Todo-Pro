"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createTodo } from "@/lib/constants";
import { loadTodos, saveTodos } from "@/lib/storage";

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
  const [todos, setTodos] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTodos(sortByOrder(loadTodos()));
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    saveTodos(todos);
  }, [todos, isReady]);

  const addTodo = useCallback(({ text, category, tags, dueDate }) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const next = createTodo({
      text: trimmed,
      category: category ?? "personal",
      tags: tags ?? [],
      dueDate: dueDate ?? null,
      order: Date.now(),
    });

    setTodos((current) => sortByOrder([...current, next]));
  }, []);

  const toggleTodo = useCallback((id) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }, []);

  const editTodo = useCallback((id, updates) => {
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((current) => current.filter((todo) => !todo.completed));
  }, []);

  const reorderTodos = useCallback((activeId, overId) => {
    if (activeId === overId) return;

    setTodos((current) => {
      const sorted = sortByOrder(current);
      const oldIndex = sorted.findIndex((todo) => todo.id === activeId);
      const newIndex = sorted.findIndex((todo) => todo.id === overId);
      if (oldIndex === -1 || newIndex === -1) return current;

      const reordered = [...sorted];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);

      return reordered.map((todo, index) => ({
        ...todo,
        order: index,
      }));
    });
  }, []);

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
