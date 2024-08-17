document.addEventListener('DOMContentLoaded', () => {
    const productTableBody = document.getElementById('productTableBody');
    const searchBox = document.getElementById('searchBox');
    const priceFilter = document.getElementById('priceFilter');

    let products = [];

    $('#createProductButton').on('click', function() {
        openModal(); // Open modal for creating a new product
    });

    function fetchProducts() {
        axios.get('https://66b203db1ca8ad33d4f6247d.mockapi.io/product')
            .then(response => {
                products = response.data;
                renderProducts(products);
            })
            .catch(error => {
                console.error('There was an error fetching the product data!', error);
            });
    }

    function renderProducts(products) {
        productTableBody.innerHTML = '';
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.screen}</td>
                <td>${product.backCamera}</td>
                <td>${product.frontCamera}</td>
                <td><img src="${product.img}" alt="${product.name}" style="width: 100px; height: auto;"></td>
                <td>${product.desc}</td>
                <td>${product.type}</td>
                <td>
                    <button class="btn btn-warning btn-sm updateBtn" data-id="${product.id}">Update</button>
                    <button class="btn btn-danger btn-sm deleteBtn" data-id="${product.id}">Delete</button>
                </td>
            `;
            productTableBody.appendChild(row);
        });
        document.querySelectorAll('.updateBtn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.getAttribute('data-id');
                editingProduct = products.find(p => p.id === productId);
                openModal(editingProduct);
            });
        });

        document.querySelectorAll('.deleteBtn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.getAttribute('data-id');
                deleteProduct(productId);
            });
        });
    }

    function openModal(product = null) {
        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productScreen').value = product.screen;
            document.getElementById('productBackCamera').value = product.backCamera;
            document.getElementById('productFrontCamera').value = product.frontCamera;
            document.getElementById('productImage').value = product.img;
            document.getElementById('productDesc').value = product.desc;
            document.getElementById('productType').value = product.type;
        } else {
            productForm.reset();
        }
        $('#productModal').modal('show');
    }
    
    // Search functionality
    searchBox.addEventListener('input', () => {
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchBox.value.toLowerCase())
        );
        renderProducts(filteredProducts);
    });

    function sortProducts(sortOrder) {
        if (sortOrder === 'asc') {
            products.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'desc') {
            products.sort((a, b) => b.price - a.price);
        }
        renderProducts(products);
    }

    fetchProducts();

    productForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = document.getElementById('productId').value;
        const productData = {
            name: document.getElementById('productName').value,
            price: document.getElementById('productPrice').value,
            screen: document.getElementById('productScreen').value,
            backCamera: document.getElementById('productBackCamera').value,
            frontCamera: document.getElementById('productFrontCamera').value,
            img: document.getElementById('productImage').value,
            desc: document.getElementById('productDesc').value,
            type: document.getElementById('productType').value,
        };
    
        if (id) {
            axios.put(`https://66b203db1ca8ad33d4f6247d.mockapi.io/product/${id}`, productData)
                .then(response => {
                    fetchProducts();
                    $('#productModal').modal('hide'); // Use jQuery to hide the modal
                })
                .catch(error => {
                    console.error('There was an error updating the product!', error);
                });
        } else {
            axios.post('https://66b203db1ca8ad33d4f6247d.mockapi.io/product', productData)
                .then(response => {
                    fetchProducts();
                    $('#productModal').modal('hide'); // Use jQuery to hide the modal
                })
                .catch(error => {
                    console.error('There was an error creating the product!', error);
                });
        }
    });
    
    function deleteProduct(id) {
        axios.delete(`https://66b203db1ca8ad33d4f6247d.mockapi.io/product/${id}`)
            .then(response => {
                fetchProducts();
            })
            .catch(error => {
                console.error('There was an error deleting the product!', error);
            });
    }

    // Filter products by price
    document.getElementById('priceFilter').addEventListener('change', function() {
        const sortOrder = this.value;
        sortProducts(sortOrder);
    });

    // Search products by name
    searchBox.addEventListener('input', () => {
        const searchTerm = searchBox.value.toLowerCase();
        const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm));
        renderProducts(filteredProducts);
    });

    // Initial fetch
    fetchProducts();
});