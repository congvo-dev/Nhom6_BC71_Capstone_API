var urlApi = "https://66b203db1ca8ad33d4f6247d.mockapi.io/product"
// showcase
var productArr = [];
function fetchListProduct() {
    axios({
        url: urlApi,
        method: "GET"
    })
    .then(function (res){
        renderProduct(res.data);
        console.log(res.data);
        productArr = res.data;
        console.log("🚀 ~ productArr:", productArr);
    })
    .catch(function (err){
        console.log(err);
    });
}

function renderProduct(listProduct) {
    var contentHTML = "";
    for (var i=0; i<listProduct.length; i++) {
        var divString = 
        `<div class="col-lg-3 text-center show_item">

        <img src="${listProduct[i].img}" alt="" width="100%" />
        <h3>${listProduct[i].name}</h3>
        <p>${listProduct[i].desc}</p>
        <h3>$${listProduct[i].price}</h3>

        <button class="btn btn-outline-success">Chi tiết</button>
        <button class="btn btn-success"
            id="buyNow" 
            onclick="addItemCart(${listProduct[i].id})">
            Mua
        </button>

      </div>`;
      contentHTML += divString;
    }
    document.getElementById("productShowcase").innerHTML = contentHTML;
}

fetchListProduct();
console.log("productArr:",productArr);



function showType(event) {
    axios({
        url: urlApi,
        method: "GET"
    })
    .then(function (res){
        const selectedValue = event.target.value;
        console.log("selectedValue:",selectedValue);
        var productArr = res.data;
        if (selectedValue === "All") {
            console.log("selectedValue:",selectedValue);
            return renderProduct(productArr);
        } 
        var typeArr = productArr.filter(function(item) {
            return item.type === selectedValue;
        });
        console.log("typeArr:",typeArr);
        renderProduct(typeArr);
    })
    .catch(function (err){
        console.log(err);
    });
}

// CART
var cartArr = [];

// lay du lieu tu localStorage
var cartData = localStorage.getItem("CART_JSON");
// parse du lieu dang string
var cartDataparsed= JSON.parse(cartData) ;
console.log("🚀 ~ cartDataparsed:", cartDataparsed);
if (cartDataparsed.length != 0) {
    for (var i=0; i<cartDataparsed.length;i++) {
        var data = cartDataparsed[i];
        var cartItem = new CartProduct(
            data.name,
            data.price,
            data.img,
            data.sl,
        );
        cartArr.push(cartItem);
    }
    console.log("🚀 ~ cartArr:", cartArr)
    renderCart();
}

function addItemCart(id) {
    axios({
        url: `${urlApi}/${id}`,
        method: "GET",
    })
    .then(function (res){
        var product = res.data;
        var cartItem = new CartProduct (
            product.name,
            product.price,
            product.img,
            1,
            );
            for (var i=0; i<cartArr.length; i++) {
                if (product.name === cartArr[i].name) {
                    cartArr[i].sl++;
                    console.log("cartArr[i].sl:",cartArr[i].sl);
                    localStorage.setItem("CART_JSON", JSON.stringify(cartArr));
                    renderCart();
                    return;
                }
            }
            cartArr.push(cartItem);
            console.log("cartArr:",cartArr);
            localStorage.setItem("CART_JSON", JSON.stringify(cartArr));
            renderCart();
        })

    .catch(function (err){
        console.log(err);
    });
}


function minusSL(i,sl) {
    sl--;
    cartArr[i].sl = sl;
    localStorage.setItem("CART_JSON", JSON.stringify(cartArr));
    renderCart();
    console.log("sl:",sl);
}
function plusSL(i,sl) {
    sl++;
    cartArr[i].sl = sl;
    localStorage.setItem("CART_JSON", JSON.stringify(cartArr));
    renderCart();
    console.log("sl:",sl);
}

function renderCart() {
    var contentHTML = "";
    if (cartArr.length == 0) {
        document.getElementById("tblDanhSachSP").innerHTML = contentHTML;
        return;
    }
    for (var i=0; i<cartArr.length; i++) {
        var product = cartArr[i];
        var trString = 
        `<tr>
            <td>
            <img src="${product.img}" alt="" width="100" />
            </td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>
                <div class="d-flex">
                <button class="btn" onclick="minusSL(${i},${product.sl})">-</button>
                <input id="soLuong" type="text" class="" value="${product.sl}"/>
                <button class="btn" onclick="plusSL(${i},${product.sl})">+</button>

                </div>
                </td>
            <td id="tong">${product.tong()}</td>
            <td><button onclick="deleteItemCart(${i})" class="btn btn-outline-success">X</button></td>
        </tr>`;
        contentHTML += trString;
    }
    var totalString = `<tr>
        <td>Total: </td>
        <td>${cartTotal()}</td>
        <td>
            <button id="tinhTien" onclick="thanhToan()" class="btn btn-success">Thanh Toán</button>
        </td>
    </tr>`;
    contentHTML += totalString;
    document.getElementById("tblDanhSachSP").innerHTML = contentHTML;
}

function cartTotal () {
    var total = null;
    for (var i=0; i<cartArr.length; i++) {
        var tongItem = cartArr[i].tong();
        total = total + tongItem;
    }
    console.log("🚀 ~ cartTotal ~ total:", total)
    return total.toLocaleString("en-EN");
}

function deleteItemCart(viTri){
    cartArr.splice(viTri,1);
    localStorage.setItem("CART_JSON", JSON.stringify(cartArr));
    renderCart();
    console.log("cartArr",cartArr);
}

function thanhToan() {
    cartArr = [];
    localStorage.setItem("CART_JSON", JSON.stringify(cartArr));
    alert("Cảm ơn đã mua hàng!");
    renderCart();
}