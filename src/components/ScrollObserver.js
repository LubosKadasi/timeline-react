import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const ScrollObserver = ({ sectionId, onVisible }) => {
  const [isInView, setIsInView] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && !isInView) {
      setIsInView(true);
      onVisible(sectionId);
      
      // Check if the URL needs to be updated
      const currentPath = window.location.hash.substr(1);
      if (currentPath !== sectionId) {
        // Update the URL only if a new section becomes visible
        const newPath = `#${sectionId}`;
        window.history.pushState(null, "", newPath);
      }
    } else if (!inView && isInView) {
      setIsInView(false);
    }
  }, [inView, sectionId, onVisible, isInView]);

  return <div ref={ref} />;
};

export default ScrollObserver;
