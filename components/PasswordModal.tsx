import { useEffect, useState } from "react";
import { userNameStorageKey } from "../utils";

export interface PasswordModalConfig {
  title: string;
  description?: string;
  initialUsername?: string;
  onConfirm: (password: string, username: string) => Promise<void>;
  onCancel: () => void;
}

export const PasswordModal = ({ config }: { config: PasswordModalConfig }) => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(config?.initialUsername ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberUsername, setRememberUsername] = useState(
    !!config?.initialUsername
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!password || !username) {
        throw new Error("Please enter both username and password.");
      }
      await config.onConfirm(password, username);
      setPassword("");
    } catch (err) {
      // console.error('Error in password modal onConfirm:', `${err}`,err);
      setError(
        err instanceof DOMException && err.name === "OperationError"
          ? "Wrong password, please try again."
          : `${err}` || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (rememberUsername && username) {
      localStorage.setItem(userNameStorageKey, username);
    } else {
      localStorage.removeItem(userNameStorageKey);
    }
  }, [rememberUsername, username]);

  return (
    <div className="modal-overlay" onClick={config.onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{config.title}</div>
        {config.description && (
          <p className="modal-description">{config.description}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">User name</label>
            <input
              type="text"
              name="username"
              id="username"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. your name"
              disabled={loading}
              autoFocus={!username}
            />
          </div>
          <div className="field checkbox-field">
            <label htmlFor="rememberUsername" className="checkbox-label">
              Remember username
            </label>
            <input
              type="checkbox"
              id="rememberUsername"
              name="rememberUsername"
              checked={rememberUsername}
              onChange={(e) => {
                setRememberUsername(e.target.checked);
              }}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus={!!username}
              disabled={loading}
            />
          </div>
          {error && <div className="modal-error">{error}</div>}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={config.onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Verifying…" : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
