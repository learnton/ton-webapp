export interface RouteObject {
  children?: RouteObject[];
  element?: React.ReactNode;
  path?: string;
}
