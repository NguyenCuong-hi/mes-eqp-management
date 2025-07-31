// third party
import { combineReducers } from 'redux';

// project import
import customizationReducer from './customizationReducer';
import tabReducer from './tabsReducer';
import selectedRow from './selectedRowSlice';

// ==============================|| REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  tab: tabReducer,
  selectedRow: selectedRow
});

export default reducer;
