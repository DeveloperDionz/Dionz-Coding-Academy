import React, { useRef} from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { usePDF } from 'react-to-pdf';
import { useAuth } from '@/contexts/AuthContext';

interface CertificateProps {
  courseTitle: string;
  onClose: () => void;
}

const Certificate: React.FC<CertificateProps> = ({ courseTitle, onClose }) => {
  const { user } = useAuth();
  const certificateRef = useRef<HTMLDivElement>(null);
  const learnerName = user?.user_metadata?.full_name || "Learner";

  const downloadPDF = async () => {
    if (!certificateRef.current) return;

    const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
    pdf.save(`${learnerName}_Certificate.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 overflow-y-auto">
        <div className="relative max-w-5xl w-full">

            <div ref={certificateRef} className="relative w-full aspect-[1.414/1] bg-white shadow-2xl">
                <img
                src="/certificate-template.png"
                className="absolute inset-0 w-full h-full object-cover"
                alt="Template"
                />


                    {/* LEARNER NAME */}
                <div className="absolute inset-0">
                    <div className="absolute top-[38%] left-[8%] right-0">
                        <h2 style={{ fontFamily: "'Pinyon Script', cursive" }} className="text-8xl md:text-[5rem] text-slate-900">
                            {learnerName}
                        </h2>
                    </div>
                    {/* COURSE NAME  */}
          <div className="absolute top-[58%] left-[65%] w-[30%] text-left">
            <p className="text-lg md:text-2xl font-bold text-slate-700 ">
              {courseTitle}
            </p>
          </div>

          {/* DATE */}
          <div className="absolute bottom-[24%] right-[8%] text-slate-700 text-sm font-medium">
            {new Date().toLocaleDateString()}
          </div>
        </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-8 flex justify-center gap-4">
          <button 
            onClick={downloadPDF}
            className="bg-yellow-600 text-white px-8 py-3 rounded-full font-bold hover:bg-yellow-500"
          >
            Download Certificate
          </button>
          <button 
            onClick={onClose}
            className="bg-white px-8 py-3 rounded-full hover:bg-yellow-500">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificate;