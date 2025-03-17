import { cn } from "../../lib/utils"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Send, FileText, FileCheck, HelpCircle, Paperclip, XCircle, Loader2 } from "lucide-react"

const UserInputs = ({setMessages}) => {
    const [inputValue, setInputValue] = useState("")
    const [files, setFiles] = useState([])
    const [uploading, setUploading] = useState(false)

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
    
    return (
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
    )
}

export default UserInputs