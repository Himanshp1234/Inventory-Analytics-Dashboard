// =======================
// Product Data
// =======================

const products = [
    { id: 1, name: "iPhone 13", price: 50000, stock: 5 },
    { id: 2, name: "Samsung S23", price: 70000, stock: 3 },
    { id: 3, name: "Redmi Note", price: 15000, stock: 10 },
    { id: 4, name: "Realme Narzo", price: 12000, stock: 8 },
    { id: 5, name: "OnePlus Nord", price: 28000, stock: 6 },
    { id: 6, name: "Poco X5", price: 18000, stock: 12 }
];

// =======================
// Currency Format
// =======================

function formatCurrency(value)
{
    return value.toLocaleString("en-IN");
}

// =======================
// Sorting (Preprocessing)
// =======================

const sortedProducts = [...products].sort(
    (a, b) => a.price - b.price
);

// =======================
// Prefix Sum
// =======================

const prefixInventory = [];

let runningSum = 0;

sortedProducts.forEach(product => {

    runningSum +=
        product.price * product.stock;

    prefixInventory.push(runningSum);

});

// =======================
// Render Products
// =======================

function renderProducts(productList)
{
    const table =
        document.getElementById("productTable");

    table.innerHTML = "";

    productList.forEach(product => {

        const inventoryValue =
            product.price * product.stock;

        const lowStock =
            product.stock < 5
            ? " ⚠ Low Stock"
            : "";

        table.innerHTML += `
            <tr>
                <td>${product.name}</td>
                <td>₹${formatCurrency(product.price)}</td>
                <td>${product.stock}${lowStock}</td>
                <td>₹${formatCurrency(inventoryValue)}</td>
            </tr>
        `;
    });
}

// =======================
// Binary Search
// Lower Bound
// =======================

function lowerBound(target)
{
    let left = 0;
    let right = sortedProducts.length - 1;

    let answer = sortedProducts.length;

    while(left <= right)
    {
        const mid =
            Math.floor((left + right) / 2);

        if(sortedProducts[mid].price >= target)
        {
            answer = mid;
            right = mid - 1;
        }
        else
        {
            left = mid + 1;
        }
    }

    return answer;
}

// =======================
// Binary Search
// Upper Bound
// =======================

function upperBound(target)
{
    let left = 0;
    let right = sortedProducts.length - 1;

    let answer = -1;

    while(left <= right)
    {
        const mid =
            Math.floor((left + right) / 2);

        if(sortedProducts[mid].price <= target)
        {
            answer = mid;
            left = mid + 1;
        }
        else
        {
            right = mid - 1;
        }
    }

    return answer;
}

// =======================
// Prefix Sum Query
// =======================

function getInventoryValue(leftIndex,rightIndex)
{
    if(leftIndex > rightIndex)
    {
        return 0;
    }

    if(leftIndex === 0)
    {
        return prefixInventory[rightIndex];
    }

    return (
        prefixInventory[rightIndex]
        -
        prefixInventory[leftIndex - 1]
    );
}

// =======================
// Search
// =======================

function optimizedSearch()
{
    const min =
        Number(
            document.getElementById("minPrice").value
        ) || 0;

    const max =
        Number(
            document.getElementById("maxPrice").value
        ) || Infinity;

    const productName =
        document
        .getElementById("productName")
        .value
        .toLowerCase();

    const left =
        lowerBound(min);

    const right =
        upperBound(max);

    let filtered =
        sortedProducts.slice(
            left,
            right + 1
        );

    filtered =
        filtered.filter(product =>
            product.name
            .toLowerCase()
            .includes(productName)
        );

    let inventoryValue = 0;

    filtered.forEach(product => {

        inventoryValue +=
            product.price * product.stock;

    });

    document
    .getElementById("productCount")
    .textContent =
        filtered.length;

    document
    .getElementById("inventoryValue")
    .textContent =
        `₹${formatCurrency(inventoryValue)}`;

    if(filtered.length === 0)
    {
        document
        .getElementById("message")
        .textContent =
            "No Products Found";
    }
    else
    {
        document
        .getElementById("message")
        .textContent = "";
    }

    renderProducts(filtered);
}

// =======================
// Top Inventory Product
// =======================

function findTopInventoryProduct()
{
    let best = products[0];

    products.forEach(product => {

        const currentValue =
            product.price * product.stock;

        const bestValue =
            best.price * best.stock;

        if(currentValue > bestValue)
        {
            best = product;
        }

    });

    document
    .getElementById("topProduct")
    .textContent =
        best.name;
}

// =======================
// Average Price
// =======================

function calculateAveragePrice()
{
    let total = 0;

    products.forEach(product => {

        total += product.price;

    });

    const average =
        Math.round(
            total / products.length
        );

    document
    .getElementById("averagePrice")
    .textContent =
        `₹${formatCurrency(average)}`;
}

// =======================
// Sort Asc
// =======================

document
.getElementById("sortAsc")
.addEventListener("click", () => {

    const sorted =
        [...products].sort(
            (a,b) => a.price - b.price
        );

    renderProducts(sorted);

});

// =======================
// Sort Desc
// =======================

document
.getElementById("sortDesc")
.addEventListener("click", () => {

    const sorted =
        [...products].sort(
            (a,b) => b.price - a.price
        );

    renderProducts(sorted);

});

// =======================
// Slider
// =======================

const slider =
    document.getElementById("priceSlider");

slider.addEventListener("input", () => {

    document
    .getElementById("sliderValue")
    .textContent =
        `₹${formatCurrency(slider.value)}`;

});

// =======================
// Dark Mode
// =======================

document
.getElementById("themeBtn")
.addEventListener("click", () => {

    document.body
        .classList
        .toggle("dark");

});

// =======================
// CSV Export
// =======================

document
.getElementById("downloadCSV")
.addEventListener("click", () => {

    let csv =
        "Name,Price,Stock\n";

    products.forEach(product => {

        csv +=
            `${product.name},${product.price},${product.stock}\n`;

    });

    const blob =
        new Blob(
            [csv],
            { type: "text/csv" }
        );

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "inventory-report.csv";

    link.click();

});

// =======================
// Search Button
// =======================

document
.getElementById("searchBtn")
.addEventListener(
    "click",
    optimizedSearch
);

// =======================
// Initial Load
// =======================

renderProducts(products);

document
.getElementById("productCount")
.textContent =
    products.length;

let initialInventory = 0;

products.forEach(product => {

    initialInventory +=
        product.price * product.stock;

});

document
.getElementById("inventoryValue")
.textContent =
    `₹${formatCurrency(initialInventory)}`;

findTopInventoryProduct();

calculateAveragePrice();