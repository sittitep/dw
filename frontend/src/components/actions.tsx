import { useFormStore } from "../stores/form-store";
import { useSessionStore } from "../stores/session-store";

export function Actions() {
  const logout = useSessionStore.getState().actions.logout;

  return (
    <div className="flex justify-between mb-4">
      <h1 className="text-2xl font-bold">Book Library</h1>
      <div className="flex gap-2">
        <button
          className="text-sm py-1 px-3 rounded-lg bg-blue-500 text-white"
          onClick={() => useFormStore.getState().actions.open("new")}
        >
          New Book
        </button>
        <button
          className="text-sm py-1 px-3 rounded-lg bg-slate-400 text-slate-700"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
