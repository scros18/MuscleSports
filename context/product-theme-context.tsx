"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'ordify' | 'musclesports' | 'lumify' | 'verap' | 'blisshair';

interface ProductThemeContextType {
  productTheme: Theme;
  setProductTheme: (theme: Theme) => void;
}

const ProductThemeContext = createContext<ProductThemeContextType>({
  productTheme: 'ordify',
  setProductTheme: () => {},
});

export function ProductThemeProvider({ children }: { children: ReactNode }) {
  const [productTheme, setProductTheme] = useState<Theme>('ordify');

  useEffect(() => {
    // Detect theme from document classes
    const detectTheme = () => {
      const classList = document.documentElement.classList;
      if (classList.contains('theme-musclesports')) {
        setProductTheme('musclesports');
      } else if (classList.contains('theme-lumify')) {
        setProductTheme('lumify');
      } else if (classList.contains('theme-vera')) {
        setProductTheme('verap');
      } else if (classList.contains('theme-blisshair')) {
        setProductTheme('blisshair');
      } else {
        setProductTheme('ordify');
      }
    };

    detectTheme();

    // Watch for theme changes
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <ProductThemeContext.Provider value={{ productTheme, setProductTheme }}>
      {children}
    </ProductThemeContext.Provider>
  );
}

export function useProductTheme() {
  return useContext(ProductThemeContext);
}

// Helper function to add theme parameter to API URLs
export function addThemeParam(url: string, theme: Theme): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}theme=${theme}`;
}
