import { Route } from "../services/RoutesService";
import { MethodsInterface } from "./MethodsInterface";

export interface RoutesServiceInterface {
  addRoute: (route: Route) => void;
  getRoute: (path: string, method: MethodsInterface) => Route | void;
}