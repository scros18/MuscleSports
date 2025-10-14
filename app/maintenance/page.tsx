export default function Maintenance() {
  return (
    <div style={{
      margin: 0,
      padding: 0,
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #111827 0%, #374151 50%, #111827 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white',
        maxWidth: '600px',
        padding: '20px'
      }}>
        <div style={{
          fontSize: '48px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#10b981'
        }}>
          💪 MuscleSports
        </div>
        
        <div style={{
          fontSize: '32px',
          marginBottom: '20px'
        }}>
          We&apos;re Upgrading Our System
        </div>
        
        <div style={{
          fontSize: '18px',
          marginBottom: '40px',
          color: '#d1d5db'
        }}>
          We are currently performing scheduled maintenance. Please check back soon!
        </div>
        
        <div style={{
          background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
          padding: '30px',
          borderRadius: '15px',
          marginBottom: '30px'
        }}>
          <div style={{
            fontSize: '24px',
            marginBottom: '10px'
          }}>
            🎉 EXCLUSIVE LAUNCH OFFER 🎉
          </div>
          <div style={{
            fontSize: '72px',
            fontWeight: '900',
            marginBottom: '10px'
          }}>
            10% OFF
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            YOUR FIRST ORDER!
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '15px',
            borderRadius: '10px',
            fontSize: '20px',
            marginBottom: '15px',
            display: 'inline-block'
          }}>
            CODE: WELCOME10
          </div>
          <div>Use this code when we&apos;re back online! 💪</div>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <h3>Need Immediate Assistance?</h3>
          <a href="mailto:support@musclesports.co.uk" style={{
            color: 'white',
            textDecoration: 'none',
            margin: '0 10px',
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '5px',
            display: 'inline-block',
            marginTop: '10px'
          }}>
            📧 support@musclesports.co.uk
          </a>
          <a href="tel:+441234567890" style={{
            color: 'white',
            textDecoration: 'none',
            margin: '0 10px',
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '5px',
            display: 'inline-block',
            marginTop: '10px'
          }}>
            📞 +44 123 456 7890
          </a>
        </div>
      </div>
    </div>
  );
}