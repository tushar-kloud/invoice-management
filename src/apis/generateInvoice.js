import axios from "axios";

export const generateInvoiceAPI = async () => {
    try{
        const response = await axios.post( 
            `https://langflow-v3-large.salmonisland-47da943e.centralindia.azurecontainerapps.io/api/v1/run/3ef4d04e-845f-4d0f-a246-bb536372648f?stream=false`,
            {
                'input_value': "Hello from the IMS system!",
                'output_type': "chat",
                'input_type': "chat"
            },
            {
              header:{
                'Content-Type': 'application/json'
              }
            },
        )
        console.log(response);
    }catch(error){
        console.log('Error:',error); 
    }
}
