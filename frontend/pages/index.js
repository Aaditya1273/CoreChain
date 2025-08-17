
import React from 'react'
import Head from 'next/head'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'

export default function Home() {
    const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()

  return (
    <div className="min-h-screen bg-hero">
      <Head>
        <title>CoreChain Climate Network</title>
        <meta name="description" content="Decentralized Physical Infrastructure for Climate Action" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
            <section id="stats-section" className="relative overflow-hidden section-professional">
        <div className="absolute inset-0 bg-green-glow opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/50 to-dark-900"></div>
        <div className="relative container-professional">
          <div className="text-center animate-fade-in">
            <div className="mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl mb-8 animate-pulse-glow">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold gradient-text text-glow mb-8 animate-slide-up">
                CoreChain Climate
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto mb-8 text-shadow">
                Decentralized Physical Infrastructure Network for Climate Action
              </p>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-16">
                Join the revolution in climate technology. Stake, earn, and contribute to a sustainable future through blockchain-powered environmental solutions.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
                            <button onClick={openConnectModal} className="btn-primary animate-slide-in-left">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Launch Dashboard
              </button>
                            <button onClick={() => document.getElementById('stats-section').scrollIntoView({ behavior: 'smooth' })} className="btn-secondary animate-slide-in-right">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Learn More
              </button>
            </div>

            {/* Dashboard Preview */}
            {isConnected ? (
              <div className="max-w-6xl mx-auto">
                <div className="card-professional p-10 animate-slide-up">
                  <h2 className="text-4xl font-bold gradient-text mb-6">
                    Welcome to CoreChain Climate Network
                  </h2>
                  <p className="text-gray-300 text-lg mb-10">
                    Your gateway to decentralized climate action is now active
                  </p>
                  
                  {/* Feature Cards */}
                  <div className="grid md:grid-cols-3 gap-8 mt-12">
                    <div className="card-glow p-8 group hover:scale-105 transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">Node Dashboard</h3>
                      <p className="text-gray-400">Monitor your climate nodes and track environmental impact in real-time</p>
                    </div>
                    
                    <div className="card-glow p-8 group hover:scale-105 transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">Carbon Credits</h3>
                      <p className="text-gray-400">Trade and stake carbon credits in the decentralized marketplace</p>
                    </div>
                    
                    <div className="card-glow p-8 group hover:scale-105 transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">Analytics</h3>
                      <p className="text-gray-400">View detailed analytics and environmental impact metrics</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                <div className="card-professional p-10 text-center animate-slide-up">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold gradient-text mb-6">
                    Connect Your Wallet
                  </h2>
                  <p className="text-gray-300 text-lg mb-8">
                    Connect your wallet to access the CoreChain Climate Network dashboard and start contributing to climate action.
                  </p>
                  <div className="flex justify-center">
                    <button onClick={openConnectModal} className="btn-primary">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Connect Wallet
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-professional bg-dark-800/50 backdrop-blur-xl border-y border-primary-500/20">
        <div className="container-professional">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold gradient-text mb-4">Network Statistics</h2>
            <p className="text-gray-400 text-lg">Real-time metrics from our global climate network</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center card-glass p-6 hover:card-glow transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-3 text-glow">1.2M+</div>
              <div className="text-gray-300 font-medium">Carbon Credits Issued</div>
              <div className="w-full bg-dark-700 rounded-full h-2 mt-3">
                <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
            <div className="text-center card-glass p-6 hover:card-glow transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-3 text-glow">850+</div>
              <div className="text-gray-300 font-medium">Active Nodes</div>
              <div className="w-full bg-dark-700 rounded-full h-2 mt-3">
                <div className="bg-gradient-to-r from-accent-500 to-primary-500 h-2 rounded-full" style={{width: '72%'}}></div>
              </div>
            </div>
            <div className="text-center card-glass p-6 hover:card-glow transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-3 text-glow">45K+</div>
              <div className="text-gray-300 font-medium">Community Members</div>
              <div className="w-full bg-dark-700 rounded-full h-2 mt-3">
                <div className="bg-gradient-to-r from-primary-600 to-accent-600 h-2 rounded-full" style={{width: '90%'}}></div>
              </div>
            </div>
            <div className="text-center card-glass p-6 hover:card-glow transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-3 text-glow">$2.8M</div>
              <div className="text-gray-300 font-medium">Total Value Locked</div>
              <div className="w-full bg-dark-700 rounded-full h-2 mt-3">
                <div className="bg-gradient-to-r from-accent-600 to-primary-600 h-2 rounded-full" style={{width: '68%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
