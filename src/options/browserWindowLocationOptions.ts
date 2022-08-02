const browserWindowLocationOptions = {
  getSearchParams: () => new URLSearchParams(window.location.search),
  setSearchParams: (searchParams: URLSearchParams) => {
    const url = new URL(window.location.href);
    url.search = searchParams.toString();
    window.history.pushState({}, '', url);
  },
} as const;

export default browserWindowLocationOptions;
