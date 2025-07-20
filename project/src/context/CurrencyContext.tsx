import React from 'react';

export type CurrencyType = 'KES' | 'USD' | 'GBP' | 'EUR';

export const CurrencyContext = React.createContext<{
  activeCurrency: CurrencyType;
  setActiveCurrency: (currency: CurrencyType) => void;
}>(
  {
    activeCurrency: 'KES',
    setActiveCurrency: () => {},
  }
); 