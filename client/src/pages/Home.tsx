import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Lock, ShieldCheck } from "lucide-react";

const Particles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 55 }).map((_, i) => {
      const sz = Math.random() * 3 + 1;
      const isGold = Math.random() > 0.7;
      const hue = isGold ? "200, 168, 110" : "32, 96, 200";
      return (
        <div
          key={i}
          className="absolute rounded-full opacity-0 animate-float"
          style={{
            width: `${sz}px`,
            height: `${sz}px`,
            background: `rgba(${hue}, 0.7)`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 14}s`,
            animationDelay: `${Math.random() * 12}s`,
          }}
        />
      );
    });
  }, []);

  return <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">{particles}</div>;
};

export default function Home() {
  const [started, setStarted] = useState(false);
  const [remaining, setRemaining] = useState(90);
  const [unlocked, setUnlocked] = useState(false);
  const videoRef = useRef<HTMLElement>(null);
  
  const m = Math.floor(remaining / 60);
  const sec = remaining % 60;
  const timeStr = `${m}:${sec < 10 ? '0' : ''}${sec}`;
  
  // Perimeter for SVG rect ring: 2 * (width + height) = 2 * (296 + 56)
  const perim = 2 * (296 + 56);
  const progress = ((90 - remaining) / 90) * perim;
  
  useEffect(() => {
    if (!started || remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          setUnlocked(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, remaining]);

  const progressPercentage = ((90 - remaining) / 90) * 100;

  return (
    <div className="bg-[#030d1a] min-h-screen text-[#e8eef8] font-sans overflow-x-hidden selection:bg-[#2060c8] selection:text-white">
      <Particles />
      <div 
        className="fixed inset-0 pointer-events-none z-[1]" 
        style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(3,13,26,0.85) 100%)' }} 
      />
      
      {/* HERO SECTION */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center" 
        style={{ 
          background: 'radial-gradient(ellipse 120% 60% at 50% 0%, rgba(32,96,200,0.18) 0%, transparent 70%), linear-gradient(180deg, #030d1a 0%, #050f20 100%)' 
        }}>
        
        {/* Fog Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute rounded-full blur-[80px] animate-drift" 
            style={{ width: 600, height: 300, background: 'rgba(32,96,200,0.12)', top: '10%', left: '-10%', animationDuration: '22s' }} />
          <div className="absolute rounded-full blur-[80px] animate-drift" 
            style={{ width: 500, height: 250, background: 'rgba(10,50,120,0.15)', top: '30%', right: '-5%', animationDuration: '16s', animationDirection: 'reverse' }} />
        </div>
        
        <div className="text-[0.7rem] tracking-[0.35em] uppercase text-[#c8a96e] opacity-85 mb-7 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Sofia de Luca · Restricted Access
        </div>
        
        <h1 className="font-serif text-[clamp(2.2rem,5.5vw,4.2rem)] font-bold leading-[1.12] max-w-[820px] animate-fade-up" 
          style={{
            background: 'linear-gradient(135deg, #e8eef8 0%, #8aa4c8 50%, #c8a96e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animationDelay: '0.4s'
          }}>
          The Market Does Not Forgive Amateurs.<br/><em className="not-italic font-normal">But It Rewards Method.</em>
        </h1>
        
        <p className="mt-6 text-[clamp(0.95rem,2vw,1.15rem)] text-[#8aa4c8] font-light max-w-[560px] leading-[1.7] opacity-90 animate-fade-up" style={{ animationDelay: '0.65s' }}>
          You are about to access something most people will never see. Watch the full video before making any decision.
        </p>
        
        <div className="w-[60px] h-[1px] my-9 mx-auto animate-fade-up" 
          style={{ background: 'linear-gradient(90deg, transparent, #c8a96e, transparent)', animationDelay: '0.8s' }} />
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-35 animate-fade-up" style={{ animationDelay: '1.4s' }}>
          <div className="w-[22px] h-[34px] border-[1.5px] border-[#8aa4c8] rounded-[12px] flex justify-center pt-[6px]">
            <div className="w-[3px] h-[7px] rounded-sm bg-[#8aa4c8] animate-scroll-dot" />
          </div>
          <span className="text-[0.62rem] tracking-[0.25em] uppercase">Continue</span>
        </div>
      </section>

      {/* VIDEO + CTA SECTION */}
      <section ref={videoRef} className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20 gap-10" 
        style={{ background: 'linear-gradient(180deg, #050f20 0%, #020810 100%)' }}>
        
        <div className="relative w-full max-w-[820px] animate-fade-up group" style={{ animationDelay: '0.3s' }}>
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden" 
            style={{
              boxShadow: '0 0 80px rgba(32,96,200,0.25), 0 0 0 1px rgba(32,96,200,0.2)'
            }}>
            
            {/* Simulated Video Placeholder */}
            {!started && (
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors duration-300 z-10"
                style={{ background: 'linear-gradient(135deg, #040d1c, #071528)' }}
                onClick={() => setStarted(true)}
              >
                <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-[rgba(32,96,200,0.4)]" 
                  style={{ background: 'rgba(32,96,200,0.2)', border: '1.5px solid rgba(32,96,200,0.5)' }}>
                  <Play className="text-[#e8eef8] w-8 h-8 ml-1 fill-current" />
                </div>
                <span className="text-[0.78rem] tracking-[0.2em] uppercase text-[#8aa4c8] opacity-60">Watch Now</span>
              </div>
            )}
            {started && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 text-[#8aa4c8] text-sm tracking-widest uppercase">
                [ Video is playing... ]
              </div>
            )}
          </div>
          
          {/* Progress Bar under video */}
          {started && !unlocked && (
            <div className="w-full h-1 mt-4 bg-[rgba(32,96,200,0.1)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#2060c8] to-[#c8a96e] transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(200,169,110,0.5)]"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}
          {unlocked && (
            <div className="w-full h-1 mt-4 bg-gradient-to-r from-[#2060c8] to-[#c8a96e] rounded-full shadow-[0_0_10px_rgba(200,169,110,0.5)]" />
          )}
        </div>

        {/* CTA BOX */}
        <div className="text-center animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <p className="text-[0.72rem] tracking-[0.3em] uppercase mb-5 transition-all duration-700" 
            style={{
              color: unlocked ? '#c8a96e' : '#8aa4c8',
              opacity: unlocked ? 1 : (started ? 0.8 : 0.5),
              letterSpacing: unlocked ? '.1em' : '.3em'
            }}>
            {unlocked ? "You are one step away from changing everything." : "Wait for the video to finish before continuing"}
          </p>

          <div className="relative inline-block">
            {/* Progress Ring */}
            <div className="absolute -inset-[6px] pointer-events-none" style={{ display: started && !unlocked ? 'block' : 'none' }}>
              <svg viewBox="0 0 300 60" preserveAspectRatio="none" className="w-full h-full">
                <rect x="2" y="2" width="296" height="56" rx="4" fill="none" strokeWidth="2" stroke="#c8a96e" opacity="0.7" 
                  style={{
                    strokeDasharray: `${progress} ${perim}`,
                    transition: 'stroke-dasharray 1s linear'
                  }} />
              </svg>
            </div>
            
            <button 
              disabled={!unlocked}
              className={`
                relative inline-flex items-center gap-3 px-12 py-[18px] rounded
                font-sans text-[0.95rem] font-medium tracking-[0.08em] uppercase
                text-[#e8eef8] overflow-hidden transition-all duration-400
                ${!unlocked ? 'opacity-25 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(32,96,200,0.55)] cursor-pointer btn-shimmer pulse-btn'}
              `}
              style={{
                background: 'linear-gradient(135deg, #1a4080, #2060c8)',
                boxShadow: !unlocked ? 'none' : '0 4px 30px rgba(32,96,200,0.35)',
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08), transparent)' }} />
              {!unlocked ? <Lock className="w-4 h-4" /> : <ShieldCheck className="w-5 h-5 text-[#e8eef8]" />}
              I Want VIP Access Now
            </button>
          </div>

          <div className={`text-[0.75rem] tracking-[0.15em] text-[#c8a96e] mt-3.5 transition-opacity duration-500 ${unlocked ? 'opacity-0' : 'opacity-70'}`}>
            Button available in <span>{timeStr}</span>
          </div>
        </div>
      </section>

      <footer className="relative z-10 text-center p-8 text-[0.7rem] tracking-[0.15em] text-[#8aa4c8] opacity-30 border-t border-[rgba(32,96,200,0.08)]">
        © {new Date().getFullYear()} Sofia de Luca · All rights reserved
      </footer>
    </div>
  );
}
