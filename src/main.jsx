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
import { FeedbackProvider } from './context/FeedbackContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider> 
        <TopUserProvider>
          <NotificationProvider>
            <FeedbackProvider>
            <BookmarkProvider>
            <ThemeProvider>
              <QuestionProvider>
                <App />
              </QuestionProvider>
            </ThemeProvider>
          </BookmarkProvider>
          </FeedbackProvider>
        </NotificationProvider>
        </TopUserProvider>
      </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
)
