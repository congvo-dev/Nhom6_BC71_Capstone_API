function CartProduct (name, price, img, sl) {
    this.name = name;
    this.price = price;
    this.img = img;
    this.sl = sl;
    this.tong = function() {
        return this.price*this.sl;
    };
}