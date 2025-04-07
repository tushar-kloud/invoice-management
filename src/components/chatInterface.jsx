import { useState, useEffect } from "react"
import ConversationWindow from "./chatInterfaceComponents/ConversationWindow"
// import UserInputs from "./chatInterfaceComponents/userInputs"
import UserInputs from "./chatInterfaceComponents/UserInputs"

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
    <div className="flex flex-col min-h-[78vh] h-auto">
      <div className="flex-1 h-full overflow-y-auto mb-1 space-top-4">
        <ConversationWindow messages={messages} setMessages={setMessages} />
      </div>
      <div className="flex-shrink-0">
      <UserInputs message={messages} setMessages={setMessages} />
      </div>
    </div>
  )
}
