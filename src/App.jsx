import { useEffect, useRef, useState } from 'react'
import './App.css'

const sports = [
  { id: 'basketball', label: 'Basketball', note: '2 shared courts', tone: 'orange' },
  { id: 'volleyball', label: 'Volleyball', note: '2 shared courts', tone: 'blue' },
  { id: 'badminton', label: 'Badminton', note: '4 courts', tone: 'green' },
  { id: 'pickleball', label: 'Pickleball', note: '2 courts', tone: 'yellow' },
  { id: 'table-tennis', label: 'Table tennis', note: '4 tables', tone: 'red' },
  { id: 'billiards', label: 'Billiards', note: '2 tables', tone: 'purple' },
]

const pricing = {
  basketball: { 1: 200, 2: 250, 3: 300 },
  volleyball: { 1: 200, 2: 250, 3: 300 },
  badminton: { 1: 150, 2: 200, 3: 250 },
  pickleball: { 1: 200, 2: 250, 3: 300 },
  'table-tennis': { 1: 180, 2: 240, 3: 300 },
  billiards: { 1: 180, 2: 240, 3: 300 },
}

const venueMap = {
  basketball: { kind: 'basketball', count: 2, prefix: 'Court' },
  volleyball: { kind: 'volleyball', count: 2, prefix: 'Court' },
  badminton: { kind: 'badminton', count: 4, prefix: 'Court' },
  pickleball: { kind: 'pickleball', count: 2, prefix: 'Court' },
  'table-tennis': { kind: 'table', count: 4, prefix: 'Table' },
  billiards: { kind: 'billiards', count: 2, prefix: 'Table' },
}

