const form = document.getElementById("connection-form");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    resultDiv.innerHTML = "Conectando...";

    const data = {
        host: document.getElementById("host").value,
        port: Number(document.getElementById("port").value),
        user: document.getElementById("user").value,
        password: document.getElementById("password").value,
        database: document.getElementById("database").value
    };

    try {
        const response = await fetch(
            "/metadata/dynamic/tables",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || "Error desconocido");
        }

        showTables(result.tables);

    } catch (error) {
        resultDiv.innerHTML = `<p style="color:red">${error.message}</p>`;
    }
});

function showTables(tables) {
    resultDiv.innerHTML = "<h3>Tablas</h3>";

    if (!tables || tables.length === 0) {
        resultDiv.innerHTML += "<p>No se encontraron tablas.</p>";
        return;
    }

    const ul = document.createElement("ul");

    tables.forEach(table => {
        const li = document.createElement("li");
        li.textContent = Object.values(table)[0];
        ul.appendChild(li);
    });

    resultDiv.appendChild(ul);
}

