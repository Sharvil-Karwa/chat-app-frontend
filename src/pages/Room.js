import { Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import Chat from "../components/Chat";

function Room() {
  const params = useParams();
  const { socket } = useOutletContext();
  useEffect(() => {
    if (!socket) return;
    socket.emit("join-room", { roomId: params.roomId });
  }, [socket]);
  return (
    <div>
      <Chat />
    </div>
  );
}

export default Room;
