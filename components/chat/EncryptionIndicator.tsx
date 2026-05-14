'use client'
import React from 'react';
import { EncryptionStatus } from './types';

interface EncryptionIndicatorProps {
  status: EncryptionStatus;
}

const EncryptionIndicator: React.FC<EncryptionIndicatorProps> = ({ status }) => {
  return (
    <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
      <div className="flex items-center space-x-1">
        {status.isEncrypted ? (
          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
        )}
        
        <span className={`text-sm font-medium ${
          status.isEncrypted 
            ? 'text-green-700 dark:text-green-300' 
            : 'text-red-700 dark:text-red-300'
        }`}>
          {status.isEncrypted ? 'Encrypted' : 'Not Encrypted'}
        </span>
      </div>
      
      {status.isEncrypted && (
        <div className="text-xs text-green-600 dark:text-green-400">
          {status.algorithm}
        </div>
      )}
    </div>
  );
};

export default EncryptionIndicator;
