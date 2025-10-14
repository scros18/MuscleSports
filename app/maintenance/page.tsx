export default function Maintenance() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          body { display: block !important; visibility: visible !important; }
          body * { display: none !important; }
          body::before { 
            content: "TEST MAINTENANCE PAGE - IF YOU SEE THIS IT WORKS!";
            display: block !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: #DC2626 !important;
            color: white !important;
            font-size: 50px !important;
            padding: 100px !important;
            z-index: 999999 !important;
            text-align: center !important;
            line-height: 1.2 !important;
            visibility: visible !important;
          }
        `
      }} />
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#DC2626',
        color: 'white',
        fontSize: '50px',
        padding: '100px',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        TEST MAINTENANCE PAGE - IF YOU SEE THIS IT WORKS!
      </div>
    </>
  );
}