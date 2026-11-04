import { Component, Suspense, useEffect, useRef, useState } from "react";
import { usePerf } from "../perf/PerfProvider.jsx";

class StageBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

export function LazyStage({ scene: Scene, fallback, label, sceneProps = {} }) {
  const { motionOff } = usePerf();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (motionOff) {
      setVisible(false);
      setReady(false);
      return undefined;
    }
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (!entry.isIntersecting) setReady(false);
      },
      { rootMargin: "160px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [motionOff]);

  return (
    <div ref={ref} className="stage">
      <img src={fallback} alt="" className={ready ? "fallback is-dim" : "fallback"} />
      <p className="sr-only">{label} Decorative graphic. The description is in the heading beside it.</p>
      {visible && (
        <StageBoundary fallback={null}>
          <Suspense fallback={null}>
            <div className="webgl-slot" aria-hidden="true">
              <Scene onReady={() => setReady(true)} {...sceneProps} />
            </div>
          </Suspense>
        </StageBoundary>
      )}
    </div>
  );
}
