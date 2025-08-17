import React from 'react'
import Head from 'next/head'
import { useAccount } from '../../lib/account'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50">
      <Head>
        <title>CoreChain Climate Network</title>
        <meta name="description" content="Decentralized Physical Infrastructure for Climate Action" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-teal-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-6">
                CoreChain Climate
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
                Decentralized Physical Infrastructure Network for Climate Action
              </p>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
                Join the revolution in climate technology. Stake, earn, and contribute to a sustainable future through blockchain-powered environmental solutions.
              </p>
            </div>

            {!isConnected ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto shadow-xl border border-white/20">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Connect Your Wallet</h2>
                  <p className="text-gray-600">
                    Connect your wallet to access the CoreChain Climate Network and start earning carbon credits
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Welcome to CoreChain Climate Network
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your gateway to decentralized climate action is now active
                  </p>
                  
                  {/* Feature Cards */}
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-gradient-to-br from-green-500 to-teal-600 p-6 rounded-xl text-white">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Node Dashboard</h3>
                      <p className="text-green-100 text-sm">Monitor your climate nodes and track environmental impact</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-xl text-white">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Carbon Credits</h3>
                      <p className="text-blue-100 text-sm">Trade and stake carbon credits in the decentralized marketplace</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-xl text-white">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                      <p className="text-purple-100 text-sm">View detailed analytics and environmental impact metrics</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">1.2M+</div>
              <div className="text-gray-600">Carbon Credits Issued</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">850+</div>
              <div className="text-gray-600">Active Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-600 mb-2">45K+</div>
              <div className="text-gray-600">Community Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">$2.8M</div>
              <div className="text-gray-600">Total Value Locked</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
