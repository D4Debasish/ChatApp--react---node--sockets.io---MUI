import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
const App = () => {
  const socket = useMemo(
    () =>
      io("http://localhost:5000", {
        withCredentials: true,
      }),
    []
  );

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    
  }, []);

  return (
    <Container maxWidth="sm" className="mainn">
    <h2>CHAT APP websockets</h2>
      
      <Typography variant="h6" component="div" gutterBottom>
        {socketID}
      </Typography>

    

      <form onSubmit={handleSubmit} style={{display:"flex", gap:10}}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
      <br />
      <form onSubmit={joinRoomHandler} style={{display:"flex", gap:5, flexDirection:"column"}}>
      <h5>Join GROUP</h5>
      <TextField
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        id="outlined-basic"
        label="Name the Group"
        variant="outlined"
      />
      <Button type="submit" variant="contained" color="primary">
        Join
      </Button>
    </form>

      <div>
        {messages.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </div>
    </Container>
  );
};

export default App;