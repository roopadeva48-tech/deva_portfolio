import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

export const chatRouter = Router();

// Context about Devaroopa and the 3D portfolio
const SYSTEM_PROMPT = `You are "Alby", the friendly, witty, and knowledgeable 3D AI assistant for Devaroopa's Creative Engineering & 3D WebGL Portfolio.
Your goal is to guide visitors, answer questions about Devaroopa's projects, technical skills, certifications, and background, and help them navigate her interactive 3D world.

About Devaroopa:
- Name: Devaroopa E (she/her)
- Role: Creative Technologist, WebGL / 3D Spatial Frontend Architect & Full-Stack Engineer.
- Location: Bangalore, India / Open to Global Remote roles and select creative collaborations.
- Experience: 5+ years crafting real-time 3D web experiences, tactile animatics, and high-performance interactive graphics.
- Core Stack: Three.js, WebGL / GLSL, React 19, TypeScript, Next.js, Framer Motion, Web Audio API, Node.js / Express, Blender.
- Key Landmarks on the 3D Globe:
  1. Girl on Suitcase (Center): Profile, personal journey, skills matrix, and career timeline.
  2. Skyscrapers (Skyline Studios): Featured Projects (Aetheria 3D Physics Engine, Neural Nexus, Quantum Canvas).
  3. Cozy House: 3D Certificate Hallway with interactive exhibition rooms.
  4. Rocket: Performance rigs, 60 FPS optimizations, shader pipelines.
  5. Harbor Crane & Boat: Creative lab and experimental prototypes.
  6. Hot Air Balloon: Aero Expeditions & Contact Portal.
- Featured Certifications:
  1. Class D Hackathon — CSE Department, K.S.R. College of Engineering (Door #101).
  2. YHACK '26 — National Level 24-Hour Hackathon by IEEE RAS & IEEE KPRIET (Door #102).
  3. Industry Learning Internship — Touchmark Descience Pvt. Ltd. (Door #103).
  4. AI Fluency: Framework & Foundations — Anthropic (Door #104).
  5. Python Full Stack Internship — EduSkills (Door #105).

Tone & Persona:
- Warm, enthusiastic, concise, and helpful.
- Speak in first-person as Alby ("I'm Alby, Deva's virtual assistant!").
- Keep responses friendly, engaging, and under 3 paragraphs unless asked for extensive technical depth.
- Suggest navigation destinations where appropriate (e.g. "Feel free to check out the 3D Certificate Hallway or Projects!").
`;

