import { memo, useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { analytics } from "@/lib/analytics";
import CTAButton from "@/components/landing/CTAButton";

const logoWeb = "/logoweb.png";

const VideoSection = memo(() => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.preload = "metadata";
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  return (
    <section className="py-0 bg-[#06091c]">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl mx-auto px-4"
      >
        {/* Banner superior azul */}
        <div className="flex items-center justify-between bg-[#0047FF] px-6 py-3 rounded-t-2xl">
          <span className="text-white font-bold uppercase tracking-widest text-sm md:text-base">
            CONHEÇA O DOUTOR CASH
          </span>
          <img
            src={logoWeb}
            alt="doutorcash"
            className="h-8 w-auto"
          />
        </div>

        {/* Player de vídeo customizado */}
        <div
          ref={sectionRef}
          className="relative w-full rounded-b-2xl overflow-hidden border border-[#0047FF]/50 bg-black cursor-pointer"
          style={{ aspectRatio: "16/9" }}
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            preload="none"
            poster="/vsl-poster.jpg"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          >
            <source src="/vsl-doutorcash.webm" type="video/webm" />
            <source src="/vsl-doutorcash.mp4" type="video/mp4" />
          </video>

          {/* Play/Pause overlay */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50">
              {isPlaying ? (
                <Pause className="w-7 h-7 text-[#0047FF] fill-[#0047FF]" />
              ) : (
                <Play className="w-7 h-7 text-[#0047FF] fill-[#0047FF] translate-x-0.5" />
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20">
            <div
              className="h-full bg-gradient-to-r from-[#3060e8] to-[#60a0ff] transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Botão abaixo do vídeo */}
        <div className="flex justify-center mt-6 pb-12">
          <CTAButton
            to="/cadastro"
            arrowStyle="circle"
            onClick={() => analytics.click("video_cta", "video_section")}
          >
            ADQUIRIR O DOUTOR CASH
          </CTAButton>
        </div>
      </motion.div>
    </section>
  );
});

VideoSection.displayName = "VideoSection";

export default VideoSection;
