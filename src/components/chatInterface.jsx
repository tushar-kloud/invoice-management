import { cn } from "../lib/utils"
import { useRef } from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Send, FileText, FileCheck, HelpCircle, Paperclip, XCircle, Loader2 } from "lucide-react"

export default function ChatInterface() {
  const [messages, setMessages] = useState(() => {
    const storedMessages = localStorage.getItem("chatMessages")
    return storedMessages ? JSON.parse(storedMessages) : []
  })
  const [inputValue, setInputValue] = useState("")
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages))
  }, [messages])

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (files.length + selectedFiles.length <= 10) {
      setFiles((prev) => [...prev, ...selectedFiles])
    } else {
      alert("You can upload a maximum of 10 files.")
    }
  }

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (inputValue.trim() || files.length) {
      setUploading(true)

      // Add user message
      const newUserMessage = { role: "user", content: inputValue }
      setMessages((prev) => [...prev, newUserMessage])

      try {
        const payload = {
          input_value: inputValue,
          output_type: "chat",
          input_type: "chat",
        }

        const response = await fetch(
          "https://langflow-v3-large.salmonisland-47da943e.centralindia.azurecontainerapps.io/api/v1/run/d7af9af5-efbc-46c1-924e-25397792d27a?stream=false",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        )

        if (response.ok) {
          const data = await response.json()
          const aiResponse = data?.outputs?.[0]?.outputs?.[0]?.results?.message?.data?.text

          if (aiResponse) {
            const newAIMessage = { role: "assistant", content: aiResponse }
            setMessages((prev) => [...prev, newAIMessage])
          }
        } else {
          console.error("Failed to fetch AI response")
        }
      } catch (error) {
        console.error("Error:", error)
      }

      setInputValue("")
      setFiles([])
      setUploading(false)
    }
  }

  const handleOptionClick = (optionId) => {
    const option = messages[messages.length - 1]?.options?.find((opt) => opt.id === optionId)
    if (option) {
      const newUserMessage = { role: "user", content: option.label }
      setMessages((prev) => [...prev, newUserMessage])

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

  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-y-auto mb-1 space-top-4">
        {messages.map((message, index) => (
          <div style={{marginY:'10px'}} key={index} className={cn("flex my-3", message.role === "user" ? "justify-end" : "justify-start")}>
            <Card
              className={cn("max-w-[80%]", message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}
            >
              <CardContent className="px-4 !py-0.5">
                <p dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, "<br />") }} />

                {/* {message.options && (
                  <div className="mt-2 space-y-1">
                    {message.options.map((option) => (
                      <Button
                        key={option.id}
                        variant="outline"
                        className="w-full justify-start bg-background hover:bg-accent text-foreground"
                        onClick={() => handleOptionClick(option.id)}
                      >
                        <option.icon className="mr-2 h-4 w-4" />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                )} */}
              </CardContent>
            </Card>
          </div>
        ))}
        {/* Invisible div to track the last message and trigger scroll */}
        <div ref={messagesEndRef} />
      </div>

      <div>
        {/* File Preview Section */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
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
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
            className={cn(
              "flex-1 h-20 resize-none rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 transition-all",
              uploading ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""
            )}
            disabled={uploading}
          />

          {/* Send Button */}
          <Button
            style={{ cursor: "pointer" }}
            onClick={handleSubmit}
            type="submit"
            disabled={uploading}
            className="bg-black hover:bg-gray-800 transition-all"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
