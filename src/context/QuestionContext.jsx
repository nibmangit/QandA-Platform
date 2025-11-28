import { createContext, useContext, useState } from "react";

const QuestionContext = createContext();

export function QuestionProvider({ children }) {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text) => {
    setSearchText(text.toLowerCase());
  };

  return (
    <QuestionContext.Provider value={{ searchText, handleSearch }}>
      {children}
    </QuestionContext.Provider>
  );
}

export const useQuestions = () => useContext(QuestionContext);
