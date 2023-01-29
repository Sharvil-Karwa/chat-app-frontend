import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { io } from "socket.io-client";
import { Card, Typography } from "@mui/material";
function Chat() {
  const [socket, setSocket] = useState(null);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  useEffect(() => {
    setSocket(io("http://localhost:4000"));
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("msg-from-server", (msg) => {
      setChat((chat) => [...chat, { msg: msg.msg, received: true }]);
    });
  }, [socket]);

  function handleForm(e) {
    e.preventDefault();
    socket.emit("send-msg", { msg });
    setChat((chat) => [...chat, { msg: msg, received: false }]);
    setMsg("");
  }

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Card sx={{ padding: 2, marginTop: 10, width: "60%" }}>
          <Box sx={{ marginBottom: 5 }}>
            {chat.map((message) => (
              <Typography
                key={message.msg}
                sx={{ textAlign: message.received ? "left" : "right" }}
              >
                {message.msg}
              </Typography>
            ))}
          </Box>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleForm}
          >
            <TextField
              id="outlined-basic"
              label="Your message"
              variant="outlined"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              type="submit"
              sx={{ width: "100%", mt: 2 }}
            >
              SEND
            </Button>
          </Box>
        </Card>
      </Box>
    </div>
  );
}

export default Chat;
