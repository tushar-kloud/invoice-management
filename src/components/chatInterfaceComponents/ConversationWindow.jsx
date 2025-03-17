import React, {useEffect, useState, useRef} from 'react'
import { cn } from "../../lib/utils"
import { Card, CardContent } from "@/components/ui/card"

const ConversationWindow = ({ messages, setMessages }) => {
    // const [messages, setMessages] = useState(conversation)

    const messagesEndRef = useRef(null)

    useEffect(() => {
        setMessages(messages)
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])
    return (
        <div>
        {messages?.map((message, index) => (
            <div style={{ marginY: '10px' }} key={index} className={cn("flex my-3", message.role === "user" ? "justify-end" : "justify-start")}>
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
        <div ref={messagesEndRef} />
        </div>
    )
}

export default ConversationWindow