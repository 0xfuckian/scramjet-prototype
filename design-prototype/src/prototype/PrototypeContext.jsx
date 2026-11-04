import { createContext, useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PROPOSALS } from "../data/proposals.js";
import { usePerf } from "../perf/PerfProvider.jsx";

const PrototypeContext = createContext(null);

export function PrototypeProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { motionOff } = usePerf();
  const solo = location.pathname.startsWith("/element/")
    ? location.pathname.split("/").filter(Boolean).pop()
    : null;
  const [enabled, setEnabled] = useState(() =>
    Object.fromEntries(PROPOSALS.map((item) => [item.id, true])),
  );
  const [veil, setVeil] = useState(false);

  const api = useMemo(() => {
    function toggle(id) {
      setEnabled((current) => ({ ...current, [id]: !current[id] }));
    }

    function openElement(id) {
      const go = () => navigate(`/element/${id}`);
      if (motionOff || !enabled["section-veil"]) {
        go();
        return;
      }
      setVeil(true);
      window.setTimeout(() => {
        go();
        window.setTimeout(() => setVeil(false), 80);
      }, 420);
    }

    function isActive(id) {
      return solo ? solo === id : Boolean(enabled[id]);
    }

    return { enabled, toggle, openElement, veil, solo, isActive };
  }, [enabled, motionOff, navigate, veil, solo]);

  return (
    <PrototypeContext.Provider value={api}>
      {children}
      <div className={veil ? "veil is-on" : "veil"} aria-hidden="true" />
    </PrototypeContext.Provider>
  );
}

export function usePrototype() {
  const value = useContext(PrototypeContext);
  if (!value) throw new Error("usePrototype must be used inside PrototypeProvider");
  return value;
}
