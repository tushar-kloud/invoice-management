import { useState, useEffect } from "react"
import ConversationWindow from "./chatInterfaceComponents/ConversationWindow"
import UserInputs from "./chatInterfaceComponents/userInputs"

export default function ChatInterface() {
  const [messages, setMessages] = useState(() => {
    const storedMessages = localStorage.getItem("chatMessages")
    return storedMessages ? JSON.parse(storedMessages) : []
  })
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages))
  }, [messages])
  
  useEffect(() => {
  }, [messages, setMessages])

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-y-auto mb-1 space-top-4">
        <ConversationWindow messages={messages} setMessages={setMessages} />
      </div>
      <UserInputs message={messages} setMessages={setMessages} />
    </div>
  )
}
