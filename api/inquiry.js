/**
 * KADARTECH Serverless Backend Handler
 * Vercel Serverless Function: /api/inquiry
 * Handles Festival Mega Offer claims, inquiry validation, and dispatch
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'success',
      service: 'KADARTECH Solutions API',
      campaign: 'Festival Season Mega Offer 2026',
      valid_till: '2026-12-31',
      offers_available: [
        { id: 'starter', name: 'Starter Pack', websites: 3, price: 250, unit_price: 83 },
        { id: 'growth', name: 'Growth Pack', websites: 9, price: 600, unit_price: 66, popular: true },
        { id: 'single', name: 'Single Website', websites: 1, price: 100 },
        { id: 'mobile', name: 'Mobile Application', platforms: 'Android + iOS', price: 120 },
        { id: 'software', name: 'Custom Software / SaaS', price: 800 }
      ],
      bonus: 'FREE AI Chatbot included with all packages (24/7 lead capture)'
    });
  }

  if (req.method === 'POST') {
    try {
      const { name, phone, email, offer, notes } = req.body || {};

      if (!name || (!phone && !email)) {
        return res.status(400).json({
          status: 'error',
          message: 'Please provide your name and at least one contact method (WhatsApp/Phone or Email).'
        });
      }

      const inquiryData = {
        id: `KD-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: String(name).trim(),
        phone: phone ? String(phone).trim() : null,
        email: email ? String(email).trim() : null,
        selectedOffer: offer || 'Festival Mega Offer 2026',
        notes: notes ? String(notes).trim() : '',
        timestamp: new Date().toISOString(),
        bonusUnlocked: 'Free 24/7 AI Chatbot Agent',
        status: 'queued_priority'
      };

      console.log('[KADARTECH LEAD LOGGED]:', JSON.stringify(inquiryData));

      const cleanPhone = inquiryData.phone ? inquiryData.phone.replace(/[^0-9]/g, '') : '';
      const encodedMsg = encodeURIComponent(
        `Hello KADARTECH! I claimed the ${inquiryData.selectedOffer}. My Name: ${inquiryData.name}. Inquiry ID: ${inquiryData.id}`
      );
      const whatsappRedirectUrl = `https://wa.me/919359086445?text=${encodedMsg}`;

      return res.status(200).json({
        status: 'success',
        message: 'Your Festival Offer priority slot has been booked!',
        inquiryId: inquiryData.id,
        whatsappRedirectUrl,
        data: inquiryData
      });
    } catch (err) {
      console.error('Server error handling inquiry:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error processing your request. Please message directly on WhatsApp.'
      });
    }
  }

  return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
}
