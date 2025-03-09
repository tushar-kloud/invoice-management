import { cn } from "../lib/utils"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Send, FileText, FileCheck, HelpCircle } from "lucide-react"

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello, I am your personal Invoice Management Agent. I can help you with the following tasks:",
      options: [
        { id: "generate", label: "Generate invoice from PO", icon: FileText },
        { id: "reconcile", label: "Reconcile PO & Invoice", icon: FileCheck },
        { id: "query", label: "Answer invoice related queries", icon: HelpCircle },
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")

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

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
            <Card
              className={cn("max-w-[80%]", message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}
            >
              <CardContent className="p-4">
                <p>{message.content}</p>

                {message.options && (
                  <div className="mt-4 space-y-2">
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
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Type your message here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1"
        />
        <Button onClick={handleSend} type="submit">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
