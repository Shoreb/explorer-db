const loadTablesBtn = document.getElementById("loadTablesBtn");
const tablesList = document.getElementById("tablesList");
const columnsTableBody = document.querySelector("#columnsTable tbody");

loadTablesBtn.addEventListener("click", loadTables);

async function loadTables() {
    tablesList.innerHTML = "";
    columnsTableBody.innerHTML = "";

    try {
        const response = await fetch("/metadata/tables");
        const data = await response.json();

         console.log(data.columns);

        data.tables.forEach(table => {
            const li = document.createElement("li");
            li.textContent = table;

            li.addEventListener("click", () => {
                loadColumns(table);
            });

            tablesList.appendChild(li);
        });
    } catch (error) {
        console.error("Error cargando tablas:", error);
    }
}

async function loadColumns(tableName) {
    columnsTableBody.innerHTML = "";

    try {
        const response = await fetch(`/metadata/tables/${tableName}/columns`);
        const data = await response.json();

        data.columns.forEach(col => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${col.column_name}</td>
                <td>${col.data_type}</td>
                <td>${col.is_nullable}</td>
                <td>${col.column_key || ""}</td>
            `;

            columnsTableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error cargando columnas:", error);
    }
}
