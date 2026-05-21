import { useState, useEffect } from 'react';

export function navigate(hash) {
  window.location.hash = hash;
}

export function useRoute() {
  const [hash, setHash] = useState(window.location.hash || '#/login');

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash || '#/login');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return hash;
}
