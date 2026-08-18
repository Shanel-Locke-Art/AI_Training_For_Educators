const assert = require('node:assert/strict');
const { handler } = require('../netlify/functions/babbage.js');

async function run() {
  const originalKey = process.env.OPENAI_API_KEY;
  const originalFetch = global.fetch;

  try {
    process.env.OPENAI_API_KEY = 'test-key';

    const health = await handler({ httpMethod: 'GET' });
    assert.equal(health.statusCode, 200);
    const healthBody = JSON.parse(health.body);
    assert.equal(healthBody.provider, 'openai');
    assert.equal(healthBody.proxy_version, 'V369');
    assert.ok(healthBody.supported_contracts.includes('s5_review'));

    const fixtures = {
      promptcraft_s1_babbage_analysis: {
        status:'STRONG', confidence:'HIGH', feedback_summary:'Summary',
        what_worked:['A'], issue_detected:'Issue', recommended_repair:'Repair',
        expected_impact:'Impact', revised_discussion_prompt:'Prompt',
        revision_review:{strongest_improvement:'A',remaining_limitation:'B',why_these_changes:'C'},
        course_quality_check:{clear_objectives:'A',student_interaction:'B',real_world_context:'C',inclusive_design:'D',measurable_outcomes:'E'},
        input_quality:{usable:true,concerns:[]}
      },
      promptcraft_s2_babbage_draft: {
        activity_title:'Reflect', activity_prompt:'Prompt', design_rationale:'Why',
        deliberate_weakness:'no_evidence', likely_student_response:'Response',
        why_the_weakness_matters:'Reason'
      },
      promptcraft_s2_babbage_review: {
        status:'PROMISING REPAIR', confidence:'HIGH', feedback_summary:'Summary',
        what_improved:['Specific evidence'], remaining_issue:'Transfer',
        revised_activity:'New prompt', student_response_after:'Jordan response',
        why_student_thinking_changed:'Reason'
      },
      promptcraft_s3_babbage_draft: {
        assessment_title:'Client Memo', student_role:'Advisor', audience:'Client',
        task:'Recommend an action', deliverable:'Memo', constraints:['500 words'],
        success_evidence:['Decision','Reasoning'], deliberate_weakness:'fake_audience',
        why_it_is_more_authentic:'Applied task', likely_student_behavior:'Generic school answer'
      },
      promptcraft_s3_babbage_review: {
        status:'AUTHENTICITY IMPROVED', confidence:'HIGH', feedback_summary:'Summary',
        what_improved:['Audience affects decision'], remaining_issue:'Criteria',
        final_assessment:'Final task', alignment_rationale:'Alignment',
        student_evidence_of_learning:'Observable evidence'
      },
      promptcraft_s4_babbage_draft: {
        plan_title:'Choose a path', essential_learning_function:'Peer exchange',
        synchronous_path:'Live path', asynchronous_path:'Async path',
        evidence_of_learning:['Contribution','Revision'],
        deliberate_weakness:'recording_only',
        why_the_plan_looks_fair:'Same content', likely_student_consequence:'Observers only'
      },
      promptcraft_s4_babbage_review: {
        status:'EQUIVALENCE IMPROVED', confidence:'HIGH', feedback_summary:'Summary',
        what_improved:['Both paths contribute'], remaining_issue:'Timing',
        final_participation_plan:'Final plan', equivalence_rationale:'Same learning work',
        observable_evidence:'Contribution, feedback, revision'
      },
      promptcraft_s5_babbage_brief: {
        brief_title:'Evidence brief', brief_summary:'Summary',
        claims:[
          {claim_id:'CLAIM-1',claim_text:'A',cited_source_id:'SOURCE-A'},
          {claim_id:'CLAIM-2',claim_text:'B',cited_source_id:'SOURCE-B'},
          {claim_id:'CLAIM-3',claim_text:'C',cited_source_id:'SOURCE-C'},
          {claim_id:'CLAIM-4',claim_text:'D',cited_source_id:'SOURCE-D'}
        ],
        deliberate_issue:'unsupported_number', target_claim_id:'CLAIM-3',
        why_unsafe:'Unsupported number', verification_priority:'Check numbers'
      },
      promptcraft_s5_babbage_review: {
        status:'CLAIM REPAIRED', confidence:'HIGH', feedback_summary:'Summary',
        what_improved:['Supported wording'], remaining_issue:'Check original source',
        corrected_claim:'Corrected', verification_note:'Verified against source',
        safe_use_recommendation:'Use corrected claim only'
      }
    };

    let lastPayload = null;
    global.fetch = async (_url, options) => {
      lastPayload = JSON.parse(options.body);
      const name = lastPayload?.text?.format?.name;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({
          output_text: JSON.stringify(fixtures[name]),
          usage: { input_tokens: 10, output_tokens: 20 }
        })
      };
    };

    const cases = [
      ['scenario1', 'promptcraft_s1_babbage_analysis', 'promptcraft_s1_babbage_analysis_v1'],
      ['s2_draft', 'promptcraft_s2_babbage_draft', 'promptcraft_s2_babbage_draft_v1'],
      ['s2_review', 'promptcraft_s2_babbage_review', 'promptcraft_s2_babbage_review_v1'],
      ['s3_draft', 'promptcraft_s3_babbage_draft', 'promptcraft_s3_babbage_draft_v1'],
      ['s3_review', 'promptcraft_s3_babbage_review', 'promptcraft_s3_babbage_review_v1'],
      ['s4_draft', 'promptcraft_s4_babbage_draft', 'promptcraft_s4_babbage_draft_v1'],
      ['s4_review', 'promptcraft_s4_babbage_review', 'promptcraft_s4_babbage_review_v1'],
      ['s5_brief', 'promptcraft_s5_babbage_brief', 'promptcraft_s5_babbage_brief_v1'],
      ['s5_review', 'promptcraft_s5_babbage_review', 'promptcraft_s5_babbage_review_v1']
    ];

    for (const [analysisType, expectedName, expectedSchema] of cases) {
      const result = await handler({
        httpMethod: 'POST',
        body: JSON.stringify({
          analysis_type: analysisType,
          system: 'Test',
          messages: [{ role: 'user', content: 'Test' }],
          max_output_tokens: 2500
        })
      });

      assert.equal(result.statusCode, 200);
      const body = JSON.parse(result.body);
      assert.equal(body.analysis_schema, expectedSchema);
      assert.equal(body.proxy_version, 'V369');
      assert.equal(lastPayload.text.format.name, expectedName);
      assert.equal(lastPayload.text.format.strict, true);
      assert.equal(lastPayload.model, 'gpt-5.6-terra');
    }

    console.log('PromptCraft Babbage S1-S5 structured proxy tests passed.');
  } finally {
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = originalKey;
    global.fetch = originalFetch;
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
