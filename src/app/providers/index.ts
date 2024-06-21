import compose from "compose-function";
import { WithRedux } from "./with-redux";

export const withProviders = compose(WithRedux);