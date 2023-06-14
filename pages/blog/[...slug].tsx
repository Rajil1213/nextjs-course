import React from 'react';

import { useRouter } from 'next/router';

const BlogPostsPage = () => {
  const router = useRouter();
  return (
    <div>
      <h1>This is the Blog Posts Page: {JSON.stringify(router.query)}</h1>
      {/* {"slug":["2023","01"]} */}
    </div>
  );
};

export default BlogPostsPage;
