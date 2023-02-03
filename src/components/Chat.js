import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Card, IconButton, InputLabel, Typography } from "@mui/material";
import { useOutletContext, useParams } from "react-router-dom";
import { AttachFile } from "@mui/icons-material";
function Chat() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  const { socket } = useOutletContext();
  const { roomId } = useParams();
  const fileRef = useRef();

  function selectFile() {
    fileRef.current.click();
  }

  function fileSelected(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      socket.emit("send-file", { file: reader.result, roomId });
    };
  }

  useEffect(() => {
    console.log(socket);
    if (!socket) return;
    socket.on("msg-from-server", (msg) => {
      setChat((chat) => [...chat, { msg: msg.msg, received: true }]);
    });
    socket.on("typing-start-from-server", () => {
      setTyping(true);
    });
    socket.on("file-received", (file) => {
      setChat((chat) => [
        ...chat,
        { msg: file.buffer, received: true, type: "image" },
      ]);
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
            {chat.map((message) =>
              message.type === "image" ? (
                <img
                  src={message.msg}
                  style={{
                    width: "10%",
                    float: message.received ? "left" : "right",
                  }}
                />
              ) : (
                <Typography
                  key={message.msg}
                  sx={{ textAlign: message.received ? "left" : "right" }}
                >
                  {message.msg}
                </Typography>
              )
            )}
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
            <input
              onChange={fileSelected}
              ref={fileRef}
              type="file"
              style={{ display: "none" }}
            />
            <IconButton
              type="button"
              edge="end"
              sx={{ float: "right" }}
              onClick={selectFile}
            >
              <AttachFile />
            </IconButton>
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
