import './globals.css'
import { Inter, Poppins } from 'next/font/google'
import AuthProvider from '../components/AuthProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata = {
  title: 'WanderMatch - Meet Travelers & Locals Worldwide',
  description: 'Premium travel dating and networking platform. Connect with travelers and locals wherever your journey takes you.',
  keywords: 'travel dating, meet travelers, local guides, travel networking, wanderlust',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}