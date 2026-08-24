"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { CATEGORIES, getCategoryMeta } from "@/lib/constants";
import Badge from "./ui/Badge";
import Checkbox from "./ui/Checkbox";
import DateInput from "./ui/DateInput";
import SelectField from "./ui/SelectField";
import TextField from "./ui/TextField";
import { DueDateLabel } from "./TodoInput";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
  exit: {
    opacity: 0,
    x: -16,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

function DragHandleIcon ()
{
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden>
      <circle cx="5" cy="4" r="1.2" />
      <circle cx="11" cy="4" r="1.2" />
      <circle cx="5" cy="8" r="1.2" />
      <circle cx="11" cy="8" r="1.2" />
      <circle cx="5" cy="12" r="1.2" />
      <circle cx="11" cy="12" r="1.2" />
    </svg>
  );
}

export function TodoItemDragOverlay ( { todo } )
{
  const categoryMeta = getCategoryMeta( todo.category );

  return (
    <div className="z-10 cursor-grabbing rounded-xl border border-apple-hairline bg-apple-canvas p-4 apple-product-shadow ring-2 ring-apple-primary/30">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-apple-ink-muted-48" aria-hidden>
          <DragHandleIcon />
        </span>

        <div
          className={ `mt-0.5 h-4 w-4 shrink-0 rounded border ${ todo.completed
              ? "border-apple-primary bg-apple-primary"
              : "border-apple-hairline bg-apple-canvas"
            }` }
          aria-hidden
        />

        <div className="min-w-0 flex-1 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={ `text-sm leading-relaxed ${ todo.completed
                  ? "text-apple-ink-muted-48 line-through decoration-apple-ink-muted-48"
                  : "text-apple-ink"
                }` }
            >
              { todo.text }
            </p>
            <Badge className={ categoryMeta.color }>{ categoryMeta.label }</Badge>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <DueDateLabel dueDate={ todo.dueDate } />
            { todo.tags.map( ( tag ) => (
              <Badge key={ tag } className="bg-apple-divider-soft text-apple-ink-muted-80">
                #{ tag }
              </Badge>
            ) ) }
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TodoItem ( { todo, onToggle, onDelete, onEdit } )
{
  const [ isEditing, setIsEditing ] = useState( false );
  const [ text, setText ] = useState( todo.text );
  const [ category, setCategory ] = useState( todo.category );
  const [ dueDate, setDueDate ] = useState( todo.dueDate ?? "" );
  const [ tagInput, setTagInput ] = useState( "" );
  const [ tags, setTags ] = useState( todo.tags );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable( { id: todo.id } );

  const style = {
    transform: CSS.Transform.toString( transform ),
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const categoryMeta = getCategoryMeta( todo.category );

  const beginEdit = () =>
  {
    setText( todo.text );
    setCategory( todo.category );
    setDueDate( todo.dueDate ?? "" );
    setTags( todo.tags );
    setTagInput( "" );
    setIsEditing( true );
  };

  const saveEdit = () =>
  {
    const trimmed = text.trim();
    if ( !trimmed )
    {
      onDelete( todo.id );
      return;
    }

    onEdit( todo.id, {
      text: trimmed,
      category,
      dueDate: dueDate || null,
      tags,
    } );
    setIsEditing( false );
  };

  const cancelEdit = () =>
  {
    setIsEditing( false );
  };

  const addTag = () =>
  {
    const value = tagInput.trim().replace( /,$/, "" );
    if ( !value || tags.includes( value ) )
    {
      setTagInput( "" );
      return;
    }
    setTags( ( current ) => [ ...current, value ] );
    setTagInput( "" );
  };

  const removeTag = ( tag ) =>
  {
    setTags( ( current ) => current.filter( ( item ) => item !== tag ) );
  };

  return (
    <motion.li
      ref={ setNodeRef }
      style={ style }
      layout={ !isDragging }
      variants={ itemVariants }
      initial="hidden"
      animate="show"
      exit="exit"
      className={ `group rounded-xl border border-apple-hairline bg-apple-canvas p-4 transition-all ${ isDragging ? "z-10 apple-product-shadow ring-2 ring-apple-primary/30" : "hover:border-apple-primary/30"
        }` }
    >
      { isEditing ? (
        <div className="space-y-3">
          <TextField
            type="text"
            value={ text }
            onChange={ ( event ) => setText( event.target.value ) }
            onKeyDown={ ( event ) =>
            {
              if ( event.key === "Enter" ) saveEdit();
              if ( event.key === "Escape" ) cancelEdit();
            } }
            autoFocus
            aria-label="Edit todo text"
            wrapperClassName="flex w-full"
            filled
          />

          <div className="flex flex-wrap gap-2">
            <SelectField
              value={ category }
              onChange={ ( event ) => setCategory( event.target.value ) }
              aria-label="Edit category"
            >
              { CATEGORIES.map( ( item ) => (
                <option key={ item.value } value={ item.value }>
                  { item.label }
                </option>
              ) ) }
            </SelectField>

            <DateInput
              value={ dueDate }
              onChange={ ( event ) => setDueDate( event.target.value ) }
              aria-label="Edit due date"
            />

            <TextField
              type="text"
              value={ tagInput }
              onChange={ ( event ) => setTagInput( event.target.value ) }
              onKeyDown={ ( event ) =>
              {
                if ( event.key === "Enter" || event.key === "," )
                {
                  event.preventDefault();
                  addTag();
                }
              } }
              onBlur={ addTag }
              placeholder="Add tags"
              aria-label="Edit tags"
              wrapperClassName="min-w-30 flex-1"
            />
          </div>

          { tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              { tags.map( ( tag ) => (
                <Badge key={ tag } className="bg-apple-divider-soft text-apple-ink">
                  #{ tag }
                  <button
                    type="button"
                    onClick={ () => removeTag( tag ) }
                    aria-label={ `Remove tag ${ tag }` }
                    className="ml-1 text-apple-ink-muted-48"
                  >
                    ×
                  </button>
                </Badge>
              ) ) }
            </div>
          ) }

          <div className="flex gap-2">
            <button
              type="button"
              onClick={ saveEdit }
              className="rounded-full bg-apple-primary px-4 py-1.5 text-xs font-medium text-white hover:bg-apple-primary-focus apple-active-scale"
            >
              Save
            </button>
            <button
              type="button"
              onClick={ cancelEdit }
              className="rounded-full border border-apple-hairline px-4 py-1.5 text-xs text-apple-ink-muted-80 hover:text-apple-ink apple-active-scale"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <button
            type="button"
            className="mt-0.5 cursor-grab touch-none text-apple-ink-muted-48 hover:text-apple-ink active:cursor-grabbing"
            aria-label="Drag to reorder"
            { ...attributes }
            { ...listeners }
          >
            <DragHandleIcon />
          </button>

          <Checkbox
            checked={ todo.completed }
            onChange={ () => onToggle( todo.id ) }
            label={ todo.completed ? `Mark "${ todo.text }" as active` : `Mark "${ todo.text }" as completed` }
          />

          <div
            className="min-w-0 flex-1 text-left"
            onDoubleClick={ beginEdit }
          >
            <div className="flex flex-wrap items-center gap-2">
              <p
                className={ `text-sm leading-relaxed transition-all duration-200 ${ todo.completed
                    ? "text-apple-ink-muted-48 line-through decoration-apple-ink-muted-48"
                    : "text-apple-ink"
                  }` }
              >
                { todo.text }
              </p>
              <Badge className={ categoryMeta.color }>{ categoryMeta.label }</Badge>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <DueDateLabel dueDate={ todo.dueDate } />
              { todo.tags.map( ( tag ) => (
                <Badge key={ tag } className="bg-apple-divider-soft text-apple-ink-muted-80">
                  #{ tag }
                </Badge>
              ) ) }
            </div>
          </div>

          <div className="flex shrink-0 gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            <button
              type="button"
              onClick={ beginEdit }
              aria-label={ `Edit "${ todo.text }"` }
              className="rounded-lg p-1.5 text-apple-ink-muted-48 hover:bg-apple-divider-soft hover:text-apple-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-primary-focus"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M4 14.5V16h1.5L14.1 7.4l-1.5-1.5L4 14.5z" />
                <path d="M12.7 4.3l1.5 1.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={ () => onDelete( todo.id ) }
              aria-label={ `Delete "${ todo.text }"` }
              className="rounded-lg p-1.5 text-apple-ink-muted-48 hover:bg-red-500/10 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M5 6h10M8 6V4.5h4V6M7 6v9.5h6V6" />
              </svg>
            </button>
          </div>
        </div>
      ) }
    </motion.li>
  );
}
