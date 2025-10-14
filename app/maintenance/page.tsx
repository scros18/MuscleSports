export default function MaintenancePage() {
  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        display: 'block !important',
        visibility: 'visible !important',
        zIndex: 9999,
        overflow: 'auto',
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          textAlign: 'center',
          display: 'block !important',
          visibility: 'visible !important'
        }}>
          {/* Logo */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ 
              fontSize: '4rem', 
              fontWeight: 'bold', 
              color: '#10b981', 
              marginBottom: '10px',
              textShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
              display: 'block !important',
              visibility: 'visible !important'
            }}>
              💪 MuscleSports
            </h1>
            <p style={{ 
              fontSize: '1.2rem', 
              color: '#9ca3af',
              marginBottom: '0',
              display: 'block !important',
              visibility: 'visible !important'
            }}>
              Your Premier Sports Nutrition Destination
            </p>
          </div>

          {/* Maintenance Message */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '40px', 
            borderRadius: '20px',
            marginBottom: '40px',
            border: '2px solid #10b981',
            display: 'block !important',
            visibility: 'visible !important'
          }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              marginBottom: '20px',
              color: '#10b981',
              display: 'block !important',
              visibility: 'visible !important'
            }}>
              🔧 Site Under Maintenance
            </h2>
            <p style={{ 
              fontSize: '1.3rem', 
              lineHeight: '1.6',
              marginBottom: '20px',
              display: 'block !important',
              visibility: 'visible !important'
            }}>
              We are currently performing scheduled maintenance to improve your experience. Please check back soon!
            </p>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#9ca3af',
              display: 'block !important',
              visibility: 'visible !important'
            }}>
              Estimated completion: <strong style={{ color: '#10b981' }}>2 hours</strong>
            </p>
          </div>

          {/* Discount Banner */}
          <div style={{ 
            background: 'linear-gradient(45deg, #10b981, #059669)',
            padding: '30px',
            borderRadius: '15px',
            marginBottom: '40px',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
            display: 'block !important',
            visibility: 'visible !important'
          }}>
            <h3 style={{ 
              fontSize: '2rem', 
              marginBottom: '10px',
              color: 'white',
              display: 'block !important',
              visibility: 'visible !important'
            }}>
              🎉 EXCLUSIVE LAUNCH OFFER
            </h3>
            <p style={{ 
              fontSize: '3.5rem', 
              fontWeight: 'bold',
              marginBottom: '10px',
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              display: 'block !important',
              visibility: 'visible !important'
            }}>
              10% OFF
            </p>
            <p style={{ 
              fontSize: '1.5rem', 
              marginBottom: '15px',
              color: 'white',
              display: 'block !important',
              visibility: 'visible !important'
            }}>
              YOUR FIRST ORDER!
            </p>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)',
              padding: '10px 20px',
              borderRadius: '10px',
              display: 'inline-block',
              fontSize: '1.2rem',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              visibility: 'visible !important'
            }}>
              CODE: WELCOME10
            </div>
            <p style={{ 
              marginTop: '15px',
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.9)',
              display: 'block !important',
              visibility: 'visible !important'
            }}>
              Use this code when we're back online! 💪
            </p>
          </div>

          {/* Contact Info */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            padding: '30px', 
            borderRadius: '15px',
            marginBottom: '30px',
            display: 'block !important',
            visibility: 'visible !important'
          }}>
            <h3 style={{ 
              fontSize: '1.8rem', 
              marginBottom: '20px',
              color: '#10b981',
              display: 'block !important',
              visibility: 'visible !important'
            }}>
              📞 Need Immediate Assistance?
            </h3>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              <a href="mailto:support@musclesports.co.uk" style={{
                background: '#10b981',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                visibility: 'visible !important'
              }}>
                📧 support@musclesports.co.uk
              </a>
              <a href="tel:+441234567890" style={{
                background: '#10b981',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                visibility: 'visible !important'
              }}>
                📞 +44 123 456 7890
              </a>
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            fontSize: '0.9rem', 
            color: '#6b7280',
            marginTop: '40px',
            display: 'block !important',
            visibility: 'visible !important'
          }}>
            <p style={{ display: 'block !important', visibility: 'visible !important' }}>
              Current Time: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{new Date().toLocaleTimeString()}</span>
            </p>
            <p style={{ 
              marginTop: '10px',
              display: 'block !important',
              visibility: 'visible !important'
            }}>
              Thank you for your patience. We'll be back stronger than ever! 💪
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
