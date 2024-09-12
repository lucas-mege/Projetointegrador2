// Alternar tema
document.getElementById('theme-toggle').addEventListener('click', function () {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
});

// Submeter formulário de fornecedor
document.getElementById('supplierForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const supplierData = {
        supplierName: document.getElementById('supplierName').value,
        requestDate: document.getElementById('requestDate').value,
        supplierCNPJ: document.getElementById('supplierCNPJ').value,
        serviceStartDate: document.getElementById('serviceStartDate').value,
        justification: document.getElementById('justification').value,
        totalValue: document.getElementById('totalValue').value,
        additionalFiles: document.getElementById('additionalFiles').value
    };

    const errorMessage = document.getElementById('error-message');
    errorMessage.classList.add('hidden'); // Esconde mensagem de erro inicial

    try {
        const response = await fetch('http://localhost:5000/api/suppliers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(supplierData)
        });

        if (!response.ok) {
            throw new Error('Erro no servidor.');
        }

        const newSupplier = await response.json();
        addSupplierToTable(newSupplier);

        document.getElementById('supplierForm').reset();
    } catch (error) {
        errorMessage.textContent = 'Erro ao cadastrar fornecedor: ' + error.message;
        errorMessage.classList.remove('hidden');
        console.error('Erro ao cadastrar fornecedor:', error);
    }
});

// Carregar fornecedores
async function loadSuppliers() {
    try {
        const response = await fetch('http://localhost:5000/api/suppliers');
        const suppliers = await response.json();

        suppliers.forEach(addSupplierToTable);
    } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
    }
}

// Adicionar fornecedor à tabela
function addSupplierToTable(supplier) {
    const supplierTable = document.getElementById('supplierTable');
    const newRow = supplierTable.insertRow();

    newRow.innerHTML = `
        <td>${supplier.supplier_name}</td>
        <td>${supplier.supplier_cnpj}</td>
        <td>${supplier.service_start_date}</td>
        <td>R$ ${parseFloat(supplier.total_value).toFixed(2)}</td>
        <td>
            <button class="view-btn" data-id="${supplier.id}">Ver</button>
            <button class="delete-btn" data-id="${supplier.id}" aria-label="Excluir fornecedor ${supplier.supplier_name}">Excluir</button>
        </td>
    `;

    newRow.querySelector('.delete-btn').addEventListener('click', async function () {
        const supplierId = this.getAttribute('data-id');

        try {
            await fetch(`http://localhost:5000/api/suppliers/${supplierId}`, {
                method: 'DELETE'
            });

            supplierTable.deleteRow(newRow.rowIndex);
        } catch (error) {
            console.error('Erro ao excluir fornecedor:', error);
        }
    });
}

// Carregar fornecedores ao iniciar
loadSuppliers();