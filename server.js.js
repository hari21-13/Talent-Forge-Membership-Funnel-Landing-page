const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/talent_forge_db')
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('Database Error:', err));

// 2. Mongoose Schema
const LeadSchema = new mongoose.Schema({
  leadId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  planSelected: { type: String, required: true },
  duration: { type: String, default: '12 Months' },
  experienceLevel: { type: String, required: true },
  notes: { type: String, default: '' },
  assignedAssociate: { type: String, default: 'Hima Bindu' },
  associateId: { type: String, default: 'AA-TF-8842' },
  submittedAt: { type: Date, default: Date.now }
});

const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);

// 3. SMTP Transport Config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.OFFICIAL_EMAIL,
    pass: process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.replace(/\s+/g, '') : ''
  }
});

// Verify SMTP Connection on server start
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ GMAIL SMTP LOGIN FAILED:', error.message);
    console.error('👉 Verify OFFICIAL_EMAIL and 16-digit App Password in your .env file!');
  } else {
    console.log('✅ GMAIL SMTP SERVER CONNECTED & READY TO DISPATCH MAILS');
  }
});

// 4. Dual-Dispatch Mail Routine
async function dispatchDualMails(leadData) {
  const senderEmail = process.env.OFFICIAL_EMAIL;

  // Mail 1: Confirmation to Prospect (The email typed into the form)
  const clientMail = {
    from: `"Talent Forge | Alpha Auron" <${senderEmail}>`,
    to: leadData.email,
    subject: `Enquiry Confirmed: ${leadData.planSelected} (${leadData.duration}) - Talent Forge`,
    html: `
      <div style="background-color: #000; color: #fff; padding: 25px; font-family: sans-serif; border: 1px solid #ef4444; border-radius: 8px;">
        <h2 style="color: #ef4444; margin-top: 0;">Welcome to Talent Forge, ${leadData.fullName}!</h2>
        <p>Thank you for submitting your membership enquiry for <strong>${leadData.planSelected} (${leadData.duration})</strong>.</p>
        <p>Your tracking Lead ID is: <strong style="color: #ef4444; font-size: 18px;">${leadData.leadId}</strong></p>
        <hr style="border-color: #333;" />
        <p>Assigned Executive: <strong>Hima Bindu (Associate ID: AA-TF-8842)</strong></p>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">Alpha Auron Private Limited</p>
      </div>
    `
  };

  // Mail 2: Notification to Executive Receiver
  const executiveMail = {
    from: `"Talent Forge Funnel" <${senderEmail}>`,
    to: 'hima.bindu@alphaauron.com',
    subject: `[New Lead Attributed] ${leadData.fullName} - ${leadData.planSelected}`,
    html: `
      <div style="background-color: #000; color: #fff; padding: 25px; font-family: sans-serif; border: 1px solid #ef4444; border-radius: 8px;">
        <h3 style="color: #ef4444; margin-top: 0;">New Attributed Lead Submitted</h3>
        <p><strong>Lead ID:</strong> ${leadData.leadId}</p>
        <p><strong>Candidate Name:</strong> ${leadData.fullName}</p>
        <p><strong>Email:</strong> ${leadData.email}</p>
        <p><strong>Phone:</strong> ${leadData.phone}</p>
        <p><strong>Selected Level:</strong> ${leadData.planSelected} (${leadData.duration})</p>
        <p><strong>Experience:</strong> ${leadData.experienceLevel}</p>
        <p><strong>Notes:</strong> ${leadData.notes || 'N/A'}</p>
      </div>
    `
  };

  // Execute sending sequentially so logs print accurately
  const clientRes = await transporter.sendMail(clientMail);
  console.log(`📩 CLIENT MAIL DELIVERED TO [${leadData.email}] | Response:`, clientRes.response);

  const execRes = await transporter.sendMail(executiveMail);
  console.log(`📩 EXECUTIVE MAIL DELIVERED TO [hima.bindu@alphaauron.com] | Response:`, execRes.response);
}

// 5. Submit Endpoint
app.post('/api/leads/submit', async (req, res) => {
  try {
    const { fullName, email, phone, planSelected, duration, experienceLevel, notes } = req.body;
    const leadId = 'TF-HB-' + Math.floor(100000 + Math.random() * 900000);

    const newLead = new Lead({
      leadId,
      fullName,
      email,
      phone,
      planSelected,
      duration: duration || '12 Months',
      experienceLevel,
      notes,
      assignedAssociate: 'Hima Bindu',
      associateId: 'AA-TF-8842'
    });

    await newLead.save();

    // Await email delivery before sending successful HTTP response
    await dispatchDualMails(newLead);

    res.status(201).json({ 
      success: true, 
      message: 'Enquiry submitted & emails sent successfully!', 
      leadId 
    });
  } catch (error) {
    console.error('❌ ERROR IN SUBMISSION ROUTE:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch Leads Endpoint
app.get('/api/leads/hima-bindu', async (req, res) => {
  try {
    const leads = await Lead.find({ associateId: 'AA-TF-8842' }).sort({ submittedAt: -1 });
    res.json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Excel Export Endpoint
app.get('/api/leads/export-excel', async (req, res) => {
  try {
    const leads = await Lead.find({ associateId: 'AA-TF-8842' });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Hima Bindu Enquiries');

    worksheet.columns = [
      { header: 'Lead ID', key: 'leadId', width: 15 },
      { header: 'Full Name', key: 'fullName', width: 22 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Plan Selected', key: 'planSelected', width: 25 },
      { header: 'Duration', key: 'duration', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Date Submitted', key: 'submittedAt', width: 22 }
    ];

    leads.forEach(lead => {
      worksheet.addRow({
        leadId: lead.leadId,
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        planSelected: lead.planSelected,
        duration: lead.duration,
        status: lead.status || 'New Enquiry',
        submittedAt: new Date(lead.submittedAt).toISOString()
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Hima_Bindu_Talent_Forge_Leads.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));