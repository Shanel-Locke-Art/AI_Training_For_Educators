/* ══════════════════════════════════════════════════════
   PromptCraft — dialogue.js
   Owns Professor Pixel dialogue sequences and Pixel audio IDs.

   Audio filename convention:
   - Put recordings in audio/pixel/
   - Use filenames p1.mp3, p2.mp3, p3.mp3, etc.
   - Each dialogue object has an id that matches its audio file.
   - Example: { id: 'p1', expr: 'excited', text: '...' } loads audio/pixel/p1.mp3

   Generated/updated by V74 so recording labels and game playback stay aligned.
   ══════════════════════════════════════════════════════ */

window.pixelDialogue = {
  "welcome": [
    {
      "expr": "excited",
      "text": "Welcome to the Prompt Lab! I am Professor Pixel, your AI coaching companion.",
      "id": "p1"
    },
    {
      "expr": "encouraging",
      "text": "Read the challenge on the smartboard, then write your prompt in the box below.",
      "id": "p2"
    },
    {
      "expr": "neutral",
      "text": "The more specific and contextual your prompt, the more useful the AI will be. Let us get started!",
      "id": "p3"
    }
  ],
  "vague": [
    {
      "expr": "thinking",
      "text": "Hmm. The AI did its best, but that prompt could have been written by anyone, for anyone.",
      "id": "p4"
    },
    {
      "expr": "skeptical",
      "text": "Try telling it who your students actually are and what you specifically need from them.",
      "id": "p5"
    }
  ],
  "decent": [
    {
      "expr": "encouraging",
      "text": "Getting warmer! You gave the AI something real to work with.",
      "id": "p6"
    },
    {
      "expr": "neutral",
      "text": "Now push a little further — what constraints or context would make this even more useful in your actual classroom?",
      "id": "p7"
    }
  ],
  "strong": [
    {
      "expr": "excited",
      "text": "Now that is what I am talking about!",
      "id": "p8"
    },
    {
      "expr": "proud",
      "text": "Did you notice how much more specific and useful that response was? That is what happens when you treat AI like a capable colleague.",
      "id": "p9"
    }
  ],
  "scenarioComplete": [
    {
      "expr": "encouraging",
      "text": "Nice work finishing that one. Each scenario builds on the last.",
      "id": "p10"
    },
    {
      "expr": "neutral",
      "text": "Your prompting instincts are already getting sharper.",
      "id": "p11"
    }
  ],
  "allComplete": [
    {
      "expr": "excited",
      "text": "You made it through all eight scenarios!",
      "id": "p12"
    },
    {
      "expr": "proud",
      "text": "Head into the Reflection Room when you are ready — I would love to know what surprised you.",
      "id": "p13"
    }
  ],
  "scenarioStart_engagement": [
    {
      "expr": "neutral",
      "text": "A faculty member brought me this discussion prompt. Nothing is technically wrong with it.",
      "id": "p14"
    },
    {
      "expr": "thinking",
      "text": "Students are posting. Students are replying. The assignment is being completed.",
      "id": "p15"
    },
    {
      "expr": "encouraging",
      "text": "But the conversation dies after a single exchange. Let's figure out why.",
      "id": "p16"
    }
  ],
  "scenarioStart_metacognition": [
    {
      "expr": "thinking",
      "text": "This scenario is about metacognition — helping online learners become more aware of how they are actually learning.",
      "id": "p17"
    },
    {
      "expr": "encouraging",
      "text": "Think about what self-regulation looks like in an async course and what a realistic, low-barrier activity could be.",
      "id": "p18"
    }
  ],
  "scenarioStart_assessment": [
    {
      "expr": "neutral",
      "text": "Your third scenario is about authentic assessment in online higher education.",
      "id": "p19"
    },
    {
      "expr": "excited",
      "text": "Think real professional practice, student agency, and meaningful feedback. This one is really satisfying to get right.",
      "id": "p20"
    }
  ],
  "scenarioStart_hallucination": [
    {
      "expr": "thinking",
      "text": "This challenge is a little different from the others. I want you to stay alert.",
      "id": "p21"
    },
    {
      "expr": "skeptical",
      "text": "AI can sound confident and authoritative while recommending things the field has already moved past. Read carefully.",
      "id": "p22"
    }
  ],
  "scenarioStart_prediction": [
    {
      "expr": "thinking",
      "text": "This scenario is about your mental model of how AI actually processes a request.",
      "id": "p23"
    },
    {
      "expr": "encouraging",
      "text": "Before you see the response, you are going to predict what happened. That predictive instinct is the skill we are building.",
      "id": "p24"
    }
  ],
  "scenarioStart_sync-bias": [
    {
      "expr": "skeptical",
      "text": "This scenario is about something subtle — AI making assumptions about your teaching context that are not true.",
      "id": "p25"
    },
    {
      "expr": "neutral",
      "text": "Read the AI output carefully. Count what it assumes about how your students meet and collaborate. Then fix it.",
      "id": "p26"
    }
  ],
  "scenarioStart_overreliance": [
    {
      "expr": "thinking",
      "text": "This one is different from everything before it.",
      "id": "p27"
    },
    {
      "expr": "neutral",
      "text": "The AI did not hallucinate. It did not show bias. The output is genuinely good. Your job is to decide what that means for how you use it.",
      "id": "p28"
    }
  ],
  "scenarioStart_reflect-revise": [
    {
      "expr": "encouraging",
      "text": "You have written prompts, spotted hallucinations, caught bias, and evaluated AI judgment. Now I want you to look at your own thinking.",
      "id": "p29"
    },
    {
      "expr": "thinking",
      "text": "Build your prompt using the fields below. After you see what the AI gives you, I will ask you three questions before you revise.",
      "id": "p30"
    }
  ],
  "scoreReflection_0_1": [
    {
      "expr": "skeptical",
      "text": "Claude had to make a lot of assumptions there.",
      "id": "p31"
    },
    {
      "expr": "thinking",
      "text": "Give it clearer learner context, the specific discussion failure, and what a stronger reply should actually do.",
      "id": "p32"
    }
  ],
  "scoreReflection_2": [
    {
      "expr": "encouraging",
      "text": "You are starting to give Claude useful context.",
      "id": "p33"
    },
    {
      "expr": "thinking",
      "text": "Now tighten the connection to the original problem: shallow replies and conversations that stop after one exchange.",
      "id": "p34"
    }
  ],
  "scoreReflection_3": [
    {
      "expr": "encouraging",
      "text": "Much better. Claude is responding to the teaching problem instead of guessing at a generic discussion activity.",
      "id": "p35"
    },
    {
      "expr": "neutral",
      "text": "The next improvement is to make the interaction move and success criteria more explicit.",
      "id": "p36"
    }
  ],
  "scoreReflection_4": [
    {
      "expr": "proud",
      "text": "Nice work. The prompt gives Claude enough context to address the dead-discussion problem directly.",
      "id": "p37"
    },
    {
      "expr": "encouraging",
      "text": "Notice how the response changes when the prompt includes learners, constraints, and a clear interaction strategy.",
      "id": "p38"
    }
  ],
  "scoreReflection_5": [
    {
      "expr": "excited",
      "text": "Claude spotted the core issue. Students were complying with the requirements, but the prompt was not creating meaningful interaction.",
      "id": "p39"
    },
    {
      "expr": "proud",
      "text": "To improve discussion quality, we need prompts that ask learners to extend, challenge, compare, or build on one another's ideas. That is exactly what your repair helped Claude design.",
      "id": "p40"
    }
  ],
  "s2_scoreReflection_0_2": [
    {
      "expr": "skeptical",
      "text": "Claude had to guess what metacognitive behavior you wanted students to practice.",
      "id": "p41"
    },
    {
      "expr": "thinking",
      "text": "For a stronger activity, name the student struggle and the learning strategy you want them to notice or transfer.",
      "id": "p42"
    }
  ],
  "s2_scoreReflection_3": [
    {
      "expr": "encouraging",
      "text": "This is moving in the right direction. You gave Claude a real learning problem, not just make a reflection.",
      "id": "p43"
    },
    {
      "expr": "thinking",
      "text": "Push it one step further by naming what students should do differently after the reflection.",
      "id": "p44"
    }
  ],
  "s2_scoreReflection_4_5": [
    {
      "expr": "proud",
      "text": "Notice what changed: Claude could design for metacognition because you described the learners, the struggle, and the desired behavior.",
      "id": "p45"
    },
    {
      "expr": "encouraging",
      "text": "That is the useful pattern: identify the thinking you want students to practice before asking AI to create the activity.",
      "id": "p46"
    }
  ]
};

