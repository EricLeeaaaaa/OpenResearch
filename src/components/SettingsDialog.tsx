import React, { useEffect, useState } from 'react';
import { saveKeys, loadKeys } from '../lib/keyStore';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SettingsDialog({ open, onClose }: Props) {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [openaiBaseUrl, setOpenaiBaseUrl] = useState('');
  const [openaiModel, setOpenaiModel] = useState('');
  const [serperApiKey, setSerperApiKey] = useState('');

  useEffect(() => {
    if (open) {
      const keys = loadKeys();
      setOpenaiApiKey(keys.openaiApiKey || '');
      setOpenaiBaseUrl(keys.openaiBaseUrl || '');
      setOpenaiModel(keys.openaiModel || '');
      setSerperApiKey(keys.serperApiKey || '');
    }
  }, [open]);

  const onSave = () => {
    saveKeys({ openaiApiKey, openaiBaseUrl, openaiModel, serperApiKey });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">设置 API Key</h3>
          <p className="text-sm text-gray-500 mt-1">密钥仅保存在你的浏览器 localStorage，不会上传到服务器。</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">OpenAI API Key</label>
            <input
              type="password"
              value={openaiApiKey}
              onChange={(e) => setOpenaiApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">OpenAI Base URL（可选）</label>
            <input
              value={openaiBaseUrl}
              onChange={(e) => setOpenaiBaseUrl(e.target.value)}
              placeholder="默认：https://api.openai.com/v1"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">OpenAI Model（可选）</label>
            <input
              value={openaiModel}
              onChange={(e) => setOpenaiModel(e.target.value)}
              placeholder="默认：gpt-4o-mini"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Serper API Key</label>
            <input
              type="password"
              value={serperApiKey}
              onChange={(e) => setSerperApiKey(e.target.value)}
              placeholder="serper_api_key"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">取消</button>
          <button onClick={onSave} className="px-4 py-2 rounded-lg bg-[#1877F2] text-white hover:bg-[#1558B3]">保存</button>
        </div>
      </div>
    </div>
  );
}
