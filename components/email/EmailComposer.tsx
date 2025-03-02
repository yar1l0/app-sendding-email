'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { api } from '@/lib/api';
import { EditorState, RichUtils, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'draft-js/dist/Draft.css';
import dynamic from 'next/dynamic';


const Editor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), {
  ssr: false, 
});


interface EmailComposerProps {
  user: User;
  onEmailSent: () => void;
}

export const EmailComposer: React.FC<EmailComposerProps> = ({ user, onEmailSent }) => {
  const [showCompose, setShowCompose] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    
    try {
      const contentState = editorState.getCurrentContent();
      const rawContent = JSON.stringify(convertToRaw(contentState));

      await api.sendEmail({
        sender: user.id,
        recipient,
        subject,
        message: rawContent
      });

      setRecipient('');
      setSubject('');
      setEditorState(EditorState.createEmpty());
      setShowCompose(false);
      onEmailSent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <button
        onClick={() => setShowCompose(!showCompose)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {showCompose ? 'Cancel' : 'New letter'}
      </button>
      
      {showCompose && (
        <div className="mt-4 border p-4 rounded">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSendEmail}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Sender</label>
              <input
                type="text"
                value={user.email}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Recipient</label>
              <input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Topic</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Text of the letter</label>
              <div className="border rounded">
                <Editor
                  editorState={editorState}
                  onEditorStateChange={setEditorState}
                  handleKeyCommand={handleKeyCommand}
                  toolbarClassName="border-b"
                  editorClassName="px-4 py-2 min-h-32"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={sending}
              className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${
                sending ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};