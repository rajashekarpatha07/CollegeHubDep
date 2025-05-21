// attaches optional middlewares & finally renders the view
export const render = (view, middlewares = []) => {
  return [...middlewares, (req, res) => res.render(view)];
};
