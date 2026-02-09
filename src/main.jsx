import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import {ThemeProvider} from './context/ThemeContext.jsx';
import { QuestionProvider } from './context/QuestionContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { TopUserProvider } from './context/topUserContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { BookmarkProvider } from './context/BookmarkContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider> 
        <TopUserProvider>
          <NotificationProvider>
            <BookmarkProvider>
        <ThemeProvider>
          <QuestionProvider>
            <App />
          </QuestionProvider>
        </ThemeProvider>
        </BookmarkProvider>
        </NotificationProvider>
        </TopUserProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
