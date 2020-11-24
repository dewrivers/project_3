import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import TextContainer from '../textContainer/TextContainer';
import Messages from '../messages/Messages';
import InfoBar from '../infoBar/InfoBar';
import Input from '../input/Input';

import './Chat.css';

const ENDPOINT = 'http://localhost:7777';

let socket;

export default function Chat({ location }) {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });

    return () => {
      socket.emit('disconnect');

      socket.off();
    }
  },[location.search]);
  
  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, [messages]);

   // funsction for sending messages
  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }
  console.log(message, messages);
  
  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
          <Input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onkeypress={(event) => event.key === 'Enter' ? sendMessage(event) : null} />
          
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

