import jsPDF from 'jspdf';
import { AssessmentResults } from '@/components/AssessmentForm';

const severityLabels = {
  minimal: 'Minimal Depression',
  mild: 'Mild Depression',
  moderate: 'Moderate Depression',
  'moderately-severe': 'Moderately Severe Depression',
  severe: 'Severe Depression'
};

const selfCareRecommendations = [
  '• Maintain 7-9 hours of quality sleep with consistent bedtime routine',
  '• Engage in 30 minutes of physical activity daily (walking, yoga, sports)',
  '• Practice mindfulness, meditation, or deep breathing exercises (10-15 minutes daily)',
  '• Maintain social connections with friends, family, or support groups',
  '• Eat balanced, nutritious meals and stay hydrated',
  '• Limit alcohol and caffeine consumption',
  '• Consider journaling to process thoughts and emotions',
  '• Engage in hobbies and activities that bring joy and fulfillment'
];

const professionalResources = [
  'Campus Counseling Center: (555) 123-4567 | Mon-Fri: 9AM-5PM',
  '24/7 Student Support Hotline: (555) 987-6543',
  'Online Counseling: counseling@university.edu',
  'National Suicide Prevention Lifeline: 988 (Available 24/7)',
  'Crisis Text Line: Text HOME to 741741',
  'Emergency Services: 911'
];

export async function generatePDFReport(results: AssessmentResults): Promise<void> {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add text with line breaks
  const addText = (text: string, x: number, y: number, options?: any) => {
    const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
    pdf.text(lines, x, y, options);
    return y + (lines.length * 6);
  };

  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(31, 81, 115); // Primary color
  yPosition = addText('Mental Health Assessment Report', margin, yPosition);
  
  yPosition += 10;
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  yPosition = addText(`Generated on: ${results.completedAt.toLocaleDateString()} at ${results.completedAt.toLocaleTimeString()}`, margin, yPosition);
  
  // Line separator
  yPosition += 10;
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  // Assessment Results
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  yPosition = addText('PHQ-9 Depression Screening Results', margin, yPosition);
  
  yPosition += 10;
  pdf.setFontSize(12);
  
  // Score box
  pdf.setFillColor(240, 248, 255);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 30, 'F');
  pdf.setTextColor(31, 81, 115);
  yPosition += 10;
  yPosition = addText(`Total Score: ${results.phq9Score} / 27`, margin + 10, yPosition);
  yPosition = addText(`Severity Level: ${severityLabels[results.severity]}`, margin + 10, yPosition);
  yPosition += 15;

  // Interpretation
  pdf.setTextColor(0, 0, 0);
  yPosition = addText('Score Interpretation:', margin, yPosition);
  yPosition += 5;
  
  let interpretation = '';
  if (results.phq9Score <= 4) {
    interpretation = 'Your responses suggest minimal signs of depression. This indicates good mental health with few or no depressive symptoms.';
  } else if (results.phq9Score <= 9) {
    interpretation = 'Your responses suggest mild depression symptoms. While not severe, these symptoms may benefit from attention and self-care strategies.';
  } else if (results.phq9Score <= 14) {
    interpretation = 'Your responses suggest moderate depression that would benefit from professional support and intervention.';
  } else if (results.phq9Score <= 19) {
    interpretation = 'Your responses suggest moderately severe depression. Professional help is strongly recommended.';
  } else {
    interpretation = 'Your responses suggest severe depression. Please seek professional help immediately.';
  }
  
  yPosition = addText(interpretation, margin, yPosition);
  yPosition += 15;

  // Recommendations
  pdf.setFontSize(14);
  yPosition = addText('Professional Recommendations:', margin, yPosition);
  yPosition += 10;
  pdf.setFontSize(12);
  
  let recommendation = '';
  if (results.riskLevel === 'high' || results.phq9Score >= 15) {
    recommendation = 'URGENT: Your responses indicate significant symptoms that require immediate professional attention. Please contact a mental health professional, your healthcare provider, or emergency services if you are having thoughts of self-harm.';
  } else if (results.riskLevel === 'medium' || results.phq9Score >= 10) {
    recommendation = 'Your responses suggest moderate symptoms that could benefit from professional guidance. Consider scheduling an appointment with a counselor, therapist, or your healthcare provider.';
  } else {
    recommendation = 'Your responses suggest minimal symptoms. Continue with healthy lifestyle practices and monitor your mental well-being regularly. Consider speaking with a counselor if symptoms change or worsen.';
  }
  
  yPosition = addText(recommendation, margin, yPosition);
  yPosition += 15;

  // Check if we need a new page
  if (yPosition > pageHeight - 100) {
    pdf.addPage();
    yPosition = margin;
  }

  // Self-Care Strategies
  pdf.setFontSize(14);
  yPosition = addText('Personalized Self-Care Strategies:', margin, yPosition);
  yPosition += 10;
  pdf.setFontSize(12);
  
  selfCareRecommendations.forEach(strategy => {
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = margin;
    }
    yPosition = addText(strategy, margin, yPosition);
    yPosition += 3;
  });
  
  yPosition += 10;

  // Professional Resources
  if (yPosition > pageHeight - 100) {
    pdf.addPage();
    yPosition = margin;
  }

  pdf.setFontSize(14);
  yPosition = addText('Professional Support Resources:', margin, yPosition);
  yPosition += 10;
  pdf.setFontSize(12);
  
  professionalResources.forEach(resource => {
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = margin;
    }
    yPosition = addText(resource, margin, yPosition);
    yPosition += 5;
  });

  yPosition += 15;

  // Crisis Warning (if applicable)
  if (results.riskLevel === 'high') {
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.setFillColor(254, 242, 242);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 50, 'F');
    pdf.setTextColor(239, 68, 68);
    pdf.setFontSize(14);
    yPosition += 10;
    yPosition = addText('⚠️ CRISIS SUPPORT AVAILABLE 24/7', margin + 10, yPosition);
    pdf.setFontSize(12);
    yPosition = addText('If you are having thoughts of self-harm or suicide:', margin + 10, yPosition);
    yPosition = addText('• Call 988 (National Suicide Prevention Lifeline)', margin + 10, yPosition);
    yPosition = addText('• Text HOME to 741741 (Crisis Text Line)', margin + 10, yPosition);
    yPosition = addText('• Call 911 for emergency assistance', margin + 10, yPosition);
    yPosition += 15;
  }

  // Footer
  if (yPosition > pageHeight - 50) {
    pdf.addPage();
    yPosition = margin;
  }
  
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(10);
  yPosition = pageHeight - 30;
  addText('Disclaimer: This assessment is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Please consult with a qualified healthcare provider for proper evaluation and treatment of mental health conditions.', margin, yPosition);

  // Save the PDF
  const filename = `Mental_Health_Assessment_${results.completedAt.toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
}