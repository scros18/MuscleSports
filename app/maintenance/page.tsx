export default function Maintenance() {
  return (
    <html>
      <head>
        <title>Maintenance - MuscleSports</title>
        <style>{`
          * { margin: 0 !important; padding: 0 !important; }
          html, body { 
            background: #DC2626 !important; 
            color: white !important; 
            font-size: 50px !important;
            height: 100% !important;
            overflow: visible !important;
            position: static !important;
          }
          .test {
            background: #DC2626 !important;
            color: white !important;
            padding: 100px !important;
            min-height: 100vh !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            z-index: 999999 !important;
          }
        `}</style>
      </head>
      <body>
        <div className="test">
          TEST MAINTENANCE PAGE - IF YOU SEE THIS IT WORKS!
        </div>
      </body>
    </html>
  );
}