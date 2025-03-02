'use client';

import React, { useState, useEffect } from 'react';
import { Email, PaginationData } from '@/types';
import { api } from '@/lib/api';
import Modal from './Modal';


interface EmailListProps {
  initialData?: PaginationData;
  refreshTrigger: number;
}

export const EmailList: React.FC<EmailListProps> = ({ initialData, refreshTrigger }) => {
  const [emails, setEmails] = useState<Email[]>(initialData?.results || []);
  const [pagination, setPagination] = useState({
    count: initialData?.count || 0,
    next: initialData?.next || null,
    previous: initialData?.previous || null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEmailId, setSelectedEmailId] = useState<number | null>(null);

  const openModal = (emailId: number) => {
    setSelectedEmailId(emailId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmailId(null);
  };


  const fetchEmails = async (page: number) => {
    setLoading(true);
    try {
      const data = await api.getEmails(page);
      setEmails(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous
      });
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error getting list of letters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails(1);
  }, [refreshTrigger]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Sent letters</h2>
      <p className='mb-[16px] underline text-[21px]  text-center'>Total emails {pagination.count}</p>
      {error && ( 
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Topic
                  </th>
                </tr>
              </thead>
              <tbody>
                {emails.length > 0 ? (
                  emails.map((email) => (
                    <tr key={email.id} onClick={() => openModal(email.id)} className='cursor-pointer'>
                      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                        {email.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                        {email.recipient}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                        {email.subject}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center border-b border-gray-200">
                      No emails sent
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {isModalOpen && selectedEmailId && (
            <Modal emailId={selectedEmailId} onClose={closeModal} />
          )}
          {pagination.count > 0 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => pagination.previous && fetchEmails(currentPage - 1)}
                disabled={!pagination.previous}
                className={`px-4 py-2 rounded ${pagination.previous ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500'
                  }`}
              >
                Previous
              </button>

              <span>
              Page {currentPage} from {Math.ceil(pagination.count / 5)} 
              </span>
              
              
              <button
                onClick={() => pagination.next && fetchEmails(currentPage + 1)}
                disabled={!pagination.next}
                className={`px-4 py-2 rounded ${pagination.next ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500'
                  }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};