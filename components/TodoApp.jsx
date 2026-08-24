"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTodos } from "@/hooks/useTodos";
import TodoFilters from "./TodoFilters";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";
import TodoStats from "./TodoStats";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

export default function TodoApp ()
{
  const {
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    reorderTodos,
    getFilteredTodos,
    activeCount,
    completedCount,
    todos,
    isReady,
  } = useTodos();

  const [ filter, setFilter ] = useState( "all" );
  const [ category, setCategory ] = useState( "" );
  const [ isClearing, setIsClearing ] = useState( false );

  const filteredTodos = getFilteredTodos( filter, category || null );

  const handleClearCompleted = () =>
  {
    setIsClearing( true );
    window.setTimeout( () =>
    {
      clearCompleted();
      setIsClearing( false );
    }, 280 );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex w-full max-w-lg max-h-[calc(100dvh-10rem)] flex-col rounded-[18px] border border-apple-hairline bg-apple-canvas p-6 transition-colors sm:p-8 apple-product-shadow"
    >
      <motion.header
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="mb-6 shrink-0 text-left"
      >
        <h1 className="typography-display-md font-semibold tracking-tight text-apple-ink">
          Todos
        </h1>
        <p className="mt-1 typography-caption text-apple-ink-muted-48">
          Stay organized with calm motion and cloud sync.
        </p>
      </motion.header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="shrink-0 space-y-5">
          <motion.div variants={itemVariants}>
            <TodoInput onAdd={addTodo} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <TodoFilters
              filter={filter}
              category={category}
              onFilterChange={setFilter}
              onCategoryChange={setCategory}
            />
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-5 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 -mr-1"
        >
          <TodoList
            todos={filteredTodos}
            filter={filter}
            hasTodos={todos.length > 0}
            isReady={isReady}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
            onReorder={reorderTodos}
            isClearing={isClearing}
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-5 shrink-0 border-t border-apple-hairline pt-4"
        >
          <TodoStats
            activeCount={activeCount}
            completedCount={completedCount}
            onClearCompleted={handleClearCompleted}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
