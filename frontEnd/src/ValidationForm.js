export class ValidationFormError extends Error{

    constructor(message){
        super(message);
        this.name="";
    }

}