import React, { useState, useRef, ReactNode } from "react";
import {
  useFloating,
  offset,
  shift,
  flip,
  size,
  useHover,
  safePolygon,
  useFocus,
  useDismiss,
  useInteractions,
  arrow,
  FloatingArrow,
  Placement,
} from "@floating-ui/react";
import "./newtooltipdesign.css";

interface TooltipProps {
  content: React.ComponentType<any>;
  children: ReactNode;
  placement?: Placement;
  color?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content: ContentComponent,
  children,
  placement = "left",
  color = "white",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement | null>(null);

  const { x, y, strategy, refs, floatingStyles, context } = useFloating({
    placement,
    middleware: [
      offset(10),
      flip(),
      shift({ padding: 10, boundary: "clippingAncestors" }),
      size({
        apply({ availableWidth, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${availableWidth}px`,
            maxHeight: `${availableHeight}px`,
            overflowY: "auto",
            whiteSpace: "normal",
          });
        },
      }),
      arrow({ element: arrowRef }),
    ],
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const hover = useHover(context, {
    delay: { open: 300, close: 300 },
    handleClose: safePolygon(),
  });

  const focus = useFocus(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
  ]);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
    <div
      ref={refs.setReference}
      {...getReferenceProps({
        tabIndex: 0,
        style: { display: "inline-block" },
        "aria-describedby": "tooltip",
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      })}
    >
      {children}
      {isOpen && (
        <div
          ref={refs.setFloating}
          id="tooltip"
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            backgroundColor: color,
            zIndex: 1000,
            ...floatingStyles,
          }}
          {...getFloatingProps()}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <FloatingArrow
            ref={arrowRef}
            context={context}
            className="floating-arrow"
            style={{ color: "green" }}
          />
          <ContentComponent />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
