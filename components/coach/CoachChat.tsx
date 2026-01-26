'use client'

import { useState, useEffect, useRef } from 'react'
import { BrainCircuit, Send, User, Bot, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
// @ts-ignore - Puter types might be missing
import puter from '@heyputer/puter.js'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

interface CoachChatProps {
    context: string // Condensed string of user's visions/tasks
    userFirstName: string
}

export function CoachChat({ context, userFirstName }: CoachChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: `Hello ${userFirstName}! I've analyzed your current focus. \n\n${context ? "I see you're working on some exciting visions." : "It looks like a fresh start."}\n\nWhat challenge are you facing right now that's slowing you down?`,
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!input.trim() || loading) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            // Construct Contextual Prompt
            // limited context window management (simplistic for now)
            const conversationHistory = messages.map(m => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`).join('\n')

            const systemPrompt = `
You are an Elite Productivity Coach for high-performing founders. Your name is Kinetic AI.
Your Goal: Help the user execute their Vision.
Style: Concise, direct, encouraging but ruthless about prioritization. No fluff.

USER CONTEXT:
${context}

INSTRUCTIONS:
- Answer short and sharp.
- If they are stuck, suggest identifying the next smallest step.
- Use the user's visions/milestones in your answer if relevant.
- Do not hallucinate data not in the context.

CONVERSATION:
${conversationHistory}
User: ${userMsg.content}
Coach:
`.trim()

            // Call Puter AI
            // Note: puter.ai.chat returns a response object or string depending on version. 
            // The docs say: puter.ai.chat(prompt) -> returns response content
            const response = await puter.ai.chat(systemPrompt)

            let answer = ''
            if (typeof response === 'string') {
                answer = response
            } else if (typeof response === 'object' && response !== null && 'message' in response) {
                // Handle version returning { message: { content: string } }
                const msg = (response as any).message
                answer = msg?.content || JSON.stringify(msg)
            } else if (Array.isArray(response)) {
                answer = response.map(r => r.text || r.content).join(' ')
            } else {
                answer = String(response)
            }

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: answer.trim(),
                timestamp: new Date()
            }

            setMessages(prev => [...prev, botMsg])

        } catch (error) {
            console.error("Puter AI Error:", error)
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm having trouble connecting to the neural network right now. Please try again in a moment.",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMsg])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[600px] border border-white/10 rounded-2xl bg-[#080c14] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-mono text-neutral-400">ONLINE v1.0 (Puter.js)</span>
                </div>
                {/* Clear Chat Option could go here */}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
                {messages.map((msg) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id}
                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-fuchsia-600' : 'bg-neutral-700'
                            }`}>
                            {msg.role === 'assistant' ? <BrainCircuit className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
                        </div>

                        <div className={`space-y-1 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'assistant'
                                ? 'bg-white/5 border border-white/5 text-neutral-200 rounded-tl-none'
                                : 'bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-100 rounded-tr-none'
                                }`}>
                                {msg.content}
                            </div>
                            <span className="text-[10px] text-neutral-600 px-2 block">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </motion.div>
                ))}

                {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-fuchsia-600 flex items-center justify-center shrink-0">
                            <BrainCircuit className="h-4 w-4 text-white" />
                        </div>
                        <div className="p-4 rounded-2xl rounded-tl-none bg-white/5 border border-white/5 flex items-center gap-2">
                            <span className="text-xs text-neutral-400">Thinking</span>
                            <div className="flex gap-1">
                                <span className="h-1 w-1 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="h-1 w-1 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="h-1 w-1 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-white/[0.02]">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                        placeholder="Ask me to review your priorities..."
                        className="w-full bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:border-fuchsia-500/50 transition-colors placeholder:text-neutral-600 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-neutral-400 hover:text-fuchsia-400 hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                </div>
                <p className="text-[10px] text-neutral-600 mt-2 text-center">
                    Powered by Puter.js • AI can make mistakes
                </p>
            </form>
        </div>
    )
}
