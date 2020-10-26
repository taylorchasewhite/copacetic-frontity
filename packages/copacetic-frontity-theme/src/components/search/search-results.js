import { Box, Button, Heading, Input, Text, Stack } from "@chakra-ui/core";
import { connect, decode } from "frontity";
import React from "react";
import Archive from "../archive";
import { PatternBox, PatternBoxInner } from "../newsletter";
import useSearch from "../hooks/useSearch";

const SearchHeader = ({ label, title, ...props }) => (
  <Box {...props}>
    <Heading
      size="md"
      as="h6"
      fontWeight="medium"
      color="accent.400"
    >
      {decode(label)}
    </Heading>

    <Heading
      mt={4}
      fontWeight="medium"
      as="h1"
      fontSize="3.5rem"
      color="white"
    >
      {decode(title)}
    </Heading>
  </Box>
);

const SearchResultTitle = ({ resultCount, query }) => (
  <SearchHeader
    title={`‘${query}’`}
    label={`${resultCount} ${resultCount > 1 ? "results" : "result"} for`}
  />
);

const NoResultTitle = ({ query }) => (
  <SearchHeader label={`0 result for`} title={`‘${query}’`} />
);

const NoResultContent = props => (
  <Box
    p="80px"
    maxW="1400px"
    position="relative"
    mx="auto"
    mt="-60px"
    bg="white"
    width="92%"
    {...props}
  />
);

const SearchForm = connect(props => {
  const { form, input } = useSearch(props);
  return (
    <Stack mt="40px" as="form" direction="row" align="stretch" {...form}>
      <Input
        focusBorderColor="accent.400"
        placeholder="Search..."
        size="lg"
        rounded="0"
        {...input}
      />
      <Button type="submit" rounded="0" variantColor="accent" size="lg">
        Search
      </Button>
    </Stack>
  );
});

export const SearchResults = ({ state, libraries }) => {
  const currentPath = state.router.link;

  // Get the total pages that match the current path/url
  const { total } = state.source.data[currentPath];
  const isEmpty = total === 0;

  // Parse to current url to get the search query
  const parse = libraries.source.parse(state.router.link);

  // Parse returns an object whose query string is stored in "s"
  const searchQuery = parse.query["s"];

  // Since we formatted the query string in the search modal, let's reverse the formatting
  const reverseFormat = query => query.replace("+", " ");

  return (
    <Box bg="primary.100">
      <PatternBox
        showPattern={state.theme.showBackgroundPattern}
        backgroundPattern={state.theme.backgroundPattern}
        pb="60px"
        mb="-60px"
      >
        <PatternBoxInner>
          {isEmpty ? (
            <NoResultTitle query={reverseFormat(searchQuery)} />
          ) : (
            <SearchResultTitle query={searchQuery} resultCount={total} />
          )}
        </PatternBoxInner>
      </PatternBox>

      {isEmpty ? (
        <NoResultContent>
          <Box maxW="600px" mx="auto">
            <Text fontSize="xl" textAlign="center">
              We could not find any results for your search. You can give it
              another try through the search form below.
            </Text>
            <SearchForm />
          </Box>
        </NoResultContent>
      ) : (
        <Archive />
      )}
    </Box>
  );
};

export default connect(SearchResults);
