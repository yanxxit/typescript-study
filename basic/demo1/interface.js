function greeter(person) {
    return "Hello," + person.firstName + " " + person.lastName;
}
var user = { firstName: "张", lastName: "三" };
console.log(greeter(user));
