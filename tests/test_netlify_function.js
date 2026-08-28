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
    assert.equal(healthBody.proxy_version, 'V372');
    assert.ok(healthBody.supported_contracts.includes('s1_canvas_rescue'));
    assert.ok(healthBody.supported_contracts.includes('s5_review'));
    assert.ok(healthBody.supported_contracts.includes('s3_evidence_analysis'));
    assert.ok(healthBody.supported_contracts.includes('s3_transfer_assessment'));

    const fixtures = {
      promptcraft_s1_babbage_analysis: {
        status:'STRONG', confidence:'HIGH', feedback_summary:'Summary',
        what_worked:['A'], issue_detected:'Issue', recommended_repair:'Repair',
        expected_impact:'Impact', revised_discussion_prompt:'Prompt',
        revision_review:{strongest_improvement:'A',remaining_limitation:'B',why_these_changes:'C'},
        course_quality_check:{clear_objectives:'A',student_interaction:'B',real_world_context:'C',inclusive_design:'D',measurable_outcomes:'E'},
        input_quality:{usable:true,concerns:[]}
      },
      promptcraft_s1_evidence_analysis: {
        verdict:'STRONG', summary:'The comparison connects the learner problem to a visible Canvas change.',
        learner_problem:{met:true,feedback:'The response names what students had to infer.'},
        visible_change:{met:true,feedback:'The response cites the visible module path.'},
        student_benefit:{met:true,feedback:'The response explains how the path helps students act.'},
        design_takeaway:'Make the intended learning path visible at the point of need.'
      },
      promptcraft_s1_canvas_rescue: {
        brief_quality:'STRONG', brief_summary:'Bounded Canvas repair brief',
        assumptions:['Verify outcomes and accessibility decisions'],
        proposals:[
          {id:'start-here',title:'Start Here',detail:'Add advance organizer',recommended_boundary:'KEEP_IN_DRAFT',rationale:'Uses verified details'},
          {id:'module-path',title:'Module path',detail:'Group existing items',recommended_boundary:'KEEP_IN_DRAFT',rationale:'Makes order visible'},
          {id:'assignment-checklist',title:'Assignment checklist',detail:'Move verified requirements',recommended_boundary:'KEEP_IN_DRAFT',rationale:'Point of need'},
          {id:'remove-alternatives',title:'Remove alternatives',detail:'Delete transcripts',recommended_boundary:'INSTRUCTOR_REVIEW',rationale:'Accessibility decision'},
          {id:'invent-outcome',title:'Replace outcome',detail:'Use generated outcome',recommended_boundary:'INSTRUCTOR_REVIEW',rationale:'Alignment decision'}
        ]
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
      promptcraft_s3_evidence_analysis: {
        claim_about_learning:'Maya can transfer this skill independently to new planning problems.',
        confidence:'HIGH',
        evidence_used:['Decision','Evidence','Reasoning'],
        judgment:'SUFFICIENT',
        recommendation:'Move to an independent brief.',
        deliberate_issue:'ignores_transfer',
        why_this_inference_is_plausible:'The performance is strong, but transfer is not yet established.'
      },
      promptcraft_s3_transfer_assessment: {
        status:'REDESIGN OPPORTUNITY', confidence:'HIGH', feedback_summary:'Summary',
        current_evidence:'Current evidence', alignment_gap:'Alignment gap',
        authenticity_opportunity:'Authenticity opportunity', suggested_revision:'Revised assessment',
        why_stronger_evidence:'Stronger evidence', remaining_limitation:'One task is limited',
        suggested_components:{
          situation:'Realistic situation', performance:'Make a decision', evidence:'Decision brief',
          reasoning:'Explain evidence and trade-offs', criteria:'Judge alignment and reasoning'
        },
        share_title:'Assessment redesign', share_summary:'A generalized assessment redesign summary suitable for moderation.'
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
      ['s1_evidence_analysis', 'promptcraft_s1_evidence_analysis', 'promptcraft_s1_evidence_analysis_v1'],
      ['s1_canvas_rescue', 'promptcraft_s1_canvas_rescue', 'promptcraft_s1_canvas_rescue_v1'],
      ['s2_draft', 'promptcraft_s2_babbage_draft', 'promptcraft_s2_babbage_draft_v1'],
      ['s2_review', 'promptcraft_s2_babbage_review', 'promptcraft_s2_babbage_review_v1'],
      ['s3_draft', 'promptcraft_s3_babbage_draft', 'promptcraft_s3_babbage_draft_v1'],
      ['s3_review', 'promptcraft_s3_babbage_review', 'promptcraft_s3_babbage_review_v1'],
      ['s3_evidence_analysis', 'promptcraft_s3_evidence_analysis', 'promptcraft_s3_evidence_analysis_v1'],
      ['s3_transfer_assessment', 'promptcraft_s3_transfer_assessment', 'promptcraft_s3_transfer_assessment_v1'],
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
      assert.equal(body.proxy_version, 'V372');
      assert.equal(lastPayload.text.format.name, expectedName);
      assert.equal(lastPayload.text.format.strict, true);
      assert.equal(lastPayload.model, 'gpt-5.6-terra');
    }

    console.log('PromptCraft Babbage structured proxy tests passed, including the active S1 evidence-analysis contract.');
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
