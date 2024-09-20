// Alternar tema
document.getElementById('theme-toggle').addEventListener('click', function () {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
    
    // Armazenar a preferência de tema no localStorage
    const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});

// Recuperar a preferência de tema ao carregar a página
window.onload = function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.add('light-theme');
    }
};

// Submeter formulário de fornecedor
document.getElementById('supplierForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const supplierData = {
        supplierName: document.getElementById('supplierName').value,
        requestDate: document.getElementById('requestDate').value,
        supplierCNPJ: document.getElementById('supplierCNPJ').value,
        serviceStartDate: document.getElementById('serviceStartDate').value,
        justification: document.getElementById('justification').value,
        totalValue: document.getElementById('totalValue').value,
        status: document.getElementById('status').value, // Captura o valor do campo Status
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
        <td>${supplier.status}</td> <!-- Nova coluna de Status -->
        <td>
            <button class="edit-btn" data-id="${supplier.id}">Editar</button>
            <button class="delete-btn" data-id="${supplier.id}" aria-label="Excluir fornecedor ${supplier.supplier_name}">Excluir</button>
        </td>
    `;

    // Função para excluir fornecedor
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

    // Função para editar fornecedor inline
    newRow.querySelector('.edit-btn').addEventListener('click', function () {
        const supplierId = this.getAttribute('data-id');
        const cells = newRow.cells;

        if (this.textContent === "Editar") {
            // Transformar células em campos editáveis
            cells[0].innerHTML = `<input type="text" value="${supplier.supplier_name}" />`;
            cells[1].innerHTML = `<input type="text" value="${supplier.supplier_cnpj}" />`;
            cells[2].innerHTML = `<input type="date" value="${supplier.service_start_date}" />`;
            cells[3].innerHTML = `<input type="number" value="${supplier.total_value}" />`;
            cells[4].innerHTML = `<select>
                                      <option value="Ativo" ${supplier.status === "Ativo" ? "selected" : ""}>Ativo</option>
                                      <option value="Inativo" ${supplier.status === "Inativo" ? "selected" : ""}>Inativo</option>
                                  </select>`; // Editar Status
            this.textContent = "Salvar";
        } else {
            // Salvar alterações
            const updatedSupplier = {
                supplier_name: cells[0].querySelector('input').value,
                supplier_cnpj: cells[1].querySelector('input').value,
                service_start_date: cells[2].querySelector('input').value,
                total_value: parseFloat(cells[3].querySelector('input').value),
                status: cells[4].querySelector('select').value // Atualizar Status
            };

            // Enviar os dados atualizados ao servidor
            fetch(`http://localhost:5000/api/suppliers/${supplierId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedSupplier)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao salvar alterações');
                }
                // Atualizar células com os valores editados
                cells[0].innerHTML = updatedSupplier.supplier_name;
                cells[1].innerHTML = updatedSupplier.supplier_cnpj;
                cells[2].innerHTML = updatedSupplier.service_start_date;
                cells[3].innerHTML = `R$ ${updatedSupplier.total_value.toFixed(2)}`;
                cells[4].innerHTML = updatedSupplier.status; // Exibir o novo status
                this.textContent = "Editar";
            })
            .catch(error => {
                console.error('Erro ao editar fornecedor:', error);
            });
        }
    });
}

// Carregar os fornecedores ao abrir a página
window.onload = function() {
    loadSuppliers();
};



