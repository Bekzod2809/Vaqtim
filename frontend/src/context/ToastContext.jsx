import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [xabarlar, setXabarlar] = useState([]);

  const korsat = useCallback((matn, turi = 'muvaffaqiyat') => {
    const id = Date.now() + Math.random();
    setXabarlar((eski) => [...eski, { id, matn, turi }]);
    setTimeout(() => setXabarlar((eski) => eski.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={korsat}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
        {xabarlar.map((x) => (
          <div
            key={x.id}
            role="status"
            className={`flex max-w-sm animate-toast items-center gap-3 border-l-2 bg-qora-2 px-5 py-4 text-sm text-krem shadow-2xl shadow-black/50 ${
              x.turi === 'xato' ? 'border-red-500' : 'border-oltin'
            }`}
          >
            <span className={x.turi === 'xato' ? 'text-red-400' : 'text-oltin'}>{x.turi === 'xato' ? '!' : '✓'}</span>
            {x.matn}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
