import { Box, PseudoBox, Stack } from "@chakra-ui/core";
import { connect, styled } from "frontity";
import React from "react";
import FrontityLink from "../link";

const Link = styled(FrontityLink)`
  position: relative;
  color: primary.700;
  text-decoration: none;

  &:after {
    transition: bottom ease 0.25s, background-color ease 0.25s;
    content: "";
    width: 100%;
    height: 2px;
    position: absolute;
    bottom: 0;
    left: 0;
    background: transparent;
  }
  &:hover {
    color: ${p => p.theme.colors.primary[600]};
  }
  &.active {
    color: ${p => p.theme.colors.accent[400]};
  }
  &:hover {
    &:after {
      bottom: -5px;
      background-color: ${p => p.theme.colors.accent[400]};
    }
  }
`;

export const SiteMenu = props => (
  <Stack
    ml="50px"
    spacing="50px"
    as="ul"
    listStyleType="none"
    align="center"
    direction="row"
    color="primary.700"
    {...props}
  />
);

const SiteMenuItem = ({ link, currentHref, ...props }) => (
  <PseudoBox
    as="li"
    color="primary.700"
    fontSize={{ base: "sm", lg: "md" }}
    fontWeight="medium"
    fontFamily="Kelson"
    position="relative"
    cursor="pointer"
    {...props}
  >
    <MenuLink link={link} currentHref={currentHref}>{props.children}</MenuLink>
  </PseudoBox>
);

const MenuLink = function ({ link, currentHref, ...props }) {
    const isCurrentPage = currentHref === link;
    if (isCurrentPage) {
        return (
            <Link aria-current={isCurrentPage ? "page" : undefined} link={link} className="active">
                {props.children}
            </Link>
        );
    }
    else {
        return (
            <Link link={link}>{props.children}</Link>
        );
    }
};

const Navigation = ({ state, menu, ...props }) => (
  <Box as="nav" width="100%" display={{ base: "none", lg: "block" }} {...props}>
    <SiteMenu>
            {menu.map(([name, link]) => (
                <SiteMenuItem key={name} link={link} currentHref={state.router.link}>
          {name}
        </SiteMenuItem>
      ))}
    </SiteMenu>
  </Box>
);

export default connect(Navigation);
