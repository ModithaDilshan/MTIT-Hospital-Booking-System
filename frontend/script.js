const GATEWAY_URL = 'http://localhost:8000/api';

document.addEventListener('DOMContentLoaded', () => {
    // Set minimal dates
    if (document.getElementById('aptDate')) {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('aptDate').min = today;
    }

    // Fetch doctors to populate the dropdown and showcase section
    fetchDoctorsForDropdown(); // dropdowns
    fetchAndRenderDoctors();   // homepage grid

    checkHealth();
    setInterval(checkHealth, 10000);
});

async function fetchDoctorsForDropdown() {
    const sel = document.getElementById('aptDoctorSelect');
    try {
        const res = await fetch(`${GATEWAY_URL}/doctors`);
        const json = await res.json();
        if (res.ok && json.data) {
            json.data.forEach(doc => {
                const opt = document.createElement('option');
                opt.value = `${doc._id}|${doc.name}`;
                opt.innerText = `Dr. ${doc.name} - ${doc.specialization} (Fee: LKR ${doc.consultationFee})`;
                sel.appendChild(opt);
            });
        }
    } catch (e) { console.log("Doctors not loaded for UI dropdown"); }
}

async function fetchAndRenderDoctors() {
    const grid = document.getElementById('doctorsGrid');
    if (!grid) return; // If on another page

    try {
        let res = await fetch(`${GATEWAY_URL}/doctors`);
        let json = await res.json();

        // As requested by user: Add 2 sample doctors if DB is empty
        if (res.ok && (!json.data || json.data.length === 0)) {
            grid.innerHTML = '<p style="text-align:center; width:100%;">Initializing sample doctors into Live DB...</p>';
            const d1 = { name: "Sarah Jenkins", specialization: "Cardiovascular Surgery", experienceYears: 15, consultationFee: 5000, imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400" };
            const d2 = { name: "Marcus Chen", specialization: "Neurology", experienceYears: 12, consultationFee: 6500, imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=400" };

            await fetch(`${GATEWAY_URL}/doctors`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d1) });
            await fetch(`${GATEWAY_URL}/doctors`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d2) });

            // Re-fetch after seeding
            res = await fetch(`${GATEWAY_URL}/doctors`);
            json = await res.json();
            fetchDoctorsForDropdown(); // update dropdowns too!
        }

        if (res.ok && json.data && json.data.length > 0) {
            let html = '';
            json.data.forEach(doc => {
                html += `
                <div class="doctor-card">
                    <div class="doc-img-wrapper">
                        <img src="${doc.imageUrl || 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png'}" alt="Dr. ${doc.name}">
                    </div>
                    <div class="doctor-info">
                        <h3>Dr. ${doc.name}</h3>
                        <div class="doc-specialty">${doc.specialization}</div>
                        <div class="doc-exp"><i class="fas fa-stethoscope"></i> ${doc.experienceYears} Years Experience</div>
                        <div class="doc-fee"><i class="fas fa-wallet"></i> LKR ${doc.consultationFee} Constultation</div>
                    </div>
                </div>`;
            });
            grid.innerHTML = html;
        } else {
            grid.innerHTML = '<p style="text-align:center; width:100%;">No specialists currently available.</p>';
        }
    } catch (e) {
        grid.innerHTML = '<p style="text-align:center; width:100%; color:red;">Cannot connect to API Gateway. Ensure start_all.bat is running.</p>';
        console.log("Doctors not loaded for grid");
    }
}

