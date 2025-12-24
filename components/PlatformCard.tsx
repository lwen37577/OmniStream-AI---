import React, { useState } from 'react';
import { PlatformId, GeneratedContent, PlatformConfig } from '../types';
import { Copy, Check, RefreshCw, AlertCircle } from 'lucide-react';

interface PlatformCardProps {
  platform: PlatformConfig;
  content: GeneratedContent;
  isSelected: boolean;
  onToggle: (id: PlatformId) => void;
  onUpdate: (id: PlatformId, content: GeneratedContent) => void;
  publishStatus: 'idle' | 'uploading' | 'success' | 'error';
}

const PlatformCard: React.FC<PlatformCardProps> = ({
  platform,
  content,
  isSelected,
  onToggle,
  onUpdate,
  publishStatus,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const statusColors = {
    idle: 'border-slate-700',
    uploading: 'border-blue-500 ring-1 ring-blue-500',
    success: 'border-green-500 ring-1 ring-green-500',
    error: 'border-red-500 ring-1 ring-red-500',
  };

  return (
    <div
      className={`relative bg-slate-800 rounded-xl border transition-all duration-300 ${
        isSelected ? statusColors[publishStatus] : 'border-transparent opacity-60 grayscale'
      }`}
    >
      {/* Header / Toggle */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer border-b border-slate-700"
        onClick={() => onToggle(platform.id)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${platform.color} text-white shadow-lg`}>
            {platform.icon}
          </div>
          <h3 className="font-semibold text-lg">{platform.name}</h3>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'
        }`}>
            {isSelected && <Check size={14} className="text-white" />}
        </div>
      </div>

      {/* Content Editor (Only visible if selected) */}
      {isSelected && (
        <div className="p-4 space-y-4">
          {/* Title Input */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <label>标题 (Title)</label>
              <button 
                onClick={(e) => { e.stopPropagation(); handleCopy(content.title, 'title'); }}
                className="hover:text-white flex items-center gap-1"
              >
                {copiedField === 'title' ? <Check size={12} /> : <Copy size={12} />}
                {copiedField === 'title' ? '已复制' : '复制'}
              </button>
            </div>
            <input
              type="text"
              value={content.title}
              onChange={(e) => onUpdate(platform.id, { ...content, title: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder={`请输入 ${platform.name} 标题...`}
            />
            <div className="text-right text-xs text-slate-500">
                {content.title.length}/{platform.maxTitleLength}
            </div>
          </div>

          {/* Description Input */}
          {platform.hasDescription && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <label>{platform.descriptionLabel || '描述 (Description)'}</label>
                <button 
                   onClick={(e) => { e.stopPropagation(); handleCopy(content.description, 'desc'); }}
                   className="hover:text-white flex items-center gap-1"
                >
                  {copiedField === 'desc' ? <Check size={12} /> : <Copy size={12} />}
                  {copiedField === 'desc' ? '已复制' : '复制'}
                </button>
              </div>
              <textarea
                value={content.description}
                onChange={(e) => onUpdate(platform.id, { ...content, description: e.target.value })}
                rows={4}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none scrollbar-thin"
                placeholder="请输入视频描述..."
              />
            </div>
          )}

          {/* Tags */}
          {platform.hasTags && (
             <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                    <label>标签 (Tags)</label>
                </div>
                <div className="flex flex-wrap gap-2">
                    {content.tags.map((tag, idx) => (
                        <span key={idx} className="bg-slate-700 text-xs px-2 py-1 rounded-md text-slate-300">
                            #{tag.replace('#','')}
                        </span>
                    ))}
                    {content.tags.length === 0 && (
                        <span className="text-xs text-slate-600 italic">无生成标签</span>
                    )}
                </div>
             </div>
          )}

          {/* Status Overlay */}
          {publishStatus !== 'idle' && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10 transition-all">
                  {publishStatus === 'uploading' && (
                      <div className="flex flex-col items-center gap-2">
                          <RefreshCw className="animate-spin text-blue-500" size={32} />
                          <span className="text-blue-400 font-medium">发布中...</span>
                      </div>
                  )}
                  {publishStatus === 'success' && (
                      <div className="flex flex-col items-center gap-2">
                          <Check className="text-green-500" size={32} />
                          <span className="text-green-400 font-medium">发布成功!</span>
                          <a href="#" className="text-xs text-slate-400 hover:text-white underline">查看帖子</a>
                      </div>
                  )}
                  {publishStatus === 'error' && (
                      <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="text-red-500" size={32} />
                          <span className="text-red-400 font-medium">发布失败</span>
                          <button className="text-xs bg-slate-700 px-2 py-1 rounded hover:bg-slate-600">重试</button>
                      </div>
                  )}
              </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlatformCard;