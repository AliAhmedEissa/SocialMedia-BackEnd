const pagination = ({ page = 1, size = 3 } = {}) => {
  if (page <= 0) page = 1;
  if (size <= 0) size = 1;

  const skip = (page - 1) * size;
  const perPage = size;
  const nextPage = page + 1;
  const prePage = page - 1;
  const currentPage = page;

  return { perPage, nextPage, prePage, currentPage, skip };
};

export default pagination;
