import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from './context/AuthContext'
import { PollProvider } from './context/PollContext'
import Header from './components/Header'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: 'E-Cell Club Polling System – Smart Decisions, Instantly',
    template: '%s | E-Cell Polling',
  },
  description: 'The E-Cell Club Polling System is a secure, real-time decision-making platform built to simplify how the club gathers opinions, conducts internal voting, and drives collective choices. Whether it’s selecting event themes, electing board members, or collecting member feedback, the system ensures fair participation, transparency, and instant insights.',
  keywords: ['E-Cell Club', 'Polling System', 'Real-time voting', 'Decision-making', 'Secure voting', 'Student Club', 'Voting Platform'],
  authors: [{ name: 'E-Cell Team' }],
  openGraph: {
    title: 'E-Cell Club Polling System – Smart Decisions, Instantly',
    description: 'The E-Cell Club Polling System is a secure, real-time decision-making platform built to simplify how the club gathers opinions, conducts internal voting, and drives collective choices.',
    siteName: 'E-Cell Club Polling System',
    images: [
      {
        url: '/E-cell Logo.svg',
        width: 800,
        height: 600,
        alt: 'E-Cell Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-Cell Club Polling System – Smart Decisions, Instantly',
    description: 'The E-Cell Club Polling System is a secure, real-time decision-making platform built to simplify how the club gathers opinions, conducts internal voting, and drives collective choices.',
    images: ['/E-cell Logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=EB+Garamond:ital@0;1&family=Space+Mono&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
        <AuthProvider>
          <PollProvider>
            <Header />
            {children}
            <Footer />
            <AuthModal />
          </PollProvider>
        </AuthProvider>
      </body>
    </html>
  )
}