const slots = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']
const busySlotsByCourt = {
  1: ['08:00', '12:00', '17:00'],
  2: ['09:00', '14:00', '18:00'],
  3: ['10:00', '15:00'],
  4: ['11:00', '16:00'],
}
const testAccount = { firstName: 'test', lastName: 'dummy', email: 'testdummy@gmail.com', phone: '09283746523', password: 'password1234' }

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`))
}

function formatCurrency(amount) {
  return `₱${amount.toLocaleString('en-PH')}`
}

function localDateValue(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function createPaymentReference() {
  const timestamp = Date.now().toString(36).toUpperCase()
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `SC-${timestamp}-${randomPart}`
}

function SportIcon({ id }) {
  return <span className={`sport-icon icon-${id}`} aria-hidden="true"><i></i></span>
}

function CourtDiagram({ kind }) {
  if (kind === 'basketball') return <svg viewBox="0 0 520 270" className="court-svg" aria-hidden="true"><rect x="8" y="8" width="504" height="254" rx="2" /><path d="M260 8v254M8 70h105v130H8M512 70H407v130h105" /><path className="three-point-lines" d="M8 30H104Q240 135 104 240H8M512 30H416Q280 135 416 240H512" /><path className="free-throw-lines" d="M113 101a34 34 0 0 1 0 68M407 101a34 34 0 0 0 0 68" /><circle cx="39" cy="135" r="8" /><circle cx="481" cy="135" r="8" /></svg>
  if (kind === 'volleyball') return <svg viewBox="0 0 520 270" className="court-svg" aria-hidden="true"><rect x="8" y="8" width="504" height="254" rx="2" /><path d="M260 8v254M130 8v254M390 8v254M8 8h504v254H8z" /></svg>
  if (kind === 'badminton') return <svg viewBox="0 0 300 420" className="court-svg" aria-hidden="true"><rect x="8" y="8" width="284" height="404" /><path d="M48 8v404M252 8v404M8 90h284M8 330h284M8 210h284M48 210h204M48 135h204M48 285h204" /></svg>
  if (kind === 'pickleball') return <svg viewBox="0 0 440 220" className="court-svg" aria-hidden="true"><rect x="8" y="8" width="424" height="204" /><path d="M8 55h424M8 165h424M105 55v110M335 55v110M220 55v110" /></svg>
  if (kind === 'table') return <svg viewBox="0 0 260 150" className="court-svg table-svg" aria-hidden="true"><rect x="16" y="18" width="228" height="114" rx="5" /><path d="M130 18v114M130 75h114M130 75H16" /></svg>
  return <svg viewBox="0 0 440 210" className="court-svg billiard-svg" aria-hidden="true"><rect x="18" y="18" width="404" height="174" rx="22" /><circle cx="31" cy="31" r="7" /><circle cx="409" cy="31" r="7" /><circle cx="31" cy="179" r="7" /><circle cx="409" cy="179" r="7" /><circle cx="220" cy="31" r="7" /><circle cx="220" cy="179" r="7" /></svg>
}

function SharedCourtDiagram({ sport, facility = false }) {
  return <svg viewBox="0 0 520 270" className={`shared-court-svg ${facility ? 'shared-court-facility' : `shared-court-${sport}`}`} aria-hidden="true"><g className="basketball-lines"><rect x="8" y="8" width="504" height="254" rx="2" /><path d="M260 8v254M8 70h105v130H8M512 70H407v130h105" /><path className="three-point-lines" d="M8 30H104Q240 135 104 240H8M512 30H416Q280 135 416 240H512" /><path className="free-throw-lines" d="M113 101a34 34 0 0 1 0 68M407 101a34 34 0 0 0 0 68" /><circle cx="39" cy="135" r="8" /><circle cx="481" cy="135" r="8" /></g><g className="volleyball-lines" transform="translate(78 47.25) scale(.70 .65)"><rect x="8" y="8" width="504" height="254" rx="2" /><path d="M260 8v254M130 8v254M390 8v254M8 8h504v254H8z" /></g></svg>
}

function DatePickerField({ date, inputRef, onChange, onOpen }) {
  return <label className="date-field" htmlFor="date" onClick={onOpen}><span>▣</span><input ref={inputRef} id="date" type="date" value={date} min={localDateValue()} onChange={onChange} /></label>
}

function App() {
  const [page, setPage] = useState('home')
  const [sport, setSport] = useState(null)
  const [court, setCourt] = useState(null)
  const [date, setDate] = useState(() => localDateValue())
  const [duration, setDuration] = useState(1)
  const [time, setTime] = useState(null)
  const [modal, setModal] = useState(null)
  const [booking, setBooking] = useState(null)
  const [user, setUser] = useState(null)
  const [authStep, setAuthStep] = useState('details')
  const [authForm, setAuthForm] = useState({ ...testAccount, confirmPassword: testAccount.password })
  const [authError, setAuthError] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [paymentReference, setPaymentReference] = useState('')
  const [now, setNow] = useState(() => Date.now())
  const dateInputRef = useRef(null)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  const selectedSport = sports.find((item) => item.id === sport) || sports[0]
  const map = venueMap[sport] || venueMap.basketball
  const totalPrice = pricing[sport]?.[duration] || 0
  const downpayment = totalPrice * 0.15
  const hasActiveReservation = Boolean(booking && booking.status !== 'cancelled')
  const sameDayReservation = Boolean(hasActiveReservation && booking.date === date)
  const canBook = Boolean(court && time && !slotIsUnavailable(time))
  const bookingStart = booking ? new Date(`${booking.date}T${booking.time}:00`) : null
  const canCancel = bookingStart ? bookingStart.getTime() - now >= 30 * 60 * 1000 : false

  // Open the native date picker from the entire custom field. Older browsers
  // do not expose showPicker(), so focusing the input remains the fallback.
  function openDatePicker() {
    const input = dateInputRef.current
    if (!input) return
    if (typeof input.showPicker === 'function') {
      try {
        input.showPicker()
        return
      } catch (error) {
        if (!(error instanceof DOMException) || error.name !== 'NotAllowedError') throw error
      }
    }
    input.focus()
  }

  // A reservation remains in local state after sign-out. This check is used
  // again after authentication so a pending guest booking cannot bypass it.
  function reservationConflictMessage(accountEmail = user?.email) {
    if (!hasActiveReservation || !booking.ownerEmail || booking.ownerEmail === accountEmail) {
      if (sameDayReservation) return 'You already have a reservation on this date.'
      if (reservationOverlapsExistingBooking()) return 'This time overlaps your existing reservation.'
    }
    return ''
  }

  function chooseSport(id) {
    setSport(id)
    setCourt(null)
    setTime(null)
    setModal(null)
    setProfileOpen(false)
  }

  function goToSport(id) {
    chooseSport(id)
    setPage('booking')
  }

  function confirmBooking() {
    if (!canBook || reservationConflictMessage()) {
      setModal(null)
      return
    }
    if (!user) {
      setAuthStep('details')
      setAuthError('Sign in to confirm your reservation.')
      setModal('signin')
      return
    }
    setPaymentReference(createPaymentReference())
    setModal('payment')
  }

  function completePayment() {
    // Save the account email with the reservation so it can be matched again
    // if the user signs out, starts another booking, and then signs back in.
    setBooking({ sport, court, date, time, duration, totalPrice, downpayment, status: 'remaining balance', paymentReference, ownerEmail: user.email })
    setModal('payment-success')
  }

  function updateAuth(field, value) {
    setAuthForm((current) => ({ ...current, [field]: value }))
    setAuthError('')
  }

  function continueAuth() {
    if (!authForm.firstName || !authForm.lastName || !authForm.email || !authForm.phone) {
      setAuthError('Please complete every field.')
      return
    }
    setAuthStep('password')
  }

  function backToAuthDetails() {
    setAuthStep('details')
    setAuthError('')
  }

  function finishAuth() {
    if (authForm.password.length < 8 || authForm.password !== authForm.confirmPassword) {
      setAuthError('Use at least 8 characters and make both passwords match.')
      return
    }
    const signedInUser = { firstName: authForm.firstName, lastName: authForm.lastName, email: authForm.email }
    setUser(signedInUser)
    if (canBook && reservationConflictMessage(signedInUser.email)) {
      setAuthError(reservationConflictMessage(signedInUser.email))
      setAuthStep('details')
      setModal('signin')
      return
    }
    setModal(court && time ? 'confirm' : null)
  }

  function slotIsUnavailable(slot, hours = duration, selectedCourt = court) {
    if (!selectedCourt) return true
    const startHour = Number(slot.slice(0, 2))
    const selectedDateStart = new Date(`${date}T${slot}:00`)
    const tooSoon = date === localDateValue() && selectedDateStart.getTime() - now < 30 * 60 * 1000
    const busySlots = busySlotsByCourt[selectedCourt] || []
    return tooSoon || sameDayReservation || startHour + hours > 23 || busySlots.some((busySlot) => {
      const busyHour = Number(busySlot.slice(0, 2))
      return busyHour >= startHour && busyHour < startHour + hours
    })
  }

  function reservationOverlapsExistingBooking() {
    if (!hasActiveReservation || booking.date !== date || !time) return false
    const requestedStart = Number(time.slice(0, 2))
    const requestedEnd = requestedStart + duration
    const existingStart = Number(booking.time.slice(0, 2))
    const existingEnd = existingStart + booking.duration
    return requestedStart < existingEnd && existingStart < requestedEnd
  }

  function selectDuration(hours) {
    setDuration(hours)
    if (time && slotIsUnavailable(time, hours)) setTime(null)
  }

  function cancelBooking() {
    setBooking((current) => current ? { ...current, status: 'cancelled' } : null)
    setModal(null)
  }

  function signOut() {
    // Keep the reservation while clearing the session; this mirrors a
    // server-backed account where reservations outlive the login session.
    setUser(null)
    setProfileOpen(false)
    setPage('home')
  }

  function bookAgain() {
    if (!booking) return
    setSport(booking.sport)
    setCourt(booking.court)
    setDate(booking.date)
    setDuration(booking.duration)
    setTime(slotIsUnavailable(booking.time, booking.duration, booking.court) ? null : booking.time)
    setPage('booking')
    setModal(null)
  }

  function statusLabel(status) {
    if (status === 'cancelled') return 'Cancelled'
    if (bookingStart && now >= bookingStart.getTime() && now < bookingStart.getTime() + (booking?.duration || 0) * 60 * 60 * 1000) return 'In session'
    return status === 'paid' ? 'Paid' : 'Remaining balance'
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => setPage('home')} aria-label="Sport Complex home"><span className="brand-mark">S</span><span>SPORT COMPLEX<span className="brand-dot">.</span></span></button>
        <nav><button className={page === 'home' ? 'active' : ''} type="button" onClick={() => setPage('home')}>Home</button><button className={page === 'sports' ? 'active' : ''} type="button" onClick={() => setPage('sports')}>Book now</button><button className={page === 'facilities' ? 'active' : ''} type="button" onClick={() => setPage('facilities')}>Facilities</button>{user && <button className={page === 'reservations' ? 'active' : ''} type="button" onClick={() => setPage('reservations')}>Reservations</button>}</nav>
        <div className="profile">{user ? <><button className="profile-trigger" type="button" onClick={() => setProfileOpen((open) => !open)}><span className="avatar">{user.firstName[0]}{user.lastName[0]}</span><span>{user.firstName} {user.lastName}</span><span className="chevron">⌄</span></button>{profileOpen && <div className="profile-menu"><span>{user.email}</span><button type="button" onClick={signOut}>Sign out</button></div>}</> : <button className="signin-link" type="button" onClick={() => { setAuthStep('details'); setModal('signin') }}>Sign in</button>}</div>
      </header>

      {page === 'home' && <section className="hero page-section" id="top"><div className="hero-copy-block"><p className="eyebrow">Open daily · 6:00 am — 11:00 pm</p><h1>Make room<br /><em>for your game.</em></h1><p className="hero-copy">Six ways to play, one place to meet. Find your court, choose your time, and make it yours.</p><button className="hero-cta" type="button" onClick={() => setPage('sports')}>Book now</button></div></section>}

      {page === 'sports' && <section className="page-section selection-page"><div className="page-heading"><div><p className="eyebrow">01</p><h1>Pick your sport.</h1><p>Choose a game to see the spaces available today.</p></div><span className="page-mark">SC<br /><small>BOOKING</small></span></div><div className="sport-grid sport-grid-large">{sports.map((item) => <button type="button" key={item.id} className={`sport-card ${sport === item.id ? 'selected' : ''}`} onClick={() => goToSport(item.id)}><SportIcon id={item.id} /><span className="sport-card-copy"><strong>{item.label}</strong><small>{item.note}</small></span></button>)}</div></section>}

      {page === 'booking' && <section className="page-section booking-page"><div className="booking-grid">
        <div className="map-panel"><div className="panel-heading"><div><h2>{selectedSport.label}</h2><p>{selectedSport.id === 'basketball' || selectedSport.id === 'volleyball' ? 'Choose a shared court' : `${map.count} spaces available`}</p></div><span className="map-key"><i></i> Available <i className="key-selected"></i> Selected <i className="key-full"></i> Fully booked</span></div><div className={`venue-map ${map.kind}`}>{Array.from({ length: map.count }, (_, index) => <button type="button" key={index} className={`venue-item ${court === index + 1 ? 'selected' : ''}`} onClick={() => { setCourt(index + 1); setTime(null) }} aria-label={`${map.prefix} ${index + 1}`}><span className="venue-drawing">{sport === 'basketball' || sport === 'volleyball' ? <SharedCourtDiagram sport={sport} /> : <CourtDiagram kind={map.kind} />}</span><strong>{map.prefix} {index + 1}</strong><small>{court === index + 1 ? 'Selected' : 'Available'}</small></button>)}</div><button className="back-link court-back-link" type="button" onClick={() => setPage('sports')}>← Back to sports</button></div>
        <aside className="details-panel"><h2>Booking</h2><label className="field-label date-label" htmlFor="date">Pick a date</label><DatePickerField date={date} inputRef={dateInputRef} onOpen={openDatePicker} onChange={(event) => { setDate(event.target.value); setTime(null) }} /><div className="date-summary"><strong>{formatDate(date)}</strong><span>Local time</span></div><label className="field-label">Rates</label><div className="duration-group">{[1, 2, 3].map((hours) => <button key={hours} type="button" className={duration === hours ? 'selected' : ''} onClick={() => selectDuration(hours)}>{hours} hr{hours > 1 ? 's' : ''}<small>{formatCurrency(pricing[sport]?.[hours] || 0)}</small></button>)}</div><div className="price-summary"><span>{court ? `${map.prefix} ${court}` : 'Selected package'}</span><strong>{duration} hr{duration > 1 ? 's' : ''} | {formatCurrency(totalPrice)}</strong></div>{court ? <><label className="field-label slot-label">Available start times</label><div className="slot-grid">{slots.map((slot) => { const unavailable = slotIsUnavailable(slot); const selected = time === slot; const busySlots = busySlotsByCourt[court] || []; return <button key={slot} type="button" disabled={unavailable} className={`${selected ? 'selected' : ''} ${unavailable ? 'unavailable' : ''}`} onClick={() => setTime(slot)}>{slot}<small>{busySlots.includes(slot) ? 'Booked' : unavailable ? 'Unavailable' : 'Open'}</small></button> })}</div>{sameDayReservation && <p className="hint reservation-warning">You already have a reservation on this date. Choose another date to book again.</p>}</> : <p className="hint">Choose a court above to see its available times.</p>}</aside>
      </div><div className="booking-footer"><button type="button" className="reserve-button review-button" disabled={!canBook || sameDayReservation || reservationOverlapsExistingBooking()} onClick={() => setModal('confirm')}>Review reservation<span>↗</span></button></div></section>}

      {page === 'facilities' && <section className="page-section facilities-page"><div className="page-heading"><div><p className="eyebrow">Sport Complex</p><h1>Facilities.</h1><p>Every space, laid out so you can see the whole club.</p></div></div><div className="facility-plan"><div className="facility-label">Entrance / reception</div><div className="facility-west"><button className="facility-space" type="button" onClick={() => goToSport('pickleball')}><span>Pickleball 1</span><CourtDiagram kind="pickleball" /></button><button className="facility-space" type="button" onClick={() => goToSport('pickleball')}><span>Pickleball 2</span><CourtDiagram kind="pickleball" /></button></div><div className="facility-center">{['Badminton 1', 'Badminton 2', 'Badminton 3', 'Badminton 4'].map((label) => <button className="facility-space" type="button" key={label} onClick={() => goToSport('badminton')}><span>{label}</span><CourtDiagram kind="badminton" /></button>)}</div><div className="facility-east"><button className="facility-space" type="button" onClick={() => goToSport('table-tennis')}><span>Table tennis space</span><CourtDiagram kind="table" /></button><button className="facility-space" type="button" onClick={() => goToSport('billiards')}><span>Billiards space</span><CourtDiagram kind="billiards" /></button></div><div className="facility-south"><button className="facility-space" type="button" onClick={() => goToSport('basketball')}><span>Basketball / Volleyball</span><SharedCourtDiagram facility /></button><button className="facility-space" type="button" onClick={() => goToSport('volleyball')}><span>Basketball / Volleyball</span><SharedCourtDiagram facility /></button></div></div></section>}

      {page === 'reservations' && user && <section className="page-section booked-page"><div className="page-heading"><div><p className="eyebrow">Your account</p><h1>Reservations.</h1><p>Keep track of your court, payment, and next visit.</p></div><span className="page-mark">SC<br /><small>ACCOUNT</small></span></div>{booking ? <section className={`booked-card status-${(booking.status || 'remaining balance').replace(' ', '-')}`}><div className="booked-card-heading"><div><p className="eyebrow">Reservation details</p><h2>{sports.find((item) => item.id === booking.sport).label} · {venueMap[booking.sport].prefix} {booking.court}</h2></div><span className="status-badge">{statusLabel(booking.status)}</span></div><div className="booked-details"><span><small>Date</small><strong>{formatDate(booking.date)}</strong></span><span><small>Start time</small><strong>{booking.time}</strong></span><span><small>Duration</small><strong>{booking.duration} hour{booking.duration > 1 ? 's' : ''}</strong></span></div><div className="payment-summary"><span>Total price <strong>{formatCurrency(booking.totalPrice)}</strong></span><span>15% downpayment <strong>{formatCurrency(booking.downpayment)}</strong></span><span>Balance <strong>{formatCurrency(booking.totalPrice - booking.downpayment)}</strong></span></div><div className="booked-actions"><button type="button" className="reserve-button" onClick={bookAgain}>Book this again <span>↻</span></button>{booking.status !== 'cancelled' && <button type="button" className="cancel-button" disabled={!canCancel} onClick={() => setModal('cancel')}>{canCancel ? 'Cancel booking' : 'Cancellation closed'}</button>}</div></section> : <section className="empty-booked-card"><p className="eyebrow">No reservations yet</p><h2>Your next game starts here.</h2><p>Choose a sport and reserve a court in a few quick steps.</p><button type="button" className="reserve-button" onClick={() => setPage('sports')}>Make a reservation <span>↗</span></button></section>}</section>}

      <footer><span>SPORT COMPLEX / COMMUNITY SPORTS CLUB</span><span>Need a hand? hello@sportcomplex.club</span><span>© 2026</span></footer>

      {modal && <div className="modal-backdrop"><div className="modal" role="dialog" aria-modal="true">{modal === 'signin' && <><span className="modal-number">SC</span><p className="eyebrow">Create your account</p><h2>{authStep === 'details' ? 'Sign in to book.' : 'Create a password.'}</h2>{authStep === 'details' ? <><div className="auth-grid"><input placeholder="First name" value={authForm.firstName} onChange={(event) => updateAuth('firstName', event.target.value)} /><input placeholder="Last name" value={authForm.lastName} onChange={(event) => updateAuth('lastName', event.target.value)} /><input className="wide" type="email" placeholder="Email" value={authForm.email} onChange={(event) => updateAuth('email', event.target.value)} /><input className="wide" type="tel" placeholder="Phone number" value={authForm.phone} onChange={(event) => updateAuth('phone', event.target.value)} /></div><button type="button" className="reserve-button" onClick={continueAuth}>Next <span>↗</span></button></> : <><div className="auth-grid"><input className="wide" type="password" placeholder="Password" value={authForm.password} onChange={(event) => updateAuth('password', event.target.value)} />      <input className="wide" type="password" placeholder="Validate password" value={authForm.confirmPassword} onChange={(event) => updateAuth('confirmPassword', event.target.value)} /></div><div className="auth-actions"><button type="button" className="text-button" onClick={backToAuthDetails}>← Back</button><button type="button" className="reserve-button" onClick={finishAuth}>Create account <span>↗</span></button></div></>}{authError && <p className="auth-error">{authError}</p>}<button type="button" className="text-button" onClick={() => setModal(null)}>Cancel      </button></>}{modal === 'payment' && <><p className="eyebrow">Online payment</p><h2>Pay your downpayment.</h2><p className="modal-copy">This is a payment placeholder for the online transaction. Your reservation will be saved after you continue.</p><div className="payment-placeholder"><span className="payment-placeholder-icon">₱</span><div><strong>Online payment gateway</strong><small>GCash, Maya, or card checkout placeholder</small></div></div><label className="payment-reference-label" htmlFor="payment-reference">Generated transaction reference</label><input className="payment-reference-input" id="payment-reference" value={paymentReference} readOnly /><div className="payment-summary modal-payment"><span>Due now (15%) <strong>{formatCurrency(downpayment)}</strong></span></div><div className="modal-actions"><button type="button" className="text-button" onClick={() => setModal('confirm')}>Go back</button><button type="button" className="reserve-button" onClick={completePayment}>Continue payment <span>↗</span></button></div></>}{modal === 'confirm' && <><p className="eyebrow">Almost there</p><h2>Lock in your session?</h2><p className="modal-copy">You're booking <strong>{selectedSport.label} · {map.prefix} {court}</strong> for <strong>{formatDate(date)}</strong> at <strong>{time}</strong> for <strong>{duration} hour{duration > 1 ? 's' : ''}</strong>. Reservations must be made at least 30 minutes before the start.</p><div className="payment-summary modal-payment"><span>Total price <strong>{formatCurrency(totalPrice)}</strong></span><span>Due now (15%) <strong>{formatCurrency(downpayment)}</strong></span></div><div className="modal-actions"><button type="button" className="text-button" onClick={() => setModal(null)}>Go back</button><button type="button" className="reserve-button" onClick={confirmBooking}>Confirm booking <span>↗</span></button></div></>}{modal === 'payment-success' && <><span className="success-mark">✓</span><p className="eyebrow">Payment successful</p><h2>Downpayment received.</h2><p className="modal-copy">Your demo online payment was successful. Transaction reference:</p><div className="payment-reference-receipt">{paymentReference}</div><button type="button" className="reserve-button" onClick={() => setModal('success')}>View booking confirmation <span>↗</span></button></>}{modal === 'success' && <><span className="success-mark">✓</span><p className="eyebrow">You're all set</p><h2>Booking confirmed.</h2><p className="modal-copy">Your space is waiting. We've saved this reservation to your account.</p><div className="receipt"><span>{formatDate(date)}</span><strong>{selectedSport.label} · {map.prefix} {court}</strong>      <span>{time} · {duration} hour{duration > 1 ? 's' : ''}</span></div><div className="payment-summary modal-payment"><span>Total price <strong>{formatCurrency(totalPrice)}</strong></span><span>15% downpayment <strong>{formatCurrency(downpayment)}</strong></span></div><button type="button" className="reserve-button" onClick={() => setModal(null)}>Done <span>↗</span></button></>}{modal === 'cancel' && <><span className="modal-number">!</span><p className="eyebrow">Cancel reservation</p><h2>Let this one go?</h2><p className="modal-copy">You can cancel up to 30 minutes before your scheduled start time.</p><div className="modal-actions"><button type="button" className="text-button" onClick={() => setModal(null)}>Keep booking</button><button type="button" className="cancel-button" onClick={cancelBooking}>Cancel booking</button></div></>}</div></div>}
    </main>
  )
}

export default App
