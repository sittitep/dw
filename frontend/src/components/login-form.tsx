import { useSessionStore } from "../stores/session-store";
import { Input } from "./form";

export function LoginForm() {
  const login = useSessionStore((state) => state.actions.login);
  const errors = useSessionStore((state) => state.errors);
  return (
    <div className="flex justify-center items-center h-lvh">
      <form
        className="w-96"
        onSubmit={(e) => {
          e.preventDefault();
          const username = e.currentTarget.username.value;
          const password = e.currentTarget.password.value;
          login(username, password);
        }}
      >
        <Input name="username" onChange={(e) => e.preventDefault()} />
        <Input
          name="password"
          type="password"
          onChange={(e) => e.preventDefault()}
          errorMessage={errors?.password}
        />
        <button
          type="submit"
          className="bg-emerald-600 py-2 px-4 rounded text-white font-semibold text-sm w-full mt-4"
        >
          Login
        </button>
      </form>
    </div>
  );
}