const logger = (req, res, next) => {
  const query =
    Object.entries(req.query).length > 0
      ? " | query: " +
        JSON.stringify(
          Object.keys(req.query).map((val, i) => {
            return { [val]: Object.values(req.query)[i] };
          })
        )
      : "";
  const body =
    Object.entries(req.body).length > 0
      ? " | body: " +
        JSON.stringify(
          Object.keys(req.body).map((val, i) => {
            return { [val]: Object.values(req.body)[i] };
          })
        )
      : "";
  console.log(
    `Request ${req.method} ${req.hostname}${req.path}${query}${body}`
  );
  next();
};
export default logger;
