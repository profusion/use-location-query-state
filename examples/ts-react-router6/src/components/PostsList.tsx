import type { Post } from '../types.js';

interface PostsListProps {
  posts: Post[];
}

const PostsList = ({ posts }: PostsListProps): JSX.Element => (
  <ul>
    {posts.map(post => (
      <li key={post.id}>
        #{post.id} - {post.title}
      </li>
    ))}
  </ul>
);

export default PostsList;
