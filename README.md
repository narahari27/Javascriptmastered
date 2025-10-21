"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Bot, User, Zap, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { backendApi } from "@/services/backendApi";
import { ChatMessage } from "@/types";
import "./CampaignOptimizationChat.scss";

interface Campaign {
  id: string;
  name: string;
  status: string;
  brand?: string;
  budget?: number;
  impressions_delivered?: number;
  clicks?: number;
  ctr?: number;
  roas?: number;
}

interface ChatMessageWithSuggestions extends ChatMessage {
  suggestions?: string[];
}

interface CampaignOptimizationChatProps {
  campaign: Campaign;
  autoAnalyze?: boolean;
}

export function CampaignOptimizationChat({ campaign, autoAnalyze = false }: CampaignOptimizationChatProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessageWithSuggestions[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [hasAutoAnalyzed, setHasAutoAnalyzed] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-analyze effect
  useEffect(() => {
    const triggerAutoAnalysis = async () => {
      if (autoAnalyze && campaign.id && !hasAutoAnalyzed && !isLoading) {
        setHasAutoAnalyzed(true);

        const autoMessage = "Provide a performance summary for this campaign.";

        const userMessage: ChatMessageWithSuggestions = {
          id: Date.now(),
          text: autoMessage,
          sender: "user",
          timestamp: new Date(),
        };

        setChatMessages([userMessage]);
        setIsLoading(true);
        setBackendError(null);

        try {
          const response = await backendApi.sendCampaignOptimizationMessage(
            campaign.id,
            autoMessage,
            sessionId,
            'user'
          );

          const aiResponseText = response.data?.ai_response || response.data?.response || 'I apologize, but I encountered an issue generating a response.';
          const suggestions = response.data?.suggestions || []; // Get suggestions from backend

          const botMessage: ChatMessageWithSuggestions = {
            id: Date.now() + 1,
            text: aiResponseText,
            sender: "bot",
            timestamp: new Date(),
            suggestions: suggestions, // Add suggestions to message
          };

          setChatMessages((prevMessages) => [...prevMessages, botMessage]);

        } catch (error) {
          console.error('Failed to send auto-analysis message:', error);
          setBackendError(error instanceof Error ? error.message : 'Failed to send message');

          const errorMessage: ChatMessageWithSuggestions = {
            id: Date.now() + 1,
            text: `I apologize, but I'm having trouble connecting to the optimization service right now. Please try again in a moment.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
            sender: "bot",
            timestamp: new Date(),
            error: "Service error"
          };

          setChatMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const timer = setTimeout(triggerAutoAnalysis, 100);
    return () => clearTimeout(timer);
  }, [autoAnalyze, campaign.id, hasAutoAnalyzed, isLoading, sessionId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && chatInput.trim()) {
      handleSendMessage();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setChatInput(suggestion);
    handleSendMessage(suggestion);
  };

  // Send message
  const handleSendMessage = async (messageText?: string) => {
    const message = messageText || chatInput.trim();
    if (!message) return;

    // Add user message to chat
    const userMessage: ChatMessageWithSuggestions = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setChatMessages((prevMessages) => [...prevMessages, userMessage]);
    setChatInput("");
    setIsLoading(true);
    setBackendError(null);

    try {
      const response = await backendApi.sendCampaignOptimizationMessage(
        campaign.id,
        message,
        sessionId,
        'user'
      );

      const aiResponseText = response.data?.ai_response || response.data?.response || 'I apologize, but I encountered an issue generating a response.';
      const suggestions = response.data?.suggestions || []; // Get suggestions from backend

      const botMessage: ChatMessageWithSuggestions = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: "bot",
        timestamp: new Date(),
        suggestions: suggestions, // Add suggestions to message
      };

      setChatMessages((prevMessages) => [...prevMessages, botMessage]);

      if (response.data?.chat_metadata) {
        console.log('AI Response Metadata:', response.data.chat_metadata);
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      setBackendError(error instanceof Error ? error.message : 'Failed to send message');

      const errorMessage: ChatMessageWithSuggestions = {
        id: Date.now() + 1,
        text: `I apologize, but I'm having trouble connecting to the optimization service right now. Please try again in a moment.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sender: "bot",
        timestamp: new Date(),
        error: "Service error"
      };

      setChatMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render user avatar
  const renderUserAvatar = () => {
    return (
      <div className="message-avatar user-avatar">
        <User size={16} />
      </div>
    );
  };

  // Render bot avatar
  const renderBotAvatar = () => {
    return (
      <div className="message-avatar bot-avatar">
        <Bot size={16} />
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col bg-white shadow-sm border border-gray-200">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Chat Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {campaign?.status?.toLowerCase() === 'completed' ? 'Campaign Analysis Assistant' : 'Campaign Optimization Assistant'}
              </h3>
              <p className="text-sm text-gray-600">
                {backendError ? 'Service temporarily unavailable' : 
                 campaign?.status?.toLowerCase() === 'completed' ? 'AI-powered insights and performance analysis' : 'AI-powered insights and recommendations'}
              </p>
            </div>
          </div>

          {backendError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">Connection issue: {backendError}</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="campaign-chat-interface flex-1 flex flex-col">
          <div className="chat-messages-container flex-1">
            <div className="chat-messages">
              {chatMessages.map((message) => (
                <div key={message.id}>
                  <div
                    className={`chat-message ${message.sender === "user" ? "user-message" : "bot-message"}`}
                  >
                    {message.sender === "user" ? renderUserAvatar() : renderBotAvatar()}
                    <div className="message-bubble">
                      <div className="message-text">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-2xl font-extrabold pl-1.5 mt-1 mb-1" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-xl font-bold pl-1.5 mt-1 mb-1" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-lg font-semibold pl-1.5 mt-5 mb-1" {...props} />,
                            h4: ({node, ...props}) => <h3 className="text-base font-semibold pl-1.5 mt-1 mb-1" {...props} />,
                            p: ({node, ...props}) => <p className="font-normal mb-2 pl-2" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                            em: ({node, ...props}) => <em className="italic" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-5 ml-2 mt-1 mb-3 space-y-1 leading-tight" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 ml-2 my-1 space-y-1 leading-tight" {...props} />,
                            li: ({node, ...props}) => <li className="m-0" {...props} />,
                            a: ({href, children, ...props}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" {...props}>{children}</a>,
                            table: ({node, ...props}) => <div className="overflow-x-auto"><table className="min-w-full text-sm" {...props} /></div>,
                            th: ({node, ...props}) => <th className="border px-2 py-1 bg-gray-50" {...props} />,
                            td: ({node, ...props}) => <td className="border px-2 py-1" {...props} />,
                            br: () => <br />,
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>

                  {/* Show suggestions if they exist in the message */}
                  {message.sender === "bot" && 
                   message.suggestions && 
                   message.suggestions.length > 0 && 
                   !isLoading && (
                    <div className="mt-4 flex flex-col gap-2 max-w-md">
                      {message.suggestions.map((suggestion, sugIndex) => (
                        <button
                          key={sugIndex}
                          onClick={() => handleSuggestionClick(suggestion)}
                          disabled={isLoading}
                          className="text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="chat-message bot-message">
                  {renderBotAvatar()}
                  <div className="message-bubble">
                    <div className="loading-indicator">
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="loading-text">Loading...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input */}
          <div className="chat-input-container">
            <input
              type="text"
              value={chatInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Ask about campaign optimization..."
              className="chat-input"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage()}
              className="chat-send-button"
              disabled={isLoading || !chatInput.trim()}
            >
              {isLoading ? "..." : <Send size={18} />}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
