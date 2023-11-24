import CardList from "./list/page";
import CardDetail from "./detail/page";

const routers = [
  {
    path: "cards",
    element: <CardList />,
  },
  {
    path: "card/:id",
    element: <CardDetail />,
  },
];

export default routers;
