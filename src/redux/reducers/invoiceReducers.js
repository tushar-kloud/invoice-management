import { GENERATE_INVOICE_REQUEST, GENERATE_INVOICE_SUCCESS, GENERATE_INVOICE_FAIL, UPLOAD_FILE_REQUEST, UPLOAD_FILE_SUCCESS, UPLOAD_FILE_FAIL } from "../constants/invoiceConstants";

export const uploadFileReducer = (state = {}, action) => {
    switch(action.type){
        case UPLOAD_FILE_REQUEST:
            return {loading: true}
        case UPLOAD_FILE_SUCCESS:
            return {loading: false, success: true, fileInfo: action.payload}
        case UPLOAD_FILE_FAIL:
            return {loading: false, error: action.payload}
        default:
            return state
    }
}


export const generateInvoiceReducer = (state = {}, action) => {
    switch(action.type){
        case GENERATE_INVOICE_REQUEST:
            return {loading: true}
        case GENERATE_INVOICE_SUCCESS:
            return {loading: false, success: true, invoiceInfo: action.payload}
        case GENERATE_INVOICE_FAIL:
            return {loading: false, error: action.payload}
        default:
            return state
    }
}
