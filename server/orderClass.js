module.exports = class Order{
    constructor(originUser){
        this.order = [originUser]
    }

    reverseOrder(){
        this.order.reverse()
    }

    addUser(user) {
        this.order.push(user)
    }

    deleteUser(user){
        this.order = this.order.filter(elem => elem !== user)
    }

    changeOrder(times){
        for (let i = 0; i < times; i++) {
            this.order.push(...this.order.splice(0, 1))
        }
    }
}