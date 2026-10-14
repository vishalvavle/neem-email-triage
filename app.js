/* ==========================================
   NEEM TECH AI - WEBSITE INTERACTIVE LOGIC
   ========================================== */

// ------------------------------------------
// 1. DATA STRUCTURES FOR PHONE SIMULATOR (IDEA A)
// ------------------------------------------
const simulatorData = {
  plumber: {
    businessName: "Cascade Plumbing",
    assistantName: "Cascade AI",
    greeting: "Welcome to Cascade Plumbing! I am their virtual assistant. How can I help you with your pipes or drains today?",
    prompts: [
      {
        question: "What is your emergency response time?",
        response: "We have local dispatchers on standby. Typically, a technician can be at your door within 45 to 60 minutes for emergencies. Would you like me to get your address?"
      },
      {
        question: "Do you install water heaters?",
        response: "Absolutely! We install traditional tank and modern energy-efficient tankless water heaters. We can even give you a free estimate. Would you like me to schedule a consultation?"
      },
      {
        question: "Can I book a drain cleaning service?",
        response: "Yes, our professional drain cleaning starts at just $99. We have open slots tomorrow afternoon. Shall I book you in for a 2:00 PM visit?"
      }
    ]
  },
  dentist: {
    businessName: "BrightSmile Dental",
    assistantName: "BrightSmile AI",
    greeting: "Hi! Thanks for visiting BrightSmile Dental. I'm BrightSmile AI. How can I assist you with your dental health today?",
    prompts: [
      {
        question: "Are you accepting new patients?",
        response: "Yes, we are absolutely welcoming new patients of all ages! We have a $79 new patient special that covers cleaning, exam, and X-rays. Shall I book you in?"
      },
      {
        question: "What insurance do you take?",
        response: "We accept most major PPO insurance plans, including Delta Dental, Cigna, Aetna, and MetLife. Let me know your provider and I can check your coverage benefits!"
      },
      {
        question: "I have an emergency toothache.",
        response: "Oh no, tooth pain is the worst! We hold emergency blocks open every single day. What's the best phone number for our clinic to call you right away?"
      }
    ]
  },
  salon: {
    businessName: "Velvet Salon & Spa",
    assistantName: "Velvet AI",
    greeting: "Hello! Welcome to Velvet Salon & Spa. I am the Velvet AI assistant. How can I help style your day?",
    prompts: [
      {
        question: "What services do you offer?",
        response: "We offer professional cuts, blowouts, balayage, full coloring, and deep conditioning treatments. What kind of hair transformation are you looking for?"
      },
      {
        question: "Are there bookings open today?",
        response: "Let me check... Yes! We have a blowout opening at 3:30 PM with Sarah, and a haircut slot at 5:00 PM with Marcus. Would you like to reserve one of these?"
      },
      {
        question: "What is your cancellation policy?",
        response: "We request at least 24 hours notice for cancellations. Cancellations under 24 hours may incur a 50% charge of the scheduled service. Ready to book your slot?"
      }
    ]
  },
  lawyer: {
    businessName: "Apex Legal Group",
    assistantName: "Apex AI",
    greeting: "Hello, thank you for contacting Apex Legal Group. I am Apex AI. How can I assist with your legal inquiry today?",
    prompts: [
      {
        question: "Do you offer free consultations?",
        response: "Yes! We offer a free, confidential 15-minute case evaluation for personal injury and business litigation. Would you like to check our attorney calendar?"
      },
      {
        question: "What are your practice areas?",
        response: "Apex Legal specializes in Personal Injury, Contract Law, Corporate Structuring, and Intellectual Property. What area does your matter involve?"
      },
      {
        question: "How can I schedule a case review?",
        response: "I can set that up right now. Please provide your email address and a brief sentence about your case, and I will send over our booking calendar link!"
      }
    ]
  }
};

// State variable for simulator active industry
let activeIndustry = 'plumber';

// ------------------------------------------
// 2. INITIALIZE PHONE SIMULATOR DOM ELEMENTS & LOGIC
// ------------------------------------------
const chatWindow = document.getElementById('simulator-chat');
const promptsList = document.getElementById('simulator-prompts');
const industryTabs = document.getElementById('industry-tabs');

function initSimulator() {
  // Add click listeners to tabs
  const tabButtons = industryTabs.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Toggle active tab visual
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Load selected industry
      const industry = btn.getAttribute('data-industry');
      loadSimulatorIndustry(industry);
    });
  });

  // Load default
  loadSimulatorIndustry('plumber');
}

