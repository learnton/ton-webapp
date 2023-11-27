import CardList from "./list/page";
import CardDetail from "./detail/page";
import ShareX from "./detail/shareX/page";
import Presentation from "./detail/presentation/page";

const routers = [
  {
    path: "cards",
    element: <CardList />,
  },
  {
    path: "card/:id",
    children: [
      {
        index: true,
        element: <CardDetail />,
      },
      {
        path: "share",
        element: <ShareX />,
      },
      {
        path: "presentation",
        element: <Presentation />,
      },
    ],
  },
];

export default routers;
