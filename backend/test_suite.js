const BASE_URL = 'http://127.0.0.1:5000/api';

async function runTests() {
  console.log('🧪 ===============================================');
  console.log('🧪 RUNNING "BOOK A DOCTOR" END-TO-END TEST SUITE');
  console.log('🧪 ===============================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    console.log('[1/7] Testing Health Check...');
    const healthRes = await fetch(`${BASE_URL}/health`).then((r) => r.json());
    assert(healthRes.status === 'OK', 'API server returns status OK');

    // 2. Public Doctors Catalog & Filtering
    console.log('\n[2/7] Testing Doctors Search & Specialties...');
    const specsRes = await fetch(`${BASE_URL}/doctors/specialties`).then((r) => r.json());
    assert(specsRes.success && specsRes.specialties.length > 0, `Specialties loaded (${specsRes.specialties.length} found)`);

    const docsRes = await fetch(`${BASE_URL}/doctors?specialization=Cardiologist`).then((r) => r.json());
    assert(docsRes.success && docsRes.doctors.length > 0, `Filtered Cardiology doctors (${docsRes.doctors.length} found)`);
    const cardiologist = docsRes.doctors[0];

    // 3. Check Real-Time Doctor Slot Availability
    console.log('\n[3/7] Testing Doctor Slot Availability Engine...');
    const availRes = await fetch(`${BASE_URL}/doctors/${cardiologist._id}/availability?date=2026-08-31`).then((r) => r.json());
    assert(availRes.success && availRes.availableSlots.length > 0, `Available slots calculated correctly (${availRes.availableSlots.length} slots)`);

    // 4. Patient Login & Authentication
    console.log('\n[4/7] Testing Patient Authentication & Token Generation...');
    const patientLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'patient@bookadoctor.com',
        password: 'patient123',
      }),
    }).then((r) => r.json());

    assert(patientLoginRes.success && patientLoginRes.token, 'Patient login successful with JWT');
    const patientToken = patientLoginRes.token;
    const patientAuthHeader = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${patientToken}`,
    };

    // 5. Patient Schedules an Appointment
    console.log('\n[5/7] Testing Appointment Booking & Conflict Prevention...');
    const targetSlot = availRes.availableSlots[0].slot;
    const bookRes = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: patientAuthHeader,
      body: JSON.stringify({
        doctorId: cardiologist._id,
        appointmentDate: '2026-08-31',
        timeSlot: targetSlot,
        symptoms: 'Routine cardiovascular follow-up check and blood pressure monitoring',
      }),
    }).then((r) => r.json());

    assert(bookRes.success && bookRes.appointment.status === 'confirmed', 'Appointment booked and auto-confirmed');
    const newAppointmentId = bookRes.appointment._id;

    // Test Double-Booking Conflict Prevention
    const conflictRes = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: patientAuthHeader,
      body: JSON.stringify({
        doctorId: cardiologist._id,
        appointmentDate: '2026-08-31',
        timeSlot: targetSlot,
        symptoms: 'Duplicate booking attempt',
      }),
    });

    assert(conflictRes.status === 409, 'Conflict detected: double booking was successfully prevented (HTTP 409)');

    // 6. Doctor Workflow: Login, View Queue & Issue Digital Prescription
    console.log('\n[6/7] Testing Doctor Portal: Queue & Digital Prescription...');
    const docLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'dr.sophia@bookadoctor.com',
        password: 'doctor123',
      }),
    }).then((r) => r.json());

    assert(docLoginRes.success && docLoginRes.user.role === 'doctor', 'Doctor login successful');
    const docToken = docLoginRes.token;
    const docAuthHeader = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${docToken}`,
    };

    const rxRes = await fetch(`${BASE_URL}/appointments/${newAppointmentId}/prescription`, {
      method: 'POST',
      headers: docAuthHeader,
      body: JSON.stringify({
        diagnosis: 'Normal Resting Sinus Rhythm, Mild Dehydration',
        medicines: '1. Multivitamin + Electrolyte tab daily\n2. Maintain 3L water hydration',
        advice: 'Continue morning jogs, review in 1 year.',
      }),
    }).then((r) => r.json());

    assert(rxRes.success && rxRes.appointment.status === 'completed', 'Prescription issued and appointment marked completed');

    // 7. Admin Workflow: Login, System Metrics & Doctor Approval
    console.log('\n[7/7] Testing Admin Control Center & Doctor Approval Workflow...');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@bookadoctor.com',
        password: 'admin123',
      }),
    }).then((r) => r.json());

    assert(adminLoginRes.success && adminLoginRes.user.role === 'admin', 'Admin authenticated');
    const adminToken = adminLoginRes.token;
    const adminAuthHeader = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    };

    const statsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: adminAuthHeader,
    }).then((r) => r.json());

    assert(statsRes.success && statsRes.stats.totalDoctors > 0, `Admin stats calculated: ${statsRes.stats.totalPatients} patients, ${statsRes.stats.totalDoctors} doctors, $${statsRes.stats.totalRevenue} revenue`);

    // Find pending doctor (Dr. Chloe Bennett)
    const pendingDocsRes = await fetch(`${BASE_URL}/admin/doctors?status=pending`, {
      headers: adminAuthHeader,
    }).then((r) => r.json());

    if (pendingDocsRes.doctors && pendingDocsRes.doctors.length > 0) {
      const pendingDoc = pendingDocsRes.doctors[0];
      const approveRes = await fetch(`${BASE_URL}/admin/doctors/${pendingDoc._id}/approve`, {
        method: 'PUT',
        headers: adminAuthHeader,
      }).then((r) => r.json());

      assert(approveRes.success && approveRes.doctor.isApproved === 'approved', `Approved pending doctor application: ${pendingDoc.name}`);
    } else {
      console.log('  ℹ️ No pending doctors remaining to approve.');
    }

    console.log('\n===============================================');
    console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('===============================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Fatal Test Suite Error:', error);
    process.exit(1);
  }
}

runTests();
