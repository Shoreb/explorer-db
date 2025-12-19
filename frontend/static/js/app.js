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
}


//Funcion para cargar columnas
async function loadColumns(tableName) {
    resultDiv.innerHTML += `<h4>Columnas de ${tableName}</h4>`;

    try {
        const response = await fetch(
            `/metadata/dynamic/tables/${tableName}/columns`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(connectionData)
            }
        );

        const result = await response.json();

            // ✅ conexión exitosa
        connectionSection.hidden = true;
        explorerSection.hidden = false;


        if (!response.ok) {
            throw new Error(result.detail || "Error al cargar columnas");
        }

        const ul = document.createElement("ul");

        result.columns.forEach(col => {
            const li = document.createElement("li");
            li.textContent = `${col.COLUMN_NAME} (${col.DATA_TYPE})`;
            ul.appendChild(li);
        });

        resultDiv.appendChild(ul);

    } catch (error) {
        resultDiv.innerHTML += `<p style="color:red">${error.message}</p>`;
    }
}
