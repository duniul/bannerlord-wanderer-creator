import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Wanderer } from '../types/wanderers';

const LOCAL_STORAGE_KEY = 'wanderers';

interface ModOptionsProviderProps {
  children: React.ReactNode;
}

interface ModOptionsContextContent {
  modName: string;
  modVersion: string;
  wanderers: Wanderer[];
  setModName: React.Dispatch<React.SetStateAction<string>>;
  setModVersion: React.Dispatch<React.SetStateAction<string>>;
  setWanderers: React.Dispatch<React.SetStateAction<Wanderer[]>>;
}

const ModOptionsContext = React.createContext({});

export const ModOptionsProvider = ({ children }: ModOptionsProviderProps) => {
  const [modName, setModName] = useState<string>('');
  const [modVersion, setModVersion] = useState<string>('');
  const [wanderers, setWanderers] = useState<Wanderer[]>([]);

  useEffect(() => {
    const storedWanderersString = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (storedWanderersString) {
      const storedWanderers = JSON.parse(storedWanderersString) as Wanderer[];
      setWanderers(storedWanderers);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wanderers) as any);
  }, [wanderers]);

  const value = useMemo(
    () => ({
      modName,
      modVersion,
      wanderers,
      setModName,
      setModVersion,
      setWanderers,
    }),
    [modName, modVersion, wanderers]
  );

  return <ModOptionsContext.Provider value={value}>{children}</ModOptionsContext.Provider>;
};

export const useModOptions = (): ModOptionsContextContent => {
  return useContext(ModOptionsContext) as ModOptionsContextContent;
};
