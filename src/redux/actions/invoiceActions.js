import axios from "axios";

import {
    UPLOAD_FILE_REQUEST,
    UPLOAD_FILE_SUCCESS,
    UPLOAD_FILE_FAIL,
    GENERATE_INVOICE_REQUEST,
    GENERATE_INVOICE_SUCCESS,
    GENERATE_INVOICE_FAIL
} from '../constants/invoiceConstants';

const baseUrl = 'https://langflow-v3-large.salmonisland-47da943e.centralindia.azurecontainerapps.io'
// const flowId = '91a3d1f1-fa91-4aff-a334-140860535fae'

const WORKFLOWS = {
    RAG: {flowId:'d7af9af5-efbc-46c1-924e-25397792d27a'},
    INVOICING: {flowId:'e7fe8081-0b38-4985-820f-244a02347ccc', fileComponentId:'File-5LGLh'},
    RECONCILING: {flowId: '6c03f2de-c572-420e-be75-964cf55eb80d', poComponent:'', invoiceComponent:''}
}

export const uploadFileAPI = (flag, file) => async(dispatch) => {
    try{
        // Get the flowId based on the flag
        const flow = WORKFLOWS[flag];
        if (!flow) {
            throw new Error('Invalid flag provided');
        }
        
        const flowId = flow.flowId;
        
        dispatch({type: UPLOAD_FILE_REQUEST});
        
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${baseUrl}/api/v1/files/upload/${flowId}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log('file uploaded: ', response.data);
        dispatch({type: UPLOAD_FILE_SUCCESS, payload: response.data});
    } catch(error) {
        console.log('Error:', error);
        dispatch({
            type: UPLOAD_FILE_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
}

export const generateInvoiceAPI = (filePath) => async(dispatch) => {
    try{
        dispatch({type: GENERATE_INVOICE_REQUEST})
        // e7fe8081-0b38-4985-820f-244a02347ccc/2025-03-19_16-43-05_TLE-EIS-2425-776-Kloudineer (1) (1).pdf
        // const filePath = "e7fe8081-0b38-4985-820f-244a02347ccc/2025-03-19_11-57-16_TLE-EIS-2425-776-Kloudineer (1) (1).pdf"
        console.log('Making api for generating invoice');
        const {data} = await axios.post(`${baseUrl}/api/v1/run/${WORKFLOWS.INVOICING.flowId}?stream=false`,{
            // input_value: "What is inside the file.",
            output_type: "chat",
            input_type: "chat",
            tweaks: {
                [WORKFLOWS.INVOICING.fileComponentId]: {
                    "path":filePath
                }
            }
        })

        console.log('if: ',data.outputs[0].outputs[0].messages[0].message);
        const invoiceData = JSON.parse(data.outputs[0].outputs[0].messages[0].message)
        
        dispatch({type: GENERATE_INVOICE_SUCCESS, payload: invoiceData})
        // console.log('Invoice Data: ',data.outputs[0].outputs[0].results.message.text);
        
        return invoiceData
    }catch(error){
        console.log('Error:', error)
        dispatch({type: GENERATE_INVOICE_FAIL,
            payload: error.response?.data?.message || error.message,
        })
    }
}

export const reconcileAPI = (invoiceData) => async(dispatch) => {

}