import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle, Info, ShieldAlert, Trash2 } from 'lucide-react';

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [modal, setModal] = useState({ isOpen: false, config: null });

    // --- TOAST LOGIC (Temporary Popups) ---
    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    }, []);

    // --- MODAL LOGIC (Are you sure? Dialogs) ---
    const askConfirmation = useCallback((config) => {
        return new Promise((resolve) => {
            setModal({
                isOpen: true,
                config: {
                    ...config,
                    onConfirm: () => {
                        setModal({ isOpen: false, config: null });
                        resolve(true);
                    },
                    onCancel: () => {
                        setModal({ isOpen: false, config: null });
                        resolve(false);
                    }
                }
            });
        });
    }, []);

    return (
        <FeedbackContext.Provider value={{ showToast, askConfirmation }}>
            {children}
            
            {/* Toast Overlay */}
            <div className="fixed top-6 right-6 z-2000 flex flex-col gap-3 w-full max-w-[320px]">
                {toasts.map(t => (
                    <div key={t.id} className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border animate-in slide-in-from-right duration-300
                        ${t.type === 'success' ? 'bg-white dark:bg-gray-800 border-green-500/20 text-green-600' : 
                          t.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 text-red-600' : 
                          'bg-navy-900 text-white border-navy-700'}`}>
                        {t.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span className="text-sm font-black tracking-tight">{t.message}</span>
                    </div>
                ))}
            </div>

            {/* Custom Modal Overlay */}
            {modal.isOpen && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-md animate-in fade-in">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="p-8 flex flex-col items-center text-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 
                                ${modal.config.danger ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                {modal.config.danger ? <Trash2 size={32} /> : <ShieldAlert size={32} />}
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                {modal.config.title}
                            </h3>
                            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                {modal.config.message}
                            </p>
                        </div>
                        <div className="flex gap-2 p-4 bg-gray-50 dark:bg-gray-800/50">
                            <button onClick={modal.config.onCancel} className="flex-1 px-4 py-3 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest cursor-pointer">
                                Cancel
                            </button>
                            <button onClick={modal.config.onConfirm} className={`flex-1 px-6 py-3 text-xs font-black text-white rounded-xl transition-all shadow-lg cursor-pointer
                                ${modal.config.danger ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 'bg-navy-900 hover:bg-navy-800 shadow-navy-500/20'}`}>
                                {modal.config.confirmText || 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </FeedbackContext.Provider>
    );
};

export const useFeedback = () => useContext(FeedbackContext);