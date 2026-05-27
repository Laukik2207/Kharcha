import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="bg-black text-surface-50 selection:bg-white selection:text-black min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 right-0 left-0 flex justify-between items-center px-6 md:px-10 h-20 bg-surface-900/80 backdrop-blur-xl z-40 border-b border-white/5 shadow-2xl shadow-black/50 animate-fade-in">
        <div className="flex items-center gap-4">
          <span className="font-display text-2xl font-bold tracking-tighter text-white">KHA<span className="text-white">₹</span>CHA</span>
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/" className="font-sans text-lg text-white font-bold transition-opacity">Home</Link>
          <a className="font-sans text-lg text-surface-300 opacity-60 hover:text-white hover:opacity-100 transition-opacity" href="#features">Features</a>
          <a className="font-sans text-lg text-surface-300 opacity-60 hover:text-white hover:opacity-100 transition-opacity" href="#contact">Contact</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/register" className="px-4 py-2 bg-white text-black font-medium text-sm rounded-lg hover:scale-95 transition-transform duration-200">
            Sign Up
          </Link>
        </div>
      </header>
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex flex-col items-center justify-center hero-gradient px-6 md:px-10 overflow-hidden">
          <div className="z-10 text-center max-w-[800px]">
            <h1 className="font-display text-[56px] md:text-[88px] text-white leading-tight mb-6 font-semibold tracking-tight animate-fade-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
              Expense Intelligence,<br /><span className="opacity-40 italic">Refined.</span>
            </h1>
            <p className="font-sans text-lg text-surface-300 max-w-[500px] mx-auto mb-12 animate-fade-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
              A high-end concierge for your financial data. Automated, invisible, and absolutely precise.
            </p>
          </div>
          
          {/* Preview Card (Glassmorphism) */}
          <div className="mt-20 w-full max-w-5xl mx-auto relative perspective-1000 group animate-fade-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
            <div className="glass-card rounded-2xl p-10 md:p-16 transition-all duration-700 ease-out transform [transform:rotateY(-12deg)_rotateX(-28deg)_scale(0.9)] group-hover:[transform:rotateY(0deg)_rotateX(0deg)_scale(1)] hover:shadow-[0_0_80px_rgba(255,255,255,0.1)]">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                    <span className="font-mono text-xs uppercase tracking-widest opacity-50 text-white">AI Insight Engine</span>
                  </div>
                  <h3 className="font-display text-2xl text-white mb-4">Your lifestyle burn rate has decreased by 12.4% this quarter.</h3>
                  <div className="w-full h-[1px] bg-white/10 my-6"></div>
                  <div className="flex gap-6">
                    <div>
                      <p className="font-mono text-xs text-surface-300 opacity-50 uppercase">Optimization</p>
                      <p className="font-display text-2xl text-white">+₹1,240.00</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs text-surface-300 opacity-50 uppercase">Efficiency</p>
                      <p className="font-display text-2xl text-white">98.2%</p>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-4 flex flex-col justify-end">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between mb-2">
                      <span className="font-sans text-sm text-surface-300">Merchant Confidence</span>
                      <span className="font-sans text-sm text-white">High</span>
                    </div>
                    <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                      <div className="bg-white h-full w-[95%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Decorative Glow */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[120px] -z-10"></div>
          </div>
        </section>
        
        {/* Transactions Ticker */}
        <section className="py-16 border-y border-white/5 bg-surface-950 overflow-hidden h-[300px] flex items-center animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
          <div className="flex flex-col gap-6 marquee-mask w-full">
            {/* Row 1: Moving Left */}
            <div className="flex w-fit">
              <div className="flex shrink-0 scrolling-ticker-left gap-10 px-5 items-center">
                {['+₹1,240.00', '-₹85.50', '+₹4,500.00', '-₹120.00', '-₹3,400.00', '+₹890.00', '-₹45.00', '+₹12,000.00', '-₹99.99', '+₹350.00', '-₹1,200.00', '+₹800.00', '-₹450.00', '+₹2,100.00', '-₹15.00'].map((tx, i) => (
                  <span key={`r1a-${i}`} className={`font-mono text-xl md:text-2xl font-bold tracking-tight ${tx.startsWith('+') ? 'text-white opacity-80' : 'text-white opacity-20'}`}>{tx}</span>
                ))}
              </div>
              <div className="flex shrink-0 scrolling-ticker-left gap-10 px-5 items-center" aria-hidden="true">
                {['+₹1,240.00', '-₹85.50', '+₹4,500.00', '-₹120.00', '-₹3,400.00', '+₹890.00', '-₹45.00', '+₹12,000.00', '-₹99.99', '+₹350.00', '-₹1,200.00', '+₹800.00', '-₹450.00', '+₹2,100.00', '-₹15.00'].map((tx, i) => (
                  <span key={`r1b-${i}`} className={`font-mono text-xl md:text-2xl font-bold tracking-tight ${tx.startsWith('+') ? 'text-white opacity-80' : 'text-white opacity-20'}`}>{tx}</span>
                ))}
              </div>
            </div>

            {/* Row 2: Moving Right */}
            <div className="flex w-fit">
              <div className="flex shrink-0 scrolling-ticker-right gap-10 px-5 items-center">
                {['-₹1,200.00', '+₹800.00', '-₹450.00', '+₹2,100.00', '-₹15.00', '+₹5,600.00', '-₹890.00', '+₹150.00', '-₹3,200.00', '+₹75.00', '+₹1,240.00', '-₹85.50', '+₹4,500.00', '-₹120.00', '-₹3,400.00'].map((tx, i) => (
                  <span key={`r2a-${i}`} className={`font-mono text-xl md:text-2xl font-bold tracking-tight ${tx.startsWith('+') ? 'text-white opacity-60' : 'text-white opacity-10'}`}>{tx}</span>
                ))}
              </div>
              <div className="flex shrink-0 scrolling-ticker-right gap-10 px-5 items-center" aria-hidden="true">
                {['-₹1,200.00', '+₹800.00', '-₹450.00', '+₹2,100.00', '-₹15.00', '+₹5,600.00', '-₹890.00', '+₹150.00', '-₹3,200.00', '+₹75.00', '+₹1,240.00', '-₹85.50', '+₹4,500.00', '-₹120.00', '-₹3,400.00'].map((tx, i) => (
                  <span key={`r2b-${i}`} className={`font-mono text-xl md:text-2xl font-bold tracking-tight ${tx.startsWith('+') ? 'text-white opacity-60' : 'text-white opacity-10'}`}>{tx}</span>
                ))}
              </div>
            </div>

            {/* Row 3: Moving Left */}
            <div className="flex w-fit">
              <div className="flex shrink-0 scrolling-ticker-left gap-10 px-5 items-center" style={{ animationDuration: '45s' }}>
                {['+₹250.00', '-₹1,500.00', '+₹3,200.00', '-₹99.00', '-₹4,100.00', '+₹600.00', '-₹15.00', '+₹9,000.00', '-₹55.50', '+₹850.00', '-₹2,200.00', '+₹1,100.00', '-₹650.00', '+₹1,800.00', '-₹25.00'].map((tx, i) => (
                  <span key={`r3a-${i}`} className={`font-mono text-xl md:text-2xl font-bold tracking-tight ${tx.startsWith('+') ? 'text-white opacity-70' : 'text-white opacity-15'}`}>{tx}</span>
                ))}
              </div>
              <div className="flex shrink-0 scrolling-ticker-left gap-10 px-5 items-center" aria-hidden="true" style={{ animationDuration: '45s' }}>
                {['+₹250.00', '-₹1,500.00', '+₹3,200.00', '-₹99.00', '-₹4,100.00', '+₹600.00', '-₹15.00', '+₹9,000.00', '-₹55.50', '+₹850.00', '-₹2,200.00', '+₹1,100.00', '-₹650.00', '+₹1,800.00', '-₹25.00'].map((tx, i) => (
                  <span key={`r3b-${i}`} className={`font-mono text-xl md:text-2xl font-bold tracking-tight ${tx.startsWith('+') ? 'text-white opacity-70' : 'text-white opacity-15'}`}>{tx}</span>
                ))}
              </div>
            </div>

            {/* Row 4: Moving Right */}
            <div className="flex w-fit">
              <div className="flex shrink-0 scrolling-ticker-right gap-10 px-5 items-center" style={{ animationDuration: '50s' }}>
                {['-₹800.00', '+₹400.00', '-₹250.00', '+₹1,100.00', '-₹5.00', '+₹3,600.00', '-₹490.00', '+₹100.00', '-₹2,200.00', '+₹45.00', '+₹840.00', '-₹35.50', '+₹2,500.00', '-₹80.00', '-₹1,400.00'].map((tx, i) => (
                  <span key={`r4a-${i}`} className={`font-mono text-xl md:text-2xl font-bold tracking-tight ${tx.startsWith('+') ? 'text-white opacity-50' : 'text-white opacity-25'}`}>{tx}</span>
                ))}
              </div>
              <div className="flex shrink-0 scrolling-ticker-right gap-10 px-5 items-center" aria-hidden="true" style={{ animationDuration: '50s' }}>
                {['-₹800.00', '+₹400.00', '-₹250.00', '+₹1,100.00', '-₹5.00', '+₹3,600.00', '-₹490.00', '+₹100.00', '-₹2,200.00', '+₹45.00', '+₹840.00', '-₹35.50', '+₹2,500.00', '-₹80.00', '-₹1,400.00'].map((tx, i) => (
                  <span key={`r4b-${i}`} className={`font-mono text-xl md:text-2xl font-bold tracking-tight ${tx.startsWith('+') ? 'text-white opacity-50' : 'text-white opacity-25'}`}>{tx}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Bento Grid */}
        <section id="features" className="py-20 max-w-[1440px] mx-auto px-6 md:px-10 animate-fade-up" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div className="max-w-[600px]">
              <h2 className="font-display text-[40px] md:text-5xl text-white mb-4">Everything you need to master your capital.</h2>
              <p className="font-sans text-lg text-surface-300">We've removed the noise so you can focus on the signals that actually matter for your wealth.</p>
            </div>
            <div className="flex gap-2">
              <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-white">
                <span className="material-symbols-outlined">west</span>
              </button>
              <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-white">
                <span className="material-symbols-outlined">east</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Large Feature 1 */}
            <div className="md:col-span-8 bg-surface-800 rounded-2xl p-10 border border-white/5 overflow-hidden group">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <span className="material-symbols-outlined text-[40px] text-white mb-6 font-light">receipt_long</span>
                  <h3 className="font-display text-2xl text-white mb-2">Statement Intelligence</h3>
                  <p className="font-sans text-lg text-surface-300 max-w-sm">Upload any bank statement. Our AI deciphers complex billing and finds hidden subscriptions instantly.</p>
                </div>
                <div className="mt-12 relative h-40 mask-fade">
                  <div className="absolute inset-0 flex flex-col gap-2">
                    <div className="h-10 w-full bg-white/5 rounded flex items-center px-4 justify-between border-l-2 border-white">
                      <span className="font-mono text-xs text-surface-300">Cloud Services</span>
                      <span className="font-mono text-xs text-white">₹499.00</span>
                    </div>
                    <div className="h-10 w-4/5 bg-white/5 rounded flex items-center px-4 justify-between opacity-60">
                      <span className="font-mono text-xs text-surface-300">Corporate Travel</span>
                      <span className="font-mono text-xs text-white">₹1,250.00</span>
                    </div>
                    <div className="h-10 w-3/4 bg-white/5 rounded flex items-center px-4 justify-between opacity-40">
                      <span className="font-mono text-xs text-surface-300">Executive Dining</span>
                      <span className="font-mono text-xs text-white">₹320.50</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Small Feature 1 */}
            <div className="md:col-span-4 bg-surface-800 rounded-2xl p-10 border border-white/5 hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined text-[40px] text-white mb-6 font-light">cloud_upload</span>
              <h3 className="font-display text-2xl text-white mb-2">Automatic Categorization</h3>
              <p className="font-sans text-sm text-surface-300">Zero manual tagging. We learn your spending patterns and categorize every cent with 99.9% accuracy.</p>
            </div>
            
            {/* Small Feature 2 */}
            <div className="md:col-span-4 bg-surface-800 rounded-2xl p-10 border border-white/5 hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined text-[40px] text-white mb-6 font-light">leaderboard</span>
              <h3 className="font-display text-2xl text-white mb-2">Visual Analytics</h3>
              <p className="font-sans text-sm text-surface-300">Sophisticated grayscale charts that highlight trends without the clutter of traditional dashboards.</p>
            </div>
            
            {/* Large Feature 2 */}
            <div className="md:col-span-8 bg-surface-800 rounded-2xl p-10 border border-white/5 relative group overflow-hidden">
              <div className="flex flex-col h-full justify-between z-10 relative">
                <div>
                  <span className="material-symbols-outlined text-[40px] text-white mb-6 font-light">psychology</span>
                  <h3 className="font-display text-2xl text-white mb-2">Predictive Insights</h3>
                  <p className="font-sans text-lg text-surface-300 max-w-sm">Anticipate future cash flows and receive alerts on unusual spending before they impact your net worth.</p>
                </div>
                <div className="flex gap-2 mt-8">
                  <span className="px-4 py-1 rounded-full bg-white/10 font-mono text-xs text-white">ML Models</span>
                  <span className="px-4 py-1 rounded-full bg-white/10 font-mono text-xs text-white">Real-time</span>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-[100px] group-hover:bg-white/10 transition-colors"></div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden animate-fade-up" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
          <div className="max-w-[1440px] mx-auto px-6 md:px-10">
            <div className="glass-card rounded-[32px] p-12 md:p-24 text-center border-white/10">
              <h2 className="font-display text-[40px] md:text-5xl text-white mb-6">Experience the future of finance.</h2>
              <p className="font-sans text-lg text-surface-300 max-w-[550px] mx-auto mb-12">Join our exclusive circle of users and start refining your capital intelligence today.</p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link to="/register" className="glow-button px-12 py-5 bg-white text-black font-sans font-bold rounded-xl text-lg">
                  Sign Up
                </Link>
                <Link to="/login" className="px-12 py-5 bg-transparent text-white font-sans font-bold rounded-xl text-lg border border-white/20 hover:bg-white/5 transition-colors">
                  Sign In
                </Link>
              </div>
              <p className="font-mono text-[10px] text-surface-300 opacity-40 uppercase tracking-widest mt-6">No credit card required</p>
            </div>
          </div>
          {/* Decorative Background Element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full -z-10 opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full -z-10 opacity-40"></div>
        </section>
      </main>
      
      {/* Footer */}
      <footer id="contact" className="py-20 bg-black border-t border-white/5 px-6 md:px-10 animate-fade-in" style={{ animationDelay: '700ms', animationFillMode: 'both' }}>
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <span className="font-display text-2xl font-bold tracking-tighter text-white block mb-6">KHA<span className="text-white">₹</span>CHA</span>
            <p className="font-sans text-sm text-surface-300 opacity-60 max-w-[300px]">The definitive platform for financial intelligence. Built for those who demand precision and elegance in every transaction.</p>
          </div>
          <div className="md:col-span-4">
            <h4 className="font-mono text-xs text-white uppercase tracking-widest mb-6">Connect</h4>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/laukik-deshmukh-link2207/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white hover:text-primary-400">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://github.com/Laukik2207" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white hover:text-primary-400">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="font-sans text-[12px] text-surface-200 opacity-40">
            Made by Laukik Deshmukh
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
