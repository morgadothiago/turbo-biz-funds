import { memo, useState } from "react";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { analytics } from "@/lib/analytics";
import CTAButton from "@/components/landing/CTAButton";

const logoWeb = "/logoweb.png";
const YT_ID = "pHz8vCehMuI";
const YT_THUMB = `https://img.youtube.com/vi/${YT_ID}/maxresdefault.jpg`;
const YT_EMBED = `https://www.youtube.com/embed/${YT_ID}?autoplay=1&rel=0&modestbranding=1`;

const VideoSection = memo(() => {
  const [active, setActive] = useState(false);

  const handlePlay = () => {
    analytics.click("video_play", "video_section");
    setActive(true);
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
          {active ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={YT_EMBED}
              title="Doutor Cash VSL"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className="absolute inset-0 w-full h-full cursor-pointer group"
              onClick={handlePlay}
              aria-label="Reproduzir vídeo"
            >
              <img
                src={YT_THUMB}
                alt="Thumbnail do vídeo Doutor Cash"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-200" />
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
