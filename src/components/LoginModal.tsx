import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

export default function LoginModal({ client, onLoginSuccess }: { client: any, onLoginSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true); // Initially open the modal

  interface IResponse {
    user_id: string;
    access_token: string;
    home_server: string;
    device_id: string;
    well_known: {
      "m.homeserver": {
        base_url: string;
      };
      "m.identity_server"?: {
        base_url?: string;
      };
    };
  }

  async function login() {
    try {
      await client
        .login("m.login.password", { user: username, password: password })
        .then((response: IResponse) => {
          // Handle successful login and close modal
          setIsOpen(false);
          console.log("Logged in as", response.access_token);
          onLoginSuccess();
        });
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        {/* The backdrop */}
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          {/* The actual dialog panel */}
          <DialogPanel className="max-w-md w-full space-y-4 bg-white p-8 rounded-lg shadow-lg">
            <DialogTitle className="text-xl font-semibold">Login</DialogTitle>

            {/* Login Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                login();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                />
                </label>

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                />
                </label>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex justify-end gap-4">
                {/* <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button> */}
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                  disabled={!username || !password}
                >
                  Login
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
