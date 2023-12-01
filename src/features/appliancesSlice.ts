import { createSlice } from "@reduxjs/toolkit";

export const appliancesSlice = createSlice({
  name: "appliances",
  initialState: {
    appliances: [],
  },
  reducers: {
    setAppliances: (state, action) => {
      state.appliances = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAppliances } = appliancesSlice.actions;
export default appliancesSlice.reducer;
