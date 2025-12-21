// ===============================
// ELEMENTOS DEL DOM
// ===============================
const connectionSection = document.getElementById("connection-section");
const explorerSection = document.getElementById("explorer-section");
const connectionForm = document.getElementById("connection-form");
const errorText = document.getElementById("connection-error");
const tablesList = document.getElementById("tables-list");
const columnsTable = document.getElementById("columns-table");

// ===============================
// ESTADO GLOBAL
// ===============================
let connectionData = null;

// ===============================
// CONECTAR A LA BD
// ===============================
connectionForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorText.textContent = "";

  connectionData = {
    host: document.getElementById("host").value,
    port: Number(document.getElementById("port").value),
    user: document.getElementById("user").value,
    password: document.getElementById("password").value,
    database: document.getElementById("database").value
  };

  try {
    const response = await fetch(
      "http://localhost:8000/metadata/dynamic/tables",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(connectionData)
      }
    );

    if (!response.ok) {
      throw new Error("Connection failed");
    }

    const data = await response.json();

    // UI
    connectionSection.hidden = true;
    explorerSection.hidden = false;

    renderTables(data.tables);

  } catch (err) {
    errorText.textContent = "Error de conexión a la base de datos";
    console.error(err);
  }
});

// ===============================
// RENDER TABLAS
// ===============================
function renderTables(tables) {
  tablesList.innerHTML = "";
  columnsTable.innerHTML = "";

  tables.forEach((tableName) => {
    const li = document.createElement("li");
    li.textContent = tableName;
    li.classList.add("table-item");

    li.addEventListener("click", () => {
      document
        .querySelectorAll(".table-item")
        .forEach(el => el.classList.remove("active"));

      li.classList.add("active");
      loadColumns(tableName);
    });

    tablesList.appendChild(li);
  });
}

// ===============================
// CARGAR COLUMNAS (DINÁMICO)
// ===============================
async function loadColumns(tableName) {
  const tbody = document.getElementById("columns-table");

  // extra
  if (!tbody) {
    console.error("columns-table not found in DOM");
    return;
  }

  tbody.innerHTML = "";

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/metadata/dynamic/tables/${tableName}/columns`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(connectionData)
      }
    );

    const result = await response.json();

    console.log("RAW RESPONSE:", result);

    if (!result.columns || !Array.isArray(result.columns)) {
      throw new Error("Invalid columns format");
    }

    result.columns.forEach(col => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${col.name ?? "-"}</td>
        <td>${col.type ?? "-"}</td>
        <td>${col.nullable ?? "-"}</td>
        <td>${col.key || "-"}</td>
      `;

      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error("Load columns error:", error);
    tbody.innerHTML = `
      <tr>
        <td colspan="4">Error loading columns</td>
      </tr>
    `;
  }
}
