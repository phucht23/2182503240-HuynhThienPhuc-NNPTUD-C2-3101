const API_URL = "https://api.escuelajs.co/api/v1/products";
let allProducts = [];
let displayData = [];
let currentPage = 1;
let pageSize = 10;
let currentSort = { column: '', dir: 'asc' };

// 1. Hàm GET ALL dữ liệu từ API
async function loadProducts() {
    try {
        const response = await fetch(API_URL);
        allProducts = await response.json();
        displayData = [...allProducts]; // Bản sao để lọc/sắp xếp
        renderUI();
    } catch (err) {
        console.error("Lỗi fetch:", err);
    }
}

// 2. Hàm hiển thị dữ liệu ra bảng
function renderUI() {
    const start = (currentPage - 1) * pageSize;
    const end = start + parseInt(pageSize);
    const paginatedItems = displayData.slice(start, end);

    const tbody = document.getElementById("productData");
    tbody.innerHTML = paginatedItems.map(item => `
        <tr>
            <td>${item.id}</td>
            <td><b>${item.title}</b></td>
            <td>$${item.price}</td>
            <td><img src="${item.images[0]}" class="img-product" onerror="this.src='https://placehold.co/80'"></td>
            <td class="col-desc"><em>(Di chuột vào đây)</em><br><span>${item.description}</span></td>
        </tr>
    `).join("");

    updatePaginationInfo();
}

// 3. Tìm kiếm (onChange/onInput)
document.getElementById("txtSearch").addEventListener("input", (e) => {
    const key = e.target.value.toLowerCase();
    displayData = allProducts.filter(p => p.title.toLowerCase().includes(key));
    currentPage = 1; // Reset về trang 1
    renderUI();
});

// 4. Thay đổi số lượng dòng
document.getElementById("selPageSize").onchange = (e) => {
    pageSize = e.target.value;
    currentPage = 1;
    renderUI();
};

// 5. Sắp xếp
function handleSort(col) {
    const dir = currentSort.column === col && currentSort.dir === 'asc' ? 'desc' : 'asc';
    currentSort = { column: col, dir: dir };

    displayData.sort((a, b) => {
        let valA = a[col];
        let valB = b[col];
        if (typeof valA === 'string') {
            return dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return dir === 'asc' ? valA - valB : valB - valA;
    });

    // Cập nhật icon
    document.getElementById("icon-title").innerText = "↕";
    document.getElementById("icon-price").innerText = "↕";
    document.getElementById(`icon-${col}`).innerText = dir === 'asc' ? "↑" : "↓";

    renderUI();
}

// 6. Điều khiển phân trang
function updatePaginationInfo() {
    const totalPages = Math.ceil(displayData.length / pageSize);
    document.getElementById("lblPageInfo").innerText = `Trang ${currentPage} / ${totalPages || 1}`;
    document.getElementById("btnPrev").disabled = (currentPage === 1);
    document.getElementById("btnNext").disabled = (currentPage >= totalPages);
}

document.getElementById("btnPrev").onclick = () => { currentPage--; renderUI(); };
document.getElementById("btnNext").onclick = () => { currentPage++; renderUI(); };

// Chạy lần đầu
loadProducts();