document.getElementById('supplierForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const supplierData = {
        supplierName: document.getElementById('supplierName').value,
        requestDate: document.getElementById('requestDate').value,
        supplierCNPJ: document.getElementById('supplierCNPJ').value,
        serviceStartDate: document.getElementById('serviceStartDate').value,
        justification: document.getElementById('justification').value,
        totalValue: document.getElementById('totalValue').value,
        additionalFiles: document.getElementById('additionalFiles').value // Aqui você pode lidar com arquivos de maneira mais complexa
    };

    try {
        const response = await fetch('http://localhost:5000/api/suppliers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(supplierData)
        });

        const newSupplier = await response.json();
        addSupplierToTable(newSupplier);

        document.getElementById('supplierForm').reset();
    } catch (error) {
        console.error('Erro ao cadastrar fornecedor:', error);
    }
});

async function loadSuppliers() {
    try {
        const response = await fetch('http://localhost:5000/api/suppliers');
        const suppliers = await response.json();

        suppliers.forEach(addSupplierToTable);
    } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
    }
}

function addSupplierToTable(supplier) {
    const supplierTable = document.getElementById('supplierTable');
    const newRow = supplierTable.insertRow();

    newRow.innerHTML = `
        <td>${supplier.supplier_name}</td>
        <td>${supplier.supplier_cnpj}</td>
        <td>${supplier.service_start_date}</td>
        <td>R$ ${parseFloat(supplier.total_value).toFixed(2)}</td>
        <td>
            <button class="view-btn">Visualizar</button>
            <button class="delete-btn" data-id="${supplier.id}">Excluir</button>
        </td>
    `;
}

document.getElementById('supplierTable').addEventListener('click', async function (e) {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;

        try {
            await fetch(`http://localhost:5000/api/suppliers/${id}`, {
                method: 'DELETE'
            });

            e.target.closest('tr').remove();
        } catch (error) {
            console.error('Erro ao excluir fornecedor:', error);
        }
    }
});

// Carregar fornecedores ao carregar a página
window.onload = loadSuppliers;
