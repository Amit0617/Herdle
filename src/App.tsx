import { useState } from "react";
import { createClient } from "matrix-js-sdk";
import LoginModal from "./components/LoginModal";
import RoomsList from "./components/RoomsList";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { IPublicRoomsChunkRoom } from "matrix-js-sdk";
// import SearchRooms from "./components/SearchRooms";
import "./App.css";

export default function App() {

  const [baseUrl, setBaseUrl] = useState("https://matrix.org");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<IPublicRoomsChunkRoom[]>([]);
  const [loading, setLoading] = useState(false);

  async function searchPublicRooms(searchTerm: string) {
    try {
      console.log(client.getAccessToken());
      const response = await client.publicRooms({
        limit: 10,
        filter: {
          generic_search_term: searchTerm,
        },
      });
      console.log(response);
      // return response;
      return response.chunk;
    } catch (error) {
      console.error("Error fetching public rooms: ", error);
      return [];
    }
  }

  // Function to handle searching
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const rooms = await searchPublicRooms(searchTerm);
      setSearchResults(rooms);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  // Function to join a room
  async function joinRoom(roomId: string) {
    try {
      await client.joinRoom(roomId);
      console.log(`Joined room: ${roomId}`);
    } catch (error) {
      console.error("Error joining room: ", error);
    }
  }

  const handleLogin = async () => {
    setIsAuthenticated(true);
    client.startClient(); // Start client sync once authenticated
    console.log(client.getAccessToken());
  };

  const client = createClient({
    baseUrl: baseUrl,
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Search Bar */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Herdle</h1>

          {/* Search Bar with Modal Trigger */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for rooms..."
              className="border border-gray-300 rounded-md px-4 py-2 w-96"
              onFocus={() => setIsSearchOpen(true)} // Open modal when search bar is focused
            />

            {/* Modal/Dialog for search results */}

            {/* <SearchRooms
                      client={client}
                      isSearchOpen={isSearchOpen}
                      setIsSearchOpen={setIsSearchOpen}
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      searchResults={searchResults}
                      setSearchResults={setSearchResults}
                    /> */}
            {isSearchOpen && (
              <Dialog
                open={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                className="fixed z-50 inset-0 flex items-start justify-center mt-16"
              >
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <DialogPanel className="relative bg-white shadow-lg rounded-md max-w-md w-full p-4">
                  <form onSubmit={handleSearch} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Search for public rooms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input border border-gray-300 rounded-md px-4 py-2 w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="px-4 py-2 bg-gray-300 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Search
                    </button>
                  </form>

                  {loading && <p>Loading rooms...</p>}

                  <ul className="mt-4 space-y-2">
                    {searchResults && searchResults.map((room) => (
                      <li key={room.room_id} className="border-b pb-2">
                        <p className="font-semibold">
                          {room.name || room.canonical_alias}
                        </p>
                        <button
                          className="text-sm text-blue-600"
                          onClick={() => joinRoom(room.room_id)}
                        >
                          Join Room
                        </button>
                      </li>
                    ))}
                  </ul>
                </DialogPanel>
              </Dialog>
            )}
          </div>
        </div>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label>
              Base URL:
              <input
                type="text"
                placeholder="Base URL"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
            </label>
            <input type="submit" value={"Change Homeserver URL"} />
          </form>
        </div>
      </header>

      {/* Main content */}
      <main className="p-6">
        {isAuthenticated ? (
          <RoomsList client={client} /> // Display rooms after login
        ) : (
          <LoginModal client={client} onLoginSuccess={handleLogin} />
        )}
      </main>
    </div>
  );
}
