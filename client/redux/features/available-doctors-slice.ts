import { TypeAvailableSpecialist } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  value: AvailableSpecialistState[];
};

type AvailableSpecialistState = {
  doctor: string;
  slots: number[];
};

const initialState = {
  value: [] as AvailableSpecialistState[],
} as InitialState;

export const AvailableSpecialist = createSlice({
  name: 'AvailableSpecialist',
  initialState,
  reducers: {
    setAvailableSpecialist: (
      state,
      action: PayloadAction<TypeAvailableSpecialist[]>
    ) => {
      const specialists = action.payload;
      state.value = specialists;
    },
  },
});

export const { setAvailableSpecialist } = AvailableSpecialist.actions;
export default AvailableSpecialist.reducer;