window.predictionReactions = {
  "targeted": "That prediction makes sense. You gave Claude learner context, the actual discussion failure, and a clear interaction move, so it should have enough to give a targeted repair.",
  "generic": "That could happen. Claude can still drift into polite template language if it treats the issue as make this better instead of fix this exact discussion breakdown.",
  "ignores_constraints": "Good caution. Constraints are where AI often gets mushy. Naming them before the output helps you check whether Claude actually respected them.",
  "not_sure": "That is a useful answer too. Predicting before you look helps you notice what Claude changes, misses, or invents instead of just accepting the shiny paragraph."
};

// Exact-text fallback map for Pixel lines that are still hard-coded in app.js.
// This lets p# files play even before every remaining hard-coded line is moved
// into window.pixelDialogue.
window.pixelAudioByText = {
  "Welcome to the Prompt Lab! I am Professor Pixel, your AI coaching companion.": "p1",
  "Read the challenge on the smartboard, then write your prompt in the box below.": "p2",
  "The more specific and contextual your prompt, the more useful the AI will be. Let us get started!": "p3",
  "Hmm. The AI did its best, but that prompt could have been written by anyone, for anyone.": "p4",
  "Try telling it who your students actually are and what you specifically need from them.": "p5",
  "Getting warmer! You gave the AI something real to work with.": "p6",
  "Now push a little further — what constraints or context would make this even more useful in your actual classroom?": "p7",
  "Now that is what I am talking about!": "p8",
  "Did you notice how much more specific and useful that response was? That is what happens when you treat AI like a capable colleague.": "p9",
  "Nice work finishing that one. Each scenario builds on the last.": "p10",
  "Your prompting instincts are already getting sharper.": "p11",
  "You made it through all eight scenarios!": "p12",
  "Head into the Reflection Room when you are ready — I would love to know what surprised you.": "p13",
  "A faculty member brought me this discussion prompt. Nothing is technically wrong with it.": "p14",
  "Students are posting. Students are replying. The assignment is being completed.": "p15",
  "But the conversation dies after a single exchange. Let's figure out why.": "p16",
  "This scenario is about metacognition — helping online learners become more aware of how they are actually learning.": "p17",
  "Think about what self-regulation looks like in an async course and what a realistic, low-barrier activity could be.": "p18",
  "Your third scenario is about authentic assessment in online higher education.": "p19",
  "Think real professional practice, student agency, and meaningful feedback. This one is really satisfying to get right.": "p20",
  "This challenge is a little different from the others. I want you to stay alert.": "p21",
  "AI can sound confident and authoritative while recommending things the field has already moved past. Read carefully.": "p22",
  "This scenario is about your mental model of how AI actually processes a request.": "p23",
  "Before you see the response, you are going to predict what happened. That predictive instinct is the skill we are building.": "p24",
  "This scenario is about something subtle — AI making assumptions about your teaching context that are not true.": "p25",
  "Read the AI output carefully. Count what it assumes about how your students meet and collaborate. Then fix it.": "p26",
  "This one is different from everything before it.": "p27",
  "The AI did not hallucinate. It did not show bias. The output is genuinely good. Your job is to decide what that means for how you use it.": "p28",
  "You have written prompts, spotted hallucinations, caught bias, and evaluated AI judgment. Now I want you to look at your own thinking.": "p29",
  "Build your prompt using the fields below. After you see what the AI gives you, I will ask you three questions before you revise.": "p30",
  "Claude had to make a lot of assumptions there.": "p31",
  "Give it clearer learner context, the specific discussion failure, and what a stronger reply should actually do.": "p32",
  "You are starting to give Claude useful context.": "p33",
  "Now tighten the connection to the original problem: shallow replies and conversations that stop after one exchange.": "p34",
  "Much better. Claude is responding to the teaching problem instead of guessing at a generic discussion activity.": "p35",
  "The next improvement is to make the interaction move and success criteria more explicit.": "p36",
  "Nice work. The prompt gives Claude enough context to address the dead-discussion problem directly.": "p37",
  "Notice how the response changes when the prompt includes learners, constraints, and a clear interaction strategy.": "p38",
  "Claude spotted the core issue. Students were complying with the requirements, but the prompt was not creating meaningful interaction.": "p39",
  "To improve discussion quality, we need prompts that ask learners to extend, challenge, compare, or build on one another's ideas. That is exactly what your repair helped Claude design.": "p40",
  "Claude had to guess what metacognitive behavior you wanted students to practice.": "p41",
  "For a stronger activity, name the student struggle and the learning strategy you want them to notice or transfer.": "p42",
  "This is moving in the right direction. You gave Claude a real learning problem, not just make a reflection.": "p43",
  "Push it one step further by naming what students should do differently after the reflection.": "p44",
  "Notice what changed: Claude could design for metacognition because you described the learners, the struggle, and the desired behavior.": "p45",
  "That is the useful pattern: identify the thinking you want students to practice before asking AI to create the activity.": "p46",
  "That prediction makes sense. You gave Claude learner context, the actual discussion failure, and a clear interaction move, so it should have enough to give a targeted repair.": "p47",
  "That could happen. Claude can still drift into polite template language if it treats the issue as make this better instead of fix this exact discussion breakdown.": "p48",
  "Good caution. Constraints are where AI often gets mushy. Naming them before the output helps you check whether Claude actually respected them.": "p49",
  "That is a useful answer too. Predicting before you look helps you notice what Claude changes, misses, or invents instead of just accepting the shiny paragraph.": "p50",
  "Welcome to the Prompt Lab, [player name]! I am Professor Pixel, your AI coaching companion.": "p51",
  "Professor Pixel is thinking.": "p52",
  "Professor Pixel has thoughts — tap to hear them.": "p53",
  "Hmm, I lost my train of thought — take a look at the Prompt Analysis panel and try another attempt.": "p54",
  "Scenario 4 is now unlocked. Watch out — this AI has some assumptions baked in.": "p55",
  "Scenario 7 is now unlocked. This one is the hardest — not because the AI got something wrong, but because it got it right.": "p56",
  "Scenario 8 is now unlocked. This one is about understanding your own thinking — not just writing a better prompt.": "p57",
  "Let's ask Claude what it notices.": "p58",
  "Claude is analyzing the teaching problem now.": "p59",
  "Before we consult Claude...": "p60",
  "Based on the context you gave, what do you predict Claude will do?": "p61",
  "Your prediction is logged.": "p62",
  "Now we have something useful. Claude found that the original prompt was not broken because students ignored it. It was broken because students were doing exactly what it asked.": "p63",
  "That is the design problem: compliance is not the same thing as interaction. A reply requirement can create activity without creating a reason to continue the conversation.": "p64",
  "Your revision gives students a clearer interaction move, a purpose for replying, and criteria for what a stronger response should include. That is a real repair, not just prettier wording.": "p65",
  "Your revision is moving in the right direction. Before moving on, strengthen the prompt so students know how to extend, challenge, compare, or build on a peer's idea.": "p66",
  "Before we test this, connect your prompt back to the dead discussion board. Add: [missing items].": "p67",
  "Wait. Before you use any of that — did something seem off to you? Read it again carefully. I want you to think critically about what the AI just told you.": "p68",
  "Before I explain — did you notice anything that seemed questionable in that response?": "p69",
  "This is the most important thing I can teach you about working with AI. Being a great AI prompter is not just about asking better questions — it is about knowing when to question the answers.": "p70",
  "You got it — and that instinct is exactly what we are building. Now let's see the actual response.": "p71",
  "Not quite — but that is what this exercise is for. Watch what actually came back.": "p72",
  "Now you try. Write a better prompt for the same goal — designing a quiz for an online biology class. Show the AI who the learners are, what kind of quiz you need, and any constraints.": "p73",
  "This plan looks polished — but would it actually work in your district? Count how many things it assumes you have that you might not. Then rewrite the prompt to get something that actually fits your context.": "p74",
  "Take a moment to read through this. It looks good — maybe very good. But good-looking AI output is exactly where overreliance happens. For each section below, tell me: is it safe to use, does it need your judgment, or must it be original?": "p75",
  "[correct] out of [total] — you have strong AI judgment. You are thinking like an expert user, not a passive consumer.": "p76",
  "[correct] out of [total]. The ones you got right show real critical thinking. The ones you missed are worth reflecting on — they are where overreliance usually happens.": "p77",
  "This one is genuinely hard. The goal is not to avoid using AI — it is to know exactly where your judgment is irreplaceable. That awareness is the skill.": "p78",
  "Professor Pixel — Before you revise.": "p79",
  "Why did you write your prompt that way?": "p80",
  "What worked in the AI response?": "p81",
  "What fell short or surprised you?": "p82",
  "Welcome to the Prompt Lab! I am Professor Pixel. This is the dev test sequence.": "p83",
  "This is the excited expression. Strong prompts and major moments.": "p84",
  "Hmm. Skeptical expression — vague prompts and critical moments.": "p85"
};

