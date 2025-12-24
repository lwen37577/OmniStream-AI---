import React from 'react';

export enum PlatformId {
  YOUTUBE = 'youtube',
  DOUYIN = 'douyin',
  XIAOHONGSHU = 'xiaohongshu',
  WECHAT = 'wechat',
  KUAISHOU = 'kuaishou',
}

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  icon: React.ReactNode; // Store the icon component name or SVG reference
  color: string;
  maxTitleLength: number;
  hasDescription: boolean;
  hasTags: boolean;
  descriptionLabel?: string;
}

export interface GeneratedContent {
  title: string;
  description: string;
  tags: string[];
}

export interface DistributionState {
  file: File | null;
  basePrompt: string;
  isGenerating: boolean;
  isPublishing: boolean;
  platformContent: Record<PlatformId, GeneratedContent>;
  selectedPlatforms: Record<PlatformId, boolean>;
  publishStatus: Record<PlatformId, 'idle' | 'uploading' | 'success' | 'error'>;
}