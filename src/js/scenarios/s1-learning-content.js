/* S1 example content and lesson configuration. */

// Retained alias for callers that still use the S1 name.
const PC_S1_MO_ASSET = PC_CANVAS_MO_ASSET;

const PC_S1_LEARNING_ITEMS = Object.freeze([
  Object.freeze({
    id: 'food-access-reading',
    moduleTitle: 'Food_Access_Reading',
    typeLabel: 'Page',
    pageTitle: 'Food Access and Community Health',
    mayaQuote:
      'This reading explains how where people live can shape access to affordable, nutritious food and how that can affect health.',
    contentHTML: `
      <p>Access to nutritious food is shaped by more than individual choices. Transportation, household income, store location, work schedules, and the cost of fresh food can all affect what is realistically available to a household.</p>
      <p>Communities with limited access to full-service grocery stores are sometimes described as food deserts, although the term does not capture every local condition. A neighborhood may technically have food nearby while residents still face barriers related to price, transportation, disability, or store hours.</p>
      <h2>As you read</h2>
      <p>Pay attention to the difference between <strong>food availability</strong> and <strong>food access</strong>. Think about which community conditions can influence both.</p>
      <p><strong>Reading:</strong> Community Food Access Overview, pp. 4–11.</p>
    `
  }),
  Object.freeze({
    id: 'food-access-video',
    moduleTitle: 'FA_video_03',
    typeLabel: 'Video',
    pageTitle: 'Food Deserts and Community Barriers',
    mayaQuote:
      'This was the short video about what a food desert is, how it can affect a community, and some barriers people face when trying to get nutritious food.',
    contentHTML: `
      <p>Watch the short video below before continuing with the module.</p>
      <div class="pc-s1-canvas-video-player" role="img" aria-label="Embedded video player titled Food Deserts and Community Barriers, 6 minutes 18 seconds">
        <div class="pc-s1-canvas-video-screen">
          <button type="button" class="pc-s1-canvas-video-play" aria-label="Play Food Deserts and Community Barriers" data-pc-action="s1-learning-prevent-link">
            <span aria-hidden="true"></span>
          </button>
          <div class="pc-s1-canvas-video-overlay">
            <strong>Food Deserts and Community Barriers</strong>
            <span>6:18</span>
          </div>
          <div class="pc-s1-canvas-video-controls" aria-hidden="true">
            <span class="pc-s1-canvas-video-progress"><i></i></span>
            <span class="pc-s1-canvas-video-time">0:00 / 6:18</span>
          </div>
        </div>
      </div>
      <p>The video introduces several barriers to food access, including transportation, distance, affordability, and limited store selection.</p>
      <p><a href="#" data-pc-action="s1-learning-prevent-link">Video transcript</a></p>
    `
  }),
  Object.freeze({
    id: 'module-terms',
    moduleTitle: 'M3_terms',
    typeLabel: 'Page',
    pageTitle: 'Module 3 Terms',
    mayaQuote:
      'This page is mostly vocabulary: food access, food insecurity, food desert, transportation barrier, and social determinants of health.',
    contentHTML: `
      <p>Review these terms for Module 3.</p>
      <h2>Food access</h2>
      <p>The ability to obtain sufficient, affordable, and nutritious food.</p>
      <h2>Food insecurity</h2>
      <p>Limited or uncertain access to adequate food.</p>
      <h2>Food desert</h2>
      <p>A commonly used term for an area where residents have limited access to affordable, nutritious food retailers.</p>
      <h2>Transportation barrier</h2>
      <p>A transportation-related condition that makes it harder to reach needed goods or services.</p>
      <h2>Social determinants of health</h2>
      <p>The conditions in which people are born, grow, live, work, and age that can influence health outcomes.</p>
    `
  }),
  Object.freeze({
    id: 'discussion-3',
    moduleTitle: 'Discussion 3',
    typeLabel: 'Discussion',
    pageTitle: 'Discussion 3',
    mayaQuote:
      'This discussion asks me to describe one food-access barrier in a community and respond to two classmates.',
    contentHTML: `
      <p><strong>Due Sunday at 11:59 p.m.</strong></p>
      <p>After completing this week's reading and video, describe one barrier that could make it difficult for people in a community to access nutritious food.</p>
      <p>In your initial post, explain why the barrier matters. Then reply to at least two classmates.</p>
      <h2>Requirements</h2>
      <ul>
        <li>Initial post: approximately 200 words</li>
        <li>Two replies: approximately 75 words each</li>
        <li>Use at least one idea from this week's materials</li>
      </ul>
    `
  }),
  Object.freeze({
    id: 'quiz-3',
    moduleTitle: 'Quiz 3',
    typeLabel: 'Quiz',
    pageTitle: 'Quiz 3',
    mayaQuote:
      'This quiz checks whether I remember the main terms and examples from the reading and video.',
    contentHTML: `
      <p><strong>10 points · 5 questions · 1 attempt</strong></p>
      <p>This quiz covers the Module 3 reading, video, and vocabulary.</p>
      <h2>Instructions</h2>
      <p>Select the best answer for each question. Questions focus on definitions and examples from the module materials.</p>
      <p>Once you begin, complete the quiz in one sitting.</p>
    `
  })
]);

