import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { io } from "socket.io-client";
import { Card, InputLabel, Typography } from "@mui/material";
import { useOutletContext, useParams } from "react-router-dom";
function Chat() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  const { socket } = useOutletContext();
  const { roomId } = useParams();
  useEffect(() => {
    console.log(socket);
    if (!socket) return;
    socket.on("msg-from-server", (msg) => {
      setChat((chat) => [...chat, { msg: msg.msg, received: true }]);
    });
    socket.on("typing-start-from-server", () => {
      setTyping(true);
    });
    socket.on("typing-stop-from-server", () => {
      setTyping(false);
    });
  }, [socket]);

  function handleForm(e) {
    e.preventDefault();
    socket.emit("send-msg", { msg, roomId });
    setChat((chat) => [...chat, { msg: msg, received: false }]);
    setMsg("");
  }

  const [typingtimeout, setTypingtimeout] = useState(null);

  function handleInput(e) {
    setMsg(e.target.value);
    socket.emit("typing-start", { roomId });

    if (typingtimeout) clearTimeout(typingtimeout);

    setTypingtimeout(
      setTimeout(() => {
        socket.emit("typing-stop", { roomId });
      }, 1000)
    );
  }

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Card sx={{ padding: 2, marginTop: 10, width: "60%" }}>
          {roomId && <Typography>Room: {roomId}</Typography>}
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
            {typing && (
              <InputLabel sx={{ color: "blue" }} shrink htmlFor="msg-inp">
                typing...
              </InputLabel>
            )}
            <TextField
              id="msg-inp"
              label="Your message"
              variant="outlined"
              value={msg}
              onChange={handleInput}
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
