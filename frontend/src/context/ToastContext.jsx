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
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {xabarlar.map((x) => (
          <div
            key={x.id}
            className={`max-w-sm rounded-md px-4 py-3 text-sm text-white shadow-lg ${
              x.turi === 'xato' ? 'bg-red-600' : 'bg-gray-900'
            }`}
          >
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
