import React from 'react';
import { useHistory } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { FEED_QUERY } from './LinkList';

// NOTE: The server provides no query to read the user, so "postedBy" can't be sent.
const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

const CreateLink = () => {
  const [description, setDescription] = React.useState('');
  const [url, setUrl] = React.useState('');

  const history = useHistory();

  const handleSubmit = () => {
    history.push('/');
  };

  const updateStoreAfterCreate = (store, post) => {
    const data = store.readQuery({ query: FEED_QUERY });
    data.feed.links.unshift(post);

    store.writeQuery({
      query: FEED_QUERY,
      data,
    });
  };

  return (
    <div>
      <div className="flex flex-column mt3">
        <input
          className="mb2"
          value={description}
          onChange={e => setDescription(e.target.value)}
          type="text"
          placeholder="A description for the link"
        />
        <input
          className="mb2"
          value={url}
          onChange={e => setUrl(e.target.value)}
          type="text"
          placeholder="The URL for the link"
        />
      </div>
      <Mutation
        mutation={POST_MUTATION}
        variables={{ description, url }}
        onCompleted={handleSubmit}
        update={(store, { data: { post } }) =>
          updateStoreAfterCreate(store, post)
        }
      >
        {postMutation => <button onClick={postMutation}>Submit</button>}
      </Mutation>
    </div>
  );
};

export default CreateLink;
