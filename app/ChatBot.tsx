'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from 'lucide-react'

const API_URL = 'http://ccc112233ccc.cn:8000'

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== "" && !isLoading) {
      setIsLoading(true);
      setMessages(prevMessages => [...prevMessages, { text: inputMessage, isBot: false }]);
      setInputMessage("");
      
      try {
        const response = await fetch(`${API_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: inputMessage }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setMessages(prevMessages => [...prevMessages, { text: data.message, isBot: true }]);
      } catch (error) {
        console.error('Error:', error);
        setMessages(prevMessages => [...prevMessages, { text: "Sorry, I'm having trouble connecting to the server. Please check if the local API is running and try again.", isBot: true }]);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Chat with Local Bot</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} mb-4`}>
              {message.isBot && (
                <Avatar className="mr-2">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Bot" />
                  <AvatarFallback>Bot</AvatarFallback>
                </Avatar>
              )}
              <div className={`rounded-lg p-2 max-w-[70%] ${message.isBot ? 'bg-secondary' : 'bg-primary text-primary-foreground'}`}>
                {message.text}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex w-full space-x-2">
          <Input 
            value={inputMessage} 
            onChange={(e) => setInputMessage(e.target.value)} 
            placeholder="Type your message..." 
            className="flex-grow"
            disabled={isLoading}
            aria-label="Message input"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending
              </>
            ) : (
              'Send'
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}