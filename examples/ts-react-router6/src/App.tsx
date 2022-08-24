import useLocationQueryState from '@profusion/use-location-query-state';
import { useEffect, useState } from 'react';
import PaginationControls from './components/PaginationControls.js';
import PostsList from './components/PostsList.js';
import type { Post } from './types.js';

const INITIAL_QUERY_STATE = {
  _page: 1,
  _limit: 5,
};

function App() {
  const [queryState, setQueryState] =
    useLocationQueryState(INITIAL_QUERY_STATE);
  const [totalCount, setTotalCount] = useState(0);
  const [postsList, setPostsList] = useState<Post[]>([]);
  const totalPages = queryState._limit ? Math.ceil(totalCount / queryState._limit) : 0;

  useEffect(() => {
    const queryParams = new URLSearchParams();
    queryParams.append('_page', String(queryState._page));
    queryParams.append('_limit', String(queryState._limit));
    fetch(
      'https://jsonplaceholder.typicode.com/posts?' + queryParams.toString(),
    )
      .then(result => {
        setTotalCount(Number(result.headers.get('X-Total-Count') ?? 0));
        return result.json();
      })
      .then(data => setPostsList(data));
  }, [queryState]);

  return (
    <div>
      <PostsList posts={postsList} />
      <PaginationControls
        limit={queryState._limit}
        page={queryState._page}
        totalPages={totalPages}
        onChangePage={value =>
          setQueryState(prevState => ({
            ...prevState,
            _page: value,
          }))
        }
        onChangeLimit={value =>
          setQueryState(prevState => ({
            ...prevState,
            _limit: value,
          }))
        }
      />
    </div>
  );
}

export default App;
