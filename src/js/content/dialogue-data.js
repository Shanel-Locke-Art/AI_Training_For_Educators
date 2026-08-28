/* ══════════════════════════════════════════════════════
   PromptCraft active dialogue data
   Active runtime dialogue for shared systems and current Scenario 1–4 experiences.
   ══════════════════════════════════════════════════════ */

const PC_S1_CANVAS_DIALOGUE_CAST = Object.freeze([
  Object.freeze({ id: 'pixel', slot: 'right' }),
  Object.freeze({ id: 'eli', slot: 'left' })
]);

const PC_S1_PIXEL_ONLY_CAST = Object.freeze([
  Object.freeze({ id: 'pixel', slot: 'right' })
]);

window.pixelDialogue = {
  "welcome": [
    {
      "expr": "excited",
      "text": "Welcome to the Prompt Lab! I'm Professor Pixel. I'll guide you through each teaching challenge.",
      "id": "p1"
    },
    {
      "expr": "encouraging",
      "text": "You'll diagnose what is happening, make a decision, and test what changes.",
      "id": "p2"
    },
    {
      "expr": "neutral",
      "text": "Babbage can analyze the information you provide, but the final judgment stays with you.",
      "id": "p3"
    }
  ],
  "scenarioStart_content-avalanche": [
    {
      "speaker": "Professor Pixel",
      "character": "pixel",
      "expr": "neutral",
      "text": "Before we open Canvas, here is the situation. An instructor has taught this topic for years and built Week 4 gradually as the course evolved.",
      "id": "p-s1-ca-01"
    },
    {
      "speaker": "Professor Pixel",
      "character": "pixel",
      "expr": "thinking",
      "text": "Every addition had a reason: notes, a transcript, readings, models, examples, a quiz, and a written comparison. This course does not lack content, expertise, or instructor effort.",
      "id": "p-s1-ca-02"
    },
    {
      "speaker": "Professor Pixel",
      "character": "pixel",
      "expr": "thinking",
      "text": "But students kept asking where to begin, which version to use, and what the comparison required. We are not judging the instructor—we are tracing where expert knowledge never became visible course design.",
      "id": "p-s1-ca-03"
    }
  ],
  "s1_canvas_evidence_intro": [
    {
      "speaker": "Professor Pixel",
      "character": "pixel",
      "cast": PC_S1_CANVAS_DIALOGUE_CAST,
      "expr": "neutral",
      "text": "Now let us open the actual Week 4 module. Eli will help us examine the difference between having access to the content and having a visible path through it.",
      "id": "p-s1-ca-04"
    },
    {
      "speaker": "Eli",
      "character": "eli",
      "cast": PC_S1_CANVAS_DIALOGUE_CAST,
      "entrance": "slide-left",
      "expr": "uncertain",
      "text": "There's no shortage of material here. What's missing is the order of operations — what to do first, what the assignment actually needs, or where the real instructions are hiding.",
      "id": "e-s1-ca-05"
    },
    {
      "speaker": "Professor Pixel",
      "character": "pixel",
      "cast": PC_S1_CANVAS_DIALOGUE_CAST,
      "expr": "encouraging",
      "text": "Each case begins with a Before screen. Eli will describe the learner experience, and I will focus your inspection before you reveal the redesign.",
      "id": "p-s1-ca-06"
    },
    {
      "speaker": "Professor Pixel",
      "character": "pixel",
      "cast": PC_S1_CANVAS_DIALOGUE_CAST,
      "expr": "thinking",
      "text": "Look for what students must infer, remember, or hunt down. AI can help reorganize the content, but you decide whether the visible learning path actually works.",
      "id": "p-s1-ca-07"
    }
  ],
  "s1_case_module_briefing": [
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "thinking", "text": "Start with the module structure. Eli, where would you begin, and what tells you which materials prepare you for the assignment?", "id": "p-s1-case-01a" },
    { "speaker": "Eli", "character": "eli", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "uncertain", "text": "I can see the files, notes, examples, quiz, and comparison — all of it's here. But nothing shows me the sequence. It's a parts list with no assembly order.", "id": "e-s1-case-01b" },
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "encouraging", "text": "Your inspection: find every place the module makes Eli infer the starting point, priority, or next step. Then reveal the redesigned path.", "id": "p-s1-case-01c" }
  ],
  "s1_case_module_explanation": [
    { "speaker": "Eli", "character": "eli", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "thinking", "text": "So it's not a content problem. It's that I can't see the end state, or how any of these pieces connect into a sequence.", "id": "e-s1-case-01d" },
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "encouraging", "text": "Exactly. The priority is to make the learning path visible. Before we reveal the After view, let us hand that diagnosed problem to Babbage, review its first-pass sequence, and decide what the instructor should keep.", "id": "p-s1-case-01e" }
  ],
  "s1_case_module_ai_demo": [
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "thinking", "text": "Here is a useful AI task: inventory the existing items, group them by learner action, and propose a first-pass sequence without deleting anything.", "id": "p-s1-case-01ai-a" },
    { "speaker": "Eli", "character": "eli", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "thinking", "text": "The draft gets us a map fast. But the labels alone can't tell Babbage what I actually need to understand before I reach the assignment.", "id": "e-s1-case-01ai-b" },
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "encouraging", "text": "Exactly. AI supplies the inventory and draft organization. The instructor verifies the purpose, prerequisites, and teachable order.", "id": "p-s1-case-01ai-c" }
  ],
  "s1_case_module_reveal": [
    { "speaker": "Eli", "character": "eli", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "confident", "text": "Now there's a Start Here point and a route — Learn, Submit, Continue. I know where I'm headed before I open a single file.", "id": "e-s1-case-01f" },
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "encouraging", "text": "Notice that the course did not need to lose its substance. The redesign made the instructor’s intended sequence visible to the learner.", "id": "p-s1-case-01g" }
  ],
  "s1_case_student_path_briefing": [
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "thinking", "text": "Case file 2 of 4: the student view. A course can look organized to its instructor while giving students a very different experience.", "id": "p-s1-case-02a" },
    { "speaker": "Eli", "character": "eli", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "frustrated", "text": "I've got plenty to open. Nothing tells me what I'm actually trying to accomplish, what comes first, or when Week 4 is even done.", "id": "e-s1-case-02b" },
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "encouraging", "text": "Your inspection: identify what Eli must open, remember, or guess before he can follow the intended learning path.", "id": "p-s1-case-02c" }
  ],
  "s1_case_student_path_explanation": [
    { "speaker": "Eli", "character": "eli", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "thinking", "text": "The instructor might know the right order. Doesn't help me if that order only exists in someone else's head.", "id": "e-s1-case-02d" },
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "encouraging", "text": "Right. Before we reveal the After view, we will ask Babbage to audit only the student-visible signals, review what it flags, and decide what the instructor should change.", "id": "p-s1-case-02e" }
  ],
  "s1_case_student_path_ai_demo": [
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "thinking", "text": "For this case, Babbage audits only what is visible in the student view: destination, starting point, action labels, and a clear completion point.", "id": "p-s1-case-02ai-a" },
    { "speaker": "Eli", "character": "eli", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "thinking", "text": "It'll flag the missing signals every time, consistently. What it can't do is sit in the course like I do, or know which gap actually stops a student cold.", "id": "e-s1-case-02ai-b" },
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "encouraging", "text": "Use AI as a rapid inspection partner, then validate its findings with student-view testing and real learner feedback.", "id": "p-s1-case-02ai-c" }
  ],
  "s1_case_student_path_reveal": [
    { "speaker": "Eli", "character": "eli", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "confident", "text": "The action labels tell me what kind of work I'm doing now. And the order shows me exactly when Week 4 is actually done.", "id": "e-s1-case-02f" },
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "thinking", "text": "That is the student-view test: can the learner follow the intended path without extra explanation from the instructor?", "id": "p-s1-case-02g" }
  ],
  "s1_case_assignment_briefing": [
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "thinking", "text": "Case file 3 of 4: the assignment at the point of submission. Can Eli see what a successful comparison must include before he begins writing?", "id": "p-s1-case-03a" },
    { "speaker": "Eli", "character": "eli", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "uncertain", "text": "I know the readings and examples are supposed to be in play. But the actual requirements — what counts as evidence, what success looks like — that's buried somewhere else in the module.", "id": "e-s1-case-03b" },
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "encouraging", "text": "Your inspection: list the requirements missing from this page and notice how much reconstruction the learner must do before submitting.", "id": "p-s1-case-03c" }
  ],
  "s1_case_assignment_explanation": [
    { "speaker": "Eli", "character": "eli", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "thinking", "text": "If the requirements live somewhere else, I'm building this from memory while I'm trying to write it. That's backwards.", "id": "e-s1-case-03d" },
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "encouraging", "text": "That hunt is avoidable. Before the After view, we will ask Babbage to extract the scattered requirements, verify every item against the source, and decide what belongs at the point of need.", "id": "p-s1-case-03e" }
  ],
  "s1_case_assignment_ai_demo": [
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "thinking", "text": "We can give Babbage the assignment page and related module directions with a narrow instruction: extract the requirements, cite where each one appears, and do not invent missing criteria.", "id": "p-s1-case-03ai-a" },
    { "speaker": "Eli", "character": "eli", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "thinking", "text": "That turns scattered directions into a checklist I can work off of, instead of reconstructing it from memory every time.", "id": "e-s1-case-03ai-b" },
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "encouraging", "text": "The instructor must compare every extracted requirement to the source and decide what counts as successful evidence before publishing the revision.", "id": "p-s1-case-03ai-c" }
  ],
  "s1_case_assignment_reveal": [
    { "speaker": "Eli", "character": "eli", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "confident", "text": "Now the four required parts, the length, the due date, and what success looks like — it's all right there next to the submission.", "id": "e-s1-case-03f" },
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "encouraging", "text": "The After view reduces reconstruction. Students can spend their effort on the comparison instead of searching for the assignment.", "id": "p-s1-case-03g" }
  ],
  "s1_case_expectations_briefing": [
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "thinking", "text": "Case file 4 of 4: expectations at the point of need. The directions exist, but how quickly can Eli find the purpose, workload, deadline, evidence, and required sequence?", "id": "p-s1-case-04a" },
    { "speaker": "Eli", "character": "eli", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "frustrated", "text": "The details are buried in a paragraph near the bottom. By the time I find out what the work actually requires, I've usually already started it wrong.", "id": "e-s1-case-04b" },
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "encouraging", "text": "Your inspection: find which expectations arrive too late, then reveal how a Start Here page changes the planning experience.", "id": "p-s1-case-04c" }
  ],
  "s1_case_expectations_explanation": [
    { "speaker": "Eli", "character": "eli", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "thinking", "text": "The directions are there. I just find them too late to plan my time or line up the right evidence while I'm working.", "id": "e-s1-case-04d" },
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "encouraging", "text": "Exactly. Before we reveal the Start Here repair, we will give Babbage the verified details, review its draft organizer, and decide what the instructor can safely publish.", "id": "p-s1-case-04e" }
  ],
  "s1_case_expectations_ai_demo": [
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "thinking", "text": "Once the details are verified, AI can convert them into a first-draft Start Here page with the destination, sequence, workload, due point, and next action.", "id": "p-s1-case-04ai-a" },
    { "speaker": "Eli", "character": "eli", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "thinking", "text": "That's useful for a first draft. But the instructor still owns the workload estimate, the outcome, the dates, accessibility, and tone — all of it.", "id": "e-s1-case-04ai-b" },
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "encouraging", "text": "Exactly. Babbage accelerates the first pass. Instructor review turns that draft into trustworthy course design.", "id": "p-s1-case-04ai-c" }
  ],
  "s1_case_expectations_reveal": [
    { "speaker": "Eli", "character": "eli", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "confident", "text": "This Start Here page gives me the purpose, the workload, the deadline, the outcome, and the next action — before I commit any time to it.", "id": "e-s1-case-04f" },
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "thinking", "text": "The redesign moves expectations forward. That small shift makes the whole module easier to plan and navigate.", "id": "p-s1-case-04g" },
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "encouraging", "text": "You have now inspected all four repairs. Return to the evidence station and start the Canvas Rescue to build the brief Babbage will actually use.", "id": "p-s1-case-04h" }
  ],
  "s1_canvas_rescue_complete": [
    { "speaker": "Eli", "character": "eli", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "confident", "text": "From the student side, the repaired path tells me where to start, what I'm working toward, what to submit, and what happens next.", "id": "e-s1-rescue-01" },
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "encouraging", "text": "And from the instructor side, AI accelerated the inventory, extraction, and first draft without receiving authority to publish or invent course decisions.", "id": "p-s1-rescue-02" },
    { "speaker": "Professor Pixel", "character": "pixel", "cast": PC_S1_CANVAS_DIALOGUE_CAST, "expr": "proud", "text": "That is the PromptCraft principle: use AI to move the work forward, then use human judgment to make the work trustworthy.", "id": "p-s1-rescue-03" }
  ],
  // The old vague/decent/strong prompt-quality loop was retired before S3.
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
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "neutral", "text": "Meet Jordan. He completes his assignments, earns passing grades, and seems to be doing fine.", "id": "p86" },
    { "speaker": "Jordan", "character": "jordan", "expr": "neutral", "text": "I got an 84 on this assignment. That's better than last time, so I guess something worked.", "id": "jordan-s2-01" },
    { "speaker": "Jordan", "character": "jordan", "expr": "uncertain", "text": "I reread the chapter a few times. Some parts eventually made more sense, but I couldn't tell you what actually helped.", "id": "jordan-s2-02" },
    { "speaker": "Jordan", "character": "jordan", "expr": "frustrated", "text": "Next time I'll probably reread everything again and hope it works.", "id": "jordan-s2-03" },
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "thinking", "text": "His performance improved. His strategy might have worked. But listen carefully to what Jordan actually knows about his learning.", "id": "p88" },
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "encouraging", "text": "Let's figure out what's missing.", "id": "p89" }
  ],
  "scenarioStart_assessment": [
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "neutral", "text": "Maya brought us a strange case: a 96 percent.", "id": "p-s3-01" },
    { "speaker": "Maya", "character": "maya", "expr": "neutral", "text": "I should feel pretty good about that. I knew almost every answer.", "id": "maya-s3-01" },
    { "speaker": "Maya", "character": "maya", "expr": "uncertain", "text": "But if someone handed me a real planning problem tomorrow, I wouldn't know where to start.", "id": "maya-s3-02" },
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "thinking", "text": "That's why the grade caught my attention. The score may be accurate, but the claim attached to it may be too large.", "id": "p-s3-02" },
    { "speaker": "Maya", "character": "maya", "expr": "thinking", "text": "The test was mostly definitions, the planning cycle, and explaining terms.", "id": "maya-s3-03" },
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "neutral", "text": "The outcome says you should analyze a rural planning problem, recommend a response, and justify the trade-offs.", "id": "p-s3-03" },
    { "speaker": "Maya", "character": "maya", "expr": "frustrated", "text": "I never actually had to do that on the test.", "id": "maya-s3-04" },
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "encouraging", "text": "Then let's stop staring at the number and map the evidence.", "id": "p-s3-04" }
  ],
  "s3_after_diagnosis": [
    { "speaker": "Maya", "character": "maya", "expr": "thinking", "text": "That explains why the test was easy to study for. I knew what to memorize.", "id": "maya-s3-05" },
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "neutral", "text": "And the assessment wasn't useless. It measured knowledge and explanation. It just didn't measure the whole outcome.", "id": "p-s3-05" },
    { "speaker": "Maya", "character": "maya", "expr": "uncertain", "text": "So the 96 percent is real. It just doesn't prove I can make the decision.", "id": "maya-s3-06" },
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "encouraging", "text": "Exactly. Now build a task that gives you evidence of the decision.", "id": "p-s3-06" }
  ],
  "s3_blueprint_strong": [
    { "speaker": "Maya", "character": "maya", "expr": "confident", "text": "Okay, that feels different. I couldn't memorize my way through a county brief with real constraints.", "id": "maya-s3-07a" },
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "thinking", "text": "Good. But a realistic task can still hide weak evidence.", "id": "p-s3-07a" },
    { "speaker": "Maya", "character": "maya", "expr": "thinking", "text": "So we test what the task actually lets the instructor see.", "id": "maya-s3-08a" },
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "proud", "text": "Exactly. Stress-test it.", "id": "p-s3-08a" }
  ],
  "s3_blueprint_mixed": [
    { "speaker": "Maya", "character": "maya", "expr": "thinking", "text": "Some of this feels much closer to a real decision, but I can still see places where I could complete the task without showing why.", "id": "maya-s3-07b" },
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "thinking", "text": "That's the right suspicion. Authentic-looking is not the same as evidence-rich.", "id": "p-s3-07b" },
    { "speaker": "Maya", "character": "maya", "expr": "neutral", "text": "Then let's see which parts of my work really prove the outcome.", "id": "maya-s3-08b" },
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "encouraging", "text": "Stress-test it.", "id": "p-s3-08b" }
  ],
  "s3_blueprint_weak": [
    { "speaker": "Maya", "character": "maya", "expr": "uncertain", "text": "I think I could still study the format more than the decision.", "id": "maya-s3-07c" },
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "skeptical", "text": "Then we may have changed the scenery more than the assessment.", "id": "p-s3-07c" },
    { "speaker": "Maya", "character": "maya", "expr": "thinking", "text": "So the student evidence should expose that pretty quickly.", "id": "maya-s3-08c" },
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "encouraging", "text": "Exactly. Let's test it.", "id": "p-s3-08c" }
  ],
  "s3_after_stress_test": [
    { "speaker": "Maya", "character": "maya", "expr": "thinking", "text": "The polished memo is the part I'd probably worry about most, but it barely tells you whether my recommendation makes sense.", "id": "maya-s3-09" },
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "thinking", "text": "Right. Authentic assessment is not 'make a fancy product.' The product has to expose the performance you care about.", "id": "p-s3-09" },
    { "speaker": "Maya", "character": "maya", "expr": "confident", "text": "The evidence, trade-offs, and changed constraint are what make the decision visible.", "id": "maya-s3-10" },
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "encouraging", "text": "Now let's give the same evidence to Babbage and see what it claims.", "id": "p-s3-10" }
  ],
  "s3_after_babbage_audit": [
    { "speaker": "Maya", "character": "maya", "expr": "uncertain", "text": "So doing well once doesn't prove I can handle every new version of the problem.", "id": "maya-s3-11" },
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "neutral", "text": "Right. Evidence supports claims at the level it actually reaches.", "id": "p-s3-11" },
    { "speaker": "Maya", "character": "maya", "expr": "thinking", "text": "Then if we want to claim transfer, the assessment needs to make adaptation visible.", "id": "maya-s3-12" },
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "encouraging", "text": "Exactly. Don't rebuild the whole thing. Repair that one inference gap.", "id": "p-s3-12" }
  ],
  "s3_final_exchange": [
    { "speaker": "Maya", "character": "maya", "expr": "confident", "text": "That changed-constraint piece is the first part that makes me feel like I'd know what to do when the situation stops matching the example.", "id": "maya-s3-13" },
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "proud", "text": "And now the assessment can show why, not just whether, you got the answer.", "id": "p-s3-13" },
    { "speaker": "Maya", "character": "maya", "expr": "neutral", "text": "The grade still matters. It just means more when I know what evidence is underneath it.", "id": "maya-s3-14" },
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "encouraging", "text": "That's the point. A score is a summary. The evidence is the argument.", "id": "p-s3-14" }
  ],
  "s2_diagnosis_correct": [
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "proud", "text": "That's the hidden problem. Jordan has an outcome and a strategy, but no evidence connecting the two. He cannot judge what helped or use that judgment to make his next decision.", "id": "p90" }
  ],
  "s2_diagnosis_strategy": [
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "thinking", "text": "Rereading may not be his best strategy, but replacing it does not solve the deeper problem. Jordan still needs a way to tell why a strategy worked or failed.", "id": "p91" }
  ],
  "s2_diagnosis_motivation": [
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "skeptical", "text": "Jordan completed the work and is trying to understand the result. The evidence points somewhere other than motivation.", "id": "p92" }
  ],
  "s2_diagnosis_performance": [
    { "speaker": "Professor Pixel", "character": "pixel", "expr": "neutral", "text": "The grade tells us how Jordan performed. It does not tell Jordan what produced the learning or what he should do next.", "id": "p93" }
  ],
  "scoreReflection_0": [
    {
      "expr": "skeptical",
      "text": "That landed at zero out of five. I am not going to pretend Babbage had a usable design brief here. The response either missed the scenario or gave us information we cannot responsibly design from.",
      "id": "s1-score-0-a"
    },
    {
      "expr": "thinking",
      "text": "A useful repair needs a real learner context, a specific interaction problem, a meaningful interaction move, practical constraints, and some sign of what success should look like.",
      "id": "s1-score-0-b"
    },
    {
      "expr": "encouraging",
      "text": "Go back to the repair notes and rebuild the foundation. Give Babbage instructional information, not filler, and the next analysis should change substantially.",
      "id": "s1-score-0-c"
    }
  ],
  "scoreReflection_1": [
    {
      "expr": "skeptical",
      "text": "That scored one out of five. There is one usable signal in the response, but Babbage is still being asked to fill in most of the instructional design for you.",
      "id": "s1-score-1-a"
    },
    {
      "expr": "thinking",
      "text": "When the design brief is this thin, even a polished AI response can look smarter than the reasoning underneath it. That is exactly the trap this scenario is trying to expose.",
      "id": "s1-score-1-b"
    },
    {
      "expr": "encouraging",
      "text": "Strengthen the repair notes before you move on. Make the problem and the interaction you want students to have much more concrete.",
      "id": "s1-score-1-c"
    }
  ],
  "scoreReflection_2": [
    {
      "expr": "thinking",
      "text": "Two out of five. Babbage has enough to see part of your intent, but too much of the redesign is still guesswork.",
      "id": "s1-score-2-a"
    },
    {
      "expr": "skeptical",
      "text": "The important question is not whether the draft sounds better. It is whether your input gives Babbage enough evidence to make the right instructional change instead of inventing one.",
      "id": "s1-score-2-b"
    },
    {
      "expr": "encouraging",
      "text": "Add the missing design information and try again. You are close to having a brief Babbage can analyze without filling in the gaps.",
      "id": "s1-score-2-c"
    }
  ],
  "scoreReflection_3": [
    {
      "expr": "encouraging",
      "text": "Three out of five. That is enough structure for Babbage to attempt a defensible repair, but I would not call the design brief complete yet.",
      "id": "s1-score-3-a"
    },
    {
      "expr": "thinking",
      "text": "The draft may work, but some of its quality still depends on Babbage filling in gaps for you. A stronger design brief reduces those assumptions and makes your instructional intent easier to verify.",
      "id": "s1-score-3-b"
    },
    {
      "expr": "encouraging",
      "text": "You can move forward, or revise once more and see whether a more complete brief produces a more precise repair.",
      "id": "s1-score-3-c"
    }
  ],
  "scoreReflection_4": [
    {
      "expr": "proud",
      "text": "Four out of five. This is a strong design brief. Babbage had enough context to make a targeted repair instead of simply rewriting the discussion prompt.",
      "id": "s1-score-4-a"
    },
    {
      "expr": "thinking",
      "text": "There is still one area that could be clearer, which matters because small gaps are where AI starts making quiet assumptions on your behalf.",
      "id": "s1-score-4-b"
    },
    {
      "expr": "proud",
      "text": "The important shift is here: you gave the replies an instructional purpose, not just a participation requirement. That is a meaningful redesign.",
      "id": "s1-score-4-c"
    }
  ],
  "scoreReflection_5": [
    {
      "expr": "proud",
      "text": "Five out of five. You gave Babbage a complete design brief: learner context, the actual problem, the interaction you want, the constraints, and a clear success signal.",
      "id": "s1-score-5-a"
    },
    {
      "expr": "thinking",
      "text": "That does not mean Babbage is automatically right. It means you gave it enough information that you can judge whether its repair actually follows your instructional intent.",
      "id": "s1-score-5-b"
    },
    {
      "expr": "proud",
      "text": "That is the habit I want you to carry forward: make the reasoning visible first, then use AI to help execute the design.",
      "id": "s1-score-5-c"
    }
  ]
};

