export default function Maintenance() {
  return (
    <>
      <style>{`
        body { 
          background: #DC2626 !important;
          color: white !important;
          overflow: visible !important;
        }
        .maintenance-test {
          background: #DC2626 !important;
          color: white !important;
          font-size: 50px !important;
          padding: 100px !important;
          min-height: 100vh !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
      `}</style>
      <div className="maintenance-test">
        TEST MAINTENANCE PAGE - IF YOU SEE THIS IT WORKS!
      </div>
    </>
  );
}