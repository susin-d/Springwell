
import React, { useState, useEffect, useRef, useCallback, useContext, createContext } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Send, Bot, User, Loader, ChevronDown } from 'lucide-react';
import { getAiResponse, initializeChat } from '../../../services/geminiService';
import type { Chat } from '@google/genai';
import type { AiActionResponse } from '../../../services/geminiService';

// FIX: Define and export the context here to break the circular dependency with Dashboard.tsx
export const DashboardActionContext = createContext<{
  handleAiAction: (action: AiActionResponse) => void;
}>({
  handleAiAction: () => {},
});

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

interface ChatInterfaceProps {
    initialPrompt?: string;
}

const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

const uiStrings: Record<string, { greeting: string, placeholder: string }> = {
    en: { greeting: "Hello! I'm Springwell, your AI assistant for groundwater insights. How can I help you today? Try asking me to create a chart or show data on the map.", placeholder: "Ask me to create a chart or show data on the map..." },
    hi: { greeting: "नमस्ते! मैं स्प्रिंगवेल हूँ, भूजल संबंधी जानकारी के लिए आपका AI सहायक। मैं आज आपकी कैसे मदद कर सकता हूँ?", placeholder: "भूजल डेटा के बारे में पूछें..." },
    ta: { greeting: "வணக்கம்! நான் ஸ்பிரிங்வெல், உங்கள் நிலத்தடி நீர் நுண்ணறிவுக்கான AI உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?", placeholder: "நிலத்தடி நீர் தரவைப் பற்றி கேளுங்கள்..." },
    te: { greeting: "నమస్కారం! నేను స్ప్రింగ్‌వెల్, భూగర్భజల అంతర్దృష్టుల కోసం మీ AI అసిస్టెంట్. ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?", placeholder: "భూగర్భజల డేటా గురించి అడగండి..." },
    kn: { greeting: "ನಮಸ್ಕಾರ! ನಾನು ಸ್ಪ್ರಿಂಗ್‌ವೆಲ್, ಅಂತರ್ಜಲ ಒಳನೋಟಗಳಿಗಾಗಿ ನಿಮ್ಮ AI ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?", placeholder: "ಅಂತರ್ಜಲ ಡೇಟಾ ಬಗ್ಗೆ ಕೇಳಿ..." },
    ml: { greeting: "നമസ്കാരം! ഞാൻ സ്പ്രിംഗ്വെൽ, ഭൂഗർഭജല ഉൾക്കാഴ്ചകൾക്കായുള്ള നിങ്ങളുടെ AI അസിസ്റ്റന്റ്. ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കും?", placeholder: "ഭൂഗർഭജല ഡാറ്റയെക്കുറിച്ച് ചോദിക്കുക..." },
    bn: { greeting: "নমস্কার! আমি স্প্রিংওয়েল, ভূগর্ভস্থ জল সম্পর্কিত তথ্যের জন্য আপনার এআই সহকারী। আমি আজ আপনাকে কিভাবে সাহায্য করতে পারি?", placeholder: "ভূগর্ভস্থ জলের ডেটা সম্পর্কে জিজ্ঞাসা করুন..." },
    mr: { greeting: "नमस्कार! मी स्प्रिंगवेल, भूजल अंतर्दृष्टीसाठी तुमचा AI सहाय्यक आहे. मी आज तुम्हाला कशी मदत करू शकेन?", placeholder: "भूजल डेटाबद्दल विचारा..." },
    gu: { greeting: "નમસ્તે! હું સ્પ્રિંગવેલ છું, ભૂગર્ભજળની આંતરદૃષ્ટિ માટે તમારો AI સહાયક. આજે હું તમને કેવી રીતે મદદ કરી શકું?", placeholder: "ભૂગર્ભજળ ડેટા વિશે પૂછો..." },
    pa: { greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਸਪਰਿੰਗਵੈਲ ਹਾਂ, ਧਰਤੀ ਹੇਠਲੇ ਪਾਣੀ ਦੀ ਜਾਣਕਾਰੀ ਲਈ ਤੁਹਾਡਾ AI ਸਹਾਇਕ। ਮੈਂ ਅੱਜ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?", placeholder: "ਧਰਤੀ ਹੇਠਲੇ ਪਾਣੀ ਦੇ ਡੇਟਾ ਬਾਰੇ ਪੁੱਛੋ..." },
};


export const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialPrompt }) => {
  const [language, setLanguage] = useState<string>(
    () => (localStorage.getItem('springwell-lang') || 'en')
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [processedPrompt, setProcessedPrompt] = useState<string | undefined>();
  const { handleAiAction } = useContext(DashboardActionContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  
  const initChat = useCallback(() => {
    try {
        chatRef.current = initializeChat();
    } catch (error) {
        console.error("Failed to initialize chat:", error);
        setMessages(prev => [...prev, {
            id: 'error-init',
            text: "Sorry, I couldn't connect to the AI service. Please check your API key and refresh the page.",
            sender: 'bot'
        }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('springwell-lang', language);
    setMessages([{ id: '1', text: uiStrings[language]?.greeting || uiStrings.en.greeting, sender: 'bot' }]);
    initChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, initChat]);
  
  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    if (!chatRef.current) {
        initChat();
    }

    if (!chatRef.current) {
        setIsLoading(false);
        setMessages(prev => [...prev, {
            id: 'error-send',
            text: "Cannot send message. The AI service is not available.",
            sender: 'bot'
        }]);
        return;
    }

    try {
        const botResponse = await getAiResponse(chatRef.current, text);
        
        handleAiAction(botResponse);

        const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: botResponse.responseText,
            sender: 'bot',
        };
        setMessages(prev => [...prev, botMessage]);

    } catch (error) {
        console.error("Error getting AI response:", error);
        const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: "Sorry, I encountered an error trying to get a response. Please try again.",
            sender: 'bot',
        };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  }, [isLoading, initChat, handleAiAction]);
  
  useEffect(() => {
      if (initialPrompt && initialPrompt !== processedPrompt) {
          handleSend(initialPrompt);
          setProcessedPrompt(initialPrompt);
      }
  },[initialPrompt, processedPrompt, handleSend]);

  return (
    <div className="flex flex-col h-full bg-slate-900/30">
      <div className="p-3 border-b border-white/10 flex justify-end items-center gap-2">
        <span className="text-xs text-white/60">Language:</span>
         <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white/10 border border-white/20 text-white text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-8 py-1.5 appearance-none"
              aria-label="Select language"
            >
              {supportedLanguages.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-slate-800">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/70">
                <ChevronDown className="w-4 h-4" />
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <Card className={`max-w-xl p-4 ${
              message.sender === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-white/90'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
            </Card>
            {message.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white/80" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-4 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <Loader className="w-5 h-5 text-white animate-spin" />
                </div>
                <Card className="max-w-md p-4 bg-slate-800 text-white/90">
                    <p className="text-sm">Thinking...</p>
                </Card>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-white/10">
        <div className="relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={uiStrings[language]?.placeholder || uiStrings.en.placeholder}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
            className="pr-12 h-12"
            disabled={isLoading}
          />
          <Button onClick={() => handleSend(inputValue)} size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 bg-blue-600 hover:bg-blue-700" disabled={isLoading || !inputValue.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
