       // Replace with your Google Apps Script URL
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz-KiHbPKMdRsNueGxWAxqVgVlQlSYYQkn5ectQGoOvxv7fQaJXgGT-4kqF4jzQOQ0/exec';

                function formatDate(isoString) {
            if (!isoString) return '-';
            const date = new Date(isoString);
            return date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }

        async function loadRentalData() {
            const loading = document.getElementById('loading');
            const tbody = document.getElementById('rentalList');
            loading.style.display = 'block';
            tbody.innerHTML = '';

            try {
                const response = await fetch(SCRIPT_URL);
                const data = await response.json();
                
                if (data && data.length > 0) {
                    data.forEach(rental => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${rental.Nama || '-'}</td>
                            <td>${rental.KTP || '-'}</td>
                            <td>${rental.Telepon || '-'}</td>
                            <td>${rental.Kendaraan || '-'}</td>
                            <td>${formatDate(rental['Tanggal Mulai'])}</td>
                            <td>${formatDate(rental['Tanggal Selesai'])}</td>
                        `;
                        tbody.appendChild(row);
                    });
                } else {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="6" class="empty-message">
                                Belum ada data penyewaan
                            </td>
                        </tr>
                    `;
                }
            } catch (error) {
                console.error('Error:', error);
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="empty-message">
                            Terjadi kesalahan saat memuat data
                        </td>
                    </tr>
                `;
            } finally {
                loading.style.display = 'none';
            }
        }

        // Handle form submit
        document.getElementById('rentalForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const loading = document.getElementById('loading');
            loading.style.display = 'block';

            const formData = {
                Nama: document.getElementById('nama').value.trim(),
                KTP: document.getElementById('ktp').value.trim(),
                Telepon: document.getElementById('telepon').value.trim(),
                Kendaraan: document.getElementById('kendaraan').value,
                'Tanggal Mulai': document.getElementById('tanggalMulai').value,
                'Tanggal Selesai': document.getElementById('tanggalSelesai').value
            };

            try {
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                alert('Data berhasil disimpan!');
                document.getElementById('rentalForm').reset();
                setTimeout(loadRentalData, 1000);
            } catch (error) {
                console.error('Error:', error);
                alert('Terjadi kesalahan saat menyimpan data');
            } finally {
                loading.style.display = 'none';
            }
        });

        // Load initial data
        loadRentalData();
