import { memo, useRef, useState } from "react";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { analytics } from "@/lib/analytics";
import CTAButton from "@/components/landing/CTAButton";

const logoWeb = "/logoweb.png";
const VIDEO_SRC = "/vsl-new.mp4";

const VideoSection = memo(() => {
  const [active, setActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    analytics.click("video_play", "video_section");
    setActive(true);
    setTimeout(() => videoRef.current?.play(), 50);
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

        {/* Player */}
        <div
          className="relative w-full rounded-b-2xl overflow-hidden border border-[#0047FF]/50 bg-black"
          style={{ aspectRatio: "16/9" }}
        >
          {/* Vídeo sempre montado, oculto até clicar */}
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            src={VIDEO_SRC}
            controls={active}
            playsInline
            preload="none"
          />

          {/* Overlay de play — some após clicar */}
          {!active && (
            <button
              type="button"
              className="absolute inset-0 w-full h-full cursor-pointer group"
              onClick={handlePlay}
              aria-label="Reproduzir vídeo"
            >
              {/* Thumbnail gerada do vídeo (primeiro frame) */}
              <div className="absolute inset-0 bg-[#06091c]" />
              {/* Overlay escuro sutil */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-200" />
              {/* Botão play */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[#0047FF]/90 backdrop-blur-sm flex items-center justify-center border-2 border-white/50 group-hover:scale-110 transition-transform duration-200">
                  <Play className="w-8 h-8 text-white fill-white translate-x-0.5" />
                </div>
              </div>
            </button>
          )}
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
