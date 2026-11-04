import { createContext, useContext, useEffect, useMemo, useState } from "react";

const PerfContext = createContext(null);

function detectLowPower() {
  if (typeof window === "undefined") return true;
  const narrow = window.innerWidth < 800;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  const lowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;
  return Boolean(narrow || coarse || saveData || lowMemory);
}

export function PerfProvider({ children }) {
  const [low, setLow] = useState(detectLowPower);
  const [osReduced, setOsReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [forceReduced, setForceReduced] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setOsReduced(motion.matches);
    motion.addEventListener("change", onMotion);
    return () => motion.removeEventListener("change", onMotion);
  }, []);

  const motionOff = osReduced || forceReduced;

  useEffect(() => {
    document.documentElement.classList.toggle("motion-off", motionOff);
    document.documentElement.classList.toggle("power-low", low);
  }, [motionOff, low]);

  const value = useMemo(
    () => ({
      low,
      setLow,
      osReduced,
      forceReduced,
      setForceReduced,
      motionOff,
      post: !low && !motionOff,
    }),
    [low, osReduced, forceReduced, motionOff],
  );

  return <PerfContext.Provider value={value}>{children}</PerfContext.Provider>;
}

export function usePerf() {
  const value = useContext(PerfContext);
  if (!value) throw new Error("usePerf must be used inside PerfProvider");
  return value;
}