window.predictionReactions = {
  "targeted": "That prediction makes sense. You gave Babbage learner context, the actual discussion failure, and a clear interaction move, so it should have enough to give a targeted repair.",
  "generic": "That could happen. Babbage can still drift into polite template language if it treats the issue as make this better instead of fix this exact discussion breakdown.",
  "ignores_constraints": "Good caution. Constraints are where AI often gets mushy. Naming them before the output helps you check whether Babbage actually respected them.",
  "not_sure": "That is a useful answer too. Predicting before you look helps you notice what Babbage changes, misses, or invents instead of just accepting the shiny paragraph."
};

// Exact-text fallback map for current recordable dialogue.
window.pixelAudioByText = {
  "Welcome to the Prompt Lab! I'm Professor Pixel. I'll guide you through each teaching challenge.": "p1",
  "You'll diagnose what is happening, make a decision, and test what changes.": "p2",
  "Babbage can analyze the information you provide, but the final judgment stays with you.": "p3",
  "A faculty member brought me this discussion prompt. Nothing is technically wrong with it.": "p14",
  "Students are posting. Students are replying. The assignment is being completed.": "p15",
  "But the conversation dies after a single exchange. Let's figure out why.": "p16",
  "That landed at zero out of five. I am not going to pretend Babbage had a usable design brief here. The response either missed the scenario or gave us information we cannot responsibly design from.": "s1-score-0-a",
  "A useful repair needs a real learner context, a specific interaction problem, a meaningful interaction move, practical constraints, and some sign of what success should look like.": "s1-score-0-b",
  "Go back to the repair notes and rebuild the foundation. Give Babbage instructional information, not filler, and the next analysis should change substantially.": "s1-score-0-c",
  "That scored one out of five. There is one usable signal in the response, but Babbage is still being asked to fill in most of the instructional design for you.": "s1-score-1-a",
  "When the design brief is this thin, even a polished AI response can look smarter than the reasoning underneath it. That is exactly the trap this scenario is trying to expose.": "s1-score-1-b",
  "Strengthen the repair notes before you move on. Make the problem and the interaction you want students to have much more concrete.": "s1-score-1-c",
  "Two out of five. Babbage has enough to see part of your intent, but too much of the redesign is still guesswork.": "s1-score-2-a",
  "The important question is not whether the draft sounds better. It is whether your input gives Babbage enough evidence to make the right instructional change instead of inventing one.": "s1-score-2-b",
  "Add the missing design information and try again. You are close to having a brief Babbage can analyze without filling in the gaps.": "s1-score-2-c",
  "Three out of five. That is enough structure for Babbage to attempt a defensible repair, but I would not call the design brief complete yet.": "s1-score-3-a",
  "The draft may work, but some of its quality still depends on Babbage filling in gaps for you. A stronger design brief reduces those assumptions and makes your instructional intent easier to verify.": "s1-score-3-b",
  "You can move forward, or revise once more and see whether a more complete brief produces a more precise repair.": "s1-score-3-c",
  "Four out of five. This is a strong design brief. Babbage had enough context to make a targeted repair instead of simply rewriting the discussion prompt.": "s1-score-4-a",
  "There is still one area that could be clearer, which matters because small gaps are where AI starts making quiet assumptions on your behalf.": "s1-score-4-b",
  "The important shift is here: you gave the replies an instructional purpose, not just a participation requirement. That is a meaningful redesign.": "s1-score-4-c",
  "Five out of five. You gave Babbage a complete design brief: learner context, the actual problem, the interaction you want, the constraints, and a clear success signal.": "s1-score-5-a",
  "That does not mean Babbage is automatically right. It means you gave it enough information that you can judge whether its repair actually follows your instructional intent.": "s1-score-5-b",
  "That is the habit I want you to carry forward: make the reasoning visible first, then use AI to help execute the design.": "s1-score-5-c",
  "That prediction makes sense. You gave Babbage learner context, the actual discussion failure, and a clear interaction move, so it should have enough to give a targeted repair.": "p47",
  "That could happen. Babbage can still drift into polite template language if it treats the issue as make this better instead of fix this exact discussion breakdown.": "p48",
  "Good caution. Constraints are where AI often gets mushy. Naming them before the output helps you check whether Babbage actually respected them.": "p49",
  "That is a useful answer too. Predicting before you look helps you notice what Babbage changes, misses, or invents instead of just accepting the shiny paragraph.": "p50",
  "Let's ask Babbage what it notices.": "p58",
  "Babbage is analyzing the teaching problem now.": "p59",
  "Before we consult Babbage...": "p60",
  "Based on the context you gave, what do you predict Babbage will do?": "p61",
  "Your prediction is logged.": "p62"
};

