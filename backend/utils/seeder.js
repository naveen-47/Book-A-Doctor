const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const sampleDoctors = [
  {
    name: 'Dr. Sophia Patel',
    email: 'dr.sophia@bookadoctor.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1 (555) 234-5678',
    gender: 'female',
    specialization: 'Cardiologist',
    qualifications: 'MD, FACC, Harvard Medical School',
    experienceYears: 14,
    fees: 120,
    rating: 4.9,
    reviewsCount: 128,
    isApproved: 'approved',
    hospitalName: 'Heart & Vascular Specialty Institute',
    hospitalAddress: '742 Park Avenue, New York, NY 10021',
    bio: 'Renowned cardiologist specializing in non-invasive cardiology, preventive cardiac care, hypertension management, and echocardiography with over 14 years of clinical excellence.',
    profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableTimeSlots: [
      '09:00 AM - 10:00 AM',
      '10:30 AM - 11:30 AM',
      '02:00 PM - 03:00 PM',
      '03:30 PM - 04:30 PM',
      '05:00 PM - 06:00 PM',
    ],
  },
  {
    name: 'Dr. Marcus Vance',
    email: 'dr.marcus@bookadoctor.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1 (555) 345-6789',
    gender: 'male',
    specialization: 'Neurologist',
    qualifications: 'MD, PhD (Neuroscience), Johns Hopkins',
    experienceYears: 16,
    fees: 150,
    rating: 4.9,
    reviewsCount: 95,
    isApproved: 'approved',
    hospitalName: 'Metropolitan Brain & Spine Center',
    hospitalAddress: '1200 Lexington Avenue, New York, NY 10028',
    bio: 'Board-certified neurologist focusing on migraine therapies, epilepsy management, neuromuscular disorders, and neuro-rehabilitation.',
    profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    availableTimeSlots: [
      '10:00 AM - 11:00 AM',
      '11:30 AM - 12:30 PM',
      '02:30 PM - 03:30 PM',
      '04:00 PM - 05:00 PM',
    ],
  },
  {
    name: 'Dr. Elena Rostova',
    email: 'dr.elena@bookadoctor.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1 (555) 456-7890',
    gender: 'female',
    specialization: 'Dermatologist',
    qualifications: 'MD, FAAD (Dermatology & Cosmetology)',
    experienceYears: 11,
    fees: 95,
    rating: 4.8,
    reviewsCount: 164,
    isApproved: 'approved',
    hospitalName: 'DermaGlow Clinical & Laser Center',
    hospitalAddress: '580 5th Avenue, Suite 1200, New York, NY 10036',
    bio: 'Expert in clinical dermatology, acne treatments, eczema, psoriasis, skin cancer screenings, and advanced non-invasive cosmetic laser rejuvenation.',
    profileImage: 'https://images.unsplash.com/photo-1594824813589-fb5ff52b489d?auto=format&fit=crop&q=80&w=600',
    availableDays: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    availableTimeSlots: [
      '09:30 AM - 10:30 AM',
      '11:00 AM - 12:00 PM',
      '01:30 PM - 02:30 PM',
      '03:00 PM - 04:00 PM',
      '04:30 PM - 05:30 PM',
    ],
  },
  {
    name: 'Dr. James Wilson',
    email: 'dr.james@bookadoctor.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1 (555) 567-8901',
    gender: 'male',
    specialization: 'Orthopedic Surgeon',
    qualifications: 'MS (Orthopedics), FAAOS, Stanford University',
    experienceYears: 13,
    fees: 135,
    rating: 4.7,
    reviewsCount: 88,
    isApproved: 'approved',
    hospitalName: 'Apex Orthopedic & Sports Medicine Institute',
    hospitalAddress: '880 7th Ave, New York, NY 10019',
    bio: 'Specialist in sports injury rehabilitation, arthroscopic joint surgery, knee & shoulder reconstruction, and arthritis care.',
    profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    availableTimeSlots: [
      '08:30 AM - 09:30 AM',
      '10:00 AM - 11:00 AM',
      '01:00 PM - 02:00 PM',
      '03:00 PM - 04:00 PM',
    ],
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'dr.priya@bookadoctor.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1 (555) 678-9012',
    gender: 'female',
    specialization: 'Pediatrician',
    qualifications: 'MD (Pediatrics), DCH, Oxford Medical',
    experienceYears: 9,
    fees: 75,
    rating: 4.9,
    reviewsCount: 142,
    isApproved: 'approved',
    hospitalName: 'Happy Smiles Children & Infant Hospital',
    hospitalAddress: '310 East 67th Street, New York, NY 10065',
    bio: 'Loving and empathetic pediatrician offering newborn care, childhood immunizations, developmental assessments, and adolescent medicine.',
    profileImage: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=600',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    availableTimeSlots: [
      '09:00 AM - 10:00 AM',
      '10:30 AM - 11:30 AM',
      '02:00 PM - 03:00 PM',
      '04:00 PM - 05:00 PM',
    ],
  },
  {
    name: 'Dr. Robert Chen',
    email: 'dr.robert@bookadoctor.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1 (555) 789-0123',
    gender: 'male',
    specialization: 'General Physician',
    qualifications: 'MBBS, MD (Internal Medicine), Columbia Univ',
    experienceYears: 10,
    fees: 60,
    rating: 4.8,
    reviewsCount: 175,
    isApproved: 'approved',
    hospitalName: 'Downtown Primary & Family Care',
    hospitalAddress: '155 Broadway, Suite 400, New York, NY 10006',
    bio: 'Primary care practitioner offering comprehensive annual health checkups, chronic disease management, diabetes care, and lifestyle medicine.',
    profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableTimeSlots: [
      '09:00 AM - 10:00 AM',
      '10:00 AM - 11:00 AM',
      '11:30 AM - 12:30 PM',
      '02:00 PM - 03:00 PM',
      '03:30 PM - 04:30 PM',
      '05:00 PM - 06:00 PM',
    ],
  },
  {
    name: 'Dr. Olivia Miller',
    email: 'dr.olivia@bookadoctor.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1 (555) 890-1234',
    gender: 'female',
    specialization: 'Psychiatrist',
    qualifications: 'MD (Psychiatry), APA Fellow, Yale University',
    experienceYears: 12,
    fees: 110,
    rating: 4.9,
    reviewsCount: 89,
    isApproved: 'approved',
    hospitalName: 'MindCare Behavioral & Mental Wellness',
    hospitalAddress: '230 Central Park West, New York, NY 10024',
    bio: 'Compassionate psychiatric consultant specializing in anxiety, depression, adult ADHD, trauma recovery, and cognitive psychotherapy.',
    profileImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    availableTimeSlots: [
      '10:00 AM - 11:00 AM',
      '01:00 PM - 02:00 PM',
      '03:00 PM - 04:00 PM',
      '05:00 PM - 06:00 PM',
    ],
  },
  {
    name: 'Dr. Chloe Bennett',
    email: 'dr.chloe@bookadoctor.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1 (555) 901-2345',
    gender: 'female',
    specialization: 'Ophthalmologist',
    qualifications: 'MS (Ophthalmology), Eye Microsurgeon',
    experienceYears: 6,
    fees: 85,
    rating: 4.6,
    reviewsCount: 14,
    isApproved: 'pending', // Pending approval for admin demo!
    hospitalName: 'ClearVision Eye & Laser Clinic',
    hospitalAddress: '900 Madison Avenue, New York, NY 10021',
    bio: 'Experienced ophthalmologist specializing in refractive eye exams, glaucoma screening, cataract management, and dry eye therapies.',
    profileImage: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=600',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    availableTimeSlots: [
      '09:00 AM - 10:00 AM',
      '11:00 AM - 12:00 PM',
      '02:00 PM - 03:00 PM',
    ],
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/book_a_doctor';
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany();
    await Doctor.deleteMany();
    await Appointment.deleteMany();
    console.log('[Seeder] Cleared existing data.');

    // 1. Create Admin
    const admin = await User.create({
      name: 'Sarah Jenkins (Admin)',
      email: 'admin@bookadoctor.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1 (555) 000-ADMIN',
      gender: 'female',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      address: '750 Healthcare Blvd, Admin HQ, New York',
    });
    console.log('[Seeder] Admin user created: admin@bookadoctor.com / admin123');

    // 2. Create Demo Patient 1 (Primary demo account)
    const patient1 = await User.create({
      name: 'Alex Morgan',
      email: 'patient@bookadoctor.com',
      password: 'patient123',
      role: 'patient',
      phone: '+1 (555) 123-4567',
      gender: 'male',
      dob: '1992-05-14',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      address: '142 W 85th St, Apt 4B, New York, NY',
    });

    // Create Demo Patient 2
    const patient2 = await User.create({
      name: 'Emily Watson',
      email: 'emily.watson@gmail.com',
      password: 'patient123',
      role: 'patient',
      phone: '+1 (555) 987-6543',
      gender: 'female',
      dob: '1995-11-20',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
      address: '500 Park Ave, New York, NY',
    });

    console.log('[Seeder] Demo patients created.');

    // 3. Create Doctors
    const createdDoctors = [];
    for (const docData of sampleDoctors) {
      const user = await User.create({
        name: docData.name,
        email: docData.email,
        password: docData.password,
        role: 'doctor',
        phone: docData.phone,
        gender: docData.gender,
        avatar: docData.profileImage,
        address: docData.hospitalAddress,
      });

      const doctor = await Doctor.create({
        user: user._id,
        name: docData.name,
        email: docData.email,
        phone: docData.phone,
        specialization: docData.specialization,
        qualifications: docData.qualifications,
        experienceYears: docData.experienceYears,
        fees: docData.fees,
        rating: docData.rating,
        reviewsCount: docData.reviewsCount,
        isApproved: docData.isApproved,
        hospitalName: docData.hospitalName,
        hospitalAddress: docData.hospitalAddress,
        bio: docData.bio,
        profileImage: docData.profileImage,
        availableDays: docData.availableDays,
        availableTimeSlots: docData.availableTimeSlots,
      });

      createdDoctors.push(doctor);
    }
    console.log(`[Seeder] Created ${createdDoctors.length} doctors.`);

    // 4. Create Sample Initial Appointments
    const sophia = createdDoctors.find((d) => d.specialization === 'Cardiologist');
    const elena = createdDoctors.find((d) => d.specialization === 'Dermatologist');
    const robert = createdDoctors.find((d) => d.specialization === 'General Physician');

    // Create a dummy sample report file in uploads
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const sampleReportPath = path.join(uploadsDir, 'sample_blood_test_report.pdf');
    if (!fs.existsSync(sampleReportPath)) {
      fs.writeFileSync(sampleReportPath, '%PDF-1.4 Mock Lab Blood Test Panel Results - Normal Values');
    }

    // Appointment 1: Completed cardiology appointment for Alex Morgan
    await Appointment.create({
      patient: patient1._id,
      doctor: sophia._id,
      appointmentDate: '2026-08-20',
      timeSlot: '10:30 AM - 11:30 AM',
      status: 'completed',
      symptoms: 'Routine cardiovascular checkup and mild palpitations during exercise',
      paymentStatus: 'paid',
      paymentAmount: sophia.fees,
      paymentMethod: 'Credit Card',
      documents: [
        {
          fileName: 'Blood_Lipid_Panel_Report.pdf',
          fileUrl: '/uploads/sample_blood_test_report.pdf',
          uploadedBy: 'patient',
          fileType: 'pdf',
          uploadedAt: new Date('2026-08-19'),
        },
      ],
      prescription: {
        diagnosis: 'Mild Sinus Tachycardia, Healthy Myocardium',
        medicines: '1. Tab Metoprolol 25mg - 1 tablet daily morning after breakfast (30 days)\n2. Omega-3 1000mg - 1 capsule daily (60 days)',
        advice: 'Drink 2.5L water daily, reduce caffeine intake, 30 min daily brisk walking.',
        issuedAt: new Date('2026-08-20'),
      },
      doctorNotes: 'Patient vitals stable (BP 120/80, Pulse 76 bpm). Follow up in 6 months.',
    });

    // Appointment 2: Confirmed upcoming appointment for Alex Morgan with Dr. Elena
    await Appointment.create({
      patient: patient1._id,
      doctor: elena._id,
      appointmentDate: '2026-08-29',
      timeSlot: '01:30 PM - 02:30 PM',
      status: 'confirmed',
      symptoms: 'Skin rash on forearm and allergic dermatitis evaluation',
      paymentStatus: 'paid',
      paymentAmount: elena.fees,
      paymentMethod: 'Online UPI',
    });

    // Appointment 3: Confirmed appointment for Emily Watson with Dr. Robert Chen
    await Appointment.create({
      patient: patient2._id,
      doctor: robert._id,
      appointmentDate: '2026-08-28',
      timeSlot: '09:00 AM - 10:00 AM',
      status: 'confirmed',
      symptoms: 'Annual health checkup and seasonal flu consultation',
      paymentStatus: 'paid',
      paymentAmount: robert.fees,
      paymentMethod: 'Debit Card',
    });

    // Appointment 4: Pending appointment for Emily Watson with Dr. Sophia Patel
    await Appointment.create({
      patient: patient2._id,
      doctor: sophia._id,
      appointmentDate: '2026-08-30',
      timeSlot: '02:00 PM - 03:00 PM',
      status: 'pending',
      symptoms: 'Family history consultation on hypercholesterolemia',
      paymentStatus: 'paid',
      paymentAmount: sophia.fees,
      paymentMethod: 'Card',
    });

    console.log('[Seeder] Sample appointments created successfully.');
    console.log('\n=============================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=============================================');
    console.log('Demo Credentials:');
    console.log('  👑 Admin:   admin@bookadoctor.com    / admin123');
    console.log('  👨‍⚕️ Doctor:  dr.sophia@bookadoctor.com / doctor123');
    console.log('  🧑 Patient: patient@bookadoctor.com   / patient123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
