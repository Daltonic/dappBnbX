import { ToastContainer } from 'react-toastify'
import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import '@rainbow-me/rainbowkit/styles.css'
import 'react-datepicker/dist/react-datepicker.css'
import { useEffect, useState } from 'react'
import Providers from '@/services/provider'
import { Footer, Header } from '@/components'
import { Provider } from 'react-redux'
import { store } from '@/store'

export default function App({ Component, pageProps }) {
  const [showChild, setShowChild] = useState(false)

  useEffect(() => {
    setShowChild(true)
  }, [])

  if (!showChild || typeof window === 'undefined') {
    return null
  } else {
    return (
      <Providers pageProps={pageProps}>
        <Provider store={store}>
          <div className="relative h-screen min-w-screen">
            <Header />
            <Component {...pageProps} />
            <div className="h-20"></div>
            <Footer />
          </div>

          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </Provider>
      </Providers>
    )
  }
}
