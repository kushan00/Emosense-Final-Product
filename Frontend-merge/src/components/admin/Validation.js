
export const ValidateAddNewUser=(formData) =>{

    const messages ={
       FULL_NAME_EMPTY :"The name should at least be 3 letters...",
       EMAIL_EMPTY : "Email must contain @ and atleast 3 letter before for the prefix...",
       WEIGHT_EMPTY : " Enter valid Weight...",
       HEIGHT_EMPTY : " Enter valid height...",
       MOBILE_NO_EMPTY : "Enter a valid mobile number...",
       DOB_EMPTY:"Date of Birth is empty..."

    };

    const output ={
            status : false,
            message : null
    };

    if(formData.fullName.length <= 2 )
    {
        output.message = messages.FULL_NAME_EMPTY;
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
    if(formData.weight.length <= 0)
    {
        output.message = messages.WEIGHT_EMPTY;
        output.status = false;
        return output;
    }
    if(formData.height.length <= 0)
    {
        output.message = messages.HEIGHT_EMPTY;
        output.status = false;
        return output;
    }
    if(formData.dateOfBirth.length <= 0)
    {
        output.message = messages.DOB_EMPTY;
        output.status = false;
        return output;
    }
    else
    {
        output.status = true;
        return output;
    }
 
};

export const ValidateAddNewInstructor=(formData) =>{

    const messages ={
        FULL_NAME_EMPTY :"The name should at least be 3 letters...",
        EMAIL_EMPTY : "Email must contain @ and atleast 3 letter before for the prefix...",
        WEIGHT_EMPTY : " Enter valid Weight...",
        HEIGHT_EMPTY : " Enter valid height...",
        MOBILE_NO_EMPTY : "Enter a valid mobile number...",
        DOB_EMPTY:"Date of Birth is empty..."
     };

    const output ={
            status : false,
            message : null
    };

    if(formData.fullName.length <= 2 )
    {
        output.message = messages.FULL_NAME_EMPTY;
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
    if(formData.weight.length <= 0)
    {
        output.message = messages.WEIGHT_EMPTY;
        output.status = false;
        return output;
    }
    if(formData.height.length <= 0)
    {
        output.message = messages.HEIGHT_EMPTY;
        output.status = false;
        return output;
    }
    if(formData.dateOfBirth.length <= 0)
    {
        output.message = messages.DOB_EMPTY;
        output.status = false;
        return output;
    }
    else
    {
        output.status = true;
        return output;
    }
 
};