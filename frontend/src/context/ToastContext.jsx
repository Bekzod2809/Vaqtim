import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const show = useCallback((text, type = 'muvaffaqiyat') => {
    const id = Date.now() + Math.random();
    setMessages((old) => [...old, { id, text, type }]);
    setTimeout(() => setMessages((old) => old.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-5 z-50 flex flex-col gap-3 sm:left-auto sm:right-5 sm:inset-x-auto">
        {messages.map((x) => (
          <div
            key={x.id}
            role="status"
            className={`pointer-events-auto flex w-full animate-toast items-center gap-3 border-l-2 bg-dark-2 px-4 py-3.5 text-sm text-cream shadow-2xl shadow-black/50 sm:w-auto sm:max-w-sm sm:px-5 sm:py-4 ${
              x.type === 'xato' ? 'border-red-500' : 'border-gold'
            }`}
          >
            <span className={`shrink-0 ${x.type === 'xato' ? 'text-red-400' : 'text-gold'}`}>{x.type === 'xato' ? '!' : '✓'}</span>
            {x.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
