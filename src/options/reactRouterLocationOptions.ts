import { useLocation, useSearchParams } from 'react-router-dom';

const reactRouterLocationOptions = {
  getSearchParams: () => {
    const { search } = useLocation();
    return new URLSearchParams(search);
  },
  setSearchParams: (searchParams: URLSearchParams) => {
    const [, setSearchParams] = useSearchParams();
    setSearchParams(searchParams);
  },
} as const;

export default reactRouterLocationOptions;
