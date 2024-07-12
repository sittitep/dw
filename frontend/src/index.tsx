import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { useSessionStore } from "./stores/session-store";
import { LoginForm } from "./components/login-form";

type AuthenticatedAreaProps = {
  children: React.ReactNode;
};

function AuthenticatedArea(props: AuthenticatedAreaProps) {
  const token = useSessionStore((state) => state.token);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      useSessionStore.getState().actions.setToken(token);
    }
  }, []);

  return <>{token ? props.children : <LoginForm />}</>;
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthenticatedArea>
      <App />
    </AuthenticatedArea>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
