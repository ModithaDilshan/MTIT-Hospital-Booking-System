const GATEWAY_URL = 'http://localhost:8000/api';

document.addEventListener('DOMContentLoaded', () => {
    // If securely logged in already, skip login screen
    if(sessionStorage.getItem('adminAuth') === 'granted') {
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('adminContent').style.display = 'flex';
        testData('patients');
    }
});

function checkAuth() {
    const u = document.getElementById('authUsername').value;
    const p = document.getElementById('authPassword').value;
    
    // Auth Check (Using requested DB credentials from user)
    if(u === 'hotelAdmin' && p === 'Hotel2026') {
        sessionStorage.setItem('adminAuth', 'granted');
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('adminContent').style.display = 'flex';
        testData('patients');
    } else {
        document.getElementById('loginErr').style.display = 'block';
    }
}

function switchTab(tabId, el) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    el.classList.add('active');
    
    testData(tabId);
}

// Universal Delete function
async function deleteRecord(endpoint, id, name) {
    if(confirm(`Are you sure you want to delete ${name}?`)) {
        try {
            const res = await fetch(`${GATEWAY_URL}/${endpoint}/${id}`, { method: 'DELETE' });
            if(res.ok) {
                alert('Record deleted successfully (DELETE Request)');
                testData(endpoint);
            } else {
                alert('Failed to delete');
            }
        } catch(e) { alert('API Gateway Error'); }
    }
}

// Universal Edit function (PUT Request)
async function updateRecord(endpoint, id, name) {
    let payload = {};
    if(endpoint === 'patients') {
        const val = prompt(`Edit Phone Number for ${name}:`);
        if(!val) return;
        payload = { contact: val };
    } else if (endpoint === 'doctors') {
        const val = prompt(`Edit Consultation Fee for ${name}:`);
        if(!val) return;
        payload = { consultationFee: parseInt(val) };
    } else if (endpoint === 'appointments') {
        const val = prompt(`Update Status for this Appointment (e.g. Scheduled, Completed, Cancelled):`);
        if(!val) return;
        payload = { status: val };
    } else if (endpoint === 'bills') {
        const val = prompt(`Update Payment Status for this Bill (e.g. Pending, Paid):`);
        if(!val) return;
        payload = { status: val };
    }

    try {
        const res = await fetch(`${GATEWAY_URL}/${endpoint}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if(res.ok) {
            alert(`Success! Updated ${endpoint} using a PUT request through the Gateway.`);
            testData(endpoint);
        } else {
            alert('Failed to update record in Database.');
        }
    } catch(e) { alert('API Gateway Error'); }
}

// Fetch lists
async function testData(endpoint) {
    const tbody = document.getElementById(`tb-${endpoint}`);
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;">Loading data via API Gateway...</td></tr>';
    
    try {
        const res = await fetch(`${GATEWAY_URL}/${endpoint}`);
        const json = await res.json();
        
        document.getElementById('apiStatus').style.display = 'block';
        
        if(!json.data || json.data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;">No records found in database. Do a POST request to add data!</td></tr>`;
            return;
        }

        let html = '';
        json.data.forEach(item => {
            if(endpoint === 'patients') {
                html += `<tr>
                    <td><small>${item._id}</small></td>
                    <td><strong>${item.name}</strong></td>
                    <td>${item.age}</td>
                    <td>${item.bloodGroup}</td>
                    <td>${item.contact}</td>
                    <td style="min-width: 100px;">
                        <button class="btn-edit" onclick="updateRecord('patients', '${item._id}', '${item.name}')"><i class="fas fa-edit"></i></button>
                        <button class="btn-del" onclick="deleteRecord('patients', '${item._id}', '${item.name}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
            } else if (endpoint === 'doctors') {
                html += `<tr>
                    <td><small>${item._id}</small></td>
                    <td><strong>Dr. ${item.name}</strong></td>
                    <td>${item.specialization}</td>
                    <td>${item.consultationFee}</td>
                    <td style="min-width: 100px;">
                        <button class="btn-edit" onclick="updateRecord('doctors', '${item._id}', 'Dr. ${item.name}')"><i class="fas fa-edit"></i></button>
                        <button class="btn-del" onclick="deleteRecord('doctors', '${item._id}', 'Dr. ${item.name}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
            } else if (endpoint === 'appointments') {
                html += `<tr>
                    <td><small>${item._id}</small></td>
                    <td>${item.patientName}</td>
                    <td>Dr. ${item.doctorName}</td>
                    <td>${new Date(item.appointmentDate).toLocaleDateString()}</td>
                    <td>${item.timeSlot}</td>
                    <td><span style="background:#f39c12; color:white; padding:3px 8px; border-radius:4px; font-size:12px;">${item.status}</span></td>
                    <td style="min-width: 100px;">
                        <button class="btn-edit" onclick="updateRecord('appointments', '${item._id}', 'Appointment')"><i class="fas fa-edit"></i></button>
                        <button class="btn-del" onclick="deleteRecord('appointments', '${item._id}', 'Appointment')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
            } else if (endpoint === 'bills') {
                html += `<tr>
                    <td><small>${item._id}</small></td>
                    <td>${item.patientName}</td>
                    <td>${item.description}</td>
                    <td><strong>LKR ${item.amount}</strong></td>
                    <td><span style="background:#27ae60; color:white; padding:3px 8px; border-radius:4px; font-size:12px;">${item.status}</span></td>
                    <td style="min-width: 100px;">
                        <button class="btn-edit" onclick="updateRecord('bills', '${item._id}', 'Bill')"><i class="fas fa-edit"></i></button>
                        <button class="btn-del" onclick="deleteRecord('bills', '${item._id}', 'Bill')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
            }
        });
        tbody.innerHTML = html;
        
    } catch(e) {
        tbody.innerHTML = `<tr><td colspan="10" style="color:red; text-align:center;">Error connecting to API Gateway (Port 8000). Did you run start_all.bat?</td></tr>`;
        document.getElementById('apiStatus').style.display = 'none';
        console.error(e);
    }
}

// Doctor Add (Testing CRUD)
async function createDoctor() {
    const payload = {
        name: document.getElementById('dName').value,
        specialization: document.getElementById('dSpec').value,
        experienceYears: parseInt(document.getElementById('dExp').value),
        consultationFee: parseInt(document.getElementById('dFee').value)
    };
    
    if(!payload.name || !payload.specialization) return alert("Fill all doctor input boxes!");

    try {
        const res = await fetch(`${GATEWAY_URL}/doctors`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        if(res.ok) {
            alert('Doctor added seamlessly using POST -> Gateway -> M2!');
            document.getElementById('dName').value = '';
            document.getElementById('dSpec').value = '';
            document.getElementById('dExp').value = '';
            document.getElementById('dFee').value = '';
            testData('doctors');
        }
    } catch(e) { alert("Failed to connect"); }
}
