
import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Code2, 
  LayoutDashboard, 
  Zap, 
  ChevronRight, 
  Box, 
  ShieldCheck, 
  Info, 
  Layers,
  Sparkles,
  MessageSquare,
  Lock,
  Cloud,
  ExternalLink,
  Database,
  Globe
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { AURUM_PROJECT_FILES, SPRING_DEPENDENCIES } from './constants';
import { TabType, CodeSnippet } from './types';
import CodeDisplay from './components/CodeDisplay';
import ValidationSimulator from './components/ValidationSimulator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.ARCHITECTURE);
  const [selectedFile, setSelectedFile] = useState<CodeSnippet>(AURUM_PROJECT_FILES[0]);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isExplaining, setIsExplaining] = useState<boolean>(false);

  const explainCodeWithAI = async (file: CodeSnippet) => {
    setIsExplaining(true);
    setAiExplanation('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `As a Senior Java Architect, explain the architecture and key technical decisions in this Spring Boot file: ${file.name}\n\nCode:\n${file.content}`,
        config: {
          systemInstruction: "You are a Senior Spring Boot Architect. Provide concise, expert-level explanations focused on best practices, performance, and security.",
          temperature: 0.7
        }
      });
      setAiExplanation(response.text || 'Failed to generate explanation.');
    } catch (error) {
      console.error(error);
      setAiExplanation('Error: Could not connect to the AI engine. Please check your network.');
    } finally {
      setIsExplaining(false);
    }
  };

  useEffect(() => {
    if (activeTab === TabType.AI_EXPLAINER) {
      explainCodeWithAI(selectedFile);
    }
  }, [selectedFile, activeTab]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center shadow-lg shadow-amber-900/20">
              <Box className="text-slate-950" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white">Aurum</h1>
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Architect Pro</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
          <section>
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">Navigation</h2>
            <div className="space-y-1">
              {[
                { id: TabType.ARCHITECTURE, icon: Layers, label: 'Architecture' },
                { id: TabType.CODE, icon: Code2, label: 'Code Explorer' },
                { id: TabType.SIMULATOR, icon: Zap, label: 'Logic Simulator' },
                { id: TabType.AUTH, icon: Lock, label: 'Auth Logic' },
                { id: TabType.DEPLOYMENT, icon: Cloud, label: 'Deployment' },
                { id: TabType.AI_EXPLAINER, icon: Sparkles, label: 'AI Code Insights' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                    activeTab === item.id 
                    ? 'bg-amber-600/10 text-amber-500' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <item.icon size={20} className={activeTab === item.id ? 'text-amber-500' : 'group-hover:text-amber-400'} />
                  <span className="font-medium text-sm">{item.label}</span>
                  {activeTab === item.id && <ChevronRight size={16} className="ml-auto" />}
                </button>
              ))}
            </div>
          </section>

          {activeTab === TabType.CODE && (
            <section className="animate-in fade-in slide-in-from-left-2">
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">Project Files</h2>
              <div className="space-y-1">
                {AURUM_PROJECT_FILES.map(file => (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full flex flex-col gap-0.5 px-4 py-2 rounded-xl transition-all text-left ${
                      selectedFile.id === file.id 
                      ? 'bg-slate-800 text-white' 
                      : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-[10px] opacity-60 font-mono truncate">{file.path}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </nav>

        <div className="p-4 bg-slate-900/30 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">SB</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Aurum Backend</p>
              <p className="text-[10px] text-slate-500 truncate">v3.2.1 Stable</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-950 overflow-y-auto relative">
        <header className="sticky top-0 z-10 glass border-b border-slate-800/50 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
             {activeTab === TabType.CODE && <Terminal size={20} className="text-amber-500" />}
             <h2 className="font-semibold text-lg">
                {activeTab === TabType.ARCHITECTURE && "System Architecture"}
                {activeTab === TabType.CODE && `Explorer / ${selectedFile.name}`}
                {activeTab === TabType.SIMULATOR && "Validation Simulator"}
                {activeTab === TabType.AUTH && "Authentication Logic"}
                {activeTab === TabType.DEPLOYMENT && "Deployment Roadmap"}
                {activeTab === TabType.AI_EXPLAINER && "AI Architectural Review"}
             </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              PostgreSQL Connected
            </span>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          {activeTab === TabType.ARCHITECTURE && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-amber-600/10 border border-amber-600/20 p-6 rounded-2xl flex items-start gap-4">
                <Info className="text-amber-500 shrink-0 mt-1" />
                <div>
                  <h3 className="text-amber-500 font-bold mb-1">Architecture Overview</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Aurum Bookings follows a clean **N-Tier Architecture**. We separate concerns between the Entity (Domain), Repository (Persistence), Service (Business), and Controller (API) layers. This ensures the application remains scalable, testable, and maintainable.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                  <h4 className="font-bold mb-4 flex items-center gap-2 text-white">
                    <ShieldCheck className="text-amber-500" size={18} />
                    Security & CORS
                  </h4>
                  <p className="text-slate-400 text-sm mb-4">
                    Strict CORS policy configured in <code className="text-amber-200">WebConfig.java</code> to permit only authorized traffic from the React frontend environment.
                  </p>
                  <ul className="space-y-2">
                    {['Allowed: http://localhost:3000', 'Methods: GET, POST, OPTIONS', 'Credentials: Enabled'].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <div className="w-1 h-1 rounded-full bg-amber-500"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                  <h4 className="font-bold mb-4 flex items-center gap-2 text-white">
                    <LayoutDashboard className="text-amber-500" size={18} />
                    Core Dependencies
                  </h4>
                  <div className="space-y-3">
                    {SPRING_DEPENDENCIES.map((dep, idx) => (
                      <div key={idx} className="group">
                        <p className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors">{dep.name}</p>
                        <p className="text-[10px] text-slate-500">{dep.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                <h4 className="text-center font-bold mb-8 text-slate-400 uppercase tracking-widest text-sm">Application Request Pipeline</h4>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
                  <div className="w-40 h-24 bg-slate-800 border border-slate-700 rounded-xl flex flex-col items-center justify-center shadow-lg">
                    <span className="text-[10px] text-amber-500 font-bold">CLIENT</span>
                    <span className="text-sm font-semibold">React App</span>
                  </div>
                  <ChevronRight className="rotate-90 md:rotate-0 text-slate-600" />
                  <div className="w-40 h-24 bg-amber-600/20 border border-amber-600/50 rounded-xl flex flex-col items-center justify-center shadow-lg">
                    <span className="text-[10px] text-amber-500 font-bold">CONTROLLER</span>
                    <span className="text-sm font-semibold">REST API</span>
                  </div>
                  <ChevronRight className="rotate-90 md:rotate-0 text-slate-600" />
                  <div className="w-40 h-24 bg-slate-800 border border-slate-700 rounded-xl flex flex-col items-center justify-center shadow-lg">
                    <span className="text-[10px] text-amber-500 font-bold">SERVICE</span>
                    <span className="text-sm font-semibold">Validation Logic</span>
                  </div>
                  <ChevronRight className="rotate-90 md:rotate-0 text-slate-600" />
                  <div className="w-40 h-24 bg-slate-800 border border-slate-700 rounded-xl flex flex-col items-center justify-center shadow-lg">
                    <span className="text-[10px] text-amber-500 font-bold">PERSISTENCE</span>
                    <span className="text-sm font-semibold">PostgreSQL</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === TabType.CODE && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedFile.name}</h3>
                  <p className="text-slate-400 text-sm max-w-2xl">{selectedFile.description}</p>
                </div>
              </div>
              <CodeDisplay code={selectedFile.content} language={selectedFile.language} />
            </div>
          )}

          {activeTab === TabType.SIMULATOR && (
            <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
               <ValidationSimulator />
            </div>
          )}

          {activeTab === TabType.AUTH && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                  <Lock className="text-amber-500" size={24} />
                  Authentication Strategy
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  For this project, we implement a straightforward credentials check in <code className="text-amber-200">AuthController.java</code>. 
                  The backend validates the request and returns a <strong>Role</strong> and <strong>Redirect URL</strong> which the frontend uses to route the user.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Admin Access</p>
                    <p className="text-sm text-slate-300">User: <code className="text-amber-400">admin</code></p>
                    <p className="text-sm text-slate-300">Pass: <code className="text-amber-400">1234</code></p>
                    <p className="text-[10px] text-emerald-500 mt-2">Redirects to /admin</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Client Access</p>
                    <p className="text-sm text-slate-300">User: <code className="text-amber-400">client</code></p>
                    <p className="text-sm text-slate-300">Pass: <code className="text-amber-400">1234</code></p>
                    <p className="text-[10px] text-emerald-500 mt-2">Redirects to /booking</p>
                  </div>
                </div>

                <div className="bg-indigo-600/10 border border-indigo-600/30 p-6 rounded-2xl">
                  <h4 className="text-indigo-400 font-bold mb-2 flex items-center gap-2">
                    <Terminal size={18} />
                    Frontend Logic (Next.js Example)
                  </h4>
                  <pre className="text-xs text-indigo-200 font-mono leading-relaxed">
{`const handleLogin = async (creds) => {
  const res = await fetch('/api/login', { method: 'POST', ... });
  const data = await res.json();
  if (res.ok) {
    router.push(data.redirectUrl); // e.g., '/admin' or '/booking'
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === TabType.DEPLOYMENT && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                  <Cloud className="text-amber-500" size={24} />
                  Cloud Deployment Strategy
                </h3>
                
                <div className="overflow-hidden border border-slate-800 rounded-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-800/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-700">
                      <tr>
                        <th className="px-6 py-4">Component</th>
                        <th className="px-6 py-4">Repository</th>
                        <th className="px-6 py-4">Cloud Host</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium flex items-center gap-2">
                          <Globe size={14} className="text-amber-500" /> Frontend UI
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500 underline">aurum-bookings</td>
                        <td className="px-6 py-4">
                          <span className="bg-black border border-slate-700 px-2 py-1 rounded text-xs flex items-center gap-1.5 w-fit">
                            Vercel <ExternalLink size={10} />
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium flex items-center gap-2">
                          <Database size={14} className="text-amber-500" /> Java API
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500 underline">AURUM-BACKEND</td>
                        <td className="px-6 py-4">
                          <span className="bg-indigo-950 border border-indigo-800 px-2 py-1 rounded text-xs flex items-center gap-1.5 w-fit">
                            Railway.app <ExternalLink size={10} />
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium flex items-center gap-2">
                          <Terminal size={14} className="text-amber-500" /> Database
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">Managed Instance</td>
                        <td className="px-6 py-4">
                          <span className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-xs flex items-center gap-1.5 w-fit">
                            Supabase / Vercel Postgres
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <h5 className="text-xs font-bold text-amber-500 uppercase mb-2">Frontend Pipeline</h5>
                    <p className="text-[11px] text-slate-400">Automatic CI/CD on every git push. Connect your main branch to Vercel for instant live updates.</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <h5 className="text-xs font-bold text-amber-500 uppercase mb-2">Backend Pipeline</h5>
                    <p className="text-[11px] text-slate-400">Railway detect's the Maven pom.xml and handles the JDK environment setup automatically.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === TabType.AI_EXPLAINER && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center">
                  <Sparkles className="text-indigo-400" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">AI Architectural Explainer</h3>
                  <p className="text-slate-400 text-sm">Synthesizing senior-level context for <code className="text-indigo-300">{selectedFile.name}</code></p>
                </div>
              </div>

              {isExplaining ? (
                <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl flex flex-col items-center justify-center gap-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <p className="text-slate-400 text-sm font-medium">Analyzing patterns and best practices...</p>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex items-center gap-2">
                    <MessageSquare size={16} className="text-indigo-400" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Expert Insights</span>
                  </div>
                  <div className="p-8 prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4 whitespace-pre-wrap">
                    {aiExplanation}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setActiveTab(TabType.CODE)}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors text-left group"
                >
                  <Code2 className="text-slate-500 group-hover:text-amber-500 mb-2 transition-colors" size={20} />
                  <p className="text-xs font-bold text-white">Return to Code</p>
                  <p className="text-[10px] text-slate-500">Implement these patterns</p>
                </button>
                <button 
                  onClick={() => setSelectedFile(AURUM_PROJECT_FILES[3])} // Select Auth Controller
                  className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors text-left group"
                >
                  <ShieldCheck className="text-slate-500 group-hover:text-amber-500 mb-2 transition-colors" size={20} />
                  <p className="text-xs font-bold text-white">Review Security</p>
                  <p className="text-[10px] text-slate-500">Audit CORS & Validation</p>
                </button>
                <div className="p-4 bg-indigo-600/10 border border-indigo-600/30 rounded-xl">
                  <p className="text-xs font-bold text-indigo-400">Pro Tip</p>
                  <p className="text-[10px] text-slate-400 mt-1">AI models use the provided system instructions to maintain "Senior Java Architect" persona.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
