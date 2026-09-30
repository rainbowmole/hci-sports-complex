import { useState } from 'react'
import './App.css'

const sports = [
  { id: 'basketball', label: 'Basketball', note: '2 shared courts', tone: 'orange' },
  { id: 'volleyball', label: 'Volleyball', note: '2 shared courts', tone: 'blue' },
  { id: 'badminton', label: 'Badminton', note: '4 courts', tone: 'green' },
  { id: 'pickleball', label: 'Pickleball', note: '2 courts', tone: 'yellow' },
  { id: 'table-tennis', label: 'Table tennis', note: '4 tables', tone: 'red' },
  { id: 'billiards', label: 'Billiards', note: '2 tables', tone: 'purple' },
]

const venueMap = {
  basketball: { kind: 'basketball', count: 2, prefix: 'Court' },
  volleyball: { kind: 'volleyball', count: 2, prefix: 'Court' },
  badminton: { kind: 'badminton', count: 4, prefix: 'Court' },
  pickleball: { kind: 'pickleball', count: 2, prefix: 'Court' },
  'table-tennis': { kind: 'table', count: 4, prefix: 'Table' },
  billiards: { kind: 'billiards', count: 2, prefix: 'Table' },
}

const slots = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']
const busySlots = ['08:00', '12:00', '17:00']
const testAccount = { firstName: 'test', lastName: 'dummy', email: 'testdummy@gmail.com', phone: '09283746523', password: 'password1234' }

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`))
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

function App() {
  const [page, setPage] = useState('home')
  const [sport, setSport] = useState(null)
  const [court, setCourt] = useState(null)
  const [date, setDate] = useState('2026-10-03')
  const [duration, setDuration] = useState(1)
  const [time, setTime] = useState(null)
  const [modal, setModal] = useState(null)
  const [booking, setBooking] = useState(null)
  const [user, setUser] = useState(null)
  const [authStep, setAuthStep] = useState('details')
  const [authForm, setAuthForm] = useState({ ...testAccount, confirmPassword: testAccount.password })
  const [authError, setAuthError] = useState('')
  const [now] = useState(() => Date.now())

  const selectedSport = sports.find((item) => item.id === sport) || sports[0]
  const map = venueMap[sport] || venueMap.basketball
  const canBook = court && time
  const bookingStart = booking ? new Date(`${booking.date}T${booking.time}:00`) : null
  const canCancel = bookingStart ? bookingStart.getTime() - now >= 2 * 60 * 60 * 1000 : false

  function chooseSport(id) {
    setSport(id)
    setCourt(null)
    setTime(null)
    setModal(null)
  }

  function goToSport(id) {
    chooseSport(id)
    setPage('booking')
  }

  function confirmBooking() {
    if (!user) {
      setAuthStep('details')
      setAuthError('Sign in to confirm your reservation.')
      setModal('signin')
      return
    }
    setBooking({ sport, court, date, time, duration })
    setModal('success')
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

  function finishAuth() {
    if (authForm.password.length < 8 || authForm.password !== authForm.confirmPassword) {
      setAuthError('Use at least 8 characters and make both passwords match.')
      return
    }
    setUser({ firstName: authForm.firstName, lastName: authForm.lastName, email: authForm.email })
    setModal('confirm')
  }

  function slotIsUnavailable(slot, hours = duration) {
    const startHour = Number(slot.slice(0, 2))
    return startHour + hours > 23 || busySlots.some((busySlot) => {
      const busyHour = Number(busySlot.slice(0, 2))
      return busyHour >= startHour && busyHour < startHour + hours
    })
  }

  function selectDuration(hours) {
    setDuration(hours)
    if (time && slotIsUnavailable(time, hours)) setTime(null)
  }

  function cancelBooking() {
    setBooking(null)
    setModal(null)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => setPage('home')} aria-label="Sport Complex home"><span className="brand-mark">S</span><span>SPORT COMPLEX<span className="brand-dot">.</span></span></button>
        <nav><button className={page === 'home' ? 'active' : ''} type="button" onClick={() => setPage('home')}>Home</button><button className={page === 'sports' ? 'active' : ''} type="button" onClick={() => setPage('sports')}>Book now</button><button className={page === 'facilities' ? 'active' : ''} type="button" onClick={() => setPage('facilities')}>Facilities</button>{booking && <button className={page === 'reservation' ? 'active' : ''} type="button" onClick={() => setPage('reservation')}>Reservation</button>}</nav>
        <div className="profile">{user ? <><span className="avatar">{user.firstName[0]}{user.lastName[0]}</span><span>{user.firstName} {user.lastName}</span></> : <button className="signin-link" type="button" onClick={() => { setAuthStep('details'); setModal('signin') }}>Sign in</button>}<span className="chevron">⌄</span></div>
      </header>

      {page === 'home' && <section className="hero page-section" id="top"><div className="hero-copy-block"><p className="eyebrow">Open daily · 6:00 am — 11:00 pm</p><h1>Make room<br /><em>for your game.</em></h1><p className="hero-copy">Six ways to play, one place to meet. Find your court, choose your time, and make it yours.</p><button className="hero-cta" type="button" onClick={() => setPage('sports')}>Book now</button></div></section>}

      {page === 'sports' && <section className="page-section selection-page"><div className="page-heading"><div><p className="eyebrow">01</p><h1>Pick your sport.</h1><p>Choose a game to see the spaces available today.</p></div><span className="page-mark">SC<br /><small>BOOKING</small></span></div><div className="sport-grid sport-grid-large">{sports.map((item) => <button type="button" key={item.id} className={`sport-card ${sport === item.id ? 'selected' : ''}`} onClick={() => goToSport(item.id)}><SportIcon id={item.id} /><span className="sport-card-copy"><strong>{item.label}</strong><small>{item.note}</small></span></button>)}</div></section>}

      {page === 'booking' && <section className="page-section booking-page"><div className="booking-grid">
        <div className="map-panel"><div className="panel-heading"><div><h2>{selectedSport.label}</h2><p>{selectedSport.id === 'basketball' || selectedSport.id === 'volleyball' ? 'Choose a shared court' : `${map.count} spaces available`}</p></div><span className="map-key"><i></i> Available <i className="key-selected"></i> Selected <i className="key-full"></i> Fully booked</span></div><div className={`venue-map ${map.kind}`}>{Array.from({ length: map.count }, (_, index) => <button type="button" key={index} className={`venue-item ${court === index + 1 ? 'selected' : ''}`} onClick={() => setCourt(index + 1)} aria-label={`${map.prefix} ${index + 1}`}><span className="venue-drawing">{sport === 'basketball' || sport === 'volleyball' ? <SharedCourtDiagram sport={sport} /> : <CourtDiagram kind={map.kind} />}</span><strong>{map.prefix} {index + 1}</strong><small>{court === index + 1 ? 'Selected' : 'Available'}</small></button>)}</div></div>
        <aside className="details-panel"><h2>When works?</h2><label className="field-label" htmlFor="date">Pick a date</label><div className="date-field"><span>▣</span><input id="date" type="date" value={date} min="2026-10-01" onChange={(event) => { setDate(event.target.value); setTime(null) }} /></div><div className="date-summary"><strong>{formatDate(date)}</strong><span>Local time</span></div><label className="field-label">How long?</label><div className="duration-group">{[1, 2, 3].map((hours) => <button key={hours} type="button" className={duration === hours ? 'selected' : ''} onClick={() => selectDuration(hours)}>{hours} hr{hours > 1 ? 's' : ''}</button>)}</div><label className="field-label slot-label">Available start times</label><div className="slot-grid">{slots.map((slot) => { const unavailable = slotIsUnavailable(slot); const selected = time === slot; return <button key={slot} type="button" disabled={unavailable} className={`${selected ? 'selected' : ''} ${unavailable ? 'unavailable' : ''}`} onClick={() => setTime(slot)}>{slot}<small>{busySlots.includes(slot) ? 'Booked' : unavailable ? 'Unavailable' : 'Open'}</small></button> })}</div>{!court && <p className="hint">Choose a court above to see times.</p>}</aside>
      </div><div className="booking-footer"><button className="back-link" type="button" onClick={() => setPage('sports')}>← Back to sports</button><button type="button" className="reserve-button" disabled={!canBook || Boolean(booking)} onClick={() => setModal('confirm')}>{booking ? 'You have an active booking' : 'Review reservation'}</button></div></section>}

      {page === 'facilities' && <section className="page-section facilities-page"><div className="page-heading"><div><p className="eyebrow">Sport Complex</p><h1>Facilities.</h1><p>Every space, laid out so you can see the whole club.</p></div></div><div className="facility-plan"><div className="facility-label">Entrance / reception</div><div className="facility-west"><button className="facility-space" type="button" onClick={() => goToSport('pickleball')}><span>Pickleball 1</span><CourtDiagram kind="pickleball" /></button><button className="facility-space" type="button" onClick={() => goToSport('pickleball')}><span>Pickleball 2</span><CourtDiagram kind="pickleball" /></button></div><div className="facility-center">{['Badminton 1', 'Badminton 2', 'Badminton 3', 'Badminton 4'].map((label) => <button className="facility-space" type="button" key={label} onClick={() => goToSport('badminton')}><span>{label}</span><CourtDiagram kind="badminton" /></button>)}</div><div className="facility-east"><button className="facility-space" type="button" onClick={() => goToSport('table-tennis')}><span>Table tennis space</span><CourtDiagram kind="table" /></button><button className="facility-space" type="button" onClick={() => goToSport('billiards')}><span>Billiards space</span><CourtDiagram kind="billiards" /></button></div><div className="facility-south"><button className="facility-space" type="button" onClick={() => goToSport('basketball')}><span>Basketball / Volleyball</span><SharedCourtDiagram facility /></button><button className="facility-space" type="button" onClick={() => goToSport('volleyball')}><span>Basketball / Volleyball</span><SharedCourtDiagram facility /></button></div></div></section>}

      {page === 'reservation' && booking && <section className="page-section reservation-page"><div className="page-heading"><div><p className="eyebrow">Reservation</p><h1>Your active reservation.</h1><p>Manage your upcoming session in one place.</p></div></div><section className="reservation-card"><p className="eyebrow">Confirmed booking</p><h2>{sports.find((item) => item.id === booking.sport).label} · {venueMap[booking.sport].prefix} {booking.court}</h2><p>{formatDate(booking.date)} · {booking.time} — {booking.duration} hour{booking.duration > 1 ? 's' : ''}</p><button type="button" className="cancel-button" disabled={!canCancel} onClick={() => setModal('cancel')}>{canCancel ? 'Cancel booking' : 'Cancellation closed'}</button></section></section>}

      <footer><span>SPORT COMPLEX / COMMUNITY SPORTS CLUB</span><span>Need a hand? hello@sportcomplex.club</span><span>© 2026</span></footer>

      {modal && <div className="modal-backdrop"><div className="modal" role="dialog" aria-modal="true">{modal === 'signin' && <><span className="modal-number">SC</span><p className="eyebrow">Create your account</p><h2>{authStep === 'details' ? 'Sign in to book.' : 'Create a password.'}</h2>{authStep === 'details' ? <><div className="auth-grid"><input placeholder="First name" value={authForm.firstName} onChange={(event) => updateAuth('firstName', event.target.value)} /><input placeholder="Last name" value={authForm.lastName} onChange={(event) => updateAuth('lastName', event.target.value)} /><input className="wide" type="email" placeholder="Email" value={authForm.email} onChange={(event) => updateAuth('email', event.target.value)} /><input className="wide" type="tel" placeholder="Phone number" value={authForm.phone} onChange={(event) => updateAuth('phone', event.target.value)} /></div><button type="button" className="reserve-button" onClick={continueAuth}>Next <span>↗</span></button></> : <><div className="auth-grid"><input className="wide" type="password" placeholder="Password" value={authForm.password} onChange={(event) => updateAuth('password', event.target.value)} /><input className="wide" type="password" placeholder="Validate password" value={authForm.confirmPassword} onChange={(event) => updateAuth('confirmPassword', event.target.value)} /></div><button type="button" className="reserve-button" onClick={finishAuth}>Create account <span>↗</span></button></>}{authError && <p className="auth-error">{authError}</p>}<button type="button" className="text-button" onClick={() => setModal(null)}>Cancel</button></>}{modal === 'confirm' && <><p className="eyebrow">Almost there</p><h2>Lock in your session?</h2><p className="modal-copy">You're booking <strong>{selectedSport.label} · {map.prefix} {court}</strong> for <strong>{formatDate(date)}</strong> at <strong>{time}</strong> for <strong>{duration} hour{duration > 1 ? 's' : ''}</strong>.</p><div className="modal-actions"><button type="button" className="text-button" onClick={() => setModal(null)}>Go back</button><button type="button" className="reserve-button" onClick={confirmBooking}>Confirm booking <span>↗</span></button></div></>}{modal === 'success' && <><span className="success-mark">✓</span><p className="eyebrow">You're all set</p><h2>Booking confirmed.</h2><p className="modal-copy">Your space is waiting. We've saved this reservation to your account.</p><div className="receipt"><span>{formatDate(date)}</span><strong>{selectedSport.label} · {map.prefix} {court}</strong><span>{time} · {duration} hour{duration > 1 ? 's' : ''}</span></div><button type="button" className="reserve-button" onClick={() => setModal(null)}>Done <span>↗</span></button></>}{modal === 'cancel' && <><span className="modal-number">!</span><p className="eyebrow">Cancel reservation</p><h2>Let this one go?</h2><p className="modal-copy">You can cancel up to two hours before your scheduled start time.</p><div className="modal-actions"><button type="button" className="text-button" onClick={() => setModal(null)}>Keep booking</button><button type="button" className="cancel-button" onClick={cancelBooking}>Cancel booking</button></div></>}</div></div>}
    </main>
  )
}

export default App