// Fallback intelligent responder when Gemini API key is not configured or in offline mode
function getLocalFallbackReply(userText: string): { reply: string; actions?: Array<{ label: string; path: string }> } {
  const query = userText.toLowerCase().trim();

  // 1. Greetings
  if (/^(hi|hello|hey|greetings|what's up|howdy|sup|good morning|good evening)/i.test(query)) {
    return {
      reply: `Hey there! 👋 I'm **Alby**, Devaroopa's AI guide for this 3D portfolio! \n\nI can show you her featured 3D WebGL projects, guide you through the **3D Certificate Hallway**, or help you get in touch. What would you like to explore first?`,
      actions: [
        { label: '🚀 Explore Projects', path: '/projects' },
        { label: '📜 3D Certificate Hallway', path: '/certificates' },
        { label: '👩‍💻 View Deva\'s Profile', path: '/profile' }
      ]
    };
  }

  // 2. Who is Devaroopa / About / Bio
  if (/who is|about|background|bio|story|experience|profile/i.test(query)) {
    return {
      reply: `**Devaroopa** is a **Creative Technologist & 3D Spatial Frontend Architect** based in Bangalore. She builds high-performance WebGL visualizers, interactive dioramas, and tactile web apps using Three.js, React, and GLSL shaders.\n\nOver the past 5+ years, she has shipped 35+ interactive projects and won multiple honors for creative web engineering!`,
      actions: [
        { label: '👩‍💻 Open Full Profile & Story', path: '/profile' },
        { label: '🚀 View Shipped Projects', path: '/projects' }
      ]
    };
  }

  // 3. Projects
  if (/project|work|portfolio|built|app|aetheria|nexus|canvas|shader/i.test(query)) {
    return {
      reply: `Devaroopa has architected a lineup of innovative spatial applications! Highlights include:\n\n• **Aetheria: Anti-Gravity Physics Engine** — WebGL sandbox with quadtree collision and atmospheric drag.\n• **Neural Nexus: 3D Brain Matrix** — Real-time synaptic firing visualizer with Web Audio synthesis.\n• **Quantum Canvas: Fluid Simulator** — Navier-Stokes GPU fluid dynamics running at 60 FPS in browser.\n\nWould you like to explore them in detail?`,
      actions: [
        { label: '🏢 Open Skyline Studios (Projects)', path: '/projects' },
        { label: '🎈 Contact to Collaborate', path: '/contact' }
      ]
    };
  }

  // 4. Certificates / Hackathons / Awards
  if (/certif|hackathon|yhack|award|badge|achievement|degree|touchmark|anthropic/i.test(query)) {
    return {
      reply: `Devaroopa holds prestigious engineering and hackathon credentials showcased in our **Interactive 3D Hallway**:\n\n1. **Class D Hackathon** (Door #101) — CSE Department, KSR.\n2. **YHACK '26 National 24-Hr Hackathon** (Door #102) — IEEE Robotics & Automation Society.\n3. **Touchmark Descience Industry Internship** (Door #103) — Full-stack production engineering.\n4. **Anthropic AI Fluency** (Door #104) — LLM foundations & prompt frameworks.\n5. **EduSkills Python Full-Stack** (Door #105).\n\nYou can walk through each door in real 3D!`,
      actions: [
        { label: '🚪 Enter 3D Certificate Hallway', path: '/certificates' },
        { label: '🏆 View Door #102 (YHACK \'26)', path: '/certificates/ieee-yhack-26' }
      ]
    };
  }

  // 5. Skills / Tech Stack
  if (/skill|tech|stack|language|framework|three\.js|webgl|react|glsl|blender/i.test(query)) {
    return {
      reply: `Devaroopa specializes in cutting-edge frontend & creative tech:\n\n• **3D & Spatial Computing:** Three.js, WebGL, GLSL Shaders, Blender, Draco Compression.\n• **Modern Frontend:** React 19, TypeScript, Next.js, Framer Motion, Tailwind CSS.\n• **Interactive & Audio:** Web Audio API, Canvas Confetti, real-time particle systems.\n• **Backend & Systems:** Node.js, Express, REST APIs, Git, Cloud Run.`,
      actions: [
        { label: '👩‍💻 View Interactive Skill Matrix', path: '/profile' }
      ]
    };
  }

  // 6. Contact / Hire / Message
  if (/contact|hire|email|reach|message|talk|collaborate|freelance|job|booking/i.test(query)) {
    return {
      reply: `Devaroopa is currently **open for select creative engagements and senior spatial engineering roles**!\n\nYou can send her a transmission right through the **Aero Expeditions (Hot Air Balloon)** modal on this globe, or connect via GitHub and LinkedIn.`,
      actions: [
        { label: '📬 Open Contact / Message Form', path: '/contact' }
      ]
    };
  }

  // 7. Navigation & Globe help
  if (/globe|landmark|rotate|turn|spin|help|navigate|control|how to/i.test(query)) {
    return {
      reply: `Here are quick navigation tips for the 3D globe:\n\n• **Rotate Globe:** Drag anywhere on the globe with your mouse or finger.\n• **Auto-Spin:** Click the **Spin** button in the top right to pause or resume rotation.\n• **Landmarks:** Click any 3D floating landmark (House, Skyscrapers, Rocket, Balloon, or Girl) to fly directly into that world.\n• **Audio:** Toggle the **Sound** button to enjoy tactile procedural clicks and spatial chimes.`,
      actions: [
        { label: '🌍 Back to 3D Globe Home', path: '/' },
        { label: '🏢 Go to Projects', path: '/projects' }
      ]
    };
  }

  // Default fallback
  return {
    reply: `I can help you explore Devaroopa's work! Would you like to check out her **Featured 3D Projects**, walk through the **3D Certificate Hallway**, or read her **Personal Story & Skill Matrix**?`,
    actions: [
      { label: '🚀 Featured Projects', path: '/projects' },
      { label: '📜 3D Certificate Hallway', path: '/certificates' },
      { label: '👩‍💻 Personal Story & Profile', path: '/profile' }
    ]
  };
}

chatRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is available, use Google GenAI
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        
        // Build chat context
        const contents: any[] = [];
        if (Array.isArray(history)) {
          for (const msg of history.slice(-6)) {
            contents.push({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }]
            });
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        });

        const replyText = response.text || '';
        
        // Match possible navigation actions
        const actions: Array<{ label: string; path: string }> = [];
        const lower = (message + ' ' + replyText).toLowerCase();
        if (lower.includes('project') || lower.includes('work') || lower.includes('skyline')) {
          actions.push({ label: '🚀 Explore Projects', path: '/projects' });
        }
        if (lower.includes('certificate') || lower.includes('hackathon') || lower.includes('door')) {
          actions.push({ label: '📜 3D Certificate Hallway', path: '/certificates' });
        }
        if (lower.includes('profile') || lower.includes('about') || lower.includes('story')) {
          actions.push({ label: '👩‍💻 View Profile', path: '/profile' });
        }
        if (lower.includes('contact') || lower.includes('hire') || lower.includes('email') || lower.includes('message')) {
          actions.push({ label: '📬 Get in Touch', path: '/contact' });
        }

        res.json({
          reply: replyText,
          actions: actions.slice(0, 3)
        });
        return;
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to local engine:', geminiErr);
      }
    }

    // Fast, rich local intelligent fallback
    const fallback = getLocalFallbackReply(message);
    res.json(fallback);
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});
