const connectionSection = document.getElementById("connection-section");
const explorerSection = document.getElementById("explorer-section");
const connectionForm = document.getElementById("connection-form");
const errorText = document.getElementById("connection-error");
const tablesList = document.getElementById("tables-list");

let connectionData = null;

//Enviar form y conectar
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
    const response = await fetch(
      "http://localhost:8000/metadata/dynamic/tables",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(connectionData)
      }
    );

    if (!response.ok) throw new Error();

    const data = await response.json();

    // 👉 AQUÍ va el cambio de sección
    connectionSection.hidden = true;
    explorerSection.hidden = false;

    renderTables(data.tables);

  } catch {
    errorText.textContent = "Connection failed";
  }
});


function renderTables(tables) {
  tablesList.innerHTML = "";

  tables.forEach(table => {
    const li = document.createElement("li");
    li.textContent = table;
    li.onclick = () => loadColumns(table);
    tablesList.appendChild(li);
  });

  li.onclick = () => {
  document.querySelectorAll("#tables-list li")
    .forEach(el => el.classList.remove("active"));

  li.classList.add("active");
  loadColumns(table);
};

}


//Funcion para cargar columnas
async function loadColumns(tableName) {
  const columnsTable = document.getElementById("columns-table");
  columnsTable.innerHTML = "";

  try {
    const response = await fetch(
      `http://localhost:8000/metadata/dynamic/tables/${tableName}/columns`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(connectionData)
      }
    );

    if (!response.ok) throw new Error();

    const data = await response.json();

    // conexión exitosa
    connectionSection.hidden = true;
    explorerSection.hidden = false;

    data.columns.forEach(col => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${col.column_name}</td>
        <td>${col.data_type}</td>
        <td>${col.is_nullable}</td>
        <td>${col.column_key || ""}</td>
      `;

      columnsTable.appendChild(tr);
    });

  } catch (error) {
    columnsTable.innerHTML =
      "<tr><td colspan='4'>Error loading columns</td></tr>";
  }
}