// ------------------------------------
// PATIENT REGISTRATION
// ------------------------------------
function openModal(id) { document.getElementById(id).style.display = 'block'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
window.onclick = function (e) { if (e.target.className === 'modal') e.target.style.display = 'none'; }

function showMsg(elId, isSuccess, msg) {
    const el = document.getElementById(elId);
    el.style.display = 'block';
    el.className = isSuccess ? 'response-msg success' : 'response-msg error';
    el.innerHTML = isSuccess ? `<i class="fas fa-check-circle"></i> ${msg}` : `<i class="fas fa-exclamation-triangle"></i> ${msg}`;
}

async function registerPatient(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true; btn.innerText = "Registering...";

    const payload = {
        name: document.getElementById('regName').value,
        age: parseInt(document.getElementById('regAge').value),
        gender: document.getElementById('regGender').value,
        contact: document.getElementById('regContact').value,
        bloodGroup: document.getElementById('regBlood').value,
        address: document.getElementById('regAddress').value
    };

    try {
        const res = await fetch(`${GATEWAY_URL}/patients`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok) {
            showMsg('regResult', true, `Registration Safe! Your Patient ID is: <strong>${data.data._id}</strong><br><small>Save this ID for making appointments.</small>`);
            e.target.reset();
        } else {
            showMsg('regResult', false, data.error || "Failed to register profile.");
        }
    } catch (err) {
        showMsg('regResult', false, "Network error: API Gateway is unreachable.");
    } finally {
        btn.disabled = false; btn.innerText = "Register Profile";
    }
}

// ------------------------------------
// APPOINTMENT BOOKING
// ------------------------------------
async function submitAppointment(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true; btn.innerText = "Booking...";

    const docSelect = document.getElementById('aptDoctorSelect').value;
    if (!docSelect) {
        showMsg('aptRes', false, "Please select a Doctor!");
        btn.disabled = false; btn.innerText = "Confirm Appointment";
        return;
    }

    const [docId, docName] = docSelect.split('|');

    const payload = {
        patientId: document.getElementById('aptPatientId').value,
        patientName: document.getElementById('aptPatientName').value,
        doctorId: docId,
        doctorName: docName,
        appointmentDate: document.getElementById('aptDate').value,
        timeSlot: document.getElementById('aptTime').value
    };

    try {
        const res = await fetch(`${GATEWAY_URL}/appointments`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok) {
            showMsg('aptRes', true, `Appointment scheduled with Dr. ${docName}. Your Appt ID: <strong>${data.data._id}</strong>`);
            e.target.reset();
        } else {
            showMsg('aptRes', false, data.error || "Failed to book appointment. Ensure Patient ID is correct format.");
        }
    } catch (err) {
        showMsg('aptRes', false, "Network error: API Gateway unreachable.");
    } finally {
        btn.disabled = false; btn.innerText = "Confirm Appointment";
    }
}

// ------------------------------------
// BILLING / PAYMENT
// ------------------------------------
async function submitBill(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true; btn.innerText = "Processing...";

    const payload = {
        patientId: document.getElementById('billPatientId').value,
        patientName: document.getElementById('billPatientName').value,
        description: document.getElementById('billReason').value,
        amount: parseInt(document.getElementById('billAmount').value),
        paymentType: document.getElementById('billMethod').value,
        status: "Paid" // Front end processes it as paid immediately here
    };

    try {
        const res = await fetch(`${GATEWAY_URL}/bills`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok) {
            showMsg('billRes', true, `Payment of LKR ${payload.amount} successful! Invoice ID: <strong>${data.data._id}</strong>`);
            e.target.reset();
        } else {
            showMsg('billRes', false, data.error || "Failed to process transaction.");
        }
    } catch (err) {
        showMsg('billRes', false, "Network error.");
    } finally {
        btn.disabled = false; btn.innerText = "Process Payment";
    }
}

// ------------------------------------
// STATUS CHECK
// ------------------------------------
async function checkHealth() {
    async function checkRoute(endpoint, eleId) {
        const dot = document.querySelector(`#${eleId} .dot`);
        try {
            const r = await fetch(`${GATEWAY_URL}/${endpoint}`);
            dot.className = r.ok ? 'dot green' : 'dot';
        } catch (e) { dot.className = 'dot'; }
    }
    checkRoute('patients', 's-pat');
    checkRoute('doctors', 's-doc');
    checkRoute('appointments', 's-apt');
    checkRoute('bills', 's-bil');
}