window.pixelAudioLabels = {
  "p1": {
    "source": "welcome",
    "expression": "excited",
    "text": "Welcome to the Prompt Lab! I am Professor Pixel, your AI coaching companion.",
    "notes": ""
  },
  "p2": {
    "source": "welcome",
    "expression": "encouraging",
    "text": "Read the challenge on the smartboard, then write your prompt in the box below.",
    "notes": ""
  },
  "p3": {
    "source": "welcome",
    "expression": "neutral",
    "text": "The more specific and contextual your prompt, the more useful the AI will be. Let us get started!",
    "notes": ""
  },
  "p4": {
    "source": "vague",
    "expression": "thinking",
    "text": "Hmm. The AI did its best, but that prompt could have been written by anyone, for anyone.",
    "notes": ""
  },
  "p5": {
    "source": "vague",
    "expression": "skeptical",
    "text": "Try telling it who your students actually are and what you specifically need from them.",
    "notes": ""
  },
  "p6": {
    "source": "decent",
    "expression": "encouraging",
    "text": "Getting warmer! You gave the AI something real to work with.",
    "notes": ""
  },
  "p7": {
    "source": "decent",
    "expression": "neutral",
    "text": "Now push a little further — what constraints or context would make this even more useful in your actual classroom?",
    "notes": ""
  },
  "p8": {
    "source": "strong",
    "expression": "excited",
    "text": "Now that is what I am talking about!",
    "notes": ""
  },
  "p9": {
    "source": "strong",
    "expression": "proud",
    "text": "Did you notice how much more specific and useful that response was? That is what happens when you treat AI like a capable colleague.",
    "notes": ""
  },
  "p10": {
    "source": "scenarioComplete",
    "expression": "encouraging",
    "text": "Nice work finishing that one. Each scenario builds on the last.",
    "notes": ""
  },
  "p11": {
    "source": "scenarioComplete",
    "expression": "neutral",
    "text": "Your prompting instincts are already getting sharper.",
    "notes": ""
  },
  "p12": {
    "source": "allComplete",
    "expression": "excited",
    "text": "You made it through all eight scenarios!",
    "notes": ""
  },
  "p13": {
    "source": "allComplete",
    "expression": "proud",
    "text": "Head into the Reflection Room when you are ready — I would love to know what surprised you.",
    "notes": ""
  },
  "p14": {
    "source": "scenarioStart_engagement",
    "expression": "neutral",
    "text": "A faculty member brought me this discussion prompt. Nothing is technically wrong with it.",
    "notes": ""
  },
  "p15": {
    "source": "scenarioStart_engagement",
    "expression": "thinking",
    "text": "Students are posting. Students are replying. The assignment is being completed.",
    "notes": ""
  },
  "p16": {
    "source": "scenarioStart_engagement",
    "expression": "encouraging",
    "text": "But the conversation dies after a single exchange. Let's figure out why.",
    "notes": ""
  },
  "p17": {
    "source": "scenarioStart_metacognition",
    "expression": "thinking",
    "text": "This scenario is about metacognition — helping online learners become more aware of how they are actually learning.",
    "notes": ""
  },
  "p18": {
    "source": "scenarioStart_metacognition",
    "expression": "encouraging",
    "text": "Think about what self-regulation looks like in an async course and what a realistic, low-barrier activity could be.",
    "notes": ""
  },
  "p19": {
    "source": "scenarioStart_assessment",
    "expression": "neutral",
    "text": "Your third scenario is about authentic assessment in online higher education.",
    "notes": ""
  },
  "p20": {
    "source": "scenarioStart_assessment",
    "expression": "excited",
    "text": "Think real professional practice, student agency, and meaningful feedback. This one is really satisfying to get right.",
    "notes": ""
  },
  "p21": {
    "source": "scenarioStart_hallucination",
    "expression": "thinking",
    "text": "This challenge is a little different from the others. I want you to stay alert.",
    "notes": ""
  },
  "p22": {
    "source": "scenarioStart_hallucination",
    "expression": "skeptical",
    "text": "AI can sound confident and authoritative while recommending things the field has already moved past. Read carefully.",
    "notes": ""
  },
  "p23": {
    "source": "scenarioStart_prediction",
    "expression": "thinking",
    "text": "This scenario is about your mental model of how AI actually processes a request.",
    "notes": ""
  },
  "p24": {
    "source": "scenarioStart_prediction",
    "expression": "encouraging",
    "text": "Before you see the response, you are going to predict what happened. That predictive instinct is the skill we are building.",
    "notes": ""
  },
  "p25": {
    "source": "scenarioStart_sync-bias",
    "expression": "skeptical",
    "text": "This scenario is about something subtle — AI making assumptions about your teaching context that are not true.",
    "notes": ""
  },
  "p26": {
    "source": "scenarioStart_sync-bias",
    "expression": "neutral",
    "text": "Read the AI output carefully. Count what it assumes about how your students meet and collaborate. Then fix it.",
    "notes": ""
  },
  "p27": {
    "source": "scenarioStart_overreliance",
    "expression": "thinking",
    "text": "This one is different from everything before it.",
    "notes": ""
  },
  "p28": {
    "source": "scenarioStart_overreliance",
    "expression": "neutral",
    "text": "The AI did not hallucinate. It did not show bias. The output is genuinely good. Your job is to decide what that means for how you use it.",
    "notes": ""
  },
  "p29": {
    "source": "scenarioStart_reflect-revise",
    "expression": "encouraging",
    "text": "You have written prompts, spotted hallucinations, caught bias, and evaluated AI judgment. Now I want you to look at your own thinking.",
    "notes": ""
  },
  "p30": {
    "source": "scenarioStart_reflect-revise",
    "expression": "thinking",
    "text": "Build your prompt using the fields below. After you see what the AI gives you, I will ask you three questions before you revise.",
    "notes": ""
  },
  "p31": {
    "source": "scoreReflection_0_1",
    "expression": "skeptical",
    "text": "Claude had to make a lot of assumptions there.",
    "notes": ""
  },
  "p32": {
    "source": "scoreReflection_0_1",
    "expression": "thinking",
    "text": "Give it clearer learner context, the specific discussion failure, and what a stronger reply should actually do.",
    "notes": ""
  },
  "p33": {
    "source": "scoreReflection_2",
    "expression": "encouraging",
    "text": "You are starting to give Claude useful context.",
    "notes": ""
  },
  "p34": {
    "source": "scoreReflection_2",
    "expression": "thinking",
    "text": "Now tighten the connection to the original problem: shallow replies and conversations that stop after one exchange.",
    "notes": ""
  },
  "p35": {
    "source": "scoreReflection_3",
    "expression": "encouraging",
    "text": "Much better. Claude is responding to the teaching problem instead of guessing at a generic discussion activity.",
    "notes": ""
  },
  "p36": {
    "source": "scoreReflection_3",
    "expression": "neutral",
    "text": "The next improvement is to make the interaction move and success criteria more explicit.",
    "notes": ""
  },
  "p37": {
    "source": "scoreReflection_4",
    "expression": "proud",
    "text": "Nice work. The prompt gives Claude enough context to address the dead-discussion problem directly.",
    "notes": ""
  },
  "p38": {
    "source": "scoreReflection_4",
    "expression": "encouraging",
    "text": "Notice how the response changes when the prompt includes learners, constraints, and a clear interaction strategy.",
    "notes": ""
  },
  "p39": {
    "source": "scoreReflection_5",
    "expression": "excited",
    "text": "Claude spotted the core issue. Students were complying with the requirements, but the prompt was not creating meaningful interaction.",
    "notes": ""
  },
  "p40": {
    "source": "scoreReflection_5",
    "expression": "proud",
    "text": "To improve discussion quality, we need prompts that ask learners to extend, challenge, compare, or build on one another's ideas. That is exactly what your repair helped Claude design.",
    "notes": ""
  },
  "p41": {
    "source": "s2_scoreReflection_0_2",
    "expression": "skeptical",
    "text": "Claude had to guess what metacognitive behavior you wanted students to practice.",
    "notes": ""
  },
  "p42": {
    "source": "s2_scoreReflection_0_2",
    "expression": "thinking",
    "text": "For a stronger activity, name the student struggle and the learning strategy you want them to notice or transfer.",
    "notes": ""
  },
  "p43": {
    "source": "s2_scoreReflection_3",
    "expression": "encouraging",
    "text": "This is moving in the right direction. You gave Claude a real learning problem, not just make a reflection.",
    "notes": ""
  },
  "p44": {
    "source": "s2_scoreReflection_3",
    "expression": "thinking",
    "text": "Push it one step further by naming what students should do differently after the reflection.",
    "notes": ""
  },
  "p45": {
    "source": "s2_scoreReflection_4_5",
    "expression": "proud",
    "text": "Notice what changed: Claude could design for metacognition because you described the learners, the struggle, and the desired behavior.",
    "notes": ""
  },
  "p46": {
    "source": "s2_scoreReflection_4_5",
    "expression": "encouraging",
    "text": "That is the useful pattern: identify the thinking you want students to practice before asking AI to create the activity.",
    "notes": ""
  },
  "p47": {
    "source": "predictionReaction_targeted",
    "expression": "",
    "text": "That prediction makes sense. You gave Claude learner context, the actual discussion failure, and a clear interaction move, so it should have enough to give a targeted repair.",
    "notes": "Displayed after learner chooses a prediction."
  },
  "p48": {
    "source": "predictionReaction_generic",
    "expression": "",
    "text": "That could happen. Claude can still drift into polite template language if it treats the issue as make this better instead of fix this exact discussion breakdown.",
    "notes": "Displayed after learner chooses a prediction."
  },
  "p49": {
    "source": "predictionReaction_ignores_constraints",
    "expression": "",
    "text": "Good caution. Constraints are where AI often gets mushy. Naming them before the output helps you check whether Claude actually respected them.",
    "notes": "Displayed after learner chooses a prediction."
  },
  "p50": {
    "source": "predictionReaction_not_sure",
    "expression": "",
    "text": "That is a useful answer too. Predicting before you look helps you notice what Claude changes, misses, or invents instead of just accepting the shiny paragraph.",
    "notes": "Displayed after learner chooses a prediction."
  },
  "p51": {
    "source": "name_modal_dynamic_welcome",
    "expression": "excited",
    "text": "Welcome to the Prompt Lab, [player name]! I am Professor Pixel, your AI coaching companion.",
    "notes": "Dynamic variant if the learner enters a name. Consider recording the generic welcome only, unless you remove name personalization."
  },
  "p52": {
    "source": "pixel_status",
    "expression": "thinking",
    "text": "Professor Pixel is thinking.",
    "notes": "Status text. Optional for voiceover."
  },
  "p53": {
    "source": "pixel_reveal_button",
    "expression": "",
    "text": "Professor Pixel has thoughts — tap to hear them.",
    "notes": "Button text. Optional for voiceover."
  },
  "p54": {
    "source": "pixel_dynamic_feedback_fallback",
    "expression": "thinking",
    "text": "Hmm, I lost my train of thought — take a look at the Prompt Analysis panel and try another attempt.",
    "notes": "Fallback if dynamic Pixel feedback fails."
  },
  "p55": {
    "source": "scenario_unlock_s4",
    "expression": "thinking",
    "text": "Scenario 4 is now unlocked. Watch out — this AI has some assumptions baked in.",
    "notes": "Floating Pixel coach card."
  },
  "p56": {
    "source": "scenario_unlock_s7",
    "expression": "",
    "text": "Scenario 7 is now unlocked. This one is the hardest — not because the AI got something wrong, but because it got it right.",
    "notes": "Floating Pixel coach card."
  },
  "p57": {
    "source": "scenario_unlock_s8",
    "expression": "",
    "text": "Scenario 8 is now unlocked. This one is about understanding your own thinking — not just writing a better prompt.",
    "notes": "Floating Pixel coach card."
  },
  "p58": {
    "source": "claude_analyzing_bridge_1",
    "expression": "",
    "text": "Let's ask Claude what it notices.",
    "notes": "VN dialogue during Claude analysis."
  },
  "p59": {
    "source": "claude_analyzing_bridge_2",
    "expression": "",
    "text": "Claude is analyzing the teaching problem now.",
    "notes": "VN dialogue during Claude analysis."
  },
  "p60": {
    "source": "prediction_gate_intro_1",
    "expression": "thinking",
    "text": "Before we consult Claude...",
    "notes": "VN prediction screen."
  },
  "p61": {
    "source": "prediction_gate_intro_2",
    "expression": "thinking",
    "text": "Based on the context you gave, what do you predict Claude will do?",
    "notes": "VN prediction screen."
  },
  "p62": {
    "source": "prediction_logged",
    "expression": "",
    "text": "Your prediction is logged.",
    "notes": "Shown after learner chooses a prediction."
  },
  "p63": {
    "source": "s1_post_analysis_1",
    "expression": "encouraging",
    "text": "Now we have something useful. Claude found that the original prompt was not broken because students ignored it. It was broken because students were doing exactly what it asked.",
    "notes": "S1 post-Claude Pixel reflection."
  },
  "p64": {
    "source": "s1_post_analysis_2",
    "expression": "thinking",
    "text": "That is the design problem: compliance is not the same thing as interaction. A reply requirement can create activity without creating a reason to continue the conversation.",
    "notes": "S1 post-Claude Pixel reflection."
  },
  "p65": {
    "source": "s1_post_analysis_success",
    "expression": "proud",
    "text": "Your revision gives students a clearer interaction move, a purpose for replying, and criteria for what a stronger response should include. That is a real repair, not just prettier wording.",
    "notes": "Conditional S1 line if score meets threshold."
  },
  "p66": {
    "source": "s1_post_analysis_retry",
    "expression": "encouraging",
    "text": "Your revision is moving in the right direction. Before moving on, strengthen the prompt so students know how to extend, challenge, compare, or build on a peer's idea.",
    "notes": "Conditional S1 line if score is below threshold."
  },
  "p67": {
    "source": "s1_builder_nudge",
    "expression": "",
    "text": "Before we test this, connect your prompt back to the dead discussion board. Add: [missing items].",
    "notes": "Dynamic nudge. The missing items are inserted by the app."
  },
  "p68": {
    "source": "s4_interrupt",
    "expression": "skeptical",
    "text": "Wait. Before you use any of that — did something seem off to you? Read it again carefully. I want you to think critically about what the AI just told you.",
    "notes": "Scenario 4/critical thinking interrupt."
  },
  "p69": {
    "source": "s4_self_report_question",
    "expression": "thinking",
    "text": "Before I explain — did you notice anything that seemed questionable in that response?",
    "notes": "Scenario 4 self-report prompt."
  },
  "p70": {
    "source": "s4_closing",
    "expression": "proud",
    "text": "This is the most important thing I can teach you about working with AI. Being a great AI prompter is not just about asking better questions — it is about knowing when to question the answers.",
    "notes": "Scenario 4 closing."
  },
  "p71": {
    "source": "s5_prediction_correct",
    "expression": "excited",
    "text": "You got it — and that instinct is exactly what we are building. Now let's see the actual response.",
    "notes": "Scenario 5 prediction result if correct."
  },
  "p72": {
    "source": "s5_prediction_incorrect",
    "expression": "encouraging",
    "text": "Not quite — but that is what this exercise is for. Watch what actually came back.",
    "notes": "Scenario 5 prediction result if incorrect."
  },
  "p73": {
    "source": "s5_try_again_prompt",
    "expression": "encouraging",
    "text": "Now you try. Write a better prompt for the same goal — designing a quiz for an online biology class. Show the AI who the learners are, what kind of quiz you need, and any constraints.",
    "notes": "Scenario 5 follow-up."
  },
  "p74": {
    "source": "s6_sync_bias_prompt",
    "expression": "skeptical",
    "text": "This plan looks polished — but would it actually work in your district? Count how many things it assumes you have that you might not. Then rewrite the prompt to get something that actually fits your context.",
    "notes": "Scenario 6 sync bias prompt."
  },
  "p75": {
    "source": "s7_overreliance_intro",
    "expression": "thinking",
    "text": "Take a moment to read through this. It looks good — maybe very good. But good-looking AI output is exactly where overreliance happens. For each section below, tell me: is it safe to use, does it need your judgment, or must it be original?",
    "notes": "Scenario 7 decision task."
  },
  "p76": {
    "source": "s7_closing_strong",
    "expression": "proud",
    "text": "[correct] out of [total] — you have strong AI judgment. You are thinking like an expert user, not a passive consumer.",
    "notes": "Dynamic score values inserted."
  },
  "p77": {
    "source": "s7_closing_mixed",
    "expression": "encouraging",
    "text": "[correct] out of [total]. The ones you got right show real critical thinking. The ones you missed are worth reflecting on — they are where overreliance usually happens.",
    "notes": "Dynamic score values inserted."
  },
  "p78": {
    "source": "s7_closing_low",
    "expression": "thinking",
    "text": "This one is genuinely hard. The goal is not to avoid using AI — it is to know exactly where your judgment is irreplaceable. That awareness is the skill.",
    "notes": "Scenario 7 low-score closing."
  },
  "p79": {
    "source": "s8_before_revise_title",
    "expression": "",
    "text": "Professor Pixel — Before you revise.",
    "notes": "UI heading. Optional for voiceover."
  },
  "p80": {
    "source": "s8_reflection_q1",
    "expression": "",
    "text": "Why did you write your prompt that way?",
    "notes": "Scenario 8 reflection question."
  },
  "p81": {
    "source": "s8_reflection_q2",
    "expression": "",
    "text": "What worked in the AI response?",
    "notes": "Scenario 8 reflection question."
  },
  "p82": {
    "source": "s8_reflection_q3",
    "expression": "",
    "text": "What fell short or surprised you?",
    "notes": "Scenario 8 reflection question."
  },
  "p83": {
    "source": "dev_test_welcome",
    "expression": "excited",
    "text": "Welcome to the Prompt Lab! I am Professor Pixel. This is the dev test sequence.",
    "notes": "Dev-only line. Do not record unless you want audio for the dev tools."
  },
  "p84": {
    "source": "dev_test_excited",
    "expression": "excited",
    "text": "This is the excited expression. Strong prompts and major moments.",
    "notes": "Dev-only line. Do not record unless you want audio for the dev tools."
  },
  "p85": {
    "source": "dev_test_skeptical",
    "expression": "skeptical",
    "text": "Hmm. Skeptical expression — vague prompts and critical moments.",
    "notes": "Dev-only line. Do not record unless you want audio for the dev tools."
  }
};
