import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Wand2, 
  Send, 
  Video, 
  Youtube, 
  Instagram, 
  MessageCircle, 
  Share2,
  FileVideo,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Settings,
  Key
} from 'lucide-react';
import { PlatformId, PlatformConfig, DistributionState, GeneratedContent } from './types';
import { generatePlatformContent } from './services/geminiService';
import PlatformCard from './components/PlatformCard';

// Initial state helpers
const INITIAL_PLATFORMS: PlatformConfig[] = [
  {
    id: PlatformId.YOUTUBE,
    name: 'YouTube (油管)',
    icon: <Youtube size={20} />,
    color: 'bg-red-600',
    maxTitleLength: 100,
    hasDescription: true,
    hasTags: true,
  },
  {
    id: PlatformId.DOUYIN,
    name: '抖音 (Douyin)',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" height="20" width="20"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>,
    color: 'bg-black',
    maxTitleLength: 50,
    hasDescription: true,
    hasTags: true,
  },
  {
    id: PlatformId.XIAOHONGSHU,
    name: '小红书 (Red Book)',
    icon: <div className="font-bold text-sm">小</div>,
    color: 'bg-rose-500',
    maxTitleLength: 20,
    hasDescription: true,
    hasTags: true,
    descriptionLabel: '笔记内容'
  },
  {
    id: PlatformId.WECHAT,
    name: '视频号 (Channels)',
    icon: <MessageCircle size={20} />,
    color: 'bg-green-600',
    maxTitleLength: 60,
    hasDescription: false, // Usually just title/caption
    hasTags: true,
  },
  {
    id: PlatformId.KUAISHOU,
    name: '快手 (Kuaishou)',
    icon: <Video size={20} />,
    color: 'bg-orange-500',
    maxTitleLength: 50,
    hasDescription: true,
    hasTags: true,
  }
];

