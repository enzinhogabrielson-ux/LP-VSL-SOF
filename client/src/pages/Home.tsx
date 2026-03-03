import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Lock, ShieldCheck } from "lucide-react";
import Player from "@vimeo/player";

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (iframeRef.current && !playerRef.current) {
      playerRef.current = new Player(iframeRef.current);
    }
  }, []);

  const handleUnmuteAndPlay = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Esconder o overlay imediatamente
    setStarted(true);
    
    if (playerRef.current) {
      try {
        await playerRef.current.setVolume(1);
      } catch (err) {
        console.error("Vimeo playback error:", err);
      }
    }
  };
  
  const m = Math.floor(remaining / 60);
  const sec = remaining % 60;
  const timeStr = `${m}:${sec < 10 ? '0' : ''}${sec}`;
  
  // Calculate manipulated progress for optical illusion effect
  const elapsed = 90 - remaining;
  let fakeProgressPercentage = 0;
  
  if (elapsed <= 30) {
    // Rise to 90% very fast (first 30 seconds)
    fakeProgressPercentage = (elapsed / 30) * 90;
  } else if (elapsed <= 35) {
    // Glitch effect: pull back to 40% quickly
    fakeProgressPercentage = 90 - ((elapsed - 30) / 5) * 50;
  } else if (elapsed <= 45) {
    // Hover around 40-45% to build tension
    fakeProgressPercentage = 40 + ((elapsed - 35) / 10) * 5;
  } else {
    // Slowly resume to 100% for the rest of the duration
    fakeProgressPercentage = 45 + ((elapsed - 45) / 45) * 55;
  }
  
  // Perimeter for SVG rect ring: 2 * (width + height) = 2 * (296 + 56)
  const perim = 2 * (296 + 56);
  const progress = (fakeProgressPercentage / 100) * perim;
  
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

  const progressPercentage = fakeProgressPercentage;

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
        
        {/* WARNING ALERT */}
        <div className="absolute top-0 w-full animate-fade-down z-50">
          <div className="bg-[#cc0000] py-3 px-4 flex items-center justify-center gap-3 shadow-[0_4px_30px_rgba(204,0,0,0.5)]">
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <p className="text-white text-[0.7rem] sm:text-xs md:text-sm font-extrabold tracking-[0.15em] sm:tracking-[0.25em] uppercase text-center">
              WARNING: DO NOT CLOSE THIS PAGE · SINGLE VIEW ONLY
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center pt-32 pb-12 w-full max-w-[1000px] mx-auto text-center px-4">
          <div className="text-[0.65rem] tracking-[0.5em] uppercase text-[#c8a96e] opacity-80 mb-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Sofia de Luca · Restricted Access
          </div>
          
          <h1 className="font-serif font-bold leading-[1.1] animate-fade-up max-w-[900px] mx-auto tracking-tight flex flex-col gap-3 md:gap-4" 
            style={{ animationDelay: '0.4s' }}>
            <span className="text-[clamp(2.5rem,5vw,5.5rem)]" style={{
              background: 'linear-gradient(110deg, #e8eef8 0%, #8aa4c8 45%, #e0c388 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              $10,000 in your bank account...
            </span>
            <span className="text-[clamp(1.5rem,3vw,3rem)] font-light tracking-normal opacity-90" style={{
              background: 'linear-gradient(110deg, #8aa4c8 0%, #e8eef8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              In 90 seconds, I'll hand it to you.
            </span>
          </h1>
          
          <p className="mt-10 text-[clamp(0.95rem,1.5vw,1.1rem)] text-[#8aa4c8] font-light max-w-[600px] leading-[2] opacity-80 animate-fade-up mx-auto" style={{ animationDelay: '0.65s' }}>
            You are about to access something most people will never see. Watch<br className="hidden sm:block" /> the full video before making any decision.
          </p>
          
          <div className="w-[50px] h-[1px] my-12 animate-fade-up mx-auto" 
            style={{ background: 'linear-gradient(90deg, transparent, #c8a96e, transparent)', animationDelay: '0.8s' }} />
        </div>
        
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
            
            {/* Embedded Vimeo Video */}
            <div className={`relative w-full aspect-[16/9] z-10 bg-black ${!started ? 'pointer-events-none' : 'pointer-events-auto'}`}>
              <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                <iframe 
                  id="vimeo-player"
                  ref={iframeRef}
                  src="https://player.vimeo.com/video/1170075786?autoplay=1&muted=1&controls=0&loop=1&title=0&byline=0&portrait=0&background=1" 
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }} 
                  title="VSL"
                />
              </div>
            </div>
            
            {/* Play Overlay */}
            {!started && (
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer z-[50]"
                style={{ background: 'rgba(4, 13, 28, 0.4)', backdropFilter: 'blur(4px)' }}
                onClick={handleUnmuteAndPlay}
              >
                <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-[rgba(32,96,200,0.6)]" 
                  style={{ background: 'rgba(32,96,200,0.8)', border: '2px solid rgba(255,255,255,0.8)', boxShadow: '0 0 30px rgba(32,96,200,0.5)' }}>
                  <Play className="text-white w-10 h-10 ml-1 fill-current" />
                </div>
                <span className="text-[0.85rem] font-bold tracking-[0.2em] uppercase text-white bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-md">
                  Click to Unmute & Watch
                </span>
              </div>
            )}
            
            {/* Click Catcher to ensure video can be interacted with after starting */}
            {started && (
              <div className="absolute inset-0 pointer-events-none z-20"></div>
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

        </div>
      </section>

      <footer className="relative z-10 text-center p-8 text-[0.7rem] tracking-[0.15em] text-[#8aa4c8] opacity-30 border-t border-[rgba(32,96,200,0.08)]">
        © {new Date().getFullYear()} Sofia de Luca · All rights reserved
      </footer>
    </div>
  );
}
