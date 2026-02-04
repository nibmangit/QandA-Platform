import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import {ThemeProvider} from './context/ThemeContext.jsx';
import { QuestionProvider } from './context/QuestionContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { TopUserProvider } from './context/topUserContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider> 
        <TopUserProvider>
        <ThemeProvider>
          <QuestionProvider>
            <App />
          </QuestionProvider>
        </ThemeProvider>
        </TopUserProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
