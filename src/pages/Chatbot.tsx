import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { processQuery, ChatMessage } from '@/services/chatbotService';
import { Mic, MicOff, Send, Bot, User, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceWave = () => (
  <div className="flex items-center gap-1">
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="w-1 rounded-full bg-primary animate-voice-wave"
        style={{ animationDelay: `${i * 0.15}s`, height: '16px' }}
      />
    ))}
  </div>
);

const Chatbot = () => {
  const { profile } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      text: `Hello! I'm your RationSathi assistant. Ask me about your ${profile?.cardType || 'BPL'} card quota in English, Hindi, or Malayalam.`,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const { answer } = await processQuery(text, profile?.cardType || 'BPL');
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: answer,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      speak(answer);
    } catch (error) {
      console.error('Error processing query:', error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const toggleVoice = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      setInput(text);
      await sendMessage(text);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-xl">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">RationSathi Assistant</h1>
          <p className="text-xs text-muted-foreground">Voice & text support in English, Hindi, Malayalam</p>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card/50 p-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  msg.sender === 'bot' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'
                }`}>
                  {msg.sender === 'bot' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    msg.sender === 'bot'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'gradient-primary text-primary-foreground'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.sender === 'bot' && (
                    <button
                      onClick={() => speak(msg.text)}
                      className="mt-2 flex items-center gap-1 text-xs opacity-60 hover:opacity-100"
                    >
                      <Volume2 className="h-3 w-3" /> Listen
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Voice indicator */}
      {listening && (
        <div className="flex items-center justify-center gap-3 py-3">
          <VoiceWave />
          <span className="text-sm text-primary font-medium">Listening...</span>
          <VoiceWave />
        </div>
      )}

      {/* Input area */}
      <div className="mt-3 flex gap-2">
        <Button
          variant={listening ? 'destructive' : 'outline'}
          size="icon"
          onClick={toggleVoice}
          className="shrink-0 rounded-xl"
        >
          {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        <Input
          placeholder="Ask about your ration quota..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          className="rounded-xl"
        />
        <Button onClick={() => sendMessage(input)} className="shrink-0 rounded-xl" disabled={!input.trim()}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Chatbot;
