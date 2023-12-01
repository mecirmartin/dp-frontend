import { configureStore } from "@reduxjs/toolkit";
import appliancesSlice from "./features/appliancesSlice";

export default configureStore({
  reducer: {
    appliances: appliancesSlice,
  },
});