const EMPTY_CONTENT: GeneratedContent = { title: '', description: '', tags: [] };

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState('');

  const [state, setState] = useState<DistributionState>({
    file: null,
    basePrompt: '',
    isGenerating: false,
    isPublishing: false,
    platformContent: {
      [PlatformId.YOUTUBE]: { ...EMPTY_CONTENT },
      [PlatformId.DOUYIN]: { ...EMPTY_CONTENT },
      [PlatformId.XIAOHONGSHU]: { ...EMPTY_CONTENT },
      [PlatformId.WECHAT]: { ...EMPTY_CONTENT },
      [PlatformId.KUAISHOU]: { ...EMPTY_CONTENT },
    },
    selectedPlatforms: {
      [PlatformId.YOUTUBE]: true,
      [PlatformId.DOUYIN]: true,
      [PlatformId.XIAOHONGSHU]: false,
      [PlatformId.WECHAT]: false,
      [PlatformId.KUAISHOU]: false,
    },
    publishStatus: {
      [PlatformId.YOUTUBE]: 'idle',
      [PlatformId.DOUYIN]: 'idle',
      [PlatformId.XIAOHONGSHU]: 'idle',
      [PlatformId.WECHAT]: 'idle',
      [PlatformId.KUAISHOU]: 'idle',
    },
  });

  // Load API Key from local storage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setTempKey(storedKey);
    } else {
        setShowSettings(true); // Auto open settings if no key
    }
  }, []);

  const saveApiKey = () => {
    localStorage.setItem('gemini_api_key', tempKey);
    setApiKey(tempKey);
    setShowSettings(false);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setState(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  // Toggle platform selection
  const togglePlatform = (id: PlatformId) => {
    setState(prev => ({
      ...prev,
      selectedPlatforms: { ...prev.selectedPlatforms, [id]: !prev.selectedPlatforms[id] }
    }));
  };

  // Update specific platform content
  const updatePlatformContent = (id: PlatformId, content: GeneratedContent) => {
    setState(prev => ({
      ...prev,
      platformContent: { ...prev.platformContent, [id]: content }
    }));
  };

  // AI Generation Handler
  const handleGenerate = async () => {
    if (!apiKey) {
        setShowSettings(true);
        return;
    }
    if (!state.basePrompt.trim()) return;
    
    setState(prev => ({ ...prev, isGenerating: true }));

    const results = await generatePlatformContent(apiKey, state.basePrompt);

    if (results) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        platformContent: results
      }));
    } else {
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  // Simulated Publishing Handler
  const handlePublish = () => {
    if (!state.file) return;

    setState(prev => ({ ...prev, isPublishing: true }));

    // Simulate individual upload progress for selected platforms
    const platformsToPublish = INITIAL_PLATFORMS.filter(p => state.selectedPlatforms[p.id]);

    platformsToPublish.forEach((platform, index) => {
        // Set to uploading immediately
        setState(prev => ({
            ...prev,
            publishStatus: { ...prev.publishStatus, [platform.id]: 'uploading' }
        }));

        // Random success time between 2s and 5s
        const delay = 2000 + Math.random() * 3000;
        
        setTimeout(() => {
             setState(prev => ({
                ...prev,
                publishStatus: { ...prev.publishStatus, [platform.id]: 'success' }
            }));
            
            // If this was the last one, stop global publishing spinner
            if (index === platformsToPublish.length - 1) {
                setState(prev => ({ ...prev, isPublishing: false }));
            }
        }, delay);
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <header className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Share2 size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              OmniStream AI
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setShowSettings(true)}
                className={`p-2 rounded-full transition-colors ${!apiKey ? 'bg-red-500/20 text-red-400 animate-pulse' : 'hover:bg-slate-800 text-slate-400'}`}
                title="设置 API Key"
            >
                <Settings size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                <span className="font-bold text-xs">CN</span>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                  <div className="flex items-center gap-3 mb-4 text-indigo-400">
                      <Key size={24} />
                      <h3 className="text-xl font-bold text-white">激活工具 (Settings)</h3>
                  </div>
                  <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                      本工具需要连接 Google AI 大脑才能工作。请在下方输入您的 <strong>Gemini API Key</strong>。
                      <br/>
                      <span className="text-xs text-slate-500">密钥仅保存在您的浏览器本地，不会上传到任何服务器。</span>
                  </p>
                  
                  <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">API Key</label>
                        <input 
                            type="password"
                            value={tempKey}
                            onChange={(e) => setTempKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      
                      <button 
                        onClick={saveApiKey}
                        disabled={!tempKey}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          保存并开始使用
                      </button>
                      
                      <div className="text-center">
                          <a 
                            href="https://aistudio.google.com/app/apikey" 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs text-indigo-400 hover:underline"
                          >
                              没有密钥？点击这里免费获取 Google Gemini Key &rarr;
                          </a>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Upload & Config (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Upload Section */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">1</span>
                上传视频 (Upload Video)
              </h2>
              
              <div className="relative group">
                <input 
                  type="file" 
                  accept="video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                  state.file 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : 'border-slate-700 bg-slate-800/50 group-hover:border-indigo-400'
                }`}>
                  {state.file ? (
                    <>
                      <FileVideo size={40} className="text-indigo-400 mb-3" />
                      <p className="font-medium text-white break-all line-clamp-1">{state.file.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{(state.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      <span className="mt-4 text-xs bg-indigo-600 text-white px-3 py-1 rounded-full">更换视频</span>
                    </>
                  ) : (
                    <>
                      <Upload size={40} className="text-slate-500 mb-3 group-hover:text-indigo-400 transition-colors" />
                      <p className="font-medium text-slate-300">拖拽或点击上传</p>
                      <p className="text-xs text-slate-500 mt-1">支持 MP4, MOV (最大 500MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Context & AI */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
               <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm">2</span>
                智能内容分析 (AI Analysis)
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">视频内容简介</label>
                  <textarea
                    value={state.basePrompt}
                    onChange={(e) => setState(prev => ({ ...prev, basePrompt: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    rows={4}
                    placeholder="例如：这是我在东京旅游的Vlog，尝试了街头美食，还去了浅草寺..."
                  />
                </div>
                
                <button
                  onClick={handleGenerate}
                  disabled={state.isGenerating || !state.basePrompt}
                  className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    state.isGenerating 
                      ? 'bg-slate-700 cursor-not-allowed text-slate-400'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20'
                  }`}
                >
                  {state.isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      AI 正在分析生成中...
                    </>
                  ) : (
                    <>
                      <Wand2 size={18} />
                      生成全平台文案
                    </>
                  )}
                </button>
              </div>
            </div>

             {/* 4. Publish Action */}
             <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl sticky top-24">
               <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">4</span>
                一键分发 (Distribute)
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                   <span className="text-slate-400">已选平台</span>
                   <span className="text-white font-medium">
                     {Object.values(state.selectedPlatforms).filter(Boolean).length}
                   </span>
                </div>
                
                <button
                  onClick={handlePublish}
                  disabled={state.isPublishing || !state.file}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    state.isPublishing || !state.file
                      ? 'bg-slate-800 cursor-not-allowed text-slate-500'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  {state.isPublishing ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      正在发布...
                    </>
                  ) : (
                     <>
                      <Send size={24} />
                      发布到所有平台
                    </>
                  )}
                </button>
                {!state.file && (
                    <p className="text-xs text-center text-red-400 flex items-center justify-center gap-1">
                        <AlertTriangle size={12}/> 请先上传视频文件
                    </p>
                )}
                <p className="text-[10px] text-center text-slate-600 mt-2">
                  注意：这是模拟演示。真实发布需要将生成好的文案复制，并前往各平台APP手动粘贴发布。
                </p>
              </div>
             </div>
          </div>

          {/* Right Column: Platforms (8 cols) */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg">3</span>
                    平台优化预览 (Preview)
                </h2>
                <div className="text-sm text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                    AI 模型: Gemini 2.5 Flash
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {INITIAL_PLATFORMS.map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  content={state.platformContent[platform.id]}
                  isSelected={state.selectedPlatforms[platform.id]}
                  onToggle={togglePlatform}
                  onUpdate={updatePlatformContent}
                  publishStatus={state.publishStatus[platform.id]}
                />
              ))}
            </div>

            {/* Instruction Tip */}
            <div className="mt-8 p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-lg flex gap-4">
                <div className="p-2 bg-indigo-500/20 rounded-full h-fit">
                    <Wand2 size={20} className="text-indigo-400" />
                </div>
                <div>
                    <h4 className="font-semibold text-indigo-300">使用说明</h4>
                    <p className="text-sm text-slate-400 mt-1">
                        1. 点击右上角设置图标，输入您的 Gemini API Key。<br/>
                        2. 上传视频，输入简介，点击生成文案。<br/>
                        3. AI 生成后，点击各平台的“复制”按钮，将优化后的文案粘贴到抖音、小红书等APP的发布界面中。
                    </p>
                </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;