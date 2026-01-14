import React, { createContext, useState, useContext, type ReactNode } from 'react';
import type { Product } from '../types';

interface SelectedItem extends Product {
  quantity: number;
}

interface GiftSelectionContextType {
  selectedItems: SelectedItem[];
  selectGift: (product: Product) => void;
  removeGift: (productId: string) => void;
  clearSelection: () => void;
  getSelectionTotal: () => number;
  getItemCount: () => number;
}

const GiftSelectionContext = createContext<GiftSelectionContextType | undefined>(undefined);

export const GiftSelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const selectGift = (product: Product) => {
    setSelectedItems(prevItems => {
      const isItemInSelection = prevItems.find(item => item.id === product.id);
      if (isItemInSelection) {
        return prevItems;
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeGift = (productId: string) => {
    setSelectedItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const getSelectionTotal = () => {
    return selectedItems.reduce((total, item) => total + item.value * item.quantity, 0);
  };

  const getItemCount = () => {
    return selectedItems.reduce((count, item) => count + item.quantity, 0);
  }

  return (
    <GiftSelectionContext.Provider value={{ selectedItems, selectGift, removeGift, clearSelection, getSelectionTotal, getItemCount }}>
      {children}
    </GiftSelectionContext.Provider>
  );
};

export const useGiftSelection = () => {
  const context = useContext(GiftSelectionContext);
  if (context === undefined) {
    throw new Error('useGiftSelection must be used within a GiftSelectionProvider');
  }
  return context;
};