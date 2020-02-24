import React from 'react';
import { Query } from 'react-apollo';
import { loader } from 'graphql.macro';

import Link from './Link';
import { LINKS_PER_PAGE } from '../constants';

const FEED_QUERY = loader('../graphql/queries/feed.graphql');

const NEW_LINKS_SUBSCRIPTION = loader(
  '../graphql/subscriptions/newLink.graphql'
);
const NEW_VOTES_SUBSCRIPTION = loader(
  '../graphql/subscriptions/newVote.graphql'
);

const LinkList = ({ history, location, match }) => {
  const currentPage = parseInt(match.params.page, 10);
  const isFirstPage = currentPage <= 1;
  const isNewPage = location.pathname.includes('new');

  const getLinksToRender = links => {
    if (isNewPage) return links;

    const rankedLinks = [...links].sort(
      (l1, l2) => l2.votes.length - l1.votes.length
    );
    return rankedLinks;
  };

  const getNextPage = feedCount => {
    if (currentPage <= feedCount / LINKS_PER_PAGE) {
      const nextPage = currentPage + 1;
      history.push(`/new/${nextPage}`);
    }
  };

  const getPreviousPage = () => {
    if (!isFirstPage) {
      const previousPage = currentPage - 1;
      history.push(`/new/${previousPage}`);
    }
  };

  const getQueryVariables = () => {
    const skip = isNewPage ? (currentPage - 1) * LINKS_PER_PAGE : 0;
    const first = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = isNewPage ? 'createdAt_DESC' : null;

    return { first, skip, orderBy };
  };

  const subscribeToNewLinks = async subscribeToMore => {
    subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;

        const { newLink } = subscriptionData.data;
        const exists = prev.feed.links.find(({ id }) => id === newLink.id);

        if (exists) return prev;

        return {
          ...prev,
          feed: {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename,
          },
        };
      },
    });
  };

  const subscribeToNewVotes = subscribeToMore => {
    subscribeToMore({ document: NEW_VOTES_SUBSCRIPTION });
  };

  const updateStoreAfterVote = (store, createVote, linkId) => {
    const variables = getQueryVariables();
    const data = store.readQuery({ query: FEED_QUERY, variables });
    const votedLink = data.feed.links.find(link => link.id === linkId);

    votedLink.votes = createVote.link.votes;

    store.writeQuery({ query: FEED_QUERY, data });
  };

  return (
    <Query query={FEED_QUERY} variables={getQueryVariables()}>
      {({ loading, error, data, subscribeToMore }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error :(</div>;

        subscribeToNewLinks(subscribeToMore);
        subscribeToNewVotes(subscribeToMore);

        const linksToRender = getLinksToRender(data.feed.links);
        const pageIndex = match.params.page
          ? (match.params.page - 1) * LINKS_PER_PAGE
          : 0;

        return (
          <>
            {linksToRender.map((link, index) => (
              <Link
                key={link.id}
                link={link}
                index={index + pageIndex}
                updateStoreAfterVote={updateStoreAfterVote}
              />
            ))}
            {isNewPage && (
              <div className="flex ml4 mv3 gray">
                <button
                  className="pointer mr2 pa2 br2"
                  onClick={getPreviousPage}
                  disabled={isFirstPage}
                >
                  Previous
                </button>
                <button
                  className="pointer pa2 br2"
                  onClick={() => getNextPage(data.feed.count)}
                  disabled={currentPage > data.feed.count / LINKS_PER_PAGE}
                >
                  Next
                </button>
              </div>
            )}
          </>
        );
      }}
    </Query>
  );
};

export default LinkList;
