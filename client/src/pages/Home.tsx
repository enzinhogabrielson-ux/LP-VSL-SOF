import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Lock, Unlock, SkipForward, Volume2, Settings, Maximize } from "lucide-react";
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (iframeRef.current && !playerRef.current) {
      const player = new Player(iframeRef.current);
      playerRef.current = player;
      
      player.getDuration().then(d => setDuration(d)).catch(console.error);

      player.on('timeupdate', (data) => {
        setCurrentTime(data.seconds);
        if (data.duration > 0 && data.duration - data.seconds <= 15) {
          setUnlocked(true);
        }
      });

      player.on('play', () => {
        setIsPlaying(true);
      });
      player.on('pause', () => setIsPlaying(false));
      player.on('volumechange', (data) => {
        setIsMuted(data.volume === 0);
      });

      // Tenta dar play com som assim que o usuário tocar na tela ou clicar
    }
  }, [started]);

  useEffect(() => {
    const handleInteraction = () => {
      if (!started && playerRef.current) {
        playerRef.current.setVolume(1).then(() => {
          playerRef.current?.setCurrentTime(0).then(() => {
            playerRef.current?.play().then(() => {
              setIsMuted(false);
              setStarted(true);
            }).catch(e => {
              console.log("Play com som bloqueado mesmo após interação", e);
              // Se por acaso bloquear o clique, pelo menos tenta mudo
              playerRef.current?.setVolume(0).then(() => {
                playerRef.current?.play();
                setStarted(true);
              });
            });
          });
        });
        
        window.removeEventListener('touchstart', handleInteraction);
        window.removeEventListener('click', handleInteraction);
      }
    };

    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('click', handleInteraction, { passive: true });
    
    return () => {
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };
  }, [started]);

  const togglePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!playerRef.current) return;
    
    if (isMuted) {
      playerRef.current.setVolume(1);
      playerRef.current.setCurrentTime(0);
      setIsMuted(false);
      setStarted(true);
      playerRef.current.play();
      return;
    }

    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  };

  const handleInitialPlay = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setStarted(true);
    
    if (playerRef.current) {
      try {
        await playerRef.current.setVolume(1);
        await playerRef.current.setCurrentTime(0);
        await playerRef.current.play();
        setIsMuted(false);
      } catch (err) {
        console.error("Vimeo playback error:", err);
      }
    }
  };

  const actualProgress = duration > 0 ? (currentTime / duration) : 0;
  let fakeProgressPercentage = 0;
  // Lógica da barrinha manipulada (estilo VSL):
  // Menos agressivo agora: preenche 70% da barra nos primeiros 30% do vídeo
  // Depois desacelera, levando os 70% restantes do vídeo para ir de 70% a 100%
  if (actualProgress <= 0.3) {
    fakeProgressPercentage = (actualProgress / 0.3) * 70;
  } else {
    fakeProgressPercentage = 70 + ((actualProgress - 0.3) / 0.7) * 30;
  }
  
  // Perimeter for SVG rect ring: 2 * (width + height) = 2 * (296 + 56)
  const perim = 2 * (296 + 56);
  const progress = (fakeProgressPercentage / 100) * perim;
  
  return (
    <div className="bg-[#030d1a] min-h-screen text-[#e8eef8] font-sans overflow-x-hidden selection:bg-[#2060c8] selection:text-white">
      <div className="noise-overlay" />
      <div className="scanline" />
      <Particles />
      <div 
        className="fixed inset-0 pointer-events-none z-[1]" 
        style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(3,13,26,0.85) 100%)' }} 
      />
      
      {/* SINGLE SECTION: HERO + VIDEO */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center" 
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
        
        <div className="flex flex-col items-center justify-center pt-24 pb-8 w-full max-w-[1000px] mx-auto text-center px-2 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          
          <div className="text-[0.65rem] tracking-[0.5em] uppercase text-[#c8a96e] opacity-80 mb-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Sofia de Luca · Restricted Access
          </div>
          
          <h1 className="font-sans font-extrabold leading-[1.1] animate-fade-up max-w-[900px] mx-auto tracking-tight flex flex-col gap-3 md:gap-4" 
            style={{ animationDelay: '0.4s' }}>
            <span className="text-[clamp(2.5rem,5vw,5.5rem)] text-[#facc15] uppercase drop-shadow-sm leading-tight">
              $10,000 IN YOUR<br /> BANK ACCOUNT...
            </span>
            <span className="text-[clamp(1.5rem,3vw,3rem)] font-light tracking-normal opacity-90 text-white mt-2">
              In 90 seconds, I'll hand it to you.
            </span>
          </h1>
          
        </div>
        
        {/* VIDEO PLAYER */}
        <div className="relative w-full max-w-[820px] animate-fade-up group mb-10" style={{ animationDelay: '0.4s' }}>
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
                  src="https://player.vimeo.com/video/1170075786?autoplay=1&muted=0&controls=0&loop=1&title=0&byline=0&portrait=0" 
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }} 
                  title="VSL"
                />
              </div>
            </div>
            
            {/* Play Overlay (Initial) */}
            {!started && (
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer z-[50]"
                style={{ background: 'rgba(4, 13, 28, 0.4)', backdropFilter: 'blur(4px)' }}
                onClick={handleInitialPlay}
              >
                <div className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-[rgba(32,96,200,0.6)]" 
                  style={{ background: 'rgba(32,96,200,0.8)', border: '2px solid rgba(255,255,255,0.8)', boxShadow: '0 0 30px rgba(32,96,200,0.5)' }}>
                  <Play className="text-white w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-current" />
                </div>
                <span className="text-[0.7rem] sm:text-[0.85rem] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-md">
                  Click to Unmute & Watch
                </span>
              </div>
            )}
            
            {/* Click Catcher to ensure video can be interacted with for play/pause but no seeking */}
            {started && (
              <div 
                className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center transition-colors duration-300"
                style={{ background: !isPlaying ? 'rgba(0,0,0,0.4)' : 'transparent' }}
                onClick={togglePlayPause}
              >
                {!isPlaying && (
                  <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm animate-fade-up">
                    <Play className="text-white w-8 h-8 ml-1 fill-current" />
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Progress Bar under video */}
          {started && !unlocked && (
            <div className="w-full h-1 mt-4 bg-[rgba(32,96,200,0.1)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#2060c8] to-[#c8a96e] transition-all duration-300 ease-linear shadow-[0_0_10px_rgba(200,169,110,0.5)]"
                style={{ width: `${fakeProgressPercentage}%` }}
              />
            </div>
          )}
          {unlocked && (
            <div className="w-full h-1 mt-4 bg-gradient-to-r from-[#2060c8] to-[#c8a96e] rounded-full shadow-[0_0_10px_rgba(200,169,110,0.5)]" />
          )}
        </div>

        {/* CTA BOX */}
        <div className="text-center animate-fade-up w-full px-2" style={{ animationDelay: '0.6s' }}>
          <p className="text-[0.65rem] sm:text-[0.72rem] tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-5 transition-all duration-700" 
            style={{
              color: unlocked ? '#c8a96e' : '#8aa4c8',
              opacity: unlocked ? 1 : (started ? 0.8 : 0.5),
              letterSpacing: unlocked ? '.1em' : '.2em'
            }}>
            {unlocked ? "You are one step away from changing everything." : "Watch the video until the end to unlock your access"}
          </p>

          <div className="relative inline-block w-full max-w-[280px] sm:max-w-[320px]">
            {/* Progress Ring */}
            <div className="absolute -inset-[6px] pointer-events-none" style={{ display: started && !unlocked ? 'block' : 'none' }}>
              <svg viewBox="0 0 300 60" preserveAspectRatio="none" className="w-full h-full">
                <rect x="2" y="2" width="296" height="56" rx="4" fill="none" strokeWidth="2" stroke="#c8a96e" opacity="0.7" 
                  style={{
                    strokeDasharray: `${progress} ${perim}`,
                    transition: 'stroke-dasharray 0.3s linear'
                  }} />
              </svg>
            </div>
            
            <button 
              disabled={!unlocked}
              onClick={() => window.location.href = 'https://t.me/code88protocol'}
              className={`
                w-full relative inline-flex justify-center items-center gap-2 sm:gap-3 py-[16px] sm:py-[18px] rounded
                font-sans text-[0.85rem] sm:text-[0.95rem] font-medium tracking-[0.05em] sm:tracking-[0.08em] uppercase
                text-[#e8eef8] overflow-hidden transition-all duration-400
                ${!unlocked ? 'opacity-25 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(32,96,200,0.55)] cursor-pointer btn-shimmer pulse-btn unlocked-animation'}
              `}
              style={{
                background: 'linear-gradient(135deg, #1a4080, #2060c8)',
                boxShadow: !unlocked ? 'none' : '0 4px 30px rgba(32,96,200,0.35)',
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08), transparent)' }} />
              {!unlocked ? <Lock className="w-4 h-4 shrink-0" /> : <Unlock className="w-5 h-5 text-[#e8eef8] shrink-0 animate-unlock-icon" />}
              <span>I Want VIP Access Now</span>
            </button>
          </div>

        </div>
      </section>

      <footer className="relative z-10 text-center p-8 text-[0.7rem] tracking-[0.15em] text-[#8aa4c8] opacity-30 border-t border-[rgba(32,96,200,0.08)]">
        © {new Date().getFullYear()} · All rights reserved
      </footer>
    </div>
  );
}
