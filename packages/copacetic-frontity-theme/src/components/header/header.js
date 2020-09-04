import { Box, Flex } from "@chakra-ui/core";
import React from "react";
import Link from "../link";
import MobileMenu from "../menu";
import { isUrl, omitConnectProps } from "../helpers";
import { connect } from "frontity";

const SiteHeader = props => (
  <Box
    as="header"
    transition="transform ease .25s"
    width="100%"
    pos="fixed"
    boxShadow="0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)"
    top="0"
    left="0"
    bg="white"
    zIndex="90"
    {...props}
  />
);

const SiteHeaderInner = props => (
  <Flex
    align="center"
    width={{ base: "auto", sm: "92%" }}
    mx="auto"
    height={{ sm: "70px" }}
    maxW="1550px"
    {...props}
  />
);

const Logo = ({ isImage = true, src }) =>
  isImage ? (
    <Box as="img" src={src} width="120px" />
  ) : (
    <Box
      fontSize="2xl"
      color="primary.700"
      fontFamily="heading"
      fontWeight="bold"
    >
      {src}
    </Box>
  );

const SiteLogo = connect(({ state, ...props }) => {
  // check if the logo is a url,
  // we assume, if it's a url, it points to an image, else it's a text
  const isImage = isUrl(state.theme.logo);
  return (
    <Box display="block" flexShrink="0" {...omitConnectProps(props)}>
      <Link link="/">
        <Logo isImage={isImage} src={state.theme.logo} />
      </Link>
    </Box>
  );
});

const Header = ({ children, ...props }) => (
  <SiteHeader {...props}>
    <SiteHeaderInner>
      <MobileMenu />
      <SiteLogo />
      {children}
    </SiteHeaderInner>
  </SiteHeader>
);

export default Header;
