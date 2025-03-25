// pages/_app.js
import '../styles/globals.css'
import '../styles/animations.css'
import { LanguageProvider } from '../components/i18n/LanguageContext'

function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  )
}

export default MyApp
