import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { io } from "socket.io-client";
import { Container } from "@mui/system";
import { Typography } from "@mui/material";

function App() {
  const [socket, setSocket] = useState(null);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    setSocket(io("http://localhost:4000"));
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("msg-from-server", (msg) => {
      setChat((chat) => [...chat, msg.msg]);
    });
  }, [socket]);

  function handleForm(e) {
    e.preventDefault();
    socket.emit("send-msg", { msg });
    setMsg("");
  }

  return (
    <Container>
      <Box sx={{ marginBottom: 5 }}>
        {chat.map((message) => (
          <Typography>{message}</Typography>
        ))}
      </Box>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleForm}
      >
        <TextField
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <Button variant="contained" type="submit">
          SUBMIT
        </Button>
      </Box>
    </Container>
  );
}

export default App;
