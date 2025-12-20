// ====== REFERENCIAS DOM ======
const connectionSection = document.getElementById("connection-section");
const explorerSection = document.getElementById("explorer-section");
const connectionForm = document.getElementById("connection-form");
const errorText = document.getElementById("connection-error");

const tablesList = document.getElementById("tables-list");
const columnsBody = document.getElementById("columns-body");

// ====== ESTADO GLOBAL ======
let connectionData = null;

// ====== CONEXIÓN ======
connectionForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorText.textContent = "";

  connectionData = {
    host: host.value,
    port: Number(port.value),
    user: user.value,
    password: password.value,
    database: database.value
  };

  try {
    const response = await fetch("/metadata/dynamic/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(connectionData)
    });

    if (!response.ok) {
      throw new Error("Connection failed");
    }

    const data = await response.json();

    // Cambiar sección
    connectionSection.hidden = true;
    explorerSection.hidden = false;

    // Renderizar tablas directamente
    renderTables(data.tables);

  } catch (error) {
    errorText.textContent = "Connection failed";
  }
});

// ====== RENDER TABLAS ======
function renderTables(tables) {
  tablesList.innerHTML = "";

  if (!tables || tables.length === 0) {
    tablesList.innerHTML = "<li>No tables found</li>";
    return;
  }

  tables.forEach((item) => {
    const tableName = item.table_name;

    const li = document.createElement("li");
    li.textContent = tableName;
    li.classList.add("table-item");

    li.addEventListener("click", () => {
      // UX: marcar tabla activa
      document
        .querySelectorAll("#tables-list li")
        .forEach(el => el.classList.remove("active"));

      li.classList.add("active");

      loadColumns(tableName);
    });

    tablesList.appendChild(li);
  });
}

// ====== CARGAR COLUMNAS DINÁMICAS ======
async function loadColumns(tableName) {
  columnsBody.innerHTML = `
    <tr>
      <td colspan="4">Loading columns...</td>
    </tr>
  `;

  try {
    const response = await fetch(
      `/metadata/dynamic/tables/${tableName}/columns`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(connectionData)
      }
    );

    if (!response.ok) {
      throw new Error("Error loading columns");
    }

    const data = await response.json();
    columnsBody.innerHTML = "";

    data.columns.forEach(col => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${col.column_name}</td>
        <td>${col.data_type}</td>
        <td>${col.is_nullable}</td>
        <td>${col.column_key || "-"}</td>
      `;

      columnsBody.appendChild(tr);
    });

  } catch (error) {
    columnsBody.innerHTML = `
      <tr>
        <td colspan="4">Error loading columns</td>
      </tr>
    `;
  }
}
