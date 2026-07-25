import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Sparkles, 
  Send, 
  Bot, 
  User as UserIcon, 
  BookOpen, 
  HelpCircle, 
  ArrowRight, 
  Lightbulb, 
  Zap, 
  GraduationCap, 
  CheckCircle2, 
  Copy, 
  Check,
  Plus,
  Trash2,
  MessageSquare,
  RefreshCw,
  History,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Atom,
  FileText,
  Compass,
  Target,
  Sparkle
} from 'lucide-react';
import { useAuth, AIChatMessage, AIChatSession } from '../context/AuthContext';

interface AITutorProps {
  initialPrompt?: string;
  onNavigateHome: () => void;
}

export const AITutor: React.FC<AITutorProps> = ({ initialPrompt, onNavigateHome }) => {
  const { 
    currentUser, 
    userProfile, 
    logActivity, 
    saveAIChatSession, 
    fetchAIChatSessions, 
    deleteAIChatSession 
  } = useAuth();

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState<string>('New AI Tutor Session');
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [chatSessions, setChatSessions] = useState<AIChatSession[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load chat sessions from Firestore
  useEffect(() => {
    loadSessions();
  }, [currentUser]);

  const loadSessions = async () => {
    if (!currentUser) return;
    setLoadingHistory(true);
    try {
      const sessions = await fetchAIChatSessions();
      setChatSessions(sessions);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Initial Welcome Message setup
  const welcomeMsg: AIChatMessage = {
    id: 'welcome',
    sender: 'ai',
    text: `👋 Welcome ${userProfile?.displayName ? userProfile.displayName.split(' ')[0] : 'Aspirant'}! I am **EntryAce AI Tutor**, your expert university entry test instructor for **NED and FAST**.\n\nHow can I help you today? Pick an entry test category below or type your question!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  // Handle Initial Prompt or start default chat
  useEffect(() => {
    if (initialPrompt) {
      handleNewChatWithPrompt(initialPrompt);
    } else if (messages.length === 0 && !activeChatId) {
      setMessages([welcomeMsg]);
    }
  }, [initialPrompt]);

  const handleNewChatWithPrompt = async (promptText: string) => {
    setActiveChatId(null);
    setChatTitle('New AI Tutor Session');
    setMessages([welcomeMsg]);
    await handleSendPrompt(promptText, [welcomeMsg], null);
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setChatTitle('New AI Tutor Session');
    setMessages([welcomeMsg]);
    setInputText('');
  };

  const handleSelectSession = (session: AIChatSession) => {
    setActiveChatId(session.id);
    setChatTitle(session.title);
    setMessages(session.messages || [welcomeMsg]);
  };

  const handleDeleteSession = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat session?')) {
      await deleteAIChatSession(chatId);
      setChatSessions(prev => prev.filter(s => s.id !== chatId));
      if (activeChatId === chatId) {
        handleNewChat();
      }
    }
  };

  const handleClearChat = async () => {
    if (confirm('Clear messages in current chat?')) {
      setMessages([welcomeMsg]);
      if (activeChatId) {
        await saveAIChatSession(activeChatId, chatTitle, [welcomeMsg]);
      }
    }
  };

  const handleSendPrompt = async (
    promptToSend?: string, 
    customMessagesHistory?: AIChatMessage[], 
    customChatId?: string | null
  ) => {
    const text = promptToSend || inputText;
    if (!text.trim() || loading) return;

    const currentHistory = customMessagesHistory || messages;
    const currentId = customChatId !== undefined ? customChatId : activeChatId;

    const userMsg: AIChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...currentHistory, userMsg];
    setMessages(updatedMessages);
    if (!promptToSend) setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: text.trim(),
          history: currentHistory
           .filter(m => m.id !== "welcome")
            .slice(-6)
              .map(m => ({
              sender: m.sender,
               text: m.text

          })),
          systemContext:  `
You are EntryAce AI Tutor for NED and FAST entry test students.

Rules:
- Use very simple English.
- Keep answers short and clear.
- Do not use headings like "Concept", "Reasoning", or "Solution".
- Do not use Markdown (** or ###).
- Do not use LaTeX ($...$).
- Show only the important calculation steps.
- Explain like a friendly teacher.
- End with: Answer: <correct option>.
`
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const aiMsg: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.text || 'I analyzed your request. Here is the step-by-step explanation:',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);

      // Save to Firestore
      const newTitle = currentId 
        ? chatTitle 
        : text.slice(0, 32) + (text.length > 32 ? '...' : '');

      const savedId = await saveAIChatSession(currentId, newTitle, finalMessages);
      if (savedId) {
        setActiveChatId(savedId);
        setChatTitle(newTitle);
        // Refresh sessions list
        loadSessions();
      }

      // Log activity
      await logActivity('Asked AI Tutor', 'ai-tutor', userProfile?.selectedUniversity || 'NED');

    } catch (err: any) {
      console.error('AI Tutor error:', err);
      const errorMsg: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `⚠️ Error fetching explanation: ${err.message || 'Please check your connection and try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Specialized Feature Prompts
  const specializedPrompts = [
    {
      category: 'MCQ Simple Explanation',
      icon: <Lightbulb className="w-4 h-4 text-amber-500" />,
      prompt: 'Explain this MCQ in simple language and why option A is correct and others are wrong: "If a matrix A has det(A) = 0, what can be inferred about its inverse?"'
    },
    {
      category: 'Math Step-by-Step',
      icon: <Calculator className="w-4 h-4 text-blue-500" />,
      prompt: 'Solve this Mathematics calculus problem step by step with integration by parts: ∫ x · e^(2x) dx'
    },
    {
      category: 'Physics Concept',
      icon: <Atom className="w-4 h-4 text-purple-500" />,
      prompt: 'Explain the concept of Conservation of Angular Momentum with real NED entry test examples and formulas.'
    },
    {
      category: 'Chemistry Concept',
      icon: <Zap className="w-4 h-4 text-emerald-500" />,
      prompt: 'Explain Le Chatelier’s principle for chemical equilibrium and how pressure affects gaseous reactions.'
    },
    {
      category: 'English Grammar & Vocabulary',
      icon: <FileText className="w-4 h-4 text-indigo-500" />,
      prompt: 'Explain high-frequency vocabulary words for FAST entry test (e.g. Ephemeral, Meticulous) with synonyms and usage.'
    },
    {
      category: 'IQ & Logic Problem',
      icon: <Brain className="w-4 h-4 text-rose-500" />,
      prompt: 'Solve this FAST NUCES IQ series problem step by step: 3, 7, 15, 31, 63, ? What is the rule?'
    },
    {
      category: 'Generate Practice MCQs',
      icon: <Target className="w-4 h-4 text-amber-600" />,
      prompt: 'Generate 3 similar practice MCQs for NED Entry Test on Physics Vectors with detailed answers and explanations.'
    },
    {
      category: 'Entry Exam Study Tips',
      icon: <GraduationCap className="w-4 h-4 text-teal-500" />,
      prompt: 'Give me top 5 time-management and negative-marking exam tips for NED and FAST entry tests.'
    },
    {
      category: 'Study Next Recommendation',
      icon: <Compass className="w-4 h-4 text-sky-500" />,
      prompt: 'Based on standard entrance test weightage, recommend what subjects and high-yield topics I should focus on next.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 pt-4 sm:pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Top Navigation Bar */}
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-[28px] p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors flex items-center gap-1.5 text-xs"
              title="Toggle Chat History"
            >
              <History className="w-4 h-4 text-purple-600" />
              <span className="hidden sm:inline">History</span>
            </button>

            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-800">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Brain className="w-4 h-4 text-purple-200" />
              </div>
              <span>EntryAce AI Tutor</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/80 text-[10px] uppercase font-bold">
                AI Assistant
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-xs transition-colors flex items-center gap-1.5 border border-purple-200"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>

            <button
              onClick={handleClearChat}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs transition-colors flex items-center gap-1"
              title="Clear current messages"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Main Grid: Sidebar + Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* SIDEBAR: CHAT HISTORY & SESSIONS */}
          {isSidebarOpen && (
            <div className="lg:col-span-3 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[32px] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>Chat Sessions ({chatSessions.length})</span>
                </div>
                <button
                  onClick={handleNewChat}
                  className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors"
                  title="Create New Session"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {loadingHistory ? (
                <div className="py-8 text-center text-xs text-slate-400 font-medium animate-pulse">
                  Loading chat history...
                </div>
              ) : chatSessions.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-medium space-y-2">
                  <p>No saved chat history yet.</p>
                  <p className="text-[11px] text-slate-400">Ask questions to save your AI tutoring history automatically in Firestore.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {chatSessions.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => handleSelectSession(s)}
                      className={`p-3 rounded-2xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between group ${
                        activeChatId === s.id
                          ? 'bg-blue-50 text-blue-800 border-blue-300 shadow-xs'
                          : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                      }`}
                    >
                      <div className="truncate pr-2 space-y-0.5">
                        <div className="font-extrabold truncate">{s.title || 'Untitled Session'}</div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {s.messages?.length || 0} messages
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteSession(e, s.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        title="Delete Session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MAIN CHAT CANVAS */}
          <div className={`${isSidebarOpen ? 'lg:col-span-9' : 'lg:col-span-12'} bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[32px] p-6 shadow-sm space-y-6 flex flex-col justify-between min-h-[600px]`}>
            
            {/* Messages Display */}
            <div className="space-y-6 overflow-y-auto max-h-[550px] pr-2">
              
              {/* Quick Action Category Prompts (Pills) when at beginning */}
              {messages.length <= 1 && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Specialized Entry Test Solvers (Click to ask):</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {specializedPrompts.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendPrompt(item.prompt)}
                        disabled={loading}
                        className="p-3 rounded-xl bg-white hover:bg-blue-50/80 hover:border-blue-300 text-left border border-slate-200/80 transition-all shadow-2xs group flex flex-col justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 group-hover:text-blue-600">
                          {item.icon}
                          <span>{item.category}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-2">
                          {item.prompt}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Message List */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 font-bold">
                      <Brain className="w-5 h-5 text-purple-200" />
                    </div>
                  )}

                  <div className={`max-w-3xl rounded-[24px] p-5 space-y-2 border ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white border-slate-800 rounded-tr-none'
                      : 'bg-slate-50/90 text-slate-900 border-slate-200/90 rounded-tl-none shadow-2xs'
                  }`}>
                    <div className="flex items-center justify-between text-[11px] font-bold opacity-70">
                      <span>{msg.sender === 'user' ? 'You' : 'EntryAce AI Tutor'}</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed font-normal space-y-2">
                      {msg.text}
                    </div>

                    {msg.sender === 'ai' && msg.id !== 'welcome' && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleCopyText(msg.text, msg.id)}
                          className="px-2.5 py-1 rounded-lg hover:bg-slate-200/70 text-slate-500 text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy response</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
                      <UserIcon className="w-5 h-5 text-blue-300" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Animation / Loading Indicator */}
              {loading && (
                <div className="flex gap-4 items-center text-slate-600 text-xs font-extrabold animate-pulse">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                    <Brain className="w-5 h-5 text-purple-200 animate-spin" />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                    <span>EntryAce AI Tutor is analyzing & preparing step-by-step solution...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
                  placeholder="Ask any entry test question (e.g. 'Solve ∫ x sin(x) dx' or 'Explain IQ sequence 3, 7, 15...')..."
                  className="flex-grow py-3.5 px-5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />

                <button
                  onClick={() => handleSendPrompt()}
                  disabled={loading || !inputText.trim()}
                  className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 hover:shadow-lg hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
                >
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-2">
                <span>EntryAce AI Tutor saves chat history to Firestore.</span>
                <span className="hidden sm:inline">Press Enter to send</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
