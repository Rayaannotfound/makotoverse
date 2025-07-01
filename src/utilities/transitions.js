export const pageVariants = {
    initial: {
      rotateY: 90,
      opacity: 0,
    },
    in: {
      rotateY: 0,
      opacity: 1,
    },
    out: {
      rotateY: -90,
      opacity: 0,
    },
  };



export const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 1,
  };