import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';

import { AUTH_TOKEN } from '../constants';
import { timeDifferenceForDate } from '../utils';

const VOTE_MUTATION = loader('../graphql/mutations/vote.graphql');

const Link = ({ index, link, updateStoreAfterVote }) => {
  const [addVote] = useMutation(VOTE_MUTATION, {
    update(store, { data: { vote } }) {
      updateStoreAfterVote(store, vote, link.id);
    },
  });

  const authToken = localStorage.getItem(AUTH_TOKEN);

  // Seems super hackish compared to using <ol>, but this is because of pagination.
  const linkNumber = `${index + 1}.`;

  return (
    <div className="flex mt3 items-start">
      <div className="flex items-center">{linkNumber}</div>
      {authToken && (
        <button
          className="ml1 br-none bg-none green pointer"
          onClick={() => {
            addVote({
              variables: { linkId: link.id },
            });
          }}
        >
          ▲
        </button>
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
