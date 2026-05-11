import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/todos`);
      setTodos(res.data || []);
    } catch (err) {
      console.error("Failed to load todos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (e) => {
    e?.preventDefault();
    const v = text.trim();
    if (!v) return;
    try {
      const res = await axios.post(`${API}/todos`, { text: v });
      setTodos((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error("Failed to add todo:", err);
    }
  };

  const toggle = async (todo) => {
    try {
      const res = await axios.patch(`${API}/todos/${todo.id}`, {
        completed: !todo.completed,
      });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? res.data : t)));
    } catch (err) {
      console.error("Failed to toggle todo:", err);
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(`${API}/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="cozy-card p-4 w-[300px]" data-testid="todo-widget">
      <div className="flex items-center justify-between mb-3">
        <span
          className="font-handwritten text-xl"
          style={{ color: "var(--text)" }}
        >
          today's gentle list
        </span>
        <span
          className="text-[10px] uppercase tracking-widest font-semibold"
          style={{ color: "var(--text-soft)" }}
          data-testid="todo-remaining"
        >
          {remaining} left
        </span>
      </div>

      <form onSubmit={add} className="flex items-center gap-2 mb-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="add a soft intention…"
          className="flex-1 text-sm px-3 py-2 rounded-full outline-none"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border-c)",
            color: "var(--text)",
          }}
          data-testid="task-input"
          maxLength={120}
        />
        <button
          type="submit"
          className="btn-warm !px-3 !py-2"
          aria-label="add"
          data-testid="task-add-button"
        >
          <Plus size={14} />
        </button>
      </form>

      <div
        className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto cozy-scroll pr-1"
        data-testid="todo-list"
      >
        {loading && (
          <div className="text-xs italic" style={{ color: "var(--text-soft)" }}>
            stretching, brewing tea…
          </div>
        )}
        {!loading && todos.length === 0 && (
          <div
            className="text-xs italic font-handwritten text-base"
            style={{ color: "var(--text-soft)" }}
          >
            nothing here yet — start with one tiny thing.
          </div>
        )}
        {todos.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 group px-1 py-1 rounded-lg hover:bg-[var(--surface)]"
          >
            <button
              onClick={() => toggle(t)}
              className="w-4 h-4 rounded-md flex items-center justify-center shrink-0"
              style={{
                border: `1.5px solid ${t.completed ? "var(--terracotta)" : "var(--wood-light)"}`,
                background: t.completed ? "var(--terracotta)" : "transparent",
                transition: "all 0.18s ease",
              }}
              data-testid={`task-checkbox-${t.id}`}
              aria-label={t.completed ? "mark as not done" : "mark as done"}
            >
              {t.completed && (
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 9 9"
                  fill="none"
                >
                  <path
                    d="M1 4.5L3.5 7L8 1.5"
                    stroke="#fff"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <span
              className="flex-1 text-sm break-words"
              style={{
                color: t.completed ? "var(--text-soft)" : "var(--text)",
                textDecoration: t.completed ? "line-through" : "none",
                opacity: t.completed ? 0.7 : 1,
              }}
            >
              {t.text}
            </span>
            <button
              onClick={() => remove(t.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              data-testid={`task-delete-${t.id}`}
              aria-label="delete"
            >
              <Trash2 size={12} color="var(--text-soft)" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
