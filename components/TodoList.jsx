"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import TodoItem, { TodoItemDragOverlay } from "./TodoItem";

const STAGGER_DELAY = 0.15;

const landingVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: STAGGER_DELAY,
    },
  },
};

const clearingVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      staggerDirection: -1,
    },
  },
};

function EmptyState({ filter, hasTodos }) {
  let message = "No todos yet. Add one above to get started.";
  if (hasTodos && filter === "active") {
    message = "All caught up! No active todos.";
  } else if (hasTodos && filter === "completed") {
    message = "Nothing completed yet.";
  }

  return (
    <motion.div
      key="empty"
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 100, damping: 20 },
        },
      }}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -12, transition: { duration: 0.25, ease: "easeOut" } }}
      className="rounded-xl border border-dashed border-border bg-surface px-6 py-10 text-center"
    >
      <p className="text-sm text-muted">{message}</p>
    </motion.div>
  );
}

export default function TodoList({
  todos,
  filter,
  hasTodos,
  isReady,
  onToggle,
  onDelete,
  onEdit,
  onReorder,
  isClearing,
}) {
  const [isLanding, setIsLanding] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!isReady) return;

    setIsLanding(true);
    const timer = window.setTimeout(
      () => setIsLanding(false),
      (todos.length * STAGGER_DELAY + 0.9) * 1000
    );
    return () => window.clearTimeout(timer);
  }, [isReady]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    onReorder(String(active.id), String(over.id));
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeTodo = activeId ? todos.find((todo) => todo.id === activeId) : null;

  const shouldStagger = isLanding || isClearing;

  if (!isReady) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={todos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
        <AnimatePresence mode="popLayout">
          {todos.length === 0 ? (
            <EmptyState key={`empty-${filter}`} filter={filter} hasTodos={hasTodos} />
          ) : (
            <motion.ul
              key={filter}
              layout
              variants={isClearing ? clearingVariants : landingVariants}
              initial={shouldStagger ? "hidden" : false}
              animate={shouldStagger ? "show" : undefined}
              exit={{ opacity: 0, transition: { duration: 0.25, ease: "easeOut" } }}
              className="space-y-2"
            >
              <AnimatePresence mode="popLayout">
                {todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEdit={onEdit}
                  />
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </AnimatePresence>
      </SortableContext>

      <DragOverlay dropAnimation={{ duration: 220, easing: "cubic-bezier(0.18, 0.67, 0.6, 1)" }}>
        {activeTodo ? <TodoItemDragOverlay todo={activeTodo} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
