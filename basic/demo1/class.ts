class Student {
    fullName:string;
    constructor(public firstName,public middleInitial,public lastName){
        this.fullName = firstName +" "+ middleInitial+" "+lastName
    }
}

interface Person{
    firstName:string;
    lastName:string;
}

function greeter(p:Person){
    return "Hello, "+ p.firstName+" "+p.lastName
}

let user = new Student("Jane","M.","User");
console.log(greeter(user))