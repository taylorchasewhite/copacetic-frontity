import { Box, PseudoBox } from "@chakra-ui/core";
import React from "react";
import Section from "./section";
import { connect } from "frontity";

/**
 * @param {React.ComponentProps<typeof Box>} props
 */
export const PatternBox = ({ state, showPattern = true, backgroundPattern, ...props }) => (
    <Box style={{ backgroundBlendMode: "overlay" }}
    as="section"
    bg="accent.700"
    borderTop="10px solid"
    borderColor="accent.400"
    {...(showPattern && {
    bgImage: `url(${backgroundPattern})`,
    bgBlendMode: "overlay",
    bgPos: "top center",
    bgAttachment:"fixed",
    bgSize:"cover"
    })}
    {...props}
  />
);

/**
 * @param {React.ComponentProps<typeof Box>} props
 */
export const PatternBoxInner = props => (
  <Section
    py="80px"
    position="relative"
    zIndex="1"
    overflow="hidden"
    textAlign="center"
    size="sm"
    px={6}
    {...props}
  />
);

export const LightPatternBox = React.forwardRef(
    ({showPattern = true, backgroundPattern,...props }, ref) => (
    <PseudoBox
      ref={ref}
      bg="accent.100"
      pt="40px"
      pos="relative"
      zIndex={0}
      _before={{
        content: `""`,
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
        display: "block",
        ...(showPattern && {
          bgPos: "top center",
          bgImage: `url(${backgroundPattern})`,
          bgSize: "100%",
          bgBlendMode: "overlay",
          bgAttachment:"fixed",
          bgSize:"cover"
        })
      }}
      {...props}
    />
  )
);
