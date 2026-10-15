/* ==========================================
   NEEMTECHAI - CLINICAL & PRACTICE INTELLIGENCE LOGIC
   ========================================== */

// ------------------------------------------
// 1. DATA STRUCTURES FOR INTERACTIVE CLINICAL SIMULATOR
// ------------------------------------------
const simulatorData = {
  psychiatry: {
    businessName: "MindWell Psychiatric & Behavioral Health",
    assistantName: "MindWell Intake Specialist",
    badgeTheme: "psych",
    complianceText: "🔒 HIPAA Protocol Active • 42 CFR Part 2 Ready",
    greeting: "Hello, welcome to MindWell Psychiatric. I'm your confidential virtual intake specialist. Whether you're seeking an evaluation, therapy, or medication management, how can I assist you today?",
    prompts: [
      {
        question: "How do I book an initial psychiatric evaluation?",
        response: "We offer comprehensive 60-minute adult and adolescent evaluations for ADHD, anxiety, mood disorders, and depression with board-certified psychiatric practitioners. We have slots available this Thursday at 10:30 AM (In-Office or Telehealth). Would you like me to reserve that time for you?"
      },
      {
        question: "What insurance or payment options do you accept?",
        response: "We accept most major PPO insurances including BlueCross, Aetna, Cigna, and UnitedHealthcare. For out-of-network care, we generate itemized superbills automatically after each session for easy insurance reimbursement. Which carrier do you have?"
      },
      {
        question: "What if someone is in immediate crisis right now?",
        response: "Safety is our highest clinical priority. If you or a loved one is experiencing active distress or thoughts of self-harm, please dial or text 988 for the Suicide & Crisis Lifeline, or call 911 immediately. For non-emergent urgent clinical consultations, I can notify our on-call triage team right now."
      }
    ]
  },
  dentist: {
    businessName: "BrightSmile Dental & Oral Surgery",
    assistantName: "BrightSmile Clinical AI",
    badgeTheme: "emerald",
    complianceText: "🔒 HIPAA Secured • BAA Protected",
    greeting: "Hi there! Welcome to BrightSmile Dental. I'm BrightSmile AI. I can help with insurance verification, emergency dental triage, or scheduling your next appointment. How may I help you?",
    prompts: [
      {
        question: "I have an emergency toothache and swollen gum.",
        response: "Tooth pain and swelling can indicate an infection that needs immediate attention. We reserve same-day emergency blocks every morning and afternoon. We have an urgent evaluation slot at 1:45 PM today. May I get your phone number to secure this slot?"
      },
      {
        question: "Do you take Delta Dental or MetLife PPO?",
        response: "Yes! We are in-network with Delta Dental Premier/PPO, MetLife, Guardian, and Cigna. Most preventative exams and cleanings are covered at 100%. What is your member ID or policy group number so I can check your remaining annual benefits?"
      },
      {
        question: "Can I book a new patient exam and cleaning special?",
        response: "Absolutely! Our new patient comprehensive package includes full digital low-radiation X-rays, periodontal health screening, and dental cleaning. We have open appointments Friday morning at 9:00 AM or 11:30 AM."
      }
    ]
  },
  medical: {
    businessName: "Cascade Specialty & Family Medicine",
    assistantName: "Cascade Health AI",
    badgeTheme: "emerald",
    complianceText: "🔒 HIPAA Enterprise • AES-256 Encrypted",
    greeting: "Welcome to Cascade Family & Specialty Medicine. I can assist with new patient registration, prescription refill guidance, and telehealth appointments. How can our clinical team help you?",
    prompts: [
      {
        question: "Are you accepting new primary care patients?",
        response: "Yes, our board-certified family medicine physicians are welcoming new patients of all ages. We offer same-week new patient wellness visits and preventative screenings. Would you prefer a morning or afternoon appointment?"
      },
      {
        question: "Can I schedule a same-day telehealth consultation?",
        response: "Yes! We offer HIPAA-compliant video consultations for common illnesses, lab reviews, and non-narcotic prescription renewals. Our next open telehealth slot is today at 3:15 PM via secure link."
      },
      {
        question: "How are my medical records protected here?",
        response: "Your privacy is paramount. All inquiries and health records are encrypted using AES-256 at rest and TLS 1.3 in transit. Our systems operate under a signed BAA with strict role-based clinical staff access."
      }
    ]
  },
  contractor: {
    businessName: "Cascade Commercial & Home Services",
    assistantName: "Cascade Dispatch AI",
    badgeTheme: "cyan",
    complianceText: "⚡ 24/7 Rapid Dispatch Engine",
    greeting: "Welcome to Cascade Services! I am your 24/7 service coordinator. How can we help you with your property or project today?",
    prompts: [
      {
        question: "What is your emergency dispatch arrival time?",
        response: "Our on-call technicians are equipped and ready for rapid dispatch across the entire metro area. Typically, a licensed specialist can arrive within 45 to 60 minutes for priority emergencies."
      },
      {
        question: "Can I get a detailed quote for a new installation?",
        response: "Certainly! We provide transparent, upfront quotes with no hidden dispatch fees. What type of equipment or service are you looking to install, and what is your address?"
      },
      {
        question: "Can I book a scheduled diagnostic visit tomorrow?",
        response: "We have two open service windows tomorrow: 10:00 AM - 12:00 PM or 2:00 PM - 4:00 PM. Which time window works best for our technician to inspect your site?"
      }
    ]
  }
};