/*
// Lista de fornecedores mockada   Simulação de uma API ##########################################
let mockSuppliers = [
    {
        id: 1,
        supplier_name: "Empresa X",
        supplier_cnpj: "00.000.000/0000-01",
        service_start_date: "2024-08-01",
        total_value: 50000,
        status: "Ativo"
    },
    {
        id: 2,
        supplier_name: "Empresa Y",
        supplier_cnpj: "00.000.000/0000-02",
        service_start_date: "2024-09-10",
        total_value: 70000,
        status: "Inativo"
    },
    {
        id: 3,
        supplier_name: "Fornecedor A",
        supplier_cnpj: "11.111.111/1111-11",
        service_start_date: "2024-07-05",
        total_value: 45000,
        status: "Ativo"
    },
    {
        id: 4,
        supplier_name: "Fornecedor B",
        supplier_cnpj: "22.222.222/2222-22",
        service_start_date: "2024-06-15",
        total_value: 120000,
        status: "Inativo"
    },
    {
        id: 5,
        supplier_name: "Fornecedor C",
        supplier_cnpj: "33.333.333/3333-33",
        service_start_date: "2024-08-20",
        total_value: 80000,
        status: "Ativo"
    },
    {
        id: 6,
        supplier_name: "Fornecedor D",
        supplier_cnpj: "44.444.444/4444-44",
        service_start_date: "2024-07-25",
        total_value: 25000,
        status: "Ativo"
    },
    {
        id: 7,
        supplier_name: "Fornecedor E",
        supplier_cnpj: "55.555.555/5555-55",
        service_start_date: "2024-09-01",
        total_value: 95000,
        status: "Inativo"
    },
    {
        id: 8,
        supplier_name: "Fornecedor F",
        supplier_cnpj: "66.666.666/6666-66",
        service_start_date: "2024-07-12",
        total_value: 40000,
        status: "Ativo"
    },
    {
        id: 9,
        supplier_name: "Fornecedor G",
        supplier_cnpj: "77.777.777/7777-77",
        service_start_date: "2024-06-30",
        total_value: 150000,
        status: "Inativo"
    },
    {
        id: 10,
        supplier_name: "Fornecedor H",
        supplier_cnpj: "88.888.888/8888-88",
        service_start_date: "2024-05-05",
        total_value: 110000,
        status: "Ativo"
    },
    {
        id: 11,
        supplier_name: "Fornecedor I",
        supplier_cnpj: "99.999.999/9999-99",
        service_start_date: "2024-06-01",
        total_value: 60000,
        status: "Ativo"
    },
    {
        id: 12,
        supplier_name: "Fornecedor J",
        supplier_cnpj: "10.000.000/0000-10",
        service_start_date: "2024-07-20",
        total_value: 90000,
        status: "Inativo"
    }
];


// Função para carregar fornecedores (simulando um fetch para a API)
async function loadSuppliers() {
    try {
        // Simula um delay na requisição
        await new Promise(resolve => setTimeout(resolve, 500));

        // Como se estivesse recebendo os fornecedores de uma API
        mockSuppliers.forEach(addSupplierToTable);
    } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
    }
}

// Função para adicionar um fornecedor à tabela
function addSupplierToTable(supplier) {
    const supplierTable = document.getElementById('supplierTable');
    const newRow = supplierTable.insertRow();

    newRow.innerHTML = `
        <td>${supplier.supplier_name}</td>
        <td>${supplier.supplier_cnpj}</td>
        <td>${supplier.service_start_date}</td>
        <td>R$ ${parseFloat(supplier.total_value).toFixed(2)}</td>
        <td>${supplier.status}</td>
        <td>
            <button class="edit-btn" data-id="${supplier.id}">Editar</button>
            <button class="delete-btn" data-id="${supplier.id}" aria-label="Excluir fornecedor ${supplier.supplier_name}">Excluir</button>
        </td>
    `;

    // Função para excluir fornecedor
    newRow.querySelector('.delete-btn').addEventListener('click', function () {
        const supplierId = this.getAttribute('data-id');
        mockSuppliers = mockSuppliers.filter(s => s.id != supplierId); // Remove da lista mockada
        supplierTable.deleteRow(newRow.rowIndex); // Remove da tabela
    });

    // Função para editar fornecedor
    newRow.querySelector('.edit-btn').addEventListener('click', function () {
        const supplierId = this.getAttribute('data-id');
        const cells = newRow.cells;

        if (this.textContent === "Editar") {
            // Transformar células em campos editáveis
            cells[0].innerHTML = `<input type="text" value="${supplier.supplier_name}" />`;
            cells[1].innerHTML = `<input type="text" value="${supplier.supplier_cnpj}" />`;
            cells[2].innerHTML = `<input type="date" value="${supplier.service_start_date}" />`;
            cells[3].innerHTML = `<input type="number" value="${supplier.total_value}" />`;
            cells[4].innerHTML = `<select>
                                      <option value="Ativo" ${supplier.status === "Ativo" ? "selected" : ""}>Ativo</option>
                                      <option value="Inativo" ${supplier.status === "Inativo" ? "selected" : ""}>Inativo</option>
                                  </select>`;
            this.textContent = "Salvar";
        } else {
            // Salvar alterações
            const updatedSupplier = {
                id: supplierId,
                supplier_name: cells[0].querySelector('input').value,
                supplier_cnpj: cells[1].querySelector('input').value,
                service_start_date: cells[2].querySelector('input').value,
                total_value: parseFloat(cells[3].querySelector('input').value),
                status: cells[4].querySelector('select').value // Atualizar Status
            };

            // Atualiza na lista mockada
            mockSuppliers = mockSuppliers.map(s => s.id == supplierId ? updatedSupplier : s);

            // Atualiza as células com os novos valores
            cells[0].innerHTML = updatedSupplier.supplier_name;
            cells[1].innerHTML = updatedSupplier.supplier_cnpj;
            cells[2].innerHTML = updatedSupplier.service_start_date;
            cells[3].innerHTML = `R$ ${updatedSupplier.total_value.toFixed(2)}`;
            cells[4].innerHTML = updatedSupplier.status; // Exibir o novo status
            this.textContent = "Editar";
        }
    });
}

// Carregar fornecedores ao iniciar
document.addEventListener('DOMContentLoaded', loadSuppliers);


// Fim da simulação de API #########################################################################################
*/