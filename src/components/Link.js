import React from 'react';
import { Mutation } from 'react-apollo';
import { loader } from 'graphql.macro';

import { AUTH_TOKEN } from '../constants';
import { timeDifferenceForDate } from '../utils';

const VOTE_MUTATION = loader('../graphql/mutations/vote.graphql');

const Link = ({ index, link, updateStoreAfterVote }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  // Seems super hackish compared to using <ol>, but this is because of pagination.
  const linkNumber = `${index + 1}.`;

  return (
    <div className="flex mt3 items-start">
      <div className="flex items-center">{linkNumber}</div>
      {authToken && (
        <Mutation
          mutation={VOTE_MUTATION}
          variables={{ linkId: link.id }}
          // update will be called right after server returns a response ("store" is current cache)
          update={(store, { data: { vote } }) => {
            updateStoreAfterVote(store, vote, link.id);
          }}
        >
          {voteMutation => (
            <button
              className="ml1 br-none bg-none green pointer"
              onClick={voteMutation}
            >
              ▲
            </button>
          )}
        </Mutation>
      )}

      <div className="ml1">
        <div>
          {link.description}{' '}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            alt={link.description}
          >
            {link.url}
          </a>
        </div>
        <div className="f6 lh-copy gray">
          {link.votes?.length} votes | by{' '}
          {link.postedBy?.name || 'Unknown User'}{' '}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Link;
