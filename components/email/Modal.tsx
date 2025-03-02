'use client';

import React, { useState, useEffect } from 'react';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { IDEmail } from '@/types';
import { api } from '@/lib/api';
import 'draft-js/dist/Draft.css';

interface ModalProps {
  emailId: number;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ emailId, onClose }) => {
  const [email, setEmail] = useState<IDEmail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editorState, setEditorState] = useState<EditorState | null>(null);

  useEffect(() => {
    const getEmail = async () => {
      try {
        const data = await api.IDEmail(emailId);

        const emailData: IDEmail = {
          ...data,
          message: data.message || '', 
        };

        setEmail(emailData);

        try {
          const contentState = convertFromRaw(JSON.parse(emailData.message));
          const state = EditorState.createWithContent(contentState);
          setEditorState(state);
        } catch (error) {
          console.error('Ошибка при парсинге сообщения:', error);
          setError('Ошибка при парсинге тела письма');
        }

        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке письма:', error);
        setError('Ошибка при загрузке письма');
        setLoading(false);
      }
    };

    getEmail();
  }, [emailId]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center">{error}</div>;
  }

  if (!email) {
    return <div className="text-center">Letter not found</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-gray-900">
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">{email.subject}</h2>
        <p className="mb-2"><strong>Sender:</strong> {email.sender}</p>
        <p className="mb-2"><strong>Recipient:</strong> {email.recipient}</p>
        <div className="border p-3 rounded">
          <h3 className="font-semibold mb-2">Letter body:</h3>
          {editorState ? (
            <div className="border p-2 bg-gray-50 min-h-[150px]">
              <Editor 
                editorState={editorState} 
                readOnly={true}
                onChange={() => {}} 
              />
            </div>
          ) : (
            <div className="text-red-500">Failed to display message</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
