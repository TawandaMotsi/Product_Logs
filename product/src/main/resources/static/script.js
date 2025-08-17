const API_URL = 'http://localhost:8080/products';

const DUMMY_PRODUCTS = [
  { productName: "Wireless Mouse", productDescription: "Ergonomic wireless mouse", productPrice: 20, productStock: 50 },
  { productName: "Mechanical Keyboard", productDescription: "RGB backlit mechanical keyboard", productPrice: 60, productStock: 30 },
];

// Auto-seed if DB is empty
async function seedDummyProducts() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    if (!data.length) {
      console.log("No products found. Seeding...");
      for (let product of DUMMY_PRODUCTS) {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        });
      }
    }
  } catch (err) {
    console.warn("Backend not reachable for seeding:", err);
  }
}

async function fetchProducts() {
  const tbody = document.querySelector("#productTable tbody");
  tbody.innerHTML = "";

  try {
    const res = await fetch(API_URL);
    const products = await res.json();

    products.forEach(p => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.id || "-"}</td>
        <td>${p.productName}</td>
        <td>${p.productDescription}</td>
        <td>€${p.productPrice}</td>
        <td>${p.productStock}</td>
        <td class="actions">
          <button class="delete-btn" data-id="${p.id}">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchProducts();
      });
    });

  } catch (err) {
    console.warn("Could not fetch from API. Showing dummy data.");
    DUMMY_PRODUCTS.forEach(p => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>-</td>
        <td>${p.productName}</td>
        <td>${p.productDescription}</td>
        <td>€${p.productPrice}</td>
        <td>${p.productStock}</td>
        <td class="actions"><button disabled>Delete</button></td>
      `;
      tbody.appendChild(row);
    });
  }
}

document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const product = {
    productName: document.getElementById("name").value,
    productDescription: document.getElementById("description").value,
    productPrice: parseFloat(document.getElementById("price").value),
    productStock: parseInt(document.getElementById("stock").value)
  };
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    e.target.reset();
    fetchProducts();
  } catch (err) {
    alert("Backend not available. Could not add product.");
  }
});

// Run auto-seed then fetch products
(async () => {
  await seedDummyProducts();
  fetchProducts();
})();
