import React from 'react';
import { withApollo } from 'react-apollo'; // We get access to ApolloClient at will (on click) with this, not just on render.
import { loader } from 'graphql.macro';

import Link from './Link';

const FEED_SEARCH_QUERY = loader('../graphql/queries/feedSearch.graphql');

const Search = ({ client }) => {
  const [links, setLinks] = React.useState([]);
  const [filter, setFilter] = React.useState('');

  const executeSearch = async () => {
    const result = await client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter },
    });

    setLinks(result.data.feed.links);
  };

  return (
    <div className="mt3 mb3">
      <input
        className="pa2"
        type="search"
        onChange={e => setFilter(e.target.value)}
      />
      <button
        className="ml2 pa2 br2 bg-green dark-gray"
        onClick={executeSearch}
      >
        search
      </button>
      {links.map((link, index) => (
        <Link key={link.id} link={link} index={index} />
      ))}
    </div>
  );
};

export default withApollo(Search);
