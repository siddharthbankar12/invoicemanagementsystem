import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const userSlice = createSlice({
  name: "user",
  initialState: { user: null },
  reducers: {
    login: (state, action) => {
      if (action.payload.token) {
        localStorage.setItem("token", JSON.stringify(action.payload.token));
      }
      state.user = action.payload.user;
      console.log(state.user);
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      toast.success("Logout Successfully");
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
