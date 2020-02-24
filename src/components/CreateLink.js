import React from 'react';
import { useHistory } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { loader } from 'graphql.macro';

import { LINKS_PER_PAGE } from '../constants';

const FEED_QUERY = loader('../graphql/queries/feed.graphql');
const POST_MUTATION = loader('../graphql/mutations/post.graphql');

const CreateLink = () => {
  const [description, setDescription] = React.useState('');
  const [url, setUrl] = React.useState('');

  const history = useHistory();

  const handleSubmit = () => {
    history.push('/new/1');
  };

  const updateStoreAfterCreate = (store, post) => {
    const first = LINKS_PER_PAGE;
    const skip = 0;
    const orderBy = 'createdAt_DESC';
    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { first, skip, orderBy },
    });

    data.feed.links.unshift(post);

    store.writeQuery({
      query: FEED_QUERY,
      data,
      variables: { first, skip, orderBy },
    });
  };

  return (
    <div>
      <div className="flex flex-column mt3">
        <input
          className="mb2 pa2"
          value={description}
          onChange={e => setDescription(e.target.value)}
          type="text"
          placeholder="A description for the link"
        />
        <input
          className="mb2 pa2"
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
        {postMutation => (
          <button className="pa2 br2 bg-green dark-gray" onClick={postMutation}>
            submit
          </button>
        )}
      </Mutation>
    </div>
  );
};

export default CreateLink;
