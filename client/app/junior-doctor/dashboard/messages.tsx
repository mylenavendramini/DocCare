"use client";
import { io } from "socket.io-client";
import "../junior-doctor.css";
import { useEffect, useState } from "react";
import { TypeChatUser, TypeMessage } from "../../../../server/types/types";
import { useAppSelector } from "@/redux/store";
import { TUser } from "@/types/types";

const socket = io("ws://localhost:3001");

interface Props {
  currentJunior: TUser;
}
export default function JuniorDoctorMessages({ currentJunior }: Props) {
  const initialState = { message: "", user: "" };
  const [messageState, setMessageState] = useState(initialState);
  const [allMessages, setAllMessages] = useState<TypeMessage[]>([]);
  const [onlinePatients, seOnlinePatients] = useState<TypeChatUser[]>([]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMessageState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const selectedPatient = useAppSelector(
    (state) => state.chatPatientReducer.value
  );

  function handleClick() {
    const newMessage = {
      content: messageState.message,
      sender_id: currentJunior.id,
      sender_name: "Doctor",
      receiver_id: selectedPatient.id,
      receiver_name: selectedPatient.name,
    } as TypeMessage;

    socket.emit("from junior", newMessage, selectedPatient.id);
    setAllMessages([...allMessages, newMessage]);
  }

  socket.on("patient message", (message) => {
    setAllMessages([...allMessages, message]);
  });

  return (
    <main>
        <div className="container">
          <section className="chat">
            <div className="header-chat">
              {/* <i className="icon fa fa-user-o" aria-hidden="true"></i> */}
              <div className="messages-chat">
                {allMessages.map((mes) => {
                  return mes.sender_name === "Doctor" ? (
                    <div className="message text-only" key={mes.id}>
                      {mes.content}
                    </div>
                  ) : (
                    <div className="junior-doctor-message" key={mes.id}>
                      {mes.content}
                    </div>
                  );
                })}
                <div className="send-container">
                  <input
                    className="chat-input"
                    name="message"
                    value={messageState.message}
                    onChange={(e) => handleChange(e)}
                    placeholder="Type your message..."
                  ></input>
                  <button className="send" onClick={handleClick}>
                    Send
                  </button>
                </div>
              </div>
            </div>
            </section>
        </div>
    </main>
  );
}
