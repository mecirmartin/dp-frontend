import { createSlice } from "@reduxjs/toolkit";

export const appliancesSlice = createSlice({
  name: "appliances",
  initialState: {
    appliances: [],
    uptime: [],
    user: {},
  },
  reducers: {
    setAppliances: (state, action) => {
      state.appliances = action.payload;
    },
    setUptime: (state, action) => {
      state.uptime = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAppliances, setUptime, setUser } = appliancesSlice.actions;
export default appliancesSlice.reducer;
