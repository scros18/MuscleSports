export default function Maintenance() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        {/* Logo */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '4rem', 
            fontWeight: 'bold', 
            color: '#10b981', 
            marginBottom: '10px',
            textShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
          }}>
            💪 MuscleSports
          </h1>
          <div style={{
            width: '100px',
            height: '4px',
            background: '#10b981',
            margin: '0 auto',
            borderRadius: '2px'
          }}></div>
        </div>

        {/* Maintenance Message */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
            🔧 System Maintenance
          </div>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#d1d5db', 
            marginBottom: '20px',
            lineHeight: '1.6'
          }}>
            We are currently performing scheduled maintenance. Please check back soon!
          </p>
        </div>

        {/* 10% Welcome Discount Banner */}
        <div style={{
          background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '40px',
          boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
            🎉 EXCLUSIVE LAUNCH OFFER 🎉
          </div>
          <div style={{ 
            fontSize: '5rem', 
            fontWeight: '900', 
            marginBottom: '10px',
            textShadow: '0 0 20px rgba(0,0,0,0.5)'
          }}>
            10% OFF
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>
            YOUR FIRST ORDER!
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '15px',
            display: 'inline-block'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              CODE: <span style={{ color: '#fbbf24' }}>WELCOME10</span>
            </div>
          </div>
          <div style={{ fontSize: '1.25rem' }}>
            Use this code when we&apos;re back online! 💪
          </div>
        </div>

        {/* Contact Information */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
            Need Immediate Assistance?
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
            <a 
              href="mailto:support@musclesports.co.uk" 
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                textDecoration: 'none',
                padding: '15px 30px',
                borderRadius: '10px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'background 0.3s ease'
              }}
            >
              📧 support@musclesports.co.uk
            </a>
            <a 
              href="tel:+441234567890" 
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                textDecoration: 'none',
                padding: '15px 30px',
                borderRadius: '10px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'background 0.3s ease'
              }}
            >
              📞 +44 123 456 7890
            </a>
          </div>
        </div>

        {/* Current Time */}
        <div style={{ marginTop: '40px', color: '#9ca3af', fontSize: '1rem' }}>
          <p>Current time: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}