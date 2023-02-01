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
      {/* <Box>
        {rooms.map((room) => {
          <Button>{room}</Button>;
        })}
      </Box> */}
    </div>
  );
}

export default Header;
