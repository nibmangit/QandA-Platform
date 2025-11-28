import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './FinalQA.jsx'
import {ThemeProvider} from './context/ThemeContext.jsx';
import { QuestionProvider } from './context/QuestionContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> 
    <ThemeProvider>
      <QuestionProvider>
      <App />
    </QuestionProvider>
    </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
