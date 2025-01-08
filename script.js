
const API_URL = 'https://script.google.com/macros/s/AKfycbz-KiHbPKMdRsNueGxWAxqVgVlQlSYYQkn5ectQGoOvxv7fQaJXgGT-4kqF4jzQOQ0/exec';

async function fetchCars() {
    const response = await fetch(`${API_URL}?action=read`);
    const cars = await response.json();
    const carList = document.getElementById('car-list');
    carList.innerHTML = '';

    cars.forEach((car, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${car.name}</td><td>${car.brand}</td><td>${car.year}</td><td>${car.price}</td>
                        <td>
                            <button data-id="${index}" onclick="editCar(this)">Edit</button>
                            <button data-id="${index}" onclick="deleteCar(${index})">Hapus</button>
                        </td>`;
        carList.appendChild(row);
    });
}

document.getElementById('car-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = document.getElementById('car-id').value;
    const name = document.getElementById('car-name').value;
    const brand = document.getElementById('car-brand').value;
    const year = document.getElementById('car-year').value;
    const price = document.getElementById('car-price').value;
    const action = id ? 'update' : 'create';

    await fetch(`${API_URL}?action=${action}&id=${id}&name=${name}&brand=${brand}&year=${year}&price=${price}`, {
        method: 'GET'
    });

    fetchCars();
    document.getElementById('car-form').reset();
});

async function deleteCar(id) {
    await fetch(`${API_URL}?action=delete&id=${id}`, { method: 'GET' });
    fetchCars();
}

function editCar(button) {
    const id = button.getAttribute('data-id');
    const carList = document.getElementById('car-list');
    const row = carList.rows[id];

    document.getElementById('car-id').value = id;
    document.getElementById('car-name').value = row.cells[0].innerText;
    document.getElementById('car-brand').value = row.cells[1].innerText;
    document.getElementById('car-year').value = row.cells[2].innerText;
    document.getElementById('car-price').value = row.cells[3].innerText;
}

fetchCars();
