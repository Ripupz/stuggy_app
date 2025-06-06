import React, { createContext, useContext, useState } from "react";

type ScoreEntry = { semester: string; score: number };
type Course = { id: string; name: string; scoreData: ScoreEntry[] };

type ScoreContextType = {
  userCourses: Course[];
  setUserCourses: React.Dispatch<React.SetStateAction<Course[]>>;
};

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const ScoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  return (
    <ScoreContext.Provider value={{ userCourses, setUserCourses }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => {
  const ctx = useContext(ScoreContext);
  if (!ctx) throw new Error("useScore must be used within a ScoreProvider");
  return ctx;
};