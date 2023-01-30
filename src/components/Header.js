import { Button, Card } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function Header() {
  const roomId = uuidv4();
  return (
    <div>
      <Card sx={{ marginTop: 5 }} raised>
        <Link style={{ textDecoration: "none" }} to="/">
          <Button variant="text">Home</Button>
        </Link>
        <Link style={{ textDecoration: "none" }} to="/chats">
          <Button variant="text">Chats</Button>
        </Link>
        <Link style={{ textDecoration: "none" }} to={`/room/${roomId}`}>
          <Button variant="text">Room 1</Button>
        </Link>
      </Card>
    </div>
  );
}

export default Header;