window.pixelAudioLabels = {
  "p1": {
    "source": "welcome",
    "expression": "excited",
    "text": "Welcome to the Prompt Lab! I'm Professor Pixel. I'll guide you through each teaching challenge.",
    "notes": ""
  },
  "p2": {
    "source": "welcome",
    "expression": "encouraging",
    "text": "You'll diagnose what is happening, make a decision, and test what changes.",
    "notes": ""
  },
  "p3": {
    "source": "welcome",
    "expression": "neutral",
    "text": "Babbage can analyze the information you provide, but the final judgment stays with you.",
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
  "s1-score-0-a": {
    "source": "scoreReflection_0",
    "expression": "skeptical",
    "text": "That landed at zero out of five. I am not going to pretend Babbage had a usable design brief here. The response either missed the scenario or gave us information we cannot responsibly design from.",
    "notes": "Scenario 1 score-specific post-analysis line. Record exactly as written for the 0/5 branch."
  },
  "s1-score-0-b": {
    "source": "scoreReflection_0",
    "expression": "thinking",
    "text": "A useful repair needs a real learner context, a specific interaction problem, a meaningful interaction move, practical constraints, and some sign of what success should look like.",
    "notes": "Scenario 1 score-specific post-analysis line. Record exactly as written for the 0/5 branch."
  },
  "s1-score-0-c": {
    "source": "scoreReflection_0",
    "expression": "encouraging",
    "text": "Go back to the repair notes and rebuild the foundation. Give Babbage instructional information, not filler, and the next analysis should change substantially.",
    "notes": "Scenario 1 score-specific post-analysis line. Record exactly as written for the 0/5 branch."
  },
  "s1-score-1-a": {
    "source": "scoreReflection_1",
    "expression": "skeptical",
    "text": "That scored one out of five. There is one usable signal in the response, but Babbage is still being asked to fill in most of the instructional design for you.",
    "notes": "Scenario 1 score-specific post-analysis line. Record exactly as written for the 1/5 branch."
  },
  "s1-score-1-b": {
    "source": "scoreReflection_1",
    "expression": "thinking",
    "text": "When the design brief is this thin, even a polished AI response can look smarter than the reasoning underneath it. That is exactly the trap this scenario is trying to expose.",
    "notes": "Scenario 1 score-specific post-analysis line. Record exactly as written for the 1/5 branch."
  },
  "s1-score-1-c": {
    "source": "scoreReflection_1",
    "expression": "encouraging",
    "text": "Strengthen the repair notes before you move on. Make the problem and the interaction you want students to have much more concrete.",
    "notes": "Scenario 1 score-specific post-analysis line. Record exactly as written for the 1/5 branch."
  },
  "s1-score-2-a": {
    "source": "scoreReflection_2",
    "expression": "thinking",
    "text": "Two out of five. Babbage has enough to see part of your intent, but too much of the redesign is still guesswork.",
    "notes": "Scenario 1 score-specific post-analysis line. Record exactly as written for the 2/5 branch."
  },
  "s1-score-2-b": {
    "source": "scoreReflection_2",
    "expression": "skeptical",
    "text": "The important question is not whether the draft sounds better. It is whether your input gives Babbage enough evidence to make the right instructional change instead of inventing one.",
    "notes": "Scenario 1 score-specific post-analysis line. Record exactly as written for the 2/5 branch."
  },
  "s1-score-2-c": {
    "source": "scoreReflection_2",
    "expression": "encouraging",
    "text": "Add the missing design information and try again. You are close to having a brief Babbage can analyze without filling in the gaps.",
    "notes": "Scenario 1 score-specific post-analysis line. Record exactly as written for the 2/5 branch."
  },
  "s1-score-3-a": {
    "source": "scoreReflection_3",
    "expression": "encouraging",
    "text": "Three out of five. That is enough structure for Babbage to attempt a defensible repair, but I would not call the design brief complete yet.",
    "notes": "Scenario 1 score-specific post-analysis line. Record exactly as written for the 3/5 branch."
  },
  "s1-score-3-b": {
    "source": "scoreReflection_3",
    "expression": "thinking",
    "text": "The draft may work, but some of its quality still depends on Babbage filling in gaps for you. A stronger design brief reduces those assumptions and makes your instructional intent easier to verify.",
    "notes": "Scenario 1 score-specific post-analysis line. Record exactly as written for the 3/5 branch."
  },
  "s1-score-3-c": {
    "source": "scoreReflection_3",
    "expression": "encouraging",
    "text": "You can move forward, or revise once more and see whether a more complete brief produces a more precise repair.",
    "notes": "Scenario 1 score-specific post-analysis line. Record exactly as written for the 3/5 branch."
  },
  "s1-score-4-a": {
    "source": "scoreReflection_4",
    "expression": "proud",
    "text": "Four out of five. This is a strong design brief. Babbage had enough context to make a targeted repair instead of simply rewriting the discussion prompt.",
    "notes": "Scenario 1 score-specific post-analysis line. Record exactly as written for the 4/5 branch."
  },
  "s1-score-4-b": {
    "source": "scoreReflection_4",
    "expression": "thinking",
    "text": "There is still one area that could be clearer, which matters because small gaps are where AI starts making quiet assumptions on your behalf.",
    "notes": "Scenario 1 score-specific post-analysis line. Record exactly as written for the 4/5 branch."
  },
  "s1-score-4-c": {
    "source": "scoreReflection_4",
    "expression": "proud",
    "text": "The important shift is here: you gave the replies an instructional purpose, not just a participation requirement. That is a meaningful redesign.",
    "notes": "Scenario 1 score-specific post-analysis line. Record exactly as written for the 4/5 branch."
  },
  "s1-score-5-a": {
    "source": "scoreReflection_5",
    "expression": "proud",
    "text": "Five out of five. You gave Babbage a complete design brief: learner context, the actual problem, the interaction you want, the constraints, and a clear success signal.",
    "notes": "Scenario 1 score-specific post-analysis line. Record exactly as written for the 5/5 branch."
  },
  "s1-score-5-b": {
    "source": "scoreReflection_5",
    "expression": "thinking",
    "text": "That does not mean Babbage is automatically right. It means you gave it enough information that you can judge whether its repair actually follows your instructional intent.",
    "notes": "Scenario 1 score-specific post-analysis line. Record exactly as written for the 5/5 branch."
  },
  "s1-score-5-c": {
    "source": "scoreReflection_5",
    "expression": "proud",
    "text": "That is the habit I want you to carry forward: make the reasoning visible first, then use AI to help execute the design.",
    "notes": "Scenario 1 score-specific post-analysis line. Record exactly as written for the 5/5 branch."
  },
  "p47": {
    "source": "predictionReaction_targeted",
    "expression": "",
    "text": "That prediction makes sense. You gave Babbage learner context, the actual discussion failure, and a clear interaction move, so it should have enough to give a targeted repair.",
    "notes": "Displayed after learner chooses a prediction."
  },
  "p48": {
    "source": "predictionReaction_generic",
    "expression": "",
    "text": "That could happen. Babbage can still drift into polite template language if it treats the issue as make this better instead of fix this exact discussion breakdown.",
    "notes": "Displayed after learner chooses a prediction."
  },
  "p49": {
    "source": "predictionReaction_ignores_constraints",
    "expression": "",
    "text": "Good caution. Constraints are where AI often gets mushy. Naming them before the output helps you check whether Babbage actually respected them.",
    "notes": "Displayed after learner chooses a prediction."
  },
  "p50": {
    "source": "predictionReaction_not_sure",
    "expression": "",
    "text": "That is a useful answer too. Predicting before you look helps you notice what Babbage changes, misses, or invents instead of just accepting the shiny paragraph.",
    "notes": "Displayed after learner chooses a prediction."
  },
  "p58": {
    "source": "babbage_analyzing_bridge_1",
    "expression": "",
    "text": "Let's ask Babbage what it notices.",
    "notes": "VN dialogue during Babbage analysis."
  },
  "p59": {
    "source": "babbage_analyzing_bridge_2",
    "expression": "",
    "text": "Babbage is analyzing the teaching problem now.",
    "notes": "VN dialogue during Babbage analysis."
  },
  "p60": {
    "source": "prediction_gate_intro_1",
    "expression": "thinking",
    "text": "Before we consult Babbage...",
    "notes": "VN prediction screen."
  },
  "p61": {
    "source": "prediction_gate_intro_2",
    "expression": "thinking",
    "text": "Based on the context you gave, what do you predict Babbage will do?",
    "notes": "VN prediction screen."
  },
  "p62": {
    "source": "prediction_logged",
    "expression": "",
    "text": "Your prediction is logged.",
    "notes": "Shown after learner chooses a prediction."
  }
};


// S1 score-specific recordings. Stable IDs match the S1 score-feedback audio keys.
window.s1ScoreVoiceover = {
  "s1-score-0-a": "assets/audio/voice/professor-pixel/scenario-01/s1-score-0-a.mp3",
  "s1-score-0-b": "assets/audio/voice/professor-pixel/scenario-01/s1-score-0-b.mp3",
  "s1-score-0-c": "assets/audio/voice/professor-pixel/scenario-01/s1-score-0-c.mp3",
  "s1-score-1-a": "assets/audio/voice/professor-pixel/scenario-01/s1-score-1-a.mp3",
  "s1-score-1-b": "assets/audio/voice/professor-pixel/scenario-01/s1-score-1-b.mp3",
  "s1-score-1-c": "assets/audio/voice/professor-pixel/scenario-01/s1-score-1-c.mp3",
  "s1-score-2-a": "assets/audio/voice/professor-pixel/scenario-01/s1-score-2-a.mp3",
  "s1-score-2-b": "assets/audio/voice/professor-pixel/scenario-01/s1-score-2-b.mp3",
  "s1-score-2-c": "assets/audio/voice/professor-pixel/scenario-01/s1-score-2-c.mp3",
  "s1-score-3-a": "assets/audio/voice/professor-pixel/scenario-01/s1-score-3-a.mp3",
  "s1-score-3-b": "assets/audio/voice/professor-pixel/scenario-01/s1-score-3-b.mp3",
  "s1-score-3-c": "assets/audio/voice/professor-pixel/scenario-01/s1-score-3-c.mp3",
  "s1-score-4-a": "assets/audio/voice/professor-pixel/scenario-01/s1-score-4-a.mp3",
  "s1-score-4-b": "assets/audio/voice/professor-pixel/scenario-01/s1-score-4-b.mp3",
  "s1-score-4-c": "assets/audio/voice/professor-pixel/scenario-01/s1-score-4-c.mp3",
  "s1-score-5-a": "assets/audio/voice/professor-pixel/scenario-01/s1-score-5-a.mp3",
  "s1-score-5-b": "assets/audio/voice/professor-pixel/scenario-01/s1-score-5-b.mp3",
  "s1-score-5-c": "assets/audio/voice/professor-pixel/scenario-01/s1-score-5-c.mp3",
};

// S2 draft recording metadata. These files are planned but are not loaded until
// completed recordings are placed at the listed paths.
window.s2VoiceoverDrafts = {
  p86: "assets/audio/voice/professor-pixel/scenario-02/p86.mp3",
  p88: "assets/audio/voice/professor-pixel/scenario-02/p88.mp3",
  p89: "assets/audio/voice/professor-pixel/scenario-02/p89.mp3",
  p90: "assets/audio/voice/professor-pixel/scenario-02/p90.mp3",
  p91: "assets/audio/voice/professor-pixel/scenario-02/p91.mp3",
  p92: "assets/audio/voice/professor-pixel/scenario-02/p92.mp3",
  p93: "assets/audio/voice/professor-pixel/scenario-02/p93.mp3",
  "jordan-s2-01": "assets/audio/voice/students/jordan/scenario-02/jordan-s2-01.mp3",
  "jordan-s2-02": "assets/audio/voice/students/jordan/scenario-02/jordan-s2-02.mp3",
  "jordan-s2-03": "assets/audio/voice/students/jordan/scenario-02/jordan-s2-03.mp3",
  "jordan-s2-intervention-confidence": "assets/audio/voice/students/jordan/scenario-02/jordan-s2-intervention-confidence.mp3",
  "jordan-s2-intervention-strategy": "assets/audio/voice/students/jordan/scenario-02/jordan-s2-intervention-strategy.mp3",
  "jordan-s2-intervention-grade": "assets/audio/voice/students/jordan/scenario-02/jordan-s2-intervention-grade.mp3",
  "jordan-s2-intervention-evidence": "assets/audio/voice/students/jordan/scenario-02/jordan-s2-intervention-evidence.mp3"
};

window.s2JordanInterventionDialogue = {
  confidence: {
    voiceId: "jordan-s2-intervention-confidence",
    expression: "confident",
    text: "I’d say I’m a four out of five. I feel better about it this time."
  },
  strategy_name: {
    voiceId: "jordan-s2-intervention-strategy",
    expression: "thinking",
    text: "I reread the chapter three times and highlighted the parts that seemed important."
  },
  grade_compare: {
    voiceId: "jordan-s2-intervention-grade",
    expression: "confident",
    text: "I got an 84 instead of a 76, so rereading must have worked."
  },
  evidence_check: {
    voiceId: "jordan-s2-intervention-evidence",
    expression: "thinking",
    text: "I could define both concepts, but without my notes I still couldn’t explain the difference. Rereading helped me recognize them, but it didn’t help me compare them. I need to try examples next."
  }
};
