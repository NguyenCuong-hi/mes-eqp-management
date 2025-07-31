
// Initial State
const initialState = {
    tabList: [
      {
        key: "home",
        label: "Trang chủ",
        component: "DashboardDefault",
        permission: null,
      },
    
    ],
    activeTabKey: "home",
  };
  
  // Action Types
  const ADD_TAB = "tab/ADD_TAB";
  const REMOVE_TAB = "tab/REMOVE_TAB";
  const SET_ACTIVE_TAB = "tab/SET_ACTIVE_TAB";
  
  // Action Creators
  export const addTab = (tab) => ({
    type: ADD_TAB,
    payload: tab,
  });
  
  export const removeTab = (key) => ({
    type: REMOVE_TAB,
    payload: key,
  });
  
  export const setActiveTab = (key) => ({
    type: SET_ACTIVE_TAB,
    payload: key,
  });
  
  // Reducer
  const tabReducer = (state = initialState, action) => {
    switch (action.type) {
      case ADD_TAB: {
        const exists = state.tabList.some((tab) => tab.key === action.payload.key);
        return {
          ...state,
          tabList: exists ? state.tabList : [...state.tabList, action.payload],
          activeTabKey: action.payload.key,
        };
      }
  
      case REMOVE_TAB: {
        const filteredTabs = state.tabList.filter((tab) => tab.key !== action.payload);
        const isRemovingActive = state.activeTabKey === action.payload;
        return {
          ...state,
          tabList: filteredTabs,
          activeTabKey: isRemovingActive
            ? filteredTabs.length > 0
              ? filteredTabs[filteredTabs.length - 1].key
              : "home"
            : state.activeTabKey,
        };
      }
  
      case SET_ACTIVE_TAB:
        return {
          ...state,
          activeTabKey: action.payload,
        };
  
      default:
        return state;
    }
  };
  
  export default tabReducer;
  