let activeIndustry = 'psychiatry';

// ------------------------------------------
// 2. SIMULATOR CONTROLLER
// ------------------------------------------
function initSimulator() {
  const tabsContainer = document.getElementById('industry-tabs');
  const chatWindow = document.getElementById('simulator-chat');
  const promptsContainer = document.getElementById('simulator-prompts');
  const complianceStatus = document.getElementById('simulator-compliance-status');

  if (!tabsContainer || !chatWindow || !promptsContainer) return;

  function loadIndustry(industryKey) {
    activeIndustry = industryKey;
    const data = simulatorData[industryKey];

    // Update compliance pill
    if (complianceStatus) {
      complianceStatus.textContent = data.complianceText;
      complianceStatus.className = `simulator-compliance-bar ${data.badgeTheme === 'psych' ? 'psych' : ''}`;
    }

    // Reset Chat Window
    chatWindow.innerHTML = '';
    appendMessage(chatWindow, 'bot', data.greeting, data.assistantName, data.badgeTheme);

    // Populate Prompts
    promptsContainer.innerHTML = '';
    data.prompts.forEach((item) => {
      const btn = document.createElement('button');
      btn.className = 'prompt-btn';
      btn.textContent = `“${item.question}”`;
      btn.addEventListener('click', () => handlePromptClick(item, btn));
      promptsContainer.appendChild(btn);
    });
  }

  // Handle Tab Switch
  tabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active', 'psych'));
      btn.classList.add('active');
      const ind = btn.getAttribute('data-industry');
      if (ind === 'psychiatry') {
        btn.classList.add('psych');
      }
      loadIndustry(ind);
    });
  });

  // Initial load
  loadIndustry('psychiatry');
}

function handlePromptClick(promptObj, clickedBtn) {
  const chatWindow = document.getElementById('simulator-chat');
  const promptsContainer = document.getElementById('simulator-prompts');
  const buttons = promptsContainer.querySelectorAll('button');

  // Disable prompts while replying
  buttons.forEach(btn => btn.style.pointerEvents = 'none');

  // Add User Message
  appendMessage(chatWindow, 'user', promptObj.question);
  scrollToBottom(chatWindow);

  // Add Typing Indicator
  const typingDiv = appendTypingIndicator(chatWindow, simulatorData[activeIndustry].assistantName);
  scrollToBottom(chatWindow);

  // Bot response with natural delay
  setTimeout(() => {
    typingDiv.remove();
    appendMessage(chatWindow, 'bot', promptObj.response, simulatorData[activeIndustry].assistantName, simulatorData[activeIndustry].badgeTheme);
    scrollToBottom(chatWindow);
    buttons.forEach(btn => btn.style.pointerEvents = 'auto');
  }, 1100);
}

