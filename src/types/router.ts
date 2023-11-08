export interface RouteObject {
  children?: RouteObject[];
  element?: React.ReactNode;
  index?: boolean;
  path?: string;
  auth?: boolean;
}
