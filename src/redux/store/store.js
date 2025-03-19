import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { generateInvoiceReducer, uploadFileReducer } from "../reducers/invoiceReducers";
// import InvoiceGeneration from "@//components/invoiceGeneration";

const reducers = combineReducers({
    fileUpload: uploadFileReducer,
    invoiceGeneration: generateInvoiceReducer
});

const initialState = {
  // userLogin: { userInfo: userInfoFromStorage },
  // domainsList: {domainsListInfo: domainsListInfoFromStorage},
  // learningPathDetails: { learningPathInfo: learningPathInfoFromStorage },
  // newsArticles: { newsInfo: newsArticlesFromStorage },
};

const store = configureStore({
  reducer: reducers,
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk),
  devTools: true,
});

export default store;