function loadSimulatorIndustry(industryKey) {
  activeIndustry = industryKey;
  const data = simulatorData[industryKey];
  
  // Clear chat
  chatWindow.innerHTML = '';
  
  // Add Greeting
  appendMessage(chatWindow, 'bot', data.greeting, data.assistantName);
  
  // Load Prompts
  promptsList.innerHTML = '';
  data.prompts.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'prompt-btn';
    btn.textContent = p.question;
    btn.addEventListener('click', () => handlePromptClick(p, btn));
    promptsList.appendChild(btn);
  });
}

function handlePromptClick(promptObj, buttonElement) {
  // Disable all prompt buttons temporarily to prevent multi-clicking during animation
  const buttons = promptsList.querySelectorAll('.prompt-btn');
  buttons.forEach(btn => btn.style.pointerEvents = 'none');

  // Add User Message
  appendMessage(chatWindow, 'user', promptObj.question);
  
  // Scroll to bottom
  scrollToBottom(chatWindow);

  // Trigger typing indicator for bot response
  const typingDiv = appendTypingIndicator(chatWindow, simulatorData[activeIndustry].assistantName);
  scrollToBottom(chatWindow);

  // Delayed response
  setTimeout(() => {
    // Remove typing indicator
    typingDiv.remove();
    
    // Add bot response
    appendMessage(chatWindow, 'bot', promptObj.response, simulatorData[activeIndustry].assistantName);
    scrollToBottom(chatWindow);
    
    // Re-enable prompt buttons
    buttons.forEach(btn => btn.style.pointerEvents = 'auto');
  }, 1200);
}

// ------------------------------------------
// 3. UTILITY CHAT FUNCTIONS
// ------------------------------------------
function appendMessage(targetWindow, sender, text, name = '') {
  const msg = document.createElement('div');
  msg.className = `chat-message ${sender}`;
  
  if (sender === 'bot') {
    const profile = document.createElement('div');
    profile.className = 'bot-profile';
    profile.innerHTML = `<i class="bi bi-robot"></i> <span>${name}</span>`;
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
  profile.innerHTML = `<i class="bi bi-robot"></i> <span>${name} is typing...</span>`;
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
// 4. ACTION HANDLERS (AUDIT / GET STARTED)
// ------------------------------------------
function openNeemChat(customInitialText = '') {
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

  const subject = customInitialText ? `Inquiry: ${customInitialText}` : 'Free AI Audit Inquiry';
  window.location.href = `mailto:info@neemtechai.com?subject=${encodeURIComponent(subject)}`;
}

// Expose openNeemChat globally so buttons can use it
window.openNeemChat = openNeemChat;

// ------------------------------------------
// 5. ROI CALCULATOR LOGIC
// ------------------------------------------
const sliderTraffic = document.getElementById('slider-traffic');
const sliderValue = document.getElementById('slider-value');
const sliderConversion = document.getElementById('slider-conversion');

const valTraffic = document.getElementById('val-traffic');
const valValue = document.getElementById('val-value');
const valConversion = document.getElementById('val-conversion');
const calcRevenue = document.getElementById('calc-revenue');

function initROICalculator() {
  if (!sliderTraffic || !sliderValue || !sliderConversion) return;

  function updateCalculations() {
    const traffic = parseInt(sliderTraffic.value);
    const value = parseInt(sliderValue.value);
    const conversionGain = parseInt(sliderConversion.value) / 100;

    // Display formatted values
    valTraffic.textContent = traffic.toLocaleString();
    valValue.textContent = `$${value}`;
    valConversion.textContent = `${sliderConversion.value}%`;

    // Calculations:
    // How many additional leads are converted with AI?
    // Extra leads/month = Traffic * conversionGain
    // Annual Revenue = Extra leads/month * average customer value * 12 months
    const extraAnnualRevenue = Math.round(traffic * conversionGain * value * 12);
    
    // Animated text update
    calcRevenue.textContent = `$${extraAnnualRevenue.toLocaleString()}`;
  }

  // Bind events
  sliderTraffic.addEventListener('input', updateCalculations);
  sliderValue.addEventListener('input', updateCalculations);
  sliderConversion.addEventListener('input', updateCalculations);

  // Run initial calculation
  updateCalculations();
}

// ------------------------------------------
// 6. SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)
// ------------------------------------------
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  reveals.forEach(element => {
    revealObserver.observe(element);
  });
}

// ------------------------------------------
// 7. INITIALIZE ALL SERVICES
// ------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initSimulator();
  initROICalculator();
  initScrollReveal();

  // Highlight active nav item based on scroll position
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav ul a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 120; // Offset for header

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
