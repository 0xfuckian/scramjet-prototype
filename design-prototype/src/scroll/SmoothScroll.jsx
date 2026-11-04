import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePerf } from "../perf/PerfProvider.jsx";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll() {
  const { motionOff, low } = usePerf();

  useEffect(() => {
    if (motionOff) return undefined;
    const lenis = new Lenis({
      lerp: low ? 0.18 : 0.1,
      smoothWheel: true,
      autoRaf: false,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.update();
    };
  }, [motionOff, low]);

  return null;
}

export { gsap, ScrollTrigger };
