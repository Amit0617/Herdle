import { useState, useEffect } from "react";

export default function RoomsList({ client }: { client: any }) {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Start client sync, listen for "PREPARED" state
    client.once("sync", function (state: string, _prevState: any, _res: any) {
      console.log("Matrix client sync state:", state);
      if (state === "PREPARED") {
        loadRooms();
      }
    });
  }, [client]);

  // Function to load rooms after sync
  const loadRooms = () => {
    const rooms = client.getRooms(); // Fetch joined rooms
    setRooms(rooms);
    setLoading(false); // Loading complete
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Joined Rooms</h2>
      {loading ? (
        <p>Loading rooms...</p>
      ) : (
        <ul className="space-y-2 mt-4">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <li key={room.roomId} className="p-2 bg-gray-100 rounded-md">
                {room.name || room.roomId}
              </li>
            ))
          ) : (
            <p>No rooms found</p>
          )}
        </ul>
      )}
    </div>
  );
}
