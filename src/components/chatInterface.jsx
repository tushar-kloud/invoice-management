import { useState, useEffect } from "react"
import ConversationWindow from "./chatInterfaceComponents/ConversationWindow"
import UserInputs from "./chatInterfaceComponents/userInputs"

export default function ChatInterface() {
<<<<<<< HEAD
  const [messages, setMessages] = useState(() => {
    const storedMessages = localStorage.getItem("chatMessages")
    return storedMessages ? JSON.parse(storedMessages) : []
  })
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages))
  }, [messages])
  
  useEffect(() => {
  }, [messages, setMessages])
=======
  const [messages, setMessages] = useState([
    // {
    //   role: "assistant",
    //   content: "Hello, I am your personal Invoice Management Agent. I can help you with the following tasks:",
    //   options: [
    //     { id: "generate", label: "Generate invoice from PO", icon: FileText },
    //     { id: "reconcile", label: "Reconcile PO & Invoice", icon: FileCheck },
    //     { id: "query", label: "Answer invoice related queries", icon: HelpCircle },
    //   ],
    // },
  ])
  const [inputValue, setInputValue] = useState("")
  const [files, setFile] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length <= 10) {
      setFiles((prev) => [...prev, ...selectedFiles]);
    } else {
      alert('You can upload a maximum of 10 files.');
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (inputValue.trim() || files.length) {
      setUploading(true);

      // Simulate file upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      handleSend(inputValue, files);

      setInputValue('');
      setFiles([]);
      setUploading(false);
    }
  };


  const handleSend = () => {
    if (!inputValue.trim()) return

    // Add user message
    setMessages([...messages, { role: "user", content: inputValue }])

    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'll help you with that request. Would you like to proceed with one of these options?",
          options: [
            { id: "generate", label: "Generate invoice from PO", icon: FileText },
            { id: "reconcile", label: "Reconcile PO & Invoice", icon: FileCheck },
            { id: "query", label: "Answer invoice related queries", icon: HelpCircle },
          ],
        },
      ])
    }, 1000)

    setInputValue("")
  }

  const handleOptionClick = (optionId) => {
    // Add user selection as a message
    const option = messages[messages.length - 1].options?.find((opt) => opt.id === optionId)
    if (option) {
      setMessages([...messages, { role: "user", content: option.label }])

      // Simulate AI response based on selection
      setTimeout(() => {
        let responseContent = ""

        if (optionId === "generate") {
          responseContent =
            "To generate an invoice from a purchase order, please go to the 'Generate Invoice' tab or I can help you through the process here."
        } else if (optionId === "reconcile") {
          responseContent =
            "To reconcile a PO with an invoice, please go to the 'Reconcile PO & Invoice' tab or I can guide you through the steps here."
        } else if (optionId === "query") {
          responseContent =
            "What specific question do you have about invoices? I can help with information about invoice formats, requirements, or processing."
        }

        setMessages((prev) => [...prev, { role: "assistant", content: responseContent }])
      }, 1000)
    }
  }
>>>>>>> d6d42dc (dev:bug fix)

  return (
    <div className="flex flex-col h-auto">
      <div className="flex-1 overflow-y-auto mb-1 space-top-4">
        <ConversationWindow messages={messages} setMessages={setMessages} />
      </div>
<<<<<<< HEAD
      <UserInputs message={messages} setMessages={setMessages} />
=======

      <div>
      {/* File Preview Section */}
      {files?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-lg text-sm">
              <span className="truncate">{file.name}</span>
              <button onClick={() => handleRemoveFile(index)}>
                <XCircle className="h-4 w-4 text-red-500 hover:text-red-700" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Section */}
      <div className="flex items-center space-x-3 border p-2 rounded-lg shadow-md">
        {/* File Upload Button */}
        <label htmlFor="file-upload" className="cursor-pointer flex items-center">
          <Paperclip className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
          <input
            id="file-upload"
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xlsx,.csv,.png,.jpg,.jpeg,.mp3"
          />
        </label>

        {/* Input Field */}
        <textarea
          placeholder="Type your message here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
          className="flex-1 h-20 resize-none rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 transition-all"
          disabled={uploading}
        />

        {/* Send Button */}
        <Button
          style={{ cursor: 'pointer' }}
          onClick={handleSubmit}
          type="submit"
          disabled={uploading}
          className="bg-black hover:bg-gray-800 transition-all"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
>>>>>>> d6d42dc (dev:bug fix)
    </div>
  )
}
