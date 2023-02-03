import { Button, Card } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function Header({ socket }) {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  function createNewRoom() {
    const roomId = uuidv4();
    navigate(`/room/${roomId}`);
    socket.emit("new-room-created", { roomId });
    setRooms([...rooms, roomId]);
  }
  useEffect(() => {
    if (!socket) return;
    socket.on("new-room-created", ({ roomId }) => {
      setRooms([...rooms, roomId]);
    });
  }, [socket]);
  useEffect(() => {
    async function fetchRooms() {
      const res = await fetch("http://localhost:4000/rooms");
      const data = await res.json();
      console.log(data.rooms);
      setRooms(data.rooms);
    }
    fetchRooms();
  }, []);

  return (
    <div>
      <Card sx={{ marginTop: 5 }} raised>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Link style={{ textDecoration: "none" }} to="/">
            <Button variant="text">Home</Button>
          </Link>
          <Button variant="text" onClick={createNewRoom}>
            New Room
          </Button>
        </Box>
      </Card>
      <Card sx={{ marginTop: 5 }} raised>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {rooms.map((room) => {
            return (
              <Link
                style={{ textDecoration: "none" }}
                to={`/room/${room.name}`}
                key={room._id}
              >
                <Button variant="text">{room.name}</Button>
              </Link>
            );
          })}
        </Box>
      </Card>
    </div>
  );
}

export default Header;
