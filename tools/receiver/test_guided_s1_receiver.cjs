// Exercise the real receiver's pure view builder without Google services.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'../..');
function receiver(version){
 const filename=path.join(root,`apps-script/PromptCraft_Receiver_${version}_Start_With_Learning.js`);
 let source=fs.readFileSync(filename,'utf8');
 source=source.replace('return { doGet, doPost, initializeWorkbookNow,','return { buildScenarioTabData_, safeResearchRow_, doGet, doPost, initializeWorkbookNow,');
 const context=vm.createContext({console});vm.runInContext(source+'\nthis.testReceiver=PromptCraftReceiver;',context);
 return context.testReceiver;
}
const old=receiver('V94'),current=receiver('V95');
const event=(type,detail,time)=>({timestamp:time,participant:'test-participant',session:'test-session',scenario:1,eventType:type,duration:5,detail:{s1_learning_path_json:JSON.stringify(detail)}});
const events=[
 event('s1_learning_path_organized',{renamedTitles:['Read evidence'],organization:{reading:'prepare'},placementMatches:5,placementTotal:5},'2026-10-08T18:00:00Z'),
 event('s1_alignment_diagnosis_complete',{diagnosisChoice:'evidence-gap',diagnosisCorrect:true,diagnosisRationale:'Learning goal: Recommend a response.\nUse evidence.\nCurrent work: Recall terms.'},'2026-10-08T18:01:00Z'),
 event('s1_course_guide_complete',{transferReflection:'Activity: Recorded speech\nNext step: =Check the criteria.\nStudent work: Credible supporting evidence.',guideSaved:true,activityCount:4,feedbackSource:'fallback',aiRequestFailed:true},'2026-10-08T18:02:00Z')
];
const before=JSON.stringify(events);const data=current.buildScenarioTabData_(1,events,{});
const original=old.buildScenarioTabData_(1,events,{});
assert.strictEqual(data.headers.length,23);assert.strictEqual(data.rows[0].length,23);
assert.strictEqual(JSON.stringify(data.headers.slice(0,18)),JSON.stringify(original.headers));
assert.strictEqual(JSON.stringify(data.rows[0].slice(0,18)),JSON.stringify(original.rows[0]));
assert.strictEqual(JSON.stringify(data.rows[0].slice(18)),JSON.stringify(['Recommend a response.\nUse evidence.','Recall terms.','Recorded speech','=Check the criteria.','Credible supporting evidence.']));
assert.strictEqual(current.safeResearchRow_(data.rows[0])[21],"'=Check the criteria.");
assert.strictEqual(JSON.stringify(events),before,'View derivation must not mutate raw events');
const legacy=[event('s1_course_guide_complete',{diagnosisRationale:'I noticed an evidence gap.',transferReflection:'Check the final assignment.'},'2026-10-08T18:03:00Z')];
const legacyData=current.buildScenarioTabData_(1,legacy,{});
assert.strictEqual(legacyData.rows[0][12],'I noticed an evidence gap.');assert.strictEqual(legacyData.rows[0][15],'Check the final assignment.');assert(legacyData.rows[0].slice(18).every(x=>x===''));
for(const text of ['Activity: One activity only','Activity: First\nStudent work: Evidence\nNext step: Change']){
 const row=current.buildScenarioTabData_(1,[event('s1_course_guide_complete',{transferReflection:text},'2026-10-08T18:04:00Z')],{}).rows[0];assert.strictEqual(row[15],text);assert(row.slice(20).every(x=>x===''));
}
assert.strictEqual(current.buildScenarioTabData_(1,[],{}).headers.length,23);
for(let scenario=2;scenario<=8;scenario++)assert.strictEqual(JSON.stringify(current.buildScenarioTabData_(scenario,[],{})),JSON.stringify(old.buildScenarioTabData_(scenario,[],{})),'Other scenario views stay unchanged');
console.log('PASS: real V95 view builder, five guided columns, checkpoint merging, legacy/malformed responses, multiline values, original raw preservation, formula protection, unchanged other scenarios.');