const PC_S1_LEARNING_DEFAULT_QUOTE =
  'These file names do not tell me much about what I am supposed to do first. I would probably start clicking until something made sense.';

const PC_S1_SUGGESTED_PURPOSES = Object.freeze({
  'food-access-reading': 'prepare',
  'food-access-video': 'prepare',
  'module-terms': 'prepare',
  'discussion-3': 'practice',
  'quiz-3': 'evidence'
});

const PC_S1_PURPOSE_LABELS = Object.freeze({ prepare: 'Prepare', practice: 'Practice', evidence: 'Evidence' });

const PC_S1_OSCQR_STANDARDS = Object.freeze([
  Object.freeze({ number: 2, title: 'Module overview and predictability', connection: 'Module overviews, activity names, and sequence make course work easier to find and anticipate.' }),
  Object.freeze({ number: 9, title: 'Measurable alignment', connection: 'Objectives, learning activities, and assessments are checked against the same intended learning.' }),
  Object.freeze({ number: 16, title: 'Logical, uncluttered navigation', connection: 'Related work is organized together with consistent structure and self-evident titles.' }),
  Object.freeze({ number: 19, title: 'Clear instructions', connection: 'Students can tell what to do, what to produce, and what happens next.' }),
  Object.freeze({ number: 21, title: 'Readable headings and structure', connection: 'Text headers and heading styles reveal the purpose and structure of the module.' }),
  Object.freeze({ number: 45, title: 'Authentic evidence of mastery', connection: 'The module includes an appropriate way for students to demonstrate the intended learning.' }),
  Object.freeze({ number: 46, title: 'Clear assessment criteria', connection: 'Students can see the criteria for the evidence they are expected to produce.' })
]);

const PC_S1_ORGANIZE_ZONES = Object.freeze([
  Object.freeze({ id: 'prepare', label: 'Prepare', definition: 'Students learn or review information they will need.' }),
  Object.freeze({ id: 'practice', label: 'Practice', definition: 'Students try the skill, think with the ideas, or get feedback.' }),
  Object.freeze({ id: 'evidence', label: 'Evidence', definition: 'Students show what they can actually do for the intended learning.' })
]);

const PC_S1_DIAGNOSIS_CHOICES = Object.freeze([
  Object.freeze({
    id: 'more-content',
    text: 'The module needs more content before Maya can learn the topic.'
  }),
  Object.freeze({
    id: 'navigation-only',
    text: 'The main problem is that Maya cannot tell where to start in the module.'
  }),
  Object.freeze({
    id: 'evidence-gap',
    text: 'The work helps Maya learn terms and describe barriers, but never asks her to recommend a response using evidence.'
  }),
  Object.freeze({
    id: 'quiz-length',
    text: 'The quiz is too short to count as a meaningful assessment.'
  })
]);

const PC_S1_DEV_RENAMES = Object.freeze([
  'Food Access and Community Health Reading',
  'Food Deserts and Community Barriers Video',
  'Module 3 Food Access Terms',
  'Discuss Community Food-Access Barriers',
  'Module 3 Food Access Quiz'
]);
