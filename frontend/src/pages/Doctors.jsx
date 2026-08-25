import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doctorAPI } from '../services/api';
import DoctorCard from '../components/DoctorCard';
import BookingModal from '../components/BookingModal';
import { Search, Filter, SlidersHorizontal, RefreshCw, AlertCircle } from 'lucide-react';

const Doctors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [specialization, setSpecialization] = useState(searchParams.get('specialization') || 'All');
  const [maxFee, setMaxFee] = useState(searchParams.get('maxFee') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating');
  const [day, setDay] = useState(searchParams.get('day') || '');

  // Booking Modal State
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);

  // Fetch specialties once
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await doctorAPI.getSpecialties();
        if (res.data && res.data.success) {
          setSpecialties(res.data.specialties || []);
        }
      } catch (error) {
        console.error('Error fetching specialties:', error);
      }
    };
    fetchSpecialties();
  }, []);

  // Fetch doctors whenever filters change
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (specialization && specialization !== 'All') params.specialization = specialization;
        if (maxFee) params.maxFee = maxFee;
        if (sort) params.sort = sort;
        if (day) params.day = day;

        const res = await doctorAPI.getAll(params);
        if (res.data && res.data.success) {
          setDoctors(res.data.doctors || []);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [search, specialization, maxFee, sort, day]);

  const handleResetFilters = () => {
    setSearch('');
    setSpecialization('All');
    setMaxFee('');
    setSort('rating');
    setDay('');
    setSearchParams({});
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container-custom">
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
            Doctor Catalog
          </span>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--neutral-900)' }}>
            Find & Book Medical Specialists
          </h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '0.95rem' }}>
            Browse verified healthcare doctors, compare fees & reviews, and reserve your slot.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div
          className="card-elevated"
          style={{
            padding: '1.25rem',
            marginBottom: '2rem',
            background: '#ffffff',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              alignItems: 'flex-end',
            }}
          >
            {/* Search Input */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.82rem' }}>
                Search Doctor or Hospital
              </label>
              <div style={{ position: 'relative' }}>
                <Search
                  size={18}
                  color="var(--neutral-400)"
                  style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px' }}
                />
                <input
                  type="text"
                  placeholder="e.g. Dr. Sophia, NYC..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            {/* Specialization Filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.82rem' }}>
                Specialty
              </label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="form-select"
              >
                <option value="All">All Specialties</option>
                {specialties.map((s, idx) => (
                  <option key={idx} value={s.name}>
                    {s.name} ({s.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Max Fee Filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.82rem' }}>
                Max Consultation Fee ($)
              </label>
              <select
                value={maxFee}
                onChange={(e) => setMaxFee(e.target.value)}
                className="form-select"
              >
                <option value="">Any Fee</option>
                <option value="75">Up to $75</option>
                <option value="100">Up to $100</option>
                <option value="125">Up to $125</option>
                <option value="150">Up to $150</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.82rem' }}>
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="form-select"
              >
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="fee_asc">Fee: Low to High</option>
                <option value="fee_desc">Fee: High to Low</option>
              </select>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleResetFilters}
              className="btn btn-secondary"
              style={{ height: '42px' }}
              title="Reset all filters"
            >
              <RefreshCw size={16} /> Reset
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ fontSize: '0.95rem', color: 'var(--neutral-600)', fontWeight: 600 }}>
            Showing <span style={{ color: 'var(--primary-600)' }}>{doctors.length}</span> Verified Doctor{doctors.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Doctors Grid or Loading */}
        {loading ? (
          <div
            style={{
              padding: '4rem 0',
              textAlign: 'center',
              color: 'var(--neutral-500)',
            }}
          >
            Loading medical specialists...
          </div>
        ) : doctors.length === 0 ? (
          <div
            className="card-elevated"
            style={{
              padding: '3.5rem 2rem',
              textAlign: 'center',
              maxWidth: '500px',
              margin: '2rem auto',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#fffbeb',
                color: '#b45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
              }}
            >
              <AlertCircle size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Doctors Found</h3>
            <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              No medical practitioners matched your search criteria. Try relaxing your filters.
            </p>
            <button onClick={handleResetFilters} className="btn btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                onBookClick={(doc) => setSelectedDoctorForBooking(doc)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedDoctorForBooking && (
        <BookingModal
          doctor={selectedDoctorForBooking}
          onClose={() => setSelectedDoctorForBooking(null)}
          onBookingSuccess={() => setSelectedDoctorForBooking(null)}
        />
      )}
    </div>
  );
};

export default Doctors;
