"use client";

import { useState } from "react";
import { PageCard } from "@/components/page-card";
import { addTaskAction, removeTaskAction } from "@/app/admin/digital-assets/actions";
import type { DigitalAssetTaskRow } from "@/lib/supabase/database.types";

type TasksSectionProps = Readonly<{
  assetId: string;
  initialTasks: DigitalAssetTaskRow[];
}>;

export function TasksSection({ assetId, initialTasks }: TasksSectionProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const newTask = await addTaskAction(assetId, title);
      setTasks([newTask, ...tasks]);
      setTitle("");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await removeTaskAction(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <PageCard title="Tasks" description={`${tasks.length} task${tasks.length !== 1 ? "s" : ""}`}>
      <div className="grid gap-3">
        {showForm && (
          <form onSubmit={handleAddTask} className="grid gap-2">
            <input
              type="text"
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm placeholder-ink-400 focus:outline-none focus:border-accent-500"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-accent-600 px-3 py-2 text-xs font-medium text-white hover:bg-accent-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setTitle("");
                }}
                className="rounded-lg border border-ink-200 px-3 py-2 text-xs font-medium hover:bg-ink-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {tasks.length === 0 && !showForm && (
          <p className="text-xs text-ink-600">No tasks yet.</p>
        )}

        <div className="grid gap-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-lg border border-ink-200 bg-ink-50/50 p-3"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-ink-900">{task.title}</p>
                <p className="text-xs text-ink-600 capitalize">{task.status.replace("_", " ")}</p>
              </div>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="rounded px-2 py-1 text-xs text-ink-600 hover:bg-ink-200"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg border border-dashed border-ink-300 px-3 py-2 text-xs font-medium text-ink-600 hover:bg-ink-50"
          >
            + Add task
          </button>
        )}
      </div>
    </PageCard>
  );
}
