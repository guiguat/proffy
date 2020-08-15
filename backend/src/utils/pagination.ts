interface IPaginationResults {
  next?: {
    page: number;
    limit: number;
  };
  previous?: {
    page: number;
    limit: number;
  };
  results: any[];
}
const paginate = (model: any[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {} as IPaginationResults;

  if (endIndex < model.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  results.results = model.splice(startIndex, endIndex);
  return results;
};

export default paginate;
