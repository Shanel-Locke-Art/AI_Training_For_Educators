/* ══════════════════════════════════════════════════════
   PromptCraft — dialogue.js
   Owns Professor Pixel dialogue sequences only.

   Quick edit map:
   - welcome: opening sequence
   - scenarioStart_0 through scenarioStart_7: per-scenario VN intros
   - scoreReflection_*: Pixel coaching after prompt attempts

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

  // ── Score reflection lines (referenced by showPixelScoreReflection) ──

  scoreReflection_0_1: [
    { expr: 'skeptical', text: "Claude had to make a lot of assumptions there." },
    { expr: 'thinking', text: "Give it clearer learner context, the specific discussion failure, and what a stronger reply should actually do." },
  ],
  scoreReflection_2: [
    { expr: 'encouraging', text: "You are starting to give Claude useful context." },
    { expr: 'thinking', text: "Now tighten the connection to the original problem: shallow replies and conversations that stop after one exchange." },
  ],
  scoreReflection_3: [
    { expr: 'encouraging', text: "Much better. Claude is responding to the teaching problem instead of guessing at a generic discussion activity." },
    { expr: 'neutral', text: "The next improvement is to make the interaction move and success criteria more explicit." },
  ],
  scoreReflection_4: [
    { expr: 'proud', text: "Nice work. The prompt gives Claude enough context to address the dead-discussion problem directly." },
    { expr: 'encouraging', text: "Notice how the response changes when the prompt includes learners, constraints, and a clear interaction strategy." },
  ],
  scoreReflection_5: [
    { expr: 'excited', text: "Claude spotted the core issue. Students were complying with the requirements, but the prompt was not creating meaningful interaction." },
    { expr: 'proud', text: "To improve discussion quality, we need prompts that ask learners to extend, challenge, compare, or build on one another's ideas. That is exactly what your repair helped Claude design." },
  ],
  s2_scoreReflection_0_2: [
    { expr: 'skeptical', text: "Claude had to guess what metacognitive behavior you wanted students to practice." },
    { expr: 'thinking', text: "For a stronger activity, name the student struggle and the learning strategy you want them to notice or transfer." },
  ],
  s2_scoreReflection_3: [
    { expr: 'encouraging', text: "This is moving in the right direction. You gave Claude a real learning problem, not just make a reflection." },
    { expr: 'thinking', text: "Push it one step further by naming what students should do differently after the reflection." },
  ],
  s2_scoreReflection_4_5: [
    { expr: 'proud', text: "Notice what changed: Claude could design for metacognition because you described the learners, the struggle, and the desired behavior." },
    { expr: 'encouraging', text: "That is the useful pattern: identify the thinking you want students to practice before asking AI to create the activity." },
  ],
};

// ── Prediction gate reaction text ─────────────────────────────────────
window.predictionReactions = {
  targeted:            "That prediction makes sense. You gave Claude learner context, the actual discussion failure, and a clear interaction move, so it should have enough to give a targeted repair.",
  generic:             "That could happen. Claude can still drift into polite template language if it treats the issue as make this better instead of fix this exact discussion breakdown.",
  ignores_constraints: "Good caution. Constraints are where AI often gets mushy. Naming them before the output helps you check whether Claude actually respected them.",
  not_sure:            "That is a useful answer too. Predicting before you look helps you notice what Claude changes, misses, or invents instead of just accepting the shiny paragraph.",
};
