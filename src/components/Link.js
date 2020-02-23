import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { AUTH_TOKEN } from '../constants';
import { timeDifferenceForDate } from '../utils';

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        id
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

const Link = ({ link, updateStoreAfterVote }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  return (
    <li>
      <div className="flex mt3 items-start">
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
            {link.description} {link.url}
          </div>
          <div className="f6 lh-copy gray">
            {link.votes?.length} votes | by{' '}
            {link.postedBy?.name || 'Unknown User'}{' '}
            {timeDifferenceForDate(link.createdAt)}
          </div>
        </div>
      </div>
    </li>
  );
};

export default Link;
