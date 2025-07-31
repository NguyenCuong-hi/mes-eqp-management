import { createSlice } from '@reduxjs/toolkit';

const selectedRowSlice = createSlice({
  name: 'selectedRow',
  initialState: {
    data: null,
  },
  reducers: {
    setSelectedRow: (state, action) => {
      state.data = action.payload;
    },
    clearSelectedRow: (state) => {
      state.data = null;
    },
  },
});

export const { setSelectedRow, clearSelectedRow } = selectedRowSlice.actions;
export default selectedRowSlice.reducer;
