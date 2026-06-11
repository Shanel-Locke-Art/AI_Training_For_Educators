/* ══════════════════════════════════════════════════════
   PromptCraft — dialogue.js
   Owns Professor Pixel dialogue sequences only.

   Keep dialogue text here so index.html can handle behavior and styling without being cluttered by long strings. This also makes it easier to edit dialogue without accidentally breaking something in the HTML.
   ══════════════════════════════════════════════════════ */

window.pixelDialogue = {
  welcome: [
    { expr: 'excited',     text: "Welcome to the Prompt Lab! I am Professor Pixel, your AI coaching companion." },
    { expr: 'encouraging', text: "Read the challenge on the smartboard, then write your prompt in the box below." },
    { expr: 'neutral',     text: "The more specific and contextual your prompt, the more useful the AI will be. Let us get started!" },
  ],
  vague: [
    { expr: 'thinking',  text: "Hmm. The AI did its best, but that prompt could have been written by anyone, for anyone." },
    { expr: 'skeptical', text: "Try telling it who your students actually are and what you specifically need from them." },
  ],
  decent: [
    { expr: 'encouraging', text: "Getting warmer! You gave the AI something real to work with." },
    { expr: 'neutral',     text: "Now push a little further — what constraints or context would make this even more useful in your actual classroom?" },
  ],
  strong: [
    { expr: 'excited', text: "Now that is what I am talking about!" },
    { expr: 'proud',   text: "Did you notice how much more specific and useful that response was? That is what happens when you treat AI like a capable colleague." },
  ],
  scenarioComplete: [
    { expr: 'encouraging', text: "Nice work finishing that one. Each scenario builds on the last." },
    { expr: 'neutral',     text: "Your prompting instincts are already getting sharper." },
  ],
  allComplete: [
    { expr: 'excited',     text: "You made it through all eight scenarios!" },
    { expr: 'proud',       text: "Head into the Reflection Room when you are ready — I would love to know what surprised you." },
  ],
  scenarioStart_0: [
    { expr: 'neutral',     text: "A faculty member brought me this discussion prompt. Nothing is technically wrong with it." },
    { expr: 'thinking',    text: "Students are posting. Students are replying. The assignment is being completed." },
    { expr: 'encouraging', text: "But the conversation dies after a single exchange. Let's figure out why." },
  ],
  scenarioStart_1: [
    { expr: 'thinking',    text: "This scenario is about metacognition — helping online learners become more aware of how they are actually learning." },
    { expr: 'encouraging', text: "Think about what self-regulation looks like in an async course and what a realistic, low-barrier activity could be." },
  ],
  scenarioStart_2: [
    { expr: 'neutral',     text: "Your third scenario is about authentic assessment in online higher education." },
    { expr: 'excited',     text: "Think real professional practice, student agency, and meaningful feedback. This one is really satisfying to get right." },
  ],
  scenarioStart_3: [
    { expr: 'thinking',    text: "This challenge is a little different from the others. I want you to stay alert." },
    { expr: 'skeptical',   text: "AI can sound confident and authoritative while recommending things the field has already moved past. Read carefully." },
  ],
  scenarioStart_4: [
    { expr: 'thinking',    text: "Scenario 5 is about your mental model of how AI actually processes a request." },
    { expr: 'encouraging', text: "Before you see the response, you are going to predict what happened. That predictive instinct is the skill we are building." },
  ],
  scenarioStart_5: [
    { expr: 'skeptical',   text: "Scenario 6 is about something subtle — AI making assumptions about your teaching context that are not true." },
    { expr: 'neutral',     text: "Read the AI output carefully. Count what it assumes about how your students meet and collaborate. Then fix it." },
  ],
  scenarioStart_6: [
    { expr: 'thinking',    text: "This one is different from everything before it." },
    { expr: 'neutral',     text: "The AI did not hallucinate. It did not show bias. The output is genuinely good. Your job is to decide what that means for how you use it." },
  ],
  scenarioStart_7: [
    { expr: 'encouraging', text: "You have written prompts, spotted hallucinations, caught bias, and evaluated AI judgment. Now I want you to look at your own thinking." },
    { expr: 'thinking',    text: "Build your prompt using the fields below. After you see what the AI gives you, I will ask you three questions before you revise." },
  ],
}
