module.exports = class Order{
    constructor(originUser){
        this.order = [originUser]
    }

    addUser(user) {
        this.order.push(user)
    }

    deleteUser(user){
        this.order = this.order.filter(elem => elem !== user)
    }

    changeOrder(){
        this.order.push(...this.order.splice(0, 1))
    }
}