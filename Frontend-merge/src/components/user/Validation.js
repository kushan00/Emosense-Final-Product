
export const ValidateSignUp=(formData) =>{

    const messages ={
       NAME_EMPTY :"The name should at least be 3 letters...",
       EMAIL_EMPTY : "Email must contain @ and atleast 3 letter before for the prefix...",
       STUDENT_IT_NUMBER_EMPTY : " Enter valid Registration number...",
       MOBILE_NO_EMPTY : "Enter a valid mobile number..."

    };

    const output ={
            status : false,
            message : null
    };

    if(formData.name.length <= 2 )
    {
        output.message = messages.NAME_EMPTY;
        output.status = false;
        return output;
    
    }
    if(formData.email.length <= 2)
    {
        output.message = messages.EMAIL_EMPTY;
        output.status = false;
        return output;
    } 
    if((formData.mobileno.length < 10) || (formData.mobileno.length > 12))
    {
        output.message = messages.MOBILE_NO_EMPTY;
        output.status = false;
        return output;
    }
    if((formData.ITnumber.length < 10) || (formData.ITnumber.length > 10))
    {
        output.message = messages.STUDENT_IT_NUMBER_EMPTY;
        output.status = false;
        return output;
    }
    else
    {
        output.status = true;
        return output;
    }
 
};