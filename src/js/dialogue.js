/* ══════════════════════════════════════════════════════
   PromptCraft — dialogue.js (v138 S2 opening vertical slice)
   Active runtime dialogue for shared systems, Scenario 1, and the Scenario 2 opening.
   Legacy Scenario 2–8 dialogue is preserved under docs/archive/legacy-scenarios-v133/.
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
      "speaker": "Professor Pixel",
      "character": "pixel",
      "expr": "neutral",
      "text": "Meet Jordan. He submits every assignment on time, earns passing grades, and appears to be keeping up with the course.",
      "id": "p86"
    },
    {
      "speaker": "Jordan",
      "character": "jordan",
      "expr": "neutral",
      "text": "I got an 84 on this assignment. That’s better than last time, so I guess something worked.",
      "id": "jordan-s2-01"
    },
    {
      "speaker": "Professor Pixel",
      "character": "pixel",
      "expr": "thinking",
      "text": "A better result sounds promising. But it does not necessarily mean Jordan understands what produced it.",
      "id": "p87"
    },
    {
      "speaker": "Jordan",
      "character": "jordan",
      "expr": "uncertain",
      "text": "I reread the chapter a few times. Some parts finally made more sense, but I couldn’t tell you what actually helped.",
      "id": "jordan-s2-02"
    },
    {
      "speaker": "Jordan",
      "character": "jordan",
      "expr": "frustrated",
      "text": "When the next assignment starts, I’ll probably reread everything again and hope it works. That is more or less my entire academic strategy.",
      "id": "jordan-s2-03"
    },
    {
      "speaker": "Professor Pixel",
      "character": "pixel",
      "expr": "skeptical",
      "text": "Jordan completed the work, so do not assume this is simply a motivation problem. Because his grade improved, the real problem is easy to overlook.",
      "id": "p88"
    },
    {
      "speaker": "Professor Pixel",
      "character": "pixel",
      "expr": "encouraging",
      "text": "Listen to the evidence Jordan gave you. Choose the two instructional needs most clearly supported by his comments.",
      "id": "p89"
    }
  ],
  "s2_diagnosis_correct": [
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "proud", "text": "Exactly. Jordan used a strategy, but he cannot name it clearly or judge whether it helped. Before he can improve the process, he needs to make that process visible.", "id": "p90" }
  ],
  "s2_diagnosis_transfer": [
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "encouraging", "text": "You found an important part of the problem. Transfer matters, but Jordan first needs to identify and evaluate what happened during this task. Otherwise, his next plan is still a guess.", "id": "p91" }
  ],
  "s2_diagnosis_motivation": [
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "skeptical", "text": "Jordan completed the assignment and is actively trying to understand the result. His uncertainty is not evidence that he lacks motivation.", "id": "p92" }
  ],
  "s2_diagnosis_grade": [
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "neutral", "text": "Jordan already knows the outcome. What he cannot explain is the learning process that produced it.", "id": "p93" }
  ],
  "s2_diagnosis_evidence": [
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "thinking", "text": "Those concerns might matter in another case, but Jordan did not give us evidence for them. Stay with what he actually said rather than filling in the rest of his story for him.", "id": "p94" }
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
  ]
};

window.predictionReactions = {
  "targeted": "That prediction makes sense. You gave Claude learner context, the actual discussion failure, and a clear interaction move, so it should have enough to give a targeted repair.",
  "generic": "That could happen. Claude can still drift into polite template language if it treats the issue as make this better instead of fix this exact discussion breakdown.",
  "ignores_constraints": "Good caution. Constraints are where AI often gets mushy. Naming them before the output helps you check whether Claude actually respected them.",
  "not_sure": "That is a useful answer too. Predicting before you look helps you notice what Claude changes, misses, or invents instead of just accepting the shiny paragraph."
};

// Exact-text fallback map for active S1/shared recordings.
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
  "That prediction makes sense. You gave Claude learner context, the actual discussion failure, and a clear interaction move, so it should have enough to give a targeted repair.": "p47",
  "That could happen. Claude can still drift into polite template language if it treats the issue as make this better instead of fix this exact discussion breakdown.": "p48",
  "Good caution. Constraints are where AI often gets mushy. Naming them before the output helps you check whether Claude actually respected them.": "p49",
  "That is a useful answer too. Predicting before you look helps you notice what Claude changes, misses, or invents instead of just accepting the shiny paragraph.": "p50",
  "Welcome to the Prompt Lab, [player name]! I am Professor Pixel, your AI coaching companion.": "p51",
  "Professor Pixel is thinking.": "p52",
  "Professor Pixel has thoughts — tap to hear them.": "p53",
  "Hmm, I lost my train of thought — take a look at the Prompt Analysis panel and try another attempt.": "p54",
  "Let's ask Claude what it notices.": "p58",
  "Claude is analyzing the teaching problem now.": "p59",
  "Before we consult Claude...": "p60",
  "Based on the context you gave, what do you predict Claude will do?": "p61",
  "Your prediction is logged.": "p62",
  "Now we have something useful. Claude found that the original prompt was not broken because students ignored it. It was broken because students were doing exactly what it asked.": "p63",
  "That is the design problem: compliance is not the same thing as interaction. A reply requirement can create activity without creating a reason to continue the conversation.": "p64",
  "Your revision gives students a clearer interaction move, a purpose for replying, and criteria for what a stronger response should include. That is a real repair, not just prettier wording.": "p65",
  "Your revision is moving in the right direction. Before moving on, strengthen the prompt so students know how to extend, challenge, compare, or build on a peer's idea.": "p66",
  "Before we test this, connect your prompt back to the dead discussion board. Add: [missing items].": "p67"
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
  }
};


// S2 draft recording metadata. These files are planned but are not loaded until
// completed recordings are placed at the listed paths.
window.s2VoiceoverDrafts = {
  p86: "assets/audio/voice/professor-pixel/scenario-02/p86.mp3",
  p87: "assets/audio/voice/professor-pixel/scenario-02/p87.mp3",
  p88: "assets/audio/voice/professor-pixel/scenario-02/p88.mp3",
  p89: "assets/audio/voice/professor-pixel/scenario-02/p89.mp3",
  p90: "assets/audio/voice/professor-pixel/scenario-02/p90.mp3",
  p91: "assets/audio/voice/professor-pixel/scenario-02/p91.mp3",
  p92: "assets/audio/voice/professor-pixel/scenario-02/p92.mp3",
  p93: "assets/audio/voice/professor-pixel/scenario-02/p93.mp3",
  p94: "assets/audio/voice/professor-pixel/scenario-02/p94.mp3",
  "jordan-s2-01": "assets/audio/voice/students/jordan/scenario-02/jordan-s2-01.mp3",
  "jordan-s2-02": "assets/audio/voice/students/jordan/scenario-02/jordan-s2-02.mp3",
  "jordan-s2-03": "assets/audio/voice/students/jordan/scenario-02/jordan-s2-03.mp3"
};