// ------------------------------------------
// 3. UTILITY CHAT FUNCTIONS
// ------------------------------------------
function appendMessage(targetWindow, sender, text, name = '', badgeTheme = '') {
  const msg = document.createElement('div');
  msg.className = `chat-message ${sender}`;

  if (sender === 'bot') {
    const profile = document.createElement('div');
    profile.className = `bot-profile ${badgeTheme === 'psych' ? 'psych' : ''}`;
    profile.innerHTML = `<img src="brand/mark-simple.svg" class="bot-avatar-brand" alt="Neem"> <span>${name}</span>`;
    msg.appendChild(profile);
  }

  const body = document.createElement('div');
  body.className = 'message-body';
  body.textContent = text;
  msg.appendChild(body);

  targetWindow.appendChild(msg);
}

function appendTypingIndicator(targetWindow, name = '') {
  const msg = document.createElement('div');
  msg.className = 'chat-message bot';

  const profile = document.createElement('div');
  profile.className = 'bot-profile';
  profile.innerHTML = `<img src="brand/mark-simple.svg" class="bot-avatar-brand" alt="Neem"> <span>${name} is preparing response...</span>`;
  msg.appendChild(profile);

  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  msg.appendChild(indicator);

  targetWindow.appendChild(msg);
  return msg;
}

function scrollToBottom(windowElement) {
  windowElement.scrollTop = windowElement.scrollHeight;
}

// ------------------------------------------
// 4. ACTION HANDLERS (CLINICAL AUDIT & DEMO BOOKING)
// ------------------------------------------
function openNeemChat(customInitialText = '') {
  // If the LeadConnector widget exists and is ready, open it
  const chatWidget = document.querySelector('chat-widget');
  if (chatWidget) {
    if (typeof chatWidget.openWidget === 'function') {
      chatWidget.openWidget();
      return;
    }
    const launcherBtn = chatWidget.shadowRoot
      ? chatWidget.shadowRoot.querySelector('button, .chat-widget-button, [aria-label*="chat" i]')
      : chatWidget.querySelector('button');
    if (launcherBtn) {
      launcherBtn.click();
      return;
    }
  }

  // Graceful Fallback: Mail inquiry with tailored subject
  const subject = customInitialText 
    ? `Practice Inquiry: ${customInitialText}` 
    : 'Clinical & HIPAA AI Employee Consultation';
  window.location.href = `mailto:info@neemtechai.com?subject=${encodeURIComponent(subject)}`;
}

window.openNeemChat = openNeemChat;

// ------------------------------------------
// 5. PRACTICE IMPACT & REVENUE CALCULATOR
// ------------------------------------------
function initROICalculator() {
  const sliderTraffic = document.getElementById('slider-traffic');
  const sliderValue = document.getElementById('slider-value');
  const sliderConversion = document.getElementById('slider-conversion');

  const valTraffic = document.getElementById('val-traffic');
  const valValue = document.getElementById('val-value');
  const valConversion = document.getElementById('val-conversion');
  const calcRevenue = document.getElementById('calc-revenue');

  if (!sliderTraffic || !sliderValue || !sliderConversion || !calcRevenue) return;

  function calculate() {
    const inquiries = parseInt(sliderTraffic.value, 10);
    const avgValue = parseInt(sliderValue.value, 10);
    const capturePercent = parseInt(sliderConversion.value, 10) / 100;

    valTraffic.textContent = inquiries.toLocaleString();
    valValue.textContent = `$${avgValue.toLocaleString()}`;
    valConversion.textContent = `${sliderConversion.value}%`;

    // Calculation: Monthly additional patients * avg patient/case value * 12 months
    const additionalPatientsPerMonth = inquiries * capturePercent;
    const annualRecovered = Math.round(additionalPatientsPerMonth * avgValue * 12);

    calcRevenue.textContent = `$${annualRecovered.toLocaleString()}`;
  }

  sliderTraffic.addEventListener('input', calculate);
  sliderValue.addEventListener('input', calculate);
  sliderConversion.addEventListener('input', calculate);

  calculate();
}

// ------------------------------------------
// 6. SCROLL REVEAL OBSERVER
// ------------------------------------------
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// ------------------------------------------
// 7. INITIALIZE ALL SERVICES
// ------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initSimulator();
  initROICalculator();
  initScrollReveal();

  // Active nav tracking
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav ul a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
